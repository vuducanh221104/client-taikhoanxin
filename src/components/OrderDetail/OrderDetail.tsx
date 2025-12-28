'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './OrderDetail.module.scss';
import { useOrder, getStatusLabel, getStatusColor, Order, OrderItem } from '@/services/orderService';
import { useMyWarranties } from '@/services/warrantyService';
import EmptyState from '@/components/EmptyState';
import { PackageIcon, CopyIcon, CheckIcon, ShoppingCartIcon, DownloadIcon, AlertCircleIcon } from '@/components/Icons';
import { useToast } from '@/components/Toast';
import { addToCart } from '@/redux/cartSlice';

const cx = classNames.bind(styles);

interface OrderDetailProps {
    orderCode: string;
    userId?: string;
    guestOrder?: Order | null;
    mode?: 'auth' | 'guest';
}

interface OrderProductViewModel {
    id: string;
    itemId?: string; // _id của order item để map với warranty
    productName: string;
    quantity: number;
    price: number;
    image?: string;
    imageSrc?: string;
    accountEntries?: string[]; // Lấy trực tiếp từ keys.entries, không parse
    accountDescription?: string; // Lấy từ keys.description
    help?: {
        text?: string;
        href?: string;
    };
    note?: string;
    itemStatus?: 'completed' | 'processing'; // Trạng thái riêng của từng sản phẩm
    warrantyStatus?: 'pending' | 'processing' | 'resolved' | 'rejected' | 'closed' | 'warranty_processing' | 'warranty_resolved' | 'warranty_rejected' | null; // Trạng thái warranty của item
}

interface OrderDetailViewModel {
    orderCode: string;
    orderDate: string;
    status: Order['orderStatus'];
    customerEmail: string;
    totalAmount: number;
    products: OrderProductViewModel[];
    itemsStatusInfo?: {
        completed: number;
        processing: number;
        total: number;
    };
}

const PRODUCT_IMAGE_FALLBACK = '/images/placeholder.png';

const normalizeProductRef = (product: OrderItem['productId'] | OrderItem['product_id']) => {
    if (!product) {
        return { id: '', name: '', image: '' };
    }

    if (typeof product === 'string') {
        return { id: product, name: '', image: '' };
    }

    return {
        id: product._id,
        name: product.name,
        image: product.image?.[0] || '',
    };
};

const mapOrderToViewModel = (apiOrder?: Order): OrderDetailViewModel | null => {
    if (!apiOrder) {
        return null;
    }

    const customerEmail =
        apiOrder.emailUserOrder ||
        (typeof apiOrder.userId === 'object' ? apiOrder.userId.email : '') ||
        apiOrder.emailGiftForFriend ||
        '';

    const products: OrderProductViewModel[] = apiOrder.items.map((item, index) => {
        const productRef = typeof item.productId === 'object' ? item.productId : item.product_id;
        const normalizedProduct = normalizeProductRef(productRef);
        
        // Lấy _id của item (order item có _id)
        const itemId = (item as any)._id?.toString();
        
        // Lấy trực tiếp từ keys.entries (array of strings), không parse
        const accountEntries = item.keys?.entries && Array.isArray(item.keys.entries) && item.keys.entries.length > 0
            ? item.keys.entries.filter((entry: string) => entry && entry.trim())
            : undefined;

        // Lấy description từ keys.description
        const accountDescription = item.keys?.description && item.keys.description.trim()
            ? item.keys.description.trim()
            : undefined;

        // Lấy help từ item.help - chỉ set khi có CẢ text VÀ href
        const help = item.help && item.help.text && item.help.text.trim() && item.help.href && item.help.href.trim() ? {
            text: item.help.text.trim(),
            href: item.help.href.trim(),
        } : undefined;

        // Lấy note từ item.note
        const note = item.note && item.note.trim() ? item.note.trim() : undefined;

        // Xác định trạng thái của từng sản phẩm: 'completed' nếu đã có account, 'processing' nếu chưa
        const itemStatus = accountEntries && accountEntries.length > 0 ? 'completed' : 'processing';

        return {
            id: normalizedProduct.id || `${apiOrder._id}-${index}`,
            itemId,
            productName: normalizedProduct.name || item.fullName || 'Sản phẩm',
            quantity: item.quantity,
            price: item.price,
            image: normalizedProduct.image,
            imageSrc: normalizedProduct.image,
            accountEntries,
            accountDescription,
            help,
            note,
            itemStatus,
            warrantyStatus: null, // Sẽ được set sau khi map với warranties
        };
    });

    // Tính toán trạng thái hiển thị dựa trên items thực tế
    // Nếu có cả items "đang xử lý" và "đã xử lý" → hiển thị "Đang xử lý"
    const itemsCompleted = products.filter(p => p.itemStatus === 'completed').length;
    const itemsProcessing = products.filter(p => p.itemStatus === 'processing').length;
    const totalItems = products.length;
    
    // Nếu có items đang xử lý → order status là "processing"
    // Chỉ hiển thị "completed" khi TẤT CẢ items đều đã xử lý
    let displayStatus = apiOrder.orderStatus;
    if (itemsProcessing > 0 && itemsCompleted > 0) {
        // Có cả 2 loại → hiển thị "Đang xử lý" với thông tin chi tiết
        displayStatus = 'processing';
    } else if (itemsCompleted === totalItems && totalItems > 0) {
        // Tất cả items đều đã xử lý → hiển thị "Đã xử lý"
        displayStatus = 'completed';
    } else if (itemsProcessing === totalItems && totalItems > 0) {
        // Tất cả items đều đang xử lý → hiển thị "Đang xử lý"
        displayStatus = 'processing';
    }

    return {
        orderCode: apiOrder.orderId?.toString() || '',
        orderDate: apiOrder.createdAt,
        status: displayStatus,
        customerEmail,
        totalAmount: apiOrder.totalPrice,
        products,
        // Thêm thông tin chi tiết về trạng thái items
        itemsStatusInfo: {
            completed: itemsCompleted,
            processing: itemsProcessing,
            total: totalItems,
        },
    };
};

const OrderDetail: React.FC<OrderDetailProps> = ({
    orderCode,
    userId: _userId,
    guestOrder,
    mode = 'auth',
}) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const shouldFetch = !guestOrder;
    const { data: orderResponse, error, isLoading } = useOrder(shouldFetch ? orderCode : null);
    const rawOrder = guestOrder ?? orderResponse?.data?.order;
    const order = useMemo(
        () => mapOrderToViewModel(rawOrder),
        [rawOrder]
    );
    
    // Fetch warranties for warranty progress display and item mapping
    const { data: warrantiesData } = useMyWarranties();
    
    // Map warranties to order items and calculate progress
    const { warrantyProgress, productsWithWarranty } = useMemo(() => {
        if (!warrantiesData?.data || !rawOrder?._id) {
            return { warrantyProgress: null, productsWithWarranty: order?.products || [] };
        }
        
        // Filter warranties for this order
        const orderWarranties = warrantiesData.data.filter(w => {
            const warrantyOrderId = typeof w.orderId === 'object' 
                ? w.orderId._id 
                : w.orderId;
            return warrantyOrderId === rawOrder._id;
        });
        
        if (orderWarranties.length === 0) {
            return { warrantyProgress: null, productsWithWarranty: order?.products || [] };
        }
        
        // Calculate warranty progress
        // Count warranties that are resolved (both old 'resolved' and new 'warranty_resolved')
        const total = orderWarranties.length;
        const resolved = orderWarranties.filter(w => {
            const status = w.status;
            // Count as resolved: warranty_resolved, resolved (old), closed (old)
            return status === 'warranty_resolved' || status === 'resolved' || status === 'closed';
        }).length;
        const warrantyProgress = { resolved, total };
        
        // Map warranties to products by itemOrderId
        const productsWithWarranty = (order?.products || []).map(product => {
            // Find warranty for this item
            const itemWarranty = orderWarranties.find(w => {
                if (!w.itemOrderId || !product.itemId) return false;
                const warrantyItemId = typeof w.itemOrderId === 'string' 
                    ? w.itemOrderId 
                    : String(w.itemOrderId);
                return warrantyItemId === product.itemId;
            });
            
            return {
                ...product,
                warrantyStatus: itemWarranty ? itemWarranty.status : null,
            };
        });
        
        return { warrantyProgress, productsWithWarranty };
    }, [warrantiesData, rawOrder?._id, order?.products]);
    
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [revealedFields, setRevealedFields] = useState<Set<string>>(new Set());
    const isGuestMode = mode === 'guest';

    if (isLoading && shouldFetch) {
        return (
            <div className={cx('empty-wrapper')}>
                <EmptyState
                    icon={<PackageIcon size={80} />}
                    title="Đang tải đơn hàng"
                    description="Vui lòng chờ trong giây lát..."
                />
            </div>
        );
    }

    if (error && shouldFetch) {
        return (
            <div className={cx('empty-wrapper')}>
                <EmptyState
                    icon={<PackageIcon size={80} />}
                    title="Không thể tải đơn hàng"
                    description="Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau."
                    actionLabel="Quay lại danh sách"
                    onAction={() => router.push('/account/orders')}
                />
            </div>
        );
    }

    if (!order) {
        return (
            <div className={cx('empty-wrapper')}>
                <EmptyState
                    icon={<PackageIcon size={80} />}
                    title="Không tìm thấy đơn hàng"
                    description="Đơn hàng không tồn tại hoặc bạn không có quyền truy cập."
                    actionLabel="Quay lại danh sách"
                    onAction={() => router.push('/account/orders')}
                />
            </div>
        );
    }

    const formatPrice = (amount: number): string => {
        return amount.toLocaleString('vi-VN') + 'đ';
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const handleReveal = (fieldName: string) => {
        setRevealedFields(prev => {
            const newSet = new Set(prev);
            newSet.add(fieldName);
            return newSet;
        });
    };

    const handleCopy = async (text: string, fieldName: string) => {
        try {
            // Reveal first if not already revealed
            if (!revealedFields.has(fieldName)) {
                handleReveal(fieldName);
            }
            
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            showToast('Đã sao chép vào clipboard', 'success');
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            showToast('Không thể sao chép', 'error');
        }
    };

    const handleReorder = () => {
        if (isGuestMode) {
            showToast('Vui lòng đăng nhập để mua lại đơn hàng này', 'info');
            router.push('/auth/login');
            return;
        }
        if (!order) return;

        // Add all products from order to cart
        order.products.forEach((product) => {
            for (let i = 0; i < product.quantity; i++) {
                dispatch(addToCart({
                    id: product.id,
                    productName: product.productName,
                    price: product.price,
                    imageSrc: product.image || product.imageSrc || PRODUCT_IMAGE_FALLBACK,
                    imageAlt: product.productName,
                    href: `/product/${product.id}`,
                }));
            }
        });

        showToast(`Đã thêm ${order.products.length} sản phẩm vào giỏ hàng`, 'success');
        router.push('/cart');
    };

    const handleExportReceipt = () => {
        if (!order) return;
        
        // Create receipt content
        const receiptContent = `
===========================================
            BIÊN LAI ĐƠN HÀNG
===========================================

Mã đơn hàng: #${order.orderCode}
Ngày tạo: ${formatDateTime(order.orderDate)}
Trạng thái: ${getStatusLabel(order.status)}
Người nhận: ${order.customerEmail}

-------------------------------------------
            SẢN PHẨM
-------------------------------------------

${order.products.map((product, index) => `
${index + 1}. ${product.productName}
   Số lượng: ${product.quantity}
   Đơn giá: ${formatPrice(product.price)}
   Thành tiền: ${formatPrice(product.price * product.quantity)}
`).join('\n')}

-------------------------------------------
Tổng giá trị: ${formatPrice(order.totalAmount)}
-------------------------------------------

Cảm ơn bạn đã mua hàng tại Tài Khoản Xịn!
Website: taikhoanxin.com
Email: support@taikhoanxin.com

===========================================
        `;

        // Create and download file
        const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bien-lai-${order.orderCode}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('Đã xuất biên lai thành công', 'success');
    };

    return (
        <div className={cx('order-detail')}>
            {/* Header */}
            <div className={cx('order-header')}>
                <div className={cx('header-left')}>
                    <h1 className={cx('order-title')}>Chi tiết đơn hàng #{order.orderCode}</h1>
                    <p className={cx('order-subtitle')}>
                        Hiển thị thông tin các sản phẩm bạn đã mua tại Tài Khoản Xịn
                    </p>
                </div>
                {!isGuestMode && (
                    <div className={cx('header-actions')}>
                        <button className={cx('reorder-button')} onClick={handleReorder}>
                            <ShoppingCartIcon size={18} />
                            Mua lại đơn hàng
                        </button>
                        <button className={cx('export-button')} onClick={handleExportReceipt}>
                            <DownloadIcon size={18} />
                            Xuất biên lai
                        </button>
                    </div>
                )}
            </div>

            {/* {isGuestMode && (
                <div className={cx('guest-warning')}>
                    <AlertCircleIcon size={18} />
                    <div>
                        <strong>Thông tin đơn hàng chỉ hiển thị 1 lần.</strong>
                        <p>Vui lòng lưu hoặc sao chép ngay để tránh mất quyền truy cập.</p>
                    </div>
                </div>
            )} */}

            {/* Order Info Section */}
            <div className={cx('order-info-section')}>
                <div className={cx('info-column')}>
                    <h2 className={cx('section-title')}>Thông tin đơn hàng</h2>
                    <div className={cx('info-list')}>
                        <div className={cx('info-item')}>
                            <span className={cx('info-label')}>Mã đơn hàng:</span>
                            <span className={cx('info-value')}>#{order.orderCode}</span>
                        </div>
                        <div className={cx('info-item')}>
                            <span className={cx('info-label')}>Ngày tạo:</span>
                            <span className={cx('info-value')}>{formatDateTime(order.orderDate)}</span>
                        </div>
                        <div className={cx('info-item')}>
                            <span className={cx('info-label')}>Trạng thái đơn hàng:</span>
                            <span className={cx('status-badge', getStatusColor(order.status))}>
                                {getStatusLabel(order.status)}
                                {order.itemsStatusInfo && 
                                 order.itemsStatusInfo.completed > 0 && 
                                 order.itemsStatusInfo.processing > 0 && (
                                    <span className={cx('status-detail')}>
                                        {' '}({order.itemsStatusInfo.completed}/{order.itemsStatusInfo.total} đã xử lý)
                                    </span>
                                )}
                                {warrantyProgress && warrantyProgress.total > 0 && (
                                    <span className={cx('status-detail', 'warranty-progress')}>
                                        {' '}({warrantyProgress.resolved}/{warrantyProgress.total} đã bảo hành)
                                    </span>
                                )}
                            </span>
                        </div>
                        <div className={cx('info-item')}>
                            <span className={cx('info-label')}>Người nhận:</span>
                            <span className={cx('info-value')}>{order.customerEmail}</span>
                        </div>
                    </div>
                </div>

                <div className={cx('info-column')}>
                    <h2 className={cx('section-title')}>Giá trị đơn hàng</h2>
                    <div className={cx('info-list')}>
                        <div className={cx('info-item')}>
                            <span className={cx('info-label')}>Tổng giá trị sản phẩm</span>
                            <span className={cx('info-value', 'price')}>{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className={cx('products-section')}>
                {productsWithWarranty.map((product) => (
                    <div key={product.id} className={cx('product-card')}>
                        <div className={cx('product-main')}>
                            <div className={cx('product-image-wrapper')}>
                                <Image
                                    src={product.image || '/images/placeholder.png'}
                                    alt={product.productName}
                                    width={200}
                                    height={120}
                                    className={cx('product-image')}
                                />
                            </div>

                            <div className={cx('product-info')}>
                                <div className={cx('product-details')}>
                                    <h3 className={cx('product-name')}>{product.productName}</h3>
                                    <span className={cx('product-quantity')}>Số lượng: {product.quantity}</span>
                                    {/* Hiển thị trạng thái riêng cho từng sản phẩm */}
                                    <div className={cx('product-status-group')}>
                                        {/* Nếu có warranty, ưu tiên hiển thị trạng thái warranty */}
                                        {product.warrantyStatus ? (
                                            <span className={cx('product-warranty-status', {
                                                'warranty-pending': product.warrantyStatus === 'pending',
                                                'warranty-processing': product.warrantyStatus === 'processing' || product.warrantyStatus === 'warranty_processing',
                                                'warranty-resolved': product.warrantyStatus === 'resolved' || product.warrantyStatus === 'warranty_resolved',
                                                'warranty-rejected': product.warrantyStatus === 'rejected' || product.warrantyStatus === 'warranty_rejected',
                                                'warranty-closed': product.warrantyStatus === 'closed',
                                            })}>
                                                {(product.warrantyStatus === 'pending' || product.warrantyStatus === null) && '🔄 Đang bảo hành (chờ xử lý)'}
                                                {(product.warrantyStatus === 'processing' || product.warrantyStatus === 'warranty_processing') && '⚙️ Đang bảo hành (đang xử lý)'}
                                                {(product.warrantyStatus === 'resolved' || product.warrantyStatus === 'warranty_resolved') && '✅ Đã bảo hành (đã xử lý)'}
                                                {(product.warrantyStatus === 'rejected' || product.warrantyStatus === 'warranty_rejected') && '❌ Từ chối bảo hành'}
                                                {product.warrantyStatus === 'closed' && '✅ Đã bảo hành (hoàn tất)'}
                                            </span>
                                        ) : (
                                            <span className={cx('product-item-status', {
                                                'status-completed': product.itemStatus === 'completed',
                                                'status-processing': product.itemStatus === 'processing'
                                            })}>
                                                {product.itemStatus === 'completed' ? '✓ Đã xử lý' : '⏳ Đang xử lý'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className={cx('product-price')}>{formatPrice(product.price)}</span>
                            </div>
                        </div>

                        {/* Account Info - Show for items that have been processed (have account) */}
                        {product.itemStatus === 'completed' && product.accountEntries && product.accountEntries.length > 0 && (
                                <div className={cx('account-info')}>
                                    <div className={cx('account-title-row')}>
                                        <div>
                                            <h4 className={cx('account-title')}>
                                                {product.accountDescription || 'Thông tin tài khoản'}
                                            </h4>
                                            <p className={cx('account-description')}>
                                                Nhấn vào nội dung để copy nhanh thông tin đăng nhập
                                            </p>
                                        </div>
                                    </div>
                                    {product.accountEntries.map((entry, index) => (
                                        <div key={index} className={cx('account-item')}>
                                            <div className={cx('account-field-single')}>
                                                <button
                                                    className={cx('copy-icon-button')}
                                                    onClick={() => {
                                                        handleCopy(entry, `entry-${product.id}-${index}`);
                                                    }}
                                                    title="Click để copy toàn bộ"
                                                >
                                                    <CopyIcon size={24} className={cx('copy-icon-main')} />
                                                </button>
                                                <div className={cx('account-credentials')}>
                                                    <span 
                                                        className={cx('credential-value', 'clickable', {
                                                            'blurred': !revealedFields.has(`entry-${product.id}-${index}`)
                                                        })}
                                                        onClick={() => handleCopy(entry, `entry-${product.id}-${index}`)}
                                                        title="Click để copy"
                                                    >
                                                        {entry}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className={cx('copy-hint')}>
                                        <span className={cx('hint-icon')}>ⓘ</span>
                                        <span>Click vào text để copy.</span>
                                    </div>

                                    {/* Chỉ hiển thị note khi có value và đã có account được gán */}
                                    {product.note && 
                                     product.note.trim() && 
                                     product.accountEntries && 
                                     product.accountEntries.length > 0 && (
                                        <div className={cx('product-note')}>
                                            <AlertCircleIcon size={20} className={cx('note-icon')} />
                                            <span className={cx('note-text')}>{product.note}</span>
                                        </div>
                                    )}
                                </div>
                        )}

                        {/* Help Button - Chỉ hiển thị khi có CẢ text VÀ href và đã có account được gán */}
                        {product.itemStatus === 'completed' && 
                         product.help && 
                         product.help.text && 
                         product.help.text.trim() && 
                         product.help.href && 
                         product.help.href.trim() && 
                         product.accountEntries && 
                         product.accountEntries.length > 0 && (
                            <div className={cx('help-button-wrapper')}>
                                <a
                                    href={product.help.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cx('login-button')}
                                >
                                    {product.help.text}
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderDetail;

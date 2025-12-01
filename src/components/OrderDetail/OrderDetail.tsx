'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './OrderDetail.module.scss';
import { useOrder, getStatusLabel, getStatusColor, Order, OrderItem } from '@/services/orderService';
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
}

interface OrderDetailViewModel {
    orderCode: string;
    orderDate: string;
    status: Order['orderStatus'];
    customerEmail: string;
    totalAmount: number;
    products: OrderProductViewModel[];
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
        
        // Lấy trực tiếp từ keys.entries (array of strings), không parse
        const accountEntries = item.keys?.entries && Array.isArray(item.keys.entries) && item.keys.entries.length > 0
            ? item.keys.entries.filter((entry: string) => entry && entry.trim())
            : undefined;

        // Lấy description từ keys.description
        const accountDescription = item.keys?.description && item.keys.description.trim()
            ? item.keys.description.trim()
            : undefined;

        // Lấy help từ item.help
        const help = item.help && (item.help.text || item.help.href) ? {
            text: item.help.text || 'Hướng dẫn đăng nhập',
            href: item.help.href || '',
        } : undefined;

        // Lấy note từ item.note
        const note = item.note && item.note.trim() ? item.note.trim() : undefined;

        return {
            id: normalizedProduct.id || `${apiOrder._id}-${index}`,
            productName: normalizedProduct.name || item.fullName || 'Sản phẩm',
            quantity: item.quantity,
            price: item.price,
            image: normalizedProduct.image,
            imageSrc: normalizedProduct.image,
            accountEntries,
            accountDescription,
            help,
            note,
        };
    });

    return {
        orderCode: apiOrder.orderId?.toString() || '',
        orderDate: apiOrder.createdAt,
        status: apiOrder.orderStatus,
        customerEmail,
        totalAmount: apiOrder.totalPrice,
        products,
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
                {order.products.map((product) => (
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
                                </div>
                                <span className={cx('product-price')}>{formatPrice(product.price)}</span>
                            </div>
                        </div>

                        {/* Account Info - Only show for completed orders */}
                        {['completed', 'warranty_completed'].includes(order.status) && product.accountEntries && product.accountEntries.length > 0 && (
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

                                    {product.note && (
                                        <div className={cx('product-note')}>
                                            <AlertCircleIcon size={20} className={cx('note-icon')} />
                                            <span className={cx('note-text')}>{product.note}</span>
                                        </div>
                                    )}
                                </div>
                        )}

                        {/* Help Button - Dynamic from DB */}
                        {['completed', 'warranty_completed'].includes(order.status) && product.help && product.help.href && (
                            <div className={cx('help-button-wrapper')}>
                                <a
                                    href={product.help.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cx('login-button')}
                                >
                                    {product.help.text || 'Hướng dẫn đăng nhập'}
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

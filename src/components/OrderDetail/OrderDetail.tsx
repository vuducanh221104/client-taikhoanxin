'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './OrderDetail.module.scss';
import { getOrderByCode, getStatusLabel, getStatusColor } from '@/services/orderService';
import EmptyState from '@/components/EmptyState';
import { PackageIcon, CopyIcon, CheckIcon, ShoppingCartIcon, DownloadIcon } from '@/components/Icons';
import { useToast } from '@/components/Toast';
import { addToCart } from '@/redux/cartSlice';

const cx = classNames.bind(styles);

interface OrderDetailProps {
    orderCode: string;
    userId: string;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ orderCode, userId }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { showToast } = useToast();
    const order = getOrderByCode(orderCode, userId);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [revealedFields, setRevealedFields] = useState<Set<string>>(new Set());

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
        if (!order) return;

        // Add all products from order to cart
        order.products.forEach((product) => {
            for (let i = 0; i < product.quantity; i++) {
                dispatch(addToCart({
                    id: product.id,
                    productName: product.productName,
                    price: product.price,
                    imageSrc: product.image || product.imageSrc,
                    imageAlt: product.productName,
                    href: `/products/${product.id}`,
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
                <div className={cx('header-actions')}>
                    <button className={cx('export-button')} onClick={handleExportReceipt}>
                        <DownloadIcon size={18} />
                        Xuất biên lai
                    </button>
                    <button className={cx('reorder-button')} onClick={handleReorder}>
                        <ShoppingCartIcon size={18} />
                        Mua lại đơn hàng
                    </button>
                </div>
            </div>

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
                        {order.status === 'completed' && (product.accounts || product.accountInfo) && (
                                <div className={cx('account-info')}>
                                    <h4 className={cx('account-title')}>Thông tin tài khoản</h4>
                                    
                                    {product.accounts ? (
                                        // Multiple accounts
                                        product.accounts.map((account, index) => (
                                            <div key={index} className={cx('account-item')}>
                                                <div className={cx('account-field-single')}>
                                                    <button
                                                        className={cx('copy-icon-button')}
                                                        onClick={() => {
                                                            const allText = `Tài khoản: ${account.username} || Mật khẩu: ${account.password}`;
                                                            handleCopy(allText, `all-${product.id}-${index}`);
                                                        }}
                                                        title="Click để copy tất cả"
                                                    >
                                                        <CopyIcon size={24} className={cx('copy-icon-main')} />
                                                    </button>
                                                    <div className={cx('account-credentials')}>
                                                        <span className={cx('credential-text')}>
                                                            Tài khoản:{' '}
                                                            <span 
                                                                className={cx('credential-value', 'clickable', {
                                                                    'blurred': !revealedFields.has(`username-${product.id}-${index}`)
                                                                })}
                                                                onClick={() => handleCopy(account.username, `username-${product.id}-${index}`)}
                                                                title="Click để copy"
                                                            >
                                                                {account.username}
                                                            </span>
                                                        </span>
                                                        <span className={cx('credential-separator')}>||</span>
                                                        <span className={cx('credential-text')}>
                                                            Mật khẩu:{' '}
                                                            <span 
                                                                className={cx('credential-value', 'clickable', {
                                                                    'blurred': !revealedFields.has(`password-${product.id}-${index}`)
                                                                })}
                                                                onClick={() => handleCopy(account.password, `password-${product.id}-${index}`)}
                                                                title="Click để copy"
                                                            >
                                                                {account.password}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Single account
                                        <div className={cx('account-field-single')}>
                                            <button
                                                className={cx('copy-icon-button')}
                                                onClick={() => {
                                                    const allText = `Tài khoản: ${product.accountInfo!.username} || Mật khẩu: ${product.accountInfo!.password}`;
                                                    handleCopy(allText, `all-${product.id}`);
                                                }}
                                                title="Click để copy tất cả"
                                            >
                                                <CopyIcon size={24} className={cx('copy-icon-main')} />
                                            </button>
                                            <div className={cx('account-credentials')}>
                                                <span className={cx('credential-text')}>
                                                    Tài khoản:{' '}
                                                    <span 
                                                        className={cx('credential-value', 'clickable', {
                                                            'blurred': !revealedFields.has(`username-${product.id}`)
                                                        })}
                                                        onClick={() => handleCopy(product.accountInfo!.username, `username-${product.id}`)}
                                                        title="Click để copy"
                                                    >
                                                        {product.accountInfo!.username}
                                                    </span>
                                                </span>
                                                <span className={cx('credential-separator')}>||</span>
                                                <span className={cx('credential-text')}>
                                                    Mật khẩu:{' '}
                                                    <span 
                                                        className={cx('credential-value', 'clickable', {
                                                            'blurred': !revealedFields.has(`password-${product.id}`)
                                                        })}
                                                        onClick={() => handleCopy(product.accountInfo!.password, `password-${product.id}`)}
                                                        title="Click để copy"
                                                    >
                                                        {product.accountInfo!.password}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className={cx('copy-hint')}>
                                        <span className={cx('hint-icon')}>ⓘ</span>
                                        <span>Click vào text để copy từng phần.</span>
                                    </div>

                                    {(product.accountInfo?.loginUrl || product.accounts?.[0]?.loginUrl) && (
                                        <a
                                            href={product.accountInfo?.loginUrl || product.accounts?.[0]?.loginUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cx('login-button')}
                                        >
                                            Đăng nhập {product.productName.split(' ')[0]}
                                        </a>
                                    )}
                                </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderDetail;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { MinusIcon, PlusIcon, XIcon, ShoppingBagIcon, TrashIcon } from '@/components/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { removeFromCart, updateQuantity, applyCoupon, removeCoupon, clearCart } from '@/redux/cartSlice';
import EmptyState from '@/components/EmptyState';
import mockCouponsData from '@/data/mockCoupons.json';
import { useConfirm } from '@/components/ConfirmDialog';

const cx = classNames.bind(styles);

interface Coupon {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
    description: string;
    minOrderValue: number;
    maxDiscount: number | null;
    expiryDate: string;
    usageLimit: number | null;
    isActive: boolean;
}

// Mock coupon validation - In production, this would be an API call
const validateCoupon = (code: string, orderTotal: number): { valid: boolean; discount: number; discountAmount: number; message: string } => {
    const coupon = mockCouponsData.coupons.find(
        (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive
    ) as Coupon | undefined;
    
    if (!coupon) {
        return {
            valid: false,
            discount: 0,
            discountAmount: 0,
            message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn',
        };
    }
    
    // Check expiry date
    const expiryDate = new Date(coupon.expiryDate);
    const today = new Date();
    if (expiryDate < today) {
        return {
            valid: false,
            discount: 0,
            discountAmount: 0,
            message: 'Mã giảm giá đã hết hạn',
        };
    }
    
    // Check minimum order value
    if (orderTotal < coupon.minOrderValue) {
        return {
            valid: false,
            discount: 0,
            discountAmount: 0,
            message: `Đơn hàng tối thiểu ${coupon.minOrderValue.toLocaleString('vi-VN')}₫`,
        };
    }
    
    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
        discountAmount = Math.round((orderTotal * coupon.discount) / 100);
        // Apply max discount if exists
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }
    } else {
        // Fixed discount
        discountAmount = coupon.discount;
    }
    
    return {
        valid: true,
        discount: coupon.discount,
        discountAmount,
        message: coupon.description,
    };
};

const CartPage: React.FC = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart);
    const { confirm } = useConfirm();
    
    const [couponInput, setCouponInput] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');

    const formatPrice = (value: number): string => value.toLocaleString('vi-VN');

    const handleRemove = (id: string) => {
        dispatch(removeFromCart(id));
    };

    const handleIncrease = (id: string, qty: number) => {
        dispatch(updateQuantity({ id, quantity: qty + 1 }));
    };

    const handleDecrease = (id: string, qty: number) => {
        if (qty > 1) {
            dispatch(updateQuantity({ id, quantity: qty - 1 }));
        }
    };
    
    const handleApplyCoupon = () => {
        if (!couponInput.trim()) {
            setCouponError('Vui lòng nhập mã giảm giá');
            setCouponSuccess('');
            return;
        }
        
        const result = validateCoupon(couponInput, cart.totalPrice);
        
        if (result.valid) {
            dispatch(applyCoupon({ code: couponInput.toUpperCase(), discount: result.discountAmount }));
            
            setCouponSuccess(result.message);
            setCouponError('');
            setCouponInput('');
        } else {
            setCouponError(result.message);
            setCouponSuccess('');
        }
    };
    
    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        setCouponSuccess('');
        setCouponError('');
    };
    
    // Calculate totals
    const subtotal = cart.totalPrice;
    const discount = cart.couponDiscount;
    const total = subtotal - discount;

    return (
        <div className={cx('cart-page')}>
            <div className="container">
                <div className={cx('breadcrumb')}>
                    <span className={cx('current')}>Giỏ hàng</span>
                    <span className={cx('sep')}>→</span>
                    <span>Thanh toán</span>
                    <span className={cx('sep')}>→</span>
                    <span>Hoàn thành</span>
                </div>

                <div className={cx('grid')}>
                    <div className={cx('cart-left')}>
                        {cart.products.length >= 3 && (
                            <div className={cx('clear-all-wrapper')}>
                                <button
                                    type="button"
                                    className={cx('clear-all-button')}
                                    onClick={async () => {
                                        const confirmed = await confirm({
                                            title: 'Xóa tất cả sản phẩm',
                                            message: 'Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?',
                                            variant: 'danger',
                                            confirmText: 'Xóa tất cả',
                                            cancelText: 'Hủy',
                                        });
                                        
                                        if (confirmed) {
                                            dispatch(clearCart());
                                        }
                                    }}
                                >
                                    <TrashIcon size={16} />
                                    Xóa tất cả
                                </button>
                            </div>
                        )}
                        <div className={cx('table')}>
                            <div className={cx('thead')}>
                                <div className={cx('th', 'product')}>Sản phẩm</div>
                                <div className={cx('th', 'price')}>Giá</div>
                                <div className={cx('th', 'qty')}>Số lượng</div>
                                <div className={cx('th', 'subtotal')}>Tạm tính</div>
                            </div>

                            <div className={cx('tbody')}>
                                {cart.products.length === 0 ? (
                                    <div className={cx('empty-cart-wrapper')}>
                                        <EmptyState
                                            type="cart"
                                            icon={<ShoppingBagIcon size={80} />}
                                            title="Giỏ hàng trống"
                                            description="Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!"
                                            actionLabel="Tiếp tục mua sắm"
                                            actionHref="/products"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table Layout */}
                                        {cart.products.map((p) => {
                                            const subtotal = p.price * p.quantity;
                                            return (
                                                <div className={cx('tr')} key={p.id}>
                                                    <div className={cx('td', 'product')}>
                                                        <button
                                                            className={cx('remove')}
                                                            onClick={() => handleRemove(p.id)}
                                                            aria-label="Xóa sản phẩm"
                                                            type="button"
                                                        >
                                                            <XIcon size={18} />
                                                        </button>
                                                        {p.imageSrc ? (
                                                            <div className={cx('thumb')}>
                                                                <Link href={p.href || '#'}>
                                                                    <Image
                                                                        src={p.imageSrc}
                                                                        alt={p.imageAlt || p.productName}
                                                                        width={80}
                                                                        height={54}
                                                                        className={cx('thumb-image')}
                                                                    />
                                                                </Link>
                                                            </div>
                                                        ) : (
                                                            <div className={cx('placeholder')} />
                                                        )}
                                                        <Link href={p.href || '#'} className={cx('name')}>
                                                            {p.productName}
                                                        </Link>
                                                    </div>
                                                    <div className={cx('td', 'price')}>
                                                        {formatPrice(p.price)}₫
                                                    </div>
                                                    <div className={cx('td', 'qty')}>
                                                        <button
                                                            className={cx('qty-btn')}
                                                            onClick={() => handleDecrease(p.id, p.quantity)}
                                                            disabled={p.quantity <= 1}
                                                            type="button"
                                                            aria-label="Giảm số lượng"
                                                        >
                                                            <MinusIcon size={14} />
                                                        </button>
                                                        <span className={cx('qty-value')}>{p.quantity}</span>
                                                        <button
                                                            className={cx('qty-btn')}
                                                            onClick={() => handleIncrease(p.id, p.quantity)}
                                                            type="button"
                                                            aria-label="Tăng số lượng"
                                                        >
                                                            <PlusIcon size={14} />
                                                        </button>
                                                    </div>
                                                    <div className={cx('td', 'subtotal')}>
                                                        {formatPrice(subtotal)}₫
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        
                                        {/* Mobile Card Layout */}
                                        {cart.products.map((p) => {
                                        const discountPercent = p.oldPrice && p.oldPrice > p.price 
                                            ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                                            : 0;
                                        const stockStatus = 'in-stock'; // Default, có thể lấy từ product data
                                        
                                        return (
                                            <div className={cx('cart-item-card')} key={`mobile-${p.id}`}>
                                                {/* Product Banner/Image */}
                                                {p.imageSrc && (
                                                    <div className={cx('cart-item-banner')}>
                                                        <Link href={p.href || '#'}>
                                                            <Image
                                                                src={p.imageSrc}
                                                                alt={p.imageAlt || p.productName}
                                                                width={400}
                                                                height={200}
                                                                className={cx('banner-image')}
                                                                loading="lazy"
                                                            />
                                                        </Link>
                                                    </div>
                                                )}
                                                
                                                {/* Product Info */}
                                                <div className={cx('cart-item-info')}>
                                                    {/* Product Name */}
                                                    <Link href={p.href || '#'} className={cx('cart-item-name')}>
                                                        <h3>{p.productName}</h3>
                                                    </Link>
                                                    
                                                    {/* Price Section */}
                                                    <div className={cx('cart-item-price-section')}>
                                                        <div className={cx('price-wrapper')}>
                                                            <span className={cx('current-price')}>
                                                                {formatPrice(p.price)}₫
                                                            </span>
                                                            {p.oldPrice && p.oldPrice > p.price && (
                                                                <>
                                                                    <span className={cx('old-price')}>
                                                                        {formatPrice(p.oldPrice)}₫
                                                                    </span>
                                                                    {discountPercent > 0 && (
                                                                        <span className={cx('discount-badge')}>
                                                                            -{discountPercent}%
                                                                        </span>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Quantity and Actions */}
                                                    <div className={cx('cart-item-actions')}>
                                                        <div className={cx('quantity-section')}>
                                                            <span className={cx('quantity-label')}>Số lượng:</span>
                                                            <div className={cx('quantity-controls')}>
                                                                <button
                                                                    className={cx('qty-btn', 'qty-minus')}
                                                                    onClick={() => handleDecrease(p.id, p.quantity)}
                                                                    disabled={p.quantity <= 1}
                                                                    type="button"
                                                                    aria-label="Giảm số lượng"
                                                                >
                                                                    <MinusIcon size={16} />
                                                                </button>
                                                                <span className={cx('qty-value')}>{p.quantity}</span>
                                                                <button
                                                                    className={cx('qty-btn', 'qty-plus')}
                                                                    onClick={() => handleIncrease(p.id, p.quantity)}
                                                                    type="button"
                                                                    aria-label="Tăng số lượng"
                                                                >
                                                                    <PlusIcon size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Stock Status and Delete */}
                                                        <div className={cx('cart-item-footer')}>
                                                            <div className={cx('stock-status')}>
                                                                <span className={cx('stock-icon')}>📦</span>
                                                                <span className={cx('stock-text')}>
                                                                    Tình trạng: <span className={cx('stock-value', stockStatus)}>
                                                                        {stockStatus === 'in-stock' ? 'Còn hàng' : 'Hết hàng'}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <button
                                                                className={cx('delete-btn')}
                                                                onClick={() => handleRemove(p.id)}
                                                                aria-label="Xóa sản phẩm"
                                                                type="button"
                                                            >
                                                                <TrashIcon size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                        })}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={cx('cart-right')}>
                        <div className={cx('summary')}>
                            <h3 className={cx('summary-title')}>Tóm tắt đơn hàng</h3>
                            
                            {/* Subtotal */}
                            <div className={cx('summary-row')}>
                                <span>Tạm tính ({cart.totalQuantity} sản phẩm)</span>
                                <strong>{formatPrice(subtotal)}₫</strong>
                            </div>
                            
                            {/* Coupon Section */}
                            {cart.products.length > 0 && (
                                <div className={cx('coupon-section')}>
                                    {!cart.couponCode ? (
                                        <>
                                            <div className={cx('coupon-input-wrapper')}>
                                                <input 
                                                    className={cx('coupon-input', { error: couponError })} 
                                                    placeholder="Nhập mã giảm giá" 
                                                    value={couponInput}
                                                    onChange={(e) => setCouponInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                                />
                                                <button 
                                                    className={cx('coupon-apply')} 
                                                    type="button"
                                                    onClick={handleApplyCoupon}
                                                >
                                                    Áp dụng
                                                </button>
                                            </div>
                                            {couponError && (
                                                <div className={cx('coupon-message', 'error')}>
                                                    {couponError}
                                                </div>
                                            )}
                                            {couponSuccess && (
                                                <div className={cx('coupon-message', 'success')}>
                                                    ✓ {couponSuccess}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className={cx('coupon-applied')}>
                                            <div className={cx('coupon-info')}>
                                                <span className={cx('coupon-code')}>🎉 {cart.couponCode}</span>
                                                <button 
                                                    className={cx('coupon-remove')}
                                                    onClick={handleRemoveCoupon}
                                                    type="button"
                                                    aria-label="Xóa mã giảm giá"
                                                >
                                                    <XIcon size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Discount */}
                            {discount > 0 && (
                                <div className={cx('summary-row', 'discount')}>
                                    <span>Giảm giá</span>
                                    <strong className={cx('discount-amount')}>-{formatPrice(discount)}₫</strong>
                                </div>
                            )}
                            
                            {/* Total */}
                            <div className={cx('summary-divider')} />
                            <div className={cx('summary-total')}>
                                <span>Tổng cộng</span>
                                <strong className={cx('total-amount')}>{formatPrice(total)}₫</strong>
                            </div>
                            
                            {/* Checkout Button */}
                            <Link
                                href="/checkout"
                                className={cx('checkout-btn', { disabled: cart.products.length === 0 })}
                                aria-disabled={cart.products.length === 0}
                                onClick={(e) => {
                                    if (cart.products.length === 0) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                Tiến hành thanh toán
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;




'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/checkout/page.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProgressIndicator, { Step } from '@/components/ProgressIndicator';
import { useCart, checkout } from '@/services/cartService';
import { useToast } from '@/hooks/useToast';
import { clearCart, removeCoupon } from '@/redux/cartSlice';
import { clearDiscountCode } from '@/redux/authSlice';
import { createGuestOrder } from '@/services/orderService';

const cx = classNames.bind(styles);

interface FormErrors {
    fullName?: string;
    phone?: string;
    email?: string;
}

interface PaymentMethod {
    id: string;
    icon?: React.ReactNode;
    iconImage?: string;
    title: string;
    description: string;
    fee: string;
}

const paymentMethods: PaymentMethod[] = [
    {
        id: 'qr-bank-transfer',
        iconImage: '/payment/vietQR.png',
        title: 'Chuyển khoản ngân hàng',
        description: 'Quét mã QR chuyển khoản online. Phí 0%',
        fee: '0%',
    },
];

const CheckoutLayout: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const reduxCart = useSelector((state: RootState) => state.cart);
    const router = useRouter();
    const { showSuccess, showError } = useToast();
    const [mounted, setMounted] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        note: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('qr-bank-transfer');
    // Lưu giá cart trước khi submit để giữ nguyên khi đang xử lý
    const savedCartRef = useRef<any>(null);

    const { data: cartData, error: cartError, isLoading: cartLoading, mutate: mutateCart } = useCart();
    const isLoggedIn = Boolean(currentUser?.accessToken);

    useEffect(() => {
        setMounted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (currentUser && mounted) {
            setForm((prev) => ({
                ...prev,
                fullName: (currentUser as any).full_name || (currentUser as any).fullName || prev.fullName,
                phone: (currentUser as any).phone_number || (currentUser as any).phone || prev.phone,
                email: currentUser.email || prev.email,
            }));
        }
    }, [currentUser, mounted]);

    const cart = useMemo(() => {
        if (isLoggedIn && cartData?.data) {
            const apiCart = cartData.data as any;
            const items = apiCart.items || [];
            const mappedProducts = items.map((item: any) => {
                const product = item.productId || item.product_id;
                const productId = product?._id || product?.id || '';
                const productName = product?.name || '';

                // Use unitPrice from cart item (already calculated as priceDiscount if available)
                // This is the final price that was stored when adding to cart
                let price = item.unitPrice || 0;

                // If unitPrice is not available, calculate from product.price
                if (!price && product?.price) {
                    if (Array.isArray(product.price)) {
                        const priceItem = product.price[0];
                        const priceOriginal = priceItem?.priceOriginal || priceItem?.original || 0;
                        const discount = priceItem?.discount;
                        
                        // Only use priceDiscount if it's valid (> 0 and < priceOriginal)
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal;
                        
                        price = hasValidDiscount
                            ? discount.priceDiscount
                            : priceOriginal;
                    } else if (typeof product.price === 'object') {
                        const priceOriginal = product.price.priceOriginal || product.price.original || 0;
                        const discount = product.price.discount;
                        
                        // Only use priceDiscount if it's valid (> 0 and < priceOriginal)
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal;
                        
                        price = hasValidDiscount
                            ? discount.priceDiscount
                            : priceOriginal;
                    }
                }

                const itemOptions = Array.isArray(item.options) ? item.options : [];

                return {
                    id: productId,
                    productName,
                    price,
                    quantity: item.quantity || 1,
                    options: itemOptions,
                };
            });

            // Calculate totalDiscountBefore from products if not provided by API
            const calculatedSubtotal = mappedProducts.reduce((sum: number, p: { price: number; quantity: number }) => sum + (p.price * p.quantity), 0);
            const totalDiscountBefore = apiCart.totalDiscountBefore ?? calculatedSubtotal;

            return {
                products: mappedProducts,
                // totalDiscountBefore is the subtotal before discount
                totalDiscountBefore,
                // totalPrice is the final price after discount code (already calculated: totalDiscountBefore - discountAmount)
                totalPrice:
                    apiCart.totalPrice !== undefined && apiCart.totalPrice !== null
                        ? apiCart.totalPrice
                        : totalDiscountBefore,
                totalQuantity: apiCart.quantity || 0,
                couponCode: apiCart.discountCode || undefined,
                couponDiscount: apiCart.discountAmount || apiCart.totalDiscount || 0,
            };
        }
        // Calculate totalDiscountBefore from products for Redux cart (guest)
        const totalDiscountBefore = reduxCart.products.reduce((sum, product) => {
            return sum + (product.price || 0) * (product.quantity || 1);
        }, 0);

        // Calculate totalPrice after discount for guest cart
        const couponDiscount = reduxCart.couponDiscount || 0;
        const totalPrice = Math.max(0, totalDiscountBefore - couponDiscount);

        return {
            products: reduxCart.products.map((product) => ({
                ...product,
                options: product.options || [],
            })),
            totalDiscountBefore,
            totalPrice, // Total after discount
            totalQuantity: reduxCart.totalQuantity,
            couponCode: reduxCart.couponCode,
            couponDiscount,
        };
    }, [cartData, isLoggedIn, reduxCart]);

    // Khi đang submit, dùng savedCart để giữ nguyên giá
    const displayCart = submitting && savedCartRef.current ? savedCartRef.current : cart;

    const formatPrice = (value: number) => value.toLocaleString('vi-VN');
    const cartEmpty = cart.products.length === 0;

    if (!mounted) {
        return null;
    }

    if (isLoggedIn && cartLoading) {
        return (
            <div className={cx('checkout-page')}>
                <div className="container">
                    <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải giỏ hàng...</div>
                </div>
            </div>
        );
    }

    if (isLoggedIn && cartError) {
        return (
            <div className={cx('checkout-page')}>
                <div className="container">
                    <div className={cx('auth-required')}>
                        <h2>Lỗi tải giỏ hàng</h2>
                        <p>Có lỗi xảy ra khi tải giỏ hàng. Vui lòng thử lại.</p>
                        <Link href="/cart" className={cx('login-link')}>
                            Quay lại giỏ hàng
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        }

        if (!form.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!validatePhone(form.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!form.email.trim()) {
            newErrors.email = 'Vui lòng nhập địa chỉ email';
        } else if (!validateEmail(form.email)) {
            newErrors.email = 'Địa chỉ email không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isFormValid = (): boolean => {
        return (
            form.fullName.trim() !== '' &&
            form.phone.trim() !== '' &&
            validatePhone(form.phone) &&
            form.email.trim() !== '' &&
            validateEmail(form.email)
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        const newErrors: FormErrors = { ...errors };

        if (name === 'fullName' && !form.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        }

        if (name === 'phone') {
            if (!form.phone.trim()) {
                newErrors.phone = 'Vui lòng nhập số điện thoại';
            } else if (!validatePhone(form.phone)) {
                newErrors.phone = 'Số điện thoại không hợp lệ';
            }
        }

        if (name === 'email') {
            if (!form.email.trim()) {
                newErrors.email = 'Vui lòng nhập địa chỉ email';
            } else if (!validateEmail(form.email)) {
                newErrors.email = 'Địa chỉ email không hợp lệ';
            }
        }

        setErrors(newErrors);
    };

    const storeGuestCheckoutAccess = (orderCode: string, email: string) => {
        if (typeof window === 'undefined') return;
        try {
            const key = 'guestCheckoutAccess';
            const raw = window.localStorage.getItem(key);
            const data: Record<string, { email: string; ts: number }> = raw ? JSON.parse(raw) : {};
            const normalizedEmail = email.trim().toLowerCase();
            data[orderCode] = { email: normalizedEmail, ts: Date.now() };
            const sortedEntries = Object.entries(data)
                .sort((a, b) => b[1].ts - a[1].ts)
                .slice(0, 20);
            const trimmedData: Record<string, { email: string; ts: number }> = {};
            sortedEntries.forEach(([code, value]) => {
                trimmedData[code] = value;
            });
            window.localStorage.setItem(key, JSON.stringify(trimmedData));
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Failed to store guest checkout access', err);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartEmpty || !isFormValid()) return;

        if (!validateForm()) {
            setTouched({
                fullName: true,
                phone: true,
                email: true,
            });
            return;
        }

        // Lưu cart trước khi submit để giữ nguyên giá khi đang xử lý
        savedCartRef.current = cart;

        setSubmitting(true);

        try {
            let response: { success: boolean; data: any; message: string };

            if (isLoggedIn) {
                response = await checkout({
                    phoneUserOrder: form.phone,
                    emailUserOrder: form.email,
                    userNote: form.note || '',
                    customerFullName: form.fullName,
                });
            } else {
                const guestPayload = {
                    items: cart.products.map((item: any) => ({
                        product_id: item.id,
                        quantity: item.quantity,
                        options: item.options && item.options.length > 0 ? item.options : undefined,
                    })),
                    phoneUserOrder: form.phone,
                    emailUserOrder: form.email,
                    userNote: form.note || '',
                    customerFullName: form.fullName,
                    discountCode: cart.couponCode,
                };

                response = await createGuestOrder(guestPayload);
            }

            if (response.success) {
                const orderData = response.data;
                const orderCode = orderData?.orderId?.toString();
                const checkoutToken = orderData?.checkoutToken;

                if (!orderCode || !checkoutToken) {
                    throw new Error('Không thể xác định thông tin đơn hàng. Vui lòng thử lại.');
                }

                if (isLoggedIn) {
                    await mutateCart();
                } else {
                    storeGuestCheckoutAccess(orderCode, form.email);
                    dispatch(clearCart());
                    dispatch(removeCoupon()); // Xóa mã giảm giá khỏi Redux cart

                    if (typeof window !== 'undefined') {
                        window.sessionStorage.setItem(`order_created_${orderCode}`, 'true');
                    }
                }

                // Xóa mã giảm giá sau khi đặt hàng thành công (cả user và guest)
                dispatch(clearDiscountCode());

                showSuccess('Đặt hàng thành công!');

                const params = new URLSearchParams({
                    order: orderCode,
                    token: checkoutToken,
                });
                router.push(`/checkout/success?${params.toString()}`);
            } else {
                throw new Error(response.message || 'Có lỗi xảy ra khi đặt hàng');
            }
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!';
            showError(errorMessage);
            setSubmitting(false);
            // Clear saved cart khi có lỗi để hiển thị cart hiện tại
            savedCartRef.current = null;
        }
    };

    const checkoutSteps: Step[] = [
        { id: 'cart', label: 'Giỏ hàng', description: 'Xem lại sản phẩm' },
        { id: 'checkout', label: 'Thanh toán', description: 'Thông tin & thanh toán' },
        { id: 'complete', label: 'Hoàn thành', description: 'Xác nhận đơn hàng' },
    ];

    const currentStepIndex = 1;

    return (
        <div className={cx('checkout-page')}>
            <div className="container">
                <ProgressIndicator steps={checkoutSteps} currentStep={currentStepIndex} />

                <div className={cx('grid')}>
                    <form className={cx('form')} onSubmit={handleSubmit} noValidate>
                        <h2 className={cx('section-title')}>Chi tiết thanh toán</h2>
                        <div className={cx('row')}>
                            <div className={cx('field', 'full')}>
                                <label>Họ và tên *</label>
                                <input
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Nhập họ và tên"
                                    className={cx({ 'has-error': touched.fullName && errors.fullName })}
                                />
                                {touched.fullName && errors.fullName && (
                                    <span className={cx('error-message')}>{errors.fullName}</span>
                                )}
                            </div>
                        </div>
                        <div className={cx('row')}>
                            <div className={cx('field')}>
                                <label>Số điện thoại (Zalo) *</label>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Nhập số điện thoại"
                                    className={cx({ 'has-error': touched.phone && errors.phone })}
                                />
                                {touched.phone && errors.phone && (
                                    <span className={cx('error-message')}>{errors.phone}</span>
                                )}
                            </div>
                            <div className={cx('field')}>
                                <label>Địa chỉ email *</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="you@example.com"
                                    className={cx({ 'has-error': touched.email && errors.email })}
                                />
                                {touched.email && errors.email && (
                                    <span className={cx('error-message')}>{errors.email}</span>
                                )}
                            </div>
                        </div>
                        <div className={cx('row')}>
                            <div className={cx('field', 'full')}>
                                <label>Ghi chú đơn hàng (tuỳ chọn)</label>
                                <textarea
                                    name="note"
                                    value={form.note}
                                    onChange={handleChange}
                                    placeholder="Ghi chú về đơn hàng, ví dụ: hướng dẫn giao hàng..."
                                />
                            </div>
                        </div>

                        <div className={cx('payment-method-section')}>
                            <h3 className={cx('payment-method-title')}>Phương thức thanh toán</h3>
                            <div className={cx('payment-methods')}>
                                {paymentMethods.map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        className={cx('payment-method', {
                                            'is-selected': selectedPaymentMethod === method.id,
                                            'hide-fee-mobile': method.id === 'master-visa-jcb',
                                        })}
                                        onClick={() => setSelectedPaymentMethod(method.id)}
                                    >
                                        <div className={cx('payment-method-icon')}>
                                            {method.icon ? (
                                                method.icon
                                            ) : method.iconImage ? (
                                                <Image
                                                    src={method.iconImage}
                                                    alt={method.title}
                                                    width={150}
                                                    height={150}
                                                    className={cx('payment-icon-image')}
                                                />
                                            ) : null}
                                        </div>
                                        <div className={cx('payment-method-info')}>
                                            <div className={cx('payment-method-title-text')}>
                                                {method.title}
                                            </div>
                                            <div className={cx('payment-method-description')}>
                                                {method.description}
                                            </div>
                                        </div>
                                        <div className={cx('payment-method-fee')}>{method.fee}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </form>

                    <aside className={cx('summary')}>
                        <h3 className={cx('summary-title')}>Giỏ hàng</h3>
                        <div className={cx('summary-items')}>
                            {displayCart.products.map((p: any) => (
                                <div key={p.id} className={cx('summary-item')}>
                                    <div className={cx('item-name')}>
                                        {p.productName}
                                        <span className={cx('x')}> × {p.quantity}</span>
                                    </div>
                                    <div className={cx('item-subtotal')}>
                                        {formatPrice(p.price * p.quantity)}₫
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={cx('summary-row')}>
                            <span>Tạm tính</span>
                            <strong>{formatPrice(displayCart.totalDiscountBefore || displayCart.totalPrice)}₫</strong>
                        </div>

                        {displayCart.couponCode && displayCart.couponDiscount > 0 && (
                            <div className={cx('summary-row', 'coupon-row')}>
                                <span>
                                    Mã giảm giá
                                    <span className={cx('coupon-code-badge')}>{displayCart.couponCode}</span>
                                </span>
                                <strong className={cx('discount-amount')}>
                                    -{formatPrice(displayCart.couponDiscount)}₫
                                </strong>
                            </div>
                        )}

                        <div className={cx('summary-total')}>
                            <span>Tổng</span>
                            <strong>{formatPrice(displayCart.totalPrice)}₫</strong>
                        </div>
                        <button
                            className={cx('place-order')}
                            onClick={handleSubmit}
                            disabled={submitting || cartEmpty || !isFormValid()}
                            type="button"
                        >
                            {submitting ? 'Đang xử lý...' : 'Đặt Hàng'}
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CheckoutLayout;



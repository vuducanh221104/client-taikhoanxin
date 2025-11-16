'use client';

import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/redux/cartSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { OnlineBankingQrIcon } from '@/components/Icons';
import ProgressIndicator, { Step } from '@/components/ProgressIndicator';

const cx = classNames.bind(styles);

interface FormErrors {
    firstName?: string;
    lastName?: string;
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
        icon: <OnlineBankingQrIcon size={48} />,
        title: 'Chuyển khoản ngân hàng',
        description: 'Quét mã QR chuyển khoản online. Phí 0%',
        fee: '0%',
    },
    {
        id: 'vnpay-qr',
        iconImage: '/payment/vnpay.png',
        title: 'Thanh toán VNPAY-QR',
        description: 'Quét mã QR PAY trên ứng dụng Mobile Banking, phí giao dịch 2%',
        fee: '2%',
    },
    {
        id: 'bank-card',
        iconImage: '/payment/atm.png',
        title: 'Thanh toán bằng thẻ ngân hàng',
        description: 'Phí 0.9% + 900₫',
        fee: '0.9% + 900₫',
    },
    {
        id: 'master-visa-jcb',
        iconImage: '/payment/visa.png',
        title: 'Thanh toán bằng thẻ Master/Visa/JCB',
        description: 'Phí 2.36% + 2.660 ₫',
        fee: '2.36% + 2.660₫',
    },
];

const CheckoutPage: React.FC = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        note: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('qr-bank-transfer');

    // Check authentication and redirect if not logged in
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !currentUser) {
            // Save current URL to redirect back after login
            const redirectUrl = encodeURIComponent('/checkout');
            router.push(`/auth/login?redirect=${redirectUrl}`);
        }
    }, [mounted, currentUser, router]);

    // Auto-fill form with user data when logged in
    useEffect(() => {
        if (currentUser && mounted) {
            // Split full_name into firstName and lastName
            const nameParts = currentUser.full_name?.trim().split(' ') || [];
            const firstName = nameParts.slice(0, -1).join(' ') || '';
            const lastName = nameParts[nameParts.length - 1] || '';

            setForm((prev) => ({
                ...prev,
                firstName: firstName || prev.firstName,
                lastName: lastName || prev.lastName,
                phone: currentUser.phone_number || prev.phone,
                email: currentUser.email || prev.email,
            }));
        }
    }, [currentUser, mounted]);

    const formatPrice = (value: number) => value.toLocaleString('vi-VN');
    const cartEmpty = cart.products.length === 0;

    // Show loading or redirect if not authenticated
    if (!mounted || !currentUser) {
        return (
            <div className={cx('checkout-page')}>
                <div className="container">
                    <div className={cx('auth-required')}>
                        <h2>Vui lòng đăng nhập</h2>
                        <p>Bạn cần đăng nhập để tiếp tục thanh toán.</p>
                        <Link href="/auth/login" className={cx('login-link')}>
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Validate email format
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate phone number (Vietnamese format)
    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.firstName.trim()) {
            newErrors.firstName = 'Vui lòng nhập tên';
        }

        if (!form.lastName.trim()) {
            newErrors.lastName = 'Vui lòng nhập họ';
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

    // Check if form is valid
    const isFormValid = (): boolean => {
        return (
            form.firstName.trim() !== '' &&
            form.lastName.trim() !== '' &&
            form.phone.trim() !== '' &&
            validatePhone(form.phone) &&
            form.email.trim() !== '' &&
            validateEmail(form.email)
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        // Validate individual field
        const newErrors: FormErrors = { ...errors };

        if (name === 'firstName' && !form.firstName.trim()) {
            newErrors.firstName = 'Vui lòng nhập tên';
        }

        if (name === 'lastName' && !form.lastName.trim()) {
            newErrors.lastName = 'Vui lòng nhập họ';
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cartEmpty || !isFormValid()) return;

        // Final validation before submit
        if (!validateForm()) {
            // Mark all fields as touched to show errors
            setTouched({
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
            });
            return;
        }

        setSubmitting(true);
        // Mock submit: tạo đơn hàng và lưu localStorage để trang success hiển thị
        const orderCode = `TX-${new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, '')}-${Math.floor(Math.random() * 9000 + 1000)}`;
        const selectedMethod = paymentMethods.find((m) => m.id === selectedPaymentMethod);
        const subtotal = cart.totalPrice;
        const discount = cart.couponDiscount || 0;
        const finalTotal = subtotal - discount;
        
        const order = {
            code: orderCode,
            customer: {
                firstName: form.firstName,
                lastName: form.lastName,
                phone: form.phone,
                email: form.email,
                note: form.note,
            },
            items: cart.products,
            subtotal: subtotal,
            coupon: cart.couponCode ? {
                code: cart.couponCode,
                discount: discount,
            } : null,
            total: finalTotal,
            paymentMethod: {
                id: selectedPaymentMethod,
                title: selectedMethod?.title || 'Chuyển khoản ngân hàng',
                description: selectedMethod?.description || '',
                fee: selectedMethod?.fee || '0%',
            },
            createdAt: new Date().toISOString(),
        };
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem('lastOrder', JSON.stringify(order));
            }
        } catch {}
        // Clear cart sau khi đặt hàng
        dispatch(clearCart());
        // Điều hướng tới trang thành công
        router.push('/checkout/success');
    };

    const checkoutSteps: Step[] = [
        { id: 'cart', label: 'Giỏ hàng', description: 'Xem lại sản phẩm' },
        { id: 'checkout', label: 'Thanh toán', description: 'Thông tin & thanh toán' },
        { id: 'complete', label: 'Hoàn thành', description: 'Xác nhận đơn hàng' },
    ];

    const currentStepIndex = 1; // Checkout step

    return (
        <div className={cx('checkout-page')}>
            <div className="container">
                {/* Progress Indicator */}
                <ProgressIndicator steps={checkoutSteps} currentStep={currentStepIndex} />

                <div className={cx('grid')}>
                    <form className={cx('form')} onSubmit={handleSubmit} noValidate>
                        <h2 className={cx('section-title')}>Chi tiết thanh toán</h2>
                        <div className={cx('row')}>
                            <div className={cx('field')}>
                                <label>Tên *</label>
                                <input
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Nhập tên"
                                    className={cx({ 'has-error': touched.firstName && errors.firstName })}
                                />
                                {touched.firstName && errors.firstName && (
                                    <span className={cx('error-message')}>{errors.firstName}</span>
                                )}
                            </div>
                            <div className={cx('field')}>
                                <label>Họ *</label>
                                <input
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Nhập họ"
                                    className={cx({ 'has-error': touched.lastName && errors.lastName })}
                                />
                                {touched.lastName && errors.lastName && (
                                    <span className={cx('error-message')}>{errors.lastName}</span>
                                )}
                            </div>
                        </div>
                        <div className={cx('row')}>
                            <div className={cx('field')}>
                                <label>Số điện thoại *</label>
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

                        {/* Payment Method Selection */}
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
                                                    width={48}
                                                    height={48}
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
                            {cart.products.map((p) => (
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
                            <strong>{formatPrice(cart.totalPrice)}₫</strong>
                        </div>
                        
                        {/* Coupon Discount */}
                        {cart.couponCode && cart.couponDiscount > 0 && (
                            <>
                                <div className={cx('summary-row', 'coupon-row')}>
                                    <span>
                                        Mã giảm giá
                                        <span className={cx('coupon-code-badge')}>{cart.couponCode}</span>
                                    </span>
                                    <strong className={cx('discount-amount')}>
                                        -{formatPrice(cart.couponDiscount)}₫
                                    </strong>
                                </div>
                            </>
                        )}
                        
                        <div className={cx('summary-total')}>
                            <span>Tổng</span>
                            <strong>{formatPrice(cart.totalPrice - cart.couponDiscount)}₫</strong>
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

export default CheckoutPage;




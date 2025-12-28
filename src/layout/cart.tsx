/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/cart/page.module.scss';
import { MinusIcon, PlusIcon, XIcon, ShoppingBagIcon, TrashIcon } from '@/components/Icons';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import {
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
} from '@/redux/cartSlice';
import {
    setDiscountCode,
    setReferralCode,
    clearDiscountCode,
    clearReferralCode,
} from '@/redux/authSlice';
import EmptyState from '@/components/EmptyState';
import mockCouponsData from '@/data/mockCoupons.json';
import { useConfirm } from '@/components/ConfirmDialog';
import {
    useCart,
    removeFromCart as removeFromCartAPI,
    clearCart as clearCartAPI,
    applyDiscountCode as applyDiscountCodeAPI,
    removeDiscountCode as removeDiscountCodeAPI,
    updateCartItem as updateCartItemAPI,
} from '@/services/cartService';
import {
    applyReferralCode as applyReferralCodeAPI,
    removeReferralCode as removeReferralCodeAPI,
} from '@/services/referralCodeService';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/useToast';
import { useDebounceCallback } from '@/hooks/useDebounceCallback';

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
const validateCoupon = (
    code: string,
    orderTotal: number,
): { valid: boolean; discount: number; discountAmount: number; message: string } => {
    const coupon = mockCouponsData.coupons.find(
        (c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive,
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

const CartLayout: React.FC = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const reduxCart = useSelector((state: RootState) => state.cart);
    const savedDiscountCode = useSelector((state: RootState) => state.auth.discountCode);
    const savedReferralCode = useSelector((state: RootState) => state.auth.referralCode);
    const { confirm } = useConfirm();
    const { showSuccess, showError } = useToast();
    const { mutate: globalMutate } = useSWRConfig();

    // Fetch cart from API if user is logged in
    const {
        data: cartData,
        isLoading: cartLoading,
        mutate: mutateCart,
    } = useCart();

    // Track previous discountCode to detect when it's removed
    const prevDiscountCodeRef = useRef<string | null>(savedDiscountCode);

    const [couponInput, setCouponInput] = useState(savedDiscountCode || '');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState(
        savedDiscountCode ? 'Mã giảm giá đã được áp dụng' : '',
    );

    const [referralCodeInput, setReferralCodeInput] = useState(savedReferralCode || '');
    const [referralCodeError, setReferralCodeError] = useState('');
    const [referralCodeSuccess, setReferralCodeSuccess] = useState(
        savedReferralCode ? 'Mã giới thiệu đã được áp dụng' : '',
    );

    // Sync discountCode and referralCode from API cart to Redux when cart loads
    useEffect(() => {
        if (currentUser && cartData?.data) {
            const apiCart = cartData.data as any;

            // Sync discountCode from API to Redux
            if (apiCart.discountCode && apiCart.discountCode.trim()) {
                if (apiCart.discountCode !== savedDiscountCode) {
                    dispatch(setDiscountCode(apiCart.discountCode));
                    setCouponInput(apiCart.discountCode);
                    if (apiCart.discountError) {
                        setCouponError(apiCart.discountError);
                        setCouponSuccess('');
                    } else {
                        setCouponSuccess('Mã giảm giá đã được áp dụng');
                        setCouponError('');
                    }
                } else {
                    if (apiCart.discountError) {
                        setCouponError(apiCart.discountError);
                        setCouponSuccess('');
                    } else if (!apiCart.discountError && couponError) {
                        setCouponError('');
                        setCouponSuccess('Mã giảm giá đã được áp dụng');
                    }
                }
                prevDiscountCodeRef.current = apiCart.discountCode;
            } else {
                if (savedDiscountCode || prevDiscountCodeRef.current) {
                    const wasRemoved = prevDiscountCodeRef.current && !apiCart.discountCode;

                    dispatch(clearDiscountCode());
                    dispatch(removeCoupon());
                    setCouponInput('');
                    setCouponSuccess('');
                    setCouponError('');

                    if (wasRemoved) {
                        showError('Mã giảm giá không còn hợp lệ và đã được xóa');
                    }

                    prevDiscountCodeRef.current = null;
                }
            }

            // Sync referralCode from API to Redux
            if (apiCart.referralCode && apiCart.referralCode.trim()) {
                if (apiCart.referralCode !== savedReferralCode) {
                    dispatch(setReferralCode(apiCart.referralCode));
                    setReferralCodeInput(apiCart.referralCode);
                    setReferralCodeSuccess('Mã giới thiệu đã được áp dụng');
                    setReferralCodeError('');
                }
            } else if (savedReferralCode) {
                dispatch(clearReferralCode());
                setReferralCodeInput('');
                setReferralCodeSuccess('');
                setReferralCodeError('');
            }
        }
    }, [cartData, currentUser, savedDiscountCode, savedReferralCode, dispatch, showError, couponError]);

    // Sync coupon input with Redux when it changes
    useEffect(() => {
        if (savedDiscountCode) {
            setCouponInput(savedDiscountCode);
            setCouponSuccess('Mã giảm giá đã được áp dụng');
        } else {
            setCouponInput('');
            setCouponSuccess('');
        }
    }, [savedDiscountCode]);

    // Sync referral code input with Redux when it changes
    useEffect(() => {
        if (savedReferralCode) {
            setReferralCodeInput(savedReferralCode);
            setReferralCodeSuccess('Mã giới thiệu đã được áp dụng');
        } else {
            setReferralCodeInput('');
            setReferralCodeSuccess('');
        }
    }, [savedReferralCode]);

    // Track pending quantity updates
    const pendingUpdatesRef = useRef<
        Map<string, { oldCartData: any; productId: string; quantity: number; expectedQuantity: number }>
    >(new Map());

    const debouncedUpdateQuantity = useDebounceCallback(
        async (productId: string, quantity: number, oldCartData: any) => {
            if (!currentUser) return;

            const pendingUpdate = pendingUpdatesRef.current.get(productId);
            const expectedQuantity = pendingUpdate?.expectedQuantity;

            try {
                const response = await updateCartItemAPI(productId, quantity);

                const currentPendingUpdate = pendingUpdatesRef.current.get(productId);
                if (currentPendingUpdate && currentPendingUpdate.expectedQuantity === expectedQuantity) {
                    await globalMutate('/api/v1/cart', response, { revalidate: false });
                    if (currentPendingUpdate.expectedQuantity === expectedQuantity) {
                        pendingUpdatesRef.current.delete(productId);
                    }
                }
            } catch (error: any) {
                const currentPendingUpdate = pendingUpdatesRef.current.get(productId);
                if (currentPendingUpdate && currentPendingUpdate.expectedQuantity === expectedQuantity) {
                    if (oldCartData) {
                        await globalMutate('/api/v1/cart', oldCartData, { revalidate: false });
                    }
                    const errorMessage =
                        error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
                    showError(errorMessage);
                    if (currentPendingUpdate.expectedQuantity === expectedQuantity) {
                        pendingUpdatesRef.current.delete(productId);
                    }
                }
            }
        },
        600,
    );

    // Use API cart if available, otherwise use Redux cart (for backward compatibility)
    const cart = useMemo(() => {
        if (currentUser && cartData?.data) {
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
                        const discount = priceItem?.discount;
                        // Use priceDiscount if available, otherwise use priceOriginal
                        price = discount?.priceDiscount !== undefined && discount.priceDiscount !== null
                            ? discount.priceDiscount
                            : priceItem?.priceOriginal || priceItem?.original || 0;
                    } else if (typeof product.price === 'object') {
                        const discount = product.price.discount;
                        // Use priceDiscount if available, otherwise use priceOriginal
                        price = discount?.priceDiscount !== undefined && discount.priceDiscount !== null
                            ? discount.priceDiscount
                            : product.price.priceOriginal || product.price.original || 0;
                    }
                }
                
                // Calculate oldPrice: if price is priceDiscount, oldPrice = priceOriginal
                let oldPrice: number | undefined = undefined;
                if (product?.price) {
                    let priceOriginal = 0;
                    if (Array.isArray(product.price)) {
                        priceOriginal = product.price[0]?.priceOriginal || product.price[0]?.original || 0;
                    } else if (typeof product.price === 'object') {
                        priceOriginal = product.price.priceOriginal || product.price.original || 0;
                    }
                    // If current price is different from priceOriginal, show oldPrice
                    if (priceOriginal > 0 && price !== priceOriginal) {
                        oldPrice = priceOriginal;
                }
                }
                
                const image = product?.image || [];
                const imageSrc = Array.isArray(image) && image.length > 0 ? image[0] : '';
                const slug = product?.slug || '';
                const min = product?.min || 1;
                const max = product?.max || 100;
                const stock = product?.stock || 0;

                const productHref = slug ? `/product/${slug}` : `#`;
                const options = item.options || [];

                return {
                    id: productId,
                    productName,
                    price,
                    oldPrice,
                    imageSrc,
                    imageAlt: productName,
                    href: productHref,
                    quantity: item.quantity || 1,
                    min,
                    max,
                    stock,
                    options: Array.isArray(options) ? options : [],
                };
            });

            // Calculate totalDiscountBefore from products if not provided by API
            const calculatedSubtotal = mappedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
            const totalDiscountBefore = apiCart.totalDiscountBefore ?? calculatedSubtotal;

            return {
                products: mappedProducts,
                // totalDiscountBefore is the subtotal before discount
                totalDiscountBefore,
                // totalPrice is the final price after discount code (already calculated: totalDiscountBefore - discountAmount)
                totalPrice: apiCart.totalPrice || totalDiscountBefore,
                totalQuantity: apiCart.quantity || 0,
                couponCode: apiCart.discountCode || undefined,
                couponDiscount: apiCart.discountAmount || apiCart.totalDiscount || 0,
                couponError: apiCart.discountError || undefined,
            };
        }
        // Calculate totalDiscountBefore from products for Redux cart
        const totalDiscountBefore = reduxCart.products.reduce((sum, product) => {
            return sum + (product.price || 0) * (product.quantity || 1);
        }, 0);

        return {
            ...reduxCart,
            totalDiscountBefore,
        };
    }, [cartData, currentUser, reduxCart]);

    const formatPrice = (value: number): string => value.toLocaleString('vi-VN');

    const handleRemove = async (id: string) => {
        if (currentUser) {
            try {
                await removeFromCartAPI(id);
                mutateCart();
                showSuccess('Đã xóa sản phẩm khỏi giỏ hàng');
            } catch (error: any) {
                const errorMessage =
                    error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
                showError(errorMessage);
            }
        } else {
            dispatch(removeFromCart(id));
        }
    };

    const handleIncrease = (id: string, qty: number) => {
        const product = cart.products.find((p: any) => p.id === id);
        const max = (product as any)?.max || 100;
        const stock = (product as any)?.stock || 0;

        const newQuantity = qty + 1;

        if (newQuantity > max) {
            showError(`Số lượng tối đa là ${max}`);
            return;
        }

        if (newQuantity > stock) {
            showError(`Sản phẩm chỉ còn ${stock} sản phẩm trong kho`);
            return;
        }

        if (currentUser) {
            const currentCartData = cartData as any;
            const pendingUpdate = pendingUpdatesRef.current.get(id);
            const oldCartData = pendingUpdate?.oldCartData || cartData;
            const actualCurrentQuantity = pendingUpdate?.quantity || qty;

            if (!pendingUpdate) {
                pendingUpdatesRef.current.set(id, {
                    oldCartData: cartData,
                    productId: id,
                    quantity: actualCurrentQuantity,
                    expectedQuantity: newQuantity,
                });
            } else {
                pendingUpdatesRef.current.set(id, { ...pendingUpdate, expectedQuantity: newQuantity });
            }

            const quantityDiff = newQuantity - actualCurrentQuantity;
            // Use unitPrice from cart item (already calculated as priceDiscount if available)
            const cartItem = currentCartData?.data?.items?.find((item: any) => {
                const productId = item.productId?._id || item.product_id?._id || '';
                return productId === id;
            });
            const unitPrice = cartItem?.unitPrice || (product as any)?.price || 0;
            const priceDiff = unitPrice * quantityDiff;

            const optimisticCart = {
                ...currentCartData,
                data: {
                    ...currentCartData?.data,
                    items:
                        currentCartData?.data?.items?.map((item: any) => {
                            const productId = item.productId?._id || item.product_id?._id || '';
                            if (productId === id) {
                                return { ...item, quantity: newQuantity };
                            }
                            return item;
                        }) || [],
                    quantity: (currentCartData?.data?.quantity || 0) + quantityDiff,
                    totalDiscountBefore: (currentCartData?.data?.totalDiscountBefore || 0) + priceDiff,
                    totalPrice:
                        (currentCartData?.data?.totalDiscountBefore || 0) +
                        priceDiff -
                        (currentCartData?.data?.totalDiscount || 0),
                },
            };

            globalMutate('/api/v1/cart', optimisticCart, { revalidate: false });

            pendingUpdatesRef.current.set(id, {
                oldCartData,
                productId: id,
                quantity: newQuantity,
                expectedQuantity: newQuantity,
            });

            debouncedUpdateQuantity(id, newQuantity, oldCartData);
        } else {
            dispatch(updateQuantity({ id, quantity: newQuantity }));
        }
    };

    const handleDecrease = (id: string, qty: number) => {
        const product = cart.products.find((p: any) => p.id === id);
        const min = (product as any)?.min || 1;

        if (qty <= min) {
            showError(`Số lượng tối thiểu là ${min}`);
            return;
        }

        const newQuantity = qty - 1;

        if (currentUser) {
            const currentCartData = cartData as any;
            const pendingUpdate = pendingUpdatesRef.current.get(id);
            const oldCartData = pendingUpdate?.oldCartData || cartData;
            const actualCurrentQuantity = pendingUpdate?.quantity || qty;

            if (!pendingUpdate) {
                pendingUpdatesRef.current.set(id, {
                    oldCartData: cartData,
                    productId: id,
                    quantity: actualCurrentQuantity,
                    expectedQuantity: newQuantity,
                });
            } else {
                pendingUpdatesRef.current.set(id, { ...pendingUpdate, expectedQuantity: newQuantity });
            }

            const quantityDiff = newQuantity - actualCurrentQuantity;
            // Use unitPrice from cart item (already calculated as priceDiscount if available)
            const cartItem = currentCartData?.data?.items?.find((item: any) => {
                const productId = item.productId?._id || item.product_id?._id || '';
                return productId === id;
            });
            const unitPrice = cartItem?.unitPrice || (product as any)?.price || 0;
            const priceDiff = unitPrice * quantityDiff;

            const optimisticCart = {
                ...currentCartData,
                data: {
                    ...currentCartData?.data,
                    items:
                        currentCartData?.data?.items?.map((item: any) => {
                            const productId = item.productId?._id || item.product_id?._id || '';
                            if (productId === id) {
                                return { ...item, quantity: newQuantity };
                            }
                            return item;
                        }) || [],
                    quantity: (currentCartData?.data?.quantity || 0) + quantityDiff,
                    totalDiscountBefore: (currentCartData?.data?.totalDiscountBefore || 0) + priceDiff,
                    totalPrice:
                        (currentCartData?.data?.totalDiscountBefore || 0) +
                        priceDiff -
                        (currentCartData?.data?.totalDiscount || 0),
                },
            };

            globalMutate('/api/v1/cart', optimisticCart, { revalidate: false });

            pendingUpdatesRef.current.set(id, {
                oldCartData,
                productId: id,
                quantity: newQuantity,
                expectedQuantity: newQuantity,
            });

            debouncedUpdateQuantity(id, newQuantity, oldCartData);
        } else {
            dispatch(updateQuantity({ id, quantity: newQuantity }));
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) {
            setCouponError('Vui lòng nhập mã giảm giá');
            setCouponSuccess('');
            return;
        }

        if (currentUser) {
            try {
                const response = await applyDiscountCodeAPI({ code: couponInput.toUpperCase() });
                if (response.success) {
                    const cartDataFromResponse = response.data as any;
                    const discountCode = cartDataFromResponse?.discountCode || '';
                    const discountAmount =
                        cartDataFromResponse?.discountAmount || cartDataFromResponse?.totalDiscount || 0;

                    if (discountCode) {
                        dispatch(setDiscountCode(discountCode));
                    }

                    dispatch(
                        applyCoupon({
                            code: discountCode,
                            discount: discountAmount,
                        }),
                    );

                    await globalMutate(
                        '/api/v1/cart',
                        {
                            success: true,
                            data: cartDataFromResponse,
                            message: response.message,
                        },
                        { revalidate: false },
                    );

                    await mutateCart();

                    setCouponSuccess(response.message || 'Áp dụng mã giảm giá thành công');
                    setCouponError('');
                    setCouponInput('');
                    showSuccess('Áp dụng mã giảm giá thành công');
                } else {
                    throw new Error('Không thể áp dụng mã giảm giá');
                }
            } catch (error: any) {
                const errorMessage =
                    error?.response?.data?.message || error?.message || 'Mã giảm giá không hợp lệ';
                setCouponError(errorMessage);
                setCouponSuccess('');
                dispatch(clearDiscountCode());
                dispatch(removeCoupon());
                showError(errorMessage);
            }
        } else {
            const result = validateCoupon(couponInput, cart.totalPrice);

            if (result.valid) {
                dispatch(
                    applyCoupon({
                        code: couponInput.toUpperCase(),
                        discount: result.discountAmount,
                    }),
                );

                setCouponSuccess(result.message);
                setCouponError('');
                setCouponInput('');
            } else {
                setCouponError(result.message);
                setCouponSuccess('');
            }
        }
    };

    const handleRemoveCoupon = async () => {
        if (currentUser) {
            try {
                const response = await removeDiscountCodeAPI();

                if (response.success) {
                    await globalMutate('/api/v1/cart', response, { revalidate: false });
                    await mutateCart();

                    dispatch(clearDiscountCode());
                    dispatch(removeCoupon());

                    setCouponSuccess('');
                    setCouponError('');
                    setCouponInput('');

                    showSuccess('Đã xóa mã giảm giá');
                } else {
                    throw new Error('Không thể xóa mã giảm giá');
                }
            } catch (error: any) {
                const errorMessage =
                    error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
                showError(errorMessage);
            }
        } else {
            dispatch(clearDiscountCode());
            dispatch(removeCoupon());

            setCouponSuccess('');
            setCouponError('');
            setCouponInput('');

            showSuccess('Đã xóa mã giảm giá');
        }
    };

    const handleApplyReferralCode = async () => {
        if (!referralCodeInput.trim()) {
            setReferralCodeError('Vui lòng nhập mã giới thiệu');
            setReferralCodeSuccess('');
            return;
        }

        if (!currentUser) {
            setReferralCodeError('Vui lòng đăng nhập để sử dụng mã giới thiệu');
            setReferralCodeSuccess('');
            return;
        }

        try {
            const response = await applyReferralCodeAPI(referralCodeInput.trim());
            if (response.success) {
                dispatch(setReferralCode(referralCodeInput.trim()));

                if (cartData?.data) {
                    const updatedCartData = {
                        ...cartData,
                        data: {
                            ...(cartData.data as any),
                            referralCode: referralCodeInput.trim().toUpperCase(),
                        },
                    };
                    await globalMutate('/api/v1/cart', updatedCartData, { revalidate: false });
                }

                await mutateCart();

                setReferralCodeSuccess(response.message || 'Áp dụng mã giới thiệu thành công');
                setReferralCodeError('');
                setReferralCodeInput('');
                showSuccess(response.message || 'Áp dụng mã giới thiệu thành công');
            } else {
                throw new Error(response.message || 'Không thể áp dụng mã giới thiệu');
            }
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || error?.message || 'Mã giới thiệu không hợp lệ';
            setReferralCodeError(errorMessage);
            setReferralCodeSuccess('');
            dispatch(clearReferralCode());
            showError(errorMessage);
        }
    };

    const handleRemoveReferralCode = async () => {
        if (currentUser && cartData?.data) {
            const updatedCartData = {
                ...cartData,
                data: {
                    ...(cartData.data as any),
                    referralCode: '',
                },
            };
            await globalMutate('/api/v1/cart', updatedCartData, { revalidate: false });

            try {
                await removeReferralCodeAPI();
            } catch (error) {
                console.warn('Error removing referral code:', error);
            }

            await mutateCart();
        }

        dispatch(clearReferralCode());
        setReferralCodeSuccess('');
        setReferralCodeError('');
        setReferralCodeInput('');
        showSuccess('Đã xóa mã giới thiệu');
    };

    // subtotal is the price before discount
    const subtotal = cart.totalDiscountBefore ?? cart.totalPrice;
    const discount = cart.couponDiscount || 0;
    // total is the final price after discount (already calculated from backend)
    const total = cart.totalPrice;

    if (currentUser && cartLoading) {
        return (
            <div className={cx('cart-page')}>
                <div className="container">
                    <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải giỏ hàng...</div>
                </div>
            </div>
        );
    }

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
                                            if (currentUser) {
                                                try {
                                                    await clearCartAPI();
                                                    mutateCart();
                                                    showSuccess('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
                                                } catch (error: any) {
                                                    const errorMessage =
                                                        error?.response?.data?.message ||
                                                        error?.message ||
                                                        'Có lỗi xảy ra. Vui lòng thử lại!';
                                                    showError(errorMessage);
                                                }
                                            } else {
                                                dispatch(clearCart());
                                            }
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
                                <div className={cx('th', 'qty')}>Số lượng</div>
                                <div className={cx('th', 'price')}>Giá</div>
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
                                        {cart.products.map((p: any) => {
                                            const rowSubtotal = p.price * p.quantity;
                                            return (
                                                <div className={cx('tr')} key={p.id}>
                                                    <div className={cx('td', 'product')}>
                                                        {p.imageSrc ? (
                                                            <div className={cx('thumb')}>
                                                                <Link href={p.href || '#'}>
                                                                    <Image
                                                                        src={p.imageSrc}
                                                                        alt={p.imageAlt || p.productName}
                                                                        width={240}
                                                                        height={180}
                                                                        className={cx('thumb-image')}
                                                                    />
                                                                </Link>
                                                            </div>
                                                        ) : (
                                                            <div className={cx('placeholder')} />
                                                        )}
                                                        <div className={cx('product-info')}>
                                                            <Link href={p.href || '#'} className={cx('name')}>
                                                                {p.productName}
                                                            </Link>
                                                            {p.options && Array.isArray(p.options) && p.options.length > 0 && (
                                                                <div className={cx('product-meta')}>
                                                                    {p.options.map((opt: any, idx: number) => (
                                                                        <div key={idx} className={cx('meta-row')}>
                                                                            <span className={cx('meta-label')}>
                                                                                {opt.title}
                                                                            </span>
                                                                            <span className={cx('meta-value')}>
                                                                                {opt.value}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
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
                                                    <div className={cx('td', 'price')}>
                                                        <div className={cx('price-content')}>
                                                            <span>{formatPrice(rowSubtotal)}₫</span>
                                                            <button
                                                                className={cx('remove')}
                                                                onClick={() => handleRemove(p.id)}
                                                                aria-label="Xóa sản phẩm"
                                                                type="button"
                                                            >
                                                                <TrashIcon size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Mobile Card Layout */}
                                        {cart.products.map((p: any) => {
                                            const discountPercent =
                                                p.oldPrice && p.oldPrice > p.price
                                                    ? Math.round(
                                                          ((p.oldPrice - p.price) / p.oldPrice) * 100,
                                                      )
                                                    : 0;
                                            const stockStatus = 'in-stock';

                                            return (
                                                <div className={cx('cart-item-card')} key={`mobile-${p.id}`}>
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

                                                    <div className={cx('cart-item-info')}>
                                                        <div className={cx('product-name-wrapper')}>
                                                            <Link
                                                                href={p.href || '#'}
                                                                className={cx('cart-item-name')}
                                                            >
                                                                <h3>{p.productName}</h3>
                                                            </Link>
                                                            {p.options &&
                                                                Array.isArray(p.options) &&
                                                                p.options.length > 0 && (
                                                                    <div className={cx('product-meta')}>
                                                                        {p.options.map(
                                                                            (opt: any, idx: number) => (
                                                                                <div
                                                                                    key={idx}
                                                                                    className={cx('meta-row')}
                                                                                >
                                                                                    <span
                                                                                        className={cx('meta-label')}
                                                                                    >
                                                                                        {opt.title}
                                                                                    </span>
                                                                                    <span
                                                                                        className={cx('meta-value')}
                                                                                    >
                                                                                        {opt.value}
                                                                                    </span>
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </div>
                                                                )}
                                                        </div>

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
                                                                            <span
                                                                                className={cx('discount-badge')}
                                                                            >
                                                                                -{discountPercent}%
                                                                            </span>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className={cx('cart-item-actions')}>
                                                            <div className={cx('quantity-section')}>
                                                                <span className={cx('quantity-label')}>
                                                                    Số lượng:
                                                                </span>
                                                                <div className={cx('quantity-controls')}>
                                                                    <button
                                                                        className={cx('qty-btn', 'qty-minus')}
                                                                        onClick={() =>
                                                                            handleDecrease(
                                                                                p.id,
                                                                                p.quantity,
                                                                            )
                                                                        }
                                                                        disabled={p.quantity <= 1}
                                                                        type="button"
                                                                        aria-label="Giảm số lượng"
                                                                    >
                                                                        <MinusIcon size={16} />
                                                                    </button>
                                                                    <span className={cx('qty-value')}>
                                                                        {p.quantity}
                                                                    </span>
                                                                    <button
                                                                        className={cx('qty-btn', 'qty-plus')}
                                                                        onClick={() =>
                                                                            handleIncrease(
                                                                                p.id,
                                                                                p.quantity,
                                                                            )
                                                                        }
                                                                        type="button"
                                                                        aria-label="Tăng số lượng"
                                                                    >
                                                                        <PlusIcon size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className={cx('cart-item-footer')}>
                                                                <div className={cx('stock-status')}>
                                                                    <span className={cx('stock-icon')}>📦</span>
                                                                    <span className={cx('stock-text')}>
                                                                        Tình trạng:{' '}
                                                                        <span
                                                                            className={cx(
                                                                                'stock-value',
                                                                                stockStatus,
                                                                            )}
                                                                        >
                                                                            {stockStatus === 'in-stock'
                                                                                ? 'Còn hàng'
                                                                                : 'Hết hàng'}
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

                            <div className={cx('summary-row')}>
                                <span>Tạm tính ({cart.totalQuantity} sản phẩm)</span>
                                <strong>{formatPrice(subtotal)}₫</strong>
                            </div>

                            {cart.products.length > 0 && (
                                <div className={cx('referral-section')}>
                                    <label className={cx('input-label')}>Bạn có mã giới thiệu</label>
                                    {!referralCodeSuccess ? (
                                        <>
                                            <div className={cx('referral-input-wrapper')}>
                                                <input
                                                    className={cx('referral-input', {
                                                        error: referralCodeError,
                                                    })}
                                                    placeholder="Nhập mã giới thiệu"
                                                    value={referralCodeInput}
                                                    onChange={(e) =>
                                                        setReferralCodeInput(e.target.value)
                                                    }
                                                    onKeyDown={(e) =>
                                                        e.key === 'Enter' && handleApplyReferralCode()
                                                    }
                                                />
                                                <button
                                                    className={cx('referral-apply')}
                                                    type="button"
                                                    onClick={handleApplyReferralCode}
                                                >
                                                    Áp dụng
                                                </button>
                                            </div>
                                            {referralCodeError && (
                                                <div className={cx('referral-message', 'error')}>
                                                    {referralCodeError}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className={cx('referral-applied')}>
                                            <div className={cx('referral-code-row')}>
                                                <span className={cx('referral-code-pill')}>
                                                    <span className={cx('referral-code-emoji')}>🎉</span>
                                                    {(savedReferralCode || referralCodeInput || '')
                                                        .toUpperCase()}
                                                </span>
                                                <button
                                                    className={cx('referral-remove')}
                                                    onClick={handleRemoveReferralCode}
                                                    type="button"
                                                    aria-label="Xóa mã giới thiệu"
                                                >
                                                    <XIcon size={16} />
                                                </button>
                                            </div>
                                            <div className={cx('referral-message', 'success')}>
                                                ✓{' '}
                                                {referralCodeSuccess ||
                                                    'Mã giới thiệu đã được áp dụng'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {cart.products.length > 0 && (
                                <div className={cx('coupon-section')}>
                                    <label className={cx('input-label')}>Mã giảm giá</label>
                                    {!cart.couponCode ? (
                                        <>
                                            <div className={cx('coupon-input-wrapper')}>
                                                <input
                                                    className={cx('coupon-input', {
                                                        error: couponError,
                                                    })}
                                                    placeholder="Nhập mã giảm giá"
                                                    value={couponInput}
                                                    onChange={(e) =>
                                                        setCouponInput(e.target.value)
                                                    }
                                                    onKeyDown={(e) =>
                                                        e.key === 'Enter' && handleApplyCoupon()
                                                    }
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
                                        <div
                                            className={cx('coupon-applied', {
                                                error: (cart as any).couponError,
                                            })}
                                        >
                                            <div
                                                className={cx('coupon-info', {
                                                    error: (cart as any).couponError,
                                                })}
                                            >
                                                <span
                                                    className={cx('coupon-code', {
                                                        error: (cart as any).couponError,
                                                    })}
                                                >
                                                    {(cart as any).couponError ? '⚠️' : '🎉'}{' '}
                                                    {cart.couponCode}
                                                </span>
                                                <button
                                                    className={cx('coupon-remove')}
                                                    onClick={handleRemoveCoupon}
                                                    type="button"
                                                    aria-label="Xóa mã giảm giá"
                                                >
                                                    <XIcon size={16} />
                                                </button>
                                            </div>
                                            {(cart as any).couponError && (
                                                <div className={cx('coupon-message', 'error')}>
                                                    {(cart as any).couponError}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {cart.couponCode && (
                                <div className={cx('summary-row', 'discount')}>
                                    <span>
                                        Giảm giá
                                        <span className={cx('discount-code')}>
                                            {' '}
                                            ({cart.couponCode})
                                        </span>
                                    </span>
                                    <strong className={cx('discount-amount')}>
                                        {discount > 0 ? `-${formatPrice(discount)}₫` : '0₫'}
                                    </strong>
                                </div>
                            )}

                            <div className={cx('summary-divider')} />
                            <div className={cx('summary-total')}>
                                <span>Tổng cộng</span>
                                <strong className={cx('total-amount')}>
                                    {formatPrice(total)}₫
                                </strong>
                            </div>

                            <Link
                                href="/checkout"
                                className={cx('checkout-btn', {
                                    disabled: cart.products.length === 0,
                                })}
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

export default CartLayout;



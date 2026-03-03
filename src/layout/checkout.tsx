'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from '@/app/(user)/checkout/page.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProgressIndicator, { Step } from '@/components/ProgressIndicator';
import { useCart, checkout, removeFromCart as removeFromCartAPI, validateCart, removeDiscountCode as removeDiscountCodeAPI } from '@/services/cartService';
import { useToast } from '@/hooks/useToast';
import { clearCart, removeCoupon, removeFromCart, updateProductPrice, applyCoupon } from '@/redux/cartSlice';
import { clearDiscountCode } from '@/redux/authSlice';
import { createGuestOrder } from '@/services/orderService';
import { checkProductsStock, type Product } from '@/services/productService';
import { validateDiscountCode } from '@/services/discountCodeService';

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
    const { showSuccess, showError, showInfo } = useToast();
    const [isOutOfStockModalOpen, setIsOutOfStockModalOpen] = useState(false);
    const [outOfStockMessage, setOutOfStockMessage] = useState('');
    const [isCartChangesModalOpen, setIsCartChangesModalOpen] = useState(false);
    const [cartChangesData, setCartChangesData] = useState<any>(null);
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
    // State for login prompt modal - show by default for guest users
    const [showLoginPrompt, setShowLoginPrompt] = useState(true);
    // Lưu giá cart trước khi submit để giữ nguyên khi đang xử lý
    const savedCartRef = useRef<any>(null);

    const { data: cartData, error: cartError, isLoading: cartLoading, mutate: mutateCart } = useCart();
    const isLoggedIn = Boolean(currentUser?.accessToken);

    useEffect(() => {
        setMounted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Check if there's a pending cart changes modal that wasn't confirmed
        if (typeof window !== 'undefined') {
            const pendingModalData = sessionStorage.getItem('checkout_pending_cart_changes');
            if (pendingModalData) {
                try {
                    const data = JSON.parse(pendingModalData);
                    setCartChangesData(data);
                    setIsCartChangesModalOpen(true);
                } catch (error) {
                    console.error('Error parsing pending cart changes data:', error);
                    sessionStorage.removeItem('checkout_pending_cart_changes');
                }
            }
        }
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

    // Handler for login prompt - redirect to login page with cart redirect
    const handleLoginPrompt = useCallback(() => {
        // Lưu cart vào sessionStorage để restore sau khi đăng nhập
        if (typeof window !== 'undefined' && reduxCart.products.length > 0) {
            sessionStorage.setItem('redirectAfterLogin', '/cart');
            // Lưu cart items để restore sau khi đăng nhập
            sessionStorage.setItem('guestCart', JSON.stringify(reduxCart.products));
        }
        router.push('/auth/login?redirect=/cart');
    }, [router, reduxCart.products]);

    // Handler để tiếp tục thanh toán với tư cách guest
    const handleContinueAsGuest = useCallback(() => {
        setShowLoginPrompt(false);
    }, []);

    // Calculate cartEmpty early based on cart data
    const cartEmpty = useMemo(() => {
        if (isLoggedIn) {
            // For logged-in users, check cartData
            if (cartLoading) return true; // Consider empty while loading
            if (!cartData?.data) return true;
            const apiCart = cartData.data as any;
            const items = apiCart.items || [];
            return items.length === 0;
        } else {
            // For guest users, check Redux cart
            return reduxCart.products.length === 0;
        }
    }, [isLoggedIn, cartLoading, cartData, reduxCart.products.length]);

    // Validate guest cart - Check prices, stock, and discount code
    const validateGuestCart = React.useCallback(async () => {
        if (isLoggedIn || !mounted || cartEmpty || reduxCart.products.length === 0) return;

        try {
            // Get product IDs from Redux cart
            const productIds = reduxCart.products.map((p: any) => p.id).filter(Boolean);
            if (productIds.length === 0) return;

            // Fetch latest product data including prices
            const { post } = await import('@/utils/httpRequest');
            const productsResponse = await post<{ success: boolean; data: Product[] }>('/api/v1/products/by-ids', { ids: productIds });
            
            if (!productsResponse.data.success || !productsResponse.data.data) {
                return;
            }

            const latestProducts = productsResponse.data.data;
            const productMap = new Map(latestProducts.map((p: Product) => [p._id, p]));

            // Build validation result
            const validationResult: any = {
                hasChanges: false,
                priceChanges: [],
                stockIssues: [],
                discountCodeIssue: null,
            };

            // Check each product for price and stock changes
            for (const cartProduct of reduxCart.products) {
                const latestProduct = productMap.get(cartProduct.id);
                if (!latestProduct) continue;

                // Calculate latest price
                let latestPrice = 0;
                let latestPriceOriginal = 0;
                let latestPriceDiscount: number | null = null;
                
                if (latestProduct.price) {
                    if (Array.isArray(latestProduct.price)) {
                        const priceItem = latestProduct.price[0];
                        latestPriceOriginal = priceItem?.priceOriginal || 0;
                        const discount = priceItem?.discount;
                        
                        // Chỉ kiểm tra quantity > 0 (còn mã giảm giá)
                        const discountQuantity = discount?.quantity || 0;
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < latestPriceOriginal &&
                            discountQuantity > 0;
                        
                        latestPrice = hasValidDiscount ? discount.priceDiscount : latestPriceOriginal;
                        latestPriceDiscount = hasValidDiscount ? discount.priceDiscount : null;
                    } else if (typeof latestProduct.price === 'object' && latestProduct.price !== null) {
                        const priceObj = latestProduct.price as any;
                        latestPriceOriginal = priceObj?.priceOriginal || 0;
                        const discount = priceObj?.discount;
                        
                        // Chỉ kiểm tra quantity > 0 (còn mã giảm giá)
                        const discountQuantity = discount?.quantity || 0;
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < latestPriceOriginal &&
                            discountQuantity > 0;
                        
                        latestPrice = hasValidDiscount ? discount.priceDiscount : latestPriceOriginal;
                        latestPriceDiscount = hasValidDiscount ? discount.priceDiscount : null;
                    }
                }

                // Check if price changed
                const priceDifference = Math.abs(cartProduct.price - latestPrice);
                if (priceDifference > 0.01) {
                    // Calculate old price info from cartProduct
                    // cartProduct.price là giá đang lưu trong cart (có thể là giá giảm hoặc giá gốc)
                    // cartProduct.oldPrice (nếu có) là giá gốc trước khi giảm
                    let oldPriceDiscount: number | null = null;
                    let oldPriceOriginal: number = cartProduct.price;

                    if (cartProduct.oldPrice && cartProduct.oldPrice > cartProduct.price) {
                        // Có giảm giá trước đó: oldPrice = giá gốc, price = giá giảm
                        oldPriceDiscount = cartProduct.price;
                        oldPriceOriginal = cartProduct.oldPrice;
                    } else {
                        // Không có giảm giá, coi price hiện tại là giá gốc
                        oldPriceOriginal = cartProduct.price;
                    }
                    
                    // Calculate product href - prioritize cartProduct.href, then latestProduct.slug, fallback to productId
                    let productHref = '#';
                    if (cartProduct.href && cartProduct.href !== '#') {
                        productHref = cartProduct.href;
                    } else if (latestProduct.slug) {
                        productHref = `/product/${latestProduct.slug}`;
                    } else if (cartProduct.id) {
                        // Fallback: try to construct from productId if we have it
                        productHref = `/product/${cartProduct.id}`;
                    }
                    
                    validationResult.hasChanges = true;
                    validationResult.priceChanges.push({
                        productId: cartProduct.id,
                        productName: cartProduct.productName,
                        productImage: latestProduct.image?.[0] || null,
                        productHref: productHref,
                        oldPrice: cartProduct.price,
                        oldPriceOriginal: oldPriceOriginal,
                        oldPriceDiscount: oldPriceDiscount,
                        newPrice: latestPrice,
                        newPriceOriginal: latestPriceOriginal,
                        newPriceDiscount: latestPriceDiscount,
                        quantity: cartProduct.quantity,
                    });

                    // Update price in Redux cart
                    dispatch(updateProductPrice({
                        id: cartProduct.id,
                        price: latestPrice,
                        stock: latestProduct.stock || 0,
                    }));
                } else {
                    // Update stock even if price didn't change
                    if (cartProduct.stock !== (latestProduct.stock || 0)) {
                        dispatch(updateProductPrice({
                            id: cartProduct.id,
                            price: cartProduct.price,
                            stock: latestProduct.stock || 0,
                        }));
                    }
                }

                // Check stock issues
                if (!latestProduct.isActive) {
                    validationResult.hasChanges = true;
                    validationResult.stockIssues.push({
                        productId: cartProduct.id,
                        productName: cartProduct.productName,
                        productImage: latestProduct.image?.[0] || null,
                        issue: 'inactive',
                        message: 'Sản phẩm không còn khả dụng',
                    });
                } else if ((latestProduct.stock || 0) <= 0) {
                    validationResult.hasChanges = true;
                    validationResult.stockIssues.push({
                        productId: cartProduct.id,
                        productName: cartProduct.productName,
                        productImage: latestProduct.image?.[0] || null,
                        issue: 'out_of_stock',
                        message: 'Sản phẩm đã hết hàng',
                    });
                } else if (cartProduct.quantity > (latestProduct.stock || 0)) {
                    validationResult.hasChanges = true;
                    validationResult.stockIssues.push({
                        productId: cartProduct.id,
                        productName: cartProduct.productName,
                        productImage: latestProduct.image?.[0] || null,
                        issue: 'insufficient_stock',
                        message: `Sản phẩm chỉ còn ${latestProduct.stock} sản phẩm trong kho`,
                        requestedQuantity: cartProduct.quantity,
                        availableStock: latestProduct.stock || 0,
                    });
                }
            }

            // Validate discount code if exists
            if (reduxCart.couponCode && reduxCart.products.length > 0) {
                try {
                    const orderValue = reduxCart.products.reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0);
                    const productIdsForValidation = reduxCart.products.map((p: any) => p.id).filter(Boolean);
                    
                    const discountResponse = await validateDiscountCode({
                        code: reduxCart.couponCode,
                        orderValue,
                        productIds: productIdsForValidation,
                    });

                    if (!discountResponse.success || discountResponse.data?.discountAmount === undefined) {
                        validationResult.hasChanges = true;
                        const errorType = discountResponse.errors?.errorType;
                        validationResult.discountCodeIssue = {
                            code: reduxCart.couponCode,
                            message: discountResponse.message || 'Mã giảm giá không còn hợp lệ',
                            errorType,
                        };
                        // Remove invalid discount code
                        dispatch(removeCoupon());
                        dispatch(clearDiscountCode());
                    } else {
                        // Update discount amount if valid
                        const discountAmount = discountResponse.data.discountAmount || 0;
                        dispatch(applyCoupon({
                            code: reduxCart.couponCode,
                            discount: discountAmount,
                        }));
                    }
                } catch (error: any) {
                    validationResult.hasChanges = true;
                    const errorType = error?.response?.data?.errors?.errorType;
                    const errorMessage = error?.response?.data?.message || 'Mã giảm giá không còn hợp lệ';
                    validationResult.discountCodeIssue = {
                        code: reduxCart.couponCode,
                        message: errorMessage,
                        errorType,
                    };
                    // Remove invalid discount code
                    dispatch(removeCoupon());
                    dispatch(clearDiscountCode());
                }
            }

            // Show modal if there are changes
            if (validationResult.hasChanges) {
                setCartChangesData(validationResult);
                setIsCartChangesModalOpen(true);
                // Save to sessionStorage so modal can be restored when user navigates back
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('checkout_pending_cart_changes', JSON.stringify(validationResult));
                }
            }
        } catch (error) {
            // Silently fail - don't block user from checkout
            console.error('Error validating guest cart:', error);
        }
    }, [isLoggedIn, mounted, cartEmpty, reduxCart, dispatch]);

    // Check discount code usage limit when entering checkout page
    useEffect(() => {
        const checkDiscountCodeUsage = async () => {
            if (!mounted || cartEmpty) return;

            // Get discount code from cart
            const discountCode = isLoggedIn 
                ? (cartData?.data as any)?.discountCode 
                : reduxCart.couponCode;

            if (!discountCode || !discountCode.trim()) return;

            try {
                // Get order value and product IDs for validation
                const orderValue = isLoggedIn
                    ? (cartData?.data as any)?.totalDiscountBefore || 0
                    : reduxCart.products.reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0);
                
                const productIds = isLoggedIn
                    ? ((cartData?.data as any)?.items || []).map((item: any) => {
                          const product = item.productId || item.product_id;
                          return product?._id || product?.id || '';
                      }).filter(Boolean)
                    : reduxCart.products.map((p: any) => p.id).filter(Boolean);

                // Validate discount code
                const validationResponse = await validateDiscountCode({
                    code: discountCode,
                    orderValue,
                    productIds,
                });

                // Check if discount code has usage limit issue
                const errorType = validationResponse.errors?.errorType;
                const isUsageLimitError = !validationResponse.success && (
                    errorType === 'usageLimit' ||
                    validationResponse.message?.toLowerCase().includes('hết lượt') ||
                    validationResponse.message?.toLowerCase().includes('usage') ||
                    validationResponse.message?.toLowerCase().includes('usageLimit')
                );

                if (isUsageLimitError) {
                    // Remove discount code from cart
                    if (isLoggedIn) {
                        try {
                            await removeDiscountCodeAPI();
                            await mutateCart();
                        } catch (error) {
                            console.error('Error removing discount code:', error);
                        }
                    } else {
                        dispatch(removeCoupon());
                        dispatch(clearDiscountCode());
                    }

                    // Show toast notification
                    const errorMsg = validationResponse.message || 'Mã giảm giá đã hết lượt sử dụng';
                    showError(`${errorMsg}. Mã giảm giá đã được gỡ khỏi giỏ hàng.`);
                }
            } catch (error: any) {
                // Check if error is usage limit error
                const errorType = error?.response?.data?.errors?.errorType;
                const errorMessage = error?.response?.data?.message || '';
                const isUsageLimitError = errorType === 'usageLimit' ||
                    errorMessage.toLowerCase().includes('hết lượt') ||
                    errorMessage.toLowerCase().includes('usage');

                if (isUsageLimitError) {
                    // Remove discount code from cart
                    if (isLoggedIn) {
                        try {
                            await removeDiscountCodeAPI();
                            await mutateCart();
                        } catch (removeError) {
                            console.error('Error removing discount code:', removeError);
                        }
                    } else {
                        dispatch(removeCoupon());
                        dispatch(clearDiscountCode());
                    }

                    // Show toast notification
                    showError(`${errorMessage || 'Mã giảm giá đã hết lượt sử dụng'}. Mã giảm giá đã được gỡ khỏi giỏ hàng.`);
                } else {
                    // Silently fail for other errors - don't block user from checkout
                    console.error('Error checking discount code usage:', error);
                }
            }
        };

        // Only check if cart is loaded (for logged-in users)
        if (isLoggedIn && cartLoading) return;
        
        checkDiscountCodeUsage();
    }, [isLoggedIn, mounted, cartEmpty, cartLoading, cartData, reduxCart.couponCode, mutateCart, dispatch, showError]);

    // Validate cart when entering checkout page (for both logged-in and guest users)
    useEffect(() => {
        const checkCartValidation = async () => {
            if (!mounted || cartEmpty) return;

            if (isLoggedIn) {
                // Validate logged-in user cart
                if (cartLoading) return;

                try {
                    const validationResponse = await validateCart();
                    
                    if (validationResponse.hasChanges && validationResponse.validationResult) {
                        // Ensure productHref is set for each priceChange item
                        const validationResult = validationResponse.validationResult;
                        if (validationResult.priceChanges && Array.isArray(validationResult.priceChanges)) {
                            // Get cart data to find product hrefs
                            const apiCart = cartData?.data as any;
                            const items = apiCart?.items || [];
                            
                            validationResult.priceChanges = validationResult.priceChanges.map((change: any) => {
                                // Find corresponding cart item to get product data
                                const cartItem = items.find((item: any) => {
                                    const product = item.productId || item.product_id;
                                    const productId = product?._id || product?.id || '';
                                    return productId === change.productId;
                                });
                                
                                if (cartItem) {
                                    const product = cartItem.productId || cartItem.product_id;
                                    const slug = product?.slug || '';
                                    if (!change.productHref || change.productHref === '#') {
                                        change.productHref = slug ? `/product/${slug}` : (change.productId ? `/product/${change.productId}` : '#');
                                    }
                                } else if (!change.productHref || change.productHref === '#') {
                                    // Fallback: use productId if no slug available
                                    change.productHref = change.productId ? `/product/${change.productId}` : '#';
                                }
                                
                                return change;
                            });
                        }
                        
                        // If discount code issue exists, remove it from cart and reload
                        if (validationResult.discountCodeIssue) {
                            try {
                                await removeDiscountCodeAPI();
                                // Reload cart to get updated totals without discount code
                                await mutateCart();
                            } catch (error) {
                                console.error('Error removing discount code:', error);
                            }
                        }
                        
                        // Show modal with cart changes
                        setCartChangesData(validationResult);
                        setIsCartChangesModalOpen(true);
                        // Save to sessionStorage so modal can be restored when user navigates back
                        if (typeof window !== 'undefined') {
                            sessionStorage.setItem('checkout_pending_cart_changes', JSON.stringify(validationResult));
                        }
                        
                        // Update cart if it was updated (even if discount code was already removed above)
                        if (validationResponse.cart) {
                            await mutateCart();
                        }
                    }
                } catch (error) {
                    // Silently fail - don't block user from checkout
                    console.error('Error validating cart:', error);
                }
            } else {
                // Validate guest cart
                await validateGuestCart();
            }
        };

        checkCartValidation();
    }, [isLoggedIn, mounted, cartLoading, cartEmpty, mutateCart, validateGuestCart]);

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
                        
                        // Chỉ kiểm tra quantity > 0 (còn mã giảm giá)
                        const discountQuantity = discount?.quantity || 0;
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal &&
                            discountQuantity > 0;
                        
                        price = hasValidDiscount
                            ? discount.priceDiscount
                            : priceOriginal;
                    } else if (typeof product.price === 'object') {
                        const priceOriginal = product.price.priceOriginal || product.price.original || 0;
                        const discount = product.price.discount;
                        
                        // Chỉ kiểm tra quantity > 0 (còn mã giảm giá)
                        const discountQuantity = discount?.quantity || 0;
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal &&
                            discountQuantity > 0;
                        
                        price = hasValidDiscount
                            ? discount.priceDiscount
                            : priceOriginal;
                    }
                }

                const itemOptions = Array.isArray(item.options) ? item.options : [];
                
                // Get product image
                const productImage = product?.image?.[0] || product?.imageSrc || null;

                return {
                    id: productId,
                    productName,
                    price,
                    quantity: item.quantity || 1,
                    options: itemOptions,
                    image: productImage,
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
                image: product.imageSrc || null,
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
        if (cartEmpty) return;

        if (!validateForm()) {
            setTouched({
                fullName: true,
                phone: true,
                email: true,
            });
            return;
        }

        // Check stock before submitting
        try {
            if (!cart || cart.products.length === 0) {
                showError('Giỏ hàng trống');
                return;
            }

            // Prepare items for stock check
            const items = cart.products.map((product: any) => ({
                productId: product.id,
                quantity: product.quantity || 1,
            }));

            // Check stock via API
            const stockCheckResult = await checkProductsStock(items);
            
            if (stockCheckResult.success && stockCheckResult.data) {
                // Find products with stock = 0
                const outOfStockProducts = stockCheckResult.data.filter(
                    (item) => !item.isAvailable || item.stock === 0
                );

                if (outOfStockProducts.length > 0) {
                    // Remove out-of-stock products
                    for (const outOfStockProduct of outOfStockProducts) {
                        if (isLoggedIn) {
                            // Remove from API cart
                            try {
                                await removeFromCartAPI(outOfStockProduct.productId);
                            } catch (error) {
                                console.error('Error removing product from cart:', error);
                            }
                        } else {
                            // Remove from Redux cart
                            dispatch(removeFromCart(outOfStockProduct.productId));
                        }
                    }

                    // Show modal notification
                    setOutOfStockMessage(
                        `${outOfStockProducts.length} sản phẩm đã hết hàng và sẽ được gỡ khỏi giỏ hàng. Bạn vẫn có thể thanh toán các sản phẩm còn lại.`
                    );
                    setIsOutOfStockModalOpen(true);

                    // Revalidate cart
                    if (isLoggedIn) {
                        await mutateCart();
                    }

                    // Stop submission - user needs to review updated cart
                    setSubmitting(false);
                    return;
                }
            }
        } catch (error) {
            console.error('Error checking stock:', error);
            // Continue with checkout even if stock check fails
        }

        // Lưu cart trước khi submit để giữ nguyên giá khi đang xử lý
        savedCartRef.current = cart;

        setSubmitting(true);

        try {
            let response: { 
                success: boolean; 
                data: any; 
                message: string;
                hasChanges?: boolean;
                validationResult?: any;
            };

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

            // Check if response indicates cart changes
            if (response.hasChanges && response.validationResult) {
                // Show modal with cart changes
                setCartChangesData(response.validationResult);
                setIsCartChangesModalOpen(true);
                setSubmitting(false);
                savedCartRef.current = null;
                
                // Update cart if logged in
                if (isLoggedIn) {
                    await mutateCart();
                }
                return;
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
            // Check if error response has validationResult
            if (error?.response?.data?.hasChanges && error?.response?.data?.validationResult) {
                setCartChangesData(error.response.data.validationResult);
                setIsCartChangesModalOpen(true);
                setSubmitting(false);
                savedCartRef.current = null;
                
                // Update cart if logged in
                if (isLoggedIn) {
                    await mutateCart();
                }
                return;
            }
            
            const errorMessage =
                error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!';
            
            // Check if error is related to discount code (usage limit or validation error)
            const isDiscountCodeError = errorMessage.toLowerCase().includes('mã giảm giá') ||
                errorMessage.toLowerCase().includes('discount') ||
                errorMessage.toLowerCase().includes('hết lượt') ||
                errorMessage.toLowerCase().includes('usage') ||
                errorMessage.toLowerCase().includes('usageLimit') ||
                errorMessage.toLowerCase().includes('không hợp lệ') ||
                errorMessage.toLowerCase().includes('invalid');

            if (isDiscountCodeError) {
                // Remove discount code from cart when discount code error occurs
                const discountCode = isLoggedIn 
                    ? (cartData?.data as any)?.discountCode 
                    : reduxCart.couponCode;
                
                if (discountCode) {
                    if (isLoggedIn) {
                        try {
                            await removeDiscountCodeAPI();
                            await mutateCart();
                        } catch (removeError) {
                            console.error('Error removing discount code:', removeError);
                        }
                    } else {
                        // Remove discount code from Redux cart for guest users
                        dispatch(removeCoupon());
                        dispatch(clearDiscountCode());
                    }
                }
                
                showError(`${errorMessage}. Mã giảm giá đã được gỡ khỏi giỏ hàng và tổng tiền đã được tính lại.`);
            } else {
                showError(errorMessage);
            }
            
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
                {/* Login Prompt Modal for Guest Users */}
                {showLoginPrompt && !isLoggedIn && !cartEmpty && (
                    <div className={cx('login-prompt-modal-backdrop')} onClick={handleContinueAsGuest}>
                        <div className={cx('login-prompt-modal')} onClick={(e) => e.stopPropagation()}>
                            <div className={cx('login-prompt-modal-icon')}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h2 className={cx('login-prompt-modal-title')}>
                                Đăng nhập để nhận nhiều ưu đãi
                            </h2>
                            <p className={cx('login-prompt-modal-desc')}>
                                Đăng nhập ngay để tích điểm, sử dụng mã giảm giá dành riêng cho thành viên và thanh toán nhanh hơn!
                            </p>
                            <div className={cx('login-prompt-modal-actions')}>
                                <button 
                                    className={cx('login-prompt-modal-btn', 'login-btn')} 
                                    onClick={handleLoginPrompt}
                                    type="button"
                                >
                                    Đăng nhập ngay
                                </button>
                                <button 
                                    className={cx('login-prompt-modal-btn', 'guest-btn')} 
                                    onClick={handleContinueAsGuest}
                                    type="button"
                                >
                                    Tiếp tục mua hàng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                    placeholder="Nhập số điện thoại (Zalo)"
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
                                    {p.image && (
                                        <div className={cx('item-image')}>
                                            <Image
                                                src={p.image}
                                                alt={p.productName}
                                                width={100}
                                                height={100}
                                                className={cx('product-image')}
                                            />
                                        </div>
                                    )}
                                    <div className={cx('item-info')}>
                                        <div className={cx('item-name')}>
                                            {p.productName}
                                            <span className={cx('x')}> × {p.quantity}</span>
                                        </div>
                                        <div className={cx('item-subtotal')}>
                                            {formatPrice(p.price * p.quantity)}₫
                                        </div>
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
                            disabled={
                                submitting || 
                                cartEmpty || 
                                (isCartChangesModalOpen && cartChangesData && (
                                    (cartChangesData.priceChanges && cartChangesData.priceChanges.length > 0) ||
                                    (cartChangesData.stockIssues && cartChangesData.stockIssues.length > 0)
                                ))
                            }
                            type="button"
                        >
                            {submitting ? 'Đang xử lý...' : 'Đặt Hàng'}
                        </button>
                    </aside>
                </div>
            </div>

            {/* Out of Stock Modal */}
            {isOutOfStockModalOpen && (
                <div className={cx('tos-modal-backdrop')} role="dialog" aria-modal="true" onClick={() => setIsOutOfStockModalOpen(false)}>
                    <div className={cx('tos-modal')} onClick={(e) => e.stopPropagation()}>
                        <h3 className={cx('tos-modal-title')}>
                            Thông báo
                        </h3>
                        <div className={cx('tos-modal-message')}>
                            <p>
                                {outOfStockMessage && (
                                    <>
                                        <span className={cx('out-of-stock-count')}>
                                            {outOfStockMessage.match(/^\d+/)?.[0] || ''} sản phẩm
                                        </span>
                                        {' '}
                                        {outOfStockMessage.replace(/^\d+\s*sản phẩm\s*/, '')}
                                    </>
                                )}
                            </p>
                        </div>
                        <div className={cx('tos-modal-actions')}>
                            <button 
                                className={cx('tos-confirm-button')} 
                                onClick={() => setIsOutOfStockModalOpen(false)}
                            >
                                Đã hiểu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Changes Modal */}
            {isCartChangesModalOpen && cartChangesData && (
                <div className={cx('tos-modal-backdrop')} role="dialog" aria-modal="true" onClick={() => setIsCartChangesModalOpen(false)}>
                    <div className={cx('tos-modal', 'cart-changes-modal')} onClick={(e) => e.stopPropagation()}>
                        {/* Check if only discount code issue (no price changes or stock issues) */}
                        {(() => {
                            const hasPriceChanges = cartChangesData.priceChanges && cartChangesData.priceChanges.length > 0;
                            const hasStockIssues = cartChangesData.stockIssues && cartChangesData.stockIssues.length > 0;
                            const hasDiscountIssue = !!cartChangesData.discountCodeIssue;
                            const isOnlyDiscountIssue = hasDiscountIssue && !hasPriceChanges && !hasStockIssues;

                            if (isOnlyDiscountIssue) {
                                // Show discount code specific modal
                                return (
                                    <>
                                        <div className={cx('cart-changes-header')}>
                                            <div className={cx('cart-changes-icon')}>
                                                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.1"/>
                                                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <h3 className={cx('cart-changes-title')}>
                                                Mã giảm giá không hợp lệ
                                            </h3>
                                            <p className={cx('cart-changes-subtitle')}>
                                                Mã giảm giá đã được gỡ khỏi giỏ hàng
                                            </p>
                                        </div>
                                        <div className={cx('cart-changes-content')}>
                                            {cartChangesData.discountCodeIssue && (
                                                <div className={cx('discount-code-issue', 'discount-code-issue-centered')}>
                                                    <div className={cx('discount-code-icon')}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                    <div className={cx('discount-code-content')}>
                                                        <span className={cx('discount-code-label')}>Mã giảm giá</span>
                                                        <span className={cx('discount-code-value')}>{cartChangesData.discountCodeIssue.code}</span>
                                                        <span className={cx('discount-code-message')}>{cartChangesData.discountCodeIssue.message}</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className={cx('cart-changes-footer')}>
                                                <div className={cx('cart-changes-footer-icon')}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                                <p className={cx('cart-changes-footer-text')}>
                                                    Tổng tiền đã được tính lại và cập nhật tự động
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                );
                            }

                            // Show normal cart changes modal
                            return (
                                <>
                                    <div className={cx('cart-changes-header')}>
                                        <div className={cx('cart-changes-icon')}>
                                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.1"/>
                                                <path d="M12 16V12M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <h3 className={cx('cart-changes-title')}>
                                            Giỏ hàng đã được cập nhật
                                        </h3>
                                        <p className={cx('cart-changes-subtitle')}>
                                            {cartChangesData.priceChanges?.length || 0} sản phẩm đã thay đổi giá
                                        </p>
                                    </div>
                                    <div className={cx('cart-changes-content')}>
                                        {cartChangesData.priceChanges && cartChangesData.priceChanges.length > 0 && (
                                <div className={cx('price-changes-list')}>
                                    {cartChangesData.priceChanges.map((change: any, index: number) => (
                                        <Link
                                            key={index}
                                            href={change.productHref || '#'}
                                            className={cx('price-change-item')}
                                            onClick={(e) => {
                                                // Không đóng modal khi click vào item, chỉ navigate
                                                e.stopPropagation();
                                                // Lưu trạng thái modal vào sessionStorage trước khi navigate
                                                // để có thể hiển thị lại khi user quay lại trang checkout
                                                if (typeof window !== 'undefined' && cartChangesData) {
                                                    sessionStorage.setItem('checkout_pending_cart_changes', JSON.stringify(cartChangesData));
                                                }
                                            }}
                                        >
                                            <div className={cx('price-change-product')}>
                                                {change.productImage && (
                                                    <div className={cx('price-change-image')}>
                                                        <Image
                                                            src={change.productImage}
                                                            alt={change.productName}
                                                            width={118}
                                                            height={72}
                                                            className={cx('product-thumb')}
                                                        />
                                                    </div>
                                                )}
                                                <div className={cx('price-change-info')}>
                                                    <div className={cx('price-change-name')}>{change.productName}</div>
                                                    <div className={cx('price-change-prices')}>
                                                        <div className={cx('price-group', 'old-price-group')}>
                                                            <span className={cx('price-label')}>Giá cũ</span>
                                                            <div className={cx('price-value-wrapper')}>
                                                                {/*
                                                                 * Ưu tiên dùng bộ đôi oldPriceDiscount + oldPriceOriginal nếu backend trả về.
                                                                 * Nếu không có, nhưng tồn tại oldPriceOriginal > oldPrice (hoặc oldPrice > oldPriceOriginal),
                                                                 * ta suy luận giá giảm & giá gốc từ 2 giá trị đó để luôn hiển thị đủ 2 dòng khi có khuyến mãi.
                                                                 */}
                                                                {change.oldPriceDiscount && change.oldPriceOriginal && change.oldPriceOriginal > change.oldPriceDiscount ? (
                                                                    <>
                                                                        <span className={cx('price-discount')}>
                                                                            {formatPrice(change.oldPriceDiscount)}₫
                                                                        </span>
                                                                        <span className={cx('price-original')}>
                                                                            {formatPrice(change.oldPriceOriginal)}₫
                                                                        </span>
                                                                    </>
                                                                ) : change.oldPrice && change.oldPriceOriginal && change.oldPriceOriginal > change.oldPrice ? (
                                                                    <>
                                                                        <span className={cx('price-discount')}>
                                                                            {formatPrice(change.oldPrice)}₫
                                                                        </span>
                                                                        <span className={cx('price-original')}>
                                                                            {formatPrice(change.oldPriceOriginal)}₫
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className={cx('price-normal')}>
                                                                        {formatPrice(change.oldPriceOriginal || change.oldPrice || change.newPrice)}₫
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className={cx('price-arrow')}>
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </div>
                                                        <div className={cx('price-group', 'new-price-group')}>
                                                            <span className={cx('price-label')}>Giá mới</span>
                                                            <div className={cx('price-value-wrapper')}>
                                                                {change.newPriceDiscount && change.newPriceOriginal > change.newPriceDiscount ? (
                                                                    <>
                                                                        <span className={cx('price-discount', 'highlight')}>
                                                                            {formatPrice(change.newPriceDiscount)}₫
                                                                        </span>
                                                                        <span className={cx('price-original')}>
                                                                            {formatPrice(change.newPriceOriginal)}₫
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className={cx('price-normal', 'highlight')}>
                                                                        {formatPrice(change.newPrice)}₫
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {cartChangesData.stockIssues && cartChangesData.stockIssues.length > 0 && (
                                <div className={cx('stock-issues-list')}>
                                    {cartChangesData.stockIssues.map((issue: any, index: number) => (
                                        <div key={index} className={cx('stock-issue-item')}>
                                            {issue.productImage && (
                                                <div className={cx('stock-issue-image')}>
                                                    <Image
                                                        src={issue.productImage}
                                                        alt={issue.productName}
                                                        width={48}
                                                        height={48}
                                                        className={cx('product-thumb')}
                                                    />
                                                </div>
                                            )}
                                            <div className={cx('stock-issue-content')}>
                                                <span className={cx('stock-issue-name')}>{issue.productName}</span>
                                                <span className={cx('stock-issue-message')}>{issue.message}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                                        {(() => {
                                            const hasPriceChanges = cartChangesData.priceChanges && cartChangesData.priceChanges.length > 0;
                                            const hasStockIssues = cartChangesData.stockIssues && cartChangesData.stockIssues.length > 0;
                                            const hasDiscountIssue = !!cartChangesData.discountCodeIssue;
                                            const isOnlyDiscountIssue = hasDiscountIssue && !hasPriceChanges && !hasStockIssues;
                                            return cartChangesData.discountCodeIssue && !isOnlyDiscountIssue;
                                        })() && (
                                            <div className={cx('discount-code-issue')}>
                                                <div className={cx('discount-code-icon')}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                                <div className={cx('discount-code-content')}>
                                                    <span className={cx('discount-code-label')}>Mã giảm giá</span>
                                                    <span className={cx('discount-code-value')}>{cartChangesData.discountCodeIssue.code}</span>
                                                    <span className={cx('discount-code-message')}>{cartChangesData.discountCodeIssue.message}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className={cx('cart-changes-footer')}>
                                            <div className={cx('cart-changes-footer-icon')}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <p className={cx('cart-changes-footer-text')}>
                                                Tổng tiền đã được tính lại và cập nhật tự động
                                            </p>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}

                        <div className={cx('tos-modal-actions')}>
                            <button 
                                className={cx('tos-confirm-button')} 
                                onClick={() => {
                                    setIsCartChangesModalOpen(false);
                                    setCartChangesData(null);
                                    // Remove from sessionStorage when user confirms
                                    if (typeof window !== 'undefined') {
                                        sessionStorage.removeItem('checkout_pending_cart_changes');
                                    }
                                }}
                            >
                                Đã hiểu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutLayout;



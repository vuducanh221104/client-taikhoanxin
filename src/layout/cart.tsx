/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
    updateProductPrice,
} from '@/redux/cartSlice';
import {
    setDiscountCode,
    setReferralCode,
    clearDiscountCode,
    clearReferralCode,
} from '@/redux/authSlice';
import EmptyState from '@/components/EmptyState';
import { useConfirm } from '@/components/ConfirmDialog';
import {
    useCart,
    removeFromCart as removeFromCartAPI,
    clearCart as clearCartAPI,
    applyDiscountCode as applyDiscountCodeAPI,
    removeDiscountCode as removeDiscountCodeAPI,
    updateCartItem as updateCartItemAPI,
    validateCart,
} from '@/services/cartService';
import {
    applyReferralCode as applyReferralCodeAPI,
    removeReferralCode as removeReferralCodeAPI,
} from '@/services/referralCodeService';
import { validateDiscountCode } from '@/services/discountCodeService';
import { checkProductsStock, type Product } from '@/services/productService';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/useToast';
import { useDebounceCallback } from '@/hooks/useDebounceCallback';
import { useRouter } from 'next/navigation';

const cx = classNames.bind(styles);

const CartLayout: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const reduxCart = useSelector((state: RootState) => state.cart);
    const savedDiscountCode = useSelector((state: RootState) => state.auth.discountCode);
    const savedReferralCode = useSelector((state: RootState) => state.auth.referralCode);
    const { confirm } = useConfirm();
    const { showSuccess, showError, showInfo } = useToast();
    const { mutate: globalMutate } = useSWRConfig();
    const [isCheckingStock, setIsCheckingStock] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const hasCheckedStockRef = useRef(false);
    const [isOutOfStockModalOpen, setIsOutOfStockModalOpen] = useState(false);
    const [outOfStockProducts, setOutOfStockProducts] = useState<Array<{ productId: string; name: string; imageSrc?: string; href?: string }>>([]);
    const [isCartChangesModalOpen, setIsCartChangesModalOpen] = useState(false);
    const [cartChangesData, setCartChangesData] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    // Fetch cart from API if user is logged in
    const {
        data: cartData,
        isLoading: cartLoading,
        mutate: mutateCart,
    } = useCart();

    // Track previous discountCode to detect when it's removed
    const prevDiscountCodeRef = useRef<string | null>(savedDiscountCode);
    // Track if user manually removed discount code to avoid duplicate messages
    const isManualRemovalRef = useRef<boolean>(false);

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

    // Set mounted flag
    useEffect(() => {
        setMounted(true);
    }, []);

    // Restore out-of-stock modal from sessionStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pendingOutOfStockData = sessionStorage.getItem('cart_pending_out_of_stock');
            if (pendingOutOfStockData) {
                try {
                    const data = JSON.parse(pendingOutOfStockData);
                    setOutOfStockProducts(data);
                    setIsOutOfStockModalOpen(true);
                } catch (error) {
                    console.error('Error parsing pending out-of-stock data:', error);
                    sessionStorage.removeItem('cart_pending_out_of_stock');
                }
            }

            // Check if there's a pending cart changes modal that wasn't confirmed
            const pendingModalData = sessionStorage.getItem('cart_pending_cart_changes');
            if (pendingModalData) {
                try {
                    const data = JSON.parse(pendingModalData);
                    setCartChangesData(data);
                    setIsCartChangesModalOpen(true);
                } catch (error) {
                    console.error('Error parsing pending cart changes data:', error);
                    sessionStorage.removeItem('cart_pending_cart_changes');
                }
            }
        }
    }, []);

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
                    const isManualRemoval = isManualRemovalRef.current;

                    dispatch(clearDiscountCode());
                    dispatch(removeCoupon());
                    setCouponInput('');
                    setCouponSuccess('');
                    setCouponError('');

                    // Only show error message if it was removed automatically (not by user)
                    if (wasRemoved && !isManualRemoval) {
                        showError('Mã giảm giá không còn hợp lệ và đã được xóa');
                    }

                    // Reset manual removal flag
                    isManualRemovalRef.current = false;
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

    // Xóa mã giảm giá khi cart rỗng (guest user)
    useEffect(() => {
        if (!currentUser && reduxCart.products.length === 0 && savedDiscountCode) {
            // Cart is empty, remove discount code
            dispatch(clearDiscountCode());
            dispatch(removeCoupon());
        }
    }, [reduxCart.products.length, currentUser, savedDiscountCode, dispatch]);

    // Xóa mã giảm giá khi cart rỗng (user - API cart)
    useEffect(() => {
        if (currentUser && cartData?.data) {
            const apiCart = cartData.data as any;
            const cartItems = apiCart.items || [];
            if (cartItems.length === 0 && savedDiscountCode) {
                // Cart is empty, remove discount code
                dispatch(clearDiscountCode());
                // Remove from API cart
                removeDiscountCodeAPI().catch(() => {
                    // Ignore error
                });
            }
        }
    }, [cartData?.data, currentUser, savedDiscountCode, dispatch]);

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
                        const priceOriginal = priceItem?.priceOriginal || priceItem?.original || 0;
                        const discount = priceItem?.discount;
                        
                        // Only use priceDiscount if it's valid:
                        // 1. priceDiscount > 0 and < priceOriginal
                        // 2. quantity > 0 (còn mã giảm giá)
                        const quantity = discount?.quantity || 0;
                        
                        // Chỉ kiểm tra quantity > 0
                        const isDiscountAvailable = quantity > 0;
                        
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal &&
                            isDiscountAvailable;
                        
                        price = hasValidDiscount
                            ? discount.priceDiscount
                            : priceOriginal;
                    } else if (typeof product.price === 'object') {
                        const priceOriginal = product.price.priceOriginal || product.price.original || 0;
                        const discount = product.price.discount;
                        
                        // Only use priceDiscount if it's valid:
                        // 1. priceDiscount > 0 and < priceOriginal
                        // 2. quantity > 0 (còn mã giảm giá)
                        const quantity = discount?.quantity || 0;
                        
                        // Chỉ kiểm tra quantity > 0
                        const isDiscountAvailable = quantity > 0;
                        
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal &&
                            isDiscountAvailable;
                        
                        price = hasValidDiscount
                            ? discount.priceDiscount
                            : priceOriginal;
                    }
                }

                // Calculate oldPrice: only show if there's a valid discount
                let oldPrice: number | undefined = undefined;
                if (product?.price) {
                    let priceOriginal = 0;
                    if (Array.isArray(product.price)) {
                        priceOriginal = product.price[0]?.priceOriginal || product.price[0]?.original || 0;
                        const discount = product.price[0]?.discount;
                        // Only show oldPrice if there's a valid discount:
                        // 1. priceDiscount > 0 and < priceOriginal
                        // 2. quantity > 0 (còn mã giảm giá)
                        const quantity = discount?.quantity || 0;
                        const isDiscountAvailable = quantity > 0;
                        
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal &&
                            isDiscountAvailable;
                        if (hasValidDiscount && priceOriginal > 0 && price !== priceOriginal) {
                            oldPrice = priceOriginal;
                        }
                    } else if (typeof product.price === 'object') {
                        priceOriginal = product.price.priceOriginal || product.price.original || 0;
                        const discount = product.price.discount;
                        // Only show oldPrice if there's a valid discount:
                        // 1. priceDiscount > 0 and < priceOriginal
                        // 2. quantity > 0 (còn mã giảm giá)
                        const quantity = discount?.quantity || 0;
                        const isDiscountAvailable = quantity > 0;
                        
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal &&
                            isDiscountAvailable;
                        if (hasValidDiscount && priceOriginal > 0 && price !== priceOriginal) {
                            oldPrice = priceOriginal;
                        }
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
                couponError: apiCart.discountError || undefined,
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
            ...reduxCart,
            totalDiscountBefore,
            totalPrice, // Total after discount
            couponDiscount,
        };
    }, [cartData, currentUser, reduxCart]);

    const formatPrice = (value: number): string => value.toLocaleString('vi-VN');

    // Check stock and remove out-of-stock products
    const checkAndRemoveOutOfStockProducts = useCallback(async () => {
        if (!cart || cart.products.length === 0) return;

        setIsCheckingStock(true);
        try {
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
                    // Map to get product names, images, and href from cart
                    const outOfStockProductsWithNames = outOfStockProducts.map((item) => {
                        const cartProduct = cart.products.find((p: any) => p.id === item.productId);
                        return {
                            productId: item.productId,
                            name: cartProduct?.productName || item.name || 'Sản phẩm không xác định',
                            imageSrc: cartProduct?.imageSrc || undefined,
                            href: cartProduct?.href || `#`,
                        };
                    });

                    // Remove out-of-stock products
                    for (const outOfStockProduct of outOfStockProducts) {
                        if (currentUser) {
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

                    // Show modal notification with product list
                    setOutOfStockProducts(outOfStockProductsWithNames);
                    setIsOutOfStockModalOpen(true);
                    // Save to sessionStorage so modal can be restored when user navigates back
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('cart_pending_out_of_stock', JSON.stringify(outOfStockProductsWithNames));
                    }

                    // Revalidate cart
                    if (currentUser) {
                        await mutateCart();
                    }
                }
            }
        } catch (error) {
            console.error('Error checking stock:', error);
            // Don't show error to user, just log it
        } finally {
            setIsCheckingStock(false);
        }
    }, [cart, currentUser, dispatch, mutateCart, removeFromCartAPI]);

    // Validate and sync guest cart with latest prices and stock
    const validateAndSyncGuestCart = useCallback(async () => {
        if (currentUser || !reduxCart.products || reduxCart.products.length === 0) return;

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

            // Update Redux cart with latest prices
            let hasChanges = false;
            const updatedProducts = reduxCart.products.map((cartProduct: any) => {
                const latestProduct = productMap.get(cartProduct.id);
                if (!latestProduct) return cartProduct;

                // Calculate latest price and oldPrice
                let latestPrice = 0;
                let latestOldPrice: number | undefined = undefined;
                let priceOriginal = 0;
                
                if (latestProduct.price) {
                    if (Array.isArray(latestProduct.price)) {
                        const priceItem = latestProduct.price[0];
                        priceOriginal = priceItem?.priceOriginal || priceItem?.original || 0;
                        const discount = priceItem?.discount;
                        
                        const quantity = discount?.quantity || 0;
                        const isDiscountAvailable = quantity > 0;
                        
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal &&
                            isDiscountAvailable;
                        
                        latestPrice = hasValidDiscount ? discount.priceDiscount : priceOriginal;
                        if (hasValidDiscount && priceOriginal > 0 && latestPrice !== priceOriginal) {
                            latestOldPrice = priceOriginal;
                        }
                    } else if (typeof latestProduct.price === 'object' && latestProduct.price !== null) {
                        const priceObj = latestProduct.price as any;
                        priceOriginal = priceObj?.priceOriginal || priceObj?.original || 0;
                        const discount = priceObj?.discount;
                        
                        const quantity = discount?.quantity || 0;
                        const isDiscountAvailable = quantity > 0;
                        
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal &&
                            isDiscountAvailable;
                        
                        latestPrice = hasValidDiscount ? discount.priceDiscount : priceOriginal;
                        if (hasValidDiscount && priceOriginal > 0 && latestPrice !== priceOriginal) {
                            latestOldPrice = priceOriginal;
                        }
                    }
                }

                // Check if price changed
                if (cartProduct.price !== latestPrice) {
                    hasChanges = true;
                    return {
                        ...cartProduct,
                        price: latestPrice,
                        oldPrice: latestOldPrice,
                        stock: latestProduct.stock || 0,
                    };
                } else if (cartProduct.oldPrice !== latestOldPrice) {
                    // Update oldPrice even if price didn't change
                    hasChanges = true;
                    return {
                        ...cartProduct,
                        oldPrice: latestOldPrice,
                        stock: latestProduct.stock || 0,
                    };
                }

                // Update stock even if price didn't change
                if (cartProduct.stock !== (latestProduct.stock || 0)) {
                    hasChanges = true;
                    return {
                        ...cartProduct,
                        stock: latestProduct.stock || 0,
                    };
                }

                return cartProduct;
            });

            // Update Redux if there are changes - need to update each product individually
            if (hasChanges) {
                updatedProducts.forEach((product: any) => {
                    // Update price (and stock) in Redux so UI reflects latest pricing immediately
                    if (typeof product?.price === 'number') {
                        dispatch(
                            updateProductPrice({
                                id: product.id,
                                price: product.price,
                                stock: product.stock,
                            }),
                        );
                    }
                });
            }

            // Validate discount code if exists
            if (savedDiscountCode && updatedProducts.length > 0) {
                try {
                    const orderValue = updatedProducts.reduce((sum: number, p: any) => sum + (p.price * p.quantity), 0);
                    const productIdsForValidation = updatedProducts.map((p: any) => p.id).filter(Boolean);
                    
                    const discountResponse = await validateDiscountCode({
                        code: savedDiscountCode,
                        orderValue,
                        productIds: productIdsForValidation,
                    });

                    if (discountResponse.success && discountResponse.data?.discountAmount !== undefined) {
                        const discountAmount = discountResponse.data.discountAmount || 0;
                        dispatch(applyCoupon({
                            code: savedDiscountCode,
                            discount: discountAmount,
                        }));
                    } else {
                        // Discount code is invalid, remove it
                        dispatch(clearDiscountCode());
                        dispatch(removeCoupon());
                        setCouponInput('');
                        setCouponSuccess('');
                        setCouponError(discountResponse.message || 'Mã giảm giá không còn hợp lệ');
                    }
                } catch (error) {
                    console.error('Error validating discount code:', error);
                    // Don't remove discount code on error, just log it
                }
            }

            // Check stock and remove out-of-stock products (will use updated cart)
            await checkAndRemoveOutOfStockProducts();
        } catch (error) {
            console.error('Error validating guest cart:', error);
            // Don't show error to user, just log it
        }
    }, [currentUser, reduxCart, savedDiscountCode, dispatch, checkAndRemoveOutOfStockProducts]);

    // Validate guest cart - Check prices, stock, and discount code
    const validateGuestCartForChanges = React.useCallback(async () => {
        if (currentUser || !mounted || !reduxCart.products || reduxCart.products.length === 0) return;

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
                        latestPriceOriginal = priceItem?.priceOriginal || priceItem?.original || 0;
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
                        latestPriceOriginal = priceObj?.priceOriginal || priceObj?.original || 0;
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
                    
                    // Calculate product href
                    let productHref = '#';
                    if (cartProduct.href && cartProduct.href !== '#') {
                        productHref = cartProduct.href;
                    } else if (latestProduct.slug) {
                        productHref = `/product/${latestProduct.slug}`;
                    } else if (cartProduct.id) {
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
                    sessionStorage.setItem('cart_pending_cart_changes', JSON.stringify(validationResult));
                }
            }
        } catch (error) {
            // Silently fail - don't block user from viewing cart
            console.error('Error validating guest cart:', error);
        }
    }, [currentUser, mounted, reduxCart, dispatch]);

    // Validate and sync guest cart when component mounts
    useEffect(() => {
        if (!currentUser && reduxCart.products.length > 0) {
            validateAndSyncGuestCart();
        }
    }, []); // Only run once on mount for guest user

    // Track if validation has been run to avoid running multiple times
    const hasValidatedRef = useRef(false);

    // Validate cart when entering cart page (for both logged-in and guest users)
    useEffect(() => {
        const checkCartValidation = async () => {
            if (!mounted || hasValidatedRef.current) return;

            const isLoggedIn = Boolean(currentUser?.accessToken);
            const cartEmpty = isLoggedIn 
                ? (cartLoading || !cartData?.data || ((cartData.data as any)?.items || []).length === 0)
                : reduxCart.products.length === 0;

            if (cartEmpty) {
                hasValidatedRef.current = true;
                return;
            }

            if (isLoggedIn) {
                // Validate logged-in user cart
                if (cartLoading) return;

                hasValidatedRef.current = true;

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
                            sessionStorage.setItem('cart_pending_cart_changes', JSON.stringify(validationResult));
                        }
                        
                        // Update cart if it was updated (even if discount code was already removed above)
                        if (validationResponse.cart) {
                            await mutateCart();
                        }
                    }
                } catch (error) {
                    // Silently fail - don't block user from viewing cart
                    console.error('Error validating cart:', error);
                }
            } else {
                // Validate guest cart
                hasValidatedRef.current = true;
                await validateGuestCartForChanges();
            }
        };

        const isLoggedIn = Boolean(currentUser?.accessToken);
        
        // Only check if cart is loaded (for logged-in users)
        if (isLoggedIn && cartLoading) return;
        
        checkCartValidation();
    }, [currentUser, mounted, cartLoading, cartData, reduxCart.products.length, mutateCart, validateGuestCartForChanges]);

    // Check stock when cart loads (only once per cart load)
    useEffect(() => {
        if (cart && cart.products.length > 0 && !cartLoading && !hasCheckedStockRef.current) {
            hasCheckedStockRef.current = true;
            checkAndRemoveOutOfStockProducts().finally(() => {
                // Reset flag after a delay to allow re-check if cart changes significantly
                setTimeout(() => {
                    hasCheckedStockRef.current = false;
                }, 5000);
            });
        } else if (cart && cart.products.length === 0) {
            // Reset flag when cart is empty
            hasCheckedStockRef.current = false;
        }
    }, [cart?.products.length, cartLoading, checkAndRemoveOutOfStockProducts]); // Only check when cart products change or cart finishes loading

    const handleRemove = async (id: string) => {
        if (currentUser) {
            try {
                await removeFromCartAPI(id);
                const updatedCart = await mutateCart();
                showSuccess('Đã xóa sản phẩm khỏi giỏ hàng');
                
                // Check if cart is empty after removal - if so, remove discount code
                const cartItems = (updatedCart?.data as any)?.items || [];
                if (cartItems.length === 0) {
                    // Cart is empty, remove discount code
                    dispatch(clearDiscountCode());
                    try {
                        await removeDiscountCodeAPI();
                    } catch (err) {
                        // Ignore error if removeDiscountCode fails
                    }
                }
            } catch (error: any) {
                const errorMessage =
                    error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
                showError(errorMessage);
            }
        } else {
            dispatch(removeFromCart(id));
            showSuccess('Đã xóa sản phẩm khỏi giỏ hàng');
        }
    };

    const handleIncrease = (id: string, qty: number) => {
        const product = cart.products.find((p: any) => p.id === id);
        const max = (product as any)?.max || 100;
        const stock = (product as any)?.stock;

        const newQuantity = qty + 1;

        if (newQuantity > max) {
            showError(`Số lượng tối đa là ${max}`);
            return;
        }

        // Chỉ validate stock nếu stock có giá trị (không phải undefined hoặc null)
        if (stock !== undefined && stock !== null && newQuantity > stock) {
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
            // Guest user: validate discount code via API
            try {
                // Calculate order value from cart
                const orderValue = cart?.totalDiscountBefore || cart?.totalPrice || 0;
                
                // Get product IDs from cart products
                const productIds = cart?.products?.map((product: any) => {
                    return product.id;
                }).filter(Boolean) || [];

                // Validate discount code via API
                const response = await validateDiscountCode({
                    code: couponInput.toUpperCase(),
                    orderValue,
                    productIds,
                });

                if (response.success && response.data?.discountAmount !== undefined) {
                    const discountAmount = response.data.discountAmount || 0;
                    const discountCode = response.data.code || couponInput.toUpperCase();
                    
                dispatch(
                    applyCoupon({
                            code: discountCode,
                            discount: discountAmount,
                    }),
                );

                    dispatch(setDiscountCode(discountCode));

                    setCouponSuccess(response.message || 'Áp dụng mã giảm giá thành công');
                setCouponError('');
                setCouponInput('');
                    showSuccess('Áp dụng mã giảm giá thành công');
            } else {
                    const errorMessage = response.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn';
                    setCouponError(errorMessage);
                setCouponSuccess('');
                    dispatch(clearDiscountCode());
                    dispatch(removeCoupon());
                    showError(errorMessage);
                }
            } catch (error: any) {
                const errorMessage =
                    error?.response?.data?.message || error?.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn';
                setCouponError(errorMessage);
                setCouponSuccess('');
                dispatch(clearDiscountCode());
                dispatch(removeCoupon());
                showError(errorMessage);
            }
        }
    };

    const handleRemoveCoupon = async () => {
        // Set flag to indicate manual removal
        isManualRemovalRef.current = true;
        
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
                // Reset flag on error
                isManualRemovalRef.current = false;
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
                                                    // Xóa mã giảm giá khi clear cart
                                                    dispatch(clearDiscountCode());
                                                    try {
                                                        await removeDiscountCodeAPI();
                                                    } catch (err) {
                                                        // Ignore error
                                                    }
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
                                                // Xóa mã giảm giá khi clear cart (guest)
                                                dispatch(clearDiscountCode());
                                                dispatch(removeCoupon());
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
                                            actionHref="/"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table Layout */}
                                        {cart.products.map((p: any) => {
                                            const rowSubtotal = p.price * p.quantity;
                                            const rowOldSubtotal = p.oldPrice ? p.oldPrice * p.quantity : null;
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
                                                            <div className={cx('price-wrapper-desktop')}>
                                                                <div className={cx('price-discount')}>
                                                                    {formatPrice(rowSubtotal)}₫
                                                                </div>
                                                                {rowOldSubtotal && rowOldSubtotal > rowSubtotal && (
                                                                    <div className={cx('price-original-desktop')}>
                                                                        {formatPrice(rowOldSubtotal)}₫
                                                                    </div>
                                                                )}
                                                            </div>
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
                                                                <div className={cx('price-discount')}>
                                                                    {formatPrice(p.price)}₫
                                                                </div>
                                                                {p.oldPrice && p.oldPrice > p.price && (
                                                                    <div className={cx('price-original')}>
                                                                        {formatPrice(p.oldPrice)}₫
                                                                    </div>
                                                                )}
                                                                {discountPercent > 0 && (
                                                                    <span className={cx('discount-badge')}>
                                                                        -{discountPercent}%
                                                                    </span>
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
                                    disabled: cart.products.length === 0 || isCheckingStock || isProcessing,
                                })}
                                aria-disabled={cart.products.length === 0 || isCheckingStock || isProcessing}
                                onClick={async (e) => {
                                    if (cart.products.length === 0 || isCheckingStock || isProcessing) {
                                        e.preventDefault();
                                        return;
                                    }

                                    // Check stock before navigating to checkout
                                    e.preventDefault();
                                    setIsProcessing(true);
                                    
                                    try {
                                        await checkAndRemoveOutOfStockProducts();
                                        
                                        // Navigate to checkout after stock check
                                        if (cart.products.length > 0) {
                                            router.push('/checkout');
                                        } else {
                                            setIsProcessing(false);
                                        }
                                    } catch (error) {
                                        console.error('Error processing checkout:', error);
                                        setIsProcessing(false);
                                    }
                                }}
                            >
                                {isProcessing ? 'Đang xử lý...' : isCheckingStock ? 'Đang kiểm tra...' : 'Tiến hành thanh toán'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Out of Stock Modal */}
            {isOutOfStockModalOpen && (
                <div className={cx('tos-modal-backdrop')} role="dialog" aria-modal="true" onClick={() => setIsOutOfStockModalOpen(false)}>
                    <div className={cx('tos-modal')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('out-of-stock-header')}>
                            <div className={cx('out-of-stock-icon')}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0377 2.66667 10.2679 4L3.33975 16C2.56995 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className={cx('tos-modal-title')}>
                                {outOfStockProducts.length} sản phẩm đã hết hàng
                            </h3>
                            <p className={cx('out-of-stock-subtitle')}>
                                Các sản phẩm này sẽ được gỡ khỏi giỏ hàng của bạn
                            </p>
                        </div>
                        
                        <div className={cx('out-of-stock-list')}>
                            {outOfStockProducts.map((product) => (
                                <Link 
                                    key={product.productId} 
                                    href={product.href || '#'}
                                    className={cx('out-of-stock-item')}
                                    onClick={(e) => {
                                        // Don't close modal when clicking on product link
                                        e.stopPropagation();
                                        // Save modal state to sessionStorage before navigating
                                        // to restore when user comes back to cart page
                                        if (typeof window !== 'undefined' && outOfStockProducts.length > 0) {
                                            sessionStorage.setItem('cart_pending_out_of_stock', JSON.stringify(outOfStockProducts));
                                        }
                                    }}
                                >
                                    <div className={cx('out-of-stock-item-icon')}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <span className={cx('out-of-stock-item-name')}>{product.name}</span>
                                    {product.imageSrc && (
                                        <div className={cx('out-of-stock-item-image')}>
                                            <Image
                                                src={product.imageSrc}
                                                alt={product.name}
                                                width={100}
                                                height={48}
                                                className={cx('out-of-stock-image')}
                                            />
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>

                        <div className={cx('out-of-stock-footer')}>
                            <p className={cx('out-of-stock-footer-text')}>
                                Bạn vẫn có thể thanh toán các sản phẩm còn lại trong giỏ hàng.
                            </p>
                        </div>

                        <div className={cx('tos-modal-actions')}>
                            <button 
                                className={cx('tos-confirm-button')} 
                                onClick={() => {
                                    setIsOutOfStockModalOpen(false);
                                    setOutOfStockProducts([]);
                                    // Remove from sessionStorage when user confirms
                                    if (typeof window !== 'undefined') {
                                        sessionStorage.removeItem('cart_pending_out_of_stock');
                                    }
                                }}
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
                                                // để có thể hiển thị lại khi user quay lại trang cart
                                                if (typeof window !== 'undefined' && cartChangesData) {
                                                    sessionStorage.setItem('cart_pending_cart_changes', JSON.stringify(cartChangesData));
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
                                        sessionStorage.removeItem('cart_pending_cart_changes');
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

export default CartLayout;




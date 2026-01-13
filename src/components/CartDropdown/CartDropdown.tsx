'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './CartDropdown.module.scss';
import { CartIcon, XIcon, MinusIcon, PlusIcon, TrashIcon } from '@/components/Icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { removeFromCart, updateQuantity } from '@/redux/cartSlice';
import { useCart, removeFromCart as removeFromCartAPI, updateCartItem as updateCartItemAPI } from '@/services/cartService';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/useToast';
import { useDebounceCallback } from '@/hooks/useDebounceCallback';

const cx = classNames.bind(styles);

interface CartDropdownProps {
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
    onOverlayChange?: (visible: boolean) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({
    isOpen: controlledIsOpen,
    setIsOpen: controlledSetIsOpen,
    onOverlayChange,
    onMouseEnter: onMouseEnterProp,
    onMouseLeave: onMouseLeaveProp
}) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const reduxCart = useSelector((state: RootState) => state.cart);
    const { mutate: globalMutate } = useSWRConfig();
    const { showError } = useToast();

    // Fetch cart from API if user is logged in
    const { data: cartData } = useCart();

    // Track pending quantity updates - store oldCartData from first click and expected quantity
    const pendingUpdatesRef = React.useRef<Map<string, { oldCartData: any; productId: string; quantity: number; expectedQuantity: number }>>(new Map());

    // API call function for quantity update
    const updateQuantityAPI = React.useCallback(async (productId: string, quantity: number) => {
        if (!currentUser) return;

        const pendingUpdate = pendingUpdatesRef.current.get(productId);
        const oldCartData = pendingUpdate?.oldCartData;
        const expectedQuantity = pendingUpdate?.expectedQuantity;

        try {
            const response = await updateCartItemAPI(productId, quantity);

            // Only update cache if this response is for the latest expected quantity
            // This prevents old API responses from overwriting newer optimistic updates
            const currentPendingUpdate = pendingUpdatesRef.current.get(productId);
            if (currentPendingUpdate && currentPendingUpdate.expectedQuantity === expectedQuantity) {
                // This is the latest update, update cache
                await globalMutate('/api/v1/cart', response, { revalidate: false });
                // Remove from pending updates only if this is still the latest
                if (currentPendingUpdate.expectedQuantity === expectedQuantity) {
                    pendingUpdatesRef.current.delete(productId);
                }
            } else {
                // There's a newer update, ignore this response
                // Don't update cache, don't remove pending update
            }
        } catch (error: any) {
            // Only revert if this is still the latest update
            const currentPendingUpdate = pendingUpdatesRef.current.get(productId);
            if (currentPendingUpdate && currentPendingUpdate.expectedQuantity === expectedQuantity) {
                // Revert on error - restore old data
                if (oldCartData) {
                    await globalMutate('/api/v1/cart', oldCartData, { revalidate: false });
                }
                const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
                showError(errorMessage);

                // Remove from pending updates only if this is still the latest
                if (currentPendingUpdate.expectedQuantity === expectedQuantity) {
                    pendingUpdatesRef.current.delete(productId);
                }
            }
        }
    }, [currentUser, globalMutate, showError]);

    // Debounced API call for quantity update (200ms delay)
    const debouncedUpdateQuantity = useDebounceCallback(updateQuantityAPI, 600);

    // Use API cart if available, otherwise use Redux cart (for backward compatibility)
    const cart = React.useMemo(() => {
        if (currentUser && cartData?.data) {
            // Map API cart to Redux cart format
            const apiCart = cartData.data;
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

                // Calculate oldPrice: only show if there's a valid discount
                let oldPrice: number | undefined = undefined;
                if (product?.price) {
                    let priceOriginal = 0;
                    if (Array.isArray(product.price)) {
                        priceOriginal = product.price[0]?.priceOriginal || product.price[0]?.original || 0;
                        const discount = product.price[0]?.discount;
                        // Only show oldPrice if there's a valid discount
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal;
                        if (hasValidDiscount && priceOriginal > 0 && price !== priceOriginal) {
                            oldPrice = priceOriginal;
                        }
                    } else if (typeof product.price === 'object') {
                        priceOriginal = product.price.priceOriginal || product.price.original || 0;
                        const discount = product.price.discount;
                        // Only show oldPrice if there's a valid discount
                        const hasValidDiscount = discount?.priceDiscount !== undefined &&
                            discount.priceDiscount !== null &&
                            discount.priceDiscount > 0 &&
                            discount.priceDiscount < priceOriginal;
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

                // Always use slug for product link, never use id
                const productHref = slug ? `/product/${slug}` : `#`;

                // Get options from cart item
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
                    options: Array.isArray(options) ? options : [], // Ensure options is an array
                };
            });

            return {
                products: mappedProducts,
                // totalPrice is the final price after discount code (already calculated from unitPrice which is priceDiscount if available)
                totalPrice: apiCart.totalPrice || 0,
                totalQuantity: apiCart.quantity || 0,
                couponCode: apiCart.discountCode || undefined,
                couponDiscount: apiCart.totalDiscount || 0,
            };
        }
        return reduxCart;
    }, [cartData, currentUser, reduxCart]);

    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = controlledSetIsOpen || setInternalIsOpen;
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const openTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const isOpeningRef = useRef(false); // Flag để tránh click outside trigger ngay sau khi mở
    const isNavigatingRef = useRef(false); // Flag để biết khi đang navigate
    const justClosedRef = useRef(false); // Flag để biết khi vừa đóng (tránh mở lại ngay)

    // Set mounted state after component mounts (client-side only)
    useEffect(() => {
        setMounted(true);
    }, []);

    // Detect mobile
    useEffect(() => {
        if (!mounted) return;

        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 999);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [mounted]);

    const handleDropdownMouseEnter = () => {
        if (isMobile) return;

        // Call parent handler first
        onMouseEnterProp?.();

        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    const handleDropdownMouseLeave = () => {
        if (isMobile) return;

        // Call parent handler
        onMouseLeaveProp?.();

        // Also handle internal close if needed
        if (controlledIsOpen === undefined) {
            closeTimeoutRef.current = setTimeout(() => {
                setIsOpen(false);
                onOverlayChange?.(false);
            }, 200);
        }
    };

    // Close dropdown when scrolling the page (mobile) - Disabled to fix issue where scrolling inside dropdown closes it
    /*
    useEffect(() => {
        if (!mounted || !isOpen || !isMobile) return;

        const handleScroll = () => {
            // Đóng dropdown khi scroll trang
            setIsOpen(false);
            onOverlayChange?.(false);
        };

        // Listen to scroll on window
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isOpen, isMobile, onOverlayChange, setIsOpen, mounted]);
    */

    // Cleanup timeouts
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
            if (openTimeoutRef.current) {
                clearTimeout(openTimeoutRef.current);
            }
        };
    }, []);

    // Track when dropdown is opening
    useEffect(() => {
        if (isOpen) {
            isOpeningRef.current = true;
            justClosedRef.current = false;
            // Reset flag sau 200ms để cho phép click outside
            const timer = setTimeout(() => {
                isOpeningRef.current = false;
            }, 200);
            return () => clearTimeout(timer);
        } else {
            isOpeningRef.current = false;
            // Set flag khi đóng để tránh mở lại ngay
            if (mounted) {
                justClosedRef.current = true;
                const timer = setTimeout(() => {
                    justClosedRef.current = false;
                }, 300);
                return () => clearTimeout(timer);
            }
        }
    }, [isOpen, mounted]);

    // Close when clicking outside (mobile) - Simplified
    // Note: Overlay sẽ tự xử lý đóng, handler này chỉ để backup
    useEffect(() => {
        if (!mounted || !isOpen || !isMobile) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            // Nếu đang mở, bỏ qua click outside trong 150ms đầu
            if (isOpeningRef.current) {
                return;
            }

            // Nếu đang trong quá trình navigate hoặc vừa đóng, bỏ qua
            if (isNavigatingRef.current || justClosedRef.current) {
                return;
            }

            const target = event.target as HTMLElement;

            // Kiểm tra xem có phải click vào overlay không
            if (target.hasAttribute('data-cart-overlay')) {
                // Overlay sẽ tự xử lý trong onClick handler
                return;
            }

            // Kiểm tra xem có phải click vào button không
            const buttonElement = document.querySelector('[data-cart-button]');
            if (buttonElement && buttonElement.contains(target)) {
                return; // Không đóng nếu click vào button
            }

            // Kiểm tra xem có click vào dropdown không
            if (dropdownRef.current && dropdownRef.current.contains(target)) {
                // Kiểm tra nếu click vào close button
                const closeButton = target.closest('[data-cart-close]');
                if (closeButton) {
                    // Close button sẽ tự xử lý
                    return;
                }
                // Kiểm tra nếu click vào link
                const linkElement = target.closest('a');
                if (linkElement) {
                    // Link sẽ tự xử lý đóng dropdown trong onClick handler
                    return;
                }
                return; // Không đóng nếu click vào dropdown
            }

            // Đóng dropdown nếu click ra ngoài (backup handler)
            setIsOpen(false);
            onOverlayChange?.(false);
        };

        // Sử dụng event listener với capture phase để bắt sớm
        const timeout = setTimeout(() => {
            document.addEventListener('touchstart', handleClickOutside as EventListener, { passive: true, capture: false });
            document.addEventListener('mousedown', handleClickOutside as EventListener, { passive: true, capture: false });
        }, 150);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('touchstart', handleClickOutside as EventListener, { capture: false });
            document.removeEventListener('mousedown', handleClickOutside as EventListener, { capture: false });
        };
    }, [isOpen, isMobile, onOverlayChange, setIsOpen, mounted]);

    // A11y: ESC to close
    useEffect(() => {
        if (!mounted || !isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
                onOverlayChange?.(false);
                buttonRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onOverlayChange, mounted]);

    const handleRemove = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();

        if (currentUser) {
            // Optimistic update - remove item immediately from UI
            const oldCartData = cartData;
            const optimisticCart = {
                ...cartData,
                data: {
                    ...cartData?.data,
                    items: cartData?.data?.items?.filter((item: any) => {
                        const productId = item.productId?._id || item.product_id?._id || '';
                        return productId !== id;
                    }) || [],
                    quantity: (cartData?.data?.quantity || 0) - (cart.products.find(p => p.id === id)?.quantity || 0),
                    totalDiscountBefore: (cartData?.data?.totalDiscountBefore || 0) - ((cart.products.find(p => p.id === id)?.price || 0) * (cart.products.find(p => p.id === id)?.quantity || 0)),
                    totalPrice: ((cartData?.data?.totalDiscountBefore || 0) - ((cart.products.find(p => p.id === id)?.price || 0) * (cart.products.find(p => p.id === id)?.quantity || 0))) - (cartData?.data?.totalDiscount || 0),
                }
            };

            // Update cache optimistically (no revalidate, just update data)
            globalMutate('/api/v1/cart', optimisticCart, { revalidate: false });

            try {
                const response = await removeFromCartAPI(id);
                // Update cache with actual response data (no revalidate)
                await globalMutate('/api/v1/cart', response, { revalidate: false });
            } catch (error: any) {
                // Revert on error - restore old data
                if (oldCartData) {
                    await globalMutate('/api/v1/cart', oldCartData, { revalidate: false });
                }
                const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
                showError(errorMessage);
            }
        } else {
            dispatch(removeFromCart(id));
        }
    };

    const handleIncrease = (e: React.MouseEvent, id: string, currentQuantity: number) => {
        e.stopPropagation();
        e.preventDefault();

        // Find product in cart to check max
        const product = cart.products.find(p => p.id === id);
        const max = (product as any)?.max || 100;
        const stock = (product as any)?.stock || 0;
        const newQuantity = currentQuantity + 1;

        // Client-side validation
        if (newQuantity > max) {
            showError(`Số lượng tối đa là ${max}`);
            return;
        }

        if (newQuantity > stock) {
            showError(`Sản phẩm chỉ còn ${stock} sản phẩm trong kho`);
            return;
        }

        if (currentUser) {
            // Get current cart data (may be from previous optimistic update)
            const currentCartData = cartData;
            const pendingUpdate = pendingUpdatesRef.current.get(id);

            // Get oldCartData only on first click (if not already saved)
            const oldCartData = pendingUpdate?.oldCartData || cartData;

            // Get current quantity from pending update if exists, otherwise use currentQuantity from props
            // This ensures we use the latest quantity from previous optimistic update
            const actualCurrentQuantity = pendingUpdate?.quantity || currentQuantity;

            // Save oldCartData only on first click (if not already saved)
            if (!pendingUpdate) {
                pendingUpdatesRef.current.set(id, { oldCartData: cartData, productId: id, quantity: actualCurrentQuantity, expectedQuantity: newQuantity });
            } else {
                // Update with new expected quantity
                pendingUpdatesRef.current.set(id, { ...pendingUpdate, expectedQuantity: newQuantity });
            }

            // Calculate price difference based on actual current quantity
            const priceDiff = ((product as any)?.price || 0) * (newQuantity - actualCurrentQuantity);
            const quantityDiff = newQuantity - actualCurrentQuantity;

            // Optimistic update - update UI immediately using current cart data
            const optimisticCart = {
                ...currentCartData,
                data: {
                    ...currentCartData?.data,
                    items: currentCartData?.data?.items?.map((item: any) => {
                        const productId = item.productId?._id || item.product_id?._id || '';
                        if (productId === id) {
                            return { ...item, quantity: newQuantity };
                        }
                        return item;
                    }) || [],
                    quantity: (currentCartData?.data?.quantity || 0) + quantityDiff,
                    totalDiscountBefore: (currentCartData?.data?.totalDiscountBefore || 0) + priceDiff,
                    totalPrice: ((currentCartData?.data?.totalDiscountBefore || 0) + priceDiff) - (currentCartData?.data?.totalDiscount || 0),
                }
            };

            // Update cache optimistically (no revalidate, just update data)
            globalMutate('/api/v1/cart', optimisticCart, { revalidate: false });

            // Update pending update with new quantity and expected quantity
            pendingUpdatesRef.current.set(id, { oldCartData, productId: id, quantity: newQuantity, expectedQuantity: newQuantity });

            // Debounced API call (200ms delay)
            debouncedUpdateQuantity(id, newQuantity);
        } else {
            dispatch(updateQuantity({ id, quantity: newQuantity }));
        }
    };

    const handleDecrease = (e: React.MouseEvent, id: string, currentQuantity: number) => {
        e.stopPropagation();
        e.preventDefault();

        // Find product in cart to check min
        const product = cart.products.find(p => p.id === id);
        const min = (product as any)?.min || 1;

        if (currentQuantity <= min) {
            showError(`Số lượng tối thiểu là ${min}`);
            return;
        }

        const newQuantity = currentQuantity - 1;

        if (currentUser) {
            // Get current cart data (may be from previous optimistic update)
            const currentCartData = cartData;
            const pendingUpdate = pendingUpdatesRef.current.get(id);

            // Get oldCartData only on first click (if not already saved)
            const oldCartData = pendingUpdate?.oldCartData || cartData;

            // Get current quantity from pending update if exists, otherwise use currentQuantity from props
            // This ensures we use the latest quantity from previous optimistic update
            const actualCurrentQuantity = pendingUpdate?.quantity || currentQuantity;

            // Save oldCartData only on first click (if not already saved)
            if (!pendingUpdate) {
                pendingUpdatesRef.current.set(id, { oldCartData: cartData, productId: id, quantity: actualCurrentQuantity, expectedQuantity: newQuantity });
            } else {
                // Update with new expected quantity
                pendingUpdatesRef.current.set(id, { ...pendingUpdate, expectedQuantity: newQuantity });
            }

            // Calculate price difference based on actual current quantity
            const priceDiff = ((product as any)?.price || 0) * (newQuantity - actualCurrentQuantity);
            const quantityDiff = newQuantity - actualCurrentQuantity;

            // Optimistic update - update UI immediately using current cart data
            const optimisticCart = {
                ...currentCartData,
                data: {
                    ...currentCartData?.data,
                    items: currentCartData?.data?.items?.map((item: any) => {
                        const productId = item.productId?._id || item.product_id?._id || '';
                        if (productId === id) {
                            return { ...item, quantity: newQuantity };
                        }
                        return item;
                    }) || [],
                    quantity: (currentCartData?.data?.quantity || 0) + quantityDiff,
                    totalDiscountBefore: (currentCartData?.data?.totalDiscountBefore || 0) + priceDiff,
                    totalPrice: ((currentCartData?.data?.totalDiscountBefore || 0) + priceDiff) - (currentCartData?.data?.totalDiscount || 0),
                }
            };

            // Update cache optimistically (no revalidate, just update data)
            globalMutate('/api/v1/cart', optimisticCart, { revalidate: false });

            // Update pending update with new quantity and expected quantity
            pendingUpdatesRef.current.set(id, { oldCartData, productId: id, quantity: newQuantity, expectedQuantity: newQuantity });

            // Debounced API call (200ms delay)
            debouncedUpdateQuantity(id, newQuantity);
        } else {
            if (newQuantity > 0) {
                dispatch(updateQuantity({ id, quantity: newQuantity }));
            }
        }
    };

    const formatPrice = (value: number): string => {
        return value.toLocaleString('vi-VN');
    };

    // Disable body scroll when dropdown is open on mobile
    useEffect(() => {
        if (!mounted) return;

        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            // Reset navigation flag khi dropdown đóng
            isNavigatingRef.current = false;
        }
        return () => {
            document.body.style.overflow = '';
            isNavigatingRef.current = false;
        };
    }, [isOpen, isMobile, mounted]);

    return (
        <div
            className={cx('cart-dropdown-wrapper')}
            ref={dropdownRef}
        >
            {mounted && isOpen && isMobile && (
                <div
                    className={cx('cart-dropdown-overlay')}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        onOverlayChange?.(false);
                    }}
                    onTouchEnd={(e) => {
                        e.stopPropagation();
                        setIsOpen(false);
                        onOverlayChange?.(false);
                    }}
                    data-cart-overlay
                />
            )}
            {mounted && isOpen && (
                <div
                    className={cx('cart-dropdown', {
                        'is-mobile': isMobile,
                    })}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Giỏ hàng"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                >
                    {/* Header */}
                    <div className={cx('cart-header')}>
                        <h3 className={cx('cart-title')}>Giỏ hàng</h3>
                        {isMobile && (
                            <button
                                className={cx('cart-close-button')}
                                data-cart-close
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    isNavigatingRef.current = false;
                                    justClosedRef.current = true;
                                    setIsOpen(false);
                                    onOverlayChange?.(false);
                                    // Reset flag sau 200ms
                                    setTimeout(() => {
                                        justClosedRef.current = false;
                                    }, 200);
                                }}
                                onTouchEnd={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    isNavigatingRef.current = false;
                                    justClosedRef.current = true;
                                    setIsOpen(false);
                                    onOverlayChange?.(false);
                                    setTimeout(() => {
                                        justClosedRef.current = false;
                                    }, 200);
                                }}
                                aria-label="Đóng giỏ hàng"
                                type="button"
                            >
                                <XIcon size={22} />
                            </button>
                        )}
                    </div>

                    {/* Cart Content */}
                    {cart.products.length > 0 ? (
                        <>
                            {/* Cart Items */}
                            <div className={cx('cart-items')}>
                                {cart.products.map((product) => (
                                    <Link href={product.href || '#'} key={product.id} className={cx('cart-item')}>
                                        <div className={cx('cart-item-image')}>
                                            {product.imageSrc ? (
                                                <Image
                                                    src={product.imageSrc}
                                                    alt={product.imageAlt || product.productName}
                                                    width={80}
                                                    height={80}
                                                    className={cx('cart-item-img')}
                                                />
                                            ) : (
                                                <div className={cx('cart-item-placeholder')} />
                                            )}
                                        </div>
                                        <div className={cx('cart-item-content')}>
                                            <div className={cx('cart-item-header')}>
                                                <Link
                                                    href={product.href || '#'}
                                                    className={cx('cart-item-name-link')}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Set flag để tránh click outside handler can thiệp
                                                        isNavigatingRef.current = true;
                                                        justClosedRef.current = true;
                                                        // Đóng dropdown ngay lập tức
                                                        setIsOpen(false);
                                                        onOverlayChange?.(false);
                                                        // Delay navigation một chút để animation hoàn tất
                                                        if (product.href && product.href !== '#') {
                                                            e.preventDefault();
                                                            const delay = isMobile ? 250 : 100;
                                                            const href = product.href;
                                                            setTimeout(() => {
                                                                isNavigatingRef.current = false;
                                                                router.push(href);
                                                            }, delay);
                                                        } else {
                                                            // Không có href: chỉ reset flag
                                                            setTimeout(() => {
                                                                isNavigatingRef.current = false;
                                                            }, 100);
                                                        }
                                                    }}
                                                >
                                                    <span className={cx('cart-item-name')}>{product.productName}</span>
                                                </Link>
                                                <button
                                                    className={cx('cart-item-remove')}
                                                    onClick={(e) => handleRemove(e, product.id)}
                                                    aria-label="Xóa sản phẩm"
                                                    type="button"
                                                >
                                                    <TrashIcon size={isMobile ? 18 : 16} />
                                                </button>
                                            </div>
                                            {/* Display options if available */}
                                            {product.options && Array.isArray(product.options) && product.options.length > 0 && (
                                                <div className={cx('cart-item-meta')}>
                                                    {product.options.map((opt: any, idx: number) => (
                                                        <div key={idx} className={cx('meta-row')}>
                                                            <span className={cx('meta-label')}>{opt.title}</span>
                                                            <span className={cx('meta-value')}>{opt.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className={cx('cart-item-controls')}>
                                                <div className={cx('cart-item-quantity')}>
                                                    <button
                                                        className={cx('quantity-btn', 'quantity-minus')}
                                                        onClick={(e) => handleDecrease(e, product.id, product.quantity)}
                                                        disabled={product.quantity <= 1}
                                                        type="button"
                                                        aria-label="Giảm số lượng"
                                                    >
                                                        <MinusIcon size={isMobile ? 16 : 14} />
                                                    </button>
                                                    <span className={cx('quantity-value')}>{product.quantity}</span>
                                                    <button
                                                        className={cx('quantity-btn', 'quantity-plus')}
                                                        onClick={(e) => handleIncrease(e, product.id, product.quantity)}
                                                        type="button"
                                                        aria-label="Tăng số lượng"
                                                    >
                                                        <PlusIcon size={isMobile ? 16 : 14} />
                                                    </button>
                                                </div>
                                                <div className={cx('cart-item-price')}>
                                                    <span className={cx('cart-item-quantity-text')}>{product.quantity} ×</span>{' '}
                                                    <span className={cx('cart-item-price-value')}>{formatPrice(product.price)} ₫</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Cart Summary */}
                            <div className={cx('cart-summary')}>
                                <div className={cx('cart-subtotal')}>
                                    <span className={cx('cart-subtotal-label')}>Tổng tiền:</span>
                                    <span className={cx('cart-subtotal-value')}>
                                        {formatPrice(cart.totalPrice)} ₫
                                    </span>
                                </div>
                            </div>

                            {/* Cart Actions */}
                            <div className={cx('cart-actions')}>
                                <Link
                                    href="/cart"
                                    className={cx('cart-view-button')}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        // Set flag để tránh click outside handler can thiệp
                                        isNavigatingRef.current = true;
                                        justClosedRef.current = true;
                                        // Đóng dropdown ngay lập tức
                                        setIsOpen(false);
                                        onOverlayChange?.(false);
                                        // Delay navigation một chút để animation hoàn tất và đảm bảo dropdown đã đóng
                                        const delay = isMobile ? 250 : 100;
                                        setTimeout(() => {
                                            isNavigatingRef.current = false;
                                            router.push('/cart');
                                        }, delay);
                                    }}
                                >
                                    Xem Giỏ Hàng
                                </Link>
                                <Link
                                    href="/checkout"
                                    className={cx('cart-checkout-button')}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        // Set flag để tránh click outside handler can thiệp
                                        isNavigatingRef.current = true;
                                        justClosedRef.current = true;
                                        // Đóng dropdown ngay lập tức
                                        setIsOpen(false);
                                        onOverlayChange?.(false);
                                        // Delay navigation một chút để animation hoàn tất và đảm bảo dropdown đã đóng
                                        const delay = isMobile ? 250 : 100;
                                        setTimeout(() => {
                                            isNavigatingRef.current = false;
                                            router.push('/checkout');
                                        }, delay);
                                    }}
                                >
                                    Thanh Toán
                                </Link>
                            </div>
                        </>
                    ) : (
                        /* Empty Cart State */
                        <div className={cx('cart-empty')}>
                            <div className={cx('cart-empty-icon')}>
                                <CartIcon className={cx('cart-icon')} size={48} />
                            </div>
                            <p className={cx('cart-empty-text')}>
                                Chưa có sản phẩm trong giỏ hàng
                            </p>
                            <Link
                                href="/"
                                className={cx('cart-return-button')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    // Set flag để tránh click outside handler can thiệp
                                    isNavigatingRef.current = true;
                                    justClosedRef.current = true;
                                    // Đóng dropdown ngay lập tức
                                    setIsOpen(false);
                                    onOverlayChange?.(false);
                                    // Delay navigation một chút để animation hoàn tất và đảm bảo dropdown đã đóng
                                    const delay = isMobile ? 250 : 100;
                                    setTimeout(() => {
                                        isNavigatingRef.current = false;
                                        router.push('/');
                                    }, delay);
                                }}
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CartDropdown;


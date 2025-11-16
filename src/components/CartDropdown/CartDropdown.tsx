'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import classNames from 'classnames/bind';
import styles from './CartDropdown.module.scss';
import { CartIcon, XIcon, MinusIcon, PlusIcon } from '@/components/Icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { removeFromCart, updateQuantity } from '@/redux/cartSlice';

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
    const cart = useSelector((state: RootState) => state.cart);
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

    // Close dropdown when scrolling the page (mobile)
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

    const handleRemove = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(removeFromCart(id));
    };

    const handleIncrease = (e: React.MouseEvent, id: string, currentQuantity: number) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
    };

    const handleDecrease = (e: React.MouseEvent, id: string, currentQuantity: number) => {
        e.stopPropagation();
        e.preventDefault();
        if (currentQuantity > 1) {
            dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
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
                                    <div key={product.id} className={cx('cart-item')}>
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
                                                    className={cx('cart-item-name')}
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
                                                    {product.productName}
                                                </Link>
                                                <button
                                                    className={cx('cart-item-remove')}
                                                    onClick={(e) => handleRemove(e, product.id)}
                                                    aria-label="Xóa sản phẩm"
                                                    type="button"
                                                >
                                                    <XIcon size={isMobile ? 18 : 16} />
                                                </button>
                                            </div>
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
                                ))}
                            </div>

                            {/* Cart Summary */}
                            <div className={cx('cart-summary')}>
                                <div className={cx('cart-subtotal')}>
                                    <span className={cx('cart-subtotal-label')}>Tổng số phụ:</span>
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
                                href="/products" 
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
                                        router.push('/products');
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


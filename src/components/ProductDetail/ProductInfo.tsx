'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductInfo.module.scss';
import { CreditCardIcon, CartIcon, HeartIcon } from '@/components/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addToCart } from '@/redux/cartSlice';
import { useWishlist } from '@/hooks/useWishlist';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { addToCart as addToCartAPI } from '@/services/cartService';
import { useSWRConfig } from 'swr';

const cx = classNames.bind(styles);

interface Package {
    id: string;
    name: string;
    price: number;
    selected: boolean;
}

interface Product {
    id: string;
    productName: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    status: 'in-stock' | 'out-of-stock';
    productCode: string;
    category: string;
}

interface VariantItem {
    _id?: string;
    slug: string;
    text: string;
    productId?: string;
}

interface Variant {
    title: string;
    list: VariantItem[];
}

interface ProductOption {
    _id?: string;
    type: 'text' | 'textarea' | 'email' | 'number' | 'tel' | 'url' | 'date' | 'select' | 'checkbox' | 'radio';
    title: string;
    constraints?: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        pattern?: string;
        min?: number;
        max?: number;
    };
}

interface ProductInfoProps {
    product: Product;
    selectedPackage: Package;
    onPackageSelect: (pkg: Package) => void;
    variants?: Variant | Variant[]; // Support both single variant object and array
    options?: ProductOption[];
    onVariantSelect?: (slug: string) => void;
    currentSlug?: string;
    onOptionsChange?: (options: Record<string, any>) => void;
}

const formatPrice = (value: number): string => {
    return value.toLocaleString('vi-VN');
};

const ProductInfo: React.FC<ProductInfoProps> = ({ 
    product, 
    selectedPackage, 
    onPackageSelect,
    variants,
    options,
    onVariantSelect,
    currentSlug,
    onOptionsChange,
}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { toggleWishlist, isProductInWishlist, isLoggedIn } = useWishlist();
    const { showSuccess, showInfo, showError } = useToast();
    const isFavorite = isProductInWishlist(product.id);
    const currentUser = useSelector((state: RootState) => state.auth.login.currentUser);
    const [isAddingToCart, setIsAddingToCart] = React.useState(false);
    const { mutate: globalMutate } = useSWRConfig();
    const [isTosModalOpen, setIsTosModalOpen] = React.useState(false);
    const [tosCheckboxChecked, setTosCheckboxChecked] = React.useState(false);
    const [tosAccepted, setTosAccepted] = React.useState(false);
    const [tosError, setTosError] = React.useState('');
    const pendingActionRef = React.useRef<'add' | 'buy' | null>(null);
    
    // State for options values and errors
    const [optionsValues, setOptionsValues] = React.useState<Record<string, any>>({});
    const [optionsErrors, setOptionsErrors] = React.useState<Record<string, string>>({});

    // Reset options values and errors when product changes (e.g., variant selection)
    React.useEffect(() => {
        setOptionsValues({});
        setOptionsErrors({});
    }, [product.id]);

    // Helper to build stable option key
    const getOptionId = React.useCallback((option: ProductOption) => {
        if (option._id) {
            return option._id;
        }
        return option.title.toLowerCase().replace(/\s+/g, '-');
    }, []);

    // Validate single option field
    const validateOption = (option: ProductOption, value: any): string => {
        const constraints = option.constraints;
        if (!constraints) return '';

        // Required validation
        if (constraints.required) {
            if (value === undefined || value === null || value === '' || (typeof value === 'boolean' && !value)) {
                return `${option.title} là bắt buộc`;
            }
        }

        // Skip other validations if value is empty and not required
        const isEmptyValue =
            value === undefined ||
            value === null ||
            (typeof value === 'string' && value.trim() === '');
        if (isEmptyValue) return '';

        // MinLength validation
        if (constraints.minLength && typeof value === 'string' && value.length < constraints.minLength) {
            return `${option.title} phải có ít nhất ${constraints.minLength} ký tự`;
        }

        // MaxLength validation
        if (constraints.maxLength && typeof value === 'string' && value.length > constraints.maxLength) {
            return `${option.title} không được vượt quá ${constraints.maxLength} ký tự`;
        }

        // Pattern validation
        if (constraints.pattern && typeof value === 'string') {
            const regex = new RegExp(constraints.pattern);
            if (!regex.test(value)) {
                return `${option.title} không đúng định dạng`;
            }
        }

        // Min validation (for number)
        if (constraints.min !== undefined && typeof value === 'number' && value < constraints.min) {
            return `${option.title} phải lớn hơn hoặc bằng ${constraints.min}`;
        }

        // Max validation (for number)
        if (constraints.max !== undefined && typeof value === 'number' && value > constraints.max) {
            return `${option.title} phải nhỏ hơn hoặc bằng ${constraints.max}`;
        }

        // Email validation
        if (option.type === 'email' && typeof value === 'string' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Email không hợp lệ';
            }
        }

        // URL validation
        if (option.type === 'url' && typeof value === 'string' && value) {
            try {
                new URL(value);
            } catch {
                return 'URL không hợp lệ';
            }
        }

        return '';
    };

    const validateAllOptions = React.useCallback(() => {
        if (!options || options.length === 0) {
            return true;
        }

        const validationErrors: Record<string, string> = {};

        options.forEach((option) => {
            const optionId = getOptionId(option);
            const value = optionsValues[optionId];
            const error = validateOption(option, value);
            if (error) {
                validationErrors[optionId] = error;
            }
        });

        setOptionsErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    }, [getOptionId, options, optionsValues]);

    const collectSelectedOptions = React.useCallback(() => {
        const allOptions: Array<{ title: string; value: any }> = [];

        if (options && optionsValues) {
            options.forEach((option) => {
                const optionId = getOptionId(option);
                const value = optionsValues[optionId];
                const optionTitle = option.title || '';

                if (value !== null && value !== undefined && value !== '') {
                    allOptions.push({
                        title: optionTitle,
                        value,
                    });
                }
            });
        }

        return allOptions;
    }, [getOptionId, options, optionsValues]);

    const addToCartInternal = async (): Promise<boolean> => {
        if (!validateAllOptions()) {
            showError('Vui lòng kiểm tra lại thông tin yêu cầu');
            return false;
        }

        const productId = (product as any)._id || product.id;
        const allOptions = collectSelectedOptions();
        const priceToUse = selectedPackage.price || product.price;
        const imageSrc = product.images?.[0] || product.imageSrc || product.image?.[0] || '/products/product-1.png';
        const href = product.slug ? `/product/${product.slug}` : `/product/${product.id}`;

        // Guest users: store cart items locally (Redux)
        if (!isLoggedIn || !currentUser?.accessToken) {
            dispatch(
                addToCart({
                    id: productId,
                    productName: product.productName,
                    price: priceToUse,
                    oldPrice: product.oldPrice,
                    href,
                    imageSrc,
                    imageAlt: product.productName,
                    options: allOptions,
                })
            );
            showSuccess(`Đã thêm "${product.productName}" vào giỏ hàng`);
            return true;
        }

        setIsAddingToCart(true);
        let isSuccess = false;

        try {
            const response = await addToCartAPI({
                productId,
                quantity: 1,
                options: allOptions.length > 0 ? allOptions : undefined,
            });

            if (response.success) {
                await globalMutate('/api/v1/cart', undefined, { revalidate: true });
                showSuccess(`Đã thêm "${product.productName}" vào giỏ hàng`);
                isSuccess = true;
            } else {
                throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            showError(errorMessage);
        } finally {
            setIsAddingToCart(false);
        }

        return isSuccess;
    };

    const ensureTosAccepted = (action: 'add' | 'buy') => {
        if (tosAccepted) {
            return true;
        }
        pendingActionRef.current = action;
        setIsTosModalOpen(true);
        setTosCheckboxChecked(false);
        setTosError('');
        return false;
    };

    const handleAddToCart = async (): Promise<boolean> => {
        if (!ensureTosAccepted('add')) {
            return false;
        }
        return addToCartInternal();
    };

    const handleBuyNow = async () => {
        if (!ensureTosAccepted('buy')) {
            return;
        }
        const success = await addToCartInternal();
        if (success) {
            window.location.href = '/cart';
        }
    };

    const handleToggleWishlist = async () => {
        try {
            const added = await toggleWishlist({
                productId: product.id,
                productName: product.productName,
                price: selectedPackage.price || product.price,
                oldPrice: product.oldPrice,
                discount: product.discount,
                status: product.status,
                href: `/product/${product.id}`,
                imageSrc: '/products/product-1.png',
                imageAlt: product.productName,
            });

            showSuccess(
                added
                    ? `Đã thêm "${product.productName}" vào yêu thích`
                    : `Đã xóa "${product.productName}" khỏi yêu thích`
            );
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
            showError(errorMessage);
        }
    };

    const displayPrice = selectedPackage.price || product.price;

    const handleCloseTosModal = () => {
        setIsTosModalOpen(false);
        setTosCheckboxChecked(false);
        setTosError('');
        pendingActionRef.current = null;
    };

    const handleConfirmTosModal = async () => {
        if (!tosCheckboxChecked) {
            setTosError('Vui lòng xác nhận rằng bạn đã đọc kỹ thông tin sản phẩm.');
            return;
        }
        setTosAccepted(true);
        setIsTosModalOpen(false);
        setTosError('');

        const action = pendingActionRef.current;
        pendingActionRef.current = null;

        if (action === 'add') {
            await addToCartInternal();
        } else if (action === 'buy') {
            const success = await addToCartInternal();
            if (success) {
                window.location.href = '/cart';
            }
        }
    };

    return (
        <div className={cx('product-info')}>
            <div className={cx('product-label')}>Sản phẩm</div>
            <h1 className={cx('product-name')}>{product.productName}</h1>

            <div className={cx('product-meta')}>
                <div className={cx('product-status')}>
                    <span className={cx('status-label')}>Tình trạng:</span>
                    <span className={cx('status-value', product.status)}>
                        {product.status === 'in-stock' ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                </div>
                <div className={cx('product-code')}>
                    <span className={cx('code-label')}>Mã sản phẩm:</span>
                    <span className={cx('code-value')}>{product.productCode || product.id}</span>
                </div>
                <div className={cx('product-category')}>
                    <span className={cx('category-label')}>Thể loại:</span>
                    <span className={cx('category-value')}>{product.category}</span>
                </div>
            </div>

            <div className={cx('product-pricing')}>
                <div className={cx('current-price')}>{formatPrice(displayPrice)}₫</div>
                {product.oldPrice && (
                    <div className={cx('price-row')}>
                        <span className={cx('old-price')}>{formatPrice(product.oldPrice)}₫</span>
                        {product.discount && (
                            <span className={cx('discount-badge')}>-{product.discount}%</span>
                        )}
                    </div>
                )}
            </div>

            {/* Variants from database */}
            {(() => {
                // Normalize variants to array (handle both object and array)
                let variantsArray: Variant[] = [];
                if (variants) {
                    if (Array.isArray(variants)) {
                        variantsArray = variants;
                    } else if (variants.title && variants.list) {
                        // Single variant object
                        variantsArray = [variants];
                    }
                }

                // Render variants if available
                if (variantsArray.length > 0) {
                    return variantsArray.map((variant, variantIndex) => (
                        <div key={variantIndex} className={cx('product-packages')}>
                            <h3 className={cx('packages-title')}>{variant.title || 'Chọn gói sản phẩm'}</h3>
                            <div className={cx('packages-grid')}>
                                {variant.list && variant.list.length > 0 ? (
                                    variant.list.map((item) => (
                                        <button
                                            key={item.slug || item._id || item.text}
                                            className={cx('package-button', { 
                                                selected: currentSlug === item.slug 
                                            })}
                                            onClick={() => {
                                                if (onVariantSelect && item.slug) {
                                                    onVariantSelect(item.slug);
                                                }
                                            }}
                                        >
                                            {item.text}
                                        </button>
                                    ))
                                ) : (
                                    <p className={cx('no-variants')}>Không có biến thể</p>
                                )}
                            </div>
                        </div>
                    ));
                }
                return null;
            })()}
            
            {/* Fallback to default packages if no variants */}
            {(() => {
                // Check if variants exist and have data
                const hasVariants = variants && (
                    Array.isArray(variants) ? variants.length > 0 : 
                    (variants.title && variants.list && variants.list.length > 0)
                );
                return !hasVariants;
            })() && (
                <div className={cx('product-packages')}>
                    <h3 className={cx('packages-title')}>Chọn gói sản phẩm</h3>
                    <div className={cx('packages-grid')}>
                        {[
                            { id: '1', name: 'Ultra (1 tháng)', price: 199000, selected: false },
                            { id: '2', name: 'Ultra Không Credit (1 tháng)', price: 179000, selected: false },
                            { id: '3', name: 'Pro (1 tháng)', price: 149000, selected: false },
                            { id: '4', name: 'Pro (6 tháng)', price: 799000, selected: false },
                            { id: '5', name: 'Pro (1 năm)', price: 1499000, selected: false },
                            { id: '6', name: 'SP AI khác', price: 0, selected: false },
                        ].map((pkg) => (
                            <button
                                key={pkg.id}
                                className={cx('package-button', { selected: selectedPackage.id === pkg.id })}
                                onClick={() => onPackageSelect(pkg)}
                            >
                                {pkg.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Product Options - Input fields for email, password, etc. */}
            {options && options.length > 0 && (
                <div className={cx('product-options')}>
                    <h3 className={cx('options-title')}>Thông tin yêu cầu</h3>
                    <div className={cx('options-form')}>
                        {options.map((option) => {
                            const optionId = getOptionId(option);
                            const value = optionsValues[optionId] || '';
                            const isRequired = option.constraints?.required || false;
                            
                            const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                const newValue = e.target.value;
                                const newOptionsValues = {
                                    ...optionsValues,
                                    [optionId]: newValue,
                                };
                                
                                // Validate on change
                                const error = validateOption(option, newValue);
                                setOptionsErrors({
                                    ...optionsErrors,
                                    [optionId]: error,
                                });
                                
                                setOptionsValues(newOptionsValues);
                                if (onOptionsChange) {
                                    onOptionsChange(newOptionsValues);
                                }
                            };

                            const handleBlur = () => {
                                // Validate on blur
                                const value = optionsValues[optionId];
                                const error = validateOption(option, value);
                                setOptionsErrors({
                                    ...optionsErrors,
                                    [optionId]: error,
                                });
                            };

                            const error = optionsErrors[optionId] || '';

                            // Render input based on type
                            switch (option.type) {
                                case 'textarea':
                                    return (
                                        <div key={optionId} className={cx('option-field')}>
                                            <label className={cx('option-label')}>
                                                {option.title}
                                                {isRequired && <span className={cx('required')}> *</span>}
                                            </label>
                                            <textarea
                                                className={cx('option-input', 'option-textarea', { 'has-error': error })}
                                                value={value}
                                                onChange={handleOptionChange}
                                                onBlur={handleBlur}
                                                required={isRequired}
                                                placeholder={`Nhập ${option.title.toLowerCase()}`}
                                                rows={4}
                                                minLength={option.constraints?.minLength}
                                                maxLength={option.constraints?.maxLength}
                                            />
                                            {error && <span className={cx('error-message')}>{error}</span>}
                                        </div>
                                    );
                                
                                case 'email':
                                    return (
                                        <div key={optionId} className={cx('option-field')}>
                                            <label className={cx('option-label')}>
                                                {option.title}
                                                {isRequired && <span className={cx('required')}> *</span>}
                                            </label>
                                            <input
                                                type="email"
                                                className={cx('option-input', { 'has-error': error })}
                                                value={value}
                                                onChange={handleOptionChange}
                                                onBlur={handleBlur}
                                                required={isRequired}
                                                placeholder={`Nhập ${option.title.toLowerCase()}`}
                                                pattern={option.constraints?.pattern}
                                                minLength={option.constraints?.minLength}
                                                maxLength={option.constraints?.maxLength}
                                            />
                                            {error && <span className={cx('error-message')}>{error}</span>}
                                        </div>
                                    );
                                
                                case 'number':
                                    return (
                                        <div key={optionId} className={cx('option-field')}>
                                            <label className={cx('option-label')}>
                                                {option.title}
                                                {isRequired && <span className={cx('required')}> *</span>}
                                            </label>
                                            <input
                                                type="number"
                                                className={cx('option-input', { 'has-error': error })}
                                                value={value}
                                                onChange={(e) => {
                                                    const numValue = e.target.value === '' ? '' : Number(e.target.value);
                                                    const newOptionsValues = {
                                                        ...optionsValues,
                                                        [optionId]: numValue,
                                                    };
                                                    
                                                    // Validate on change
                                                    const validationError = validateOption(option, numValue);
                                                    setOptionsErrors({
                                                        ...optionsErrors,
                                                        [optionId]: validationError,
                                                    });
                                                    
                                                    setOptionsValues(newOptionsValues);
                                                    if (onOptionsChange) {
                                                        onOptionsChange(newOptionsValues);
                                                    }
                                                }}
                                                onBlur={handleBlur}
                                                required={isRequired}
                                                placeholder={`Nhập ${option.title.toLowerCase()}`}
                                                min={option.constraints?.min}
                                                max={option.constraints?.max}
                                            />
                                            {error && <span className={cx('error-message')}>{error}</span>}
                                        </div>
                                    );
                                
                                case 'tel':
                                    return (
                                        <div key={optionId} className={cx('option-field')}>
                                            <label className={cx('option-label')}>
                                                {option.title}
                                                {isRequired && <span className={cx('required')}> *</span>}
                                            </label>
                                            <input
                                                type="tel"
                                                className={cx('option-input', { 'has-error': error })}
                                                value={value}
                                                onChange={handleOptionChange}
                                                onBlur={handleBlur}
                                                required={isRequired}
                                                placeholder={`Nhập ${option.title.toLowerCase()}`}
                                                pattern={option.constraints?.pattern}
                                                minLength={option.constraints?.minLength}
                                                maxLength={option.constraints?.maxLength}
                                            />
                                            {error && <span className={cx('error-message')}>{error}</span>}
                                        </div>
                                    );
                                
                                case 'url':
                                    return (
                                        <div key={optionId} className={cx('option-field')}>
                                            <label className={cx('option-label')}>
                                                {option.title}
                                                {isRequired && <span className={cx('required')}> *</span>}
                                            </label>
                                            <input
                                                type="url"
                                                className={cx('option-input', { 'has-error': error })}
                                                value={value}
                                                onChange={handleOptionChange}
                                                onBlur={handleBlur}
                                                required={isRequired}
                                                placeholder={`Nhập ${option.title.toLowerCase()}`}
                                                pattern={option.constraints?.pattern}
                                            />
                                            {error && <span className={cx('error-message')}>{error}</span>}
                                        </div>
                                    );
                                
                                case 'date':
                                    return (
                                        <div key={optionId} className={cx('option-field')}>
                                            <label className={cx('option-label')}>
                                                {option.title}
                                                {isRequired && <span className={cx('required')}> *</span>}
                                            </label>
                                            <input
                                                type="date"
                                                className={cx('option-input', { 'has-error': error })}
                                                value={value}
                                                onChange={handleOptionChange}
                                                onBlur={handleBlur}
                                                required={isRequired}
                                                min={option.constraints?.min?.toString()}
                                                max={option.constraints?.max?.toString()}
                                            />
                                            {error && <span className={cx('error-message')}>{error}</span>}
                                        </div>
                                    );
                                
                                case 'checkbox':
                                    return (
                                        <div key={optionId} className={cx('option-field', 'option-checkbox')}>
                                            <label className={cx('option-checkbox-label')}>
                                                <input
                                                    type="checkbox"
                                                    className={cx('option-checkbox-input', { 'has-error': error })}
                                                    checked={!!value}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const newOptionsValues = {
                                                            ...optionsValues,
                                                            [optionId]: checked,
                                                        };
                                                        
                                                        // Validate on change
                                                        const validationError = validateOption(option, checked);
                                                        setOptionsErrors({
                                                            ...optionsErrors,
                                                            [optionId]: validationError,
                                                        });
                                                        
                                                        setOptionsValues(newOptionsValues);
                                                        if (onOptionsChange) {
                                                            onOptionsChange(newOptionsValues);
                                                        }
                                                    }}
                                                    onBlur={handleBlur}
                                                    required={isRequired}
                                                />
                                                <span>{option.title}</span>
                                                {isRequired && <span className={cx('required')}> *</span>}
                                            </label>
                                            {error && <span className={cx('error-message')}>{error}</span>}
                                        </div>
                                    );
                                
                                default: // text, select, radio
                                    return (
                                        <div key={optionId} className={cx('option-field')}>
                                            <label className={cx('option-label')}>
                                                {option.title}
                                                {isRequired && <span className={cx('required')}> *</span>}
                                            </label>
                                            <input
                                                type="text"
                                                className={cx('option-input', { 'has-error': error })}
                                                value={value}
                                                onChange={handleOptionChange}
                                                onBlur={handleBlur}
                                                required={isRequired}
                                                placeholder={`Nhập ${option.title.toLowerCase()}`}
                                                pattern={option.constraints?.pattern}
                                                minLength={option.constraints?.minLength}
                                                maxLength={option.constraints?.maxLength}
                                            />
                                            {error && <span className={cx('error-message')}>{error}</span>}
                                        </div>
                                    );
                            }
                        })}
                    </div>
                </div>
            )}

            <div className={cx('product-actions')}>
                <div className={cx('primary-actions')}>
                    <button className={cx('buy-now-button')} onClick={handleBuyNow}>
                        <CreditCardIcon size={20} />
                        <span>Mua ngay</span>
                    </button>
                    <button 
                        className={cx('add-to-cart-button')} 
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                    >
                        <CartIcon size={20} />
                        <span>{isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}</span>
                    </button>
                </div>
                <button 
                    className={cx('wishlist-button', { 'is-favorite': isFavorite })} 
                    onClick={handleToggleWishlist}
                    aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                    type="button"
                    title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                >
                    <HeartIcon size={20} />
                    <span className={cx('wishlist-text')}>
                        {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                    </span>
                </button>
            </div>

            <div className={cx('payment-offers')}>
                <h3 className={cx('offers-title')}>Ưu đãi thanh toán</h3>
                <ul className={cx('offers-list')}>
                    <li>
                        Giảm 10k khi thanh toán bằng MoMo Payment.{' '}
                        <a href="#momo-details" className={cx('details-link')}>
                            Chi tiết
                        </a>
                    </li>
                </ul>
            </div>

            {isTosModalOpen && (
                <div className={cx('tos-modal-backdrop')} role="dialog" aria-modal="true">
                    <div className={cx('tos-modal')}>
                        <h3 className={cx('tos-modal-title')}>Xác nhận cam kết</h3>
                        <div className={cx('tos-modal-message')}>
                            <p>Chỉ hỗ trợ sử dụng với khách hàng ở Việt Nam</p>
                            <p>Sản phẩm không hỗ trợ sử dụng với khách hàng ở nước ngoài.</p>
                        </div>
                        <label className={cx('tos-checkbox')}>
                            <input
                                type="checkbox"
                                checked={tosCheckboxChecked}
                                onChange={(e) => {
                                    setTosCheckboxChecked(e.target.checked);
                                    if (tosError) {
                                        setTosError('');
                                    }
                                }}
                            />
                            <span>Tôi đã đọc kỹ thông tin của sản phẩm và đồng ý.</span>
                        </label>
                        {tosError && <div className={cx('tos-error')}>{tosError}</div>}
                        <div className={cx('tos-actions')}>
                            <button type="button" className={cx('tos-cancel')} onClick={handleCloseTosModal}>
                                Hủy
                            </button>
                            <button type="button" className={cx('tos-confirm')} onClick={handleConfirmTosModal}>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductInfo;


'use client';

import React from 'react';
import classNames from 'classnames/bind';
import styles from './ProductInfo.module.scss';
import { CreditCardIcon, CartIcon, HeartIcon } from '@/components/Icons';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/cartSlice';
import { useWishlist } from '@/hooks/useWishlist';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

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

interface ProductInfoProps {
    product: Product;
    selectedPackage: Package;
    onPackageSelect: (pkg: Package) => void;
}

const formatPrice = (value: number): string => {
    return value.toLocaleString('vi-VN');
};

const ProductInfo: React.FC<ProductInfoProps> = ({ product, selectedPackage, onPackageSelect }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { toggleWishlist, isProductInWishlist, isLoggedIn } = useWishlist();
    const { showSuccess, showInfo } = useToast();
    const isFavorite = isProductInWishlist(product.id);

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                id: product.id,
                productName: product.productName,
                price: selectedPackage.price || product.price,
                oldPrice: product.oldPrice,
                href: `/products/${product.id}`,
                imageSrc: '/products/product-1.png',
                imageAlt: product.productName,
            })
        );
        showSuccess(`Đã thêm "${product.productName}" vào giỏ hàng`);
    };

    const handleBuyNow = () => {
        handleAddToCart();
        // Redirect to cart or checkout
        window.location.href = '/cart';
    };

    const handleToggleWishlist = () => {
        if (!isLoggedIn) {
            showInfo('Vui lòng đăng nhập để thêm vào yêu thích');
            router.push('/auth/login');
            return;
        }

        const wasInWishlist = isFavorite;
        toggleWishlist({
            productId: product.id,
            productName: product.productName,
            price: selectedPackage.price || product.price,
            oldPrice: product.oldPrice,
            discount: product.discount,
            status: product.status,
            href: `/products/${product.id}`,
            imageSrc: '/products/product-1.png',
            imageAlt: product.productName,
        });

        if (wasInWishlist) {
            showSuccess(`Đã xóa "${product.productName}" khỏi yêu thích`);
        } else {
            showSuccess(`Đã thêm "${product.productName}" vào yêu thích`);
        }
    };

    const displayPrice = selectedPackage.price || product.price;

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
                    <span className={cx('code-value')}>{product.productCode}</span>
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

            <div className={cx('product-actions')}>
                <div className={cx('primary-actions')}>
                    <button className={cx('buy-now-button')} onClick={handleBuyNow}>
                        <CreditCardIcon size={20} />
                        <span>Mua ngay</span>
                    </button>
                    <button className={cx('add-to-cart-button')} onClick={handleAddToCart}>
                        <CartIcon size={20} />
                        <span>Thêm vào giỏ</span>
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
        </div>
    );
};

export default ProductInfo;


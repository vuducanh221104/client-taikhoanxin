'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import ProductCard from '@/components/ProductCard/ProductCard';
import { SortIcon } from '@/components/Icons';
import { getAllProducts } from '@/services/productService';
import EmptyState from '@/components/EmptyState/EmptyState';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';

const cx = classNames.bind(styles);

const categoryNames: Record<string, string> = {
    'work': 'Làm việc',
    'ai-account': 'Sản phẩm AI',
    'entertainment': 'Giải trí',
    'windows': 'Windows',
    'office': 'Office',
    'education': 'Giáo dục',
    'design': 'Thiết kế',
    'cloud-storage': 'Cloud Storage',
};

export default function CategoryDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const categoryName = categoryNames[slug] || 'Danh mục';

    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState('default');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        const allProducts = getAllProducts();
        // Filter by category - for now show all products as category field doesn't exist
        // In real app, you would filter by actual category
        setProducts(allProducts);
    }, [slug]);

    useEffect(() => {
        let results = products;

        // Price filter
        results = results.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Sort
        switch (sortBy) {
            case 'price-asc':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                results.sort((a, b) => a.productName.localeCompare(b.productName));
                break;
            case 'name-desc':
                results.sort((a, b) => b.productName.localeCompare(a.productName));
                break;
            case 'newest':
                results.sort((a, b) => Number(b.id) - Number(a.id));
                break;
            default:
                // default - keep original order
                break;
        }

        setFilteredProducts(results);
        setCurrentPage(1);
    }, [products, priceRange, sortBy]);

    const clearFilters = () => {
        setPriceRange([0, 10000000]);
        setSortBy('default');
    };

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    const breadcrumbItems = [
        { label: 'Trang chủ', href: '/' },
        { label: 'Danh mục', href: '/categories' },
        { label: categoryName, href: '' },
    ];

    return (
        <div className={cx('category-detail-page')}>
            <div className={cx('container')}>
                <Breadcrumbs items={breadcrumbItems} />

                <div className={cx('category-header')}>
                    <div className={cx('category-info')}>
                        <h1 className={cx('category-title')}>{categoryName}</h1>
                        <p className={cx('product-count')}>
                            {filteredProducts.length} sản phẩm
                        </p>
                    </div>

                    <div className={cx('category-controls')}>
                        <div className={cx('sort-dropdown')}>
                            <SortIcon size={20} />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className={cx('sort-select')}
                            >
                                <option value="default">Mặc định</option>
                                <option value="newest">Mới nhất</option>
                                <option value="price-asc">Giá: Thấp đến cao</option>
                                <option value="price-desc">Giá: Cao đến thấp</option>
                                <option value="name-asc">Tên: A-Z</option>
                                <option value="name-desc">Tên: Z-A</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={cx('category-content')}>
                    {/* Filters Sidebar */}
                    <aside className={cx('filters-sidebar')}>
                        <div className={cx('filters-header')}>
                            <h2 className={cx('filters-title')}>Bộ lọc</h2>
                            <button
                                className={cx('clear-filters-button')}
                                onClick={clearFilters}
                            >
                                Xóa tất cả
                            </button>
                        </div>

                        {/* Price Range Filter */}
                        <div className={cx('filter-section')}>
                            <h3 className={cx('filter-title')}>Khoảng giá</h3>
                            <input
                                type="number"
                                placeholder="Từ"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className={cx('price-input')}
                            />
                            <div className={cx('price-range-display')}>
                                {priceRange[0].toLocaleString('vi-VN')}₫ - {priceRange[1].toLocaleString('vi-VN')}₫
                            </div>
                        </div>

                        {/* Quick Price Filters */}
                        <div className={cx('filter-section')}>
                            <h3 className={cx('filter-title')}>Mức giá</h3>
                            <div className={cx('quick-price-filters')}>
                                <button
                                    className={cx('quick-price-button')}
                                    onClick={() => setPriceRange([0, 100000])}
                                >
                                    Dưới 100k
                                </button>
                                <button
                                    className={cx('quick-price-button')}
                                    onClick={() => setPriceRange([100000, 500000])}
                                >
                                    100k - 500k
                                </button>
                                <button
                                    className={cx('quick-price-button')}
                                    onClick={() => setPriceRange([500000, 1000000])}
                                >
                                    500k - 1tr
                                </button>
                                <button
                                    className={cx('quick-price-button')}
                                    onClick={() => setPriceRange([1000000, 10000000])}
                                >
                                    Trên 1tr
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className={cx('products-section')}>
                        {currentProducts.length > 0 ? (
                            <>
                                <div className={cx('products-grid')}>
                                    {currentProducts.map((product) => (
                                        <ProductCard key={product.id} {...product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className={cx('pagination')}>
                                        <button
                                            className={cx('pagination-button')}
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Trước
                                        </button>

                                        <div className={cx('pagination-numbers')}>
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                let page;
                                                if (totalPages <= 5) {
                                                    page = i + 1;
                                                } else if (currentPage <= 3) {
                                                    page = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    page = totalPages - 4 + i;
                                                } else {
                                                    page = currentPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={page}
                                                        className={cx('pagination-number', { active: page === currentPage })}
                                                        onClick={() => setCurrentPage(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            className={cx('pagination-button')}
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Sau
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <EmptyState
                                type="products"
                                title="Không có sản phẩm"
                                description="Không tìm thấy sản phẩm nào trong danh mục này."
                                actionLabel="Xem tất cả danh mục"
                                actionHref="/categories"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

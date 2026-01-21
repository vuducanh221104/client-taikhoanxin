'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './RelatedProducts.module.scss';
import ProductCard from '@/components/ProductCard/ProductCard';
import ProductSectionLayout from '@/components/ProductSectionLayout/ProductSectionLayout';
import { useProductsByIds, useRelatedProducts, mapProductToFeaturedProduct, Product } from '@/services/productService';
import { ProductListSkeleton } from '@/components/Skeleton';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/Icons';

const cx = classNames.bind(styles);

interface RelatedProductsProps {
    product?: {
        _id: string;
        relatedProduct?: string[] | Array<{ _id?: string; $oid?: string }>; // Support both string[] and object[] formats
        categoryId?: Array<{ _id: string; slug?: string; name?: string } | string>;
        slug?: string;
    };
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ product }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    /**
     * PRIORITY LOGIC:
     * 1. If product has relatedProduct field in database → Call POST /api/v1/products/by-ids
     * 2. If no relatedProduct → Call GET /api/v1/products/:slug/related?limit=8 (advanced related)
     */

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 999);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Normalize relatedProduct to string array (handle both string[] and object[] formats from database)
    const relatedProductIds = useMemo(() => {
        if (!product?.relatedProduct || product.relatedProduct.length === 0) {
            return [];
        }

        // Convert to string array (handle both string[] and object[] formats)
        return product.relatedProduct.map((item: string | { _id?: string; $oid?: string }) => {
            if (typeof item === 'string') {
                return item;
            } else if (item?._id) {
                return item._id;
            } else if (item?.$oid) {
                return item.$oid;
            }
            return String(item);
        }).filter((id: string) => id && id.trim() !== '');
    }, [product?.relatedProduct]);

    // Check if product has relatedProduct field with values (PRIORITY)
    const hasRelatedProductIds = relatedProductIds.length > 0;


    // Fetch products by IDs if relatedProduct exists (PRIORITY: relatedProduct from database)
    const productsByIdsQuery = useProductsByIds(hasRelatedProductIds ? relatedProductIds : undefined);

    // Always fetch advanced related by slug as fallback/top-up
    const fallbackRelatedQuery = useRelatedProducts(
        product?.slug,
        { limit: 16 } // over-fetch to have enough after dedupe
    );

    // Select main query (for loading/error states): primary when manual exists, else fallback
    const productsQuery = hasRelatedProductIds ? productsByIdsQuery : fallbackRelatedQuery;

    type VariantEntry = { productId?: string; slug?: string; text?: string };

    // Helpers to normalize variant data
    const normalizeVariantList = React.useCallback((variant: Product['variant']): VariantEntry[] => {
        if (!variant) return [];
        if (Array.isArray(variant)) {
            return variant.flatMap((v) => (v && Array.isArray(v.list) ? v.list : []));
        }
        if (typeof variant === 'object' && Array.isArray((variant as { list?: VariantEntry[] }).list)) {
            return (variant as { list?: VariantEntry[] }).list || [];
        }
        return [];
    }, []);

    const normalizeTokens = (s?: string | null) => {
        if (!s || typeof s !== 'string') return [];
        let t = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        t = t.replace(/[^a-z0-9]+/g, ' ');
        return t.split(' ').filter(Boolean);
    };

    const getVariantLinkedIds = React.useCallback((p: Product) => {
        const list = normalizeVariantList(p.variant);
        return list.map((item) => (item.productId ? String(item.productId) : '')).filter(Boolean);
    }, [normalizeVariantList]);

    const getVariantSlugKeys = React.useCallback((p: Product) => {
        const list = normalizeVariantList(p.variant);
        return list
            .map((item) => (item.slug || item.text || '').trim().toLowerCase())
            .filter(Boolean);
    }, [normalizeVariantList]);

    const getBaseKeys = React.useCallback((p: Product) => {
        const keys: string[] = [];
        const normalize = (s?: string | null) => {
            if (!s || typeof s !== 'string') return '';
            let t = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            t = t
                .replace(/[\d]+/g, ' ')
                .replace(/\b(thang|tháng|thiet|thiết|device|month|months|day|days|usd|\$)\b/g, ' ')
                .replace(/[-_/]+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
            return t;
        };
        const slugKey = normalize(p.slug);
        if (slugKey) keys.push(slugKey);
        const nameKey = normalize(p.name);
        if (nameKey) keys.push(nameKey);
        return keys;
    }, []);

    const getTokenPrefixKeys = React.useCallback((p: Product) => {
        const stop = new Set([
            'thang', 'tháng', 'thiet', 'thiết', 'device', 'month', 'months', 'day', 'days',
            'tai', 'khoan', 'tài', 'khoản', 'account', 'acc',
            'goi', 'gói', 'nang', 'nâng', 'cap', 'cấp', 'chinh', 'chính', 'chu', 'chủ',
            'tao', 'tạo', 'san', 'sẵn', 'upgrade', 'pro', 'premium'
        ]);
        const keys: string[] = [];
        const sources = [p.slug, p.name];
        for (const src of sources) {
            const tokens = normalizeTokens(src).filter(tok => !stop.has(tok));
            if (tokens.length >= 2) {
                const prefix3 = tokens.slice(0, 3).join(' ');
                if (prefix3) keys.push(prefix3);
                const prefix2 = tokens.slice(0, 2).join(' ');
                if (prefix2) keys.push(prefix2);
            } else if (tokens.length === 1) {
                keys.push(tokens[0]);
            }
        }
        return keys;
    }, []);

    const getAggressiveNameKeys = React.useCallback((p: Product) => {
        const norm = (s?: string | null) => {
            if (!s || typeof s !== 'string') return '';
            let t = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            t = t.replace(/[\d$]+/g, ' ');
            t = t.replace(/\b(thang|tháng|month|months|day|days|nam|năm|usd|vnd|credit|credits)\b/g, ' ');
            t = t.replace(/[^a-z0-9]+/g, ' ');
            t = t.replace(/\s+/g, ' ').trim();
            return t;
        };
        const build = (s?: string | null) => {
            const tokens = norm(s).split(' ').filter(Boolean);
            if (!tokens.length) return [];
            const res: string[] = [];
            const k3 = tokens.slice(0, 3).join(' ');
            if (k3) res.push(k3);
            const k2 = tokens.slice(0, 2).join(' ');
            if (k2) res.push(k2);
            const k1 = tokens[0];
            if (k1) res.push(k1);
            return res;
        };
        return [...build(p.slug), ...build(p.name)];
    }, []);

    const dedupeAndExcludeVariants = React.useCallback((base: Product | undefined, list: Product[]) => {
        const all = base ? [base, ...list] : [...list];
        if (all.length === 0) return [];

        const idToIndex = new Map<string, number>();
        all.forEach((p, idx) => {
            if (p?._id) idToIndex.set(String(p._id), idx);
        });

        const parent = Array.from({ length: all.length }, (_, i) => i);
        const find = (x: number) => {
            while (parent[x] !== x) {
                parent[x] = parent[parent[x]];
                x = parent[x];
            }
            return x;
        };
        const union = (a: number, b: number) => {
            const ra = find(a);
            const rb = find(b);
            if (ra !== rb) parent[rb] = ra;
        };

        // productId links
        all.forEach((p, i) => {
            getVariantLinkedIds(p).forEach((id) => {
                const j = idToIndex.get(id);
                if (typeof j === 'number') union(i, j);
            });
        });

        // slug/text keys
        const slugMap = new Map<string, number>();
        all.forEach((p, i) => {
            getVariantSlugKeys(p).forEach((key) => {
                if (!slugMap.has(key)) slugMap.set(key, i);
                else union(i, slugMap.get(key)!);
            });
        });

        // base keys
        const baseMap = new Map<string, number>();
        all.forEach((p, i) => {
            getBaseKeys(p).forEach((key) => {
                if (!baseMap.has(key)) baseMap.set(key, i);
                else union(i, baseMap.get(key)!);
            });
        });

        // token prefix keys
        const tokenMap = new Map<string, number>();
        all.forEach((p, i) => {
            getTokenPrefixKeys(p).forEach((key) => {
                if (!tokenMap.has(key)) tokenMap.set(key, i);
                else union(i, tokenMap.get(key)!);
            });
        });

        // aggressive name keys
        const aggMap = new Map<string, number>();
        all.forEach((p, i) => {
            getAggressiveNameKeys(p).forEach((key) => {
                if (!aggMap.has(key)) aggMap.set(key, i);
                else union(i, aggMap.get(key)!);
            });
        });

        const baseRoot = base ? find(0) : null;
        const seenRoot = new Set<number>();
        const result: Product[] = [];

        for (let i = base ? 1 : 0; i < all.length; i++) {
            const root = find(i);
            if (baseRoot !== null && root === baseRoot) continue; // exclude same variant group as base
            if (seenRoot.has(root)) continue; // dedupe variants
            seenRoot.add(root);
            result.push(all[i]);
        }

        return result;
    }, [getAggressiveNameKeys, getBaseKeys, getTokenPrefixKeys, getVariantLinkedIds, getVariantSlugKeys]);

    // Map products to FeaturedProduct format with variant dedupe and base-group exclusion
    const relatedProducts = useMemo(() => {
        const primary = hasRelatedProductIds ? (productsByIdsQuery.data?.data || []) : [];
        const fallback = fallbackRelatedQuery.data?.data || [];

        // If manual exists: combine primary + fallback; else use fallback only
        const combined = hasRelatedProductIds ? [...primary, ...fallback] : fallback;

        if (combined.length === 0) return [];

        const cleaned = dedupeAndExcludeVariants(product as Product | undefined, combined).slice(0, 8);
        return cleaned.map(mapProductToFeaturedProduct);
    }, [hasRelatedProductIds, productsByIdsQuery.data, fallbackRelatedQuery.data, product, dedupeAndExcludeVariants]);

    // Calculate items per view and slide step
    const itemsPerView = isMobile ? 2 : 4;
    const slideStep = itemsPerView;

    // Group products into slides (must be before early returns)
    const slides = useMemo(() => {
        const result = [];
        for (let i = 0; i < relatedProducts.length; i += slideStep) {
            result.push(relatedProducts.slice(i, i + slideStep));
        }
        return result;
    }, [relatedProducts, slideStep]);

    const maxIndex = Math.max(0, slides.length - 1);

    // Reset index when products change or screen size changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [relatedProducts.length, isMobile]);

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < maxIndex;

    // Touch handling state
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Min swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && canGoNext) {
            handleNext();
        }
        if (isRightSwipe && canGoPrev) {
            handlePrev();
        }
    };

    // Don't render if no product data
    if (!product) {
        return null;
    }

    // Loading state
    if (productsQuery?.isLoading && (!fallbackRelatedQuery || fallbackRelatedQuery.isLoading)) {
        return (
            <ProductSectionLayout title="Sản phẩm liên quan">
                <ProductListSkeleton count={4} />
            </ProductSectionLayout>
        );
    }

    // Error or empty state
    if (productsQuery?.error || relatedProducts.length === 0) {
        return null; // Don't show section if no products
    }

    return (
        <ProductSectionLayout title="Sản phẩm liên quan">
            <div className={cx('related-slider-wrapper')}>
                <div
                    ref={sliderRef}
                    className={cx('related-slider')}
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {slides.map((slideProducts, slideIndex) => (
                        <div key={slideIndex} className={cx('slider-slide')}>
                            {slideProducts.map((product) => (
                                <div key={product.id} className={cx('slider-item')}>
                                    <ProductCard
                                        id={product.id}
                                        productName={product.productName}
                                        price={product.price}
                                        oldPrice={product.oldPrice}
                                        discount={product.discount}
                                        rating={product.rating}
                                        reviewCount={product.reviewCount}
                                        status={product.status}
                                        href={product.href}
                                        imageSrc={product.imageSrc}
                                        imageAlt={product.imageAlt}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                {slides.length > 1 && (
                    <div className={cx('slider-navigation')}>
                        <button
                            className={cx('nav-button', 'nav-prev', { disabled: !canGoPrev })}
                            onClick={handlePrev}
                            disabled={!canGoPrev}
                            aria-label="Sản phẩm trước"
                        >
                            <ChevronLeftIcon size={20} />
                        </button>
                        <button
                            className={cx('nav-button', 'nav-next', { disabled: !canGoNext })}
                            onClick={handleNext}
                            disabled={!canGoNext}
                            aria-label="Sản phẩm tiếp theo"
                        >
                            <ChevronRightIcon size={20} />
                        </button>
                    </div>
                )}
            </div>
        </ProductSectionLayout>
    );
};

export default RelatedProducts;

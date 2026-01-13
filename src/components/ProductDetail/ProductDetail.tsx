'use client';

import React, { useState, useMemo } from 'react';
import classNames from 'classnames/bind';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import styles from './ProductDetail.module.scss';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductNotes from './ProductNotes';
import ProductDelivery from './ProductDelivery';
import ProductFeatures from './ProductFeatures';
import ProductWarranty from './ProductWarranty';
import ProductFAQ from './ProductFAQ';
import RelatedProducts from './RelatedProducts';
import ProductComments from './ProductComments';
import { useProduct } from '@/services/productService';
import { useRouter } from 'next/navigation';
import { mutate as swrMutate, useSWRConfig } from 'swr';
import { fetcher } from '@/utils/httpRequest';
import { ProductListSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { PackageIcon } from '@/components/Icons';
import { addViewedProduct, type ViewedProductsResponse } from '@/services/userService';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { addGuestViewedProduct } from '@/redux/viewedProductsSlice';

const cx = classNames.bind(styles);

interface ProductDetailProps {
    slug: string;
}

// Helper to process markdown content (auto-convert raw image URLs to markdown images)
const processMarkdownContent = (content: string) => {
    if (!content) return '';
    return content.split('\n').map(line => {
        // Check if line is a standalone image URL
        const trimmedLine = line.trim();
        const isImageUrl = /^(https?:\/\/[^\s]+(\.(png|jpg|jpeg|gif|webp|svg))?(\?[^\s]*)?)$/i.test(trimmedLine) &&
            (/\.(png|jpg|jpeg|gif|webp|svg)($|\?)/i.test(trimmedLine) || trimmedLine.includes('images') || trimmedLine.includes('img'));

        // Simple check for common image extensions or explicit image paths
        if (isImageUrl && !trimmedLine.startsWith('![')) {
            return `![](${trimmedLine})`;
        }
        return line;
    }).join('\n');
};

const ProductDetail: React.FC<ProductDetailProps> = ({ slug }) => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { cache, mutate: globalMutate } = useSWRConfig();
    const currentUser = useSelector((state: RootState) => state.auth.login?.currentUser);
    const lastTrackedProductId = React.useRef<string | null>(null);

    // Fetch product from API
    const { data: productResponse, error, isLoading, mutate } = useProduct(slug);

    // Backend returns { product, reviews }
    // Note: relatedProduct field is in product object (array of IDs)
    // Client will fetch related products separately via /products/by-ids if needed
    const product = productResponse?.data?.product;

    React.useEffect(() => {
        const productId = product?._id;
        if (!productId) {
            return;
        }

        if (lastTrackedProductId.current === productId) {
            return;
        }

        lastTrackedProductId.current = productId;

        if (currentUser?.accessToken) {
            const trackViewedProduct = async () => {
                try {
                    await addViewedProduct(productId);

                    const viewedProductsKey = '/api/v1/users/viewed-products?limit=50';
                    await globalMutate(
                        viewedProductsKey,
                        (current?: ViewedProductsResponse) => {
                            const normalizedCurrent: ViewedProductsResponse = current || {
                                success: true,
                                data: [],
                                pagination: {
                                    page: 1,
                                    limit: 50,
                                    total: 0,
                                    totalPages: 1,
                                },
                            };

                            const existingData = normalizedCurrent.data || [];
                            const updatedData = [
                                product,
                                ...existingData.filter((item) => item._id !== productId),
                            ].slice(0, 50);

                            const updatedPagination = normalizedCurrent.pagination
                                ? {
                                    ...normalizedCurrent.pagination,
                                    total: Math.max(
                                        normalizedCurrent.pagination.total || 0,
                                        updatedData.length
                                    ),
                                    totalPages: normalizedCurrent.pagination.limit
                                        ? Math.ceil(
                                            Math.max(
                                                normalizedCurrent.pagination.total || 0,
                                                updatedData.length
                                            ) / normalizedCurrent.pagination.limit
                                        )
                                        : normalizedCurrent.pagination.totalPages,
                                }
                                : normalizedCurrent.pagination;

                            return {
                                ...normalizedCurrent,
                                data: updatedData,
                                pagination: updatedPagination,
                            };
                        },
                        {
                            revalidate: true,
                            populateCache: true,
                            rollbackOnError: false,
                        }
                    );
                } catch (error) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error('Failed to track viewed product', error);
                    }
                }
            };

            trackViewedProduct();
        } else if (product) {
            dispatch(addGuestViewedProduct(product));
        }
    }, [product, currentUser?.accessToken, globalMutate, dispatch]);

    // Extract price information (must be before conditional returns)
    const priceItem = product && Array.isArray(product.price) && product.price.length > 0
        ? product.price[0]
        : null;
    const priceOriginal = priceItem?.priceOriginal || 0;
    const discount = priceItem?.discount;
    // Check if there's a valid discount (priceDiscount > 0 and < priceOriginal)
    const hasValidDiscount = discount?.priceDiscount !== undefined && 
                             discount.priceDiscount !== null && 
                             discount.priceDiscount > 0 && 
                             discount.priceDiscount < priceOriginal;
    // If priceDiscount exists and is valid, use it as the final price
    // Otherwise, use priceOriginal (no discount)
    const finalPrice = hasValidDiscount
        ? discount.priceDiscount
        : priceOriginal;
    // oldPrice = priceOriginal if there's a valid discount
    const oldPrice = hasValidDiscount
        ? priceOriginal
        : undefined;
    // discountPercent = (priceOriginal - priceDiscount) / priceOriginal * 100
    const discountPercent = hasValidDiscount && priceOriginal > 0
        ? Math.round(((priceOriginal - discount.priceDiscount) / priceOriginal) * 100)
        : undefined;

    // Map product to component format (must be before conditional returns)
    const mappedProduct = useMemo(() => {
        if (!product) {
            return null;
        }

        // Description is now an object, not array
        const desc = product.description || {};

        // Extract fields from description object
        const tutorial = desc.tutorial || '';
        const policy = desc.policy || '';
        const info = desc.info || '';
        const description = desc.description || '';
        const note = desc.note || '';
        const platform = desc.platform || '';
        const other = desc.other || '';

        // Parse tutorial into notes (Lưu ý)
        const notes: string[] = tutorial
            ? tutorial.split('\n').filter((n: string) => n.trim())
            : [];

        // Parse description into delivery steps
        const deliverySteps: string[] = description
            ? description.split('\n').filter((s: string) => s.trim())
            : [];

        // Build features from title and description
        const features: Array<{ title: string; description: string }> = [];
        if (desc.title && desc.description) {
            features.push({
                title: desc.title,
                description: desc.description,
            });
        }

        // Parse FAQs from info (Câu hỏi thường gặp)
        const faqs: Array<{ question: string; answer: string }> = [];
        if (info) {
            const faqItems = info.split('\n\n').filter((item: string) => item.trim());
            faqItems.forEach((item: string) => {
                const parts = item.split('\n');
                if (parts.length >= 2) {
                    faqs.push({
                        question: parts[0].trim(),
                        answer: parts.slice(1).join('\n').trim(),
                    });
                }
            });
        }

        // Extract warranty info from policy and warrantyPeriod
        const warrantyPeriod = product.warrantyPeriod || 0;
        let warrantyPeriodText = 'Theo chính sách';
        if (warrantyPeriod > 0) {
            if (warrantyPeriod < 30) {
                warrantyPeriodText = `${warrantyPeriod} ngày`;
            } else if (warrantyPeriod === 30) {
                warrantyPeriodText = '1 tháng';
            } else if (warrantyPeriod < 365) {
                const months = Math.floor(warrantyPeriod / 30);
                warrantyPeriodText = `${months} tháng`;
            } else {
                const years = Math.floor(warrantyPeriod / 365);
                warrantyPeriodText = `${years} năm`;
            }
        } else {
            warrantyPeriodText = 'Không bảo hành';
        }

        const warranty = policy
            ? {
                period: warrantyPeriod > 0 ? warrantyPeriodText : 'Theo chính sách',
                method: policy.split('\n').filter((m: string) => m.trim()),
            }
            : {
                period: warrantyPeriod > 0 ? warrantyPeriodText : 'Theo chính sách',
                method: [],
            };

        // Determine stock status - check isActive and stock
        const isAvailable = product.isActive !== false && (product.stock || 0) > 0;

        return {
            id: product._id,
            slug: product.slug,
            productName: product.name || '',
            productCode: product.slug || product._id, // Mã sản phẩm từ slug
            price: finalPrice || 0,
            oldPrice: oldPrice,
            discount: discountPercent,
            status: (isAvailable ? 'in-stock' : 'out-of-stock') as 'in-stock' | 'out-of-stock',
            category: product.categoryId?.map((cat: any) => (typeof cat === 'object' ? cat?.name : '') || '').filter(Boolean).join(', ') || '',
            rating: product.rating || 0,
            reviewCount: product.totalReviews || 0,
            images: Array.isArray(product.image) ? product.image.filter(Boolean) : [],
            notes: notes.filter((n, i, arr) => arr.indexOf(n) === i).filter(Boolean), // Remove duplicates and empty
            deliverySteps: deliverySteps.filter((s, i, arr) => arr.indexOf(s) === i).filter(Boolean), // Remove duplicates and empty
            features: features.length > 0 ? features : (description || product.shortDescription ? [{ title: product.name || 'Chi tiết', description: description || product.shortDescription || '' }] : []),
            warranty,
            faqs: faqs.filter((f, i, arr) => arr.findIndex(a => a.question === f.question) === i).filter(f => f.question && f.answer), // Remove duplicates and empty
            // Description sections
            tutorial, // Lưu ý
            policy, // Chính sách bảo hành
            info, // Câu hỏi thường gặp
            description: description || product.shortDescription || '', // Chi tiết sản phẩm
            tos: product.tos || undefined, // Terms of Service (Điều khoản và lưu ý)
            paymentpromo: product.paymentpromo || undefined, // Ưu đãi thanh toán riêng cho sản phẩm
        };
    }, [product, finalPrice, oldPrice, discountPercent]);

    // useState must be before conditional returns
    const [selectedPackage, setSelectedPackage] = useState<{
        id: string;
        name: string;
        price: number;
        selected: boolean;
    }>({
        id: '1',
        name: product?.name || '',
        price: finalPrice,
        selected: true,
    });

    // Update selectedPackage when product changes
    React.useEffect(() => {
        if (product && mappedProduct) {
            setSelectedPackage({
                id: '1',
                name: product.name,
                price: finalPrice,
                selected: true,
            });
        }
    }, [product, mappedProduct, finalPrice]);

    const handlePackageSelect = (pkg: typeof selectedPackage) => {
        setSelectedPackage(pkg);
    };

    // Handle variant selection - update URL and use SWR cache
    const handleVariantSelect = async (variantSlug: string) => {
        if (!variantSlug || variantSlug === slug) {
            return; // Same variant, no need to change
        }

        const newKey = `/api/v1/products/${variantSlug}`;

        // Check if data already exists in SWR cache
        // SWR stores data in cache with the key, we can check if it exists
        const cacheEntry = cache.get(newKey);

        // Preload images if we have cached data
        if (cacheEntry && cacheEntry.data) {
            const cachedProduct = cacheEntry.data?.data?.product;
            if (cachedProduct?.image && Array.isArray(cachedProduct.image)) {
                // Preload images in background
                cachedProduct.image.forEach((imageSrc: string) => {
                    if (imageSrc) {
                        const img = new window.Image();
                        img.src = imageSrc;
                    }
                });
            }
            // Data already in cache, just update URL
            // Component will re-render and useProduct will get cached data immediately
            router.replace(`/product/${variantSlug}`, { scroll: false });
            return;
        }

        // Data not in cache, prefetch it using SWR's mutate
        // This will use the same fetcher and update cache automatically
        try {
            // Prefetch using SWR's mutate - it will use the same fetcher
            // and automatically update the cache
            // revalidate: true means fetch new data (since it's not in cache)
            const newData = await fetcher(newKey) as any;

            // Preload images from the fetched data
            if (newData?.data?.product?.image && Array.isArray(newData.data.product.image)) {
                newData.data.product.image.forEach((imageSrc: string) => {
                    if (imageSrc) {
                        const img = new window.Image();
                        img.src = imageSrc;
                    }
                });
            }

            // Update SWR cache with the fetched data
            await swrMutate(newKey, newData, {
                revalidate: false, // Don't revalidate, we just fetched
                populateCache: true, // Update cache with new data
            });

            // Update URL - component will re-render and useProduct will get cached data
            router.replace(`/product/${variantSlug}`, { scroll: false });
        } catch (error) {
            console.error('Error prefetching variant product:', error);
            // Still update URL even if prefetch fails - SWR will fetch automatically on next render
            router.replace(`/product/${variantSlug}`, { scroll: false });
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={cx('product-detail')}>
                <div className={cx('container-wide')}>
                    <ProductListSkeleton count={1} />
                </div>
            </div>
        );
    }

    // Error state
    if (error || !product || !mappedProduct) {
        return (
            <div className={cx('product-detail')}>
                <div className={cx('container-wide')}>
                    <EmptyState
                        type="products"
                        icon={<PackageIcon size={80} />}
                        title="Không tìm thấy sản phẩm"
                        description="Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
                        actionLabel="Quay lại trang chủ"
                        actionHref="/"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={cx('product-detail')}>
            <div className={cx('container-wide')}>
                {/* Main Product Section - 2 Columns */}
                <div className={cx('product-main-section')}>
                    <div className={cx('product-main-left')}>
                        <ProductImageGallery
                            key={`gallery-${slug}`}
                            images={mappedProduct.images}
                            productName={mappedProduct.productName}
                            features={[]}
                            productKey={slug}
                        />
                    </div>
                    <div className={cx('product-main-right')}>
                        <ProductInfo
                            product={mappedProduct}
                            selectedPackage={selectedPackage}
                            onPackageSelect={handlePackageSelect}
                            variants={product?.variant}
                            options={product?.options}
                            onVariantSelect={handleVariantSelect}
                            currentSlug={slug}
                        />
                    </div>
                </div>

                {/* Product Notes Section - Tutorial (Lưu ý) */}
                {mappedProduct.notes.length > 0 && (
                    <ProductNotes notes={mappedProduct.notes} />
                )}

                {/* Chi tiết sản phẩm Section */}
                <h2 className={cx('section-title', 'main-title')}>Chi tiết sản phẩm</h2>

                <div className={cx('product-details-section')}>
                    <div className={cx('product-details-left')}>
                        {/* Description Content */}
                        {mappedProduct.description && (
                            <div className={cx('product-detail-content')}>
                                <div className={cx('section-description', 'markdown-body')}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                    >
                                        {processMarkdownContent(mappedProduct.description)}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {/* {mappedProduct.features.length > 0 && (
                            <ProductFeatures features={mappedProduct.features} />
                        )} */}
                    </div>
                    {/* <div className={cx('product-details-right')}>
                        {mappedProduct.deliverySteps.length > 0 && (
                            <ProductDelivery steps={mappedProduct.deliverySteps} />
                        )}
                    </div> */}
                </div>

                {/* Warranty Section - Policy (Chính sách bảo hành) */}
                {mappedProduct.policy && (
                    <ProductWarranty warranty={mappedProduct.warranty} />
                )}

                {/* FAQ Section - Info (Câu hỏi thường gặp) */}
                {mappedProduct.faqs.length > 0 && (
                    <ProductFAQ
                        faqs={mappedProduct.faqs}
                        rating={mappedProduct.rating}
                        reviewCount={mappedProduct.reviewCount}
                    />
                )}

                {/* Related Products */}
                <RelatedProducts product={product} />

                {/* Comments Section */}
                <ProductComments productId={mappedProduct.id} />
            </div>
        </div>
    );
};

export default ProductDetail;
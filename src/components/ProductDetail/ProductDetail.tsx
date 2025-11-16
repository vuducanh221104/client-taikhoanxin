'use client';

import React, { useState } from 'react';
import classNames from 'classnames/bind';
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
import { getProductById } from '@/services/productService';

const cx = classNames.bind(styles);

interface ProductDetailProps {
    slug: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ slug }) => {
    // Extract product ID from slug (format: "product-name-id")
    // Slug format example: "google-ai-ultra-45000-credit-veo-3-1-thang-tai-khoan-1"
    const productId = slug.split('-').pop() || '1'; // Get last part as ID
    
    // Get product from service
    const productData = getProductById(productId);
    
    // Merge product data with detailed information
    // Use productData for basic info (name, price, images) and fallback to mock for detailed info
    const baseProduct = productData || {
        id: productId,
        productName: 'Google AI Ultra (45000 Credit VEO 3) 1 tháng - Tài khoản',
        price: 199000,
        oldPrice: 6500000,
        imageSrc: '/products/product-1.png',
        imageAlt: 'Google AI Ultra',
        href: `/products/${slug}`,
        status: 'in-stock' as const,
        rating: 5,
        reviewCount: 693,
    };
    
    const product = {
        id: baseProduct.id,
        slug: slug,
        productName: baseProduct.productName,
        price: baseProduct.price,
        oldPrice: baseProduct.oldPrice || baseProduct.price * 1.5,
        discount: baseProduct.oldPrice ? Math.round(((baseProduct.oldPrice - baseProduct.price) / baseProduct.oldPrice) * 100) : 0,
        status: baseProduct.status || ('in-stock' as const),
        productCode: `product-${baseProduct.id}`,
        category: 'App, ai, New, Gemini, veo 3',
        rating: baseProduct.rating || 5,
        reviewCount: baseProduct.reviewCount || 0,
        images: [
            baseProduct.imageSrc || '/products/product-1.png',
            '/products/product-2.png',
            '/products/product-3.png',
        ],
        packages: [
            { id: '1', name: 'Ultra (1 tháng)', price: 199000, selected: true },
            { id: '2', name: 'Ultra Không Credit (1 tháng)', price: 179000, selected: false },
            { id: '3', name: 'Pro (1 tháng)', price: 149000, selected: false },
            { id: '4', name: 'Pro (6 tháng)', price: 799000, selected: false },
            { id: '5', name: 'Pro (1 năm)', price: 1499000, selected: false },
            { id: '6', name: 'SP AI khác', price: 0, selected: false },
        ],
        notes: [
            'Khách hàng được phép thay đổi thông tin tài khoản.',
            'Tài khoản bao gồm 45,000 Credits để tạo video trên Flow hoặc hình ảnh trên Whisk (Hiện tại Flow đã hỗ trợ tại Việt Nam). Kiểm tra số dư credit [tại đây].',
            'Tài khoản chỉ sử dụng cho tính năng AI, không sử dụng cho các dịch vụ khác như YouTube, Google Drive.',
            'Thời gian sử dụng không tích lũy khi mua nhiều số lượng cùng lúc.',
            'Bảo hành chỉ áp dụng cho gói Google AI Ultra, không bao gồm dữ liệu cá nhân khách hàng lưu vào tài khoản (VD: Drive, ảnh Gmail).',
        ],
        deliverySteps: [
            'Đây là tài khoản Google AI Ultra tạo sẵn có thời hạn sử dụng 1 tháng.',
            'Sau khi mua hàng, bạn sẽ nhận được ngay thông tin đăng nhập tài khoản Google AI Ultra (Bao gồm Email và mật khẩu tài khoản Google).',
            'Thời gian xử lý: Bạn sẽ nhận được thông tin tài khoản ngay sau khi thanh toán thành công.',
            'Hình thức nhận hàng: Thông tin đăng nhập trong đơn hàng.',
            'Hướng dẫn đăng nhập Google AI Ultra',
        ],
        features: [
            {
                title: 'Gemini',
                description: 'Trải nghiệm phiên bản cao cấp nhất của ứng dụng Gemini với quyền truy cập sớm vào chế độ Deep Think 2.5 Pro, hỗ trợ các tác vụ phức tạp như lập trình, viết lách và nghiên cứu.',
            },
            {
                title: 'Flow - 45000 Credit',
                description: 'Công cụ làm phim AI mới, cho phép tạo ra các video chất lượng 1080p với điều khiển camera nâng cao và truy cập vào mô hình Veo 3.',
            },
            {
                title: 'Whisk',
                description: 'Công cụ tạo nội dung hình ảnh sử dụng văn bản và hình ảnh làm đầu vào, với giới hạn sử dụng cao nhất cho việc tạo video từ hình ảnh bằng Veo 2.',
            },
            {
                title: 'NotebookLM',
                description: 'Trợ lý ghi chú AI mạnh mẽ với khả năng nâng cấp và giới hạn sử dụng cao nhất, giúp bạn tổ chức và phân tích thông tin hiệu quả hơn.',
            },
            {
                title: 'Tích hợp Gemini trong các dịch vụ của Google',
                description: 'Truy cập Gemini trực tiếp trong Gmail, Docs, Vids và Chrome, giúp tối ưu hóa quy trình làm việc hàng ngày của bạn.',
            },
            {
                title: 'Project Mariner',
                description: 'Trợ lý tác vụ có khả năng xử lý đồng thời lên đến 10 nhiệm vụ, từ nghiên cứu đến đặt chỗ và mua sắm, tất cả từ một bảng điều khiển duy nhất.',
            },
        ],
        galleryFeatures: [
            {
                title: 'Tóm tắt thông tin trong Gmail và Google Drive',
                description: '',
            },
            {
                title: 'Tạo hình ảnh nhanh hơn',
                description: '',
            },
            {
                title: 'Hỗ trợ lập trình',
                description: '',
            },
            {
                title: 'Lên nội dung ý tưởng, học tập, công việc...',
                description: '',
            },
        ],
        whyChoose: 'Nếu bạn là nhà làm phim, nhà phát triển, chuyên gia sáng tạo hoặc đơn giản là muốn trải nghiệm những công nghệ AI tiên tiến nhất từ Google, Google AI Ultra với 45k Credit VEO 3 cung cấp quyền truy cập toàn diện vào các công cụ và mô hình mạnh mẽ nhất, giúp bạn đạt được hiệu suất và sáng tạo tối đa.',
        warranty: {
            period: '1 tháng',
            method: [
                'Đổi sản phẩm mới tương đương hoặc hoàn tiền theo thời gian chưa sử dụng.',
                'Trong trường hợp hết hàng để đổi mới, hoàn tiền theo quy tắc:',
                'Dưới 7 ngày: Hoàn 100% giá trị đơn hàng',
                'Sau 7 ngày: Hoàn tiền theo theo thời gian chưa sử dụng (VD gói 1 tháng nếu sử dụng được 15 ngày phát sinh lỗi thì sẽ được hoàn lại 50% giá trị đơn hàng)',
            ],
        },
        faqs: [
            {
                question: 'Google AI Ultra là gì?',
                answer: 'Google AI Ultra là gói dịch vụ cao cấp thuộc Google One, cung cấp quyền truy cập vào các công cụ AI mạnh mẽ nhất như Gemini 2.5 Pro, trợ lý AI trong Gmail, Docs, Sheets và nhiều tính năng sáng tạo như tạo video bằng AI (Veo), ghi chú thông minh (NotebookLM), và trợ lý đa nhiệm (Project Astra/Mariner).',
            },
            {
                question: 'Sau khi thanh toán tôi sẽ nhận được gì?',
                answer: 'Đây là gói tài khoản tạo sẵn từ Tài Khoản Xịn, bạn chỉ cần đăng nhập vào và sử dụng thông qua Google. Còn nhiều câu hỏi khác được giải đáp trực tiếp từ Google, bạn có thể tham khảo thêm tại đây',
            },
            {
                question: 'Google AI Ultra có gì khác với Gemini miễn phí?',
                answer: 'Google AI Ultra mang đến quyền truy cập vào Gemini 2.5 Pro, mô hình mạnh mẽ hơn nhiều so với phiên bản miễn phí. Ngoài ra, bạn còn được dùng thử sớm các công cụ như NotebookLM nâng cao, tạo video bằng AI chất lượng cao, truy cập Gemini ngay trong Gmail, Docs, Sheets và nhiều đặc quyền khác mà gói miễn phí không hỗ trợ.',
            },
            {
                question: 'Google AI Ultra có hỗ trợ tiếng Việt không?',
                answer: 'Hiện tại, Google AI Ultra chủ yếu hỗ trợ tiếng Anh. Tuy nhiên, các công cụ như Gemini đang dần hỗ trợ tiếng Việt cơ bản, và Google có thể mở rộng hỗ trợ ngôn ngữ trong tương lai. Để sử dụng đầy đủ tính năng, bạn nên sử dụng giao diện tiếng Anh.',
            },
            {
                question: 'Tôi có thể sử dụng Google AI Ultra trên điện thoại không?',
                answer: 'Có. Google AI Ultra hoạt động mượt mà trên thiết bị di động thông qua các ứng dụng Gemini, Gmail, Google Docs. Bạn có thể truy cập các công cụ AI nâng cao từ điện thoại, đồng bộ dữ liệu và làm việc linh hoạt mọi lúc, mọi nơi.',
            },
            {
                question: 'Sau khi hết 1 tháng thì tôi có thể gia hạn để dùng tiếp tài khoản này không?',
                answer: 'Không, sau 1 tháng, nếu bạn mua gói mới, bạn sẽ sử dụng tài khoản khác, không phải tài khoản cũ.',
            },
            {
                question: 'Tài khoản có hỗ trợ sử dụng tại nước ngoài không?',
                answer: 'Đây là tài khoản Google Workspace thông thường, nên bạn có thể sử dụng hoàn toàn ở nước ngoài (Trừ các quốc gia bị Google chặn như Trung Quốc, Nga, v.v.).',
            },
            {
                question: 'Tài khoản này có thể sử dụng Veo 3 không? Nếu có thì sử dụng thế nào?',
                answer: 'Google AI Ultra hiện tại đã bao gồm Veo 3. Bạn có thể sử dụng trực tiếp mô hình Veo 3 thông qua Gemini. Flow hiện tại đã hỗ trợ tại Việt Nam.',
            },
            {
                question: 'Sau khi tôi dùng hết 45.000 credit thì Tài Khoản Xịn có hỗ trợ mua thêm credit không?',
                answer: 'Không, Tài Khoản Xịn không hỗ trợ mua thêm credit cho tài khoản này.',
            },
            {
                question: 'Khi hết hạn, Tài Khoản Xịn có thu hồi tài khoản không?',
                answer: 'Shop không thu hồi tài khoản, tuy nhiên vì là tài khoản Workspace nên sẽ có thời gian sử dụng cụ thể và sẽ bị xóa khi hết hạn.',
            },
            {
                question: 'Nếu sử dụng hết credit thì tôi có thể nhờ Shop mua thêm Credit trên tài khoản không?',
                answer: 'Credit trên tài khoản không thể mua thêm.',
            },
        ],
    };

    const [selectedPackage, setSelectedPackage] = useState(product.packages[0]);

    const handlePackageSelect = (pkg: typeof product.packages[0]) => {
        setSelectedPackage(pkg);
    };

    return (
        <div className={cx('product-detail')}>
            <div className={cx('container-wide')}>
                {/* Main Product Section - 2 Columns */}
                <div className={cx('product-main-section')}>
                    <div className={cx('product-main-left')}>
                        <ProductImageGallery
                            images={product.images}
                            productName={product.productName}
                            features={product.galleryFeatures}
                        />
                    </div>
                    <div className={cx('product-main-right')}>
                        <ProductInfo
                            product={product}
                            selectedPackage={selectedPackage}
                            onPackageSelect={handlePackageSelect}
                        />
                    </div>
                </div>

                {/* Product Details Sections */}
                <ProductNotes notes={product.notes} />
                
                <h2 className={cx('section-title', 'main-title')}>Chi tiết sản phẩm</h2>
                
                <div className={cx('product-details-section')}>
                    <div className={cx('product-details-left')}>
                        <div className={cx('product-detail-content')}>
                            <h3 className={cx('content-subtitle')}>Tài khoản VEO 3 45k Credit</h3>
                            <p className={cx('section-description')}>
                                Google AI Ultra là gói đăng ký cao cấp mới nhất từ Google, cung cấp quyền truy cập tối đa vào các công cụ và mô hình AI tiên tiến nhất, được thiết kế để nâng cao năng suất và khả năng sáng tạo của bạn. Tài khoản có 45000 Credit AI có thể sử dụng model VEO 3.
                            </p>
                        </div>
                        <ProductFeatures features={product.features} />
                        <div className={cx('why-choose-section')}>
                            <h3 className={cx('why-choose-title')}>Tại sao chọn Google AI Ultra?</h3>
                            <p className={cx('why-choose-description')}>{product.whyChoose}</p>
                        </div>
                    </div>
                    <div className={cx('product-details-right')}>
                        <ProductDelivery steps={product.deliverySteps} />
                    </div>
                </div>

                {/* Warranty Section */}
                <ProductWarranty warranty={product.warranty} />

                {/* FAQ Section */}
                <ProductFAQ faqs={product.faqs} rating={product.rating} reviewCount={product.reviewCount} />

                {/* Related Products */}
                <RelatedProducts />

                {/* Comments Section */}
                <ProductComments productId={product.id} />
            </div>
        </div>
    );
};

export default ProductDetail;


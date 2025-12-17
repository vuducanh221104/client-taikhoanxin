import type { Metadata } from 'next';
import OrderLookupLayout from '@/layout/orderLookup';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export function generateMetadata({ params }: { params: { orderCode: string } }): Metadata {
    const code = params?.orderCode ? String(params.orderCode) : '';
    const orderCode = code ? code.toUpperCase() : 'Đơn hàng';
    const title = `Tra cứu đơn ${orderCode} | TaiKhoanXin`;
    const description = `Xem chi tiết đơn hàng ${orderCode} với OTP bảo mật. Theo dõi trạng thái giao hàng và thanh toán tại TaiKhoanXin.`;
    const canonical = `${siteUrl}/orders/lookup/${encodeURIComponent(code || 'ma-don')}`;

    return {
        title,
        description,
        keywords: [
            'tra cứu đơn hàng',
            'theo dõi đơn hàng',
            'order lookup',
            'mã đơn hàng',
            orderCode,
            'tai khoan xin',
        ],
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: 'TaiKhoanXin',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `TaiKhoanXin - Tra cứu ${orderCode}`,
                },
            ],
            type: 'website',
            locale: 'vi_VN',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical,
        },
    };
}

export default function OrderLookupWithCodePage() {
    return <OrderLookupLayout />;
}

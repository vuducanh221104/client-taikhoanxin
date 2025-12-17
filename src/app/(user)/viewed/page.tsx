import type { Metadata } from 'next';
import ViewedProductsPage from './ViewedClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Sản phẩm đã xem | TaiKhoanXin',
    description:
        'Xem lại các sản phẩm bạn vừa xem tại TaiKhoanXin – tổng hợp tài khoản bản quyền Netflix, YouTube Premium, Spotify, Office 365 và nhiều dịch vụ khác.',
    openGraph: {
        title: 'Sản phẩm đã xem | TaiKhoanXin',
        description:
            'Danh sách sản phẩm bạn đã xem để dễ dàng chọn mua tài khoản bản quyền tại TaiKhoanXin.',
        url: `${siteUrl}/viewed`,
        siteName: 'TaiKhoanXin',
        type: 'website',
        locale: 'vi_VN',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Sản phẩm đã xem',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sản phẩm đã xem | TaiKhoanXin',
        description:
            'Xem và quản lý danh sách sản phẩm bạn đã xem để chọn mua nhanh chóng tại TaiKhoanXin.',
        images: [ogImage],
    },
    alternates: {
        canonical: `${siteUrl}/viewed`,
    },
};

export default function ViewedPage() {
    return <ViewedProductsPage />;
}
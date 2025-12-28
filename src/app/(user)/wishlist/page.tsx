import type { Metadata } from 'next';
import WishlistLayout from '@/layout/wishlist';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Sản phẩm yêu thích | TaiKhoanXin',
    description:
        'Xem danh sách sản phẩm yêu thích của bạn tại TaiKhoanXin. Lưu lại các tài khoản bản quyền bạn quan tâm để mua sau.',
    keywords: [
        'sản phẩm yêu thích',
        'wishlist',
        'danh sách yêu thích',
        'lưu sản phẩm',
        'tài khoản yêu thích',
        'tai khoan xin',
    ],
    openGraph: {
        title: 'Sản phẩm yêu thích | TaiKhoanXin',
        description:
            'Quản lý danh sách sản phẩm yêu thích của bạn tại TaiKhoanXin. Lưu lại các tài khoản bản quyền để mua sau.',
        url: `${siteUrl}/wishlist`,
        siteName: 'TaiKhoanXin',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Sản phẩm yêu thích',
            },
        ],
        type: 'website',
        locale: 'vi_VN',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sản phẩm yêu thích | TaiKhoanXin',
        description:
            'Xem và quản lý danh sách sản phẩm yêu thích của bạn tại TaiKhoanXin.',
        images: [ogImage],
    },
    alternates: {
        canonical: `${siteUrl}/wishlist`,
    },
};

export default function WishlistPage() {
    return <WishlistLayout />;
}


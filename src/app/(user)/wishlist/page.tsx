import type { Metadata } from 'next';
import WishlistLayout from '@/layout/wishlist';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Sản phẩm yêu thích | TaiKhoanXin',
    description:
        'Xem danh sách sản phẩm yêu thích của bạn tại TaiKhoanXin..',
        keywords: [
            'yêu thích',
            'sản phẩm yêu thích',
            'danh sách yêu thích',
            'wishlist',
            'lưu sản phẩm',
            'sản phẩm đã lưu',
            'TaiKhoanXin',
            'taikhoanxin',
            'tai khoan xin',
          ],
    openGraph: {
        title: 'Sản phẩm yêu thích | TaiKhoanXin',
        description:
            'Quản lý danh sách sản phẩm yêu thích của bạn tại TaiKhoanXin.',
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


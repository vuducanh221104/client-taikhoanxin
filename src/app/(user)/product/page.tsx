import type { Metadata } from 'next';
import AllProductsPageClient from './AllProductsPageClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Tất cả sản phẩm | TaiKhoanXin',
    description: 'Khám phá tất cả sản phẩm tài khoản bản quyền tại TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/product`,
    },
    openGraph: {
        title: 'Tất cả sản phẩm | TaiKhoanXin',
        description: 'Khám phá danh sách tài khoản bản quyền tại TaiKhoanXin.',
        url: `${siteUrl}/product`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Tất cả sản phẩm',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tất cả sản phẩm | TaiKhoanXin',
        description: 'Khám phá danh sách tài khoản bản quyền tại TaiKhoanXin.',
        images: [ogImage],
    },
};
export default function AllProductsPage() {
    return <AllProductsPageClient />;
}

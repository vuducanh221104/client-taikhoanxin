import type { Metadata } from 'next';
import CategoriesLayout from '@/layout/categories';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Danh mục sản phẩm | TaiKhoanXin',
    description: 'Khám phá danh mục tài khoản số đa dạng: làm việc, AI, giải trí, học tập, Office, Windows và nhiều hơn tại TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/categories`,
    },
    openGraph: {
        title: 'Danh mục sản phẩm | TaiKhoanXin',
        description: 'Danh mục tài khoản số đa dạng cho mọi nhu cầu.',
        url: `${siteUrl}/categories`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Danh mục sản phẩm',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Danh mục sản phẩm | TaiKhoanXin',
        description: 'Danh mục tài khoản số đa dạng cho mọi nhu cầu.',
        images: [ogImage],
    },
};

export default function CategoriesPage() {
    return <CategoriesLayout />;
}

import type { Metadata } from 'next';
import CategoriesLayout from '@/layout/categories';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
  title: 'Danh mục | TaiKhoanXin',
  description: 'Khám phá danh mục sản phẩm theo nhu cầu.',
  alternates: {
    canonical: `${siteUrl}/categories`,
  },
  openGraph: {
    title: 'Danh mục | TaiKhoanXin',
    description: 'Khám phá danh mục sản phẩm theo nhu cầu.',
    url: `${siteUrl}/categories`,
    siteName: 'TaiKhoanXin',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'TaiKhoanXin - Danh mục',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Danh mục | TaiKhoanXin',
    description: 'Khám phá danh mục sản phẩm theo nhu cầu.',
    images: [ogImage],
  },
};

export default function CategoriesPage() {
  return <CategoriesLayout />;
}

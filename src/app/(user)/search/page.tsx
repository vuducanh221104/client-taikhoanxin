import type { Metadata } from 'next';
import SearchLayout from '@/layout/search';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
  title: 'Tìm kiếm sản phẩm | TaiKhoanXin',
  description: 'Tìm sản phẩm theo từ khóa và khám phá lựa chọn phù hợp.',
  keywords: [
    'tìm kiếm',
    'tìm kiếm sản phẩm',
    'tìm sản phẩm',
    'tìm kiếm tài khoản',
    'search',
    'search products',
    'tài khoản bản quyền',
    'TaiKhoanXin',
    'taikhoanxin',
    'tai khoan xin',
    'netflix',
    'youtube premium',
    'spotify',
    'microsoft 365',
    'office 365',
  ],
  openGraph: {
    title: 'Tìm kiếm sản phẩm  | TaiKhoanXin',
    description: 'Tìm sản phẩm theo từ khóa và khám phá lựa chọn phù hợp.',
    url: `${siteUrl}/search`,
    siteName: 'TaiKhoanXin',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'TaiKhoanXin - Tìm kiếm sản phẩm ',
      },
    ],
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tìm kiếm sản phẩm  | TaiKhoanXin',
    description: 'Tìm sản phẩm theo từ khóa.',
    images: [ogImage],
  },
  alternates: {
    canonical: `${siteUrl}/search`,
  },
};

export default function SearchPage() {
  return <SearchLayout />;
}

import { Metadata } from 'next';
import Home from '@/layout/home';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'TaiKhoanXin | Tài khoản bản quyền giá rẻ';
  const description =
    'Tài khoản bản quyền giá rẻ uy tín - bảo hành 24/7, hỗ trợ tận tâm'
  return {
    title,
    description,
    keywords: [
            // Brand
    'TaiKhoanXin',
    'taikhoanxin',
    'taikhoanxin.com',
    'tài khoản xịn',
    'tai khoan xin',

    // Intent chung
    'tài khoản bản quyền',
    'mua tài khoản bản quyền',
    'tài khoản chính hãng',
    'mua tài khoản chính hãng',
    'tài khoản premium',
    'mua tài khoản premium',
    'mua tài khoản online',
    'shop tài khoản',
    'tài khoản giá tốt',
    'mua tài khoản giá rẻ',
    'giá rẻ',  
      'tài khoản Netflix',
      'YouTube Premium',
      'Spotify Premium',
      'Microsoft 365',
    ],
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: 'TaiKhoanXin',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'TaiKhoanXin - Tài khoản bản quyền giá rẻ',
        },
      ],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

export default function HomePage() {
  return <Home />;
}

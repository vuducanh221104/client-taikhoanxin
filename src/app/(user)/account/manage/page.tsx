import type { Metadata } from 'next';
import AccountManageLayout from '@/layout/accountManage';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
  title: 'Tài khoản | TaiKhoanXin',
  description: 'Quản lý đơn hàng, cập nhật hồ sơ và bảo mật tài khoản.',
  alternates: {
    canonical: `${siteUrl}/account/manage`,
  },
  openGraph: {
    title: 'Tài khoản | TaiKhoanXin',
    description: 'Quản lý đơn hàng, cập nhật hồ sơ và bảo mật tài khoản.',
    url: `${siteUrl}/account/manage`,
    siteName: 'TaiKhoanXin',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'TaiKhoanXin - Tài khoản',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tài khoản | TaiKhoanXin',
    description: 'Quản lý đơn hàng, cập nhật hồ sơ và bảo mật tài khoản.',
    images: [ogImage],
  },
};

export default function AccountManagePage() {
  return <AccountManageLayout />;
}

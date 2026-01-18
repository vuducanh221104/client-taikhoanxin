import type { Metadata } from 'next';
import OrderLookupClient from './OrderLookupClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
  title: 'Tra cứu đơn hàng | TaiKhoanXin',
  description: 'Tra cứu đơn hàng bằng mã đơn và email. Xác thực OTP để bảo mật thông tin.',
  keywords: [
    'tra cứu đơn hàng',
    'theo dõi đơn hàng',
    'xem trạng thái đơn',
    'mã đơn hàng',
    'order lookup',
    'OTP',
    'TaiKhoanXin',
    'taikhoanxin',
    'tai khoan xin',
  ],
  openGraph: {
    title: 'Tra cứu đơn hàng | TaiKhoanXin',
    description: 'Tra cứu đơn hàng bằng mã đơn và email. Xác thực OTP để bảo mật thông tin.',
    url: `${siteUrl}/orders/lookup`,
    siteName: 'TaiKhoanXin',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'TaiKhoanXin - Tra cứu đơn hàng',
      },
    ],
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tra cứu đơn hàng | TaiKhoanXin',
    description: 'Tra cứu đơn hàng bằng mã đơn và email (OTP bảo mật).',
    images: [ogImage],
  },
  alternates: {
    canonical: `${siteUrl}/orders/lookup`,
  },
};

export default function OrderLookupRootPage({
  searchParams,
}: {
  searchParams: { orderCode?: string; token?: string; email?: string };
}) {
  const orderCode = searchParams?.orderCode || null;
  const token = searchParams?.token || null;
  const email = searchParams?.email || null;

  return (
    <OrderLookupClient
      initialOrderCode={orderCode}
      initialEmail={email}
      initialToken={token}
    />
  );
}

import type { Metadata } from 'next';
import AccountOrdersLayout from '@/layout/accountOrders';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
  title: 'Đơn hàng của bạn | TaiKhoanXin',
  description: 'Xem lịch sử mua hàng và trạng thái đơn hàng.',
  alternates: {
    canonical: `${siteUrl}/account/orders`,
  },
  openGraph: {
    title: 'Đơn hàng của bạn | TaiKhoanXin',
    description: 'Xem lịch sử mua hàng và trạng thái đơn hàng.',
    url: `${siteUrl}/account/orders`,
    siteName: 'TaiKhoanXin',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'TaiKhoanXin - Đơn hàng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đơn hàng của bạn | TaiKhoanXin',
    description: 'Xem lịch sử mua hàng và trạng thái đơn hàng.',
    images: [ogImage],
  },
};
export default function AccountOrdersPage() {
  return <AccountOrdersLayout />;
}

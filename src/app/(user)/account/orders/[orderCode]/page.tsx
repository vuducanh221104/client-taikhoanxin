import type { Metadata } from 'next';
import OrderDetailPageClient from './OrderDetailPageClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
  title: 'Chi tiết đơn hàng | TaiKhoanXin',
  description: 'Xem thông tin đơn hàng và trạng thái xử lý.',
  alternates: {
    canonical: `${siteUrl}/account/orders`, // nếu có route chi tiết theo id, nên set đúng URL chi tiết
  },
  openGraph: {
    title: 'Chi tiết đơn hàng | TaiKhoanXin',
    description: 'Xem thông tin đơn hàng và trạng thái xử lý.',
    url: `${siteUrl}/account/orders`, // nếu có route chi tiết theo id, nên set đúng URL chi tiết
    siteName: 'TaiKhoanXin',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'TaiKhoanXin - Chi tiết đơn hàng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chi tiết đơn hàng | TaiKhoanXin',
    description: 'Xem thông tin đơn hàng và trạng thái xử lý.',
    images: [ogImage],
  },
};

export default function OrderDetailPage() {
  return <OrderDetailPageClient />;
}

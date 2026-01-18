import type { Metadata } from 'next';
import CheckoutSuccessLayout from '@/layout/checkoutSuccess';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
  title: 'Xác nhận thanh toán | TaiKhoanXin',
  description: 'Xem lại đơn hàng và hoàn tất thanh toán theo hướng dẫn.',
  openGraph: {
    title: 'Xác nhận thanh toán | TaiKhoanXin',
    description: 'Xem lại đơn hàng và hoàn tất thanh toán theo hướng dẫn.',
    url: `${siteUrl}/checkout/success`,
    siteName: 'TaiKhoanXin',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'TaiKhoanXin - Xác nhận thanh toán',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xác nhận thanh toán | TaiKhoanXin',
    description: 'Xem đơn hàng và xác nhận thanh toán.',
    images: [ogImage],
  },
  alternates: {
    canonical: `${siteUrl}/checkout/success`,
  },
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessLayout />;
}

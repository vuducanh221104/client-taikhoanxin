import type { Metadata } from 'next';
import CheckoutLayout from '@/layout/checkout';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
  title: 'Thanh toán | TaiKhoanXin',
  description: 'Hoàn tất đơn hàng và thanh toán an toàn chỉ trong vài bước.',
  openGraph: {
    title: 'Thanh toán | TaiKhoanXin',
    description: 'Hoàn tất đơn hàng và thanh toán an toàn chỉ trong vài bước.',
    url: `${siteUrl}/checkout`,
    siteName: 'TaiKhoanXin',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'TaiKhoanXin - Thanh toán',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thanh toán | TaiKhoanXin',
    description: 'Hoàn tất thanh toán nhanh tại TaiKhoanXin.',
    images: [ogImage],
  },
  alternates: {
    canonical: `${siteUrl}/checkout`,
  },
};

export default function CheckoutPage() {
  return <CheckoutLayout />;
}

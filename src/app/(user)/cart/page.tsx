import type { Metadata } from 'next';
import CartLayout from '@/layout/cart';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
  title: 'Giỏ hàng của bạn | TaiKhoanXin',
  description: 'Xem lại sản phẩm đã chọn và hoàn tất thanh toán',
  openGraph: {
    title: 'Giỏ hàng của bạn | TaiKhoanXin',
    description: 'Xem lại sản phẩm đã chọn và hoàn tất thanh toán',
    url: `${siteUrl}/cart`,
    siteName: 'TaiKhoanXin',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'TaiKhoanXin - Giỏ hàng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giỏ hàng của bạn | TaiKhoanXin',
    description: 'Kiểm tra giỏ hàng và tiếp tục thanh toán',
    images: [ogImage],
  },
  alternates: {
    canonical: `${siteUrl}/cart`,
  },
};

export default function CartPage() {
  return <CartLayout />;
}

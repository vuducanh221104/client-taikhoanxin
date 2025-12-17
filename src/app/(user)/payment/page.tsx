import type { Metadata } from 'next';
import PaymentLayout from '@/layout/payment';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Phương thức thanh toán | TaiKhoanXin',
    description:
        'Xem các phương thức thanh toán được hỗ trợ tại TaiKhoanXin: chuyển khoản ngân hàng, quét QR, thẻ ngân hàng, VNPAY-QR và nhiều hình thức khác.',
    keywords: [
        'phương thức thanh toán',
        'thanh toán online',
        'chuyển khoản ngân hàng',
        'quét QR thanh toán',
        'VNPAY',
        'thẻ ngân hàng',
        'thanh toán điện tử',
        'tai khoan xin',
    ],
    openGraph: {
        title: 'Phương thức thanh toán | TaiKhoanXin',
        description:
            'Danh sách các cổng thanh toán và hình thức nạp tiền, thanh toán đơn hàng tại TaiKhoanXin.',
        url: `${siteUrl}/payment`,
        siteName: 'TaiKhoanXin',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Phương thức thanh toán',
            },
        ],
        type: 'website',
        locale: 'vi_VN',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Phương thức thanh toán | TaiKhoanXin',
        description:
            'Tìm hiểu các phương thức thanh toán an toàn và nhanh chóng tại TaiKhoanXin.',
        images: [ogImage],
    },
    alternates: {
        canonical: `${siteUrl}/payment`,
    },
};

export default function PaymentPage() {
    return <PaymentLayout />;
}

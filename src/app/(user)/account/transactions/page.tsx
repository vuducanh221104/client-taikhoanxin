import type { Metadata } from 'next';
import AccountTransactionsLayout from '@/layout/accountTransactions';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Lịch sử giao dịch | TaiKhoanXin',
    description: 'Xem chi tiết nạp tiền, thanh toán, hoàn tiền và số dư ví của bạn trên TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/account/transactions`,
    },
    openGraph: {
        title: 'Lịch sử giao dịch | TaiKhoanXin',
        description: 'Theo dõi các giao dịch và biến động số dư của bạn.',
        url: `${siteUrl}/account/transactions`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Lịch sử giao dịch',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lịch sử giao dịch | TaiKhoanXin',
        description: 'Theo dõi các giao dịch và biến động số dư của bạn.',
        images: [ogImage],
    },
};

export default function AccountTransactionsPage() {
    return <AccountTransactionsLayout />;
}


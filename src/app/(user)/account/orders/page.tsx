import type { Metadata } from 'next';
import AccountOrdersLayout from '@/layout/accountOrders';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Lịch sử đơn hàng | TaiKhoanXin',
    description: 'Theo dõi lịch sử mua hàng, trạng thái đơn và chi tiết từng đơn hàng của bạn trên TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/account/orders`,
    },
    openGraph: {
        title: 'Lịch sử đơn hàng | TaiKhoanXin',
        description: 'Theo dõi đơn hàng và trạng thái giao dịch của bạn.',
        url: `${siteUrl}/account/orders`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Lịch sử đơn hàng',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lịch sử đơn hàng | TaiKhoanXin',
        description: 'Theo dõi đơn hàng và trạng thái giao dịch của bạn.',
        images: [ogImage],
    },
};

export default function AccountOrdersPage() {
    return <AccountOrdersLayout />;
}


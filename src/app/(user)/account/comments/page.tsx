import type { Metadata } from 'next';
import AccountCommentsLayout from '@/layout/accountComments';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Bình luận & đánh giá | TaiKhoanXin',
    description: 'Xem và quản lý các bình luận, đánh giá sản phẩm bạn đã gửi tại TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/account/comments`,
    },
    openGraph: {
        title: 'Bình luận & đánh giá | TaiKhoanXin',
        description: 'Quản lý các bình luận và đánh giá của bạn.',
        url: `${siteUrl}/account/comments`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Bình luận & đánh giá',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Bình luận & đánh giá | TaiKhoanXin',
        description: 'Quản lý các bình luận và đánh giá của bạn.',
        images: [ogImage],
    },
};

export default function AccountCommentsPage() {
    return <AccountCommentsLayout />;
}


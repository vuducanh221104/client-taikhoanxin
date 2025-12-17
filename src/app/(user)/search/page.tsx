import type { Metadata } from 'next';
import SearchLayout from '@/layout/search';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Tìm kiếm sản phẩm | TaiKhoanXin',
    description:
        'Tìm kiếm tài khoản bản quyền tại TaiKhoanXin. Netflix, YouTube Premium, Spotify, Office 365 và nhiều dịch vụ khác. Tìm thấy các sản phẩm phù hợp với từ khóa của bạn.',
    keywords: [
        'tìm kiếm sản phẩm',
        'tìm kiếm tài khoản',
        'search products',
        'tài khoản bản quyền',
        'netflix',
        'youtube premium',
        'spotify',
        'office 365',
        'tai khoan xin',
    ],
    openGraph: {
        title: 'Tìm kiếm sản phẩm | TaiKhoanXin',
        description:
            'Tìm kiếm và khám phá các tài khoản bản quyền tại TaiKhoanXin. Hàng nghìn sản phẩm với giá tốt nhất.',
        url: `${siteUrl}/search`,
        siteName: 'TaiKhoanXin',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Tìm kiếm sản phẩm',
            },
        ],
        type: 'website',
        locale: 'vi_VN',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tìm kiếm sản phẩm | TaiKhoanXin',
        description:
            'Tìm kiếm tài khoản bản quyền tại TaiKhoanXin. Netflix, YouTube Premium, Spotify và nhiều dịch vụ khác.',
        images: [ogImage],
    },
    alternates: {
        canonical: `${siteUrl}/search`,
    },
};

export default function SearchPage() {
    return <SearchLayout />;
}

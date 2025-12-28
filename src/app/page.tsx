import { Metadata } from 'next';
import Home from '@/layout/home';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export async function generateMetadata(): Promise<Metadata> {
    const title = 'Tài Khoản Xịn | Tài khoản bản quyền giá rẻ ';
    const description = 'Mua tài khoản bản quyền uy tín: Netflix, YouTube Premium, Spotify, Office 365... Giao hàng nhanh, bảo hành rõ ràng tại TaiKhoanXin.';
    return {
        title,
        description,
        keywords: [
            'mua tài khoản netflix',
            'tài khoản youtube premium',
            'spotify family',
            'office 365 giá rẻ',
            'tài khoản bản quyền',
            'tai khoan xin',
        ],
        openGraph: {
            title,
            description,
            url: siteUrl,
            siteName: 'TaiKhoanXin',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: 'TaiKhoanXin - Mua tài khoản bản quyền',
                },
            ],
            locale: 'vi_VN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
        alternates: {
            canonical: siteUrl,
        },
    };
}

export default function HomePage() {
    return <Home />;
}

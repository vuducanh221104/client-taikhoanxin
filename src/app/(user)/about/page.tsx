import type { Metadata } from 'next';
import AboutLayout from '@/layout/about';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Về chúng tôi | TaiKhoanXin',
    description: 'Tài Khoản Xịn - nền tảng cung cấp tài khoản số uy tín, đa dạng Netflix, Spotify, Office, Windows, Adobe... Hỗ trợ 24/7, giao nhanh, bảo hành rõ ràng.',
    alternates: {
        canonical: `${siteUrl}/about`,
    },
    openGraph: {
        title: 'Về chúng tôi | TaiKhoanXin',
        description: 'Nền tảng tài khoản số uy tín, giao nhanh, hỗ trợ 24/7.',
        url: `${siteUrl}/about`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Về chúng tôi',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Về chúng tôi | TaiKhoanXin',
        description: 'Nền tảng tài khoản số uy tín, giao nhanh, hỗ trợ 24/7.',
        images: [ogImage],
    },
};

export default function AboutPage() {
    return <AboutLayout />;
}

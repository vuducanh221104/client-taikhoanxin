import type { Metadata } from 'next';
import AccountAddressesLayout from '@/layout/accountAddresses';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://cdn.taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Địa chỉ nhận hàng | TaiKhoanXin',
    description: 'Quản lý địa chỉ nhận hàng của bạn',
    alternates: {
        canonical: `${siteUrl}/account/addresses`,
    },
    openGraph: {
        title: 'Địa chỉ nhận hàng | TaiKhoanXin',
        description: 'Quản lý địa chỉ nhận hàng của bạn',
        url: `${siteUrl}/account/addresses`,
        siteName: 'TaiKhoanXin',
        locale: 'vi_VN',
        type: 'website',
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: 'TaiKhoanXin - Địa chỉ nhận hàng',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Địa chỉ nhận hàng | TaiKhoanXin',
        description: 'Quản lý địa chỉ nhận hàng của bạn',
        images: [ogImage],
    },
};

export default function AddressesPage() {
    return <AccountAddressesLayout />;
}

import type { Metadata } from 'next';
import AccountAddressesLayout from '@/layout/accountAddresses';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taikhoanxin.com';
const ogImage = 'https://taikhoanxin.com/seo/banner-seo.jpeg';

export const metadata: Metadata = {
    title: 'Địa chỉ nhận hàng | TaiKhoanXin',
    description: 'Quản lý sổ địa chỉ giao dịch, thêm/sửa/xóa và đặt địa chỉ mặc định trên TaiKhoanXin.',
    alternates: {
        canonical: `${siteUrl}/account/addresses`,
    },
    openGraph: {
        title: 'Địa chỉ nhận hàng | TaiKhoanXin',
        description: 'Quản lý sổ địa chỉ giao dịch của bạn trên TaiKhoanXin.',
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
        description: 'Quản lý sổ địa chỉ giao dịch của bạn trên TaiKhoanXin.',
        images: [ogImage],
    },
};

export default function AddressesPage() {
    return <AccountAddressesLayout />;
}

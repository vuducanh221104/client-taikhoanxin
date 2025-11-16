// Cấu trúc điều hướng cho trang Help
export interface HelpPage {
    title: string;
    href: string;
}

export const helpPages: HelpPage[] = [
    // Bắt đầu
    { title: 'Giới thiệu', href: '/help/getting-started/intro' },
    { title: 'Đăng ký tài khoản', href: '/help/getting-started/register' },
    { title: 'Đăng nhập', href: '/help/getting-started/login' },
    
    // Hướng dẫn mua hàng
    { title: 'Tìm kiếm sản phẩm', href: '/help/shopping/search' },
    { title: 'Thanh toán', href: '/help/shopping/checkout' },
    { title: 'Quản lý đơn hàng', href: '/help/shopping/manage-orders' },
    { title: 'Theo dõi đơn hàng', href: '/help/shopping/track-order' },
    
    // Tài khoản
    { title: 'Đổi mật khẩu', href: '/help/account/change-password' },
    { title: 'Lịch sử đơn hàng', href: '/help/account/order-history' },
    
    // Chính sách
    { title: 'Chính sách bảo hành', href: '/help/policies/warranty' },
    { title: 'Bảo hành Netflix', href: '/help/policies/warranty/netflix' },
    { title: 'Bảo hành Spotify', href: '/help/policies/warranty/spotify' },
    { title: 'Bảo hành Youtube', href: '/help/policies/warranty/youtube' },
    { title: 'Bảo hành ChatGPT', href: '/help/policies/warranty/chatgpt' },
    { title: 'Bảo hành Canva', href: '/help/policies/warranty/canva' },
    { title: 'Bảo hành CapCut', href: '/help/policies/warranty/capcut' },
    { title: 'Chính sách đổi trả', href: '/help/policies/return' },
    { title: 'Chính sách thanh toán', href: '/help/policies/payment' },
    
    // FAQ
    { title: 'FAQ - Netflix', href: '/help/faq/netflix' },
    { title: 'FAQ - Spotify', href: '/help/faq/spotify' },
    { title: 'FAQ - YouTube Premium', href: '/help/faq/youtube' },
    { title: 'FAQ - ChatGPT', href: '/help/faq/chatgpt' },
    { title: 'FAQ - Canva', href: '/help/faq/canva' },
    { title: 'FAQ - CapCut', href: '/help/faq/capcut' },
    { title: 'FAQ - Thanh toán & Bảo mật', href: '/help/faq/payment' },
    { title: 'FAQ - Bảo hành & Hỗ trợ', href: '/help/faq/support' },
    
    // Hướng dẫn khác
    { title: 'Cách sử dụng Netflix', href: '/help/guides/netflix-usage' },
    { title: 'Tải nhạc Offline Spotify', href: '/help/guides/spotify-offline' },
    { title: 'Tải video YouTube Premium', href: '/help/guides/youtube-download' },
    { title: 'Chia sẻ Netflix Family', href: '/help/guides/netflix-family' },
    { title: 'Chuyển playlist Spotify', href: '/help/guides/spotify-playlist' },
    { title: 'Sử dụng YouTube Music', href: '/help/guides/youtube-music' },
    { title: 'Bảo mật tài khoản', href: '/help/guides/account-security' },
];

export function getAdjacentPages(currentPath: string) {
    const currentIndex = helpPages.findIndex(page => page.href === currentPath);
    
    if (currentIndex === -1) {
        return { prev: null, next: null };
    }
    
    return {
        prev: currentIndex > 0 ? helpPages[currentIndex - 1] : null,
        next: currentIndex < helpPages.length - 1 ? helpPages[currentIndex + 1] : null,
    };
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các route cần bảo vệ
const PROTECTED_ROUTES = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
    },
};

export function middleware(request: NextRequest) {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const { pathname } = request.nextUrl;

    // Xử lý routes auth
    if (pathname.startsWith('/auth')) {
        // Nếu đã đăng nhập, không cho phép truy cập các trang login, register
        if (refreshToken && [PROTECTED_ROUTES.auth.login, PROTECTED_ROUTES.auth.register].includes(pathname)) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

// Áp dụng middleware cho auth routes
export const config = {
    matcher: ['/auth/:path*'],
};


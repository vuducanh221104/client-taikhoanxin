import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các route cần bảo vệ
const PROTECTED_ROUTES = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
    },
};

const CHECKOUT_ROUTE = '/checkout';
const CHECKOUT_SUCCESS_ROUTE = '/checkout/success';
const CART_ROUTE = '/cart';
const CART_QUANTITY_COOKIE = 'cartQuantity';

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

    // Bảo vệ trang checkout - chỉ cho phép khi giỏ hàng có sản phẩm
    const isCheckoutRoute = pathname.startsWith(CHECKOUT_ROUTE);
    const isCheckoutSuccessRoute = pathname.startsWith(CHECKOUT_SUCCESS_ROUTE);

    if (isCheckoutRoute && !isCheckoutSuccessRoute) {
        const cartQuantityValue = request.cookies.get(CART_QUANTITY_COOKIE)?.value;
        const cartQuantity = Number(cartQuantityValue ?? '0');
        const hasValidCartQuantity = Number.isFinite(cartQuantity) && cartQuantity > 0;

        if (!hasValidCartQuantity) {
            return NextResponse.redirect(new URL(CART_ROUTE, request.url));
        }
    }

    return NextResponse.next();
}

// Áp dụng middleware cho auth routes
export const config = {
    matcher: ['/auth/:path*', '/checkout/:path*'],
};


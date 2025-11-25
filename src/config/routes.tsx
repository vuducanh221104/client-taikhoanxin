const routes = {
    user: {
        home: '/',
        // Auth Routes
        login: '/auth/login',
        register: '/auth/register',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password',
        // Routes Main
        search: '/search',
        cart: '/cart',
        checkout: '/checkout',
        checkoutSuccess: '/checkout/success',
        payment: '/payment',
        wishlist: '/wishlist',
        dashboard: '/dashboard',
        // Product Routes
        products: '/product',
        productDetail: '/product', //slug
        productsSale: '/product/sale',
        productsNew: '/product/new',
        productsBestSelling: '/product/best-selling',
        productsViewed: '/products/viewed',
        category: '/categories', //slug
        // Account Routes
        account: '/account/manage',
        accountOrders: '/account/orders',
        accountComments: '/account/comments',
        accountPassword: '/account/password',
        // Page Routes
        about: '/about',
        contact: '/contact',
        privacy: '/privacy',
        terms: '/terms',
    },

    tools: {
        home: '/tools',
        loginCode: '/tools/login-code',
        youtubeTV: '/tools/youtube-tv',
        warranty: '/tools/warranty',
        orderInfo: '/tools/order-info',
    },

    help: {
        home: '/help',
        gettingStarted: {
            register: '/help/getting-started/register',
            login: '/help/getting-started/login',
        },
        shopping: {
            search: '/help/shopping/search',
            cart: '/help/shopping/cart',
            checkout: '/help/shopping/checkout',
            trackOrder: '/help/shopping/track-order',
        },
        account: {
            manage: '/help/account/manage',
            changePassword: '/help/account/change-password',
            orderHistory: '/help/account/order-history',
        },
        policies: {
            warranty: '/help/policies/warranty',
            return: '/help/policies/return',
            payment: '/help/policies/payment',
        },
    },

    domain: {
        name: 'https://taikhoanxin.com',
        nameCamel: 'TAIKHOANXIN.COM',
    },
};

export default routes;


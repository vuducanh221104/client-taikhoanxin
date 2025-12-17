import routes from './routes';

const config = {
    routes: routes.user,
    // routesAdmin: routes.admin, // Admin client là dự án riêng, không dùng trong Client
    routesTools: routes.tools,
    routesDomain: routes.domain,
};

export default config;
export { routes };


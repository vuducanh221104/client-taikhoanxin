import routes from './routes';

const config = {
    routes: routes.user,
    routesAdmin: routes.admin,
    routesTools: routes.tools,
    routesDomain: routes.domain,
};

export default config;
export { routes };


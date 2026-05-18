function build(base: string, path?: string) {
  const cleanBase = base.startsWith('/') ? base : `/${base}`;
  const cleanPath = path?.replace(/^\/+|\/+$/g, '');

  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
}

class ApiRouteConfig {
  auth = (path?: string) => build('/auth', path);
  users = (path?: string) => build('/users', path);
  roles = (path?: string) => build('/roles', path);
  sessions = (path?: string) => build('/sessions', path);
  presale = (path?: string) => build('/presale', path);
  ai = (path?: string) => build('/ai', path);
}

export const apiRoutes = new ApiRouteConfig();

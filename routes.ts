export const PRIVATE_ROUTES_PREFIX: string[] = ["/user"];

export const ADMIN_ROUTE_PREFIX: string = "/admin";

export const API_AUTH_ROUTE_PREFIX: string = "/api/auth";

export const AUTH_ROUTES: string[] = [
  "/log-in",
  "/sign-up",
  "/forgot-password",
];

export const DEFAULT_REDIRECT_AFTER_LOGIN: string = "/reload";

// post path prefix so this doees not break in production
export const IMAGES_PATH_PREFIX: string = `${process.env.NEXT_PUBLIC_SITE_URL}/api/images/`;

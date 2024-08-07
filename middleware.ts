import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  ADMIN_ROUTE_PREFIX,
  API_AUTH_ROUTE_PREFIX,
  AUTH_ROUTES,
  DEFAULT_REDIRECT_AFTER_LOGIN,
  PRIVATE_ROUTES_PREFIX,
} from "./routes";
import { notFound } from "next/navigation";
const { auth } = NextAuth(authConfig);

export default auth((req, res) => {
  const { nextUrl } = req;

  const { pathname } = nextUrl;

  const isLogin = !!req.auth;

  const isPrivateRoute = !!PRIVATE_ROUTES_PREFIX.filter(
    (PRIVATE_ROUTE_PREFIX) => pathname.startsWith(PRIVATE_ROUTE_PREFIX)
  ).length;

  const isAdminRoute = pathname.startsWith(ADMIN_ROUTE_PREFIX);
  const isApiAuthRoute = pathname.startsWith(API_AUTH_ROUTE_PREFIX);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const IsAdmin = req.auth?.user.role === "admin";

  if (isApiAuthRoute) return;

  if (isAuthRoute && isLogin) {
    return Response.redirect(new URL(DEFAULT_REDIRECT_AFTER_LOGIN, nextUrl));
  }

  if (!isLogin && isPrivateRoute) {
    return Response.redirect(new URL("/log-in", nextUrl));
  }

  if ((isAdminRoute && !IsAdmin) || (isAdminRoute && !isLogin)) {
    return Response.redirect(new URL("/log-in", nextUrl));
  }

  return;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

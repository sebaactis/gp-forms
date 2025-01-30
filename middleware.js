import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = [
    "/home",
    "/evaluations",
    "/history",
    "/employees",
    "/assignments",
    "/forms",
    "/roles",
    "/profile"
];

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            const loginUrl = new URL("/", req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}
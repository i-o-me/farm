import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (!isAdminRoute || isLoginRoute) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/$/, "");
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
  const hasValidConfig = Boolean(
    url &&
      anonKey &&
      !/[\r\n]/.test(url) &&
      !/[\r\n]/.test(anonKey) &&
      !anonKey.includes("SUPABASE_SERVICE_ROLE_KEY=") &&
      url.startsWith("https://"),
  );

  if (!hasValidConfig) {
    return NextResponse.redirect(new URL("/admin/login?error=config", request.url));
  }

  const response = NextResponse.next({ request: { headers: request.headers } });

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const { data: isAdmin, error: adminCheckError } = await supabase.rpc("is_admin");

    if (adminCheckError || !isAdmin) {
      return NextResponse.redirect(new URL("/admin/login?error=not-authorized", request.url));
    }

    return response;
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=config", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};

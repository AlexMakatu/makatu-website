export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ❗ allow bulk page itself
  if (pathname === "/rates/bulk") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/rates")) {
    const key = req.cookies.get("adminKey");

    if (key?.value !== process.env.ADMIN_UPLOAD_KEY) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

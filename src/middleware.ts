import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { isKnownPath, getNotFoundMarkdown, getPageMarkdown } from './lib/agenticMarkdown';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Static machine-readable files and developer endpoints bypass intl middleware
  if (
    pathname === '/llms.txt' ||
    pathname.startsWith('/.well-known/') ||
    pathname === '/openapi.json' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  const acceptHeader = request.headers.get('accept') || '';
  const wantsMarkdown = acceptHeader.toLowerCase().includes('text/markdown');

  // Agent content negotiation: Accept: text/markdown
  if (wantsMarkdown) {
    if (isKnownPath(pathname)) {
      const markdown = getPageMarkdown(pathname);
      return new NextResponse(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Vary': 'Accept',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      });
    }

    // Agent-friendly 404 with Markdown body
    const notFoundBody = getNotFoundMarkdown(pathname);
    return new NextResponse(notFoundBody, {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }

  // Standard request (HTML / browser navigation)
  const response = intlMiddleware(request);

  // Ensure 'Vary: Accept' is always present for proper content negotiation caching
  const existingVary = response.headers.get('Vary');
  if (existingVary) {
    if (!existingVary.includes('Accept')) {
      response.headers.set('Vary', `${existingVary}, Accept`);
    }
  } else {
    response.headers.set('Vary', 'Accept');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - editor internal pages
     * - static files (_next/static, _next/image, favicon.ico)
     * - media, text and document files (.svg, .png, .jpg, .webp, .avif, .ico, .mp4, .webm, .txt, .xml)
     */
    '/((?!api|editor|_next/static|_next/image|favicon\\.ico|llms\\.txt|openapi\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm|txt|xml|json)$).*)',
  ],
};

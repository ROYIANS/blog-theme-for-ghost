import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * API endpoint for on-demand revalidation
 *
 * Usage:
 * POST /api/revalidate
 * Headers: x-revalidate-token: YOUR_SECRET_TOKEN
 * Body: {
 *   "type": "post" | "page" | "all",
 *   "slug"?: "article-slug"  // Optional, for specific post/page
 * }
 *
 * Examples:
 * - Revalidate specific post: { "type": "post", "slug": "my-article" }
 * - Revalidate specific page: { "type": "page", "slug": "about" }
 * - Revalidate all posts: { "type": "post" }
 * - Revalidate everything: { "type": "all" }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify secret token
    const token = request.headers.get("x-revalidate-token");
    const secret = process.env.REVALIDATE_SECRET_TOKEN;

    if (!secret) {
      return NextResponse.json(
        { error: "Revalidation not configured" },
        { status: 500 }
      );
    }

    if (token !== secret) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { type, slug } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Missing 'type' parameter" },
        { status: 400 }
      );
    }

    const revalidated: string[] = [];

    switch (type) {
      case "post":
        if (slug) {
          // Revalidate specific post
          revalidatePath(`/blog/${slug}`);
          revalidated.push(`/blog/${slug}`);
        } else {
          // Revalidate all blog pages
          revalidatePath("/blog", "page");
          revalidatePath("/", "page"); // Homepage shows blog posts
          revalidated.push("/blog", "/");
        }
        break;

      case "page":
        if (slug) {
          // Revalidate specific page
          revalidatePath(`/page/${slug}`);
          revalidated.push(`/page/${slug}`);
        } else {
          // Revalidate all pages
          revalidatePath("/page", "layout");
          revalidated.push("/page/*");
        }
        // Also revalidate header (menu might have changed)
        revalidatePath("/", "layout");
        revalidated.push("/ (layout/menu)");
        break;

      case "all":
        // Revalidate everything
        revalidatePath("/", "layout");
        revalidatePath("/blog", "page");
        revalidatePath("/page", "layout");
        revalidated.push("all paths");
        break;

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Revalidation endpoint is ready",
    configured: !!process.env.REVALIDATE_SECRET_TOKEN,
  });
}

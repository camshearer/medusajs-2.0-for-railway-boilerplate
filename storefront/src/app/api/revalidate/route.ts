import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * On-demand cache revalidation endpoint.
 *
 * Called automatically by the Medusa backend (see
 * backend/src/subscribers/product-changed.ts) whenever a product changes, and
 * usable manually from the browser to bust the Next.js Data Cache during dev:
 *
 *   http://localhost:8000/api/revalidate?tags=products&secret=<REVALIDATE_SECRET>
 *
 * `tags` is a comma-separated list of cache tags to invalidate (defaults to
 * "products"). Both GET (easy manual trigger) and POST (used by the subscriber)
 * are supported.
 */
function handle(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret")

  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: "REVALIDATE_SECRET is not configured" },
      { status: 500 }
    )
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const tagsParam = req.nextUrl.searchParams.get("tags")
  const tags = tagsParam
    ? tagsParam
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : ["products"]

  for (const tag of tags) {
    revalidateTag(tag)
  }

  return NextResponse.json({ revalidated: true, tags })
}

export async function GET(req: NextRequest) {
  return handle(req)
}

export async function POST(req: NextRequest) {
  return handle(req)
}

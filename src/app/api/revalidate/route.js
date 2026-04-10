import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  const secret = request.nextUrl.searchParams.get("secret");
  const slug = request.nextUrl.searchParams.get("slug");
  const category = request.nextUrl.searchParams.get("category");

  // 1. Security check
  if (secret !== process.env.REVALIDATION_TOKEN) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  try {
    // 2. Clear Homepage cache (Always update for latest sections)
    revalidatePath("/");

    // 3. Clear Specific Article cache
    if (slug) {
      // Revalidate the dynamic route pattern
      revalidatePath(`/${slug}`);
    }

    // 4. Clear Category cache if provided
    if (category) {
      revalidatePath(`/category/${category}`);
    }

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      paths: ["/", slug].filter(Boolean)
    });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating", error: err.message }, { status: 500 });
  }
}

// Optional: Support GET for easy manual testing or simple webhooks
export async function GET(request) {
  return POST(request);
}

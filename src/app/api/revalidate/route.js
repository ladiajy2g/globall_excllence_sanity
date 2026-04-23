import { revalidateTag } from 'next-cache'
import { NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req) {
  try {
    const { body, isValidSignature } = await parseBody(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      const message = 'Invalid signature'
      console.warn(message)
      return new NextResponse(message, { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    // Revalidate by tag (we set the 'sanity' tag in our client)
    revalidateTag('sanity')
    
    // Also revalidate specific paths if needed
    if (body.slug?.current) {
      revalidateTag(`post-${body.slug.current}`)
    }

    console.log(`Revalidated Sanity content: ${body._type}`)
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    console.error(err)
    return new NextResponse(err.message, { status: 500 })
  }
}

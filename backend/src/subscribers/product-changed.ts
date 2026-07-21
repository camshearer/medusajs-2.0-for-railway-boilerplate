import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa'

/**
 * When a product is created, updated, or deleted in the admin, tell the
 * storefront to revalidate its Next.js Data Cache so changes appear immediately
 * instead of being served stale until the storefront process restarts.
 */
export default async function productChangedHandler({
  event,
}: SubscriberArgs<{ id: string }>) {
  const storefrontUrl = process.env.STOREFRONT_URL
  const secret = process.env.REVALIDATE_SECRET

  if (!storefrontUrl || !secret) {
    console.warn(
      '[product-changed] STOREFRONT_URL or REVALIDATE_SECRET not set; skipping storefront revalidation'
    )
    return
  }

  const url = `${storefrontUrl}/api/revalidate?tags=products&secret=${encodeURIComponent(
    secret
  )}`

  try {
    const res = await fetch(url, { method: 'POST' })
    if (!res.ok) {
      console.error(
        `[product-changed] revalidation failed (${event.name}): ${res.status} ${await res.text()}`
      )
    }
  } catch (error) {
    console.error(
      `[product-changed] error calling storefront revalidate (${event.name}):`,
      error
    )
  }
}

export const config: SubscriberConfig = {
  event: ['product.created', 'product.updated', 'product.deleted'],
}

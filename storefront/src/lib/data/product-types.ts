import { sdk } from "@lib/config"
import { HttpTypes, PaginatedResponse } from "@medusajs/types"

export const getProductTypesList = async function (
  offset: number = 0,
  limit: number = 100,
  fields?: (keyof HttpTypes.StoreProductType)[]
): Promise<{ productTypes: HttpTypes.StoreProductType[]; count: number }> {
  try {
    return await sdk.client
      .fetch<
        PaginatedResponse<{
          product_types: HttpTypes.StoreProductType[]
          count: number
        }>
      >("/store/custom/product-types", {
        query: { limit, offset, fields: fields ? fields.join(",") : undefined },
        next: { tags: ["product-types"] },
        cache: "force-cache",
      })
      .then(({ product_types, count }) => ({
        productTypes: product_types,
        count,
      }))
  } catch {
    return { productTypes: [], count: 0 }
  }
}

export const getProductTypeByHandle = async function (
  handle: string
): Promise<HttpTypes.StoreProductType | undefined> {
  try {
    return await sdk.client
      .fetch<
        PaginatedResponse<{
          product_types: HttpTypes.StoreProductType[]
          count: number
        }>
      >("/store/custom/product-types", {
        query: { handle, limit: 1 },
        next: { tags: ["product-types"] },
        cache: "force-cache",
      })
      .then(({ product_types }) => product_types[0])
  } catch {
    return undefined
  }
}

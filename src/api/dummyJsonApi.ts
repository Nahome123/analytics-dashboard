export type Product = {
  id: number
  title: string
  price: number
  stock: number
  rating: number
  category: string
}

type DummyJsonProductsResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export async function fetchDummyProducts(): Promise<DummyJsonProductsResponse> {
  const response = await fetch('https://dummyjson.com/products?limit=8')

  if (!response.ok) {
    throw new Error(`Failed to fetch DummyJSON products: ${response.status}`)
  }

  return response.json()
}
export interface brandsResponse {
    results: number
    metadata: Metadata
    data: Brands[]
  }
  
  export interface Metadata {
    currentPage: number
    numberOfPages: number
    limit: number
  }
  
  export interface Brands {
    _id: string
    name: string
    slug: string
    image: string
    createdAt: string
    updatedAt: string
  }

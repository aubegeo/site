export interface Article {
    title: string
    description: string
    date?: string
    tags?: string[]
    _path: string
    _draft?: boolean
    _id: string
  }
import { QuipuConfig } from './types'

const config: QuipuConfig = {
  notionPageId: process.env.NOTION_PAGE_ID!,
  notionToken: process.env.NOTION_TOKEN!,
}

export default config

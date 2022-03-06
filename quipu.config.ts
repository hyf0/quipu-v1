import { QuipuConfig } from './types'

const config: QuipuConfig = {
  title: 'Quipu',
  notionPageId: process.env.NOTION_PAGE_ID!,
  notionToken: process.env.NOTION_TOKEN!,
}

try {
  const envConfig: Partial<QuipuConfig> = JSON.parse(
    process.env.QUIPE_CONFIG ?? JSON.stringify({}),
  )
  Object.assign(config, envConfig)
} catch (_err) {}

export default config

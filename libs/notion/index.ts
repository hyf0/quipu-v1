import config from '@/knots.config'
import { BlogContentProvider, GetPostOverviewsResult, PostOverview } from '@/types'
import { Client } from '@notionhq/client/build/src'

const notion = new Client({
  auth: config.notionToken,
})

export const getPosts = async () => {
  const data = await notion.databases.query({ database_id: config.notionPageId })
}

export class NotionProvider implements BlogContentProvider {
  async getPostOverviews(page?: number, countPerPage?: number): Promise<GetPostOverviewsResult> {
    const data = await notion.databases.query({ database_id: config.notionPageId })
    console.log('data', JSON.stringify(data, null, 4))
    return {
      hasMore: data.has_more,
      overviews: data.results.map((item) => {
        if ('properties' in item) {
          let tiemProp = item.properties.title
        }
      }),
      nextCursor: data.next_cursor,
    }
  }
}

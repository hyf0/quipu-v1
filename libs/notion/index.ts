import config from '@/quipu.config'
import { EnhancedNotionClient } from '@notion-renderer/client'
import { Client } from '@notionhq/client'

const raw = new Client({
  auth: config.notionToken,
})

export const notion = new EnhancedNotionClient(raw)

export interface PostOverview {
  id: string
  title: string
  date: string
  summary?: string
}

export interface GetPostOverviewsResult {
  hasMore: boolean
  overviews: PostOverview[]
  nextCursor: string | null
}

export interface BlogService {
  getPostOverviews(
    page?: number,
    countPerPage?: number,
  ): Promise<GetPostOverviewsResult>
}

export class NotionBlogService {
  async getPostOverviews(
    page?: number,
    countPerPage?: number,
  ): Promise<GetPostOverviewsResult> {
    const databaseResult = await notion.raw.databases.query({
      database_id: config.notionPageId,
      filter: {
        and: [{ property: 'type', select: { equals: 'Post' } }],
      },
      sorts: [{ property: 'date', direction: 'descending' }],
      page_size: countPerPage,
    })
    return {
      hasMore: databaseResult.has_more,
      overviews: databaseResult.results
        .map((item) => {
          if ('properties' in item) {
            const titleProp = item.properties.title
            const dateProp = item.properties.date
            const summaryProp = item.properties.summary
            let title = ''
            let date = ''
            let summary = undefined
            if (titleProp?.type === 'title') {
              title = titleProp.title[0]?.plain_text ?? ''
            }
            if (dateProp?.type === 'date') {
              date = dateProp.date?.start ?? ''
            }
            if (summaryProp?.type === 'rich_text') {
              summary = summaryProp.rich_text[0]?.plain_text ?? ''
            }
            return <PostOverview> {
              id: item.id,
              title,
              date,
              summary,
            }
          }
          return null
        })
        .filter((item): item is NonNullable<typeof item> => item != null),
      nextCursor: databaseResult.next_cursor,
    }
  }
}

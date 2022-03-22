import config from '@/quipu.config'
import { EnhancedNotionClient } from '@notion-renderer/client'
import { Client } from '@notionhq/client'
import createFetch from '@vercel/fetch'
import * as fetchImpl from 'node-fetch'

const rawClient = new Client({
  auth: config.notionToken,
  fetch: createFetch(fetchImpl) as any,
})

export const notionClient = new EnhancedNotionClient(rawClient)

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

export class BlogService {
  async getPostOverviews(
    page?: number,
    countPerPage?: number,
  ): Promise<GetPostOverviewsResult> {
    const databaseResult = await notionClient.raw.databases.query({
      database_id: config.notionPageId,
      filter: {
        and: [
          { property: 'type', select: { equals: 'Post' } },
          { property: 'status', select: { equals: 'Published' } },
        ],
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

export const blogService = new BlogService()

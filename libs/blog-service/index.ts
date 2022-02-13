import config from '@/knots.config'
import { Client } from '@notionhq/client/build/src'
import { NotionToMarkdown } from 'notion-to-md'

const notion = new Client({
  auth: config.notionToken,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

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

export class NotionBlogService implements BlogService {
  async getPostOverviews(
    page?: number,
    countPerPage?: number,
  ): Promise<GetPostOverviewsResult> {
    const databaseResult = await notion.databases.query({
      database_id: config.notionPageId,
      filter: {
        and: [{ property: 'type', select: { equals: 'Post' } }],
      },
    })
    console.log('data', JSON.stringify(databaseResult, null, 4))
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

  async getPageMarkdown(pid: string) {
    return n2m.pageToMarkdown(pid)
  }
}

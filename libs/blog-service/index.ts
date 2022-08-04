import config from '@/quipu.config'
import { hasProp, nonNullable } from '@/utils'
import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

const notion = new Client({
  auth: config.notionToken,
})

export const notion2Markdown = new NotionToMarkdown({ notionClient: notion })

const notionClient = {
  raw: notion,
}

export interface PostOverview {
  id: string
  title: string
  date: string
  summary: string | null
}

export interface GetPostOverviewsResult {
  hasMore: boolean
  overviews: PostOverview[]
  nextCursor: string | null
}

export class BlogService {
  private async fetchProp(pageId: string, propId: string) {
    const response = await notion.pages.properties.retrieve({
      page_id: pageId,
      property_id: propId,
    })

    // See https://developers.notion.com/reference/retrieve-a-page-property
    if ('object' in response && response.object === 'list') {
      // Property types that return a paginated list of property item objects are:
      // - title
      // - rich_text
      // - relation
      // - people
      return response.results[0]
    } else {
      return response
    }
  }

  async getPostOverviews(
    page?: number,
    countPerPage?: number,
  ): Promise<GetPostOverviewsResult> {
    const resp = await notionClient.raw.databases.query({
      database_id: config.notionDatabaseId,
      filter: {
        and: [
          { property: 'type', select: { equals: 'Post' } },
          { property: 'status', select: { equals: 'Published' } },
        ],
      },
      sorts: [{ property: 'date', direction: 'descending' }],
      page_size: countPerPage,
    })

    const postsOverviews = await Promise.all(
      resp.results
        .filter(hasProp('properties'))
        .filter(nonNullable)
        .map(async (page) => {
          const [titleProp, DateProp] = await Promise.all([
            this.fetchProp(page.id, page.properties.title!.id),
            this.fetchProp(page.id, page.properties.date!.id),
          ])
          return <PostOverview> {
            id: page.id,
            title: (titleProp as Extract<typeof titleProp, { type: 'title' }>)
              .title.plain_text,
            date: (DateProp as Extract<typeof titleProp, { type: 'date' }>).date
              ?.start ?? '',
            summary: null,
          }
        }),
    )

    return {
      hasMore: resp.has_more,
      overviews: postsOverviews,
      nextCursor: resp.next_cursor,
    }
  }
}

export const blogService = new BlogService()

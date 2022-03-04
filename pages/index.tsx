import { NotionBlogService } from '@/libs/notion'
import {
  defineGetServerSideProps,
  defineGetStaticProps,
  ExtractServerSideProps,
  ExtractStaticProps,
} from '@/libs/typing-next'
import type { NextPage } from 'next'
import Link from 'next/link'

export const getStaticProps = defineGetStaticProps(async (ctx) => {
  const blog = new NotionBlogService()

  const postOverviewData = await blog.getPostOverviews(0, 100)
  return {
    props: {
      a: 1,
      postOverviewData,
    },
  }
})

type ServerSideProps = ExtractStaticProps<typeof getStaticProps>

const Home: NextPage<ServerSideProps> = ({ postOverviewData }) => {
  return (
    <div>
      <h1 className="text-4xl border-b p-2">Blog</h1>
      <div className="bg-white rounded  md:my-[12px] md:w-[900px] mx-auto">
        {postOverviewData.overviews.map((overview) => (
          <div
            className="p-2 hover:bg-slate-100 last:border-0"
            key={overview.id}
          >
            <div className="flex">
              <div className="mr-[4px]">
                <Link replace={true} href={`/posts/${encodeURIComponent(overview.id)}`}>
                  <a className="text-lg">{overview.title}</a>
                </Link>
              </div>
              <div className="flex items-center text-gray-500">{overview.date}</div>
            </div>
            {overview.summary && <div className="text-gray-700 text-sm">{overview.summary}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home

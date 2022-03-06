import { Header } from '@/components/Header'
import { Page } from '@/components/Page'
import { blogService } from '@/libs/blog-service'
import { defineGetStaticProps, ExtractStaticProps } from '@/libs/typing-next'
import config from '@/quipu.config'
import type { NextPage } from 'next'
import Link from 'next/link'

export const getStaticProps = defineGetStaticProps(async (ctx) => {
  const postOverviewData = await blogService.getPostOverviews(0, 100)
  return {
    props: {
      postOverviewData,
    },
  }
})

type ServerSideProps = ExtractStaticProps<typeof getStaticProps>

const Home: NextPage<ServerSideProps> = ({ postOverviewData }) => {
  return (
    <Page meta={{ title: config.title }}>
      <div>
        <Header />
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
    </Page>
  )
}

export default Home

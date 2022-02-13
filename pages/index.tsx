import { NotionBlogService } from '@/libs/blog-service'
import { defineGetServerSideProps, ExtractServerSideProps } from '@/libs/typing-next'
import type { NextPage } from 'next'
import Link from 'next/link'

export const getServerSideProps = defineGetServerSideProps(async (ctx) => {
  const blog = new NotionBlogService()

  const postOverviews = await blog.getPostOverviews(0, 10)
  return {
    props: {
      a: 1,
      postOverviews,
    },
  }
})

type ServerSideProps = ExtractServerSideProps<typeof getServerSideProps>

const Home: NextPage<ServerSideProps> = ({ postOverviews }) => {
  return (
    <div>
      <h1 className=" text-4xl border-b p-2">Blog</h1>
      <div className="bg-white rounded border shadow m-24 mt-8">
        {postOverviews.overviews.map((overview) => (
          <div
            className="p-2 border-b hover:bg-slate-100 last:border-0"
            key={overview.id}
          >
            <div className=" text-gray-500">{overview.date}</div>
            <Link href={`/posts/${overview.id}`}>
              <a className="text-lg ">{overview.title}</a>
            </Link>
            {overview.summary && <div className="text-gray-700 text-sm">{overview.summary}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home

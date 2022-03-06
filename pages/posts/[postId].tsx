import { Header } from '@/components/Header'
import { Page } from '@/components/Page'
import { notionClient } from '@/libs/blog-service'
import { defineGetServerSideProps, ExtractServerSideProps } from '@/libs/typing-next'
import { NotionBlocksRenderer } from '@notion-renderer/react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const getServerSideProps = defineGetServerSideProps(async (ctx) => {
  const postId = ctx.params?.postId ?? ''
  const page = await notionClient.getPage(postId as string)

  return {
    props: {
      page,
    },
  }
})

type ServerSideProps = ExtractServerSideProps<typeof getServerSideProps>

const BlogPost: NextPage<ServerSideProps> = ({ page }) => {
  const { query: { postId } } = useRouter()

  return (
    <Page meta={{ title: page.title ?? undefined }}>
      <Header />
      <div className="bg-white rounded  md:my-[12px] md:w-[900px] mx-auto">
        <div className='text-3xl'>{page.title}</div>
        <div className="hover:opacity-50 text-xl opacity-70">
          <Link href="/">.. /</Link>
        </div>
        <div>
          <NotionBlocksRenderer blocks={page.rootBlocks} childrenByBlockId={page.childrenByBlockId} />
        </div>
      </div>
    </Page>
  )
}

export default BlogPost

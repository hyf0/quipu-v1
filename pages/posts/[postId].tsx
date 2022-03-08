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
  return (
    <Page meta={{ title: page.title ?? undefined }}>
      <Header />
      <div className="rounded px-[8px] pb-[16px] mx-auto md:w-[900px] ">
        <div className="text-3xl mb-[16px]">{page.title}</div>
        <div>
          <NotionBlocksRenderer blocks={page.rootBlocks} childrenByBlockId={page.childrenByBlockId} />
        </div>
      </div>
    </Page>
  )
}

export default BlogPost

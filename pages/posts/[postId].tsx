import { notion, NotionBlogService } from '@/libs/notion'
import { defineGetServerSideProps, ExtractServerSideProps } from '@/libs/typing-next'
import { NotionBlocksRenderer } from '@notion-renderer/react'
import { marked } from 'marked'
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'

export const getServerSideProps = defineGetServerSideProps(async (ctx) => {
  const postId = ctx.params?.postId ?? ''
  const page = await notion.getPage(postId as string)

  return {
    props: {
      page,
    },
  }
})

type ServerSideProps = ExtractServerSideProps<typeof getServerSideProps>

const BlogPost: NextPage<ServerSideProps> = ({ page }) => {
  const { query: { postId } } = useRouter()

  useEffect(() => {
  })

  return (
    <div  className='px-[48px]'>
      <h1>
        {page.title}
      </h1>
      <div className='hover:opacity-50'>
      <Link href="/" >../</Link>
      </div>
      <div>
        <NotionBlocksRenderer blocks={page.rootBlocks} childrenByBlockId={page.childrenByBlockId} />
      </div>
    </div>
  )
}

export default BlogPost

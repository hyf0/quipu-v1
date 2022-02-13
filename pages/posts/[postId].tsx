import { NotionBlogService } from '@/libs/blog-service'
import { defineGetServerSideProps, ExtractServerSideProps } from '@/libs/typing-next'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'

export const getServerSideProps = defineGetServerSideProps(async (ctx) => {
  const blog = new NotionBlogService()
  const postId = ctx.params?.postId ?? ''

  const markdown = await blog.getPageMarkdown(postId as string)
  console.log('markdown', markdown)
  return {
    props: {
      a: 1,
      markdown,
    },
  }
})

type ServerSideProps = ExtractServerSideProps<typeof getServerSideProps>

const BlogPost: NextPage<ServerSideProps> = () => {
  const { query: { postId } } = useRouter()

  useEffect(() => {
  })

  return <div>{postId}</div>
}

export default BlogPost

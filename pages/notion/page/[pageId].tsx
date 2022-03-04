import { NotionBlogService } from '@/libs/blog-service'
import { defineGetServerSideProps, ExtractServerSideProps } from '@/libs/typing-next'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { marked } from 'marked'
import config from '@/knots.config'
import { Client } from '@notionhq/client'

export const getServerSideProps = defineGetServerSideProps(async (ctx) => {
  const notion = new Client({
    auth: config.notionToken,
  })
  
  const pageId = ctx.params?.pageId ?? ''

  const pageResp = await notion.pages.retrieve({ page_id: pageId as string });
  // const richText = marked.parse(markdown);

  // const markdown =
  console.log('pageResp', pageResp)
  return {
    props: {
      a: 1,
      pageResp,
    },
  }
})

type ServerSideProps = ExtractServerSideProps<typeof getServerSideProps>

const BlogPost: NextPage<ServerSideProps> = ({ pageResp }) => {
  console.log(pageResp)

  useEffect(() => {
  })

  return <div>
 
    </div>
}

export default BlogPost

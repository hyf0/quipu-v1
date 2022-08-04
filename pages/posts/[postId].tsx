import { Header } from '@/components/Header'
import { Page } from '@/components/Page'
import {
  defineGetServerSideProps,
  ExtractServerSideProps,
} from '@/libs/typing-next'
import { notion2Markdown } from '@/libs/blog-service'
import { NextPage } from 'next'
import { compile, compileSync, evaluateSync, runSync } from '@mdx-js/mdx'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const getServerSideProps = defineGetServerSideProps(async (ctx) => {
  const postId = ctx.params?.postId ?? ''
  const mdblocks = await notion2Markdown.pageToMarkdown(postId as string)
  const mdString = notion2Markdown.toMarkdownString(mdblocks)
  return {
    props: {
      content: mdString,
    },
  }
})

type ServerSideProps = ExtractServerSideProps<typeof getServerSideProps>

const BlogPost: NextPage<ServerSideProps> = ({ content }) => {
  const m = runSync(compileSync(content), {})
  console.log('MDXModule', m)
  return (
    <Page meta={{ title: undefined }}>
      <Header />
      <div className="rounded px-[8px] pb-[16px] mx-auto md:w-[900px] ">
        {/* <div className="text-3xl mb-[16px]">{page.title}</div> */}
        <div>{content}</div>
      </div>
    </Page>
  )
}

export default BlogPost

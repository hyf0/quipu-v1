import Head from 'next/head'
import { FC } from 'react'

export const Page: FC<{
  meta: {
    title?: string
  }
}> = ({ meta, children }) => {
  return (
    <>
      <Head>
        {meta.title && <title>{meta.title}</title>}
        <meta charSet="UTF-8" />
      </Head>
      {children}
    </>
  )
}

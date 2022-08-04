import Head from 'next/head'
import { FC, PropsWithChildren } from 'react'

export const Page: FC<
  PropsWithChildren<{
    meta: {
      title?: string
    }
  }>
> = ({ meta, children }) => {
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

import Link from 'next/link'
import { FC } from 'react'

export const Header: FC = () => {
  return (
    <Link href="/" passHref={true}>
      <h1 className="text-4xl border-b p-2">Blog</h1>
    </Link>
  )
}

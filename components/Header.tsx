import config from '@/quipu.config'
import Link from 'next/link'
import { FC } from 'react'

export const Header: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <Link href="/" passHref={true}>
        <div className="text-4xl border-b p-2 cursor-pointer">{config.title}</div>
      </Link>
      <div className="my-[16px]">
        <Link href="/" passHref={true}>
          <div className="border-b-2 border-slate-600 cursor-pointer">Home</div>
        </Link>
      </div>
    </div>
  )
}

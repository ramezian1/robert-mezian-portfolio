import React from 'react'

export function Card({ className='', ...props }) {
  return <div className={['rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800', className].join(' ')} {...props} />
}
export function CardHeader({ className='', ...props }) {
  return <div className={['p-4', className].join(' ')} {...props} />
}
export function CardContent({ className='', ...props }) {
  return <div className={['px-4 pb-4', className].join(' ')} {...props} />
}
export function CardFooter({ className='', ...props }) {
  return <div className={['px-4 pb-4 flex items-center gap-2', className].join(' ')} {...props} />
}

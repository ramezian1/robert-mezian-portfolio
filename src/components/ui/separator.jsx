import React from 'react'
export function Separator({ className='' }) {
  return <hr className={['border-slate-200 dark:border-slate-800', className].join(' ')} />
}

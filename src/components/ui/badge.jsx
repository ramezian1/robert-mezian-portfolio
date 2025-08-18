import React from 'react'

export function Badge({ variant='default', className='', ...props }) {
  const styles = {
    default: 'inline-flex items-center rounded-md border px-2 py-0.5 text-xs',
    secondary: 'inline-flex items-center rounded-md border px-2 py-0.5 text-xs bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700',
  }
  return <span className={[styles[variant] || styles.default, className].join(' ')} {...props} />
}

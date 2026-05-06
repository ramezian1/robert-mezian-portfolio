import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardContent, CardFooter } from './components/ui/card.jsx'
import { Button } from './components/ui/button.jsx'
import { Input } from './components/ui/input.jsx'
import { Badge } from './components/ui/badge.jsx'
import { Separator } from './components/ui/separator.jsx'
import { Github, Star, GitFork, Globe, CalendarClock, Moon, Sun, Mail, MapPin } from 'lucide-react'

const GITHUB_USERNAME = 'ramezian1'
const NAME = 'Robert Mezian'
const TAGLINE = 'IT Support Engineer II → Software, automation, and clean UX. 2+ years in enterprise environments.'
const LOCATION = 'Los Angeles, CA'
const EMAIL = 'robert_mezian@outlook.com'

export default function App() {
  const [repos, setRepos] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [query, setQuery] = useState('')
  const [lang, setLang] = useState('All')
  const [sort, setSort] = useState('updated')
  const [view, setView] = useState('all')

  // Default dark. If no preference saved, start dark.
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return true
    const t = localStorage.getItem('theme')
    return t ? (t === 'dark') : true
  })
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    if (typeof window !== 'undefined') localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [uRes, rRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
            headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
          }),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
            headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
          }),
        ])
        if (!uRes.ok) throw new Error(`GitHub user fetch failed: ${uRes.status}`)
        if (!rRes.ok) throw new Error(`GitHub repos fetch failed: ${rRes.status}`)
        const [userJson, reposJson] = await Promise.all([uRes.json(), rRes.json()])
        if (cancelled) return
        const cleaned = (reposJson || [])
          .filter(r => !r.fork && !r.archived)
          .map(r => ({
            id: r.id, name: r.name, full_name: r.full_name,
            description: r.description, html_url: r.html_url, homepage: r.homepage,
            language: r.language, topics: r.topics || [],
            stargazers_count: r.stargazers_count, forks_count: r.forks_count, updated_at: r.updated_at,
          }))
        setUser(userJson); setRepos(cleaned)
      } catch (e) {
        console.error(e)
        setError("Couldn't reach GitHub right now. This can happen with rate limits. Refresh later or deploy with a GitHub token.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const languages = useMemo(() => {
    const set = new Set(repos.map(r => r.language).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [repos])

  const featured = useMemo(() => {
    const sorted = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count)
    const withHome = sorted.filter(r => !!r.homepage)
    const top = [...withHome.slice(0, 4), ...sorted.slice(0, 6)].slice(0, 6)
    const unique = []; const seen = new Set()
    for (const r of top) { if (!seen.has(r.id)) { unique.push(r); seen.add(r.id) } }
    return unique
  }, [repos])

  const filtered = useMemo(() => {
    const base = view === 'featured' ? featured : repos
    const byLang = lang === 'All' ? base : base.filter(r => r.language === lang)
    const byQuery = query
      ? byLang.filter(r =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          (r.description || '').toLowerCase().includes(query.toLowerCase())
        )
      : byLang
    const sortedArr = [...byQuery].sort((a, b) => {
      if (sort === 'stars') return b.stargazers_count - a.stargazers_count
      if (sort === 'name') return a.name.localeCompare(b.name)
      return new Date(b.updated_at) - new Date(a.updated_at)
    })
    return sortedArr
  }, [repos, featured, view, lang, query, sort])

  const totals = useMemo(() => {
    let stars = 0, forks = 0
    for (const r of repos) { stars += r.stargazers_count || 0; forks += r.forks_count || 0 }
    return { stars, forks, count: repos.length }
  }, [repos])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={`https://github.com/${GITHUB_USERNAME}.png`} alt="avatar" className="size-10 rounded-full ring-2 ring-slate-200 dark:ring-slate-700" />
            <div className="leading-tight">
              <div className="font-semibold text-slate-900 dark:text-white">{NAME}</div>
              <a href={`mailto:${EMAIL}`} className="text-xs text-slate-500 dark:text-slate-400 hover:underline decoration-dotted underline-offset-2 inline-flex items-center gap-1 mt-0.5">
                <Mail className="size-3" /> {EMAIL}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" aria-label="Toggle theme" onClick={() => setDark(d => !d)}>
              {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">
              <Button variant="outline" className="gap-2"><Github className="size-4" /> GitHub</Button>
            </a>
            <a href={`mailto:${EMAIL}`}>
              <Button className="gap-2"><Mail className="size-4" /> Contact</Button>
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid md:grid-cols-[2fr,1fr] gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Projects | IT Support Engineer & Software Developer          
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">{TAGLINE}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              {LOCATION && (<span className="inline-flex items-center gap-1"><MapPin className="size-4" /> {LOCATION}</span>)}
              {user?.followers != null && (<span>{user.followers} followers</span>)}
              {user?.following != null && (<span>{user.following} following</span>)}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={RESUME_URL} target="_blank" rel="noreferrer"><Button className="rounded-2xl px-5">Download Resume</Button></a>
              <a href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`} target="_blank" rel="noreferrer">
                <Button variant="secondary" className="rounded-2xl px-5 gap-2"><Github className="size-4" /> Browse Repos</Button>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <StatCard label="Repos" value={totals.count} />
            <StatCard label="Stars" value={totals.stars} />
            <StatCard label="Forks" value={totals.forks} />
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button variant={view === 'all' ? 'default' : 'outline'} className="rounded-2xl" onClick={() => setView('all')}>All</Button>
            <Button variant={view === 'featured' ? 'default' : 'outline'} className="rounded-2xl" onClick={() => setView('featured')}>Featured</Button>
          </div>
          <div className="flex flex-1 items-center gap-3 md:justify-end">
            <Input placeholder="Search projects..." className="max-w-xs" value={query} onChange={e => setQuery(e.target.value)} />
            <select className="h-9 rounded-md border border-slate-200 bg-transparent px-3 text-sm dark:border-slate-800" value={lang} onChange={e => setLang(e.target.value)}>
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <select className="h-9 rounded-md border border-slate-200 bg-transparent px-3 text-sm dark:border-slate-800" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="updated">Sort: Recently Updated</option>
              <option value="stars">Sort: Stars</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        {loading ? <GridSkeleton /> : error ? <ErrorBox message={error} /> : (
          filtered.length === 0 ? <EmptyBox /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(repo => <RepoCard key={repo.id} repo={repo} />)}
            </div>
          )
        )}
      </section>

      <footer className="mt-auto border-t border-slate-200/60 dark:border-slate-700/50">
        <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-2 gap-6 text-sm text-slate-500 dark:text-slate-400">
          <div>
            <div className="font-medium text-slate-700 dark:text-slate-200">About</div>
            <p className="mt-2 leading-relaxed">
              {NAME} is a hands-on IT Support Engineer who loves clean code, automation, and turning messy workflows into simple tools. When I'm not debugging, I'm building.
            </p>
          </div>
          <div className="md:text-right">
            <div className="font-medium text-slate-700 dark:text-slate-200">Links</div>
            <div className="mt-2 flex md:justify-end gap-4">
              <a className="hover:underline" href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noreferrer">GitHub</a>
              <a className="hover:underline" href={`mailto:${EMAIL}`}>Email</a>
              <a className="hover:underline" href={RESUME_URL} target="_blank" rel="noreferrer">Résumé</a>
            </div>
            <div className="mt-3 opacity-70">© {new Date().getFullYear()} {NAME}</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2 text-sm text-slate-500 dark:text-slate-400">{label}</CardHeader>
      <CardContent className="pt-0 text-3xl font-bold">{value}</CardContent>
    </Card>
  )
}

function RepoCard({ repo }) {
  const { name, description, html_url, homepage, language, stargazers_count, forks_count, updated_at } = repo
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Card className="group rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <a href={html_url} target="_blank" rel="noreferrer" className="font-semibold text-lg hover:underline">{name}</a>
            {language && <Badge variant="secondary">{language}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 min-h-10">{description || 'No description provided.'}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1"><Star className="size-4" /> {stargazers_count}</span>
            <span className="inline-flex items-center gap-1"><GitFork className="size-4" /> {forks_count}</span>
            <span className="inline-flex items-center gap-1"><CalendarClock className="size-4" /> {new Date(updated_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <a href={html_url} target="_blank" rel="noreferrer">
            <Button variant="outline" className="gap-2 rounded-xl"><Github className="size-4" /> Repo</Button>
          </a>
          {homepage && (
            <a href={homepage} target="_blank" rel="noreferrer">
              <Button className="gap-2 rounded-xl"><Globe className="size-4" /> Live</Button>
            </a>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="rounded-2xl">
          <CardHeader><div className="h-6 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" /></CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </CardContent>
          <CardFooter><div className="h-9 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" /></CardFooter>
        </Card>
      ))}
    </div>
  )
}

function ErrorBox({ message }) {
  return (
    <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
      <div className="font-semibold mb-1">Heads up</div>
      <p className="text-sm leading-relaxed">{message}</p>
      <p className="mt-2 text-sm opacity-80">Tip: deploy with a GitHub token to raise rate limits. Or refresh in a minute.</p>
    </div>
  )
}

function EmptyBox() {
  return (
    <div className="rounded-2xl border p-10 text-center text-slate-600 dark:text-slate-300">
      No projects match your filters. Try clearing search or picking another language.
    </div>
  )
}

import { Hono } from 'hono'
import { marked } from 'marked'
import { promises as fs } from 'node:fs'

import { renderer } from './renderer'

const app = new Hono()

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

app.get('/markdown', async (c) => {
  const md = await fs.readFile('./md/test.md', 'utf-8')
  const html = await marked(md)
  return c.html(html)
})

export default app

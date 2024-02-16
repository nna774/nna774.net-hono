import { Hono } from 'hono'
import { marked } from 'marked'
import { renderer } from './renderer'

const app = new Hono()

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello!</h1>)
})

app.get('/markdown', (c) => {
  return c.html(marked("# Hello!\n\nThis is a markdown page!\n\n- One\n- Two\n- Three"))
})

export default app

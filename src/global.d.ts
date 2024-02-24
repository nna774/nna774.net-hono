import {} from 'hono';

import { BlogInfoType } from './partials/blog';

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: {
      title?: string,
      path?: string,
      blogInfo?: BlogInfoType,
    }): Response
  }
}

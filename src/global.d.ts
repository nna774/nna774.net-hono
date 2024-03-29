import {} from 'hono';

declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: {
      title: string,
      path: string,
      ephemeral: boolean,
      customJS?: string,
    }): Response
  }
}

import { jsxRenderer } from 'hono/jsx-renderer';

export const renderer = jsxRenderer(
  ({ children, title }) => {
    return (
      <html>
        <head>
          <link href="/static/style.css" rel="stylesheet" />
          <title>{title}</title>
        </head>
        <body>{children}</body>
      </html>
    );
  },
  {
    docType: true
  }
);

export const renderer2 = jsxRenderer(
  ({ children, title }) => {
    return (
      <html>
        <head>
          <link href="/static/style.css" rel="stylesheet" />
          <title>{title}</title>
        </head>
        <body>
          haohaohaohao<br />

          {children}
        </body>
      </html>
    );
  },
  {
    docType: true
  }
);

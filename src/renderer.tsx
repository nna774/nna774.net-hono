import { jsxRenderer } from 'hono/jsx-renderer';

import { Address } from './partials/address';
import { HostOn } from './partials/host_on';
import { PageDetails } from './partials/page_details';
import { BlogBody } from './partials/blog';

const baseURI = 'https://nna774.net';

const myFooter = (canonical: string) => (
  <>
    <footer>
      <Address />
      <HostOn />
      <PageDetails canonical={canonical} />
    </footer>
    <img src='https://nna774.net/hstspng.png' alt='' style='display:none;' />
  </>
);

export const renderer = jsxRenderer(
  ({ children, title, path }) => {
    return (
      <html lang='ja' prefix='og: http://ogp.me/ns#'>
        <head>
          <meta charset='UTF-8' />
          <title>{title || 'いっと☆わーくす！'}</title>
          <link rel='canonical' href={baseURI + path} />

          <link href='/css/default.css' rel='stylesheet' />
          <link href='/css/bootstrap.css' rel='stylesheet' />
        </head>

        <body class='container-fluid'>
          <header class='row'>
            <div class='col-md-12'>
              <h1 id='itWorks'><a href='/'>いっと☆わーくす！</a></h1>
            </div>
          </header>
          <main role='main' class='row'>
            {children}
          </main>
          <myFooter canonical={baseURI + path} />
        </body>
      </html>
    );
  },
  {
    docType: true
  }
);

export const blogRenderer = jsxRenderer(
  ({ children, title, path }) => {
    return (
      <html lang='ja' prefix='og: http://ogp.me/ns#'>
        <head>
          <meta charset='UTF-8' />
          <title>{title || 'いっと☆わーくす！'}</title>
          <link rel='canonical' href={baseURI + path} />

          <link href='/css/default.css' rel='stylesheet' />
          <link href='/css/blog.css' rel='stylesheet' />
          <link href='/css/bootstrap.css' rel='stylesheet' />
        </head>

        {children}
      </html>
    );
  },
  {
    docType: true
  }
);

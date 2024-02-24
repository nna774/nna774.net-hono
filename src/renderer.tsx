import { jsxRenderer } from 'hono/jsx-renderer';

import { Address } from './partials/address';
import { HostOn } from './partials/host_on';
import { PageDetails } from './partials/page_details';

const baseURI = 'https://nna774.net';

export const renderer = jsxRenderer(
  ({ children, title, path, amp }) => {
    return (
      <html lang='ja' prefix='og: http://ogp.me/ns#'>
        <head>
          <meta charset='UTF-8' />
          <title>{title || 'いっと☆わーくす！'}</title>
          <link rel='canonical' href={baseURI + path} />
          {amp && <link rel='amphtml' href={baseURI + '/amp' + path} />}

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
          <footer>
            <Address />
            <HostOn />
            <PageDetails canonical={baseURI + path} />
          </footer>
          <img src='https://nna774.net/hstspng.png' alt='' style='display:none;' />
        </body>
      </html>
    );
  },
  {
    docType: true
  }
);

export const blogRenderer = jsxRenderer(
  ({ children, title }) => {
    return (
      <html>
        <head>
          <link href='/static/style.css' rel='stylesheet' />
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

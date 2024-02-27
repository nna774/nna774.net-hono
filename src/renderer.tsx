import { jsxRenderer } from 'hono/jsx-renderer';
import { html } from 'hono/html';

import { Address } from './partials/address';
import { HostOn } from './partials/host_on';
import { PageDetails } from './partials/page_details';

export const baseURI = 'https://nna774.net';

const Footer = ({canonical, ephemeral}: {canonical: string, ephemeral: boolean}) => (
  <>
    <footer>
      <Address />
      <HostOn />
      <PageDetails canonical={canonical} ephemeral={ephemeral} />
    </footer>
    <img src='https://nna774.net/hstspng.png' alt='' style='display:none;' />
  </>
);

export const renderer = jsxRenderer(
  ({ children, title, path, ephemeral, customJS }) => {
    return (
      <html lang='ja' prefix='og: http://ogp.me/ns#'>
        <head>
          <meta charset='UTF-8' />
          <title>{title || 'いっと☆わーくす！'}</title>
          { !ephemeral && <link rel='canonical' href={baseURI + path} /> }

          <link href='/css/default.css' rel='stylesheet' />
          <link href='/css/bootstrap.css' rel='stylesheet' />

          {customJS && <script src={customJS}></script>}

          <meta name='viewport' content='width=device-width,initial-scale=1.0' />
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
          <Footer canonical={baseURI + path} ephemeral={ephemeral} />
        </body>
      </html>
    );
  },
  {
    docType: true
  }
);

export const blogRenderer = jsxRenderer(
  ({ children, title, path, ephemeral }) => {
    return (
      <html lang='ja' prefix='og: http://ogp.me/ns#'>
        <head>
          <meta charset='UTF-8' />
          <title>{title || 'いっと☆わーくす！'}</title>
          { !ephemeral && <link rel='canonical' href={baseURI + path} /> }

          <link href='/css/default.css' rel='stylesheet' />
          <link href='/css/blog.css' rel='stylesheet' />
          <link href='/css/bootstrap.css' rel='stylesheet' />

          <link rel="alternate" type="application/atom+xml" href="/blog/feed.xml" title="/dev/nona" />

          <script>{/* tweet button */}
            {html`!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.async=true;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');`}
          </script>
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

          <meta name='viewport' content='width=device-width,initial-scale=1.0' />
        </head>

        <body class='container-fluid'>
          {children}
          <Footer canonical={baseURI + path} ephemeral={ephemeral} />
        </body>
      </html>
    );
  },
  {
    docType: true
  }
);

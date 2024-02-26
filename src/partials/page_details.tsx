import { html } from 'hono/html';

export const PageDetails = ({canonical, ephemeral}: {canonical: string, ephemeral: boolean}) => (
  <>
    { !ephemeral &&
      <div id='pageDetail'>
        <p>
          Permalink of this page is <a href={canonical}>{canonical}</a>.
        </p>
      </div>
    }
    <a href='https://twitter.com/share' class='twitter-share-button' data-url={canonical} data-via='nonamea774' data-lang='ja'>ツイート</a>
    <script>
      {html`
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
      `}
    </script>
  </>
);

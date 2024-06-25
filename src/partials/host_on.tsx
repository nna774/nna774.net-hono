import { execSync } from 'child_process';

const revision = execSync('git log --pretty=format:%H -n1').toString().trim();
const commitMessage = execSync('git log --pretty=format:%s -n1').toString().trim();

export const HostOn = () => (
  <>
    <p id='hostOn'>
      <del><a href='https://www.flickr.com/photos/nna774/14434965670/'>Powered with Raspberry Pi</a></del><br />
      <del>このページはGitHubの<a href='https://github.com/nna774/nna774.net'>nna774/nna774.net</a>にレポジトリがあります。</del><br />
      このページはGitHubの<a href='https://github.com/nna774/nna774.net-hono'>nna774/nna774.net-hono</a>にレポジトリがあります。<br />
    </p>
    <p id='_commitHash'>
      このページのビルド時のcommit hashは<a href={'https://github.com/nna774/nna774.net-hono/tree/' + revision}>{revision}</a>です。<br />
      commit メッセージは"{commitMessage}"です。
    </p>
    <p id='_buildDate'>
      ビルド時刻は{Date()}です。
    </p>
</>
);

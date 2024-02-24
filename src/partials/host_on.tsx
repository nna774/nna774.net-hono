export const HostOn = () => (
  <>
    <p id='hostOn'>
      <del><a href='https://www.flickr.com/photos/nna774/14434965670/'>Powered with Raspberry Pi</a></del><br />
      このページはGithubの<a href='https://github.com/nna774/nna774.net'>nna774/nna774.net</a>にレポジトリがあります。
    </p>
    <p id='_commitHash'>
      このページのビルド時のCommit Hashは<a href='https://github.com/nna774/nna774.net/tree/<%= commitHash %>'>####</a>です。<br />
      Commit メッセージは"####"です。
    </p>
    <p id='_buildDate'>
      ビルド時刻は{Date()}です。
    </p>
</>
);

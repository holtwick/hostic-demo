import { files } from 'hostic'
import { task } from 'hostic'

export function handleReleases(site) {
  let fileEntries = files({
    basePath: 'releases',
    pattern: '*.zip',
  })

  let releases = task.releases({
    site,
    files: fileEntries,
    requiresMarkdown: true,
    downloadFolder: 'download',
  })

  // Inform on console
  console.info(`\nSoftware release ${releases?.latest?.version}`)
  if (releases?.latestBeta) {
    console.info(`Software beta ${releases?.latestBeta?.version}`)
  }

  site.use({
    releases,
  })

  {
    let feednotesURL = 'macos.html'
    let entries = releases?.entries?.filter(r => !r.beta) || []

    site.html(feednotesURL, async ctx => {
      ctx.skipTemplate = true
      ctx.body = <div>
        {entries.slice(0, 5).map(r => <div>
          <h3><a className="download" href={r.url}>{r.version}</a></h3>
          {r.desc.body.cloneNode(true)}
        </div>)}
        <hr/>
        <p>Problems? Get in contact with us.</p>
      </div>
    })

    task.sparkle({
      site,
      title: 'App Updates',
      path: 'macos.xml',
      feednotesURL,
      entries,
    })
  }

  {
    let feednotesURL = 'macos-beta.html'
    let entries = releases?.entries || []

    site.html(feednotesURL, async ctx => {
      ctx.skipTemplate = true
      ctx.body = <div>
        <h3>Beta</h3>
        {entries.slice(0, 5).map(r => <div>
          <h3><a className="download" href={r.url}>{r.version}</a></h3>
          {r.desc.body.cloneNode(true)}
        </div>)}
        <hr/>
        <p>Thanks for testing out app! Please provide feedback on issues you found.</p>
      </div>
    })

    task.sparkle({
      site,
      title: 'Beta Updates',
      path: 'macos-beta.xml',
      feednotesURL,
      entries,
    })
  }

  site.html('changelog', async ctx => {
    ctx.body = <div align="left">
      <h1>Changelog</h1>
      <p>
        Current software version: {ctx.releases?.latest.version}<br/>
        Current software version (beta): {(ctx.releases?.latestBeta || ctx.releases?.latest).version}
      </p>
      {ctx.releases.entries.filter(r => !r.beta).map(r => <div>
        <h3><a className="download" href={r.url}>{r.version}</a></h3>
        {r.desc.body.cloneNode(true)}
      </div>)}
      <p>
        <a href="/sparklecast.xml">sparklecast.xml</a>
      </p>
    </div>
  })

  return releases
}

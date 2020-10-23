import { Site, plugin, task } from 'hostic'
import { template } from './template.js'
import { handleReleases } from './releases.js'

export default function (path) {

  // Create a site object; we set it to the path
  // of the folder containing this file
  let site = new Site({ path })

  // Handles index.pcss via PostCSS and results in /index.css as a static asset
  site.css('index.css', 'index.pcss')

  // Transpiles client.js with all its dependencies
  site.js('client.js')

  // Just a static file without any name change
  site.static('favicon.ico')

  // Register the template with options
  site.use(template({
    imageHeight: 64,
  }))

  site.use(plugin.tidy())
  site.use(plugin.meta())
  site.use(plugin.locale())
  site.use(plugin.cookieConsent())

  handleReleases(site)

  // The start page
  site.html('/', {
    buildTime: `Build time ${new Date().toLocaleString()}`,
  }, async ctx => {
    ctx.title = 'Welcome to Hostic'
    ctx.body = <div>
      <script src="/client.js"></script>
      <p>
        Learn more about how to build great static websites
        <br/>
        with Hostic at <a href="https://github.com/holtwick/hostic">github.com/holtwick/hostic</a>
      </p>
      <p>
       Inspect internals at <a href="/$">{ctx.site.baseURL}/$</a>
      </p>
      <h3>Demo implementations</h3>
      <p><a href="/changelog">Software Version Demo</a></p>
    </div>
  })

  // Create a sitemap for SEO
  task.sitemap(site)

  // Don't forget to return the site object so the magic can happen :)
  return site
}


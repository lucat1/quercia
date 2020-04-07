import * as React from 'react'
import {
  QuerciaHead,
  QuerciaScripts,
  QuerciaMount,
  DocumentProps
} from '@quercia/runtime'

import createCache from '@emotion/cache'

const cache = createCache()
import createEmotionServer, { EmotionCritical } from 'create-emotion-server'

export default ({ ids, css }: DocumentProps & EmotionCritical) => (
  <html>
    <QuerciaHead>
      <meta name='viewport' content='width=device-width' />
      <style
        data-emotion-css={ids.join(' ')}
        dangerouslySetInnerHTML={{ __html: css }}
      />
    </QuerciaHead>
    <body>
      <QuerciaMount />
      <QuerciaScripts />
    </body>
  </html>
)

export const getInitialProps = ({ renderPage }: DocumentProps) => {
  return createEmotionServer(cache).extractCritical(renderPage())
}

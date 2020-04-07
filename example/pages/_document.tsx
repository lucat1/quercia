import * as React from 'react'
import {
  QuerciaHead,
  QuerciaScripts,
  QuerciaMount,
  DocumentProps
} from '@quercia/runtime'

interface DocProps extends DocumentProps {
  styles: string
}

export default ({ styles }: DocProps) => (
  <html>
    <QuerciaHead>
      <meta name='viewport' content='width=device-width' />
      <style dangerouslySetInnerHTML={{ __html: styles }} />
    </QuerciaHead>
    <body>
      <QuerciaMount />
      <QuerciaScripts />
    </body>
  </html>
)

export const getInitialProps = (props: DocumentProps): DocProps => ({
  ...props,
  styles: 'test{} '
})

import * as React from 'react'
import { AppProps } from '@quercia/runtime'

export default (props: AppProps) => <props.Component {...props.pageProps} />

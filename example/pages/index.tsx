import * as React from 'react'
import styled from '@emotion/styled'
import { Link, Head } from '@quercia/quercia'

const Box = styled.div`
  background: blue;
`

export default () => {
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const timeout = setTimeout(() => setCount(count + 1), 1000)

    return () => clearTimeout(timeout)
  })

  return (
    <>
      <Head>
        <title>count: {count}</title>
        <>
          <meta about='te' />

          <>
            <meta accessKey={`test ${count}`} />
          </>
        </>
      </Head>
      <Box>count: {count}</Box>
      <Link to='test'>test</Link>
      <Link to='thats-a-404'>404</Link>
    </>
  )
}

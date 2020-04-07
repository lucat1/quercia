import * as React from 'react'
import { Link, Head } from '@quercia/quercia'

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
      <a>count: {count}</a>
      <Link to='test'>test</Link>
      <Link to='thats-a-404'>404</Link>
    </>
  )
}

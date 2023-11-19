import { Html, Head, Main, NextScript } from 'next/document'

import { gitVersion } from '@/utils'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <div>Powered by Comet. {gitVersion()}</div>
      </body>
    </Html>
  )
}

import fs from 'fs'

import { Html, Head, Main, NextScript } from 'next/document'

import { COMET_GIT_ROOT } from '@/vars'
import { gitVersion } from '@/utils'

import CometHeader from '@/components/comet/CometHeader'

export default function Document() {
  let title = undefined;

  try {
    const ls = fs.readdirSync(COMET_GIT_ROOT + '/comet');
    const cometConf = fs.readFileSync(COMET_GIT_ROOT + '/comet/comet.conf', {
      encoding: 'utf-8',
    });
    const lines = cometConf.split('\n');
    const map: Record<string, string> = {};
    lines.forEach(line => {
      line = line.trim();
      if (line === '') {
        return;
      }
      const kv = line.split('=');
      if (kv.length !== 2) {
        return;
      }
      map[kv[0]] = kv[1];
    });

    if (Object.keys(map).includes('TITLE')) {
      title = map['TITLE'];
    }
  } catch {
    //
  }

  return (
    <Html lang="en">
      <Head />
      <body>
        <CometHeader
          title={title}
        />
        <Main />
        <NextScript />
        <div>Powered by Comet. {gitVersion()}</div>
      </body>
    </Html>
  );
}

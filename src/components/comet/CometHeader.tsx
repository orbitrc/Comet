import React from 'react'

import Link from 'next/link'

// Importing .scss neither using css module both not working...
// So I decided to put it in global.css file. Don't blame me, I hate Next.js.

interface CometHeaderProps {
  title?: string;
}

const CometHeader = (props: CometHeaderProps) => {
  return (
    <header className="comet-header">
      <Link href="/">
        <h1 className="title">
          {props.title ? props.title : 'Comet'}
        </h1>
      </Link>
      <div className="tab-bar">
        <Link href="/">
          <div>Home</div>
        </Link>
        <Link href="/settings">
          <div>Settings</div>
        </Link>
      </div>
    </header>
  );
}

export default CometHeader

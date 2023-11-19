import React from 'react'

import { GetServerSideProps } from 'next'

import { catFilePath } from '@/utils'

interface BlobPathProps {
  path: string;
  blob: string;
}

const BlobPath = (props: BlobPathProps) => {
  return (
    <main className="blob-path"
    >
      <div>blob: {props.path}</div>
      <div>
        <code
          style={{
            whiteSpace: 'pre',
          }}
        >{props.blob}</code>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const org = String(context.params?.organization);
  const repo = String(context.params?.repository);
  const path = (context.params?.path as string[]).join('/');
  const branch = path.split('/')[0];

  const blobContent = catFilePath(`${org}/${repo}`, branch, path);

  return {
    props: {
      path: path,
      blob: blobContent,
    },
  };
}

export default BlobPath

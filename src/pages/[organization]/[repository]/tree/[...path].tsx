import React from 'react'

import { GetServerSideProps } from 'next'

import { TreeContent } from '@/types'
import { listBranches, lsTreePath } from '@/utils'

import ListView from '@/components/ListView'

interface TreePathProps {
  organization: string;
  repository: string;
  branch: string;
  path: string;
  tree: TreeContent[];
}

const TreePath = (props: TreePathProps) => {
  return (
    <main className="tree-path">
      <p>Branch: {props.branch}</p>
      <p>Path: {props.path}</p>

      <article
        className="main-article"
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          paddingBottom: '12px',
        }}
      >
        <ListView
          width={100}
          rowHeight={64}
        >
          {props.tree.map(item => (
            <a
              key={item.hash}
              className="list-view-row"
              href={item.type === 'tree'
                ? `/${props.organization}/${props.repository}/tree/${props.path}/${item.name}`
                : `/${props.organization}/${props.repository}/blob/${props.path}/${item.name}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <span className="list-view-column"
                style={{
                  paddingLeft: '8px',
                  paddingRight: '8px',
                }}
              >{item.mode}</span>
              <span
              >
                <img
                  src={item.type === 'tree' ? '/icons/folder.png' : '/icons/blob.png'}
                  width="48"
                  height="48"
                />
              </span>
              <span className="list-view-column"
                style={{
                  flexGrow: '1',
                  paddingLeft: '8px',
                }}
              >{item.name}</span>
              <span
                style={{
                  fontFamily: 'monospace',
                  paddingRight: '8px',
                }}
              >
                {item.hash}
              </span>
            </a>
          ))}
        </ListView>
      </article>
    </main>
  );
}


function hasBranch(branches: string[], path: string): boolean {
  let ret = false;

  for (let i = 0; i < branches.length; ++i) {
    if (path.startsWith(branches[i])) {
      ret = true;
      break;
    }
  }

  return ret;
}

/**
 * Split path to branch and directory path.
 * Returning as ['work/to-do', 'include/comet/private']
 * @param branches Branches.
 * @param path Full path.
 */
function splitBranch(branches: string[], path: string): string[] {
  for (let i = 0; i < branches.length; ++i) {
    if (path.startsWith(branches[i])) {
      const branch = branches[i];
      const p = path.replace(branch, '');

      return [branch, p.replace('/', '')];
    }
  }

  return [];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const org = String(context.params?.organization);
  const repo = String(context.params?.repository);
  const branches = listBranches(`${org}/${repo}`);
  const path = (context.params?.path as string[]).join('/');
  if (!hasBranch(branches, path)) {
    return {
      notFound: true,
    };
  }
  const [branch, relpath] = splitBranch(branches, path);
  const treeContents = lsTreePath(`${org}/${repo}`, branch, relpath);

  return {
    props: {
      organization: org,
      repository: repo,
      branch: branch,
      path: path,
      tree: treeContents,
    },
  };
}

export default TreePath

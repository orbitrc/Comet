import React, { useState } from 'react'

import { GetServerSideProps } from 'next'

import {
  listOrgs,
  listRepos,
  listBranches,
  getHeadBranch,
} from '@/utils'

interface Props {
  organization: string;
  repository: string;
  branches: string[];
  head: string;
  host: string;
}

const RepositoryIndex = (props: Props) => {
  const [cloneType, setCloneType] = useState<string>('ssh');

  function cloneUrl() {
    const host = props.host;
    if (cloneType === 'https') {
      return `https://${host}/${props.organization}/${props.repository}.git`;
    } else {
      return `git@${host}:${props.organization}/${props.repository}.git`;
    }
  }

  return (
    <div className="repository-index">
      <h2>Repo</h2>
      <div>
        <span>{props.organization}</span>
        <span>/</span>
        <span>{props.repository}</span>
      </div>
      <div>
        <h3>Clone</h3>
        <div>
          <button
            onClick={() => {
              setCloneType('https');
            }}
          >
            HTTPS
          </button>
          <button
            onClick={() => {
              setCloneType('ssh');
            }}
          >
            SSH
          </button>
          <input readOnly
            value={cloneUrl()}
            style={{
              width: '512px',
            }}
          />
        </div>
        <h3>Branches</h3>
        <ul>
          {props.branches.map(branch => (
            <li
              key={branch}
            >
              <a href={`${props.repository}/tree/${branch}`}>
                {branch}{branch === props.head ? '*' : ''}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const organization = String(context.params?.organization);
  const repository = String(context.params?.repository);

  if (!listOrgs().includes(organization) ||
      !listRepos(organization).includes(repository)) {
    return {
      notFound: true,
    };
  }

  const branches = listBranches(`${organization}/${repository}`);
  const head = getHeadBranch(`${organization}/${repository}`);
  const host = context.req.headers.host;

  return {
    props: {
      organization: organization,
      repository: repository,
      branches: branches,
      head: head,
      host: host,
    },
  };
}

export default RepositoryIndex

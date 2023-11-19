import React from 'react'
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
}

const RepositoryIndex = (props: Props) => {
  return (
    <div className="repository-index">
      <h2>Repo</h2>
      <div>
        <span>{props.organization}</span>
        <span>/</span>
        <span>{props.repository}</span>
      </div>
      <div>
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

  return {
    props: {
      organization: organization,
      repository: repository,
      branches: branches,
      head: head,
    },
  };
}

export default RepositoryIndex

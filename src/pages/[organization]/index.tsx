import React from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'

import './index.scss'

import { listOrgs, listRepos } from '@/utils'

interface Props {
  name: string;
  repositories: string[];
}

const OrganizationIndex = (props: Props) => {
  return (
    <>
      <Head>
        <title>{`${props.name} | Comet`}</title>
      </Head>
      <main className="organization-index">
        <h2>{props.name}</h2>
        <div>
          <h3>Repositories</h3>
          <a href={`${props.name}/new`}>
            <button>New</button>
          </a>
        </div>
        <ul>
          {props.repositories.map(repo => (
            <li key={repo}>
              <a href={`${props.name}/${repo}`}>{repo}</a>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name = String(context.params?.organization);

  if (!listOrgs().includes(name)) {
    return {
      notFound: true,
    };
  }

  const repositories = listRepos(name);

  return {
    props: {
      name: name,
      repositories: repositories,
    },
  };
}

export default OrganizationIndex

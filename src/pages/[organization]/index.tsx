import React from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'

import { listOrgs, listRepos } from '@/utils'
import ListView from '@/components/ListView'

import './index.scss'

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
        <div className="title-bar">
          <h3 className="title">
            Repositories
          </h3>
          <Link href={`${props.name}/new`}>
            <button>New</button>
          </Link>
        </div>
        <ListView
          width={720}
          rowHeight={32}
        >
          {props.repositories.map(repo => (
            <Link key={repo}
              href={`${props.name}/${repo}`}
              style={{
                width: '100%',
              }}
            >
              {repo}
            </Link>
          ))}
        </ListView>
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

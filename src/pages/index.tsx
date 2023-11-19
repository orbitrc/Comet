import Head from 'next/head'
import styles from '@/styles/Home.module.css'

import { GetServerSideProps } from 'next'

import fs from 'fs'

import { COMET_GIT_ROOT } from '@/vars'

import OrganizationItem from '@/components/comet/OrganizationItem'

interface HomeProps {
  organizations: string[];
}

export default function Home(props: HomeProps) {
  return (
    <>
      <Head>
        <title>Comet</title>
        <meta name="description" content="Git front end for web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.center}>
          Organizations:
          <ul
            style={{
              listStyle: 'none',
            }}
          >
            {props.organizations.map(org => (
              <li key={org}>
                <OrganizationItem
                  name={org}
                />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const ls = fs.readdirSync(COMET_GIT_ROOT);
  const orgs = ls.filter(file => {
    return file.endsWith('.org');
  });
  const organizations = ls.filter(file => {
    return orgs.includes(file + '.org');
  });

  return {
    props: {
      foo: 'bar',
      ls: ls,
      organizations: organizations,
    },
  };
}

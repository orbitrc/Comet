import React, {useState }from 'react'
import { GetServerSideProps } from 'next'

interface Props {
  organization: string;
}

const OrganizationNewRepo = (props: Props) => {
  const [repoName, setRepoName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  async function requestNewRepo(data: any) {
    const res = await fetch('/api/new-repo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.status !== 200) {
      setMessage(`Error: ${JSON.stringify(result)}`);
    } else {
      setMessage('Ok');
    }

    return result;
  }

  return (
    <div>
      New repository in {props.organization}.
      <div>
        <p>Repository name</p>
        <input
          onChange={evt => {
            setRepoName(evt.target.value);
          }}
        />
        <p>Password</p>
        <input
          type="password"
          onChange={evt => {
            setPassword(evt.target.value);
          }}
        />
        <button
          onClick={() => {
            const data = {
              organization: props.organization,
              repository: repoName,
              password: password,
            };

            requestNewRepo(data)
              .then(result => {
                void(result);
              });
          }}
          disabled={repoName === '' || password === ''}
        >
          Create
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const organization = String(context.params?.organization);

  if (organization === 'undefined') {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      organization: organization,
    }
  };
}

export default OrganizationNewRepo

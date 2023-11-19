import type { NextApiRequest, NextApiResponse } from 'next'

import { createNewRepo } from '@/utils'

type Data = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(400);
  }

  const organization = String(req.body.organization);
  const repository = String(req.body.repository);
  const password = String(req.body.password);

  if (process.env.COMET_PASSWORD === '' || process.env.COMET_PASSWORD === undefined) {
    res.status(500).json({ message: 'Password not set.' });
  }

  if (password !== process.env.COMET_PASSWORD) {
    res.status(403).json({ message: 'Wrong password.' });
  }

  const ret = createNewRepo(`${organization}/${repository}`);
  if (ret === false) {
    res.status(500).json({ message: 'Cannot create the repository.' });
  }

  res.status(200).json({
    message: organization + '/' + repository,
  });
}

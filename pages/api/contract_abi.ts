// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getABI } from './etherscan'

type Data = {
  abi: any
}

interface ContractAbiRequest extends NextApiRequest {
  query: {
    address: string
  };
}

export default async function handler(
  req: ContractAbiRequest,
  res: NextApiResponse<Data>
) {
  const abi = await getABI(req.query.address);
  res.status(200).json({ abi });
}

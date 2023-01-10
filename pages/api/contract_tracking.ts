// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../prisma/client";

type Data = {
  contractId: number;
};

interface ContractTrackingRequest extends NextApiRequest {
  body: {
    contractAddress: string;
    contractTrackings: Array<{
      name: string;
      type: string;
      attributionName: string;
      userAddressField: string;
      valueTransferField: string;
      fields: string[];
    }>;
  };
}

const serializeTrackings = (req: ContractTrackingRequest) => {
  return req.body.contractTrackings.map(
    ({
      userAddressField,
      valueTransferField,
      fields,
      name,
      type,
      attributionName,
    }) => ({
      userAddressField: userAddressField,
      valueTransferField: valueTransferField,
      fields,
      event: name,
      type,
      attributionName: attributionName,
    })
  );
};

export default async function handler(
  req: ContractTrackingRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const contract = await PrismaClient.contract.create({
      data: {
        address: req.body.contractAddress,
        ContractTrackings: {
          create: serializeTrackings(req),
        },
      },
    });

    res.status(200).json({ contractId: contract.id });
  }
}

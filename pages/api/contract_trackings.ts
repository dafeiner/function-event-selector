// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Contract, ContractTracking } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "../../prisma/client";

type Data = {
  contractId?: number;
  contract?: Contract & { ContractTrackings: ContractTracking[] } | null;
};

interface ContractTrackingRequest extends NextApiRequest {
  body: {
    contractAddress: string;
    contractTrackings: Array<{
      name: string;
      type: string;
      attributionEventName: string;
      userAddressField: string;
      valueTransferField: string;
      fields: string[];
    }>;
  };
  query: {
    address: string;
  };
}

const serializeTrackings = (req: ContractTrackingRequest, contractId: number) => {
  return req.body.contractTrackings.map(
    ({
      userAddressField,
      valueTransferField,
      fields,
      name,
      type,
      attributionEventName,
    }) => ({
      contractId,
      userAddressField: userAddressField,
      valueTransferField: valueTransferField,
      fields,
      event: name,
      type,
      attributionName: attributionEventName,
    })
  );
};

export default async function handler(
  req: ContractTrackingRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const contract = await PrismaClient.contract.upsert({
      where: {
        address: req.body.contractAddress,
      },
      update: {},
      create: { address: req.body.contractAddress },
    });

    // HACK: This is a hack to delete all the contract tracking and recreate them instead of updating each contract tracking.
    await PrismaClient.contractTracking.deleteMany({ where: { contractId: contract.id } });
    await PrismaClient.contractTracking.createMany({ data: serializeTrackings(req, contract.id) });

    res.status(200).json({ contractId: contract.id });
  } else if (req.method === "GET") {
    const contract = await PrismaClient.contract.findUnique({
      where: {
        address: req.query.address,
      },
      include: {
        ContractTrackings: true,
      },
    });

    res.status(200).json({ contract: contract });
  }
}

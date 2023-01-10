# Smart Contract Function and Event Tracker

## Callouts

The contract look up only works with mainnet contracts. It uses the etherscan API and assumes that there will be an ABI for that contract.

When 'updating' a contract, it actually deletes the old `ContractTracking` records and creates fresh ones. There is no referential integrity to worry about in this demo app.

## Model Concepts 

There are `Contracts` and `ContractTracking`s. A `ContractTracking` is a record of an event or function that we want to track for a specific contract.

`AttributionEvents` would be created when we listen to the smart contract events and are 

## Next Steps + Features

Would make it so the metadata inputs `userAddressField` and `valueTransferField` are dropdowns or selects that looks at the available fields. Would add extra fields like `caller` or `owner` etc for the userAddressField for special cases.

Better error + loading states and general UI/UX updates.

Update type system to simpler and shared between front + back


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

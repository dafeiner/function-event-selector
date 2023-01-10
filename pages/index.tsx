import Head from "next/head";
import { ContractTracker } from "../components/contracts/contract_tracker";
import { Container } from "@mui/material";

export default function Home() {
  return (
    <>
      <Head>
        <title>Contract Tracker</title>
      </Head>
      <Container>
        <ContractTracker />
      </Container>
    </>
  );
}

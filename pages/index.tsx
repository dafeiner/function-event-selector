import Head from "next/head";
import { Finder } from "../components/contracts/finder";
import { Container } from "@mui/material";

export default function Home() {
  return (
    <>
      <Head>
        <title>Contract Tracker</title>
      </Head>
      <Container>
        <Finder />
      </Container>
    </>
  );
}

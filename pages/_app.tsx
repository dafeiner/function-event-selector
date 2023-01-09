import {
  createTheme,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
} from "@mui/material";
import type { AppProps } from "next/app";

const themeDark = createTheme({
  palette: {
    primary: {
      light: "#595b88",
      main: "#30336b",
      dark: "#21234a",
      contrastText: "#fff",
    },
    secondary: {
      light: "#fbc0b3",
      main: "#fab1a0",
      dark: "#af7b70",
      contrastText: "#000",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={themeDark}>
        <CssBaseline />
        <GlobalStyles styles={{}} />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

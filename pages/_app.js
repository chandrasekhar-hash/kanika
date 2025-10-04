import "../styles/globals.css";
import React from "react";
import AppShell from "../components/AppShell";

function MyApp({ Component, pageProps }) {
  return (
    <AppShell>
      <Component {...pageProps} />
    </AppShell>
  );
}

export default MyApp;

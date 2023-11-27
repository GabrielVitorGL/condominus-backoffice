"use client";
/* eslint-disable @next/next/no-page-custom-font */
import "./globals.css";
import type { Metadata } from "next";
import NoSsrWrapper from "./utils/NoSsrWrapper";
import { BrowserRouter as Router } from "react-router-dom";

export const metadata: Metadata = {
  title: "Condominus Backoffice",
  description: "Gerencie seu condomínio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />

        <link rel="icon" href={"./assets/favicon.png"} />
        <title>CONDOMINUS - ADMINISTRAÇÃO</title>
      </head>
      <body>
        <NoSsrWrapper>
          <Router>{children}</Router>
        </NoSsrWrapper>
      </body>
    </html>
  );
}

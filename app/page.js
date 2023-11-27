/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Admin, Resource, ListGuesser, ShowGuesser } from "react-admin";
import { Routes, Route } from "react-router-dom";
import AccountList from "./moradores/MoradorList";
import UserList from "./usuarios/UsuarioList";
import DeliveryList from "./entregas/EntregaList";
import authProvider from "./authProvider";
import { dataProvider } from "./dataProvider";
import polyglotI18nProvider from "ra-i18n-polyglot";
import ptBr from "ra-language-pt-br";
import MainLayout from "./layout/Layout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Login from "./login/page";

function AdminApp() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.replace("/login");
    }
  }, []);

  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      layout={MainLayout}
      theme={theme}
      loginPage={Login}
    >
      <Resource name="/moradores" list={AccountList} show={ShowGuesser} />
      <Resource name="/usuarios" list={UserList} show={ShowGuesser} />
      <Resource name="/entregas" list={DeliveryList} show={ShowGuesser} />
      <Resource name="/reservas" />
      <Resource name="/areas" />
      <Resource name="/avisos" />
    </Admin>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/*" element={<AdminApp />} />
    </Routes>
  );
}

const theme = {
  palette: {
    background: {
      default: "#FCFCFE",
    },
    primary: {
      main: "#16818E",
      light: "#0FA891",
      dark: "#3594a1",
    },
    secondary: {
      main: "rgba(0, 79, 89, 0.31)",
    },
    status: {
      active: "#2E7D32",
      activeLight: "rgba(46, 125, 50, 0.5)",
      pending: "#0288D1",
      pendingLight: "rgba(2, 136, 209, 0.5)",
      canceled: "#D32F2F",
      canceledLight: "rgba(211, 47, 47, 0.5)",
    },
    faded: {
      blue: "#1565C00a",
      darkblue: "#01579B0a",
      lightblue: "#0288D10a",
      black: "#00000099",
      white: "#FAFAFA",
    },
    common: {
      blue: "#1565C0",
      darkblue: "#01579B",
      lightblue: "#0288D1",
      black: "#000000",
      white: "#FFFFFF",
    },
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      900: "#212121",
    },
    blue: {
      400: "#42A5F5",
    },
  },
  boxShadow: {
    light:
      "0px -1px 0px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
    large:
      "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);",
  },
  transitions: {
    duration: {
      standard: 300,
      short: 200,
    },
  },
};

const translations = { "pt-br": ptBr };

const i18nProvider = polyglotI18nProvider(
  (locale) => translations[locale],
  "pt-br"
);

export default App;

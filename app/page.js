/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { Admin, Resource, ListGuesser, ShowGuesser } from "react-admin";
import { Routes, Route } from "react-router-dom";
import AccountList from "./moradores/MoradorList";
import authProvider from "./authProvider";
import { dataProvider } from "./dataProvider";
import polyglotI18nProvider from "ra-i18n-polyglot";
import portugueseMessages from "ra-language-pt-br";
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
      <Resource
        name="/moradores"
        list={AccountList}
        show={ShowGuesser}
      />
      <Resource name="/usuarios" />
      <Resource name="/entregas"  />
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
      dark: "#0A6E5F",
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

const i18nProvider = polyglotI18nProvider(() => {
  return {
    ...portugueseMessages,
    notifications: {
      advancements: {
        approved: "Antecipação aprovada com sucesso!",
        rejected: "Antecipação reprovada com sucesso!",
        approved_many: "Antecipações aprovadas com sucesso!",
        rejected_many: "Antecipações reprovadas com sucesso!",
      },
      sold_payables: {
        liquidated: "Título liquidado com sucesso!",
      },
      config: {
        success: "Configurações salvas com sucesso!",
      },
      error: {
        form: "Não foi possível realizar a operação. Por favor verifique os avisos no formulário.",
        default: "Algo deu errado, tente novamente mais tarde.",
      },
    },
    payment_methods: {
      ted: "TED",
      boleto: "Boleto",
    },
    document_types: {
      cpf: "CPF",
      cnpj: "CNPJ",
      both: "CPF e CNPJ",
    },
    type: "Tipo",
    status: "Status",
    resources: {
      advancements: { name: "Antecipação |||| Antecipações" },
      accounts: { name: "Conta |||| Contas" },
      advancement_integrations: { name: "Integração |||| Integrações" },
      lenders: { name: "Fundo |||| Fundos" },
      payables: { name: "Título |||| Títulos" },
      simulations: { name: "Simulação |||| Simulações" },
      lender_webhooks: { name: "Webhook |||| Webhooks" },
      partners: { name: "Parceiro |||| Parceiros" },
      sold_payables: { name: "Títulos Negociado |||| Títulos Negociados" },
      sold_payable_liquidations: { name: "Liquidação |||| Liquidações" },
      moradores: { name: "Moradores |||| Moradores" },
    },
  };
}, "pt-BR");

export default App;

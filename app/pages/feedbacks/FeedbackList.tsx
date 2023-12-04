"use client";
import React from "react";
import {
  TextField,
  Datagrid,
  List,
  ExportButton,
  useListContext,
  SearchInput,
  DateField,
} from "react-admin";

import { styled } from "@mui/material/styles";
import { Feedback } from "@mui/icons-material";
import PrivatePage from "@/app/components/PrivatePage";
import NavigationHeader from "@/app/components/NavigationHeader";
import CustomExporter from "../../utils/exporter";
import { SHOW_LOADING } from "../../utils/constants";
import Alert from "../../components/Alert";

const postFilters = [
  <SearchInput
    key="search"
    source="assunto"
    placeholder="Buscar por assunto"
    alwaysOn
  />,
];

const FeedbackList = () => {
  return (
    <PrivatePage>
      <NavigationHeader routePath={[{ icon: Feedback, title: "Feedbacks" }]} />
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          padding: "20px 32px",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "26px" }}>Feedbacks</span>
        <div className="bg-main mt-1" style={{ height: "3px" }} />

        <StyledList
          actions={
            <>
              <div className="flex flex-row items-center align-middle pt-2.5 pb-2.5">
                <CustomExportButton />
              </div>
            </>
          }
          component="div"
          resource={`Avisos/GetAll`} //! alterar aqui
          perPage={999}
          pagination={false}
          filters={postFilters}
          storeKey={false}
          sort={{ field: "id", order: "DESC" }}
          empty={false}
        >
          <CustomDatagrid />
        </StyledList>
      </div>
    </PrivatePage>
  );
};

const CustomDatagrid = () => {
  const { isLoading, isFetching } = useListContext();

  if ((isLoading || isFetching) && SHOW_LOADING) {
    return (
      <div className="flex flex-col items-center justify-center my-5">
        <div className="flex flex-row items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border border-b-transparent border-black/90"></div>
        </div>
        <span className="text-neutral-800 mt-4">Carregando...</span>
      </div>
    );
  }

  return (
    <Datagrid bulkActionButtons={false}>
      <TextField source="id" label="Id" sortable={true} />
      <TextField source="assunto" label="Assunto" sortable={true} />
      <TextField source="mensagem" label="Mensagem" sortable={false} />
      <DateField
        source="dataEnvio"
        label="Data de Envio"
        sortable={true}
        showTime
        locales="pt-BR"
        options={{
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }}
      />
    </Datagrid>
  );
};

const CustomExportButton = () => {
  const handleExportClick = () => {
    const resource = "Avisos/GetAll";
    const sheetName = "Feedbacks";

    CustomExporter(resource, sheetName);
  };

  return (
    <ExportButton
      className="!ml-2  !py-2 !px-2 !text-sm"
      label="Exportar Tabela"
      exporter={handleExportClick}
    />
  );
};

const StyledList = styled(List)({
  "& .MuiToolbar-root:not(.RaBulkActionsToolbar-toolbar)": {
    minHeight: "0",
    padding: "16px 0px",
  },
  "& .RaList-content": {
    borderRadius: "5px",
    border: "1px solid rgba(0, 0, 0, 0.50)",
  },
  "& .MuiTableCell-root": {
    padding: "16px",
    borderBottom: "1px solid #d6d6d6",
  },
  "& .MuiTableCell-body": {
    borderBottom: "1px solid #E0E0E0",
  },
  "& .ExportButton": {
    backgroundColor: "#3C9FAC",
    color: "#fff",
    marginLeft: "1px",
    padding: "8px 12px",
    display: "flex",
    flexDirection: "row-reverse",
  },
  "& .ExportButton:hover": {
    backgroundColor: "#16818E",
  },
  "& .ExportButton > .MuiButton-startIcon": {
    marginRight: "-2px",
    marginLeft: "8px",
  },
  "& form": {
    flex: "0 1 auto",
    marginBottom: "4px",
  },
  "& .RaList-content > .MuiCardContent-root > p.MuiTypography-root": {
    padding: "32px 10px 24px 10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "17px",
  },
  "& table": {
    paddingRight: "10px",
  },
});

const BottomAlert = ({
  showAlert,
  setShowAlert,
  editar,
}: {
  showAlert: "confirmError" | undefined;
  setShowAlert: (value: "confirmError" | undefined) => void;
  editar?: boolean;
}) => (
  <div
    style={{
      position: "fixed",
      bottom: "0px",
      left: "0px",
      paddingLeft: "20px",
      paddingBottom: "20px",
      zIndex: 1000,
    }}
  >
    <Alert
      type="error"
      text={
        editar
          ? "Ocorreu um erro ao editar o feedback. Por favor, tente novamente."
          : "Ocorreu um erro ao criar o feedback. Por favor, tente novamente."
      }
      onClose={() => setShowAlert(undefined)}
    />
  </div>
);

export default FeedbackList;

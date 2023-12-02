"use client";
import React, { Fragment, useEffect } from "react";
import {
  FunctionField,
  TextField,
  Datagrid,
  List,
  ExportButton,
  BulkDeleteWithConfirmButton,
  Button as ReactAdminButton,
  useListContext,
  SearchInput,
  useRefresh,
} from "react-admin";

import { styled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField as MUITextField,
} from "@mui/material";
import { Person, EditRounded } from "@mui/icons-material";
import PrivatePage from "@/app/components/PrivatePage";
import NavigationHeader from "@/app/components/NavigationHeader";
import CustomExporter from "../utils/exporter";
import { SHOW_LOADING } from "../utils/constants";
import { dataProvider } from "../dataProvider";
import Alert from "../components/Alert";
import { formatPhoneNumber, validatePhoneNumber } from "../utils/phoneNumber";
import { formatDocument, validateDocument } from "../utils/validateDocument";

const postFilters = [
  <SearchInput
    key="search"
    source="nome"
    placeholder="Buscar por nome"
    alwaysOn
  />,
];

const AccountList = () => {
  return (
    <PrivatePage>
      <NavigationHeader routePath={[{ icon: Person, title: "Moradores" }]} />
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          padding: "20px 32px",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "26px" }}>Moradores</span>
        <div className="bg-main mt-1" style={{ height: "3px" }} />

        <StyledList
          actions={
            <>
              <div className="flex flex-row items-center align-middle pt-6 pb-3">
                <CustomExportButton />
              </div>
            </>
          }
          component="div"
          resource={`Pessoas/GetMoradores`}
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
    <Datagrid
      bulkActionButtons={
        <Fragment>
          <EditButton />
          <RemoveButton />
        </Fragment>
      }
    >
      <TextField source="id" label="Id" sortable={true} />
      <TextField source="nome" label="Nome" sortable={true} />
      <TextField source="telefone" label="Telefone" sortable={false} />
      <TextField source="cpf" label="CPF" sortable={false} />
      <FunctionField
        label="Dependentes"
        render={(record: any) => {
          if (record.dependentes == null) return 0;
          return record.dependentes.length();
        }}
      />
    </Datagrid>
  );
};

const EditButton = () => {
  const listContext = useListContext();
  const refresh = useRefresh();
  const [open, setOpen] = React.useState(false);

  const [nome, setNome] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [apartamento, setApartamento] = React.useState("");

  const [isLoading, setLoading] = React.useState(false);

  const [requiredError, setRequiredError] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<
    Partial<Record<string, string>>
  >({});
  const getErrorMessage = (value: string | undefined, error?: string) =>
    (!value && requiredError) || error;
  const [showAlert, setShowAlert] = React.useState<
    "confirmError" | "findApartamentoError" | undefined
  >(undefined);

  useEffect(() => {
    setLoading(false);
    setValidationErrors({});

    const morador = listContext.data.find(
      (x) => x.id === listContext.selectedIds[0]
    );

    if (morador !== undefined) {
      setNome(morador.nome);
      setCpf(morador.cpf);
      setTelefone(morador.telefone);
      setApartamento(morador.idApartamento);
    }
  }, [listContext.data, listContext.selectedIds, open]);

  let formattedPhoneNumber = formatPhoneNumber(telefone || "");
  let formattedCpf = formatDocument(cpf || "");
  const validateEdit = () => {
    setValidationErrors({});
    setRequiredError(null);

    const errors: Partial<Record<string, string>> = {};

    if (!nome || !telefone) {
      //! confirmar se vai checar idApartamento aqui
      setRequiredError("Este campo é obrigatório");
      return;
    }

    if (validatePhoneNumber(formattedPhoneNumber) === false) {
      errors.telefone = "Telefone inválido";
    }

    if (validateDocument(formattedCpf) === false) {
      errors.cpf = "CPF inválido";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    return true;
  };

  const handleEditMorador = async () => {
    setLoading(true);
    const isValid = validateEdit();

    if (!isValid) {
      setLoading(false);
      return;
    }

    // const idApartamento = await getApartamento(
    //   nApartamento,
    //   setShowAlert,
    //   setLoading
    // );

    try {
      await dataProvider.update("Pessoas", {
        data: {
          id: listContext.selectedIds[0],
          nome: nome,
          telefone: formattedPhoneNumber,
          cpf: formattedCpf,
        },
      });
      handleClose();
      refresh();
    } catch (error) {
      console.log(error);
      setShowAlert("confirmError");
    }
    setLoading(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ReactAdminButton
        size="small"
        disabled={listContext.selectedIds.length > 1}
        onClick={handleClickOpen}
      >
        <>
          <EditRounded fontSize="small" className="mr-2" />
          Editar morador
        </>
      </ReactAdminButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          className="flex justify-center !text-2xl !mt-3"
        >
          {"EDITAR MORADOR"}
        </DialogTitle>
        <DialogContent className="!py-4 !mb-2 !w-[500px]">
          <MUITextField
            variant="outlined"
            label="Nome"
            value={nome}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNome(event.target.value);
            }}
            error={!nome && !!requiredError}
            helperText={getErrorMessage(nome)}
            required
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="CPF"
            value={cpf}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCpf(event.target.value);
            }}
            error={(!cpf && !!requiredError) || !!validationErrors.cpf}
            helperText={getErrorMessage(cpf, validationErrors.cpf)}
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="Telefone"
            value={telefone}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTelefone(event.target.value);
            }}
            error={
              (!telefone && !!requiredError) || !!validationErrors.telefone
            }
            helperText={getErrorMessage(telefone, validationErrors.telefone)}
            required
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="Apartamento"
            value={apartamento}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setApartamento(event.target.value);
            }}
            //! checar se vai validar aqui
            className="w-full"
          />
        </DialogContent>
        <DialogActions sx={{ marginRight: "12px", marginBottom: "8px" }}>
          <Button
            sx={{ marginBottom: "-4px !important", marginRight: "12px" }}
            className="button"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            className="button"
            variant="contained"
            onClick={handleEditMorador}
            autoFocus
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 py-1 border-2 border-b-transparent border-white"></div>
            ) : (
              <span>Salvar</span>
            )}
          </Button>
        </DialogActions>
        {showAlert && (
          <BottomAlert
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            editar={true}
          />
        )}
      </Dialog>
    </>
  );
};

const RemoveButton = () => {
  const listContext = useListContext();

  const morador = listContext.data.find(
    (x) => x.id == listContext.selectedIds[0]
  );

  let nomeMorador = "";

  if (typeof morador !== "undefined") {
    nomeMorador = morador.nome;
  }

  return (
    <BulkDeleteWithConfirmButton
      mutationMode="pessimistic"
      confirmContent={
        listContext.selectedIds.length > 1
          ? "Tem certeza que deseja excluir os moradores selecionados?"
          : `Tem certeza que deseja excluir o morador ${
              nomeMorador !== "" ? `"` + nomeMorador + `"` : "selecionado"
            }?`
      }
      resource={listContext.selectedIds.length > 1 ? "moradores" : "morador"}
    />
  );
};

const CustomExportButton = () => {
  const handleExportClick = () => {
    const resource = "Pessoas/GetMoradores";
    const sheetName = "Moradores";

    CustomExporter(resource, sheetName);
  };

  return <ExportButton label="Exportar Tabela" exporter={handleExportClick} />;
};

const BottomAlert = ({
  showAlert,
  setShowAlert,
  editar,
}: {
  showAlert: "confirmError" | "findApartamentoError" | undefined;
  setShowAlert: (
    value: "confirmError" | "findApartamentoError" | undefined
  ) => void;
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
        showAlert === "confirmError"
          ? editar
            ? "Ocorreu um erro ao editar o morador. Por favor, tente novamente."
            : "Ocorreu um erro ao criar o morador. Por favor, tente novamente."
          : "Cadastro do apartamento selecionado não encontrado."
      }
      onClose={() => setShowAlert(undefined)}
    />
  </div>
);

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
});

export default AccountList;

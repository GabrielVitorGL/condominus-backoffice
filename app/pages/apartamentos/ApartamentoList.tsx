"use client";
import React, { Fragment, useEffect } from "react";
import {
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
import { AddRounded, Apartment, EditRounded } from "@mui/icons-material";
import PrivatePage from "@/app/components/PrivatePage";
import NavigationHeader from "@/app/components/NavigationHeader";
import CustomExporter from "../../utils/exporter";
import { SHOW_LOADING } from "../../utils/constants";
import Alert from "../../components/Alert";
import { dataProvider } from "../../providers/dataProvider";
import {
  formatPhoneNumber,
  validatePhoneNumber,
} from "@/app/utils/validators/validatePhoneNumber";

const postFilters = [
  <SearchInput
    key="search"
    source="numeroApartamentoDTO"
    placeholder="Buscar por apartamento"
    alwaysOn
  />,
  <SearchInput
    key="searchByPhoneNumber"
    source="telefoneApartamentoDTO"
    placeholder="Buscar por telefone"
    alwaysOn
  />,
];

const ApartmentList = () => {
  return (
    <PrivatePage>
      <NavigationHeader
        routePath={[{ icon: Apartment, title: "Apartamentos" }]}
      />
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          padding: "20px 32px",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "26px" }}>Apartamentos</span>
        <div className="bg-main mt-1" style={{ height: "3px" }} />

        <StyledList
          actions={
            <>
              <div className="flex flex-row items-center align-middle pt-2.5 pb-2.5">
                <CreateApartmentButton />
                <CustomExportButton />
              </div>
            </>
          }
          component="div"
          resource={`Apartamentos/GetAllCondominio`}
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
      <TextField source="numeroApartamentoDTO" label="Apartamento" sortable={true} />
      <TextField source="telefoneApartamentoDTO" label="Telefone" sortable={false} />
    </Datagrid>
  );
};

const EditButton = () => {
  const listContext = useListContext();
  const refresh = useRefresh();
  const [open, setOpen] = React.useState(false);

  const [telefone, setTelefone] = React.useState("");
  const [apartamento, setApartamento] = React.useState("");

  const [isLoading, setLoading] = React.useState(false);

  const [requiredError, setRequiredError] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<
    Partial<Record<string, string>>
  >({});
  const getErrorMessage = (value: string | undefined, error?: string) =>
    (!value && requiredError) || error;
  const [showAlert, setShowAlert] = React.useState<"confirmError" | undefined>(
    undefined
  );

  useEffect(() => {
    setLoading(false);
    setRequiredError(null);
    setValidationErrors({});
    setShowAlert(undefined);

    const apartamento = listContext.data.find(
      (x) => x.id === listContext.selectedIds[0]
    );

    if (apartamento !== undefined) {
      setTelefone(apartamento.telefoneApartamentoDTO);
      setApartamento(apartamento.numeroApartamentoDTO);
    }
  }, [listContext.data, listContext.selectedIds, open]);

  const validateEdit = () => {
    setRequiredError(null);
    setValidationErrors({});

    const errors: Partial<Record<string, string>> = {};

    if (!telefone || !apartamento) {
      setRequiredError("Este campo é obrigatório");
      return;
    }

    if (!validatePhoneNumber(formatPhoneNumber(telefone))) {
      errors.telefone = "Telefone inválido";
    }

    return true;
  };

  const handleEditApartamento = async () => {
    setLoading(true);
    const isValid = validateEdit();

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      await dataProvider.update("Apartamentos", {
        data: {
          idApart: listContext.selectedIds[0],
          telefoneApart: formatPhoneNumber(telefone),
          numeroApart: apartamento,
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
          Editar apartamento
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
          {"EDITAR APARTAMENTO"}
        </DialogTitle>
        <DialogContent className="!py-4 !mb-2 !w-[500px]">
          <MUITextField
            variant="outlined"
            label="Apartamento"
            value={apartamento}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setApartamento(event.target.value);
            }}
            error={!apartamento && !!requiredError}
            helperText={getErrorMessage(apartamento)}
            className="w-full !mb-7"
            required
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
            className="w-full"
            required
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
            onClick={handleEditApartamento}
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

  const apartamento = listContext.data.find(
    (x) => x.id == listContext.selectedIds[0]
  );

  let nApartamento = "";

  if (typeof apartamento !== "undefined") {
    nApartamento = apartamento.numeroApartamentoDTO;
  }

  return (
    <BulkDeleteWithConfirmButton
      mutationMode="pessimistic"
      confirmContent={
        listContext.selectedIds.length > 1
          ? "Tem certeza que deseja excluir os apartamentos selecionados?"
          : `Tem certeza que deseja excluir o apartamento ${
              nApartamento !== "" ? `"` + nApartamento + `"` : "selecionado"
            }?`
      }
      resource={"apartamento"}
    />
  );
};

const CreateApartmentButton = () => {
  const refresh = useRefresh();
  const [open, setOpen] = React.useState(false);

  const [telefone, setTelefone] = React.useState("");
  const [apartamento, setApartamento] = React.useState("");

  const [isLoading, setLoading] = React.useState(false);

  const [requiredError, setRequiredError] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<
    Partial<Record<string, string>>
  >({});
  const getErrorMessage = (value: string | undefined, error?: string) =>
    (!value && requiredError) || error;
  const [showAlert, setShowAlert] = React.useState<"confirmError" | undefined>(
    undefined
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateCreate = () => {
    setValidationErrors({});
    setRequiredError(null);
    const errors: Partial<Record<string, string>> = {};

    if (!telefone || !apartamento) {
      setRequiredError("Este campo é obrigatório");
      return;
    }

    if (validatePhoneNumber(formatPhoneNumber(telefone || "")) === false) {
      errors.telefone = "Telefone inválido";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    return true;
  };

  const handleCreateMorador = async () => {
    setLoading(true);
    const isValid = validateCreate();

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      await dataProvider.create("Apartamentos", {
        data: {
          telefoneApart: formatPhoneNumber(telefone || ""),
          numeroApart: apartamento,
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

  useEffect(() => {
    setShowAlert(undefined);
    setTelefone("");
    setApartamento("");
    setValidationErrors({});
    setLoading(false);
    setRequiredError(null);
  }, [open]);

  return (
    <>
      <Button onClick={handleClickOpen}>
        <AddRounded fontSize="small" />
        <span className="ml-1.5 mt-[3px]">Novo apartamento</span>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          className="flex justify-center !text-2xl !mt-3 !text-neutral-800"
        >
          {"CADASTRAR APARTAMENTO"}
        </DialogTitle>
        <DialogContent className="!py-4 !mb-2 !w-[500px]">
          <MUITextField
            variant="outlined"
            label="Apartamento"
            value={apartamento}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setApartamento(event.target.value);
            }}
            error={!apartamento && !!requiredError}
            helperText={getErrorMessage(apartamento)}
            required
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
            onClick={() => !isLoading && handleCreateMorador()}
            autoFocus
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 py-1 border-2 border-b-transparent border-white"></div>
            ) : (
              <span>Criar</span>
            )}
          </Button>
        </DialogActions>
        {showAlert && (
          <BottomAlert showAlert={showAlert} setShowAlert={setShowAlert} />
        )}
      </Dialog>
    </>
  );
};

const CustomExportButton = () => {
  const handleExportClick = () => {
    const resource = "Apartamentos/GetAllCondominio";
    const sheetName = "Apartamentos";

    CustomExporter(resource, sheetName);
  };

  return (
    <ExportButton
      className="!ml-2 !py-2 !px-2 !text-sm"
      label="Exportar Tabela"
      exporter={handleExportClick}
    />
  );
};

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
        showAlert === "confirmError"
          ? editar
            ? "Ocorreu um erro ao editar o apartamento. Por favor, tente novamente."
            : "Ocorreu um erro ao criar o apartamento. Por favor, tente novamente."
          : "Ocorreu um erro. Favor tente novamente."
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

export default ApartmentList;

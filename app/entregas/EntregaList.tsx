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
  DateField,
  useRefresh,
} from "react-admin";

import { styled } from "@mui/material/styles";
import {
  Menu,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField as MUITextField,
} from "@mui/material";
import {
  MoreHorizRounded,
  LocalShipping,
  AddRounded,
  EditRounded,
} from "@mui/icons-material";
import PrivatePage from "@/app/components/PrivatePage";
import NavigationHeader from "@/app/components/NavigationHeader";
import CustomExporter from "../utils/exporter";
import { SHOW_LOADING } from "../utils/constants";
import { dataProvider } from "../dataProvider";
import Alert from "../components/Alert";

const postFilters = [
  <SearchInput
    key="search"
    source="destinatario"
    placeholder="Buscar por destinatário"
    alwaysOn
  />,
  <SearchInput
    key="searchByApto"
    source="numeroApartamento"
    placeholder="Buscar por apartamento"
    alwaysOn
  />,
];

const DeliveryList = () => {
  return (
    <PrivatePage>
      <NavigationHeader
        routePath={[{ icon: LocalShipping, title: "Entregas" }]}
      />
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          padding: "20px 32px",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "26px" }}>Entregas</span>
        <div className="bg-main mt-1" style={{ height: "3px" }} />

        <StyledList
          actions={
            <>
              <div className="flex flex-row items-center align-middle pt-3 pb-3">
                <CreateDeliveryButton />
                <CustomDropdownMenu />
              </div>
            </>
          }
          component="div"
          resource={`Entregas/GetAll`}
          perPage={999}
          pagination={false}
          filters={postFilters}
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
      <TextField source="destinatario" label="Destinatário" sortable={true} />
      <TextField
        source="numeroApartamento"
        label="Nº do Apartamento"
        sortable={false}
      />
      <DateField
        source="dataEntrega"
        label="Data de Entrega"
        sortable={true}
        showTime
        locales="pt-BR"
      />
      <DateField
        source="dataRetirada"
        label="Data de Retirada"
        sortable={true}
        showTime
        locales="pt-BR"
      />
    </Datagrid>
  );
};

const getApartamento = async (
  numero: string,
  setShowAlert: (
    value: "confirmError" | "findApartamentoError" | undefined
  ) => void,
  setLoading: (value: boolean) => void
) => {
  let idApartamento = "";
  try {
    idApartamento = await dataProvider.getApartamentoIdByNumero(numero);
  } catch (error) {
    console.log(error);
    setShowAlert("findApartamentoError");
    setLoading(false);
  }

  if (!idApartamento) {
    setShowAlert("findApartamentoError");
    setLoading(false);
  }

  return idApartamento;
};

const EditButton = () => {
  const listContext = useListContext();
  const refresh = useRefresh();
  const [open, setOpen] = React.useState(false);

  const [destinatario, setDestinatario] = React.useState("");
  const [nApartamento, setNApartamento] = React.useState("");

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
    async function fetchData() {
      setLoading(false);

      const entrega = listContext.data.find(
        (x) => x.id === listContext.selectedIds[0]
      );

      if (entrega !== undefined) {
        setDestinatario(entrega.destinatario);

        let nApartamento = "";
        try {
          nApartamento = await dataProvider.getNumeroApartamentoById(
            entrega.idApartamento
          );
        } catch (error) {
          console.log(error);
          setShowAlert("findApartamentoError");
          setLoading(false);
        }
        if (!nApartamento) {
          setShowAlert("findApartamentoError");
          setLoading(false);
        }
        setNApartamento(nApartamento);
      }
    }
    fetchData();
  }, [listContext.data, listContext.selectedIds, open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateEdit = () => {
    setValidationErrors({});
    setRequiredError(null);

    const errors: Partial<Record<string, string>> = {};

    if (!destinatario || !nApartamento) {
      setRequiredError("Este campo é obrigatório");
      return;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    return true;
  };

  const handleEditEntrega = async () => {
    setLoading(true);
    const isValid = validateEdit();

    if (!isValid) {
      return;
    }

    const idApartamento = await getApartamento(
      nApartamento,
      setShowAlert,
      setLoading
    );

    try {
      await dataProvider.update("Entregas", {
        data: {
          id: listContext.selectedIds[0],
          destinatario: destinatario,
          idApartamento: idApartamento,
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

  return (
    <>
      <ReactAdminButton
        size="small"
        disabled={listContext.selectedIds.length > 1}
        onClick={handleClickOpen}
      >
        <>
          <EditRounded fontSize="small" className="mr-2" />
          Editar entrega
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
          {"EDITAR ENTREGA"}
        </DialogTitle>
        <DialogContent className="!py-4 !mb-2 !w-[500px]">
          <MUITextField
            variant="outlined"
            label="Destinatário"
            value={destinatario}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDestinatario(event.target.value);
            }}
            error={!destinatario && !!requiredError}
            helperText={getErrorMessage(destinatario)}
            required
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="Nº do Apartamento"
            value={nApartamento}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNApartamento(event.target.value);
            }}
            error={!nApartamento && !!requiredError}
            helperText={getErrorMessage(nApartamento)}
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
            onClick={() => !isLoading && handleEditEntrega()}
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

  return (
    <BulkDeleteWithConfirmButton
      mutationMode="undoable"
      confirmContent={
        listContext.selectedIds.length > 1
          ? "Tem certeza que deseja excluir as entregas selecionadas?"
          : `Tem certeza que deseja excluir essa entrega?`
      }
      resource={"entrega"}
    />
  );
};

const CreateDeliveryButton = () => {
  const refresh = useRefresh();
  const [open, setOpen] = React.useState(false);
  const [destinatario, setDestinatario] = React.useState("");
  const [nApartamento, setNApartamento] = React.useState("");
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

    if (!destinatario || !nApartamento) {
      setRequiredError("Este campo é obrigatório");
      return;
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    return true;
  };

  const handleCreateEntrega = async () => {
    setLoading(true);
    const isValid = validateCreate();

    if (!isValid) {
      return;
    }

    const idApartamento = await getApartamento(
      nApartamento,
      setShowAlert,
      setLoading
    );

    const dataUTC = new Date();

    // Obter o deslocamento do fuso horário em minutos
    const deslocamentoMinutos = dataUTC.getTimezoneOffset();

    // Criar uma nova data ajustada para o fuso horário local
    const dataHoraLocal = new Date(
      dataUTC.getTime() - deslocamentoMinutos * 60000
    );

    try {
      await dataProvider.create("Entregas", {
        data: {
          destinatario: destinatario,
          dataEntrega: dataHoraLocal,
          idApartamento: idApartamento,
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
    setDestinatario("");
    setNApartamento("");
    setValidationErrors({});
    setLoading(false);
    setRequiredError(null);
  }, [open]);

  return (
    <>
      <Button onClick={handleClickOpen}>
        <AddRounded fontSize="small" />
        <span className="ml-1.5 mt-[3px]">Nova entrega</span>
      </Button>
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
          {"CADASTRAR ENTREGA"}
        </DialogTitle>
        <DialogContent className="!py-4 !mb-2 !w-[500px]">
          <MUITextField
            variant="outlined"
            label="Destinatário"
            value={destinatario}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setDestinatario(event.target.value);
            }}
            error={!destinatario && !!requiredError}
            helperText={getErrorMessage(destinatario)}
            required
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="Nº do Apartamento"
            value={nApartamento}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNApartamento(event.target.value);
            }}
            error={!nApartamento && !!requiredError}
            helperText={getErrorMessage(nApartamento)}
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
            onClick={() => !isLoading && handleCreateEntrega()}
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

const CustomDropdownMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportClick = () => {
    const resource = "Entregas/GetAll";
    const sheetName = "Entregas";

    CustomExporter(resource, sheetName);
  };

  return (
    <>
      <div className="ml-3">
        <IconButton
          onClick={handleClick}
          sx={{ width: "32px", height: "32px", border: "1px solid gray" }}
          size="small"
        >
          <MoreHorizRounded color="primary" />
        </IconButton>
      </div>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <ExportButton
          sx={{ width: "100%", padding: "16px 14px" }}
          onClick={handleClose}
          label="Exportar Tabela"
          exporter={handleExportClick}
        />
      </StyledMenu>
    </>
  );
};

const StyledMenu = styled(Menu)({
  "& .MuiList-root": {
    padding: "0px",
  },
});

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
            ? "Ocorreu um erro ao editar a entrega. Por favor, tente novamente."
            : "Ocorreu um erro ao criar a entrega. Por favor, tente novamente."
          : "Cadastro do apartamento selecionado não encontrado."
      }
      onClose={() => setShowAlert(undefined)}
    />
  </div>
);

export default DeliveryList;

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
  DateField,
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
import { AddRounded, EditRounded, Campaign } from "@mui/icons-material";
import PrivatePage from "@/app/components/PrivatePage";
import NavigationHeader from "@/app/components/NavigationHeader";
import CustomExporter from "../../utils/exporter";
import { SHOW_LOADING } from "../../utils/constants";
import { dataProvider } from "../../providers/dataProvider";
import Alert from "../../components/Alert";

const postFilters = [
  <SearchInput
    key="search"
    source="assuntoNotificacaoDTO"
    placeholder="Buscar por assunto"
    alwaysOn
  />,
];

const AdviceList = () => {
  return (
    <PrivatePage>
      <NavigationHeader routePath={[{ icon: Campaign, title: "Avisos" }]} />
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          padding: "20px 32px",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "26px" }}>Avisos</span>
        <div className="bg-main mt-1" style={{ height: "3px" }} />

        <StyledList
          actions={
            <>
              <div className="flex flex-row items-center align-middle pt-2.5 pb-2.5">
                <CreateAdviceButton />
                <CustomExportButton />
              </div>
            </>
          }
          component="div"
          resource={`Notificacoes/GetAvisosCondominio`}
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
      <TextField
        source="assuntoNotificacaoDTO"
        label="Assunto"
        sortable={true}
      />
      <TextField
        source="mensagemNotificacaoDTO"
        label="Mensagem"
        sortable={false}
      />
      <DateField
        source="dataEnvioNotificacaoDTO"
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

const EditButton = () => {
  const listContext = useListContext();
  const refresh = useRefresh();
  const [open, setOpen] = React.useState(false);

  const [assunto, setAssunto] = React.useState("");
  const [mensagem, setMensagem] = React.useState("");

  const [isLoading, setLoading] = React.useState(false);

  const [requiredError, setRequiredError] = React.useState<string | null>(null);
  const getErrorMessage = (value: string | undefined, error?: string) =>
    (!value && requiredError) || error;
  const [showAlert, setShowAlert] = React.useState<"confirmError" | undefined>(
    undefined
  );

  useEffect(() => {
    setShowAlert(undefined);

    const aviso = listContext.data.find(
      (x) => x.id === listContext.selectedIds[0]
    );

    if (aviso !== undefined) {
      setAssunto(aviso.assuntoNotificacaoDTO);
      setMensagem(aviso.mensagemNotificacaoDTO);
    }
  }, [listContext.data, listContext.selectedIds, open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateEdit = () => {
    setRequiredError(null);

    if (!assunto || !mensagem) {
      setRequiredError("Este campo é obrigatório");
      return;
    }

    return true;
  };

  const handleEditAviso = async () => {
    setLoading(true);
    const isValid = validateEdit();

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      await dataProvider.update("Notificacoes", {
        data: {
          idNotificacao: listContext.selectedIds[0],
          assuntoNotificacao: assunto,
          mensagemNotificacao: mensagem,
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
          Editar aviso
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
          {"EDITAR AVISO"}
        </DialogTitle>
        <DialogContent className="!py-4 !mb-2 !w-[600px]">
          <MUITextField
            variant="outlined"
            label="Assunto"
            value={assunto}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAssunto(event.target.value);
            }}
            error={!assunto && !!requiredError}
            helperText={getErrorMessage(assunto)}
            required
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="Mensagem"
            value={mensagem}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMensagem(event.target.value);
            }}
            error={!mensagem && !!requiredError}
            helperText={getErrorMessage(mensagem)}
            required
            multiline
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
            onClick={() => !isLoading && handleEditAviso()}
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
      mutationMode="pessimistic"
      confirmContent={
        listContext.selectedIds.length > 1
          ? "Tem certeza que deseja excluir os avisos selecionados?"
          : `Tem certeza que deseja excluir esse aviso?`
      }
      resource={"aviso"}
    />
  );
};

const CreateAdviceButton = () => {
  const refresh = useRefresh();
  const [open, setOpen] = React.useState(false);

  const [assunto, setAssunto] = React.useState("");
  const [mensagem, setMensagem] = React.useState("");

  const [isLoading, setLoading] = React.useState(false);

  const [requiredError, setRequiredError] = React.useState<string | null>(null);
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
    setRequiredError(null);

    if (!assunto || !mensagem) {
      setRequiredError("Este campo é obrigatório");
      return;
    }

    return true;
  };

  const handleCreateAviso = async () => {
    setLoading(true);
    const isValid = validateCreate();

    if (!isValid) {
      setLoading(false);
      return;
    }

    const dataUTC = new Date();

    // Obter o deslocamento do fuso horário em minutos
    const deslocamentoMinutos = dataUTC.getTimezoneOffset();

    // Criar uma nova data ajustada para o fuso horário local
    const dataHoraLocal = new Date(
      dataUTC.getTime() - deslocamentoMinutos * 60000
    );

    try {
      await dataProvider.create("Notificacoes", {
        data: {
          assuntoNotificacao: assunto,
          mensagemNotificacao: mensagem,
          dataEnvioNotificacao: dataHoraLocal,
          tipoNotificacao: "Aviso",
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
    setAssunto("");
    setMensagem("");
    setLoading(false);
    setRequiredError(null);
  }, [open]);

  return (
    <>
      <Button onClick={handleClickOpen}>
        <AddRounded fontSize="small" />
        <span className="ml-1.5 mt-[3px]">Novo aviso</span>
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
          {"CADASTRAR AVISO"}
        </DialogTitle>
        <DialogContent className="!py-4 !mb-2 !w-[600px]">
          <MUITextField
            variant="outlined"
            label="Assunto"
            value={assunto}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAssunto(event.target.value);
            }}
            error={!assunto && !!requiredError}
            helperText={getErrorMessage(assunto)}
            required
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="Mensagem"
            value={mensagem}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setMensagem(event.target.value);
            }}
            error={!mensagem && !!requiredError}
            helperText={getErrorMessage(mensagem)}
            multiline
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
            onClick={() => !isLoading && handleCreateAviso()}
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
    const resource = "Notificacoes/GetAvisosCondominio";
    const sheetName = "Avisos";

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
          ? "Ocorreu um erro ao editar o aviso. Por favor, tente novamente."
          : "Ocorreu um erro ao criar o aviso. Por favor, tente novamente."
      }
      onClose={() => setShowAlert(undefined)}
    />
  </div>
);

export default AdviceList;

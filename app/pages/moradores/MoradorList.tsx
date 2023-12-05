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
  IconButton,
  Menu,
} from "@mui/material";
import {
  Person,
  EditRounded,
  MoreHorizRounded,
  AddRounded,
} from "@mui/icons-material";
import PrivatePage from "@/app/components/PrivatePage";
import NavigationHeader from "@/app/components/NavigationHeader";
import CustomExporter from "../../utils/exporter";
import { SHOW_LOADING } from "../../utils/constants";
import { dataProvider } from "../../providers/dataProvider";
import Alert from "../../components/Alert";
import {
  formatPhoneNumber,
  validatePhoneNumber,
} from "../../utils/validators/validatePhoneNumber";
import {
  formatDocument,
  validateDocument,
} from "../../utils/validators/validateDocument";

const postFilters = [
  <SearchInput
    key="search"
    source="nomePessoaDTO"
    placeholder="Buscar por nome"
    className="w-48"
    alwaysOn
  />,
  <SearchInput
    key="searchByCpf"
    source="cpfPessoaDTO"
    placeholder="Buscar por CPF"
    className="w-48"
    alwaysOn
  />,
  <SearchInput
    key="searchByApto"
    source="numeroApartPessoaDTO"
    placeholder="Buscar por apartamento"
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
              <div className="flex flex-row items-center align-middle pt-2.5 pb-2.5">
                <CreateAccountButton />
                <CustomDropdownMenu />
              </div>
            </>
          }
          component="div"
          resource={`Pessoas/GetMoradoresCondominio`}
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
      <TextField source="nomePessoaDTO" label="Nome" sortable={true} />
      <TextField source="telefonePessoaDTO" label="Telefone" sortable={false} />
      <TextField source="cpfPessoaDTO" label="CPF" sortable={false} />
      <TextField
        source="numeroApartPessoaDTO"
        label="Apartamento"
        sortable={true}
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
    setShowAlert(undefined);

    const morador = listContext.data.find(
      (x) => x.id === listContext.selectedIds[0]
    );

    if (morador !== undefined) {
      setNome(morador.nomePessoaDTO);
      setCpf(morador.cpfPessoaDTO);
      setTelefone(morador.telefonePessoaDTO);
      setApartamento(morador.numeroApartPessoaDTO);
    }
  }, [listContext.data, listContext.selectedIds, open]);

  let formattedPhoneNumber = formatPhoneNumber(telefone || "");
  let formattedCpf = formatDocument(cpf || "");
  const validateEdit = () => {
    setValidationErrors({});
    setRequiredError(null);

    const errors: Partial<Record<string, string>> = {};

    if (!nome || !telefone || !cpf || !apartamento) {
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

    const idApartamento = await getApartamento(
      apartamento,
      setShowAlert,
      setLoading
    );

    if (!idApartamento) {
      setLoading(false);
      return;
    }

    try {
      await dataProvider.update("Pessoas", {
        data: {
          idPessoa: listContext.selectedIds[0],
          nomePessoa: nome,
          telefonePessoa: formattedPhoneNumber,
          cpfPessoa: formattedCpf,
          idApartamentoPessoa: idApartamento,
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
            required
            error={!apartamento && !!requiredError}
            helperText={getErrorMessage(apartamento)}
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
    nomeMorador = morador.nomePessoaDTO;
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
    return;
  }

  if (!idApartamento) {
    setShowAlert("findApartamentoError");
    setLoading(false);
    return;
  }

  return idApartamento;
};

const CreateAccountButton = () => {
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

    if (!nome || !cpf || !telefone || !apartamento) {
      setRequiredError("Este campo é obrigatório");
      return;
    }

    if (validatePhoneNumber(formatPhoneNumber(telefone || "")) === false) {
      errors.telefone = "Telefone inválido";
    }

    if (validateDocument(formatDocument(cpf || "")) === false) {
      errors.cpf = "CPF inválido";
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

    const idApartamento = await getApartamento(
      apartamento,
      setShowAlert,
      setLoading
    );

    if (!idApartamento) {
      setLoading(false);
      return;
    }

    try {
      await dataProvider.create("Pessoas", {
        data: {
          nomePessoa: nome,
          cpfPessoa: formatDocument(cpf || ""),
          telefonePessoa: formatPhoneNumber(telefone || ""),
          idApartamentoPessoa: idApartamento,
          tipoPessoa: "Morador",
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
    setNome("");
    setCpf("");
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
        <span className="ml-1.5 mt-[3px]">Novo morador</span>
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
          {"CADASTRAR MORADOR"}
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
            className="w-full !mb-7"
          />
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
    const resource = "Pessoas/GetMoradoresCondominio";
    const sheetName = "Moradores";

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
    const resource = "Pessoas/GetMoradoresCondominio";
    const sheetName = "Moradores";

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

export default AccountList;

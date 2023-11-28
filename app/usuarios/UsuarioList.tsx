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
import { AccountBoxOutlined, EditRounded } from "@mui/icons-material";
import PrivatePage from "@/app/components/PrivatePage";
import NavigationHeader from "@/app/components/NavigationHeader";
import CustomExporter from "../utils/exporter";
import { SHOW_LOADING } from "../utils/constants";

const postFilters = [
  <SearchInput
    key="search"
    source="nome"
    placeholder="Buscar por nome"
    alwaysOn
  />,
];

const UserList = () => {
  return (
    <PrivatePage>
      <NavigationHeader
        routePath={[{ icon: AccountBoxOutlined, title: "Usuários" }]}
      />
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          padding: "20px 32px",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "26px" }}>Usuários</span>
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
          resource={`Usuarios/GetAll`}
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
      <TextField source="nome" label="Nome" sortable={true} />
      <TextField source="email" label="Email" sortable={false} />
      <TextField source="telefone" label="Telefone" sortable={false} />
      <TextField source="cpf" label="CPF" sortable={false} />
    </Datagrid>
  );
};

const EditButton = () => {
  const listContext = useListContext();
  const [open, setOpen] = React.useState(false);

  const [nome, setNome] = React.useState("");
  const [cpf, setCpf] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefone, setTelefone] = React.useState("");
  const [apartamento, setApartamento] = React.useState("");

  useEffect(() => {
    const usuario = listContext.data.find(
      (x) => x.id === listContext.selectedIds[0]
    );

    if (usuario !== undefined) {
      setNome(usuario.nome);
      setEmail(usuario.email);
      setCpf(usuario.cpf);
      setTelefone(usuario.telefone);
      setApartamento(usuario.apartamento);
    }
  }, [listContext.data, listContext.selectedIds, open]);

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
          Editar usuário
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
          {"EDITAR USUÁRIO"}
        </DialogTitle>
        <DialogContent className="!py-4 !mb-2 !w-[500px]">
          <MUITextField
            variant="outlined"
            label="Nome"
            value={nome}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setNome(event.target.value);
            }}
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="Email"
            value={email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="CPF"
            value={cpf}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCpf(event.target.value);
            }}
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="Telefone"
            value={telefone}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTelefone(event.target.value);
            }}
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="Apartamento"
            value={apartamento}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setApartamento(event.target.value);
            }}
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
            onClick={handleClose}
            autoFocus
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const RemoveButton = () => {
  const listContext = useListContext();

  const usuario = listContext.data.find(
    (x) => x.id == listContext.selectedIds[0]
  );

  let nomeUsuario = "";

  if (typeof usuario !== "undefined") {
    nomeUsuario = usuario.nome;
  }

  return (
    <BulkDeleteWithConfirmButton
      mutationMode="pessimistic"
      confirmContent={
        listContext.selectedIds.length > 1
          ? "Tem certeza que deseja excluir os usuários selecionados?"
          : `Tem certeza que deseja excluir o usuário ${
              nomeUsuario !== "" ? `"` + nomeUsuario + `"` : "selecionado"
            }?`
      }
      resource={"usuário"}
    />
  );
};

const CustomExportButton = () => {
  const handleExportClick = () => {
    const resource = "Usuarios/GetAll";
    const sheetName = "Usuarios";

    CustomExporter(resource, sheetName);
  };

  return <ExportButton label="Exportar Tabela" exporter={handleExportClick} />;
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

export default UserList;

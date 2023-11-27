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

const postFilters = [
  <SearchInput
    key="search"
    source="remetente"
    placeholder="Buscar por destinatário"
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
              <div className="flex flex-row items-center align-middle pt-5 pb-3">
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
        >
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
              source="remetente"
              label="Destinatário"
              sortable={true}
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
        </StyledList>
      </div>
    </PrivatePage>
  );
};

const EditButton = () => {
  const listContext = useListContext();
  const [open, setOpen] = React.useState(false);

  const [destinatario, setDestinatario] = React.useState("");
  const [idApartamento, setIdApartamento] = React.useState("");

  useEffect(() => {
    const entrega = listContext.data.find(
      (x) => x.id === listContext.selectedIds[0]
    );

    if (entrega !== undefined) {
      setDestinatario(entrega.remetente);
      setIdApartamento(entrega.idPessoa);
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
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="Apartamento"
            value={idApartamento}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setIdApartamento(event.target.value);
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
  const [open, setOpen] = React.useState(false);
  const [destinatario, setDestinatario] = React.useState("");
  const [idApartamento, setIdApartamento] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setDestinatario("");
    setIdApartamento("");
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
            className="w-full !mb-7"
          />
          <MUITextField
            variant="outlined"
            label="Apartamento"
            value={idApartamento}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setIdApartamento(event.target.value);
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
            Criar
          </Button>
        </DialogActions>
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

export default DeliveryList;

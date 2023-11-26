"use client";
import React from "react";
import {
  FunctionField,
  TextField,
  ListActions,
  Datagrid,
  List,
  ExportButton,
  BulkDeleteWithConfirmButton,
  Button as ReactAdminButton,
} from "react-admin";

import { styled } from "@mui/material/styles";
import { Menu, IconButton, Button } from "@mui/material";
import {
  MoreHorizRounded,
  Person,
  AddRounded,
  EditRounded,
} from "@mui/icons-material";
import PrivatePage from "@/app/components/PrivatePage";
import NavigationHeader from "@/app/components/NavigationHeader";

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
            <div className="flex flex-row items-center align-middle pt-5 pb-3">
              <Button>
                <AddRounded fontSize="small" />
                <span className="ml-1.5 mt-[3px]">Novo morador</span>
              </Button>
              <CustomDropdownMenu />
            </div>
          }
          component="div"
          resource={`Pessoas/GetMoradores`}
          perPage={999}
          pagination={false}
        >
          <Datagrid
            bulkActionButtons={
              <>
                <ReactAdminButton size="small">
                  <>
                    {
                      //TODO: Desabilitar botão ao selecionar mais de um morador
                    }
                    <EditRounded fontSize="small" className="mr-2" />
                    Editar morador
                  </>
                </ReactAdminButton>
                <BulkDeleteWithConfirmButton
                  mutationMode="undoable"
                  resource="pessoa"
                />
              </>
            }
          >
            <TextField source="nome" label="Nome" sortable={false} />
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
        </StyledList>
      </div>
    </PrivatePage>
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
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <ExportButton
          sx={{ width: "100%", padding: "8px 14px" }}
          onClick={handleClose}
          label="Exportar Tabela"
        />
      </Menu>
    </>
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
});

export default AccountList;

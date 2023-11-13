import React, { ReactElement } from "react";
import {
  DateField,
  FunctionField,
  TextField,
  useRefresh,
  useListContext,
  ListActions,
  Datagrid,
  List,
  ExportButton,
  FilterLiveSearch,
} from "react-admin";

import { Menu, MenuItem, IconButton, Button } from "@mui/material";
import {
  MoreHorizRounded,
  AccountCircleOutlined,
  AddRounded,
  RefreshRounded,
  PeopleAltRounded,
  BusinessCenter,
  PhoneEnabled,
  PinDrop,
  AccountBalance,
  AccountCircle,
} from "@mui/icons-material";
import PrivatePage from "@/app/components/PrivatePage";
import NavigationHeader from "@/app/components/NavigationHeader";

type Option = {
  label: string;
  value: string;
};

const statuses: Option[] = [
  { label: "Ativo", value: "active" },
  { label: "Desativado", value: "canceled" },
  { label: "Pendente de ativação", value: "pending" },
];

const services: Option[] = [
  { label: "Antecipação", value: "advancement" },
  { label: "PIX e Boleto", value: "pix" },
  { label: "Boleto", value: "boleto" },
  { label: "PIX Pagamento", value: "payment" },
];

const AccountListActions = () => {
  return (
    <ListActions
      sx={{
        border: "1px solid #0000001F",
        padding: "18px 22px !important",
        width: "100%",
        margin: "1.3rem 0 0 0",
        gap: "20px",
      }}
    >
      <div
        style={{ marginRight: "auto", display: "flex", alignItems: "center" }}
      >
        <RefreshButton />
        <SearchField />
        <SelectField label="Status" options={statuses} />
        <SelectField label="Serviços" options={services} disabled />
      </div>
      <Button variant="contained" >
        <>
        Nova conta
        <AddRounded />
        </>
        </Button>
      <CustomDropdownMenu />
    </ListActions>
  );
};

const AccountList = () => {
  const accountId = "a"
  return (
    <PrivatePage>
      <NavigationHeader
        routePath={[{ icon: AccountCircleOutlined, title: "Contas" }]}
      />
      <div style={{display:"flex", height: "100%", flexDirection: "column", padding: "20px 32px"}}>
        <span style={{fontWeight: 700, fontSize: "26px"}}>Contas</span>
        <div className="bg-main" style={{marginTop: "-2px", height: "3px"}} />

        <List actions={<AccountListActions />} component="div" resource={`accounts/${accountId}/moradores`}>
          <AccountListInnerComponent />
        </List>
        <AccountDetails />
      </div>
    </PrivatePage>
  );
};

const AccountListInnerComponent = () => {
  const { data } = useListContext();
  //data && (firstAccountID = data[0].id);

  return (
    <Datagrid
      bulkActionButtons={false}
      rowClick="edit"
    >
      <TextField source="name" label="Nome" />
      <TextField
        source="document_type"
        textTransform="uppercase"
        label="Tipo"
        sortable={false}
      />
      <TextField source="document" label="Documento" sortable={false} />
      <DateField
        showTime
        locales="pt-BR"
        source="created_at"
        label="Data de Criação"
      />
      <DateField
        showTime
        locales="pt-BR"
        source="updated_at"
        label="Última edição"
        sortable={false}
      />
    </Datagrid>
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
      <IconButton
        onClick={handleClick}
        sx={{ border: "1px solid grey" }}
        size="small"
      >
        <MoreHorizRounded />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem key="export" onClick={handleClose}>
          <ExportButton sx={{ width: "100%" }} label="Exportar Tabela" />
        </MenuItem>
      </Menu>
    </>
  );
};

const SelectField = ({
  label,
  options,
  disabled,
}: {
  label: string;
  options: Option[];
  disabled?: boolean;
}) => {
  // TODO: Permitir seleção de múltiplos valores
  return (
    <FilterLiveSearch
      variant="outlined"
      source="status"
      select
      label={label}
      sx={{ marginLeft: "20px", width: "180px" }}
      size="small"
      disabled={disabled}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </FilterLiveSearch>
  );
};

const SearchField = () => {
  return (
    <FilterLiveSearch
      variant="outlined"
      source="search"
      InputLabelProps={{ shrink: true }}
      placeholder="Buscar por nome ou documento..."
      sx={{ width: "310px", marginLeft: "20px" }}
    />
  );
};

const RefreshButton = () => {
  const refresh = useRefresh();

  return (
    <IconButton
      onClick={() => refresh()}
      sx={{ border: "1px solid grey" }}
      size="small"
    >
      <RefreshRounded />
    </IconButton>
  );
};

//!

let firstAccountID = "80f327bb-645f-4961-85e2-6431234b8fcd";

const AccountDetails = () => {
  return (
    <div
      style={{
        width: "100%",
        marginTop: "3rem",
        border: "1px solid lightgray",
        borderRadius: "4px",
        padding: 40,
        gap: "2rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AccountBankAccountList />
      <AccountRepresentativeList />
      <AccountContactList />
      <AccountAddressList />
      <AccountShareholderList />
    </div>
  );
};

const AccountShareholderList = () => {
  return (
    <List
      resource={`accounts/${firstAccountID}/shareholders`}
      actions={
        <AccountDetailListHeader
          label="Quadro Societário"
          icon={<BusinessCenter color="primary" />}
          actions={
            <Button
              variant="text"
            >
              Adicionar sócio
              <AddRounded />
            </Button>
          }
        />
      }
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source="name" label="Nome" />
        <TextField source="document" label="Documento" />
        <TextField source="email" label="E-mail" />
        <TextField source="updated_at" label="Dt. Atualização" />
      </Datagrid>
    </List>
  );
};

const AccountRepresentativeList = () => {
  return (
    <List
      resource={`accounts/${firstAccountID}/representatives`}
      actions={
        <AccountDetailListHeader
          label="Representantes Legais"
          icon={<PeopleAltRounded color="primary" />}
          actions={
            <Button
              variant="text"
            >
              Adicionar representante
              <AddRounded />
            </Button>
          }
        />
      }
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source="name" label="Nome" />
        <TextField source="document" label="Documento" />
        <TextField source="email" label="E-mail" />
        <TextField source="updated_at" label="Dt. Atualização" />
      </Datagrid>
    </List>
  );
};

const AccountContactList = () => {
  return (
    <List
      resource={`accounts/${firstAccountID}/contacts`}
      actions={
        <AccountDetailListHeader
          label="Lista de Contatos"
          icon={<PhoneEnabled color="primary" />}
          actions={
            <Button
              variant="text"
            >
              Adicionar contato
              <AddRounded />
            </Button>
          }
        />
      }
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source="name" label="Nome" />
        <TextField source="phone_number" label="Telefone" />
        <TextField source="email" label="E-mail" />
        <TextField source="position" label="Cargo" />
        <TextField source="updated_at" label="Dt. Atualização" />
      </Datagrid>
    </List>
  );
};

const AccountAddressList = () => {
  return (
    <List
      resource={`accounts/${firstAccountID}/addresses`}
      actions={
        <AccountDetailListHeader
          label="Endereços"
          icon={<PinDrop color="primary" />}
          actions={
            <Button
              variant="text"
            >
              Adicionar endereço
              <AddRounded />
            </Button>
          }
        />
      }
    >
      <Datagrid bulkActionButtons={false}>
        <TextField source="street" label="Rua" />
        <TextField source="district" label="Bairro" />
        <TextField source="city" label="Cidade" />
        <TextField source="state" label="Estado" />
        <TextField source="updated_at" label="Dt. Atualização" />
      </Datagrid>
    </List>
  );
};

const AccountBankAccountList = () => {
  return (
    <List
      resource={`accounts/${firstAccountID}/bank_accounts`}
      actions={
        <AccountDetailListHeader
          label="Contas Bancárias"
          icon={<AccountBalance color="primary" />}
          actions={
            <Button
              variant="text"
            >
              
              <AddRounded />
            </Button>
          }
        />
      }
    >
      <Datagrid bulkActionButtons={false}>
        <FunctionField
          label="Banco"
          render={(record: any) => `${record.bank_code} - ${record.bank_name}`}
        />
        <TextField source="bank_agency" label="Agência" />
        <TextField source="bank_account_number" label="Conta" />
        <TextField source="bank_account_type" label="Tipo" />
        <TextField source="updated_at" label="Dt. Atualização" />
      </Datagrid>
    </List>
  );
};

const AccountDetailListHeader = ({
  label,
  icon,
  actions,
}: {
  label: string;
  icon: ReactElement;
  actions: ReactElement;
}) => {
  return (
    <ListActions sx={{ width: "100%" }}>
      <div
        style={{ marginRight: "auto", display: "flex", alignItems: "center" }}
      >
        {icon}
        <span style={{ fontSize: 20, marginLeft: "8px" }}>{label}</span>
      </div>
      {actions}
    </ListActions>
  );
};
//!

export default AccountList;

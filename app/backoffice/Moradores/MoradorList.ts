import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  AccountCircleOutlined,
  Add,
  GroupAddRounded as GroupAddRoundedIcon,
} from "@mui/icons-material";
import {
  AutocompleteInput,
  Button,
  ChipField,
  Datagrid,
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  Form,
  FormDataConsumer,
  FunctionField,
  List,
  ReferenceInput,
  required,
  SelectInput,
  TextField,
  TextInput,
  useDataProvider,
  useNotify,
  useRefresh,
} from "react-admin";

import { errorManageHandler } from "../../../utils/helpers";
import { BadgeColors } from "../../../utils/constants";
import FileUploadDialog from "../../../components/FileUploadDialog";
import ImportSpreadsheetDialog from "../../../components/ImportSpreadsheetDialog";

interface CreateAccountPopupProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterSidebar: React.FC = () => (
  <Box
    sx={{
      display: {
        xs: "none",
        sm: "block",
      },
      order: -1,
      width: "15em",
      marginRight: "1em",
      marginTop: "64px",
    }}
  >
    <Card>
      <CardContent>
        <FilterLiveSearch source="name" variant="outlined" />
        <FilterList label="type" icon={<AccountCircleOutlined />}>
          <FilterListItem label="Sacado" value={{ type: "sponsor" }} />
          <FilterListItem label="Cedente" value={{ type: "supplier" }} />
        </FilterList>
      </CardContent>
    </Card>
  </Box>
);

const CreateAccountPopup: React.FC<CreateAccountPopupProps> = ({
  open,
  setOpen,
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFetchingCNPJInfo, setFetchingCNPJInfo] = useState(false);
  const [cnpjErrorMessage, setCNPJErrorMessage] = useState("");

  const onClose = () => {
    // TODO: cancel pending requests when closing
    if (isFetchingCNPJInfo) return;

    setFormData({});
    setCNPJErrorMessage("");
    setOpen(false);
  };

  const submitHandler = (data: any) => {
    setLoading(true);
    dataProvider
      .create(`accounts`, { data })
      .then((res) => {
        setLoading(false);
        onClose();
        notify("Conta criada", { type: "success" });
        window.location.reload();
      })
      .catch((e) => {
        setLoading(false);
        const { messages } = errorManageHandler(e);
        messages.forEach((message: string) => {
          notify(message, { type: "error" });
        });
      });
  };

  const handleFetchCNPJInfo = async (currentData: any) => {
    const cnpj = currentData.document.replace(/[./-]/g, "");
    if (!cnpj) {
      setCNPJErrorMessage("Digite um CNPJ para buscar informações");
      return;
    }

    setFetchingCNPJInfo(true);
    setCNPJErrorMessage("");
    try {
      const cnpjResponse = await dataProvider.getInfoFromCNPJ(cnpj);

      if (cnpjResponse.status === 200) {
        setFormData({
          ...currentData,
          name: cnpjResponse.data.razao_social,
          trade_name: cnpjResponse.data.estabelecimento?.nome_fantasia,
        });
      }
    } catch (error) {
      if (error?.response?.status === 429) {
        setCNPJErrorMessage(
          "O limite de requisições por minuto foi atingido. Aguarde um momento e tente novamente."
        );
      } else {
        setCNPJErrorMessage(
          "Erro ao buscar informações. Verifique se o CNPJ está sem pontuação e tente novamente."
        );
      }
    }

    setFetchingCNPJInfo(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nova conta</DialogTitle>
      <Form record={formData} onSubmit={submitHandler} noValidate>
        <DialogContent>
          <ReferenceInput
            label="Parceiro"
            source="partner_id"
            reference="partners"
            filter={{ hidePeerbnkPartner: true }}
            disabled={loading || isFetchingCNPJInfo}
            enableGetChoices={({ q }) => q && q.length >= 2}
            validate={[required()]}
          >
            <AutocompleteInput
              label="Parceiro"
              variant="outlined"
              optionText="name"
              fullWidth
            />
          </ReferenceInput>
          <SelectInput
            variant="outlined"
            source="document_type"
            label="Tipo Documento"
            disabled={loading || isFetchingCNPJInfo}
            fullWidth
            defaultValue="cnpj"
            choices={[
              // { id: "cpf", name: "CPF" },  --- We only support suppliers with CNPJ for now
              { id: "cnpj", name: "CNPJ" },
            ]}
            validate={[required("Este campo é obrigatório")]}
          />
          <Box sx={{ marginBottom: "32px" }}>
            <TextInput
              variant="outlined"
              source="document"
              label="Documento"
              disabled={loading || isFetchingCNPJInfo}
              fullWidth
              helperText={
                <span style={{ color: "#ef5350" }}>{cnpjErrorMessage}</span>
              }
              validate={[required("Este campo é obrigatório")]}
            />
            {isFetchingCNPJInfo ? (
              <CircularProgress size={16} sx={{ marginLeft: "16px" }} />
            ) : (
              <FormDataConsumer>
                {({ formData: currentData }) => (
                  <Button
                    variant="outlined"
                    disabled={loading || isFetchingCNPJInfo}
                    label="Buscar Informações"
                    onClick={() => handleFetchCNPJInfo(currentData)}
                  />
                )}
              </FormDataConsumer>
            )}
          </Box>
          <TextInput
            variant="outlined"
            source="phone_number"
            label="Telefone"
            disabled={loading || isFetchingCNPJInfo}
            fullWidth
            validate={[required("Este campo é obrigatório")]}
          />
          <TextInput
            variant="outlined"
            source="name"
            label="Razão Social"
            disabled={loading || isFetchingCNPJInfo}
            fullWidth
            validate={[required("Este campo é obrigatório")]}
          />
          <TextInput
            variant="outlined"
            source="trade_name"
            label="Nome Fantasia"
            disabled={loading || isFetchingCNPJInfo}
            fullWidth
            validate={[required("Este campo é obrigatório")]}
          />
          <SelectInput
            variant="outlined"
            source="type"
            label="Tipo"
            disabled={loading || isFetchingCNPJInfo}
            fullWidth
            choices={[
              { id: "sponsor", name: "Sacado" },
              { id: "supplier", name: "Cedente" },
            ]}
            validate={[required("Este campo é obrigatório")]}
          />
        </DialogContent>
        <DialogActions>
          <Button label="Cancelar" onClick={onClose} />

          {!(loading || isFetchingCNPJInfo) ? (
            <Button type="submit" label="Salvar" />
          ) : (
            <CircularProgress
              color="inherit"
              size={15}
              thickness={2}
              style={{ marginLeft: "10px" }}
            />
          )}
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const AccountList: React.FC = () => {
  const dataProvider = useDataProvider();
  const refresh = useRefresh();

  const [openCreatePopup, setCreatePopupOpen] = useState(false);
  const [openSpreadsheetImportPopup, setSpreadsheetImportPopupOpen] =
    useState(false);
  const [openFileUploadPopup, setFileUploadPopupOpen] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState<string>("");

  const spreadsheetImportHandler = (file: any) => {
    return dataProvider
      .uploadAccountSpreadsheet(file, selectedAccountType)
      .then(refresh);
  };

  return (
    <>
      <CreateAccountPopup open={openCreatePopup} setOpen={setCreatePopupOpen} />
      <ImportSpreadsheetDialog
        open={openSpreadsheetImportPopup}
        onUpload={(accountType: string) => {
          setSpreadsheetImportPopupOpen(false);
          setFileUploadPopupOpen(true);
          setSelectedAccountType(accountType);
        }}
        onClose={() => setSpreadsheetImportPopupOpen(false)}
      />
      <FileUploadDialog
        open={openFileUploadPopup}
        onClose={() => setFileUploadPopupOpen(false)}
        onConfirm={spreadsheetImportHandler}
        type="spreadsheet"
      />
      <List
        perPage={10}
        aside={<FilterSidebar />}
        actions={
          <div>
            <Button
              label="Nova conta"
              size="small"
              startIcon={<Add />}
              onClick={() => setCreatePopupOpen(true)}
              sx={{
                padding: "4px 6px",
                marginRight: "20px",
                marginBottom: "10px",
              }}
            />
            <Button
              label="Importar"
              size="small"
              startIcon={<GroupAddRoundedIcon />}
              onClick={() => setSpreadsheetImportPopupOpen(true)}
              sx={{
                padding: "4px 6px",
                marginBottom: "10px",
              }}
            />
          </div>
        }
      >
        <Datagrid bulkActionButtons={false} size="medium" rowClick="show">
          <TextField source="id" label="ID" sortable={false} />
          <TextField source="name" label="Nome" sortable={false} />
          <TextField source="document_type" label="Tipo" sortable={false} />
          <TextField source="document" label="Documento" sortable={false} />
          <FunctionField
            label="status"
            render={(record: any) => (
              <ChipField
                source="status_label"
                size="small"
                color={BadgeColors[record.status] || "default"}
                sortable={false}
              />
            )}
          />
        </Datagrid>
      </List>
    </>
  );
};

export default AccountList;

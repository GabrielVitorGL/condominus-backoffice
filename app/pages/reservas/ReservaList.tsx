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
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField as MUITextField,
  MenuItem,
  Select,
  SelectChangeEvent,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { EditRounded, CalendarMonth, AddRounded } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import PrivatePage from "@/app/components/PrivatePage";
import NavigationHeader from "@/app/components/NavigationHeader";
import CustomExporter from "../../utils/exporter";
import { SHOW_LOADING } from "../../utils/constants";
import { dataProvider } from "../../providers/dataProvider";
import Alert from "../../components/Alert";

const postFilters = [
  <SearchInput
    key="search"
    source="pessoa.nome"
    placeholder="Buscar por morador"
    alwaysOn
  />,
  <SearchInput
    key="searchByArea"
    source="areaComum.nome"
    placeholder="Buscar por área comum"
    alwaysOn
  />,
];

const ReservationList = () => {
  return (
    <PrivatePage>
      <NavigationHeader
        routePath={[{ icon: CalendarMonth, title: "Reservas" }]}
      />
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          padding: "20px 32px",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "26px" }}>Reservas</span>
        <div className="bg-main mt-1" style={{ height: "3px" }} />

        <StyledList
          actions={
            <>
              <div className="flex flex-row items-center align-middle pt-2.5 pb-2.5">
                <CreateReservationButton />
                <CustomExportButton />
              </div>
            </>
          }
          component="div"
          resource={`Reservas/GetAll`}
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
      <TextField source="pessoa.nome" label="Morador" sortable={true} />
      <DateField
        //!source="dataInicio"
        source="data"
        label="Data Inicial"
        showTime
        locales="pt-BR"
        options={{
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        }}
        sortable={true}
      />
      <DateField
        source="dataFim"
        label="Data Final"
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
      <TextField source="areaComum.nome" label="Área Comum" sortable={true} />
    </Datagrid>
  );
};

const EditButton = () => {
  const listContext = useListContext();
  const refresh = useRefresh();
  const [open, setOpen] = React.useState(false);

  const [dataInicial, setDataInicial] = React.useState<Dayjs | null>(null);
  const [dataFinal, setDataFinal] = React.useState<Dayjs | null>(null);

  const [isLoading, setLoading] = React.useState(false);

  const [requiredError, setRequiredError] = React.useState<string | null>(null);

  const [showAlert, setShowAlert] = React.useState<
    "confirmError" | "findMoradorError" | undefined
  >(undefined);

  useEffect(() => {
    setShowAlert(undefined);

    async function fetchData() {
      setLoading(false);

      const reserva = listContext.data.find(
        (x) => x.id === listContext.selectedIds[0]
      );

      if (reserva !== undefined) {
        setDataInicial(dayjs(reserva.data)); //!
        setDataFinal(dayjs(reserva.data)); //!
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

  const ValidateEdit = () => {
    setRequiredError(null);
    const errors: Partial<Record<string, string>> = {};

    if (!dataInicial || !dataFinal) {
      setRequiredError("Este campo é obrigatório");
      return;
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    return true;
  };

  const handleEditReserva = async () => {
    setLoading(true);
    const isValid = ValidateEdit();

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      await dataProvider.update("Reservas", {
        data: {
          id: listContext.selectedIds[0],
          data: dataInicial,
          //! dataFinal
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
          Editar reserva
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
          {"EDITAR RESERVA"}
        </DialogTitle>
        <DialogContent className="!py-4 !mb-2 !w-[500px]">
          <LocalizationProvider
            adapterLocale="pt-br"
            dateAdapter={AdapterDayjs}
          >
            <DateTimePicker
              disablePast
              ampm={false}
              label="Data Inicial"
              value={dataInicial}
              format="DD/MM/YYYY HH:mm"
              onChange={(newValue: Dayjs | null) => {
                setDataInicial(newValue);
              }}
              slotProps={{
                textField: {
                  error: !dataInicial && !!requiredError,
                  helperText: !dataInicial && requiredError,
                },
              }}
              referenceDate={dataFinal || undefined}
              minDate={dataFinal || undefined}
              maxTime={
                dataFinal ? dayjs(dataFinal).add(1, "minute") : undefined
              }
              maxDate={dataFinal || undefined}
              className="w-full !mb-7"
            />
          </LocalizationProvider>

          <LocalizationProvider
            adapterLocale="pt-br"
            dateAdapter={AdapterDayjs}
          >
            <DateTimePicker
              disablePast
              ampm={false}
              label="Data Final"
              value={dataFinal}
              format="DD/MM/YYYY HH:mm"
              onChange={(newValue: Dayjs | null) => {
                setDataFinal(newValue);
              }}
              slotProps={{
                textField: {
                  error: !dataFinal && !!requiredError,
                  helperText: !dataFinal && requiredError,
                },
              }}
              referenceDate={dataInicial || undefined}
              minDate={dataInicial || undefined}
              minTime={
                dataInicial ? dayjs(dataInicial).add(1, "minute") : undefined
              }
              maxDate={dataInicial || undefined}
              className="w-full"
            />
          </LocalizationProvider>
          <div className="mt-1 grid">
            <Button
              className="!justify-self-end"
              variant="text"
              onClick={() => {
                setDataInicial(null);
                setDataFinal(null);
              }}
            >
              Limpar datas
            </Button>
          </div>
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
            onClick={() => !isLoading && handleEditReserva()}
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
          ? "Tem certeza que deseja excluir as reservas selecionadas?"
          : `Tem certeza que deseja excluir essa reserva?`
      }
      resource={"reserva"}
    />
  );
};

const CreateReservationButton = () => {
  const refresh = useRefresh();
  const [open, setOpen] = React.useState(false);

  const [idAreaComum, setIdAreaComum] = React.useState<string | null>(null);
  const [cpfMorador, setCpfMorador] = React.useState("");
  const [dataInicial, setDataInicial] = React.useState<Dayjs | null>(null);
  const [dataFinal, setDataFinal] = React.useState<Dayjs | null>(null);
  const [areasComuns, setAreasComuns] = React.useState<any[]>([]);

  const [isLoading, setLoading] = React.useState(false);

  const [requiredError, setRequiredError] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<
    Partial<Record<string, string>>
  >({});
  const getErrorMessage = (value: string | undefined, error?: string) =>
    (!value && requiredError) || error;
  const [showAlert, setShowAlert] = React.useState<
    "confirmError" | "findMoradorError" | undefined
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

    if (!idAreaComum || !cpfMorador) {
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
      setLoading(false);
      return;
    }

    let idPessoa = "";
    try {
      idPessoa = await dataProvider.getIdPessoaByCpf(cpfMorador);
    } catch (error) {
      console.log(error);
      setShowAlert("findMoradorError");
      setLoading(false);
      return;
    }

    if (!idPessoa) {
      setShowAlert("findMoradorError");
      setLoading(false);
      return;
    }

    try {
      await dataProvider.create("Reservas", {
        data: {
          idPessoa: idPessoa,
          data: dataInicial,
          //! dataInicial: dataInicial,
          //! dataFinal: dataFinal,
          idAreaComum: idAreaComum ? parseInt(idAreaComum, 10) : undefined,
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
    setDataInicial(null);
    setDataFinal(null);
    setCpfMorador("");
    setIdAreaComum(null);
    setValidationErrors({});
    setLoading(false);
    setRequiredError(null);
    setShowAlert(undefined);

    async function fetchData() {
      const response = await dataProvider.getList("AreasComuns/GetAll");
      setAreasComuns(response.data);
      console.log(response.data);
    }
    fetchData();
  }, [open]);

  return (
    <>
      <Button onClick={handleClickOpen}>
        <AddRounded fontSize="small" />
        <span className="ml-1.5 mt-[3px]">Nova reserva</span>
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
          {"CADASTRAR RESERVA"}
        </DialogTitle>
        <DialogContent className="!py-4 !mb-2 !w-[500px]">
          <LocalizationProvider
            adapterLocale="pt-br"
            dateAdapter={AdapterDayjs}
          >
            <DateTimePicker
              disablePast
              ampm={false}
              label="Data Inicial"
              value={dataInicial}
              format="DD/MM/YYYY HH:mm"
              onChange={(newValue: Dayjs | null) => {
                setDataInicial(newValue);
              }}
              slotProps={{
                textField: {
                  error: !dataInicial && !!requiredError,
                  helperText: !dataInicial && requiredError,
                },
              }}
              referenceDate={dataFinal || undefined}
              minDate={dataFinal || undefined}
              maxTime={
                dataFinal ? dayjs(dataFinal).add(1, "minute") : undefined
              }
              maxDate={dataFinal || undefined}
              className="w-full !mb-4"
            />
          </LocalizationProvider>
          <LocalizationProvider
            adapterLocale="pt-br"
            dateAdapter={AdapterDayjs}
          >
            <DateTimePicker
              disablePast
              ampm={false}
              label="Data Final"
              value={dataFinal}
              format="DD/MM/YYYY HH:mm"
              onChange={(newValue: Dayjs | null) => {
                setDataFinal(newValue);
              }}
              slotProps={{
                textField: {
                  error: !dataFinal && !!requiredError,
                  helperText: !dataFinal && requiredError,
                },
              }}
              referenceDate={dataInicial || undefined}
              minDate={dataInicial || undefined}
              minTime={
                dataInicial ? dayjs(dataInicial).add(1, "minute") : undefined
              }
              maxDate={dataInicial || undefined}
              className="w-full"
            />
          </LocalizationProvider>
          <div className="mt-1 mb-7 grid">
            <Button
              className="!justify-self-end"
              variant="text"
              onClick={() => {
                setDataInicial(null);
                setDataFinal(null);
              }}
            >
              Limpar datas
            </Button>
          </div>
          <FormControl fullWidth>
            <InputLabel
              className={`${
                !idAreaComum && !!requiredError ? "!text-red-600" : ""
              }`}
              id="demo-simple-select-label"
            >
              Área Comum *
            </InputLabel>
            <Select
              label="Área Comum"
              value={idAreaComum ? idAreaComum : ""}
              onChange={(event: SelectChangeEvent) => {
                setIdAreaComum(event.target.value as string);
              }}
              error={!idAreaComum && !!requiredError}
              required
              className="w-full"
            >
              <option aria-label="None" className="hidden" value="" />
              {areasComuns.map((areaComum) => (
                <MenuItem key={areaComum.id} value={String(areaComum.id)}>
                  {areaComum.nome}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText className="!text-red-600">
              {!idAreaComum && requiredError}
            </FormHelperText>
          </FormControl>
          <MUITextField
            variant="outlined"
            label="CPF do Morador"
            value={cpfMorador}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCpfMorador(event.target.value);
            }}
            error={!cpfMorador && !!requiredError}
            helperText={getErrorMessage(cpfMorador)}
            required
            className="w-full !mt-4 !mb-2"
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

const CustomExportButton = () => {
  const handleExportClick = () => {
    const resource = "Reservas/GetAll";
    const sheetName = "Reservas";

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
  showAlert: "confirmError" | "findMoradorError" | undefined;
  setShowAlert: (
    value: "confirmError" | "findMoradorError" | undefined
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
            ? "Ocorreu um erro ao editar a reserva. Por favor, tente novamente."
            : "Ocorreu um erro ao criar a reserva. Por favor, tente novamente."
          : "Não foi encontrado um morador com o CPF informado."
      }
      onClose={() => setShowAlert(undefined)}
    />
  </div>
);

export default ReservationList;

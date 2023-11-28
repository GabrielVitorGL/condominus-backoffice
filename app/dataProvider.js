import axios from "axios";

import { BASE_URL } from "./utils/constants";

export const dataProvider = {
  getList: (resource, params) => {
    console.log(resource, params);

    let url = `${BASE_URL}/${resource}?`;

    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(url, options)
        .then((res) => {
          let finalData = res.data;
          if (params.sort && params.sort.field && params.sort.order) {
            const sortedData = finalData.sort(function (a, b) {
              const keyA = a[params.sort.field];
              const keyB = b[params.sort.field];

              if (params.sort.order == "ASC") {
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
              } else if (params.sort.order == "DESC") {
                if (keyA < keyB) return 1;
                if (keyA > keyB) return -1;
              }
            });
            finalData = sortedData;
          }

          if (params.filter && Object.keys(params.filter).length > 0) {
            const filterField = Object.keys(params.filter)[
              Object.keys(params.filter).length - 1
            ];
            const filterValue = params.filter[filterField];

            const filteredData = finalData.filter((item) => {
              return item[filterField]
                .toString()
                .toLowerCase()
                .includes(filterValue.toString().toLowerCase());
            });

            finalData = filteredData;
          }
          resolve({
            data: finalData,
            total: 1,
          });
        })
        .catch((e) => reject(e));
    });
  },
  getMany: (resource, params) => {
    console.log(resource, params);
    const { ids } = params;
    let url = `${BASE_URL}/${resource}?ids=${ids.join(",")}`;
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(url, options)
        .then((res) => {
          resolve({
            data: res.data.entries,
          });
        })
        .catch((e) => reject(e));
    });
  },
  getOne: (resource, params) => {
    console.log(resource, params);
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(`${BASE_URL}/${resource}/${params.id}`, options)
        .then((res) => {
          resolve({ data: res.data });
        })
        .catch((e) => reject(e));
    });
  },
  create: (resource, params) => {
    console.log(resource, params);
    const { data } = params;

    let url = `${BASE_URL}/${resource}`;
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, options)
        .then((res) => {
          resolve({ data: res.data });
        })
        .catch((e) => reject(e));
    });
  },
  update: (resource, params) => {
    console.log(resource, params);
    const { id, data } = params;
    let url = `${BASE_URL}/${resource}/${id}`;
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .put(url, data, options)
        .then((res) => {
          resolve({ data: res.data });
        })
        .catch((e) => reject(e));
    });
  },
  getLenderConfig: (lenderId) => {
    console.log(lenderId);
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(`${BASE_URL}/lenders/${lenderId}/config`, options)
        .then((res) => {
          resolve({ data: res.data });
        })
        .catch((e) => reject(e));
    });
  },
  updateLenderConfig: (lenderId, data) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .put(`${BASE_URL}/lenders/${lenderId}/config`, data, options)
        .then((res) => {
          resolve({ data: res.data });
        })
        .catch((e) => reject(e));
    });
  },
  getLenderBankAccount: (lenderId) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(`${BASE_URL}/lender_bank_accounts?lender_id=${lenderId}`, options)
        .then((res) => {
          resolve({ data: res.data.entries });
        })
        .catch((e) => reject(e));
    });
  },
  getLenderTaxes: (lenderId) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(`${BASE_URL}/lenders/${lenderId}/sponsor_taxes`, options)
        .then((res) => {
          resolve({ data: res.data.entries });
        })
        .catch((e) => reject(e));
    });
  },
  getPartnerLenderList: (partnerId) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(`${BASE_URL}/partner_lenders?partner_id=${partnerId}`, options)
        .then((res) => {
          resolve({ data: res.data.entries });
        })
        .catch((e) => reject(e));
    });
  },
  getAccountRegistrationData: (accountId) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(`${BASE_URL}/accounts/${accountId}/details`, options)
        .then((res) => {
          resolve({ data: res.data });
        })
        .catch((e) => reject(e));
    });
  },
  // Expects resources in the format [["accounts", <account_id>], ["sponsor_settings"]]
  getResource: (resources) => {
    const path = resources.flat().join("/");
    return axios.get(`${BASE_URL}/${path}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  },
  // Expects resources in the format [["accounts", <account_id>], ["sponsor_settings"]]
  updateResource: (resources, updatedObj) => {
    const path = resources.flat().join("/");
    return axios.put(`${BASE_URL}/${path}`, updatedObj, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  },

  // Not implemented
  getManyReference: (resource, params) => Promise.resolve({ data }),
  // Not implemented
  updateMany: (resource, params) => Promise.resolve({ data }),

  // Not implemented
  delete: (resource, params) => Promise.resolve({ data }),

  deleteMany: (resource, params) => {
    console.log(resource, params);

    let formattedResource = resource;
    if (resource == "morador" || resource == "moradores") {
      formattedResource = "Pessoas";
    } else if (resource == "usuário" || resource == "usuários") {
      formattedResource = "Usuarios";
    } else if (resource == "entrega" || resource == "entregas") {
      formattedResource = "Entregas";
    } else if (resource == "reserva" || resource == "reservas") {
      formattedResource = "Reservas";
    } else if (resource == "aviso" || resource == "avisos") {
      formattedResource = "Avisos";
    } else if (resource == "área comum" || resource == "áreas comuns") {
      formattedResource = "AreasComuns";
    }

    return new Promise((resolve, reject) => {
      axios
        .delete(`${BASE_URL}/${formattedResource}/DeletarMuitos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          data: params.ids,
        })
        .then((res) => {
          resolve({ data: res.data });
        })
        .catch((e) => reject(e));
    });
  },

  advancementsAction: (type, advancementsIds) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return axios
      .put(
        `${BASE_URL}/advancements/approve?ids=${advancementsIds}${
          type === "mark_as_sold" ? "&skip_processing=true" : ""
        }`,
        {},
        options
      )
      .then((res) => ({ data: res.data }));
  },
  liquidateSoldPayable: (soldPayableId, data) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${BASE_URL}/sold_payables/${soldPayableId}/liquidate`,
          data,
          options
        )
        .then((res) => {
          resolve({ data: res.data });
        })
        .catch((e) => reject(e));
    });
  },

  downloadAccountSpreadsheetModel: () => {
    const link = document.createElement("a");
    link.download = "Modelo de Cadastro de Médicos.xlsx";
    link.href = process.env.REACT_APP_ACCOUNT_SPREADSHEET_MODEL_URL || "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  uploadAccountSpreadsheet: (file, accountType) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("sheet", file);
    formData.append("reg_type", "simple");
    formData.append("account_type", accountType);

    // TODO: add a way to select the partner. Currently it's hardcoded to
    // be Peerbnk on HML and MVBnk on production
    formData.append(
      "partner_id",
      process.env.REACT_APP_ENVIRONMENT === "production"
        ? "42b9f8b4-0749-49e8-9430-560ed128794b"
        : "ea405542-3fb2-4b63-a482-516204791b39"
    );

    return axios
      .post(`${BASE_URL}/accounts/spreadsheet`, formData, options)
      .then((res) => Promise.resolve({ data: res.data }));
  },

  getInfoFromCNPJ: (cnpj) => {
    const apiUrl = "https://publica.cnpj.ws/cnpj/";
    return axios.get(`${apiUrl}${cnpj}`);
  },

  getPayableDocuments: (payableId, extension) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      responseType: "blob",
    };

    return axios
      .get(`${BASE_URL}/payables/${payableId}/documents`, options)
      .then((res) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([res.data]));
        link.download = `${payableId}.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return { data: res.data };
      });
  },

  payableDocumentCancel: (payableId) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };

    return axios
      .post(`${BASE_URL}/payables/${payableId}/upload/cancel`, {}, options)
      .then((res) => {
        return { data: res.data };
      });
  },

  uploadPayableFile: (file, payableId) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("file", file);

    return axios
      .post(`${BASE_URL}/payables/${payableId}/upload`, formData, options)
      .then((res) => Promise.resolve({ data: res.data }));
  },

  exportAdvancements: (advancementIds) => {
    if (!advancementIds.length) return;

    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      responseType: "blob",
    };

    return axios
      .get(
        `${BASE_URL}/advancements/export?ids=${advancementIds.join()}`,
        options
      )
      .then((res) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(new Blob([res.data]));
        link.download = `Relatório-${new Date().toLocaleDateString(
          "pt-BR"
        )}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return { data: res.data };
      });
  },
};

//export default dataProvider;

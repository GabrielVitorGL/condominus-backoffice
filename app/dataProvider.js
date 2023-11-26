import axios from "axios";

import { BASE_URL } from "./utils/constants";

export const dataProvider = {
  getList: (resource, params) => {
    console.log(resource, params);
    const { ...paramFilters } = params.filter;
    const { q } = paramFilters;

    let url = `${BASE_URL}/${resource}?`;

    if (q) url += `&name=${q}`;
    Object.keys(paramFilters).forEach((key) => {
      if (key !== "q" && paramFilters[key]) {
        url += `&${key}=${paramFilters[key]}`;
      }
    });

    Object.keys(params.sort).forEach((key) => {
      const keyNameMap = {
        field: "order_field",
        order: "sort",
      };

      url += `&${keyNameMap[key]}=${params.sort[key]}`;
    });

    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(url, options)
        .then((res) => {
          console.log(res.total);
          resolve({
            data: res.data,
            total: 1,
            //pagination: res.data.pagination,
            //total: res.data.pagination.total_entries_size,
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

  // Not implemented
  deleteMany: (resource, params) => Promise.resolve({ data }),

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

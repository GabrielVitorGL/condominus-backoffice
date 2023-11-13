import axios from "axios";

import { BASE_URL } from "../utils/constants";

export const dataProvider = {
  getList: (resource, params) => {
    console.log(resource, params);
    const { page, perPage } = params.pagination;
    const { hidePeerbnkPartner, ...paramFilters } = params.filter;
    const { q } = paramFilters;

    let url = `${BASE_URL}/backoffice/api/v1/${resource}?`;

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

    if (page && perPage) url += `&page=${page}&per_page=${perPage}`;
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(url, options)
        .then((res) => {
          if (hidePeerbnkPartner) {
            // To avoid confusion we're excluding the Peerbnk partner in HML. But because
            // we haven't cleaned up the data in the database, we're just hiding the option
            // here in the front-end for now.
            resolve({
              data: res.data.entries.filter(
                (entry) =>
                  entry.peerbnk_id !== "5557d18d-16fe-48bd-bb14-bbdd6354ab02"
              ),
              total: res.data.pagination.total_entries_size - 1,
            });
          }
          resolve({
            data: res.data.entries,
            pagination: res.data.pagination,
            total: res.data.pagination.total_entries_size,
          });
        })
        .catch((e) => reject(e));
    });
  },
  getMany: (resource, params) => {
    console.log(resource, params);
    const { ids } = params;
    let url = `${BASE_URL}/backoffice/api/v1/${resource}?ids=${ids.join(",")}`;
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
        .get(`${BASE_URL}/backoffice/api/v1/${resource}/${params.id}`, options)
        .then((res) => {
          resolve({ data: res.data });
        })
        .catch((e) => reject(e));
    });
  },
  create: (resource, params) => {
    console.log(resource, params);
    const { data } = params;
    let url = `${BASE_URL}/backoffice/api/v1/${resource}`;
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
    let url = `${BASE_URL}/backoffice/api/v1/${resource}/${id}`;
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
        .get(
          `${BASE_URL}/backoffice/api/v1/lenders/${lenderId}/config`,
          options
        )
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
        .put(
          `${BASE_URL}/backoffice/api/v1/lenders/${lenderId}/config`,
          data,
          options
        )
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
        .get(
          `${BASE_URL}/backoffice/api/v1/lender_bank_accounts?lender_id=${lenderId}`,
          options
        )
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
        .get(
          `${BASE_URL}/backoffice/api/v1/lenders/${lenderId}/sponsor_taxes`,
          options
        )
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
        .get(
          `${BASE_URL}/backoffice/api/v1/partner_lenders?partner_id=${partnerId}`,
          options
        )
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
        .get(
          `${BASE_URL}/backoffice/api/v1/accounts/${accountId}/details`,
          options
        )
        .then((res) => {
          resolve({ data: res.data });
        })
        .catch((e) => reject(e));
    });
  },
  // Expects resources in the format [["accounts", <account_id>], ["sponsor_settings"]]
  getResource: (resources) => {
    const path = resources.flat().join("/");
    return axios.get(`${BASE_URL}/backoffice/api/v1/${path}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  },
  // Expects resources in the format [["accounts", <account_id>], ["sponsor_settings"]]
  updateResource: (resources, updatedObj) => {
    const path = resources.flat().join("/");
    return axios.put(`${BASE_URL}/backoffice/api/v1/${path}`, updatedObj, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
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
        `${BASE_URL}/backoffice/api/v1/advancements/approve?ids=${advancementsIds}${
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
          `${BASE_URL}/backoffice/api/v1/sold_payables/${soldPayableId}/liquidate`,
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
      .post(
        `${BASE_URL}/backoffice/api/v1/accounts/spreadsheet`,
        formData,
        options
      )
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
      .get(
        `${BASE_URL}/backoffice/api/v1/payables/${payableId}/documents`,
        options
      )
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

  markNotificationAsRead: (notificationId) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };

    const data = {
      mark_all: !notificationId,
      notification_id: notificationId,
    };

    return axios
      .put(
        `${BASE_URL}/backoffice/api/v1/notifications/mark_as_read`,
        data,
        options
      )
      .then((res) => {
        return { data: res.data };
      });
  },

  getNotifications: (params) => {
    const { page, perPage } = params.pagination;
    const { ...paramFilters } = params.filter;

    let url = `${BASE_URL}/backoffice/api/v1/notifications?`;

    Object.keys(paramFilters).forEach((key) => {
      if (key !== "q" && paramFilters[key]) {
        url += `&${key}=${paramFilters[key]}`;
      }
    });

    if (page && perPage) url += `&page=${page}&per_page=${perPage}`;
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return axios.post(url, {}, options).then((res) => {
      return {
        data: res.data.entries,
        pagination: res.data.pagination,
        total: res.data.pagination.total_entries_size,
      };
    });
  },

  payableDocumentCancel: (payableId) => {
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };

    return axios
      .post(
        `${BASE_URL}/backoffice/api/v1/payables/${payableId}/upload/cancel`,
        {},
        options
      )
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
      .post(
        `${BASE_URL}/backoffice/api/v1/payables/${payableId}/upload`,
        formData,
        options
      )
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
        `${BASE_URL}/backoffice/api/v1/advancements/export?ids=${advancementIds.join()}`,
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

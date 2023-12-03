import axios from "axios";

import { BASE_URL } from "../utils/constants";
import { formatDocument } from "../utils/validators/validateDocument";

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
          try {
            if (params.sort && params.sort.field && params.sort.order) {
              finalData = finalData.sort((a, b) => {
                const getField = (obj, field) => {
                  const nestedFields = field.split(".");
                  let nestedObject = obj;

                  for (const nestedField of nestedFields) {
                    if (
                      nestedObject &&
                      nestedObject.hasOwnProperty(nestedField)
                    ) {
                      nestedObject = nestedObject[nestedField];
                    } else {
                      return null; // Retorna null se algum nível do objeto for nulo ou undefined
                    }
                  }

                  return nestedObject;
                };

                const fieldA = getField(a, params.sort.field);
                const fieldB = getField(b, params.sort.field);

                if (fieldA === null || fieldB === null) {
                  // Lida com valores nulos, colocando-os no final ou no início, dependendo da ordem
                  if (fieldA === null && fieldB === null) return 0;
                  if (fieldA === null)
                    return params.sort.order === "ASC" ? 1 : -1;
                  if (fieldB === null)
                    return params.sort.order === "ASC" ? -1 : 1;
                }

                if (params.sort.order === "ASC") {
                  if (fieldA < fieldB) return -1;
                  if (fieldA > fieldB) return 1;
                } else if (params.sort.order === "DESC") {
                  if (fieldA < fieldB) return 1;
                  if (fieldA > fieldB) return -1;
                }

                return 0;
              });
            }
          } catch {}

          const removeAccents = (str) => {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          };

          try {
            if (params.filter && Object.keys(params.filter).length > 0) {
              const filterField = Object.keys(params.filter)[
                Object.keys(params.filter).length - 1
              ];
              const filterValue = params.filter[filterField];

              finalData = finalData.filter((item) => {
                // Verifica se o campo de filtro é um campo aninhado
                if (typeof filterValue != "string") {
                  const nestedField = Object.keys(filterValue)[0];
                  const nestedValue = removeAccents(
                    filterValue[nestedField].toString().toLowerCase()
                  );

                  if (
                    item[filterField] !== null &&
                    item[filterField][nestedField] !== undefined
                  ) {
                    return removeAccents(
                      item[filterField][nestedField].toString().toLowerCase()
                    ).includes(
                      removeAccents(nestedValue.toString().toLowerCase())
                    );
                  }
                  return false;
                } else {
                  // Se não for um campo aninhado, faz o filtro normalmente
                  if (item[filterField] !== null) {
                    return removeAccents(
                      item[filterField].toString().toLowerCase()
                    ).includes(
                      removeAccents(filterValue.toString().toLowerCase())
                    );
                  }
                }
              });
            }
          } catch {}

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
    const { data } = params;
    let url = `${BASE_URL}/${resource}`;
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
  getApartamentoIdByNumero: (numero) => {
    let url = `${BASE_URL}/Apartamentos/GetAll`;
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios.get(url, options).then((res) => {
        const apartamento = res.data.find(
          (ap) => ap.numero.toLowerCase() === numero.toLowerCase()
        );
        try {
          resolve(apartamento.id);
        } catch (e) {
          reject("Apartamento não encontrado");
        }
      });
    });
  },
  getNumeroApartamentoById: (id) => {
    let url = `${BASE_URL}/Apartamentos/GetAll`;
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios.get(url, options).then((res) => {
        const apartamento = res.data.find((ap) => ap.id === id);

        try {
          resolve(apartamento.numero);
        } catch (e) {
          reject("Apartamento não encontrado");
        }
      });
    });
  },
  getIdPessoaByCpf: (cpf) => {
    let url = `${BASE_URL}/Pessoas/GetAll`;
    const formattedCpf = formatDocument(cpf);
    const options = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    };
    return new Promise((resolve, reject) => {
      axios.get(url, options).then((res) => {
        const pessoa = res.data.find(
          (p) => p.cpf.toLowerCase() === formattedCpf.toLowerCase()
        );
        try {
          resolve(pessoa.id);
        } catch (e) {
          reject("Pessoa não encontrada");
        }
      });
    });
  },

  getResource: (resources) => {
    const path = resources.flat().join("/");
    return axios.get(`${BASE_URL}/${path}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  },

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
        .catch((e) => {
          if (e.request.status == 400) {
            if (formattedResource == "AreasComuns") {
              reject(
                "Você não pode excluir essa área pois existem reservas cadastradas para ela."
              );
            }
          }
          reject(e);
        });
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
};

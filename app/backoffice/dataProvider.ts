import axios from "axios";

import { BASE_URL } from "../utils/constants"

export const dataProvider = {
    getList: ({resource, params}: {resource: String, params: any}) => {
        console.log(resource, params);
        const { page, perPage } = params.pagination;
        const { hidePeerbnkPartner, ...paramFilters } = params.filter;
        const { q } = paramFilters;
    
        let url = `${BASE_URL}/${resource}?`;
    
        if (q) url += `&name=${q}`;
        Object.keys(paramFilters).forEach((key) => {
          if (key !== "q" && paramFilters[key]) {
            url += `&${key}=${paramFilters[key]}`;
          }
        });
    
        Object.keys(params.sort).forEach((key) => {
          const keyNameMap: Record<string, string> = {
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
            .then((res: { data: { entries: any; pagination: { total_entries_size: any; }; }; }) => {
              resolve({
                data: res.data.entries,
                pagination: res.data.pagination,
                total: res.data.pagination.total_entries_size,
              });
            })
            .catch((e: any) => reject(e));
        });
      },
      getMany: ({resource, params}: {resource: String, params: any}) => {
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
            .then((res: { data: any[]; }) => {
              resolve({
                data: res.data.entries,
              });
            })
            .catch((e: any) => reject(e));
        });
      },
      getOne: ({resource, params}: {resource: String, params: any}) => {
        console.log(resource, params);
        const options = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
        return new Promise((resolve, reject) => {
          axios
            .get(`${BASE_URL}/${resource}/${params.id}`, options)
            .then((res: { data: any; }) => {
              resolve({ data: res.data });
            })
            .catch((e: any) => reject(e));
        });
      },
      create: ({resource, params}: {resource: String, params: any}) => {
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
            .then((res: { data: any; }) => {
              resolve({ data: res.data });
            })
            .catch((e: any) => reject(e));
        });
      },
      update: ({resource, params}: {resource: String, params: any}) => {
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
            .then((res: { data: any; }) => {
              resolve({ data: res.data });
            })
            .catch((e: any) => reject(e));
        });
      },
}



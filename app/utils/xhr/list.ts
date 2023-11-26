import { AxiosResponse } from "axios";
import { GetListParams, GetListResult, RaRecord } from "react-admin";

export const prepareListConfig = (params: GetListParams) => {
  const { page, perPage } = params.pagination;
  const { ...paramFilters } = params.filter;
  const name = params?.meta?.name;

  const queryParams: { [key: string]: any } = { page, per_page: perPage, name };

  Object.keys(paramFilters).forEach((key) => {
    if (key !== "q" && paramFilters[key]) {
      queryParams[key] = paramFilters[key];
    }
  });

  Object.keys(params.sort).forEach((key) => {
    switch (key) {
      case "field":
        queryParams["order_field"] = params.sort[key];
        break;
      case "order":
        queryParams["sort"] = params.sort[key];
        break;
    }
  });

  return { queryParams };
};

export const makeListResult = <RecordType extends RaRecord = any>(
  response: AxiosResponse
): GetListResult<RecordType> => ({
  data: response.data.entries,
  total: response.data.pagination.total_entries_size,
});

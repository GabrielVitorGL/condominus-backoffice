import { AxiosResponse } from "axios";
import { GetOneParams, GetOneResult, RaRecord } from "react-admin";

export const prepareGetOneResource = (
  resource: string,
  params: GetOneParams
): string => {
  return `${resource}/${params.id}`;
};

export const makeGetOneResult = <RecordType extends RaRecord = any>(
  response: AxiosResponse
): GetOneResult<RecordType> => ({
  data: response.data,
});

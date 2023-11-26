import { AxiosResponse } from "axios";
import { UpdateParams, UpdateResult, RaRecord } from "react-admin";

export interface CustomUpdateParams extends UpdateParams {
  subresource?: string;
}

export const prepareUpdateResource = (
  resource: string,
  params: CustomUpdateParams
): string => {
  return `${resource}/${params.id}${
    params.subresource ? `/${params.subresource}` : ""
  }`;
};

export const makeUpdateResult = <RecordType extends RaRecord = any>(
  response: AxiosResponse,
  params: CustomUpdateParams
): UpdateResult<RecordType> => {
  const result = {
    data: response.data,
  };

  if (!response.data.id) {
    // When updating a 1:1 subresource (for example a partner's Config), the
    // response does not contain the id of the parent resource. We need to
    // add it manually.
    result.data.id = params.id;
  }

  return result;
};

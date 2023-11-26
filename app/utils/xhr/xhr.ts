import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const baseAuthUrl = process.env.NEXT_PUBLIC_BACKOFFICE_BASE_URL;

type ParamValue = string | number | undefined;
type Params = { [key: string]: ParamValue };

export interface Config extends AxiosRequestConfig {
  queryParams?: Params;
  isAuthRequest?: boolean;
  useBasePath?: boolean;
}

const performRequest = (
  method: (
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse>,
  resource: string,
  config?: Config,
  data?: any
): Promise<AxiosResponse> => {
  const url = config?.useBasePath
    ? `${baseAuthUrl}/${resource}`
    : `${config?.isAuthRequest ? baseAuthUrl : baseUrl}/${resource}`;

  const options: AxiosRequestConfig = {
    params: config?.queryParams,
    ...config,
  };

  if (!config?.isAuthRequest) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
  }

  if (method == axios.get) return method(url, options);

  return method(url, data, options);
};

const xhr = {
  get: (resource: string, config?: Config): Promise<AxiosResponse> =>
    performRequest(axios.get, resource, config),
  put: (
    resource: string,
    config?: Config,
    data?: any
  ): Promise<AxiosResponse> =>
    performRequest(axios.put, resource, config, data),
  post: (
    resource: string,
    config?: Config,
    data?: any
  ): Promise<AxiosResponse> =>
    performRequest(axios.post, resource, config, data),
};

export default xhr;

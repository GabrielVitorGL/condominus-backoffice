import axios from "axios";

import { BASE_URL } from "./utils/constants";

const authProvider = {
  login: ({ username, password }) => {
    const params = {
      email: username,
      passwordString: password,
    };

    return axios
      .post(BASE_URL + "/Usuarios/Autenticar", params)
      .then((res) => {
        const { token, nome } = res.data;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("username", nome);
      })
      .catch((error) => {
        console.error("Erro na autenticação: ", error);
        throw error;
      });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    return Promise.resolve();
  },

  checkError: (error) => {
    // this function checks HTTP error and exceptions
    // if it returns an error code 401 or 403, it means the user is not logged in
    if (!error) {
      return Promise.resolve();
    }
    if (!error.response) {
      return Promise.resolve();
    }
    // checking if response access denied status code 401,403
    if (error.response.status !== 401 && error.response.status !== 403) {
      return Promise.resolve();
    }

    // not logged in the API, so remove the token if exists
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    return Promise.reject();
  },

  checkAuth: () => {
    // this function checks if the user has an accessToken on localStorage
    // if it has, this tells us that the user has a token.
    //
    // If this token is invalid, the server will respond with an error
    // and status code 401, calling the method `checkError`
    if (window.location.href.includes("/auth/callback")) {
      // the /auth/callback is a public route, so we need to let the request pass
      // in this case
      return Promise.resolve();
    }
    if (localStorage.getItem("accessToken")) {
      return Promise.resolve();
    }

    return Promise.reject();
  },

  getPermissions: () => Promise.resolve(),

  getAuthURL: () => axios.get(`${BASE_URL}/auth/backoffice/authorization_url`),

  setLogoutURL: (logoutUri) => localStorage.setItem("logoutURL", logoutUri),

  getLogoutURL: () => localStorage.getItem("logoutURL"),
};

export default authProvider;

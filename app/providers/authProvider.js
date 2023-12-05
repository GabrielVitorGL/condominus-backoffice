import axios from "axios";

import { BASE_URL } from "../utils/constants";

const authProvider = {
  login: ({ username, password }) => {
    const params = {
      emailUsuario: username,
      senhaUsuario: password,
    };

    return axios
      .post(BASE_URL + "/Usuarios/Autenticar", params)
      .then((res) => {
        const { tokenUsuario, pessoaUsuario } = res.data;
        localStorage.setItem("accessToken", tokenUsuario);
        localStorage.setItem("role", pessoaUsuario.tipoPessoa);
        localStorage.setItem("username", pessoaUsuario.nomePessoa);
      })
      .catch((error) => {
        console.error("Erro na autenticação: ", error);
        throw error;
      });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
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
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    return Promise.reject();
  },

  checkAuth: () => {
    // this function checks if the user has an accessToken on localStorage
    // if it has, this tells us that the user has a token.
    //
    // If this token is invalid, the server will respond with an error
    // and status code 401, calling the method `checkError`
    if (localStorage.getItem("accessToken")) {
      return Promise.resolve();
    }

    return Promise.reject();
  },

  getPermissions: () => Promise.resolve(),

  getAuthURL: () => Promise.resolve(),

  setLogoutURL: (logoutUri) => localStorage.setItem("logoutURL", logoutUri),

  getLogoutURL: () => localStorage.getItem("logoutURL"),
};

export default authProvider;

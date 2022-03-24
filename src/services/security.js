// Importando biblioteca que contata a API
import {api} from './api';

// Chave responsável por idêntificar no localStorage usuários logados.
const KEY_CLIENT = "@cliente";

// Função que realiza o logIn
export const signIn = (client) => {
    localStorage.setItem(KEY_CLIENT, JSON.stringify(client));
    localStorage.setItem("AUTHOR_ID", client.user_id);
    api.defaults.headers.common['Authorization'] = `Token ${client.token}`;
};

// Função que realiza o LogOut
export const signOut = () => {
    localStorage.clear();
    api.defaults.headers.common['Authorization'] = undefined;
};

// Função que verifica se o cliente está logado
export const isSignedIn = () => {
    // Recebendo dados do localStorage
    const client = JSON.parse(localStorage.getItem(KEY_CLIENT));
    // Verificando se existem dados
    if(client) api.defaults.headers.common['Authorization'] = `Token ${client.token}`;
    // Retornando True ou False caso haja ou n alguém logado.
    return client ? true : false;
}
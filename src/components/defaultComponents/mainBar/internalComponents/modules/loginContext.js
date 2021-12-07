// Contexto de Login para passar informações para children.
import React from 'react';
export default React.createContext({
    token: '',
    clearToken: ()=>{},
    setToken: ()=>{},

    serverClient: {},
    baseUrl: '',
})
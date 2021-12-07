// Contexto de Usuário para passar informações para os children.
import React from 'react';
export default React.createContext({
    token: '',
    matchRoom: {},
    createMatchRoom: ()=>{},
    joinMatchRoom: ()=>{},
    clearMatchRoom: ()=>{},
    lobbyRoom: {},
    clearLobbyRoom: ()=>{},
    user: {},
    userId: '',
})
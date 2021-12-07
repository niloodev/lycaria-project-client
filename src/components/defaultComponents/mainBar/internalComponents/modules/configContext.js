// Contexto de Configurações do Cliente.
import React from 'react';
export default React.createContext({
    resolution: null,
    setResolution: ()=>{},

    backgroundVolume: null,
    setBackgroundVolume: ()=>{}
})
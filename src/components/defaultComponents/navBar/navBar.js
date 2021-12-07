import React from 'react'

// Estilo
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faTimes, faCog } from '@fortawesome/free-solid-svg-icons'
import './navBar.css'

// Electron
const { app, getCurrentWindow, getGlobal } = require('electron').remote;
const version = getGlobal('version');

/////////////////////////////////////////////////

const NavBar = (props)=>{
    return (
    <div className='navBar'>
        <div className='navBarTitle'>Lycaria {version}</div>
        <FontAwesomeIcon icon={faMinus} className='optionBtn' onClick={()=>{ getCurrentWindow().minimize() }}/>
        <FontAwesomeIcon icon={faCog} className='optionBtn' onClick={()=>{props.ToggleOptionMenu()}}/>
        <FontAwesomeIcon icon={faTimes} style={{fontSize: '22px'}} className='optionBtn' onClick={()=>{ app.exit() }}/>
    </div>
    );
}

export default NavBar;
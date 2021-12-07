import React from 'react';
import update from 'immutability-helper'
import $ from 'jquery'

// Contexto
import loginContext from './internalComponents/modules/loginContext'
import configContext from './internalComponents/modules/configContext'

// Páginas
import LoginPage from './internalComponents/clientState/loginPage/loginPage'
import UserPage from './internalComponents/clientState/userPage/userPage'

// ES5
const { webFrame, remote } = require('electron');
const { getGlobal, app, getCurrentWindow } = remote;
const serverClient = getGlobal('client');
const baseUrl = getGlobal('baseUrl');
const version = getGlobal('version');

// Material UI
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faVolumeDown, faVolumeUp } from '@fortawesome/free-solid-svg-icons'

import { Tabs, Tab, Paper, FormControl, Select, InputLabel, MenuItem, Typography, Grid, Slider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'

import SwipeableViews from 'react-swipeable-views'

// Estilo e Animação
import FaLycaria from '../mainBar/internalComponents/basicComponents/simpleAssets/faLycaria'
import { motion, AnimatePresence } from 'framer-motion'
import './mainBar.css';

// Swal
import swt from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const swal = withReactContent(swt);

///////////////////////////////////////////////////////////////////

// Tela de Loading
const LoadingScreen = ()=>{
    // Renderização
    return (
        <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} id='loadingScreen'>
            <motion.span initial={{ x: -200, opacity: 0 }} animate={{ x: 0, opacity: 1, scale: [1, 1.4, 1] }} exit={{ x: 200, opacity: 0 }} transition={{scale: {repeat: Infinity, ease: 'easeInOut', duration: 1}}}><FaLycaria /></motion.span>
        </motion.div>
    );
}

const ClientOptions = (props)=>{
    const [value, setValue] = React.useState(0);

    function a11yProps(index) {
        return {
          id: `vertical-tab-${index}`,
          'aria-controls': `vertical-tabpanel-${index}`
        };
    }

    const tabPanelStyle = {
        width: '100%',
        height: '400px',
        display: 'flex',
        flexFlow: 'column'
    }

    return (
        <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}} 
        transition={{ease: 'easeInOut', duration: 0.15}}
        style={{
            width: '100%', height: '100%', position: 'absolute', display: 'flex',
            justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: '1199'
        }}>
            <motion.span initial={{opacity: 0, x: -40}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -40}}>
                <Paper style={{width: '700px', overflow: 'hidden'}}>
                    <Tabs
                    value={value}
                    onChange={(e, value)=>{setValue(value)}}
                    indicatorColor = 'primary'
                    orientation="horizontal"
                    centered
                    style={{width: '100%', background: 'rgb(43, 43, 43)'}}
                >
                    <Tab label="Geral" {...a11yProps(0)}/>
                    <Tab label="Áudio" {...a11yProps(1)}/>
                    <motion.span style={{position: 'absolute', top: '10px', right: '15px', cursor: 'pointer'}} whileTap={{scale: 0.9}} whileHover={{scale: 1.05}}>
                        <FontAwesomeIcon icon={faTimes} size='2x' onClick={props.ToggleOptionMenu}/>
                    </motion.span>
                </Tabs>
                    <SwipeableViews index={value} onChangeIndex={(i)=>{setValue(i)}}>
                        <motion.div style={tabPanelStyle}>
                            {/* Vídeo */}
                            <FormControl variant="outlined" style={{
                                marginLeft: '10px',
                                marginRight: '10px',
                                marginTop: '17px'
                            }}>   
                            <InputLabel>Resolução</InputLabel>                          
                            <Select label="Resolução"
                                onChange={(e)=>{
                                    props.ClientConfig.setResolution(e.target.value);
                                }}
                                value={props.ClientConfig.resolution}
                            >
                                    <MenuItem value={0}>1280 x 720</MenuItem>
                                    <MenuItem value={1}>1024 x 576</MenuItem>
                            </Select>
                        </FormControl>
                        </motion.div>
                        <motion.div style={tabPanelStyle}>
                            {/* Aúdio */}
                            <motion.div style={{
                                marginLeft: '15px',
                                marginRight: '15px',
                                marginTop: '10px'
                            }}>
                            <Typography gutterBottom>
                                Volume da Música
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <FontAwesomeIcon icon={faVolumeDown} size='2x'/>
                                </Grid>
                                <Grid item xs>
                                    <Slider value={props.ClientConfig.backgroundVolume*100} onChange={(e, v)=>{props.ClientConfig.setBackgroundVolume(v/100)}} />
                                </Grid>
                                <Grid item>
                                    <FontAwesomeIcon icon={faVolumeUp} size='2x'/>
                                </Grid>
                            </Grid>
                            </motion.div>
                        </motion.div>
                    </SwipeableViews>
                </Paper>
            </motion.span>
        </motion.div>
    )
}

///////////////////////////////////////////////////////////////////

// MainBar | Contém basicamente toda interação de usuário.

class MainBar extends React.Component {
    constructor(props){
        super(props)

        // IsLoading define se está carregando ou não.
        // LoginContext é pro contexto de login que pode ser herdado por todos children.
        this.state = { 
            isLoading: true, 
            versionMismatch: false,
            loginContext: {
                token: (localStorage.getItem('token') != null)?localStorage.getItem('token'):null,
                clearToken: ()=>{ 
                    this.setState(update(this.state, {
                        loginContext: {
                            token: {$set: null}
                        },
                        isLoading: {$set: true}
                    }));
                    if(localStorage.getItem('token') != null) localStorage.removeItem('token');
                },
                setToken: (v)=>{ 
                    this.setState(update(this.state, {
                        loginContext: {
                            token: {$set: v}
                        },
                        isLoading: {$set: true}
                    }));
                },
                serverClient: serverClient,
                baseUrl: baseUrl,
            },
            config: {
                resolution: (localStorage.getItem('config/resolution') != null)?parseInt(localStorage.getItem('config/resolution')):0,
                setResolution: (value)=>{
                    if(value != 0 && value != 1) return;
                    localStorage.setItem('config/resolution', value);
                    this.setState(update(this.state,{
                        config: {
                            resolution: {$set: value}
                        }
                    }), ()=>{
                        switch(this.state.config.resolution){
                            case 0:
                                webFrame.setZoomFactor(1);
                                getCurrentWindow().setBounds({width: 1280, height: 720});
                                break;
                            case 1: 
                                webFrame.setZoomFactor(0.8);
                                getCurrentWindow().setBounds({width: 1024, height: 576});
                                break;
                        }
                    });
                },
                
                backgroundVolume: (localStorage.getItem('config/backgroundVolume') != null)?parseFloat(localStorage.getItem('config/backgroundVolume')):0.7,
                setBackgroundVolume: (value)=>{
                    localStorage.setItem('config/backgroundVolume', value);
                    this.setState(update(this.state,{
                        config: {
                            backgroundVolume: {$set: value}
                        }
                    }));
                }
            }
        }

        // Definir Resolução Atual
        switch(this.state.config.resolution){
            case 0:
                webFrame.setZoomFactor(1);
                getCurrentWindow().setBounds({width: 1280, height: 720});
                break;
            case 1: 
                webFrame.setZoomFactor(0.8);
                getCurrentWindow().setBounds({width: 1024, height: 576});
                break;
        }

        this.checkClientVersion = this.checkClientVersion.bind(this);
    }

    checkClientVersion(){
        $.ajax({
            url: baseUrl + '/user/checkVersion',
            type: 'GET'
        }).done((x)=>{
            if(version != x){
                this.setState(update(this.state, {versionMismatch: {$set: true}}));
            }
        });
    }

    componentDidMount(){
        this.checkClientVersion();
    }

    // Renderização
    render(){
        return (
            <div id='main_'>
                <configContext.Provider value={this.state.config}>
                    <loginContext.Provider value={this.state.loginContext}>
                        <AnimatePresence>
                            {(this.props.OptionMenuState) ? <ClientOptions ClientConfig={this.state.config} ToggleOptionMenu={this.props.ToggleOptionMenu}/> : undefined}
                            {(this.state.isLoading) ? <LoadingScreen key='loadingScreen' /> : undefined}
                        </AnimatePresence>

                        <AnimatePresence exitBeforeEnter> {
                        (this.state.versionMismatch == true) ?
                        <motion.div key='versionMismatch' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key='B' style={{width: '100%', height: '100%', backgroundColor: 'rgb(56, 56, 56)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column'}}> 
                            <motion.p initial={{opacity: 0, x: 30}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 30}} style={{color: 'white', letterSpacing: '3px', marginTop: '7px'}}> VERSÃO ANTIGA </motion.p>
                            <motion.p initial={{opacity: 0, x: -30}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -30}} style={{color: '#ff8585', letterSpacing: '2px', marginTop: '2px', fontSize: '11px'}}> ATUALIZE SEU CLIENTE PELO LAUNCHER OFICIAL. </motion.p>
                        </motion.div>:
                        (this.state.loginContext.token == null) ? <LoginPage key_='loginPage' removeLoadScreen={()=>{ this.setState({isLoading: false}) }} loginContext={this.state.loginContext} ConfigContext={this.state.config} /> : <UserPage key_='userPage' removeLoadScreen={()=>{ this.setState({isLoading: false}) }} loginContext={this.state.loginContext} ConfigContext={this.state.config}/>} </AnimatePresence>
                    </loginContext.Provider>
                </configContext.Provider>
            </div>
        );
    }
}

export default MainBar;
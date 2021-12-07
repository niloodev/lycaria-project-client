import React from 'react'
import update from 'immutability-helper'

// Contexto
import UserContext from '../../../../modules/userContext'
import LoginContext from '../../../../modules/loginContext'

// UI
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUserFriends, faUserCircle, faPowerOff } from '@fortawesome/free-solid-svg-icons'
import './loggedSide.css'

// Telas
import MainScreen from './states/mainScreen/mainScreen'

// Animação
import { AnimatePresence, motion } from 'framer-motion';

// Modal
import swt from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const swal = withReactContent(swt);

///////////////////////////////////////////////

// NavBar Absoluta que fica abaixo do LoggedSide.
const BottomNavBar = (props)=>{
    let iconStates = {
        tap: { scale: 0.75 },
        hover: { color: '#bdbdbd' },
        on: {
            color: ['#CD7DDE', '#DE7DA5', '#DE9D7D', '#D6DE7D', '#8DDE7D', '#7DDEB5', '#7DBDDE', '#857DDE', '#CD7DDE'],
            transition: {
                color: {
                    ease: 'easeInOut',
                    repeat: Infinity,
                    duration: 1.5,
                }    
            },
            cursor: 'default'
        },
        off: {}
    }

    return (
        <motion.div className='bottomLoggedSide' initial={{ opacity: 0, x: -45 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -45 }}>
            <motion.span whileTap={(props.sideStateVal != 1)?iconStates.tap:undefined} onClick={()=>{if(props.sideStateVal != 1) props.setStateVal(1); }} variants={iconStates} style={{color: '#fff', marginLeft: '20px', marginRight: '20px', cursor: 'pointer'}} animate={(props.sideStateVal == 1)?'on':'off'}><FontAwesomeIcon icon={faHome} size='2x'/></motion.span>
            <motion.span whileTap={(props.sideStateVal != 2)?iconStates.tap:undefined} onClick={()=>{if(props.sideStateVal != 2) props.setStateVal(2); }} variants={iconStates} style={{color: '#fff', marginLeft: '20px', marginRight: '20px', cursor: 'pointer'}} animate={(props.sideStateVal == 2)?'on':'off'}><FontAwesomeIcon icon={faUserFriends} size='2x'/></motion.span>
            <motion.span whileTap={(props.sideStateVal != 3)?iconStates.tap:undefined} onClick={()=>{if(props.sideStateVal != 3) props.setStateVal(3); }} variants={iconStates} style={{color: '#fff', marginLeft: '20px', marginRight: '20px', cursor: 'pointer'}} animate={(props.sideStateVal == 3)?'on':'off'}><FontAwesomeIcon icon={faUserCircle} size='2x'/></motion.span>
            <motion.span onClick={()=>{
                swal.fire({
                    icon: 'question',
                    text: 'Tem certeza de que deseja desconectar?',
                    showCancelButton: true,
                    showConfirmButton: true,
                    cancelButtonText: 'Não',
                    confirmButtonText: 'Sim',
                    heightAuto: false,
                    target: document.getElementById('loggedMain')
                }).then((v)=>{
                    if(v.isConfirmed){
                        props.LoginContext.clearToken();
                    }
                });
            }} whileTap={{scale: 0.75}} whileHover={{ color: '#f76868' }} style={{color: '#ff8a8a', cursor: 'pointer', marginLeft: '20px', marginRight: '20px'}}><FontAwesomeIcon icon={faPowerOff} size='2x'/></motion.span>
        </motion.div>
    );
}

////////////////////////////////////////

export default class LoggedSide extends React.Component {
    constructor(props){
        super(props);
        this.mount = null;
    }

    // Função executada após montagem e desmontagem de componente.
    componentDidMount(){
        this.mount = true;
    }
    componentWillUnmount(){
        this.mount = false;
    }

    // Renderização
    render(){
        return (
            <motion.div initial={{ opacity: 0, x: -45 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -45 }} className='loggedSide'>
                <UserContext.Consumer>
                    {
                        (userCon)=>(
                            <LoginContext.Consumer>
                                {
                                    (loginCon)=>(
                                        <React.Fragment>
                                            <AnimatePresence exitBeforeEnter>
                                            {
                                                (this.props.sideState.get == 1)?
                                                <MainScreen key='mainScreen' UserContext={userCon} LoginContext={loginCon} contentState={this.props.contentState} />:
                                                undefined
                                            }
                                            </AnimatePresence>
                                            <BottomNavBar sideStateVal={this.props.sideState.get} setStateVal={this.props.sideState.set} LoginContext={loginCon} />
                                        </React.Fragment>
                                    )
                                }
                            </LoginContext.Consumer>
                        )
                    }
                </UserContext.Consumer>
            </motion.div>
        );
    }
}
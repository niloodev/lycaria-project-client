import React from 'react'

// Ícone
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHammer, faUser, faUserFriends, faUsers, faLock, faLockOpen, faSyncAlt } from '@fortawesome/free-solid-svg-icons'

// UI
import { Scrollbar } from 'react-scrollbars-custom'

import LycButton from '../../../commonComponents/lycButton'
import { TextField, FormControl, Select, MenuItem, InputLabel, Paper } from '@material-ui/core'
import './customPlay.css'

// Animação
import { AnimatePresence, motion } from 'framer-motion';

// Modal
import swt from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const swal = withReactContent(swt);

//////////////////////////////////////////////

let RoomInfo = (props)=>{
    let rowStyle = {
        display: 'flex', flexFlow: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px', width: '100%'
    };
    let eleStyle = {
        display: 'flex', flexFlow: 'row', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '17px', flex: 1
    };

    return (
        <motion.span>
            <Paper square elevation={0} 
                style={{
                    position: 'relative', 
                    color: '#fff', 
                    background: 'rgba(45, 45, 45, 0.3)', 
                    maxHeight: '200px', 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flexFlow: 'row', 
                    paddingTop: '5px', 
                    paddingBottom: '5px'
                }}>
                <motion.div style={rowStyle}>
                    <motion.div style={eleStyle}> NOME DA SALA </motion.div>
                    <motion.div style={eleStyle}> MODO </motion.div>
                    <motion.div style={eleStyle}> CRIADOR </motion.div>
                    <motion.div style={eleStyle}> JOGADORES </motion.div>
                    <motion.div style={eleStyle}> PRIVADO </motion.div>
                    <motion.div onClick={props.Refresh} transition={{ease: 'easeInOut', duration: 0.2}} whileTap={{rotate: ['0deg', '360deg', '0deg']}} whileHover={{color: 'rgb(220, 220, 220)'}} style={{position: 'absolute', top: '11px', right: '10px', cursor: 'pointer'}}><FontAwesomeIcon icon={faSyncAlt}/></motion.div>
                </motion.div>
            </Paper>
        </motion.span>
    )
}
let RoomVisualizer = (props)=>{
    let rowStyle = {
        display: 'flex', flexFlow: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: '5px', paddingBottom: '5px', width: '100%'
    };
    let eleStyle = {
        display: 'flex', flexFlow: 'row', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '15px', flex: 1
    };
    let faMode = (props.room.metadata.mode == '1 vs 1')?faUser:(props.room.metadata.mode == '2 vs 2')?faUserFriends:faUsers
    return (
        <motion.div style={{cursor: 'pointer'}} initial={{opacity: 0, x: -40}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 40}}
            whileHover={{x: 5}} whileTap={{scale: 0.95}} transition={{ease: 'easeInOut', duration: 0.1}}
            onClick={async()=>{
                var r;
                if(props.room.metadata.locked){
                    r = await swal.fire({
                        icon: 'warning',
                        title: 'Digite a senha da sala abaixo.',
                        input: 'password',
                        
                        target: document.getElementById('customType_Main'),
                        heightAuto: false,
                        willOpen: function () {
                            swt.getContainer().style.position = 'absolute';
                            swt.getContainer().style.zIndex = 15;
                            swt.getContainer().setAttribute('modalType', 'page');
                        }
                    })
                } else r = {value: ''};

                props.UserContext.joinMatchRoom(props.room, r.value, (e)=>{
                    props.Refresh();
                    swal.fire({
                        icon: 'error',
                        text: (e.code == 4212)?'A sala já está cheia ou não existe mais.':(e.code == 4215)?'Senha incorreta.':'Erro ao entrar na sala.',
                        showConfirmButton: true,
                        confirmButtonText: 'Beleza',
    
                        target: document.getElementById('customType_Main'),
                        heightAuto: false,
                        willOpen: function () {
                            swt.getContainer().style.position = 'absolute';
                            swt.getContainer().style.zIndex = 15;
                            swt.getContainer().setAttribute('modalType', 'page');
                        }
                    })
                });     
            }}
        >
            <Paper elevation={0} style={{boxShadow: '0px 0px 10px rgba(0,0,0,0.2)', color: 'rgb(45, 45, 45)', background: '#fff', maxHeight: '200px', marginTop: '10px', marginLeft: '5px', marginRIght: '5px', width: 'calc(100% - 10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'row', paddingTop: '5px', paddingBottom: '5px'}}>
                <motion.div style={rowStyle}>
                    <motion.div style={eleStyle}> {props.room.metadata.roomName} </motion.div>
                    <motion.div style={eleStyle}>
                        <FontAwesomeIcon icon={faMode} style={{marginRight: '10px'}}/>
                        vs
                        <FontAwesomeIcon icon={faMode} style={{marginLeft: '10px'}}/>
                    </motion.div>
                    <motion.div style={eleStyle}> Criado por {props.room.metadata.creator} </motion.div>
                    <motion.div style={eleStyle}> {props.room.clients}/{props.room.maxClients} </motion.div>
                    <motion.div style={eleStyle}> <FontAwesomeIcon icon={(props.room.metadata.locked)?faLock:faLockOpen} /> </motion.div>
                </motion.div>
            </Paper>
        </motion.div>
    )
}

//////////////////////////////////////////////

let CustomPlay = class SelectPlay extends React.Component{
    constructor(props){
        super(props);
        this.mount = null;

        this.state = {
            loading: true,

            mode: '',
            roomName: '',

            rooms: []
        }

        this.loadingScreen = ()=>{
            return (
                <motion.div style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', zIndex: '10', top: '0', left: '0', width: '100%', height: '100%',
                    backgroundImage: 'linear-gradient(312deg, rgba(107, 107, 107, 0.01) 0%, rgba(107, 107, 107, 0.01) 25%,rgba(140, 140, 140, 0.01) 25%, rgba(140, 140, 140, 0.01) 50%,rgba(140, 140, 140, 0.01) 50%, rgba(140, 140, 140, 0.01) 75%,rgba(182, 182, 182, 0.01) 75%, rgba(182, 182, 182, 0.01) 100%),linear-gradient(106deg, rgba(23, 23, 23, 0.02) 0%, rgba(23, 23, 23, 0.02) 12.5%,rgba(134, 134, 134, 0.02) 12.5%, rgba(134, 134, 134, 0.02) 25%,rgba(31, 31, 31, 0.02) 25%, rgba(31, 31, 31, 0.02) 37.5%,rgba(134, 134, 134, 0.02) 37.5%, rgba(134, 134, 134, 0.02) 50%,rgba(42, 42, 42, 0.02) 50%, rgba(42, 42, 42, 0.02) 62.5%,rgba(6, 6, 6, 0.02) 62.5%, rgba(6, 6, 6, 0.02) 75%,rgba(13, 13, 13, 0.02) 75%, rgba(13, 13, 13, 0.02) 87.5%,rgba(164, 164, 164, 0.02) 87.5%, rgba(164, 164, 164, 0.02) 100%),linear-gradient(327deg, rgba(104, 104, 104, 0.02) 0%, rgba(104, 104, 104, 0.02) 16.667%,rgba(252, 252, 252, 0.02) 16.667%, rgba(252, 252, 252, 0.02) 33.334%,rgba(79, 79, 79, 0.02) 33.334%, rgba(79, 79, 79, 0.02) 50.001000000000005%,rgba(125, 125, 125, 0.02) 50.001%, rgba(125, 125, 125, 0.02) 66.668%,rgba(84, 84, 84, 0.02) 66.668%, rgba(84, 84, 84, 0.02) 83.33500000000001%,rgba(82, 82, 82, 0.02) 83.335%, rgba(82, 82, 82, 0.02) 100.002%),linear-gradient(107deg, rgba(32, 32, 32, 0.03) 0%, rgba(32, 32, 32, 0.03) 16.667%,rgba(53, 53, 53, 0.03) 16.667%, rgba(53, 53, 53, 0.03) 33.334%,rgba(212, 212, 212, 0.03) 33.334%, rgba(212, 212, 212, 0.03) 50.001000000000005%,rgba(190, 190, 190, 0.03) 50.001%, rgba(190, 190, 190, 0.03) 66.668%,rgba(244, 244, 244, 0.03) 66.668%, rgba(244, 244, 244, 0.03) 83.33500000000001%,rgba(118, 118, 118, 0.03) 83.335%, rgba(118, 118, 118, 0.03) 100.002%),linear-gradient(55deg, rgba(30, 30, 30, 0.03) 0%, rgba(30, 30, 30, 0.03) 16.667%,rgba(90, 90, 90, 0.03) 16.667%, rgba(90, 90, 90, 0.03) 33.334%,rgba(230, 230, 230, 0.03) 33.334%, rgba(230, 230, 230, 0.03) 50.001000000000005%,rgba(94, 94, 94, 0.03) 50.001%, rgba(94, 94, 94, 0.03) 66.668%,rgba(216, 216, 216, 0.03) 66.668%, rgba(216, 216, 216, 0.03) 83%,rgba(5, 5, 5, 0.03) 83.335%, rgba(5, 5, 5, 0.03) 100.002%),linear-gradient(90deg, rgb(197, 58, 221),rgb(117, 45, 206))'
                }}
                    initial={{opacity: 1}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <FontAwesomeIcon style={{zIndex: '1'}} icon={faHammer} size='7x'/>
                </motion.div>
            );
        }

        this.searchRooms = this.searchRooms.bind(this);
    }

    // Função de Montar e Desmontar do Componente.
    componentDidMount(){
        this.mount = true;
        this.searchRooms();
        setTimeout(()=>{
            if(this.mount) this.setState({loading: false});
        }, 750);
    }
    componentWillUnmount(){
        this.mount = false;
    }

    searchRooms(){
        this.props.LoginContext.serverClient.getAvailableRooms('GameMatch').then(r => {
            if(this.mount) this.setState({rooms: r});
        })
    }

    render(){
        return (
            <motion.div className='customType_Main' id='customType_Main' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{ease: 'easeInOut', duration: 0.3}}>
                <AnimatePresence>{(this.state.loading)?<this.loadingScreen />:undefined}</AnimatePresence>
                <motion.div className='customType_Menu'>
                    <motion.div className='customType_MenuElement' id='customType_1'>
                        <LycButton style={{
                            zIndex: '1',
                            marginLeft: '30px', marginRight: '30px',
                            width: 'calc(100% - 60px)'
                        }}
                            onClick={()=>{this.props.contentState.set(2.1);}}    
                        > CRIAR PARTIDA </LycButton>
                        <motion.div className='customType_MenuSubElement'>
                            <TextField 
                                type='text' 
                                label='Nome da Sala'
                                onChange={(e)=>{this.setState({roomName: e.target.value})}}
                                inputProps={{maxLength: '25'}}
                                style={{
                                    fontWeight: 'bold', 
                                    fontSize: '19px', 
                                    marginLeft: '17px',
                                    marginRight: '17px',
                                    flex: '6'
                                }}
                                variant='filled'
                            />
                            <FormControl variant="filled"
                                style={{
                                    fontWeight: 'bold', 
                                    fontSize: '19px', 
                                    marginRight: '17px',
                                    flex: '1'
                                }}
                                
                            >   
                                <InputLabel>Modo</InputLabel>                          
                                <Select label="Modo"
                                    onChange={(e)=>{this.setState({mode: e.target.value})}}
                                    defaultValue=''
                                    MenuProps={{
                                        style: {zIndex: '1'}
                                    }}
                                >
                                    <MenuItem value=''>Todos</MenuItem>
                                    <MenuItem value={1}>
                                        <FontAwesomeIcon icon={faUser} style={{marginRight: '10px'}}/>
                                        vs
                                        <FontAwesomeIcon icon={faUser} style={{marginLeft: '10px'}}/>
                                    </MenuItem>
                                    <MenuItem value={2}>
                                        <FontAwesomeIcon icon={faUserFriends} style={{marginRight: '10px'}}/>
                                        vs
                                        <FontAwesomeIcon icon={faUserFriends} style={{marginLeft: '10px'}}/>
                                    </MenuItem>
                                    <MenuItem value={3}>
                                        <FontAwesomeIcon icon={faUsers} style={{marginRight: '10px'}}/>
                                        vs
                                        <FontAwesomeIcon icon={faUsers} style={{marginLeft: '10px'}}/>
                                    </MenuItem>
                                </Select>
                            </FormControl>                          
                        </motion.div>
                    </motion.div>
                    <Scrollbar
                        noScrollX
                        className='customType_MenuElement' 
                        id='customType_2'
                        thumbYProps={{
                            renderer: props => {
                                let thumbStyle = {
                                    background: 'rgb(255, 255, 255)'
                                }
                                const { elementRef, style, ...restProps } = props;
                                return <div {...restProps} ref={elementRef} style={{ ...style, ...thumbStyle }}/>;
                            }
                        }}
                        trackYProps={{
                            renderer: props => {
                                let thumbStyle = {
                                    background: 'rgba(255, 255, 255, 0)'
                                }
                                const { elementRef, style, ...restProps } = props;
                                return <div {...restProps} ref={elementRef} style={{ ...style, ...thumbStyle }}/>;
                            }
                        }}
                    >
                        <RoomInfo Refresh={this.searchRooms}/>
                        <AnimatePresence>
                            {this.state.rooms.map((value, index)=>{
                                return <RoomVisualizer Refresh={this.searchRooms} UserContext={this.props.UserContext} key={index} room={value}/>
                            })}
                        </AnimatePresence>

                    </Scrollbar>
                </motion.div>
            </motion.div>
        );
    }
}

////////////////////////////////////////////// Função de Validação |

let Validation = (userPageState)=>{
    return new Promise((resolve, reject)=>{
        if(userPageState.this.updateStatus.waiting == true || userPageState.this.updateStatus.updating == true){
            swal.fire({
                icon: 'warning',
                title: 'Oops!',
                text:  'Não é possível entrar em uma sala personalizada enquanto o jogo está sendo atualizado.',
                confirmButtonText: 'Ok',
                showCancelButton: false,
                allowOutsideClick: true,
                allowEnterKey: true,
                target: document.getElementById('main_'),
                heightAuto: false,
            })
            reject();
            return;
        }

        if(userPageState.matchRoom != null){
            swal.fire({
                icon: 'warning',
                title: 'Oops!',
                text: 'Não é possível entrar na tela de selecionar partida customizada estando dentro de uma sala customizada.',
                confirmButtonText: 'Ok',
                showCancelButton: false,
                allowOutsideClick: true,
                allowEnterKey: true,
                target: document.getElementById('main_'),
                heightAuto: false,
            })
            reject();
            return;
        }

        resolve();
    });
}

export {CustomPlay};
export {Validation};

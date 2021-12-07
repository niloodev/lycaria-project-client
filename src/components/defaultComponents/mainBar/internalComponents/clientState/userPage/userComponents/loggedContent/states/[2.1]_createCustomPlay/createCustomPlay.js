import React from 'react'

// Autenticação
import { validate } from 'validate.js'

// UI
import LycButton from '../../../commonComponents/lycButton'
import { TextField, FormControl, Select, MenuItem, InputLabel, CircularProgress } from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUsers, faUserFriends } from '@fortawesome/free-solid-svg-icons'

import './createCustomPlay.css'

// Modal
import swt from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const swal = withReactContent(swt);

// Animação
import { AnimatePresence, motion } from 'framer-motion';

//////////////////////////////////////////

let CreateCustomPlay = class createCustomPlay extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            roomName: '',
            roomPassword: '',
            mode: '',
            loading: false
        }

        this.validationObject = {
            roomName: {
                length: {
                    minimum: 3,
                    message: "O nome da sala deve ter no mínimo 3 caracteres."
                },
                format: {
                    pattern: "[a-zA-Z0-9]+",
                    flags: "i",
                    message: "O nome da sala não pode conter caracteres especiais."
                },             
            },
            roomPassword: {
                length: {
                    minimum: 3,
                    message: "A senha deve ter no mínimo 3 caracteres."
                },
                format: {
                    pattern: "[a-zA-Z0-9]+",
                    flags: "i",
                    message: "A senha não pode conter caracteres especiais."
                },             
            },
        }

        this.mount = null;
        this.mainDiv = null;

        this.handleCreate = this.handleCreate.bind(this);
    }

    handleCreate(){
        if(this.state.loading) return;
        var v_ = validate({roomName: this.state.roomName, roomPassword: this.state.roomPassword}, this.validationObject, {fullMessages: false});
        if(v_ != undefined){
            if(v_.roomName != undefined){
                swal.fire({
                    icon: 'warning',
                    title: 'Oops!',
                    text: v_.roomName[0],
                    
                    target: this.mainDiv,
                    heightAuto: false,
                    willOpen: function () {
                        swt.getContainer().style.position = 'absolute';
                        swt.getContainer().style.zIndex = 15;
                        swt.getContainer().setAttribute('modalType', 'page');
                    }
                })
                return;
            }

            if(v_.roomPassword != undefined && this.state.roomPassword.length > 0){
                swal.fire({
                    icon: 'warning',
                    title: 'Oops!',
                    text: v_.roomPassword[0],
                    
                    target: this.mainDiv,
                    heightAuto: false,
                    willOpen: function () {
                        swt.getContainer().style.position = 'absolute';
                        swt.getContainer().style.zIndex = 15;
                        swt.getContainer().setAttribute('modalType', 'page');
                    }
                })
                return;
            }
        }

        if(this.state.mode == ''){
            swal.fire({
                icon: 'warning',
                title: 'Oops!',
                text: 'Você precisa selecionar um modo de jogo.',
                
                target: this.mainDiv,
                heightAuto: false,
                willOpen: function () {
                    swt.getContainer().style.position = 'absolute';
                    swt.getContainer().style.zIndex = 15;
                    swt.getContainer().setAttribute('modalType', 'page');
                }
            });
            return;
        }

        this.setState({loading: true}, ()=>{
            this.props.UserContext.createMatchRoom(this.state.roomName, (this.state.roomPassword.length == 0)?null:this.state.roomPassword, this.props.UserContext.user.nickName, this.state.mode, (err)=>{
                swal.fire({
                    icon: 'warning',
                    title: 'Oops!',
                    text: err,
                    
                    target: this.mainDiv,
                    heightAuto: false,
                    willOpen: function () {
                        swt.getContainer().style.position = 'absolute';
                        swt.getContainer().style.zIndex = 15;
                        swt.getContainer().setAttribute('modalType', 'page');
                    }
                })
                this.setState({loading: false});
            });
        });
        
    }

    componentDidMount(){
        this.mount = true;
    }
    componentWillUnmount(){
        this.mount = false;
    }

    render(){
        return (
            <motion.div className='createCustomType_Main' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{ease: 'easeInOut', duration: 0.3}}>
                <motion.div ref={div => this.mainDiv = div} className='createCustomType_Menu'>
                    <motion.div className='createCustomType_MenuElement' initial={{opacity: 0, x: -40}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -40}}>


                        <React.Fragment key='content'>
                            <motion.div className='createCustomType_Title'>
                                CRIAÇÃO DE PARTIDA
                            </motion.div>
                            <TextField 
                                type='text' 
                                label={`Criado por ${this.props.UserContext.user.nickName}`}
                                style={{
                                    fontWeight: 'bold', 
                                    fontSize: '19px', 
                                    marginLeft: '30px',
                                    marginRight: '30px',
                                    marginTop: '15px',
                                }}
                                variant='filled'
                                disabled
                            />
                            <TextField 
                                type='text' 
                                label='Nome da Sala'
                                onChange={(e)=>{if(this.mount) this.setState({roomName: e.target.value})}}
                                inputProps={{maxLength: '15'}}
                                style={{
                                    fontWeight: 'bold', 
                                    fontSize: '19px', 
                                    marginLeft: '30px',
                                    marginRight: '30px',
                                    marginTop: '15px',
                                }}
                                variant='filled'
                                />
                           <TextField 
                                type='password' 
                                label='Senha da Sala (Opcional)'
                                onChange={(e)=>{if(this.mount) this.setState({roomPassword: e.target.value})}}
                                inputProps={{maxLength: '25'}}
                                style={{
                                    fontWeight: 'bold', 
                                    fontSize: '19px', 
                                    marginLeft: '30px',
                                    marginRight: '30px',
                                    marginTop: '15px',
                                }}
                                variant='filled'
                            />
                            <FormControl 
                                variant="filled"
                                style={{
                                    fontWeight: 'bold', 
                                    fontSize: '19px', 
                                    marginLeft: '30px',
                                    marginRight: '30px',
                                    marginTop: '15px',
                                }}
                            >   
                            <InputLabel>Modo</InputLabel>                          
                                <Select label="Modo"
                                    defaultValue=''
                                    onChange={(e)=>{if(this.mount) this.setState({mode: e.target.value})}}
                                    value={this.state.mode}
                                    MenuProps={{
                                        style: {zIndex: '1'}
                                    }}
                                >
                                    <MenuItem value=''>Nenhum</MenuItem>
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
                            <LycButton 
                                onClick={()=>{this.handleCreate()}}
                                style={{
                                    zIndex: '1',
                                    marginLeft: '30px', marginRight: '30px', marginBottom: '5px',
                                    width: 'calc(100% - 60px)',
                                    pointerEvents: (this.state.loading)?"none":"auto",                                   
                                }}
                            > 
                                <AnimatePresence exitBeforeEnter>
                                    {
                                        (!this.state.loading)?
                                        <motion.span key="a" transition={{ease: 'easeInOut', duration: 0.1}} initial={{opacity: 0, x: -40}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -40}}>CRIAR</motion.span>:
                                        <motion.span key="b" transition={{ease: 'easeInOut', duration: 0.1}} initial={{opacity: 0, x: 40}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 40}}><CircularProgress size={20} color='secondary'/></motion.span>
                                    }
                                </AnimatePresence>
                                
                            </LycButton>
                        </React.Fragment>
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    }
}

/////////////////////////////////////////

let Validation = (userPageState)=>{
    return new Promise((resolve, reject)=>{
        if(userPageState.this.updateStatus.waiting == true || userPageState.this.updateStatus.updating == true){
            swal.fire({
                icon: 'warning',
                title: 'Oops!',
                text: 'Não é possível entrar na criação de partida enquanto o jogo está sendo atualizado.',
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
                text: 'Não é possível entrar na tela de criar partida customizada estando dentro de uma sala customizada.',
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

export {CreateCustomPlay}
export {Validation}
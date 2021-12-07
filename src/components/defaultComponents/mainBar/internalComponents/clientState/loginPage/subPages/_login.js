import React from 'react'
import update from 'immutability-helper'

// Autenticação
import { validate } from 'validate.js'

// Material UI
import { TextField, FormControlLabel, Checkbox, FormGroup, Button, CircularProgress } from '@material-ui/core';

// ES5
const { getGlobal } = require('electron').remote
const accessKey = getGlobal('accessKey');
import $ from 'jquery'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import './subPages.css'

// Objeto de Estilo
const buttonLabelStyle = {
    main: {marginTop: '13px', marginBottom: '13px', fontFamily: 'Arial', fontWeight: '525', letterSpacing: '0px', fontSize: '19px'},
    lite: {marginTop: '2px', marginBottom: '2px', fontFamily: 'Arial', letterSpacing: '0px', fontSize: '15px'}
}

// Animação
import { motion } from 'framer-motion'

///////////////////////////////////////////////////////////////////

export default class LoginSubPage extends React.Component {
    constructor(props){
        super(props);
        this.mount;

        // Estado que gerencia os erros dos inputs e os valores.
        this.state = {
            email: {
                error: {state: false, data: ' '},
                value: '',
            },
            password: {
                error: {state: false, data: ' '},
                value: '',
            },
            stayConnected: false,
            loadingState: false
        }

        // Objeto utilizado na validação dos inputs
        this.validationObject = {
            _email: {
                length: {
                    minimum: 1,
                    message: "Campo não foi preenchido.",
                },
                email: {
                    message: "Formato de email inválido.",
                },             
            },
            _password: {
                length: {
                    minimum: 1,
                    message: "Campo não foi preenchido."
                }
            }
        }

        // Função de State Async
        this.setStateAsync = function(state) {
            return new Promise((resolve) => {
              this.setState(state, resolve)
            });
        };
        
        // Bind do This
        this.HandleLogin = this.HandleLogin.bind(this);
        this.setStateAsync = this.setStateAsync.bind(this);
    }

    // Definição da varíavel de montagem
    componentDidMount(){
        this.mount = true;
    }
    componentWillUnmount(){
        this.mount = false;
    }

    // Função encarregada da autenticação.
    async HandleLogin(){
        if(this.mount) await this.setStateAsync({loadingState: true});

        let v_ = validate({_email: this.state.email.value, _password: this.state.password.value}, this.validationObject, {fullMessages: false});
        if(v_ != undefined){
            if(this.mount) this.setState(
                update(this.state, {
                    email: {
                        error: {
                            state: {$set: (v_._email == undefined)?false:true },
                            data: {$set: (v_._email == undefined)?' ':v_._email[0] },
                        }
                    },
                    password: {
                        error: {
                            state: {$set: (v_._password == undefined)?false:true },
                            data: {$set: (v_._password == undefined)?' ':v_._password[0] },
                        }
                    }
                })
            );
        } else {
            if(this.mount) await this.setStateAsync(
                update(this.state, {
                    email: {
                        error: {
                            state: {$set: false },
                            data: {$set: ' ' },
                        }
                    },
                    password: {
                        error: {
                            state: {$set: false },
                            data: {$set: ' ' },
                        }
                    }
                })
            );

            await this.props.modalManager.loginModalFunctions.antiSpamValidation();

            try {
                let token = await $.ajax({
                    url: `${this.props.loginContext.baseUrl}/user/login`,
                    type: 'POST',
                    data: {accessKey: accessKey, email: this.state.email.value, password: this.state.password.value}
                })

                if(this.state.stayConnected){ localStorage.setItem('token', token); }
                this.props.loginContext.setToken(token);
            } catch (err) {
                if(err.status != 0) {
                    if(err.status == 401) try { await this.props.modalManager.loginModalFunctions.confirmationMail(this.state.email.value); } catch {}
                    else { 
                        this.props.modalManager.popup('error', err.responseText);
                    }
                }
            }
        
        }

        if(this.mount) this.setState({loadingState: false});
    }

    // Renderização de Elementos
    render(){
        return (
        <span>
            <motion.div key='login' style={{marginTop: '-125px', position: 'relative'}} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0, }} exit={{ opacity: 0, x: -60 }}>
                <div className='contentTitle'>ENTRAR</div>
                <FormGroup style={{width: '325px'}}>
                    <TextField 
                        helperText={this.state.email.error.data} 
                        error={this.state.email.error.state} 
                        onKeyPress={(event)=>{if(!this.state.loadingState && event.key == 'Enter') this.HandleLogin();}}
                        onChange={
                            (event)=>{ 
                                this.setState(update(this.state, {email: {value: {$set: event.target.value}}}))
                            }
                        } 
                        inputProps={{maxLength: '35'}} 
                        label="Email"  
                        style={{
                            fontWeight: 'bold', 
                            fontSize: '19px', 
                            marginTop: '-25px', 
                            pointerEvents: !this.state.loadingState?'all':'none'
                        }}
                        variant='filled'
                    />

                    <TextField 
                        helperText={this.state.password.error.data} 
                        error={this.state.password.error.state}
                        onKeyPress={(event)=>{if(!this.state.loadingState && event.key == 'Enter') this.HandleLogin();}} 
                        onChange={
                            (event)=>{ 
                                this.setState(update(this.state, {password: {value: {$set: event.target.value}}})) 
                            }
                        } 
                        inputProps={{maxLength: '15'}} 
                        label="Senha" 
                        type='password'  
                        style={{
                            fontWeight: 'bold', 
                            fontSize: '19px', 
                            pointerEvents: !this.state.loadingState?'all':'none'
                        }}
                        variant='filled'
                    />

                    <FormControlLabel
                        control={<Checkbox color='primary' onChange={(e)=>{this.setState({stayConnected: e.target.checked})}} name="isConnected" />}
                        label="Permanecer conectado."
                        style={{pointerEvents: !this.state.loadingState?'all':'none', marginBottom: '15px'}}
                    />
                    
                    <Button onClick={()=>{if(!this.state.loadingState) this.HandleLogin()}} variant="contained" style={{marginTop: '7px', pointerEvents: !this.state.loadingState?'all':'none'}}>
                        {!this.state.loadingState
                        ?
                            <FontAwesomeIcon icon={faPlay} size='2x' style={{marginTop: '13px', marginBottom: '13px'}}/>
                        :
                            <CircularProgress color='secondary' style={{marginTop: '10px', marginBottom: '10px'}}/>
                        }
                    </Button>
                </FormGroup>
            </motion.div>
            <motion.div className='contentBottom' initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0, }} exit={{ opacity: 0, x: -60 }}>
                <FormGroup style={{width: '325px',}}>
                    <Button 
                        onClick={()=>{if(!this.state.loadingState) this.props.changePage(1)}} 
                        variant="contained" 
                        style={{
                            marginTop: '7px', 
                            pointerEvents: !this.state.loadingState?'all':'none'
                        }}
                    ><div style={buttonLabelStyle.lite}>Criar uma conta</div></Button>
                    <Button 
                        onClick={()=>{if(!this.state.loadingState) this.props.changePage(2)}} 
                        variant="contained" 
                        style={{
                            marginTop: '7px', 
                            pointerEvents: !this.state.loadingState?'all':'none'
                        }}
                    ><div style={buttonLabelStyle.lite}>Esqueceu sua senha?</div></Button>
                </FormGroup>
            </motion.div>
        </span>);  
    }
}
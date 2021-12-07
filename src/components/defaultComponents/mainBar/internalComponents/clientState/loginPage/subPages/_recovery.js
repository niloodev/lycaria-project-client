import React from 'react'
import update from 'immutability-helper'

// Autenticação
import { validate } from 'validate.js'

// Material UI
import { TextField, FormGroup , Button, CircularProgress } from '@material-ui/core';

// ES5
const { getGlobal } = require('electron').remote
const accessKey = getGlobal('accessKey');
import $ from 'jquery'

// Objeto de Estilo
const buttonLabelStyle = {
    main: {marginTop: '11px', marginBottom: '11px', fontFamily: 'Arial', fontWeight: '525', letterSpacing: '0px', fontSize: '17px'},
    lite: {marginTop: '2px', marginBottom: '2px', fontFamily: 'Arial', letterSpacing: '0px', fontSize: '15px'}
}

// Animação
import { motion } from 'framer-motion'
import './subPages.css'

/////////////////////////////////////////////////////////////

export default class RecoverySubPage extends React.Component {
    constructor(props){
        super(props);
        this.mount;

        // Estado que gerencia os erros dos inputs e os valores.
        this.state = {
            email: {
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
            }
        }

        // Função de State Async
        this.setStateAsync = function(state) {
            return new Promise((resolve) => {
              this.setState(state, resolve)
            });
        };
        
        // Bind do This
        this.HandleRecovery = this.HandleRecovery.bind(this);
        this.setStateAsync = this.setStateAsync.bind(this);
    }

    // Definição da varíavel de montagem
    componentDidMount(){
        this.mount = true;
    }
    componentWillUnmount(){
        this.mount = false;
    }

    // Responsável por lidar com a ação do botão "Recuperar"
    async HandleRecovery(){
        if(this.mount) await this.setStateAsync({loadingState: true});

        let v_ = validate({ _email: this.state.email.value }, this.validationObject, {fullMessages: false});
        if(v_ != undefined){
            if(this.mount) this.setState(
                update(this.state, {
                    email: {
                        error: {
                            state: {$set: (v_._email == undefined)?false:true },
                            data: {$set: (v_._email == undefined)?' ':v_._email[0] },
                        }
                    },
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
                })
            );  

            await this.props.modalManager.loginModalFunctions.antiSpamValidation();    
            try {
                await this.props.modalManager.loginModalFunctions.passwordRecovery(this.state.email.value);
                this.props.changePage(0);
            } catch {
                if(this.mount) this.setState({loadingState: false});
                return;
            }
        }

        if(this.mount) this.setState({loadingState: false});
    }

    // Renderização de Elementos
    render(){
        return (<span>
            <motion.div key='login' style={{marginTop: '-120px', position: 'relative'}} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0, }} exit={{ opacity: 0, x: -60 }}>                
                <div className='contentTitle'>RECUPERAR</div>
                <FormGroup style={{width: '325px'}}>
                    <TextField 
                        helperText={this.state.email.error.data} 
                        error={this.state.email.error.state} 
                        onKeyPress={(event)=>{if(!this.state.loadingState && event.key == 'Enter') this.HandleRecovery();}}
                        onChange={
                            (event)=>{ 
                                this.setState(update(this.state, {email: {value: {$set: event.target.value}}}))
                            }
                        } 
                        inputProps={{maxLength: '35'}} 
                        id="standard-basic" 
                        label="Email"  
                        style={{
                            fontWeight: 'bold', 
                            fontSize: '19px', 
                            marginTop: '-25px',
                            pointerEvents: !this.state.loadingState?'all':'none'
                        }}
                        variant='filled'
                    />

                    <Button 
                        onClick={()=>{if(!this.state.loadingState) this.HandleRecovery()}} 
                        variant="contained" 
                        style={{marginTop: '7px', pointerEvents: !this.state.loadingState?'all':'none'}}>
                        {!this.state.loadingState
                        ?
                            <div style={buttonLabelStyle.main}>RECUPERAR</div>
                        :
                            <CircularProgress color='secondary' style={{ marginBottom: '10px', marginTop: '10px'}}/>
                        }
                    </Button>   
                </FormGroup>
            </motion.div>
            <motion.div className='contentBottom' initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0, }} exit={{ opacity: 0, x: -60 }}>
                    <FormGroup style={{width: '325px'}}>
                        <Button 
                            onClick={()=>{this.props.changePage(0)}} 
                            variant="contained" 
                            style={{
                                marginTop: '7px',
                                pointerEvents: !this.state.loadingState?'all':'none'
                            }}
                        ><div style={buttonLabelStyle.lite}>Voltar</div></Button>
                    </FormGroup>
            </motion.div>
        </span>);  
    }
}
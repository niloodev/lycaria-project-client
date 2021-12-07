import React from 'react'
import update from 'immutability-helper'

// Autenticação
import { validate } from 'validate.js'

// Material UI
import { TextField, FormGroup, Button, CircularProgress } from '@material-ui/core';

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

/////////////////////////////////////////////////////////////

export default class RegisterSubPage extends React.Component {
    constructor(props){
        super(props);
        this.mount;

        // Estado que gerencia os erros dos inputs e os valores.
        this.state = {
            name: {
                error: {state: false, data: ' '},
                value: '',
            },
            subName: {
                error: {state: false, data: ' '},
                value: '',
            },
            email: {
                error: {state: false, data: ' '},
                value: '',
            },
            password: {
                error: {state: false, data: ' '},
                value: '',
            },
            nick: {
                error: {state: false, data: ' '},
                value: '',
            },
            stayConnected: false,
            loadingState: false
        }

        // Objeto utilizado na validação dos inputs
        this.validationObject = {
            _name: {
                length: {
                    minimum: 3,
                    message: "O nome deve ter no mínimo 3 caracteres."
                },
                format: {
                    pattern: "[a-zA-Z]+",
                    flags: "i",
                    message: "Não pode conter caracteres especiais nem números."
                },             
            },
            _subName: {
                length: {
                    minimum: 3,
                    message: "O sobrenome deve ter no mínimo 3 caracteres."
                },
                format: {
                    pattern: "[a-zA-Z]+",
                    flags: "i",
                    message: "Não pode conter caracteres especiais nem números."
                },             
            },
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
                    minimum: 5,
                    message: "A senha deve ter no mínimo 5 caracteres."
                }
            },
            _nick: {
                length: {
                    minimum: 3,
                    message: "O apelido deve ter no mínimo 3 caracteres."
                },
                format: {
                    pattern: "[a-zA-Z0-9]+",
                    flags: "i",
                    message: "Não pode conter caracteres especiais."
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
        this.HandleRegister = this.HandleRegister.bind(this);
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
    async HandleRegister(){
        if(this.mount) await this.setStateAsync({loadingState: true});

        let v_ = validate({_name: this.state.name.value, _subName: this.state.subName.value, _email: this.state.email.value, _password: this.state.password.value, _nick: this.state.nick.value}, this.validationObject, {fullMessages: false});
        if(v_ != undefined){
            if(this.mount) this.setState(
                update(this.state, {
                    name: {
                        error: {
                            state: {$set: (v_._name == undefined)?false:true },
                            data: {$set: (v_._name == undefined)?' ':v_._name[0] },
                        }
                    },
                    subName: {
                        error: {
                            state: {$set: (v_._subName == undefined)?false:true },
                            data: {$set: (v_._subName == undefined)?' ':v_._subName[0] },
                        }
                    },
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
                    },
                    nick: {
                        error: {
                            state: {$set: (v_._nick == undefined)?false:true },
                            data: {$set: (v_._nick == undefined)?' ':v_._nick[0] },
                        }
                    },
                })
            );
        } else {
            if(this.mount) await this.setStateAsync(
                update(this.state, {
                    name: {
                        error: {
                            state: {$set: false },
                            data: {$set: ' ' },
                        }
                    },
                    subName: {
                        error: {
                            state: {$set: false },
                            data: {$set: ' ' },
                        }
                    },
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
                    },
                    nick: {
                        error: {
                            state: {$set: false },
                            data: {$set: ' ' },
                        }
                    },
                })
            );  

            await this.props.modalManager.loginModalFunctions.antiSpamValidation();

            try {
                await $.ajax({
                    url: `${this.props.loginContext.baseUrl}/user/register`,
                    type: 'POST',
                    data: {
                        accessKey: accessKey, 
                        email: this.state.email.value,
                        password: this.state.password.value,
        
                        firstName: this.state.name.value,
                        lastName: this.state.subName.value,
        
                        nickName: this.state.nick.value,
                    }
                })
                this.props.changePage(0)
                this.props.modalManager.modal('success', 'Parabéns!', `Acabamos de criar sua conta ${this.state.name.value}, enviamos um email para ${this.state.email.value} e você poderá confirmar seu cadastro.`);   
            } catch (err){
                if(err.status != 0) this.props.modalManager.popup('error', err.responseText);
            }
            
        }

        if(this.mount) this.setState({loadingState: false});
    }

    // Renderização de Elementos
    render(){
        return (
        <span>
            <motion.div key='login'  style={{marginTop: '-120px', position: 'relative'}} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0, }} exit={{ opacity: 0, x: -60 }}>
                <div className='contentTitle'>CADASTRO</div>
                <FormGroup style={{width: '325px'}}>
                    <TextField 
                        helperText={this.state.name.error.data} 
                        error={this.state.name.error.state} 
                        onKeyPress={(event)=>{if(!this.state.loadingState && event.key == 'Enter') this.HandleRegister();}}
                        onChange={
                            (event)=>{ 
                                this.setState(update(this.state, {name: {value: {$set: event.target.value}}}))
                            }
                        } 
                        inputProps={{maxLength: '60'}} 
                        label="Nome"  
                        style={{
                            fontWeight: 'bold', 
                            fontSize: '19px',
                            marginTop: '-25px',
                            pointerEvents: !this.state.loadingState?'all':'none'
                        }}
                        variant='filled'
                    />
                    <TextField 
                        helperText={this.state.subName.error.data} 
                        error={this.state.subName.error.state} 
                        onKeyPress={(event)=>{if(!this.state.loadingState && event.key == 'Enter') this.HandleRegister();}}
                        onChange={
                            (event)=>{ 
                                this.setState(update(this.state, {subName: {value: {$set: event.target.value}}}))
                            }
                        } 
                        inputProps={{maxLength: '60'}} 
                        label="Sobrenome" 
                        type='text'  
                        style={{
                            fontWeight: 'bold', 
                            fontSize: '19px', 
                            pointerEvents: !this.state.loadingState?'all':'none'
                        }}
                        variant='filled'
                    />
                    <TextField 
                        helperText={this.state.email.error.data} 
                        error={this.state.email.error.state} 
                        onKeyPress={(event)=>{if(!this.state.loadingState && event.key == 'Enter') this.HandleRegister();}}
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
                            pointerEvents: !this.state.loadingState?'all':'none'
                        }}
                        variant='filled'
                    />
                    <TextField 
                        helperText={this.state.password.error.data} 
                        error={this.state.password.error.state} 
                        onKeyPress={(event)=>{if(!this.state.loadingState && event.key == 'Enter') this.HandleRegister();}}
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
                    <TextField 
                        helperText={this.state.nick.error.data} 
                        error={this.state.nick.error.state} 
                        onKeyPress={(event)=>{if(!this.state.loadingState && event.key == 'Enter') this.HandleRegister();}}
                        onChange={
                            (event)=>{ 
                                this.setState(update(this.state, {nick: {value: {$set: event.target.value}}}))
                            }
                        } 
                        inputProps={{maxLength: '10'}} 
                        label="Apelido" 
                        type='text'  
                        style={{
                            fontWeight: 'bold', 
                            fontSize: '19px', 
                            pointerEvents: !this.state.loadingState?'all':'none'
                        }}
                        variant='filled'
                    />
                    <Button onClick={()=>{if(!this.state.loadingState) this.HandleRegister()}} variant="contained" style={{marginTop: '3px', pointerEvents: !this.state.loadingState?'all':'none'}}>
                        {!this.state.loadingState
                        ?
                            <div style={buttonLabelStyle.main}>CADASTRAR</div>
                        :
                            <CircularProgress color='secondary' style={{marginTop: '10px', marginBottom: '10px'}}/>
                        }
                    </Button>     
                </FormGroup>
            </motion.div>
            <motion.div className='contentBottom' initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0, }} exit={{ opacity: 0, x: -60 }}>
                <FormGroup style={{width: '325px',}}>
                    <Button 
                        onClick={()=>{if(!this.state.loadingState) this.props.changePage(0)}}
                        variant="contained" 
                        style={{
                            pointerEvents: !this.state.loadingState?'all':'none'
                    }}><div style={buttonLabelStyle.lite}>Voltar</div></Button>
                </FormGroup>
            </motion.div>
        </span>);  
    }
}
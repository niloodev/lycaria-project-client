import React from 'react'

// Páginas da Tela de Login
import LoginSubPage from './subPages/_login'
import RegisterSubPage from './subPages/_register'
import RecoverySubPage from './subPages/_recovery'

// Captcha
import ClientCaptcha from "react-client-captcha";

// Contexto de Login
import loginContext from '../../modules/loginContext'

// ES5
import withReactContent from 'sweetalert2-react-content';
import swt from 'sweetalert2';

const swal = withReactContent(swt);
const { getGlobal, app } = require('electron').remote;
const accessKey = getGlobal('accessKey');

import $ from 'jquery'

// Estilo
import {Howl, Howler} from 'howler';
import LycariaLoginScreenMusic from '../../../internalAssets/sounds/musics/lycariaBackgroundSound.mp4'

import { TextField, CircularProgress, FormGroup, Button } from '@material-ui/core';

import backgroundImage from '../../../internalAssets/images/loginBackground.jpeg'
import './loginPage.css'

import { AnimatePresence, motion } from 'framer-motion';

///////////////////////////////////////////////////////////////////

export default class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.mount;

        // Estado da Tela de Login
        this.state = {
            isConnected: null,
            subPageId: 0,
            changeSubPage: (v)=>{
                if(!this.state.isConnected) return;
                this.setState({subPageId: v});
            },
        }

        // Variável para DOM, responsável por guardar o objeto principal de Div.
        this.mainDiv = null;
        
        // Configurações de execução de modais interativos.
        this.modalConfig = {
            popup: (icon, title)=>{
                swal.fire({
                    icon: icon,
                    title: title,
                    toast: true,
                    position: 'bottom-end',
                    timer: 3000,
                    timerProgressBar: true,
                    target: this.mainDiv,
                    showConfirmButton: false
                })
            },
            modal: (icon, title, text)=>{
                swal.fire({
                    icon: icon,
                    title: title,
                    text: text,
                            
                    showCancelButton: false,
                    confirmButtonText: `Beleza`,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    target: this.mainDiv,
                    heightAuto: false,
                })
            },
            loginModalFunctions: {
                confirmationMail: (email_)=>{
                    return new Promise((resolve, reject)=>{
                        swal.queue([{
                            icon: 'warning',
                            title: 'Oops!',
                            text: `Percebemos que a conta com o email "${email_}" ainda não foi verificada, deseja enviar o email de confirmação novamente?`,
                            
                            showCancelButton: true,
                            confirmButtonText: `Claro`,
                            cancelButtonText: 'Não',
                            showLoaderOnConfirm: true,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            target: this.mainDiv,
                            heightAuto: false,
                            preConfirm: ()=>{      
                                let send = ()=>{
                                    return new Promise((resolve, reject)=>{
                                        $.ajax({
                                            url: `${this.props.loginContext.baseUrl}/user/login/requestMail`,
                                            type: 'POST',
                                            data: {accessKey: accessKey, email: email_}
                                        }).done(()=>{
                                            swal.insertQueueStep({
                                                icon: 'success',
                                                title: 'Tudo Certo!',
                                                text: 'Um email foi enviado à você, vai lá confirmar sua conta!',
                                                confirmButtonText: 'Beleza',
                                                showCancelButton: false,
                                                target: this.mainDiv,
                                                heightAuto: false,
                                            })  
                                            resolve();
                                        }).fail((e)=>{
                                            if(e.status == 0) {
                                                resolve();
                                                return;
                                            }

                                            swal.insertQueueStep({
                                                icon: 'error',
                                                title: 'Oops!',
                                                text: e.responseText,
                                                confirmButtonText: 'Beleza',
                                                showCancelButton: false,
                                                target: this.mainDiv,
                                                heightAuto: false,
                                            })  
                                            resolve();
                                        })
                                    });
                                }                   
                                return send();
                            }
                        }]).then(()=>{ resolve() })
                    });
                },
                antiSpamValidation: ()=>{
                    let CaptchaBox = (props)=>{
                        let [captchaCode, setCaptcha] = React.useState(null);
                        let [code, setCode] = React.useState(null);
                        let mount;
                        
                        React.useEffect(()=>{
                            mount = true;
                            return ()=>{
                                mount = false;
                            }
                        })

                        return (
                            <motion.div 
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    flexFlow: 'column'
                                }}
                            >
                                <motion.p 
                                    style={{color: 'rgb(46,46,46)', fontWeight: 'bold'}}
                                    initial={{
                                        opacity: 0,
                                        x: -50,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0
                                    }}
                                >Digite o código da imagem na caixa de texto abaixo.</motion.p>
                                <motion.span 
                                    initial={{
                                        opacity: 0,
                                        x: 50,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0
                                    }}
                                ><ClientCaptcha backgroundColor='#FFFFFF' retry={false} captchaCode={code => {setCaptcha(code)}}></ClientCaptcha></motion.span>
                                <motion.input 
                                    initial={{
                                        opacity: 0,
                                        x: 50,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0
                                    }}
                                    maxLength='4' className='swal2-input' label='Código' style={{marginTop: '3px', textAlign: 'center', backgroundColor: 'rgb(46, 46, 46)', color: 'white'}}
                                    onChange={(event)=>{
                                        setCode(event.target.value);
                                        if(event.target.value == captchaCode){
                                            props.closeSwal();
                                        }
                                    }}
                                ></motion.input>
                            </motion.div>
                        );
                    }

                    return new Promise((resolve, reject)=>{
                        swal.fire({
                            html: <CaptchaBox closeSwal={()=>{swal.close(); resolve();}}></CaptchaBox>,                            
                            showCancelButton: false,
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            target: this.mainDiv,
                            heightAuto: false,
                        }).then((v)=>{
                            resolve();
                        })
                    });
                },
                passwordRecovery: (email_)=>{
                    return new Promise((resolve, reject)=>{
                        let CodeValidator = (props)=>{
                            let [code, setCode] = React.useState('');
                            let [errorStatus, setError] = React.useState('');
                            let [loading, setLoading] = React.useState(false);
                            let mount;
                        
                            React.useEffect(()=>{
                                mount = true;    
                            })
                            React.useEffect(()=>{
                                return ()=>{
                                    mount = false;
                                }
                            }, []);
                            
                            return (
                                <FormGroup style={{width: '100%'}}>
                                    <motion.p style={{color: 'rgb(56, 56, 56)', textAlign: 'center', marginBottom: '3px'}}>Enviamos um código para o seu e-mail, digite-o abaixo. (Obs: o código expira em 1 hora)</motion.p>
                                    <motion.input
                                        label='Código'
                                        style={{pointerEvents: !loading?'all':'none', backgroundColor: 'rgb(46, 46, 46)', color: 'white', marginBottom: '0px'}}
                                        maxLength='6'
                                        className='swal2-input'
                                        onChange={(event)=>{setCode(event.target.value)}}
                                    />
                                    <motion.p style={{color: errorStatus.length != 0?'#ff2e46':'rgb(46, 46, 46)', textAlign: 'center', marginBottom: '3px', marginTop: '3px'}}>{errorStatus.length != 0?errorStatus:'-'}</motion.p>
                                    <Button 
                                        variant='outlined'
                                        style={{marginTop: '2px', marginBottom: '2px', fontFamily: 'Arial', letterSpacing: '0px', fontSize: '15px', pointerEvents: !loading?'all':'none'}}
                                        onClick={async()=>{
                                            setLoading(true);

                                            if(code.length != 6){
                                                setError('O código deve ter 6 digitos');
                                                setLoading(false);
                                                return;
                                            }

                                            $.ajax({
                                                url: this.props.loginContext.baseUrl+'/user/recovery/confirm',
                                                type: 'post',
                                                data: {code: code, email: email_, accessKey: accessKey},
                                            }).done(()=>{
                                                props.codeSetter(code);
                                                if(mount) setLoading(false);
                                            }).fail((e)=>{
                                                if(e.status == 0) {
                                                    if(mount) setError('Você está sem conexão com o servidor.');
                                                    if(mount) setLoading(false);
                                                    return;
                                                }
                                                
                                                if(mount) setError(e.responseText);
                                                if(mount) setLoading(false);
                                            })
                                        }}
                                    >
                                        {
                                        (!loading)?
                                        <motion.span>Confirmar</motion.span>
                                        : <motion.span>Carregando...</motion.span>
                                        }
                                    </Button>
                                    <Button
                                        variant='outlined'
                                        style={{marginTop: '2px', marginBottom: '2px', fontFamily: 'Arial', letterSpacing: '0px', fontSize: '15px', pointerEvents: !loading?'all':'none'}}
                                        onClick={()=>{
                                            if(loading) return;
                                            props.cancelSwal();
                                        }}
                                    >
                                        <motion.span>Cancelar</motion.span>      
                                    </Button>
                                </FormGroup>
                            );
                        }
                        let PasswordValidator = (props)=>{
                            let [code, setCode] = React.useState('');
                            let [errorStatus, setError] = React.useState('');
                            let mount;
                        
                            React.useEffect(()=>{
                                mount = true;    
                            })
                            React.useEffect(()=>{
                                return ()=>{
                                    mount = false;
                                }
                            }, []);
                            
                            return (
                                <FormGroup style={{width: '100%'}}>
                                    <motion.p style={{color: 'rgb(56, 56, 56)', textAlign: 'center', marginBottom: '3px'}}>Digite sua senha nova abaixo.</motion.p>
                                    <motion.input
                                        type='password'
                                        label='Código'
                                        style={{backgroundColor: 'rgb(46, 46, 46)', color: 'white', marginBottom: '0px'}}
                                        maxLength='15'
                                        className='swal2-input'
                                        onChange={(event)=>{setCode(event.target.value)}}
                                    />
                                    <motion.p style={{color: errorStatus.length != 0?'#ff2e46':'rgb(46, 46, 46)', textAlign: 'center', marginBottom: '3px', marginTop: '3px'}}>{errorStatus.length != 0?errorStatus:'-'}</motion.p>
                                    <Button 
                                        variant='outlined'
                                        style={{marginTop: '2px', marginBottom: '2px', fontFamily: 'Arial', letterSpacing: '0px', fontSize: '15px'}}
                                        onClick={()=>{
                                            if(code.length < 5){
                                                setError('A senha deve ter no mínimo 5 digitos');
                                                return;
                                            }

                                            props.codeSetter(code);
                                        }}
                                    >
                                        <motion.span>Confirmar</motion.span>
                                    </Button>
                                    <Button
                                        variant='outlined'
                                        style={{marginTop: '2px', marginBottom: '2px', fontFamily: 'Arial', letterSpacing: '0px', fontSize: '15px'}}
                                        onClick={()=>{
                                            props.cancelSwal();
                                        }}
                                    >
                                        <motion.span>Cancelar</motion.span>      
                                    </Button>
                                </FormGroup>
                            );
                        }

                        $.ajax({
                            url: this.props.loginContext.baseUrl+'/user/recovery/request',
                            type: 'POST',
                            data: {email: email_, accessKey: accessKey},
                        }).done(()=>{
                            let code_;
                            let pass_;
                            swal.mixin({
                                progressSteps: ['1', '2', '3']  
                            }).queue([
                                {
                                    title: 'Tudo Certo!',
                                    html: <CodeValidator codeSetter={(code)=>{code_ = code; swal.clickConfirm()}} cancelSwal={()=>{ swal.clickCancel() }}></CodeValidator>,
                                    
                                    showCancelButton: false,
                                    showConfirmButton: false,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    target: this.mainDiv,
                                    heightAuto: false,
                                },{
                                    html: <PasswordValidator codeSetter={(pass)=>{pass_ = pass; swal.clickConfirm()}} cancelSwal={()=>{ swal.clickCancel() }}></PasswordValidator>,
                                    
                                    showCancelButton: false,
                                    showConfirmButton: false,
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    target: this.mainDiv,
                                    heightAuto: false,
                                }
                            ]).then((v)=>{
                                if(v.dismiss) {
                                    reject();
                                    return;
                                }
                                $.ajax({
                                    url: this.props.loginContext.baseUrl+'/user/recovery/confirm',
                                    type: 'POST',
                                    data: {code: code_, email: email_, newPass: pass_, accessKey: accessKey},                       
                                }).done(()=>{
                                    resolve();
                                    this.modalConfig.popup('success', 'Senha trocada com sucesso.');
                                }).fail((err)=>{
                                    if(err.status == 0) { reject(); return }
                                    this.modalConfig.popup('error', err.responseText);
                                });
                            });
                        }).fail((err)=>{
                            if(err.status == 0) { reject(); return; }
                            if(err.status == 401) { 
                                this.modalConfig.loginModalFunctions.confirmationMail(email_).then(()=>{
                                    resolve();
                                }).catch(()=>{
                                    reject();
                                })
                            } else {
                                this.modalConfig.popup('error', err.responseText);
                                reject();
                            }
                            
                        })
                    });
                }
            }
        }

        this.backgroundSound = new Howl({
            src: LycariaLoginScreenMusic, 
            volume: this.props.ConfigContext.backgroundVolume,
            loop: true,
            autoplay: true,
        })

        // Inserção do This em funções locais.
        this.subPageManager = this.subPageManager.bind(this);
        this.checkLycariaCon = this.checkLycariaCon.bind(this);
    }

    // Checar conexão
    checkLycariaCon(fst){
        if(!this.mount) return;
        $.ajax({
            url: this.props.loginContext.baseUrl+'/user/check',
            type: 'GET',
        }).done(()=>{
            if(this.state.isConnected != true) if(this.mount) this.setState({isConnected: true}, ()=>{ if(fst) this.props.removeLoadScreen(); });           
            setTimeout(()=>{this.checkLycariaCon()}, 500);
        }).fail((err)=>{
            if(this.state.isConnected != false) if(this.mount) this.setState({isConnected: false}, ()=>{ if(fst) this.props.removeLoadScreen(); });
            if(fst) this.props.removeLoadScreen();
            setTimeout(()=>{this.checkLycariaCon()}, 500);
        });
    }

    // Funções responsáveis por disparar após a montagem da página, e limpar as varíaveis.
    componentDidMount(){
        this.mount = true;
        this.checkLycariaCon(true);
    }
    componentWillUnmount(){
        this.mount = false;
        this.backgroundSound.stop();
    }

    // Função responsável por gerenciar as páginas.
    subPageManager(){
        switch(this.state.subPageId){
            case 0:
                return (
                    <loginContext.Consumer>
                    {
                        loginObj => {
                            return <LoginSubPage key='loginSubPage' changePage={this.state.changeSubPage} loginContext={loginObj} modalManager={this.modalConfig} />;
                        }
                    }
                    </loginContext.Consumer>
                );
                break
            
            case 1:
                return (
                    <loginContext.Consumer>
                    {
                        loginObj => {
                            return <RegisterSubPage key='registerSubPage' changePage={this.state.changeSubPage} loginContext={loginObj} modalManager={this.modalConfig} />
                        }
                    }
                    </loginContext.Consumer>
                );
                break

            case 2:
                return (
                    <loginContext.Consumer>
                    {
                        loginObj => {
                            return <RecoverySubPage key='recoverySubPage' changePage={this.state.changeSubPage} loginContext={loginObj} modalManager={this.modalConfig} />
                        }
                    }
                    </loginContext.Consumer>
                );
                break
        }
    }

    // Renderização
    render(){
        this.backgroundSound.volume(this.props.ConfigContext.backgroundVolume);
        
        if(this.state.isConnected == false) swal.close();

        return (<motion.span key={this.props.key_} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <AnimatePresence exitBeforeEnter>
        {
        (this.state.isConnected == true)?
        <motion.div key='loginPage_A' className='main_' ref={div => this.mainDiv = div}>
            <motion.div initial={{opacity: 0, x: 30}} animate={{opacity: 1, x: 0}} exit={{ opacity: 0 }} style={{width: '100%', height: '100%', position: 'absolute'}}>
                <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src={backgroundImage} />
            </motion.div>
            <motion.div initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: -40, opacity: 0}} className='styleBar'></motion.div>
            <motion.div initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: -40, opacity: 0}} className='contentBar'>
                <AnimatePresence exitBeforeEnter>
                    {this.subPageManager()}
                </AnimatePresence>
            </motion.div>
        </motion.div>:(this.state.isConnected == false)?
        <motion.div key='loginPage_B' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key='B' style={{width: '100%', height: '100%', backgroundColor: 'rgb(56, 56, 56)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column'}}> 
            <motion.span initial={{x: -30, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: -30, opacity: 0}}><CircularProgress /></motion.span>
            <motion.p initial={{opacity: 0, x: 30}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 30}} style={{color: 'white', letterSpacing: '3px', marginTop: '7px'}}> RECONECTANDO </motion.p>
            <motion.p initial={{opacity: 0, x: -30}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -30}} style={{color: '#ff8585', letterSpacing: '2px', marginTop: '2px', fontSize: '11px'}}> Houve um problema na sua conexão com o servidor. </motion.p>
        </motion.div>:undefined
        }
        </AnimatePresence></motion.span>)
    }
}
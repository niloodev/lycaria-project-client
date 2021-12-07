import React from 'react'
import update from 'immutability-helper'

// Arquivos
import fs from 'fs'
import { DownloaderHelper } from 'node-downloader-helper'
import decompress from 'decompress'

// Contexto
import UserContext from '../../modules/userContext'
import { pageIdFilter as PageFilter} from './userComponents/loggedContent/components/pageIdFilter'

// UI
import { Button, CircularProgress, Link } from '@material-ui/core'
import './userPage.css'

// Componentes da Tela do Usuário
import LoggedSide from './userComponents/loggedSide/loggedSide'
import LoggedContent from './userComponents/loggedContent/loggedContent'
import LoggedCharacterSelect from './userComponents/loggedCharacterSelect/loggedCharacterSelect'
import LoggedRestRoom from './userComponents/loggedRestRoom/loggedRestRoom'

// ES5
const { getGlobal, app } = require('electron').remote
const accessKey = getGlobal('accessKey');
const baseUrl = getGlobal('baseUrl');
const dirName = getGlobal('mainDir');

// Animação
import { AnimatePresence, motion } from 'framer-motion';

// Modal
import swt from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const swal = withReactContent(swt);

//////////////////////////////////////////////

export default class UserPage extends React.Component {
    constructor(props){
        super(props);
        this.mount = null;
        this.client = this.props.loginContext.serverClient;

        // Estado da Tela de Usuário
        this.state = {
            token: this.props.loginContext.token,
            selectReady: false,

            gameRoom: {
                status: false,
                id: ''
            },

            matchRoom: null,
            matchRoomListener: ()=>{
                // Definir Listeners
                this.state.matchRoom.onStateChange(()=>{ 
                    this.state.selectReady = this.state.matchRoom.state.selectState;
                    if(this.mount) this.forceUpdate() 
                })
                        
                // Handle de Saida
                this.state.matchRoom.onLeave((code)=>{
                    switch(code){
                        case 1001:
                            swal.fire({
                                icon: 'warning',
                                title: 'Oops!',
                                text: 'Você foi expulso da sala de partida customizada.',
                                confirmButtonText: 'Ok',
                                showCancelButton: false,
                                allowOutsideClick: true,
                                allowEnterKey: true,
                                target: document.getElementById('main_'),
                                heightAuto: false,
                            })
                            break;
                        case 1002:
                            break;
                        default:
                            swal.fire({
                                icon: 'warning',
                                title: 'Oops!',
                                text: 'Você foi desconectado da sala de partida customizada.',
                                confirmButtonText: 'Ok',
                                showCancelButton: false,
                                allowOutsideClick: true,
                                allowEnterKey: true,
                                target: document.getElementById('main_'),
                                heightAuto: false,
                            })
                            break;
                    }
                    this.state.clearMatchRoom();
                });

                this.state.matchRoom.onMessage('MatchData', (m)=>{
                    swal.fire({
                        icon: m.type,
                        title: 'Oops!',
                        text: m.text,
                        confirmButtonText: 'Ok',
                        showCancelButton: false,
                        allowOutsideClick: true,
                        allowEnterKey: true,
                        target: document.getElementById('main_'),
                        heightAuto: false,
                    })
                });
            },
            createMatchRoom: async (roomName_, roomPassword, creator_, mode_, errorCallback)=>{
                if(this.state.this.updateStatus.waiting == true || this.state.this.updateStatus.updating == true) {
                    errorCallback("Não é possível criar uma sala enquanto estiver atualizando.");
                    return;
                } 

                if(this.state.matchRoom != null){
                    this.state.clearMatchRoom();
                }

                if(this.mount){
                    try {
                        let matchRoom = await this.client.create('GameMatch', {roomName: roomName_, creator: creator_, mode: mode_, password: roomPassword, token: this.state.token});
                        this.setState(update(this.state, {matchRoom: {$set: matchRoom}}), ()=>{
                            this.state.matchRoomListener();
                            this.state.this.setContentPageState(2.2);
                        });
                    } catch {
                        errorCallback("Houve um erro ao tentar criar a sala.");
                    }
                }
            },
            joinMatchRoom: async (roomData, pass, errorCallback)=>{
                if(this.state.this.updateStatus.waiting == true || this.state.this.updateStatus.updating == true) return;

                if(this.state.matchRoom != null){
                    this.state.clearMatchRoom();
                }

                if(this.mount){
                    try {
                        let matchRoom = await this.client.joinById(roomData.roomId, {password: pass, token: this.state.token});
                        this.setState(update(this.state, {matchRoom: {$set: matchRoom}}), ()=>{
                            this.state.matchRoomListener();
                            this.state.this.setContentPageState(2.2);
                        });
                    } catch (e) {
                        errorCallback(e);
                    }
                }
            },
            clearMatchRoom: ()=>{
                if(this.state.matchRoom != null) {
                    this.state.matchRoom.removeAllListeners()
                    this.state.matchRoom.leave();
                    if(this.mount) this.setState(update(this.state, {matchRoom: {$set: null}, selectReady: {$set: false}}), ()=>{
                        if(this.state.this.contentPageState == 2.2) this.state.this.setContentPageState(1);
                    });
                }
            },

            lobbyRoom: null,
            clearLobbyRoom: ()=>{
                if(this.state.lobbyRoom != null){
                    this.state.lobbyRoom.leave();
                    this.state.lobbyRoom.removeAllListeners();
                    if(this.state.matchRoom != null) this.state.clearMatchRoom();
                    if(this.mount) this.setState(update(this.state, {lobbyRoom: {$set: null}}));
                }
            },

            user: null,
            userId: null,
            errorType: null,

            this: {
                sidePageState: 1,
                setSidePageState: (s)=>{
                    if(this.mount) this.setState(update(this.state, {this: {sidePageState: {$set: s}}}));
                },
                contentPageState: 0,
                setContentPageState: async (s)=>{
                    let { Validation } = PageFilter(s);
                    try { await Validation(this.state) } catch { return }
                    if(this.mount) this.setState(update(this.state, {this: {contentPageState: {$set: s}}}));
                },

                updateStatus: {
                    waiting: true, 
                    updating: false,
                    info: '',
                    progress: 0,
                }
            }
        }

        // Função de State Async
        this.setStateAsync = function(state) {
            return new Promise((resolve) => {
              this.setState(state, resolve)
            });
        };

        this.connectToLobby = this.connectToLobby.bind(this);
        this.checkForUpdates = this.checkForUpdates.bind(this);
        this.setErrorScreen = this.setErrorScreen.bind(this);
    }   

    connectToLobby(fst){
        if(this.state.lobbyRoom != null) return;
        this.client.join('GameLobby', {token: this.state.token, accessKey: accessKey}).then(async lobbyRoom => {
            if(this.mount) await this.setStateAsync(update(this.state, {lobbyRoom: {$set: lobbyRoom}, errorType: {$set: null}}));
            else return;
  
            let getUserId = ()=>{
                return new Promise((resolve, reject)=>{
                    this.state.lobbyRoom.onMessage('DataUpdate', (i)=>{
                        this.setState(update(
                            this.state,
                            {user: {$set: i}, userId: {$set: i._id}}
                        ), ()=>{
                            resolve();
                        })
                    });
                    this.state.lobbyRoom.onMessage('startUnity', async (roomId)=>{
                        this.setState(update(
                            this.state,
                            {gameRoom: {status: {$set: true}, id: {$set: roomId}}}
                        ));
                    });
                    
                    this.state.lobbyRoom.send('checkForUnity', '');
                    this.state.lobbyRoom.send('requestClientInfo', '');        
                });
            }

            this.state.lobbyRoom.onLeave(e_ =>{
                this.state.clearLobbyRoom();
                switch(e_){
                    case 1008:  
                        this.props.loginContext.clearToken();
                        swal.fire({
                            icon: 'warning',
                            title: 'Oops!',
                            text: 'Parece que houve uma alteração na senha da sua conta, você foi automaticamente desconectado. Se não foi você que realizou essa alteração, entre em contato com nosso suporte.',
                            confirmButtonText: 'Ok',
                            showCancelButton: false,
                            allowOutsideClick: true,
                            allowEnterKey: true,
                            target: document.getElementById('main_'),
                            heightAuto: false,
                        })
                        break;
                    case 1009:
                        this.props.loginContext.clearToken();
                        swal.fire({
                            icon: 'warning',
                            title: 'Oops!',
                            text: 'Parece que sua conta foi acessada em outro dispositivo, se não foi você entre em contato com o suporte imediatamente.',
                            confirmButtonText: 'Ok',
                            showCancelButton: false,
                            allowOutsideClick: true,
                            allowEnterKey: true,
                            target: document.getElementById('main_'),
                            heightAuto: false,
                        })
                        break;
                    default:
                        if(this.mount) this.setState(update(this.state, {errorType: {$set: 1}}), ()=>{
                            this.connectToLobby();
                        });
                        break;
                }
            });

            await getUserId();
            this.checkForUpdates();
            this.props.removeLoadScreen();
        }).catch((e)=>{
            if(e.message == 'onAuth failed'){
                if(this.mount) this.setState(update(this.state, {errorType: {$set: 2}}), ()=>{
                    if(fst == true) this.props.removeLoadScreen();
                });
            } else {
                if(this.mount) this.setState(update(this.state, {errorType: {$set: 1}}), ()=>{
                    this.connectToLobby();
                    if(fst == true) this.props.removeLoadScreen();
                });
            }
        })
    }

    checkForUpdates(){
        // Para baixar a atualização
        this.state.lobbyRoom.onMessage('updateReady', async (i)=>{
            var link = i;

            if(this.state.matchRoom != null){
                this.state.clearMatchRoom();
            }

            console.log('Atualização Pronta.');

            if(this.mount)
            await this.setStateAsync(update(this.state, {this: {updateStatus: {waiting: {$set: false}, updating: {$set: true}, info: {$set: 'Atualizando'}}}}));

            if(!fs.existsSync(dirName+'source/gameSource')){
                fs.mkdirSync(dirName+'source/gameSource', { recursive: true });
            } else {
                if(fs.existsSync(dirName+'source/gameSource/lycaria')) fs.rmdirSync(dirName+'source/gameSource/lycaria', { recursive: true });
            }
            
            if(this.mount)
            await this.setStateAsync(update(this.state, {this: {updateStatus: {info: {$set: 'BAIXANDO'}}}}));

            const dl = new DownloaderHelper(baseUrl + link, dirName+'source/gameSource', {override: true});
            dl.on('end', async ()=>{
                console.log('Descarga Concluída.');

                if(this.mount)
                await this.setStateAsync(update(this.state, {this: {updateStatus: {info: {$set: 'INSTALANDO'}}}}));
                decompress(dirName + link, dirName + 'source/gameSource/lycaria').then(files => {
                    console.log('Instalação Finalizada!');
                    fs.unlinkSync(dirName + link);

                    if(this.mount)
                    this.setState(update(this.state, {this: {updateStatus: {updating: {$set: false}}}}));
                });
            });
            dl.on('progress', (e)=>{
                this.state.this.updateStatus.progress = e.progress;
            })
            dl.on('error', async ()=>{
                if(this.mount)
                await this.setStateAsync(update(this.state, {this: {updateStatus: {info: {$set: 'INDISPONÍVEL'}}}}));
                swal.fire({
                    icon: 'warning',
                    title: 'Oops!',
                    text: 'Não foi possível concluir a atualização, cheque sua conexão de rede e tente novamente.',
                    confirmButtonText: 'Ok',
                    showCancelButton: false,
                    allowOutsideClick: false,
                    allowEnterKey: true,
                    target: document.getElementById('main_'),
                    heightAuto: false,
                }).then(()=>{
                    app.exit();
                });
            });
            
            dl.start(); 
        });
        // Já atualizado
        this.state.lobbyRoom.onMessage('alreadyUpdated', ()=>{
            this.setState(update(this.state, {this: {updateStatus: {waiting: {$set: false}}}}));
        });

        try{
            var ver = fs.readFileSync(dirName + '/source/gameSource/lycaria/version.lycaria').toString();
            this.state.lobbyRoom.send('checkForUpdates', ver);
        } catch(err) {
            this.state.lobbyRoom.send('checkForUpdates', 'v0.0.0');
        }
        
    }

    // Setar telas específicas.
    setErrorScreen(){
        // Sem conexão
        this.Error001 = ()=>{
            return (
                <motion.div key='errorScreen' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key='B' style={{width: '100%', height: '100%', backgroundColor: 'rgb(56, 56, 56)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column'}}> 
                    <motion.span initial={{x: -30, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: -30, opacity: 0}}><CircularProgress /></motion.span>
                    <motion.p initial={{opacity: 0, x: 30}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 30}} style={{color: 'white', letterSpacing: '3px', marginTop: '7px'}}> RECONECTANDO </motion.p>
                    <motion.p initial={{opacity: 0, x: -30}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -30}} style={{color: '#ff8585', letterSpacing: '2px', marginTop: '2px', fontSize: '11px'}}> Houve um problema na sua conexão com o servidor. </motion.p>
                </motion.div>
            );
        }

        // Autenticação de Token Inválida
        this.Error002 = ()=>{
            return (
                <motion.div key='errorScreen' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key='B' style={{width: '100%', height: '100%', backgroundColor: 'rgb(56, 56, 56)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexFlow: 'column'}}> 
                    <motion.p initial={{opacity: 0, x: 30}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 30}} style={{color: 'white', letterSpacing: '3px', marginTop: '7px'}}> OOPS! </motion.p>
                    <motion.p initial={{opacity: 0, x: -30}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -30}} style={{color: 'white', letterSpacing: '2px', marginTop: '2px', fontSize: '11px'}}> Parece que seu código de autenticação expirou, tente logar novamente. </motion.p>
                    <motion.span initial={{opacity: 0, x: 30}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 30}}><Button onClick={()=>{ this.props.loginContext.clearToken() }} variant='contained'>Voltar para Tela de Autenticação</Button></motion.span>
                </motion.div>
            );
        }
    }
    
    // Função responsável por disparar após a montagem da página
    componentDidMount(){
        this.mount = true;
        this.setErrorScreen();
        this.connectToLobby(true);
    }
    componentWillUnmount(){
        this.mount = false;
        this.state.clearLobbyRoom();
        this.state.clearMatchRoom();
    }

    render(){        
        return (
        <motion.div key={this.props.key_} className='loggedMain' id='loggedMain' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnimatePresence exitBeforeEnter>
            {
                (this.state.gameRoom.status == true && this.state.errorType == null)?
                <React.Fragment key='gameRoom'>
                    <LoggedRestRoom RepairGame={()=>{this.checkForUpdates()}} UserContext={this.state} LoginContext={this.props.loginContext} RestRoomClear={()=>{this.setState(update(this.state, {gameRoom: {id: {$set: ""}, status: {$set: false}}}))}}/>
                </React.Fragment>:
                (this.state.selectReady == true && this.state.errorType == null)?
                <React.Fragment key='characterSelectScreen'>
                    <LoggedCharacterSelect UserContext={this.state}/>
                </React.Fragment>:
                (this.state.user != null && this.state.lobbyRoom != null && this.state.errorType == null)?
                <React.Fragment key='userScreen'>
                    <UserContext.Provider value={this.state}>
                        <LoggedSide contentState={{get: this.state.this.contentPageState, set: this.state.this.setContentPageState}} sideState={{get: this.state.this.sidePageState, set: this.state.this.setSidePageState}}/>
                        <LoggedContent contentState={{get: this.state.this.contentPageState, set: this.state.this.setContentPageState}} sideState={{get: this.state.this.sidePageState, set: this.state.this.setSidePageState}}/>
                    </UserContext.Provider>
                </React.Fragment>:undefined
            }

            {
            (this.state.errorType == 1)?<this.Error001 />:
            (this.state.errorType == 2)?<this.Error002 />:undefined
            }
            </AnimatePresence>
        </motion.div>
        );
    }
}
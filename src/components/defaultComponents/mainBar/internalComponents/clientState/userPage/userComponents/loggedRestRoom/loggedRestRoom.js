import React from 'react'

import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { Button } from '@material-ui/core'
import './loggedRestRoom.css'

import { spawn } from 'child_process'
import fs from 'fs'
const { getGlobal } = require('electron').remote

const dirName = getGlobal('mainDir');

export default class LoggedRestRoom extends React.Component {
    constructor(props){
        super(props)
        this.mount = null;
        this.gameProcess = null;

        this.state = {
            gameOpened: false,
            checking: true
        }

        this.startGame = this.startGame.bind(this);
    }

    startGame(){
        this.props.LoginContext.serverClient.getAvailableRooms("Game").then( rooms => {
            let p_ = rooms.find(room => room.roomId == this.props.UserContext.gameRoom.id);
            if(p_ != undefined){
                if(!this.props.UserContext.this.updateStatus.updating && !this.props.UserContext.this.updateStatus.waiting){
                    if(this.gameProcess != null) return;
                    this.gameProcess = spawn(dirName+'source/gameSource/lycaria/LycariaGame.exe', [this.props.UserContext.gameRoom.id, this.props.LoginContext.token]);       
                    if(this.mount) this.setState({gameOpened: true});

                    this.gameProcess.on('close', ()=>{
                        if(!this.mount) return;
                        this.setState({gameOpened: false});
                        this.gameProcess = null;
                    });   
                }

                this.setState({checking: false});
            } else {
                this.props.RestRoomClear();
            }
        });
    }

    componentDidMount(){
        this.mount = true;  
        this.startGame();    
    }

    componentWillUnmount(){
        this.mount = false;
    }

    render(){
        if(this.state.checking) return (<motion.div className='restRoomFrame' initial={{opacity: 0.0001}} animate={{opacity: 1}} exit={{opacity: 0}}></motion.div>)
        return (
            <motion.div className='restRoomFrame' initial={{opacity: 0.0001}} animate={{opacity: 1}} exit={{opacity: 0}}>
                {
                    (this.props.UserContext.this.updateStatus.updating || this.props.UserContext.this.updateStatus.waiting)?
                    <motion.div className='restDiv'>
                        <motion.div className='restText'>
                        REPARANDO, AGUARDE. ({this.props.UserContext.this.updateStatus.info})
                        </motion.div>
                        <motion.div className='restText'>
                        {this.props.UserContext.this.updateStatus.progress}%
                        </motion.div>
                    </motion.div>:
                    (this.state.gameOpened)?
                    <motion.div className='restText'>
                        O JOGO ESTÁ SENDO EXECUTADO
                    </motion.div>:<Button variant='contained' onClick={()=>{this.startGame()}}>RECONECTAR</Button>
                }
                
                {
                    (this.state.gameOpened == false && this.props.UserContext.this.updateStatus.updating == false && this.props.UserContext.this.updateStatus.waiting == false)?
                    <Button className='restRoomRecover' variant='contained' onClick={()=>{
                    fs.unlinkSync(dirName+'source/gameSource/lycaria/version.lycaria');
                    this.props.RepairGame()}}>REPARAR</Button>:undefined
                }
            </motion.div>
        )
    }
}
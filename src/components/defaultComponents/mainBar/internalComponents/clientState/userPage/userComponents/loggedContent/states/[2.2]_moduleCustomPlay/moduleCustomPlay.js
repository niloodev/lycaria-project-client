import React from 'react'

// UI
import LycButton from '../../../commonComponents/lycButton'
import { } from '@material-ui/core'

import ModuleUserBlock from './components/moduleUserBlock'

import Particles from 'react-particles-js';
import BlackParticle from './components/particleConfigs/blackParticles.json'
import WhiteParticle from './components/particleConfigs/whiteParticles.json'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUserFriends, faUsers } from '@fortawesome/free-solid-svg-icons'

import './moduleCustomPlay.css'

// Animação
import { AnimatePresence, motion } from 'framer-motion';

//////////////////////////////////////////////////////
let ModuleCustomPlay = class ModuleCustomPlay extends React.Component {
    constructor(props){
        super(props);
        this.mount;

        this.matchState = this.props.UserContext.matchRoom.state;
        this.matchRoom = this.props.UserContext.matchRoom;

        this.faMode;
        this.versusInt;
        switch(JSON.parse(this.matchState.metadata).mode){
            case '1 vs 1': this.faMode = faUser; this.versusInt = 1; break;
            case '2 vs 2': this.faMode = faUserFriends; this.versusInt = 2; break;
            case '3 vs 3': this.faMode = faUsers; this.versusInt = 3; break;
        }
    }

    componentDidMount(){
        this.mount = true;
    }
    componentWillUnmount(){
        this.mount = false;
    }

    render(){
        const TeamA_Constructor = [];
        const TeamB_Constructor = [];

        for(var i = 0; i < this.versusInt; i++){
            TeamA_Constructor.push(<ModuleUserBlock versusInt={this.versusInt} UserContext={this.props.UserContext} key={i} team='teamA' userIndex={i} matchRoom={this.matchRoom} matchState={this.matchState}/>);
        }
        for(var i = 0; i < this.versusInt; i++){
            TeamB_Constructor.push(<ModuleUserBlock versusInt={this.versusInt} UserContext={this.props.UserContext} key={i} team='teamB' userIndex={i} matchRoom={this.matchRoom} matchState={this.matchState}/>);
        }

        return (
            <motion.div className='moduleCustomType_Main' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{ease: 'easeInOut', duration: 0.3}}>
                <motion.div className='moduleCustomType_Menu'>
                    <motion.div className='moduleCustomType_MenuElement'>

                        <motion.div className='moduleCustomType_infoDiv' initial={{y: -40}} animate={{y: 0}} exit={{y: -40}}>
                            <motion.div className='moduleCustomType_element moduleCustomType_roomName'>{'ID: '+JSON.parse(this.matchState.metadata).roomName}</motion.div>
                            <motion.div className='moduleCustomType_element moduleCustomType_roomMode'>
                                <FontAwesomeIcon icon={this.faMode} style={{marginRight: '15px'}} />
                                    {'vs'}
                                <FontAwesomeIcon icon={this.faMode} className="fa-inverse" style={{marginLeft: '15px', transform: 'scale(-1, 1)'}} />
                            </motion.div>
                            <motion.div className='moduleCustomType_element moduleCustomType_roomCreator'>{'Criador: '+JSON.parse(this.matchState.metadata).creator}</motion.div>
                        </motion.div>

                        <motion.div className='moduleCustomType_mainBox'>
                            <motion.div className='moduleCustomType_secondBox' id='teamA_Box'>
                                <Particles params={WhiteParticle} className='team_BoxBackground' id='teamA_BoxBack'></Particles>
                                <motion.div className='team_BoxList' initial={{x: -40}} animate={{x: 0}} exit={{x: -40}}>
                                    <motion.div className='moduleCustomType_teamExplainer'> CONSELHO </motion.div>
                                    <AnimatePresence>
                                        {TeamA_Constructor}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                
                            <motion.div className='moduleCustomType_secondBox' id='teamB_Box'>
                                <Particles params={BlackParticle} className='team_BoxBackground' id='teamB_BoxBack'></Particles>
                                <motion.div className='team_BoxList' initial={{x: 40}} animate={{x: 0}} exit={{x: 40}}>
                                    <motion.div className='moduleCustomType_teamExplainer'> REBELIÃO </motion.div>
                                    <AnimatePresence>
                                        {TeamB_Constructor}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        <AnimatePresence>
                        {
                            (this.matchState.leader == this.props.UserContext.userId)?
                            <motion.div className='moduleCustomType_bottomDiv' initial={{y: 40, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: 40, opacity: 0}}>
                                <LycButton
                                    disabled={
                                        ((this.versusInt*2) == (parseInt(this.matchState.teamA.length) + parseInt(this.matchState.teamB.length)) && this.matchState.selectState == false)?
                                        false: true
                                    }
                                    onClick={()=>{
                                        this.matchRoom.send('startMatch', {});
                                    }}
                                >INICIAR</LycButton>
                            </motion.div>:undefined
                        }
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            </motion.div>
        )
    }
}

/////////////////////////////////////////

let Validation = (userPageState)=>{
    return new Promise((resolve, reject)=>{
        if(userPageState.this.updateStatus.waiting == true || userPageState.this.updateStatus.updating == true){
            swal.fire({
                icon: 'warning',
                title: 'Oops!',
                text: 'Não é possível entrar em uma sala personalizada enquanto o jogo está sendo atualizado.',
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

        if(userPageState.matchRoom == null){
            swal.fire({
                icon: 'warning',
                title: 'Oops!',
                text: 'Você não está em uma sala de partida customizada.',
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

export {ModuleCustomPlay}
export {Validation}
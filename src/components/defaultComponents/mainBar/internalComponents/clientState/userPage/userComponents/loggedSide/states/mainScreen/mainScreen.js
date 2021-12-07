import React from 'react'
import update from 'immutability-helper'

// Funções
import getIcon from '../../../../../../modules/iconSelector'
import { convertExpToLevel, calculateLevelExp } from '../../../../../../modules/expCalculator'

// Animação
import { AnimatePresence, motion } from 'framer-motion';

// UI
import Tooltip from '@material-ui/core/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGem, faTimes } from '@fortawesome/free-solid-svg-icons'
import LycButton from '../../../commonComponents/lycButton'

import './mainScreen.css'
import './playButton.css'

// Modal
import swt from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const swal = withReactContent(swt);

function useForceUpdate(){
    const [value, setValue] = React.useState(0); 
    return () => setValue(value => value + 1); 
}

export default class MainScreen extends React.Component{
    constructor(props){
        super(props);
        this.mount = null;

        this.playButton = (props)=>{
            const forceUpdate = useForceUpdate();
            var x = null;
            let closeMatchRoom = ()=>{
                swal.fire({
                    target: document.getElementById('main_'),
                    heightAuto: false,

                    showConfirmButton: true,
                    confirmButtonText: 'Sim',
                    showCancelButton: true,
                    cancelButtonText: 'Não',

                    title: 'Eii!',
                    text: 'Deseja realmente sair desta sala?',
                    icon: 'question'
                }).then(v => {
                    if(v.isConfirmed){
                        this.props.UserContext.clearMatchRoom();
                    }
                })
            }

            if(this.props.UserContext.this.updateStatus.waiting == true){
                return <motion.div style={{}} className='userPlayButton' disabled={true} initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 40, opacity: 0}}>
                    CHECANDO ATT.
                </motion.div>
            }
            if(this.props.UserContext.this.updateStatus.updating == true){
                x = setInterval(()=>{
                    if(this.props.UserContext.this.updateStatus.progress == 100 || this.props.UserContext.this.updateStatus.updating == true){
                        clearInterval(x);
                        x = null;
                    }
                    if(this.mount) forceUpdate();
                }, 50);
                return (
                <motion.div style={{}} className='userPlayButton' disabled={true} initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 40, opacity: 0}}>
                    <motion.div className='userPlayButtonProgress' style={{width: `${this.props.UserContext.this.updateStatus.progress}%`}}></motion.div>
                    <span style={{zIndex: 2, color: 'white', textShadow: '0px 0px 20px rgba(0, 0, 0, 0.5)'}}>{this.props.UserContext.this.updateStatus.info}</span>
                </motion.div>);
            } 

            if(this.props.UserContext.matchRoom != null){
                switch(this.props.contentState.get){
                    case 2.2:
                        return (
                        <motion.div className='matchPlayButton' initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 40, opacity: 0}}>
                            <motion.div onClick={closeMatchRoom} className='matchPlayClose' whileTap={{scale: 1.01, transition: {ease: 'easeInOut', duration: 0.1}}} whileHover={{scale: 1.03, transition: {ease: 'easeInOut', duration: 0.1}}}><FontAwesomeIcon icon={faTimes} size='2x'/></motion.div>  
                            <motion.div className='matchPlayText' disabled> VOLTAR AO SALÃO </motion.div>
                        </motion.div>
                        )
                    default:
                        return (
                        <motion.div className='matchPlayButton' initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 40, opacity: 0}}>
                            <motion.div onClick={closeMatchRoom} className='matchPlayClose' whileTap={{scale: 1.05, transition: {ease: 'easeInOut', duration: 0.1}}} whileHover={{scale: 1.15, transition: {ease: 'easeInOut', duration: 0.1}}}><FontAwesomeIcon icon={faTimes} size='2x'/></motion.div>  
                            <motion.div onClick={()=>{this.props.contentState.set(2.2)}} className='matchPlayText' whileTap={{scale: 1.01, transition: {ease: 'easeInOut', duration: 0.1}}} whileHover={{scale: 1.03, transition: {ease: 'easeInOut', duration: 0.1}}}> VOLTAR AO SALÃO </motion.div>
                        </motion.div>
                        )
                }
            }
    
            switch(this.props.contentState.get){
                case 1:
                    return (
                        <motion.div style={{}} className='userPlayButton' disabled={true} initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 40, opacity: 0}}>
                            JOGAR
                        </motion.div>
                    )
                case 2:
                    return (
                        <motion.div onClick={()=>{
                            this.props.contentState.set(1);
                        }} className='userPlayButton' style={{
                            color: 'white',
                            background: 'linear-gradient(312deg, rgba(107, 107, 107, 0.01) 0%, rgba(107, 107, 107, 0.01) 25%,rgba(140, 140, 140, 0.01) 25%, rgba(140, 140, 140, 0.01) 50%,rgba(140, 140, 140, 0.01) 50%, rgba(140, 140, 140, 0.01) 75%,rgba(182, 182, 182, 0.01) 75%, rgba(182, 182, 182, 0.01) 100%),linear-gradient(106deg, rgba(23, 23, 23, 0.02) 0%, rgba(23, 23, 23, 0.02) 12.5%,rgba(134, 134, 134, 0.02) 12.5%, rgba(134, 134, 134, 0.02) 25%,rgba(31, 31, 31, 0.02) 25%, rgba(31, 31, 31, 0.02) 37.5%,rgba(134, 134, 134, 0.02) 37.5%, rgba(134, 134, 134, 0.02) 50%,rgba(42, 42, 42, 0.02) 50%, rgba(42, 42, 42, 0.02) 62.5%,rgba(6, 6, 6, 0.02) 62.5%, rgba(6, 6, 6, 0.02) 75%,rgba(13, 13, 13, 0.02) 75%, rgba(13, 13, 13, 0.02) 87.5%,rgba(164, 164, 164, 0.02) 87.5%, rgba(164, 164, 164, 0.02) 100%),linear-gradient(327deg, rgba(104, 104, 104, 0.02) 0%, rgba(104, 104, 104, 0.02) 16.667%,rgba(252, 252, 252, 0.02) 16.667%, rgba(252, 252, 252, 0.02) 33.334%,rgba(79, 79, 79, 0.02) 33.334%, rgba(79, 79, 79, 0.02) 50.001000000000005%,rgba(125, 125, 125, 0.02) 50.001%, rgba(125, 125, 125, 0.02) 66.668%,rgba(84, 84, 84, 0.02) 66.668%, rgba(84, 84, 84, 0.02) 83.33500000000001%,rgba(82, 82, 82, 0.02) 83.335%, rgba(82, 82, 82, 0.02) 100.002%),linear-gradient(107deg, rgba(32, 32, 32, 0.03) 0%, rgba(32, 32, 32, 0.03) 16.667%,rgba(53, 53, 53, 0.03) 16.667%, rgba(53, 53, 53, 0.03) 33.334%,rgba(212, 212, 212, 0.03) 33.334%, rgba(212, 212, 212, 0.03) 50.001000000000005%,rgba(190, 190, 190, 0.03) 50.001%, rgba(190, 190, 190, 0.03) 66.668%,rgba(244, 244, 244, 0.03) 66.668%, rgba(244, 244, 244, 0.03) 83.33500000000001%,rgba(118, 118, 118, 0.03) 83.335%, rgba(118, 118, 118, 0.03) 100.002%),linear-gradient(55deg, rgba(30, 30, 30, 0.03) 0%, rgba(30, 30, 30, 0.03) 16.667%,rgba(90, 90, 90, 0.03) 16.667%, rgba(90, 90, 90, 0.03) 33.334%,rgba(230, 230, 230, 0.03) 33.334%, rgba(230, 230, 230, 0.03) 50.001000000000005%,rgba(94, 94, 94, 0.03) 50.001%, rgba(94, 94, 94, 0.03) 66.668%,rgba(216, 216, 216, 0.03) 66.668%, rgba(216, 216, 216, 0.03) 83%,rgba(5, 5, 5, 0.03) 83.335%, rgba(5, 5, 5, 0.03) 100.002%),linear-gradient(90deg, rgb(197, 58, 221),rgb(117, 45, 206))'
                        }} whileTap={{scale: 0.95, transition: {ease: 'easeInOut', duration: 0.1}}} whileHover={{scale: 1.05, transition: {ease: 'easeInOut', duration: 0.1}}} initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 40, opacity: 0}}>
                            VOLTAR
                        </motion.div>
                    )
                case 2.1:
                    return (
                        <motion.div onClick={()=>{
                            this.props.contentState.set(2);
                        }} className='userPlayButton' style={{
                            color: 'white',
                            background: 'linear-gradient(312deg, rgba(107, 107, 107, 0.01) 0%, rgba(107, 107, 107, 0.01) 25%,rgba(140, 140, 140, 0.01) 25%, rgba(140, 140, 140, 0.01) 50%,rgba(140, 140, 140, 0.01) 50%, rgba(140, 140, 140, 0.01) 75%,rgba(182, 182, 182, 0.01) 75%, rgba(182, 182, 182, 0.01) 100%),linear-gradient(106deg, rgba(23, 23, 23, 0.02) 0%, rgba(23, 23, 23, 0.02) 12.5%,rgba(134, 134, 134, 0.02) 12.5%, rgba(134, 134, 134, 0.02) 25%,rgba(31, 31, 31, 0.02) 25%, rgba(31, 31, 31, 0.02) 37.5%,rgba(134, 134, 134, 0.02) 37.5%, rgba(134, 134, 134, 0.02) 50%,rgba(42, 42, 42, 0.02) 50%, rgba(42, 42, 42, 0.02) 62.5%,rgba(6, 6, 6, 0.02) 62.5%, rgba(6, 6, 6, 0.02) 75%,rgba(13, 13, 13, 0.02) 75%, rgba(13, 13, 13, 0.02) 87.5%,rgba(164, 164, 164, 0.02) 87.5%, rgba(164, 164, 164, 0.02) 100%),linear-gradient(327deg, rgba(104, 104, 104, 0.02) 0%, rgba(104, 104, 104, 0.02) 16.667%,rgba(252, 252, 252, 0.02) 16.667%, rgba(252, 252, 252, 0.02) 33.334%,rgba(79, 79, 79, 0.02) 33.334%, rgba(79, 79, 79, 0.02) 50.001000000000005%,rgba(125, 125, 125, 0.02) 50.001%, rgba(125, 125, 125, 0.02) 66.668%,rgba(84, 84, 84, 0.02) 66.668%, rgba(84, 84, 84, 0.02) 83.33500000000001%,rgba(82, 82, 82, 0.02) 83.335%, rgba(82, 82, 82, 0.02) 100.002%),linear-gradient(107deg, rgba(32, 32, 32, 0.03) 0%, rgba(32, 32, 32, 0.03) 16.667%,rgba(53, 53, 53, 0.03) 16.667%, rgba(53, 53, 53, 0.03) 33.334%,rgba(212, 212, 212, 0.03) 33.334%, rgba(212, 212, 212, 0.03) 50.001000000000005%,rgba(190, 190, 190, 0.03) 50.001%, rgba(190, 190, 190, 0.03) 66.668%,rgba(244, 244, 244, 0.03) 66.668%, rgba(244, 244, 244, 0.03) 83.33500000000001%,rgba(118, 118, 118, 0.03) 83.335%, rgba(118, 118, 118, 0.03) 100.002%),linear-gradient(55deg, rgba(30, 30, 30, 0.03) 0%, rgba(30, 30, 30, 0.03) 16.667%,rgba(90, 90, 90, 0.03) 16.667%, rgba(90, 90, 90, 0.03) 33.334%,rgba(230, 230, 230, 0.03) 33.334%, rgba(230, 230, 230, 0.03) 50.001000000000005%,rgba(94, 94, 94, 0.03) 50.001%, rgba(94, 94, 94, 0.03) 66.668%,rgba(216, 216, 216, 0.03) 66.668%, rgba(216, 216, 216, 0.03) 83%,rgba(5, 5, 5, 0.03) 83.335%, rgba(5, 5, 5, 0.03) 100.002%),linear-gradient(90deg, rgb(197, 58, 221),rgb(117, 45, 206))'
                        }} whileTap={{scale: 0.95, transition: {ease: 'easeInOut', duration: 0.1}}} whileHover={{scale: 1.05, transition: {ease: 'easeInOut', duration: 0.1}}} initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 40, opacity: 0}}>
                            VOLTAR
                        </motion.div>
                    )
                default:
                    return (
                        <motion.div style={{}} onClick={()=>{
                            this.props.contentState.set(1);
                        }} className='userPlayButton' whileTap={{scale: 0.95, transition: {ease: 'easeInOut', duration: 0.1}}} whileHover={{scale: 1.05, transition: {ease: 'easeInOut', duration: 0.1}}} initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 40, opacity: 0}}>
                            JOGAR
                        </motion.div>
                    )
            }
        }

        this.state = {
            userInfoBox: false,
        };
    }

    componentDidMount(){
        this.mount = true;
    }
    componentWillUnmount(){
        this.mount = false;
    }

    render(){
        return (
            <React.Fragment>
                <motion.div initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 40, opacity: 0}} style={{position: 'relative'}}>
                    <motion.div className='userAvatar'>
                    <motion.img draggable='false' src={getIcon(this.props.UserContext.user.icon)}/>
                </motion.div>
                    <motion.div className='userInfoBox' on={(this.state.userInfoBox)?'true':undefined} onHoverStart={()=>{this.setState(update(this.state, {userInfoBox: {$set: true}}))}} onHoverEnd={()=>{this.setState(update(this.state, {userInfoBox: {$set: false}}))}}>
                    <motion.div className='userNickname' style={{fontSize: (this.props.UserContext.user.nickName.length - 23)/-0.8}}>
                        {this.props.UserContext.user.nickName}
                    </motion.div>
                    <motion.div className='userLevel' animate={{
                        color: ['#CD7DDE', '#DE7DA5', '#DE9D7D', '#D6DE7D', '#8DDE7D', '#7DDEB5', '#7DBDDE', '#857DDE', '#CD7DDE'],
                        transition: {
                            color: {
                                ease: 'easeInOut',
                                repeat: Infinity,
                                duration: 1.5,
                            }    
                        }}}>
                        {
                            `Nível ${convertExpToLevel(this.props.UserContext.user.exp).lv}`
                        }
                    </motion.div>
                    <motion.div className='userMoney' animate={{
                        backgroundColor: ['#CD7DDE', '#DE7DA5', '#DE9D7D', '#D6DE7D', '#8DDE7D', '#7DDEB5', '#7DBDDE', '#857DDE', '#CD7DDE'],
                        transition: {
                            backgroundColor: {
                                ease: 'easeInOut',
                                repeat: Infinity,
                                duration: 1.5,
                            }    
                        }}}>
                        <FontAwesomeIcon icon={faGem} style={{marginRight: '5px', paddingTop: '2px', fontSize: '18px'}}/>
                        {
                            this.props.UserContext.user.money
                        }
                    </motion.div>
                </motion.div>
                </motion.div>
                <this.playButton />
                <LycButton disabled={(this.props.contentState.get == 5)?true:false} onClick={()=>{this.props.contentState.set(5)}} initial={{x: -40, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: 40, opacity: 0}}> LOJA </LycButton>
            </React.Fragment>
        );
    }
}
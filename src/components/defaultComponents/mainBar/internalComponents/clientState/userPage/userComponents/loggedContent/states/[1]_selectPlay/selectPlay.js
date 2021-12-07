import React from 'react'

// Components
import { CustomPlayBox } from './components/customPlayBox/customPlayBox'
import { NormalPlayBox } from './components/normalPlayBox/normalPlayBox'
import { RankedPlayBox } from './components/rankedPlayBox/rankedPlayBox'

// UI
import './selectPlay.css'

// Animação
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';

// Modal
import swt from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const swal = withReactContent(swt);

//////////////////////////////////////////////

let SelectPlay = class SelectPlay extends React.Component{
    constructor(props){
        super(props);
        this.mount = null;
    }

    // Funções no desmontar e no montar do componente.
    componentDidMount(){
        this.mount = true;
    }
    componentWillUnmount(){
        this.mount = false;
    }

    // Renderização
    render(){
        return (
        <motion.div className='selectPlay_Main' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{ease: 'easeInOut', duration: 0.3}}>                
            <NormalPlayBox key='normal' onClick={()=>{this.props.contentState.set(3);}}/>
            <RankedPlayBox key='ranked' onClick={()=>{this.props.contentState.set(4);}}/>
            <CustomPlayBox key='custom' onClick={()=>{this.props.contentState.set(2);}}/>
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
                text: 'Não é possível entrar na tela de seleção enquanto o jogo está sendo atualizado.',
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
                text: 'Não é possível entrar na tela de seleção estando dentro de uma sala customizada.',
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

export {SelectPlay};
export {Validation};

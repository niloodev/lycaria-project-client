import React from 'react'

// UI
import LycButton from '../../../commonComponents/lycButton'
import { } from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { } from '@fortawesome/free-solid-svg-icons'

import './storePage.css'

// Animação
import { AnimatePresence, motion } from 'framer-motion';

//////////////////////////////////////////////////////

let StorePage = class StorePage extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} transition={{ease: 'easeInOut', duration: 0.3}}>
                {'LOJA <3'} 
            </motion.div>
        )
    }
}

/////////////////////////////////////////

let Validation = (userPageState)=>{
    return new Promise((resolve, reject)=>{
        resolve();
    });
}

export {StorePage}
export {Validation}
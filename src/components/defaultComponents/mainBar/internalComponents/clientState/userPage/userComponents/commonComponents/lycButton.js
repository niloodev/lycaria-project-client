import React from 'react'

// Animação
import { AnimatePresence, motion } from 'framer-motion';

import './lycButton.css'

export default (props)=>{
    return (
        <motion.div className='lycButton' onClick={props.onClick} {...props} whileTap={{scale: 0.95, transition: {ease: 'easeInOut', duration: 0.1}}} whileHover={{scale: 1.05, transition: {ease: 'easeInOut', duration: 0.1}}}>
            {props.children}
        </motion.div>
    )
}   
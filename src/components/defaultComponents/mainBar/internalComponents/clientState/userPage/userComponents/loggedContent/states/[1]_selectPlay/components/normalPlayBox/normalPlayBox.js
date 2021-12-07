import React from 'react'
import './normalPlayBox.css'

// Animação
import { AnimatePresence, motion } from 'framer-motion';

// Ícone
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'

export const NormalPlayBox = props =>{
    let [hover, setHover] = React.useState(false);

    let animationVariants = {
        on: {
            y: 0,
            opacity: 1,
        }, 
        off: {
            y: 685,
            opacity: 0,
        }
    }

    return (
        <motion.div onClick={props.onClick} onHoverStart={()=>{setHover(true)}} onHoverEnd={()=>{setHover(false)}} className='selectPlay_SelectElement' id='selectPlay_NormalPlay' initial={{opacity: 0, y: 50}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 50}}>
            <FontAwesomeIcon style={{zIndex: '1'}} icon={faTrophy} size='2x'/>
            <motion.p style={{zIndex: '1'}}> NORMAL </motion.p>
            <motion.div transition={{ease: 'easeInOut', duration: 0.15}} variants={animationVariants} animate={(hover)?'on':'off'} className='divColorful' id='customDivColorful'></motion.div>
        </motion.div>
    );
}
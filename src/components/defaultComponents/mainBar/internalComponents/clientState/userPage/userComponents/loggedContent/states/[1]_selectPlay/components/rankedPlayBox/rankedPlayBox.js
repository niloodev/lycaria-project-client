import React from 'react'
import './rankedPlayBox.css'

// Animação
import { AnimatePresence, motion } from 'framer-motion';

// Ícone
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'

export const RankedPlayBox = props =>{
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
        <motion.div onClick={props.onClick} onHoverStart={()=>{setHover(true)}} onHoverEnd={()=>{setHover(false)}} className='selectPlay_SelectElement' id='selectPlay_RankedPlay' initial={{opacity: 0, y: 50}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 50}}>
            <FontAwesomeIcon style={{zIndex: '1'}} icon={faCrown} size='2x'/>
            <motion.p style={{zIndex: '1'}}> RANQUEADA </motion.p>
            <motion.div transition={{ease: 'easeInOut', duration: 0.15}} variants={animationVariants} animate={(hover)?'on':'off'} className='divColorful' id='customDivColorful'></motion.div>
        </motion.div>
    );
}
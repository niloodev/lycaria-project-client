import React from 'react'

// Contexto
import UserContext from '../../../../modules/userContext'
import LoginContext from '../../../../modules/loginContext'

// Telas
import { SelectPlay } from './states/[1]_selectPlay/selectPlay'
import { CustomPlay } from './states/[2]_customPlay/customPlay'
import { CreateCustomPlay } from './states/[2.1]_createCustomPlay/createCustomPlay'
import { ModuleCustomPlay } from './states/[2.2]_moduleCustomPlay/moduleCustomPlay'

import { StorePage } from './states/[5]_storePage/storePage'

// UI
import './loggedContent.css'

// Animação
import { AnimatePresence, motion } from 'framer-motion';

/////////////////////////////////////////////////////////////

export default class LoggedContent extends React.Component {
    constructor(props){
        super(props);
    }

    // Renderização de Todos Elementos da Content
    render(){
        return (
            <motion.div initial={{ opacity: 0, x: 45 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 45 }} className='loggedContent'>
                <UserContext.Consumer>
                    {
                        (userCon)=>(
                            <LoginContext.Consumer>
                                {
                                    (loginCon)=>(
                                        <React.Fragment>
                                            <AnimatePresence exitBeforeEnter>
                                                {
                                                    // Seleção de Partida
                                                    (this.props.contentState.get == 1)?
                                                    <SelectPlay key='selectPlay' UserContext={userCon} LoginContext={loginCon} contentState={this.props.contentState} sideState={this.props.sideState}/>:
                                                    
                                                    // Partida Customizada
                                                    (this.props.contentState.get == 2)?
                                                    <CustomPlay key='customPlay' UserContext={userCon} LoginContext={loginCon} contentState={this.props.contentState} sideState={this.props.sideState}/>:
                                                    (this.props.contentState.get == 2.1)?
                                                    <CreateCustomPlay key='createCustomPlay' UserContext={userCon} LoginContext={loginCon} contentState={this.props.contentState} sideState={this.props.sideState}/>:
                                                    (this.props.contentState.get == 2.2 && userCon.matchRoom != undefined)?
                                                    <ModuleCustomPlay key='moduleCustomPlay' UserContext={userCon} LoginContext={loginCon} contentState={this.props.contentState} sideState={this.props.sideState}/>:
                                                    
                                                    // Loja
                                                    (this.props.contentState.get == 5)?
                                                    <StorePage key='storePage' UserContext={userCon} LoginContext={loginCon} contentState={this.props.contentState} sideState={this.props.sideState}/>:
                                                    undefined
                                                }
                                            </AnimatePresence>
                                        </React.Fragment>
                                    )
                                }
                            </LoginContext.Consumer>
                        )
                    }
                </UserContext.Consumer>
            </motion.div>
        );
    }
}
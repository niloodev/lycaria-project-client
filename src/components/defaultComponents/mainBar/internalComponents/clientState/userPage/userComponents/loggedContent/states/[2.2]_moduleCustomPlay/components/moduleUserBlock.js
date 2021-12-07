import React from 'react'

// UI
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCrown, faTimes } from '@fortawesome/free-solid-svg-icons'

// Funcionalidades
import IconSelector from '../../../../../../../modules/iconSelector'
import { convertExpToLevel } from '../../../../../../../modules/expCalculator'

// Animação
import { AnimatePresence, motion } from 'framer-motion';

export default (props)=>{
    let [user, setUser] = React.useState(null);
    let mount;

    let myTeam = props.matchState[props.team].toArray();
    let opsTeam = (props.team == 'teamA')?props.matchState['teamB'].toArray():props.matchState['teamA'].toArray();

    let userId = (myTeam[props.userIndex] == undefined)?undefined:myTeam[props.userIndex];

    let userListener = props.UserContext.lobbyRoom.onMessage('DataUpdate/'+userId, (m)=>{
        if(mount){
            setUser(m);
        }
    });
    
    props.UserContext.lobbyRoom.send('requestClientInfo', userId);
    let userInterval = setInterval(()=>{
        if(mount) props.UserContext.lobbyRoom.send('requestClientInfo', userId);
    }, 4000);
    

    let _this = (userId == props.UserContext.userId)?true:false;
    let _leader = (userId == props.matchState.leader)?true:false;
    let _isLeaderScreen = (props.UserContext.userId == props.matchState.leader)?true:false;

    React.useEffect(()=>{
        mount = true;
        return ()=>{
            mount = false;
            user = undefined;
            userId = undefined; 
            myTeam = undefined;
            opsTeam = undefined;
            userListener();
            clearInterval(userInterval);
        }
    })
    
    return (
        <motion.div className='moduleCustomType_userContainer' id={userId} key={userId} initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}}>
            {
                (user != null && userId != undefined)?
                (
                    <motion.div className='moduleCustomType_userBox'>
                        <motion.div className='icon'>
                            <img draggable="false" src={IconSelector(user.icon)} />
                        </motion.div>
                        <motion.div className='info' style={(_this)?{color: '#faffb5'}:undefined}>
                            <motion.div nickName >{user.nickName}</motion.div>
                            <motion.div level >Nível {convertExpToLevel(user.exp).lv}</motion.div>
                        </motion.div>
                        {
                            (_leader)?
                                <motion.div className='leader'><FontAwesomeIcon icon={faCrown}/></motion.div>
                            :(!_leader && _isLeaderScreen)?
                                <motion.div onClick={()=>{props.matchRoom.send('promoveToLeader', userId);}} className='promoveToLeader'>
                                    <FontAwesomeIcon icon={faCrown}/>
                                </motion.div>
                            :undefined
                        }
                        {
                            (!_this && _isLeaderScreen)?
                            <motion.div className='closeUserBox' onClick={()=>{props.matchRoom.send('closeClient', userId);}}>
                                <FontAwesomeIcon icon={faTimes}/>
                            </motion.div>:undefined
                        }
                        {
                            ((_this || _isLeaderScreen) && opsTeam.length != props.versusInt)?
                            <motion.div className='goToOtherTeam' onClick={()=>{props.matchRoom.send('goToOtherTeam', userId);}}>
                                <FontAwesomeIcon icon={faArrowRight}/>
                            </motion.div>:undefined
                        }
                        
                        
                    </motion.div>
                ):undefined
            }
        </motion.div>
    )

}
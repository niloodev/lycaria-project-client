import React from 'react'

// UI
import CharAssets from '../../../../../internalAssets/characters/charactersAssets'
import characterBackground from '../../../../../internalAssets/images/characterSelectBackground.jpg'

import { TextField, CircularProgress, Button } from '@material-ui/core'

import iconCouncil from '../../../../../internalAssets/icons/icon_council.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faJedi, faKhanda, faShieldAlt, faBookOpen } from '@fortawesome/free-solid-svg-icons'

import Tooltip from '@material-ui/core/Tooltip';
import { Scrollbar } from 'react-scrollbars-custom'

import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import './loggedCharacterSelect.css'

const CharacterSelectElement = (props) => {
    return ( 
    (props.id != props.current)?
    <Tooltip title={props.id+'s'}><motion.div className='characterSelectElement' transition={{ease: 'easeInOut', duration: 0.07}} onClick={props.onClick}>
            <motion.span><FontAwesomeIcon icon={props.icon} size='2x'/></motion.span>
    </motion.div></Tooltip>:<Tooltip title={props.id+'s'}><motion.div className='characterSelectElement' disabled>
            <motion.span><FontAwesomeIcon icon={props.icon} size='2x'/></motion.span>
    </motion.div></Tooltip>)
}

const ChampBlock = (props)=> {
    return (
        <motion.div className='characterVisualizer' onClick={()=>{props.matchRoom.send('selectChar', props.id)}}>
            <motion.div className='characterIcon'>
                <img src={CharAssets[props.id].icon}/>
            </motion.div>
            <motion.div className='characterName'>
                {props.id}
            </motion.div>
        </motion.div>
    )
}

const ChampFilter = (props)=> {
    let isFind = true;
    let listLength = 0;
    let list = props.champsList.map((v, i)=>{
        if(props.searchClass != ''){
            if(v.mainClass != props.searchClass) return;
        }
        if(props.searchName != ''){
            if((v.id.toLowerCase().includes(props.searchName.toLowerCase())) == false) return;
        }
        
        let haveChamp = false;
        props.user.characters.map((x, y)=>{
            if(x.id == v.id) haveChamp = true;
        });
        if(!haveChamp) return;

        listLength++;
        return <ChampBlock id={v.id} key={i} matchRoom={props.matchRoom}/>
    })

    if((props.searchName != '' || props.searchClass != '') && listLength == 0) isFind = false;

    return (
        <AnimatePresence>
            {(listLength == 0)?
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} style={{position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {
                  (isFind == true)?
                  <CircularProgress color='primary' />:
                  <motion.div style={{color: '#fff', fontWeight: 'bold'}}>Não foi encontrado nenhuma personagem.</motion.div>
                }
            </motion.div>:<motion.span initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>{list}</motion.span>}
        </AnimatePresence>
    )
}

const ChampTimer = (props)=> {
    const timerControl = useAnimation();
    let listener;

    React.useEffect(()=>{
        listener = props.matchState.listen('selectTime', ()=>{
            timerControl.start({
                scale: (props.matchState.selectTime <= 10)?[1, 1.15, 1]:[1, 1.3, 1]
            })
        });
        return ()=>{
            listener();
        }
    });

    return (
        <motion.div className='characterSelectTimer'>
            <motion.div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '20px', letterSpacing: '3px'}}>
                {
                    (props.matchState.selectReady)?
                    'PARTIDA PRONTA PARA COMEÇAR':
                    (props.thisUser.locked)?
                    'HORA DE SE PREPARAR':
                    'ESCOLHA SEU PERSONAGEM'
                }
            </motion.div>
            <motion.span transition={{ease: 'easeInOut', duration: 0.18}} animate={timerControl} style={{color: (props.matchState.selectTime <= 10 && !props.matchState.selectReady)?'#fc7e7e':'#fff'}}>{props.matchState.selectTime}</motion.span>
        </motion.div>
    )
}

// Visualizador de Skin
const ChampSkinList = (props)=> {
    var skinList = props.champSkins.map((v, i)=>{
        return <motion.div key={i} onClick={()=>{props.matchRoom.send('selectSkin', v)}} className='skinBox' style={{border: (props.userSelection.skin == v)?'2px solid white':'none'}}>
            <img src={CharAssets[props.champ][v].splash} style={{width: '100%', height: '100%', objectFit: 'cover'}} draggable='false'/>
        </motion.div>
    })

    return (
        <Scrollbar 
                            noScrollY
                            style={{
                                width: '650px',
                                height: '80px',
                                background: 'rgba(0, 0, 0, 0.4)',
                                borderRadius: '10px',
                                marginTop: '10px',
                                marginBottom: '-70px',
                                overflow: 'hidden'
                            }}
                            thumbYProps={{
                                renderer: props => {
                                    let thumbStyle = {
                                        background: 'rgba(0, 0, 0, 0.555)'
                                    }
                                    const { elementRef, style, ...restProps } = props;
                                    return <div {...restProps} ref={elementRef} style={{ ...style, ...thumbStyle }}/>;
                                }
                            }}
                            trackYProps={{
                                renderer: props => {
                                    let thumbStyle = {
                                        background: 'rgba(255, 255, 255, 0)'
                                    }
                                    const { elementRef, style, ...restProps } = props;
                                    return <div {...restProps} ref={elementRef} style={{ ...style, ...thumbStyle }}/>;
                                }
                            }}
                        >
                            {skinList}
                        </Scrollbar>
    )
}

// Visualizadores de Campeão
const ChampTeamVisualizer = (props)=> {  
    var teamArray = props.matchState['team'+props.team].toArray();
    let visualizer = teamArray.map((v, i)=>{
        var u_ = props.matchState.playerMatch.get(v);
        if(u_ == undefined) {
            return (<motion.div key={i}></motion.div>)
        }
        return (
            <motion.div className='characterTeamVisualizerObj' key={i} animate={{x: (u_.locked)?-10:25}} transition={{ease: 'easeInOut', duration: 0.025}}>
                <motion.div className='characterTeamVisualizerImage'>
                    {
                        (u_.character != '')?<img src={CharAssets[u_.character].icon}/>:<img src={iconCouncil} />
                    }
                </motion.div>
                <motion.div className='characterTeamVisualizerInfo'>
                    <motion.div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: (u_.id == props.thisUserId)?'#ffeeb3':'white', fontSize: '16.5px'}}>{u_.nickName}</motion.div>
                    {(u_.character != '')?<motion.div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2px', color: 'white', fontSize: '14px'}}>{u_.character}</motion.div>:undefined}
                </motion.div>
            </motion.div>
        )
    });
    
    return (
        <motion.div className='characterTeamVisualizer'>
            {visualizer}
        </motion.div>
    )
}

const ChampOpsTeamVisualizer = (props)=> {
    var teamArray = props.matchState['team'+props.team].toArray();

    var visualizer = teamArray.map((v, i)=>{
        var u_ = props.matchState.playerMatch.get(v);
        if(u_ == undefined) {
            return (<motion.div key={i}></motion.div>)
        }
        return (
            <motion.div className='characterOpsTeamVisualizerObj' key={i} animate={{x: (u_.locked)?10:-25}} transition={{ease: 'easeInOut', duration: 0.025}}>
                <motion.div className='characterOpsTeamVisualizerInfo'>
                    <motion.div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: 'white', fontSize: '16.5px'}}>{`Rival ${i+1}`}</motion.div>
                    <motion.div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2px', color: 'white', fontSize: '14px'}}>{
                        (props.matchState.selectReady)?u_.character:''
                    }</motion.div>
                </motion.div>
                <motion.div className='characterOpsTeamVisualizerImage'>
                    {
                        (u_.character != '' && props.matchState.selectReady)?<img src={CharAssets[u_.character].icon}/>:<img src={iconCouncil} />
                    }
                </motion.div>
            </motion.div>
        )
    });

    return (
        <motion.div className='characterOpsTeamVisualizer'>
            {visualizer}
        </motion.div>
    )
}

const Chat = React.forwardRef((props, ref)=> {
    return (
        <motion.div className='characterSelectChatBox'>
            <Scrollbar
                ref={ref}
                noScrollX
                style={{
                    width: '270px',
                    height: '175px',
                    position: 'relative',
                    zIndex: 1,
                }}
                thumbYProps={{
                    renderer: props => {
                        let thumbStyle = {
                            background: 'rgba(255, 255, 255, 0.3)'
                        }
                        const { elementRef, style, ...restProps } = props;
                        return <div {...restProps} ref={elementRef} style={{ ...style, ...thumbStyle }}/>;
                    }
                }}
                trackYProps={{
                    renderer: props => {
                        let thumbStyle = {
                            background: 'rgba(255, 255, 255, 0)'
                        }
                        const { elementRef, style, ...restProps } = props;
                        return <div {...restProps} ref={elementRef} style={{ ...style, ...thumbStyle }}/>;
                    }
                }}
                contentProps={{
                    renderer: props => {
                        let thumbStyle = {
                            display: 'flex',
                            flexFlow: 'column',
                        }
                        const { elementRef, style, ...restProps } = props;
                        return <div {...restProps} ref={elementRef} style={{ ...style, ...thumbStyle }}/>;
                    }
                }}
                
            > 

                {
                    props.chat.map((v, i)=>{
                        return (
                            <motion.div className='characterSelectChatElement' key={i}>
                                <span style={{color: (v.autor != props.thisUser.nickName)?'#a1adff':'#fff8b8', marginRight: '4px', fontWeight: 'bold'}}>{v.autor}</span>
                                {v.message}
                            </motion.div>
                        )
                    })
                }
                
            </Scrollbar>
            <TextField 
                type='text' 
                inputProps={{maxLength: '60'}}
                onKeyPress={(event)=>{if(event.key == 'Enter') {props.sendMessage();}}}
                onChange={(e)=>{props.changeMessage(e.target.value)}}
                className='characterSelectChatInput'
                style={{
                    zIndex: 1,
                }}
                variant='outlined'
                value={props.message}
                margin='dense'
            />
        </motion.div>
    )
});

export default class LoggedCharacterSelect extends React.Component {
    constructor(props){
        super(props);

        this.mount = null;
        this.state = {
            searchName: '',
            searchClass: '',
            chat: [],
            chatMessage: '',
        }
        
        this.userSelection = this.props.UserContext.matchRoom.state.playerMatch.get(this.props.UserContext.userId);

        this.champsList = [];
        this.chatScroll = null;
        
        this.props.UserContext.matchRoom.state.characters.forEach((val, ind)=>{
            this.champsList.push(val);
        }); 
    }

    componentDidMount(){
        this.mount = true;

        this.chatListener = this.props.UserContext.matchRoom.onMessage('SelectChat', (data)=>{
            if(this.mount && this.chatScroll != null){
                let scrollTop = this.chatScroll.scrollTop;
                let scrollHeight = this.chatScroll.scrollHeight;
                this.state.chat.push(data);
                this.forceUpdate();
                if((scrollTop + 175)/scrollHeight >= 1) this.chatScroll.scrollToBottom();
            }
        })
    }
    componentWillUnmount(){
        this.mount = false;
        this.chatListener();
    }

    render(){
        return (
            <motion.div className='characterSelectMain' initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <motion.div style={{position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%'}}>
                    <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src={characterBackground}/>
                </motion.div>

                {   
                    (this.userSelection.locked)?<motion.div style={{position: 'absolute', top: '0px', left: '0px', width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexFlow: 'column'}}>
                        <motion.div style={{position: 'relative', borderRadius: '50px', boxShadow: '0px 0px 20px rgba(0,0,0,0.5)', width: '770px', height: '450px', overflow: 'hidden'}}>
                            <img style={{objectFit: 'cover', width: '100%', height: '100%'}} src={CharAssets[this.userSelection.character][this.userSelection.skin].splash}/>
                            <motion.div style={{position: 'absolute', bottom: '0px', left: '0px', width: '100%', height: '40px', borderBottomLeftRadius: '50px', borderBottomRightRadius: '50px', backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <p style={{color: 'white', fontWeight: 'bold', letterSpacing: '3px'}}>{`${this.userSelection.character} ${this.userSelection.skin.split('_').join(' ')}`}</p>
                            </motion.div>
                        </motion.div>
                        <ChampSkinList matchRoom={this.props.UserContext.matchRoom} userSelection={this.userSelection} champ={this.userSelection.character} champSkins={this.champsList.find((v)=>{ return v.id == this.userSelection.character}).skins.toArray()}/>
                    </motion.div>:undefined
                }
                
                
                <ChampTimer thisUser={this.userSelection} matchState={this.props.UserContext.matchRoom.state} />

                <Chat ref={n => this.chatScroll = n} thisUser={this.props.UserContext.user} sendMessage={()=>{if(this.state.chatMessage.length != 0 && this.state.chatMessage != '' && this.mount){this.props.UserContext.matchRoom.send('SelectChat', this.state.chatMessage); this.setState({chatMessage: ''})}}} changeMessage={(m)=>{this.setState({chatMessage: m})}} message={this.state.chatMessage} chat={this.state.chat} matchRoom={this.props.UserContext.matchRoom}/>
                <ChampTeamVisualizer lobbyRoom={this.props.UserContext.lobbyRoom} matchRoom={this.props.UserContext.matchRoom} thisUserId={this.props.UserContext.userId} matchState={this.props.UserContext.matchRoom.state} team={this.userSelection.team}/>
                {/* Janela de seleção de personagem */}
                {
                    (this.userSelection.locked == false)?
                    <motion.div className='characterSelectBox'>
                        <motion.div className='characterSelectBar'>
                            <CharacterSelectElement current={this.state.searchClass} id={'Todo'} icon={faBars} onClick={()=>{this.setState({searchClass: ''})}}/>
                            <CharacterSelectElement current={this.state.searchClass} id={'Mago'} icon={faBookOpen} onClick={()=>{this.setState({searchClass: 'Mago'})}}/>
                            <CharacterSelectElement current={this.state.searchClass} id={'Duelista'} icon={faKhanda} onClick={()=>{this.setState({searchClass: 'Duelista'})}}/>
                            <CharacterSelectElement current={this.state.searchClass} id={'Tanque'} icon={faShieldAlt} onClick={()=>{this.setState({searchClass: 'Tanque'})}}/>
                            <CharacterSelectElement current={this.state.searchClass} id={'Suporte'} icon={faJedi} onClick={()=>{this.setState({searchClass: 'Suporte'})}}/>
                            <motion.div className='characterSelectElement' style={{flex: 4}}>
                                <TextField 
                                    type='text' 
                                    label='Pesquisar'
                                    onChange={(e)=>{if(this.mount) this.setState({searchName: e.target.value})}}
                                    inputProps={{maxLength: '15'}}
                                    style={{
                                        fontWeight: 'bold', 
                                        fontSize: '15px', 
                                        width: '100%'
                                    }}
                                    variant='outlined'
                                />
                            </motion.div>
                        </motion.div>
                        <Scrollbar 
                            noScrollX
                            style={{
                                width: '700px',
                                height: '485px',
                                boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.4)',
                                background: 'rgba(0, 0, 0, 0.4)',
                                marginBottom: '20px',
    
                                position: 'relative',
                            }}
                            thumbYProps={{
                                renderer: props => {
                                    let thumbStyle = {
                                        background: 'rgba(0, 0, 0, 0.555)'
                                    }
                                    const { elementRef, style, ...restProps } = props;
                                    return <div {...restProps} ref={elementRef} style={{ ...style, ...thumbStyle }}/>;
                                }
                            }}
                            trackYProps={{
                                renderer: props => {
                                    let thumbStyle = {
                                        background: 'rgba(255, 255, 255, 0)'
                                    }
                                    const { elementRef, style, ...restProps } = props;
                                    return <div {...restProps} ref={elementRef} style={{ ...style, ...thumbStyle }}/>;
                                }
                            }}
                        >
                            <ChampFilter user={this.props.UserContext.user} matchRoom={this.props.UserContext.matchRoom} champsList={this.champsList} searchClass={this.state.searchClass} searchName={this.state.searchName}/>
                        </Scrollbar>
                        <Button onClick={()=>{this.props.UserContext.matchRoom.send('lockChar', '')}} disabled={(this.userSelection.character == '')?true:false} color='primary' variant='contained' style={{width: '200px', position: 'absolute', bottom: '6px'}}>Selecionar</Button>
                    </motion.div>
                    :
                    <motion.div></motion.div>
                }
                <ChampOpsTeamVisualizer lobbyRoom={this.props.UserContext.lobbyRoom} matchRoom={this.props.UserContext.matchRoom} matchState={this.props.UserContext.matchRoom.state} team={(this.userSelection.team == 'A')?'B':'A'}/>
                

            </motion.div>
        )
    }
}
/////////////// Aplicação constituída de um NavBar e um MainBar
import React from 'react';

// Material UI
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// Criação de Tema
const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#fff',
        },
        secondary: {
            main: '#2e2e2e',
        },
      },
});

// Módulos Principais
import NavBar from './defaultComponents/navBar/navBar';
import MainBar from './defaultComponents/mainBar/mainBar';

//////////////////////////////////////////////

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            optionMenu: false,
            toggleOptionMenu: ()=>{
                if(this.state.optionMenu) this.setState({optionMenu: false});
                else this.setState({optionMenu: true});
            }
        }
    }

    render(){
        return (
            <React.Fragment>
                <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <NavBar ToggleOptionMenu={this.state.toggleOptionMenu}/>
                    <MainBar ToggleOptionMenu={this.state.toggleOptionMenu} OptionMenuState={this.state.optionMenu}/>
                </ThemeProvider>
            </React.Fragment>
        );
    }
}

export default App;

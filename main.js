///////////////////////////////////////////////////////////// Electron | Janela
const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

let isDev = false;
if ( process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') { isDev = true }

// VERSÃO
global.version = 'v1.0.3';

// Função que cria a janela
function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
        height: 720,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        resizable: false,   
        fullscreenable: false,
        show: false,
        backgroundColor: '#383838'
	})

    //Garantir que apenas 1 instância do aplicativo será aberta por vez.
    // const gotTheLock = app.requestSingleInstanceLock();
    // if(!gotTheLock){
    //     return app.quit();
    // } else {
    //     app.on('second-instance', (event, commandLine, workingDirectory)=>{
    //         if(mainWindow){
    //             if (mainWindow.isMinimized()) mainWindow.restore();
    //             mainWindow.focus()
    //         }
    //     });
    // }

    // Definir trajetório de busca do Electron (Diretório)
    // Isso define o acesso do cliente e do jogo.
	let indexPath;
	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		indexPath = url.format({
			protocol: 'http:',
			host: 'localhost:8080',
			pathname: 'index.html',
			slashes: true,
		})
	} else {
		indexPath = url.format({
			protocol: 'file:',
			pathname: path.join(__dirname, 'dist', 'index.html'),
			slashes: true,
		})
	}

    // Carregar URL
	mainWindow.loadURL(indexPath);    

    // Qualquer link será redirecionado para o navegador.
    mainWindow.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });

    // Mostrar a tela
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
        mainWindow.webContents.openDevTools();
	});

    // Limpar varíavel quando fechado.
	mainWindow.on('closed', () => ( mainWindow = null ));

    // Requisição de Client Colyseus
    const colyseus = require('colyseus.js');
    global.client = new colyseus.Client('ws://localhost:21238');
 
    // Declaração de globais.
    if(__dirname.endsWith('app.asar')) global.mainDir = __dirname.replace('app.asar', '');
    else if(!__dirname.endsWith(String.fromCharCode('U+005C'))) global.mainDir = __dirname + '/';
    else global.mainDir = __dirname;
    global.baseUrl = 'http://localhost:21238';
    global.accessKey = 'aXmsaKsoaPw9192_CClsoKWmLx,lSkWPeo´qpLSOjpOMXpoaJspoJXpasmOPWempaSOdmPSOd__dsapiPWO())';
    global.mainWindow = mainWindow;
}

///////////// Outras funções

app.on('ready', createMainWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') { app.quit() };
})
app.on('activate', () => {
	if (mainWindow === null) { createMainWindow() }
})

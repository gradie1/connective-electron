const { app , BrowserWindow} = require("electron");

let win;

function createWindow(){

    win = new BrowserWindow({
        width:1000,
        height:700,
        minWidth: 1000,
        minHeight:600,
        backgroundColor:"#fff",
        icon:`file://${__dirname}/src/assets/img/iconEl.png`
    });
    

    win.loadURL(`file://${__dirname}/dist/angular-electron/index.html`);

    //win.webContents.openDevTools();

    win.on('close', function(){
        win = null;
    });

}

app.on('ready',createWindow);

app.on('window-all-closed',function(){

    if(process.platform !== 'darwin'){
        app.quit();
    }

});

app.on('activate',function(){

    if(win === null){
        createWindow();
    }

});
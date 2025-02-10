const { app, dialog, BrowserWindow, Menu, screen } = require("electron");
const keytar = require("keytar");
const path = require("path");

// Set enviroment to developement
process.env.NODE_ENV = "production";
// Desiable Warning in Chrome DevTools
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

app.on("ready", () => {
  Menu.setApplicationMenu(null);
  let keyValue = keytar.getPassword("xd", "gx-id");
  app.setName("Tabshoura");

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // create main browser window
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "icon.png"),
    titleBarStyle: "default",
    show: false,
    webPreferences: { nodeIntegration: true },
  });

  // create activation window
  activation = new BrowserWindow({
    show: false,
    height: 200,
    frame: true,
    resizable: false,
    movable: false,
    backgroundColor: "#ffffff",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  //

  // check if the app is activate or not
  keyValue.then((result) => {
    if (result === null) {
      console.log(` We are sorry, but it seems you need to upgrade your OS! If you upgraded your
    OS and still have the problem, please contact us at: info@thaki.org`);
      activation.loadURL(`file://${__dirname}/updateos.html`);
      activation.show();
    } else {
      mainWindow.loadURL(`file://${__dirname}/app/index.html`);
      mainWindow.setMovable(false);
      mainWindow.show();
      mainWindow.setBounds({ x: 0, y: 0, width: width, height: height });
      mainWindow.setResizable(false);
      mainWindow.setSize(width, height);
      mainWindow.center();
      mainWindow.setMenu(null);
    }
    keyValue.catch((err) => console.log(err));
  });

  activation.on("closed", () => {
    app.quit();
  });

  mainWindow.on("closed", () => {
    app.quit();
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

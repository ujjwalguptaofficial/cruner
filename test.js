var os = require('os');
var pty = require('node-pty');

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    // cols: 0,
    // rows: 0,
    cwd: process.env.HOME,
    env: process.env,
    handleFlowControl: true
});

ptyProcess.on('data', function (data) {
    process.stdout.write(data);
    console.log("data", data);
});

// ptyProcess.on("")

// ptyProcess.write('ls\r');
ptyProcess.resize(100, 40);
// ptyProcess.write('ls\r');
// ptyProcess.write('ls');
ptyProcess.write('sudo kill -9 `sudo lsof -t -i:5000`\r');
ptyProcess.write('d\r')

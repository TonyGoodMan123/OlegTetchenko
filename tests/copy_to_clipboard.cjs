const fs = require('fs');
const { spawn } = require('child_process');

const content = fs.readFileSync('google-apps-script/Code.gs', 'utf8');

const ps = spawn('powershell', ['-NoProfile', '-Command', '[Console]::Input.ReadToEnd() | Set-Clipboard'], {
  stdio: ['pipe', 'inherit', 'inherit']
});

ps.stdin.write(content, 'utf8');
ps.stdin.end();

ps.on('close', (code) => {
  console.log('Clipboard updated! Code.gs is in Windows clipboard (Ctrl+V ready). Exit code:', code);
});

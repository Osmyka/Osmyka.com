/**
 * Osmyka Interactive Terminal Simulation
 */
function runTerminalCommand(cmd) {
    const output = document.getElementById('terminal-output');
    if (!output) return;

    const row = document.createElement('div');
    row.className = 'text-white font-bold';
    row.innerText = `> ${cmd}`;
    output.appendChild(row);

    const res = document.createElement('div');
    res.className = 'text-cyan-400 pl-3 border-l-2 border-cyan-500 my-0.5';

    if (cmd.includes('--warp')) {
        triggerWarpSpeed();
        res.innerText = '[OK] WARP SPEED ENGAGED — VELOCITY 8.4X';
    } else if (cmd.includes('cluster')) {
        res.innerText = '[SUCCESS] CLUSTER TOPOLOGY SYNCHRONIZED ACROSS 128 NODES (0.018ms)';
    } else if (cmd.includes('help')) {
        res.innerText = 'AVAILABLE COMMANDS: osmyka --warp, osmyka cluster, osmyka status, clear';
    } else {
        res.innerText = `[SUCCESS] ${cmd} EXECUTED VIA WASM MICROKERNEL (0.02ms)`;
    }

    output.appendChild(res);
    const body = document.getElementById('terminal-body');
    if (body) {
        body.scrollTop = body.scrollHeight;
    }
}

function clearTerminal() {
    const output = document.getElementById('terminal-output');
    if (output) {
        output.innerHTML = '';
    }
}

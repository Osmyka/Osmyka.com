/**
 * Osmyka Main App Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D Cosmos
    if (typeof initThreeCosmos === 'function') {
        initThreeCosmos();
    }
    if (typeof animateThree === 'function') {
        animateThree();
    }

    // Initialize 2D Physics Lab
    if (typeof initMatterPhysics === 'function') {
        initMatterPhysics();
    }

    // Interactive Terminal Enter Key Support
    const terminalInput = document.getElementById('terminal-cli-input');
    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && terminalInput.value.trim() !== '') {
                const val = terminalInput.value.trim();
                runTerminalCommand(val);
                playAudio('click');
                terminalInput.value = '';
            }
        });
    }

    console.log('%c OSMYKA NEURAL RUNTIME INITIALIZED ', 'background: #00f0ff; color: #040711; font-weight: bold; font-size: 14px; border-radius: 4px; padding: 4px 8px;');
});

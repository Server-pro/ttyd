import { Terminal, ITerminalAddon } from 'xterm';

export class MobileSelectAddon implements ITerminalAddon {

    private _terminal: Terminal;

    activate(terminal: Terminal) {
        this._terminal = terminal;
        console.log('testing');
    }

    public dispose() {}
}

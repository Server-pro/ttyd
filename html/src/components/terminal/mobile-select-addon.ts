import { Terminal, ITerminalAddon } from 'xterm';

export class MobileSelectAddon implements ITerminalAddon {

    private _terminal: Terminal;
    private _core;

    activate(terminal: Terminal) {
        this._terminal = terminal;
        console.log('testing');
        this._core = (this._terminal as any)._core;
    }

    public dispose() {}
}

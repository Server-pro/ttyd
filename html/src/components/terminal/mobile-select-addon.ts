import { Terminal, ITerminalAddon } from 'xterm';

export class MobileSelectAddon implements ITerminalAddon {

    private _terminal: Terminal;
    private _core;

    activate(terminal: Terminal) {
        this._terminal = terminal;
        console.log('testing');
        addEventListener('mousedown', ev => {
            console.log('ev.x' + ev.x);
            console.log('ev.y' + ev.y);
            const coords = this._core._mouseService.getCoords(ev, terminal.element, terminal.cols, terminal.rows, false);
            console.log('coords[0] = ' + coords[0]);
            console.log('coords[1] = ' + coords[1]);

            terminal.select(coords[0] - 1, coords[1] - 1, 5);
            document.execCommand('copy');
        });
        this._core = (this._terminal as any)._core;
    }

    public dispose() {}
}

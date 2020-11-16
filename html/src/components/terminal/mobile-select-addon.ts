import { Terminal, ITerminalAddon } from 'xterm';

export class MobileSelectAddon implements ITerminalAddon {

    private _terminal: Terminal;
    private _core;

    activate(terminal: Terminal) {
        this._core = (terminal as any)._core;
        console.log('testing');
        addEventListener('mousedown', ev => {

            console.log('ev.x = ' + ev.x);
            console.log('ev.y = ' + ev.y);
            const coords = this._core._mouseService.getCoords(ev, terminal.element, terminal.cols, terminal.rows, false);
            console.log('coords[0] = ' + coords[0]);
            console.log('coords[1] = ' + coords[1]);

            //if (!navigator.userAgent.match(/ipad|ipod|iphone/i)) return;
            let right = coords[0] - 1;
            console.log('right = ' + right);
            let left = coords[0] - 1;
            console.log('left = ' + left);
            const row = coords[1] - 1;
            console.log('row = ' + row);

            terminal.select(right, row, 1);
            console.log('char under click = ' + terminal.getSelection());

            if (terminal.getSelection() === ' ') return;

            console.log('not space');

            while (terminal.getSelection() !== ' ') {
                terminal.select(++right, row, 1);
            }

            console.log('right after find = ' + right);

            while (terminal.getSelection() !== ' ' && left > 0) {
                terminal.select(--left, row, 1);
                console.log('checking \'' + terminal.getSelection() + '\' for space');
            }

            console.log('left after find = ' + left);

            return;

            terminal.select(left, row, right - left + 1);

            console.log('selected: ' + terminal.getSelection());

            document.execCommand('copy');
        });
    }

    public dispose() {}
}

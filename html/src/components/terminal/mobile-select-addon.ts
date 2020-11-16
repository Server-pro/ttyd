import { Terminal, ITerminalAddon } from 'xterm';

export class MobileSelectAddon implements ITerminalAddon {

    private _terminal: Terminal;
    private _core: any;

    private _time : number;
    private _doSelect : boolean;

    public activate(terminal: Terminal) {
        this._core = (terminal as any)._core;

        addEventListener('mousedown', ev => {
            const coords = this._core._mouseService.getCoords(ev, terminal.element, terminal.cols, terminal.rows, false);
            coords[0]--;
            coords[1]--;
            this._core._selectionService._selectWordAt(coords, false);

            if (terminal.getSelection() === '') {
                console.log('clicked on null');
                return;
            }

            this._time = ev.timeStamp;
            this._doSelect = true;
        });

        addEventListener('mouseup', ev => {
            console.log('ev.x = ' + ev.x);
            console.log('ev.y = ' + ev.y);
            const coords = this._core._mouseService.getCoords(ev, terminal.element, terminal.cols, terminal.rows, false);
            coords[0]--;
            coords[1]--;
            this._core._selectionService._selectWordAt(coords, false);
            copyToClipboard(terminal.getSelection());
        });
    }
    public dispose() {}
}

//copied from stackoverflow: https://stackoverflow.com/a/53951634
/**
 * Copy a string to clipboard
 * @param  {String} string         The string to be copied to clipboard
 * @return {Boolean}               returns a boolean correspondent to the success of the copy operation.
 */
function copyToClipboard(string) {
    let textarea;

    textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', true);
    textarea.setAttribute('contenteditable', true);
    textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
    textarea.value = string;

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const range = document.createRange();
    range.selectNodeContents(textarea);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    textarea.setSelectionRange(0, textarea.value.length);
    result = document.execCommand('copy');
}

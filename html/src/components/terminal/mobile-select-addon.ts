import { Terminal, ITerminalAddon } from 'xterm';

export class MobileSelectAddon implements ITerminalAddon {

    private _terminal: Terminal;
    private _core;
    private _time;

    activate(terminal: Terminal) {
        this._core = (terminal as any)._core;

        addEventListener('touchend', ev => {
            let heldFor = ev.timeStamp - this._time;
            terminal.writeln("touch registered");

            const item = ev.touches.item(1);
            const X = item.clientX;
            const Y = item.clientY;
            const rawCoords = { X, Y };
            const coords = this._core._mouseService.getCoords(rawCoords);

            this._core._selectionService._selectWordAt(coords, false);
            copyToClipboard(terminal.getSelection());
        });

        addEventListener('touchstart', ev => {
            this._time = ev.timeStamp;
        });

        terminal.onData(ev => {
            if (ev.match('x')) {

                console.log('adding click copy callback');

                addEventListener('mousedown', ev => {

                    console.log('ev.x = ' + ev.x);
                    console.log('ev.y = ' + ev.y);
                    const coords = this._core._mouseService.getCoords(ev, terminal.element, terminal.cols, terminal.rows, false);
                    coords[0]--;
                    coords[1]--;
                    this._core._selectionService._selectWordAt(coords, false);
                    copyToClipboard(terminal.getSelection());
                });
            }
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
    let result;

    try {
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
    } catch (err) {
        console.error(err);
        result = null;
    } finally {
        document.body.removeChild(textarea);
    }

    // manual copy fallback using prompt
    if (!result) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
        result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
        if (!result) {
            return false;
        }
    }
    return true;
}

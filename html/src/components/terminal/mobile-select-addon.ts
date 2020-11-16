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
            const x = coords[0] - 1;
            const y = coords[1] - 1;

            terminal.selectLines(y, y);
            copyToClipboard(terminal.getSelection());

            /*
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

            while (terminal.getSelection() !== ' ' && right < terminal.cols) {
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

            document.execCommand('copy');*/
        });
    }



    public dispose() {}
}

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

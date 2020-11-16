import { Terminal, ITerminalAddon } from 'xterm';
import { OverlayAddon } from './overlay';

export class MobileSelectAddon implements ITerminalAddon {

    private _terminal: Terminal;
    private _overlayAddon: OverlayAddon;
    private _doSelect: boolean;

    //terminal with access to private api
    private _core: any;

    constructor(overlayAddon: OverlayAddon) {
        this._overlayAddon = overlayAddon;
    }

    public activate(terminal: Terminal) {

        //only active for ios users
        if (!navigator.userAgent.match(/ipad|ipod|iphone/i)) return;

        this._terminal = terminal;
        this._core = (terminal as any)._core;

        addEventListener('mousedown', ev => {
            const coords = this._evToCoords(ev);
            this._core._selectionService._selectWordAt(coords, false);

            //return if clicked on space, without this users can't click to type as normal
            if(terminal.getSelection().length === 0) return;

            this._doSelect = true;
        });

        addEventListener('mouseup', ev => {

            if (!this._doSelect) return;

            const coords = this._evToCoords(ev);
            this._core._selectionService._selectWordAt(coords, false);
            this._copyToClipboard(terminal.getSelection());
            this._overlayAddon.showOverlay('✂', 1);
            this._doSelect = false;
        });
    }

    private _evToCoords(ev: MouseEvent) {
        const coords = this._core._mouseService.getCoords(ev, this._terminal.element, this._terminal.cols, this._terminal.rows, false);
        coords[0]--;
        coords[1]--;
        console.log("coords[0] = " + coords[0]);
        console.log("coords[1] = " + coords[1]);
        return coords;
    }

    /**
     * Copied from stackoverflow: https://stackoverflow.com/a/53951634
     * Copy a string to clipboard
     * @param  {String} string         The string to be copied to clipboard
     */
    private _copyToClipboard(string) {
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
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    public dispose() {}
}



import { ITerminalAddon, Terminal } from 'xterm';
import { OverlayAddon } from './overlay';

export class MobileSelectAddon implements ITerminalAddon {

    private _terminal: Terminal;
    private _overlayAddon: OverlayAddon;

    //terminal with access to private api
    private _core: any;

    //flag for whether to select on mouse up
    private _doSelect: boolean;

    //local overlay settings
    private _scissors = '✄';
    private _overlayTimeout = 1000;

    constructor(overlayAddon: OverlayAddon) {
        this._overlayAddon = overlayAddon;
    }

    public activate(terminal: Terminal) {

        //only activate for ios users
        if (!navigator.userAgent.match(/ipad|ipod|iphone/i)) return;

        this._terminal = terminal;
        this._core = (terminal as any)._core;

        addEventListener('mousedown', ev => {

            //use private api to select word at click position
            const coords = this._evToCoords(ev);
            this._core._selectionService._selectWordAt(coords, false);

            //return if clicked on space. this way it won't try to copy every single mouse down
            //without this, users can't start typing - it will try to copy the blank text
            if(terminal.getSelection().length === 0) return;

            //set flag to select word on mouseup
            this._doSelect = true;
        });

        addEventListener('mouseup', ev => {

            //only run callback if select flag is set
            if (!this._doSelect) return;

            const coords = this._evToCoords(ev);

            this._core._selectionService._selectWordAt(coords, false);
            this.copy();

            this._doSelect = false;
        });
    }

    /**
     * Copy the terminal's selected text to clipboard
     */
    public copy() {

        const temp = this._terminal.getSelection();
        console.log("copying: " + temp);
        this._copyToClipboard(temp);
    }

    public paste() {

        var nav = window.navigator;
        //console.log(nav.platform);
        var clip = nav.clipboard;
        //console.log(clip);
        //clip.readText().then(value => console.log(value));
        clip.readText().then(value => this._terminal.paste(value));
    }

    /**
     * Convert a mouse event into a coordinate pair using core's mouse service
     * @param {MouseEvent} ev the mouse event containing the coordinates
     * @returns Returns a number array containing the x and y coordinates, in that order
     */
    private _evToCoords(ev) {

        let coords = this._core._mouseService.getCoords(ev, this._terminal.element, this._terminal.cols, this._terminal.rows, false);
        coords[0]--;
        coords[1]--;
        console.log("coords[0] = " + coords[0]);
        console.log("coords[1] = " + coords[1]);
        return coords;
    }

    // Modified from stackoverflow: https://stackoverflow.com/a/53951634
    /**
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
        this._overlayAddon.showOverlay(this._scissors, this._overlayTimeout); 

        document.body.removeChild(textarea);
    }

    public dispose() {}
}



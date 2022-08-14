'use strict';

const MessageMedia = require('./MessageMedia');
const Util = require('../util/Util');

/**
 * Button spec used in Buttons constructor
 * @typedef {Object} ButtonSpec
 * @property {string=} id - Custom ID to set on the button. A random one will be generated if one is not passed.
 * @property {string} body - The text to show on the button.
 */

/**
 * @typedef {Object} FormattedButtonSpec
 * @property {string} buttonId
 * @property {number} type
 * @property {Object} buttonText
 */

/**
 * Message type buttons
 */
class Buttons {
    /**
     * @param {string|MessageMedia} body
     * @param {ButtonSpec[]} buttons - See {@link ButtonSpec}
     * @param {string?} title
     * @param {string?} footer
     */
    constructor(body, buttons, title, footer) {
        /**
         * Message body
         * @type {string|MessageMedia}
         */
        this.body = body;

        /**
         * title of message
         * @type {string}
         */
        this.title = title;
        
        /**
         * footer of message
         * @type {string}
         */
        this.footer = footer;

        if (body instanceof MessageMedia) {
            this.type = 'media';
            this.title = '';
        }else{
            this.type = 'chat';
        }

        /**
         * buttons of message
         * @type {FormattedButtonSpec[]}
         */
        this.buttons = this._format(buttons);
        if(!this.buttons.length){ throw '[BT01] No buttons';}
                
    }

    /**
     * Creates button array from simple array
     * @param {ButtonSpec[]} buttons
     * @returns {FormattedButtonSpec[]}
     * @example 
     * Input: [{id:'customId',body:'button1'},{body:'button2'},{body:'button3'},{body:'button4'}]
     * Returns: [{ buttonId:'customId',buttonText:{'displayText':'button1'},type: 1 },{buttonId:'n3XKsL',buttonText:{'displayText':'button2'},type:1},{buttonId:'NDJk0a',buttonText:{'displayText':'button3'},type:1}]
     */
    _format(buttons){
        // phone users can only see 3 regular buttons (not url or phone) and 2 especial buttons, so lets limit this
        const especialButtons = buttons.filter(button => button.url || button.number).slice(0,2);
        const regularButtons = buttons.filter(button => !button.url && !button.number).slice(0,3);
        buttons = especialButtons.concat(regularButtons);

        return buttons.map((btn) => {
            if (btn.url && btn.number) throw 'button can\'t be with url and number together';
            return {
                buttonId: btn.id ? String(btn.id) : Util.generateHash(6),
                url: btn.url,
                phoneNumber: btn.number,
                buttonText: btn.body,
                type: 1
            };
        });
    }
    
}

module.exports = Buttons;

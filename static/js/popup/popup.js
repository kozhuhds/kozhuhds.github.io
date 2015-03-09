/**
 *
 * @param opts
 * opts.id - id of element which should to add to popup,
 * opts.onOpen - on open popup event,
 * opts.onSave - on click save and close
 * opts.onRemove - event when click close btn
 * @constructor
 */
function Popup (opts) {
    this.elem = document.getElementById(opts.id);
    this.cb = opts.onOpen;
    this.onSave = opts.onSave;
    this.onRemove = opts.onRemove;

    this.init();

}

/**
 * Init click events for save and close btn
 */
Popup.prototype.init = function () {
    var self = this;
    app.getPartial('static/js/popup/popup.html', function (e) {
        var div = document.createElement('div');

        div.innerHTML = e.target.getResponse();

        self.popup = div.firstChild;

        self.elem.style.display = 'block';
        self.popup.querySelectorAll('.popup-window')[0].appendChild(self.elem);

        self.popup.querySelectorAll('.popup-window__close-btn')[0].onclick = function () {
            self.remove();
        };

        self.popup.querySelectorAll('#popup-window__save-btn')[0].onclick = function () {
            self.onSave && self.onSave();
            self.remove();
        };

        self.show();
    });
};

/**
 * Method to show popup
 */
Popup.prototype.show = function () {
    //document.body.innerHTML += this.popup.outerHTML;
    document.body.appendChild(this.popup);
    this.cb();
};

/**
 * Method to remove popup
 */
Popup.prototype.remove = function () {
    this.onRemove && this.onRemove(this.elem);

    this.elem.style.display = 'none';

    document.body.appendChild(this.elem);
    document.body.removeChild(this.popup);
};

/**
 * Created by kozhuhds on 11/17/14.
 */
var gtd = gtd || {};

gtd.popup = function (opts) {
    this.$btn = opts.$btn;
    this.closeBtn = opts.closeBtn;
    this.$popup = opts.$popup;
    this.events = opts.events;
};

gtd.popup.prototype = {
    init : function () {
        var self = this;

        this.$popup.insertAfter(this.$btn);
        this.events(this.$popup);

        this.$btn.on('click', function () {
            self.$popup.fadeIn();
        });

        this.$popup.on('click', this.closeBtn, function () {
            self.$popup.fadeOut();
        });
    }
};
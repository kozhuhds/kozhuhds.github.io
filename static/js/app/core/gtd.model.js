/**
 * Created by kozhuhds on 11/18/14.
 */

var gtd = gtd || {};

gtd.Model = function ( view ) {
    this.view = view;
};

gtd.Model.prototype = {
    set: function ( key, val ) {
        this[key] = val;
        this.view.render();
    },
    get: function ( key ) {
        return this[key];
    }
};
//goog.provide('bprocess.app');
//
//goog.require('goog.dom');
//goog.require('goog.style');
goog.require('goog.net.XhrIo');

/**
 * Main app module
 */
var app = (function () {
    /*------------------- private -----------------------*/
    var S, area, shapes = [];

    var Init = {
        events: function () {

        }
    };

    /* --------------------- public ------------------------*/

    /**
     *  Method to get partial html
     * @param url {string}
     * @param cb {function}
     */
    var getPartial = function (url, cb) {
        goog.net.XhrIo.send(url, cb, 'GET');
    };

    /**
     *
     * @param b1 {object}
     * @param b2 {object}
     * @returns {boolean}
     */
    var checkIntersect = function (b1, b2) {
        return (b1.x >= b2.x && b1.x <= b2.x2 || b1.x2 >= b2.x && b1.x2 <= b2.x2)
            && (b1.y >= b2.y && b1.y <= b2.y2 || b1.y2 >= b2.y && b1.y2 <= b2.y2);
    };

    /**
     * Push object to array if that object don't contains in this array
     * @param array {array}
     * @param elem
     */
    var pushIfNotExist = function (array, elem) {
        if(array.indexOf(elem) === -1){
            array.push(elem);
        }
    };


    /**
     * Init app
     * @param canvas_id {string}
     */
    var initModule = function (canvas_id) {
        S = Snap();

        area = S.rect(0, 0, 1200, 700).attr({
            fill: "white"
        });

        ui.initModule(S, area);



        Init.events();
    };



    return {
        initModule: initModule,
        getPartial: getPartial,
        checkIntersect: checkIntersect,
        pushIfNotExist: pushIfNotExist
    }
})();
/**
 * Created by kozhuhds on 11/17/14.
 */

var gtd = gtd || {};

gtd.app = {
    views: {}
};

$(document).ready(function () {
    _.each(gtd.app.views, function (view) {
        view.init();
    });
});

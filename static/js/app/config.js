/**
 * Created by kozhuhds on 11/19/14.
 */


_.templateSettings = {
    evaluate:    /\{\{(.+?)\}\}/g,
    interpolate: /\{\{=(.+?)\}\}/g,
    escape:      /\{\{-(.+?)\}\}/g
};

function generateID() {
    var d = new Date();
    return d.getTime() + '_' + Math.floor(Math.random() * 1001);
}
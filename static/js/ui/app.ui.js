/**
 * Created by kozhuhds on 1/30/15.
 */

goog.require('goog.net.XhrIo');

/**
 * UI module for init and render all app parts
 */
var ui = (function () {

    /*--------------------------- private -----------------------*/

    var S, paper, leftMenu, phblocks = [], contextMenu, selections, circles = [];

    /**
     * Hide submenu of phony blocks
     * @private
     */
    var hideSubmenu = function () {
        var allSubmenu = Array.prototype.slice.call(document.querySelectorAll('.left-menu-sub'));
        allSubmenu.forEach(function (menu) {
            menu.removeAttribute('style');
        });

        var leftMenuItems = Array.prototype.slice.call(document.querySelectorAll('.left-menu li'));

        leftMenuItems.forEach(function (item) {
            item.classList.remove('active');
        });
    };

    /**
     * Object for init some functional
     * @type {{events: Function, elements: Function}}
     */
    var Init = {
        /**
         * Init selection events
         * @private
         */
        events: function () {
            var box;
            selections = S.group();

            function dragstart (x, y, event) {
                box = S.rect(x, y, 0, 0).attr({
                    stroke: "#9999FF",
                    fill: "none"
                });
                hideSubmenu();
            }

            function dragmove (dx, dy, x, y, event) {
                var xoffset = 0,
                    yoffset = 0;
                if (dx < 0) {
                    xoffset = dx;
                    dx = -1 * dx;
                }
                if (dy < 0) {
                    yoffset = dy;
                    dy = -1 * dy;
                }
                box.transform("T" + xoffset + "," + yoffset);
                box.attr("width", dx);
                box.attr("height", dy);
            }



            function dragend () {
                var bounds = box.getBBox();
                box.remove();
                reset();
                phblocks.forEach(function (bl) {
                    bl.elements.forEach(function (el) {
                        var mybounds = el.getBBox();
                        if ( app.checkIntersect(mybounds, bounds) ) {
                            selections.add(el);
                            el.undrag();
                        }
                    });
                });
                selections.attr("opacity", 0.5);

                var move = function (dx, dy) {
                    this.attr({
                        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
                    });
                };

                var start = function () {
                    this.data('origTransform', this.transform().local);
                };

                var stop = function (e) {
                };
                selections.drag(move, start, stop);
                if (selections.node.childElementCount) {
                    contextMenu.attr('display', '');
                    contextMenu.node.parentElement.appendChild(contextMenu.node);

                }
            }

            function reset () {
                selections.attr("opacity", 1);
                var objInSelection = selections.node.childElementCount;
                for(var i=0; i < objInSelection; i++){
                    //selections[0].drag(selections[0].dragEvents.itemMove, selections[0].dragEvents.itemStart, selections[0].dragEvents.itemStop);
                    selections[0].attr({
                        transform: selections[0].transform().global
                    });
                    selections.after(selections[0]);
                }
                selections.remove();
                contextMenu && contextMenu.attr('display', 'none');
                selections = S.group();

                phblocks.forEach(function (bl) {
                    bl.bindDragOnElements();
                });
            }

            paper.drag(dragmove, dragstart, dragend);

            paper.click(reset);

            var addCircleHandler = function (e) {
                app.getPartial('static/js/circle/circle.html', function (ev) {
                    var circle = new Circle({
                        S: S,
                        x: e.clientX,
                        y: e.clientY,
                        template: ev.target.getResponse(),
                        paper: paper
                    });
                    circles.push(circle);

                    if (circles.length >= 2) {
                        //connections.push(S.connection(shapes[shapes.length-1].shape,shapes[shapes.length-2].shape, "#5178fb"));
                        circles[circles.length-1].setConnection(circles[circles.length-2]);
                    }
                });
            };

            //paper.click(addCircleHandler);

        },

        /**
         * Load and render parts of app
         */
        elements: function () {
            app.getPartial('static/js/context-menu/context-menu-phblocks.html', function (e) {
                contextMenu = S.group().append(Snap.parse(e.target.getResponse()));
                contextMenu.attr('display', 'none');

                var clear = function () {
                    selections.remove();
                    phblocks.forEach(function (bl) {
                        bl.removeElements(selections);
                    });
                    contextMenu.attr('display','none');
                    selections = S.group();
                };

                contextMenu.select('.group-action').click(function (e) {
                    e.preventDefault();
                    var point = selections[0].transform().global.replace('t','').split(',');
                    app.getPartial('static/js/circle/circle.html', function (ev) {
                        var circle = new Circle({
                            S: S,
                            x: point[0],
                            y: point[1],
                            template: ev.target.getResponse(),
                            elements: selections,
                            paper: paper
                        });
                        Circle.refreshItemsCount(circle.shape);
                        clear();
                    });

                });
                contextMenu.select('.delete-action').click(function (e) {
                    e.preventDefault();
                    clear();
                });
            });

            app.getPartial('static/js/ui/left-menu.html', function (e) {
                var template = Handlebars.compile(e.target.getResponse());

                goog.net.XhrIo.send("data/categories.json", function (ev) {
                    var data = JSON.parse(ev.target.getResponse()),
                        html = template(data);

                    leftMenu = S.group().append(Snap.parse(html));

                    leftMenu.selectAll('.blockly-fake-item').items.forEach(function (item) {
                        var block = new Phblock(S, item);
                        phblocks.push(block);
                    });

                    var sections = leftMenu.selectAll('.left-menu li').items;

                    sections.forEach(function (item) {
                        item.click(function () {
                            hideSubmenu();

                            var submenu = document.querySelector('ul[data-category-id="'+ this.node.dataset.categoryId +'"]');
                            this.node.classList.add('active');
                            submenu.style.display = 'inline-block';
                        });
                    });

                }, 'GET');
                //block.init();
            });


        }
    };

    /*--------------------------------- public -----------------------------------*/

    /**
     * init Blockly and all events and ui parts of app
     * @param snap {object} snap stage
     * @param area {object} rect area for initing events on it
     */
    var initModule = function (snap, area) {
        Blockly.inject(document.getElementById('blocklyDiv'),
            {toolbox: document.getElementById('toolbox')});
        document.getElementById('blocklyDiv').innerHTML = '';

        S = snap;
        paper = area;
        Init.elements();
        Init.events();
    };

    return {
        initModule: initModule
    }
})();
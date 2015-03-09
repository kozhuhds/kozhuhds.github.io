/**
 *
 * @param S snap stage
 * @param shape svg elem
 * @constructor
 */
function Phblock (S, shape) {
    this.shape = shape;
    this.S = S;
    this.elements = [];
    this.bindDragOnElements();

    this.shape.select('.blocklyText').node.setAttribute('style',
        'fill: #000;' +
        'font-size: 13px !important;');


}




/**
 * Init drag and drop events for phony block elements.
 */
Phblock.prototype.bindDragOnElements = function () {
    var that = this,
        dragable;

    var itemStart = function (x, y) {
        this.data('origTransform', this.transform().local);

        if ( !this.attr('initialized') ) {
            dragable = that.S.group().append(Snap.parse(this.node.outerHTML));
            dragable.attr({
                transform: "t" + [x, y]
            });
            dragable.data('origTransform', dragable.transform().local);

        }else{
            //this.node.parentElement.appendChild(this.node);
        }

    };
    var itemStop = function () {
        var self = this.attr('initialized') ? this : dragable;

        if( !this.attr('initialized') ) {
            self.drag(itemMove, itemStart, itemStop);
            that.elements.push(self);
            self.attr('initialized', true);
        }



        self.animate({
            transform: self.transform().toString().replace('s1.1', 's1')
        }, 100);

        var circles = that.S.selectAll('g[type="circle"]').items;
        circles.forEach(function (circle) {

            circle.transform().toString().split('s')[1] == 1.2 && circle.animate({
                transform: circle.transform().toString().replace('s1.2', 's1')
            }, 100);

            circle.select('.circle').node.style.borderColor = '#cccccc';

            if( app.checkIntersect(self.getBBox(), circle.getBBox()) ) {
                self.animate({
                    transform: self.transform().toString().replace('s1.1', 's0.01')
                }, 100, function () {
                    app.pushIfNotExist(circle.elements, self.select('svg').attr('name'));
                    Circle.refreshItemsCount(circle);
                    self.remove();
                });
                return false;
            }
        });

        var leftMenu = that.S.select('#left-menu-svg');
        if( app.checkIntersect(self.getBBox(), leftMenu.getBBox()) ) {
            self.animate({
                transform: self.transform().toString().replace('s1.1', 's0.01')
            }, 100, function () {
                that.removeElements(self);
                self.remove();
            });
            return false;
        }

    };
    var itemMove = function (dx, dy) {

        var self = this.attr('initialized') ? this : dragable;

        self.attr({
            transform: self.data('origTransform') + (self.data('origTransform') ? "T" : "T") + [dx, dy] + "s1.1"
        });


        var circles = that.S.selectAll('g[type="circle"]').items;

        circles.forEach(function (circle) {
            if( app.checkIntersect(self.getBBox(), circle.getBBox()) ) {
                circle.transform().toString().split('s')[1] == 1 && circle.animate({
                    transform: circle.transform().toString().replace('s1', 's1.2')
                }, 100);
                circle.select('.circle').node.style.borderColor = '#1de9b6';
            }else{
                circle.transform().toString().split('s')[1] == 1.2 && circle.animate({
                    transform: circle.transform().toString().replace('s1.2', 's1')
                }, 100);
                circle.select('.circle').node.style.borderColor = '#cccccc';
            }
        });
    };

    this.elements.forEach(function(el) {
        el.undrag();
        el.drag(itemMove, itemStart, itemStop);
    });

    this.shape.undrag();
    this.shape.drag(itemMove, itemStart, itemStop);

};

/**
 * Remove selected Phblock elements
 * @param elems array of instance of Phblock elements
 */
Phblock.prototype.removeElements = function (elems) {
    var self = this;

    if (!elems || !elems[0]) {
        return
    }
    if (elems.node.childElementCount < 2) {
        self.elements = self.elements.filter(function (el) {
            return el.id !== elems[0].id;
        });

    }else{
        for(var i=0; i < elems.node.childElementCount; i++) {
            self.elements = self.elements.filter(function (el) {
                return el.id !== elems[i].id;
            })
        }
    }

};
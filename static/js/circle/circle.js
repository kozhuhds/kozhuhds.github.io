/**
 * Created by kozhuhds on 1/30/15.
 */

/**
 * Draggable circle to display grouped elements
 * @param opts {object}
 * @constructor
 */
function Circle (opts) {
    var self = this;

    this.S = opts.S;
    this.paper = opts.paper;
    this.connections = [];
    this.x = opts.x;
    this.y = opts.y;

    this.shape = opts.S.group().append(Snap.parse(opts.template));
    this.shape.attr('type', 'circle');
    this.shape.instance = this;

    this.shape.elements = [];
    for(var i=0; i < opts.elements.node.childElementCount; i++) {
        //this.pushElem(opts.elements[i].select('svg').attr('name'));
        app.pushIfNotExist(this.shape.elements, opts.elements[i].select('svg').attr('name'));
    }

    this.init();
}

/**
 * Method to refresh count of unique blocks, which contains circle
 * @param circle
 */
Circle.refreshItemsCount = function (circle) {
    circle.select('.circle-items-count').node.innerHTML = circle.elements.length === 1 ?  ' 1 item' : circle.elements.length + ' items';
};

/**
 * Circle initialization. Add drag events.
 */
Circle.prototype.init = function () {
    var x = this.x,
        y = this.y;

    var that = this;

    var circlef = this.shape;

    circlef.transform('t' + [x - circlef.select('#circle-control').node.clientWidth / 2, y - circlef.select('#circle-control').node.clientHeight / 2]);

    circlef.animate({
        transform: circlef.transform() + "s1.1"
    }, 200, function () {
        circlef.animate({
            transform: circlef.transform().toString().replace("s1.1", "s1")
        }, 200);
    });

    that.move = function (dx, dy) {
        this.attr({
            transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy] + "s1.1"
        });
        that.renderConnections();
    };

    that.start = function () {
        console.log('startmove');
        var self = this;
        if (self.attr('animated') === 'true') {
            return false;
        }

        self.node.parentElement.appendChild(self.node);
        this.select('.circle').node.style.borderColor = "#5178fb";
        self.animate({
            transform: self.transform() + "s1.1"
        }, 50);

        self.data('origTransform', this.transform().local);
    };

    that.stop = function (e) {
        console.log('stopdrag');
        var self = this;

        this.select('.circle').node.style.borderColor = "#ccc";

        self.attr('animated', true);

        this.animate({
            transform: self.transform().toString().replace('s1.1', 's1')
        }, 100, function () {
            self.attr('animated', false);
            that.renderConnections();
        });
    };

    circlef.drag(that.move, that.start, that.stop );

    circlef.select('.circle-title').click(function (e) {
        e.target.focus();
    });

    circlef.select('.circle-title').node.onblur = function (e) {
        if(!e.target.innerHTML){
            e.target.innerHTML = "Untitled";
        }
    };

    var expandCircle = function (e) {
        //that.shape.attr('display','none');

        new Popup({
            id:'blocklyDiv',

            onOpen: function () {
                Blockly.inject(document.getElementById('blocklyDiv'),
                    {toolbox: document.getElementById('toolbox')});

                if (that.blocklyPositions) {
                    var xml = Blockly.Xml.textToDom(that.blocklyPositions);
                    Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), xml);
                }
            },

            onSave: function () {
                var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
                that.blocklyPositions = Blockly.Xml.domToText(xml);
            },

            onRemove: function (elem) {
                elem.innerHTML = '';
            }
        });

        var x2js = new X2JS();

        var toolboxJSON = {
            "xml": {
                "_id": "toolbox",
                "_style": "display: none",
                "block": []
            }
        };

        that.shape.elements.forEach(function (block) {
            toolboxJSON["xml"]["block"].push({
                "_type": block
            });
        });

        document.getElementById('toolbox') && document.body.removeChild(document.getElementById('toolbox'));
        document.body.appendChild(x2js.json2xml(toolboxJSON).firstChild);
    };

    var changeBg = function () {
        new Popup({
            id:'changeBgBlock',

            onOpen: function () {

            },

            onSave: function () {
                var value = document.getElementById('circleBgUrl').value;
                value && (that.shape.select('.circle').node.style.backgroundImage = "url('"+value+"')");
            }
        });
    };



    var connectionHandler = function () {
        var circleBox = circlef.getBBox();
        var line = that.S.line(circleBox.x + circleBox.w / 2, circleBox.y + circleBox.h / 2, circleBox.x + circleBox.w / 2, circleBox.y + circleBox.h / 2);
        line.attr({
            "stroke-width": 5,
            stroke: '#ccc'
        });
        circlef.node.parentElement.appendChild(circlef.node);

        var circles = that.S.selectAll('g[type="circle"]').items;

        var resetConnection = function () {
            console.log('reset');
            that.paper.unmousemove();
            that.S.unclick();

            line.remove();

            circles.forEach(function (circle) {
                circle.drag(circle.instance.move, circle.instance.start, circle.instance.stop );
                circle.select('.circle-shadow').node.removeAttribute('style');
                circle.select('.circle-shadow-connect').node.removeAttribute('style');
            });


        };

        circles.forEach(function (circle) {
            circle.undrag();
            circle.select('.circle-shadow').node.style.display = 'none';
            circle.select('.circle-shadow-connect').node.style.display = 'block';

            var connectClickHandler = function (e) {
                e.stopPropagation();
                circle.select('.circle-shadow-connect').node.removeEventListener('click', connectClickHandler);

                if(that !== circle.instance) {
                    Circle.setConnection(that, circle.instance, that.S);
                }
                resetConnection();
            };

            circle.select('.circle-shadow-connect').node.addEventListener('click', connectClickHandler, false);
        });


        that.paper.mousemove(function (ev) {
            line.attr({
                x2: ev.clientX,
                y2: ev.clientY
            });
        });


        that.S.click(function () {
            resetConnection();
        });
    };


    

    var circleHandler = function (e){
        console.log('circleHandler');
        switch (e.target.id){
            case "expand-circle": expandCircle(); break;
            case "change-circle-bg": changeBg(); break;
            case "set-circle-connection": that.stop.call(circlef); connectionHandler(); break;
        }
        e.stopPropagation();
    };

    circlef.mousedown(circleHandler);
};

/**
 * Static method
 * Setting connection between two circles
 * @param circle1 {Circle}
 * @param circle2 {Circle}
 * @param S {Snap}
 */
Circle.setConnection = function (circle1, circle2, S) {
    var hasConnection = false;

    circle1.connections.forEach(function (connection) {
        if((connection.to === circle1.shape && connection.from === circle2.shape) ||
            (connection.to === circle2.shape && connection.from === circle1.shape)) {
            hasConnection = true;
            return false;
        }
    });
    if (!hasConnection){
        var connection = S.connection(circle1.shape, circle2.shape, "#5178fb");
        circle1.connections.push(connection);
        circle2.connections.push(connection);
    }
};



/**
 * Method for re-render connections while circle is dragged
 */
Circle.prototype.renderConnections = function () {
    var self = this;
    this.connections.forEach(function (item) {
        self.S.connection(item);
    });
};
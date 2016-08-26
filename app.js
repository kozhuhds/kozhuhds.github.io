(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define([],b):a.Draggable=b()}(this,function(){"use strict";function a(a,b){var c=this,d=k.bind(c.start,c),e=k.bind(c.drag,c),g=k.bind(c.stop,c);if(!f(a))throw new TypeError("Draggable expects argument 0 to be an Element");k.assign(c,{element:a,handlers:{start:{mousedown:d,touchstart:d},move:{mousemove:e,mouseup:g,touchmove:e,touchend:g}},options:k.assign({},i,b)}),c.initialize()}function b(a){return parseInt(a,10)}function c(a){return"currentStyle"in a?a.currentStyle:getComputedStyle(a)}function d(a){return a instanceof Array}function e(a){return void 0!==a&&null!==a}function f(a){return a instanceof Element||a instanceof HTMLDocument}function g(a){return a instanceof Function}function h(){}var i={grid:0,filterTarget:null,limit:{x:null,y:null},threshold:0,setCursor:!1,setPosition:!0,smoothDrag:!0,useGPU:!0,onDrag:h,onDragStart:h,onDragEnd:h},j={transform:function(){for(var a=" -o- -ms- -moz- -webkit-".split(" "),b=document.body.style,c=a.length;c--;){var d=a[c]+"transform";if(d in b)return d}}()},k={assign:function(){for(var a=arguments[0],b=arguments.length,c=1;b>c;c++){var d=arguments[c];for(var e in d)a[e]=d[e]}return a},bind:function(a,b){return function(){a.apply(b,arguments)}},on:function(a,b,c){if(b&&c)k.addEvent(a,b,c);else if(b)for(var d in b)k.addEvent(a,d,b[d])},off:function(a,b,c){if(b&&c)k.removeEvent(a,b,c);else if(b)for(var d in b)k.removeEvent(a,d,b[d])},limit:function(a,b){return d(b)?(b=[+b[0],+b[1]],a<b[0]?a=b[0]:a>b[1]&&(a=b[1])):a=+b,a},addEvent:"attachEvent"in Element.prototype?function(a,b,c){a.attachEvent("on"+b,c)}:function(a,b,c){a.addEventListener(b,c,!1)},removeEvent:"attachEvent"in Element.prototype?function(a,b,c){a.detachEvent("on"+b,c)}:function(a,b,c){a.removeEventListener(b,c)}};return k.assign(a.prototype,{setOption:function(a,b){var c=this;return c.options[a]=b,c.initialize(),c},get:function(){var a=this.dragEvent;return{x:a.x,y:a.y}},set:function(a,b){var c=this,d=c.dragEvent;return d.original={x:d.x,y:d.y},c.move(a,b),c},dragEvent:{started:!1,x:0,y:0},initialize:function(){var a,b=this,d=b.element,e=d.style,f=c(d),g=b.options,h=j.transform,i=b._dimensions={height:d.offsetHeight,left:d.offsetLeft,top:d.offsetTop,width:d.offsetWidth};g.useGPU&&h&&(a=f[h],"none"===a&&(a=""),e[h]=a+" translate3d(0,0,0)"),g.setPosition&&(e.display="block",e.left=i.left+"px",e.top=i.top+"px",e.bottom=e.right="auto",e.margin=0,e.position="absolute"),g.setCursor&&(e.cursor="move"),b.setLimit(g.limit),k.assign(b.dragEvent,{x:i.left,y:i.top}),k.on(b.element,b.handlers.start)},start:function(a){var b=this,c=b.getCursor(a),d=b.element;b.useTarget(a.target||a.srcElement)&&(a.preventDefault?a.preventDefault():a.returnValue=!1,b.dragEvent.oldZindex=d.style.zIndex,d.style.zIndex=1e4,b.setCursor(c),b.setPosition(),b.setZoom(),k.on(document,b.handlers.move))},drag:function(a){var b=this,c=b.dragEvent,d=b.element,e=b._cursor,f=b._dimensions,g=b.options,h=f.zoom,i=b.getCursor(a),j=g.threshold,k=(i.x-e.x)/h+f.left,l=(i.y-e.y)/h+f.top;!c.started&&j&&Math.abs(e.x-i.x)<j&&Math.abs(e.y-i.y)<j||(c.original||(c.original={x:k,y:l}),c.started||(g.onDragStart(d,k,l,a),c.started=!0),b.move(k,l)&&g.onDrag(d,c.x,c.y,a))},move:function(a,b){var c=this,d=c.dragEvent,e=c.options,f=e.grid,g=c.element.style,h=c.limit(a,b,d.original.x,d.original.y);return!e.smoothDrag&&f&&(h=c.round(h,f)),h.x!==d.x||h.y!==d.y?(d.x=h.x,d.y=h.y,g.left=h.x+"px",g.top=h.y+"px",!0):!1},stop:function(a){var b,c=this,d=c.dragEvent,e=c.element,f=c.options,g=f.grid;k.off(document,c.handlers.move),e.style.zIndex=d.oldZindex,f.smoothDrag&&g&&(b=c.round({x:d.x,y:d.y},g),c.move(b.x,b.y),k.assign(c.dragEvent,b)),c.dragEvent.started&&f.onDragEnd(e,d.x,d.y,a),c.reset()},reset:function(){this.dragEvent.started=!1},round:function(a){var b=this.options.grid;return{x:b*Math.round(a.x/b),y:b*Math.round(a.y/b)}},getCursor:function(a){return{x:(a.targetTouches?a.targetTouches[0]:a).clientX,y:(a.targetTouches?a.targetTouches[0]:a).clientY}},setCursor:function(a){this._cursor=a},setLimit:function(a){var b=this,c=function(a,b){return{x:a,y:b}};if(g(a))b.limit=a;else if(f(a)){var d=b._dimensions,h=a.scrollHeight-d.height,i=a.scrollWidth-d.width;b.limit=function(a,b){return{x:k.limit(a,[0,i]),y:k.limit(b,[0,h])}}}else if(a){var j={x:e(a.x),y:e(a.y)};b.limit=j.x||j.y?function(b,c){return{x:j.x?k.limit(b,a.x):b,y:j.y?k.limit(c,a.y):c}}:c}else b.limit=c},setPosition:function(){var a=this,c=a.element,d=c.style;k.assign(a._dimensions,{left:b(d.left)||c.offsetLeft,top:b(d.top)||c.offsetTop})},setZoom:function(){for(var a=this,b=a.element,d=1;b=b.offsetParent;){var e=c(b).zoom;if(e&&"normal"!==e){d=e;break}}a._dimensions.zoom=d},useTarget:function(a){var b=this.options.filterTarget;return b instanceof Function?b(a):!0},destroy:function(){k.off(this.element,this.handlers.start),k.off(document,this.handlers.move)}}),a});
},{}],2:[function(require,module,exports){
/*!
 * jBone v1.2.0 - 2016-04-13 - Library for DOM manipulation
 *
 * http://jbone.js.org
 *
 * Copyright 2016 Alexey Kupriyanenko
 * Released under the MIT license.
 */

(function (win) {

var
// cache previous versions
_$ = win.$,
_jBone = win.jBone,

// Quick match a standalone tag
rquickSingleTag = /^<(\w+)\s*\/?>$/,

// A simple way to check for HTML strings
// Prioritize #id over <tag> to avoid XSS via location.hash
rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

// Alias for function
slice = [].slice,
splice = [].splice,
keys = Object.keys,

// Alias for global variables
doc = document,

isString = function(el) {
    return typeof el === "string";
},
isObject = function(el) {
    return el instanceof Object;
},
isFunction = function(el) {
    return ({}).toString.call(el) === "[object Function]";
},
isArray = function(el) {
    return Array.isArray(el);
},
jBone = function(element, data) {
    return new fn.init(element, data);
},
fn;

// set previous values and return the instance upon calling the no-conflict mode
jBone.noConflict = function() {
    win.$ = _$;
    win.jBone = _jBone;

    return jBone;
};

fn = jBone.fn = jBone.prototype = {
    init: function(element, data) {
        var elements, tag, wraper, fragment;

        if (!element) {
            return this;
        }
        if (isString(element)) {
            // Create single DOM element
            if (tag = rquickSingleTag.exec(element)) {
                this[0] = doc.createElement(tag[1]);
                this.length = 1;

                if (isObject(data)) {
                    this.attr(data);
                }

                return this;
            }
            // Create DOM collection
            if ((tag = rquickExpr.exec(element)) && tag[1]) {
                fragment = doc.createDocumentFragment();
                wraper = doc.createElement("div");
                wraper.innerHTML = element;
                while (wraper.lastChild) {
                    fragment.appendChild(wraper.firstChild);
                }
                elements = slice.call(fragment.childNodes);

                return jBone.merge(this, elements);
            }
            // Find DOM elements with querySelectorAll
            if (jBone.isElement(data)) {
                return jBone(data).find(element);
            }

            try {
                elements = doc.querySelectorAll(element);

                return jBone.merge(this, elements);
            } catch (e) {
                return this;
            }
        }
        // Wrap DOMElement
        if (element.nodeType) {
            this[0] = element;
            this.length = 1;

            return this;
        }
        // Run function
        if (isFunction(element)) {
            return element();
        }
        // Return jBone element as is
        if (element instanceof jBone) {
            return element;
        }

        // Return element wrapped by jBone
        return jBone.makeArray(element, this);
    },

    pop: [].pop,
    push: [].push,
    reverse: [].reverse,
    shift: [].shift,
    sort: [].sort,
    splice: [].splice,
    slice: [].slice,
    indexOf: [].indexOf,
    forEach: [].forEach,
    unshift: [].unshift,
    concat: [].concat,
    join: [].join,
    every: [].every,
    some: [].some,
    filter: [].filter,
    map: [].map,
    reduce: [].reduce,
    reduceRight: [].reduceRight,
    length: 0
};

fn.constructor = jBone;

fn.init.prototype = fn;

jBone.setId = function(el) {
    var jid = el.jid;

    if (el === win) {
        jid = "window";
    } else if (el.jid === undefined) {
        el.jid = jid = ++jBone._cache.jid;
    }

    if (!jBone._cache.events[jid]) {
        jBone._cache.events[jid] = {};
    }
};

jBone.getData = function(el) {
    el = el instanceof jBone ? el[0] : el;

    var jid = el === win ? "window" : el.jid;

    return {
        jid: jid,
        events: jBone._cache.events[jid]
    };
};

jBone.isElement = function(el) {
    return el && el instanceof jBone || el instanceof HTMLElement || isString(el);
};

jBone._cache = {
    events: {},
    jid: 0
};

function isArraylike(obj) {
    var length = obj.length,
        type = typeof obj;

    if (isFunction(type) || obj === win) {
        return false;
    }

    if (obj.nodeType === 1 && length) {
        return true;
    }

    return isArray(type) || length === 0 ||
        typeof length === "number" && length > 0 && (length - 1) in obj;
}

fn.pushStack = function(elems) {
    var ret = jBone.merge(this.constructor(), elems);

    return ret;
};

jBone.merge = function(first, second) {
    var l = second.length,
        i = first.length,
        j = 0;

    while (j < l) {
        first[i++] = second[j++];
    }

    first.length = i;

    return first;
};

jBone.contains = function(container, contained) {
    return container.contains(contained);
};

jBone.extend = function(target) {
    var tg;

    splice.call(arguments, 1).forEach(function(source) {
        tg = target; //caching target for perf improvement

        if (source) {
            for (var prop in source) {
                tg[prop] = source[prop];
            }
        }
    });

    return target;
};

jBone.makeArray = function(arr, results) {
    var ret = results || [];

    if (arr !== null) {
        if (isArraylike(arr)) {
            jBone.merge(ret, isString(arr) ? [arr] : arr);
        } else {
            ret.push(arr);
        }
    }

    return ret;
};

jBone.unique = function(array) {
    if (array == null) {
        return [];
    }

    var result = [];

    for (var i = 0, length = array.length; i < length; i++) {
        var value = array[i];
        if (result.indexOf(value) < 0) {
            result.push(value);
        }
    }
    return result;
};

function BoneEvent(e, data) {
    var key, setter;

    this.originalEvent = e;

    setter = function(key, e) {
        if (key === "preventDefault") {
            this[key] = function() {
                this.defaultPrevented = true;
                return e[key]();
            };
        } else if (key === "stopImmediatePropagation") {
            this[key] = function() {
                this.immediatePropagationStopped = true;
                return e[key]();
            };
        } else if (isFunction(e[key])) {
            this[key] = function() {
                return e[key]();
            };
        } else {
            this[key] = e[key];
        }
    };

    for (key in e) {
        if (e[key] || typeof e[key] === "function") {
            setter.call(this, key, e);
        }
    }

    jBone.extend(this, data, {
        isImmediatePropagationStopped: function() {
            return !!this.immediatePropagationStopped;
        }
    });
}

jBone.Event = function(event, data) {
    var namespace, eventType;

    if (event.type && !data) {
        data = event;
        event = event.type;
    }

    namespace = event.split(".").splice(1).join(".");
    eventType = event.split(".")[0];

    event = doc.createEvent("Event");
    event.initEvent(eventType, true, true);

    return jBone.extend(event, {
        namespace: namespace,
        isDefaultPrevented: function() {
            return event.defaultPrevented;
        }
    }, data);
};

jBone.event = {

    /**
     * Attach a handler to an event for the elements
     * @param {Node}        el         - Events will be attached to this DOM Node
     * @param {String}      types      - One or more space-separated event types and optional namespaces
     * @param {Function}    handler    - A function to execute when the event is triggered
     * @param {Object}      [data]     - Data to be passed to the handler in event.data
     * @param {String}      [selector] - A selector string to filter the descendants of the selected elements
     */
    add: function(el, types, handler, data, selector) {
        jBone.setId(el);

        var eventHandler = function(e) {
                jBone.event.dispatch.call(el, e);
            },
            events = jBone.getData(el).events,
            eventType, t, event;

        types = types.split(" ");
        t = types.length;
        while (t--) {
            event = types[t];

            eventType = event.split(".")[0];
            events[eventType] = events[eventType] || [];

            if (events[eventType].length) {
                // override with previous event handler
                eventHandler = events[eventType][0].fn;
            } else {
                el.addEventListener && el.addEventListener(eventType, eventHandler, false);
            }

            events[eventType].push({
                namespace: event.split(".").splice(1).join("."),
                fn: eventHandler,
                selector: selector,
                data: data,
                originfn: handler
            });
        }
    },

    /**
     * Remove an event handler
     * @param  {Node}       el        - Events will be deattached from this DOM Node
     * @param  {String}     types     - One or more space-separated event types and optional namespaces
     * @param  {Function}   handler   - A handler function previously attached for the event(s)
     * @param  {String}     [selector] - A selector string to filter the descendants of the selected elements
     */
    remove: function(el, types, handler, selector) {
        var removeListener = function(events, eventType, index, el, e) {
                var callback;

                // get callback
                if ((handler && e.originfn === handler) || !handler) {
                    callback = e.fn;
                }

                if (events[eventType][index].fn === callback) {
                    // remove handler from cache
                    events[eventType].splice(index, 1);

                    if (!events[eventType].length) {
                        el.removeEventListener(eventType, callback);
                    }
                }
            },
            events = jBone.getData(el).events,
            l,
            eventsByType;

        if (!events) {
            return;
        }

        // remove all events
        if (!types && events) {
            return keys(events).forEach(function(eventType) {
                eventsByType = events[eventType];
                l = eventsByType.length;

                while(l--) {
                    removeListener(events, eventType, l, el, eventsByType[l]);
                }
            });
        }

        types.split(" ").forEach(function(eventName) {
            var eventType = eventName.split(".")[0],
                namespace = eventName.split(".").splice(1).join("."),
                e;

            // remove named events
            if (events[eventType]) {
                eventsByType = events[eventType];
                l = eventsByType.length;

                while(l--) {
                    e = eventsByType[l];
                    if ((!namespace || (namespace && e.namespace === namespace)) &&
                        (!selector  || (selector  && e.selector === selector))) {
                        removeListener(events, eventType, l, el, e);
                    }
                }
            }
            // remove all namespaced events
            else if (namespace) {
                keys(events).forEach(function(eventType) {
                    eventsByType = events[eventType];
                    l = eventsByType.length;

                    while(l--) {
                        e = eventsByType[l];
                        if (e.namespace.split(".")[0] === namespace.split(".")[0]) {
                            removeListener(events, eventType, l, el, e);
                        }
                    }
                });
            }
        });
    },

    /**
     * Execute all handlers and behaviors attached to the matched elements for the given event type.
     * @param  {Node}       el       - Events will be triggered for thie DOM Node
     * @param  {String}     event    - One or more space-separated event types and optional namespaces
     */
    trigger: function(el, event) {
        var events = [];

        if (isString(event)) {
            events = event.split(" ").map(function(event) {
                return jBone.Event(event);
            });
        } else {
            event = event instanceof Event ? event : jBone.Event(event);
            events = [event];
        }

        events.forEach(function(event) {
            if (!event.type) {
                return;
            }

            el.dispatchEvent && el.dispatchEvent(event);
        });
    },

    dispatch: function(e) {
        var i = 0,
            j = 0,
            el = this,
            handlers = jBone.getData(el).events[e.type],
            length = handlers.length,
            handlerQueue = [],
            targets = [],
            l,
            expectedTarget,
            handler,
            event,
            eventOptions;

        // cache all events handlers, fix issue with multiple handlers (issue #45)
        for (; i < length; i++) {
            handlerQueue.push(handlers[i]);
        }

        i = 0;
        length = handlerQueue.length;

        for (;
            // if event exists
            i < length &&
            // if handler is not removed from stack
            ~handlers.indexOf(handlerQueue[i]) &&
            // if propagation is not stopped
            !(event && event.isImmediatePropagationStopped());
        i++) {
            expectedTarget = null;
            eventOptions = {};
            handler = handlerQueue[i];
            handler.data && (eventOptions.data = handler.data);

            // event handler without selector
            if (!handler.selector) {
                event = new BoneEvent(e, eventOptions);

                if (!(e.namespace && e.namespace !== handler.namespace)) {
                    handler.originfn.call(el, event);
                }
            }
            // event handler with selector
            else if (
                // if target and selected element the same
                ~(targets = jBone(el).find(handler.selector)).indexOf(e.target) && (expectedTarget = e.target) ||
                // if one of element matched with selector contains target
                (el !== e.target && el.contains(e.target))
            ) {
                // get element matched with selector
                if (!expectedTarget) {
                    l = targets.length;
                    j = 0;

                    for (; j < l; j++) {
                        if (targets[j] && targets[j].contains(e.target)) {
                            expectedTarget = targets[j];
                        }
                    }
                }

                if (!expectedTarget) {
                    continue;
                }

                eventOptions.currentTarget = expectedTarget;
                event = new BoneEvent(e, eventOptions);

                if (!(e.namespace && e.namespace !== handler.namespace)) {
                    handler.originfn.call(expectedTarget, event);
                }
            }
        }
    }
};

fn.on = function(types, selector, data, fn) {
    var length = this.length,
        i = 0;

    if (data == null && fn == null) {
        // (types, fn)
        fn = selector;
        data = selector = undefined;
    } else if (fn == null) {
        if (typeof selector === "string") {
            // (types, selector, fn)
            fn = data;
            data = undefined;
        } else {
            // (types, data, fn)
            fn = data;
            data = selector;
            selector = undefined;
        }
    }

    if (!fn) {
        return this;
    }

    for (; i < length; i++) {
        jBone.event.add(this[i], types, fn, data, selector);
    }

    return this;
};

fn.one = function(event) {
    var args = arguments,
        i = 0,
        length = this.length,
        oneArgs = slice.call(args, 1, args.length - 1),
        callback = slice.call(args, -1)[0],
        addListener;

    addListener = function(el) {
        var $el = jBone(el);

        event.split(" ").forEach(function(event) {
            var fn = function(e) {
                $el.off(event, fn);
                callback.call(el, e);
            };

            $el.on.apply($el, [event].concat(oneArgs, fn));
        });
    };

    for (; i < length; i++) {
        addListener(this[i]);
    }

    return this;
};

fn.trigger = function(event) {
    var i = 0,
        length = this.length;

    if (!event) {
        return this;
    }

    for (; i < length; i++) {
        jBone.event.trigger(this[i], event);
    }

    return this;
};

fn.off = function(types, selector, handler) {
    var i = 0,
        length = this.length;

    if (isFunction(selector)) {
        handler = selector;
        selector = undefined;
    }

    for (; i < length; i++) {
        jBone.event.remove(this[i], types, handler, selector);
    }

    return this;
};

fn.find = function(selector) {
    var results = [],
        i = 0,
        length = this.length,
        finder = function(el) {
            if (isFunction(el.querySelectorAll)) {
                [].forEach.call(el.querySelectorAll(selector), function(found) {
                    results.push(found);
                });
            }
        };

    for (; i < length; i++) {
        finder(this[i]);
    }

    return jBone(results);
};

fn.get = function(index) {
    return index != null ?

        // Return just one element from the set
        (index < 0 ? this[index + this.length] : this[index]) :

        // Return all the elements in a clean array
        slice.call(this);
};

fn.eq = function(index) {
    return jBone(this[index]);
};

fn.parent = function() {
    var results = [],
        parent,
        i = 0,
        length = this.length;

    for (; i < length; i++) {
        if (!~results.indexOf(parent = this[i].parentElement) && parent) {
            results.push(parent);
        }
    }

    return jBone(results);
};

fn.toArray = function() {
    return slice.call(this);
};

fn.is = function() {
    var args = arguments;

    return this.some(function(el) {
        return el.tagName.toLowerCase() === args[0];
    });
};

fn.has = function() {
    var args = arguments;

    return this.some(function(el) {
        return el.querySelectorAll(args[0]).length;
    });
};

fn.add = function(selector, context) {
    return this.pushStack(
        jBone.unique(
            jBone.merge(this.get(), jBone(selector, context))
        )
    );
};

fn.attr = function(key, value) {
    var args = arguments,
        i = 0,
        length = this.length,
        setter;

    if (isString(key) && args.length === 1) {
        return this[0] && this[0].getAttribute(key);
    }

    if (args.length === 2) {
        setter = function(el) {
            el.setAttribute(key, value);
        };
    } else if (isObject(key)) {
        setter = function(el) {
            keys(key).forEach(function(name) {
                el.setAttribute(name, key[name]);
            });
        };
    }

    for (; i < length; i++) {
        setter(this[i]);
    }

    return this;
};

fn.removeAttr = function(key) {
    var i = 0,
        length = this.length;

    for (; i < length; i++) {
        this[i].removeAttribute(key);
    }

    return this;
};

fn.val = function(value) {
    var i = 0,
        length = this.length;

    if (arguments.length === 0) {
        return this[0] && this[0].value;
    }

    for (; i < length; i++) {
        this[i].value = value;
    }

    return this;
};

fn.css = function(key, value) {
    var args = arguments,
        i = 0,
        length = this.length,
        setter;

    // Get attribute
    if (isString(key) && args.length === 1) {
        return this[0] && win.getComputedStyle(this[0])[key];
    }

    // Set attributes
    if (args.length === 2) {
        setter = function(el) {
            el.style[key] = value;
        };
    } else if (isObject(key)) {
        setter = function(el) {
            keys(key).forEach(function(name) {
                el.style[name] = key[name];
            });
        };
    }

    for (; i < length; i++) {
        setter(this[i]);
    }

    return this;
};

fn.data = function(key, value) {
    var args = arguments, data = {},
        i = 0,
        length = this.length,
        setter,
        setValue = function(el, key, value) {
            if (isObject(value)) {
                el.jdata = el.jdata || {};
                el.jdata[key] = value;
            } else {
                el.dataset[key] = value;
            }
        },
        getValue = function(value) {
            if (value === "true") {
                return true;
            } else if (value === "false") {
                return false;
            } else {
                return value;
            }
        };

    // Get all data
    if (args.length === 0) {
        this[0].jdata && (data = this[0].jdata);

        keys(this[0].dataset).forEach(function(key) {
            data[key] = getValue(this[0].dataset[key]);
        }, this);

        return data;
    }
    // Get data by name
    if (args.length === 1 && isString(key)) {
        return this[0] && getValue(this[0].dataset[key] || this[0].jdata && this[0].jdata[key]);
    }

    // Set data
    if (args.length === 1 && isObject(key)) {
        setter = function(el) {
            keys(key).forEach(function(name) {
                setValue(el, name, key[name]);
            });
        };
    } else if (args.length === 2) {
        setter = function(el) {
            setValue(el, key, value);
        };
    }

    for (; i < length; i++) {
        setter(this[i]);
    }

    return this;
};

fn.removeData = function(key) {
    var i = 0,
        length = this.length,
        jdata, dataset;

    for (; i < length; i++) {
        jdata = this[i].jdata;
        dataset = this[i].dataset;

        if (key) {
            jdata && jdata[key] && delete jdata[key];
            delete dataset[key];
        } else {
            for (key in jdata) {
                delete jdata[key];
            }

            for (key in dataset) {
                delete dataset[key];
            }
        }
    }

    return this;
};

fn.addClass = function(className) {
    var i = 0,
        j = 0,
        length = this.length,
        classes = className ? className.trim().split(/\s+/) : [];

    for (; i < length; i++) {
        j = 0;

        for (j = 0; j < classes.length; j++) {
            this[i].classList.add(classes[j]);
        }
    }

    return this;
};

fn.removeClass = function(className) {
    var i = 0,
        j = 0,
        length = this.length,
        classes = className ? className.trim().split(/\s+/) : [];

    for (; i < length; i++) {
        j = 0;

        for (j = 0; j < classes.length; j++) {
            this[i].classList.remove(classes[j]);
        }
    }

    return this;
};

fn.toggleClass = function(className, force) {
    var i = 0,
        length = this.length,
        method = "toggle";

    force === true && (method = "add") || force === false && (method = "remove");

    if (className) {
        for (; i < length; i++) {
            this[i].classList[method](className);
        }
    }

    return this;
};

fn.hasClass = function(className) {
    var i = 0, length = this.length;

    if (className) {
        for (; i < length; i++) {
            if (this[i].classList.contains(className)) {
                return true;
            }
        }
    }

    return false;
};

fn.html = function(value) {
    var args = arguments,
        el;

    // add HTML into elements
    if (args.length === 1 && value !== undefined) {
        return this.empty().append(value);
    }
    // get HTML from element
    else if (args.length === 0 && (el = this[0])) {
        return el.innerHTML;
    }

    return this;
};

fn.append = function(appended) {
    var i = 0,
        length = this.length,
        setter;

    // create jBone object and then append
    if (isString(appended) && rquickExpr.exec(appended)) {
        appended = jBone(appended);
    }
    // create text node for insertion
    else if (!isObject(appended)) {
        appended = document.createTextNode(appended);
    }

    appended = appended instanceof jBone ? appended : jBone(appended);

    setter = function(el, i) {
        appended.forEach(function(node) {
            if (i) {
                el.appendChild(node.cloneNode(true));
            } else {
                el.appendChild(node);
            }
        });
    };

    for (; i < length; i++) {
        setter(this[i], i);
    }

    return this;
};

fn.appendTo = function(to) {
    jBone(to).append(this);

    return this;
};

fn.empty = function() {
    var i = 0,
        length = this.length,
        el;

    for (; i < length; i++) {
        el = this[i];

        while (el.lastChild) {
            el.removeChild(el.lastChild);
        }
    }

    return this;
};

fn.remove = function() {
    var i = 0,
        length = this.length,
        el;

    // remove all listeners
    this.off();

    for (; i < length; i++) {
        el = this[i];

        // remove data and nodes
        delete el.jdata;
        el.parentNode && el.parentNode.removeChild(el);
    }

    return this;
};

if (typeof module === "object" && module && typeof module.exports === "object") {
    // Expose jBone as module.exports in loaders that implement the Node
    // module pattern (including browserify). Do not create the global, since
    // the user will be storing it themselves locally, and globals are frowned
    // upon in the Node module world.
    module.exports = jBone;
}
// Register as a AMD module
else if (typeof define === "function" && define.amd) {
    define(function() {
        return jBone;
    });

    win.jBone = win.$ = jBone;
} else if (typeof win === "object" && typeof win.document === "object") {
    win.jBone = win.$ = jBone;
}

}(window));

},{}],3:[function(require,module,exports){
/*!
 * reveal.js
 * http://lab.hakim.se/reveal-js
 * MIT licensed
 *
 * Copyright (C) 2016 Hakim El Hattab, http://hakim.se
 */
(function( root, factory ) {
	if( typeof define === 'function' && define.amd ) {
		// AMD. Register as an anonymous module.
		define( function() {
			root.Reveal = factory();
			return root.Reveal;
		} );
	} else if( typeof exports === 'object' ) {
		// Node. Does not work with strict CommonJS.
		module.exports = factory();
	} else {
		// Browser globals.
		root.Reveal = factory();
	}
}( this, function() {

	'use strict';

	var Reveal;

	// The reveal.js version
	var VERSION = '3.3.0';

	var SLIDES_SELECTOR = '.slides section',
		HORIZONTAL_SLIDES_SELECTOR = '.slides>section',
		VERTICAL_SLIDES_SELECTOR = '.slides>section.present>section',
		HOME_SLIDE_SELECTOR = '.slides>section:first-of-type',
		UA = navigator.userAgent,

		// Configuration defaults, can be overridden at initialization time
		config = {

			// The "normal" size of the presentation, aspect ratio will be preserved
			// when the presentation is scaled to fit different resolutions
			width: 960,
			height: 700,

			// Factor of the display size that should remain empty around the content
			margin: 0.1,

			// Bounds for smallest/largest possible scale to apply to content
			minScale: 0.2,
			maxScale: 1.5,

			// Display controls in the bottom right corner
			controls: true,

			// Display a presentation progress bar
			progress: true,

			// Display the page number of the current slide
			slideNumber: false,

			// Push each slide change to the browser history
			history: false,

			// Enable keyboard shortcuts for navigation
			keyboard: true,

			// Optional function that blocks keyboard events when retuning false
			keyboardCondition: null,

			// Enable the slide overview mode
			overview: true,

			// Vertical centering of slides
			center: true,

			// Enables touch navigation on devices with touch input
			touch: true,

			// Loop the presentation
			loop: false,

			// Change the presentation direction to be RTL
			rtl: false,

			// Randomizes the order of slides each time the presentation loads
			shuffle: false,

			// Turns fragments on and off globally
			fragments: true,

			// Flags if the presentation is running in an embedded mode,
			// i.e. contained within a limited portion of the screen
			embedded: false,

			// Flags if we should show a help overlay when the questionmark
			// key is pressed
			help: true,

			// Flags if it should be possible to pause the presentation (blackout)
			pause: true,

			// Flags if speaker notes should be visible to all viewers
			showNotes: false,

			// Number of milliseconds between automatically proceeding to the
			// next slide, disabled when set to 0, this value can be overwritten
			// by using a data-autoslide attribute on your slides
			autoSlide: 0,

			// Stop auto-sliding after user input
			autoSlideStoppable: true,

			// Use this method for navigation when auto-sliding (defaults to navigateNext)
			autoSlideMethod: null,

			// Enable slide navigation via mouse wheel
			mouseWheel: false,

			// Apply a 3D roll to links on hover
			rollingLinks: false,

			// Hides the address bar on mobile devices
			hideAddressBar: true,

			// Opens links in an iframe preview overlay
			previewLinks: false,

			// Exposes the reveal.js API through window.postMessage
			postMessage: true,

			// Dispatches all reveal.js events to the parent window through postMessage
			postMessageEvents: false,

			// Focuses body when page changes visiblity to ensure keyboard shortcuts work
			focusBodyOnPageVisibilityChange: true,

			// Transition style
			transition: 'slide', // none/fade/slide/convex/concave/zoom

			// Transition speed
			transitionSpeed: 'default', // default/fast/slow

			// Transition style for full page slide backgrounds
			backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

			// Parallax background image
			parallaxBackgroundImage: '', // CSS syntax, e.g. "a.jpg"

			// Parallax background size
			parallaxBackgroundSize: '', // CSS syntax, e.g. "3000px 2000px"

			// Amount of pixels to move the parallax background per slide step
			parallaxBackgroundHorizontal: null,
			parallaxBackgroundVertical: null,

			// Number of slides away from the current that are visible
			viewDistance: 3,

			// Script dependencies to load
			dependencies: []

		},

		// Flags if reveal.js is loaded (has dispatched the 'ready' event)
		loaded = false,

		// Flags if the overview mode is currently active
		overview = false,

		// Holds the dimensions of our overview slides, including margins
		overviewSlideWidth = null,
		overviewSlideHeight = null,

		// The horizontal and vertical index of the currently active slide
		indexh,
		indexv,

		// The previous and current slide HTML elements
		previousSlide,
		currentSlide,

		previousBackground,

		// Slides may hold a data-state attribute which we pick up and apply
		// as a class to the body. This list contains the combined state of
		// all current slides.
		state = [],

		// The current scale of the presentation (see width/height config)
		scale = 1,

		// CSS transform that is currently applied to the slides container,
		// split into two groups
		slidesTransform = { layout: '', overview: '' },

		// Cached references to DOM elements
		dom = {},

		// Features supported by the browser, see #checkCapabilities()
		features = {},

		// Client is a mobile device, see #checkCapabilities()
		isMobileDevice,

		// Client is a desktop Chrome, see #checkCapabilities()
		isChrome,

		// Throttles mouse wheel navigation
		lastMouseWheelStep = 0,

		// Delays updates to the URL due to a Chrome thumbnailer bug
		writeURLTimeout = 0,

		// Flags if the interaction event listeners are bound
		eventsAreBound = false,

		// The current auto-slide duration
		autoSlide = 0,

		// Auto slide properties
		autoSlidePlayer,
		autoSlideTimeout = 0,
		autoSlideStartTime = -1,
		autoSlidePaused = false,

		// Holds information about the currently ongoing touch input
		touch = {
			startX: 0,
			startY: 0,
			startSpan: 0,
			startCount: 0,
			captured: false,
			threshold: 40
		},

		// Holds information about the keyboard shortcuts
		keyboardShortcuts = {
			'N  ,  SPACE':			'Next slide',
			'P':					'Previous slide',
			'&#8592;  ,  H':		'Navigate left',
			'&#8594;  ,  L':		'Navigate right',
			'&#8593;  ,  K':		'Navigate up',
			'&#8595;  ,  J':		'Navigate down',
			'Home':					'First slide',
			'End':					'Last slide',
			'B  ,  .':				'Pause',
			'F':					'Fullscreen',
			'ESC, O':				'Slide overview'
		};

	/**
	 * Starts up the presentation if the client is capable.
	 */
	function initialize( options ) {

		checkCapabilities();

		if( !features.transforms2d && !features.transforms3d ) {
			document.body.setAttribute( 'class', 'no-transforms' );

			// Since JS won't be running any further, we load all lazy
			// loading elements upfront
			var images = toArray( document.getElementsByTagName( 'img' ) ),
				iframes = toArray( document.getElementsByTagName( 'iframe' ) );

			var lazyLoadable = images.concat( iframes );

			for( var i = 0, len = lazyLoadable.length; i < len; i++ ) {
				var element = lazyLoadable[i];
				if( element.getAttribute( 'data-src' ) ) {
					element.setAttribute( 'src', element.getAttribute( 'data-src' ) );
					element.removeAttribute( 'data-src' );
				}
			}

			// If the browser doesn't support core features we won't be
			// using JavaScript to control the presentation
			return;
		}

		// Cache references to key DOM elements
		dom.wrapper = document.querySelector( '.reveal' );
		dom.slides = document.querySelector( '.reveal .slides' );

		// Force a layout when the whole page, incl fonts, has loaded
		window.addEventListener( 'load', layout, false );

		var query = Reveal.getQueryHash();

		// Do not accept new dependencies via query config to avoid
		// the potential of malicious script injection
		if( typeof query['dependencies'] !== 'undefined' ) delete query['dependencies'];

		// Copy options over to our config object
		extend( config, options );
		extend( config, query );

		// Hide the address bar in mobile browsers
		hideAddressBar();

		// Loads the dependencies and continues to #start() once done
		load();

	}

	/**
	 * Inspect the client to see what it's capable of, this
	 * should only happens once per runtime.
	 */
	function checkCapabilities() {

		isMobileDevice = /(iphone|ipod|ipad|android)/gi.test( UA );
		isChrome = /chrome/i.test( UA ) && !/edge/i.test( UA );

		var testElement = document.createElement( 'div' );

		features.transforms3d = 'WebkitPerspective' in testElement.style ||
								'MozPerspective' in testElement.style ||
								'msPerspective' in testElement.style ||
								'OPerspective' in testElement.style ||
								'perspective' in testElement.style;

		features.transforms2d = 'WebkitTransform' in testElement.style ||
								'MozTransform' in testElement.style ||
								'msTransform' in testElement.style ||
								'OTransform' in testElement.style ||
								'transform' in testElement.style;

		features.requestAnimationFrameMethod = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
		features.requestAnimationFrame = typeof features.requestAnimationFrameMethod === 'function';

		features.canvas = !!document.createElement( 'canvas' ).getContext;

		// Transitions in the overview are disabled in desktop and
		// Safari due to lag
		features.overviewTransitions = !/Version\/[\d\.]+.*Safari/.test( UA );

		// Flags if we should use zoom instead of transform to scale
		// up slides. Zoom produces crisper results but has a lot of
		// xbrowser quirks so we only use it in whitelsited browsers.
		features.zoom = 'zoom' in testElement.style && !isMobileDevice &&
						( isChrome || /Version\/[\d\.]+.*Safari/.test( UA ) );

	}

    /**
     * Loads the dependencies of reveal.js. Dependencies are
     * defined via the configuration option 'dependencies'
     * and will be loaded prior to starting/binding reveal.js.
     * Some dependencies may have an 'async' flag, if so they
     * will load after reveal.js has been started up.
     */
	function load() {

		var scripts = [],
			scriptsAsync = [],
			scriptsToPreload = 0;

		// Called once synchronous scripts finish loading
		function proceed() {
			if( scriptsAsync.length ) {
				// Load asynchronous scripts
				head.js.apply( null, scriptsAsync );
			}

			start();
		}

		function loadScript( s ) {
			head.ready( s.src.match( /([\w\d_\-]*)\.?js$|[^\\\/]*$/i )[0], function() {
				// Extension may contain callback functions
				if( typeof s.callback === 'function' ) {
					s.callback.apply( this );
				}

				if( --scriptsToPreload === 0 ) {
					proceed();
				}
			});
		}

		for( var i = 0, len = config.dependencies.length; i < len; i++ ) {
			var s = config.dependencies[i];

			// Load if there's no condition or the condition is truthy
			if( !s.condition || s.condition() ) {
				if( s.async ) {
					scriptsAsync.push( s.src );
				}
				else {
					scripts.push( s.src );
				}

				loadScript( s );
			}
		}

		if( scripts.length ) {
			scriptsToPreload = scripts.length;

			// Load synchronous scripts
			head.js.apply( null, scripts );
		}
		else {
			proceed();
		}

	}

	/**
	 * Starts up reveal.js by binding input events and navigating
	 * to the current URL deeplink if there is one.
	 */
	function start() {

		// Make sure we've got all the DOM elements we need
		setupDOM();

		// Listen to messages posted to this window
		setupPostMessage();

		// Prevent the slides from being scrolled out of view
		setupScrollPrevention();

		// Resets all vertical slides so that only the first is visible
		resetVerticalSlides();

		// Updates the presentation to match the current configuration values
		configure();

		// Read the initial hash
		readURL();

		// Update all backgrounds
		updateBackground( true );

		// Notify listeners that the presentation is ready but use a 1ms
		// timeout to ensure it's not fired synchronously after #initialize()
		setTimeout( function() {
			// Enable transitions now that we're loaded
			dom.slides.classList.remove( 'no-transition' );

			loaded = true;

			dispatchEvent( 'ready', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );
		}, 1 );

		// Special setup and config is required when printing to PDF
		if( isPrintingPDF() ) {
			removeEventListeners();

			// The document needs to have loaded for the PDF layout
			// measurements to be accurate
			if( document.readyState === 'complete' ) {
				setupPDF();
			}
			else {
				window.addEventListener( 'load', setupPDF );
			}
		}

	}

	/**
	 * Finds and stores references to DOM elements which are
	 * required by the presentation. If a required element is
	 * not found, it is created.
	 */
	function setupDOM() {

		// Prevent transitions while we're loading
		dom.slides.classList.add( 'no-transition' );

		// Background element
		dom.background = createSingletonNode( dom.wrapper, 'div', 'backgrounds', null );

		// Progress bar
		dom.progress = createSingletonNode( dom.wrapper, 'div', 'progress', '<span></span>' );
		dom.progressbar = dom.progress.querySelector( 'span' );

		// Arrow controls
		createSingletonNode( dom.wrapper, 'aside', 'controls',
			'<button class="navigate-left" aria-label="previous slide"></button>' +
			'<button class="navigate-right" aria-label="next slide"></button>' +
			'<button class="navigate-up" aria-label="above slide"></button>' +
			'<button class="navigate-down" aria-label="below slide"></button>' );

		// Slide number
		dom.slideNumber = createSingletonNode( dom.wrapper, 'div', 'slide-number', '' );

		// Element containing notes that are visible to the audience
		dom.speakerNotes = createSingletonNode( dom.wrapper, 'div', 'speaker-notes', null );
		dom.speakerNotes.setAttribute( 'data-prevent-swipe', '' );

		// Overlay graphic which is displayed during the paused mode
		createSingletonNode( dom.wrapper, 'div', 'pause-overlay', null );

		// Cache references to elements
		dom.controls = document.querySelector( '.reveal .controls' );
		dom.theme = document.querySelector( '#theme' );

		dom.wrapper.setAttribute( 'role', 'application' );

		// There can be multiple instances of controls throughout the page
		dom.controlsLeft = toArray( document.querySelectorAll( '.navigate-left' ) );
		dom.controlsRight = toArray( document.querySelectorAll( '.navigate-right' ) );
		dom.controlsUp = toArray( document.querySelectorAll( '.navigate-up' ) );
		dom.controlsDown = toArray( document.querySelectorAll( '.navigate-down' ) );
		dom.controlsPrev = toArray( document.querySelectorAll( '.navigate-prev' ) );
		dom.controlsNext = toArray( document.querySelectorAll( '.navigate-next' ) );

		dom.statusDiv = createStatusDiv();
	}

	/**
	 * Creates a hidden div with role aria-live to announce the
	 * current slide content. Hide the div off-screen to make it
	 * available only to Assistive Technologies.
	 */
	function createStatusDiv() {

		var statusDiv = document.getElementById( 'aria-status-div' );
		if( !statusDiv ) {
			statusDiv = document.createElement( 'div' );
			statusDiv.style.position = 'absolute';
			statusDiv.style.height = '1px';
			statusDiv.style.width = '1px';
			statusDiv.style.overflow ='hidden';
			statusDiv.style.clip = 'rect( 1px, 1px, 1px, 1px )';
			statusDiv.setAttribute( 'id', 'aria-status-div' );
			statusDiv.setAttribute( 'aria-live', 'polite' );
			statusDiv.setAttribute( 'aria-atomic','true' );
			dom.wrapper.appendChild( statusDiv );
		}
		return statusDiv;

	}

	/**
	 * Configures the presentation for printing to a static
	 * PDF.
	 */
	function setupPDF() {

		var slideSize = getComputedSlideSize( window.innerWidth, window.innerHeight );

		// Dimensions of the PDF pages
		var pageWidth = Math.floor( slideSize.width * ( 1 + config.margin ) ),
			pageHeight = Math.floor( slideSize.height * ( 1 + config.margin  ) );

		// Dimensions of slides within the pages
		var slideWidth = slideSize.width,
			slideHeight = slideSize.height;

		// Let the browser know what page size we want to print
		injectStyleSheet( '@page{size:'+ pageWidth +'px '+ pageHeight +'px; margin: 0;}' );

		// Limit the size of certain elements to the dimensions of the slide
		injectStyleSheet( '.reveal section>img, .reveal section>video, .reveal section>iframe{max-width: '+ slideWidth +'px; max-height:'+ slideHeight +'px}' );

		document.body.classList.add( 'print-pdf' );
		document.body.style.width = pageWidth + 'px';
		document.body.style.height = pageHeight + 'px';

		// Add each slide's index as attributes on itself, we need these
		// indices to generate slide numbers below
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( hslide, h ) {
			hslide.setAttribute( 'data-index-h', h );

			if( hslide.classList.contains( 'stack' ) ) {
				toArray( hslide.querySelectorAll( 'section' ) ).forEach( function( vslide, v ) {
					vslide.setAttribute( 'data-index-h', h );
					vslide.setAttribute( 'data-index-v', v );
				} );
			}
		} );

		// Slide and slide background layout
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {

			// Vertical stacks are not centred since their section
			// children will be
			if( slide.classList.contains( 'stack' ) === false ) {
				// Center the slide inside of the page, giving the slide some margin
				var left = ( pageWidth - slideWidth ) / 2,
					top = ( pageHeight - slideHeight ) / 2;

				var contentHeight = getAbsoluteHeight( slide );
				var numberOfPages = Math.max( Math.ceil( contentHeight / pageHeight ), 1 );

				// Center slides vertically
				if( numberOfPages === 1 && config.center || slide.classList.contains( 'center' ) ) {
					top = Math.max( ( pageHeight - contentHeight ) / 2, 0 );
				}

				// Position the slide inside of the page
				slide.style.left = left + 'px';
				slide.style.top = top + 'px';
				slide.style.width = slideWidth + 'px';

				// TODO Backgrounds need to be multiplied when the slide
				// stretches over multiple pages
				var background = slide.querySelector( '.slide-background' );
				if( background ) {
					background.style.width = pageWidth + 'px';
					background.style.height = ( pageHeight * numberOfPages ) + 'px';
					background.style.top = -top + 'px';
					background.style.left = -left + 'px';
				}

				// Inject notes if `showNotes` is enabled
				if( config.showNotes ) {
					var notes = getSlideNotes( slide );
					if( notes ) {
						var notesSpacing = 8;
						var notesElement = document.createElement( 'div' );
						notesElement.classList.add( 'speaker-notes' );
						notesElement.classList.add( 'speaker-notes-pdf' );
						notesElement.innerHTML = notes;
						notesElement.style.left = ( notesSpacing - left ) + 'px';
						notesElement.style.bottom = ( notesSpacing - top ) + 'px';
						notesElement.style.width = ( pageWidth - notesSpacing*2 ) + 'px';
						slide.appendChild( notesElement );
					}
				}

				// Inject slide numbers if `slideNumbers` are enabled
				if( config.slideNumber ) {
					var slideNumberH = parseInt( slide.getAttribute( 'data-index-h' ), 10 ) + 1,
						slideNumberV = parseInt( slide.getAttribute( 'data-index-v' ), 10 ) + 1;

					var numberElement = document.createElement( 'div' );
					numberElement.classList.add( 'slide-number' );
					numberElement.classList.add( 'slide-number-pdf' );
					numberElement.innerHTML = formatSlideNumber( slideNumberH, '.', slideNumberV );
					background.appendChild( numberElement );
				}
			}

		} );

		// Show all fragments
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' .fragment' ) ).forEach( function( fragment ) {
			fragment.classList.add( 'visible' );
		} );

	}

	/**
	 * This is an unfortunate necessity. Some actions – such as
	 * an input field being focused in an iframe or using the
	 * keyboard to expand text selection beyond the bounds of
	 * a slide – can trigger our content to be pushed out of view.
	 * This scrolling can not be prevented by hiding overflow in
	 * CSS (we already do) so we have to resort to repeatedly
	 * checking if the slides have been offset :(
	 */
	function setupScrollPrevention() {

		setInterval( function() {
			if( dom.wrapper.scrollTop !== 0 || dom.wrapper.scrollLeft !== 0 ) {
				dom.wrapper.scrollTop = 0;
				dom.wrapper.scrollLeft = 0;
			}
		}, 1000 );

	}

	/**
	 * Creates an HTML element and returns a reference to it.
	 * If the element already exists the existing instance will
	 * be returned.
	 */
	function createSingletonNode( container, tagname, classname, innerHTML ) {

		// Find all nodes matching the description
		var nodes = container.querySelectorAll( '.' + classname );

		// Check all matches to find one which is a direct child of
		// the specified container
		for( var i = 0; i < nodes.length; i++ ) {
			var testNode = nodes[i];
			if( testNode.parentNode === container ) {
				return testNode;
			}
		}

		// If no node was found, create it now
		var node = document.createElement( tagname );
		node.classList.add( classname );
		if( typeof innerHTML === 'string' ) {
			node.innerHTML = innerHTML;
		}
		container.appendChild( node );

		return node;

	}

	/**
	 * Creates the slide background elements and appends them
	 * to the background container. One element is created per
	 * slide no matter if the given slide has visible background.
	 */
	function createBackgrounds() {

		var printMode = isPrintingPDF();

		// Clear prior backgrounds
		dom.background.innerHTML = '';
		dom.background.classList.add( 'no-transition' );

		// Iterate over all horizontal slides
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( slideh ) {

			var backgroundStack;

			if( printMode ) {
				backgroundStack = createBackground( slideh, slideh );
			}
			else {
				backgroundStack = createBackground( slideh, dom.background );
			}

			// Iterate over all vertical slides
			toArray( slideh.querySelectorAll( 'section' ) ).forEach( function( slidev ) {

				if( printMode ) {
					createBackground( slidev, slidev );
				}
				else {
					createBackground( slidev, backgroundStack );
				}

				backgroundStack.classList.add( 'stack' );

			} );

		} );

		// Add parallax background if specified
		if( config.parallaxBackgroundImage ) {

			dom.background.style.backgroundImage = 'url("' + config.parallaxBackgroundImage + '")';
			dom.background.style.backgroundSize = config.parallaxBackgroundSize;

			// Make sure the below properties are set on the element - these properties are
			// needed for proper transitions to be set on the element via CSS. To remove
			// annoying background slide-in effect when the presentation starts, apply
			// these properties after short time delay
			setTimeout( function() {
				dom.wrapper.classList.add( 'has-parallax-background' );
			}, 1 );

		}
		else {

			dom.background.style.backgroundImage = '';
			dom.wrapper.classList.remove( 'has-parallax-background' );

		}

	}

	/**
	 * Creates a background for the given slide.
	 *
	 * @param {HTMLElement} slide
	 * @param {HTMLElement} container The element that the background
	 * should be appended to
	 */
	function createBackground( slide, container ) {

		var data = {
			background: slide.getAttribute( 'data-background' ),
			backgroundSize: slide.getAttribute( 'data-background-size' ),
			backgroundImage: slide.getAttribute( 'data-background-image' ),
			backgroundVideo: slide.getAttribute( 'data-background-video' ),
			backgroundIframe: slide.getAttribute( 'data-background-iframe' ),
			backgroundColor: slide.getAttribute( 'data-background-color' ),
			backgroundRepeat: slide.getAttribute( 'data-background-repeat' ),
			backgroundPosition: slide.getAttribute( 'data-background-position' ),
			backgroundTransition: slide.getAttribute( 'data-background-transition' )
		};

		var element = document.createElement( 'div' );

		// Carry over custom classes from the slide to the background
		element.className = 'slide-background ' + slide.className.replace( /present|past|future/, '' );

		if( data.background ) {
			// Auto-wrap image urls in url(...)
			if( /^(http|file|\/\/)/gi.test( data.background ) || /\.(svg|png|jpg|jpeg|gif|bmp)$/gi.test( data.background ) ) {
				slide.setAttribute( 'data-background-image', data.background );
			}
			else {
				element.style.background = data.background;
			}
		}

		// Create a hash for this combination of background settings.
		// This is used to determine when two slide backgrounds are
		// the same.
		if( data.background || data.backgroundColor || data.backgroundImage || data.backgroundVideo || data.backgroundIframe ) {
			element.setAttribute( 'data-background-hash', data.background +
															data.backgroundSize +
															data.backgroundImage +
															data.backgroundVideo +
															data.backgroundIframe +
															data.backgroundColor +
															data.backgroundRepeat +
															data.backgroundPosition +
															data.backgroundTransition );
		}

		// Additional and optional background properties
		if( data.backgroundSize ) element.style.backgroundSize = data.backgroundSize;
		if( data.backgroundColor ) element.style.backgroundColor = data.backgroundColor;
		if( data.backgroundRepeat ) element.style.backgroundRepeat = data.backgroundRepeat;
		if( data.backgroundPosition ) element.style.backgroundPosition = data.backgroundPosition;
		if( data.backgroundTransition ) element.setAttribute( 'data-background-transition', data.backgroundTransition );

		container.appendChild( element );

		// If backgrounds are being recreated, clear old classes
		slide.classList.remove( 'has-dark-background' );
		slide.classList.remove( 'has-light-background' );

		// If this slide has a background color, add a class that
		// signals if it is light or dark. If the slide has no background
		// color, no class will be set
		var computedBackgroundColor = window.getComputedStyle( element ).backgroundColor;
		if( computedBackgroundColor ) {
			var rgb = colorToRgb( computedBackgroundColor );

			// Ignore fully transparent backgrounds. Some browsers return
			// rgba(0,0,0,0) when reading the computed background color of
			// an element with no background
			if( rgb && rgb.a !== 0 ) {
				if( colorBrightness( computedBackgroundColor ) < 128 ) {
					slide.classList.add( 'has-dark-background' );
				}
				else {
					slide.classList.add( 'has-light-background' );
				}
			}
		}

		return element;

	}

	/**
	 * Registers a listener to postMessage events, this makes it
	 * possible to call all reveal.js API methods from another
	 * window. For example:
	 *
	 * revealWindow.postMessage( JSON.stringify({
	 *   method: 'slide',
	 *   args: [ 2 ]
	 * }), '*' );
	 */
	function setupPostMessage() {

		if( config.postMessage ) {
			window.addEventListener( 'message', function ( event ) {
				var data = event.data;

				// Make sure we're dealing with JSON
				if( typeof data === 'string' && data.charAt( 0 ) === '{' && data.charAt( data.length - 1 ) === '}' ) {
					data = JSON.parse( data );

					// Check if the requested method can be found
					if( data.method && typeof Reveal[data.method] === 'function' ) {
						Reveal[data.method].apply( Reveal, data.args );
					}
				}
			}, false );
		}

	}

	/**
	 * Applies the configuration settings from the config
	 * object. May be called multiple times.
	 */
	function configure( options ) {

		var numberOfSlides = dom.wrapper.querySelectorAll( SLIDES_SELECTOR ).length;

		dom.wrapper.classList.remove( config.transition );

		// New config options may be passed when this method
		// is invoked through the API after initialization
		if( typeof options === 'object' ) extend( config, options );

		// Force linear transition based on browser capabilities
		if( features.transforms3d === false ) config.transition = 'linear';

		dom.wrapper.classList.add( config.transition );

		dom.wrapper.setAttribute( 'data-transition-speed', config.transitionSpeed );
		dom.wrapper.setAttribute( 'data-background-transition', config.backgroundTransition );

		dom.controls.style.display = config.controls ? 'block' : 'none';
		dom.progress.style.display = config.progress ? 'block' : 'none';
		dom.slideNumber.style.display = config.slideNumber && !isPrintingPDF() ? 'block' : 'none';

		if( config.shuffle ) {
			shuffle();
		}

		if( config.rtl ) {
			dom.wrapper.classList.add( 'rtl' );
		}
		else {
			dom.wrapper.classList.remove( 'rtl' );
		}

		if( config.center ) {
			dom.wrapper.classList.add( 'center' );
		}
		else {
			dom.wrapper.classList.remove( 'center' );
		}

		// Exit the paused mode if it was configured off
		if( config.pause === false ) {
			resume();
		}

		if( config.showNotes ) {
			dom.speakerNotes.classList.add( 'visible' );
		}
		else {
			dom.speakerNotes.classList.remove( 'visible' );
		}

		if( config.mouseWheel ) {
			document.addEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.addEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}
		else {
			document.removeEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.removeEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}

		// Rolling 3D links
		if( config.rollingLinks ) {
			enableRollingLinks();
		}
		else {
			disableRollingLinks();
		}

		// Iframe link previews
		if( config.previewLinks ) {
			enablePreviewLinks();
		}
		else {
			disablePreviewLinks();
			enablePreviewLinks( '[data-preview-link]' );
		}

		// Remove existing auto-slide controls
		if( autoSlidePlayer ) {
			autoSlidePlayer.destroy();
			autoSlidePlayer = null;
		}

		// Generate auto-slide controls if needed
		if( numberOfSlides > 1 && config.autoSlide && config.autoSlideStoppable && features.canvas && features.requestAnimationFrame ) {
			autoSlidePlayer = new Playback( dom.wrapper, function() {
				return Math.min( Math.max( ( Date.now() - autoSlideStartTime ) / autoSlide, 0 ), 1 );
			} );

			autoSlidePlayer.on( 'click', onAutoSlidePlayerClick );
			autoSlidePaused = false;
		}

		// When fragments are turned off they should be visible
		if( config.fragments === false ) {
			toArray( dom.slides.querySelectorAll( '.fragment' ) ).forEach( function( element ) {
				element.classList.add( 'visible' );
				element.classList.remove( 'current-fragment' );
			} );
		}

		sync();

	}

	/**
	 * Binds all event listeners.
	 */
	function addEventListeners() {

		eventsAreBound = true;

		window.addEventListener( 'hashchange', onWindowHashChange, false );
		window.addEventListener( 'resize', onWindowResize, false );

		if( config.touch ) {
			dom.wrapper.addEventListener( 'touchstart', onTouchStart, false );
			dom.wrapper.addEventListener( 'touchmove', onTouchMove, false );
			dom.wrapper.addEventListener( 'touchend', onTouchEnd, false );

			// Support pointer-style touch interaction as well
			if( window.navigator.pointerEnabled ) {
				// IE 11 uses un-prefixed version of pointer events
				dom.wrapper.addEventListener( 'pointerdown', onPointerDown, false );
				dom.wrapper.addEventListener( 'pointermove', onPointerMove, false );
				dom.wrapper.addEventListener( 'pointerup', onPointerUp, false );
			}
			else if( window.navigator.msPointerEnabled ) {
				// IE 10 uses prefixed version of pointer events
				dom.wrapper.addEventListener( 'MSPointerDown', onPointerDown, false );
				dom.wrapper.addEventListener( 'MSPointerMove', onPointerMove, false );
				dom.wrapper.addEventListener( 'MSPointerUp', onPointerUp, false );
			}
		}

		if( config.keyboard ) {
			document.addEventListener( 'keydown', onDocumentKeyDown, false );
			document.addEventListener( 'keypress', onDocumentKeyPress, false );
		}

		if( config.progress && dom.progress ) {
			dom.progress.addEventListener( 'click', onProgressClicked, false );
		}

		if( config.focusBodyOnPageVisibilityChange ) {
			var visibilityChange;

			if( 'hidden' in document ) {
				visibilityChange = 'visibilitychange';
			}
			else if( 'msHidden' in document ) {
				visibilityChange = 'msvisibilitychange';
			}
			else if( 'webkitHidden' in document ) {
				visibilityChange = 'webkitvisibilitychange';
			}

			if( visibilityChange ) {
				document.addEventListener( visibilityChange, onPageVisibilityChange, false );
			}
		}

		// Listen to both touch and click events, in case the device
		// supports both
		var pointerEvents = [ 'touchstart', 'click' ];

		// Only support touch for Android, fixes double navigations in
		// stock browser
		if( UA.match( /android/gi ) ) {
			pointerEvents = [ 'touchstart' ];
		}

		pointerEvents.forEach( function( eventName ) {
			dom.controlsLeft.forEach( function( el ) { el.addEventListener( eventName, onNavigateLeftClicked, false ); } );
			dom.controlsRight.forEach( function( el ) { el.addEventListener( eventName, onNavigateRightClicked, false ); } );
			dom.controlsUp.forEach( function( el ) { el.addEventListener( eventName, onNavigateUpClicked, false ); } );
			dom.controlsDown.forEach( function( el ) { el.addEventListener( eventName, onNavigateDownClicked, false ); } );
			dom.controlsPrev.forEach( function( el ) { el.addEventListener( eventName, onNavigatePrevClicked, false ); } );
			dom.controlsNext.forEach( function( el ) { el.addEventListener( eventName, onNavigateNextClicked, false ); } );
		} );

	}

	/**
	 * Unbinds all event listeners.
	 */
	function removeEventListeners() {

		eventsAreBound = false;

		document.removeEventListener( 'keydown', onDocumentKeyDown, false );
		document.removeEventListener( 'keypress', onDocumentKeyPress, false );
		window.removeEventListener( 'hashchange', onWindowHashChange, false );
		window.removeEventListener( 'resize', onWindowResize, false );

		dom.wrapper.removeEventListener( 'touchstart', onTouchStart, false );
		dom.wrapper.removeEventListener( 'touchmove', onTouchMove, false );
		dom.wrapper.removeEventListener( 'touchend', onTouchEnd, false );

		// IE11
		if( window.navigator.pointerEnabled ) {
			dom.wrapper.removeEventListener( 'pointerdown', onPointerDown, false );
			dom.wrapper.removeEventListener( 'pointermove', onPointerMove, false );
			dom.wrapper.removeEventListener( 'pointerup', onPointerUp, false );
		}
		// IE10
		else if( window.navigator.msPointerEnabled ) {
			dom.wrapper.removeEventListener( 'MSPointerDown', onPointerDown, false );
			dom.wrapper.removeEventListener( 'MSPointerMove', onPointerMove, false );
			dom.wrapper.removeEventListener( 'MSPointerUp', onPointerUp, false );
		}

		if ( config.progress && dom.progress ) {
			dom.progress.removeEventListener( 'click', onProgressClicked, false );
		}

		[ 'touchstart', 'click' ].forEach( function( eventName ) {
			dom.controlsLeft.forEach( function( el ) { el.removeEventListener( eventName, onNavigateLeftClicked, false ); } );
			dom.controlsRight.forEach( function( el ) { el.removeEventListener( eventName, onNavigateRightClicked, false ); } );
			dom.controlsUp.forEach( function( el ) { el.removeEventListener( eventName, onNavigateUpClicked, false ); } );
			dom.controlsDown.forEach( function( el ) { el.removeEventListener( eventName, onNavigateDownClicked, false ); } );
			dom.controlsPrev.forEach( function( el ) { el.removeEventListener( eventName, onNavigatePrevClicked, false ); } );
			dom.controlsNext.forEach( function( el ) { el.removeEventListener( eventName, onNavigateNextClicked, false ); } );
		} );

	}

	/**
	 * Extend object a with the properties of object b.
	 * If there's a conflict, object b takes precedence.
	 */
	function extend( a, b ) {

		for( var i in b ) {
			a[ i ] = b[ i ];
		}

	}

	/**
	 * Converts the target object to an array.
	 */
	function toArray( o ) {

		return Array.prototype.slice.call( o );

	}

	/**
	 * Utility for deserializing a value.
	 */
	function deserialize( value ) {

		if( typeof value === 'string' ) {
			if( value === 'null' ) return null;
			else if( value === 'true' ) return true;
			else if( value === 'false' ) return false;
			else if( value.match( /^\d+$/ ) ) return parseFloat( value );
		}

		return value;

	}

	/**
	 * Measures the distance in pixels between point a
	 * and point b.
	 *
	 * @param {Object} a point with x/y properties
	 * @param {Object} b point with x/y properties
	 */
	function distanceBetween( a, b ) {

		var dx = a.x - b.x,
			dy = a.y - b.y;

		return Math.sqrt( dx*dx + dy*dy );

	}

	/**
	 * Applies a CSS transform to the target element.
	 */
	function transformElement( element, transform ) {

		element.style.WebkitTransform = transform;
		element.style.MozTransform = transform;
		element.style.msTransform = transform;
		element.style.transform = transform;

	}

	/**
	 * Applies CSS transforms to the slides container. The container
	 * is transformed from two separate sources: layout and the overview
	 * mode.
	 */
	function transformSlides( transforms ) {

		// Pick up new transforms from arguments
		if( typeof transforms.layout === 'string' ) slidesTransform.layout = transforms.layout;
		if( typeof transforms.overview === 'string' ) slidesTransform.overview = transforms.overview;

		// Apply the transforms to the slides container
		if( slidesTransform.layout ) {
			transformElement( dom.slides, slidesTransform.layout + ' ' + slidesTransform.overview );
		}
		else {
			transformElement( dom.slides, slidesTransform.overview );
		}

	}

	/**
	 * Injects the given CSS styles into the DOM.
	 */
	function injectStyleSheet( value ) {

		var tag = document.createElement( 'style' );
		tag.type = 'text/css';
		if( tag.styleSheet ) {
			tag.styleSheet.cssText = value;
		}
		else {
			tag.appendChild( document.createTextNode( value ) );
		}
		document.getElementsByTagName( 'head' )[0].appendChild( tag );

	}

	/**
	 * Converts various color input formats to an {r:0,g:0,b:0} object.
	 *
	 * @param {String} color The string representation of a color,
	 * the following formats are supported:
	 * - #000
	 * - #000000
	 * - rgb(0,0,0)
	 */
	function colorToRgb( color ) {

		var hex3 = color.match( /^#([0-9a-f]{3})$/i );
		if( hex3 && hex3[1] ) {
			hex3 = hex3[1];
			return {
				r: parseInt( hex3.charAt( 0 ), 16 ) * 0x11,
				g: parseInt( hex3.charAt( 1 ), 16 ) * 0x11,
				b: parseInt( hex3.charAt( 2 ), 16 ) * 0x11
			};
		}

		var hex6 = color.match( /^#([0-9a-f]{6})$/i );
		if( hex6 && hex6[1] ) {
			hex6 = hex6[1];
			return {
				r: parseInt( hex6.substr( 0, 2 ), 16 ),
				g: parseInt( hex6.substr( 2, 2 ), 16 ),
				b: parseInt( hex6.substr( 4, 2 ), 16 )
			};
		}

		var rgb = color.match( /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i );
		if( rgb ) {
			return {
				r: parseInt( rgb[1], 10 ),
				g: parseInt( rgb[2], 10 ),
				b: parseInt( rgb[3], 10 )
			};
		}

		var rgba = color.match( /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i );
		if( rgba ) {
			return {
				r: parseInt( rgba[1], 10 ),
				g: parseInt( rgba[2], 10 ),
				b: parseInt( rgba[3], 10 ),
				a: parseFloat( rgba[4] )
			};
		}

		return null;

	}

	/**
	 * Calculates brightness on a scale of 0-255.
	 *
	 * @param color See colorStringToRgb for supported formats.
	 */
	function colorBrightness( color ) {

		if( typeof color === 'string' ) color = colorToRgb( color );

		if( color ) {
			return ( color.r * 299 + color.g * 587 + color.b * 114 ) / 1000;
		}

		return null;

	}

	/**
	 * Retrieves the height of the given element by looking
	 * at the position and height of its immediate children.
	 */
	function getAbsoluteHeight( element ) {

		var height = 0;

		if( element ) {
			var absoluteChildren = 0;

			toArray( element.childNodes ).forEach( function( child ) {

				if( typeof child.offsetTop === 'number' && child.style ) {
					// Count # of abs children
					if( window.getComputedStyle( child ).position === 'absolute' ) {
						absoluteChildren += 1;
					}

					height = Math.max( height, child.offsetTop + child.offsetHeight );
				}

			} );

			// If there are no absolute children, use offsetHeight
			if( absoluteChildren === 0 ) {
				height = element.offsetHeight;
			}

		}

		return height;

	}

	/**
	 * Returns the remaining height within the parent of the
	 * target element.
	 *
	 * remaining height = [ configured parent height ] - [ current parent height ]
	 */
	function getRemainingHeight( element, height ) {

		height = height || 0;

		if( element ) {
			var newHeight, oldHeight = element.style.height;

			// Change the .stretch element height to 0 in order find the height of all
			// the other elements
			element.style.height = '0px';
			newHeight = height - element.parentNode.offsetHeight;

			// Restore the old height, just in case
			element.style.height = oldHeight + 'px';

			return newHeight;
		}

		return height;

	}

	/**
	 * Checks if this instance is being used to print a PDF.
	 */
	function isPrintingPDF() {

		return ( /print-pdf/gi ).test( window.location.search );

	}

	/**
	 * Hides the address bar if we're on a mobile device.
	 */
	function hideAddressBar() {

		if( config.hideAddressBar && isMobileDevice ) {
			// Events that should trigger the address bar to hide
			window.addEventListener( 'load', removeAddressBar, false );
			window.addEventListener( 'orientationchange', removeAddressBar, false );
		}

	}

	/**
	 * Causes the address bar to hide on mobile devices,
	 * more vertical space ftw.
	 */
	function removeAddressBar() {

		setTimeout( function() {
			window.scrollTo( 0, 1 );
		}, 10 );

	}

	/**
	 * Dispatches an event of the specified type from the
	 * reveal DOM element.
	 */
	function dispatchEvent( type, args ) {

		var event = document.createEvent( 'HTMLEvents', 1, 2 );
		event.initEvent( type, true, true );
		extend( event, args );
		dom.wrapper.dispatchEvent( event );

		// If we're in an iframe, post each reveal.js event to the
		// parent window. Used by the notes plugin
		if( config.postMessageEvents && window.parent !== window.self ) {
			window.parent.postMessage( JSON.stringify({ namespace: 'reveal', eventName: type, state: getState() }), '*' );
		}

	}

	/**
	 * Wrap all links in 3D goodness.
	 */
	function enableRollingLinks() {

		if( features.transforms3d && !( 'msPerspective' in document.body.style ) ) {
			var anchors = dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' a' );

			for( var i = 0, len = anchors.length; i < len; i++ ) {
				var anchor = anchors[i];

				if( anchor.textContent && !anchor.querySelector( '*' ) && ( !anchor.className || !anchor.classList.contains( anchor, 'roll' ) ) ) {
					var span = document.createElement('span');
					span.setAttribute('data-title', anchor.text);
					span.innerHTML = anchor.innerHTML;

					anchor.classList.add( 'roll' );
					anchor.innerHTML = '';
					anchor.appendChild(span);
				}
			}
		}

	}

	/**
	 * Unwrap all 3D links.
	 */
	function disableRollingLinks() {

		var anchors = dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' a.roll' );

		for( var i = 0, len = anchors.length; i < len; i++ ) {
			var anchor = anchors[i];
			var span = anchor.querySelector( 'span' );

			if( span ) {
				anchor.classList.remove( 'roll' );
				anchor.innerHTML = span.innerHTML;
			}
		}

	}

	/**
	 * Bind preview frame links.
	 */
	function enablePreviewLinks( selector ) {

		var anchors = toArray( document.querySelectorAll( selector ? selector : 'a' ) );

		anchors.forEach( function( element ) {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.addEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Unbind preview frame links.
	 */
	function disablePreviewLinks() {

		var anchors = toArray( document.querySelectorAll( 'a' ) );

		anchors.forEach( function( element ) {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.removeEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Opens a preview window for the target URL.
	 */
	function showPreview( url ) {

		closeOverlay();

		dom.overlay = document.createElement( 'div' );
		dom.overlay.classList.add( 'overlay' );
		dom.overlay.classList.add( 'overlay-preview' );
		dom.wrapper.appendChild( dom.overlay );

		dom.overlay.innerHTML = [
			'<header>',
				'<a class="close" href="#"><span class="icon"></span></a>',
				'<a class="external" href="'+ url +'" target="_blank"><span class="icon"></span></a>',
			'</header>',
			'<div class="spinner"></div>',
			'<div class="viewport">',
				'<iframe src="'+ url +'"></iframe>',
			'</div>'
		].join('');

		dom.overlay.querySelector( 'iframe' ).addEventListener( 'load', function( event ) {
			dom.overlay.classList.add( 'loaded' );
		}, false );

		dom.overlay.querySelector( '.close' ).addEventListener( 'click', function( event ) {
			closeOverlay();
			event.preventDefault();
		}, false );

		dom.overlay.querySelector( '.external' ).addEventListener( 'click', function( event ) {
			closeOverlay();
		}, false );

		setTimeout( function() {
			dom.overlay.classList.add( 'visible' );
		}, 1 );

	}

	/**
	 * Opens a overlay window with help material.
	 */
	function showHelp() {

		if( config.help ) {

			closeOverlay();

			dom.overlay = document.createElement( 'div' );
			dom.overlay.classList.add( 'overlay' );
			dom.overlay.classList.add( 'overlay-help' );
			dom.wrapper.appendChild( dom.overlay );

			var html = '<p class="title">Keyboard Shortcuts</p><br/>';

			html += '<table><th>KEY</th><th>ACTION</th>';
			for( var key in keyboardShortcuts ) {
				html += '<tr><td>' + key + '</td><td>' + keyboardShortcuts[ key ] + '</td></tr>';
			}

			html += '</table>';

			dom.overlay.innerHTML = [
				'<header>',
					'<a class="close" href="#"><span class="icon"></span></a>',
				'</header>',
				'<div class="viewport">',
					'<div class="viewport-inner">'+ html +'</div>',
				'</div>'
			].join('');

			dom.overlay.querySelector( '.close' ).addEventListener( 'click', function( event ) {
				closeOverlay();
				event.preventDefault();
			}, false );

			setTimeout( function() {
				dom.overlay.classList.add( 'visible' );
			}, 1 );

		}

	}

	/**
	 * Closes any currently open overlay.
	 */
	function closeOverlay() {

		if( dom.overlay ) {
			dom.overlay.parentNode.removeChild( dom.overlay );
			dom.overlay = null;
		}

	}

	/**
	 * Applies JavaScript-controlled layout rules to the
	 * presentation.
	 */
	function layout() {

		if( dom.wrapper && !isPrintingPDF() ) {

			var size = getComputedSlideSize();

			var slidePadding = 20; // TODO Dig this out of DOM

			// Layout the contents of the slides
			layoutSlideContents( config.width, config.height, slidePadding );

			dom.slides.style.width = size.width + 'px';
			dom.slides.style.height = size.height + 'px';

			// Determine scale of content to fit within available space
			scale = Math.min( size.presentationWidth / size.width, size.presentationHeight / size.height );

			// Respect max/min scale settings
			scale = Math.max( scale, config.minScale );
			scale = Math.min( scale, config.maxScale );

			// Don't apply any scaling styles if scale is 1
			if( scale === 1 ) {
				dom.slides.style.zoom = '';
				dom.slides.style.left = '';
				dom.slides.style.top = '';
				dom.slides.style.bottom = '';
				dom.slides.style.right = '';
				transformSlides( { layout: '' } );
			}
			else {
				// Prefer zoom for scaling up so that content remains crisp.
				// Don't use zoom to scale down since that can lead to shifts
				// in text layout/line breaks.
				if( scale > 1 && features.zoom ) {
					dom.slides.style.zoom = scale;
					dom.slides.style.left = '';
					dom.slides.style.top = '';
					dom.slides.style.bottom = '';
					dom.slides.style.right = '';
					transformSlides( { layout: '' } );
				}
				// Apply scale transform as a fallback
				else {
					dom.slides.style.zoom = '';
					dom.slides.style.left = '50%';
					dom.slides.style.top = '50%';
					dom.slides.style.bottom = 'auto';
					dom.slides.style.right = 'auto';
					transformSlides( { layout: 'translate(-50%, -50%) scale('+ scale +')' } );
				}
			}

			// Select all slides, vertical and horizontal
			var slides = toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) );

			for( var i = 0, len = slides.length; i < len; i++ ) {
				var slide = slides[ i ];

				// Don't bother updating invisible slides
				if( slide.style.display === 'none' ) {
					continue;
				}

				if( config.center || slide.classList.contains( 'center' ) ) {
					// Vertical stacks are not centred since their section
					// children will be
					if( slide.classList.contains( 'stack' ) ) {
						slide.style.top = 0;
					}
					else {
						slide.style.top = Math.max( ( ( size.height - getAbsoluteHeight( slide ) ) / 2 ) - slidePadding, 0 ) + 'px';
					}
				}
				else {
					slide.style.top = '';
				}

			}

			updateProgress();
			updateParallax();

		}

	}

	/**
	 * Applies layout logic to the contents of all slides in
	 * the presentation.
	 */
	function layoutSlideContents( width, height, padding ) {

		// Handle sizing of elements with the 'stretch' class
		toArray( dom.slides.querySelectorAll( 'section > .stretch' ) ).forEach( function( element ) {

			// Determine how much vertical space we can use
			var remainingHeight = getRemainingHeight( element, height );

			// Consider the aspect ratio of media elements
			if( /(img|video)/gi.test( element.nodeName ) ) {
				var nw = element.naturalWidth || element.videoWidth,
					nh = element.naturalHeight || element.videoHeight;

				var es = Math.min( width / nw, remainingHeight / nh );

				element.style.width = ( nw * es ) + 'px';
				element.style.height = ( nh * es ) + 'px';

			}
			else {
				element.style.width = width + 'px';
				element.style.height = remainingHeight + 'px';
			}

		} );

	}

	/**
	 * Calculates the computed pixel size of our slides. These
	 * values are based on the width and height configuration
	 * options.
	 */
	function getComputedSlideSize( presentationWidth, presentationHeight ) {

		var size = {
			// Slide size
			width: config.width,
			height: config.height,

			// Presentation size
			presentationWidth: presentationWidth || dom.wrapper.offsetWidth,
			presentationHeight: presentationHeight || dom.wrapper.offsetHeight
		};

		// Reduce available space by margin
		size.presentationWidth -= ( size.presentationWidth * config.margin );
		size.presentationHeight -= ( size.presentationHeight * config.margin );

		// Slide width may be a percentage of available width
		if( typeof size.width === 'string' && /%$/.test( size.width ) ) {
			size.width = parseInt( size.width, 10 ) / 100 * size.presentationWidth;
		}

		// Slide height may be a percentage of available height
		if( typeof size.height === 'string' && /%$/.test( size.height ) ) {
			size.height = parseInt( size.height, 10 ) / 100 * size.presentationHeight;
		}

		return size;

	}

	/**
	 * Stores the vertical index of a stack so that the same
	 * vertical slide can be selected when navigating to and
	 * from the stack.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 * @param {int} v Index to memorize
	 */
	function setPreviousVerticalIndex( stack, v ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' ) {
			stack.setAttribute( 'data-previous-indexv', v || 0 );
		}

	}

	/**
	 * Retrieves the vertical index which was stored using
	 * #setPreviousVerticalIndex() or 0 if no previous index
	 * exists.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 */
	function getPreviousVerticalIndex( stack ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' && stack.classList.contains( 'stack' ) ) {
			// Prefer manually defined start-indexv
			var attributeName = stack.hasAttribute( 'data-start-indexv' ) ? 'data-start-indexv' : 'data-previous-indexv';

			return parseInt( stack.getAttribute( attributeName ) || 0, 10 );
		}

		return 0;

	}

	/**
	 * Displays the overview of slides (quick nav) by scaling
	 * down and arranging all slide elements.
	 */
	function activateOverview() {

		// Only proceed if enabled in config
		if( config.overview && !isOverview() ) {

			overview = true;

			dom.wrapper.classList.add( 'overview' );
			dom.wrapper.classList.remove( 'overview-deactivating' );

			if( features.overviewTransitions ) {
				setTimeout( function() {
					dom.wrapper.classList.add( 'overview-animated' );
				}, 1 );
			}

			// Don't auto-slide while in overview mode
			cancelAutoSlide();

			// Move the backgrounds element into the slide container to
			// that the same scaling is applied
			dom.slides.appendChild( dom.background );

			// Clicking on an overview slide navigates to it
			toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {
				if( !slide.classList.contains( 'stack' ) ) {
					slide.addEventListener( 'click', onOverviewSlideClicked, true );
				}
			} );

			// Calculate slide sizes
			var margin = 70;
			var slideSize = getComputedSlideSize();
			overviewSlideWidth = slideSize.width + margin;
			overviewSlideHeight = slideSize.height + margin;

			// Reverse in RTL mode
			if( config.rtl ) {
				overviewSlideWidth = -overviewSlideWidth;
			}

			updateSlidesVisibility();
			layoutOverview();
			updateOverview();

			layout();

			// Notify observers of the overview showing
			dispatchEvent( 'overviewshown', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );

		}

	}

	/**
	 * Uses CSS transforms to position all slides in a grid for
	 * display inside of the overview mode.
	 */
	function layoutOverview() {

		// Layout slides
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( hslide, h ) {
			hslide.setAttribute( 'data-index-h', h );
			transformElement( hslide, 'translate3d(' + ( h * overviewSlideWidth ) + 'px, 0, 0)' );

			if( hslide.classList.contains( 'stack' ) ) {

				toArray( hslide.querySelectorAll( 'section' ) ).forEach( function( vslide, v ) {
					vslide.setAttribute( 'data-index-h', h );
					vslide.setAttribute( 'data-index-v', v );

					transformElement( vslide, 'translate3d(0, ' + ( v * overviewSlideHeight ) + 'px, 0)' );
				} );

			}
		} );

		// Layout slide backgrounds
		toArray( dom.background.childNodes ).forEach( function( hbackground, h ) {
			transformElement( hbackground, 'translate3d(' + ( h * overviewSlideWidth ) + 'px, 0, 0)' );

			toArray( hbackground.querySelectorAll( '.slide-background' ) ).forEach( function( vbackground, v ) {
				transformElement( vbackground, 'translate3d(0, ' + ( v * overviewSlideHeight ) + 'px, 0)' );
			} );
		} );

	}

	/**
	 * Moves the overview viewport to the current slides.
	 * Called each time the current slide changes.
	 */
	function updateOverview() {

		transformSlides( {
			overview: [
				'translateX('+ ( -indexh * overviewSlideWidth ) +'px)',
				'translateY('+ ( -indexv * overviewSlideHeight ) +'px)',
				'translateZ('+ ( window.innerWidth < 400 ? -1000 : -2500 ) +'px)'
			].join( ' ' )
		} );

	}

	/**
	 * Exits the slide overview and enters the currently
	 * active slide.
	 */
	function deactivateOverview() {

		// Only proceed if enabled in config
		if( config.overview ) {

			overview = false;

			dom.wrapper.classList.remove( 'overview' );
			dom.wrapper.classList.remove( 'overview-animated' );

			// Temporarily add a class so that transitions can do different things
			// depending on whether they are exiting/entering overview, or just
			// moving from slide to slide
			dom.wrapper.classList.add( 'overview-deactivating' );

			setTimeout( function () {
				dom.wrapper.classList.remove( 'overview-deactivating' );
			}, 1 );

			// Move the background element back out
			dom.wrapper.appendChild( dom.background );

			// Clean up changes made to slides
			toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {
				transformElement( slide, '' );

				slide.removeEventListener( 'click', onOverviewSlideClicked, true );
			} );

			// Clean up changes made to backgrounds
			toArray( dom.background.querySelectorAll( '.slide-background' ) ).forEach( function( background ) {
				transformElement( background, '' );
			} );

			transformSlides( { overview: '' } );

			slide( indexh, indexv );

			layout();

			cueAutoSlide();

			// Notify observers of the overview hiding
			dispatchEvent( 'overviewhidden', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );

		}
	}

	/**
	 * Toggles the slide overview mode on and off.
	 *
	 * @param {Boolean} override Optional flag which overrides the
	 * toggle logic and forcibly sets the desired state. True means
	 * overview is open, false means it's closed.
	 */
	function toggleOverview( override ) {

		if( typeof override === 'boolean' ) {
			override ? activateOverview() : deactivateOverview();
		}
		else {
			isOverview() ? deactivateOverview() : activateOverview();
		}

	}

	/**
	 * Checks if the overview is currently active.
	 *
	 * @return {Boolean} true if the overview is active,
	 * false otherwise
	 */
	function isOverview() {

		return overview;

	}

	/**
	 * Checks if the current or specified slide is vertical
	 * (nested within another slide).
	 *
	 * @param {HTMLElement} slide [optional] The slide to check
	 * orientation of
	 */
	function isVerticalSlide( slide ) {

		// Prefer slide argument, otherwise use current slide
		slide = slide ? slide : currentSlide;

		return slide && slide.parentNode && !!slide.parentNode.nodeName.match( /section/i );

	}

	/**
	 * Handling the fullscreen functionality via the fullscreen API
	 *
	 * @see http://fullscreen.spec.whatwg.org/
	 * @see https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
	 */
	function enterFullscreen() {

		var element = document.body;

		// Check which implementation is available
		var requestMethod = element.requestFullScreen ||
							element.webkitRequestFullscreen ||
							element.webkitRequestFullScreen ||
							element.mozRequestFullScreen ||
							element.msRequestFullscreen;

		if( requestMethod ) {
			requestMethod.apply( element );
		}

	}

	/**
	 * Enters the paused mode which fades everything on screen to
	 * black.
	 */
	function pause() {

		if( config.pause ) {
			var wasPaused = dom.wrapper.classList.contains( 'paused' );

			cancelAutoSlide();
			dom.wrapper.classList.add( 'paused' );

			if( wasPaused === false ) {
				dispatchEvent( 'paused' );
			}
		}

	}

	/**
	 * Exits from the paused mode.
	 */
	function resume() {

		var wasPaused = dom.wrapper.classList.contains( 'paused' );
		dom.wrapper.classList.remove( 'paused' );

		cueAutoSlide();

		if( wasPaused ) {
			dispatchEvent( 'resumed' );
		}

	}

	/**
	 * Toggles the paused mode on and off.
	 */
	function togglePause( override ) {

		if( typeof override === 'boolean' ) {
			override ? pause() : resume();
		}
		else {
			isPaused() ? resume() : pause();
		}

	}

	/**
	 * Checks if we are currently in the paused mode.
	 */
	function isPaused() {

		return dom.wrapper.classList.contains( 'paused' );

	}

	/**
	 * Toggles the auto slide mode on and off.
	 *
	 * @param {Boolean} override Optional flag which sets the desired state.
	 * True means autoplay starts, false means it stops.
	 */

	function toggleAutoSlide( override ) {

		if( typeof override === 'boolean' ) {
			override ? resumeAutoSlide() : pauseAutoSlide();
		}

		else {
			autoSlidePaused ? resumeAutoSlide() : pauseAutoSlide();
		}

	}

	/**
	 * Checks if the auto slide mode is currently on.
	 */
	function isAutoSliding() {

		return !!( autoSlide && !autoSlidePaused );

	}

	/**
	 * Steps from the current point in the presentation to the
	 * slide which matches the specified horizontal and vertical
	 * indices.
	 *
	 * @param {int} h Horizontal index of the target slide
	 * @param {int} v Vertical index of the target slide
	 * @param {int} f Optional index of a fragment within the
	 * target slide to activate
	 * @param {int} o Optional origin for use in multimaster environments
	 */
	function slide( h, v, f, o ) {

		// Remember where we were at before
		previousSlide = currentSlide;

		// Query all horizontal slides in the deck
		var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR );

		// If no vertical index is specified and the upcoming slide is a
		// stack, resume at its previous vertical index
		if( v === undefined && !isOverview() ) {
			v = getPreviousVerticalIndex( horizontalSlides[ h ] );
		}

		// If we were on a vertical stack, remember what vertical index
		// it was on so we can resume at the same position when returning
		if( previousSlide && previousSlide.parentNode && previousSlide.parentNode.classList.contains( 'stack' ) ) {
			setPreviousVerticalIndex( previousSlide.parentNode, indexv );
		}

		// Remember the state before this slide
		var stateBefore = state.concat();

		// Reset the state array
		state.length = 0;

		var indexhBefore = indexh || 0,
			indexvBefore = indexv || 0;

		// Activate and transition to the new slide
		indexh = updateSlides( HORIZONTAL_SLIDES_SELECTOR, h === undefined ? indexh : h );
		indexv = updateSlides( VERTICAL_SLIDES_SELECTOR, v === undefined ? indexv : v );

		// Update the visibility of slides now that the indices have changed
		updateSlidesVisibility();

		layout();

		// Apply the new state
		stateLoop: for( var i = 0, len = state.length; i < len; i++ ) {
			// Check if this state existed on the previous slide. If it
			// did, we will avoid adding it repeatedly
			for( var j = 0; j < stateBefore.length; j++ ) {
				if( stateBefore[j] === state[i] ) {
					stateBefore.splice( j, 1 );
					continue stateLoop;
				}
			}

			document.documentElement.classList.add( state[i] );

			// Dispatch custom event matching the state's name
			dispatchEvent( state[i] );
		}

		// Clean up the remains of the previous state
		while( stateBefore.length ) {
			document.documentElement.classList.remove( stateBefore.pop() );
		}

		// Update the overview if it's currently active
		if( isOverview() ) {
			updateOverview();
		}

		// Find the current horizontal slide and any possible vertical slides
		// within it
		var currentHorizontalSlide = horizontalSlides[ indexh ],
			currentVerticalSlides = currentHorizontalSlide.querySelectorAll( 'section' );

		// Store references to the previous and current slides
		currentSlide = currentVerticalSlides[ indexv ] || currentHorizontalSlide;

		// Show fragment, if specified
		if( typeof f !== 'undefined' ) {
			navigateFragment( f );
		}

		// Dispatch an event if the slide changed
		var slideChanged = ( indexh !== indexhBefore || indexv !== indexvBefore );
		if( slideChanged ) {
			dispatchEvent( 'slidechanged', {
				'indexh': indexh,
				'indexv': indexv,
				'previousSlide': previousSlide,
				'currentSlide': currentSlide,
				'origin': o
			} );
		}
		else {
			// Ensure that the previous slide is never the same as the current
			previousSlide = null;
		}

		// Solves an edge case where the previous slide maintains the
		// 'present' class when navigating between adjacent vertical
		// stacks
		if( previousSlide ) {
			previousSlide.classList.remove( 'present' );
			previousSlide.setAttribute( 'aria-hidden', 'true' );

			// Reset all slides upon navigate to home
			// Issue: #285
			if ( dom.wrapper.querySelector( HOME_SLIDE_SELECTOR ).classList.contains( 'present' ) ) {
				// Launch async task
				setTimeout( function () {
					var slides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.stack') ), i;
					for( i in slides ) {
						if( slides[i] ) {
							// Reset stack
							setPreviousVerticalIndex( slides[i], 0 );
						}
					}
				}, 0 );
			}
		}

		// Handle embedded content
		if( slideChanged || !previousSlide ) {
			stopEmbeddedContent( previousSlide );
			startEmbeddedContent( currentSlide );
		}

		// Announce the current slide contents, for screen readers
		dom.statusDiv.textContent = currentSlide.textContent;

		updateControls();
		updateProgress();
		updateBackground();
		updateParallax();
		updateSlideNumber();
		updateNotes();

		// Update the URL hash
		writeURL();

		cueAutoSlide();

	}

	/**
	 * Syncs the presentation with the current DOM. Useful
	 * when new slides or control elements are added or when
	 * the configuration has changed.
	 */
	function sync() {

		// Subscribe to input
		removeEventListeners();
		addEventListeners();

		// Force a layout to make sure the current config is accounted for
		layout();

		// Reflect the current autoSlide value
		autoSlide = config.autoSlide;

		// Start auto-sliding if it's enabled
		cueAutoSlide();

		// Re-create the slide backgrounds
		createBackgrounds();

		// Write the current hash to the URL
		writeURL();

		sortAllFragments();

		updateControls();
		updateProgress();
		updateBackground( true );
		updateSlideNumber();
		updateSlidesVisibility();
		updateNotes();

		formatEmbeddedContent();
		startEmbeddedContent( currentSlide );

		if( isOverview() ) {
			layoutOverview();
		}

	}

	/**
	 * Resets all vertical slides so that only the first
	 * is visible.
	 */
	function resetVerticalSlides() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );
		horizontalSlides.forEach( function( horizontalSlide ) {

			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );
			verticalSlides.forEach( function( verticalSlide, y ) {

				if( y > 0 ) {
					verticalSlide.classList.remove( 'present' );
					verticalSlide.classList.remove( 'past' );
					verticalSlide.classList.add( 'future' );
					verticalSlide.setAttribute( 'aria-hidden', 'true' );
				}

			} );

		} );

	}

	/**
	 * Sorts and formats all of fragments in the
	 * presentation.
	 */
	function sortAllFragments() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );
		horizontalSlides.forEach( function( horizontalSlide ) {

			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );
			verticalSlides.forEach( function( verticalSlide, y ) {

				sortFragments( verticalSlide.querySelectorAll( '.fragment' ) );

			} );

			if( verticalSlides.length === 0 ) sortFragments( horizontalSlide.querySelectorAll( '.fragment' ) );

		} );

	}

	/**
	 * Randomly shuffles all slides in the deck.
	 */
	function shuffle() {

		var slides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

		slides.forEach( function( slide ) {

			// Insert this slide next to another random slide. This may
			// cause the slide to insert before itself but that's fine.
			dom.slides.insertBefore( slide, slides[ Math.floor( Math.random() * slides.length ) ] );

		} );

	}

	/**
	 * Updates one dimension of slides by showing the slide
	 * with the specified index.
	 *
	 * @param {String} selector A CSS selector that will fetch
	 * the group of slides we are working with
	 * @param {Number} index The index of the slide that should be
	 * shown
	 *
	 * @return {Number} The index of the slide that is now shown,
	 * might differ from the passed in index if it was out of
	 * bounds.
	 */
	function updateSlides( selector, index ) {

		// Select all slides and convert the NodeList result to
		// an array
		var slides = toArray( dom.wrapper.querySelectorAll( selector ) ),
			slidesLength = slides.length;

		var printMode = isPrintingPDF();

		if( slidesLength ) {

			// Should the index loop?
			if( config.loop ) {
				index %= slidesLength;

				if( index < 0 ) {
					index = slidesLength + index;
				}
			}

			// Enforce max and minimum index bounds
			index = Math.max( Math.min( index, slidesLength - 1 ), 0 );

			for( var i = 0; i < slidesLength; i++ ) {
				var element = slides[i];

				var reverse = config.rtl && !isVerticalSlide( element );

				element.classList.remove( 'past' );
				element.classList.remove( 'present' );
				element.classList.remove( 'future' );

				// http://www.w3.org/html/wg/drafts/html/master/editing.html#the-hidden-attribute
				element.setAttribute( 'hidden', '' );
				element.setAttribute( 'aria-hidden', 'true' );

				// If this element contains vertical slides
				if( element.querySelector( 'section' ) ) {
					element.classList.add( 'stack' );
				}

				// If we're printing static slides, all slides are "present"
				if( printMode ) {
					element.classList.add( 'present' );
					continue;
				}

				if( i < index ) {
					// Any element previous to index is given the 'past' class
					element.classList.add( reverse ? 'future' : 'past' );

					if( config.fragments ) {
						var pastFragments = toArray( element.querySelectorAll( '.fragment' ) );

						// Show all fragments on prior slides
						while( pastFragments.length ) {
							var pastFragment = pastFragments.pop();
							pastFragment.classList.add( 'visible' );
							pastFragment.classList.remove( 'current-fragment' );
						}
					}
				}
				else if( i > index ) {
					// Any element subsequent to index is given the 'future' class
					element.classList.add( reverse ? 'past' : 'future' );

					if( config.fragments ) {
						var futureFragments = toArray( element.querySelectorAll( '.fragment.visible' ) );

						// No fragments in future slides should be visible ahead of time
						while( futureFragments.length ) {
							var futureFragment = futureFragments.pop();
							futureFragment.classList.remove( 'visible' );
							futureFragment.classList.remove( 'current-fragment' );
						}
					}
				}
			}

			// Mark the current slide as present
			slides[index].classList.add( 'present' );
			slides[index].removeAttribute( 'hidden' );
			slides[index].removeAttribute( 'aria-hidden' );

			// If this slide has a state associated with it, add it
			// onto the current state of the deck
			var slideState = slides[index].getAttribute( 'data-state' );
			if( slideState ) {
				state = state.concat( slideState.split( ' ' ) );
			}

		}
		else {
			// Since there are no slides we can't be anywhere beyond the
			// zeroth index
			index = 0;
		}

		return index;

	}

	/**
	 * Optimization method; hide all slides that are far away
	 * from the present slide.
	 */
	function updateSlidesVisibility() {

		// Select all slides and convert the NodeList result to
		// an array
		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ),
			horizontalSlidesLength = horizontalSlides.length,
			distanceX,
			distanceY;

		if( horizontalSlidesLength && typeof indexh !== 'undefined' ) {

			// The number of steps away from the present slide that will
			// be visible
			var viewDistance = isOverview() ? 10 : config.viewDistance;

			// Limit view distance on weaker devices
			if( isMobileDevice ) {
				viewDistance = isOverview() ? 6 : 2;
			}

			// All slides need to be visible when exporting to PDF
			if( isPrintingPDF() ) {
				viewDistance = Number.MAX_VALUE;
			}

			for( var x = 0; x < horizontalSlidesLength; x++ ) {
				var horizontalSlide = horizontalSlides[x];

				var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) ),
					verticalSlidesLength = verticalSlides.length;

				// Determine how far away this slide is from the present
				distanceX = Math.abs( ( indexh || 0 ) - x ) || 0;

				// If the presentation is looped, distance should measure
				// 1 between the first and last slides
				if( config.loop ) {
					distanceX = Math.abs( ( ( indexh || 0 ) - x ) % ( horizontalSlidesLength - viewDistance ) ) || 0;
				}

				// Show the horizontal slide if it's within the view distance
				if( distanceX < viewDistance ) {
					showSlide( horizontalSlide );
				}
				else {
					hideSlide( horizontalSlide );
				}

				if( verticalSlidesLength ) {

					var oy = getPreviousVerticalIndex( horizontalSlide );

					for( var y = 0; y < verticalSlidesLength; y++ ) {
						var verticalSlide = verticalSlides[y];

						distanceY = x === ( indexh || 0 ) ? Math.abs( ( indexv || 0 ) - y ) : Math.abs( y - oy );

						if( distanceX + distanceY < viewDistance ) {
							showSlide( verticalSlide );
						}
						else {
							hideSlide( verticalSlide );
						}
					}

				}
			}

		}

	}

	/**
	 * Pick up notes from the current slide and display tham
	 * to the viewer.
	 *
	 * @see `showNotes` config value
	 */
	function updateNotes() {

		if( config.showNotes && dom.speakerNotes && currentSlide && !isPrintingPDF() ) {

			dom.speakerNotes.innerHTML = getSlideNotes() || '';

		}

	}

	/**
	 * Updates the progress bar to reflect the current slide.
	 */
	function updateProgress() {

		// Update progress if enabled
		if( config.progress && dom.progressbar ) {

			dom.progressbar.style.width = getProgress() * dom.wrapper.offsetWidth + 'px';

		}

	}

	/**
	 * Updates the slide number div to reflect the current slide.
	 *
	 * The following slide number formats are available:
	 *  "h.v": 	horizontal . vertical slide number (default)
	 *  "h/v": 	horizontal / vertical slide number
	 *    "c": 	flattened slide number
	 *  "c/t": 	flattened slide number / total slides
	 */
	function updateSlideNumber() {

		// Update slide number if enabled
		if( config.slideNumber && dom.slideNumber ) {

			var value = [];
			var format = 'h.v';

			// Check if a custom number format is available
			if( typeof config.slideNumber === 'string' ) {
				format = config.slideNumber;
			}

			switch( format ) {
				case 'c':
					value.push( getSlidePastCount() + 1 );
					break;
				case 'c/t':
					value.push( getSlidePastCount() + 1, '/', getTotalSlides() );
					break;
				case 'h/v':
					value.push( indexh + 1 );
					if( isVerticalSlide() ) value.push( '/', indexv + 1 );
					break;
				default:
					value.push( indexh + 1 );
					if( isVerticalSlide() ) value.push( '.', indexv + 1 );
			}

			dom.slideNumber.innerHTML = formatSlideNumber( value[0], value[1], value[2] );
		}

	}

	/**
	 * Applies HTML formatting to a slide number before it's
	 * written to the DOM.
	 */
	function formatSlideNumber( a, delimiter, b ) {

		if( typeof b === 'number' && !isNaN( b ) ) {
			return  '<span class="slide-number-a">'+ a +'</span>' +
					'<span class="slide-number-delimiter">'+ delimiter +'</span>' +
					'<span class="slide-number-b">'+ b +'</span>';
		}
		else {
			return '<span class="slide-number-a">'+ a +'</span>';
		}

	}

	/**
	 * Updates the state of all control/navigation arrows.
	 */
	function updateControls() {

		var routes = availableRoutes();
		var fragments = availableFragments();

		// Remove the 'enabled' class from all directions
		dom.controlsLeft.concat( dom.controlsRight )
						.concat( dom.controlsUp )
						.concat( dom.controlsDown )
						.concat( dom.controlsPrev )
						.concat( dom.controlsNext ).forEach( function( node ) {
			node.classList.remove( 'enabled' );
			node.classList.remove( 'fragmented' );
		} );

		// Add the 'enabled' class to the available routes
		if( routes.left ) dom.controlsLeft.forEach( function( el ) { el.classList.add( 'enabled' );	} );
		if( routes.right ) dom.controlsRight.forEach( function( el ) { el.classList.add( 'enabled' ); } );
		if( routes.up ) dom.controlsUp.forEach( function( el ) { el.classList.add( 'enabled' );	} );
		if( routes.down ) dom.controlsDown.forEach( function( el ) { el.classList.add( 'enabled' ); } );

		// Prev/next buttons
		if( routes.left || routes.up ) dom.controlsPrev.forEach( function( el ) { el.classList.add( 'enabled' ); } );
		if( routes.right || routes.down ) dom.controlsNext.forEach( function( el ) { el.classList.add( 'enabled' ); } );

		// Highlight fragment directions
		if( currentSlide ) {

			// Always apply fragment decorator to prev/next buttons
			if( fragments.prev ) dom.controlsPrev.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); } );
			if( fragments.next ) dom.controlsNext.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); } );

			// Apply fragment decorators to directional buttons based on
			// what slide axis they are in
			if( isVerticalSlide( currentSlide ) ) {
				if( fragments.prev ) dom.controlsUp.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); } );
				if( fragments.next ) dom.controlsDown.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); } );
			}
			else {
				if( fragments.prev ) dom.controlsLeft.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); } );
				if( fragments.next ) dom.controlsRight.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); } );
			}

		}

	}

	/**
	 * Updates the background elements to reflect the current
	 * slide.
	 *
	 * @param {Boolean} includeAll If true, the backgrounds of
	 * all vertical slides (not just the present) will be updated.
	 */
	function updateBackground( includeAll ) {

		var currentBackground = null;

		// Reverse past/future classes when in RTL mode
		var horizontalPast = config.rtl ? 'future' : 'past',
			horizontalFuture = config.rtl ? 'past' : 'future';

		// Update the classes of all backgrounds to match the
		// states of their slides (past/present/future)
		toArray( dom.background.childNodes ).forEach( function( backgroundh, h ) {

			backgroundh.classList.remove( 'past' );
			backgroundh.classList.remove( 'present' );
			backgroundh.classList.remove( 'future' );

			if( h < indexh ) {
				backgroundh.classList.add( horizontalPast );
			}
			else if ( h > indexh ) {
				backgroundh.classList.add( horizontalFuture );
			}
			else {
				backgroundh.classList.add( 'present' );

				// Store a reference to the current background element
				currentBackground = backgroundh;
			}

			if( includeAll || h === indexh ) {
				toArray( backgroundh.querySelectorAll( '.slide-background' ) ).forEach( function( backgroundv, v ) {

					backgroundv.classList.remove( 'past' );
					backgroundv.classList.remove( 'present' );
					backgroundv.classList.remove( 'future' );

					if( v < indexv ) {
						backgroundv.classList.add( 'past' );
					}
					else if ( v > indexv ) {
						backgroundv.classList.add( 'future' );
					}
					else {
						backgroundv.classList.add( 'present' );

						// Only if this is the present horizontal and vertical slide
						if( h === indexh ) currentBackground = backgroundv;
					}

				} );
			}

		} );

		// Stop any currently playing video background
		if( previousBackground ) {

			var previousVideo = previousBackground.querySelector( 'video' );
			if( previousVideo ) previousVideo.pause();

		}

		if( currentBackground ) {

			// Start video playback
			var currentVideo = currentBackground.querySelector( 'video' );
			if( currentVideo ) {

				var startVideo = function() {
					currentVideo.currentTime = 0;
					currentVideo.play();
					currentVideo.removeEventListener( 'loadeddata', startVideo );
				};

				if( currentVideo.readyState > 1 ) {
					startVideo();
				}
				else {
					currentVideo.addEventListener( 'loadeddata', startVideo );
				}

			}

			var backgroundImageURL = currentBackground.style.backgroundImage || '';

			// Restart GIFs (doesn't work in Firefox)
			if( /\.gif/i.test( backgroundImageURL ) ) {
				currentBackground.style.backgroundImage = '';
				window.getComputedStyle( currentBackground ).opacity;
				currentBackground.style.backgroundImage = backgroundImageURL;
			}

			// Don't transition between identical backgrounds. This
			// prevents unwanted flicker.
			var previousBackgroundHash = previousBackground ? previousBackground.getAttribute( 'data-background-hash' ) : null;
			var currentBackgroundHash = currentBackground.getAttribute( 'data-background-hash' );
			if( currentBackgroundHash && currentBackgroundHash === previousBackgroundHash && currentBackground !== previousBackground ) {
				dom.background.classList.add( 'no-transition' );
			}

			previousBackground = currentBackground;

		}

		// If there's a background brightness flag for this slide,
		// bubble it to the .reveal container
		if( currentSlide ) {
			[ 'has-light-background', 'has-dark-background' ].forEach( function( classToBubble ) {
				if( currentSlide.classList.contains( classToBubble ) ) {
					dom.wrapper.classList.add( classToBubble );
				}
				else {
					dom.wrapper.classList.remove( classToBubble );
				}
			} );
		}

		// Allow the first background to apply without transition
		setTimeout( function() {
			dom.background.classList.remove( 'no-transition' );
		}, 1 );

	}

	/**
	 * Updates the position of the parallax background based
	 * on the current slide index.
	 */
	function updateParallax() {

		if( config.parallaxBackgroundImage ) {

			var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ),
				verticalSlides = dom.wrapper.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

			var backgroundSize = dom.background.style.backgroundSize.split( ' ' ),
				backgroundWidth, backgroundHeight;

			if( backgroundSize.length === 1 ) {
				backgroundWidth = backgroundHeight = parseInt( backgroundSize[0], 10 );
			}
			else {
				backgroundWidth = parseInt( backgroundSize[0], 10 );
				backgroundHeight = parseInt( backgroundSize[1], 10 );
			}

			var slideWidth = dom.background.offsetWidth,
				horizontalSlideCount = horizontalSlides.length,
				horizontalOffsetMultiplier,
				horizontalOffset;

			if( typeof config.parallaxBackgroundHorizontal === 'number' ) {
				horizontalOffsetMultiplier = config.parallaxBackgroundHorizontal;
			}
			else {
				horizontalOffsetMultiplier = horizontalSlideCount > 1 ? ( backgroundWidth - slideWidth ) / ( horizontalSlideCount-1 ) : 0;
			}

			horizontalOffset = horizontalOffsetMultiplier * indexh * -1;

			var slideHeight = dom.background.offsetHeight,
				verticalSlideCount = verticalSlides.length,
				verticalOffsetMultiplier,
				verticalOffset;

			if( typeof config.parallaxBackgroundVertical === 'number' ) {
				verticalOffsetMultiplier = config.parallaxBackgroundVertical;
			}
			else {
				verticalOffsetMultiplier = ( backgroundHeight - slideHeight ) / ( verticalSlideCount-1 );
			}

			verticalOffset = verticalSlideCount > 0 ?  verticalOffsetMultiplier * indexv * 1 : 0;

			dom.background.style.backgroundPosition = horizontalOffset + 'px ' + -verticalOffset + 'px';

		}

	}

	/**
	 * Called when the given slide is within the configured view
	 * distance. Shows the slide element and loads any content
	 * that is set to load lazily (data-src).
	 */
	function showSlide( slide ) {

		// Show the slide element
		slide.style.display = 'block';

		// Media elements with data-src attributes
		toArray( slide.querySelectorAll( 'img[data-src], video[data-src], audio[data-src]' ) ).forEach( function( element ) {
			element.setAttribute( 'src', element.getAttribute( 'data-src' ) );
			element.removeAttribute( 'data-src' );
		} );

		// Media elements with <source> children
		toArray( slide.querySelectorAll( 'video, audio' ) ).forEach( function( media ) {
			var sources = 0;

			toArray( media.querySelectorAll( 'source[data-src]' ) ).forEach( function( source ) {
				source.setAttribute( 'src', source.getAttribute( 'data-src' ) );
				source.removeAttribute( 'data-src' );
				sources += 1;
			} );

			// If we rewrote sources for this video/audio element, we need
			// to manually tell it to load from its new origin
			if( sources > 0 ) {
				media.load();
			}
		} );


		// Show the corresponding background element
		var indices = getIndices( slide );
		var background = getSlideBackground( indices.h, indices.v );
		if( background ) {
			background.style.display = 'block';

			// If the background contains media, load it
			if( background.hasAttribute( 'data-loaded' ) === false ) {
				background.setAttribute( 'data-loaded', 'true' );

				var backgroundImage = slide.getAttribute( 'data-background-image' ),
					backgroundVideo = slide.getAttribute( 'data-background-video' ),
					backgroundVideoLoop = slide.hasAttribute( 'data-background-video-loop' ),
					backgroundVideoMuted = slide.hasAttribute( 'data-background-video-muted' ),
					backgroundIframe = slide.getAttribute( 'data-background-iframe' );

				// Images
				if( backgroundImage ) {
					background.style.backgroundImage = 'url('+ backgroundImage +')';
				}
				// Videos
				else if ( backgroundVideo && !isSpeakerNotes() ) {
					var video = document.createElement( 'video' );

					if( backgroundVideoLoop ) {
						video.setAttribute( 'loop', '' );
					}

					if( backgroundVideoMuted ) {
						video.muted = true;
					}

					// Support comma separated lists of video sources
					backgroundVideo.split( ',' ).forEach( function( source ) {
						video.innerHTML += '<source src="'+ source +'">';
					} );

					background.appendChild( video );
				}
				// Iframes
				else if( backgroundIframe ) {
					var iframe = document.createElement( 'iframe' );
						iframe.setAttribute( 'src', backgroundIframe );
						iframe.style.width  = '100%';
						iframe.style.height = '100%';
						iframe.style.maxHeight = '100%';
						iframe.style.maxWidth = '100%';

					background.appendChild( iframe );
				}
			}
		}

	}

	/**
	 * Called when the given slide is moved outside of the
	 * configured view distance.
	 */
	function hideSlide( slide ) {

		// Hide the slide element
		slide.style.display = 'none';

		// Hide the corresponding background element
		var indices = getIndices( slide );
		var background = getSlideBackground( indices.h, indices.v );
		if( background ) {
			background.style.display = 'none';
		}

	}

	/**
	 * Determine what available routes there are for navigation.
	 *
	 * @return {Object} containing four booleans: left/right/up/down
	 */
	function availableRoutes() {

		var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ),
			verticalSlides = dom.wrapper.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

		var routes = {
			left: indexh > 0 || config.loop,
			right: indexh < horizontalSlides.length - 1 || config.loop,
			up: indexv > 0,
			down: indexv < verticalSlides.length - 1
		};

		// reverse horizontal controls for rtl
		if( config.rtl ) {
			var left = routes.left;
			routes.left = routes.right;
			routes.right = left;
		}

		return routes;

	}

	/**
	 * Returns an object describing the available fragment
	 * directions.
	 *
	 * @return {Object} two boolean properties: prev/next
	 */
	function availableFragments() {

		if( currentSlide && config.fragments ) {
			var fragments = currentSlide.querySelectorAll( '.fragment' );
			var hiddenFragments = currentSlide.querySelectorAll( '.fragment:not(.visible)' );

			return {
				prev: fragments.length - hiddenFragments.length > 0,
				next: !!hiddenFragments.length
			};
		}
		else {
			return { prev: false, next: false };
		}

	}

	/**
	 * Enforces origin-specific format rules for embedded media.
	 */
	function formatEmbeddedContent() {

		var _appendParamToIframeSource = function( sourceAttribute, sourceURL, param ) {
			toArray( dom.slides.querySelectorAll( 'iframe['+ sourceAttribute +'*="'+ sourceURL +'"]' ) ).forEach( function( el ) {
				var src = el.getAttribute( sourceAttribute );
				if( src && src.indexOf( param ) === -1 ) {
					el.setAttribute( sourceAttribute, src + ( !/\?/.test( src ) ? '?' : '&' ) + param );
				}
			});
		};

		// YouTube frames must include "?enablejsapi=1"
		_appendParamToIframeSource( 'src', 'youtube.com/embed/', 'enablejsapi=1' );
		_appendParamToIframeSource( 'data-src', 'youtube.com/embed/', 'enablejsapi=1' );

		// Vimeo frames must include "?api=1"
		_appendParamToIframeSource( 'src', 'player.vimeo.com/', 'api=1' );
		_appendParamToIframeSource( 'data-src', 'player.vimeo.com/', 'api=1' );

	}

	/**
	 * Start playback of any embedded content inside of
	 * the targeted slide.
	 */
	function startEmbeddedContent( slide ) {

		if( slide && !isSpeakerNotes() ) {
			// Restart GIFs
			toArray( slide.querySelectorAll( 'img[src$=".gif"]' ) ).forEach( function( el ) {
				// Setting the same unchanged source like this was confirmed
				// to work in Chrome, FF & Safari
				el.setAttribute( 'src', el.getAttribute( 'src' ) );
			} );

			// HTML5 media elements
			toArray( slide.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
				if( el.hasAttribute( 'data-autoplay' ) && typeof el.play === 'function' ) {
					el.play();
				}
			} );

			// Normal iframes
			toArray( slide.querySelectorAll( 'iframe[src]' ) ).forEach( function( el ) {
				startEmbeddedIframe( { target: el } );
			} );

			// Lazy loading iframes
			toArray( slide.querySelectorAll( 'iframe[data-src]' ) ).forEach( function( el ) {
				if( el.getAttribute( 'src' ) !== el.getAttribute( 'data-src' ) ) {
					el.removeEventListener( 'load', startEmbeddedIframe ); // remove first to avoid dupes
					el.addEventListener( 'load', startEmbeddedIframe );
					el.setAttribute( 'src', el.getAttribute( 'data-src' ) );
				}
			} );
		}

	}

	/**
	 * "Starts" the content of an embedded iframe using the
	 * postmessage API.
	 */
	function startEmbeddedIframe( event ) {

		var iframe = event.target;

		// YouTube postMessage API
		if( /youtube\.com\/embed\//.test( iframe.getAttribute( 'src' ) ) && iframe.hasAttribute( 'data-autoplay' ) ) {
			iframe.contentWindow.postMessage( '{"event":"command","func":"playVideo","args":""}', '*' );
		}
		// Vimeo postMessage API
		else if( /player\.vimeo\.com\//.test( iframe.getAttribute( 'src' ) ) && iframe.hasAttribute( 'data-autoplay' ) ) {
			iframe.contentWindow.postMessage( '{"method":"play"}', '*' );
		}
		// Generic postMessage API
		else {
			iframe.contentWindow.postMessage( 'slide:start', '*' );
		}

	}

	/**
	 * Stop playback of any embedded content inside of
	 * the targeted slide.
	 */
	function stopEmbeddedContent( slide ) {

		if( slide && slide.parentNode ) {
			// HTML5 media elements
			toArray( slide.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.pause === 'function' ) {
					el.pause();
				}
			} );

			// Generic postMessage API for non-lazy loaded iframes
			toArray( slide.querySelectorAll( 'iframe' ) ).forEach( function( el ) {
				el.contentWindow.postMessage( 'slide:stop', '*' );
				el.removeEventListener( 'load', startEmbeddedIframe );
			});

			// YouTube postMessage API
			toArray( slide.querySelectorAll( 'iframe[src*="youtube.com/embed/"]' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"event":"command","func":"pauseVideo","args":""}', '*' );
				}
			});

			// Vimeo postMessage API
			toArray( slide.querySelectorAll( 'iframe[src*="player.vimeo.com/"]' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"method":"pause"}', '*' );
				}
			});

			// Lazy loading iframes
			toArray( slide.querySelectorAll( 'iframe[data-src]' ) ).forEach( function( el ) {
				// Only removing the src doesn't actually unload the frame
				// in all browsers (Firefox) so we set it to blank first
				el.setAttribute( 'src', 'about:blank' );
				el.removeAttribute( 'src' );
			} );
		}

	}

	/**
	 * Returns the number of past slides. This can be used as a global
	 * flattened index for slides.
	 */
	function getSlidePastCount() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

		// The number of past slides
		var pastCount = 0;

		// Step through all slides and count the past ones
		mainLoop: for( var i = 0; i < horizontalSlides.length; i++ ) {

			var horizontalSlide = horizontalSlides[i];
			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );

			for( var j = 0; j < verticalSlides.length; j++ ) {

				// Stop as soon as we arrive at the present
				if( verticalSlides[j].classList.contains( 'present' ) ) {
					break mainLoop;
				}

				pastCount++;

			}

			// Stop as soon as we arrive at the present
			if( horizontalSlide.classList.contains( 'present' ) ) {
				break;
			}

			// Don't count the wrapping section for vertical slides
			if( horizontalSlide.classList.contains( 'stack' ) === false ) {
				pastCount++;
			}

		}

		return pastCount;

	}

	/**
	 * Returns a value ranging from 0-1 that represents
	 * how far into the presentation we have navigated.
	 */
	function getProgress() {

		// The number of past and total slides
		var totalCount = getTotalSlides();
		var pastCount = getSlidePastCount();

		if( currentSlide ) {

			var allFragments = currentSlide.querySelectorAll( '.fragment' );

			// If there are fragments in the current slide those should be
			// accounted for in the progress.
			if( allFragments.length > 0 ) {
				var visibleFragments = currentSlide.querySelectorAll( '.fragment.visible' );

				// This value represents how big a portion of the slide progress
				// that is made up by its fragments (0-1)
				var fragmentWeight = 0.9;

				// Add fragment progress to the past slide count
				pastCount += ( visibleFragments.length / allFragments.length ) * fragmentWeight;
			}

		}

		return pastCount / ( totalCount - 1 );

	}

	/**
	 * Checks if this presentation is running inside of the
	 * speaker notes window.
	 */
	function isSpeakerNotes() {

		return !!window.location.search.match( /receiver/gi );

	}

	/**
	 * Reads the current URL (hash) and navigates accordingly.
	 */
	function readURL() {

		var hash = window.location.hash;

		// Attempt to parse the hash as either an index or name
		var bits = hash.slice( 2 ).split( '/' ),
			name = hash.replace( /#|\//gi, '' );

		// If the first bit is invalid and there is a name we can
		// assume that this is a named link
		if( isNaN( parseInt( bits[0], 10 ) ) && name.length ) {
			var element;

			// Ensure the named link is a valid HTML ID attribute
			if( /^[a-zA-Z][\w:.-]*$/.test( name ) ) {
				// Find the slide with the specified ID
				element = document.getElementById( name );
			}

			if( element ) {
				// Find the position of the named slide and navigate to it
				var indices = Reveal.getIndices( element );
				slide( indices.h, indices.v );
			}
			// If the slide doesn't exist, navigate to the current slide
			else {
				slide( indexh || 0, indexv || 0 );
			}
		}
		else {
			// Read the index components of the hash
			var h = parseInt( bits[0], 10 ) || 0,
				v = parseInt( bits[1], 10 ) || 0;

			if( h !== indexh || v !== indexv ) {
				slide( h, v );
			}
		}

	}

	/**
	 * Updates the page URL (hash) to reflect the current
	 * state.
	 *
	 * @param {Number} delay The time in ms to wait before
	 * writing the hash
	 */
	function writeURL( delay ) {

		if( config.history ) {

			// Make sure there's never more than one timeout running
			clearTimeout( writeURLTimeout );

			// If a delay is specified, timeout this call
			if( typeof delay === 'number' ) {
				writeURLTimeout = setTimeout( writeURL, delay );
			}
			else if( currentSlide ) {
				var url = '/';

				// Attempt to create a named link based on the slide's ID
				var id = currentSlide.getAttribute( 'id' );
				if( id ) {
					id = id.replace( /[^a-zA-Z0-9\-\_\:\.]/g, '' );
				}

				// If the current slide has an ID, use that as a named link
				if( typeof id === 'string' && id.length ) {
					url = '/' + id;
				}
				// Otherwise use the /h/v index
				else {
					if( indexh > 0 || indexv > 0 ) url += indexh;
					if( indexv > 0 ) url += '/' + indexv;
				}

				window.location.hash = url;
			}
		}

	}

	/**
	 * Retrieves the h/v location of the current, or specified,
	 * slide.
	 *
	 * @param {HTMLElement} slide If specified, the returned
	 * index will be for this slide rather than the currently
	 * active one
	 *
	 * @return {Object} { h: <int>, v: <int>, f: <int> }
	 */
	function getIndices( slide ) {

		// By default, return the current indices
		var h = indexh,
			v = indexv,
			f;

		// If a slide is specified, return the indices of that slide
		if( slide ) {
			var isVertical = isVerticalSlide( slide );
			var slideh = isVertical ? slide.parentNode : slide;

			// Select all horizontal slides
			var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

			// Now that we know which the horizontal slide is, get its index
			h = Math.max( horizontalSlides.indexOf( slideh ), 0 );

			// Assume we're not vertical
			v = undefined;

			// If this is a vertical slide, grab the vertical index
			if( isVertical ) {
				v = Math.max( toArray( slide.parentNode.querySelectorAll( 'section' ) ).indexOf( slide ), 0 );
			}
		}

		if( !slide && currentSlide ) {
			var hasFragments = currentSlide.querySelectorAll( '.fragment' ).length > 0;
			if( hasFragments ) {
				var currentFragment = currentSlide.querySelector( '.current-fragment' );
				if( currentFragment && currentFragment.hasAttribute( 'data-fragment-index' ) ) {
					f = parseInt( currentFragment.getAttribute( 'data-fragment-index' ), 10 );
				}
				else {
					f = currentSlide.querySelectorAll( '.fragment.visible' ).length - 1;
				}
			}
		}

		return { h: h, v: v, f: f };

	}

	/**
	 * Retrieves the total number of slides in this presentation.
	 */
	function getTotalSlides() {

		return dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ':not(.stack)' ).length;

	}

	/**
	 * Returns the slide element matching the specified index.
	 */
	function getSlide( x, y ) {

		var horizontalSlide = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR )[ x ];
		var verticalSlides = horizontalSlide && horizontalSlide.querySelectorAll( 'section' );

		if( verticalSlides && verticalSlides.length && typeof y === 'number' ) {
			return verticalSlides ? verticalSlides[ y ] : undefined;
		}

		return horizontalSlide;

	}

	/**
	 * Returns the background element for the given slide.
	 * All slides, even the ones with no background properties
	 * defined, have a background element so as long as the
	 * index is valid an element will be returned.
	 */
	function getSlideBackground( x, y ) {

		// When printing to PDF the slide backgrounds are nested
		// inside of the slides
		if( isPrintingPDF() ) {
			var slide = getSlide( x, y );
			if( slide ) {
				var background = slide.querySelector( '.slide-background' );
				if( background && background.parentNode === slide ) {
					return background;
				}
			}

			return undefined;
		}

		var horizontalBackground = dom.wrapper.querySelectorAll( '.backgrounds>.slide-background' )[ x ];
		var verticalBackgrounds = horizontalBackground && horizontalBackground.querySelectorAll( '.slide-background' );

		if( verticalBackgrounds && verticalBackgrounds.length && typeof y === 'number' ) {
			return verticalBackgrounds ? verticalBackgrounds[ y ] : undefined;
		}

		return horizontalBackground;

	}

	/**
	 * Retrieves the speaker notes from a slide. Notes can be
	 * defined in two ways:
	 * 1. As a data-notes attribute on the slide <section>
	 * 2. As an <aside class="notes"> inside of the slide
	 */
	function getSlideNotes( slide ) {

		// Default to the current slide
		slide = slide || currentSlide;

		// Notes can be specified via the data-notes attribute...
		if( slide.hasAttribute( 'data-notes' ) ) {
			return slide.getAttribute( 'data-notes' );
		}

		// ... or using an <aside class="notes"> element
		var notesElement = slide.querySelector( 'aside.notes' );
		if( notesElement ) {
			return notesElement.innerHTML;
		}

		return null;

	}

	/**
	 * Retrieves the current state of the presentation as
	 * an object. This state can then be restored at any
	 * time.
	 */
	function getState() {

		var indices = getIndices();

		return {
			indexh: indices.h,
			indexv: indices.v,
			indexf: indices.f,
			paused: isPaused(),
			overview: isOverview()
		};

	}

	/**
	 * Restores the presentation to the given state.
	 *
	 * @param {Object} state As generated by getState()
	 */
	function setState( state ) {

		if( typeof state === 'object' ) {
			slide( deserialize( state.indexh ), deserialize( state.indexv ), deserialize( state.indexf ) );

			var pausedFlag = deserialize( state.paused ),
				overviewFlag = deserialize( state.overview );

			if( typeof pausedFlag === 'boolean' && pausedFlag !== isPaused() ) {
				togglePause( pausedFlag );
			}

			if( typeof overviewFlag === 'boolean' && overviewFlag !== isOverview() ) {
				toggleOverview( overviewFlag );
			}
		}

	}

	/**
	 * Return a sorted fragments list, ordered by an increasing
	 * "data-fragment-index" attribute.
	 *
	 * Fragments will be revealed in the order that they are returned by
	 * this function, so you can use the index attributes to control the
	 * order of fragment appearance.
	 *
	 * To maintain a sensible default fragment order, fragments are presumed
	 * to be passed in document order. This function adds a "fragment-index"
	 * attribute to each node if such an attribute is not already present,
	 * and sets that attribute to an integer value which is the position of
	 * the fragment within the fragments list.
	 */
	function sortFragments( fragments ) {

		fragments = toArray( fragments );

		var ordered = [],
			unordered = [],
			sorted = [];

		// Group ordered and unordered elements
		fragments.forEach( function( fragment, i ) {
			if( fragment.hasAttribute( 'data-fragment-index' ) ) {
				var index = parseInt( fragment.getAttribute( 'data-fragment-index' ), 10 );

				if( !ordered[index] ) {
					ordered[index] = [];
				}

				ordered[index].push( fragment );
			}
			else {
				unordered.push( [ fragment ] );
			}
		} );

		// Append fragments without explicit indices in their
		// DOM order
		ordered = ordered.concat( unordered );

		// Manually count the index up per group to ensure there
		// are no gaps
		var index = 0;

		// Push all fragments in their sorted order to an array,
		// this flattens the groups
		ordered.forEach( function( group ) {
			group.forEach( function( fragment ) {
				sorted.push( fragment );
				fragment.setAttribute( 'data-fragment-index', index );
			} );

			index ++;
		} );

		return sorted;

	}

	/**
	 * Navigate to the specified slide fragment.
	 *
	 * @param {Number} index The index of the fragment that
	 * should be shown, -1 means all are invisible
	 * @param {Number} offset Integer offset to apply to the
	 * fragment index
	 *
	 * @return {Boolean} true if a change was made in any
	 * fragments visibility as part of this call
	 */
	function navigateFragment( index, offset ) {

		if( currentSlide && config.fragments ) {

			var fragments = sortFragments( currentSlide.querySelectorAll( '.fragment' ) );
			if( fragments.length ) {

				// If no index is specified, find the current
				if( typeof index !== 'number' ) {
					var lastVisibleFragment = sortFragments( currentSlide.querySelectorAll( '.fragment.visible' ) ).pop();

					if( lastVisibleFragment ) {
						index = parseInt( lastVisibleFragment.getAttribute( 'data-fragment-index' ) || 0, 10 );
					}
					else {
						index = -1;
					}
				}

				// If an offset is specified, apply it to the index
				if( typeof offset === 'number' ) {
					index += offset;
				}

				var fragmentsShown = [],
					fragmentsHidden = [];

				toArray( fragments ).forEach( function( element, i ) {

					if( element.hasAttribute( 'data-fragment-index' ) ) {
						i = parseInt( element.getAttribute( 'data-fragment-index' ), 10 );
					}

					// Visible fragments
					if( i <= index ) {
						if( !element.classList.contains( 'visible' ) ) fragmentsShown.push( element );
						element.classList.add( 'visible' );
						element.classList.remove( 'current-fragment' );

						// Announce the fragments one by one to the Screen Reader
						dom.statusDiv.textContent = element.textContent;

						if( i === index ) {
							element.classList.add( 'current-fragment' );
						}
					}
					// Hidden fragments
					else {
						if( element.classList.contains( 'visible' ) ) fragmentsHidden.push( element );
						element.classList.remove( 'visible' );
						element.classList.remove( 'current-fragment' );
					}


				} );

				if( fragmentsHidden.length ) {
					dispatchEvent( 'fragmenthidden', { fragment: fragmentsHidden[0], fragments: fragmentsHidden } );
				}

				if( fragmentsShown.length ) {
					dispatchEvent( 'fragmentshown', { fragment: fragmentsShown[0], fragments: fragmentsShown } );
				}

				updateControls();
				updateProgress();

				return !!( fragmentsShown.length || fragmentsHidden.length );

			}

		}

		return false;

	}

	/**
	 * Navigate to the next slide fragment.
	 *
	 * @return {Boolean} true if there was a next fragment,
	 * false otherwise
	 */
	function nextFragment() {

		return navigateFragment( null, 1 );

	}

	/**
	 * Navigate to the previous slide fragment.
	 *
	 * @return {Boolean} true if there was a previous fragment,
	 * false otherwise
	 */
	function previousFragment() {

		return navigateFragment( null, -1 );

	}

	/**
	 * Cues a new automated slide if enabled in the config.
	 */
	function cueAutoSlide() {

		cancelAutoSlide();

		if( currentSlide ) {

			var currentFragment = currentSlide.querySelector( '.current-fragment' );

			var fragmentAutoSlide = currentFragment ? currentFragment.getAttribute( 'data-autoslide' ) : null;
			var parentAutoSlide = currentSlide.parentNode ? currentSlide.parentNode.getAttribute( 'data-autoslide' ) : null;
			var slideAutoSlide = currentSlide.getAttribute( 'data-autoslide' );

			// Pick value in the following priority order:
			// 1. Current fragment's data-autoslide
			// 2. Current slide's data-autoslide
			// 3. Parent slide's data-autoslide
			// 4. Global autoSlide setting
			if( fragmentAutoSlide ) {
				autoSlide = parseInt( fragmentAutoSlide, 10 );
			}
			else if( slideAutoSlide ) {
				autoSlide = parseInt( slideAutoSlide, 10 );
			}
			else if( parentAutoSlide ) {
				autoSlide = parseInt( parentAutoSlide, 10 );
			}
			else {
				autoSlide = config.autoSlide;
			}

			// If there are media elements with data-autoplay,
			// automatically set the autoSlide duration to the
			// length of that media. Not applicable if the slide
			// is divided up into fragments.
			if( currentSlide.querySelectorAll( '.fragment' ).length === 0 ) {
				toArray( currentSlide.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
					if( el.hasAttribute( 'data-autoplay' ) ) {
						if( autoSlide && el.duration * 1000 > autoSlide ) {
							autoSlide = ( el.duration * 1000 ) + 1000;
						}
					}
				} );
			}

			// Cue the next auto-slide if:
			// - There is an autoSlide value
			// - Auto-sliding isn't paused by the user
			// - The presentation isn't paused
			// - The overview isn't active
			// - The presentation isn't over
			if( autoSlide && !autoSlidePaused && !isPaused() && !isOverview() && ( !Reveal.isLastSlide() || availableFragments().next || config.loop === true ) ) {
				autoSlideTimeout = setTimeout( function() {
					typeof config.autoSlideMethod === 'function' ? config.autoSlideMethod() : navigateNext();
					cueAutoSlide();
				}, autoSlide );
				autoSlideStartTime = Date.now();
			}

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( autoSlideTimeout !== -1 );
			}

		}

	}

	/**
	 * Cancels any ongoing request to auto-slide.
	 */
	function cancelAutoSlide() {

		clearTimeout( autoSlideTimeout );
		autoSlideTimeout = -1;

	}

	function pauseAutoSlide() {

		if( autoSlide && !autoSlidePaused ) {
			autoSlidePaused = true;
			dispatchEvent( 'autoslidepaused' );
			clearTimeout( autoSlideTimeout );

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( false );
			}
		}

	}

	function resumeAutoSlide() {

		if( autoSlide && autoSlidePaused ) {
			autoSlidePaused = false;
			dispatchEvent( 'autoslideresumed' );
			cueAutoSlide();
		}

	}

	function navigateLeft() {

		// Reverse for RTL
		if( config.rtl ) {
			if( ( isOverview() || nextFragment() === false ) && availableRoutes().left ) {
				slide( indexh + 1 );
			}
		}
		// Normal navigation
		else if( ( isOverview() || previousFragment() === false ) && availableRoutes().left ) {
			slide( indexh - 1 );
		}

	}

	function navigateRight() {

		// Reverse for RTL
		if( config.rtl ) {
			if( ( isOverview() || previousFragment() === false ) && availableRoutes().right ) {
				slide( indexh - 1 );
			}
		}
		// Normal navigation
		else if( ( isOverview() || nextFragment() === false ) && availableRoutes().right ) {
			slide( indexh + 1 );
		}

	}

	function navigateUp() {

		// Prioritize hiding fragments
		if( ( isOverview() || previousFragment() === false ) && availableRoutes().up ) {
			slide( indexh, indexv - 1 );
		}

	}

	function navigateDown() {

		// Prioritize revealing fragments
		if( ( isOverview() || nextFragment() === false ) && availableRoutes().down ) {
			slide( indexh, indexv + 1 );
		}

	}

	/**
	 * Navigates backwards, prioritized in the following order:
	 * 1) Previous fragment
	 * 2) Previous vertical slide
	 * 3) Previous horizontal slide
	 */
	function navigatePrev() {

		// Prioritize revealing fragments
		if( previousFragment() === false ) {
			if( availableRoutes().up ) {
				navigateUp();
			}
			else {
				// Fetch the previous horizontal slide, if there is one
				var previousSlide;

				if( config.rtl ) {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.future' ) ).pop();
				}
				else {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.past' ) ).pop();
				}

				if( previousSlide ) {
					var v = ( previousSlide.querySelectorAll( 'section' ).length - 1 ) || undefined;
					var h = indexh - 1;
					slide( h, v );
				}
			}
		}

	}

	/**
	 * The reverse of #navigatePrev().
	 */
	function navigateNext() {

		// Prioritize revealing fragments
		if( nextFragment() === false ) {
			if( availableRoutes().down ) {
				navigateDown();
			}
			else if( config.rtl ) {
				navigateLeft();
			}
			else {
				navigateRight();
			}
		}

	}

	/**
	 * Checks if the target element prevents the triggering of
	 * swipe navigation.
	 */
	function isSwipePrevented( target ) {

		while( target && typeof target.hasAttribute === 'function' ) {
			if( target.hasAttribute( 'data-prevent-swipe' ) ) return true;
			target = target.parentNode;
		}

		return false;

	}


	// --------------------------------------------------------------------//
	// ----------------------------- EVENTS -------------------------------//
	// --------------------------------------------------------------------//

	/**
	 * Called by all event handlers that are based on user
	 * input.
	 */
	function onUserInput( event ) {

		if( config.autoSlideStoppable ) {
			pauseAutoSlide();
		}

	}

	/**
	 * Handler for the document level 'keypress' event.
	 */
	function onDocumentKeyPress( event ) {

		// Check if the pressed key is question mark
		if( event.shiftKey && event.charCode === 63 ) {
			if( dom.overlay ) {
				closeOverlay();
			}
			else {
				showHelp( true );
			}
		}

	}

	/**
	 * Handler for the document level 'keydown' event.
	 */
	function onDocumentKeyDown( event ) {

		// If there's a condition specified and it returns false,
		// ignore this event
		if( typeof config.keyboardCondition === 'function' && config.keyboardCondition() === false ) {
			return true;
		}

		// Remember if auto-sliding was paused so we can toggle it
		var autoSlideWasPaused = autoSlidePaused;

		onUserInput( event );

		// Check if there's a focused element that could be using
		// the keyboard
		var activeElementIsCE = document.activeElement && document.activeElement.contentEditable !== 'inherit';
		var activeElementIsInput = document.activeElement && document.activeElement.tagName && /input|textarea/i.test( document.activeElement.tagName );

		// Disregard the event if there's a focused element or a
		// keyboard modifier key is present
		if( activeElementIsCE || activeElementIsInput || (event.shiftKey && event.keyCode !== 32) || event.altKey || event.ctrlKey || event.metaKey ) return;

		// While paused only allow resume keyboard events; 'b', '.''
		var resumeKeyCodes = [66,190,191];
		var key;

		// Custom key bindings for togglePause should be able to resume
		if( typeof config.keyboard === 'object' ) {
			for( key in config.keyboard ) {
				if( config.keyboard[key] === 'togglePause' ) {
					resumeKeyCodes.push( parseInt( key, 10 ) );
				}
			}
		}

		if( isPaused() && resumeKeyCodes.indexOf( event.keyCode ) === -1 ) {
			return false;
		}

		var triggered = false;

		// 1. User defined key bindings
		if( typeof config.keyboard === 'object' ) {

			for( key in config.keyboard ) {

				// Check if this binding matches the pressed key
				if( parseInt( key, 10 ) === event.keyCode ) {

					var value = config.keyboard[ key ];

					// Callback function
					if( typeof value === 'function' ) {
						value.apply( null, [ event ] );
					}
					// String shortcuts to reveal.js API
					else if( typeof value === 'string' && typeof Reveal[ value ] === 'function' ) {
						Reveal[ value ].call();
					}

					triggered = true;

				}

			}

		}

		// 2. System defined key bindings
		if( triggered === false ) {

			// Assume true and try to prove false
			triggered = true;

			switch( event.keyCode ) {
				// p, page up
				case 80: case 33: navigatePrev(); break;
				// n, page down
				case 78: case 34: navigateNext(); break;
				// h, left
				case 72: case 37: navigateLeft(); break;
				// l, right
				case 76: case 39: navigateRight(); break;
				// k, up
				case 75: case 38: navigateUp(); break;
				// j, down
				case 74: case 40: navigateDown(); break;
				// home
				case 36: slide( 0 ); break;
				// end
				case 35: slide( Number.MAX_VALUE ); break;
				// space
				case 32: isOverview() ? deactivateOverview() : event.shiftKey ? navigatePrev() : navigateNext(); break;
				// return
				case 13: isOverview() ? deactivateOverview() : triggered = false; break;
				// two-spot, semicolon, b, period, Logitech presenter tools "black screen" button
				case 58: case 59: case 66: case 190: case 191: togglePause(); break;
				// f
				case 70: enterFullscreen(); break;
				// a
				case 65: if ( config.autoSlideStoppable ) toggleAutoSlide( autoSlideWasPaused ); break;
				default:
					triggered = false;
			}

		}

		// If the input resulted in a triggered action we should prevent
		// the browsers default behavior
		if( triggered ) {
			event.preventDefault && event.preventDefault();
		}
		// ESC or O key
		else if ( ( event.keyCode === 27 || event.keyCode === 79 ) && features.transforms3d ) {
			if( dom.overlay ) {
				closeOverlay();
			}
			else {
				toggleOverview();
			}

			event.preventDefault && event.preventDefault();
		}

		// If auto-sliding is enabled we need to cue up
		// another timeout
		cueAutoSlide();

	}

	/**
	 * Handler for the 'touchstart' event, enables support for
	 * swipe and pinch gestures.
	 */
	function onTouchStart( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		touch.startX = event.touches[0].clientX;
		touch.startY = event.touches[0].clientY;
		touch.startCount = event.touches.length;

		// If there's two touches we need to memorize the distance
		// between those two points to detect pinching
		if( event.touches.length === 2 && config.overview ) {
			touch.startSpan = distanceBetween( {
				x: event.touches[1].clientX,
				y: event.touches[1].clientY
			}, {
				x: touch.startX,
				y: touch.startY
			} );
		}

	}

	/**
	 * Handler for the 'touchmove' event.
	 */
	function onTouchMove( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		// Each touch should only trigger one action
		if( !touch.captured ) {
			onUserInput( event );

			var currentX = event.touches[0].clientX;
			var currentY = event.touches[0].clientY;

			// If the touch started with two points and still has
			// two active touches; test for the pinch gesture
			if( event.touches.length === 2 && touch.startCount === 2 && config.overview ) {

				// The current distance in pixels between the two touch points
				var currentSpan = distanceBetween( {
					x: event.touches[1].clientX,
					y: event.touches[1].clientY
				}, {
					x: touch.startX,
					y: touch.startY
				} );

				// If the span is larger than the desire amount we've got
				// ourselves a pinch
				if( Math.abs( touch.startSpan - currentSpan ) > touch.threshold ) {
					touch.captured = true;

					if( currentSpan < touch.startSpan ) {
						activateOverview();
					}
					else {
						deactivateOverview();
					}
				}

				event.preventDefault();

			}
			// There was only one touch point, look for a swipe
			else if( event.touches.length === 1 && touch.startCount !== 2 ) {

				var deltaX = currentX - touch.startX,
					deltaY = currentY - touch.startY;

				if( deltaX > touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					navigateLeft();
				}
				else if( deltaX < -touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					navigateRight();
				}
				else if( deltaY > touch.threshold ) {
					touch.captured = true;
					navigateUp();
				}
				else if( deltaY < -touch.threshold ) {
					touch.captured = true;
					navigateDown();
				}

				// If we're embedded, only block touch events if they have
				// triggered an action
				if( config.embedded ) {
					if( touch.captured || isVerticalSlide( currentSlide ) ) {
						event.preventDefault();
					}
				}
				// Not embedded? Block them all to avoid needless tossing
				// around of the viewport in iOS
				else {
					event.preventDefault();
				}

			}
		}
		// There's a bug with swiping on some Android devices unless
		// the default action is always prevented
		else if( UA.match( /android/gi ) ) {
			event.preventDefault();
		}

	}

	/**
	 * Handler for the 'touchend' event.
	 */
	function onTouchEnd( event ) {

		touch.captured = false;

	}

	/**
	 * Convert pointer down to touch start.
	 */
	function onPointerDown( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" ) {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchStart( event );
		}

	}

	/**
	 * Convert pointer move to touch move.
	 */
	function onPointerMove( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchMove( event );
		}

	}

	/**
	 * Convert pointer up to touch end.
	 */
	function onPointerUp( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchEnd( event );
		}

	}

	/**
	 * Handles mouse wheel scrolling, throttled to avoid skipping
	 * multiple slides.
	 */
	function onDocumentMouseScroll( event ) {

		if( Date.now() - lastMouseWheelStep > 600 ) {

			lastMouseWheelStep = Date.now();

			var delta = event.detail || -event.wheelDelta;
			if( delta > 0 ) {
				navigateNext();
			}
			else {
				navigatePrev();
			}

		}

	}

	/**
	 * Clicking on the progress bar results in a navigation to the
	 * closest approximate horizontal slide using this equation:
	 *
	 * ( clickX / presentationWidth ) * numberOfSlides
	 */
	function onProgressClicked( event ) {

		onUserInput( event );

		event.preventDefault();

		var slidesTotal = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).length;
		var slideIndex = Math.floor( ( event.clientX / dom.wrapper.offsetWidth ) * slidesTotal );

		if( config.rtl ) {
			slideIndex = slidesTotal - slideIndex;
		}

		slide( slideIndex );

	}

	/**
	 * Event handler for navigation control buttons.
	 */
	function onNavigateLeftClicked( event ) { event.preventDefault(); onUserInput(); navigateLeft(); }
	function onNavigateRightClicked( event ) { event.preventDefault(); onUserInput(); navigateRight(); }
	function onNavigateUpClicked( event ) { event.preventDefault(); onUserInput(); navigateUp(); }
	function onNavigateDownClicked( event ) { event.preventDefault(); onUserInput(); navigateDown(); }
	function onNavigatePrevClicked( event ) { event.preventDefault(); onUserInput(); navigatePrev(); }
	function onNavigateNextClicked( event ) { event.preventDefault(); onUserInput(); navigateNext(); }

	/**
	 * Handler for the window level 'hashchange' event.
	 */
	function onWindowHashChange( event ) {

		readURL();

	}

	/**
	 * Handler for the window level 'resize' event.
	 */
	function onWindowResize( event ) {

		layout();

	}

	/**
	 * Handle for the window level 'visibilitychange' event.
	 */
	function onPageVisibilityChange( event ) {

		var isHidden =  document.webkitHidden ||
						document.msHidden ||
						document.hidden;

		// If, after clicking a link or similar and we're coming back,
		// focus the document.body to ensure we can use keyboard shortcuts
		if( isHidden === false && document.activeElement !== document.body ) {
			// Not all elements support .blur() - SVGs among them.
			if( typeof document.activeElement.blur === 'function' ) {
				document.activeElement.blur();
			}
			document.body.focus();
		}

	}

	/**
	 * Invoked when a slide is and we're in the overview.
	 */
	function onOverviewSlideClicked( event ) {

		// TODO There's a bug here where the event listeners are not
		// removed after deactivating the overview.
		if( eventsAreBound && isOverview() ) {
			event.preventDefault();

			var element = event.target;

			while( element && !element.nodeName.match( /section/gi ) ) {
				element = element.parentNode;
			}

			if( element && !element.classList.contains( 'disabled' ) ) {

				deactivateOverview();

				if( element.nodeName.match( /section/gi ) ) {
					var h = parseInt( element.getAttribute( 'data-index-h' ), 10 ),
						v = parseInt( element.getAttribute( 'data-index-v' ), 10 );

					slide( h, v );
				}

			}
		}

	}

	/**
	 * Handles clicks on links that are set to preview in the
	 * iframe overlay.
	 */
	function onPreviewLinkClicked( event ) {

		if( event.currentTarget && event.currentTarget.hasAttribute( 'href' ) ) {
			var url = event.currentTarget.getAttribute( 'href' );
			if( url ) {
				showPreview( url );
				event.preventDefault();
			}
		}

	}

	/**
	 * Handles click on the auto-sliding controls element.
	 */
	function onAutoSlidePlayerClick( event ) {

		// Replay
		if( Reveal.isLastSlide() && config.loop === false ) {
			slide( 0, 0 );
			resumeAutoSlide();
		}
		// Resume
		else if( autoSlidePaused ) {
			resumeAutoSlide();
		}
		// Pause
		else {
			pauseAutoSlide();
		}

	}


	// --------------------------------------------------------------------//
	// ------------------------ PLAYBACK COMPONENT ------------------------//
	// --------------------------------------------------------------------//


	/**
	 * Constructor for the playback component, which displays
	 * play/pause/progress controls.
	 *
	 * @param {HTMLElement} container The component will append
	 * itself to this
	 * @param {Function} progressCheck A method which will be
	 * called frequently to get the current progress on a range
	 * of 0-1
	 */
	function Playback( container, progressCheck ) {

		// Cosmetics
		this.diameter = 100;
		this.diameter2 = this.diameter/2;
		this.thickness = 6;

		// Flags if we are currently playing
		this.playing = false;

		// Current progress on a 0-1 range
		this.progress = 0;

		// Used to loop the animation smoothly
		this.progressOffset = 1;

		this.container = container;
		this.progressCheck = progressCheck;

		this.canvas = document.createElement( 'canvas' );
		this.canvas.className = 'playback';
		this.canvas.width = this.diameter;
		this.canvas.height = this.diameter;
		this.canvas.style.width = this.diameter2 + 'px';
		this.canvas.style.height = this.diameter2 + 'px';
		this.context = this.canvas.getContext( '2d' );

		this.container.appendChild( this.canvas );

		this.render();

	}

	Playback.prototype.setPlaying = function( value ) {

		var wasPlaying = this.playing;

		this.playing = value;

		// Start repainting if we weren't already
		if( !wasPlaying && this.playing ) {
			this.animate();
		}
		else {
			this.render();
		}

	};

	Playback.prototype.animate = function() {

		var progressBefore = this.progress;

		this.progress = this.progressCheck();

		// When we loop, offset the progress so that it eases
		// smoothly rather than immediately resetting
		if( progressBefore > 0.8 && this.progress < 0.2 ) {
			this.progressOffset = this.progress;
		}

		this.render();

		if( this.playing ) {
			features.requestAnimationFrameMethod.call( window, this.animate.bind( this ) );
		}

	};

	/**
	 * Renders the current progress and playback state.
	 */
	Playback.prototype.render = function() {

		var progress = this.playing ? this.progress : 0,
			radius = ( this.diameter2 ) - this.thickness,
			x = this.diameter2,
			y = this.diameter2,
			iconSize = 28;

		// Ease towards 1
		this.progressOffset += ( 1 - this.progressOffset ) * 0.1;

		var endAngle = ( - Math.PI / 2 ) + ( progress * ( Math.PI * 2 ) );
		var startAngle = ( - Math.PI / 2 ) + ( this.progressOffset * ( Math.PI * 2 ) );

		this.context.save();
		this.context.clearRect( 0, 0, this.diameter, this.diameter );

		// Solid background color
		this.context.beginPath();
		this.context.arc( x, y, radius + 4, 0, Math.PI * 2, false );
		this.context.fillStyle = 'rgba( 0, 0, 0, 0.4 )';
		this.context.fill();

		// Draw progress track
		this.context.beginPath();
		this.context.arc( x, y, radius, 0, Math.PI * 2, false );
		this.context.lineWidth = this.thickness;
		this.context.strokeStyle = '#666';
		this.context.stroke();

		if( this.playing ) {
			// Draw progress on top of track
			this.context.beginPath();
			this.context.arc( x, y, radius, startAngle, endAngle, false );
			this.context.lineWidth = this.thickness;
			this.context.strokeStyle = '#fff';
			this.context.stroke();
		}

		this.context.translate( x - ( iconSize / 2 ), y - ( iconSize / 2 ) );

		// Draw play/pause icons
		if( this.playing ) {
			this.context.fillStyle = '#fff';
			this.context.fillRect( 0, 0, iconSize / 2 - 4, iconSize );
			this.context.fillRect( iconSize / 2 + 4, 0, iconSize / 2 - 4, iconSize );
		}
		else {
			this.context.beginPath();
			this.context.translate( 4, 0 );
			this.context.moveTo( 0, 0 );
			this.context.lineTo( iconSize - 4, iconSize / 2 );
			this.context.lineTo( 0, iconSize );
			this.context.fillStyle = '#fff';
			this.context.fill();
		}

		this.context.restore();

	};

	Playback.prototype.on = function( type, listener ) {
		this.canvas.addEventListener( type, listener, false );
	};

	Playback.prototype.off = function( type, listener ) {
		this.canvas.removeEventListener( type, listener, false );
	};

	Playback.prototype.destroy = function() {

		this.playing = false;

		if( this.canvas.parentNode ) {
			this.container.removeChild( this.canvas );
		}

	};


	// --------------------------------------------------------------------//
	// ------------------------------- API --------------------------------//
	// --------------------------------------------------------------------//


	Reveal = {
		VERSION: VERSION,

		initialize: initialize,
		configure: configure,
		sync: sync,

		// Navigation methods
		slide: slide,
		left: navigateLeft,
		right: navigateRight,
		up: navigateUp,
		down: navigateDown,
		prev: navigatePrev,
		next: navigateNext,

		// Fragment methods
		navigateFragment: navigateFragment,
		prevFragment: previousFragment,
		nextFragment: nextFragment,

		// Deprecated aliases
		navigateTo: slide,
		navigateLeft: navigateLeft,
		navigateRight: navigateRight,
		navigateUp: navigateUp,
		navigateDown: navigateDown,
		navigatePrev: navigatePrev,
		navigateNext: navigateNext,

		// Forces an update in slide layout
		layout: layout,

		// Randomizes the order of slides
		shuffle: shuffle,

		// Returns an object with the available routes as booleans (left/right/top/bottom)
		availableRoutes: availableRoutes,

		// Returns an object with the available fragments as booleans (prev/next)
		availableFragments: availableFragments,

		// Toggles the overview mode on/off
		toggleOverview: toggleOverview,

		// Toggles the "black screen" mode on/off
		togglePause: togglePause,

		// Toggles the auto slide mode on/off
		toggleAutoSlide: toggleAutoSlide,

		// State checks
		isOverview: isOverview,
		isPaused: isPaused,
		isAutoSliding: isAutoSliding,

		// Adds or removes all internal event listeners (such as keyboard)
		addEventListeners: addEventListeners,
		removeEventListeners: removeEventListeners,

		// Facility for persisting and restoring the presentation state
		getState: getState,
		setState: setState,

		// Presentation progress on range of 0-1
		getProgress: getProgress,

		// Returns the indices of the current, or specified, slide
		getIndices: getIndices,

		getTotalSlides: getTotalSlides,

		// Returns the slide element at the specified index
		getSlide: getSlide,

		// Returns the slide background element at the specified index
		getSlideBackground: getSlideBackground,

		// Returns the speaker notes string for a slide, or null
		getSlideNotes: getSlideNotes,

		// Returns the previous slide element, may be null
		getPreviousSlide: function() {
			return previousSlide;
		},

		// Returns the current slide element
		getCurrentSlide: function() {
			return currentSlide;
		},

		// Returns the current scale of the presentation content
		getScale: function() {
			return scale;
		},

		// Returns the current configuration object
		getConfig: function() {
			return config;
		},

		// Helper method, retrieves query string as a key/value hash
		getQueryHash: function() {
			var query = {};

			location.search.replace( /[A-Z0-9]+?=([\w\.%-]*)/gi, function(a) {
				query[ a.split( '=' ).shift() ] = a.split( '=' ).pop();
			} );

			// Basic deserialization
			for( var i in query ) {
				var value = query[ i ];

				query[ i ] = deserialize( unescape( value ) );
			}

			return query;
		},

		// Returns true if we're currently on the first slide
		isFirstSlide: function() {
			return ( indexh === 0 && indexv === 0 );
		},

		// Returns true if we're currently on the last slide
		isLastSlide: function() {
			if( currentSlide ) {
				// Does this slide has next a sibling?
				if( currentSlide.nextElementSibling ) return false;

				// If it's vertical, does its parent have a next sibling?
				if( isVerticalSlide( currentSlide ) && currentSlide.parentNode.nextElementSibling ) return false;

				return true;
			}

			return false;
		},

		// Checks if reveal.js has been loaded and is ready for use
		isReady: function() {
			return loaded;
		},

		// Forward event binding to the reveal DOM element
		addEventListener: function( type, listener, useCapture ) {
			if( 'addEventListener' in window ) {
				( dom.wrapper || document.querySelector( '.reveal' ) ).addEventListener( type, listener, useCapture );
			}
		},
		removeEventListener: function( type, listener, useCapture ) {
			if( 'addEventListener' in window ) {
				( dom.wrapper || document.querySelector( '.reveal' ) ).removeEventListener( type, listener, useCapture );
			}
		},

		// Programatically triggers a keyboard event
		triggerKey: function( keyCode ) {
			onDocumentKeyDown( { keyCode: keyCode } );
		},

		// Registers a new shortcut to include in the help overlay
		registerKeyboardShortcut: function( key, value ) {
			keyboardShortcuts[key] = value;
		}
	};

	return Reveal;

}));

},{}],4:[function(require,module,exports){
var Reveal = require('reveal.js');
var $ = require('jbone');
var slides = require('./js/modules/slides').getSlides();
var VIDEO_TYPE = require('./js/constants.js').VIDEO_TYPE;
var AUDIO_TYPE = require('./js/constants.js').AUDIO_TYPE;
var AUDIO_PATH = require('./js/constants.js').AUDIO_PATH;
var Draggable = require ('Draggable');


Reveal.initialize({
    width: 1000,
    height: 740,
    center: false,
    controls: false,
    //history: true,
    keyboard: false
});

var stepIndex = 0,
    loopIndex = 0,
    isPlaying = false,
    mediaIsReady = false,
    $audio = $('audio'),
    $overlay = $('#overlay'),
    $pauseBtn = $('.pause-btn');



var togglePlay  = function () {
    if(!mediaIsReady) {
        loadingMediaLoop();
        return
    }

    if(isPlaying) { //pause
        $pauseBtn.removeClass('active');
        $overlay.css('display', 'block');
        isPlaying = false;
        changeMediaState('pause');
    } else{ //play
        $pauseBtn.addClass('active');
        changeMediaState('play');
        $overlay.css('display', 'none');
        isPlaying = true;
        playLoop();
    }
};

$overlay.on('click', togglePlay);
$pauseBtn.on('click', togglePlay);
$(AUDIO_TYPE)[0].onwaiting = togglePlay;
$(VIDEO_TYPE)[0].onwaiting = togglePlay;


$('.hobbies-list li').on('click', function () {
    $(this).parent().find('.active').removeClass('active');
    $(this).addClass("active");
    $('.block-3-sl-4 ul li').eq(0)
        .html("hobby: " + $(this).html())
        .addClass("active");
});

$('.js-yes-btn, .js-no-btn').on('click', function () {
    $('.js-yes-btn, .js-no-btn').css('display', 'none');
});

//slide 8
$('.savings-table tr').on('click', function () {
    $(this).parent().find('.active').removeClass('active');
    $(this).addClass("active");
});



var playLoop = function () {
    var currSlide = null;
    console.log(loopIndex);
    if (isPlaying && mediaIsReady) {
        currSlide = Reveal.getIndices().h;

        if (slides[currSlide].steps[stepIndex]) {
            setTimeout(playLoop, 250);
            if (slides[currSlide].steps[stepIndex].delay === loopIndex) {
                //loopIndex = 0;
                slides[currSlide].steps[stepIndex++].cmd();
            }
        } else{
            $pauseBtn.removeClass('active');
        }
        loopIndex++;
    }
};

var changeMediaState = function (action) {
    var mediaType = slides[Reveal.getIndices().h].mediaType;

    if(mediaType === AUDIO_TYPE) {
        $audio[0][action]();
    } else if(mediaType === VIDEO_TYPE) {
        $(Reveal.getCurrentSlide()).find('video')[0][action]();
    }
};

var loadingMediaLoop = function (slideIndex) {
    console.log("loading...", $audio[0].readyState );
    var indexh = slideIndex || Reveal.getIndices().h;
    var mediaType = slides[indexh].mediaType;


    mediaIsReady = (mediaType === AUDIO_TYPE && $audio[0].readyState === 4)
        || (mediaType === VIDEO_TYPE &&  $(Reveal.getCurrentSlide()).find('video')[0].readyState === 4);


    if (mediaIsReady) {
        indexh > 0 && changeMediaState('play');
        setTimeout(playLoop, 250);
    } else {
        setTimeout(loadingMediaLoop, 250);
    }
};

loadingMediaLoop();




Reveal.addEventListener('slidechanged', function(e) {
    console.log("SLIDE CHANGED");
    $pauseBtn.addClass('active');
    mediaIsReady = false;
    stepIndex = 0;
    loopIndex = 0;

    var mediaFileNumber = e.indexh + 1;
    if(slides[e.indexh].mediaType === AUDIO_TYPE) {
        $audio.find('source').attr('src', AUDIO_PATH + mediaFileNumber + ".mp3");

        $audio[0].load();
    }

    loadingMediaLoop(e.indexh);
});

Reveal.addEventListener('ready', function() {
    $('.js-loader').css('display', 'none');
});

//Reveal.addEventListener('fragmentshown', function(e) {
//    //var $el = $(e.fragment);
//});
//
//Reveal.addEventListener('fragmenthidden', function(e) {
//    //var $el = $(e.fragment);
//});

$('.next-btn').on('click', function (e) {
    e.stopPropagation();
    Reveal.next();
});

new Draggable (document.getElementById('js-fund-block'),{
    limit: {
        x: [306, 865],
        y: [0, 0]
    }

});
},{"./js/constants.js":5,"./js/modules/slides":6,"Draggable":1,"jbone":2,"reveal.js":3}],5:[function(require,module,exports){
module.exports = {
    AUDIO_TYPE : "audio",
    VIDEO_TYPE : "video",
    AUDIO_PATH : "./data/page"
};


},{}],6:[function(require,module,exports){
var Reveal = require('reveal.js');
var $ = require('jbone');
var VIDEO_TYPE = require('../../constants.js').VIDEO_TYPE;
var AUDIO_TYPE = require('../../constants.js').AUDIO_TYPE;

var slides = {
    0: {
        steps: [
            { delay: 15, cmd: Reveal.next },
            { delay: 50, cmd: Reveal.next },
            { delay: 120, cmd: Reveal.next },
            { delay: 178, cmd: Reveal.next }
        ],
        mediaType: VIDEO_TYPE
    },
    1: {
        steps: [
            { delay: 32, cmd: Reveal.next },
            { delay: 84, cmd: Reveal.next},
            { delay: 93, cmd: function () {
                Reveal.next(); Reveal.next();
            } },
            { delay: 110, cmd: Reveal.next},
            { delay: 120, cmd: Reveal.next },
            { delay: 130, cmd: Reveal.next },
            { delay: 139, cmd: Reveal.next },
            { delay: 175, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    2: {
        steps: [
            { delay: 30, cmd: Reveal.next },
            { delay: 40, cmd: Reveal.next },
            { delay: 52, cmd: Reveal.next },
            { delay: 64, cmd: Reveal.next },
            { delay: 68, cmd: Reveal.next },
            { delay: 100, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    3: {
        steps: [
            { delay: 9, cmd: Reveal.next },
            { delay: 24, cmd: function () {
                //$('.block-1-sl-4 ul li').eq(3).addClass("active");
                //$('.block-3-sl-4 ul li').eq(0)
                //    .html("hobby: golfing")
                //    .addClass("active");
            } },
            { delay: 60, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    4: {
        steps: [
            { delay: 16, cmd: Reveal.next },
            { delay: 36, cmd: Reveal.next },
            { delay: 40, cmd: Reveal.next },
            { delay: 44, cmd: Reveal.next },
            { delay: 48, cmd: Reveal.next },
            { delay: 52, cmd: Reveal.next },
            { delay: 56, cmd: Reveal.next },
            { delay: 76, cmd: Reveal.next },
            { delay: 172, cmd: Reveal.next },
            { delay: 184, cmd: Reveal.next },
            { delay: 190, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    5: {
        steps: [
            { delay: 33, cmd: Reveal.next },
            { delay: 64, cmd: Reveal.next },
            { delay: 77, cmd: Reveal.next },
            { delay: 80, cmd: Reveal.next },
            { delay: 100, cmd: Reveal.next },
            { delay: 140, cmd: Reveal.next },
            { delay: 164, cmd: Reveal.next }

        ],
        mediaType: AUDIO_TYPE
    },
    6: {
        steps: [
            { delay: 48, cmd: Reveal.next },
            { delay: 60, cmd: Reveal.next },
            { delay: 88, cmd: Reveal.next },
            { delay: 112, cmd: Reveal.next },
            { delay: 136, cmd: Reveal.next },
            { delay: 140, cmd: Reveal.next }

        ],
        mediaType: AUDIO_TYPE
    },
    7: {
        steps: [
            { delay: 36, cmd: Reveal.next },
            { delay: 72, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    8: {
        steps: [
            { delay: 28, cmd: Reveal.next },
            { delay: 36, cmd: Reveal.next },
            { delay: 64, cmd: Reveal.next },
            { delay: 120, cmd: Reveal.next },
            { delay: 156, cmd: Reveal.next },
            { delay: 212, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    9: {
        steps: [
            { delay: 8, cmd: Reveal.next },
            { delay: 56, cmd: Reveal.next },
            { delay: 80, cmd: Reveal.next },
            { delay: 86, cmd: Reveal.next },
            { delay: 110, cmd: Reveal.next },
            { delay: 128, cmd: Reveal.next },
            { delay: 136, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    10: {
        steps: [
            { delay: 24, cmd: Reveal.next },
            { delay: 28, cmd: Reveal.next },
            { delay: 32, cmd: Reveal.next },
            { delay: 36, cmd: Reveal.next },
            { delay: 40, cmd: Reveal.next },
            { delay: 84, cmd: Reveal.next },
            { delay: 110, cmd: Reveal.next },
            { delay: 120, cmd: Reveal.next },
            { delay: 132, cmd: Reveal.next },
            { delay: 176, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    11: {
        steps: [
            { delay: 36, cmd: Reveal.next },
            { delay: 44, cmd: Reveal.next },
            { delay: 76, cmd: Reveal.next },
            { delay: 108, cmd: Reveal.next },
            { delay: 110, cmd: Reveal.next },
            { delay: 136, cmd: Reveal.next },
            { delay: 168, cmd: Reveal.next },
            { delay: 188, cmd: Reveal.next },
            { delay: 204, cmd: Reveal.next },
            { delay: 220, cmd: Reveal.next },
            { delay: 304, cmd: Reveal.next },
            { delay: 372, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    12: {
        steps: [
            { delay: 44, cmd: Reveal.next },
            { delay: 68, cmd: Reveal.next },
            { delay: 97, cmd: Reveal.next },
            { delay: 114, cmd: Reveal.next },
            { delay: 134, cmd: Reveal.next },
            { delay: 153, cmd: Reveal.next },
            { delay: 205, cmd: Reveal.next },
            { delay: 254, cmd: Reveal.next },
            { delay: 277, cmd: Reveal.next },
            { delay: 292, cmd: Reveal.next },
            { delay: 304, cmd: Reveal.next },
            { delay: 315, cmd: Reveal.next },
            { delay: 325, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    13: {
        steps: [
            { delay: 130, cmd: Reveal.next },
            { delay: 140, cmd: function () {
                //$('.fund-block').addClass('moved');
            }},
            { delay: 161, cmd: Reveal.next }

        ],
        mediaType: AUDIO_TYPE
    },
    14: {
        steps: [
            { delay: 28, cmd: Reveal.next },
            { delay: 56, cmd: Reveal.next },
            { delay: 76, cmd: Reveal.next },
            { delay: 92, cmd: Reveal.next },
            { delay: 124, cmd: Reveal.next },
            { delay: 192, cmd: Reveal.next },
            { delay: 232, cmd: Reveal.next },
            { delay: 284, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    15: {
        steps: [
            { delay: 21, cmd: Reveal.next },
            { delay: 39, cmd: Reveal.next },
            { delay: 70, cmd: Reveal.next },
            { delay: 100, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    16: {
        steps: [
            { delay: 123, cmd: Reveal.next },
            { delay: 140, cmd: Reveal.next }
        ],
        mediaType: VIDEO_TYPE
    }
};

module.exports = {
    getSlides: function () {
        return slides
    }
};
},{"../../constants.js":5,"jbone":2,"reveal.js":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvRHJhZ2dhYmxlL2Rpc3QvZHJhZ2dhYmxlLm1pbi5qcyIsIm5vZGVfbW9kdWxlcy9qYm9uZS9kaXN0L2pib25lLmpzIiwibm9kZV9tb2R1bGVzL3JldmVhbC5qcy9qcy9yZXZlYWwuanMiLCJzcmMvYXBwLmpzIiwic3JjL2pzL2NvbnN0YW50cy5qcyIsInNyYy9qcy9tb2R1bGVzL3NsaWRlcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RpQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4b0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIhZnVuY3Rpb24oYSxiKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9tb2R1bGUuZXhwb3J0cz1iKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxiKTphLkRyYWdnYWJsZT1iKCl9KHRoaXMsZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBhKGEsYil7dmFyIGM9dGhpcyxkPWsuYmluZChjLnN0YXJ0LGMpLGU9ay5iaW5kKGMuZHJhZyxjKSxnPWsuYmluZChjLnN0b3AsYyk7aWYoIWYoYSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkRyYWdnYWJsZSBleHBlY3RzIGFyZ3VtZW50IDAgdG8gYmUgYW4gRWxlbWVudFwiKTtrLmFzc2lnbihjLHtlbGVtZW50OmEsaGFuZGxlcnM6e3N0YXJ0Onttb3VzZWRvd246ZCx0b3VjaHN0YXJ0OmR9LG1vdmU6e21vdXNlbW92ZTplLG1vdXNldXA6Zyx0b3VjaG1vdmU6ZSx0b3VjaGVuZDpnfX0sb3B0aW9uczprLmFzc2lnbih7fSxpLGIpfSksYy5pbml0aWFsaXplKCl9ZnVuY3Rpb24gYihhKXtyZXR1cm4gcGFyc2VJbnQoYSwxMCl9ZnVuY3Rpb24gYyhhKXtyZXR1cm5cImN1cnJlbnRTdHlsZVwiaW4gYT9hLmN1cnJlbnRTdHlsZTpnZXRDb21wdXRlZFN0eWxlKGEpfWZ1bmN0aW9uIGQoYSl7cmV0dXJuIGEgaW5zdGFuY2VvZiBBcnJheX1mdW5jdGlvbiBlKGEpe3JldHVybiB2b2lkIDAhPT1hJiZudWxsIT09YX1mdW5jdGlvbiBmKGEpe3JldHVybiBhIGluc3RhbmNlb2YgRWxlbWVudHx8YSBpbnN0YW5jZW9mIEhUTUxEb2N1bWVudH1mdW5jdGlvbiBnKGEpe3JldHVybiBhIGluc3RhbmNlb2YgRnVuY3Rpb259ZnVuY3Rpb24gaCgpe312YXIgaT17Z3JpZDowLGZpbHRlclRhcmdldDpudWxsLGxpbWl0Ont4Om51bGwseTpudWxsfSx0aHJlc2hvbGQ6MCxzZXRDdXJzb3I6ITEsc2V0UG9zaXRpb246ITAsc21vb3RoRHJhZzohMCx1c2VHUFU6ITAsb25EcmFnOmgsb25EcmFnU3RhcnQ6aCxvbkRyYWdFbmQ6aH0saj17dHJhbnNmb3JtOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPVwiIC1vLSAtbXMtIC1tb3otIC13ZWJraXQtXCIuc3BsaXQoXCIgXCIpLGI9ZG9jdW1lbnQuYm9keS5zdHlsZSxjPWEubGVuZ3RoO2MtLTspe3ZhciBkPWFbY10rXCJ0cmFuc2Zvcm1cIjtpZihkIGluIGIpcmV0dXJuIGR9fSgpfSxrPXthc3NpZ246ZnVuY3Rpb24oKXtmb3IodmFyIGE9YXJndW1lbnRzWzBdLGI9YXJndW1lbnRzLmxlbmd0aCxjPTE7Yj5jO2MrKyl7dmFyIGQ9YXJndW1lbnRzW2NdO2Zvcih2YXIgZSBpbiBkKWFbZV09ZFtlXX1yZXR1cm4gYX0sYmluZDpmdW5jdGlvbihhLGIpe3JldHVybiBmdW5jdGlvbigpe2EuYXBwbHkoYixhcmd1bWVudHMpfX0sb246ZnVuY3Rpb24oYSxiLGMpe2lmKGImJmMpay5hZGRFdmVudChhLGIsYyk7ZWxzZSBpZihiKWZvcih2YXIgZCBpbiBiKWsuYWRkRXZlbnQoYSxkLGJbZF0pfSxvZmY6ZnVuY3Rpb24oYSxiLGMpe2lmKGImJmMpay5yZW1vdmVFdmVudChhLGIsYyk7ZWxzZSBpZihiKWZvcih2YXIgZCBpbiBiKWsucmVtb3ZlRXZlbnQoYSxkLGJbZF0pfSxsaW1pdDpmdW5jdGlvbihhLGIpe3JldHVybiBkKGIpPyhiPVsrYlswXSwrYlsxXV0sYTxiWzBdP2E9YlswXTphPmJbMV0mJihhPWJbMV0pKTphPStiLGF9LGFkZEV2ZW50OlwiYXR0YWNoRXZlbnRcImluIEVsZW1lbnQucHJvdG90eXBlP2Z1bmN0aW9uKGEsYixjKXthLmF0dGFjaEV2ZW50KFwib25cIitiLGMpfTpmdW5jdGlvbihhLGIsYyl7YS5hZGRFdmVudExpc3RlbmVyKGIsYywhMSl9LHJlbW92ZUV2ZW50OlwiYXR0YWNoRXZlbnRcImluIEVsZW1lbnQucHJvdG90eXBlP2Z1bmN0aW9uKGEsYixjKXthLmRldGFjaEV2ZW50KFwib25cIitiLGMpfTpmdW5jdGlvbihhLGIsYyl7YS5yZW1vdmVFdmVudExpc3RlbmVyKGIsYyl9fTtyZXR1cm4gay5hc3NpZ24oYS5wcm90b3R5cGUse3NldE9wdGlvbjpmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXM7cmV0dXJuIGMub3B0aW9uc1thXT1iLGMuaW5pdGlhbGl6ZSgpLGN9LGdldDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuZHJhZ0V2ZW50O3JldHVybnt4OmEueCx5OmEueX19LHNldDpmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMsZD1jLmRyYWdFdmVudDtyZXR1cm4gZC5vcmlnaW5hbD17eDpkLngseTpkLnl9LGMubW92ZShhLGIpLGN9LGRyYWdFdmVudDp7c3RhcnRlZDohMSx4OjAseTowfSxpbml0aWFsaXplOmZ1bmN0aW9uKCl7dmFyIGEsYj10aGlzLGQ9Yi5lbGVtZW50LGU9ZC5zdHlsZSxmPWMoZCksZz1iLm9wdGlvbnMsaD1qLnRyYW5zZm9ybSxpPWIuX2RpbWVuc2lvbnM9e2hlaWdodDpkLm9mZnNldEhlaWdodCxsZWZ0OmQub2Zmc2V0TGVmdCx0b3A6ZC5vZmZzZXRUb3Asd2lkdGg6ZC5vZmZzZXRXaWR0aH07Zy51c2VHUFUmJmgmJihhPWZbaF0sXCJub25lXCI9PT1hJiYoYT1cIlwiKSxlW2hdPWErXCIgdHJhbnNsYXRlM2QoMCwwLDApXCIpLGcuc2V0UG9zaXRpb24mJihlLmRpc3BsYXk9XCJibG9ja1wiLGUubGVmdD1pLmxlZnQrXCJweFwiLGUudG9wPWkudG9wK1wicHhcIixlLmJvdHRvbT1lLnJpZ2h0PVwiYXV0b1wiLGUubWFyZ2luPTAsZS5wb3NpdGlvbj1cImFic29sdXRlXCIpLGcuc2V0Q3Vyc29yJiYoZS5jdXJzb3I9XCJtb3ZlXCIpLGIuc2V0TGltaXQoZy5saW1pdCksay5hc3NpZ24oYi5kcmFnRXZlbnQse3g6aS5sZWZ0LHk6aS50b3B9KSxrLm9uKGIuZWxlbWVudCxiLmhhbmRsZXJzLnN0YXJ0KX0sc3RhcnQ6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcyxjPWIuZ2V0Q3Vyc29yKGEpLGQ9Yi5lbGVtZW50O2IudXNlVGFyZ2V0KGEudGFyZ2V0fHxhLnNyY0VsZW1lbnQpJiYoYS5wcmV2ZW50RGVmYXVsdD9hLnByZXZlbnREZWZhdWx0KCk6YS5yZXR1cm5WYWx1ZT0hMSxiLmRyYWdFdmVudC5vbGRaaW5kZXg9ZC5zdHlsZS56SW5kZXgsZC5zdHlsZS56SW5kZXg9MWU0LGIuc2V0Q3Vyc29yKGMpLGIuc2V0UG9zaXRpb24oKSxiLnNldFpvb20oKSxrLm9uKGRvY3VtZW50LGIuaGFuZGxlcnMubW92ZSkpfSxkcmFnOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMsYz1iLmRyYWdFdmVudCxkPWIuZWxlbWVudCxlPWIuX2N1cnNvcixmPWIuX2RpbWVuc2lvbnMsZz1iLm9wdGlvbnMsaD1mLnpvb20saT1iLmdldEN1cnNvcihhKSxqPWcudGhyZXNob2xkLGs9KGkueC1lLngpL2grZi5sZWZ0LGw9KGkueS1lLnkpL2grZi50b3A7IWMuc3RhcnRlZCYmaiYmTWF0aC5hYnMoZS54LWkueCk8aiYmTWF0aC5hYnMoZS55LWkueSk8anx8KGMub3JpZ2luYWx8fChjLm9yaWdpbmFsPXt4OmsseTpsfSksYy5zdGFydGVkfHwoZy5vbkRyYWdTdGFydChkLGssbCxhKSxjLnN0YXJ0ZWQ9ITApLGIubW92ZShrLGwpJiZnLm9uRHJhZyhkLGMueCxjLnksYSkpfSxtb3ZlOmZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxkPWMuZHJhZ0V2ZW50LGU9Yy5vcHRpb25zLGY9ZS5ncmlkLGc9Yy5lbGVtZW50LnN0eWxlLGg9Yy5saW1pdChhLGIsZC5vcmlnaW5hbC54LGQub3JpZ2luYWwueSk7cmV0dXJuIWUuc21vb3RoRHJhZyYmZiYmKGg9Yy5yb3VuZChoLGYpKSxoLnghPT1kLnh8fGgueSE9PWQueT8oZC54PWgueCxkLnk9aC55LGcubGVmdD1oLngrXCJweFwiLGcudG9wPWgueStcInB4XCIsITApOiExfSxzdG9wOmZ1bmN0aW9uKGEpe3ZhciBiLGM9dGhpcyxkPWMuZHJhZ0V2ZW50LGU9Yy5lbGVtZW50LGY9Yy5vcHRpb25zLGc9Zi5ncmlkO2sub2ZmKGRvY3VtZW50LGMuaGFuZGxlcnMubW92ZSksZS5zdHlsZS56SW5kZXg9ZC5vbGRaaW5kZXgsZi5zbW9vdGhEcmFnJiZnJiYoYj1jLnJvdW5kKHt4OmQueCx5OmQueX0sZyksYy5tb3ZlKGIueCxiLnkpLGsuYXNzaWduKGMuZHJhZ0V2ZW50LGIpKSxjLmRyYWdFdmVudC5zdGFydGVkJiZmLm9uRHJhZ0VuZChlLGQueCxkLnksYSksYy5yZXNldCgpfSxyZXNldDpmdW5jdGlvbigpe3RoaXMuZHJhZ0V2ZW50LnN0YXJ0ZWQ9ITF9LHJvdW5kOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMub3B0aW9ucy5ncmlkO3JldHVybnt4OmIqTWF0aC5yb3VuZChhLngvYikseTpiKk1hdGgucm91bmQoYS55L2IpfX0sZ2V0Q3Vyc29yOmZ1bmN0aW9uKGEpe3JldHVybnt4OihhLnRhcmdldFRvdWNoZXM/YS50YXJnZXRUb3VjaGVzWzBdOmEpLmNsaWVudFgseTooYS50YXJnZXRUb3VjaGVzP2EudGFyZ2V0VG91Y2hlc1swXTphKS5jbGllbnRZfX0sc2V0Q3Vyc29yOmZ1bmN0aW9uKGEpe3RoaXMuX2N1cnNvcj1hfSxzZXRMaW1pdDpmdW5jdGlvbihhKXt2YXIgYj10aGlzLGM9ZnVuY3Rpb24oYSxiKXtyZXR1cm57eDphLHk6Yn19O2lmKGcoYSkpYi5saW1pdD1hO2Vsc2UgaWYoZihhKSl7dmFyIGQ9Yi5fZGltZW5zaW9ucyxoPWEuc2Nyb2xsSGVpZ2h0LWQuaGVpZ2h0LGk9YS5zY3JvbGxXaWR0aC1kLndpZHRoO2IubGltaXQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm57eDprLmxpbWl0KGEsWzAsaV0pLHk6ay5saW1pdChiLFswLGhdKX19fWVsc2UgaWYoYSl7dmFyIGo9e3g6ZShhLngpLHk6ZShhLnkpfTtiLmxpbWl0PWoueHx8ai55P2Z1bmN0aW9uKGIsYyl7cmV0dXJue3g6ai54P2subGltaXQoYixhLngpOmIseTpqLnk/ay5saW1pdChjLGEueSk6Y319OmN9ZWxzZSBiLmxpbWl0PWN9LHNldFBvc2l0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcyxjPWEuZWxlbWVudCxkPWMuc3R5bGU7ay5hc3NpZ24oYS5fZGltZW5zaW9ucyx7bGVmdDpiKGQubGVmdCl8fGMub2Zmc2V0TGVmdCx0b3A6YihkLnRvcCl8fGMub2Zmc2V0VG9wfSl9LHNldFpvb206ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcyxiPWEuZWxlbWVudCxkPTE7Yj1iLm9mZnNldFBhcmVudDspe3ZhciBlPWMoYikuem9vbTtpZihlJiZcIm5vcm1hbFwiIT09ZSl7ZD1lO2JyZWFrfX1hLl9kaW1lbnNpb25zLnpvb209ZH0sdXNlVGFyZ2V0OmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMub3B0aW9ucy5maWx0ZXJUYXJnZXQ7cmV0dXJuIGIgaW5zdGFuY2VvZiBGdW5jdGlvbj9iKGEpOiEwfSxkZXN0cm95OmZ1bmN0aW9uKCl7ay5vZmYodGhpcy5lbGVtZW50LHRoaXMuaGFuZGxlcnMuc3RhcnQpLGsub2ZmKGRvY3VtZW50LHRoaXMuaGFuZGxlcnMubW92ZSl9fSksYX0pOyIsIi8qIVxuICogakJvbmUgdjEuMi4wIC0gMjAxNi0wNC0xMyAtIExpYnJhcnkgZm9yIERPTSBtYW5pcHVsYXRpb25cbiAqXG4gKiBodHRwOi8vamJvbmUuanMub3JnXG4gKlxuICogQ29weXJpZ2h0IDIwMTYgQWxleGV5IEt1cHJpeWFuZW5rb1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICovXG5cbihmdW5jdGlvbiAod2luKSB7XG5cbnZhclxuLy8gY2FjaGUgcHJldmlvdXMgdmVyc2lvbnNcbl8kID0gd2luLiQsXG5fakJvbmUgPSB3aW4uakJvbmUsXG5cbi8vIFF1aWNrIG1hdGNoIGEgc3RhbmRhbG9uZSB0YWdcbnJxdWlja1NpbmdsZVRhZyA9IC9ePChcXHcrKVxccypcXC8/PiQvLFxuXG4vLyBBIHNpbXBsZSB3YXkgdG8gY2hlY2sgZm9yIEhUTUwgc3RyaW5nc1xuLy8gUHJpb3JpdGl6ZSAjaWQgb3ZlciA8dGFnPiB0byBhdm9pZCBYU1MgdmlhIGxvY2F0aW9uLmhhc2hcbnJxdWlja0V4cHIgPSAvXig/OlteIzxdKig8W1xcd1xcV10rPilbXj5dKiR8IyhbXFx3XFwtXSopJCkvLFxuXG4vLyBBbGlhcyBmb3IgZnVuY3Rpb25cbnNsaWNlID0gW10uc2xpY2UsXG5zcGxpY2UgPSBbXS5zcGxpY2UsXG5rZXlzID0gT2JqZWN0LmtleXMsXG5cbi8vIEFsaWFzIGZvciBnbG9iYWwgdmFyaWFibGVzXG5kb2MgPSBkb2N1bWVudCxcblxuaXNTdHJpbmcgPSBmdW5jdGlvbihlbCkge1xuICAgIHJldHVybiB0eXBlb2YgZWwgPT09IFwic3RyaW5nXCI7XG59LFxuaXNPYmplY3QgPSBmdW5jdGlvbihlbCkge1xuICAgIHJldHVybiBlbCBpbnN0YW5jZW9mIE9iamVjdDtcbn0sXG5pc0Z1bmN0aW9uID0gZnVuY3Rpb24oZWwpIHtcbiAgICByZXR1cm4gKHt9KS50b1N0cmluZy5jYWxsKGVsKSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xufSxcbmlzQXJyYXkgPSBmdW5jdGlvbihlbCkge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGVsKTtcbn0sXG5qQm9uZSA9IGZ1bmN0aW9uKGVsZW1lbnQsIGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IGZuLmluaXQoZWxlbWVudCwgZGF0YSk7XG59LFxuZm47XG5cbi8vIHNldCBwcmV2aW91cyB2YWx1ZXMgYW5kIHJldHVybiB0aGUgaW5zdGFuY2UgdXBvbiBjYWxsaW5nIHRoZSBuby1jb25mbGljdCBtb2RlXG5qQm9uZS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgd2luLiQgPSBfJDtcbiAgICB3aW4uakJvbmUgPSBfakJvbmU7XG5cbiAgICByZXR1cm4gakJvbmU7XG59O1xuXG5mbiA9IGpCb25lLmZuID0gakJvbmUucHJvdG90eXBlID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGVsZW1lbnQsIGRhdGEpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzLCB0YWcsIHdyYXBlciwgZnJhZ21lbnQ7XG5cbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNTdHJpbmcoZWxlbWVudCkpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBzaW5nbGUgRE9NIGVsZW1lbnRcbiAgICAgICAgICAgIGlmICh0YWcgPSBycXVpY2tTaW5nbGVUYWcuZXhlYyhlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHRoaXNbMF0gPSBkb2MuY3JlYXRlRWxlbWVudCh0YWdbMV0pO1xuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gMTtcblxuICAgICAgICAgICAgICAgIGlmIChpc09iamVjdChkYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmF0dHIoZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBDcmVhdGUgRE9NIGNvbGxlY3Rpb25cbiAgICAgICAgICAgIGlmICgodGFnID0gcnF1aWNrRXhwci5leGVjKGVsZW1lbnQpKSAmJiB0YWdbMV0pIHtcbiAgICAgICAgICAgICAgICBmcmFnbWVudCA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgICAgICAgICAgd3JhcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgd3JhcGVyLmlubmVySFRNTCA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHdyYXBlci5sYXN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQod3JhcGVyLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IHNsaWNlLmNhbGwoZnJhZ21lbnQuY2hpbGROb2Rlcyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gakJvbmUubWVyZ2UodGhpcywgZWxlbWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRmluZCBET00gZWxlbWVudHMgd2l0aCBxdWVyeVNlbGVjdG9yQWxsXG4gICAgICAgICAgICBpZiAoakJvbmUuaXNFbGVtZW50KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpCb25lKGRhdGEpLmZpbmQoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudHMgPSBkb2MucXVlcnlTZWxlY3RvckFsbChlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBqQm9uZS5tZXJnZSh0aGlzLCBlbGVtZW50cyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gV3JhcCBET01FbGVtZW50XG4gICAgICAgIGlmIChlbGVtZW50Lm5vZGVUeXBlKSB7XG4gICAgICAgICAgICB0aGlzWzBdID0gZWxlbWVudDtcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUnVuIGZ1bmN0aW9uXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldHVybiBqQm9uZSBlbGVtZW50IGFzIGlzXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgakJvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmV0dXJuIGVsZW1lbnQgd3JhcHBlZCBieSBqQm9uZVxuICAgICAgICByZXR1cm4gakJvbmUubWFrZUFycmF5KGVsZW1lbnQsIHRoaXMpO1xuICAgIH0sXG5cbiAgICBwb3A6IFtdLnBvcCxcbiAgICBwdXNoOiBbXS5wdXNoLFxuICAgIHJldmVyc2U6IFtdLnJldmVyc2UsXG4gICAgc2hpZnQ6IFtdLnNoaWZ0LFxuICAgIHNvcnQ6IFtdLnNvcnQsXG4gICAgc3BsaWNlOiBbXS5zcGxpY2UsXG4gICAgc2xpY2U6IFtdLnNsaWNlLFxuICAgIGluZGV4T2Y6IFtdLmluZGV4T2YsXG4gICAgZm9yRWFjaDogW10uZm9yRWFjaCxcbiAgICB1bnNoaWZ0OiBbXS51bnNoaWZ0LFxuICAgIGNvbmNhdDogW10uY29uY2F0LFxuICAgIGpvaW46IFtdLmpvaW4sXG4gICAgZXZlcnk6IFtdLmV2ZXJ5LFxuICAgIHNvbWU6IFtdLnNvbWUsXG4gICAgZmlsdGVyOiBbXS5maWx0ZXIsXG4gICAgbWFwOiBbXS5tYXAsXG4gICAgcmVkdWNlOiBbXS5yZWR1Y2UsXG4gICAgcmVkdWNlUmlnaHQ6IFtdLnJlZHVjZVJpZ2h0LFxuICAgIGxlbmd0aDogMFxufTtcblxuZm4uY29uc3RydWN0b3IgPSBqQm9uZTtcblxuZm4uaW5pdC5wcm90b3R5cGUgPSBmbjtcblxuakJvbmUuc2V0SWQgPSBmdW5jdGlvbihlbCkge1xuICAgIHZhciBqaWQgPSBlbC5qaWQ7XG5cbiAgICBpZiAoZWwgPT09IHdpbikge1xuICAgICAgICBqaWQgPSBcIndpbmRvd1wiO1xuICAgIH0gZWxzZSBpZiAoZWwuamlkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZWwuamlkID0gamlkID0gKytqQm9uZS5fY2FjaGUuamlkO1xuICAgIH1cblxuICAgIGlmICghakJvbmUuX2NhY2hlLmV2ZW50c1tqaWRdKSB7XG4gICAgICAgIGpCb25lLl9jYWNoZS5ldmVudHNbamlkXSA9IHt9O1xuICAgIH1cbn07XG5cbmpCb25lLmdldERhdGEgPSBmdW5jdGlvbihlbCkge1xuICAgIGVsID0gZWwgaW5zdGFuY2VvZiBqQm9uZSA/IGVsWzBdIDogZWw7XG5cbiAgICB2YXIgamlkID0gZWwgPT09IHdpbiA/IFwid2luZG93XCIgOiBlbC5qaWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBqaWQ6IGppZCxcbiAgICAgICAgZXZlbnRzOiBqQm9uZS5fY2FjaGUuZXZlbnRzW2ppZF1cbiAgICB9O1xufTtcblxuakJvbmUuaXNFbGVtZW50ID0gZnVuY3Rpb24oZWwpIHtcbiAgICByZXR1cm4gZWwgJiYgZWwgaW5zdGFuY2VvZiBqQm9uZSB8fCBlbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8IGlzU3RyaW5nKGVsKTtcbn07XG5cbmpCb25lLl9jYWNoZSA9IHtcbiAgICBldmVudHM6IHt9LFxuICAgIGppZDogMFxufTtcblxuZnVuY3Rpb24gaXNBcnJheWxpa2Uob2JqKSB7XG4gICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGgsXG4gICAgICAgIHR5cGUgPSB0eXBlb2Ygb2JqO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24odHlwZSkgfHwgb2JqID09PSB3aW4pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChvYmoubm9kZVR5cGUgPT09IDEgJiYgbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBpc0FycmF5KHR5cGUpIHx8IGxlbmd0aCA9PT0gMCB8fFxuICAgICAgICB0eXBlb2YgbGVuZ3RoID09PSBcIm51bWJlclwiICYmIGxlbmd0aCA+IDAgJiYgKGxlbmd0aCAtIDEpIGluIG9iajtcbn1cblxuZm4ucHVzaFN0YWNrID0gZnVuY3Rpb24oZWxlbXMpIHtcbiAgICB2YXIgcmV0ID0gakJvbmUubWVyZ2UodGhpcy5jb25zdHJ1Y3RvcigpLCBlbGVtcyk7XG5cbiAgICByZXR1cm4gcmV0O1xufTtcblxuakJvbmUubWVyZ2UgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gICAgdmFyIGwgPSBzZWNvbmQubGVuZ3RoLFxuICAgICAgICBpID0gZmlyc3QubGVuZ3RoLFxuICAgICAgICBqID0gMDtcblxuICAgIHdoaWxlIChqIDwgbCkge1xuICAgICAgICBmaXJzdFtpKytdID0gc2Vjb25kW2orK107XG4gICAgfVxuXG4gICAgZmlyc3QubGVuZ3RoID0gaTtcblxuICAgIHJldHVybiBmaXJzdDtcbn07XG5cbmpCb25lLmNvbnRhaW5zID0gZnVuY3Rpb24oY29udGFpbmVyLCBjb250YWluZWQpIHtcbiAgICByZXR1cm4gY29udGFpbmVyLmNvbnRhaW5zKGNvbnRhaW5lZCk7XG59O1xuXG5qQm9uZS5leHRlbmQgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICB2YXIgdGc7XG5cbiAgICBzcGxpY2UuY2FsbChhcmd1bWVudHMsIDEpLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICAgIHRnID0gdGFyZ2V0OyAvL2NhY2hpbmcgdGFyZ2V0IGZvciBwZXJmIGltcHJvdmVtZW50XG5cbiAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgICAgICB0Z1twcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5cbmpCb25lLm1ha2VBcnJheSA9IGZ1bmN0aW9uKGFyciwgcmVzdWx0cykge1xuICAgIHZhciByZXQgPSByZXN1bHRzIHx8IFtdO1xuXG4gICAgaWYgKGFyciAhPT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNBcnJheWxpa2UoYXJyKSkge1xuICAgICAgICAgICAgakJvbmUubWVyZ2UocmV0LCBpc1N0cmluZyhhcnIpID8gW2Fycl0gOiBhcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0LnB1c2goYXJyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59O1xuXG5qQm9uZS51bmlxdWUgPSBmdW5jdGlvbihhcnJheSkge1xuICAgIGlmIChhcnJheSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaV07XG4gICAgICAgIGlmIChyZXN1bHQuaW5kZXhPZih2YWx1ZSkgPCAwKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmZ1bmN0aW9uIEJvbmVFdmVudChlLCBkYXRhKSB7XG4gICAgdmFyIGtleSwgc2V0dGVyO1xuXG4gICAgdGhpcy5vcmlnaW5hbEV2ZW50ID0gZTtcblxuICAgIHNldHRlciA9IGZ1bmN0aW9uKGtleSwgZSkge1xuICAgICAgICBpZiAoa2V5ID09PSBcInByZXZlbnREZWZhdWx0XCIpIHtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVba2V5XSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXCIpIHtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZVtrZXldKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24oZVtrZXldKSkge1xuICAgICAgICAgICAgdGhpc1trZXldID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVba2V5XSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGVba2V5XTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmb3IgKGtleSBpbiBlKSB7XG4gICAgICAgIGlmIChlW2tleV0gfHwgdHlwZW9mIGVba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBzZXR0ZXIuY2FsbCh0aGlzLCBrZXksIGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgakJvbmUuZXh0ZW5kKHRoaXMsIGRhdGEsIHtcbiAgICAgICAgaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5pbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQ7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuakJvbmUuRXZlbnQgPSBmdW5jdGlvbihldmVudCwgZGF0YSkge1xuICAgIHZhciBuYW1lc3BhY2UsIGV2ZW50VHlwZTtcblxuICAgIGlmIChldmVudC50eXBlICYmICFkYXRhKSB7XG4gICAgICAgIGRhdGEgPSBldmVudDtcbiAgICAgICAgZXZlbnQgPSBldmVudC50eXBlO1xuICAgIH1cblxuICAgIG5hbWVzcGFjZSA9IGV2ZW50LnNwbGl0KFwiLlwiKS5zcGxpY2UoMSkuam9pbihcIi5cIik7XG4gICAgZXZlbnRUeXBlID0gZXZlbnQuc3BsaXQoXCIuXCIpWzBdO1xuXG4gICAgZXZlbnQgPSBkb2MuY3JlYXRlRXZlbnQoXCJFdmVudFwiKTtcbiAgICBldmVudC5pbml0RXZlbnQoZXZlbnRUeXBlLCB0cnVlLCB0cnVlKTtcblxuICAgIHJldHVybiBqQm9uZS5leHRlbmQoZXZlbnQsIHtcbiAgICAgICAgbmFtZXNwYWNlOiBuYW1lc3BhY2UsXG4gICAgICAgIGlzRGVmYXVsdFByZXZlbnRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZXZlbnQuZGVmYXVsdFByZXZlbnRlZDtcbiAgICAgICAgfVxuICAgIH0sIGRhdGEpO1xufTtcblxuakJvbmUuZXZlbnQgPSB7XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2ggYSBoYW5kbGVyIHRvIGFuIGV2ZW50IGZvciB0aGUgZWxlbWVudHNcbiAgICAgKiBAcGFyYW0ge05vZGV9ICAgICAgICBlbCAgICAgICAgIC0gRXZlbnRzIHdpbGwgYmUgYXR0YWNoZWQgdG8gdGhpcyBET00gTm9kZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgICAgIHR5cGVzICAgICAgLSBPbmUgb3IgbW9yZSBzcGFjZS1zZXBhcmF0ZWQgZXZlbnQgdHlwZXMgYW5kIG9wdGlvbmFsIG5hbWVzcGFjZXNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSAgICBoYW5kbGVyICAgIC0gQSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIGV2ZW50IGlzIHRyaWdnZXJlZFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSAgICAgIFtkYXRhXSAgICAgLSBEYXRhIHRvIGJlIHBhc3NlZCB0byB0aGUgaGFuZGxlciBpbiBldmVudC5kYXRhXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgW3NlbGVjdG9yXSAtIEEgc2VsZWN0b3Igc3RyaW5nIHRvIGZpbHRlciB0aGUgZGVzY2VuZGFudHMgb2YgdGhlIHNlbGVjdGVkIGVsZW1lbnRzXG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbihlbCwgdHlwZXMsIGhhbmRsZXIsIGRhdGEsIHNlbGVjdG9yKSB7XG4gICAgICAgIGpCb25lLnNldElkKGVsKTtcblxuICAgICAgICB2YXIgZXZlbnRIYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGpCb25lLmV2ZW50LmRpc3BhdGNoLmNhbGwoZWwsIGUpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50cyA9IGpCb25lLmdldERhdGEoZWwpLmV2ZW50cyxcbiAgICAgICAgICAgIGV2ZW50VHlwZSwgdCwgZXZlbnQ7XG5cbiAgICAgICAgdHlwZXMgPSB0eXBlcy5zcGxpdChcIiBcIik7XG4gICAgICAgIHQgPSB0eXBlcy5sZW5ndGg7XG4gICAgICAgIHdoaWxlICh0LS0pIHtcbiAgICAgICAgICAgIGV2ZW50ID0gdHlwZXNbdF07XG5cbiAgICAgICAgICAgIGV2ZW50VHlwZSA9IGV2ZW50LnNwbGl0KFwiLlwiKVswXTtcbiAgICAgICAgICAgIGV2ZW50c1tldmVudFR5cGVdID0gZXZlbnRzW2V2ZW50VHlwZV0gfHwgW107XG5cbiAgICAgICAgICAgIGlmIChldmVudHNbZXZlbnRUeXBlXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAvLyBvdmVycmlkZSB3aXRoIHByZXZpb3VzIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgICAgICBldmVudEhhbmRsZXIgPSBldmVudHNbZXZlbnRUeXBlXVswXS5mbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lciAmJiBlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgZXZlbnRIYW5kbGVyLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50c1tldmVudFR5cGVdLnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogZXZlbnQuc3BsaXQoXCIuXCIpLnNwbGljZSgxKS5qb2luKFwiLlwiKSxcbiAgICAgICAgICAgICAgICBmbjogZXZlbnRIYW5kbGVyLFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgIG9yaWdpbmZuOiBoYW5kbGVyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYW4gZXZlbnQgaGFuZGxlclxuICAgICAqIEBwYXJhbSAge05vZGV9ICAgICAgIGVsICAgICAgICAtIEV2ZW50cyB3aWxsIGJlIGRlYXR0YWNoZWQgZnJvbSB0aGlzIERPTSBOb2RlXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSAgICAgdHlwZXMgICAgIC0gT25lIG9yIG1vcmUgc3BhY2Utc2VwYXJhdGVkIGV2ZW50IHR5cGVzIGFuZCBvcHRpb25hbCBuYW1lc3BhY2VzXG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259ICAgaGFuZGxlciAgIC0gQSBoYW5kbGVyIGZ1bmN0aW9uIHByZXZpb3VzbHkgYXR0YWNoZWQgZm9yIHRoZSBldmVudChzKVxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gICAgIFtzZWxlY3Rvcl0gLSBBIHNlbGVjdG9yIHN0cmluZyB0byBmaWx0ZXIgdGhlIGRlc2NlbmRhbnRzIG9mIHRoZSBzZWxlY3RlZCBlbGVtZW50c1xuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24oZWwsIHR5cGVzLCBoYW5kbGVyLCBzZWxlY3Rvcikge1xuICAgICAgICB2YXIgcmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudHMsIGV2ZW50VHlwZSwgaW5kZXgsIGVsLCBlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrO1xuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgaWYgKChoYW5kbGVyICYmIGUub3JpZ2luZm4gPT09IGhhbmRsZXIpIHx8ICFoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gZS5mbjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzW2V2ZW50VHlwZV1baW5kZXhdLmZuID09PSBjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgaGFuZGxlciBmcm9tIGNhY2hlXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50c1tldmVudFR5cGVdLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFldmVudHNbZXZlbnRUeXBlXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXZlbnRzID0gakJvbmUuZ2V0RGF0YShlbCkuZXZlbnRzLFxuICAgICAgICAgICAgbCxcbiAgICAgICAgICAgIGV2ZW50c0J5VHlwZTtcblxuICAgICAgICBpZiAoIWV2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGFsbCBldmVudHNcbiAgICAgICAgaWYgKCF0eXBlcyAmJiBldmVudHMpIHtcbiAgICAgICAgICAgIHJldHVybiBrZXlzKGV2ZW50cykuZm9yRWFjaChmdW5jdGlvbihldmVudFR5cGUpIHtcbiAgICAgICAgICAgICAgICBldmVudHNCeVR5cGUgPSBldmVudHNbZXZlbnRUeXBlXTtcbiAgICAgICAgICAgICAgICBsID0gZXZlbnRzQnlUeXBlLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGwtLSkge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcihldmVudHMsIGV2ZW50VHlwZSwgbCwgZWwsIGV2ZW50c0J5VHlwZVtsXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0eXBlcy5zcGxpdChcIiBcIikuZm9yRWFjaChmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICAgICAgICAgIHZhciBldmVudFR5cGUgPSBldmVudE5hbWUuc3BsaXQoXCIuXCIpWzBdLFxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZSA9IGV2ZW50TmFtZS5zcGxpdChcIi5cIikuc3BsaWNlKDEpLmpvaW4oXCIuXCIpLFxuICAgICAgICAgICAgICAgIGU7XG5cbiAgICAgICAgICAgIC8vIHJlbW92ZSBuYW1lZCBldmVudHNcbiAgICAgICAgICAgIGlmIChldmVudHNbZXZlbnRUeXBlXSkge1xuICAgICAgICAgICAgICAgIGV2ZW50c0J5VHlwZSA9IGV2ZW50c1tldmVudFR5cGVdO1xuICAgICAgICAgICAgICAgIGwgPSBldmVudHNCeVR5cGUubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUobC0tKSB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBldmVudHNCeVR5cGVbbF07XG4gICAgICAgICAgICAgICAgICAgIGlmICgoIW5hbWVzcGFjZSB8fCAobmFtZXNwYWNlICYmIGUubmFtZXNwYWNlID09PSBuYW1lc3BhY2UpKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgKCFzZWxlY3RvciAgfHwgKHNlbGVjdG9yICAmJiBlLnNlbGVjdG9yID09PSBzZWxlY3RvcikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcihldmVudHMsIGV2ZW50VHlwZSwgbCwgZWwsIGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVtb3ZlIGFsbCBuYW1lc3BhY2VkIGV2ZW50c1xuICAgICAgICAgICAgZWxzZSBpZiAobmFtZXNwYWNlKSB7XG4gICAgICAgICAgICAgICAga2V5cyhldmVudHMpLmZvckVhY2goZnVuY3Rpb24oZXZlbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50c0J5VHlwZSA9IGV2ZW50c1tldmVudFR5cGVdO1xuICAgICAgICAgICAgICAgICAgICBsID0gZXZlbnRzQnlUeXBlLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICB3aGlsZShsLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSBldmVudHNCeVR5cGVbbF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZS5uYW1lc3BhY2Uuc3BsaXQoXCIuXCIpWzBdID09PSBuYW1lc3BhY2Uuc3BsaXQoXCIuXCIpWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoZXZlbnRzLCBldmVudFR5cGUsIGwsIGVsLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBhbGwgaGFuZGxlcnMgYW5kIGJlaGF2aW9ycyBhdHRhY2hlZCB0byB0aGUgbWF0Y2hlZCBlbGVtZW50cyBmb3IgdGhlIGdpdmVuIGV2ZW50IHR5cGUuXG4gICAgICogQHBhcmFtICB7Tm9kZX0gICAgICAgZWwgICAgICAgLSBFdmVudHMgd2lsbCBiZSB0cmlnZ2VyZWQgZm9yIHRoaWUgRE9NIE5vZGVcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICBldmVudCAgICAtIE9uZSBvciBtb3JlIHNwYWNlLXNlcGFyYXRlZCBldmVudCB0eXBlcyBhbmQgb3B0aW9uYWwgbmFtZXNwYWNlc1xuICAgICAqL1xuICAgIHRyaWdnZXI6IGZ1bmN0aW9uKGVsLCBldmVudCkge1xuICAgICAgICB2YXIgZXZlbnRzID0gW107XG5cbiAgICAgICAgaWYgKGlzU3RyaW5nKGV2ZW50KSkge1xuICAgICAgICAgICAgZXZlbnRzID0gZXZlbnQuc3BsaXQoXCIgXCIpLm1hcChmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBqQm9uZS5FdmVudChldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnQgaW5zdGFuY2VvZiBFdmVudCA/IGV2ZW50IDogakJvbmUuRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgZXZlbnRzID0gW2V2ZW50XTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIWV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQgJiYgZWwuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaDogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgaSA9IDAsXG4gICAgICAgICAgICBqID0gMCxcbiAgICAgICAgICAgIGVsID0gdGhpcyxcbiAgICAgICAgICAgIGhhbmRsZXJzID0gakJvbmUuZ2V0RGF0YShlbCkuZXZlbnRzW2UudHlwZV0sXG4gICAgICAgICAgICBsZW5ndGggPSBoYW5kbGVycy5sZW5ndGgsXG4gICAgICAgICAgICBoYW5kbGVyUXVldWUgPSBbXSxcbiAgICAgICAgICAgIHRhcmdldHMgPSBbXSxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICBleHBlY3RlZFRhcmdldCxcbiAgICAgICAgICAgIGhhbmRsZXIsXG4gICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgIGV2ZW50T3B0aW9ucztcblxuICAgICAgICAvLyBjYWNoZSBhbGwgZXZlbnRzIGhhbmRsZXJzLCBmaXggaXNzdWUgd2l0aCBtdWx0aXBsZSBoYW5kbGVycyAoaXNzdWUgIzQ1KVxuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYW5kbGVyUXVldWUucHVzaChoYW5kbGVyc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpID0gMDtcbiAgICAgICAgbGVuZ3RoID0gaGFuZGxlclF1ZXVlLmxlbmd0aDtcblxuICAgICAgICBmb3IgKDtcbiAgICAgICAgICAgIC8vIGlmIGV2ZW50IGV4aXN0c1xuICAgICAgICAgICAgaSA8IGxlbmd0aCAmJlxuICAgICAgICAgICAgLy8gaWYgaGFuZGxlciBpcyBub3QgcmVtb3ZlZCBmcm9tIHN0YWNrXG4gICAgICAgICAgICB+aGFuZGxlcnMuaW5kZXhPZihoYW5kbGVyUXVldWVbaV0pICYmXG4gICAgICAgICAgICAvLyBpZiBwcm9wYWdhdGlvbiBpcyBub3Qgc3RvcHBlZFxuICAgICAgICAgICAgIShldmVudCAmJiBldmVudC5pc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCgpKTtcbiAgICAgICAgaSsrKSB7XG4gICAgICAgICAgICBleHBlY3RlZFRhcmdldCA9IG51bGw7XG4gICAgICAgICAgICBldmVudE9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIGhhbmRsZXIgPSBoYW5kbGVyUXVldWVbaV07XG4gICAgICAgICAgICBoYW5kbGVyLmRhdGEgJiYgKGV2ZW50T3B0aW9ucy5kYXRhID0gaGFuZGxlci5kYXRhKTtcblxuICAgICAgICAgICAgLy8gZXZlbnQgaGFuZGxlciB3aXRob3V0IHNlbGVjdG9yXG4gICAgICAgICAgICBpZiAoIWhhbmRsZXIuc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICBldmVudCA9IG5ldyBCb25lRXZlbnQoZSwgZXZlbnRPcHRpb25zKTtcblxuICAgICAgICAgICAgICAgIGlmICghKGUubmFtZXNwYWNlICYmIGUubmFtZXNwYWNlICE9PSBoYW5kbGVyLm5hbWVzcGFjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5vcmlnaW5mbi5jYWxsKGVsLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZXZlbnQgaGFuZGxlciB3aXRoIHNlbGVjdG9yXG4gICAgICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAvLyBpZiB0YXJnZXQgYW5kIHNlbGVjdGVkIGVsZW1lbnQgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICB+KHRhcmdldHMgPSBqQm9uZShlbCkuZmluZChoYW5kbGVyLnNlbGVjdG9yKSkuaW5kZXhPZihlLnRhcmdldCkgJiYgKGV4cGVjdGVkVGFyZ2V0ID0gZS50YXJnZXQpIHx8XG4gICAgICAgICAgICAgICAgLy8gaWYgb25lIG9mIGVsZW1lbnQgbWF0Y2hlZCB3aXRoIHNlbGVjdG9yIGNvbnRhaW5zIHRhcmdldFxuICAgICAgICAgICAgICAgIChlbCAhPT0gZS50YXJnZXQgJiYgZWwuY29udGFpbnMoZS50YXJnZXQpKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gZ2V0IGVsZW1lbnQgbWF0Y2hlZCB3aXRoIHNlbGVjdG9yXG4gICAgICAgICAgICAgICAgaWYgKCFleHBlY3RlZFRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICBsID0gdGFyZ2V0cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGogPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0c1tqXSAmJiB0YXJnZXRzW2pdLmNvbnRhaW5zKGUudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkVGFyZ2V0ID0gdGFyZ2V0c1tqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghZXhwZWN0ZWRUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZXZlbnRPcHRpb25zLmN1cnJlbnRUYXJnZXQgPSBleHBlY3RlZFRhcmdldDtcbiAgICAgICAgICAgICAgICBldmVudCA9IG5ldyBCb25lRXZlbnQoZSwgZXZlbnRPcHRpb25zKTtcblxuICAgICAgICAgICAgICAgIGlmICghKGUubmFtZXNwYWNlICYmIGUubmFtZXNwYWNlICE9PSBoYW5kbGVyLm5hbWVzcGFjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlci5vcmlnaW5mbi5jYWxsKGV4cGVjdGVkVGFyZ2V0LCBldmVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuZm4ub24gPSBmdW5jdGlvbih0eXBlcywgc2VsZWN0b3IsIGRhdGEsIGZuKSB7XG4gICAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBpID0gMDtcblxuICAgIGlmIChkYXRhID09IG51bGwgJiYgZm4gPT0gbnVsbCkge1xuICAgICAgICAvLyAodHlwZXMsIGZuKVxuICAgICAgICBmbiA9IHNlbGVjdG9yO1xuICAgICAgICBkYXRhID0gc2VsZWN0b3IgPSB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmIChmbiA9PSBudWxsKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIC8vICh0eXBlcywgc2VsZWN0b3IsIGZuKVxuICAgICAgICAgICAgZm4gPSBkYXRhO1xuICAgICAgICAgICAgZGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICh0eXBlcywgZGF0YSwgZm4pXG4gICAgICAgICAgICBmbiA9IGRhdGE7XG4gICAgICAgICAgICBkYXRhID0gc2VsZWN0b3I7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZm4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBqQm9uZS5ldmVudC5hZGQodGhpc1tpXSwgdHlwZXMsIGZuLCBkYXRhLCBzZWxlY3Rvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5vbmUgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIG9uZUFyZ3MgPSBzbGljZS5jYWxsKGFyZ3MsIDEsIGFyZ3MubGVuZ3RoIC0gMSksXG4gICAgICAgIGNhbGxiYWNrID0gc2xpY2UuY2FsbChhcmdzLCAtMSlbMF0sXG4gICAgICAgIGFkZExpc3RlbmVyO1xuXG4gICAgYWRkTGlzdGVuZXIgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICB2YXIgJGVsID0gakJvbmUoZWwpO1xuXG4gICAgICAgIGV2ZW50LnNwbGl0KFwiIFwiKS5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgZm4gPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgJGVsLm9mZihldmVudCwgZm4pO1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoZWwsIGUpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJGVsLm9uLmFwcGx5KCRlbCwgW2V2ZW50XS5jb25jYXQob25lQXJncywgZm4pKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYWRkTGlzdGVuZXIodGhpc1tpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi50cmlnZ2VyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgaWYgKCFldmVudCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGpCb25lLmV2ZW50LnRyaWdnZXIodGhpc1tpXSwgZXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4ub2ZmID0gZnVuY3Rpb24odHlwZXMsIHNlbGVjdG9yLCBoYW5kbGVyKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGlmIChpc0Z1bmN0aW9uKHNlbGVjdG9yKSkge1xuICAgICAgICBoYW5kbGVyID0gc2VsZWN0b3I7XG4gICAgICAgIHNlbGVjdG9yID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgakJvbmUuZXZlbnQucmVtb3ZlKHRoaXNbaV0sIHR5cGVzLCBoYW5kbGVyLCBzZWxlY3Rvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5maW5kID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIGZpbmRlciA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihlbC5xdWVyeVNlbGVjdG9yQWxsKSkge1xuICAgICAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSwgZnVuY3Rpb24oZm91bmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGZvdW5kKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZmluZGVyKHRoaXNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiBqQm9uZShyZXN1bHRzKTtcbn07XG5cbmZuLmdldCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgcmV0dXJuIGluZGV4ICE9IG51bGwgP1xuXG4gICAgICAgIC8vIFJldHVybiBqdXN0IG9uZSBlbGVtZW50IGZyb20gdGhlIHNldFxuICAgICAgICAoaW5kZXggPCAwID8gdGhpc1tpbmRleCArIHRoaXMubGVuZ3RoXSA6IHRoaXNbaW5kZXhdKSA6XG5cbiAgICAgICAgLy8gUmV0dXJuIGFsbCB0aGUgZWxlbWVudHMgaW4gYSBjbGVhbiBhcnJheVxuICAgICAgICBzbGljZS5jYWxsKHRoaXMpO1xufTtcblxuZm4uZXEgPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHJldHVybiBqQm9uZSh0aGlzW2luZGV4XSk7XG59O1xuXG5mbi5wYXJlbnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdLFxuICAgICAgICBwYXJlbnQsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCF+cmVzdWx0cy5pbmRleE9mKHBhcmVudCA9IHRoaXNbaV0ucGFyZW50RWxlbWVudCkgJiYgcGFyZW50KSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2gocGFyZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBqQm9uZShyZXN1bHRzKTtcbn07XG5cbmZuLnRvQXJyYXkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc2xpY2UuY2FsbCh0aGlzKTtcbn07XG5cbmZuLmlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICByZXR1cm4gdGhpcy5zb21lKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHJldHVybiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IGFyZ3NbMF07XG4gICAgfSk7XG59O1xuXG5mbi5oYXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHJldHVybiB0aGlzLnNvbWUoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgcmV0dXJuIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoYXJnc1swXSkubGVuZ3RoO1xuICAgIH0pO1xufTtcblxuZm4uYWRkID0gZnVuY3Rpb24oc2VsZWN0b3IsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5wdXNoU3RhY2soXG4gICAgICAgIGpCb25lLnVuaXF1ZShcbiAgICAgICAgICAgIGpCb25lLm1lcmdlKHRoaXMuZ2V0KCksIGpCb25lKHNlbGVjdG9yLCBjb250ZXh0KSlcbiAgICAgICAgKVxuICAgICk7XG59O1xuXG5mbi5hdHRyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIHNldHRlcjtcblxuICAgIGlmIChpc1N0cmluZyhrZXkpICYmIGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiB0aGlzWzBdICYmIHRoaXNbMF0uZ2V0QXR0cmlidXRlKGtleSk7XG4gICAgfVxuXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHNldHRlciA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmIChpc09iamVjdChrZXkpKSB7XG4gICAgICAgIHNldHRlciA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBrZXlzKGtleSkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKG5hbWUsIGtleVtuYW1lXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNldHRlcih0aGlzW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLnJlbW92ZUF0dHIgPSBmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzW2ldLnJlbW92ZUF0dHJpYnV0ZShrZXkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4udmFsID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbMF0gJiYgdGhpc1swXS52YWx1ZTtcbiAgICB9XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXNbaV0udmFsdWUgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLmNzcyA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBzZXR0ZXI7XG5cbiAgICAvLyBHZXQgYXR0cmlidXRlXG4gICAgaWYgKGlzU3RyaW5nKGtleSkgJiYgYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbMF0gJiYgd2luLmdldENvbXB1dGVkU3R5bGUodGhpc1swXSlba2V5XTtcbiAgICB9XG5cbiAgICAvLyBTZXQgYXR0cmlidXRlc1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBzZXR0ZXIgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgZWwuc3R5bGVba2V5XSA9IHZhbHVlO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qoa2V5KSkge1xuICAgICAgICBzZXR0ZXIgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAga2V5cyhrZXkpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgICAgIGVsLnN0eWxlW25hbWVdID0ga2V5W25hbWVdO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBzZXR0ZXIodGhpc1tpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5kYXRhID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLCBkYXRhID0ge30sXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgc2V0dGVyLFxuICAgICAgICBzZXRWYWx1ZSA9IGZ1bmN0aW9uKGVsLCBrZXksIHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgZWwuamRhdGEgPSBlbC5qZGF0YSB8fCB7fTtcbiAgICAgICAgICAgICAgICBlbC5qZGF0YVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsLmRhdGFzZXRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBnZXRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSBcImZhbHNlXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgIC8vIEdldCBhbGwgZGF0YVxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzWzBdLmpkYXRhICYmIChkYXRhID0gdGhpc1swXS5qZGF0YSk7XG5cbiAgICAgICAga2V5cyh0aGlzWzBdLmRhdGFzZXQpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgICBkYXRhW2tleV0gPSBnZXRWYWx1ZSh0aGlzWzBdLmRhdGFzZXRba2V5XSk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICAvLyBHZXQgZGF0YSBieSBuYW1lXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxICYmIGlzU3RyaW5nKGtleSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbMF0gJiYgZ2V0VmFsdWUodGhpc1swXS5kYXRhc2V0W2tleV0gfHwgdGhpc1swXS5qZGF0YSAmJiB0aGlzWzBdLmpkYXRhW2tleV0pO1xuICAgIH1cblxuICAgIC8vIFNldCBkYXRhXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxICYmIGlzT2JqZWN0KGtleSkpIHtcbiAgICAgICAgc2V0dGVyID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGtleXMoa2V5KS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBzZXRWYWx1ZShlbCwgbmFtZSwga2V5W25hbWVdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgc2V0dGVyID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIHNldFZhbHVlKGVsLCBrZXksIHZhbHVlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNldHRlcih0aGlzW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLnJlbW92ZURhdGEgPSBmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBqZGF0YSwgZGF0YXNldDtcblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgamRhdGEgPSB0aGlzW2ldLmpkYXRhO1xuICAgICAgICBkYXRhc2V0ID0gdGhpc1tpXS5kYXRhc2V0O1xuXG4gICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgIGpkYXRhICYmIGpkYXRhW2tleV0gJiYgZGVsZXRlIGpkYXRhW2tleV07XG4gICAgICAgICAgICBkZWxldGUgZGF0YXNldFtrZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gamRhdGEpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgamRhdGFba2V5XTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yIChrZXkgaW4gZGF0YXNldCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhc2V0W2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLmFkZENsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBqID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIGNsYXNzZXMgPSBjbGFzc05hbWUgPyBjbGFzc05hbWUudHJpbSgpLnNwbGl0KC9cXHMrLykgOiBbXTtcblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaiA9IDA7XG5cbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGNsYXNzZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHRoaXNbaV0uY2xhc3NMaXN0LmFkZChjbGFzc2VzW2pdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4ucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGogPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgY2xhc3NlcyA9IGNsYXNzTmFtZSA/IGNsYXNzTmFtZS50cmltKCkuc3BsaXQoL1xccysvKSA6IFtdO1xuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBqID0gMDtcblxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgY2xhc3Nlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdGhpc1tpXS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzZXNbal0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi50b2dnbGVDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgZm9yY2UpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBtZXRob2QgPSBcInRvZ2dsZVwiO1xuXG4gICAgZm9yY2UgPT09IHRydWUgJiYgKG1ldGhvZCA9IFwiYWRkXCIpIHx8IGZvcmNlID09PSBmYWxzZSAmJiAobWV0aG9kID0gXCJyZW1vdmVcIik7XG5cbiAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXNbaV0uY2xhc3NMaXN0W21ldGhvZF0oY2xhc3NOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4uaGFzQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICB2YXIgaSA9IDAsIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpc1tpXS5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuZm4uaHRtbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGVsO1xuXG4gICAgLy8gYWRkIEhUTUwgaW50byBlbGVtZW50c1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVtcHR5KCkuYXBwZW5kKHZhbHVlKTtcbiAgICB9XG4gICAgLy8gZ2V0IEhUTUwgZnJvbSBlbGVtZW50XG4gICAgZWxzZSBpZiAoYXJncy5sZW5ndGggPT09IDAgJiYgKGVsID0gdGhpc1swXSkpIHtcbiAgICAgICAgcmV0dXJuIGVsLmlubmVySFRNTDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLmFwcGVuZCA9IGZ1bmN0aW9uKGFwcGVuZGVkKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgc2V0dGVyO1xuXG4gICAgLy8gY3JlYXRlIGpCb25lIG9iamVjdCBhbmQgdGhlbiBhcHBlbmRcbiAgICBpZiAoaXNTdHJpbmcoYXBwZW5kZWQpICYmIHJxdWlja0V4cHIuZXhlYyhhcHBlbmRlZCkpIHtcbiAgICAgICAgYXBwZW5kZWQgPSBqQm9uZShhcHBlbmRlZCk7XG4gICAgfVxuICAgIC8vIGNyZWF0ZSB0ZXh0IG5vZGUgZm9yIGluc2VydGlvblxuICAgIGVsc2UgaWYgKCFpc09iamVjdChhcHBlbmRlZCkpIHtcbiAgICAgICAgYXBwZW5kZWQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhcHBlbmRlZCk7XG4gICAgfVxuXG4gICAgYXBwZW5kZWQgPSBhcHBlbmRlZCBpbnN0YW5jZW9mIGpCb25lID8gYXBwZW5kZWQgOiBqQm9uZShhcHBlbmRlZCk7XG5cbiAgICBzZXR0ZXIgPSBmdW5jdGlvbihlbCwgaSkge1xuICAgICAgICBhcHBlbmRlZC5mb3JFYWNoKGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQobm9kZS5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2V0dGVyKHRoaXNbaV0sIGkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4uYXBwZW5kVG8gPSBmdW5jdGlvbih0bykge1xuICAgIGpCb25lKHRvKS5hcHBlbmQodGhpcyk7XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLmVtcHR5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgZWw7XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVsID0gdGhpc1tpXTtcblxuICAgICAgICB3aGlsZSAoZWwubGFzdENoaWxkKSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVDaGlsZChlbC5sYXN0Q2hpbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5yZW1vdmUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBlbDtcblxuICAgIC8vIHJlbW92ZSBhbGwgbGlzdGVuZXJzXG4gICAgdGhpcy5vZmYoKTtcblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWwgPSB0aGlzW2ldO1xuXG4gICAgICAgIC8vIHJlbW92ZSBkYXRhIGFuZCBub2Rlc1xuICAgICAgICBkZWxldGUgZWwuamRhdGE7XG4gICAgICAgIGVsLnBhcmVudE5vZGUgJiYgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiBtb2R1bGUgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgLy8gRXhwb3NlIGpCb25lIGFzIG1vZHVsZS5leHBvcnRzIGluIGxvYWRlcnMgdGhhdCBpbXBsZW1lbnQgdGhlIE5vZGVcbiAgICAvLyBtb2R1bGUgcGF0dGVybiAoaW5jbHVkaW5nIGJyb3dzZXJpZnkpLiBEbyBub3QgY3JlYXRlIHRoZSBnbG9iYWwsIHNpbmNlXG4gICAgLy8gdGhlIHVzZXIgd2lsbCBiZSBzdG9yaW5nIGl0IHRoZW1zZWx2ZXMgbG9jYWxseSwgYW5kIGdsb2JhbHMgYXJlIGZyb3duZWRcbiAgICAvLyB1cG9uIGluIHRoZSBOb2RlIG1vZHVsZSB3b3JsZC5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGpCb25lO1xufVxuLy8gUmVnaXN0ZXIgYXMgYSBBTUQgbW9kdWxlXG5lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGpCb25lO1xuICAgIH0pO1xuXG4gICAgd2luLmpCb25lID0gd2luLiQgPSBqQm9uZTtcbn0gZWxzZSBpZiAodHlwZW9mIHdpbiA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygd2luLmRvY3VtZW50ID09PSBcIm9iamVjdFwiKSB7XG4gICAgd2luLmpCb25lID0gd2luLiQgPSBqQm9uZTtcbn1cblxufSh3aW5kb3cpKTtcbiIsIi8qIVxuICogcmV2ZWFsLmpzXG4gKiBodHRwOi8vbGFiLmhha2ltLnNlL3JldmVhbC1qc1xuICogTUlUIGxpY2Vuc2VkXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEhha2ltIEVsIEhhdHRhYiwgaHR0cDovL2hha2ltLnNlXG4gKi9cbihmdW5jdGlvbiggcm9vdCwgZmFjdG9yeSApIHtcblx0aWYoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcblx0XHQvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cdFx0ZGVmaW5lKCBmdW5jdGlvbigpIHtcblx0XHRcdHJvb3QuUmV2ZWFsID0gZmFjdG9yeSgpO1xuXHRcdFx0cmV0dXJuIHJvb3QuUmV2ZWFsO1xuXHRcdH0gKTtcblx0fSBlbHNlIGlmKCB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgKSB7XG5cdFx0Ly8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUy5cblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fSBlbHNlIHtcblx0XHQvLyBCcm93c2VyIGdsb2JhbHMuXG5cdFx0cm9vdC5SZXZlYWwgPSBmYWN0b3J5KCk7XG5cdH1cbn0oIHRoaXMsIGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUmV2ZWFsO1xuXG5cdC8vIFRoZSByZXZlYWwuanMgdmVyc2lvblxuXHR2YXIgVkVSU0lPTiA9ICczLjMuMCc7XG5cblx0dmFyIFNMSURFU19TRUxFQ1RPUiA9ICcuc2xpZGVzIHNlY3Rpb24nLFxuXHRcdEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SID0gJy5zbGlkZXM+c2VjdGlvbicsXG5cdFx0VkVSVElDQUxfU0xJREVTX1NFTEVDVE9SID0gJy5zbGlkZXM+c2VjdGlvbi5wcmVzZW50PnNlY3Rpb24nLFxuXHRcdEhPTUVfU0xJREVfU0VMRUNUT1IgPSAnLnNsaWRlcz5zZWN0aW9uOmZpcnN0LW9mLXR5cGUnLFxuXHRcdFVBID0gbmF2aWdhdG9yLnVzZXJBZ2VudCxcblxuXHRcdC8vIENvbmZpZ3VyYXRpb24gZGVmYXVsdHMsIGNhbiBiZSBvdmVycmlkZGVuIGF0IGluaXRpYWxpemF0aW9uIHRpbWVcblx0XHRjb25maWcgPSB7XG5cblx0XHRcdC8vIFRoZSBcIm5vcm1hbFwiIHNpemUgb2YgdGhlIHByZXNlbnRhdGlvbiwgYXNwZWN0IHJhdGlvIHdpbGwgYmUgcHJlc2VydmVkXG5cdFx0XHQvLyB3aGVuIHRoZSBwcmVzZW50YXRpb24gaXMgc2NhbGVkIHRvIGZpdCBkaWZmZXJlbnQgcmVzb2x1dGlvbnNcblx0XHRcdHdpZHRoOiA5NjAsXG5cdFx0XHRoZWlnaHQ6IDcwMCxcblxuXHRcdFx0Ly8gRmFjdG9yIG9mIHRoZSBkaXNwbGF5IHNpemUgdGhhdCBzaG91bGQgcmVtYWluIGVtcHR5IGFyb3VuZCB0aGUgY29udGVudFxuXHRcdFx0bWFyZ2luOiAwLjEsXG5cblx0XHRcdC8vIEJvdW5kcyBmb3Igc21hbGxlc3QvbGFyZ2VzdCBwb3NzaWJsZSBzY2FsZSB0byBhcHBseSB0byBjb250ZW50XG5cdFx0XHRtaW5TY2FsZTogMC4yLFxuXHRcdFx0bWF4U2NhbGU6IDEuNSxcblxuXHRcdFx0Ly8gRGlzcGxheSBjb250cm9scyBpbiB0aGUgYm90dG9tIHJpZ2h0IGNvcm5lclxuXHRcdFx0Y29udHJvbHM6IHRydWUsXG5cblx0XHRcdC8vIERpc3BsYXkgYSBwcmVzZW50YXRpb24gcHJvZ3Jlc3MgYmFyXG5cdFx0XHRwcm9ncmVzczogdHJ1ZSxcblxuXHRcdFx0Ly8gRGlzcGxheSB0aGUgcGFnZSBudW1iZXIgb2YgdGhlIGN1cnJlbnQgc2xpZGVcblx0XHRcdHNsaWRlTnVtYmVyOiBmYWxzZSxcblxuXHRcdFx0Ly8gUHVzaCBlYWNoIHNsaWRlIGNoYW5nZSB0byB0aGUgYnJvd3NlciBoaXN0b3J5XG5cdFx0XHRoaXN0b3J5OiBmYWxzZSxcblxuXHRcdFx0Ly8gRW5hYmxlIGtleWJvYXJkIHNob3J0Y3V0cyBmb3IgbmF2aWdhdGlvblxuXHRcdFx0a2V5Ym9hcmQ6IHRydWUsXG5cblx0XHRcdC8vIE9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgYmxvY2tzIGtleWJvYXJkIGV2ZW50cyB3aGVuIHJldHVuaW5nIGZhbHNlXG5cdFx0XHRrZXlib2FyZENvbmRpdGlvbjogbnVsbCxcblxuXHRcdFx0Ly8gRW5hYmxlIHRoZSBzbGlkZSBvdmVydmlldyBtb2RlXG5cdFx0XHRvdmVydmlldzogdHJ1ZSxcblxuXHRcdFx0Ly8gVmVydGljYWwgY2VudGVyaW5nIG9mIHNsaWRlc1xuXHRcdFx0Y2VudGVyOiB0cnVlLFxuXG5cdFx0XHQvLyBFbmFibGVzIHRvdWNoIG5hdmlnYXRpb24gb24gZGV2aWNlcyB3aXRoIHRvdWNoIGlucHV0XG5cdFx0XHR0b3VjaDogdHJ1ZSxcblxuXHRcdFx0Ly8gTG9vcCB0aGUgcHJlc2VudGF0aW9uXG5cdFx0XHRsb29wOiBmYWxzZSxcblxuXHRcdFx0Ly8gQ2hhbmdlIHRoZSBwcmVzZW50YXRpb24gZGlyZWN0aW9uIHRvIGJlIFJUTFxuXHRcdFx0cnRsOiBmYWxzZSxcblxuXHRcdFx0Ly8gUmFuZG9taXplcyB0aGUgb3JkZXIgb2Ygc2xpZGVzIGVhY2ggdGltZSB0aGUgcHJlc2VudGF0aW9uIGxvYWRzXG5cdFx0XHRzaHVmZmxlOiBmYWxzZSxcblxuXHRcdFx0Ly8gVHVybnMgZnJhZ21lbnRzIG9uIGFuZCBvZmYgZ2xvYmFsbHlcblx0XHRcdGZyYWdtZW50czogdHJ1ZSxcblxuXHRcdFx0Ly8gRmxhZ3MgaWYgdGhlIHByZXNlbnRhdGlvbiBpcyBydW5uaW5nIGluIGFuIGVtYmVkZGVkIG1vZGUsXG5cdFx0XHQvLyBpLmUuIGNvbnRhaW5lZCB3aXRoaW4gYSBsaW1pdGVkIHBvcnRpb24gb2YgdGhlIHNjcmVlblxuXHRcdFx0ZW1iZWRkZWQ6IGZhbHNlLFxuXG5cdFx0XHQvLyBGbGFncyBpZiB3ZSBzaG91bGQgc2hvdyBhIGhlbHAgb3ZlcmxheSB3aGVuIHRoZSBxdWVzdGlvbm1hcmtcblx0XHRcdC8vIGtleSBpcyBwcmVzc2VkXG5cdFx0XHRoZWxwOiB0cnVlLFxuXG5cdFx0XHQvLyBGbGFncyBpZiBpdCBzaG91bGQgYmUgcG9zc2libGUgdG8gcGF1c2UgdGhlIHByZXNlbnRhdGlvbiAoYmxhY2tvdXQpXG5cdFx0XHRwYXVzZTogdHJ1ZSxcblxuXHRcdFx0Ly8gRmxhZ3MgaWYgc3BlYWtlciBub3RlcyBzaG91bGQgYmUgdmlzaWJsZSB0byBhbGwgdmlld2Vyc1xuXHRcdFx0c2hvd05vdGVzOiBmYWxzZSxcblxuXHRcdFx0Ly8gTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBiZXR3ZWVuIGF1dG9tYXRpY2FsbHkgcHJvY2VlZGluZyB0byB0aGVcblx0XHRcdC8vIG5leHQgc2xpZGUsIGRpc2FibGVkIHdoZW4gc2V0IHRvIDAsIHRoaXMgdmFsdWUgY2FuIGJlIG92ZXJ3cml0dGVuXG5cdFx0XHQvLyBieSB1c2luZyBhIGRhdGEtYXV0b3NsaWRlIGF0dHJpYnV0ZSBvbiB5b3VyIHNsaWRlc1xuXHRcdFx0YXV0b1NsaWRlOiAwLFxuXG5cdFx0XHQvLyBTdG9wIGF1dG8tc2xpZGluZyBhZnRlciB1c2VyIGlucHV0XG5cdFx0XHRhdXRvU2xpZGVTdG9wcGFibGU6IHRydWUsXG5cblx0XHRcdC8vIFVzZSB0aGlzIG1ldGhvZCBmb3IgbmF2aWdhdGlvbiB3aGVuIGF1dG8tc2xpZGluZyAoZGVmYXVsdHMgdG8gbmF2aWdhdGVOZXh0KVxuXHRcdFx0YXV0b1NsaWRlTWV0aG9kOiBudWxsLFxuXG5cdFx0XHQvLyBFbmFibGUgc2xpZGUgbmF2aWdhdGlvbiB2aWEgbW91c2Ugd2hlZWxcblx0XHRcdG1vdXNlV2hlZWw6IGZhbHNlLFxuXG5cdFx0XHQvLyBBcHBseSBhIDNEIHJvbGwgdG8gbGlua3Mgb24gaG92ZXJcblx0XHRcdHJvbGxpbmdMaW5rczogZmFsc2UsXG5cblx0XHRcdC8vIEhpZGVzIHRoZSBhZGRyZXNzIGJhciBvbiBtb2JpbGUgZGV2aWNlc1xuXHRcdFx0aGlkZUFkZHJlc3NCYXI6IHRydWUsXG5cblx0XHRcdC8vIE9wZW5zIGxpbmtzIGluIGFuIGlmcmFtZSBwcmV2aWV3IG92ZXJsYXlcblx0XHRcdHByZXZpZXdMaW5rczogZmFsc2UsXG5cblx0XHRcdC8vIEV4cG9zZXMgdGhlIHJldmVhbC5qcyBBUEkgdGhyb3VnaCB3aW5kb3cucG9zdE1lc3NhZ2Vcblx0XHRcdHBvc3RNZXNzYWdlOiB0cnVlLFxuXG5cdFx0XHQvLyBEaXNwYXRjaGVzIGFsbCByZXZlYWwuanMgZXZlbnRzIHRvIHRoZSBwYXJlbnQgd2luZG93IHRocm91Z2ggcG9zdE1lc3NhZ2Vcblx0XHRcdHBvc3RNZXNzYWdlRXZlbnRzOiBmYWxzZSxcblxuXHRcdFx0Ly8gRm9jdXNlcyBib2R5IHdoZW4gcGFnZSBjaGFuZ2VzIHZpc2libGl0eSB0byBlbnN1cmUga2V5Ym9hcmQgc2hvcnRjdXRzIHdvcmtcblx0XHRcdGZvY3VzQm9keU9uUGFnZVZpc2liaWxpdHlDaGFuZ2U6IHRydWUsXG5cblx0XHRcdC8vIFRyYW5zaXRpb24gc3R5bGVcblx0XHRcdHRyYW5zaXRpb246ICdzbGlkZScsIC8vIG5vbmUvZmFkZS9zbGlkZS9jb252ZXgvY29uY2F2ZS96b29tXG5cblx0XHRcdC8vIFRyYW5zaXRpb24gc3BlZWRcblx0XHRcdHRyYW5zaXRpb25TcGVlZDogJ2RlZmF1bHQnLCAvLyBkZWZhdWx0L2Zhc3Qvc2xvd1xuXG5cdFx0XHQvLyBUcmFuc2l0aW9uIHN0eWxlIGZvciBmdWxsIHBhZ2Ugc2xpZGUgYmFja2dyb3VuZHNcblx0XHRcdGJhY2tncm91bmRUcmFuc2l0aW9uOiAnZmFkZScsIC8vIG5vbmUvZmFkZS9zbGlkZS9jb252ZXgvY29uY2F2ZS96b29tXG5cblx0XHRcdC8vIFBhcmFsbGF4IGJhY2tncm91bmQgaW1hZ2Vcblx0XHRcdHBhcmFsbGF4QmFja2dyb3VuZEltYWdlOiAnJywgLy8gQ1NTIHN5bnRheCwgZS5nLiBcImEuanBnXCJcblxuXHRcdFx0Ly8gUGFyYWxsYXggYmFja2dyb3VuZCBzaXplXG5cdFx0XHRwYXJhbGxheEJhY2tncm91bmRTaXplOiAnJywgLy8gQ1NTIHN5bnRheCwgZS5nLiBcIjMwMDBweCAyMDAwcHhcIlxuXG5cdFx0XHQvLyBBbW91bnQgb2YgcGl4ZWxzIHRvIG1vdmUgdGhlIHBhcmFsbGF4IGJhY2tncm91bmQgcGVyIHNsaWRlIHN0ZXBcblx0XHRcdHBhcmFsbGF4QmFja2dyb3VuZEhvcml6b250YWw6IG51bGwsXG5cdFx0XHRwYXJhbGxheEJhY2tncm91bmRWZXJ0aWNhbDogbnVsbCxcblxuXHRcdFx0Ly8gTnVtYmVyIG9mIHNsaWRlcyBhd2F5IGZyb20gdGhlIGN1cnJlbnQgdGhhdCBhcmUgdmlzaWJsZVxuXHRcdFx0dmlld0Rpc3RhbmNlOiAzLFxuXG5cdFx0XHQvLyBTY3JpcHQgZGVwZW5kZW5jaWVzIHRvIGxvYWRcblx0XHRcdGRlcGVuZGVuY2llczogW11cblxuXHRcdH0sXG5cblx0XHQvLyBGbGFncyBpZiByZXZlYWwuanMgaXMgbG9hZGVkIChoYXMgZGlzcGF0Y2hlZCB0aGUgJ3JlYWR5JyBldmVudClcblx0XHRsb2FkZWQgPSBmYWxzZSxcblxuXHRcdC8vIEZsYWdzIGlmIHRoZSBvdmVydmlldyBtb2RlIGlzIGN1cnJlbnRseSBhY3RpdmVcblx0XHRvdmVydmlldyA9IGZhbHNlLFxuXG5cdFx0Ly8gSG9sZHMgdGhlIGRpbWVuc2lvbnMgb2Ygb3VyIG92ZXJ2aWV3IHNsaWRlcywgaW5jbHVkaW5nIG1hcmdpbnNcblx0XHRvdmVydmlld1NsaWRlV2lkdGggPSBudWxsLFxuXHRcdG92ZXJ2aWV3U2xpZGVIZWlnaHQgPSBudWxsLFxuXG5cdFx0Ly8gVGhlIGhvcml6b250YWwgYW5kIHZlcnRpY2FsIGluZGV4IG9mIHRoZSBjdXJyZW50bHkgYWN0aXZlIHNsaWRlXG5cdFx0aW5kZXhoLFxuXHRcdGluZGV4dixcblxuXHRcdC8vIFRoZSBwcmV2aW91cyBhbmQgY3VycmVudCBzbGlkZSBIVE1MIGVsZW1lbnRzXG5cdFx0cHJldmlvdXNTbGlkZSxcblx0XHRjdXJyZW50U2xpZGUsXG5cblx0XHRwcmV2aW91c0JhY2tncm91bmQsXG5cblx0XHQvLyBTbGlkZXMgbWF5IGhvbGQgYSBkYXRhLXN0YXRlIGF0dHJpYnV0ZSB3aGljaCB3ZSBwaWNrIHVwIGFuZCBhcHBseVxuXHRcdC8vIGFzIGEgY2xhc3MgdG8gdGhlIGJvZHkuIFRoaXMgbGlzdCBjb250YWlucyB0aGUgY29tYmluZWQgc3RhdGUgb2Zcblx0XHQvLyBhbGwgY3VycmVudCBzbGlkZXMuXG5cdFx0c3RhdGUgPSBbXSxcblxuXHRcdC8vIFRoZSBjdXJyZW50IHNjYWxlIG9mIHRoZSBwcmVzZW50YXRpb24gKHNlZSB3aWR0aC9oZWlnaHQgY29uZmlnKVxuXHRcdHNjYWxlID0gMSxcblxuXHRcdC8vIENTUyB0cmFuc2Zvcm0gdGhhdCBpcyBjdXJyZW50bHkgYXBwbGllZCB0byB0aGUgc2xpZGVzIGNvbnRhaW5lcixcblx0XHQvLyBzcGxpdCBpbnRvIHR3byBncm91cHNcblx0XHRzbGlkZXNUcmFuc2Zvcm0gPSB7IGxheW91dDogJycsIG92ZXJ2aWV3OiAnJyB9LFxuXG5cdFx0Ly8gQ2FjaGVkIHJlZmVyZW5jZXMgdG8gRE9NIGVsZW1lbnRzXG5cdFx0ZG9tID0ge30sXG5cblx0XHQvLyBGZWF0dXJlcyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIHNlZSAjY2hlY2tDYXBhYmlsaXRpZXMoKVxuXHRcdGZlYXR1cmVzID0ge30sXG5cblx0XHQvLyBDbGllbnQgaXMgYSBtb2JpbGUgZGV2aWNlLCBzZWUgI2NoZWNrQ2FwYWJpbGl0aWVzKClcblx0XHRpc01vYmlsZURldmljZSxcblxuXHRcdC8vIENsaWVudCBpcyBhIGRlc2t0b3AgQ2hyb21lLCBzZWUgI2NoZWNrQ2FwYWJpbGl0aWVzKClcblx0XHRpc0Nocm9tZSxcblxuXHRcdC8vIFRocm90dGxlcyBtb3VzZSB3aGVlbCBuYXZpZ2F0aW9uXG5cdFx0bGFzdE1vdXNlV2hlZWxTdGVwID0gMCxcblxuXHRcdC8vIERlbGF5cyB1cGRhdGVzIHRvIHRoZSBVUkwgZHVlIHRvIGEgQ2hyb21lIHRodW1ibmFpbGVyIGJ1Z1xuXHRcdHdyaXRlVVJMVGltZW91dCA9IDAsXG5cblx0XHQvLyBGbGFncyBpZiB0aGUgaW50ZXJhY3Rpb24gZXZlbnQgbGlzdGVuZXJzIGFyZSBib3VuZFxuXHRcdGV2ZW50c0FyZUJvdW5kID0gZmFsc2UsXG5cblx0XHQvLyBUaGUgY3VycmVudCBhdXRvLXNsaWRlIGR1cmF0aW9uXG5cdFx0YXV0b1NsaWRlID0gMCxcblxuXHRcdC8vIEF1dG8gc2xpZGUgcHJvcGVydGllc1xuXHRcdGF1dG9TbGlkZVBsYXllcixcblx0XHRhdXRvU2xpZGVUaW1lb3V0ID0gMCxcblx0XHRhdXRvU2xpZGVTdGFydFRpbWUgPSAtMSxcblx0XHRhdXRvU2xpZGVQYXVzZWQgPSBmYWxzZSxcblxuXHRcdC8vIEhvbGRzIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50bHkgb25nb2luZyB0b3VjaCBpbnB1dFxuXHRcdHRvdWNoID0ge1xuXHRcdFx0c3RhcnRYOiAwLFxuXHRcdFx0c3RhcnRZOiAwLFxuXHRcdFx0c3RhcnRTcGFuOiAwLFxuXHRcdFx0c3RhcnRDb3VudDogMCxcblx0XHRcdGNhcHR1cmVkOiBmYWxzZSxcblx0XHRcdHRocmVzaG9sZDogNDBcblx0XHR9LFxuXG5cdFx0Ly8gSG9sZHMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGtleWJvYXJkIHNob3J0Y3V0c1xuXHRcdGtleWJvYXJkU2hvcnRjdXRzID0ge1xuXHRcdFx0J04gICwgIFNQQUNFJzpcdFx0XHQnTmV4dCBzbGlkZScsXG5cdFx0XHQnUCc6XHRcdFx0XHRcdCdQcmV2aW91cyBzbGlkZScsXG5cdFx0XHQnJiM4NTkyOyAgLCAgSCc6XHRcdCdOYXZpZ2F0ZSBsZWZ0Jyxcblx0XHRcdCcmIzg1OTQ7ICAsICBMJzpcdFx0J05hdmlnYXRlIHJpZ2h0Jyxcblx0XHRcdCcmIzg1OTM7ICAsICBLJzpcdFx0J05hdmlnYXRlIHVwJyxcblx0XHRcdCcmIzg1OTU7ICAsICBKJzpcdFx0J05hdmlnYXRlIGRvd24nLFxuXHRcdFx0J0hvbWUnOlx0XHRcdFx0XHQnRmlyc3Qgc2xpZGUnLFxuXHRcdFx0J0VuZCc6XHRcdFx0XHRcdCdMYXN0IHNsaWRlJyxcblx0XHRcdCdCICAsICAuJzpcdFx0XHRcdCdQYXVzZScsXG5cdFx0XHQnRic6XHRcdFx0XHRcdCdGdWxsc2NyZWVuJyxcblx0XHRcdCdFU0MsIE8nOlx0XHRcdFx0J1NsaWRlIG92ZXJ2aWV3J1xuXHRcdH07XG5cblx0LyoqXG5cdCAqIFN0YXJ0cyB1cCB0aGUgcHJlc2VudGF0aW9uIGlmIHRoZSBjbGllbnQgaXMgY2FwYWJsZS5cblx0ICovXG5cdGZ1bmN0aW9uIGluaXRpYWxpemUoIG9wdGlvbnMgKSB7XG5cblx0XHRjaGVja0NhcGFiaWxpdGllcygpO1xuXG5cdFx0aWYoICFmZWF0dXJlcy50cmFuc2Zvcm1zMmQgJiYgIWZlYXR1cmVzLnRyYW5zZm9ybXMzZCApIHtcblx0XHRcdGRvY3VtZW50LmJvZHkuc2V0QXR0cmlidXRlKCAnY2xhc3MnLCAnbm8tdHJhbnNmb3JtcycgKTtcblxuXHRcdFx0Ly8gU2luY2UgSlMgd29uJ3QgYmUgcnVubmluZyBhbnkgZnVydGhlciwgd2UgbG9hZCBhbGwgbGF6eVxuXHRcdFx0Ly8gbG9hZGluZyBlbGVtZW50cyB1cGZyb250XG5cdFx0XHR2YXIgaW1hZ2VzID0gdG9BcnJheSggZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdpbWcnICkgKSxcblx0XHRcdFx0aWZyYW1lcyA9IHRvQXJyYXkoIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnaWZyYW1lJyApICk7XG5cblx0XHRcdHZhciBsYXp5TG9hZGFibGUgPSBpbWFnZXMuY29uY2F0KCBpZnJhbWVzICk7XG5cblx0XHRcdGZvciggdmFyIGkgPSAwLCBsZW4gPSBsYXp5TG9hZGFibGUubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRcdHZhciBlbGVtZW50ID0gbGF6eUxvYWRhYmxlW2ldO1xuXHRcdFx0XHRpZiggZWxlbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLXNyYycgKSApIHtcblx0XHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSggJ3NyYycsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1zcmMnICkgKTtcblx0XHRcdFx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBjb3JlIGZlYXR1cmVzIHdlIHdvbid0IGJlXG5cdFx0XHQvLyB1c2luZyBKYXZhU2NyaXB0IHRvIGNvbnRyb2wgdGhlIHByZXNlbnRhdGlvblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIENhY2hlIHJlZmVyZW5jZXMgdG8ga2V5IERPTSBlbGVtZW50c1xuXHRcdGRvbS53cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5yZXZlYWwnICk7XG5cdFx0ZG9tLnNsaWRlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcucmV2ZWFsIC5zbGlkZXMnICk7XG5cblx0XHQvLyBGb3JjZSBhIGxheW91dCB3aGVuIHRoZSB3aG9sZSBwYWdlLCBpbmNsIGZvbnRzLCBoYXMgbG9hZGVkXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgbGF5b3V0LCBmYWxzZSApO1xuXG5cdFx0dmFyIHF1ZXJ5ID0gUmV2ZWFsLmdldFF1ZXJ5SGFzaCgpO1xuXG5cdFx0Ly8gRG8gbm90IGFjY2VwdCBuZXcgZGVwZW5kZW5jaWVzIHZpYSBxdWVyeSBjb25maWcgdG8gYXZvaWRcblx0XHQvLyB0aGUgcG90ZW50aWFsIG9mIG1hbGljaW91cyBzY3JpcHQgaW5qZWN0aW9uXG5cdFx0aWYoIHR5cGVvZiBxdWVyeVsnZGVwZW5kZW5jaWVzJ10gIT09ICd1bmRlZmluZWQnICkgZGVsZXRlIHF1ZXJ5WydkZXBlbmRlbmNpZXMnXTtcblxuXHRcdC8vIENvcHkgb3B0aW9ucyBvdmVyIHRvIG91ciBjb25maWcgb2JqZWN0XG5cdFx0ZXh0ZW5kKCBjb25maWcsIG9wdGlvbnMgKTtcblx0XHRleHRlbmQoIGNvbmZpZywgcXVlcnkgKTtcblxuXHRcdC8vIEhpZGUgdGhlIGFkZHJlc3MgYmFyIGluIG1vYmlsZSBicm93c2Vyc1xuXHRcdGhpZGVBZGRyZXNzQmFyKCk7XG5cblx0XHQvLyBMb2FkcyB0aGUgZGVwZW5kZW5jaWVzIGFuZCBjb250aW51ZXMgdG8gI3N0YXJ0KCkgb25jZSBkb25lXG5cdFx0bG9hZCgpO1xuXG5cdH1cblxuXHQvKipcblx0ICogSW5zcGVjdCB0aGUgY2xpZW50IHRvIHNlZSB3aGF0IGl0J3MgY2FwYWJsZSBvZiwgdGhpc1xuXHQgKiBzaG91bGQgb25seSBoYXBwZW5zIG9uY2UgcGVyIHJ1bnRpbWUuXG5cdCAqL1xuXHRmdW5jdGlvbiBjaGVja0NhcGFiaWxpdGllcygpIHtcblxuXHRcdGlzTW9iaWxlRGV2aWNlID0gLyhpcGhvbmV8aXBvZHxpcGFkfGFuZHJvaWQpL2dpLnRlc3QoIFVBICk7XG5cdFx0aXNDaHJvbWUgPSAvY2hyb21lL2kudGVzdCggVUEgKSAmJiAhL2VkZ2UvaS50ZXN0KCBVQSApO1xuXG5cdFx0dmFyIHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblxuXHRcdGZlYXR1cmVzLnRyYW5zZm9ybXMzZCA9ICdXZWJraXRQZXJzcGVjdGl2ZScgaW4gdGVzdEVsZW1lbnQuc3R5bGUgfHxcblx0XHRcdFx0XHRcdFx0XHQnTW96UGVyc3BlY3RpdmUnIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J21zUGVyc3BlY3RpdmUnIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J09QZXJzcGVjdGl2ZScgaW4gdGVzdEVsZW1lbnQuc3R5bGUgfHxcblx0XHRcdFx0XHRcdFx0XHQncGVyc3BlY3RpdmUnIGluIHRlc3RFbGVtZW50LnN0eWxlO1xuXG5cdFx0ZmVhdHVyZXMudHJhbnNmb3JtczJkID0gJ1dlYmtpdFRyYW5zZm9ybScgaW4gdGVzdEVsZW1lbnQuc3R5bGUgfHxcblx0XHRcdFx0XHRcdFx0XHQnTW96VHJhbnNmb3JtJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSB8fFxuXHRcdFx0XHRcdFx0XHRcdCdtc1RyYW5zZm9ybScgaW4gdGVzdEVsZW1lbnQuc3R5bGUgfHxcblx0XHRcdFx0XHRcdFx0XHQnT1RyYW5zZm9ybScgaW4gdGVzdEVsZW1lbnQuc3R5bGUgfHxcblx0XHRcdFx0XHRcdFx0XHQndHJhbnNmb3JtJyBpbiB0ZXN0RWxlbWVudC5zdHlsZTtcblxuXHRcdGZlYXR1cmVzLnJlcXVlc3RBbmltYXRpb25GcmFtZU1ldGhvZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHRcdGZlYXR1cmVzLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHR5cGVvZiBmZWF0dXJlcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVNZXRob2QgPT09ICdmdW5jdGlvbic7XG5cblx0XHRmZWF0dXJlcy5jYW52YXMgPSAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdjYW52YXMnICkuZ2V0Q29udGV4dDtcblxuXHRcdC8vIFRyYW5zaXRpb25zIGluIHRoZSBvdmVydmlldyBhcmUgZGlzYWJsZWQgaW4gZGVza3RvcCBhbmRcblx0XHQvLyBTYWZhcmkgZHVlIHRvIGxhZ1xuXHRcdGZlYXR1cmVzLm92ZXJ2aWV3VHJhbnNpdGlvbnMgPSAhL1ZlcnNpb25cXC9bXFxkXFwuXSsuKlNhZmFyaS8udGVzdCggVUEgKTtcblxuXHRcdC8vIEZsYWdzIGlmIHdlIHNob3VsZCB1c2Ugem9vbSBpbnN0ZWFkIG9mIHRyYW5zZm9ybSB0byBzY2FsZVxuXHRcdC8vIHVwIHNsaWRlcy4gWm9vbSBwcm9kdWNlcyBjcmlzcGVyIHJlc3VsdHMgYnV0IGhhcyBhIGxvdCBvZlxuXHRcdC8vIHhicm93c2VyIHF1aXJrcyBzbyB3ZSBvbmx5IHVzZSBpdCBpbiB3aGl0ZWxzaXRlZCBicm93c2Vycy5cblx0XHRmZWF0dXJlcy56b29tID0gJ3pvb20nIGluIHRlc3RFbGVtZW50LnN0eWxlICYmICFpc01vYmlsZURldmljZSAmJlxuXHRcdFx0XHRcdFx0KCBpc0Nocm9tZSB8fCAvVmVyc2lvblxcL1tcXGRcXC5dKy4qU2FmYXJpLy50ZXN0KCBVQSApICk7XG5cblx0fVxuXG4gICAgLyoqXG4gICAgICogTG9hZHMgdGhlIGRlcGVuZGVuY2llcyBvZiByZXZlYWwuanMuIERlcGVuZGVuY2llcyBhcmVcbiAgICAgKiBkZWZpbmVkIHZpYSB0aGUgY29uZmlndXJhdGlvbiBvcHRpb24gJ2RlcGVuZGVuY2llcydcbiAgICAgKiBhbmQgd2lsbCBiZSBsb2FkZWQgcHJpb3IgdG8gc3RhcnRpbmcvYmluZGluZyByZXZlYWwuanMuXG4gICAgICogU29tZSBkZXBlbmRlbmNpZXMgbWF5IGhhdmUgYW4gJ2FzeW5jJyBmbGFnLCBpZiBzbyB0aGV5XG4gICAgICogd2lsbCBsb2FkIGFmdGVyIHJldmVhbC5qcyBoYXMgYmVlbiBzdGFydGVkIHVwLlxuICAgICAqL1xuXHRmdW5jdGlvbiBsb2FkKCkge1xuXG5cdFx0dmFyIHNjcmlwdHMgPSBbXSxcblx0XHRcdHNjcmlwdHNBc3luYyA9IFtdLFxuXHRcdFx0c2NyaXB0c1RvUHJlbG9hZCA9IDA7XG5cblx0XHQvLyBDYWxsZWQgb25jZSBzeW5jaHJvbm91cyBzY3JpcHRzIGZpbmlzaCBsb2FkaW5nXG5cdFx0ZnVuY3Rpb24gcHJvY2VlZCgpIHtcblx0XHRcdGlmKCBzY3JpcHRzQXN5bmMubGVuZ3RoICkge1xuXHRcdFx0XHQvLyBMb2FkIGFzeW5jaHJvbm91cyBzY3JpcHRzXG5cdFx0XHRcdGhlYWQuanMuYXBwbHkoIG51bGwsIHNjcmlwdHNBc3luYyApO1xuXHRcdFx0fVxuXG5cdFx0XHRzdGFydCgpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGxvYWRTY3JpcHQoIHMgKSB7XG5cdFx0XHRoZWFkLnJlYWR5KCBzLnNyYy5tYXRjaCggLyhbXFx3XFxkX1xcLV0qKVxcLj9qcyR8W15cXFxcXFwvXSokL2kgKVswXSwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIEV4dGVuc2lvbiBtYXkgY29udGFpbiBjYWxsYmFjayBmdW5jdGlvbnNcblx0XHRcdFx0aWYoIHR5cGVvZiBzLmNhbGxiYWNrID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdHMuY2FsbGJhY2suYXBwbHkoIHRoaXMgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCAtLXNjcmlwdHNUb1ByZWxvYWQgPT09IDAgKSB7XG5cdFx0XHRcdFx0cHJvY2VlZCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRmb3IoIHZhciBpID0gMCwgbGVuID0gY29uZmlnLmRlcGVuZGVuY2llcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdHZhciBzID0gY29uZmlnLmRlcGVuZGVuY2llc1tpXTtcblxuXHRcdFx0Ly8gTG9hZCBpZiB0aGVyZSdzIG5vIGNvbmRpdGlvbiBvciB0aGUgY29uZGl0aW9uIGlzIHRydXRoeVxuXHRcdFx0aWYoICFzLmNvbmRpdGlvbiB8fCBzLmNvbmRpdGlvbigpICkge1xuXHRcdFx0XHRpZiggcy5hc3luYyApIHtcblx0XHRcdFx0XHRzY3JpcHRzQXN5bmMucHVzaCggcy5zcmMgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRzY3JpcHRzLnB1c2goIHMuc3JjICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsb2FkU2NyaXB0KCBzICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoIHNjcmlwdHMubGVuZ3RoICkge1xuXHRcdFx0c2NyaXB0c1RvUHJlbG9hZCA9IHNjcmlwdHMubGVuZ3RoO1xuXG5cdFx0XHQvLyBMb2FkIHN5bmNocm9ub3VzIHNjcmlwdHNcblx0XHRcdGhlYWQuanMuYXBwbHkoIG51bGwsIHNjcmlwdHMgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRwcm9jZWVkKCk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogU3RhcnRzIHVwIHJldmVhbC5qcyBieSBiaW5kaW5nIGlucHV0IGV2ZW50cyBhbmQgbmF2aWdhdGluZ1xuXHQgKiB0byB0aGUgY3VycmVudCBVUkwgZGVlcGxpbmsgaWYgdGhlcmUgaXMgb25lLlxuXHQgKi9cblx0ZnVuY3Rpb24gc3RhcnQoKSB7XG5cblx0XHQvLyBNYWtlIHN1cmUgd2UndmUgZ290IGFsbCB0aGUgRE9NIGVsZW1lbnRzIHdlIG5lZWRcblx0XHRzZXR1cERPTSgpO1xuXG5cdFx0Ly8gTGlzdGVuIHRvIG1lc3NhZ2VzIHBvc3RlZCB0byB0aGlzIHdpbmRvd1xuXHRcdHNldHVwUG9zdE1lc3NhZ2UoKTtcblxuXHRcdC8vIFByZXZlbnQgdGhlIHNsaWRlcyBmcm9tIGJlaW5nIHNjcm9sbGVkIG91dCBvZiB2aWV3XG5cdFx0c2V0dXBTY3JvbGxQcmV2ZW50aW9uKCk7XG5cblx0XHQvLyBSZXNldHMgYWxsIHZlcnRpY2FsIHNsaWRlcyBzbyB0aGF0IG9ubHkgdGhlIGZpcnN0IGlzIHZpc2libGVcblx0XHRyZXNldFZlcnRpY2FsU2xpZGVzKCk7XG5cblx0XHQvLyBVcGRhdGVzIHRoZSBwcmVzZW50YXRpb24gdG8gbWF0Y2ggdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiB2YWx1ZXNcblx0XHRjb25maWd1cmUoKTtcblxuXHRcdC8vIFJlYWQgdGhlIGluaXRpYWwgaGFzaFxuXHRcdHJlYWRVUkwoKTtcblxuXHRcdC8vIFVwZGF0ZSBhbGwgYmFja2dyb3VuZHNcblx0XHR1cGRhdGVCYWNrZ3JvdW5kKCB0cnVlICk7XG5cblx0XHQvLyBOb3RpZnkgbGlzdGVuZXJzIHRoYXQgdGhlIHByZXNlbnRhdGlvbiBpcyByZWFkeSBidXQgdXNlIGEgMW1zXG5cdFx0Ly8gdGltZW91dCB0byBlbnN1cmUgaXQncyBub3QgZmlyZWQgc3luY2hyb25vdXNseSBhZnRlciAjaW5pdGlhbGl6ZSgpXG5cdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBFbmFibGUgdHJhbnNpdGlvbnMgbm93IHRoYXQgd2UncmUgbG9hZGVkXG5cdFx0XHRkb20uc2xpZGVzLmNsYXNzTGlzdC5yZW1vdmUoICduby10cmFuc2l0aW9uJyApO1xuXG5cdFx0XHRsb2FkZWQgPSB0cnVlO1xuXG5cdFx0XHRkaXNwYXRjaEV2ZW50KCAncmVhZHknLCB7XG5cdFx0XHRcdCdpbmRleGgnOiBpbmRleGgsXG5cdFx0XHRcdCdpbmRleHYnOiBpbmRleHYsXG5cdFx0XHRcdCdjdXJyZW50U2xpZGUnOiBjdXJyZW50U2xpZGVcblx0XHRcdH0gKTtcblx0XHR9LCAxICk7XG5cblx0XHQvLyBTcGVjaWFsIHNldHVwIGFuZCBjb25maWcgaXMgcmVxdWlyZWQgd2hlbiBwcmludGluZyB0byBQREZcblx0XHRpZiggaXNQcmludGluZ1BERigpICkge1xuXHRcdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcblxuXHRcdFx0Ly8gVGhlIGRvY3VtZW50IG5lZWRzIHRvIGhhdmUgbG9hZGVkIGZvciB0aGUgUERGIGxheW91dFxuXHRcdFx0Ly8gbWVhc3VyZW1lbnRzIHRvIGJlIGFjY3VyYXRlXG5cdFx0XHRpZiggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJyApIHtcblx0XHRcdFx0c2V0dXBQREYoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBzZXR1cFBERiApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmRzIGFuZCBzdG9yZXMgcmVmZXJlbmNlcyB0byBET00gZWxlbWVudHMgd2hpY2ggYXJlXG5cdCAqIHJlcXVpcmVkIGJ5IHRoZSBwcmVzZW50YXRpb24uIElmIGEgcmVxdWlyZWQgZWxlbWVudCBpc1xuXHQgKiBub3QgZm91bmQsIGl0IGlzIGNyZWF0ZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiBzZXR1cERPTSgpIHtcblxuXHRcdC8vIFByZXZlbnQgdHJhbnNpdGlvbnMgd2hpbGUgd2UncmUgbG9hZGluZ1xuXHRcdGRvbS5zbGlkZXMuY2xhc3NMaXN0LmFkZCggJ25vLXRyYW5zaXRpb24nICk7XG5cblx0XHQvLyBCYWNrZ3JvdW5kIGVsZW1lbnRcblx0XHRkb20uYmFja2dyb3VuZCA9IGNyZWF0ZVNpbmdsZXRvbk5vZGUoIGRvbS53cmFwcGVyLCAnZGl2JywgJ2JhY2tncm91bmRzJywgbnVsbCApO1xuXG5cdFx0Ly8gUHJvZ3Jlc3MgYmFyXG5cdFx0ZG9tLnByb2dyZXNzID0gY3JlYXRlU2luZ2xldG9uTm9kZSggZG9tLndyYXBwZXIsICdkaXYnLCAncHJvZ3Jlc3MnLCAnPHNwYW4+PC9zcGFuPicgKTtcblx0XHRkb20ucHJvZ3Jlc3NiYXIgPSBkb20ucHJvZ3Jlc3MucXVlcnlTZWxlY3RvciggJ3NwYW4nICk7XG5cblx0XHQvLyBBcnJvdyBjb250cm9sc1xuXHRcdGNyZWF0ZVNpbmdsZXRvbk5vZGUoIGRvbS53cmFwcGVyLCAnYXNpZGUnLCAnY29udHJvbHMnLFxuXHRcdFx0JzxidXR0b24gY2xhc3M9XCJuYXZpZ2F0ZS1sZWZ0XCIgYXJpYS1sYWJlbD1cInByZXZpb3VzIHNsaWRlXCI+PC9idXR0b24+JyArXG5cdFx0XHQnPGJ1dHRvbiBjbGFzcz1cIm5hdmlnYXRlLXJpZ2h0XCIgYXJpYS1sYWJlbD1cIm5leHQgc2xpZGVcIj48L2J1dHRvbj4nICtcblx0XHRcdCc8YnV0dG9uIGNsYXNzPVwibmF2aWdhdGUtdXBcIiBhcmlhLWxhYmVsPVwiYWJvdmUgc2xpZGVcIj48L2J1dHRvbj4nICtcblx0XHRcdCc8YnV0dG9uIGNsYXNzPVwibmF2aWdhdGUtZG93blwiIGFyaWEtbGFiZWw9XCJiZWxvdyBzbGlkZVwiPjwvYnV0dG9uPicgKTtcblxuXHRcdC8vIFNsaWRlIG51bWJlclxuXHRcdGRvbS5zbGlkZU51bWJlciA9IGNyZWF0ZVNpbmdsZXRvbk5vZGUoIGRvbS53cmFwcGVyLCAnZGl2JywgJ3NsaWRlLW51bWJlcicsICcnICk7XG5cblx0XHQvLyBFbGVtZW50IGNvbnRhaW5pbmcgbm90ZXMgdGhhdCBhcmUgdmlzaWJsZSB0byB0aGUgYXVkaWVuY2Vcblx0XHRkb20uc3BlYWtlck5vdGVzID0gY3JlYXRlU2luZ2xldG9uTm9kZSggZG9tLndyYXBwZXIsICdkaXYnLCAnc3BlYWtlci1ub3RlcycsIG51bGwgKTtcblx0XHRkb20uc3BlYWtlck5vdGVzLnNldEF0dHJpYnV0ZSggJ2RhdGEtcHJldmVudC1zd2lwZScsICcnICk7XG5cblx0XHQvLyBPdmVybGF5IGdyYXBoaWMgd2hpY2ggaXMgZGlzcGxheWVkIGR1cmluZyB0aGUgcGF1c2VkIG1vZGVcblx0XHRjcmVhdGVTaW5nbGV0b25Ob2RlKCBkb20ud3JhcHBlciwgJ2RpdicsICdwYXVzZS1vdmVybGF5JywgbnVsbCApO1xuXG5cdFx0Ly8gQ2FjaGUgcmVmZXJlbmNlcyB0byBlbGVtZW50c1xuXHRcdGRvbS5jb250cm9scyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcucmV2ZWFsIC5jb250cm9scycgKTtcblx0XHRkb20udGhlbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnI3RoZW1lJyApO1xuXG5cdFx0ZG9tLndyYXBwZXIuc2V0QXR0cmlidXRlKCAncm9sZScsICdhcHBsaWNhdGlvbicgKTtcblxuXHRcdC8vIFRoZXJlIGNhbiBiZSBtdWx0aXBsZSBpbnN0YW5jZXMgb2YgY29udHJvbHMgdGhyb3VnaG91dCB0aGUgcGFnZVxuXHRcdGRvbS5jb250cm9sc0xlZnQgPSB0b0FycmF5KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm5hdmlnYXRlLWxlZnQnICkgKTtcblx0XHRkb20uY29udHJvbHNSaWdodCA9IHRvQXJyYXkoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubmF2aWdhdGUtcmlnaHQnICkgKTtcblx0XHRkb20uY29udHJvbHNVcCA9IHRvQXJyYXkoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubmF2aWdhdGUtdXAnICkgKTtcblx0XHRkb20uY29udHJvbHNEb3duID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5uYXZpZ2F0ZS1kb3duJyApICk7XG5cdFx0ZG9tLmNvbnRyb2xzUHJldiA9IHRvQXJyYXkoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubmF2aWdhdGUtcHJldicgKSApO1xuXHRcdGRvbS5jb250cm9sc05leHQgPSB0b0FycmF5KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm5hdmlnYXRlLW5leHQnICkgKTtcblxuXHRcdGRvbS5zdGF0dXNEaXYgPSBjcmVhdGVTdGF0dXNEaXYoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgaGlkZGVuIGRpdiB3aXRoIHJvbGUgYXJpYS1saXZlIHRvIGFubm91bmNlIHRoZVxuXHQgKiBjdXJyZW50IHNsaWRlIGNvbnRlbnQuIEhpZGUgdGhlIGRpdiBvZmYtc2NyZWVuIHRvIG1ha2UgaXRcblx0ICogYXZhaWxhYmxlIG9ubHkgdG8gQXNzaXN0aXZlIFRlY2hub2xvZ2llcy5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVN0YXR1c0RpdigpIHtcblxuXHRcdHZhciBzdGF0dXNEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ2FyaWEtc3RhdHVzLWRpdicgKTtcblx0XHRpZiggIXN0YXR1c0RpdiApIHtcblx0XHRcdHN0YXR1c0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0XHRzdGF0dXNEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXHRcdFx0c3RhdHVzRGl2LnN0eWxlLmhlaWdodCA9ICcxcHgnO1xuXHRcdFx0c3RhdHVzRGl2LnN0eWxlLndpZHRoID0gJzFweCc7XG5cdFx0XHRzdGF0dXNEaXYuc3R5bGUub3ZlcmZsb3cgPSdoaWRkZW4nO1xuXHRcdFx0c3RhdHVzRGl2LnN0eWxlLmNsaXAgPSAncmVjdCggMXB4LCAxcHgsIDFweCwgMXB4ICknO1xuXHRcdFx0c3RhdHVzRGl2LnNldEF0dHJpYnV0ZSggJ2lkJywgJ2FyaWEtc3RhdHVzLWRpdicgKTtcblx0XHRcdHN0YXR1c0Rpdi5zZXRBdHRyaWJ1dGUoICdhcmlhLWxpdmUnLCAncG9saXRlJyApO1xuXHRcdFx0c3RhdHVzRGl2LnNldEF0dHJpYnV0ZSggJ2FyaWEtYXRvbWljJywndHJ1ZScgKTtcblx0XHRcdGRvbS53cmFwcGVyLmFwcGVuZENoaWxkKCBzdGF0dXNEaXYgKTtcblx0XHR9XG5cdFx0cmV0dXJuIHN0YXR1c0RpdjtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENvbmZpZ3VyZXMgdGhlIHByZXNlbnRhdGlvbiBmb3IgcHJpbnRpbmcgdG8gYSBzdGF0aWNcblx0ICogUERGLlxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0dXBQREYoKSB7XG5cblx0XHR2YXIgc2xpZGVTaXplID0gZ2V0Q29tcHV0ZWRTbGlkZVNpemUoIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQgKTtcblxuXHRcdC8vIERpbWVuc2lvbnMgb2YgdGhlIFBERiBwYWdlc1xuXHRcdHZhciBwYWdlV2lkdGggPSBNYXRoLmZsb29yKCBzbGlkZVNpemUud2lkdGggKiAoIDEgKyBjb25maWcubWFyZ2luICkgKSxcblx0XHRcdHBhZ2VIZWlnaHQgPSBNYXRoLmZsb29yKCBzbGlkZVNpemUuaGVpZ2h0ICogKCAxICsgY29uZmlnLm1hcmdpbiAgKSApO1xuXG5cdFx0Ly8gRGltZW5zaW9ucyBvZiBzbGlkZXMgd2l0aGluIHRoZSBwYWdlc1xuXHRcdHZhciBzbGlkZVdpZHRoID0gc2xpZGVTaXplLndpZHRoLFxuXHRcdFx0c2xpZGVIZWlnaHQgPSBzbGlkZVNpemUuaGVpZ2h0O1xuXG5cdFx0Ly8gTGV0IHRoZSBicm93c2VyIGtub3cgd2hhdCBwYWdlIHNpemUgd2Ugd2FudCB0byBwcmludFxuXHRcdGluamVjdFN0eWxlU2hlZXQoICdAcGFnZXtzaXplOicrIHBhZ2VXaWR0aCArJ3B4ICcrIHBhZ2VIZWlnaHQgKydweDsgbWFyZ2luOiAwO30nICk7XG5cblx0XHQvLyBMaW1pdCB0aGUgc2l6ZSBvZiBjZXJ0YWluIGVsZW1lbnRzIHRvIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBzbGlkZVxuXHRcdGluamVjdFN0eWxlU2hlZXQoICcucmV2ZWFsIHNlY3Rpb24+aW1nLCAucmV2ZWFsIHNlY3Rpb24+dmlkZW8sIC5yZXZlYWwgc2VjdGlvbj5pZnJhbWV7bWF4LXdpZHRoOiAnKyBzbGlkZVdpZHRoICsncHg7IG1heC1oZWlnaHQ6Jysgc2xpZGVIZWlnaHQgKydweH0nICk7XG5cblx0XHRkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoICdwcmludC1wZGYnICk7XG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS53aWR0aCA9IHBhZ2VXaWR0aCArICdweCc7XG5cdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5oZWlnaHQgPSBwYWdlSGVpZ2h0ICsgJ3B4JztcblxuXHRcdC8vIEFkZCBlYWNoIHNsaWRlJ3MgaW5kZXggYXMgYXR0cmlidXRlcyBvbiBpdHNlbGYsIHdlIG5lZWQgdGhlc2Vcblx0XHQvLyBpbmRpY2VzIHRvIGdlbmVyYXRlIHNsaWRlIG51bWJlcnMgYmVsb3dcblx0XHR0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICkuZm9yRWFjaCggZnVuY3Rpb24oIGhzbGlkZSwgaCApIHtcblx0XHRcdGhzbGlkZS5zZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LWgnLCBoICk7XG5cblx0XHRcdGlmKCBoc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnc3RhY2snICkgKSB7XG5cdFx0XHRcdHRvQXJyYXkoIGhzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApLmZvckVhY2goIGZ1bmN0aW9uKCB2c2xpZGUsIHYgKSB7XG5cdFx0XHRcdFx0dnNsaWRlLnNldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtaCcsIGggKTtcblx0XHRcdFx0XHR2c2xpZGUuc2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC12JywgdiApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gU2xpZGUgYW5kIHNsaWRlIGJhY2tncm91bmQgbGF5b3V0XG5cdFx0dG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggc2xpZGUgKSB7XG5cblx0XHRcdC8vIFZlcnRpY2FsIHN0YWNrcyBhcmUgbm90IGNlbnRyZWQgc2luY2UgdGhlaXIgc2VjdGlvblxuXHRcdFx0Ly8gY2hpbGRyZW4gd2lsbCBiZVxuXHRcdFx0aWYoIHNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ3N0YWNrJyApID09PSBmYWxzZSApIHtcblx0XHRcdFx0Ly8gQ2VudGVyIHRoZSBzbGlkZSBpbnNpZGUgb2YgdGhlIHBhZ2UsIGdpdmluZyB0aGUgc2xpZGUgc29tZSBtYXJnaW5cblx0XHRcdFx0dmFyIGxlZnQgPSAoIHBhZ2VXaWR0aCAtIHNsaWRlV2lkdGggKSAvIDIsXG5cdFx0XHRcdFx0dG9wID0gKCBwYWdlSGVpZ2h0IC0gc2xpZGVIZWlnaHQgKSAvIDI7XG5cblx0XHRcdFx0dmFyIGNvbnRlbnRIZWlnaHQgPSBnZXRBYnNvbHV0ZUhlaWdodCggc2xpZGUgKTtcblx0XHRcdFx0dmFyIG51bWJlck9mUGFnZXMgPSBNYXRoLm1heCggTWF0aC5jZWlsKCBjb250ZW50SGVpZ2h0IC8gcGFnZUhlaWdodCApLCAxICk7XG5cblx0XHRcdFx0Ly8gQ2VudGVyIHNsaWRlcyB2ZXJ0aWNhbGx5XG5cdFx0XHRcdGlmKCBudW1iZXJPZlBhZ2VzID09PSAxICYmIGNvbmZpZy5jZW50ZXIgfHwgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnY2VudGVyJyApICkge1xuXHRcdFx0XHRcdHRvcCA9IE1hdGgubWF4KCAoIHBhZ2VIZWlnaHQgLSBjb250ZW50SGVpZ2h0ICkgLyAyLCAwICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBQb3NpdGlvbiB0aGUgc2xpZGUgaW5zaWRlIG9mIHRoZSBwYWdlXG5cdFx0XHRcdHNsaWRlLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4Jztcblx0XHRcdFx0c2xpZGUuc3R5bGUudG9wID0gdG9wICsgJ3B4Jztcblx0XHRcdFx0c2xpZGUuc3R5bGUud2lkdGggPSBzbGlkZVdpZHRoICsgJ3B4JztcblxuXHRcdFx0XHQvLyBUT0RPIEJhY2tncm91bmRzIG5lZWQgdG8gYmUgbXVsdGlwbGllZCB3aGVuIHRoZSBzbGlkZVxuXHRcdFx0XHQvLyBzdHJldGNoZXMgb3ZlciBtdWx0aXBsZSBwYWdlc1xuXHRcdFx0XHR2YXIgYmFja2dyb3VuZCA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoICcuc2xpZGUtYmFja2dyb3VuZCcgKTtcblx0XHRcdFx0aWYoIGJhY2tncm91bmQgKSB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZC5zdHlsZS53aWR0aCA9IHBhZ2VXaWR0aCArICdweCc7XG5cdFx0XHRcdFx0YmFja2dyb3VuZC5zdHlsZS5oZWlnaHQgPSAoIHBhZ2VIZWlnaHQgKiBudW1iZXJPZlBhZ2VzICkgKyAncHgnO1xuXHRcdFx0XHRcdGJhY2tncm91bmQuc3R5bGUudG9wID0gLXRvcCArICdweCc7XG5cdFx0XHRcdFx0YmFja2dyb3VuZC5zdHlsZS5sZWZ0ID0gLWxlZnQgKyAncHgnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSW5qZWN0IG5vdGVzIGlmIGBzaG93Tm90ZXNgIGlzIGVuYWJsZWRcblx0XHRcdFx0aWYoIGNvbmZpZy5zaG93Tm90ZXMgKSB7XG5cdFx0XHRcdFx0dmFyIG5vdGVzID0gZ2V0U2xpZGVOb3Rlcyggc2xpZGUgKTtcblx0XHRcdFx0XHRpZiggbm90ZXMgKSB7XG5cdFx0XHRcdFx0XHR2YXIgbm90ZXNTcGFjaW5nID0gODtcblx0XHRcdFx0XHRcdHZhciBub3Rlc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdFx0XHRcdFx0bm90ZXNFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdzcGVha2VyLW5vdGVzJyApO1xuXHRcdFx0XHRcdFx0bm90ZXNFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdzcGVha2VyLW5vdGVzLXBkZicgKTtcblx0XHRcdFx0XHRcdG5vdGVzRWxlbWVudC5pbm5lckhUTUwgPSBub3Rlcztcblx0XHRcdFx0XHRcdG5vdGVzRWxlbWVudC5zdHlsZS5sZWZ0ID0gKCBub3Rlc1NwYWNpbmcgLSBsZWZ0ICkgKyAncHgnO1xuXHRcdFx0XHRcdFx0bm90ZXNFbGVtZW50LnN0eWxlLmJvdHRvbSA9ICggbm90ZXNTcGFjaW5nIC0gdG9wICkgKyAncHgnO1xuXHRcdFx0XHRcdFx0bm90ZXNFbGVtZW50LnN0eWxlLndpZHRoID0gKCBwYWdlV2lkdGggLSBub3Rlc1NwYWNpbmcqMiApICsgJ3B4Jztcblx0XHRcdFx0XHRcdHNsaWRlLmFwcGVuZENoaWxkKCBub3Rlc0VsZW1lbnQgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJbmplY3Qgc2xpZGUgbnVtYmVycyBpZiBgc2xpZGVOdW1iZXJzYCBhcmUgZW5hYmxlZFxuXHRcdFx0XHRpZiggY29uZmlnLnNsaWRlTnVtYmVyICkge1xuXHRcdFx0XHRcdHZhciBzbGlkZU51bWJlckggPSBwYXJzZUludCggc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC1oJyApLCAxMCApICsgMSxcblx0XHRcdFx0XHRcdHNsaWRlTnVtYmVyViA9IHBhcnNlSW50KCBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LXYnICksIDEwICkgKyAxO1xuXG5cdFx0XHRcdFx0dmFyIG51bWJlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdFx0XHRcdG51bWJlckVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ3NsaWRlLW51bWJlcicgKTtcblx0XHRcdFx0XHRudW1iZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdzbGlkZS1udW1iZXItcGRmJyApO1xuXHRcdFx0XHRcdG51bWJlckVsZW1lbnQuaW5uZXJIVE1MID0gZm9ybWF0U2xpZGVOdW1iZXIoIHNsaWRlTnVtYmVySCwgJy4nLCBzbGlkZU51bWJlclYgKTtcblx0XHRcdFx0XHRiYWNrZ3JvdW5kLmFwcGVuZENoaWxkKCBudW1iZXJFbGVtZW50ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH0gKTtcblxuXHRcdC8vIFNob3cgYWxsIGZyYWdtZW50c1xuXHRcdHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFNMSURFU19TRUxFQ1RPUiArICcgLmZyYWdtZW50JyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGZyYWdtZW50ICkge1xuXHRcdFx0ZnJhZ21lbnQuY2xhc3NMaXN0LmFkZCggJ3Zpc2libGUnICk7XG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBpcyBhbiB1bmZvcnR1bmF0ZSBuZWNlc3NpdHkuIFNvbWUgYWN0aW9ucyDigJMgc3VjaCBhc1xuXHQgKiBhbiBpbnB1dCBmaWVsZCBiZWluZyBmb2N1c2VkIGluIGFuIGlmcmFtZSBvciB1c2luZyB0aGVcblx0ICoga2V5Ym9hcmQgdG8gZXhwYW5kIHRleHQgc2VsZWN0aW9uIGJleW9uZCB0aGUgYm91bmRzIG9mXG5cdCAqIGEgc2xpZGUg4oCTIGNhbiB0cmlnZ2VyIG91ciBjb250ZW50IHRvIGJlIHB1c2hlZCBvdXQgb2Ygdmlldy5cblx0ICogVGhpcyBzY3JvbGxpbmcgY2FuIG5vdCBiZSBwcmV2ZW50ZWQgYnkgaGlkaW5nIG92ZXJmbG93IGluXG5cdCAqIENTUyAod2UgYWxyZWFkeSBkbykgc28gd2UgaGF2ZSB0byByZXNvcnQgdG8gcmVwZWF0ZWRseVxuXHQgKiBjaGVja2luZyBpZiB0aGUgc2xpZGVzIGhhdmUgYmVlbiBvZmZzZXQgOihcblx0ICovXG5cdGZ1bmN0aW9uIHNldHVwU2Nyb2xsUHJldmVudGlvbigpIHtcblxuXHRcdHNldEludGVydmFsKCBmdW5jdGlvbigpIHtcblx0XHRcdGlmKCBkb20ud3JhcHBlci5zY3JvbGxUb3AgIT09IDAgfHwgZG9tLndyYXBwZXIuc2Nyb2xsTGVmdCAhPT0gMCApIHtcblx0XHRcdFx0ZG9tLndyYXBwZXIuc2Nyb2xsVG9wID0gMDtcblx0XHRcdFx0ZG9tLndyYXBwZXIuc2Nyb2xsTGVmdCA9IDA7XG5cdFx0XHR9XG5cdFx0fSwgMTAwMCApO1xuXG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBIVE1MIGVsZW1lbnQgYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG8gaXQuXG5cdCAqIElmIHRoZSBlbGVtZW50IGFscmVhZHkgZXhpc3RzIHRoZSBleGlzdGluZyBpbnN0YW5jZSB3aWxsXG5cdCAqIGJlIHJldHVybmVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlU2luZ2xldG9uTm9kZSggY29udGFpbmVyLCB0YWduYW1lLCBjbGFzc25hbWUsIGlubmVySFRNTCApIHtcblxuXHRcdC8vIEZpbmQgYWxsIG5vZGVzIG1hdGNoaW5nIHRoZSBkZXNjcmlwdGlvblxuXHRcdHZhciBub2RlcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLicgKyBjbGFzc25hbWUgKTtcblxuXHRcdC8vIENoZWNrIGFsbCBtYXRjaGVzIHRvIGZpbmQgb25lIHdoaWNoIGlzIGEgZGlyZWN0IGNoaWxkIG9mXG5cdFx0Ly8gdGhlIHNwZWNpZmllZCBjb250YWluZXJcblx0XHRmb3IoIHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0dmFyIHRlc3ROb2RlID0gbm9kZXNbaV07XG5cdFx0XHRpZiggdGVzdE5vZGUucGFyZW50Tm9kZSA9PT0gY29udGFpbmVyICkge1xuXHRcdFx0XHRyZXR1cm4gdGVzdE5vZGU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSWYgbm8gbm9kZSB3YXMgZm91bmQsIGNyZWF0ZSBpdCBub3dcblx0XHR2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIHRhZ25hbWUgKTtcblx0XHRub2RlLmNsYXNzTGlzdC5hZGQoIGNsYXNzbmFtZSApO1xuXHRcdGlmKCB0eXBlb2YgaW5uZXJIVE1MID09PSAnc3RyaW5nJyApIHtcblx0XHRcdG5vZGUuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuXHRcdH1cblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQoIG5vZGUgKTtcblxuXHRcdHJldHVybiBub2RlO1xuXG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyB0aGUgc2xpZGUgYmFja2dyb3VuZCBlbGVtZW50cyBhbmQgYXBwZW5kcyB0aGVtXG5cdCAqIHRvIHRoZSBiYWNrZ3JvdW5kIGNvbnRhaW5lci4gT25lIGVsZW1lbnQgaXMgY3JlYXRlZCBwZXJcblx0ICogc2xpZGUgbm8gbWF0dGVyIGlmIHRoZSBnaXZlbiBzbGlkZSBoYXMgdmlzaWJsZSBiYWNrZ3JvdW5kLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlQmFja2dyb3VuZHMoKSB7XG5cblx0XHR2YXIgcHJpbnRNb2RlID0gaXNQcmludGluZ1BERigpO1xuXG5cdFx0Ly8gQ2xlYXIgcHJpb3IgYmFja2dyb3VuZHNcblx0XHRkb20uYmFja2dyb3VuZC5pbm5lckhUTUwgPSAnJztcblx0XHRkb20uYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCAnbm8tdHJhbnNpdGlvbicgKTtcblxuXHRcdC8vIEl0ZXJhdGUgb3ZlciBhbGwgaG9yaXpvbnRhbCBzbGlkZXNcblx0XHR0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICkuZm9yRWFjaCggZnVuY3Rpb24oIHNsaWRlaCApIHtcblxuXHRcdFx0dmFyIGJhY2tncm91bmRTdGFjaztcblxuXHRcdFx0aWYoIHByaW50TW9kZSApIHtcblx0XHRcdFx0YmFja2dyb3VuZFN0YWNrID0gY3JlYXRlQmFja2dyb3VuZCggc2xpZGVoLCBzbGlkZWggKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRiYWNrZ3JvdW5kU3RhY2sgPSBjcmVhdGVCYWNrZ3JvdW5kKCBzbGlkZWgsIGRvbS5iYWNrZ3JvdW5kICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEl0ZXJhdGUgb3ZlciBhbGwgdmVydGljYWwgc2xpZGVzXG5cdFx0XHR0b0FycmF5KCBzbGlkZWgucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggc2xpZGV2ICkge1xuXG5cdFx0XHRcdGlmKCBwcmludE1vZGUgKSB7XG5cdFx0XHRcdFx0Y3JlYXRlQmFja2dyb3VuZCggc2xpZGV2LCBzbGlkZXYgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjcmVhdGVCYWNrZ3JvdW5kKCBzbGlkZXYsIGJhY2tncm91bmRTdGFjayApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YmFja2dyb3VuZFN0YWNrLmNsYXNzTGlzdC5hZGQoICdzdGFjaycgKTtcblxuXHRcdFx0fSApO1xuXG5cdFx0fSApO1xuXG5cdFx0Ly8gQWRkIHBhcmFsbGF4IGJhY2tncm91bmQgaWYgc3BlY2lmaWVkXG5cdFx0aWYoIGNvbmZpZy5wYXJhbGxheEJhY2tncm91bmRJbWFnZSApIHtcblxuXHRcdFx0ZG9tLmJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybChcIicgKyBjb25maWcucGFyYWxsYXhCYWNrZ3JvdW5kSW1hZ2UgKyAnXCIpJztcblx0XHRcdGRvbS5iYWNrZ3JvdW5kLnN0eWxlLmJhY2tncm91bmRTaXplID0gY29uZmlnLnBhcmFsbGF4QmFja2dyb3VuZFNpemU7XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB0aGUgYmVsb3cgcHJvcGVydGllcyBhcmUgc2V0IG9uIHRoZSBlbGVtZW50IC0gdGhlc2UgcHJvcGVydGllcyBhcmVcblx0XHRcdC8vIG5lZWRlZCBmb3IgcHJvcGVyIHRyYW5zaXRpb25zIHRvIGJlIHNldCBvbiB0aGUgZWxlbWVudCB2aWEgQ1NTLiBUbyByZW1vdmVcblx0XHRcdC8vIGFubm95aW5nIGJhY2tncm91bmQgc2xpZGUtaW4gZWZmZWN0IHdoZW4gdGhlIHByZXNlbnRhdGlvbiBzdGFydHMsIGFwcGx5XG5cdFx0XHQvLyB0aGVzZSBwcm9wZXJ0aWVzIGFmdGVyIHNob3J0IHRpbWUgZGVsYXlcblx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCAnaGFzLXBhcmFsbGF4LWJhY2tncm91bmQnICk7XG5cdFx0XHR9LCAxICk7XG5cblx0XHR9XG5cdFx0ZWxzZSB7XG5cblx0XHRcdGRvbS5iYWNrZ3JvdW5kLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICcnO1xuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggJ2hhcy1wYXJhbGxheC1iYWNrZ3JvdW5kJyApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGJhY2tncm91bmQgZm9yIHRoZSBnaXZlbiBzbGlkZS5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc2xpZGVcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIFRoZSBlbGVtZW50IHRoYXQgdGhlIGJhY2tncm91bmRcblx0ICogc2hvdWxkIGJlIGFwcGVuZGVkIHRvXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVCYWNrZ3JvdW5kKCBzbGlkZSwgY29udGFpbmVyICkge1xuXG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRiYWNrZ3JvdW5kOiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQnICksXG5cdFx0XHRiYWNrZ3JvdW5kU2l6ZTogc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLXNpemUnICksXG5cdFx0XHRiYWNrZ3JvdW5kSW1hZ2U6IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1pbWFnZScgKSxcblx0XHRcdGJhY2tncm91bmRWaWRlbzogc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLXZpZGVvJyApLFxuXHRcdFx0YmFja2dyb3VuZElmcmFtZTogc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWlmcmFtZScgKSxcblx0XHRcdGJhY2tncm91bmRDb2xvcjogc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWNvbG9yJyApLFxuXHRcdFx0YmFja2dyb3VuZFJlcGVhdDogc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLXJlcGVhdCcgKSxcblx0XHRcdGJhY2tncm91bmRQb3NpdGlvbjogc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLXBvc2l0aW9uJyApLFxuXHRcdFx0YmFja2dyb3VuZFRyYW5zaXRpb246IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC10cmFuc2l0aW9uJyApXG5cdFx0fTtcblxuXHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblxuXHRcdC8vIENhcnJ5IG92ZXIgY3VzdG9tIGNsYXNzZXMgZnJvbSB0aGUgc2xpZGUgdG8gdGhlIGJhY2tncm91bmRcblx0XHRlbGVtZW50LmNsYXNzTmFtZSA9ICdzbGlkZS1iYWNrZ3JvdW5kICcgKyBzbGlkZS5jbGFzc05hbWUucmVwbGFjZSggL3ByZXNlbnR8cGFzdHxmdXR1cmUvLCAnJyApO1xuXG5cdFx0aWYoIGRhdGEuYmFja2dyb3VuZCApIHtcblx0XHRcdC8vIEF1dG8td3JhcCBpbWFnZSB1cmxzIGluIHVybCguLi4pXG5cdFx0XHRpZiggL14oaHR0cHxmaWxlfFxcL1xcLykvZ2kudGVzdCggZGF0YS5iYWNrZ3JvdW5kICkgfHwgL1xcLihzdmd8cG5nfGpwZ3xqcGVnfGdpZnxibXApJC9naS50ZXN0KCBkYXRhLmJhY2tncm91bmQgKSApIHtcblx0XHRcdFx0c2xpZGUuc2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWltYWdlJywgZGF0YS5iYWNrZ3JvdW5kICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kID0gZGF0YS5iYWNrZ3JvdW5kO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIENyZWF0ZSBhIGhhc2ggZm9yIHRoaXMgY29tYmluYXRpb24gb2YgYmFja2dyb3VuZCBzZXR0aW5ncy5cblx0XHQvLyBUaGlzIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZW4gdHdvIHNsaWRlIGJhY2tncm91bmRzIGFyZVxuXHRcdC8vIHRoZSBzYW1lLlxuXHRcdGlmKCBkYXRhLmJhY2tncm91bmQgfHwgZGF0YS5iYWNrZ3JvdW5kQ29sb3IgfHwgZGF0YS5iYWNrZ3JvdW5kSW1hZ2UgfHwgZGF0YS5iYWNrZ3JvdW5kVmlkZW8gfHwgZGF0YS5iYWNrZ3JvdW5kSWZyYW1lICkge1xuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtaGFzaCcsIGRhdGEuYmFja2dyb3VuZCArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmJhY2tncm91bmRTaXplICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuYmFja2dyb3VuZEltYWdlICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuYmFja2dyb3VuZFZpZGVvICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuYmFja2dyb3VuZElmcmFtZSArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmJhY2tncm91bmRDb2xvciArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmJhY2tncm91bmRSZXBlYXQgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5iYWNrZ3JvdW5kUG9zaXRpb24gK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5iYWNrZ3JvdW5kVHJhbnNpdGlvbiApO1xuXHRcdH1cblxuXHRcdC8vIEFkZGl0aW9uYWwgYW5kIG9wdGlvbmFsIGJhY2tncm91bmQgcHJvcGVydGllc1xuXHRcdGlmKCBkYXRhLmJhY2tncm91bmRTaXplICkgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IGRhdGEuYmFja2dyb3VuZFNpemU7XG5cdFx0aWYoIGRhdGEuYmFja2dyb3VuZENvbG9yICkgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBkYXRhLmJhY2tncm91bmRDb2xvcjtcblx0XHRpZiggZGF0YS5iYWNrZ3JvdW5kUmVwZWF0ICkgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gZGF0YS5iYWNrZ3JvdW5kUmVwZWF0O1xuXHRcdGlmKCBkYXRhLmJhY2tncm91bmRQb3NpdGlvbiApIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gZGF0YS5iYWNrZ3JvdW5kUG9zaXRpb247XG5cdFx0aWYoIGRhdGEuYmFja2dyb3VuZFRyYW5zaXRpb24gKSBlbGVtZW50LnNldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC10cmFuc2l0aW9uJywgZGF0YS5iYWNrZ3JvdW5kVHJhbnNpdGlvbiApO1xuXG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKCBlbGVtZW50ICk7XG5cblx0XHQvLyBJZiBiYWNrZ3JvdW5kcyBhcmUgYmVpbmcgcmVjcmVhdGVkLCBjbGVhciBvbGQgY2xhc3Nlc1xuXHRcdHNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoICdoYXMtZGFyay1iYWNrZ3JvdW5kJyApO1xuXHRcdHNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoICdoYXMtbGlnaHQtYmFja2dyb3VuZCcgKTtcblxuXHRcdC8vIElmIHRoaXMgc2xpZGUgaGFzIGEgYmFja2dyb3VuZCBjb2xvciwgYWRkIGEgY2xhc3MgdGhhdFxuXHRcdC8vIHNpZ25hbHMgaWYgaXQgaXMgbGlnaHQgb3IgZGFyay4gSWYgdGhlIHNsaWRlIGhhcyBubyBiYWNrZ3JvdW5kXG5cdFx0Ly8gY29sb3IsIG5vIGNsYXNzIHdpbGwgYmUgc2V0XG5cdFx0dmFyIGNvbXB1dGVkQmFja2dyb3VuZENvbG9yID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGVsZW1lbnQgKS5iYWNrZ3JvdW5kQ29sb3I7XG5cdFx0aWYoIGNvbXB1dGVkQmFja2dyb3VuZENvbG9yICkge1xuXHRcdFx0dmFyIHJnYiA9IGNvbG9yVG9SZ2IoIGNvbXB1dGVkQmFja2dyb3VuZENvbG9yICk7XG5cblx0XHRcdC8vIElnbm9yZSBmdWxseSB0cmFuc3BhcmVudCBiYWNrZ3JvdW5kcy4gU29tZSBicm93c2VycyByZXR1cm5cblx0XHRcdC8vIHJnYmEoMCwwLDAsMCkgd2hlbiByZWFkaW5nIHRoZSBjb21wdXRlZCBiYWNrZ3JvdW5kIGNvbG9yIG9mXG5cdFx0XHQvLyBhbiBlbGVtZW50IHdpdGggbm8gYmFja2dyb3VuZFxuXHRcdFx0aWYoIHJnYiAmJiByZ2IuYSAhPT0gMCApIHtcblx0XHRcdFx0aWYoIGNvbG9yQnJpZ2h0bmVzcyggY29tcHV0ZWRCYWNrZ3JvdW5kQ29sb3IgKSA8IDEyOCApIHtcblx0XHRcdFx0XHRzbGlkZS5jbGFzc0xpc3QuYWRkKCAnaGFzLWRhcmstYmFja2dyb3VuZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRzbGlkZS5jbGFzc0xpc3QuYWRkKCAnaGFzLWxpZ2h0LWJhY2tncm91bmQnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZWxlbWVudDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVycyBhIGxpc3RlbmVyIHRvIHBvc3RNZXNzYWdlIGV2ZW50cywgdGhpcyBtYWtlcyBpdFxuXHQgKiBwb3NzaWJsZSB0byBjYWxsIGFsbCByZXZlYWwuanMgQVBJIG1ldGhvZHMgZnJvbSBhbm90aGVyXG5cdCAqIHdpbmRvdy4gRm9yIGV4YW1wbGU6XG5cdCAqXG5cdCAqIHJldmVhbFdpbmRvdy5wb3N0TWVzc2FnZSggSlNPTi5zdHJpbmdpZnkoe1xuXHQgKiAgIG1ldGhvZDogJ3NsaWRlJyxcblx0ICogICBhcmdzOiBbIDIgXVxuXHQgKiB9KSwgJyonICk7XG5cdCAqL1xuXHRmdW5jdGlvbiBzZXR1cFBvc3RNZXNzYWdlKCkge1xuXG5cdFx0aWYoIGNvbmZpZy5wb3N0TWVzc2FnZSApIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbWVzc2FnZScsIGZ1bmN0aW9uICggZXZlbnQgKSB7XG5cdFx0XHRcdHZhciBkYXRhID0gZXZlbnQuZGF0YTtcblxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgd2UncmUgZGVhbGluZyB3aXRoIEpTT05cblx0XHRcdFx0aWYoIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyAmJiBkYXRhLmNoYXJBdCggMCApID09PSAneycgJiYgZGF0YS5jaGFyQXQoIGRhdGEubGVuZ3RoIC0gMSApID09PSAnfScgKSB7XG5cdFx0XHRcdFx0ZGF0YSA9IEpTT04ucGFyc2UoIGRhdGEgKTtcblxuXHRcdFx0XHRcdC8vIENoZWNrIGlmIHRoZSByZXF1ZXN0ZWQgbWV0aG9kIGNhbiBiZSBmb3VuZFxuXHRcdFx0XHRcdGlmKCBkYXRhLm1ldGhvZCAmJiB0eXBlb2YgUmV2ZWFsW2RhdGEubWV0aG9kXSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRcdFJldmVhbFtkYXRhLm1ldGhvZF0uYXBwbHkoIFJldmVhbCwgZGF0YS5hcmdzICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LCBmYWxzZSApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgdGhlIGNvbmZpZ3VyYXRpb24gc2V0dGluZ3MgZnJvbSB0aGUgY29uZmlnXG5cdCAqIG9iamVjdC4gTWF5IGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcy5cblx0ICovXG5cdGZ1bmN0aW9uIGNvbmZpZ3VyZSggb3B0aW9ucyApIHtcblxuXHRcdHZhciBudW1iZXJPZlNsaWRlcyA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFNMSURFU19TRUxFQ1RPUiApLmxlbmd0aDtcblxuXHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoIGNvbmZpZy50cmFuc2l0aW9uICk7XG5cblx0XHQvLyBOZXcgY29uZmlnIG9wdGlvbnMgbWF5IGJlIHBhc3NlZCB3aGVuIHRoaXMgbWV0aG9kXG5cdFx0Ly8gaXMgaW52b2tlZCB0aHJvdWdoIHRoZSBBUEkgYWZ0ZXIgaW5pdGlhbGl6YXRpb25cblx0XHRpZiggdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICkgZXh0ZW5kKCBjb25maWcsIG9wdGlvbnMgKTtcblxuXHRcdC8vIEZvcmNlIGxpbmVhciB0cmFuc2l0aW9uIGJhc2VkIG9uIGJyb3dzZXIgY2FwYWJpbGl0aWVzXG5cdFx0aWYoIGZlYXR1cmVzLnRyYW5zZm9ybXMzZCA9PT0gZmFsc2UgKSBjb25maWcudHJhbnNpdGlvbiA9ICdsaW5lYXInO1xuXG5cdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggY29uZmlnLnRyYW5zaXRpb24gKTtcblxuXHRcdGRvbS53cmFwcGVyLnNldEF0dHJpYnV0ZSggJ2RhdGEtdHJhbnNpdGlvbi1zcGVlZCcsIGNvbmZpZy50cmFuc2l0aW9uU3BlZWQgKTtcblx0XHRkb20ud3JhcHBlci5zZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtdHJhbnNpdGlvbicsIGNvbmZpZy5iYWNrZ3JvdW5kVHJhbnNpdGlvbiApO1xuXG5cdFx0ZG9tLmNvbnRyb2xzLnN0eWxlLmRpc3BsYXkgPSBjb25maWcuY29udHJvbHMgPyAnYmxvY2snIDogJ25vbmUnO1xuXHRcdGRvbS5wcm9ncmVzcy5zdHlsZS5kaXNwbGF5ID0gY29uZmlnLnByb2dyZXNzID8gJ2Jsb2NrJyA6ICdub25lJztcblx0XHRkb20uc2xpZGVOdW1iZXIuc3R5bGUuZGlzcGxheSA9IGNvbmZpZy5zbGlkZU51bWJlciAmJiAhaXNQcmludGluZ1BERigpID8gJ2Jsb2NrJyA6ICdub25lJztcblxuXHRcdGlmKCBjb25maWcuc2h1ZmZsZSApIHtcblx0XHRcdHNodWZmbGUoKTtcblx0XHR9XG5cblx0XHRpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoICdydGwnICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggJ3J0bCcgKTtcblx0XHR9XG5cblx0XHRpZiggY29uZmlnLmNlbnRlciApIHtcblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoICdjZW50ZXInICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggJ2NlbnRlcicgKTtcblx0XHR9XG5cblx0XHQvLyBFeGl0IHRoZSBwYXVzZWQgbW9kZSBpZiBpdCB3YXMgY29uZmlndXJlZCBvZmZcblx0XHRpZiggY29uZmlnLnBhdXNlID09PSBmYWxzZSApIHtcblx0XHRcdHJlc3VtZSgpO1xuXHRcdH1cblxuXHRcdGlmKCBjb25maWcuc2hvd05vdGVzICkge1xuXHRcdFx0ZG9tLnNwZWFrZXJOb3Rlcy5jbGFzc0xpc3QuYWRkKCAndmlzaWJsZScgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRkb20uc3BlYWtlck5vdGVzLmNsYXNzTGlzdC5yZW1vdmUoICd2aXNpYmxlJyApO1xuXHRcdH1cblxuXHRcdGlmKCBjb25maWcubW91c2VXaGVlbCApIHtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdET01Nb3VzZVNjcm9sbCcsIG9uRG9jdW1lbnRNb3VzZVNjcm9sbCwgZmFsc2UgKTsgLy8gRkZcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdtb3VzZXdoZWVsJywgb25Eb2N1bWVudE1vdXNlU2Nyb2xsLCBmYWxzZSApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdET01Nb3VzZVNjcm9sbCcsIG9uRG9jdW1lbnRNb3VzZVNjcm9sbCwgZmFsc2UgKTsgLy8gRkZcblx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdtb3VzZXdoZWVsJywgb25Eb2N1bWVudE1vdXNlU2Nyb2xsLCBmYWxzZSApO1xuXHRcdH1cblxuXHRcdC8vIFJvbGxpbmcgM0QgbGlua3Ncblx0XHRpZiggY29uZmlnLnJvbGxpbmdMaW5rcyApIHtcblx0XHRcdGVuYWJsZVJvbGxpbmdMaW5rcygpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGRpc2FibGVSb2xsaW5nTGlua3MoKTtcblx0XHR9XG5cblx0XHQvLyBJZnJhbWUgbGluayBwcmV2aWV3c1xuXHRcdGlmKCBjb25maWcucHJldmlld0xpbmtzICkge1xuXHRcdFx0ZW5hYmxlUHJldmlld0xpbmtzKCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZGlzYWJsZVByZXZpZXdMaW5rcygpO1xuXHRcdFx0ZW5hYmxlUHJldmlld0xpbmtzKCAnW2RhdGEtcHJldmlldy1saW5rXScgKTtcblx0XHR9XG5cblx0XHQvLyBSZW1vdmUgZXhpc3RpbmcgYXV0by1zbGlkZSBjb250cm9sc1xuXHRcdGlmKCBhdXRvU2xpZGVQbGF5ZXIgKSB7XG5cdFx0XHRhdXRvU2xpZGVQbGF5ZXIuZGVzdHJveSgpO1xuXHRcdFx0YXV0b1NsaWRlUGxheWVyID0gbnVsbDtcblx0XHR9XG5cblx0XHQvLyBHZW5lcmF0ZSBhdXRvLXNsaWRlIGNvbnRyb2xzIGlmIG5lZWRlZFxuXHRcdGlmKCBudW1iZXJPZlNsaWRlcyA+IDEgJiYgY29uZmlnLmF1dG9TbGlkZSAmJiBjb25maWcuYXV0b1NsaWRlU3RvcHBhYmxlICYmIGZlYXR1cmVzLmNhbnZhcyAmJiBmZWF0dXJlcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgKSB7XG5cdFx0XHRhdXRvU2xpZGVQbGF5ZXIgPSBuZXcgUGxheWJhY2soIGRvbS53cmFwcGVyLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0cmV0dXJuIE1hdGgubWluKCBNYXRoLm1heCggKCBEYXRlLm5vdygpIC0gYXV0b1NsaWRlU3RhcnRUaW1lICkgLyBhdXRvU2xpZGUsIDAgKSwgMSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRhdXRvU2xpZGVQbGF5ZXIub24oICdjbGljaycsIG9uQXV0b1NsaWRlUGxheWVyQ2xpY2sgKTtcblx0XHRcdGF1dG9TbGlkZVBhdXNlZCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIFdoZW4gZnJhZ21lbnRzIGFyZSB0dXJuZWQgb2ZmIHRoZXkgc2hvdWxkIGJlIHZpc2libGVcblx0XHRpZiggY29uZmlnLmZyYWdtZW50cyA9PT0gZmFsc2UgKSB7XG5cdFx0XHR0b0FycmF5KCBkb20uc2xpZGVzLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQnICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCAndmlzaWJsZScgKTtcblx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnY3VycmVudC1mcmFnbWVudCcgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRzeW5jKCk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kcyBhbGwgZXZlbnQgbGlzdGVuZXJzLlxuXHQgKi9cblx0ZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnMoKSB7XG5cblx0XHRldmVudHNBcmVCb3VuZCA9IHRydWU7XG5cblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2hhc2hjaGFuZ2UnLCBvbldpbmRvd0hhc2hDaGFuZ2UsIGZhbHNlICk7XG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKTtcblxuXHRcdGlmKCBjb25maWcudG91Y2ggKSB7XG5cdFx0XHRkb20ud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIG9uVG91Y2hTdGFydCwgZmFsc2UgKTtcblx0XHRcdGRvbS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSwgZmFsc2UgKTtcblx0XHRcdGRvbS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaGVuZCcsIG9uVG91Y2hFbmQsIGZhbHNlICk7XG5cblx0XHRcdC8vIFN1cHBvcnQgcG9pbnRlci1zdHlsZSB0b3VjaCBpbnRlcmFjdGlvbiBhcyB3ZWxsXG5cdFx0XHRpZiggd2luZG93Lm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCApIHtcblx0XHRcdFx0Ly8gSUUgMTEgdXNlcyB1bi1wcmVmaXhlZCB2ZXJzaW9uIG9mIHBvaW50ZXIgZXZlbnRzXG5cdFx0XHRcdGRvbS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoICdwb2ludGVyZG93bicsIG9uUG9pbnRlckRvd24sIGZhbHNlICk7XG5cdFx0XHRcdGRvbS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoICdwb2ludGVybW92ZScsIG9uUG9pbnRlck1vdmUsIGZhbHNlICk7XG5cdFx0XHRcdGRvbS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoICdwb2ludGVydXAnLCBvblBvaW50ZXJVcCwgZmFsc2UgKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoIHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCApIHtcblx0XHRcdFx0Ly8gSUUgMTAgdXNlcyBwcmVmaXhlZCB2ZXJzaW9uIG9mIHBvaW50ZXIgZXZlbnRzXG5cdFx0XHRcdGRvbS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoICdNU1BvaW50ZXJEb3duJywgb25Qb2ludGVyRG93biwgZmFsc2UgKTtcblx0XHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlck1vdmUnLCBvblBvaW50ZXJNb3ZlLCBmYWxzZSApO1xuXHRcdFx0XHRkb20ud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyVXAnLCBvblBvaW50ZXJVcCwgZmFsc2UgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiggY29uZmlnLmtleWJvYXJkICkge1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBvbkRvY3VtZW50S2V5RG93biwgZmFsc2UgKTtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlwcmVzcycsIG9uRG9jdW1lbnRLZXlQcmVzcywgZmFsc2UgKTtcblx0XHR9XG5cblx0XHRpZiggY29uZmlnLnByb2dyZXNzICYmIGRvbS5wcm9ncmVzcyApIHtcblx0XHRcdGRvbS5wcm9ncmVzcy5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBvblByb2dyZXNzQ2xpY2tlZCwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHRpZiggY29uZmlnLmZvY3VzQm9keU9uUGFnZVZpc2liaWxpdHlDaGFuZ2UgKSB7XG5cdFx0XHR2YXIgdmlzaWJpbGl0eUNoYW5nZTtcblxuXHRcdFx0aWYoICdoaWRkZW4nIGluIGRvY3VtZW50ICkge1xuXHRcdFx0XHR2aXNpYmlsaXR5Q2hhbmdlID0gJ3Zpc2liaWxpdHljaGFuZ2UnO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggJ21zSGlkZGVuJyBpbiBkb2N1bWVudCApIHtcblx0XHRcdFx0dmlzaWJpbGl0eUNoYW5nZSA9ICdtc3Zpc2liaWxpdHljaGFuZ2UnO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggJ3dlYmtpdEhpZGRlbicgaW4gZG9jdW1lbnQgKSB7XG5cdFx0XHRcdHZpc2liaWxpdHlDaGFuZ2UgPSAnd2Via2l0dmlzaWJpbGl0eWNoYW5nZSc7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCB2aXNpYmlsaXR5Q2hhbmdlICkge1xuXHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCB2aXNpYmlsaXR5Q2hhbmdlLCBvblBhZ2VWaXNpYmlsaXR5Q2hhbmdlLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIExpc3RlbiB0byBib3RoIHRvdWNoIGFuZCBjbGljayBldmVudHMsIGluIGNhc2UgdGhlIGRldmljZVxuXHRcdC8vIHN1cHBvcnRzIGJvdGhcblx0XHR2YXIgcG9pbnRlckV2ZW50cyA9IFsgJ3RvdWNoc3RhcnQnLCAnY2xpY2snIF07XG5cblx0XHQvLyBPbmx5IHN1cHBvcnQgdG91Y2ggZm9yIEFuZHJvaWQsIGZpeGVzIGRvdWJsZSBuYXZpZ2F0aW9ucyBpblxuXHRcdC8vIHN0b2NrIGJyb3dzZXJcblx0XHRpZiggVUEubWF0Y2goIC9hbmRyb2lkL2dpICkgKSB7XG5cdFx0XHRwb2ludGVyRXZlbnRzID0gWyAndG91Y2hzdGFydCcgXTtcblx0XHR9XG5cblx0XHRwb2ludGVyRXZlbnRzLmZvckVhY2goIGZ1bmN0aW9uKCBldmVudE5hbWUgKSB7XG5cdFx0XHRkb20uY29udHJvbHNMZWZ0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlTGVmdENsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc1JpZ2h0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlUmlnaHRDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNVcC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZVVwQ2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzRG93bi5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZURvd25DbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNQcmV2LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlUHJldkNsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc05leHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5hZGRFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVOZXh0Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFVuYmluZHMgYWxsIGV2ZW50IGxpc3RlbmVycy5cblx0ICovXG5cdGZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKCkge1xuXG5cdFx0ZXZlbnRzQXJlQm91bmQgPSBmYWxzZTtcblxuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywgb25Eb2N1bWVudEtleURvd24sIGZhbHNlICk7XG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleXByZXNzJywgb25Eb2N1bWVudEtleVByZXNzLCBmYWxzZSApO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAnaGFzaGNoYW5nZScsIG9uV2luZG93SGFzaENoYW5nZSwgZmFsc2UgKTtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplLCBmYWxzZSApO1xuXG5cdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCBvblRvdWNoU3RhcnQsIGZhbHNlICk7XG5cdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlLCBmYWxzZSApO1xuXHRcdGRvbS53cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaGVuZCcsIG9uVG91Y2hFbmQsIGZhbHNlICk7XG5cblx0XHQvLyBJRTExXG5cdFx0aWYoIHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQgKSB7XG5cdFx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAncG9pbnRlcmRvd24nLCBvblBvaW50ZXJEb3duLCBmYWxzZSApO1xuXHRcdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJtb3ZlJywgb25Qb2ludGVyTW92ZSwgZmFsc2UgKTtcblx0XHRcdGRvbS53cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdwb2ludGVydXAnLCBvblBvaW50ZXJVcCwgZmFsc2UgKTtcblx0XHR9XG5cdFx0Ly8gSUUxMFxuXHRcdGVsc2UgaWYoIHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCApIHtcblx0XHRcdGRvbS53cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdNU1BvaW50ZXJEb3duJywgb25Qb2ludGVyRG93biwgZmFsc2UgKTtcblx0XHRcdGRvbS53cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdNU1BvaW50ZXJNb3ZlJywgb25Qb2ludGVyTW92ZSwgZmFsc2UgKTtcblx0XHRcdGRvbS53cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdNU1BvaW50ZXJVcCcsIG9uUG9pbnRlclVwLCBmYWxzZSApO1xuXHRcdH1cblxuXHRcdGlmICggY29uZmlnLnByb2dyZXNzICYmIGRvbS5wcm9ncmVzcyApIHtcblx0XHRcdGRvbS5wcm9ncmVzcy5yZW1vdmVFdmVudExpc3RlbmVyKCAnY2xpY2snLCBvblByb2dyZXNzQ2xpY2tlZCwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHRbICd0b3VjaHN0YXJ0JywgJ2NsaWNrJyBdLmZvckVhY2goIGZ1bmN0aW9uKCBldmVudE5hbWUgKSB7XG5cdFx0XHRkb20uY29udHJvbHNMZWZ0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlTGVmdENsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc1JpZ2h0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlUmlnaHRDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNVcC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZVVwQ2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzRG93bi5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZURvd25DbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNQcmV2LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlUHJldkNsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc05leHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVOZXh0Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEV4dGVuZCBvYmplY3QgYSB3aXRoIHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuXHQgKiBJZiB0aGVyZSdzIGEgY29uZmxpY3QsIG9iamVjdCBiIHRha2VzIHByZWNlZGVuY2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBleHRlbmQoIGEsIGIgKSB7XG5cblx0XHRmb3IoIHZhciBpIGluIGIgKSB7XG5cdFx0XHRhWyBpIF0gPSBiWyBpIF07XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgdGhlIHRhcmdldCBvYmplY3QgdG8gYW4gYXJyYXkuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b0FycmF5KCBvICkge1xuXG5cdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBvICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVdGlsaXR5IGZvciBkZXNlcmlhbGl6aW5nIGEgdmFsdWUuXG5cdCAqL1xuXHRmdW5jdGlvbiBkZXNlcmlhbGl6ZSggdmFsdWUgKSB7XG5cblx0XHRpZiggdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyApIHtcblx0XHRcdGlmKCB2YWx1ZSA9PT0gJ251bGwnICkgcmV0dXJuIG51bGw7XG5cdFx0XHRlbHNlIGlmKCB2YWx1ZSA9PT0gJ3RydWUnICkgcmV0dXJuIHRydWU7XG5cdFx0XHRlbHNlIGlmKCB2YWx1ZSA9PT0gJ2ZhbHNlJyApIHJldHVybiBmYWxzZTtcblx0XHRcdGVsc2UgaWYoIHZhbHVlLm1hdGNoKCAvXlxcZCskLyApICkgcmV0dXJuIHBhcnNlRmxvYXQoIHZhbHVlICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlO1xuXG5cdH1cblxuXHQvKipcblx0ICogTWVhc3VyZXMgdGhlIGRpc3RhbmNlIGluIHBpeGVscyBiZXR3ZWVuIHBvaW50IGFcblx0ICogYW5kIHBvaW50IGIuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBhIHBvaW50IHdpdGggeC95IHByb3BlcnRpZXNcblx0ICogQHBhcmFtIHtPYmplY3R9IGIgcG9pbnQgd2l0aCB4L3kgcHJvcGVydGllc1xuXHQgKi9cblx0ZnVuY3Rpb24gZGlzdGFuY2VCZXR3ZWVuKCBhLCBiICkge1xuXG5cdFx0dmFyIGR4ID0gYS54IC0gYi54LFxuXHRcdFx0ZHkgPSBhLnkgLSBiLnk7XG5cblx0XHRyZXR1cm4gTWF0aC5zcXJ0KCBkeCpkeCArIGR5KmR5ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBBcHBsaWVzIGEgQ1NTIHRyYW5zZm9ybSB0byB0aGUgdGFyZ2V0IGVsZW1lbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiB0cmFuc2Zvcm1FbGVtZW50KCBlbGVtZW50LCB0cmFuc2Zvcm0gKSB7XG5cblx0XHRlbGVtZW50LnN0eWxlLldlYmtpdFRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcblx0XHRlbGVtZW50LnN0eWxlLk1velRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcblx0XHRlbGVtZW50LnN0eWxlLm1zVHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuXHRcdGVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuXG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyBDU1MgdHJhbnNmb3JtcyB0byB0aGUgc2xpZGVzIGNvbnRhaW5lci4gVGhlIGNvbnRhaW5lclxuXHQgKiBpcyB0cmFuc2Zvcm1lZCBmcm9tIHR3byBzZXBhcmF0ZSBzb3VyY2VzOiBsYXlvdXQgYW5kIHRoZSBvdmVydmlld1xuXHQgKiBtb2RlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdHJhbnNmb3JtU2xpZGVzKCB0cmFuc2Zvcm1zICkge1xuXG5cdFx0Ly8gUGljayB1cCBuZXcgdHJhbnNmb3JtcyBmcm9tIGFyZ3VtZW50c1xuXHRcdGlmKCB0eXBlb2YgdHJhbnNmb3Jtcy5sYXlvdXQgPT09ICdzdHJpbmcnICkgc2xpZGVzVHJhbnNmb3JtLmxheW91dCA9IHRyYW5zZm9ybXMubGF5b3V0O1xuXHRcdGlmKCB0eXBlb2YgdHJhbnNmb3Jtcy5vdmVydmlldyA9PT0gJ3N0cmluZycgKSBzbGlkZXNUcmFuc2Zvcm0ub3ZlcnZpZXcgPSB0cmFuc2Zvcm1zLm92ZXJ2aWV3O1xuXG5cdFx0Ly8gQXBwbHkgdGhlIHRyYW5zZm9ybXMgdG8gdGhlIHNsaWRlcyBjb250YWluZXJcblx0XHRpZiggc2xpZGVzVHJhbnNmb3JtLmxheW91dCApIHtcblx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIGRvbS5zbGlkZXMsIHNsaWRlc1RyYW5zZm9ybS5sYXlvdXQgKyAnICcgKyBzbGlkZXNUcmFuc2Zvcm0ub3ZlcnZpZXcgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0cmFuc2Zvcm1FbGVtZW50KCBkb20uc2xpZGVzLCBzbGlkZXNUcmFuc2Zvcm0ub3ZlcnZpZXcgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBJbmplY3RzIHRoZSBnaXZlbiBDU1Mgc3R5bGVzIGludG8gdGhlIERPTS5cblx0ICovXG5cdGZ1bmN0aW9uIGluamVjdFN0eWxlU2hlZXQoIHZhbHVlICkge1xuXG5cdFx0dmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzdHlsZScgKTtcblx0XHR0YWcudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cdFx0aWYoIHRhZy5zdHlsZVNoZWV0ICkge1xuXHRcdFx0dGFnLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHZhbHVlO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRhZy5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIHZhbHVlICkgKTtcblx0XHR9XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdoZWFkJyApWzBdLmFwcGVuZENoaWxkKCB0YWcgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIHZhcmlvdXMgY29sb3IgaW5wdXQgZm9ybWF0cyB0byBhbiB7cjowLGc6MCxiOjB9IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGNvbG9yIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBjb2xvcixcblx0ICogdGhlIGZvbGxvd2luZyBmb3JtYXRzIGFyZSBzdXBwb3J0ZWQ6XG5cdCAqIC0gIzAwMFxuXHQgKiAtICMwMDAwMDBcblx0ICogLSByZ2IoMCwwLDApXG5cdCAqL1xuXHRmdW5jdGlvbiBjb2xvclRvUmdiKCBjb2xvciApIHtcblxuXHRcdHZhciBoZXgzID0gY29sb3IubWF0Y2goIC9eIyhbMC05YS1mXXszfSkkL2kgKTtcblx0XHRpZiggaGV4MyAmJiBoZXgzWzFdICkge1xuXHRcdFx0aGV4MyA9IGhleDNbMV07XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyOiBwYXJzZUludCggaGV4My5jaGFyQXQoIDAgKSwgMTYgKSAqIDB4MTEsXG5cdFx0XHRcdGc6IHBhcnNlSW50KCBoZXgzLmNoYXJBdCggMSApLCAxNiApICogMHgxMSxcblx0XHRcdFx0YjogcGFyc2VJbnQoIGhleDMuY2hhckF0KCAyICksIDE2ICkgKiAweDExXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHZhciBoZXg2ID0gY29sb3IubWF0Y2goIC9eIyhbMC05YS1mXXs2fSkkL2kgKTtcblx0XHRpZiggaGV4NiAmJiBoZXg2WzFdICkge1xuXHRcdFx0aGV4NiA9IGhleDZbMV07XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyOiBwYXJzZUludCggaGV4Ni5zdWJzdHIoIDAsIDIgKSwgMTYgKSxcblx0XHRcdFx0ZzogcGFyc2VJbnQoIGhleDYuc3Vic3RyKCAyLCAyICksIDE2ICksXG5cdFx0XHRcdGI6IHBhcnNlSW50KCBoZXg2LnN1YnN0ciggNCwgMiApLCAxNiApXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHZhciByZ2IgPSBjb2xvci5tYXRjaCggL15yZ2JcXHMqXFwoXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccypcXCkkL2kgKTtcblx0XHRpZiggcmdiICkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cjogcGFyc2VJbnQoIHJnYlsxXSwgMTAgKSxcblx0XHRcdFx0ZzogcGFyc2VJbnQoIHJnYlsyXSwgMTAgKSxcblx0XHRcdFx0YjogcGFyc2VJbnQoIHJnYlszXSwgMTAgKVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHR2YXIgcmdiYSA9IGNvbG9yLm1hdGNoKCAvXnJnYmFcXHMqXFwoXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccypcXCxcXHMqKFtcXGRdK3xbXFxkXSouW1xcZF0rKVxccypcXCkkL2kgKTtcblx0XHRpZiggcmdiYSApIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHI6IHBhcnNlSW50KCByZ2JhWzFdLCAxMCApLFxuXHRcdFx0XHRnOiBwYXJzZUludCggcmdiYVsyXSwgMTAgKSxcblx0XHRcdFx0YjogcGFyc2VJbnQoIHJnYmFbM10sIDEwICksXG5cdFx0XHRcdGE6IHBhcnNlRmxvYXQoIHJnYmFbNF0gKVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZXMgYnJpZ2h0bmVzcyBvbiBhIHNjYWxlIG9mIDAtMjU1LlxuXHQgKlxuXHQgKiBAcGFyYW0gY29sb3IgU2VlIGNvbG9yU3RyaW5nVG9SZ2IgZm9yIHN1cHBvcnRlZCBmb3JtYXRzLlxuXHQgKi9cblx0ZnVuY3Rpb24gY29sb3JCcmlnaHRuZXNzKCBjb2xvciApIHtcblxuXHRcdGlmKCB0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnICkgY29sb3IgPSBjb2xvclRvUmdiKCBjb2xvciApO1xuXG5cdFx0aWYoIGNvbG9yICkge1xuXHRcdFx0cmV0dXJuICggY29sb3IuciAqIDI5OSArIGNvbG9yLmcgKiA1ODcgKyBjb2xvci5iICogMTE0ICkgLyAxMDAwO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBoZWlnaHQgb2YgdGhlIGdpdmVuIGVsZW1lbnQgYnkgbG9va2luZ1xuXHQgKiBhdCB0aGUgcG9zaXRpb24gYW5kIGhlaWdodCBvZiBpdHMgaW1tZWRpYXRlIGNoaWxkcmVuLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0QWJzb2x1dGVIZWlnaHQoIGVsZW1lbnQgKSB7XG5cblx0XHR2YXIgaGVpZ2h0ID0gMDtcblxuXHRcdGlmKCBlbGVtZW50ICkge1xuXHRcdFx0dmFyIGFic29sdXRlQ2hpbGRyZW4gPSAwO1xuXG5cdFx0XHR0b0FycmF5KCBlbGVtZW50LmNoaWxkTm9kZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiggY2hpbGQgKSB7XG5cblx0XHRcdFx0aWYoIHR5cGVvZiBjaGlsZC5vZmZzZXRUb3AgPT09ICdudW1iZXInICYmIGNoaWxkLnN0eWxlICkge1xuXHRcdFx0XHRcdC8vIENvdW50ICMgb2YgYWJzIGNoaWxkcmVuXG5cdFx0XHRcdFx0aWYoIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBjaGlsZCApLnBvc2l0aW9uID09PSAnYWJzb2x1dGUnICkge1xuXHRcdFx0XHRcdFx0YWJzb2x1dGVDaGlsZHJlbiArPSAxO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGhlaWdodCA9IE1hdGgubWF4KCBoZWlnaHQsIGNoaWxkLm9mZnNldFRvcCArIGNoaWxkLm9mZnNldEhlaWdodCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gSWYgdGhlcmUgYXJlIG5vIGFic29sdXRlIGNoaWxkcmVuLCB1c2Ugb2Zmc2V0SGVpZ2h0XG5cdFx0XHRpZiggYWJzb2x1dGVDaGlsZHJlbiA9PT0gMCApIHtcblx0XHRcdFx0aGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gaGVpZ2h0O1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgcmVtYWluaW5nIGhlaWdodCB3aXRoaW4gdGhlIHBhcmVudCBvZiB0aGVcblx0ICogdGFyZ2V0IGVsZW1lbnQuXG5cdCAqXG5cdCAqIHJlbWFpbmluZyBoZWlnaHQgPSBbIGNvbmZpZ3VyZWQgcGFyZW50IGhlaWdodCBdIC0gWyBjdXJyZW50IHBhcmVudCBoZWlnaHQgXVxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0UmVtYWluaW5nSGVpZ2h0KCBlbGVtZW50LCBoZWlnaHQgKSB7XG5cblx0XHRoZWlnaHQgPSBoZWlnaHQgfHwgMDtcblxuXHRcdGlmKCBlbGVtZW50ICkge1xuXHRcdFx0dmFyIG5ld0hlaWdodCwgb2xkSGVpZ2h0ID0gZWxlbWVudC5zdHlsZS5oZWlnaHQ7XG5cblx0XHRcdC8vIENoYW5nZSB0aGUgLnN0cmV0Y2ggZWxlbWVudCBoZWlnaHQgdG8gMCBpbiBvcmRlciBmaW5kIHRoZSBoZWlnaHQgb2YgYWxsXG5cdFx0XHQvLyB0aGUgb3RoZXIgZWxlbWVudHNcblx0XHRcdGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJzBweCc7XG5cdFx0XHRuZXdIZWlnaHQgPSBoZWlnaHQgLSBlbGVtZW50LnBhcmVudE5vZGUub2Zmc2V0SGVpZ2h0O1xuXG5cdFx0XHQvLyBSZXN0b3JlIHRoZSBvbGQgaGVpZ2h0LCBqdXN0IGluIGNhc2Vcblx0XHRcdGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gb2xkSGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0cmV0dXJuIG5ld0hlaWdodDtcblx0XHR9XG5cblx0XHRyZXR1cm4gaGVpZ2h0O1xuXG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoaXMgaW5zdGFuY2UgaXMgYmVpbmcgdXNlZCB0byBwcmludCBhIFBERi5cblx0ICovXG5cdGZ1bmN0aW9uIGlzUHJpbnRpbmdQREYoKSB7XG5cblx0XHRyZXR1cm4gKCAvcHJpbnQtcGRmL2dpICkudGVzdCggd2luZG93LmxvY2F0aW9uLnNlYXJjaCApO1xuXG5cdH1cblxuXHQvKipcblx0ICogSGlkZXMgdGhlIGFkZHJlc3MgYmFyIGlmIHdlJ3JlIG9uIGEgbW9iaWxlIGRldmljZS5cblx0ICovXG5cdGZ1bmN0aW9uIGhpZGVBZGRyZXNzQmFyKCkge1xuXG5cdFx0aWYoIGNvbmZpZy5oaWRlQWRkcmVzc0JhciAmJiBpc01vYmlsZURldmljZSApIHtcblx0XHRcdC8vIEV2ZW50cyB0aGF0IHNob3VsZCB0cmlnZ2VyIHRoZSBhZGRyZXNzIGJhciB0byBoaWRlXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCByZW1vdmVBZGRyZXNzQmFyLCBmYWxzZSApO1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdvcmllbnRhdGlvbmNoYW5nZScsIHJlbW92ZUFkZHJlc3NCYXIsIGZhbHNlICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2F1c2VzIHRoZSBhZGRyZXNzIGJhciB0byBoaWRlIG9uIG1vYmlsZSBkZXZpY2VzLFxuXHQgKiBtb3JlIHZlcnRpY2FsIHNwYWNlIGZ0dy5cblx0ICovXG5cdGZ1bmN0aW9uIHJlbW92ZUFkZHJlc3NCYXIoKSB7XG5cblx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdHdpbmRvdy5zY3JvbGxUbyggMCwgMSApO1xuXHRcdH0sIDEwICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBEaXNwYXRjaGVzIGFuIGV2ZW50IG9mIHRoZSBzcGVjaWZpZWQgdHlwZSBmcm9tIHRoZVxuXHQgKiByZXZlYWwgRE9NIGVsZW1lbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBkaXNwYXRjaEV2ZW50KCB0eXBlLCBhcmdzICkge1xuXG5cdFx0dmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoICdIVE1MRXZlbnRzJywgMSwgMiApO1xuXHRcdGV2ZW50LmluaXRFdmVudCggdHlwZSwgdHJ1ZSwgdHJ1ZSApO1xuXHRcdGV4dGVuZCggZXZlbnQsIGFyZ3MgKTtcblx0XHRkb20ud3JhcHBlci5kaXNwYXRjaEV2ZW50KCBldmVudCApO1xuXG5cdFx0Ly8gSWYgd2UncmUgaW4gYW4gaWZyYW1lLCBwb3N0IGVhY2ggcmV2ZWFsLmpzIGV2ZW50IHRvIHRoZVxuXHRcdC8vIHBhcmVudCB3aW5kb3cuIFVzZWQgYnkgdGhlIG5vdGVzIHBsdWdpblxuXHRcdGlmKCBjb25maWcucG9zdE1lc3NhZ2VFdmVudHMgJiYgd2luZG93LnBhcmVudCAhPT0gd2luZG93LnNlbGYgKSB7XG5cdFx0XHR3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSh7IG5hbWVzcGFjZTogJ3JldmVhbCcsIGV2ZW50TmFtZTogdHlwZSwgc3RhdGU6IGdldFN0YXRlKCkgfSksICcqJyApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFdyYXAgYWxsIGxpbmtzIGluIDNEIGdvb2RuZXNzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZW5hYmxlUm9sbGluZ0xpbmtzKCkge1xuXG5cdFx0aWYoIGZlYXR1cmVzLnRyYW5zZm9ybXMzZCAmJiAhKCAnbXNQZXJzcGVjdGl2ZScgaW4gZG9jdW1lbnQuYm9keS5zdHlsZSApICkge1xuXHRcdFx0dmFyIGFuY2hvcnMgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKyAnIGEnICk7XG5cblx0XHRcdGZvciggdmFyIGkgPSAwLCBsZW4gPSBhbmNob3JzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0XHR2YXIgYW5jaG9yID0gYW5jaG9yc1tpXTtcblxuXHRcdFx0XHRpZiggYW5jaG9yLnRleHRDb250ZW50ICYmICFhbmNob3IucXVlcnlTZWxlY3RvciggJyonICkgJiYgKCAhYW5jaG9yLmNsYXNzTmFtZSB8fCAhYW5jaG9yLmNsYXNzTGlzdC5jb250YWlucyggYW5jaG9yLCAncm9sbCcgKSApICkge1xuXHRcdFx0XHRcdHZhciBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuXHRcdFx0XHRcdHNwYW4uc2V0QXR0cmlidXRlKCdkYXRhLXRpdGxlJywgYW5jaG9yLnRleHQpO1xuXHRcdFx0XHRcdHNwYW4uaW5uZXJIVE1MID0gYW5jaG9yLmlubmVySFRNTDtcblxuXHRcdFx0XHRcdGFuY2hvci5jbGFzc0xpc3QuYWRkKCAncm9sbCcgKTtcblx0XHRcdFx0XHRhbmNob3IuaW5uZXJIVE1MID0gJyc7XG5cdFx0XHRcdFx0YW5jaG9yLmFwcGVuZENoaWxkKHNwYW4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogVW53cmFwIGFsbCAzRCBsaW5rcy5cblx0ICovXG5cdGZ1bmN0aW9uIGRpc2FibGVSb2xsaW5nTGlua3MoKSB7XG5cblx0XHR2YXIgYW5jaG9ycyA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFNMSURFU19TRUxFQ1RPUiArICcgYS5yb2xsJyApO1xuXG5cdFx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IGFuY2hvcnMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHR2YXIgYW5jaG9yID0gYW5jaG9yc1tpXTtcblx0XHRcdHZhciBzcGFuID0gYW5jaG9yLnF1ZXJ5U2VsZWN0b3IoICdzcGFuJyApO1xuXG5cdFx0XHRpZiggc3BhbiApIHtcblx0XHRcdFx0YW5jaG9yLmNsYXNzTGlzdC5yZW1vdmUoICdyb2xsJyApO1xuXHRcdFx0XHRhbmNob3IuaW5uZXJIVE1MID0gc3Bhbi5pbm5lckhUTUw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQmluZCBwcmV2aWV3IGZyYW1lIGxpbmtzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZW5hYmxlUHJldmlld0xpbmtzKCBzZWxlY3RvciApIHtcblxuXHRcdHZhciBhbmNob3JzID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgPyBzZWxlY3RvciA6ICdhJyApICk7XG5cblx0XHRhbmNob3JzLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdFx0aWYoIC9eKGh0dHB8d3d3KS9naS50ZXN0KCBlbGVtZW50LmdldEF0dHJpYnV0ZSggJ2hyZWYnICkgKSApIHtcblx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBvblByZXZpZXdMaW5rQ2xpY2tlZCwgZmFsc2UgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVbmJpbmQgcHJldmlldyBmcmFtZSBsaW5rcy5cblx0ICovXG5cdGZ1bmN0aW9uIGRpc2FibGVQcmV2aWV3TGlua3MoKSB7XG5cblx0XHR2YXIgYW5jaG9ycyA9IHRvQXJyYXkoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdhJyApICk7XG5cblx0XHRhbmNob3JzLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdFx0aWYoIC9eKGh0dHB8d3d3KS9naS50ZXN0KCBlbGVtZW50LmdldEF0dHJpYnV0ZSggJ2hyZWYnICkgKSApIHtcblx0XHRcdFx0ZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnY2xpY2snLCBvblByZXZpZXdMaW5rQ2xpY2tlZCwgZmFsc2UgKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBPcGVucyBhIHByZXZpZXcgd2luZG93IGZvciB0aGUgdGFyZ2V0IFVSTC5cblx0ICovXG5cdGZ1bmN0aW9uIHNob3dQcmV2aWV3KCB1cmwgKSB7XG5cblx0XHRjbG9zZU92ZXJsYXkoKTtcblxuXHRcdGRvbS5vdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRkb20ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCAnb3ZlcmxheScgKTtcblx0XHRkb20ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCAnb3ZlcmxheS1wcmV2aWV3JyApO1xuXHRcdGRvbS53cmFwcGVyLmFwcGVuZENoaWxkKCBkb20ub3ZlcmxheSApO1xuXG5cdFx0ZG9tLm92ZXJsYXkuaW5uZXJIVE1MID0gW1xuXHRcdFx0JzxoZWFkZXI+Jyxcblx0XHRcdFx0JzxhIGNsYXNzPVwiY2xvc2VcIiBocmVmPVwiI1wiPjxzcGFuIGNsYXNzPVwiaWNvblwiPjwvc3Bhbj48L2E+Jyxcblx0XHRcdFx0JzxhIGNsYXNzPVwiZXh0ZXJuYWxcIiBocmVmPVwiJysgdXJsICsnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+PHNwYW4gY2xhc3M9XCJpY29uXCI+PC9zcGFuPjwvYT4nLFxuXHRcdFx0JzwvaGVhZGVyPicsXG5cdFx0XHQnPGRpdiBjbGFzcz1cInNwaW5uZXJcIj48L2Rpdj4nLFxuXHRcdFx0JzxkaXYgY2xhc3M9XCJ2aWV3cG9ydFwiPicsXG5cdFx0XHRcdCc8aWZyYW1lIHNyYz1cIicrIHVybCArJ1wiPjwvaWZyYW1lPicsXG5cdFx0XHQnPC9kaXY+J1xuXHRcdF0uam9pbignJyk7XG5cblx0XHRkb20ub3ZlcmxheS5xdWVyeVNlbGVjdG9yKCAnaWZyYW1lJyApLmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZG9tLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCggJ2xvYWRlZCcgKTtcblx0XHR9LCBmYWxzZSApO1xuXG5cdFx0ZG9tLm92ZXJsYXkucXVlcnlTZWxlY3RvciggJy5jbG9zZScgKS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRjbG9zZU92ZXJsYXkoKTtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fSwgZmFsc2UgKTtcblxuXHRcdGRvbS5vdmVybGF5LnF1ZXJ5U2VsZWN0b3IoICcuZXh0ZXJuYWwnICkuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0Y2xvc2VPdmVybGF5KCk7XG5cdFx0fSwgZmFsc2UgKTtcblxuXHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZG9tLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCggJ3Zpc2libGUnICk7XG5cdFx0fSwgMSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogT3BlbnMgYSBvdmVybGF5IHdpbmRvdyB3aXRoIGhlbHAgbWF0ZXJpYWwuXG5cdCAqL1xuXHRmdW5jdGlvbiBzaG93SGVscCgpIHtcblxuXHRcdGlmKCBjb25maWcuaGVscCApIHtcblxuXHRcdFx0Y2xvc2VPdmVybGF5KCk7XG5cblx0XHRcdGRvbS5vdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRcdGRvbS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoICdvdmVybGF5JyApO1xuXHRcdFx0ZG9tLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCggJ292ZXJsYXktaGVscCcgKTtcblx0XHRcdGRvbS53cmFwcGVyLmFwcGVuZENoaWxkKCBkb20ub3ZlcmxheSApO1xuXG5cdFx0XHR2YXIgaHRtbCA9ICc8cCBjbGFzcz1cInRpdGxlXCI+S2V5Ym9hcmQgU2hvcnRjdXRzPC9wPjxici8+JztcblxuXHRcdFx0aHRtbCArPSAnPHRhYmxlPjx0aD5LRVk8L3RoPjx0aD5BQ1RJT048L3RoPic7XG5cdFx0XHRmb3IoIHZhciBrZXkgaW4ga2V5Ym9hcmRTaG9ydGN1dHMgKSB7XG5cdFx0XHRcdGh0bWwgKz0gJzx0cj48dGQ+JyArIGtleSArICc8L3RkPjx0ZD4nICsga2V5Ym9hcmRTaG9ydGN1dHNbIGtleSBdICsgJzwvdGQ+PC90cj4nO1xuXHRcdFx0fVxuXG5cdFx0XHRodG1sICs9ICc8L3RhYmxlPic7XG5cblx0XHRcdGRvbS5vdmVybGF5LmlubmVySFRNTCA9IFtcblx0XHRcdFx0JzxoZWFkZXI+Jyxcblx0XHRcdFx0XHQnPGEgY2xhc3M9XCJjbG9zZVwiIGhyZWY9XCIjXCI+PHNwYW4gY2xhc3M9XCJpY29uXCI+PC9zcGFuPjwvYT4nLFxuXHRcdFx0XHQnPC9oZWFkZXI+Jyxcblx0XHRcdFx0JzxkaXYgY2xhc3M9XCJ2aWV3cG9ydFwiPicsXG5cdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJ2aWV3cG9ydC1pbm5lclwiPicrIGh0bWwgKyc8L2Rpdj4nLFxuXHRcdFx0XHQnPC9kaXY+J1xuXHRcdFx0XS5qb2luKCcnKTtcblxuXHRcdFx0ZG9tLm92ZXJsYXkucXVlcnlTZWxlY3RvciggJy5jbG9zZScgKS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdGNsb3NlT3ZlcmxheSgpO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSwgZmFsc2UgKTtcblxuXHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRvbS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xuXHRcdFx0fSwgMSApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2VzIGFueSBjdXJyZW50bHkgb3BlbiBvdmVybGF5LlxuXHQgKi9cblx0ZnVuY3Rpb24gY2xvc2VPdmVybGF5KCkge1xuXG5cdFx0aWYoIGRvbS5vdmVybGF5ICkge1xuXHRcdFx0ZG9tLm92ZXJsYXkucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCggZG9tLm92ZXJsYXkgKTtcblx0XHRcdGRvbS5vdmVybGF5ID0gbnVsbDtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBBcHBsaWVzIEphdmFTY3JpcHQtY29udHJvbGxlZCBsYXlvdXQgcnVsZXMgdG8gdGhlXG5cdCAqIHByZXNlbnRhdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGxheW91dCgpIHtcblxuXHRcdGlmKCBkb20ud3JhcHBlciAmJiAhaXNQcmludGluZ1BERigpICkge1xuXG5cdFx0XHR2YXIgc2l6ZSA9IGdldENvbXB1dGVkU2xpZGVTaXplKCk7XG5cblx0XHRcdHZhciBzbGlkZVBhZGRpbmcgPSAyMDsgLy8gVE9ETyBEaWcgdGhpcyBvdXQgb2YgRE9NXG5cblx0XHRcdC8vIExheW91dCB0aGUgY29udGVudHMgb2YgdGhlIHNsaWRlc1xuXHRcdFx0bGF5b3V0U2xpZGVDb250ZW50cyggY29uZmlnLndpZHRoLCBjb25maWcuaGVpZ2h0LCBzbGlkZVBhZGRpbmcgKTtcblxuXHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS53aWR0aCA9IHNpemUud2lkdGggKyAncHgnO1xuXHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5oZWlnaHQgPSBzaXplLmhlaWdodCArICdweCc7XG5cblx0XHRcdC8vIERldGVybWluZSBzY2FsZSBvZiBjb250ZW50IHRvIGZpdCB3aXRoaW4gYXZhaWxhYmxlIHNwYWNlXG5cdFx0XHRzY2FsZSA9IE1hdGgubWluKCBzaXplLnByZXNlbnRhdGlvbldpZHRoIC8gc2l6ZS53aWR0aCwgc2l6ZS5wcmVzZW50YXRpb25IZWlnaHQgLyBzaXplLmhlaWdodCApO1xuXG5cdFx0XHQvLyBSZXNwZWN0IG1heC9taW4gc2NhbGUgc2V0dGluZ3Ncblx0XHRcdHNjYWxlID0gTWF0aC5tYXgoIHNjYWxlLCBjb25maWcubWluU2NhbGUgKTtcblx0XHRcdHNjYWxlID0gTWF0aC5taW4oIHNjYWxlLCBjb25maWcubWF4U2NhbGUgKTtcblxuXHRcdFx0Ly8gRG9uJ3QgYXBwbHkgYW55IHNjYWxpbmcgc3R5bGVzIGlmIHNjYWxlIGlzIDFcblx0XHRcdGlmKCBzY2FsZSA9PT0gMSApIHtcblx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS56b29tID0gJyc7XG5cdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUubGVmdCA9ICcnO1xuXHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLnRvcCA9ICcnO1xuXHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLmJvdHRvbSA9ICcnO1xuXHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLnJpZ2h0ID0gJyc7XG5cdFx0XHRcdHRyYW5zZm9ybVNsaWRlcyggeyBsYXlvdXQ6ICcnIH0gKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBQcmVmZXIgem9vbSBmb3Igc2NhbGluZyB1cCBzbyB0aGF0IGNvbnRlbnQgcmVtYWlucyBjcmlzcC5cblx0XHRcdFx0Ly8gRG9uJ3QgdXNlIHpvb20gdG8gc2NhbGUgZG93biBzaW5jZSB0aGF0IGNhbiBsZWFkIHRvIHNoaWZ0c1xuXHRcdFx0XHQvLyBpbiB0ZXh0IGxheW91dC9saW5lIGJyZWFrcy5cblx0XHRcdFx0aWYoIHNjYWxlID4gMSAmJiBmZWF0dXJlcy56b29tICkge1xuXHRcdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUuem9vbSA9IHNjYWxlO1xuXHRcdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUubGVmdCA9ICcnO1xuXHRcdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUudG9wID0gJyc7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5ib3R0b20gPSAnJztcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLnJpZ2h0ID0gJyc7XG5cdFx0XHRcdFx0dHJhbnNmb3JtU2xpZGVzKCB7IGxheW91dDogJycgfSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIEFwcGx5IHNjYWxlIHRyYW5zZm9ybSBhcyBhIGZhbGxiYWNrXG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUuem9vbSA9ICcnO1xuXHRcdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUubGVmdCA9ICc1MCUnO1xuXHRcdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUudG9wID0gJzUwJSc7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5ib3R0b20gPSAnYXV0byc7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5yaWdodCA9ICdhdXRvJztcblx0XHRcdFx0XHR0cmFuc2Zvcm1TbGlkZXMoIHsgbGF5b3V0OiAndHJhbnNsYXRlKC01MCUsIC01MCUpIHNjYWxlKCcrIHNjYWxlICsnKScgfSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNlbGVjdCBhbGwgc2xpZGVzLCB2ZXJ0aWNhbCBhbmQgaG9yaXpvbnRhbFxuXHRcdFx0dmFyIHNsaWRlcyA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFNMSURFU19TRUxFQ1RPUiApICk7XG5cblx0XHRcdGZvciggdmFyIGkgPSAwLCBsZW4gPSBzbGlkZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRcdHZhciBzbGlkZSA9IHNsaWRlc1sgaSBdO1xuXG5cdFx0XHRcdC8vIERvbid0IGJvdGhlciB1cGRhdGluZyBpbnZpc2libGUgc2xpZGVzXG5cdFx0XHRcdGlmKCBzbGlkZS5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiggY29uZmlnLmNlbnRlciB8fCBzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoICdjZW50ZXInICkgKSB7XG5cdFx0XHRcdFx0Ly8gVmVydGljYWwgc3RhY2tzIGFyZSBub3QgY2VudHJlZCBzaW5jZSB0aGVpciBzZWN0aW9uXG5cdFx0XHRcdFx0Ly8gY2hpbGRyZW4gd2lsbCBiZVxuXHRcdFx0XHRcdGlmKCBzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoICdzdGFjaycgKSApIHtcblx0XHRcdFx0XHRcdHNsaWRlLnN0eWxlLnRvcCA9IDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0c2xpZGUuc3R5bGUudG9wID0gTWF0aC5tYXgoICggKCBzaXplLmhlaWdodCAtIGdldEFic29sdXRlSGVpZ2h0KCBzbGlkZSApICkgLyAyICkgLSBzbGlkZVBhZGRpbmcsIDAgKSArICdweCc7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHNsaWRlLnN0eWxlLnRvcCA9ICcnO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlUHJvZ3Jlc3MoKTtcblx0XHRcdHVwZGF0ZVBhcmFsbGF4KCk7XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBBcHBsaWVzIGxheW91dCBsb2dpYyB0byB0aGUgY29udGVudHMgb2YgYWxsIHNsaWRlcyBpblxuXHQgKiB0aGUgcHJlc2VudGF0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbGF5b3V0U2xpZGVDb250ZW50cyggd2lkdGgsIGhlaWdodCwgcGFkZGluZyApIHtcblxuXHRcdC8vIEhhbmRsZSBzaXppbmcgb2YgZWxlbWVudHMgd2l0aCB0aGUgJ3N0cmV0Y2gnIGNsYXNzXG5cdFx0dG9BcnJheSggZG9tLnNsaWRlcy5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbiA+IC5zdHJldGNoJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cblx0XHRcdC8vIERldGVybWluZSBob3cgbXVjaCB2ZXJ0aWNhbCBzcGFjZSB3ZSBjYW4gdXNlXG5cdFx0XHR2YXIgcmVtYWluaW5nSGVpZ2h0ID0gZ2V0UmVtYWluaW5nSGVpZ2h0KCBlbGVtZW50LCBoZWlnaHQgKTtcblxuXHRcdFx0Ly8gQ29uc2lkZXIgdGhlIGFzcGVjdCByYXRpbyBvZiBtZWRpYSBlbGVtZW50c1xuXHRcdFx0aWYoIC8oaW1nfHZpZGVvKS9naS50ZXN0KCBlbGVtZW50Lm5vZGVOYW1lICkgKSB7XG5cdFx0XHRcdHZhciBudyA9IGVsZW1lbnQubmF0dXJhbFdpZHRoIHx8IGVsZW1lbnQudmlkZW9XaWR0aCxcblx0XHRcdFx0XHRuaCA9IGVsZW1lbnQubmF0dXJhbEhlaWdodCB8fCBlbGVtZW50LnZpZGVvSGVpZ2h0O1xuXG5cdFx0XHRcdHZhciBlcyA9IE1hdGgubWluKCB3aWR0aCAvIG53LCByZW1haW5pbmdIZWlnaHQgLyBuaCApO1xuXG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUud2lkdGggPSAoIG53ICogZXMgKSArICdweCc7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gKCBuaCAqIGVzICkgKyAncHgnO1xuXG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS53aWR0aCA9IHdpZHRoICsgJ3B4Jztcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5oZWlnaHQgPSByZW1haW5pbmdIZWlnaHQgKyAncHgnO1xuXHRcdFx0fVxuXG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogQ2FsY3VsYXRlcyB0aGUgY29tcHV0ZWQgcGl4ZWwgc2l6ZSBvZiBvdXIgc2xpZGVzLiBUaGVzZVxuXHQgKiB2YWx1ZXMgYXJlIGJhc2VkIG9uIHRoZSB3aWR0aCBhbmQgaGVpZ2h0IGNvbmZpZ3VyYXRpb25cblx0ICogb3B0aW9ucy5cblx0ICovXG5cdGZ1bmN0aW9uIGdldENvbXB1dGVkU2xpZGVTaXplKCBwcmVzZW50YXRpb25XaWR0aCwgcHJlc2VudGF0aW9uSGVpZ2h0ICkge1xuXG5cdFx0dmFyIHNpemUgPSB7XG5cdFx0XHQvLyBTbGlkZSBzaXplXG5cdFx0XHR3aWR0aDogY29uZmlnLndpZHRoLFxuXHRcdFx0aGVpZ2h0OiBjb25maWcuaGVpZ2h0LFxuXG5cdFx0XHQvLyBQcmVzZW50YXRpb24gc2l6ZVxuXHRcdFx0cHJlc2VudGF0aW9uV2lkdGg6IHByZXNlbnRhdGlvbldpZHRoIHx8IGRvbS53cmFwcGVyLm9mZnNldFdpZHRoLFxuXHRcdFx0cHJlc2VudGF0aW9uSGVpZ2h0OiBwcmVzZW50YXRpb25IZWlnaHQgfHwgZG9tLndyYXBwZXIub2Zmc2V0SGVpZ2h0XG5cdFx0fTtcblxuXHRcdC8vIFJlZHVjZSBhdmFpbGFibGUgc3BhY2UgYnkgbWFyZ2luXG5cdFx0c2l6ZS5wcmVzZW50YXRpb25XaWR0aCAtPSAoIHNpemUucHJlc2VudGF0aW9uV2lkdGggKiBjb25maWcubWFyZ2luICk7XG5cdFx0c2l6ZS5wcmVzZW50YXRpb25IZWlnaHQgLT0gKCBzaXplLnByZXNlbnRhdGlvbkhlaWdodCAqIGNvbmZpZy5tYXJnaW4gKTtcblxuXHRcdC8vIFNsaWRlIHdpZHRoIG1heSBiZSBhIHBlcmNlbnRhZ2Ugb2YgYXZhaWxhYmxlIHdpZHRoXG5cdFx0aWYoIHR5cGVvZiBzaXplLndpZHRoID09PSAnc3RyaW5nJyAmJiAvJSQvLnRlc3QoIHNpemUud2lkdGggKSApIHtcblx0XHRcdHNpemUud2lkdGggPSBwYXJzZUludCggc2l6ZS53aWR0aCwgMTAgKSAvIDEwMCAqIHNpemUucHJlc2VudGF0aW9uV2lkdGg7XG5cdFx0fVxuXG5cdFx0Ly8gU2xpZGUgaGVpZ2h0IG1heSBiZSBhIHBlcmNlbnRhZ2Ugb2YgYXZhaWxhYmxlIGhlaWdodFxuXHRcdGlmKCB0eXBlb2Ygc2l6ZS5oZWlnaHQgPT09ICdzdHJpbmcnICYmIC8lJC8udGVzdCggc2l6ZS5oZWlnaHQgKSApIHtcblx0XHRcdHNpemUuaGVpZ2h0ID0gcGFyc2VJbnQoIHNpemUuaGVpZ2h0LCAxMCApIC8gMTAwICogc2l6ZS5wcmVzZW50YXRpb25IZWlnaHQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNpemU7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBTdG9yZXMgdGhlIHZlcnRpY2FsIGluZGV4IG9mIGEgc3RhY2sgc28gdGhhdCB0aGUgc2FtZVxuXHQgKiB2ZXJ0aWNhbCBzbGlkZSBjYW4gYmUgc2VsZWN0ZWQgd2hlbiBuYXZpZ2F0aW5nIHRvIGFuZFxuXHQgKiBmcm9tIHRoZSBzdGFjay5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc3RhY2sgVGhlIHZlcnRpY2FsIHN0YWNrIGVsZW1lbnRcblx0ICogQHBhcmFtIHtpbnR9IHYgSW5kZXggdG8gbWVtb3JpemVcblx0ICovXG5cdGZ1bmN0aW9uIHNldFByZXZpb3VzVmVydGljYWxJbmRleCggc3RhY2ssIHYgKSB7XG5cblx0XHRpZiggdHlwZW9mIHN0YWNrID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygc3RhY2suc2V0QXR0cmlidXRlID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0c3RhY2suc2V0QXR0cmlidXRlKCAnZGF0YS1wcmV2aW91cy1pbmRleHYnLCB2IHx8IDAgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIHZlcnRpY2FsIGluZGV4IHdoaWNoIHdhcyBzdG9yZWQgdXNpbmdcblx0ICogI3NldFByZXZpb3VzVmVydGljYWxJbmRleCgpIG9yIDAgaWYgbm8gcHJldmlvdXMgaW5kZXhcblx0ICogZXhpc3RzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzdGFjayBUaGUgdmVydGljYWwgc3RhY2sgZWxlbWVudFxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0UHJldmlvdXNWZXJ0aWNhbEluZGV4KCBzdGFjayApIHtcblxuXHRcdGlmKCB0eXBlb2Ygc3RhY2sgPT09ICdvYmplY3QnICYmIHR5cGVvZiBzdGFjay5zZXRBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbicgJiYgc3RhY2suY2xhc3NMaXN0LmNvbnRhaW5zKCAnc3RhY2snICkgKSB7XG5cdFx0XHQvLyBQcmVmZXIgbWFudWFsbHkgZGVmaW5lZCBzdGFydC1pbmRleHZcblx0XHRcdHZhciBhdHRyaWJ1dGVOYW1lID0gc3RhY2suaGFzQXR0cmlidXRlKCAnZGF0YS1zdGFydC1pbmRleHYnICkgPyAnZGF0YS1zdGFydC1pbmRleHYnIDogJ2RhdGEtcHJldmlvdXMtaW5kZXh2JztcblxuXHRcdFx0cmV0dXJuIHBhcnNlSW50KCBzdGFjay5nZXRBdHRyaWJ1dGUoIGF0dHJpYnV0ZU5hbWUgKSB8fCAwLCAxMCApO1xuXHRcdH1cblxuXHRcdHJldHVybiAwO1xuXG5cdH1cblxuXHQvKipcblx0ICogRGlzcGxheXMgdGhlIG92ZXJ2aWV3IG9mIHNsaWRlcyAocXVpY2sgbmF2KSBieSBzY2FsaW5nXG5cdCAqIGRvd24gYW5kIGFycmFuZ2luZyBhbGwgc2xpZGUgZWxlbWVudHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBhY3RpdmF0ZU92ZXJ2aWV3KCkge1xuXG5cdFx0Ly8gT25seSBwcm9jZWVkIGlmIGVuYWJsZWQgaW4gY29uZmlnXG5cdFx0aWYoIGNvbmZpZy5vdmVydmlldyAmJiAhaXNPdmVydmlldygpICkge1xuXG5cdFx0XHRvdmVydmlldyA9IHRydWU7XG5cblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoICdvdmVydmlldycgKTtcblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoICdvdmVydmlldy1kZWFjdGl2YXRpbmcnICk7XG5cblx0XHRcdGlmKCBmZWF0dXJlcy5vdmVydmlld1RyYW5zaXRpb25zICkge1xuXHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCAnb3ZlcnZpZXctYW5pbWF0ZWQnICk7XG5cdFx0XHRcdH0sIDEgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRG9uJ3QgYXV0by1zbGlkZSB3aGlsZSBpbiBvdmVydmlldyBtb2RlXG5cdFx0XHRjYW5jZWxBdXRvU2xpZGUoKTtcblxuXHRcdFx0Ly8gTW92ZSB0aGUgYmFja2dyb3VuZHMgZWxlbWVudCBpbnRvIHRoZSBzbGlkZSBjb250YWluZXIgdG9cblx0XHRcdC8vIHRoYXQgdGhlIHNhbWUgc2NhbGluZyBpcyBhcHBsaWVkXG5cdFx0XHRkb20uc2xpZGVzLmFwcGVuZENoaWxkKCBkb20uYmFja2dyb3VuZCApO1xuXG5cdFx0XHQvLyBDbGlja2luZyBvbiBhbiBvdmVydmlldyBzbGlkZSBuYXZpZ2F0ZXMgdG8gaXRcblx0XHRcdHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFNMSURFU19TRUxFQ1RPUiApICkuZm9yRWFjaCggZnVuY3Rpb24oIHNsaWRlICkge1xuXHRcdFx0XHRpZiggIXNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ3N0YWNrJyApICkge1xuXHRcdFx0XHRcdHNsaWRlLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIG9uT3ZlcnZpZXdTbGlkZUNsaWNrZWQsIHRydWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBDYWxjdWxhdGUgc2xpZGUgc2l6ZXNcblx0XHRcdHZhciBtYXJnaW4gPSA3MDtcblx0XHRcdHZhciBzbGlkZVNpemUgPSBnZXRDb21wdXRlZFNsaWRlU2l6ZSgpO1xuXHRcdFx0b3ZlcnZpZXdTbGlkZVdpZHRoID0gc2xpZGVTaXplLndpZHRoICsgbWFyZ2luO1xuXHRcdFx0b3ZlcnZpZXdTbGlkZUhlaWdodCA9IHNsaWRlU2l6ZS5oZWlnaHQgKyBtYXJnaW47XG5cblx0XHRcdC8vIFJldmVyc2UgaW4gUlRMIG1vZGVcblx0XHRcdGlmKCBjb25maWcucnRsICkge1xuXHRcdFx0XHRvdmVydmlld1NsaWRlV2lkdGggPSAtb3ZlcnZpZXdTbGlkZVdpZHRoO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGVTbGlkZXNWaXNpYmlsaXR5KCk7XG5cdFx0XHRsYXlvdXRPdmVydmlldygpO1xuXHRcdFx0dXBkYXRlT3ZlcnZpZXcoKTtcblxuXHRcdFx0bGF5b3V0KCk7XG5cblx0XHRcdC8vIE5vdGlmeSBvYnNlcnZlcnMgb2YgdGhlIG92ZXJ2aWV3IHNob3dpbmdcblx0XHRcdGRpc3BhdGNoRXZlbnQoICdvdmVydmlld3Nob3duJywge1xuXHRcdFx0XHQnaW5kZXhoJzogaW5kZXhoLFxuXHRcdFx0XHQnaW5kZXh2JzogaW5kZXh2LFxuXHRcdFx0XHQnY3VycmVudFNsaWRlJzogY3VycmVudFNsaWRlXG5cdFx0XHR9ICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVc2VzIENTUyB0cmFuc2Zvcm1zIHRvIHBvc2l0aW9uIGFsbCBzbGlkZXMgaW4gYSBncmlkIGZvclxuXHQgKiBkaXNwbGF5IGluc2lkZSBvZiB0aGUgb3ZlcnZpZXcgbW9kZS5cblx0ICovXG5cdGZ1bmN0aW9uIGxheW91dE92ZXJ2aWV3KCkge1xuXG5cdFx0Ly8gTGF5b3V0IHNsaWRlc1xuXHRcdHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggaHNsaWRlLCBoICkge1xuXHRcdFx0aHNsaWRlLnNldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtaCcsIGggKTtcblx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIGhzbGlkZSwgJ3RyYW5zbGF0ZTNkKCcgKyAoIGggKiBvdmVydmlld1NsaWRlV2lkdGggKSArICdweCwgMCwgMCknICk7XG5cblx0XHRcdGlmKCBoc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnc3RhY2snICkgKSB7XG5cblx0XHRcdFx0dG9BcnJheSggaHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIHZzbGlkZSwgdiApIHtcblx0XHRcdFx0XHR2c2xpZGUuc2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC1oJywgaCApO1xuXHRcdFx0XHRcdHZzbGlkZS5zZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LXYnLCB2ICk7XG5cblx0XHRcdFx0XHR0cmFuc2Zvcm1FbGVtZW50KCB2c2xpZGUsICd0cmFuc2xhdGUzZCgwLCAnICsgKCB2ICogb3ZlcnZpZXdTbGlkZUhlaWdodCApICsgJ3B4LCAwKScgKTtcblx0XHRcdFx0fSApO1xuXG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gTGF5b3V0IHNsaWRlIGJhY2tncm91bmRzXG5cdFx0dG9BcnJheSggZG9tLmJhY2tncm91bmQuY2hpbGROb2RlcyApLmZvckVhY2goIGZ1bmN0aW9uKCBoYmFja2dyb3VuZCwgaCApIHtcblx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIGhiYWNrZ3JvdW5kLCAndHJhbnNsYXRlM2QoJyArICggaCAqIG92ZXJ2aWV3U2xpZGVXaWR0aCApICsgJ3B4LCAwLCAwKScgKTtcblxuXHRcdFx0dG9BcnJheSggaGJhY2tncm91bmQucXVlcnlTZWxlY3RvckFsbCggJy5zbGlkZS1iYWNrZ3JvdW5kJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIHZiYWNrZ3JvdW5kLCB2ICkge1xuXHRcdFx0XHR0cmFuc2Zvcm1FbGVtZW50KCB2YmFja2dyb3VuZCwgJ3RyYW5zbGF0ZTNkKDAsICcgKyAoIHYgKiBvdmVydmlld1NsaWRlSGVpZ2h0ICkgKyAncHgsIDApJyApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIE1vdmVzIHRoZSBvdmVydmlldyB2aWV3cG9ydCB0byB0aGUgY3VycmVudCBzbGlkZXMuXG5cdCAqIENhbGxlZCBlYWNoIHRpbWUgdGhlIGN1cnJlbnQgc2xpZGUgY2hhbmdlcy5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZU92ZXJ2aWV3KCkge1xuXG5cdFx0dHJhbnNmb3JtU2xpZGVzKCB7XG5cdFx0XHRvdmVydmlldzogW1xuXHRcdFx0XHQndHJhbnNsYXRlWCgnKyAoIC1pbmRleGggKiBvdmVydmlld1NsaWRlV2lkdGggKSArJ3B4KScsXG5cdFx0XHRcdCd0cmFuc2xhdGVZKCcrICggLWluZGV4diAqIG92ZXJ2aWV3U2xpZGVIZWlnaHQgKSArJ3B4KScsXG5cdFx0XHRcdCd0cmFuc2xhdGVaKCcrICggd2luZG93LmlubmVyV2lkdGggPCA0MDAgPyAtMTAwMCA6IC0yNTAwICkgKydweCknXG5cdFx0XHRdLmpvaW4oICcgJyApXG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogRXhpdHMgdGhlIHNsaWRlIG92ZXJ2aWV3IGFuZCBlbnRlcnMgdGhlIGN1cnJlbnRseVxuXHQgKiBhY3RpdmUgc2xpZGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBkZWFjdGl2YXRlT3ZlcnZpZXcoKSB7XG5cblx0XHQvLyBPbmx5IHByb2NlZWQgaWYgZW5hYmxlZCBpbiBjb25maWdcblx0XHRpZiggY29uZmlnLm92ZXJ2aWV3ICkge1xuXG5cdFx0XHRvdmVydmlldyA9IGZhbHNlO1xuXG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCAnb3ZlcnZpZXcnICk7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCAnb3ZlcnZpZXctYW5pbWF0ZWQnICk7XG5cblx0XHRcdC8vIFRlbXBvcmFyaWx5IGFkZCBhIGNsYXNzIHNvIHRoYXQgdHJhbnNpdGlvbnMgY2FuIGRvIGRpZmZlcmVudCB0aGluZ3Ncblx0XHRcdC8vIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZXkgYXJlIGV4aXRpbmcvZW50ZXJpbmcgb3ZlcnZpZXcsIG9yIGp1c3Rcblx0XHRcdC8vIG1vdmluZyBmcm9tIHNsaWRlIHRvIHNsaWRlXG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCAnb3ZlcnZpZXctZGVhY3RpdmF0aW5nJyApO1xuXG5cdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoICdvdmVydmlldy1kZWFjdGl2YXRpbmcnICk7XG5cdFx0XHR9LCAxICk7XG5cblx0XHRcdC8vIE1vdmUgdGhlIGJhY2tncm91bmQgZWxlbWVudCBiYWNrIG91dFxuXHRcdFx0ZG9tLndyYXBwZXIuYXBwZW5kQ2hpbGQoIGRvbS5iYWNrZ3JvdW5kICk7XG5cblx0XHRcdC8vIENsZWFuIHVwIGNoYW5nZXMgbWFkZSB0byBzbGlkZXNcblx0XHRcdHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFNMSURFU19TRUxFQ1RPUiApICkuZm9yRWFjaCggZnVuY3Rpb24oIHNsaWRlICkge1xuXHRcdFx0XHR0cmFuc2Zvcm1FbGVtZW50KCBzbGlkZSwgJycgKTtcblxuXHRcdFx0XHRzbGlkZS5yZW1vdmVFdmVudExpc3RlbmVyKCAnY2xpY2snLCBvbk92ZXJ2aWV3U2xpZGVDbGlja2VkLCB0cnVlICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIENsZWFuIHVwIGNoYW5nZXMgbWFkZSB0byBiYWNrZ3JvdW5kc1xuXHRcdFx0dG9BcnJheSggZG9tLmJhY2tncm91bmQucXVlcnlTZWxlY3RvckFsbCggJy5zbGlkZS1iYWNrZ3JvdW5kJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGJhY2tncm91bmQgKSB7XG5cdFx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIGJhY2tncm91bmQsICcnICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdHRyYW5zZm9ybVNsaWRlcyggeyBvdmVydmlldzogJycgfSApO1xuXG5cdFx0XHRzbGlkZSggaW5kZXhoLCBpbmRleHYgKTtcblxuXHRcdFx0bGF5b3V0KCk7XG5cblx0XHRcdGN1ZUF1dG9TbGlkZSgpO1xuXG5cdFx0XHQvLyBOb3RpZnkgb2JzZXJ2ZXJzIG9mIHRoZSBvdmVydmlldyBoaWRpbmdcblx0XHRcdGRpc3BhdGNoRXZlbnQoICdvdmVydmlld2hpZGRlbicsIHtcblx0XHRcdFx0J2luZGV4aCc6IGluZGV4aCxcblx0XHRcdFx0J2luZGV4dic6IGluZGV4dixcblx0XHRcdFx0J2N1cnJlbnRTbGlkZSc6IGN1cnJlbnRTbGlkZVxuXHRcdFx0fSApO1xuXG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgdGhlIHNsaWRlIG92ZXJ2aWV3IG1vZGUgb24gYW5kIG9mZi5cblx0ICpcblx0ICogQHBhcmFtIHtCb29sZWFufSBvdmVycmlkZSBPcHRpb25hbCBmbGFnIHdoaWNoIG92ZXJyaWRlcyB0aGVcblx0ICogdG9nZ2xlIGxvZ2ljIGFuZCBmb3JjaWJseSBzZXRzIHRoZSBkZXNpcmVkIHN0YXRlLiBUcnVlIG1lYW5zXG5cdCAqIG92ZXJ2aWV3IGlzIG9wZW4sIGZhbHNlIG1lYW5zIGl0J3MgY2xvc2VkLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlT3ZlcnZpZXcoIG92ZXJyaWRlICkge1xuXG5cdFx0aWYoIHR5cGVvZiBvdmVycmlkZSA9PT0gJ2Jvb2xlYW4nICkge1xuXHRcdFx0b3ZlcnJpZGUgPyBhY3RpdmF0ZU92ZXJ2aWV3KCkgOiBkZWFjdGl2YXRlT3ZlcnZpZXcoKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpc092ZXJ2aWV3KCkgPyBkZWFjdGl2YXRlT3ZlcnZpZXcoKSA6IGFjdGl2YXRlT3ZlcnZpZXcoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIG92ZXJ2aWV3IGlzIGN1cnJlbnRseSBhY3RpdmUuXG5cdCAqXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlIG92ZXJ2aWV3IGlzIGFjdGl2ZSxcblx0ICogZmFsc2Ugb3RoZXJ3aXNlXG5cdCAqL1xuXHRmdW5jdGlvbiBpc092ZXJ2aWV3KCkge1xuXG5cdFx0cmV0dXJuIG92ZXJ2aWV3O1xuXG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBjdXJyZW50IG9yIHNwZWNpZmllZCBzbGlkZSBpcyB2ZXJ0aWNhbFxuXHQgKiAobmVzdGVkIHdpdGhpbiBhbm90aGVyIHNsaWRlKS5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc2xpZGUgW29wdGlvbmFsXSBUaGUgc2xpZGUgdG8gY2hlY2tcblx0ICogb3JpZW50YXRpb24gb2Zcblx0ICovXG5cdGZ1bmN0aW9uIGlzVmVydGljYWxTbGlkZSggc2xpZGUgKSB7XG5cblx0XHQvLyBQcmVmZXIgc2xpZGUgYXJndW1lbnQsIG90aGVyd2lzZSB1c2UgY3VycmVudCBzbGlkZVxuXHRcdHNsaWRlID0gc2xpZGUgPyBzbGlkZSA6IGN1cnJlbnRTbGlkZTtcblxuXHRcdHJldHVybiBzbGlkZSAmJiBzbGlkZS5wYXJlbnROb2RlICYmICEhc2xpZGUucGFyZW50Tm9kZS5ub2RlTmFtZS5tYXRjaCggL3NlY3Rpb24vaSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxpbmcgdGhlIGZ1bGxzY3JlZW4gZnVuY3Rpb25hbGl0eSB2aWEgdGhlIGZ1bGxzY3JlZW4gQVBJXG5cdCAqXG5cdCAqIEBzZWUgaHR0cDovL2Z1bGxzY3JlZW4uc3BlYy53aGF0d2cub3JnL1xuXHQgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvRE9NL1VzaW5nX2Z1bGxzY3JlZW5fbW9kZVxuXHQgKi9cblx0ZnVuY3Rpb24gZW50ZXJGdWxsc2NyZWVuKCkge1xuXG5cdFx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5ib2R5O1xuXG5cdFx0Ly8gQ2hlY2sgd2hpY2ggaW1wbGVtZW50YXRpb24gaXMgYXZhaWxhYmxlXG5cdFx0dmFyIHJlcXVlc3RNZXRob2QgPSBlbGVtZW50LnJlcXVlc3RGdWxsU2NyZWVuIHx8XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4gfHxcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbFNjcmVlbiB8fFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuIHx8XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbjtcblxuXHRcdGlmKCByZXF1ZXN0TWV0aG9kICkge1xuXHRcdFx0cmVxdWVzdE1ldGhvZC5hcHBseSggZWxlbWVudCApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEVudGVycyB0aGUgcGF1c2VkIG1vZGUgd2hpY2ggZmFkZXMgZXZlcnl0aGluZyBvbiBzY3JlZW4gdG9cblx0ICogYmxhY2suXG5cdCAqL1xuXHRmdW5jdGlvbiBwYXVzZSgpIHtcblxuXHRcdGlmKCBjb25maWcucGF1c2UgKSB7XG5cdFx0XHR2YXIgd2FzUGF1c2VkID0gZG9tLndyYXBwZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCAncGF1c2VkJyApO1xuXG5cdFx0XHRjYW5jZWxBdXRvU2xpZGUoKTtcblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoICdwYXVzZWQnICk7XG5cblx0XHRcdGlmKCB3YXNQYXVzZWQgPT09IGZhbHNlICkge1xuXHRcdFx0XHRkaXNwYXRjaEV2ZW50KCAncGF1c2VkJyApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEV4aXRzIGZyb20gdGhlIHBhdXNlZCBtb2RlLlxuXHQgKi9cblx0ZnVuY3Rpb24gcmVzdW1lKCkge1xuXG5cdFx0dmFyIHdhc1BhdXNlZCA9IGRvbS53cmFwcGVyLmNsYXNzTGlzdC5jb250YWlucyggJ3BhdXNlZCcgKTtcblx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCAncGF1c2VkJyApO1xuXG5cdFx0Y3VlQXV0b1NsaWRlKCk7XG5cblx0XHRpZiggd2FzUGF1c2VkICkge1xuXHRcdFx0ZGlzcGF0Y2hFdmVudCggJ3Jlc3VtZWQnICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyB0aGUgcGF1c2VkIG1vZGUgb24gYW5kIG9mZi5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZVBhdXNlKCBvdmVycmlkZSApIHtcblxuXHRcdGlmKCB0eXBlb2Ygb3ZlcnJpZGUgPT09ICdib29sZWFuJyApIHtcblx0XHRcdG92ZXJyaWRlID8gcGF1c2UoKSA6IHJlc3VtZSgpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlzUGF1c2VkKCkgPyByZXN1bWUoKSA6IHBhdXNlKCk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHdlIGFyZSBjdXJyZW50bHkgaW4gdGhlIHBhdXNlZCBtb2RlLlxuXHQgKi9cblx0ZnVuY3Rpb24gaXNQYXVzZWQoKSB7XG5cblx0XHRyZXR1cm4gZG9tLndyYXBwZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCAncGF1c2VkJyApO1xuXG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyB0aGUgYXV0byBzbGlkZSBtb2RlIG9uIGFuZCBvZmYuXG5cdCAqXG5cdCAqIEBwYXJhbSB7Qm9vbGVhbn0gb3ZlcnJpZGUgT3B0aW9uYWwgZmxhZyB3aGljaCBzZXRzIHRoZSBkZXNpcmVkIHN0YXRlLlxuXHQgKiBUcnVlIG1lYW5zIGF1dG9wbGF5IHN0YXJ0cywgZmFsc2UgbWVhbnMgaXQgc3RvcHMuXG5cdCAqL1xuXG5cdGZ1bmN0aW9uIHRvZ2dsZUF1dG9TbGlkZSggb3ZlcnJpZGUgKSB7XG5cblx0XHRpZiggdHlwZW9mIG92ZXJyaWRlID09PSAnYm9vbGVhbicgKSB7XG5cdFx0XHRvdmVycmlkZSA/IHJlc3VtZUF1dG9TbGlkZSgpIDogcGF1c2VBdXRvU2xpZGUoKTtcblx0XHR9XG5cblx0XHRlbHNlIHtcblx0XHRcdGF1dG9TbGlkZVBhdXNlZCA/IHJlc3VtZUF1dG9TbGlkZSgpIDogcGF1c2VBdXRvU2xpZGUoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGF1dG8gc2xpZGUgbW9kZSBpcyBjdXJyZW50bHkgb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBpc0F1dG9TbGlkaW5nKCkge1xuXG5cdFx0cmV0dXJuICEhKCBhdXRvU2xpZGUgJiYgIWF1dG9TbGlkZVBhdXNlZCApO1xuXG5cdH1cblxuXHQvKipcblx0ICogU3RlcHMgZnJvbSB0aGUgY3VycmVudCBwb2ludCBpbiB0aGUgcHJlc2VudGF0aW9uIHRvIHRoZVxuXHQgKiBzbGlkZSB3aGljaCBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgaG9yaXpvbnRhbCBhbmQgdmVydGljYWxcblx0ICogaW5kaWNlcy5cblx0ICpcblx0ICogQHBhcmFtIHtpbnR9IGggSG9yaXpvbnRhbCBpbmRleCBvZiB0aGUgdGFyZ2V0IHNsaWRlXG5cdCAqIEBwYXJhbSB7aW50fSB2IFZlcnRpY2FsIGluZGV4IG9mIHRoZSB0YXJnZXQgc2xpZGVcblx0ICogQHBhcmFtIHtpbnR9IGYgT3B0aW9uYWwgaW5kZXggb2YgYSBmcmFnbWVudCB3aXRoaW4gdGhlXG5cdCAqIHRhcmdldCBzbGlkZSB0byBhY3RpdmF0ZVxuXHQgKiBAcGFyYW0ge2ludH0gbyBPcHRpb25hbCBvcmlnaW4gZm9yIHVzZSBpbiBtdWx0aW1hc3RlciBlbnZpcm9ubWVudHNcblx0ICovXG5cdGZ1bmN0aW9uIHNsaWRlKCBoLCB2LCBmLCBvICkge1xuXG5cdFx0Ly8gUmVtZW1iZXIgd2hlcmUgd2Ugd2VyZSBhdCBiZWZvcmVcblx0XHRwcmV2aW91c1NsaWRlID0gY3VycmVudFNsaWRlO1xuXG5cdFx0Ly8gUXVlcnkgYWxsIGhvcml6b250YWwgc2xpZGVzIGluIHRoZSBkZWNrXG5cdFx0dmFyIGhvcml6b250YWxTbGlkZXMgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApO1xuXG5cdFx0Ly8gSWYgbm8gdmVydGljYWwgaW5kZXggaXMgc3BlY2lmaWVkIGFuZCB0aGUgdXBjb21pbmcgc2xpZGUgaXMgYVxuXHRcdC8vIHN0YWNrLCByZXN1bWUgYXQgaXRzIHByZXZpb3VzIHZlcnRpY2FsIGluZGV4XG5cdFx0aWYoIHYgPT09IHVuZGVmaW5lZCAmJiAhaXNPdmVydmlldygpICkge1xuXHRcdFx0diA9IGdldFByZXZpb3VzVmVydGljYWxJbmRleCggaG9yaXpvbnRhbFNsaWRlc1sgaCBdICk7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgd2Ugd2VyZSBvbiBhIHZlcnRpY2FsIHN0YWNrLCByZW1lbWJlciB3aGF0IHZlcnRpY2FsIGluZGV4XG5cdFx0Ly8gaXQgd2FzIG9uIHNvIHdlIGNhbiByZXN1bWUgYXQgdGhlIHNhbWUgcG9zaXRpb24gd2hlbiByZXR1cm5pbmdcblx0XHRpZiggcHJldmlvdXNTbGlkZSAmJiBwcmV2aW91c1NsaWRlLnBhcmVudE5vZGUgJiYgcHJldmlvdXNTbGlkZS5wYXJlbnROb2RlLmNsYXNzTGlzdC5jb250YWlucyggJ3N0YWNrJyApICkge1xuXHRcdFx0c2V0UHJldmlvdXNWZXJ0aWNhbEluZGV4KCBwcmV2aW91c1NsaWRlLnBhcmVudE5vZGUsIGluZGV4diApO1xuXHRcdH1cblxuXHRcdC8vIFJlbWVtYmVyIHRoZSBzdGF0ZSBiZWZvcmUgdGhpcyBzbGlkZVxuXHRcdHZhciBzdGF0ZUJlZm9yZSA9IHN0YXRlLmNvbmNhdCgpO1xuXG5cdFx0Ly8gUmVzZXQgdGhlIHN0YXRlIGFycmF5XG5cdFx0c3RhdGUubGVuZ3RoID0gMDtcblxuXHRcdHZhciBpbmRleGhCZWZvcmUgPSBpbmRleGggfHwgMCxcblx0XHRcdGluZGV4dkJlZm9yZSA9IGluZGV4diB8fCAwO1xuXG5cdFx0Ly8gQWN0aXZhdGUgYW5kIHRyYW5zaXRpb24gdG8gdGhlIG5ldyBzbGlkZVxuXHRcdGluZGV4aCA9IHVwZGF0ZVNsaWRlcyggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IsIGggPT09IHVuZGVmaW5lZCA/IGluZGV4aCA6IGggKTtcblx0XHRpbmRleHYgPSB1cGRhdGVTbGlkZXMoIFZFUlRJQ0FMX1NMSURFU19TRUxFQ1RPUiwgdiA9PT0gdW5kZWZpbmVkID8gaW5kZXh2IDogdiApO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSB2aXNpYmlsaXR5IG9mIHNsaWRlcyBub3cgdGhhdCB0aGUgaW5kaWNlcyBoYXZlIGNoYW5nZWRcblx0XHR1cGRhdGVTbGlkZXNWaXNpYmlsaXR5KCk7XG5cblx0XHRsYXlvdXQoKTtcblxuXHRcdC8vIEFwcGx5IHRoZSBuZXcgc3RhdGVcblx0XHRzdGF0ZUxvb3A6IGZvciggdmFyIGkgPSAwLCBsZW4gPSBzdGF0ZS5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdC8vIENoZWNrIGlmIHRoaXMgc3RhdGUgZXhpc3RlZCBvbiB0aGUgcHJldmlvdXMgc2xpZGUuIElmIGl0XG5cdFx0XHQvLyBkaWQsIHdlIHdpbGwgYXZvaWQgYWRkaW5nIGl0IHJlcGVhdGVkbHlcblx0XHRcdGZvciggdmFyIGogPSAwOyBqIDwgc3RhdGVCZWZvcmUubGVuZ3RoOyBqKysgKSB7XG5cdFx0XHRcdGlmKCBzdGF0ZUJlZm9yZVtqXSA9PT0gc3RhdGVbaV0gKSB7XG5cdFx0XHRcdFx0c3RhdGVCZWZvcmUuc3BsaWNlKCBqLCAxICk7XG5cdFx0XHRcdFx0Y29udGludWUgc3RhdGVMb29wO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCBzdGF0ZVtpXSApO1xuXG5cdFx0XHQvLyBEaXNwYXRjaCBjdXN0b20gZXZlbnQgbWF0Y2hpbmcgdGhlIHN0YXRlJ3MgbmFtZVxuXHRcdFx0ZGlzcGF0Y2hFdmVudCggc3RhdGVbaV0gKTtcblx0XHR9XG5cblx0XHQvLyBDbGVhbiB1cCB0aGUgcmVtYWlucyBvZiB0aGUgcHJldmlvdXMgc3RhdGVcblx0XHR3aGlsZSggc3RhdGVCZWZvcmUubGVuZ3RoICkge1xuXHRcdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoIHN0YXRlQmVmb3JlLnBvcCgpICk7XG5cdFx0fVxuXG5cdFx0Ly8gVXBkYXRlIHRoZSBvdmVydmlldyBpZiBpdCdzIGN1cnJlbnRseSBhY3RpdmVcblx0XHRpZiggaXNPdmVydmlldygpICkge1xuXHRcdFx0dXBkYXRlT3ZlcnZpZXcoKTtcblx0XHR9XG5cblx0XHQvLyBGaW5kIHRoZSBjdXJyZW50IGhvcml6b250YWwgc2xpZGUgYW5kIGFueSBwb3NzaWJsZSB2ZXJ0aWNhbCBzbGlkZXNcblx0XHQvLyB3aXRoaW4gaXRcblx0XHR2YXIgY3VycmVudEhvcml6b250YWxTbGlkZSA9IGhvcml6b250YWxTbGlkZXNbIGluZGV4aCBdLFxuXHRcdFx0Y3VycmVudFZlcnRpY2FsU2xpZGVzID0gY3VycmVudEhvcml6b250YWxTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKTtcblxuXHRcdC8vIFN0b3JlIHJlZmVyZW5jZXMgdG8gdGhlIHByZXZpb3VzIGFuZCBjdXJyZW50IHNsaWRlc1xuXHRcdGN1cnJlbnRTbGlkZSA9IGN1cnJlbnRWZXJ0aWNhbFNsaWRlc1sgaW5kZXh2IF0gfHwgY3VycmVudEhvcml6b250YWxTbGlkZTtcblxuXHRcdC8vIFNob3cgZnJhZ21lbnQsIGlmIHNwZWNpZmllZFxuXHRcdGlmKCB0eXBlb2YgZiAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cdFx0XHRuYXZpZ2F0ZUZyYWdtZW50KCBmICk7XG5cdFx0fVxuXG5cdFx0Ly8gRGlzcGF0Y2ggYW4gZXZlbnQgaWYgdGhlIHNsaWRlIGNoYW5nZWRcblx0XHR2YXIgc2xpZGVDaGFuZ2VkID0gKCBpbmRleGggIT09IGluZGV4aEJlZm9yZSB8fCBpbmRleHYgIT09IGluZGV4dkJlZm9yZSApO1xuXHRcdGlmKCBzbGlkZUNoYW5nZWQgKSB7XG5cdFx0XHRkaXNwYXRjaEV2ZW50KCAnc2xpZGVjaGFuZ2VkJywge1xuXHRcdFx0XHQnaW5kZXhoJzogaW5kZXhoLFxuXHRcdFx0XHQnaW5kZXh2JzogaW5kZXh2LFxuXHRcdFx0XHQncHJldmlvdXNTbGlkZSc6IHByZXZpb3VzU2xpZGUsXG5cdFx0XHRcdCdjdXJyZW50U2xpZGUnOiBjdXJyZW50U2xpZGUsXG5cdFx0XHRcdCdvcmlnaW4nOiBvXG5cdFx0XHR9ICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gRW5zdXJlIHRoYXQgdGhlIHByZXZpb3VzIHNsaWRlIGlzIG5ldmVyIHRoZSBzYW1lIGFzIHRoZSBjdXJyZW50XG5cdFx0XHRwcmV2aW91c1NsaWRlID0gbnVsbDtcblx0XHR9XG5cblx0XHQvLyBTb2x2ZXMgYW4gZWRnZSBjYXNlIHdoZXJlIHRoZSBwcmV2aW91cyBzbGlkZSBtYWludGFpbnMgdGhlXG5cdFx0Ly8gJ3ByZXNlbnQnIGNsYXNzIHdoZW4gbmF2aWdhdGluZyBiZXR3ZWVuIGFkamFjZW50IHZlcnRpY2FsXG5cdFx0Ly8gc3RhY2tzXG5cdFx0aWYoIHByZXZpb3VzU2xpZGUgKSB7XG5cdFx0XHRwcmV2aW91c1NsaWRlLmNsYXNzTGlzdC5yZW1vdmUoICdwcmVzZW50JyApO1xuXHRcdFx0cHJldmlvdXNTbGlkZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO1xuXG5cdFx0XHQvLyBSZXNldCBhbGwgc2xpZGVzIHVwb24gbmF2aWdhdGUgdG8gaG9tZVxuXHRcdFx0Ly8gSXNzdWU6ICMyODVcblx0XHRcdGlmICggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvciggSE9NRV9TTElERV9TRUxFQ1RPUiApLmNsYXNzTGlzdC5jb250YWlucyggJ3ByZXNlbnQnICkgKSB7XG5cdFx0XHRcdC8vIExhdW5jaCBhc3luYyB0YXNrXG5cdFx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgc2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKyAnLnN0YWNrJykgKSwgaTtcblx0XHRcdFx0XHRmb3IoIGkgaW4gc2xpZGVzICkge1xuXHRcdFx0XHRcdFx0aWYoIHNsaWRlc1tpXSApIHtcblx0XHRcdFx0XHRcdFx0Ly8gUmVzZXQgc3RhY2tcblx0XHRcdFx0XHRcdFx0c2V0UHJldmlvdXNWZXJ0aWNhbEluZGV4KCBzbGlkZXNbaV0sIDAgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sIDAgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBIYW5kbGUgZW1iZWRkZWQgY29udGVudFxuXHRcdGlmKCBzbGlkZUNoYW5nZWQgfHwgIXByZXZpb3VzU2xpZGUgKSB7XG5cdFx0XHRzdG9wRW1iZWRkZWRDb250ZW50KCBwcmV2aW91c1NsaWRlICk7XG5cdFx0XHRzdGFydEVtYmVkZGVkQ29udGVudCggY3VycmVudFNsaWRlICk7XG5cdFx0fVxuXG5cdFx0Ly8gQW5ub3VuY2UgdGhlIGN1cnJlbnQgc2xpZGUgY29udGVudHMsIGZvciBzY3JlZW4gcmVhZGVyc1xuXHRcdGRvbS5zdGF0dXNEaXYudGV4dENvbnRlbnQgPSBjdXJyZW50U2xpZGUudGV4dENvbnRlbnQ7XG5cblx0XHR1cGRhdGVDb250cm9scygpO1xuXHRcdHVwZGF0ZVByb2dyZXNzKCk7XG5cdFx0dXBkYXRlQmFja2dyb3VuZCgpO1xuXHRcdHVwZGF0ZVBhcmFsbGF4KCk7XG5cdFx0dXBkYXRlU2xpZGVOdW1iZXIoKTtcblx0XHR1cGRhdGVOb3RlcygpO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBVUkwgaGFzaFxuXHRcdHdyaXRlVVJMKCk7XG5cblx0XHRjdWVBdXRvU2xpZGUoKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFN5bmNzIHRoZSBwcmVzZW50YXRpb24gd2l0aCB0aGUgY3VycmVudCBET00uIFVzZWZ1bFxuXHQgKiB3aGVuIG5ldyBzbGlkZXMgb3IgY29udHJvbCBlbGVtZW50cyBhcmUgYWRkZWQgb3Igd2hlblxuXHQgKiB0aGUgY29uZmlndXJhdGlvbiBoYXMgY2hhbmdlZC5cblx0ICovXG5cdGZ1bmN0aW9uIHN5bmMoKSB7XG5cblx0XHQvLyBTdWJzY3JpYmUgdG8gaW5wdXRcblx0XHRyZW1vdmVFdmVudExpc3RlbmVycygpO1xuXHRcdGFkZEV2ZW50TGlzdGVuZXJzKCk7XG5cblx0XHQvLyBGb3JjZSBhIGxheW91dCB0byBtYWtlIHN1cmUgdGhlIGN1cnJlbnQgY29uZmlnIGlzIGFjY291bnRlZCBmb3Jcblx0XHRsYXlvdXQoKTtcblxuXHRcdC8vIFJlZmxlY3QgdGhlIGN1cnJlbnQgYXV0b1NsaWRlIHZhbHVlXG5cdFx0YXV0b1NsaWRlID0gY29uZmlnLmF1dG9TbGlkZTtcblxuXHRcdC8vIFN0YXJ0IGF1dG8tc2xpZGluZyBpZiBpdCdzIGVuYWJsZWRcblx0XHRjdWVBdXRvU2xpZGUoKTtcblxuXHRcdC8vIFJlLWNyZWF0ZSB0aGUgc2xpZGUgYmFja2dyb3VuZHNcblx0XHRjcmVhdGVCYWNrZ3JvdW5kcygpO1xuXG5cdFx0Ly8gV3JpdGUgdGhlIGN1cnJlbnQgaGFzaCB0byB0aGUgVVJMXG5cdFx0d3JpdGVVUkwoKTtcblxuXHRcdHNvcnRBbGxGcmFnbWVudHMoKTtcblxuXHRcdHVwZGF0ZUNvbnRyb2xzKCk7XG5cdFx0dXBkYXRlUHJvZ3Jlc3MoKTtcblx0XHR1cGRhdGVCYWNrZ3JvdW5kKCB0cnVlICk7XG5cdFx0dXBkYXRlU2xpZGVOdW1iZXIoKTtcblx0XHR1cGRhdGVTbGlkZXNWaXNpYmlsaXR5KCk7XG5cdFx0dXBkYXRlTm90ZXMoKTtcblxuXHRcdGZvcm1hdEVtYmVkZGVkQ29udGVudCgpO1xuXHRcdHN0YXJ0RW1iZWRkZWRDb250ZW50KCBjdXJyZW50U2xpZGUgKTtcblxuXHRcdGlmKCBpc092ZXJ2aWV3KCkgKSB7XG5cdFx0XHRsYXlvdXRPdmVydmlldygpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFJlc2V0cyBhbGwgdmVydGljYWwgc2xpZGVzIHNvIHRoYXQgb25seSB0aGUgZmlyc3Rcblx0ICogaXMgdmlzaWJsZS5cblx0ICovXG5cdGZ1bmN0aW9uIHJlc2V0VmVydGljYWxTbGlkZXMoKSB7XG5cblx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlcyA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICkgKTtcblx0XHRob3Jpem9udGFsU2xpZGVzLmZvckVhY2goIGZ1bmN0aW9uKCBob3Jpem9udGFsU2xpZGUgKSB7XG5cblx0XHRcdHZhciB2ZXJ0aWNhbFNsaWRlcyA9IHRvQXJyYXkoIGhvcml6b250YWxTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApO1xuXHRcdFx0dmVydGljYWxTbGlkZXMuZm9yRWFjaCggZnVuY3Rpb24oIHZlcnRpY2FsU2xpZGUsIHkgKSB7XG5cblx0XHRcdFx0aWYoIHkgPiAwICkge1xuXHRcdFx0XHRcdHZlcnRpY2FsU2xpZGUuY2xhc3NMaXN0LnJlbW92ZSggJ3ByZXNlbnQnICk7XG5cdFx0XHRcdFx0dmVydGljYWxTbGlkZS5jbGFzc0xpc3QucmVtb3ZlKCAncGFzdCcgKTtcblx0XHRcdFx0XHR2ZXJ0aWNhbFNsaWRlLmNsYXNzTGlzdC5hZGQoICdmdXR1cmUnICk7XG5cdFx0XHRcdFx0dmVydGljYWxTbGlkZS5zZXRBdHRyaWJ1dGUoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0gKTtcblxuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFNvcnRzIGFuZCBmb3JtYXRzIGFsbCBvZiBmcmFnbWVudHMgaW4gdGhlXG5cdCAqIHByZXNlbnRhdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIHNvcnRBbGxGcmFnbWVudHMoKSB7XG5cblx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlcyA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICkgKTtcblx0XHRob3Jpem9udGFsU2xpZGVzLmZvckVhY2goIGZ1bmN0aW9uKCBob3Jpem9udGFsU2xpZGUgKSB7XG5cblx0XHRcdHZhciB2ZXJ0aWNhbFNsaWRlcyA9IHRvQXJyYXkoIGhvcml6b250YWxTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApO1xuXHRcdFx0dmVydGljYWxTbGlkZXMuZm9yRWFjaCggZnVuY3Rpb24oIHZlcnRpY2FsU2xpZGUsIHkgKSB7XG5cblx0XHRcdFx0c29ydEZyYWdtZW50cyggdmVydGljYWxTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApICk7XG5cblx0XHRcdH0gKTtcblxuXHRcdFx0aWYoIHZlcnRpY2FsU2xpZGVzLmxlbmd0aCA9PT0gMCApIHNvcnRGcmFnbWVudHMoIGhvcml6b250YWxTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApICk7XG5cblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSYW5kb21seSBzaHVmZmxlcyBhbGwgc2xpZGVzIGluIHRoZSBkZWNrLlxuXHQgKi9cblx0ZnVuY3Rpb24gc2h1ZmZsZSgpIHtcblxuXHRcdHZhciBzbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICk7XG5cblx0XHRzbGlkZXMuZm9yRWFjaCggZnVuY3Rpb24oIHNsaWRlICkge1xuXG5cdFx0XHQvLyBJbnNlcnQgdGhpcyBzbGlkZSBuZXh0IHRvIGFub3RoZXIgcmFuZG9tIHNsaWRlLiBUaGlzIG1heVxuXHRcdFx0Ly8gY2F1c2UgdGhlIHNsaWRlIHRvIGluc2VydCBiZWZvcmUgaXRzZWxmIGJ1dCB0aGF0J3MgZmluZS5cblx0XHRcdGRvbS5zbGlkZXMuaW5zZXJ0QmVmb3JlKCBzbGlkZSwgc2xpZGVzWyBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogc2xpZGVzLmxlbmd0aCApIF0gKTtcblxuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgb25lIGRpbWVuc2lvbiBvZiBzbGlkZXMgYnkgc2hvd2luZyB0aGUgc2xpZGVcblx0ICogd2l0aCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgQSBDU1Mgc2VsZWN0b3IgdGhhdCB3aWxsIGZldGNoXG5cdCAqIHRoZSBncm91cCBvZiBzbGlkZXMgd2UgYXJlIHdvcmtpbmcgd2l0aFxuXHQgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBzbGlkZSB0aGF0IHNob3VsZCBiZVxuXHQgKiBzaG93blxuXHQgKlxuXHQgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBpbmRleCBvZiB0aGUgc2xpZGUgdGhhdCBpcyBub3cgc2hvd24sXG5cdCAqIG1pZ2h0IGRpZmZlciBmcm9tIHRoZSBwYXNzZWQgaW4gaW5kZXggaWYgaXQgd2FzIG91dCBvZlxuXHQgKiBib3VuZHMuXG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVTbGlkZXMoIHNlbGVjdG9yLCBpbmRleCApIHtcblxuXHRcdC8vIFNlbGVjdCBhbGwgc2xpZGVzIGFuZCBjb252ZXJ0IHRoZSBOb2RlTGlzdCByZXN1bHQgdG9cblx0XHQvLyBhbiBhcnJheVxuXHRcdHZhciBzbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciApICksXG5cdFx0XHRzbGlkZXNMZW5ndGggPSBzbGlkZXMubGVuZ3RoO1xuXG5cdFx0dmFyIHByaW50TW9kZSA9IGlzUHJpbnRpbmdQREYoKTtcblxuXHRcdGlmKCBzbGlkZXNMZW5ndGggKSB7XG5cblx0XHRcdC8vIFNob3VsZCB0aGUgaW5kZXggbG9vcD9cblx0XHRcdGlmKCBjb25maWcubG9vcCApIHtcblx0XHRcdFx0aW5kZXggJT0gc2xpZGVzTGVuZ3RoO1xuXG5cdFx0XHRcdGlmKCBpbmRleCA8IDAgKSB7XG5cdFx0XHRcdFx0aW5kZXggPSBzbGlkZXNMZW5ndGggKyBpbmRleDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBFbmZvcmNlIG1heCBhbmQgbWluaW11bSBpbmRleCBib3VuZHNcblx0XHRcdGluZGV4ID0gTWF0aC5tYXgoIE1hdGgubWluKCBpbmRleCwgc2xpZGVzTGVuZ3RoIC0gMSApLCAwICk7XG5cblx0XHRcdGZvciggdmFyIGkgPSAwOyBpIDwgc2xpZGVzTGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdHZhciBlbGVtZW50ID0gc2xpZGVzW2ldO1xuXG5cdFx0XHRcdHZhciByZXZlcnNlID0gY29uZmlnLnJ0bCAmJiAhaXNWZXJ0aWNhbFNsaWRlKCBlbGVtZW50ICk7XG5cblx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAncGFzdCcgKTtcblx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAncHJlc2VudCcgKTtcblx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnZnV0dXJlJyApO1xuXG5cdFx0XHRcdC8vIGh0dHA6Ly93d3cudzMub3JnL2h0bWwvd2cvZHJhZnRzL2h0bWwvbWFzdGVyL2VkaXRpbmcuaHRtbCN0aGUtaGlkZGVuLWF0dHJpYnV0ZVxuXHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSggJ2hpZGRlbicsICcnICk7XG5cdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnYXJpYS1oaWRkZW4nLCAndHJ1ZScgKTtcblxuXHRcdFx0XHQvLyBJZiB0aGlzIGVsZW1lbnQgY29udGFpbnMgdmVydGljYWwgc2xpZGVzXG5cdFx0XHRcdGlmKCBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoICdzZWN0aW9uJyApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ3N0YWNrJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgd2UncmUgcHJpbnRpbmcgc3RhdGljIHNsaWRlcywgYWxsIHNsaWRlcyBhcmUgXCJwcmVzZW50XCJcblx0XHRcdFx0aWYoIHByaW50TW9kZSApIHtcblx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoICdwcmVzZW50JyApO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoIGkgPCBpbmRleCApIHtcblx0XHRcdFx0XHQvLyBBbnkgZWxlbWVudCBwcmV2aW91cyB0byBpbmRleCBpcyBnaXZlbiB0aGUgJ3Bhc3QnIGNsYXNzXG5cdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCByZXZlcnNlID8gJ2Z1dHVyZScgOiAncGFzdCcgKTtcblxuXHRcdFx0XHRcdGlmKCBjb25maWcuZnJhZ21lbnRzICkge1xuXHRcdFx0XHRcdFx0dmFyIHBhc3RGcmFnbWVudHMgPSB0b0FycmF5KCBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQnICkgKTtcblxuXHRcdFx0XHRcdFx0Ly8gU2hvdyBhbGwgZnJhZ21lbnRzIG9uIHByaW9yIHNsaWRlc1xuXHRcdFx0XHRcdFx0d2hpbGUoIHBhc3RGcmFnbWVudHMubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgcGFzdEZyYWdtZW50ID0gcGFzdEZyYWdtZW50cy5wb3AoKTtcblx0XHRcdFx0XHRcdFx0cGFzdEZyYWdtZW50LmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xuXHRcdFx0XHRcdFx0XHRwYXN0RnJhZ21lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ2N1cnJlbnQtZnJhZ21lbnQnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoIGkgPiBpbmRleCApIHtcblx0XHRcdFx0XHQvLyBBbnkgZWxlbWVudCBzdWJzZXF1ZW50IHRvIGluZGV4IGlzIGdpdmVuIHRoZSAnZnV0dXJlJyBjbGFzc1xuXHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCggcmV2ZXJzZSA/ICdwYXN0JyA6ICdmdXR1cmUnICk7XG5cblx0XHRcdFx0XHRpZiggY29uZmlnLmZyYWdtZW50cyApIHtcblx0XHRcdFx0XHRcdHZhciBmdXR1cmVGcmFnbWVudHMgPSB0b0FycmF5KCBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQudmlzaWJsZScgKSApO1xuXG5cdFx0XHRcdFx0XHQvLyBObyBmcmFnbWVudHMgaW4gZnV0dXJlIHNsaWRlcyBzaG91bGQgYmUgdmlzaWJsZSBhaGVhZCBvZiB0aW1lXG5cdFx0XHRcdFx0XHR3aGlsZSggZnV0dXJlRnJhZ21lbnRzLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0dmFyIGZ1dHVyZUZyYWdtZW50ID0gZnV0dXJlRnJhZ21lbnRzLnBvcCgpO1xuXHRcdFx0XHRcdFx0XHRmdXR1cmVGcmFnbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAndmlzaWJsZScgKTtcblx0XHRcdFx0XHRcdFx0ZnV0dXJlRnJhZ21lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ2N1cnJlbnQtZnJhZ21lbnQnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIE1hcmsgdGhlIGN1cnJlbnQgc2xpZGUgYXMgcHJlc2VudFxuXHRcdFx0c2xpZGVzW2luZGV4XS5jbGFzc0xpc3QuYWRkKCAncHJlc2VudCcgKTtcblx0XHRcdHNsaWRlc1tpbmRleF0ucmVtb3ZlQXR0cmlidXRlKCAnaGlkZGVuJyApO1xuXHRcdFx0c2xpZGVzW2luZGV4XS5yZW1vdmVBdHRyaWJ1dGUoICdhcmlhLWhpZGRlbicgKTtcblxuXHRcdFx0Ly8gSWYgdGhpcyBzbGlkZSBoYXMgYSBzdGF0ZSBhc3NvY2lhdGVkIHdpdGggaXQsIGFkZCBpdFxuXHRcdFx0Ly8gb250byB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgZGVja1xuXHRcdFx0dmFyIHNsaWRlU3RhdGUgPSBzbGlkZXNbaW5kZXhdLmdldEF0dHJpYnV0ZSggJ2RhdGEtc3RhdGUnICk7XG5cdFx0XHRpZiggc2xpZGVTdGF0ZSApIHtcblx0XHRcdFx0c3RhdGUgPSBzdGF0ZS5jb25jYXQoIHNsaWRlU3RhdGUuc3BsaXQoICcgJyApICk7XG5cdFx0XHR9XG5cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyBTaW5jZSB0aGVyZSBhcmUgbm8gc2xpZGVzIHdlIGNhbid0IGJlIGFueXdoZXJlIGJleW9uZCB0aGVcblx0XHRcdC8vIHplcm90aCBpbmRleFxuXHRcdFx0aW5kZXggPSAwO1xuXHRcdH1cblxuXHRcdHJldHVybiBpbmRleDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIE9wdGltaXphdGlvbiBtZXRob2Q7IGhpZGUgYWxsIHNsaWRlcyB0aGF0IGFyZSBmYXIgYXdheVxuXHQgKiBmcm9tIHRoZSBwcmVzZW50IHNsaWRlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlU2xpZGVzVmlzaWJpbGl0eSgpIHtcblxuXHRcdC8vIFNlbGVjdCBhbGwgc2xpZGVzIGFuZCBjb252ZXJ0IHRoZSBOb2RlTGlzdCByZXN1bHQgdG9cblx0XHQvLyBhbiBhcnJheVxuXHRcdHZhciBob3Jpem9udGFsU2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApLFxuXHRcdFx0aG9yaXpvbnRhbFNsaWRlc0xlbmd0aCA9IGhvcml6b250YWxTbGlkZXMubGVuZ3RoLFxuXHRcdFx0ZGlzdGFuY2VYLFxuXHRcdFx0ZGlzdGFuY2VZO1xuXG5cdFx0aWYoIGhvcml6b250YWxTbGlkZXNMZW5ndGggJiYgdHlwZW9mIGluZGV4aCAhPT0gJ3VuZGVmaW5lZCcgKSB7XG5cblx0XHRcdC8vIFRoZSBudW1iZXIgb2Ygc3RlcHMgYXdheSBmcm9tIHRoZSBwcmVzZW50IHNsaWRlIHRoYXQgd2lsbFxuXHRcdFx0Ly8gYmUgdmlzaWJsZVxuXHRcdFx0dmFyIHZpZXdEaXN0YW5jZSA9IGlzT3ZlcnZpZXcoKSA/IDEwIDogY29uZmlnLnZpZXdEaXN0YW5jZTtcblxuXHRcdFx0Ly8gTGltaXQgdmlldyBkaXN0YW5jZSBvbiB3ZWFrZXIgZGV2aWNlc1xuXHRcdFx0aWYoIGlzTW9iaWxlRGV2aWNlICkge1xuXHRcdFx0XHR2aWV3RGlzdGFuY2UgPSBpc092ZXJ2aWV3KCkgPyA2IDogMjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWxsIHNsaWRlcyBuZWVkIHRvIGJlIHZpc2libGUgd2hlbiBleHBvcnRpbmcgdG8gUERGXG5cdFx0XHRpZiggaXNQcmludGluZ1BERigpICkge1xuXHRcdFx0XHR2aWV3RGlzdGFuY2UgPSBOdW1iZXIuTUFYX1ZBTFVFO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoIHZhciB4ID0gMDsgeCA8IGhvcml6b250YWxTbGlkZXNMZW5ndGg7IHgrKyApIHtcblx0XHRcdFx0dmFyIGhvcml6b250YWxTbGlkZSA9IGhvcml6b250YWxTbGlkZXNbeF07XG5cblx0XHRcdFx0dmFyIHZlcnRpY2FsU2xpZGVzID0gdG9BcnJheSggaG9yaXpvbnRhbFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApICksXG5cdFx0XHRcdFx0dmVydGljYWxTbGlkZXNMZW5ndGggPSB2ZXJ0aWNhbFNsaWRlcy5sZW5ndGg7XG5cblx0XHRcdFx0Ly8gRGV0ZXJtaW5lIGhvdyBmYXIgYXdheSB0aGlzIHNsaWRlIGlzIGZyb20gdGhlIHByZXNlbnRcblx0XHRcdFx0ZGlzdGFuY2VYID0gTWF0aC5hYnMoICggaW5kZXhoIHx8IDAgKSAtIHggKSB8fCAwO1xuXG5cdFx0XHRcdC8vIElmIHRoZSBwcmVzZW50YXRpb24gaXMgbG9vcGVkLCBkaXN0YW5jZSBzaG91bGQgbWVhc3VyZVxuXHRcdFx0XHQvLyAxIGJldHdlZW4gdGhlIGZpcnN0IGFuZCBsYXN0IHNsaWRlc1xuXHRcdFx0XHRpZiggY29uZmlnLmxvb3AgKSB7XG5cdFx0XHRcdFx0ZGlzdGFuY2VYID0gTWF0aC5hYnMoICggKCBpbmRleGggfHwgMCApIC0geCApICUgKCBob3Jpem9udGFsU2xpZGVzTGVuZ3RoIC0gdmlld0Rpc3RhbmNlICkgKSB8fCAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gU2hvdyB0aGUgaG9yaXpvbnRhbCBzbGlkZSBpZiBpdCdzIHdpdGhpbiB0aGUgdmlldyBkaXN0YW5jZVxuXHRcdFx0XHRpZiggZGlzdGFuY2VYIDwgdmlld0Rpc3RhbmNlICkge1xuXHRcdFx0XHRcdHNob3dTbGlkZSggaG9yaXpvbnRhbFNsaWRlICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aGlkZVNsaWRlKCBob3Jpem9udGFsU2xpZGUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCB2ZXJ0aWNhbFNsaWRlc0xlbmd0aCApIHtcblxuXHRcdFx0XHRcdHZhciBveSA9IGdldFByZXZpb3VzVmVydGljYWxJbmRleCggaG9yaXpvbnRhbFNsaWRlICk7XG5cblx0XHRcdFx0XHRmb3IoIHZhciB5ID0gMDsgeSA8IHZlcnRpY2FsU2xpZGVzTGVuZ3RoOyB5KysgKSB7XG5cdFx0XHRcdFx0XHR2YXIgdmVydGljYWxTbGlkZSA9IHZlcnRpY2FsU2xpZGVzW3ldO1xuXG5cdFx0XHRcdFx0XHRkaXN0YW5jZVkgPSB4ID09PSAoIGluZGV4aCB8fCAwICkgPyBNYXRoLmFicyggKCBpbmRleHYgfHwgMCApIC0geSApIDogTWF0aC5hYnMoIHkgLSBveSApO1xuXG5cdFx0XHRcdFx0XHRpZiggZGlzdGFuY2VYICsgZGlzdGFuY2VZIDwgdmlld0Rpc3RhbmNlICkge1xuXHRcdFx0XHRcdFx0XHRzaG93U2xpZGUoIHZlcnRpY2FsU2xpZGUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRoaWRlU2xpZGUoIHZlcnRpY2FsU2xpZGUgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogUGljayB1cCBub3RlcyBmcm9tIHRoZSBjdXJyZW50IHNsaWRlIGFuZCBkaXNwbGF5IHRoYW1cblx0ICogdG8gdGhlIHZpZXdlci5cblx0ICpcblx0ICogQHNlZSBgc2hvd05vdGVzYCBjb25maWcgdmFsdWVcblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZU5vdGVzKCkge1xuXG5cdFx0aWYoIGNvbmZpZy5zaG93Tm90ZXMgJiYgZG9tLnNwZWFrZXJOb3RlcyAmJiBjdXJyZW50U2xpZGUgJiYgIWlzUHJpbnRpbmdQREYoKSApIHtcblxuXHRcdFx0ZG9tLnNwZWFrZXJOb3Rlcy5pbm5lckhUTUwgPSBnZXRTbGlkZU5vdGVzKCkgfHwgJyc7XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBwcm9ncmVzcyBiYXIgdG8gcmVmbGVjdCB0aGUgY3VycmVudCBzbGlkZS5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZVByb2dyZXNzKCkge1xuXG5cdFx0Ly8gVXBkYXRlIHByb2dyZXNzIGlmIGVuYWJsZWRcblx0XHRpZiggY29uZmlnLnByb2dyZXNzICYmIGRvbS5wcm9ncmVzc2JhciApIHtcblxuXHRcdFx0ZG9tLnByb2dyZXNzYmFyLnN0eWxlLndpZHRoID0gZ2V0UHJvZ3Jlc3MoKSAqIGRvbS53cmFwcGVyLm9mZnNldFdpZHRoICsgJ3B4JztcblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIHNsaWRlIG51bWJlciBkaXYgdG8gcmVmbGVjdCB0aGUgY3VycmVudCBzbGlkZS5cblx0ICpcblx0ICogVGhlIGZvbGxvd2luZyBzbGlkZSBudW1iZXIgZm9ybWF0cyBhcmUgYXZhaWxhYmxlOlxuXHQgKiAgXCJoLnZcIjogXHRob3Jpem9udGFsIC4gdmVydGljYWwgc2xpZGUgbnVtYmVyIChkZWZhdWx0KVxuXHQgKiAgXCJoL3ZcIjogXHRob3Jpem9udGFsIC8gdmVydGljYWwgc2xpZGUgbnVtYmVyXG5cdCAqICAgIFwiY1wiOiBcdGZsYXR0ZW5lZCBzbGlkZSBudW1iZXJcblx0ICogIFwiYy90XCI6IFx0ZmxhdHRlbmVkIHNsaWRlIG51bWJlciAvIHRvdGFsIHNsaWRlc1xuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlU2xpZGVOdW1iZXIoKSB7XG5cblx0XHQvLyBVcGRhdGUgc2xpZGUgbnVtYmVyIGlmIGVuYWJsZWRcblx0XHRpZiggY29uZmlnLnNsaWRlTnVtYmVyICYmIGRvbS5zbGlkZU51bWJlciApIHtcblxuXHRcdFx0dmFyIHZhbHVlID0gW107XG5cdFx0XHR2YXIgZm9ybWF0ID0gJ2gudic7XG5cblx0XHRcdC8vIENoZWNrIGlmIGEgY3VzdG9tIG51bWJlciBmb3JtYXQgaXMgYXZhaWxhYmxlXG5cdFx0XHRpZiggdHlwZW9mIGNvbmZpZy5zbGlkZU51bWJlciA9PT0gJ3N0cmluZycgKSB7XG5cdFx0XHRcdGZvcm1hdCA9IGNvbmZpZy5zbGlkZU51bWJlcjtcblx0XHRcdH1cblxuXHRcdFx0c3dpdGNoKCBmb3JtYXQgKSB7XG5cdFx0XHRcdGNhc2UgJ2MnOlxuXHRcdFx0XHRcdHZhbHVlLnB1c2goIGdldFNsaWRlUGFzdENvdW50KCkgKyAxICk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2MvdCc6XG5cdFx0XHRcdFx0dmFsdWUucHVzaCggZ2V0U2xpZGVQYXN0Q291bnQoKSArIDEsICcvJywgZ2V0VG90YWxTbGlkZXMoKSApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdoL3YnOlxuXHRcdFx0XHRcdHZhbHVlLnB1c2goIGluZGV4aCArIDEgKTtcblx0XHRcdFx0XHRpZiggaXNWZXJ0aWNhbFNsaWRlKCkgKSB2YWx1ZS5wdXNoKCAnLycsIGluZGV4diArIDEgKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR2YWx1ZS5wdXNoKCBpbmRleGggKyAxICk7XG5cdFx0XHRcdFx0aWYoIGlzVmVydGljYWxTbGlkZSgpICkgdmFsdWUucHVzaCggJy4nLCBpbmRleHYgKyAxICk7XG5cdFx0XHR9XG5cblx0XHRcdGRvbS5zbGlkZU51bWJlci5pbm5lckhUTUwgPSBmb3JtYXRTbGlkZU51bWJlciggdmFsdWVbMF0sIHZhbHVlWzFdLCB2YWx1ZVsyXSApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgSFRNTCBmb3JtYXR0aW5nIHRvIGEgc2xpZGUgbnVtYmVyIGJlZm9yZSBpdCdzXG5cdCAqIHdyaXR0ZW4gdG8gdGhlIERPTS5cblx0ICovXG5cdGZ1bmN0aW9uIGZvcm1hdFNsaWRlTnVtYmVyKCBhLCBkZWxpbWl0ZXIsIGIgKSB7XG5cblx0XHRpZiggdHlwZW9mIGIgPT09ICdudW1iZXInICYmICFpc05hTiggYiApICkge1xuXHRcdFx0cmV0dXJuICAnPHNwYW4gY2xhc3M9XCJzbGlkZS1udW1iZXItYVwiPicrIGEgKyc8L3NwYW4+JyArXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwic2xpZGUtbnVtYmVyLWRlbGltaXRlclwiPicrIGRlbGltaXRlciArJzwvc3Bhbj4nICtcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJzbGlkZS1udW1iZXItYlwiPicrIGIgKyc8L3NwYW4+Jztcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4gJzxzcGFuIGNsYXNzPVwic2xpZGUtbnVtYmVyLWFcIj4nKyBhICsnPC9zcGFuPic7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgc3RhdGUgb2YgYWxsIGNvbnRyb2wvbmF2aWdhdGlvbiBhcnJvd3MuXG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVDb250cm9scygpIHtcblxuXHRcdHZhciByb3V0ZXMgPSBhdmFpbGFibGVSb3V0ZXMoKTtcblx0XHR2YXIgZnJhZ21lbnRzID0gYXZhaWxhYmxlRnJhZ21lbnRzKCk7XG5cblx0XHQvLyBSZW1vdmUgdGhlICdlbmFibGVkJyBjbGFzcyBmcm9tIGFsbCBkaXJlY3Rpb25zXG5cdFx0ZG9tLmNvbnRyb2xzTGVmdC5jb25jYXQoIGRvbS5jb250cm9sc1JpZ2h0IClcblx0XHRcdFx0XHRcdC5jb25jYXQoIGRvbS5jb250cm9sc1VwIClcblx0XHRcdFx0XHRcdC5jb25jYXQoIGRvbS5jb250cm9sc0Rvd24gKVxuXHRcdFx0XHRcdFx0LmNvbmNhdCggZG9tLmNvbnRyb2xzUHJldiApXG5cdFx0XHRcdFx0XHQuY29uY2F0KCBkb20uY29udHJvbHNOZXh0ICkuZm9yRWFjaCggZnVuY3Rpb24oIG5vZGUgKSB7XG5cdFx0XHRub2RlLmNsYXNzTGlzdC5yZW1vdmUoICdlbmFibGVkJyApO1xuXHRcdFx0bm9kZS5jbGFzc0xpc3QucmVtb3ZlKCAnZnJhZ21lbnRlZCcgKTtcblx0XHR9ICk7XG5cblx0XHQvLyBBZGQgdGhlICdlbmFibGVkJyBjbGFzcyB0byB0aGUgYXZhaWxhYmxlIHJvdXRlc1xuXHRcdGlmKCByb3V0ZXMubGVmdCApIGRvbS5jb250cm9sc0xlZnQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZW5hYmxlZCcgKTtcdH0gKTtcblx0XHRpZiggcm91dGVzLnJpZ2h0ICkgZG9tLmNvbnRyb2xzUmlnaHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZW5hYmxlZCcgKTsgfSApO1xuXHRcdGlmKCByb3V0ZXMudXAgKSBkb20uY29udHJvbHNVcC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdlbmFibGVkJyApO1x0fSApO1xuXHRcdGlmKCByb3V0ZXMuZG93biApIGRvbS5jb250cm9sc0Rvd24uZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZW5hYmxlZCcgKTsgfSApO1xuXG5cdFx0Ly8gUHJldi9uZXh0IGJ1dHRvbnNcblx0XHRpZiggcm91dGVzLmxlZnQgfHwgcm91dGVzLnVwICkgZG9tLmNvbnRyb2xzUHJldi5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdlbmFibGVkJyApOyB9ICk7XG5cdFx0aWYoIHJvdXRlcy5yaWdodCB8fCByb3V0ZXMuZG93biApIGRvbS5jb250cm9sc05leHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZW5hYmxlZCcgKTsgfSApO1xuXG5cdFx0Ly8gSGlnaGxpZ2h0IGZyYWdtZW50IGRpcmVjdGlvbnNcblx0XHRpZiggY3VycmVudFNsaWRlICkge1xuXG5cdFx0XHQvLyBBbHdheXMgYXBwbHkgZnJhZ21lbnQgZGVjb3JhdG9yIHRvIHByZXYvbmV4dCBidXR0b25zXG5cdFx0XHRpZiggZnJhZ21lbnRzLnByZXYgKSBkb20uY29udHJvbHNQcmV2LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2ZyYWdtZW50ZWQnLCAnZW5hYmxlZCcgKTsgfSApO1xuXHRcdFx0aWYoIGZyYWdtZW50cy5uZXh0ICkgZG9tLmNvbnRyb2xzTmV4dC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdmcmFnbWVudGVkJywgJ2VuYWJsZWQnICk7IH0gKTtcblxuXHRcdFx0Ly8gQXBwbHkgZnJhZ21lbnQgZGVjb3JhdG9ycyB0byBkaXJlY3Rpb25hbCBidXR0b25zIGJhc2VkIG9uXG5cdFx0XHQvLyB3aGF0IHNsaWRlIGF4aXMgdGhleSBhcmUgaW5cblx0XHRcdGlmKCBpc1ZlcnRpY2FsU2xpZGUoIGN1cnJlbnRTbGlkZSApICkge1xuXHRcdFx0XHRpZiggZnJhZ21lbnRzLnByZXYgKSBkb20uY29udHJvbHNVcC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdmcmFnbWVudGVkJywgJ2VuYWJsZWQnICk7IH0gKTtcblx0XHRcdFx0aWYoIGZyYWdtZW50cy5uZXh0ICkgZG9tLmNvbnRyb2xzRG93bi5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdmcmFnbWVudGVkJywgJ2VuYWJsZWQnICk7IH0gKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRpZiggZnJhZ21lbnRzLnByZXYgKSBkb20uY29udHJvbHNMZWZ0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2ZyYWdtZW50ZWQnLCAnZW5hYmxlZCcgKTsgfSApO1xuXHRcdFx0XHRpZiggZnJhZ21lbnRzLm5leHQgKSBkb20uY29udHJvbHNSaWdodC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdmcmFnbWVudGVkJywgJ2VuYWJsZWQnICk7IH0gKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIGJhY2tncm91bmQgZWxlbWVudHMgdG8gcmVmbGVjdCB0aGUgY3VycmVudFxuXHQgKiBzbGlkZS5cblx0ICpcblx0ICogQHBhcmFtIHtCb29sZWFufSBpbmNsdWRlQWxsIElmIHRydWUsIHRoZSBiYWNrZ3JvdW5kcyBvZlxuXHQgKiBhbGwgdmVydGljYWwgc2xpZGVzIChub3QganVzdCB0aGUgcHJlc2VudCkgd2lsbCBiZSB1cGRhdGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlQmFja2dyb3VuZCggaW5jbHVkZUFsbCApIHtcblxuXHRcdHZhciBjdXJyZW50QmFja2dyb3VuZCA9IG51bGw7XG5cblx0XHQvLyBSZXZlcnNlIHBhc3QvZnV0dXJlIGNsYXNzZXMgd2hlbiBpbiBSVEwgbW9kZVxuXHRcdHZhciBob3Jpem9udGFsUGFzdCA9IGNvbmZpZy5ydGwgPyAnZnV0dXJlJyA6ICdwYXN0Jyxcblx0XHRcdGhvcml6b250YWxGdXR1cmUgPSBjb25maWcucnRsID8gJ3Bhc3QnIDogJ2Z1dHVyZSc7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGNsYXNzZXMgb2YgYWxsIGJhY2tncm91bmRzIHRvIG1hdGNoIHRoZVxuXHRcdC8vIHN0YXRlcyBvZiB0aGVpciBzbGlkZXMgKHBhc3QvcHJlc2VudC9mdXR1cmUpXG5cdFx0dG9BcnJheSggZG9tLmJhY2tncm91bmQuY2hpbGROb2RlcyApLmZvckVhY2goIGZ1bmN0aW9uKCBiYWNrZ3JvdW5kaCwgaCApIHtcblxuXHRcdFx0YmFja2dyb3VuZGguY2xhc3NMaXN0LnJlbW92ZSggJ3Bhc3QnICk7XG5cdFx0XHRiYWNrZ3JvdW5kaC5jbGFzc0xpc3QucmVtb3ZlKCAncHJlc2VudCcgKTtcblx0XHRcdGJhY2tncm91bmRoLmNsYXNzTGlzdC5yZW1vdmUoICdmdXR1cmUnICk7XG5cblx0XHRcdGlmKCBoIDwgaW5kZXhoICkge1xuXHRcdFx0XHRiYWNrZ3JvdW5kaC5jbGFzc0xpc3QuYWRkKCBob3Jpem9udGFsUGFzdCApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoIGggPiBpbmRleGggKSB7XG5cdFx0XHRcdGJhY2tncm91bmRoLmNsYXNzTGlzdC5hZGQoIGhvcml6b250YWxGdXR1cmUgKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRiYWNrZ3JvdW5kaC5jbGFzc0xpc3QuYWRkKCAncHJlc2VudCcgKTtcblxuXHRcdFx0XHQvLyBTdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgY3VycmVudCBiYWNrZ3JvdW5kIGVsZW1lbnRcblx0XHRcdFx0Y3VycmVudEJhY2tncm91bmQgPSBiYWNrZ3JvdW5kaDtcblx0XHRcdH1cblxuXHRcdFx0aWYoIGluY2x1ZGVBbGwgfHwgaCA9PT0gaW5kZXhoICkge1xuXHRcdFx0XHR0b0FycmF5KCBiYWNrZ3JvdW5kaC5xdWVyeVNlbGVjdG9yQWxsKCAnLnNsaWRlLWJhY2tncm91bmQnICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggYmFja2dyb3VuZHYsIHYgKSB7XG5cblx0XHRcdFx0XHRiYWNrZ3JvdW5kdi5jbGFzc0xpc3QucmVtb3ZlKCAncGFzdCcgKTtcblx0XHRcdFx0XHRiYWNrZ3JvdW5kdi5jbGFzc0xpc3QucmVtb3ZlKCAncHJlc2VudCcgKTtcblx0XHRcdFx0XHRiYWNrZ3JvdW5kdi5jbGFzc0xpc3QucmVtb3ZlKCAnZnV0dXJlJyApO1xuXG5cdFx0XHRcdFx0aWYoIHYgPCBpbmRleHYgKSB7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kdi5jbGFzc0xpc3QuYWRkKCAncGFzdCcgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoIHYgPiBpbmRleHYgKSB7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kdi5jbGFzc0xpc3QuYWRkKCAnZnV0dXJlJyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGJhY2tncm91bmR2LmNsYXNzTGlzdC5hZGQoICdwcmVzZW50JyApO1xuXG5cdFx0XHRcdFx0XHQvLyBPbmx5IGlmIHRoaXMgaXMgdGhlIHByZXNlbnQgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgc2xpZGVcblx0XHRcdFx0XHRcdGlmKCBoID09PSBpbmRleGggKSBjdXJyZW50QmFja2dyb3VuZCA9IGJhY2tncm91bmR2O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cblx0XHQvLyBTdG9wIGFueSBjdXJyZW50bHkgcGxheWluZyB2aWRlbyBiYWNrZ3JvdW5kXG5cdFx0aWYoIHByZXZpb3VzQmFja2dyb3VuZCApIHtcblxuXHRcdFx0dmFyIHByZXZpb3VzVmlkZW8gPSBwcmV2aW91c0JhY2tncm91bmQucXVlcnlTZWxlY3RvciggJ3ZpZGVvJyApO1xuXHRcdFx0aWYoIHByZXZpb3VzVmlkZW8gKSBwcmV2aW91c1ZpZGVvLnBhdXNlKCk7XG5cblx0XHR9XG5cblx0XHRpZiggY3VycmVudEJhY2tncm91bmQgKSB7XG5cblx0XHRcdC8vIFN0YXJ0IHZpZGVvIHBsYXliYWNrXG5cdFx0XHR2YXIgY3VycmVudFZpZGVvID0gY3VycmVudEJhY2tncm91bmQucXVlcnlTZWxlY3RvciggJ3ZpZGVvJyApO1xuXHRcdFx0aWYoIGN1cnJlbnRWaWRlbyApIHtcblxuXHRcdFx0XHR2YXIgc3RhcnRWaWRlbyA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGN1cnJlbnRWaWRlby5jdXJyZW50VGltZSA9IDA7XG5cdFx0XHRcdFx0Y3VycmVudFZpZGVvLnBsYXkoKTtcblx0XHRcdFx0XHRjdXJyZW50VmlkZW8ucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2xvYWRlZGRhdGEnLCBzdGFydFZpZGVvICk7XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0aWYoIGN1cnJlbnRWaWRlby5yZWFkeVN0YXRlID4gMSApIHtcblx0XHRcdFx0XHRzdGFydFZpZGVvKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y3VycmVudFZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkZWRkYXRhJywgc3RhcnRWaWRlbyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdFx0dmFyIGJhY2tncm91bmRJbWFnZVVSTCA9IGN1cnJlbnRCYWNrZ3JvdW5kLnN0eWxlLmJhY2tncm91bmRJbWFnZSB8fCAnJztcblxuXHRcdFx0Ly8gUmVzdGFydCBHSUZzIChkb2Vzbid0IHdvcmsgaW4gRmlyZWZveClcblx0XHRcdGlmKCAvXFwuZ2lmL2kudGVzdCggYmFja2dyb3VuZEltYWdlVVJMICkgKSB7XG5cdFx0XHRcdGN1cnJlbnRCYWNrZ3JvdW5kLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICcnO1xuXHRcdFx0XHR3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggY3VycmVudEJhY2tncm91bmQgKS5vcGFjaXR5O1xuXHRcdFx0XHRjdXJyZW50QmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBiYWNrZ3JvdW5kSW1hZ2VVUkw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIERvbid0IHRyYW5zaXRpb24gYmV0d2VlbiBpZGVudGljYWwgYmFja2dyb3VuZHMuIFRoaXNcblx0XHRcdC8vIHByZXZlbnRzIHVud2FudGVkIGZsaWNrZXIuXG5cdFx0XHR2YXIgcHJldmlvdXNCYWNrZ3JvdW5kSGFzaCA9IHByZXZpb3VzQmFja2dyb3VuZCA/IHByZXZpb3VzQmFja2dyb3VuZC5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtaGFzaCcgKSA6IG51bGw7XG5cdFx0XHR2YXIgY3VycmVudEJhY2tncm91bmRIYXNoID0gY3VycmVudEJhY2tncm91bmQuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWhhc2gnICk7XG5cdFx0XHRpZiggY3VycmVudEJhY2tncm91bmRIYXNoICYmIGN1cnJlbnRCYWNrZ3JvdW5kSGFzaCA9PT0gcHJldmlvdXNCYWNrZ3JvdW5kSGFzaCAmJiBjdXJyZW50QmFja2dyb3VuZCAhPT0gcHJldmlvdXNCYWNrZ3JvdW5kICkge1xuXHRcdFx0XHRkb20uYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCAnbm8tdHJhbnNpdGlvbicgKTtcblx0XHRcdH1cblxuXHRcdFx0cHJldmlvdXNCYWNrZ3JvdW5kID0gY3VycmVudEJhY2tncm91bmQ7XG5cblx0XHR9XG5cblx0XHQvLyBJZiB0aGVyZSdzIGEgYmFja2dyb3VuZCBicmlnaHRuZXNzIGZsYWcgZm9yIHRoaXMgc2xpZGUsXG5cdFx0Ly8gYnViYmxlIGl0IHRvIHRoZSAucmV2ZWFsIGNvbnRhaW5lclxuXHRcdGlmKCBjdXJyZW50U2xpZGUgKSB7XG5cdFx0XHRbICdoYXMtbGlnaHQtYmFja2dyb3VuZCcsICdoYXMtZGFyay1iYWNrZ3JvdW5kJyBdLmZvckVhY2goIGZ1bmN0aW9uKCBjbGFzc1RvQnViYmxlICkge1xuXHRcdFx0XHRpZiggY3VycmVudFNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggY2xhc3NUb0J1YmJsZSApICkge1xuXHRcdFx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoIGNsYXNzVG9CdWJibGUgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCBjbGFzc1RvQnViYmxlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHQvLyBBbGxvdyB0aGUgZmlyc3QgYmFja2dyb3VuZCB0byBhcHBseSB3aXRob3V0IHRyYW5zaXRpb25cblx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdGRvbS5iYWNrZ3JvdW5kLmNsYXNzTGlzdC5yZW1vdmUoICduby10cmFuc2l0aW9uJyApO1xuXHRcdH0sIDEgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIHBvc2l0aW9uIG9mIHRoZSBwYXJhbGxheCBiYWNrZ3JvdW5kIGJhc2VkXG5cdCAqIG9uIHRoZSBjdXJyZW50IHNsaWRlIGluZGV4LlxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlUGFyYWxsYXgoKSB7XG5cblx0XHRpZiggY29uZmlnLnBhcmFsbGF4QmFja2dyb3VuZEltYWdlICkge1xuXG5cdFx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlcyA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICksXG5cdFx0XHRcdHZlcnRpY2FsU2xpZGVzID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggVkVSVElDQUxfU0xJREVTX1NFTEVDVE9SICk7XG5cblx0XHRcdHZhciBiYWNrZ3JvdW5kU2l6ZSA9IGRvbS5iYWNrZ3JvdW5kLnN0eWxlLmJhY2tncm91bmRTaXplLnNwbGl0KCAnICcgKSxcblx0XHRcdFx0YmFja2dyb3VuZFdpZHRoLCBiYWNrZ3JvdW5kSGVpZ2h0O1xuXG5cdFx0XHRpZiggYmFja2dyb3VuZFNpemUubGVuZ3RoID09PSAxICkge1xuXHRcdFx0XHRiYWNrZ3JvdW5kV2lkdGggPSBiYWNrZ3JvdW5kSGVpZ2h0ID0gcGFyc2VJbnQoIGJhY2tncm91bmRTaXplWzBdLCAxMCApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGJhY2tncm91bmRXaWR0aCA9IHBhcnNlSW50KCBiYWNrZ3JvdW5kU2l6ZVswXSwgMTAgKTtcblx0XHRcdFx0YmFja2dyb3VuZEhlaWdodCA9IHBhcnNlSW50KCBiYWNrZ3JvdW5kU2l6ZVsxXSwgMTAgKTtcblx0XHRcdH1cblxuXHRcdFx0dmFyIHNsaWRlV2lkdGggPSBkb20uYmFja2dyb3VuZC5vZmZzZXRXaWR0aCxcblx0XHRcdFx0aG9yaXpvbnRhbFNsaWRlQ291bnQgPSBob3Jpem9udGFsU2xpZGVzLmxlbmd0aCxcblx0XHRcdFx0aG9yaXpvbnRhbE9mZnNldE11bHRpcGxpZXIsXG5cdFx0XHRcdGhvcml6b250YWxPZmZzZXQ7XG5cblx0XHRcdGlmKCB0eXBlb2YgY29uZmlnLnBhcmFsbGF4QmFja2dyb3VuZEhvcml6b250YWwgPT09ICdudW1iZXInICkge1xuXHRcdFx0XHRob3Jpem9udGFsT2Zmc2V0TXVsdGlwbGllciA9IGNvbmZpZy5wYXJhbGxheEJhY2tncm91bmRIb3Jpem9udGFsO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGhvcml6b250YWxPZmZzZXRNdWx0aXBsaWVyID0gaG9yaXpvbnRhbFNsaWRlQ291bnQgPiAxID8gKCBiYWNrZ3JvdW5kV2lkdGggLSBzbGlkZVdpZHRoICkgLyAoIGhvcml6b250YWxTbGlkZUNvdW50LTEgKSA6IDA7XG5cdFx0XHR9XG5cblx0XHRcdGhvcml6b250YWxPZmZzZXQgPSBob3Jpem9udGFsT2Zmc2V0TXVsdGlwbGllciAqIGluZGV4aCAqIC0xO1xuXG5cdFx0XHR2YXIgc2xpZGVIZWlnaHQgPSBkb20uYmFja2dyb3VuZC5vZmZzZXRIZWlnaHQsXG5cdFx0XHRcdHZlcnRpY2FsU2xpZGVDb3VudCA9IHZlcnRpY2FsU2xpZGVzLmxlbmd0aCxcblx0XHRcdFx0dmVydGljYWxPZmZzZXRNdWx0aXBsaWVyLFxuXHRcdFx0XHR2ZXJ0aWNhbE9mZnNldDtcblxuXHRcdFx0aWYoIHR5cGVvZiBjb25maWcucGFyYWxsYXhCYWNrZ3JvdW5kVmVydGljYWwgPT09ICdudW1iZXInICkge1xuXHRcdFx0XHR2ZXJ0aWNhbE9mZnNldE11bHRpcGxpZXIgPSBjb25maWcucGFyYWxsYXhCYWNrZ3JvdW5kVmVydGljYWw7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dmVydGljYWxPZmZzZXRNdWx0aXBsaWVyID0gKCBiYWNrZ3JvdW5kSGVpZ2h0IC0gc2xpZGVIZWlnaHQgKSAvICggdmVydGljYWxTbGlkZUNvdW50LTEgKTtcblx0XHRcdH1cblxuXHRcdFx0dmVydGljYWxPZmZzZXQgPSB2ZXJ0aWNhbFNsaWRlQ291bnQgPiAwID8gIHZlcnRpY2FsT2Zmc2V0TXVsdGlwbGllciAqIGluZGV4diAqIDEgOiAwO1xuXG5cdFx0XHRkb20uYmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBob3Jpem9udGFsT2Zmc2V0ICsgJ3B4ICcgKyAtdmVydGljYWxPZmZzZXQgKyAncHgnO1xuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2FsbGVkIHdoZW4gdGhlIGdpdmVuIHNsaWRlIGlzIHdpdGhpbiB0aGUgY29uZmlndXJlZCB2aWV3XG5cdCAqIGRpc3RhbmNlLiBTaG93cyB0aGUgc2xpZGUgZWxlbWVudCBhbmQgbG9hZHMgYW55IGNvbnRlbnRcblx0ICogdGhhdCBpcyBzZXQgdG8gbG9hZCBsYXppbHkgKGRhdGEtc3JjKS5cblx0ICovXG5cdGZ1bmN0aW9uIHNob3dTbGlkZSggc2xpZGUgKSB7XG5cblx0XHQvLyBTaG93IHRoZSBzbGlkZSBlbGVtZW50XG5cdFx0c2xpZGUuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cblx0XHQvLyBNZWRpYSBlbGVtZW50cyB3aXRoIGRhdGEtc3JjIGF0dHJpYnV0ZXNcblx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnaW1nW2RhdGEtc3JjXSwgdmlkZW9bZGF0YS1zcmNdLCBhdWRpb1tkYXRhLXNyY10nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnc3JjJywgZWxlbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLXNyYycgKSApO1xuXHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkYXRhLXNyYycgKTtcblx0XHR9ICk7XG5cblx0XHQvLyBNZWRpYSBlbGVtZW50cyB3aXRoIDxzb3VyY2U+IGNoaWxkcmVuXG5cdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3ZpZGVvLCBhdWRpbycgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBtZWRpYSApIHtcblx0XHRcdHZhciBzb3VyY2VzID0gMDtcblxuXHRcdFx0dG9BcnJheSggbWVkaWEucXVlcnlTZWxlY3RvckFsbCggJ3NvdXJjZVtkYXRhLXNyY10nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggc291cmNlICkge1xuXHRcdFx0XHRzb3VyY2Uuc2V0QXR0cmlidXRlKCAnc3JjJywgc291cmNlLmdldEF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApICk7XG5cdFx0XHRcdHNvdXJjZS5yZW1vdmVBdHRyaWJ1dGUoICdkYXRhLXNyYycgKTtcblx0XHRcdFx0c291cmNlcyArPSAxO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBJZiB3ZSByZXdyb3RlIHNvdXJjZXMgZm9yIHRoaXMgdmlkZW8vYXVkaW8gZWxlbWVudCwgd2UgbmVlZFxuXHRcdFx0Ly8gdG8gbWFudWFsbHkgdGVsbCBpdCB0byBsb2FkIGZyb20gaXRzIG5ldyBvcmlnaW5cblx0XHRcdGlmKCBzb3VyY2VzID4gMCApIHtcblx0XHRcdFx0bWVkaWEubG9hZCgpO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXG5cdFx0Ly8gU2hvdyB0aGUgY29ycmVzcG9uZGluZyBiYWNrZ3JvdW5kIGVsZW1lbnRcblx0XHR2YXIgaW5kaWNlcyA9IGdldEluZGljZXMoIHNsaWRlICk7XG5cdFx0dmFyIGJhY2tncm91bmQgPSBnZXRTbGlkZUJhY2tncm91bmQoIGluZGljZXMuaCwgaW5kaWNlcy52ICk7XG5cdFx0aWYoIGJhY2tncm91bmQgKSB7XG5cdFx0XHRiYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG5cdFx0XHQvLyBJZiB0aGUgYmFja2dyb3VuZCBjb250YWlucyBtZWRpYSwgbG9hZCBpdFxuXHRcdFx0aWYoIGJhY2tncm91bmQuaGFzQXR0cmlidXRlKCAnZGF0YS1sb2FkZWQnICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHRiYWNrZ3JvdW5kLnNldEF0dHJpYnV0ZSggJ2RhdGEtbG9hZGVkJywgJ3RydWUnICk7XG5cblx0XHRcdFx0dmFyIGJhY2tncm91bmRJbWFnZSA9IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1pbWFnZScgKSxcblx0XHRcdFx0XHRiYWNrZ3JvdW5kVmlkZW8gPSBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtdmlkZW8nICksXG5cdFx0XHRcdFx0YmFja2dyb3VuZFZpZGVvTG9vcCA9IHNsaWRlLmhhc0F0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC12aWRlby1sb29wJyApLFxuXHRcdFx0XHRcdGJhY2tncm91bmRWaWRlb011dGVkID0gc2xpZGUuaGFzQXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLXZpZGVvLW11dGVkJyApLFxuXHRcdFx0XHRcdGJhY2tncm91bmRJZnJhbWUgPSBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtaWZyYW1lJyApO1xuXG5cdFx0XHRcdC8vIEltYWdlc1xuXHRcdFx0XHRpZiggYmFja2dyb3VuZEltYWdlICkge1xuXHRcdFx0XHRcdGJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJ3VybCgnKyBiYWNrZ3JvdW5kSW1hZ2UgKycpJztcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBWaWRlb3Ncblx0XHRcdFx0ZWxzZSBpZiAoIGJhY2tncm91bmRWaWRlbyAmJiAhaXNTcGVha2VyTm90ZXMoKSApIHtcblx0XHRcdFx0XHR2YXIgdmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAndmlkZW8nICk7XG5cblx0XHRcdFx0XHRpZiggYmFja2dyb3VuZFZpZGVvTG9vcCApIHtcblx0XHRcdFx0XHRcdHZpZGVvLnNldEF0dHJpYnV0ZSggJ2xvb3AnLCAnJyApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmKCBiYWNrZ3JvdW5kVmlkZW9NdXRlZCApIHtcblx0XHRcdFx0XHRcdHZpZGVvLm11dGVkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBTdXBwb3J0IGNvbW1hIHNlcGFyYXRlZCBsaXN0cyBvZiB2aWRlbyBzb3VyY2VzXG5cdFx0XHRcdFx0YmFja2dyb3VuZFZpZGVvLnNwbGl0KCAnLCcgKS5mb3JFYWNoKCBmdW5jdGlvbiggc291cmNlICkge1xuXHRcdFx0XHRcdFx0dmlkZW8uaW5uZXJIVE1MICs9ICc8c291cmNlIHNyYz1cIicrIHNvdXJjZSArJ1wiPic7XG5cdFx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdFx0YmFja2dyb3VuZC5hcHBlbmRDaGlsZCggdmlkZW8gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBJZnJhbWVzXG5cdFx0XHRcdGVsc2UgaWYoIGJhY2tncm91bmRJZnJhbWUgKSB7XG5cdFx0XHRcdFx0dmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdpZnJhbWUnICk7XG5cdFx0XHRcdFx0XHRpZnJhbWUuc2V0QXR0cmlidXRlKCAnc3JjJywgYmFja2dyb3VuZElmcmFtZSApO1xuXHRcdFx0XHRcdFx0aWZyYW1lLnN0eWxlLndpZHRoICA9ICcxMDAlJztcblx0XHRcdFx0XHRcdGlmcmFtZS5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG5cdFx0XHRcdFx0XHRpZnJhbWUuc3R5bGUubWF4SGVpZ2h0ID0gJzEwMCUnO1xuXHRcdFx0XHRcdFx0aWZyYW1lLnN0eWxlLm1heFdpZHRoID0gJzEwMCUnO1xuXG5cdFx0XHRcdFx0YmFja2dyb3VuZC5hcHBlbmRDaGlsZCggaWZyYW1lICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgd2hlbiB0aGUgZ2l2ZW4gc2xpZGUgaXMgbW92ZWQgb3V0c2lkZSBvZiB0aGVcblx0ICogY29uZmlndXJlZCB2aWV3IGRpc3RhbmNlLlxuXHQgKi9cblx0ZnVuY3Rpb24gaGlkZVNsaWRlKCBzbGlkZSApIHtcblxuXHRcdC8vIEhpZGUgdGhlIHNsaWRlIGVsZW1lbnRcblx0XHRzbGlkZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG5cdFx0Ly8gSGlkZSB0aGUgY29ycmVzcG9uZGluZyBiYWNrZ3JvdW5kIGVsZW1lbnRcblx0XHR2YXIgaW5kaWNlcyA9IGdldEluZGljZXMoIHNsaWRlICk7XG5cdFx0dmFyIGJhY2tncm91bmQgPSBnZXRTbGlkZUJhY2tncm91bmQoIGluZGljZXMuaCwgaW5kaWNlcy52ICk7XG5cdFx0aWYoIGJhY2tncm91bmQgKSB7XG5cdFx0XHRiYWNrZ3JvdW5kLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogRGV0ZXJtaW5lIHdoYXQgYXZhaWxhYmxlIHJvdXRlcyB0aGVyZSBhcmUgZm9yIG5hdmlnYXRpb24uXG5cdCAqXG5cdCAqIEByZXR1cm4ge09iamVjdH0gY29udGFpbmluZyBmb3VyIGJvb2xlYW5zOiBsZWZ0L3JpZ2h0L3VwL2Rvd25cblx0ICovXG5cdGZ1bmN0aW9uIGF2YWlsYWJsZVJvdXRlcygpIHtcblxuXHRcdHZhciBob3Jpem9udGFsU2xpZGVzID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSxcblx0XHRcdHZlcnRpY2FsU2xpZGVzID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggVkVSVElDQUxfU0xJREVTX1NFTEVDVE9SICk7XG5cblx0XHR2YXIgcm91dGVzID0ge1xuXHRcdFx0bGVmdDogaW5kZXhoID4gMCB8fCBjb25maWcubG9vcCxcblx0XHRcdHJpZ2h0OiBpbmRleGggPCBob3Jpem9udGFsU2xpZGVzLmxlbmd0aCAtIDEgfHwgY29uZmlnLmxvb3AsXG5cdFx0XHR1cDogaW5kZXh2ID4gMCxcblx0XHRcdGRvd246IGluZGV4diA8IHZlcnRpY2FsU2xpZGVzLmxlbmd0aCAtIDFcblx0XHR9O1xuXG5cdFx0Ly8gcmV2ZXJzZSBob3Jpem9udGFsIGNvbnRyb2xzIGZvciBydGxcblx0XHRpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdHZhciBsZWZ0ID0gcm91dGVzLmxlZnQ7XG5cdFx0XHRyb3V0ZXMubGVmdCA9IHJvdXRlcy5yaWdodDtcblx0XHRcdHJvdXRlcy5yaWdodCA9IGxlZnQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJvdXRlcztcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYW4gb2JqZWN0IGRlc2NyaWJpbmcgdGhlIGF2YWlsYWJsZSBmcmFnbWVudFxuXHQgKiBkaXJlY3Rpb25zLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IHR3byBib29sZWFuIHByb3BlcnRpZXM6IHByZXYvbmV4dFxuXHQgKi9cblx0ZnVuY3Rpb24gYXZhaWxhYmxlRnJhZ21lbnRzKCkge1xuXG5cdFx0aWYoIGN1cnJlbnRTbGlkZSAmJiBjb25maWcuZnJhZ21lbnRzICkge1xuXHRcdFx0dmFyIGZyYWdtZW50cyA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApO1xuXHRcdFx0dmFyIGhpZGRlbkZyYWdtZW50cyA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50Om5vdCgudmlzaWJsZSknICk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHByZXY6IGZyYWdtZW50cy5sZW5ndGggLSBoaWRkZW5GcmFnbWVudHMubGVuZ3RoID4gMCxcblx0XHRcdFx0bmV4dDogISFoaWRkZW5GcmFnbWVudHMubGVuZ3RoXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiB7IHByZXY6IGZhbHNlLCBuZXh0OiBmYWxzZSB9O1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEVuZm9yY2VzIG9yaWdpbi1zcGVjaWZpYyBmb3JtYXQgcnVsZXMgZm9yIGVtYmVkZGVkIG1lZGlhLlxuXHQgKi9cblx0ZnVuY3Rpb24gZm9ybWF0RW1iZWRkZWRDb250ZW50KCkge1xuXG5cdFx0dmFyIF9hcHBlbmRQYXJhbVRvSWZyYW1lU291cmNlID0gZnVuY3Rpb24oIHNvdXJjZUF0dHJpYnV0ZSwgc291cmNlVVJMLCBwYXJhbSApIHtcblx0XHRcdHRvQXJyYXkoIGRvbS5zbGlkZXMucXVlcnlTZWxlY3RvckFsbCggJ2lmcmFtZVsnKyBzb3VyY2VBdHRyaWJ1dGUgKycqPVwiJysgc291cmNlVVJMICsnXCJdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHR2YXIgc3JjID0gZWwuZ2V0QXR0cmlidXRlKCBzb3VyY2VBdHRyaWJ1dGUgKTtcblx0XHRcdFx0aWYoIHNyYyAmJiBzcmMuaW5kZXhPZiggcGFyYW0gKSA9PT0gLTEgKSB7XG5cdFx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCBzb3VyY2VBdHRyaWJ1dGUsIHNyYyArICggIS9cXD8vLnRlc3QoIHNyYyApID8gJz8nIDogJyYnICkgKyBwYXJhbSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0Ly8gWW91VHViZSBmcmFtZXMgbXVzdCBpbmNsdWRlIFwiP2VuYWJsZWpzYXBpPTFcIlxuXHRcdF9hcHBlbmRQYXJhbVRvSWZyYW1lU291cmNlKCAnc3JjJywgJ3lvdXR1YmUuY29tL2VtYmVkLycsICdlbmFibGVqc2FwaT0xJyApO1xuXHRcdF9hcHBlbmRQYXJhbVRvSWZyYW1lU291cmNlKCAnZGF0YS1zcmMnLCAneW91dHViZS5jb20vZW1iZWQvJywgJ2VuYWJsZWpzYXBpPTEnICk7XG5cblx0XHQvLyBWaW1lbyBmcmFtZXMgbXVzdCBpbmNsdWRlIFwiP2FwaT0xXCJcblx0XHRfYXBwZW5kUGFyYW1Ub0lmcmFtZVNvdXJjZSggJ3NyYycsICdwbGF5ZXIudmltZW8uY29tLycsICdhcGk9MScgKTtcblx0XHRfYXBwZW5kUGFyYW1Ub0lmcmFtZVNvdXJjZSggJ2RhdGEtc3JjJywgJ3BsYXllci52aW1lby5jb20vJywgJ2FwaT0xJyApO1xuXG5cdH1cblxuXHQvKipcblx0ICogU3RhcnQgcGxheWJhY2sgb2YgYW55IGVtYmVkZGVkIGNvbnRlbnQgaW5zaWRlIG9mXG5cdCAqIHRoZSB0YXJnZXRlZCBzbGlkZS5cblx0ICovXG5cdGZ1bmN0aW9uIHN0YXJ0RW1iZWRkZWRDb250ZW50KCBzbGlkZSApIHtcblxuXHRcdGlmKCBzbGlkZSAmJiAhaXNTcGVha2VyTm90ZXMoKSApIHtcblx0XHRcdC8vIFJlc3RhcnQgR0lGc1xuXHRcdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ2ltZ1tzcmMkPVwiLmdpZlwiXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0Ly8gU2V0dGluZyB0aGUgc2FtZSB1bmNoYW5nZWQgc291cmNlIGxpa2UgdGhpcyB3YXMgY29uZmlybWVkXG5cdFx0XHRcdC8vIHRvIHdvcmsgaW4gQ2hyb21lLCBGRiAmIFNhZmFyaVxuXHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoICdzcmMnLCBlbC5nZXRBdHRyaWJ1dGUoICdzcmMnICkgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gSFRNTDUgbWVkaWEgZWxlbWVudHNcblx0XHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICd2aWRlbywgYXVkaW8nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdGlmKCBlbC5oYXNBdHRyaWJ1dGUoICdkYXRhLWF1dG9wbGF5JyApICYmIHR5cGVvZiBlbC5wbGF5ID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdGVsLnBsYXkoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBOb3JtYWwgaWZyYW1lc1xuXHRcdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ2lmcmFtZVtzcmNdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRzdGFydEVtYmVkZGVkSWZyYW1lKCB7IHRhcmdldDogZWwgfSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBMYXp5IGxvYWRpbmcgaWZyYW1lc1xuXHRcdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ2lmcmFtZVtkYXRhLXNyY10nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdGlmKCBlbC5nZXRBdHRyaWJ1dGUoICdzcmMnICkgIT09IGVsLmdldEF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApICkge1xuXHRcdFx0XHRcdGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdsb2FkJywgc3RhcnRFbWJlZGRlZElmcmFtZSApOyAvLyByZW1vdmUgZmlyc3QgdG8gYXZvaWQgZHVwZXNcblx0XHRcdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCAnbG9hZCcsIHN0YXJ0RW1iZWRkZWRJZnJhbWUgKTtcblx0XHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoICdzcmMnLCBlbC5nZXRBdHRyaWJ1dGUoICdkYXRhLXNyYycgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogXCJTdGFydHNcIiB0aGUgY29udGVudCBvZiBhbiBlbWJlZGRlZCBpZnJhbWUgdXNpbmcgdGhlXG5cdCAqIHBvc3RtZXNzYWdlIEFQSS5cblx0ICovXG5cdGZ1bmN0aW9uIHN0YXJ0RW1iZWRkZWRJZnJhbWUoIGV2ZW50ICkge1xuXG5cdFx0dmFyIGlmcmFtZSA9IGV2ZW50LnRhcmdldDtcblxuXHRcdC8vIFlvdVR1YmUgcG9zdE1lc3NhZ2UgQVBJXG5cdFx0aWYoIC95b3V0dWJlXFwuY29tXFwvZW1iZWRcXC8vLnRlc3QoIGlmcmFtZS5nZXRBdHRyaWJ1dGUoICdzcmMnICkgKSAmJiBpZnJhbWUuaGFzQXR0cmlidXRlKCAnZGF0YS1hdXRvcGxheScgKSApIHtcblx0XHRcdGlmcmFtZS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCAne1wiZXZlbnRcIjpcImNvbW1hbmRcIixcImZ1bmNcIjpcInBsYXlWaWRlb1wiLFwiYXJnc1wiOlwiXCJ9JywgJyonICk7XG5cdFx0fVxuXHRcdC8vIFZpbWVvIHBvc3RNZXNzYWdlIEFQSVxuXHRcdGVsc2UgaWYoIC9wbGF5ZXJcXC52aW1lb1xcLmNvbVxcLy8udGVzdCggaWZyYW1lLmdldEF0dHJpYnV0ZSggJ3NyYycgKSApICYmIGlmcmFtZS5oYXNBdHRyaWJ1dGUoICdkYXRhLWF1dG9wbGF5JyApICkge1xuXHRcdFx0aWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoICd7XCJtZXRob2RcIjpcInBsYXlcIn0nLCAnKicgKTtcblx0XHR9XG5cdFx0Ly8gR2VuZXJpYyBwb3N0TWVzc2FnZSBBUElcblx0XHRlbHNlIHtcblx0XHRcdGlmcmFtZS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCAnc2xpZGU6c3RhcnQnLCAnKicgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBTdG9wIHBsYXliYWNrIG9mIGFueSBlbWJlZGRlZCBjb250ZW50IGluc2lkZSBvZlxuXHQgKiB0aGUgdGFyZ2V0ZWQgc2xpZGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBzdG9wRW1iZWRkZWRDb250ZW50KCBzbGlkZSApIHtcblxuXHRcdGlmKCBzbGlkZSAmJiBzbGlkZS5wYXJlbnROb2RlICkge1xuXHRcdFx0Ly8gSFRNTDUgbWVkaWEgZWxlbWVudHNcblx0XHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICd2aWRlbywgYXVkaW8nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdGlmKCAhZWwuaGFzQXR0cmlidXRlKCAnZGF0YS1pZ25vcmUnICkgJiYgdHlwZW9mIGVsLnBhdXNlID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdGVsLnBhdXNlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gR2VuZXJpYyBwb3N0TWVzc2FnZSBBUEkgZm9yIG5vbi1sYXp5IGxvYWRlZCBpZnJhbWVzXG5cdFx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnaWZyYW1lJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRlbC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCAnc2xpZGU6c3RvcCcsICcqJyApO1xuXHRcdFx0XHRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbG9hZCcsIHN0YXJ0RW1iZWRkZWRJZnJhbWUgKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBZb3VUdWJlIHBvc3RNZXNzYWdlIEFQSVxuXHRcdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ2lmcmFtZVtzcmMqPVwieW91dHViZS5jb20vZW1iZWQvXCJdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRpZiggIWVsLmhhc0F0dHJpYnV0ZSggJ2RhdGEtaWdub3JlJyApICYmIHR5cGVvZiBlbC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdGVsLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoICd7XCJldmVudFwiOlwiY29tbWFuZFwiLFwiZnVuY1wiOlwicGF1c2VWaWRlb1wiLFwiYXJnc1wiOlwiXCJ9JywgJyonICk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBWaW1lbyBwb3N0TWVzc2FnZSBBUElcblx0XHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdpZnJhbWVbc3JjKj1cInBsYXllci52aW1lby5jb20vXCJdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRpZiggIWVsLmhhc0F0dHJpYnV0ZSggJ2RhdGEtaWdub3JlJyApICYmIHR5cGVvZiBlbC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdGVsLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoICd7XCJtZXRob2RcIjpcInBhdXNlXCJ9JywgJyonICk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBMYXp5IGxvYWRpbmcgaWZyYW1lc1xuXHRcdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ2lmcmFtZVtkYXRhLXNyY10nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdC8vIE9ubHkgcmVtb3ZpbmcgdGhlIHNyYyBkb2Vzbid0IGFjdHVhbGx5IHVubG9hZCB0aGUgZnJhbWVcblx0XHRcdFx0Ly8gaW4gYWxsIGJyb3dzZXJzIChGaXJlZm94KSBzbyB3ZSBzZXQgaXQgdG8gYmxhbmsgZmlyc3Rcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCAnc3JjJywgJ2Fib3V0OmJsYW5rJyApO1xuXHRcdFx0XHRlbC5yZW1vdmVBdHRyaWJ1dGUoICdzcmMnICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHBhc3Qgc2xpZGVzLiBUaGlzIGNhbiBiZSB1c2VkIGFzIGEgZ2xvYmFsXG5cdCAqIGZsYXR0ZW5lZCBpbmRleCBmb3Igc2xpZGVzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0U2xpZGVQYXN0Q291bnQoKSB7XG5cblx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlcyA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICkgKTtcblxuXHRcdC8vIFRoZSBudW1iZXIgb2YgcGFzdCBzbGlkZXNcblx0XHR2YXIgcGFzdENvdW50ID0gMDtcblxuXHRcdC8vIFN0ZXAgdGhyb3VnaCBhbGwgc2xpZGVzIGFuZCBjb3VudCB0aGUgcGFzdCBvbmVzXG5cdFx0bWFpbkxvb3A6IGZvciggdmFyIGkgPSAwOyBpIDwgaG9yaXpvbnRhbFNsaWRlcy5sZW5ndGg7IGkrKyApIHtcblxuXHRcdFx0dmFyIGhvcml6b250YWxTbGlkZSA9IGhvcml6b250YWxTbGlkZXNbaV07XG5cdFx0XHR2YXIgdmVydGljYWxTbGlkZXMgPSB0b0FycmF5KCBob3Jpem9udGFsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKTtcblxuXHRcdFx0Zm9yKCB2YXIgaiA9IDA7IGogPCB2ZXJ0aWNhbFNsaWRlcy5sZW5ndGg7IGorKyApIHtcblxuXHRcdFx0XHQvLyBTdG9wIGFzIHNvb24gYXMgd2UgYXJyaXZlIGF0IHRoZSBwcmVzZW50XG5cdFx0XHRcdGlmKCB2ZXJ0aWNhbFNsaWRlc1tqXS5jbGFzc0xpc3QuY29udGFpbnMoICdwcmVzZW50JyApICkge1xuXHRcdFx0XHRcdGJyZWFrIG1haW5Mb29wO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cGFzdENvdW50Kys7XG5cblx0XHRcdH1cblxuXHRcdFx0Ly8gU3RvcCBhcyBzb29uIGFzIHdlIGFycml2ZSBhdCB0aGUgcHJlc2VudFxuXHRcdFx0aWYoIGhvcml6b250YWxTbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoICdwcmVzZW50JyApICkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblxuXHRcdFx0Ly8gRG9uJ3QgY291bnQgdGhlIHdyYXBwaW5nIHNlY3Rpb24gZm9yIHZlcnRpY2FsIHNsaWRlc1xuXHRcdFx0aWYoIGhvcml6b250YWxTbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoICdzdGFjaycgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdHBhc3RDb3VudCsrO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhc3RDb3VudDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgYSB2YWx1ZSByYW5naW5nIGZyb20gMC0xIHRoYXQgcmVwcmVzZW50c1xuXHQgKiBob3cgZmFyIGludG8gdGhlIHByZXNlbnRhdGlvbiB3ZSBoYXZlIG5hdmlnYXRlZC5cblx0ICovXG5cdGZ1bmN0aW9uIGdldFByb2dyZXNzKCkge1xuXG5cdFx0Ly8gVGhlIG51bWJlciBvZiBwYXN0IGFuZCB0b3RhbCBzbGlkZXNcblx0XHR2YXIgdG90YWxDb3VudCA9IGdldFRvdGFsU2xpZGVzKCk7XG5cdFx0dmFyIHBhc3RDb3VudCA9IGdldFNsaWRlUGFzdENvdW50KCk7XG5cblx0XHRpZiggY3VycmVudFNsaWRlICkge1xuXG5cdFx0XHR2YXIgYWxsRnJhZ21lbnRzID0gY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQnICk7XG5cblx0XHRcdC8vIElmIHRoZXJlIGFyZSBmcmFnbWVudHMgaW4gdGhlIGN1cnJlbnQgc2xpZGUgdGhvc2Ugc2hvdWxkIGJlXG5cdFx0XHQvLyBhY2NvdW50ZWQgZm9yIGluIHRoZSBwcm9ncmVzcy5cblx0XHRcdGlmKCBhbGxGcmFnbWVudHMubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0dmFyIHZpc2libGVGcmFnbWVudHMgPSBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudC52aXNpYmxlJyApO1xuXG5cdFx0XHRcdC8vIFRoaXMgdmFsdWUgcmVwcmVzZW50cyBob3cgYmlnIGEgcG9ydGlvbiBvZiB0aGUgc2xpZGUgcHJvZ3Jlc3Ncblx0XHRcdFx0Ly8gdGhhdCBpcyBtYWRlIHVwIGJ5IGl0cyBmcmFnbWVudHMgKDAtMSlcblx0XHRcdFx0dmFyIGZyYWdtZW50V2VpZ2h0ID0gMC45O1xuXG5cdFx0XHRcdC8vIEFkZCBmcmFnbWVudCBwcm9ncmVzcyB0byB0aGUgcGFzdCBzbGlkZSBjb3VudFxuXHRcdFx0XHRwYXN0Q291bnQgKz0gKCB2aXNpYmxlRnJhZ21lbnRzLmxlbmd0aCAvIGFsbEZyYWdtZW50cy5sZW5ndGggKSAqIGZyYWdtZW50V2VpZ2h0O1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhc3RDb3VudCAvICggdG90YWxDb3VudCAtIDEgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGlzIHByZXNlbnRhdGlvbiBpcyBydW5uaW5nIGluc2lkZSBvZiB0aGVcblx0ICogc3BlYWtlciBub3RlcyB3aW5kb3cuXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1NwZWFrZXJOb3RlcygpIHtcblxuXHRcdHJldHVybiAhIXdpbmRvdy5sb2NhdGlvbi5zZWFyY2gubWF0Y2goIC9yZWNlaXZlci9naSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmVhZHMgdGhlIGN1cnJlbnQgVVJMIChoYXNoKSBhbmQgbmF2aWdhdGVzIGFjY29yZGluZ2x5LlxuXHQgKi9cblx0ZnVuY3Rpb24gcmVhZFVSTCgpIHtcblxuXHRcdHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XG5cblx0XHQvLyBBdHRlbXB0IHRvIHBhcnNlIHRoZSBoYXNoIGFzIGVpdGhlciBhbiBpbmRleCBvciBuYW1lXG5cdFx0dmFyIGJpdHMgPSBoYXNoLnNsaWNlKCAyICkuc3BsaXQoICcvJyApLFxuXHRcdFx0bmFtZSA9IGhhc2gucmVwbGFjZSggLyN8XFwvL2dpLCAnJyApO1xuXG5cdFx0Ly8gSWYgdGhlIGZpcnN0IGJpdCBpcyBpbnZhbGlkIGFuZCB0aGVyZSBpcyBhIG5hbWUgd2UgY2FuXG5cdFx0Ly8gYXNzdW1lIHRoYXQgdGhpcyBpcyBhIG5hbWVkIGxpbmtcblx0XHRpZiggaXNOYU4oIHBhcnNlSW50KCBiaXRzWzBdLCAxMCApICkgJiYgbmFtZS5sZW5ndGggKSB7XG5cdFx0XHR2YXIgZWxlbWVudDtcblxuXHRcdFx0Ly8gRW5zdXJlIHRoZSBuYW1lZCBsaW5rIGlzIGEgdmFsaWQgSFRNTCBJRCBhdHRyaWJ1dGVcblx0XHRcdGlmKCAvXlthLXpBLVpdW1xcdzouLV0qJC8udGVzdCggbmFtZSApICkge1xuXHRcdFx0XHQvLyBGaW5kIHRoZSBzbGlkZSB3aXRoIHRoZSBzcGVjaWZpZWQgSURcblx0XHRcdFx0ZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBuYW1lICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCBlbGVtZW50ICkge1xuXHRcdFx0XHQvLyBGaW5kIHRoZSBwb3NpdGlvbiBvZiB0aGUgbmFtZWQgc2xpZGUgYW5kIG5hdmlnYXRlIHRvIGl0XG5cdFx0XHRcdHZhciBpbmRpY2VzID0gUmV2ZWFsLmdldEluZGljZXMoIGVsZW1lbnQgKTtcblx0XHRcdFx0c2xpZGUoIGluZGljZXMuaCwgaW5kaWNlcy52ICk7XG5cdFx0XHR9XG5cdFx0XHQvLyBJZiB0aGUgc2xpZGUgZG9lc24ndCBleGlzdCwgbmF2aWdhdGUgdG8gdGhlIGN1cnJlbnQgc2xpZGVcblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzbGlkZSggaW5kZXhoIHx8IDAsIGluZGV4diB8fCAwICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gUmVhZCB0aGUgaW5kZXggY29tcG9uZW50cyBvZiB0aGUgaGFzaFxuXHRcdFx0dmFyIGggPSBwYXJzZUludCggYml0c1swXSwgMTAgKSB8fCAwLFxuXHRcdFx0XHR2ID0gcGFyc2VJbnQoIGJpdHNbMV0sIDEwICkgfHwgMDtcblxuXHRcdFx0aWYoIGggIT09IGluZGV4aCB8fCB2ICE9PSBpbmRleHYgKSB7XG5cdFx0XHRcdHNsaWRlKCBoLCB2ICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgcGFnZSBVUkwgKGhhc2gpIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnRcblx0ICogc3RhdGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBkZWxheSBUaGUgdGltZSBpbiBtcyB0byB3YWl0IGJlZm9yZVxuXHQgKiB3cml0aW5nIHRoZSBoYXNoXG5cdCAqL1xuXHRmdW5jdGlvbiB3cml0ZVVSTCggZGVsYXkgKSB7XG5cblx0XHRpZiggY29uZmlnLmhpc3RvcnkgKSB7XG5cblx0XHRcdC8vIE1ha2Ugc3VyZSB0aGVyZSdzIG5ldmVyIG1vcmUgdGhhbiBvbmUgdGltZW91dCBydW5uaW5nXG5cdFx0XHRjbGVhclRpbWVvdXQoIHdyaXRlVVJMVGltZW91dCApO1xuXG5cdFx0XHQvLyBJZiBhIGRlbGF5IGlzIHNwZWNpZmllZCwgdGltZW91dCB0aGlzIGNhbGxcblx0XHRcdGlmKCB0eXBlb2YgZGVsYXkgPT09ICdudW1iZXInICkge1xuXHRcdFx0XHR3cml0ZVVSTFRpbWVvdXQgPSBzZXRUaW1lb3V0KCB3cml0ZVVSTCwgZGVsYXkgKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoIGN1cnJlbnRTbGlkZSApIHtcblx0XHRcdFx0dmFyIHVybCA9ICcvJztcblxuXHRcdFx0XHQvLyBBdHRlbXB0IHRvIGNyZWF0ZSBhIG5hbWVkIGxpbmsgYmFzZWQgb24gdGhlIHNsaWRlJ3MgSURcblx0XHRcdFx0dmFyIGlkID0gY3VycmVudFNsaWRlLmdldEF0dHJpYnV0ZSggJ2lkJyApO1xuXHRcdFx0XHRpZiggaWQgKSB7XG5cdFx0XHRcdFx0aWQgPSBpZC5yZXBsYWNlKCAvW15hLXpBLVowLTlcXC1cXF9cXDpcXC5dL2csICcnICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJZiB0aGUgY3VycmVudCBzbGlkZSBoYXMgYW4gSUQsIHVzZSB0aGF0IGFzIGEgbmFtZWQgbGlua1xuXHRcdFx0XHRpZiggdHlwZW9mIGlkID09PSAnc3RyaW5nJyAmJiBpZC5sZW5ndGggKSB7XG5cdFx0XHRcdFx0dXJsID0gJy8nICsgaWQ7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gT3RoZXJ3aXNlIHVzZSB0aGUgL2gvdiBpbmRleFxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRpZiggaW5kZXhoID4gMCB8fCBpbmRleHYgPiAwICkgdXJsICs9IGluZGV4aDtcblx0XHRcdFx0XHRpZiggaW5kZXh2ID4gMCApIHVybCArPSAnLycgKyBpbmRleHY7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IHVybDtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGgvdiBsb2NhdGlvbiBvZiB0aGUgY3VycmVudCwgb3Igc3BlY2lmaWVkLFxuXHQgKiBzbGlkZS5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc2xpZGUgSWYgc3BlY2lmaWVkLCB0aGUgcmV0dXJuZWRcblx0ICogaW5kZXggd2lsbCBiZSBmb3IgdGhpcyBzbGlkZSByYXRoZXIgdGhhbiB0aGUgY3VycmVudGx5XG5cdCAqIGFjdGl2ZSBvbmVcblx0ICpcblx0ICogQHJldHVybiB7T2JqZWN0fSB7IGg6IDxpbnQ+LCB2OiA8aW50PiwgZjogPGludD4gfVxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0SW5kaWNlcyggc2xpZGUgKSB7XG5cblx0XHQvLyBCeSBkZWZhdWx0LCByZXR1cm4gdGhlIGN1cnJlbnQgaW5kaWNlc1xuXHRcdHZhciBoID0gaW5kZXhoLFxuXHRcdFx0diA9IGluZGV4dixcblx0XHRcdGY7XG5cblx0XHQvLyBJZiBhIHNsaWRlIGlzIHNwZWNpZmllZCwgcmV0dXJuIHRoZSBpbmRpY2VzIG9mIHRoYXQgc2xpZGVcblx0XHRpZiggc2xpZGUgKSB7XG5cdFx0XHR2YXIgaXNWZXJ0aWNhbCA9IGlzVmVydGljYWxTbGlkZSggc2xpZGUgKTtcblx0XHRcdHZhciBzbGlkZWggPSBpc1ZlcnRpY2FsID8gc2xpZGUucGFyZW50Tm9kZSA6IHNsaWRlO1xuXG5cdFx0XHQvLyBTZWxlY3QgYWxsIGhvcml6b250YWwgc2xpZGVzXG5cdFx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlcyA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICkgKTtcblxuXHRcdFx0Ly8gTm93IHRoYXQgd2Uga25vdyB3aGljaCB0aGUgaG9yaXpvbnRhbCBzbGlkZSBpcywgZ2V0IGl0cyBpbmRleFxuXHRcdFx0aCA9IE1hdGgubWF4KCBob3Jpem9udGFsU2xpZGVzLmluZGV4T2YoIHNsaWRlaCApLCAwICk7XG5cblx0XHRcdC8vIEFzc3VtZSB3ZSdyZSBub3QgdmVydGljYWxcblx0XHRcdHYgPSB1bmRlZmluZWQ7XG5cblx0XHRcdC8vIElmIHRoaXMgaXMgYSB2ZXJ0aWNhbCBzbGlkZSwgZ3JhYiB0aGUgdmVydGljYWwgaW5kZXhcblx0XHRcdGlmKCBpc1ZlcnRpY2FsICkge1xuXHRcdFx0XHR2ID0gTWF0aC5tYXgoIHRvQXJyYXkoIHNsaWRlLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKS5pbmRleE9mKCBzbGlkZSApLCAwICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoICFzbGlkZSAmJiBjdXJyZW50U2xpZGUgKSB7XG5cdFx0XHR2YXIgaGFzRnJhZ21lbnRzID0gY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQnICkubGVuZ3RoID4gMDtcblx0XHRcdGlmKCBoYXNGcmFnbWVudHMgKSB7XG5cdFx0XHRcdHZhciBjdXJyZW50RnJhZ21lbnQgPSBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvciggJy5jdXJyZW50LWZyYWdtZW50JyApO1xuXHRcdFx0XHRpZiggY3VycmVudEZyYWdtZW50ICYmIGN1cnJlbnRGcmFnbWVudC5oYXNBdHRyaWJ1dGUoICdkYXRhLWZyYWdtZW50LWluZGV4JyApICkge1xuXHRcdFx0XHRcdGYgPSBwYXJzZUludCggY3VycmVudEZyYWdtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnICksIDEwICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZiA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50LnZpc2libGUnICkubGVuZ3RoIC0gMTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB7IGg6IGgsIHY6IHYsIGY6IGYgfTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgdG90YWwgbnVtYmVyIG9mIHNsaWRlcyBpbiB0aGlzIHByZXNlbnRhdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGdldFRvdGFsU2xpZGVzKCkge1xuXG5cdFx0cmV0dXJuIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFNMSURFU19TRUxFQ1RPUiArICc6bm90KC5zdGFjayknICkubGVuZ3RoO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgc2xpZGUgZWxlbWVudCBtYXRjaGluZyB0aGUgc3BlY2lmaWVkIGluZGV4LlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0U2xpZGUoIHgsIHkgKSB7XG5cblx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKVsgeCBdO1xuXHRcdHZhciB2ZXJ0aWNhbFNsaWRlcyA9IGhvcml6b250YWxTbGlkZSAmJiBob3Jpem9udGFsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICk7XG5cblx0XHRpZiggdmVydGljYWxTbGlkZXMgJiYgdmVydGljYWxTbGlkZXMubGVuZ3RoICYmIHR5cGVvZiB5ID09PSAnbnVtYmVyJyApIHtcblx0XHRcdHJldHVybiB2ZXJ0aWNhbFNsaWRlcyA/IHZlcnRpY2FsU2xpZGVzWyB5IF0gOiB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhvcml6b250YWxTbGlkZTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGJhY2tncm91bmQgZWxlbWVudCBmb3IgdGhlIGdpdmVuIHNsaWRlLlxuXHQgKiBBbGwgc2xpZGVzLCBldmVuIHRoZSBvbmVzIHdpdGggbm8gYmFja2dyb3VuZCBwcm9wZXJ0aWVzXG5cdCAqIGRlZmluZWQsIGhhdmUgYSBiYWNrZ3JvdW5kIGVsZW1lbnQgc28gYXMgbG9uZyBhcyB0aGVcblx0ICogaW5kZXggaXMgdmFsaWQgYW4gZWxlbWVudCB3aWxsIGJlIHJldHVybmVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0U2xpZGVCYWNrZ3JvdW5kKCB4LCB5ICkge1xuXG5cdFx0Ly8gV2hlbiBwcmludGluZyB0byBQREYgdGhlIHNsaWRlIGJhY2tncm91bmRzIGFyZSBuZXN0ZWRcblx0XHQvLyBpbnNpZGUgb2YgdGhlIHNsaWRlc1xuXHRcdGlmKCBpc1ByaW50aW5nUERGKCkgKSB7XG5cdFx0XHR2YXIgc2xpZGUgPSBnZXRTbGlkZSggeCwgeSApO1xuXHRcdFx0aWYoIHNsaWRlICkge1xuXHRcdFx0XHR2YXIgYmFja2dyb3VuZCA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoICcuc2xpZGUtYmFja2dyb3VuZCcgKTtcblx0XHRcdFx0aWYoIGJhY2tncm91bmQgJiYgYmFja2dyb3VuZC5wYXJlbnROb2RlID09PSBzbGlkZSApIHtcblx0XHRcdFx0XHRyZXR1cm4gYmFja2dyb3VuZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHZhciBob3Jpem9udGFsQmFja2dyb3VuZCA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcuYmFja2dyb3VuZHM+LnNsaWRlLWJhY2tncm91bmQnIClbIHggXTtcblx0XHR2YXIgdmVydGljYWxCYWNrZ3JvdW5kcyA9IGhvcml6b250YWxCYWNrZ3JvdW5kICYmIGhvcml6b250YWxCYWNrZ3JvdW5kLnF1ZXJ5U2VsZWN0b3JBbGwoICcuc2xpZGUtYmFja2dyb3VuZCcgKTtcblxuXHRcdGlmKCB2ZXJ0aWNhbEJhY2tncm91bmRzICYmIHZlcnRpY2FsQmFja2dyb3VuZHMubGVuZ3RoICYmIHR5cGVvZiB5ID09PSAnbnVtYmVyJyApIHtcblx0XHRcdHJldHVybiB2ZXJ0aWNhbEJhY2tncm91bmRzID8gdmVydGljYWxCYWNrZ3JvdW5kc1sgeSBdIDogdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBob3Jpem9udGFsQmFja2dyb3VuZDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgc3BlYWtlciBub3RlcyBmcm9tIGEgc2xpZGUuIE5vdGVzIGNhbiBiZVxuXHQgKiBkZWZpbmVkIGluIHR3byB3YXlzOlxuXHQgKiAxLiBBcyBhIGRhdGEtbm90ZXMgYXR0cmlidXRlIG9uIHRoZSBzbGlkZSA8c2VjdGlvbj5cblx0ICogMi4gQXMgYW4gPGFzaWRlIGNsYXNzPVwibm90ZXNcIj4gaW5zaWRlIG9mIHRoZSBzbGlkZVxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0U2xpZGVOb3Rlcyggc2xpZGUgKSB7XG5cblx0XHQvLyBEZWZhdWx0IHRvIHRoZSBjdXJyZW50IHNsaWRlXG5cdFx0c2xpZGUgPSBzbGlkZSB8fCBjdXJyZW50U2xpZGU7XG5cblx0XHQvLyBOb3RlcyBjYW4gYmUgc3BlY2lmaWVkIHZpYSB0aGUgZGF0YS1ub3RlcyBhdHRyaWJ1dGUuLi5cblx0XHRpZiggc2xpZGUuaGFzQXR0cmlidXRlKCAnZGF0YS1ub3RlcycgKSApIHtcblx0XHRcdHJldHVybiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLW5vdGVzJyApO1xuXHRcdH1cblxuXHRcdC8vIC4uLiBvciB1c2luZyBhbiA8YXNpZGUgY2xhc3M9XCJub3Rlc1wiPiBlbGVtZW50XG5cdFx0dmFyIG5vdGVzRWxlbWVudCA9IHNsaWRlLnF1ZXJ5U2VsZWN0b3IoICdhc2lkZS5ub3RlcycgKTtcblx0XHRpZiggbm90ZXNFbGVtZW50ICkge1xuXHRcdFx0cmV0dXJuIG5vdGVzRWxlbWVudC5pbm5lckhUTUw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIHByZXNlbnRhdGlvbiBhc1xuXHQgKiBhbiBvYmplY3QuIFRoaXMgc3RhdGUgY2FuIHRoZW4gYmUgcmVzdG9yZWQgYXQgYW55XG5cdCAqIHRpbWUuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcblxuXHRcdHZhciBpbmRpY2VzID0gZ2V0SW5kaWNlcygpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGluZGV4aDogaW5kaWNlcy5oLFxuXHRcdFx0aW5kZXh2OiBpbmRpY2VzLnYsXG5cdFx0XHRpbmRleGY6IGluZGljZXMuZixcblx0XHRcdHBhdXNlZDogaXNQYXVzZWQoKSxcblx0XHRcdG92ZXJ2aWV3OiBpc092ZXJ2aWV3KClcblx0XHR9O1xuXG5cdH1cblxuXHQvKipcblx0ICogUmVzdG9yZXMgdGhlIHByZXNlbnRhdGlvbiB0byB0aGUgZ2l2ZW4gc3RhdGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0ZSBBcyBnZW5lcmF0ZWQgYnkgZ2V0U3RhdGUoKVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0U3RhdGUoIHN0YXRlICkge1xuXG5cdFx0aWYoIHR5cGVvZiBzdGF0ZSA9PT0gJ29iamVjdCcgKSB7XG5cdFx0XHRzbGlkZSggZGVzZXJpYWxpemUoIHN0YXRlLmluZGV4aCApLCBkZXNlcmlhbGl6ZSggc3RhdGUuaW5kZXh2ICksIGRlc2VyaWFsaXplKCBzdGF0ZS5pbmRleGYgKSApO1xuXG5cdFx0XHR2YXIgcGF1c2VkRmxhZyA9IGRlc2VyaWFsaXplKCBzdGF0ZS5wYXVzZWQgKSxcblx0XHRcdFx0b3ZlcnZpZXdGbGFnID0gZGVzZXJpYWxpemUoIHN0YXRlLm92ZXJ2aWV3ICk7XG5cblx0XHRcdGlmKCB0eXBlb2YgcGF1c2VkRmxhZyA9PT0gJ2Jvb2xlYW4nICYmIHBhdXNlZEZsYWcgIT09IGlzUGF1c2VkKCkgKSB7XG5cdFx0XHRcdHRvZ2dsZVBhdXNlKCBwYXVzZWRGbGFnICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCB0eXBlb2Ygb3ZlcnZpZXdGbGFnID09PSAnYm9vbGVhbicgJiYgb3ZlcnZpZXdGbGFnICE9PSBpc092ZXJ2aWV3KCkgKSB7XG5cdFx0XHRcdHRvZ2dsZU92ZXJ2aWV3KCBvdmVydmlld0ZsYWcgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYSBzb3J0ZWQgZnJhZ21lbnRzIGxpc3QsIG9yZGVyZWQgYnkgYW4gaW5jcmVhc2luZ1xuXHQgKiBcImRhdGEtZnJhZ21lbnQtaW5kZXhcIiBhdHRyaWJ1dGUuXG5cdCAqXG5cdCAqIEZyYWdtZW50cyB3aWxsIGJlIHJldmVhbGVkIGluIHRoZSBvcmRlciB0aGF0IHRoZXkgYXJlIHJldHVybmVkIGJ5XG5cdCAqIHRoaXMgZnVuY3Rpb24sIHNvIHlvdSBjYW4gdXNlIHRoZSBpbmRleCBhdHRyaWJ1dGVzIHRvIGNvbnRyb2wgdGhlXG5cdCAqIG9yZGVyIG9mIGZyYWdtZW50IGFwcGVhcmFuY2UuXG5cdCAqXG5cdCAqIFRvIG1haW50YWluIGEgc2Vuc2libGUgZGVmYXVsdCBmcmFnbWVudCBvcmRlciwgZnJhZ21lbnRzIGFyZSBwcmVzdW1lZFxuXHQgKiB0byBiZSBwYXNzZWQgaW4gZG9jdW1lbnQgb3JkZXIuIFRoaXMgZnVuY3Rpb24gYWRkcyBhIFwiZnJhZ21lbnQtaW5kZXhcIlxuXHQgKiBhdHRyaWJ1dGUgdG8gZWFjaCBub2RlIGlmIHN1Y2ggYW4gYXR0cmlidXRlIGlzIG5vdCBhbHJlYWR5IHByZXNlbnQsXG5cdCAqIGFuZCBzZXRzIHRoYXQgYXR0cmlidXRlIHRvIGFuIGludGVnZXIgdmFsdWUgd2hpY2ggaXMgdGhlIHBvc2l0aW9uIG9mXG5cdCAqIHRoZSBmcmFnbWVudCB3aXRoaW4gdGhlIGZyYWdtZW50cyBsaXN0LlxuXHQgKi9cblx0ZnVuY3Rpb24gc29ydEZyYWdtZW50cyggZnJhZ21lbnRzICkge1xuXG5cdFx0ZnJhZ21lbnRzID0gdG9BcnJheSggZnJhZ21lbnRzICk7XG5cblx0XHR2YXIgb3JkZXJlZCA9IFtdLFxuXHRcdFx0dW5vcmRlcmVkID0gW10sXG5cdFx0XHRzb3J0ZWQgPSBbXTtcblxuXHRcdC8vIEdyb3VwIG9yZGVyZWQgYW5kIHVub3JkZXJlZCBlbGVtZW50c1xuXHRcdGZyYWdtZW50cy5mb3JFYWNoKCBmdW5jdGlvbiggZnJhZ21lbnQsIGkgKSB7XG5cdFx0XHRpZiggZnJhZ21lbnQuaGFzQXR0cmlidXRlKCAnZGF0YS1mcmFnbWVudC1pbmRleCcgKSApIHtcblx0XHRcdFx0dmFyIGluZGV4ID0gcGFyc2VJbnQoIGZyYWdtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnICksIDEwICk7XG5cblx0XHRcdFx0aWYoICFvcmRlcmVkW2luZGV4XSApIHtcblx0XHRcdFx0XHRvcmRlcmVkW2luZGV4XSA9IFtdO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0b3JkZXJlZFtpbmRleF0ucHVzaCggZnJhZ21lbnQgKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR1bm9yZGVyZWQucHVzaCggWyBmcmFnbWVudCBdICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdFx0Ly8gQXBwZW5kIGZyYWdtZW50cyB3aXRob3V0IGV4cGxpY2l0IGluZGljZXMgaW4gdGhlaXJcblx0XHQvLyBET00gb3JkZXJcblx0XHRvcmRlcmVkID0gb3JkZXJlZC5jb25jYXQoIHVub3JkZXJlZCApO1xuXG5cdFx0Ly8gTWFudWFsbHkgY291bnQgdGhlIGluZGV4IHVwIHBlciBncm91cCB0byBlbnN1cmUgdGhlcmVcblx0XHQvLyBhcmUgbm8gZ2Fwc1xuXHRcdHZhciBpbmRleCA9IDA7XG5cblx0XHQvLyBQdXNoIGFsbCBmcmFnbWVudHMgaW4gdGhlaXIgc29ydGVkIG9yZGVyIHRvIGFuIGFycmF5LFxuXHRcdC8vIHRoaXMgZmxhdHRlbnMgdGhlIGdyb3Vwc1xuXHRcdG9yZGVyZWQuZm9yRWFjaCggZnVuY3Rpb24oIGdyb3VwICkge1xuXHRcdFx0Z3JvdXAuZm9yRWFjaCggZnVuY3Rpb24oIGZyYWdtZW50ICkge1xuXHRcdFx0XHRzb3J0ZWQucHVzaCggZnJhZ21lbnQgKTtcblx0XHRcdFx0ZnJhZ21lbnQuc2V0QXR0cmlidXRlKCAnZGF0YS1mcmFnbWVudC1pbmRleCcsIGluZGV4ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGluZGV4ICsrO1xuXHRcdH0gKTtcblxuXHRcdHJldHVybiBzb3J0ZWQ7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZSB0byB0aGUgc3BlY2lmaWVkIHNsaWRlIGZyYWdtZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIGluZGV4IG9mIHRoZSBmcmFnbWVudCB0aGF0XG5cdCAqIHNob3VsZCBiZSBzaG93biwgLTEgbWVhbnMgYWxsIGFyZSBpbnZpc2libGVcblx0ICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCBJbnRlZ2VyIG9mZnNldCB0byBhcHBseSB0byB0aGVcblx0ICogZnJhZ21lbnQgaW5kZXhcblx0ICpcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiBhIGNoYW5nZSB3YXMgbWFkZSBpbiBhbnlcblx0ICogZnJhZ21lbnRzIHZpc2liaWxpdHkgYXMgcGFydCBvZiB0aGlzIGNhbGxcblx0ICovXG5cdGZ1bmN0aW9uIG5hdmlnYXRlRnJhZ21lbnQoIGluZGV4LCBvZmZzZXQgKSB7XG5cblx0XHRpZiggY3VycmVudFNsaWRlICYmIGNvbmZpZy5mcmFnbWVudHMgKSB7XG5cblx0XHRcdHZhciBmcmFnbWVudHMgPSBzb3J0RnJhZ21lbnRzKCBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKSApO1xuXHRcdFx0aWYoIGZyYWdtZW50cy5sZW5ndGggKSB7XG5cblx0XHRcdFx0Ly8gSWYgbm8gaW5kZXggaXMgc3BlY2lmaWVkLCBmaW5kIHRoZSBjdXJyZW50XG5cdFx0XHRcdGlmKCB0eXBlb2YgaW5kZXggIT09ICdudW1iZXInICkge1xuXHRcdFx0XHRcdHZhciBsYXN0VmlzaWJsZUZyYWdtZW50ID0gc29ydEZyYWdtZW50cyggY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQudmlzaWJsZScgKSApLnBvcCgpO1xuXG5cdFx0XHRcdFx0aWYoIGxhc3RWaXNpYmxlRnJhZ21lbnQgKSB7XG5cdFx0XHRcdFx0XHRpbmRleCA9IHBhcnNlSW50KCBsYXN0VmlzaWJsZUZyYWdtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnICkgfHwgMCwgMTAgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRpbmRleCA9IC0xO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIGFuIG9mZnNldCBpcyBzcGVjaWZpZWQsIGFwcGx5IGl0IHRvIHRoZSBpbmRleFxuXHRcdFx0XHRpZiggdHlwZW9mIG9mZnNldCA9PT0gJ251bWJlcicgKSB7XG5cdFx0XHRcdFx0aW5kZXggKz0gb2Zmc2V0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIGZyYWdtZW50c1Nob3duID0gW10sXG5cdFx0XHRcdFx0ZnJhZ21lbnRzSGlkZGVuID0gW107XG5cblx0XHRcdFx0dG9BcnJheSggZnJhZ21lbnRzICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW1lbnQsIGkgKSB7XG5cblx0XHRcdFx0XHRpZiggZWxlbWVudC5oYXNBdHRyaWJ1dGUoICdkYXRhLWZyYWdtZW50LWluZGV4JyApICkge1xuXHRcdFx0XHRcdFx0aSA9IHBhcnNlSW50KCBlbGVtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnICksIDEwICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVmlzaWJsZSBmcmFnbWVudHNcblx0XHRcdFx0XHRpZiggaSA8PSBpbmRleCApIHtcblx0XHRcdFx0XHRcdGlmKCAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoICd2aXNpYmxlJyApICkgZnJhZ21lbnRzU2hvd24ucHVzaCggZWxlbWVudCApO1xuXHRcdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCAndmlzaWJsZScgKTtcblx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ2N1cnJlbnQtZnJhZ21lbnQnICk7XG5cblx0XHRcdFx0XHRcdC8vIEFubm91bmNlIHRoZSBmcmFnbWVudHMgb25lIGJ5IG9uZSB0byB0aGUgU2NyZWVuIFJlYWRlclxuXHRcdFx0XHRcdFx0ZG9tLnN0YXR1c0Rpdi50ZXh0Q29udGVudCA9IGVsZW1lbnQudGV4dENvbnRlbnQ7XG5cblx0XHRcdFx0XHRcdGlmKCBpID09PSBpbmRleCApIHtcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnY3VycmVudC1mcmFnbWVudCcgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gSGlkZGVuIGZyYWdtZW50c1xuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYoIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCAndmlzaWJsZScgKSApIGZyYWdtZW50c0hpZGRlbi5wdXNoKCBlbGVtZW50ICk7XG5cdFx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICd2aXNpYmxlJyApO1xuXHRcdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnY3VycmVudC1mcmFnbWVudCcgKTtcblx0XHRcdFx0XHR9XG5cblxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0aWYoIGZyYWdtZW50c0hpZGRlbi5sZW5ndGggKSB7XG5cdFx0XHRcdFx0ZGlzcGF0Y2hFdmVudCggJ2ZyYWdtZW50aGlkZGVuJywgeyBmcmFnbWVudDogZnJhZ21lbnRzSGlkZGVuWzBdLCBmcmFnbWVudHM6IGZyYWdtZW50c0hpZGRlbiB9ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiggZnJhZ21lbnRzU2hvd24ubGVuZ3RoICkge1xuXHRcdFx0XHRcdGRpc3BhdGNoRXZlbnQoICdmcmFnbWVudHNob3duJywgeyBmcmFnbWVudDogZnJhZ21lbnRzU2hvd25bMF0sIGZyYWdtZW50czogZnJhZ21lbnRzU2hvd24gfSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dXBkYXRlQ29udHJvbHMoKTtcblx0XHRcdFx0dXBkYXRlUHJvZ3Jlc3MoKTtcblxuXHRcdFx0XHRyZXR1cm4gISEoIGZyYWdtZW50c1Nob3duLmxlbmd0aCB8fCBmcmFnbWVudHNIaWRkZW4ubGVuZ3RoICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlIHRvIHRoZSBuZXh0IHNsaWRlIGZyYWdtZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZXJlIHdhcyBhIG5leHQgZnJhZ21lbnQsXG5cdCAqIGZhbHNlIG90aGVyd2lzZVxuXHQgKi9cblx0ZnVuY3Rpb24gbmV4dEZyYWdtZW50KCkge1xuXG5cdFx0cmV0dXJuIG5hdmlnYXRlRnJhZ21lbnQoIG51bGwsIDEgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlIHRvIHRoZSBwcmV2aW91cyBzbGlkZSBmcmFnbWVudC5cblx0ICpcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSB3YXMgYSBwcmV2aW91cyBmcmFnbWVudCxcblx0ICogZmFsc2Ugb3RoZXJ3aXNlXG5cdCAqL1xuXHRmdW5jdGlvbiBwcmV2aW91c0ZyYWdtZW50KCkge1xuXG5cdFx0cmV0dXJuIG5hdmlnYXRlRnJhZ21lbnQoIG51bGwsIC0xICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDdWVzIGEgbmV3IGF1dG9tYXRlZCBzbGlkZSBpZiBlbmFibGVkIGluIHRoZSBjb25maWcuXG5cdCAqL1xuXHRmdW5jdGlvbiBjdWVBdXRvU2xpZGUoKSB7XG5cblx0XHRjYW5jZWxBdXRvU2xpZGUoKTtcblxuXHRcdGlmKCBjdXJyZW50U2xpZGUgKSB7XG5cblx0XHRcdHZhciBjdXJyZW50RnJhZ21lbnQgPSBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvciggJy5jdXJyZW50LWZyYWdtZW50JyApO1xuXG5cdFx0XHR2YXIgZnJhZ21lbnRBdXRvU2xpZGUgPSBjdXJyZW50RnJhZ21lbnQgPyBjdXJyZW50RnJhZ21lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1hdXRvc2xpZGUnICkgOiBudWxsO1xuXHRcdFx0dmFyIHBhcmVudEF1dG9TbGlkZSA9IGN1cnJlbnRTbGlkZS5wYXJlbnROb2RlID8gY3VycmVudFNsaWRlLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1hdXRvc2xpZGUnICkgOiBudWxsO1xuXHRcdFx0dmFyIHNsaWRlQXV0b1NsaWRlID0gY3VycmVudFNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYXV0b3NsaWRlJyApO1xuXG5cdFx0XHQvLyBQaWNrIHZhbHVlIGluIHRoZSBmb2xsb3dpbmcgcHJpb3JpdHkgb3JkZXI6XG5cdFx0XHQvLyAxLiBDdXJyZW50IGZyYWdtZW50J3MgZGF0YS1hdXRvc2xpZGVcblx0XHRcdC8vIDIuIEN1cnJlbnQgc2xpZGUncyBkYXRhLWF1dG9zbGlkZVxuXHRcdFx0Ly8gMy4gUGFyZW50IHNsaWRlJ3MgZGF0YS1hdXRvc2xpZGVcblx0XHRcdC8vIDQuIEdsb2JhbCBhdXRvU2xpZGUgc2V0dGluZ1xuXHRcdFx0aWYoIGZyYWdtZW50QXV0b1NsaWRlICkge1xuXHRcdFx0XHRhdXRvU2xpZGUgPSBwYXJzZUludCggZnJhZ21lbnRBdXRvU2xpZGUsIDEwICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCBzbGlkZUF1dG9TbGlkZSApIHtcblx0XHRcdFx0YXV0b1NsaWRlID0gcGFyc2VJbnQoIHNsaWRlQXV0b1NsaWRlLCAxMCApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggcGFyZW50QXV0b1NsaWRlICkge1xuXHRcdFx0XHRhdXRvU2xpZGUgPSBwYXJzZUludCggcGFyZW50QXV0b1NsaWRlLCAxMCApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGF1dG9TbGlkZSA9IGNvbmZpZy5hdXRvU2xpZGU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHRoZXJlIGFyZSBtZWRpYSBlbGVtZW50cyB3aXRoIGRhdGEtYXV0b3BsYXksXG5cdFx0XHQvLyBhdXRvbWF0aWNhbGx5IHNldCB0aGUgYXV0b1NsaWRlIGR1cmF0aW9uIHRvIHRoZVxuXHRcdFx0Ly8gbGVuZ3RoIG9mIHRoYXQgbWVkaWEuIE5vdCBhcHBsaWNhYmxlIGlmIHRoZSBzbGlkZVxuXHRcdFx0Ly8gaXMgZGl2aWRlZCB1cCBpbnRvIGZyYWdtZW50cy5cblx0XHRcdGlmKCBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdHRvQXJyYXkoIGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAndmlkZW8sIGF1ZGlvJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRcdGlmKCBlbC5oYXNBdHRyaWJ1dGUoICdkYXRhLWF1dG9wbGF5JyApICkge1xuXHRcdFx0XHRcdFx0aWYoIGF1dG9TbGlkZSAmJiBlbC5kdXJhdGlvbiAqIDEwMDAgPiBhdXRvU2xpZGUgKSB7XG5cdFx0XHRcdFx0XHRcdGF1dG9TbGlkZSA9ICggZWwuZHVyYXRpb24gKiAxMDAwICkgKyAxMDAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDdWUgdGhlIG5leHQgYXV0by1zbGlkZSBpZjpcblx0XHRcdC8vIC0gVGhlcmUgaXMgYW4gYXV0b1NsaWRlIHZhbHVlXG5cdFx0XHQvLyAtIEF1dG8tc2xpZGluZyBpc24ndCBwYXVzZWQgYnkgdGhlIHVzZXJcblx0XHRcdC8vIC0gVGhlIHByZXNlbnRhdGlvbiBpc24ndCBwYXVzZWRcblx0XHRcdC8vIC0gVGhlIG92ZXJ2aWV3IGlzbid0IGFjdGl2ZVxuXHRcdFx0Ly8gLSBUaGUgcHJlc2VudGF0aW9uIGlzbid0IG92ZXJcblx0XHRcdGlmKCBhdXRvU2xpZGUgJiYgIWF1dG9TbGlkZVBhdXNlZCAmJiAhaXNQYXVzZWQoKSAmJiAhaXNPdmVydmlldygpICYmICggIVJldmVhbC5pc0xhc3RTbGlkZSgpIHx8IGF2YWlsYWJsZUZyYWdtZW50cygpLm5leHQgfHwgY29uZmlnLmxvb3AgPT09IHRydWUgKSApIHtcblx0XHRcdFx0YXV0b1NsaWRlVGltZW91dCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHR5cGVvZiBjb25maWcuYXV0b1NsaWRlTWV0aG9kID09PSAnZnVuY3Rpb24nID8gY29uZmlnLmF1dG9TbGlkZU1ldGhvZCgpIDogbmF2aWdhdGVOZXh0KCk7XG5cdFx0XHRcdFx0Y3VlQXV0b1NsaWRlKCk7XG5cdFx0XHRcdH0sIGF1dG9TbGlkZSApO1xuXHRcdFx0XHRhdXRvU2xpZGVTdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiggYXV0b1NsaWRlUGxheWVyICkge1xuXHRcdFx0XHRhdXRvU2xpZGVQbGF5ZXIuc2V0UGxheWluZyggYXV0b1NsaWRlVGltZW91dCAhPT0gLTEgKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENhbmNlbHMgYW55IG9uZ29pbmcgcmVxdWVzdCB0byBhdXRvLXNsaWRlLlxuXHQgKi9cblx0ZnVuY3Rpb24gY2FuY2VsQXV0b1NsaWRlKCkge1xuXG5cdFx0Y2xlYXJUaW1lb3V0KCBhdXRvU2xpZGVUaW1lb3V0ICk7XG5cdFx0YXV0b1NsaWRlVGltZW91dCA9IC0xO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBwYXVzZUF1dG9TbGlkZSgpIHtcblxuXHRcdGlmKCBhdXRvU2xpZGUgJiYgIWF1dG9TbGlkZVBhdXNlZCApIHtcblx0XHRcdGF1dG9TbGlkZVBhdXNlZCA9IHRydWU7XG5cdFx0XHRkaXNwYXRjaEV2ZW50KCAnYXV0b3NsaWRlcGF1c2VkJyApO1xuXHRcdFx0Y2xlYXJUaW1lb3V0KCBhdXRvU2xpZGVUaW1lb3V0ICk7XG5cblx0XHRcdGlmKCBhdXRvU2xpZGVQbGF5ZXIgKSB7XG5cdFx0XHRcdGF1dG9TbGlkZVBsYXllci5zZXRQbGF5aW5nKCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gcmVzdW1lQXV0b1NsaWRlKCkge1xuXG5cdFx0aWYoIGF1dG9TbGlkZSAmJiBhdXRvU2xpZGVQYXVzZWQgKSB7XG5cdFx0XHRhdXRvU2xpZGVQYXVzZWQgPSBmYWxzZTtcblx0XHRcdGRpc3BhdGNoRXZlbnQoICdhdXRvc2xpZGVyZXN1bWVkJyApO1xuXHRcdFx0Y3VlQXV0b1NsaWRlKCk7XG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBuYXZpZ2F0ZUxlZnQoKSB7XG5cblx0XHQvLyBSZXZlcnNlIGZvciBSVExcblx0XHRpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdGlmKCAoIGlzT3ZlcnZpZXcoKSB8fCBuZXh0RnJhZ21lbnQoKSA9PT0gZmFsc2UgKSAmJiBhdmFpbGFibGVSb3V0ZXMoKS5sZWZ0ICkge1xuXHRcdFx0XHRzbGlkZSggaW5kZXhoICsgMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBOb3JtYWwgbmF2aWdhdGlvblxuXHRcdGVsc2UgaWYoICggaXNPdmVydmlldygpIHx8IHByZXZpb3VzRnJhZ21lbnQoKSA9PT0gZmFsc2UgKSAmJiBhdmFpbGFibGVSb3V0ZXMoKS5sZWZ0ICkge1xuXHRcdFx0c2xpZGUoIGluZGV4aCAtIDEgKTtcblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG5hdmlnYXRlUmlnaHQoKSB7XG5cblx0XHQvLyBSZXZlcnNlIGZvciBSVExcblx0XHRpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdGlmKCAoIGlzT3ZlcnZpZXcoKSB8fCBwcmV2aW91c0ZyYWdtZW50KCkgPT09IGZhbHNlICkgJiYgYXZhaWxhYmxlUm91dGVzKCkucmlnaHQgKSB7XG5cdFx0XHRcdHNsaWRlKCBpbmRleGggLSAxICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIE5vcm1hbCBuYXZpZ2F0aW9uXG5cdFx0ZWxzZSBpZiggKCBpc092ZXJ2aWV3KCkgfHwgbmV4dEZyYWdtZW50KCkgPT09IGZhbHNlICkgJiYgYXZhaWxhYmxlUm91dGVzKCkucmlnaHQgKSB7XG5cdFx0XHRzbGlkZSggaW5kZXhoICsgMSApO1xuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gbmF2aWdhdGVVcCgpIHtcblxuXHRcdC8vIFByaW9yaXRpemUgaGlkaW5nIGZyYWdtZW50c1xuXHRcdGlmKCAoIGlzT3ZlcnZpZXcoKSB8fCBwcmV2aW91c0ZyYWdtZW50KCkgPT09IGZhbHNlICkgJiYgYXZhaWxhYmxlUm91dGVzKCkudXAgKSB7XG5cdFx0XHRzbGlkZSggaW5kZXhoLCBpbmRleHYgLSAxICk7XG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBuYXZpZ2F0ZURvd24oKSB7XG5cblx0XHQvLyBQcmlvcml0aXplIHJldmVhbGluZyBmcmFnbWVudHNcblx0XHRpZiggKCBpc092ZXJ2aWV3KCkgfHwgbmV4dEZyYWdtZW50KCkgPT09IGZhbHNlICkgJiYgYXZhaWxhYmxlUm91dGVzKCkuZG93biApIHtcblx0XHRcdHNsaWRlKCBpbmRleGgsIGluZGV4diArIDEgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZXMgYmFja3dhcmRzLCBwcmlvcml0aXplZCBpbiB0aGUgZm9sbG93aW5nIG9yZGVyOlxuXHQgKiAxKSBQcmV2aW91cyBmcmFnbWVudFxuXHQgKiAyKSBQcmV2aW91cyB2ZXJ0aWNhbCBzbGlkZVxuXHQgKiAzKSBQcmV2aW91cyBob3Jpem9udGFsIHNsaWRlXG5cdCAqL1xuXHRmdW5jdGlvbiBuYXZpZ2F0ZVByZXYoKSB7XG5cblx0XHQvLyBQcmlvcml0aXplIHJldmVhbGluZyBmcmFnbWVudHNcblx0XHRpZiggcHJldmlvdXNGcmFnbWVudCgpID09PSBmYWxzZSApIHtcblx0XHRcdGlmKCBhdmFpbGFibGVSb3V0ZXMoKS51cCApIHtcblx0XHRcdFx0bmF2aWdhdGVVcCgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIEZldGNoIHRoZSBwcmV2aW91cyBob3Jpem9udGFsIHNsaWRlLCBpZiB0aGVyZSBpcyBvbmVcblx0XHRcdFx0dmFyIHByZXZpb3VzU2xpZGU7XG5cblx0XHRcdFx0aWYoIGNvbmZpZy5ydGwgKSB7XG5cdFx0XHRcdFx0cHJldmlvdXNTbGlkZSA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICsgJy5mdXR1cmUnICkgKS5wb3AoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRwcmV2aW91c1NsaWRlID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKyAnLnBhc3QnICkgKS5wb3AoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCBwcmV2aW91c1NsaWRlICkge1xuXHRcdFx0XHRcdHZhciB2ID0gKCBwcmV2aW91c1NsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApLmxlbmd0aCAtIDEgKSB8fCB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dmFyIGggPSBpbmRleGggLSAxO1xuXHRcdFx0XHRcdHNsaWRlKCBoLCB2ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgcmV2ZXJzZSBvZiAjbmF2aWdhdGVQcmV2KCkuXG5cdCAqL1xuXHRmdW5jdGlvbiBuYXZpZ2F0ZU5leHQoKSB7XG5cblx0XHQvLyBQcmlvcml0aXplIHJldmVhbGluZyBmcmFnbWVudHNcblx0XHRpZiggbmV4dEZyYWdtZW50KCkgPT09IGZhbHNlICkge1xuXHRcdFx0aWYoIGF2YWlsYWJsZVJvdXRlcygpLmRvd24gKSB7XG5cdFx0XHRcdG5hdmlnYXRlRG93bigpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdFx0bmF2aWdhdGVMZWZ0KCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bmF2aWdhdGVSaWdodCgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgdGFyZ2V0IGVsZW1lbnQgcHJldmVudHMgdGhlIHRyaWdnZXJpbmcgb2Zcblx0ICogc3dpcGUgbmF2aWdhdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGlzU3dpcGVQcmV2ZW50ZWQoIHRhcmdldCApIHtcblxuXHRcdHdoaWxlKCB0YXJnZXQgJiYgdHlwZW9mIHRhcmdldC5oYXNBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRpZiggdGFyZ2V0Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtcHJldmVudC1zd2lwZScgKSApIHJldHVybiB0cnVlO1xuXHRcdFx0dGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdH1cblxuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRVZFTlRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cblx0LyoqXG5cdCAqIENhbGxlZCBieSBhbGwgZXZlbnQgaGFuZGxlcnMgdGhhdCBhcmUgYmFzZWQgb24gdXNlclxuXHQgKiBpbnB1dC5cblx0ICovXG5cdGZ1bmN0aW9uIG9uVXNlcklucHV0KCBldmVudCApIHtcblxuXHRcdGlmKCBjb25maWcuYXV0b1NsaWRlU3RvcHBhYmxlICkge1xuXHRcdFx0cGF1c2VBdXRvU2xpZGUoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVyIGZvciB0aGUgZG9jdW1lbnQgbGV2ZWwgJ2tleXByZXNzJyBldmVudC5cblx0ICovXG5cdGZ1bmN0aW9uIG9uRG9jdW1lbnRLZXlQcmVzcyggZXZlbnQgKSB7XG5cblx0XHQvLyBDaGVjayBpZiB0aGUgcHJlc3NlZCBrZXkgaXMgcXVlc3Rpb24gbWFya1xuXHRcdGlmKCBldmVudC5zaGlmdEtleSAmJiBldmVudC5jaGFyQ29kZSA9PT0gNjMgKSB7XG5cdFx0XHRpZiggZG9tLm92ZXJsYXkgKSB7XG5cdFx0XHRcdGNsb3NlT3ZlcmxheSgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHNob3dIZWxwKCB0cnVlICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlciBmb3IgdGhlIGRvY3VtZW50IGxldmVsICdrZXlkb3duJyBldmVudC5cblx0ICovXG5cdGZ1bmN0aW9uIG9uRG9jdW1lbnRLZXlEb3duKCBldmVudCApIHtcblxuXHRcdC8vIElmIHRoZXJlJ3MgYSBjb25kaXRpb24gc3BlY2lmaWVkIGFuZCBpdCByZXR1cm5zIGZhbHNlLFxuXHRcdC8vIGlnbm9yZSB0aGlzIGV2ZW50XG5cdFx0aWYoIHR5cGVvZiBjb25maWcua2V5Ym9hcmRDb25kaXRpb24gPT09ICdmdW5jdGlvbicgJiYgY29uZmlnLmtleWJvYXJkQ29uZGl0aW9uKCkgPT09IGZhbHNlICkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Ly8gUmVtZW1iZXIgaWYgYXV0by1zbGlkaW5nIHdhcyBwYXVzZWQgc28gd2UgY2FuIHRvZ2dsZSBpdFxuXHRcdHZhciBhdXRvU2xpZGVXYXNQYXVzZWQgPSBhdXRvU2xpZGVQYXVzZWQ7XG5cblx0XHRvblVzZXJJbnB1dCggZXZlbnQgKTtcblxuXHRcdC8vIENoZWNrIGlmIHRoZXJlJ3MgYSBmb2N1c2VkIGVsZW1lbnQgdGhhdCBjb3VsZCBiZSB1c2luZ1xuXHRcdC8vIHRoZSBrZXlib2FyZFxuXHRcdHZhciBhY3RpdmVFbGVtZW50SXNDRSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5jb250ZW50RWRpdGFibGUgIT09ICdpbmhlcml0Jztcblx0XHR2YXIgYWN0aXZlRWxlbWVudElzSW5wdXQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudGFnTmFtZSAmJiAvaW5wdXR8dGV4dGFyZWEvaS50ZXN0KCBkb2N1bWVudC5hY3RpdmVFbGVtZW50LnRhZ05hbWUgKTtcblxuXHRcdC8vIERpc3JlZ2FyZCB0aGUgZXZlbnQgaWYgdGhlcmUncyBhIGZvY3VzZWQgZWxlbWVudCBvciBhXG5cdFx0Ly8ga2V5Ym9hcmQgbW9kaWZpZXIga2V5IGlzIHByZXNlbnRcblx0XHRpZiggYWN0aXZlRWxlbWVudElzQ0UgfHwgYWN0aXZlRWxlbWVudElzSW5wdXQgfHwgKGV2ZW50LnNoaWZ0S2V5ICYmIGV2ZW50LmtleUNvZGUgIT09IDMyKSB8fCBldmVudC5hbHRLZXkgfHwgZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5ICkgcmV0dXJuO1xuXG5cdFx0Ly8gV2hpbGUgcGF1c2VkIG9ubHkgYWxsb3cgcmVzdW1lIGtleWJvYXJkIGV2ZW50czsgJ2InLCAnLicnXG5cdFx0dmFyIHJlc3VtZUtleUNvZGVzID0gWzY2LDE5MCwxOTFdO1xuXHRcdHZhciBrZXk7XG5cblx0XHQvLyBDdXN0b20ga2V5IGJpbmRpbmdzIGZvciB0b2dnbGVQYXVzZSBzaG91bGQgYmUgYWJsZSB0byByZXN1bWVcblx0XHRpZiggdHlwZW9mIGNvbmZpZy5rZXlib2FyZCA9PT0gJ29iamVjdCcgKSB7XG5cdFx0XHRmb3IoIGtleSBpbiBjb25maWcua2V5Ym9hcmQgKSB7XG5cdFx0XHRcdGlmKCBjb25maWcua2V5Ym9hcmRba2V5XSA9PT0gJ3RvZ2dsZVBhdXNlJyApIHtcblx0XHRcdFx0XHRyZXN1bWVLZXlDb2Rlcy5wdXNoKCBwYXJzZUludCgga2V5LCAxMCApICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiggaXNQYXVzZWQoKSAmJiByZXN1bWVLZXlDb2Rlcy5pbmRleE9mKCBldmVudC5rZXlDb2RlICkgPT09IC0xICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHZhciB0cmlnZ2VyZWQgPSBmYWxzZTtcblxuXHRcdC8vIDEuIFVzZXIgZGVmaW5lZCBrZXkgYmluZGluZ3Ncblx0XHRpZiggdHlwZW9mIGNvbmZpZy5rZXlib2FyZCA9PT0gJ29iamVjdCcgKSB7XG5cblx0XHRcdGZvcigga2V5IGluIGNvbmZpZy5rZXlib2FyZCApIHtcblxuXHRcdFx0XHQvLyBDaGVjayBpZiB0aGlzIGJpbmRpbmcgbWF0Y2hlcyB0aGUgcHJlc3NlZCBrZXlcblx0XHRcdFx0aWYoIHBhcnNlSW50KCBrZXksIDEwICkgPT09IGV2ZW50LmtleUNvZGUgKSB7XG5cblx0XHRcdFx0XHR2YXIgdmFsdWUgPSBjb25maWcua2V5Ym9hcmRbIGtleSBdO1xuXG5cdFx0XHRcdFx0Ly8gQ2FsbGJhY2sgZnVuY3Rpb25cblx0XHRcdFx0XHRpZiggdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdFx0dmFsdWUuYXBwbHkoIG51bGwsIFsgZXZlbnQgXSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBTdHJpbmcgc2hvcnRjdXRzIHRvIHJldmVhbC5qcyBBUElcblx0XHRcdFx0XHRlbHNlIGlmKCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBSZXZlYWxbIHZhbHVlIF0gPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0XHRSZXZlYWxbIHZhbHVlIF0uY2FsbCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRyaWdnZXJlZCA9IHRydWU7XG5cblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyAyLiBTeXN0ZW0gZGVmaW5lZCBrZXkgYmluZGluZ3Ncblx0XHRpZiggdHJpZ2dlcmVkID09PSBmYWxzZSApIHtcblxuXHRcdFx0Ly8gQXNzdW1lIHRydWUgYW5kIHRyeSB0byBwcm92ZSBmYWxzZVxuXHRcdFx0dHJpZ2dlcmVkID0gdHJ1ZTtcblxuXHRcdFx0c3dpdGNoKCBldmVudC5rZXlDb2RlICkge1xuXHRcdFx0XHQvLyBwLCBwYWdlIHVwXG5cdFx0XHRcdGNhc2UgODA6IGNhc2UgMzM6IG5hdmlnYXRlUHJldigpOyBicmVhaztcblx0XHRcdFx0Ly8gbiwgcGFnZSBkb3duXG5cdFx0XHRcdGNhc2UgNzg6IGNhc2UgMzQ6IG5hdmlnYXRlTmV4dCgpOyBicmVhaztcblx0XHRcdFx0Ly8gaCwgbGVmdFxuXHRcdFx0XHRjYXNlIDcyOiBjYXNlIDM3OiBuYXZpZ2F0ZUxlZnQoKTsgYnJlYWs7XG5cdFx0XHRcdC8vIGwsIHJpZ2h0XG5cdFx0XHRcdGNhc2UgNzY6IGNhc2UgMzk6IG5hdmlnYXRlUmlnaHQoKTsgYnJlYWs7XG5cdFx0XHRcdC8vIGssIHVwXG5cdFx0XHRcdGNhc2UgNzU6IGNhc2UgMzg6IG5hdmlnYXRlVXAoKTsgYnJlYWs7XG5cdFx0XHRcdC8vIGosIGRvd25cblx0XHRcdFx0Y2FzZSA3NDogY2FzZSA0MDogbmF2aWdhdGVEb3duKCk7IGJyZWFrO1xuXHRcdFx0XHQvLyBob21lXG5cdFx0XHRcdGNhc2UgMzY6IHNsaWRlKCAwICk7IGJyZWFrO1xuXHRcdFx0XHQvLyBlbmRcblx0XHRcdFx0Y2FzZSAzNTogc2xpZGUoIE51bWJlci5NQVhfVkFMVUUgKTsgYnJlYWs7XG5cdFx0XHRcdC8vIHNwYWNlXG5cdFx0XHRcdGNhc2UgMzI6IGlzT3ZlcnZpZXcoKSA/IGRlYWN0aXZhdGVPdmVydmlldygpIDogZXZlbnQuc2hpZnRLZXkgPyBuYXZpZ2F0ZVByZXYoKSA6IG5hdmlnYXRlTmV4dCgpOyBicmVhaztcblx0XHRcdFx0Ly8gcmV0dXJuXG5cdFx0XHRcdGNhc2UgMTM6IGlzT3ZlcnZpZXcoKSA/IGRlYWN0aXZhdGVPdmVydmlldygpIDogdHJpZ2dlcmVkID0gZmFsc2U7IGJyZWFrO1xuXHRcdFx0XHQvLyB0d28tc3BvdCwgc2VtaWNvbG9uLCBiLCBwZXJpb2QsIExvZ2l0ZWNoIHByZXNlbnRlciB0b29scyBcImJsYWNrIHNjcmVlblwiIGJ1dHRvblxuXHRcdFx0XHRjYXNlIDU4OiBjYXNlIDU5OiBjYXNlIDY2OiBjYXNlIDE5MDogY2FzZSAxOTE6IHRvZ2dsZVBhdXNlKCk7IGJyZWFrO1xuXHRcdFx0XHQvLyBmXG5cdFx0XHRcdGNhc2UgNzA6IGVudGVyRnVsbHNjcmVlbigpOyBicmVhaztcblx0XHRcdFx0Ly8gYVxuXHRcdFx0XHRjYXNlIDY1OiBpZiAoIGNvbmZpZy5hdXRvU2xpZGVTdG9wcGFibGUgKSB0b2dnbGVBdXRvU2xpZGUoIGF1dG9TbGlkZVdhc1BhdXNlZCApOyBicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR0cmlnZ2VyZWQgPSBmYWxzZTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIElmIHRoZSBpbnB1dCByZXN1bHRlZCBpbiBhIHRyaWdnZXJlZCBhY3Rpb24gd2Ugc2hvdWxkIHByZXZlbnRcblx0XHQvLyB0aGUgYnJvd3NlcnMgZGVmYXVsdCBiZWhhdmlvclxuXHRcdGlmKCB0cmlnZ2VyZWQgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCAmJiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblx0XHQvLyBFU0Mgb3IgTyBrZXlcblx0XHRlbHNlIGlmICggKCBldmVudC5rZXlDb2RlID09PSAyNyB8fCBldmVudC5rZXlDb2RlID09PSA3OSApICYmIGZlYXR1cmVzLnRyYW5zZm9ybXMzZCApIHtcblx0XHRcdGlmKCBkb20ub3ZlcmxheSApIHtcblx0XHRcdFx0Y2xvc2VPdmVybGF5KCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dG9nZ2xlT3ZlcnZpZXcoKTtcblx0XHRcdH1cblxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQgJiYgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cblx0XHQvLyBJZiBhdXRvLXNsaWRpbmcgaXMgZW5hYmxlZCB3ZSBuZWVkIHRvIGN1ZSB1cFxuXHRcdC8vIGFub3RoZXIgdGltZW91dFxuXHRcdGN1ZUF1dG9TbGlkZSgpO1xuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlciBmb3IgdGhlICd0b3VjaHN0YXJ0JyBldmVudCwgZW5hYmxlcyBzdXBwb3J0IGZvclxuXHQgKiBzd2lwZSBhbmQgcGluY2ggZ2VzdHVyZXMuXG5cdCAqL1xuXHRmdW5jdGlvbiBvblRvdWNoU3RhcnQoIGV2ZW50ICkge1xuXG5cdFx0aWYoIGlzU3dpcGVQcmV2ZW50ZWQoIGV2ZW50LnRhcmdldCApICkgcmV0dXJuIHRydWU7XG5cblx0XHR0b3VjaC5zdGFydFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG5cdFx0dG91Y2guc3RhcnRZID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZO1xuXHRcdHRvdWNoLnN0YXJ0Q291bnQgPSBldmVudC50b3VjaGVzLmxlbmd0aDtcblxuXHRcdC8vIElmIHRoZXJlJ3MgdHdvIHRvdWNoZXMgd2UgbmVlZCB0byBtZW1vcml6ZSB0aGUgZGlzdGFuY2Vcblx0XHQvLyBiZXR3ZWVuIHRob3NlIHR3byBwb2ludHMgdG8gZGV0ZWN0IHBpbmNoaW5nXG5cdFx0aWYoIGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAyICYmIGNvbmZpZy5vdmVydmlldyApIHtcblx0XHRcdHRvdWNoLnN0YXJ0U3BhbiA9IGRpc3RhbmNlQmV0d2Vlbigge1xuXHRcdFx0XHR4OiBldmVudC50b3VjaGVzWzFdLmNsaWVudFgsXG5cdFx0XHRcdHk6IGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WVxuXHRcdFx0fSwge1xuXHRcdFx0XHR4OiB0b3VjaC5zdGFydFgsXG5cdFx0XHRcdHk6IHRvdWNoLnN0YXJ0WVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHRoZSAndG91Y2htb3ZlJyBldmVudC5cblx0ICovXG5cdGZ1bmN0aW9uIG9uVG91Y2hNb3ZlKCBldmVudCApIHtcblxuXHRcdGlmKCBpc1N3aXBlUHJldmVudGVkKCBldmVudC50YXJnZXQgKSApIHJldHVybiB0cnVlO1xuXG5cdFx0Ly8gRWFjaCB0b3VjaCBzaG91bGQgb25seSB0cmlnZ2VyIG9uZSBhY3Rpb25cblx0XHRpZiggIXRvdWNoLmNhcHR1cmVkICkge1xuXHRcdFx0b25Vc2VySW5wdXQoIGV2ZW50ICk7XG5cblx0XHRcdHZhciBjdXJyZW50WCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcblx0XHRcdHZhciBjdXJyZW50WSA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WTtcblxuXHRcdFx0Ly8gSWYgdGhlIHRvdWNoIHN0YXJ0ZWQgd2l0aCB0d28gcG9pbnRzIGFuZCBzdGlsbCBoYXNcblx0XHRcdC8vIHR3byBhY3RpdmUgdG91Y2hlczsgdGVzdCBmb3IgdGhlIHBpbmNoIGdlc3R1cmVcblx0XHRcdGlmKCBldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiB0b3VjaC5zdGFydENvdW50ID09PSAyICYmIGNvbmZpZy5vdmVydmlldyApIHtcblxuXHRcdFx0XHQvLyBUaGUgY3VycmVudCBkaXN0YW5jZSBpbiBwaXhlbHMgYmV0d2VlbiB0aGUgdHdvIHRvdWNoIHBvaW50c1xuXHRcdFx0XHR2YXIgY3VycmVudFNwYW4gPSBkaXN0YW5jZUJldHdlZW4oIHtcblx0XHRcdFx0XHR4OiBldmVudC50b3VjaGVzWzFdLmNsaWVudFgsXG5cdFx0XHRcdFx0eTogZXZlbnQudG91Y2hlc1sxXS5jbGllbnRZXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHR4OiB0b3VjaC5zdGFydFgsXG5cdFx0XHRcdFx0eTogdG91Y2guc3RhcnRZXG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHQvLyBJZiB0aGUgc3BhbiBpcyBsYXJnZXIgdGhhbiB0aGUgZGVzaXJlIGFtb3VudCB3ZSd2ZSBnb3Rcblx0XHRcdFx0Ly8gb3Vyc2VsdmVzIGEgcGluY2hcblx0XHRcdFx0aWYoIE1hdGguYWJzKCB0b3VjaC5zdGFydFNwYW4gLSBjdXJyZW50U3BhbiApID4gdG91Y2gudGhyZXNob2xkICkge1xuXHRcdFx0XHRcdHRvdWNoLmNhcHR1cmVkID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGlmKCBjdXJyZW50U3BhbiA8IHRvdWNoLnN0YXJ0U3BhbiApIHtcblx0XHRcdFx0XHRcdGFjdGl2YXRlT3ZlcnZpZXcoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRkZWFjdGl2YXRlT3ZlcnZpZXcoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHR9XG5cdFx0XHQvLyBUaGVyZSB3YXMgb25seSBvbmUgdG91Y2ggcG9pbnQsIGxvb2sgZm9yIGEgc3dpcGVcblx0XHRcdGVsc2UgaWYoIGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAxICYmIHRvdWNoLnN0YXJ0Q291bnQgIT09IDIgKSB7XG5cblx0XHRcdFx0dmFyIGRlbHRhWCA9IGN1cnJlbnRYIC0gdG91Y2guc3RhcnRYLFxuXHRcdFx0XHRcdGRlbHRhWSA9IGN1cnJlbnRZIC0gdG91Y2guc3RhcnRZO1xuXG5cdFx0XHRcdGlmKCBkZWx0YVggPiB0b3VjaC50aHJlc2hvbGQgJiYgTWF0aC5hYnMoIGRlbHRhWCApID4gTWF0aC5hYnMoIGRlbHRhWSApICkge1xuXHRcdFx0XHRcdHRvdWNoLmNhcHR1cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRuYXZpZ2F0ZUxlZnQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCBkZWx0YVggPCAtdG91Y2gudGhyZXNob2xkICYmIE1hdGguYWJzKCBkZWx0YVggKSA+IE1hdGguYWJzKCBkZWx0YVkgKSApIHtcblx0XHRcdFx0XHR0b3VjaC5jYXB0dXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0bmF2aWdhdGVSaWdodCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoIGRlbHRhWSA+IHRvdWNoLnRocmVzaG9sZCApIHtcblx0XHRcdFx0XHR0b3VjaC5jYXB0dXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0bmF2aWdhdGVVcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoIGRlbHRhWSA8IC10b3VjaC50aHJlc2hvbGQgKSB7XG5cdFx0XHRcdFx0dG91Y2guY2FwdHVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdG5hdmlnYXRlRG93bigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgd2UncmUgZW1iZWRkZWQsIG9ubHkgYmxvY2sgdG91Y2ggZXZlbnRzIGlmIHRoZXkgaGF2ZVxuXHRcdFx0XHQvLyB0cmlnZ2VyZWQgYW4gYWN0aW9uXG5cdFx0XHRcdGlmKCBjb25maWcuZW1iZWRkZWQgKSB7XG5cdFx0XHRcdFx0aWYoIHRvdWNoLmNhcHR1cmVkIHx8IGlzVmVydGljYWxTbGlkZSggY3VycmVudFNsaWRlICkgKSB7XG5cdFx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBOb3QgZW1iZWRkZWQ/IEJsb2NrIHRoZW0gYWxsIHRvIGF2b2lkIG5lZWRsZXNzIHRvc3Npbmdcblx0XHRcdFx0Ly8gYXJvdW5kIG9mIHRoZSB2aWV3cG9ydCBpbiBpT1Ncblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIFRoZXJlJ3MgYSBidWcgd2l0aCBzd2lwaW5nIG9uIHNvbWUgQW5kcm9pZCBkZXZpY2VzIHVubGVzc1xuXHRcdC8vIHRoZSBkZWZhdWx0IGFjdGlvbiBpcyBhbHdheXMgcHJldmVudGVkXG5cdFx0ZWxzZSBpZiggVUEubWF0Y2goIC9hbmRyb2lkL2dpICkgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHRoZSAndG91Y2hlbmQnIGV2ZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25Ub3VjaEVuZCggZXZlbnQgKSB7XG5cblx0XHR0b3VjaC5jYXB0dXJlZCA9IGZhbHNlO1xuXG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydCBwb2ludGVyIGRvd24gdG8gdG91Y2ggc3RhcnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBvblBvaW50ZXJEb3duKCBldmVudCApIHtcblxuXHRcdGlmKCBldmVudC5wb2ludGVyVHlwZSA9PT0gZXZlbnQuTVNQT0lOVEVSX1RZUEVfVE9VQ0ggfHwgZXZlbnQucG9pbnRlclR5cGUgPT09IFwidG91Y2hcIiApIHtcblx0XHRcdGV2ZW50LnRvdWNoZXMgPSBbeyBjbGllbnRYOiBldmVudC5jbGllbnRYLCBjbGllbnRZOiBldmVudC5jbGllbnRZIH1dO1xuXHRcdFx0b25Ub3VjaFN0YXJ0KCBldmVudCApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnQgcG9pbnRlciBtb3ZlIHRvIHRvdWNoIG1vdmUuXG5cdCAqL1xuXHRmdW5jdGlvbiBvblBvaW50ZXJNb3ZlKCBldmVudCApIHtcblxuXHRcdGlmKCBldmVudC5wb2ludGVyVHlwZSA9PT0gZXZlbnQuTVNQT0lOVEVSX1RZUEVfVE9VQ0ggfHwgZXZlbnQucG9pbnRlclR5cGUgPT09IFwidG91Y2hcIiApICB7XG5cdFx0XHRldmVudC50b3VjaGVzID0gW3sgY2xpZW50WDogZXZlbnQuY2xpZW50WCwgY2xpZW50WTogZXZlbnQuY2xpZW50WSB9XTtcblx0XHRcdG9uVG91Y2hNb3ZlKCBldmVudCApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnQgcG9pbnRlciB1cCB0byB0b3VjaCBlbmQuXG5cdCAqL1xuXHRmdW5jdGlvbiBvblBvaW50ZXJVcCggZXZlbnQgKSB7XG5cblx0XHRpZiggZXZlbnQucG9pbnRlclR5cGUgPT09IGV2ZW50Lk1TUE9JTlRFUl9UWVBFX1RPVUNIIHx8IGV2ZW50LnBvaW50ZXJUeXBlID09PSBcInRvdWNoXCIgKSAge1xuXHRcdFx0ZXZlbnQudG91Y2hlcyA9IFt7IGNsaWVudFg6IGV2ZW50LmNsaWVudFgsIGNsaWVudFk6IGV2ZW50LmNsaWVudFkgfV07XG5cdFx0XHRvblRvdWNoRW5kKCBldmVudCApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgbW91c2Ugd2hlZWwgc2Nyb2xsaW5nLCB0aHJvdHRsZWQgdG8gYXZvaWQgc2tpcHBpbmdcblx0ICogbXVsdGlwbGUgc2xpZGVzLlxuXHQgKi9cblx0ZnVuY3Rpb24gb25Eb2N1bWVudE1vdXNlU2Nyb2xsKCBldmVudCApIHtcblxuXHRcdGlmKCBEYXRlLm5vdygpIC0gbGFzdE1vdXNlV2hlZWxTdGVwID4gNjAwICkge1xuXG5cdFx0XHRsYXN0TW91c2VXaGVlbFN0ZXAgPSBEYXRlLm5vdygpO1xuXG5cdFx0XHR2YXIgZGVsdGEgPSBldmVudC5kZXRhaWwgfHwgLWV2ZW50LndoZWVsRGVsdGE7XG5cdFx0XHRpZiggZGVsdGEgPiAwICkge1xuXHRcdFx0XHRuYXZpZ2F0ZU5leHQoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRuYXZpZ2F0ZVByZXYoKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENsaWNraW5nIG9uIHRoZSBwcm9ncmVzcyBiYXIgcmVzdWx0cyBpbiBhIG5hdmlnYXRpb24gdG8gdGhlXG5cdCAqIGNsb3Nlc3QgYXBwcm94aW1hdGUgaG9yaXpvbnRhbCBzbGlkZSB1c2luZyB0aGlzIGVxdWF0aW9uOlxuXHQgKlxuXHQgKiAoIGNsaWNrWCAvIHByZXNlbnRhdGlvbldpZHRoICkgKiBudW1iZXJPZlNsaWRlc1xuXHQgKi9cblx0ZnVuY3Rpb24gb25Qcm9ncmVzc0NsaWNrZWQoIGV2ZW50ICkge1xuXG5cdFx0b25Vc2VySW5wdXQoIGV2ZW50ICk7XG5cblx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0dmFyIHNsaWRlc1RvdGFsID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApLmxlbmd0aDtcblx0XHR2YXIgc2xpZGVJbmRleCA9IE1hdGguZmxvb3IoICggZXZlbnQuY2xpZW50WCAvIGRvbS53cmFwcGVyLm9mZnNldFdpZHRoICkgKiBzbGlkZXNUb3RhbCApO1xuXG5cdFx0aWYoIGNvbmZpZy5ydGwgKSB7XG5cdFx0XHRzbGlkZUluZGV4ID0gc2xpZGVzVG90YWwgLSBzbGlkZUluZGV4O1xuXHRcdH1cblxuXHRcdHNsaWRlKCBzbGlkZUluZGV4ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBFdmVudCBoYW5kbGVyIGZvciBuYXZpZ2F0aW9uIGNvbnRyb2wgYnV0dG9ucy5cblx0ICovXG5cdGZ1bmN0aW9uIG9uTmF2aWdhdGVMZWZ0Q2xpY2tlZCggZXZlbnQgKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IG9uVXNlcklucHV0KCk7IG5hdmlnYXRlTGVmdCgpOyB9XG5cdGZ1bmN0aW9uIG9uTmF2aWdhdGVSaWdodENsaWNrZWQoIGV2ZW50ICkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBvblVzZXJJbnB1dCgpOyBuYXZpZ2F0ZVJpZ2h0KCk7IH1cblx0ZnVuY3Rpb24gb25OYXZpZ2F0ZVVwQ2xpY2tlZCggZXZlbnQgKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IG9uVXNlcklucHV0KCk7IG5hdmlnYXRlVXAoKTsgfVxuXHRmdW5jdGlvbiBvbk5hdmlnYXRlRG93bkNsaWNrZWQoIGV2ZW50ICkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBvblVzZXJJbnB1dCgpOyBuYXZpZ2F0ZURvd24oKTsgfVxuXHRmdW5jdGlvbiBvbk5hdmlnYXRlUHJldkNsaWNrZWQoIGV2ZW50ICkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBvblVzZXJJbnB1dCgpOyBuYXZpZ2F0ZVByZXYoKTsgfVxuXHRmdW5jdGlvbiBvbk5hdmlnYXRlTmV4dENsaWNrZWQoIGV2ZW50ICkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBvblVzZXJJbnB1dCgpOyBuYXZpZ2F0ZU5leHQoKTsgfVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVyIGZvciB0aGUgd2luZG93IGxldmVsICdoYXNoY2hhbmdlJyBldmVudC5cblx0ICovXG5cdGZ1bmN0aW9uIG9uV2luZG93SGFzaENoYW5nZSggZXZlbnQgKSB7XG5cblx0XHRyZWFkVVJMKCk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVyIGZvciB0aGUgd2luZG93IGxldmVsICdyZXNpemUnIGV2ZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25XaW5kb3dSZXNpemUoIGV2ZW50ICkge1xuXG5cdFx0bGF5b3V0KCk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGUgZm9yIHRoZSB3aW5kb3cgbGV2ZWwgJ3Zpc2liaWxpdHljaGFuZ2UnIGV2ZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25QYWdlVmlzaWJpbGl0eUNoYW5nZSggZXZlbnQgKSB7XG5cblx0XHR2YXIgaXNIaWRkZW4gPSAgZG9jdW1lbnQud2Via2l0SGlkZGVuIHx8XG5cdFx0XHRcdFx0XHRkb2N1bWVudC5tc0hpZGRlbiB8fFxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQuaGlkZGVuO1xuXG5cdFx0Ly8gSWYsIGFmdGVyIGNsaWNraW5nIGEgbGluayBvciBzaW1pbGFyIGFuZCB3ZSdyZSBjb21pbmcgYmFjayxcblx0XHQvLyBmb2N1cyB0aGUgZG9jdW1lbnQuYm9keSB0byBlbnN1cmUgd2UgY2FuIHVzZSBrZXlib2FyZCBzaG9ydGN1dHNcblx0XHRpZiggaXNIaWRkZW4gPT09IGZhbHNlICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGRvY3VtZW50LmJvZHkgKSB7XG5cdFx0XHQvLyBOb3QgYWxsIGVsZW1lbnRzIHN1cHBvcnQgLmJsdXIoKSAtIFNWR3MgYW1vbmcgdGhlbS5cblx0XHRcdGlmKCB0eXBlb2YgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcblx0XHRcdH1cblx0XHRcdGRvY3VtZW50LmJvZHkuZm9jdXMoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBJbnZva2VkIHdoZW4gYSBzbGlkZSBpcyBhbmQgd2UncmUgaW4gdGhlIG92ZXJ2aWV3LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25PdmVydmlld1NsaWRlQ2xpY2tlZCggZXZlbnQgKSB7XG5cblx0XHQvLyBUT0RPIFRoZXJlJ3MgYSBidWcgaGVyZSB3aGVyZSB0aGUgZXZlbnQgbGlzdGVuZXJzIGFyZSBub3Rcblx0XHQvLyByZW1vdmVkIGFmdGVyIGRlYWN0aXZhdGluZyB0aGUgb3ZlcnZpZXcuXG5cdFx0aWYoIGV2ZW50c0FyZUJvdW5kICYmIGlzT3ZlcnZpZXcoKSApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuXG5cdFx0XHR3aGlsZSggZWxlbWVudCAmJiAhZWxlbWVudC5ub2RlTmFtZS5tYXRjaCggL3NlY3Rpb24vZ2kgKSApIHtcblx0XHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIGVsZW1lbnQgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnZGlzYWJsZWQnICkgKSB7XG5cblx0XHRcdFx0ZGVhY3RpdmF0ZU92ZXJ2aWV3KCk7XG5cblx0XHRcdFx0aWYoIGVsZW1lbnQubm9kZU5hbWUubWF0Y2goIC9zZWN0aW9uL2dpICkgKSB7XG5cdFx0XHRcdFx0dmFyIGggPSBwYXJzZUludCggZWxlbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LWgnICksIDEwICksXG5cdFx0XHRcdFx0XHR2ID0gcGFyc2VJbnQoIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC12JyApLCAxMCApO1xuXG5cdFx0XHRcdFx0c2xpZGUoIGgsIHYgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBjbGlja3Mgb24gbGlua3MgdGhhdCBhcmUgc2V0IHRvIHByZXZpZXcgaW4gdGhlXG5cdCAqIGlmcmFtZSBvdmVybGF5LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25QcmV2aWV3TGlua0NsaWNrZWQoIGV2ZW50ICkge1xuXG5cdFx0aWYoIGV2ZW50LmN1cnJlbnRUYXJnZXQgJiYgZXZlbnQuY3VycmVudFRhcmdldC5oYXNBdHRyaWJ1dGUoICdocmVmJyApICkge1xuXHRcdFx0dmFyIHVybCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCAnaHJlZicgKTtcblx0XHRcdGlmKCB1cmwgKSB7XG5cdFx0XHRcdHNob3dQcmV2aWV3KCB1cmwgKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIGNsaWNrIG9uIHRoZSBhdXRvLXNsaWRpbmcgY29udHJvbHMgZWxlbWVudC5cblx0ICovXG5cdGZ1bmN0aW9uIG9uQXV0b1NsaWRlUGxheWVyQ2xpY2soIGV2ZW50ICkge1xuXG5cdFx0Ly8gUmVwbGF5XG5cdFx0aWYoIFJldmVhbC5pc0xhc3RTbGlkZSgpICYmIGNvbmZpZy5sb29wID09PSBmYWxzZSApIHtcblx0XHRcdHNsaWRlKCAwLCAwICk7XG5cdFx0XHRyZXN1bWVBdXRvU2xpZGUoKTtcblx0XHR9XG5cdFx0Ly8gUmVzdW1lXG5cdFx0ZWxzZSBpZiggYXV0b1NsaWRlUGF1c2VkICkge1xuXHRcdFx0cmVzdW1lQXV0b1NsaWRlKCk7XG5cdFx0fVxuXHRcdC8vIFBhdXNlXG5cdFx0ZWxzZSB7XG5cdFx0XHRwYXVzZUF1dG9TbGlkZSgpO1xuXHRcdH1cblxuXHR9XG5cblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBQTEFZQkFDSyBDT01QT05FTlQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdG9yIGZvciB0aGUgcGxheWJhY2sgY29tcG9uZW50LCB3aGljaCBkaXNwbGF5c1xuXHQgKiBwbGF5L3BhdXNlL3Byb2dyZXNzIGNvbnRyb2xzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgVGhlIGNvbXBvbmVudCB3aWxsIGFwcGVuZFxuXHQgKiBpdHNlbGYgdG8gdGhpc1xuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcm9ncmVzc0NoZWNrIEEgbWV0aG9kIHdoaWNoIHdpbGwgYmVcblx0ICogY2FsbGVkIGZyZXF1ZW50bHkgdG8gZ2V0IHRoZSBjdXJyZW50IHByb2dyZXNzIG9uIGEgcmFuZ2Vcblx0ICogb2YgMC0xXG5cdCAqL1xuXHRmdW5jdGlvbiBQbGF5YmFjayggY29udGFpbmVyLCBwcm9ncmVzc0NoZWNrICkge1xuXG5cdFx0Ly8gQ29zbWV0aWNzXG5cdFx0dGhpcy5kaWFtZXRlciA9IDEwMDtcblx0XHR0aGlzLmRpYW1ldGVyMiA9IHRoaXMuZGlhbWV0ZXIvMjtcblx0XHR0aGlzLnRoaWNrbmVzcyA9IDY7XG5cblx0XHQvLyBGbGFncyBpZiB3ZSBhcmUgY3VycmVudGx5IHBsYXlpbmdcblx0XHR0aGlzLnBsYXlpbmcgPSBmYWxzZTtcblxuXHRcdC8vIEN1cnJlbnQgcHJvZ3Jlc3Mgb24gYSAwLTEgcmFuZ2Vcblx0XHR0aGlzLnByb2dyZXNzID0gMDtcblxuXHRcdC8vIFVzZWQgdG8gbG9vcCB0aGUgYW5pbWF0aW9uIHNtb290aGx5XG5cdFx0dGhpcy5wcm9ncmVzc09mZnNldCA9IDE7XG5cblx0XHR0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblx0XHR0aGlzLnByb2dyZXNzQ2hlY2sgPSBwcm9ncmVzc0NoZWNrO1xuXG5cdFx0dGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApO1xuXHRcdHRoaXMuY2FudmFzLmNsYXNzTmFtZSA9ICdwbGF5YmFjayc7XG5cdFx0dGhpcy5jYW52YXMud2lkdGggPSB0aGlzLmRpYW1ldGVyO1xuXHRcdHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMuZGlhbWV0ZXI7XG5cdFx0dGhpcy5jYW52YXMuc3R5bGUud2lkdGggPSB0aGlzLmRpYW1ldGVyMiArICdweCc7XG5cdFx0dGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5kaWFtZXRlcjIgKyAncHgnO1xuXHRcdHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoICcyZCcgKTtcblxuXHRcdHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKCB0aGlzLmNhbnZhcyApO1xuXG5cdFx0dGhpcy5yZW5kZXIoKTtcblxuXHR9XG5cblx0UGxheWJhY2sucHJvdG90eXBlLnNldFBsYXlpbmcgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cblx0XHR2YXIgd2FzUGxheWluZyA9IHRoaXMucGxheWluZztcblxuXHRcdHRoaXMucGxheWluZyA9IHZhbHVlO1xuXG5cdFx0Ly8gU3RhcnQgcmVwYWludGluZyBpZiB3ZSB3ZXJlbid0IGFscmVhZHlcblx0XHRpZiggIXdhc1BsYXlpbmcgJiYgdGhpcy5wbGF5aW5nICkge1xuXHRcdFx0dGhpcy5hbmltYXRlKCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5yZW5kZXIoKTtcblx0XHR9XG5cblx0fTtcblxuXHRQbGF5YmFjay5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIHByb2dyZXNzQmVmb3JlID0gdGhpcy5wcm9ncmVzcztcblxuXHRcdHRoaXMucHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzQ2hlY2soKTtcblxuXHRcdC8vIFdoZW4gd2UgbG9vcCwgb2Zmc2V0IHRoZSBwcm9ncmVzcyBzbyB0aGF0IGl0IGVhc2VzXG5cdFx0Ly8gc21vb3RobHkgcmF0aGVyIHRoYW4gaW1tZWRpYXRlbHkgcmVzZXR0aW5nXG5cdFx0aWYoIHByb2dyZXNzQmVmb3JlID4gMC44ICYmIHRoaXMucHJvZ3Jlc3MgPCAwLjIgKSB7XG5cdFx0XHR0aGlzLnByb2dyZXNzT2Zmc2V0ID0gdGhpcy5wcm9ncmVzcztcblx0XHR9XG5cblx0XHR0aGlzLnJlbmRlcigpO1xuXG5cdFx0aWYoIHRoaXMucGxheWluZyApIHtcblx0XHRcdGZlYXR1cmVzLnJlcXVlc3RBbmltYXRpb25GcmFtZU1ldGhvZC5jYWxsKCB3aW5kb3csIHRoaXMuYW5pbWF0ZS5iaW5kKCB0aGlzICkgKTtcblx0XHR9XG5cblx0fTtcblxuXHQvKipcblx0ICogUmVuZGVycyB0aGUgY3VycmVudCBwcm9ncmVzcyBhbmQgcGxheWJhY2sgc3RhdGUuXG5cdCAqL1xuXHRQbGF5YmFjay5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgcHJvZ3Jlc3MgPSB0aGlzLnBsYXlpbmcgPyB0aGlzLnByb2dyZXNzIDogMCxcblx0XHRcdHJhZGl1cyA9ICggdGhpcy5kaWFtZXRlcjIgKSAtIHRoaXMudGhpY2tuZXNzLFxuXHRcdFx0eCA9IHRoaXMuZGlhbWV0ZXIyLFxuXHRcdFx0eSA9IHRoaXMuZGlhbWV0ZXIyLFxuXHRcdFx0aWNvblNpemUgPSAyODtcblxuXHRcdC8vIEVhc2UgdG93YXJkcyAxXG5cdFx0dGhpcy5wcm9ncmVzc09mZnNldCArPSAoIDEgLSB0aGlzLnByb2dyZXNzT2Zmc2V0ICkgKiAwLjE7XG5cblx0XHR2YXIgZW5kQW5nbGUgPSAoIC0gTWF0aC5QSSAvIDIgKSArICggcHJvZ3Jlc3MgKiAoIE1hdGguUEkgKiAyICkgKTtcblx0XHR2YXIgc3RhcnRBbmdsZSA9ICggLSBNYXRoLlBJIC8gMiApICsgKCB0aGlzLnByb2dyZXNzT2Zmc2V0ICogKCBNYXRoLlBJICogMiApICk7XG5cblx0XHR0aGlzLmNvbnRleHQuc2F2ZSgpO1xuXHRcdHRoaXMuY29udGV4dC5jbGVhclJlY3QoIDAsIDAsIHRoaXMuZGlhbWV0ZXIsIHRoaXMuZGlhbWV0ZXIgKTtcblxuXHRcdC8vIFNvbGlkIGJhY2tncm91bmQgY29sb3Jcblx0XHR0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0dGhpcy5jb250ZXh0LmFyYyggeCwgeSwgcmFkaXVzICsgNCwgMCwgTWF0aC5QSSAqIDIsIGZhbHNlICk7XG5cdFx0dGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICdyZ2JhKCAwLCAwLCAwLCAwLjQgKSc7XG5cdFx0dGhpcy5jb250ZXh0LmZpbGwoKTtcblxuXHRcdC8vIERyYXcgcHJvZ3Jlc3MgdHJhY2tcblx0XHR0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0dGhpcy5jb250ZXh0LmFyYyggeCwgeSwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UgKTtcblx0XHR0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy50aGlja25lc3M7XG5cdFx0dGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gJyM2NjYnO1xuXHRcdHRoaXMuY29udGV4dC5zdHJva2UoKTtcblxuXHRcdGlmKCB0aGlzLnBsYXlpbmcgKSB7XG5cdFx0XHQvLyBEcmF3IHByb2dyZXNzIG9uIHRvcCBvZiB0cmFja1xuXHRcdFx0dGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdFx0dGhpcy5jb250ZXh0LmFyYyggeCwgeSwgcmFkaXVzLCBzdGFydEFuZ2xlLCBlbmRBbmdsZSwgZmFsc2UgKTtcblx0XHRcdHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLnRoaWNrbmVzcztcblx0XHRcdHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9ICcjZmZmJztcblx0XHRcdHRoaXMuY29udGV4dC5zdHJva2UoKTtcblx0XHR9XG5cblx0XHR0aGlzLmNvbnRleHQudHJhbnNsYXRlKCB4IC0gKCBpY29uU2l6ZSAvIDIgKSwgeSAtICggaWNvblNpemUgLyAyICkgKTtcblxuXHRcdC8vIERyYXcgcGxheS9wYXVzZSBpY29uc1xuXHRcdGlmKCB0aGlzLnBsYXlpbmcgKSB7XG5cdFx0XHR0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmYnO1xuXHRcdFx0dGhpcy5jb250ZXh0LmZpbGxSZWN0KCAwLCAwLCBpY29uU2l6ZSAvIDIgLSA0LCBpY29uU2l6ZSApO1xuXHRcdFx0dGhpcy5jb250ZXh0LmZpbGxSZWN0KCBpY29uU2l6ZSAvIDIgKyA0LCAwLCBpY29uU2l6ZSAvIDIgLSA0LCBpY29uU2l6ZSApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRcdHRoaXMuY29udGV4dC50cmFuc2xhdGUoIDQsIDAgKTtcblx0XHRcdHRoaXMuY29udGV4dC5tb3ZlVG8oIDAsIDAgKTtcblx0XHRcdHRoaXMuY29udGV4dC5saW5lVG8oIGljb25TaXplIC0gNCwgaWNvblNpemUgLyAyICk7XG5cdFx0XHR0aGlzLmNvbnRleHQubGluZVRvKCAwLCBpY29uU2l6ZSApO1xuXHRcdFx0dGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICcjZmZmJztcblx0XHRcdHRoaXMuY29udGV4dC5maWxsKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcblxuXHR9O1xuXG5cdFBsYXliYWNrLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uKCB0eXBlLCBsaXN0ZW5lciApIHtcblx0XHR0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UgKTtcblx0fTtcblxuXHRQbGF5YmFjay5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24oIHR5cGUsIGxpc3RlbmVyICkge1xuXHRcdHRoaXMuY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyLCBmYWxzZSApO1xuXHR9O1xuXG5cdFBsYXliYWNrLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG5cblx0XHR0aGlzLnBsYXlpbmcgPSBmYWxzZTtcblxuXHRcdGlmKCB0aGlzLmNhbnZhcy5wYXJlbnROb2RlICkge1xuXHRcdFx0dGhpcy5jb250YWluZXIucmVtb3ZlQ2hpbGQoIHRoaXMuY2FudmFzICk7XG5cdFx0fVxuXG5cdH07XG5cblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gQVBJIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXG5cblx0UmV2ZWFsID0ge1xuXHRcdFZFUlNJT046IFZFUlNJT04sXG5cblx0XHRpbml0aWFsaXplOiBpbml0aWFsaXplLFxuXHRcdGNvbmZpZ3VyZTogY29uZmlndXJlLFxuXHRcdHN5bmM6IHN5bmMsXG5cblx0XHQvLyBOYXZpZ2F0aW9uIG1ldGhvZHNcblx0XHRzbGlkZTogc2xpZGUsXG5cdFx0bGVmdDogbmF2aWdhdGVMZWZ0LFxuXHRcdHJpZ2h0OiBuYXZpZ2F0ZVJpZ2h0LFxuXHRcdHVwOiBuYXZpZ2F0ZVVwLFxuXHRcdGRvd246IG5hdmlnYXRlRG93bixcblx0XHRwcmV2OiBuYXZpZ2F0ZVByZXYsXG5cdFx0bmV4dDogbmF2aWdhdGVOZXh0LFxuXG5cdFx0Ly8gRnJhZ21lbnQgbWV0aG9kc1xuXHRcdG5hdmlnYXRlRnJhZ21lbnQ6IG5hdmlnYXRlRnJhZ21lbnQsXG5cdFx0cHJldkZyYWdtZW50OiBwcmV2aW91c0ZyYWdtZW50LFxuXHRcdG5leHRGcmFnbWVudDogbmV4dEZyYWdtZW50LFxuXG5cdFx0Ly8gRGVwcmVjYXRlZCBhbGlhc2VzXG5cdFx0bmF2aWdhdGVUbzogc2xpZGUsXG5cdFx0bmF2aWdhdGVMZWZ0OiBuYXZpZ2F0ZUxlZnQsXG5cdFx0bmF2aWdhdGVSaWdodDogbmF2aWdhdGVSaWdodCxcblx0XHRuYXZpZ2F0ZVVwOiBuYXZpZ2F0ZVVwLFxuXHRcdG5hdmlnYXRlRG93bjogbmF2aWdhdGVEb3duLFxuXHRcdG5hdmlnYXRlUHJldjogbmF2aWdhdGVQcmV2LFxuXHRcdG5hdmlnYXRlTmV4dDogbmF2aWdhdGVOZXh0LFxuXG5cdFx0Ly8gRm9yY2VzIGFuIHVwZGF0ZSBpbiBzbGlkZSBsYXlvdXRcblx0XHRsYXlvdXQ6IGxheW91dCxcblxuXHRcdC8vIFJhbmRvbWl6ZXMgdGhlIG9yZGVyIG9mIHNsaWRlc1xuXHRcdHNodWZmbGU6IHNodWZmbGUsXG5cblx0XHQvLyBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBhdmFpbGFibGUgcm91dGVzIGFzIGJvb2xlYW5zIChsZWZ0L3JpZ2h0L3RvcC9ib3R0b20pXG5cdFx0YXZhaWxhYmxlUm91dGVzOiBhdmFpbGFibGVSb3V0ZXMsXG5cblx0XHQvLyBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBhdmFpbGFibGUgZnJhZ21lbnRzIGFzIGJvb2xlYW5zIChwcmV2L25leHQpXG5cdFx0YXZhaWxhYmxlRnJhZ21lbnRzOiBhdmFpbGFibGVGcmFnbWVudHMsXG5cblx0XHQvLyBUb2dnbGVzIHRoZSBvdmVydmlldyBtb2RlIG9uL29mZlxuXHRcdHRvZ2dsZU92ZXJ2aWV3OiB0b2dnbGVPdmVydmlldyxcblxuXHRcdC8vIFRvZ2dsZXMgdGhlIFwiYmxhY2sgc2NyZWVuXCIgbW9kZSBvbi9vZmZcblx0XHR0b2dnbGVQYXVzZTogdG9nZ2xlUGF1c2UsXG5cblx0XHQvLyBUb2dnbGVzIHRoZSBhdXRvIHNsaWRlIG1vZGUgb24vb2ZmXG5cdFx0dG9nZ2xlQXV0b1NsaWRlOiB0b2dnbGVBdXRvU2xpZGUsXG5cblx0XHQvLyBTdGF0ZSBjaGVja3Ncblx0XHRpc092ZXJ2aWV3OiBpc092ZXJ2aWV3LFxuXHRcdGlzUGF1c2VkOiBpc1BhdXNlZCxcblx0XHRpc0F1dG9TbGlkaW5nOiBpc0F1dG9TbGlkaW5nLFxuXG5cdFx0Ly8gQWRkcyBvciByZW1vdmVzIGFsbCBpbnRlcm5hbCBldmVudCBsaXN0ZW5lcnMgKHN1Y2ggYXMga2V5Ym9hcmQpXG5cdFx0YWRkRXZlbnRMaXN0ZW5lcnM6IGFkZEV2ZW50TGlzdGVuZXJzLFxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXJzOiByZW1vdmVFdmVudExpc3RlbmVycyxcblxuXHRcdC8vIEZhY2lsaXR5IGZvciBwZXJzaXN0aW5nIGFuZCByZXN0b3JpbmcgdGhlIHByZXNlbnRhdGlvbiBzdGF0ZVxuXHRcdGdldFN0YXRlOiBnZXRTdGF0ZSxcblx0XHRzZXRTdGF0ZTogc2V0U3RhdGUsXG5cblx0XHQvLyBQcmVzZW50YXRpb24gcHJvZ3Jlc3Mgb24gcmFuZ2Ugb2YgMC0xXG5cdFx0Z2V0UHJvZ3Jlc3M6IGdldFByb2dyZXNzLFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgaW5kaWNlcyBvZiB0aGUgY3VycmVudCwgb3Igc3BlY2lmaWVkLCBzbGlkZVxuXHRcdGdldEluZGljZXM6IGdldEluZGljZXMsXG5cblx0XHRnZXRUb3RhbFNsaWRlczogZ2V0VG90YWxTbGlkZXMsXG5cblx0XHQvLyBSZXR1cm5zIHRoZSBzbGlkZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXhcblx0XHRnZXRTbGlkZTogZ2V0U2xpZGUsXG5cblx0XHQvLyBSZXR1cm5zIHRoZSBzbGlkZSBiYWNrZ3JvdW5kIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleFxuXHRcdGdldFNsaWRlQmFja2dyb3VuZDogZ2V0U2xpZGVCYWNrZ3JvdW5kLFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgc3BlYWtlciBub3RlcyBzdHJpbmcgZm9yIGEgc2xpZGUsIG9yIG51bGxcblx0XHRnZXRTbGlkZU5vdGVzOiBnZXRTbGlkZU5vdGVzLFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgcHJldmlvdXMgc2xpZGUgZWxlbWVudCwgbWF5IGJlIG51bGxcblx0XHRnZXRQcmV2aW91c1NsaWRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBwcmV2aW91c1NsaWRlO1xuXHRcdH0sXG5cblx0XHQvLyBSZXR1cm5zIHRoZSBjdXJyZW50IHNsaWRlIGVsZW1lbnRcblx0XHRnZXRDdXJyZW50U2xpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGN1cnJlbnRTbGlkZTtcblx0XHR9LFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgY3VycmVudCBzY2FsZSBvZiB0aGUgcHJlc2VudGF0aW9uIGNvbnRlbnRcblx0XHRnZXRTY2FsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gc2NhbGU7XG5cdFx0fSxcblxuXHRcdC8vIFJldHVybnMgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiBvYmplY3Rcblx0XHRnZXRDb25maWc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGNvbmZpZztcblx0XHR9LFxuXG5cdFx0Ly8gSGVscGVyIG1ldGhvZCwgcmV0cmlldmVzIHF1ZXJ5IHN0cmluZyBhcyBhIGtleS92YWx1ZSBoYXNoXG5cdFx0Z2V0UXVlcnlIYXNoOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBxdWVyeSA9IHt9O1xuXG5cdFx0XHRsb2NhdGlvbi5zZWFyY2gucmVwbGFjZSggL1tBLVowLTldKz89KFtcXHdcXC4lLV0qKS9naSwgZnVuY3Rpb24oYSkge1xuXHRcdFx0XHRxdWVyeVsgYS5zcGxpdCggJz0nICkuc2hpZnQoKSBdID0gYS5zcGxpdCggJz0nICkucG9wKCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEJhc2ljIGRlc2VyaWFsaXphdGlvblxuXHRcdFx0Zm9yKCB2YXIgaSBpbiBxdWVyeSApIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gcXVlcnlbIGkgXTtcblxuXHRcdFx0XHRxdWVyeVsgaSBdID0gZGVzZXJpYWxpemUoIHVuZXNjYXBlKCB2YWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBxdWVyeTtcblx0XHR9LFxuXG5cdFx0Ly8gUmV0dXJucyB0cnVlIGlmIHdlJ3JlIGN1cnJlbnRseSBvbiB0aGUgZmlyc3Qgc2xpZGVcblx0XHRpc0ZpcnN0U2xpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICggaW5kZXhoID09PSAwICYmIGluZGV4diA9PT0gMCApO1xuXHRcdH0sXG5cblx0XHQvLyBSZXR1cm5zIHRydWUgaWYgd2UncmUgY3VycmVudGx5IG9uIHRoZSBsYXN0IHNsaWRlXG5cdFx0aXNMYXN0U2xpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYoIGN1cnJlbnRTbGlkZSApIHtcblx0XHRcdFx0Ly8gRG9lcyB0aGlzIHNsaWRlIGhhcyBuZXh0IGEgc2libGluZz9cblx0XHRcdFx0aWYoIGN1cnJlbnRTbGlkZS5uZXh0RWxlbWVudFNpYmxpbmcgKSByZXR1cm4gZmFsc2U7XG5cblx0XHRcdFx0Ly8gSWYgaXQncyB2ZXJ0aWNhbCwgZG9lcyBpdHMgcGFyZW50IGhhdmUgYSBuZXh0IHNpYmxpbmc/XG5cdFx0XHRcdGlmKCBpc1ZlcnRpY2FsU2xpZGUoIGN1cnJlbnRTbGlkZSApICYmIGN1cnJlbnRTbGlkZS5wYXJlbnROb2RlLm5leHRFbGVtZW50U2libGluZyApIHJldHVybiBmYWxzZTtcblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cblx0XHQvLyBDaGVja3MgaWYgcmV2ZWFsLmpzIGhhcyBiZWVuIGxvYWRlZCBhbmQgaXMgcmVhZHkgZm9yIHVzZVxuXHRcdGlzUmVhZHk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGxvYWRlZDtcblx0XHR9LFxuXG5cdFx0Ly8gRm9yd2FyZCBldmVudCBiaW5kaW5nIHRvIHRoZSByZXZlYWwgRE9NIGVsZW1lbnRcblx0XHRhZGRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiggdHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG5cdFx0XHRpZiggJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdyApIHtcblx0XHRcdFx0KCBkb20ud3JhcHBlciB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnJldmVhbCcgKSApLmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdmVFdmVudExpc3RlbmVyOiBmdW5jdGlvbiggdHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG5cdFx0XHRpZiggJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdyApIHtcblx0XHRcdFx0KCBkb20ud3JhcHBlciB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnJldmVhbCcgKSApLnJlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vIFByb2dyYW1hdGljYWxseSB0cmlnZ2VycyBhIGtleWJvYXJkIGV2ZW50XG5cdFx0dHJpZ2dlcktleTogZnVuY3Rpb24oIGtleUNvZGUgKSB7XG5cdFx0XHRvbkRvY3VtZW50S2V5RG93biggeyBrZXlDb2RlOiBrZXlDb2RlIH0gKTtcblx0XHR9LFxuXG5cdFx0Ly8gUmVnaXN0ZXJzIGEgbmV3IHNob3J0Y3V0IHRvIGluY2x1ZGUgaW4gdGhlIGhlbHAgb3ZlcmxheVxuXHRcdHJlZ2lzdGVyS2V5Ym9hcmRTaG9ydGN1dDogZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XG5cdFx0XHRrZXlib2FyZFNob3J0Y3V0c1trZXldID0gdmFsdWU7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBSZXZlYWw7XG5cbn0pKTtcbiIsInZhciBSZXZlYWwgPSByZXF1aXJlKCdyZXZlYWwuanMnKTtcbnZhciAkID0gcmVxdWlyZSgnamJvbmUnKTtcbnZhciBzbGlkZXMgPSByZXF1aXJlKCcuL2pzL21vZHVsZXMvc2xpZGVzJykuZ2V0U2xpZGVzKCk7XG52YXIgVklERU9fVFlQRSA9IHJlcXVpcmUoJy4vanMvY29uc3RhbnRzLmpzJykuVklERU9fVFlQRTtcbnZhciBBVURJT19UWVBFID0gcmVxdWlyZSgnLi9qcy9jb25zdGFudHMuanMnKS5BVURJT19UWVBFO1xudmFyIEFVRElPX1BBVEggPSByZXF1aXJlKCcuL2pzL2NvbnN0YW50cy5qcycpLkFVRElPX1BBVEg7XG52YXIgRHJhZ2dhYmxlID0gcmVxdWlyZSAoJ0RyYWdnYWJsZScpO1xuXG5cblJldmVhbC5pbml0aWFsaXplKHtcbiAgICB3aWR0aDogMTAwMCxcbiAgICBoZWlnaHQ6IDc0MCxcbiAgICBjZW50ZXI6IGZhbHNlLFxuICAgIGNvbnRyb2xzOiBmYWxzZSxcbiAgICAvL2hpc3Rvcnk6IHRydWUsXG4gICAga2V5Ym9hcmQ6IGZhbHNlXG59KTtcblxudmFyIHN0ZXBJbmRleCA9IDAsXG4gICAgbG9vcEluZGV4ID0gMCxcbiAgICBpc1BsYXlpbmcgPSBmYWxzZSxcbiAgICBtZWRpYUlzUmVhZHkgPSBmYWxzZSxcbiAgICAkYXVkaW8gPSAkKCdhdWRpbycpLFxuICAgICRvdmVybGF5ID0gJCgnI292ZXJsYXknKSxcbiAgICAkcGF1c2VCdG4gPSAkKCcucGF1c2UtYnRuJyk7XG5cblxuXG52YXIgdG9nZ2xlUGxheSAgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIW1lZGlhSXNSZWFkeSkge1xuICAgICAgICBsb2FkaW5nTWVkaWFMb29wKCk7XG4gICAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmKGlzUGxheWluZykgeyAvL3BhdXNlXG4gICAgICAgICRwYXVzZUJ0bi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICRvdmVybGF5LmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICBpc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgY2hhbmdlTWVkaWFTdGF0ZSgncGF1c2UnKTtcbiAgICB9IGVsc2V7IC8vcGxheVxuICAgICAgICAkcGF1c2VCdG4uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBjaGFuZ2VNZWRpYVN0YXRlKCdwbGF5Jyk7XG4gICAgICAgICRvdmVybGF5LmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgIGlzUGxheWluZyA9IHRydWU7XG4gICAgICAgIHBsYXlMb29wKCk7XG4gICAgfVxufTtcblxuJG92ZXJsYXkub24oJ2NsaWNrJywgdG9nZ2xlUGxheSk7XG4kcGF1c2VCdG4ub24oJ2NsaWNrJywgdG9nZ2xlUGxheSk7XG4kKEFVRElPX1RZUEUpWzBdLm9ud2FpdGluZyA9IHRvZ2dsZVBsYXk7XG4kKFZJREVPX1RZUEUpWzBdLm9ud2FpdGluZyA9IHRvZ2dsZVBsYXk7XG5cblxuJCgnLmhvYmJpZXMtbGlzdCBsaScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAkKCcuYmxvY2stMy1zbC00IHVsIGxpJykuZXEoMClcbiAgICAgICAgLmh0bWwoXCJob2JieTogXCIgKyAkKHRoaXMpLmh0bWwoKSlcbiAgICAgICAgLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xufSk7XG5cbiQoJy5qcy15ZXMtYnRuLCAuanMtbm8tYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICQoJy5qcy15ZXMtYnRuLCAuanMtbm8tYnRuJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbn0pO1xuXG4vL3NsaWRlIDhcbiQoJy5zYXZpbmdzLXRhYmxlIHRyJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICQodGhpcykucGFyZW50KCkuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xufSk7XG5cblxuXG52YXIgcGxheUxvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGN1cnJTbGlkZSA9IG51bGw7XG4gICAgY29uc29sZS5sb2cobG9vcEluZGV4KTtcbiAgICBpZiAoaXNQbGF5aW5nICYmIG1lZGlhSXNSZWFkeSkge1xuICAgICAgICBjdXJyU2xpZGUgPSBSZXZlYWwuZ2V0SW5kaWNlcygpLmg7XG5cbiAgICAgICAgaWYgKHNsaWRlc1tjdXJyU2xpZGVdLnN0ZXBzW3N0ZXBJbmRleF0pIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocGxheUxvb3AsIDI1MCk7XG4gICAgICAgICAgICBpZiAoc2xpZGVzW2N1cnJTbGlkZV0uc3RlcHNbc3RlcEluZGV4XS5kZWxheSA9PT0gbG9vcEluZGV4KSB7XG4gICAgICAgICAgICAgICAgLy9sb29wSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIHNsaWRlc1tjdXJyU2xpZGVdLnN0ZXBzW3N0ZXBJbmRleCsrXS5jbWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNle1xuICAgICAgICAgICAgJHBhdXNlQnRuLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBsb29wSW5kZXgrKztcbiAgICB9XG59O1xuXG52YXIgY2hhbmdlTWVkaWFTdGF0ZSA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICB2YXIgbWVkaWFUeXBlID0gc2xpZGVzW1JldmVhbC5nZXRJbmRpY2VzKCkuaF0ubWVkaWFUeXBlO1xuXG4gICAgaWYobWVkaWFUeXBlID09PSBBVURJT19UWVBFKSB7XG4gICAgICAgICRhdWRpb1swXVthY3Rpb25dKCk7XG4gICAgfSBlbHNlIGlmKG1lZGlhVHlwZSA9PT0gVklERU9fVFlQRSkge1xuICAgICAgICAkKFJldmVhbC5nZXRDdXJyZW50U2xpZGUoKSkuZmluZCgndmlkZW8nKVswXVthY3Rpb25dKCk7XG4gICAgfVxufTtcblxudmFyIGxvYWRpbmdNZWRpYUxvb3AgPSBmdW5jdGlvbiAoc2xpZGVJbmRleCkge1xuICAgIGNvbnNvbGUubG9nKFwibG9hZGluZy4uLlwiLCAkYXVkaW9bMF0ucmVhZHlTdGF0ZSApO1xuICAgIHZhciBpbmRleGggPSBzbGlkZUluZGV4IHx8IFJldmVhbC5nZXRJbmRpY2VzKCkuaDtcbiAgICB2YXIgbWVkaWFUeXBlID0gc2xpZGVzW2luZGV4aF0ubWVkaWFUeXBlO1xuXG5cbiAgICBtZWRpYUlzUmVhZHkgPSAobWVkaWFUeXBlID09PSBBVURJT19UWVBFICYmICRhdWRpb1swXS5yZWFkeVN0YXRlID09PSA0KVxuICAgICAgICB8fCAobWVkaWFUeXBlID09PSBWSURFT19UWVBFICYmICAkKFJldmVhbC5nZXRDdXJyZW50U2xpZGUoKSkuZmluZCgndmlkZW8nKVswXS5yZWFkeVN0YXRlID09PSA0KTtcblxuXG4gICAgaWYgKG1lZGlhSXNSZWFkeSkge1xuICAgICAgICBpbmRleGggPiAwICYmIGNoYW5nZU1lZGlhU3RhdGUoJ3BsYXknKTtcbiAgICAgICAgc2V0VGltZW91dChwbGF5TG9vcCwgMjUwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUaW1lb3V0KGxvYWRpbmdNZWRpYUxvb3AsIDI1MCk7XG4gICAgfVxufTtcblxubG9hZGluZ01lZGlhTG9vcCgpO1xuXG5cblxuXG5SZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignc2xpZGVjaGFuZ2VkJywgZnVuY3Rpb24oZSkge1xuICAgIGNvbnNvbGUubG9nKFwiU0xJREUgQ0hBTkdFRFwiKTtcbiAgICAkcGF1c2VCdG4uYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIG1lZGlhSXNSZWFkeSA9IGZhbHNlO1xuICAgIHN0ZXBJbmRleCA9IDA7XG4gICAgbG9vcEluZGV4ID0gMDtcblxuICAgIHZhciBtZWRpYUZpbGVOdW1iZXIgPSBlLmluZGV4aCArIDE7XG4gICAgaWYoc2xpZGVzW2UuaW5kZXhoXS5tZWRpYVR5cGUgPT09IEFVRElPX1RZUEUpIHtcbiAgICAgICAgJGF1ZGlvLmZpbmQoJ3NvdXJjZScpLmF0dHIoJ3NyYycsIEFVRElPX1BBVEggKyBtZWRpYUZpbGVOdW1iZXIgKyBcIi5tcDNcIik7XG5cbiAgICAgICAgJGF1ZGlvWzBdLmxvYWQoKTtcbiAgICB9XG5cbiAgICBsb2FkaW5nTWVkaWFMb29wKGUuaW5kZXhoKTtcbn0pO1xuXG5SZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcigncmVhZHknLCBmdW5jdGlvbigpIHtcbiAgICAkKCcuanMtbG9hZGVyJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbn0pO1xuXG4vL1JldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudHNob3duJywgZnVuY3Rpb24oZSkge1xuLy8gICAgLy92YXIgJGVsID0gJChlLmZyYWdtZW50KTtcbi8vfSk7XG4vL1xuLy9SZXZlYWwuYWRkRXZlbnRMaXN0ZW5lcignZnJhZ21lbnRoaWRkZW4nLCBmdW5jdGlvbihlKSB7XG4vLyAgICAvL3ZhciAkZWwgPSAkKGUuZnJhZ21lbnQpO1xuLy99KTtcblxuJCgnLm5leHQtYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIFJldmVhbC5uZXh0KCk7XG59KTtcblxubmV3IERyYWdnYWJsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWZ1bmQtYmxvY2snKSx7XG4gICAgbGltaXQ6IHtcbiAgICAgICAgeDogWzMwNiwgODY1XSxcbiAgICAgICAgeTogWzAsIDBdXG4gICAgfVxuXG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBBVURJT19UWVBFIDogXCJhdWRpb1wiLFxuICAgIFZJREVPX1RZUEUgOiBcInZpZGVvXCIsXG4gICAgQVVESU9fUEFUSCA6IFwiLi9kYXRhL3BhZ2VcIlxufTtcblxuIiwidmFyIFJldmVhbCA9IHJlcXVpcmUoJ3JldmVhbC5qcycpO1xudmFyICQgPSByZXF1aXJlKCdqYm9uZScpO1xudmFyIFZJREVPX1RZUEUgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMuanMnKS5WSURFT19UWVBFO1xudmFyIEFVRElPX1RZUEUgPSByZXF1aXJlKCcuLi8uLi9jb25zdGFudHMuanMnKS5BVURJT19UWVBFO1xuXG52YXIgc2xpZGVzID0ge1xuICAgIDA6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDE1LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA1MCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTIwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNzgsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IFZJREVPX1RZUEVcbiAgICB9LFxuICAgIDE6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDMyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA4NCwgY21kOiBSZXZlYWwubmV4dH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA5MywgY21kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgUmV2ZWFsLm5leHQoKTsgUmV2ZWFsLm5leHQoKTtcbiAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDExMCwgY21kOiBSZXZlYWwubmV4dH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMjAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEzMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTM5LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNzUsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDI6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDMwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA0MCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNTIsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDY0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA2OCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTAwLCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAzOiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiA5LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAyNCwgY21kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8kKCcuYmxvY2stMS1zbC00IHVsIGxpJykuZXEoMykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgLy8kKCcuYmxvY2stMy1zbC00IHVsIGxpJykuZXEoMClcbiAgICAgICAgICAgICAgICAvLyAgICAuaHRtbChcImhvYmJ5OiBnb2xmaW5nXCIpXG4gICAgICAgICAgICAgICAgLy8gICAgLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgfSB9LFxuICAgICAgICAgICAgeyBkZWxheTogNjAsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDQ6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDE2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNDAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDQ0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA0OCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNTIsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDU2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA3NiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTcyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxODQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE5MCwgY21kOiBSZXZlYWwubmV4dCB9XG4gICAgICAgIF0sXG4gICAgICAgIG1lZGlhVHlwZTogQVVESU9fVFlQRVxuICAgIH0sXG4gICAgNToge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMzMsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDY0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA3NywgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogODAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEwMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTQwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNjQsIGNtZDogUmV2ZWFsLm5leHQgfVxuXG4gICAgICAgIF0sXG4gICAgICAgIG1lZGlhVHlwZTogQVVESU9fVFlQRVxuICAgIH0sXG4gICAgNjoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogNDgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDYwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA4OCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTEyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMzYsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE0MCwgY21kOiBSZXZlYWwubmV4dCB9XG5cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICA3OiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiAzNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNzIsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDg6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDI4LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNjQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEyMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTU2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAyMTIsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDk6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDU2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA4MCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogODYsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDExMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTI4LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMzYsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDEwOiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiAyNCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDMyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNDAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDg0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMTAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEyMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTMyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNzYsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDExOiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiAzNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNDQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDc2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMDgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDExMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTM2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNjgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE4OCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjA0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAyMjAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDMwNCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMzcyLCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAxMjoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogNDQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDY4LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA5NywgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTE0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMzQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE1MywgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjA1LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAyNTQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDI3NywgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjkyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzMDQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDMxNSwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMzI1LCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAxMzoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMTMwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNDAsIGNtZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8vJCgnLmZ1bmQtYmxvY2snKS5hZGRDbGFzcygnbW92ZWQnKTtcbiAgICAgICAgICAgIH19LFxuICAgICAgICAgICAgeyBkZWxheTogMTYxLCBjbWQ6IFJldmVhbC5uZXh0IH1cblxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDE0OiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiAyOCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNTYsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDc2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA5MiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTI0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxOTIsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDIzMiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjg0LCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAxNToge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMjEsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDM5LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA3MCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTAwLCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAxNjoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMTIzLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNDAsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IFZJREVPX1RZUEVcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRTbGlkZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNsaWRlc1xuICAgIH1cbn07Il19

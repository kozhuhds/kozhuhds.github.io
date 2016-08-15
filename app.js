(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var Reveal = require('reveal.js');
var $ = require('jbone');
var slides = require('./js/modules/slides').getSlides();
var VIDEO_TYPE = require('./js/constants.js').VIDEO_TYPE;
var AUDIO_TYPE = require('./js/constants.js').AUDIO_TYPE;
var AUDIO_PATH = require('./js/constants.js').AUDIO_PATH;


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
    $audio = $('audio');



var togglePlay  = function () {
    if(!mediaIsReady) {
        loadingMediaLoop();
        return
    }
    var $overlay = $('#overlay');

    if(isPlaying) { //pause
        $overlay.css('display', 'block');
        isPlaying = false;
        changeMediaState('pause');
    } else{ //play
        changeMediaState('play');
        $overlay.css('display', 'none');
        isPlaying = true;
        playLoop();
    }
};

$(document).on('click', togglePlay);
$(AUDIO_TYPE)[0].onwaiting = togglePlay;
$(VIDEO_TYPE)[0].onwaiting = togglePlay;

//var initMedia = function () {
//    var mediaType = slides[Reveal.getIndices().h].mediaType;
//
//    if(mediaType === AUDIO_TYPE) {
//
//    } else if(mediaType === VIDEO_TYPE) {
//
//    }
//};







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
},{"./js/constants.js":4,"./js/modules/slides":5,"jbone":1,"reveal.js":2}],4:[function(require,module,exports){
module.exports = {
    AUDIO_TYPE : "audio",
    VIDEO_TYPE : "video",
    AUDIO_PATH : "./data/page"
};


},{}],5:[function(require,module,exports){
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
                $('.block-1-sl-4 ul li').eq(3).addClass("active");
                $('.block-3-sl-4 ul li').eq(0)
                    .html("hobby: golfing")
                    .addClass("active");
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
            { delay: 320, cmd: Reveal.next },
            { delay: 352, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    13: {
        steps: [
            { delay: 130, cmd: Reveal.next },
            { delay: 140, cmd: function () {
                $('.fund-block').addClass('moved');
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
},{"../../constants.js":4,"jbone":1,"reveal.js":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvamJvbmUvZGlzdC9qYm9uZS5qcyIsIm5vZGVfbW9kdWxlcy9yZXZlYWwuanMvanMvcmV2ZWFsLmpzIiwic3JjL2FwcC5qcyIsInNyYy9qcy9jb25zdGFudHMuanMiLCJzcmMvanMvbW9kdWxlcy9zbGlkZXMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0aUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeG9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiFcbiAqIGpCb25lIHYxLjIuMCAtIDIwMTYtMDQtMTMgLSBMaWJyYXJ5IGZvciBET00gbWFuaXB1bGF0aW9uXG4gKlxuICogaHR0cDovL2pib25lLmpzLm9yZ1xuICpcbiAqIENvcHlyaWdodCAyMDE2IEFsZXhleSBLdXByaXlhbmVua29cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqL1xuXG4oZnVuY3Rpb24gKHdpbikge1xuXG52YXJcbi8vIGNhY2hlIHByZXZpb3VzIHZlcnNpb25zXG5fJCA9IHdpbi4kLFxuX2pCb25lID0gd2luLmpCb25lLFxuXG4vLyBRdWljayBtYXRjaCBhIHN0YW5kYWxvbmUgdGFnXG5ycXVpY2tTaW5nbGVUYWcgPSAvXjwoXFx3KylcXHMqXFwvPz4kLyxcblxuLy8gQSBzaW1wbGUgd2F5IHRvIGNoZWNrIGZvciBIVE1MIHN0cmluZ3Ncbi8vIFByaW9yaXRpemUgI2lkIG92ZXIgPHRhZz4gdG8gYXZvaWQgWFNTIHZpYSBsb2NhdGlvbi5oYXNoXG5ycXVpY2tFeHByID0gL14oPzpbXiM8XSooPFtcXHdcXFddKz4pW14+XSokfCMoW1xcd1xcLV0qKSQpLyxcblxuLy8gQWxpYXMgZm9yIGZ1bmN0aW9uXG5zbGljZSA9IFtdLnNsaWNlLFxuc3BsaWNlID0gW10uc3BsaWNlLFxua2V5cyA9IE9iamVjdC5rZXlzLFxuXG4vLyBBbGlhcyBmb3IgZ2xvYmFsIHZhcmlhYmxlc1xuZG9jID0gZG9jdW1lbnQsXG5cbmlzU3RyaW5nID0gZnVuY3Rpb24oZWwpIHtcbiAgICByZXR1cm4gdHlwZW9mIGVsID09PSBcInN0cmluZ1wiO1xufSxcbmlzT2JqZWN0ID0gZnVuY3Rpb24oZWwpIHtcbiAgICByZXR1cm4gZWwgaW5zdGFuY2VvZiBPYmplY3Q7XG59LFxuaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgcmV0dXJuICh7fSkudG9TdHJpbmcuY2FsbChlbCkgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcbn0sXG5pc0FycmF5ID0gZnVuY3Rpb24oZWwpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShlbCk7XG59LFxuakJvbmUgPSBmdW5jdGlvbihlbGVtZW50LCBkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBmbi5pbml0KGVsZW1lbnQsIGRhdGEpO1xufSxcbmZuO1xuXG4vLyBzZXQgcHJldmlvdXMgdmFsdWVzIGFuZCByZXR1cm4gdGhlIGluc3RhbmNlIHVwb24gY2FsbGluZyB0aGUgbm8tY29uZmxpY3QgbW9kZVxuakJvbmUubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIHdpbi4kID0gXyQ7XG4gICAgd2luLmpCb25lID0gX2pCb25lO1xuXG4gICAgcmV0dXJuIGpCb25lO1xufTtcblxuZm4gPSBqQm9uZS5mbiA9IGpCb25lLnByb3RvdHlwZSA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihlbGVtZW50LCBkYXRhKSB7XG4gICAgICAgIHZhciBlbGVtZW50cywgdGFnLCB3cmFwZXIsIGZyYWdtZW50O1xuXG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzU3RyaW5nKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgc2luZ2xlIERPTSBlbGVtZW50XG4gICAgICAgICAgICBpZiAodGFnID0gcnF1aWNrU2luZ2xlVGFnLmV4ZWMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzWzBdID0gZG9jLmNyZWF0ZUVsZW1lbnQodGFnWzFdKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxlbmd0aCA9IDE7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdHRyKGRhdGEpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQ3JlYXRlIERPTSBjb2xsZWN0aW9uXG4gICAgICAgICAgICBpZiAoKHRhZyA9IHJxdWlja0V4cHIuZXhlYyhlbGVtZW50KSkgJiYgdGFnWzFdKSB7XG4gICAgICAgICAgICAgICAgZnJhZ21lbnQgPSBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICAgICAgICAgIHdyYXBlciA9IGRvYy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIHdyYXBlci5pbm5lckhUTUwgPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIHdoaWxlICh3cmFwZXIubGFzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKHdyYXBlci5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxlbWVudHMgPSBzbGljZS5jYWxsKGZyYWdtZW50LmNoaWxkTm9kZXMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGpCb25lLm1lcmdlKHRoaXMsIGVsZW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEZpbmQgRE9NIGVsZW1lbnRzIHdpdGggcXVlcnlTZWxlY3RvckFsbFxuICAgICAgICAgICAgaWYgKGpCb25lLmlzRWxlbWVudChkYXRhKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBqQm9uZShkYXRhKS5maW5kKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gakJvbmUubWVyZ2UodGhpcywgZWxlbWVudHMpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFdyYXAgRE9NRWxlbWVudFxuICAgICAgICBpZiAoZWxlbWVudC5ub2RlVHlwZSkge1xuICAgICAgICAgICAgdGhpc1swXSA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB0aGlzLmxlbmd0aCA9IDE7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJ1biBmdW5jdGlvblxuICAgICAgICBpZiAoaXNGdW5jdGlvbihlbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXR1cm4gakJvbmUgZWxlbWVudCBhcyBpc1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIGpCb25lKSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiBlbGVtZW50IHdyYXBwZWQgYnkgakJvbmVcbiAgICAgICAgcmV0dXJuIGpCb25lLm1ha2VBcnJheShlbGVtZW50LCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcG9wOiBbXS5wb3AsXG4gICAgcHVzaDogW10ucHVzaCxcbiAgICByZXZlcnNlOiBbXS5yZXZlcnNlLFxuICAgIHNoaWZ0OiBbXS5zaGlmdCxcbiAgICBzb3J0OiBbXS5zb3J0LFxuICAgIHNwbGljZTogW10uc3BsaWNlLFxuICAgIHNsaWNlOiBbXS5zbGljZSxcbiAgICBpbmRleE9mOiBbXS5pbmRleE9mLFxuICAgIGZvckVhY2g6IFtdLmZvckVhY2gsXG4gICAgdW5zaGlmdDogW10udW5zaGlmdCxcbiAgICBjb25jYXQ6IFtdLmNvbmNhdCxcbiAgICBqb2luOiBbXS5qb2luLFxuICAgIGV2ZXJ5OiBbXS5ldmVyeSxcbiAgICBzb21lOiBbXS5zb21lLFxuICAgIGZpbHRlcjogW10uZmlsdGVyLFxuICAgIG1hcDogW10ubWFwLFxuICAgIHJlZHVjZTogW10ucmVkdWNlLFxuICAgIHJlZHVjZVJpZ2h0OiBbXS5yZWR1Y2VSaWdodCxcbiAgICBsZW5ndGg6IDBcbn07XG5cbmZuLmNvbnN0cnVjdG9yID0gakJvbmU7XG5cbmZuLmluaXQucHJvdG90eXBlID0gZm47XG5cbmpCb25lLnNldElkID0gZnVuY3Rpb24oZWwpIHtcbiAgICB2YXIgamlkID0gZWwuamlkO1xuXG4gICAgaWYgKGVsID09PSB3aW4pIHtcbiAgICAgICAgamlkID0gXCJ3aW5kb3dcIjtcbiAgICB9IGVsc2UgaWYgKGVsLmppZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGVsLmppZCA9IGppZCA9ICsrakJvbmUuX2NhY2hlLmppZDtcbiAgICB9XG5cbiAgICBpZiAoIWpCb25lLl9jYWNoZS5ldmVudHNbamlkXSkge1xuICAgICAgICBqQm9uZS5fY2FjaGUuZXZlbnRzW2ppZF0gPSB7fTtcbiAgICB9XG59O1xuXG5qQm9uZS5nZXREYXRhID0gZnVuY3Rpb24oZWwpIHtcbiAgICBlbCA9IGVsIGluc3RhbmNlb2YgakJvbmUgPyBlbFswXSA6IGVsO1xuXG4gICAgdmFyIGppZCA9IGVsID09PSB3aW4gPyBcIndpbmRvd1wiIDogZWwuamlkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgamlkOiBqaWQsXG4gICAgICAgIGV2ZW50czogakJvbmUuX2NhY2hlLmV2ZW50c1tqaWRdXG4gICAgfTtcbn07XG5cbmpCb25lLmlzRWxlbWVudCA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgcmV0dXJuIGVsICYmIGVsIGluc3RhbmNlb2YgakJvbmUgfHwgZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fCBpc1N0cmluZyhlbCk7XG59O1xuXG5qQm9uZS5fY2FjaGUgPSB7XG4gICAgZXZlbnRzOiB7fSxcbiAgICBqaWQ6IDBcbn07XG5cbmZ1bmN0aW9uIGlzQXJyYXlsaWtlKG9iaikge1xuICAgIHZhciBsZW5ndGggPSBvYmoubGVuZ3RoLFxuICAgICAgICB0eXBlID0gdHlwZW9mIG9iajtcblxuICAgIGlmIChpc0Z1bmN0aW9uKHR5cGUpIHx8IG9iaiA9PT0gd2luKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAob2JqLm5vZGVUeXBlID09PSAxICYmIGxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXNBcnJheSh0eXBlKSB8fCBsZW5ndGggPT09IDAgfHxcbiAgICAgICAgdHlwZW9mIGxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJiBsZW5ndGggPiAwICYmIChsZW5ndGggLSAxKSBpbiBvYmo7XG59XG5cbmZuLnB1c2hTdGFjayA9IGZ1bmN0aW9uKGVsZW1zKSB7XG4gICAgdmFyIHJldCA9IGpCb25lLm1lcmdlKHRoaXMuY29uc3RydWN0b3IoKSwgZWxlbXMpO1xuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cbmpCb25lLm1lcmdlID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xuICAgIHZhciBsID0gc2Vjb25kLmxlbmd0aCxcbiAgICAgICAgaSA9IGZpcnN0Lmxlbmd0aCxcbiAgICAgICAgaiA9IDA7XG5cbiAgICB3aGlsZSAoaiA8IGwpIHtcbiAgICAgICAgZmlyc3RbaSsrXSA9IHNlY29uZFtqKytdO1xuICAgIH1cblxuICAgIGZpcnN0Lmxlbmd0aCA9IGk7XG5cbiAgICByZXR1cm4gZmlyc3Q7XG59O1xuXG5qQm9uZS5jb250YWlucyA9IGZ1bmN0aW9uKGNvbnRhaW5lciwgY29udGFpbmVkKSB7XG4gICAgcmV0dXJuIGNvbnRhaW5lci5jb250YWlucyhjb250YWluZWQpO1xufTtcblxuakJvbmUuZXh0ZW5kID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgdmFyIHRnO1xuXG4gICAgc3BsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgICAgICB0ZyA9IHRhcmdldDsgLy9jYWNoaW5nIHRhcmdldCBmb3IgcGVyZiBpbXByb3ZlbWVudFxuXG4gICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgICAgICAgdGdbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuXG5qQm9uZS5tYWtlQXJyYXkgPSBmdW5jdGlvbihhcnIsIHJlc3VsdHMpIHtcbiAgICB2YXIgcmV0ID0gcmVzdWx0cyB8fCBbXTtcblxuICAgIGlmIChhcnIgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKGlzQXJyYXlsaWtlKGFycikpIHtcbiAgICAgICAgICAgIGpCb25lLm1lcmdlKHJldCwgaXNTdHJpbmcoYXJyKSA/IFthcnJdIDogYXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldC5wdXNoKGFycik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufTtcblxuakJvbmUudW5pcXVlID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICBpZiAoYXJyYXkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2ldO1xuICAgICAgICBpZiAocmVzdWx0LmluZGV4T2YodmFsdWUpIDwgMCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5mdW5jdGlvbiBCb25lRXZlbnQoZSwgZGF0YSkge1xuICAgIHZhciBrZXksIHNldHRlcjtcblxuICAgIHRoaXMub3JpZ2luYWxFdmVudCA9IGU7XG5cbiAgICBzZXR0ZXIgPSBmdW5jdGlvbihrZXksIGUpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJwcmV2ZW50RGVmYXVsdFwiKSB7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBlW2tleV0oKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblwiKSB7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVba2V5XSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKGVba2V5XSkpIHtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBlW2tleV0oKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSBlW2tleV07XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZm9yIChrZXkgaW4gZSkge1xuICAgICAgICBpZiAoZVtrZXldIHx8IHR5cGVvZiBlW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgc2V0dGVyLmNhbGwodGhpcywga2V5LCBlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGpCb25lLmV4dGVuZCh0aGlzLCBkYXRhLCB7XG4gICAgICAgIGlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuaW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmpCb25lLkV2ZW50ID0gZnVuY3Rpb24oZXZlbnQsIGRhdGEpIHtcbiAgICB2YXIgbmFtZXNwYWNlLCBldmVudFR5cGU7XG5cbiAgICBpZiAoZXZlbnQudHlwZSAmJiAhZGF0YSkge1xuICAgICAgICBkYXRhID0gZXZlbnQ7XG4gICAgICAgIGV2ZW50ID0gZXZlbnQudHlwZTtcbiAgICB9XG5cbiAgICBuYW1lc3BhY2UgPSBldmVudC5zcGxpdChcIi5cIikuc3BsaWNlKDEpLmpvaW4oXCIuXCIpO1xuICAgIGV2ZW50VHlwZSA9IGV2ZW50LnNwbGl0KFwiLlwiKVswXTtcblxuICAgIGV2ZW50ID0gZG9jLmNyZWF0ZUV2ZW50KFwiRXZlbnRcIik7XG4gICAgZXZlbnQuaW5pdEV2ZW50KGV2ZW50VHlwZSwgdHJ1ZSwgdHJ1ZSk7XG5cbiAgICByZXR1cm4gakJvbmUuZXh0ZW5kKGV2ZW50LCB7XG4gICAgICAgIG5hbWVzcGFjZTogbmFtZXNwYWNlLFxuICAgICAgICBpc0RlZmF1bHRQcmV2ZW50ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQ7XG4gICAgICAgIH1cbiAgICB9LCBkYXRhKTtcbn07XG5cbmpCb25lLmV2ZW50ID0ge1xuXG4gICAgLyoqXG4gICAgICogQXR0YWNoIGEgaGFuZGxlciB0byBhbiBldmVudCBmb3IgdGhlIGVsZW1lbnRzXG4gICAgICogQHBhcmFtIHtOb2RlfSAgICAgICAgZWwgICAgICAgICAtIEV2ZW50cyB3aWxsIGJlIGF0dGFjaGVkIHRvIHRoaXMgRE9NIE5vZGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICB0eXBlcyAgICAgIC0gT25lIG9yIG1vcmUgc3BhY2Utc2VwYXJhdGVkIGV2ZW50IHR5cGVzIGFuZCBvcHRpb25hbCBuYW1lc3BhY2VzXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gICAgaGFuZGxlciAgICAtIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gICAgICBbZGF0YV0gICAgIC0gRGF0YSB0byBiZSBwYXNzZWQgdG8gdGhlIGhhbmRsZXIgaW4gZXZlbnQuZGF0YVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgICAgIFtzZWxlY3Rvcl0gLSBBIHNlbGVjdG9yIHN0cmluZyB0byBmaWx0ZXIgdGhlIGRlc2NlbmRhbnRzIG9mIHRoZSBzZWxlY3RlZCBlbGVtZW50c1xuICAgICAqL1xuICAgIGFkZDogZnVuY3Rpb24oZWwsIHR5cGVzLCBoYW5kbGVyLCBkYXRhLCBzZWxlY3Rvcikge1xuICAgICAgICBqQm9uZS5zZXRJZChlbCk7XG5cbiAgICAgICAgdmFyIGV2ZW50SGFuZGxlciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBqQm9uZS5ldmVudC5kaXNwYXRjaC5jYWxsKGVsLCBlKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudHMgPSBqQm9uZS5nZXREYXRhKGVsKS5ldmVudHMsXG4gICAgICAgICAgICBldmVudFR5cGUsIHQsIGV2ZW50O1xuXG4gICAgICAgIHR5cGVzID0gdHlwZXMuc3BsaXQoXCIgXCIpO1xuICAgICAgICB0ID0gdHlwZXMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAodC0tKSB7XG4gICAgICAgICAgICBldmVudCA9IHR5cGVzW3RdO1xuXG4gICAgICAgICAgICBldmVudFR5cGUgPSBldmVudC5zcGxpdChcIi5cIilbMF07XG4gICAgICAgICAgICBldmVudHNbZXZlbnRUeXBlXSA9IGV2ZW50c1tldmVudFR5cGVdIHx8IFtdO1xuXG4gICAgICAgICAgICBpZiAoZXZlbnRzW2V2ZW50VHlwZV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgLy8gb3ZlcnJpZGUgd2l0aCBwcmV2aW91cyBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICAgICAgZXZlbnRIYW5kbGVyID0gZXZlbnRzW2V2ZW50VHlwZV1bMF0uZm47XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIgJiYgZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGV2ZW50SGFuZGxlciwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudHNbZXZlbnRUeXBlXS5wdXNoKHtcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U6IGV2ZW50LnNwbGl0KFwiLlwiKS5zcGxpY2UoMSkuam9pbihcIi5cIiksXG4gICAgICAgICAgICAgICAgZm46IGV2ZW50SGFuZGxlcixcbiAgICAgICAgICAgICAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICBvcmlnaW5mbjogaGFuZGxlclxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFuIGV2ZW50IGhhbmRsZXJcbiAgICAgKiBAcGFyYW0gIHtOb2RlfSAgICAgICBlbCAgICAgICAgLSBFdmVudHMgd2lsbCBiZSBkZWF0dGFjaGVkIGZyb20gdGhpcyBET00gTm9kZVxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gICAgIHR5cGVzICAgICAtIE9uZSBvciBtb3JlIHNwYWNlLXNlcGFyYXRlZCBldmVudCB0eXBlcyBhbmQgb3B0aW9uYWwgbmFtZXNwYWNlc1xuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgIGhhbmRsZXIgICAtIEEgaGFuZGxlciBmdW5jdGlvbiBwcmV2aW91c2x5IGF0dGFjaGVkIGZvciB0aGUgZXZlbnQocylcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICBbc2VsZWN0b3JdIC0gQSBzZWxlY3RvciBzdHJpbmcgdG8gZmlsdGVyIHRoZSBkZXNjZW5kYW50cyBvZiB0aGUgc2VsZWN0ZWQgZWxlbWVudHNcbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKGVsLCB0eXBlcywgaGFuZGxlciwgc2VsZWN0b3IpIHtcbiAgICAgICAgdmFyIHJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnRzLCBldmVudFR5cGUsIGluZGV4LCBlbCwgZSkge1xuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFjaztcblxuICAgICAgICAgICAgICAgIC8vIGdldCBjYWxsYmFja1xuICAgICAgICAgICAgICAgIGlmICgoaGFuZGxlciAmJiBlLm9yaWdpbmZuID09PSBoYW5kbGVyKSB8fCAhaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGUuZm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50c1tldmVudFR5cGVdW2luZGV4XS5mbiA9PT0gY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGhhbmRsZXIgZnJvbSBjYWNoZVxuICAgICAgICAgICAgICAgICAgICBldmVudHNbZXZlbnRUeXBlXS5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZXZlbnRzW2V2ZW50VHlwZV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50cyA9IGpCb25lLmdldERhdGEoZWwpLmV2ZW50cyxcbiAgICAgICAgICAgIGwsXG4gICAgICAgICAgICBldmVudHNCeVR5cGU7XG5cbiAgICAgICAgaWYgKCFldmVudHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlbW92ZSBhbGwgZXZlbnRzXG4gICAgICAgIGlmICghdHlwZXMgJiYgZXZlbnRzKSB7XG4gICAgICAgICAgICByZXR1cm4ga2V5cyhldmVudHMpLmZvckVhY2goZnVuY3Rpb24oZXZlbnRUeXBlKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRzQnlUeXBlID0gZXZlbnRzW2V2ZW50VHlwZV07XG4gICAgICAgICAgICAgICAgbCA9IGV2ZW50c0J5VHlwZS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB3aGlsZShsLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoZXZlbnRzLCBldmVudFR5cGUsIGwsIGVsLCBldmVudHNCeVR5cGVbbF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdHlwZXMuc3BsaXQoXCIgXCIpLmZvckVhY2goZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICAgICAgICB2YXIgZXZlbnRUeXBlID0gZXZlbnROYW1lLnNwbGl0KFwiLlwiKVswXSxcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2UgPSBldmVudE5hbWUuc3BsaXQoXCIuXCIpLnNwbGljZSgxKS5qb2luKFwiLlwiKSxcbiAgICAgICAgICAgICAgICBlO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgbmFtZWQgZXZlbnRzXG4gICAgICAgICAgICBpZiAoZXZlbnRzW2V2ZW50VHlwZV0pIHtcbiAgICAgICAgICAgICAgICBldmVudHNCeVR5cGUgPSBldmVudHNbZXZlbnRUeXBlXTtcbiAgICAgICAgICAgICAgICBsID0gZXZlbnRzQnlUeXBlLmxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHdoaWxlKGwtLSkge1xuICAgICAgICAgICAgICAgICAgICBlID0gZXZlbnRzQnlUeXBlW2xdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoKCFuYW1lc3BhY2UgfHwgKG5hbWVzcGFjZSAmJiBlLm5hbWVzcGFjZSA9PT0gbmFtZXNwYWNlKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICghc2VsZWN0b3IgIHx8IChzZWxlY3RvciAgJiYgZS5zZWxlY3RvciA9PT0gc2VsZWN0b3IpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTGlzdGVuZXIoZXZlbnRzLCBldmVudFR5cGUsIGwsIGVsLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlbW92ZSBhbGwgbmFtZXNwYWNlZCBldmVudHNcbiAgICAgICAgICAgIGVsc2UgaWYgKG5hbWVzcGFjZSkge1xuICAgICAgICAgICAgICAgIGtleXMoZXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudHNCeVR5cGUgPSBldmVudHNbZXZlbnRUeXBlXTtcbiAgICAgICAgICAgICAgICAgICAgbCA9IGV2ZW50c0J5VHlwZS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUobC0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlID0gZXZlbnRzQnlUeXBlW2xdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGUubmFtZXNwYWNlLnNwbGl0KFwiLlwiKVswXSA9PT0gbmFtZXNwYWNlLnNwbGl0KFwiLlwiKVswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGV2ZW50cywgZXZlbnRUeXBlLCBsLCBlbCwgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgYWxsIGhhbmRsZXJzIGFuZCBiZWhhdmlvcnMgYXR0YWNoZWQgdG8gdGhlIG1hdGNoZWQgZWxlbWVudHMgZm9yIHRoZSBnaXZlbiBldmVudCB0eXBlLlxuICAgICAqIEBwYXJhbSAge05vZGV9ICAgICAgIGVsICAgICAgIC0gRXZlbnRzIHdpbGwgYmUgdHJpZ2dlcmVkIGZvciB0aGllIERPTSBOb2RlXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSAgICAgZXZlbnQgICAgLSBPbmUgb3IgbW9yZSBzcGFjZS1zZXBhcmF0ZWQgZXZlbnQgdHlwZXMgYW5kIG9wdGlvbmFsIG5hbWVzcGFjZXNcbiAgICAgKi9cbiAgICB0cmlnZ2VyOiBmdW5jdGlvbihlbCwgZXZlbnQpIHtcbiAgICAgICAgdmFyIGV2ZW50cyA9IFtdO1xuXG4gICAgICAgIGlmIChpc1N0cmluZyhldmVudCkpIHtcbiAgICAgICAgICAgIGV2ZW50cyA9IGV2ZW50LnNwbGl0KFwiIFwiKS5tYXAoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gakJvbmUuRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBldmVudCA9IGV2ZW50IGluc3RhbmNlb2YgRXZlbnQgPyBldmVudCA6IGpCb25lLkV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgIGV2ZW50cyA9IFtldmVudF07XG4gICAgICAgIH1cblxuICAgICAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKCFldmVudC50eXBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50ICYmIGVsLmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZGlzcGF0Y2g6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGkgPSAwLFxuICAgICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgICBlbCA9IHRoaXMsXG4gICAgICAgICAgICBoYW5kbGVycyA9IGpCb25lLmdldERhdGEoZWwpLmV2ZW50c1tlLnR5cGVdLFxuICAgICAgICAgICAgbGVuZ3RoID0gaGFuZGxlcnMubGVuZ3RoLFxuICAgICAgICAgICAgaGFuZGxlclF1ZXVlID0gW10sXG4gICAgICAgICAgICB0YXJnZXRzID0gW10sXG4gICAgICAgICAgICBsLFxuICAgICAgICAgICAgZXhwZWN0ZWRUYXJnZXQsXG4gICAgICAgICAgICBoYW5kbGVyLFxuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICBldmVudE9wdGlvbnM7XG5cbiAgICAgICAgLy8gY2FjaGUgYWxsIGV2ZW50cyBoYW5kbGVycywgZml4IGlzc3VlIHdpdGggbXVsdGlwbGUgaGFuZGxlcnMgKGlzc3VlICM0NSlcbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaGFuZGxlclF1ZXVlLnB1c2goaGFuZGxlcnNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaSA9IDA7XG4gICAgICAgIGxlbmd0aCA9IGhhbmRsZXJRdWV1ZS5sZW5ndGg7XG5cbiAgICAgICAgZm9yICg7XG4gICAgICAgICAgICAvLyBpZiBldmVudCBleGlzdHNcbiAgICAgICAgICAgIGkgPCBsZW5ndGggJiZcbiAgICAgICAgICAgIC8vIGlmIGhhbmRsZXIgaXMgbm90IHJlbW92ZWQgZnJvbSBzdGFja1xuICAgICAgICAgICAgfmhhbmRsZXJzLmluZGV4T2YoaGFuZGxlclF1ZXVlW2ldKSAmJlxuICAgICAgICAgICAgLy8gaWYgcHJvcGFnYXRpb24gaXMgbm90IHN0b3BwZWRcbiAgICAgICAgICAgICEoZXZlbnQgJiYgZXZlbnQuaXNJbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQoKSk7XG4gICAgICAgIGkrKykge1xuICAgICAgICAgICAgZXhwZWN0ZWRUYXJnZXQgPSBudWxsO1xuICAgICAgICAgICAgZXZlbnRPcHRpb25zID0ge307XG4gICAgICAgICAgICBoYW5kbGVyID0gaGFuZGxlclF1ZXVlW2ldO1xuICAgICAgICAgICAgaGFuZGxlci5kYXRhICYmIChldmVudE9wdGlvbnMuZGF0YSA9IGhhbmRsZXIuZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIGV2ZW50IGhhbmRsZXIgd2l0aG91dCBzZWxlY3RvclxuICAgICAgICAgICAgaWYgKCFoYW5kbGVyLnNlbGVjdG9yKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQgPSBuZXcgQm9uZUV2ZW50KGUsIGV2ZW50T3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShlLm5hbWVzcGFjZSAmJiBlLm5hbWVzcGFjZSAhPT0gaGFuZGxlci5uYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIub3JpZ2luZm4uY2FsbChlbCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGV2ZW50IGhhbmRsZXIgd2l0aCBzZWxlY3RvclxuICAgICAgICAgICAgZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgLy8gaWYgdGFyZ2V0IGFuZCBzZWxlY3RlZCBlbGVtZW50IHRoZSBzYW1lXG4gICAgICAgICAgICAgICAgfih0YXJnZXRzID0gakJvbmUoZWwpLmZpbmQoaGFuZGxlci5zZWxlY3RvcikpLmluZGV4T2YoZS50YXJnZXQpICYmIChleHBlY3RlZFRhcmdldCA9IGUudGFyZ2V0KSB8fFxuICAgICAgICAgICAgICAgIC8vIGlmIG9uZSBvZiBlbGVtZW50IG1hdGNoZWQgd2l0aCBzZWxlY3RvciBjb250YWlucyB0YXJnZXRcbiAgICAgICAgICAgICAgICAoZWwgIT09IGUudGFyZ2V0ICYmIGVsLmNvbnRhaW5zKGUudGFyZ2V0KSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIGdldCBlbGVtZW50IG1hdGNoZWQgd2l0aCBzZWxlY3RvclxuICAgICAgICAgICAgICAgIGlmICghZXhwZWN0ZWRUYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgbCA9IHRhcmdldHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBqID0gMDtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldHNbal0gJiYgdGFyZ2V0c1tqXS5jb250YWlucyhlLnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZFRhcmdldCA9IHRhcmdldHNbal07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIWV4cGVjdGVkVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGV2ZW50T3B0aW9ucy5jdXJyZW50VGFyZ2V0ID0gZXhwZWN0ZWRUYXJnZXQ7XG4gICAgICAgICAgICAgICAgZXZlbnQgPSBuZXcgQm9uZUV2ZW50KGUsIGV2ZW50T3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIShlLm5hbWVzcGFjZSAmJiBlLm5hbWVzcGFjZSAhPT0gaGFuZGxlci5uYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZXIub3JpZ2luZm4uY2FsbChleHBlY3RlZFRhcmdldCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZuLm9uID0gZnVuY3Rpb24odHlwZXMsIHNlbGVjdG9yLCBkYXRhLCBmbikge1xuICAgIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgaSA9IDA7XG5cbiAgICBpZiAoZGF0YSA9PSBudWxsICYmIGZuID09IG51bGwpIHtcbiAgICAgICAgLy8gKHR5cGVzLCBmbilcbiAgICAgICAgZm4gPSBzZWxlY3RvcjtcbiAgICAgICAgZGF0YSA9IHNlbGVjdG9yID0gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSBpZiAoZm4gPT0gbnVsbCkge1xuICAgICAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAvLyAodHlwZXMsIHNlbGVjdG9yLCBmbilcbiAgICAgICAgICAgIGZuID0gZGF0YTtcbiAgICAgICAgICAgIGRhdGEgPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAodHlwZXMsIGRhdGEsIGZuKVxuICAgICAgICAgICAgZm4gPSBkYXRhO1xuICAgICAgICAgICAgZGF0YSA9IHNlbGVjdG9yO1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWZuKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgakJvbmUuZXZlbnQuYWRkKHRoaXNbaV0sIHR5cGVzLCBmbiwgZGF0YSwgc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4ub25lID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBvbmVBcmdzID0gc2xpY2UuY2FsbChhcmdzLCAxLCBhcmdzLmxlbmd0aCAtIDEpLFxuICAgICAgICBjYWxsYmFjayA9IHNsaWNlLmNhbGwoYXJncywgLTEpWzBdLFxuICAgICAgICBhZGRMaXN0ZW5lcjtcblxuICAgIGFkZExpc3RlbmVyID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdmFyICRlbCA9IGpCb25lKGVsKTtcblxuICAgICAgICBldmVudC5zcGxpdChcIiBcIikuZm9yRWFjaChmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGZuID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICRlbC5vZmYoZXZlbnQsIGZuKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKGVsLCBlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICRlbC5vbi5hcHBseSgkZWwsIFtldmVudF0uY29uY2F0KG9uZUFyZ3MsIGZuKSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFkZExpc3RlbmVyKHRoaXNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4udHJpZ2dlciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGlmICghZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBqQm9uZS5ldmVudC50cmlnZ2VyKHRoaXNbaV0sIGV2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLm9mZiA9IGZ1bmN0aW9uKHR5cGVzLCBzZWxlY3RvciwgaGFuZGxlcikge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICBpZiAoaXNGdW5jdGlvbihzZWxlY3RvcikpIHtcbiAgICAgICAgaGFuZGxlciA9IHNlbGVjdG9yO1xuICAgICAgICBzZWxlY3RvciA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGpCb25lLmV2ZW50LnJlbW92ZSh0aGlzW2ldLCB0eXBlcywgaGFuZGxlciwgc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4uZmluZCA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXSxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBmaW5kZXIgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24oZWwucXVlcnlTZWxlY3RvckFsbCkpIHtcbiAgICAgICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvciksIGZ1bmN0aW9uKGZvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChmb3VuZCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZpbmRlcih0aGlzW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gakJvbmUocmVzdWx0cyk7XG59O1xuXG5mbi5nZXQgPSBmdW5jdGlvbihpbmRleCkge1xuICAgIHJldHVybiBpbmRleCAhPSBudWxsID9cblxuICAgICAgICAvLyBSZXR1cm4ganVzdCBvbmUgZWxlbWVudCBmcm9tIHRoZSBzZXRcbiAgICAgICAgKGluZGV4IDwgMCA/IHRoaXNbaW5kZXggKyB0aGlzLmxlbmd0aF0gOiB0aGlzW2luZGV4XSkgOlxuXG4gICAgICAgIC8vIFJldHVybiBhbGwgdGhlIGVsZW1lbnRzIGluIGEgY2xlYW4gYXJyYXlcbiAgICAgICAgc2xpY2UuY2FsbCh0aGlzKTtcbn07XG5cbmZuLmVxID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gakJvbmUodGhpc1tpbmRleF0pO1xufTtcblxuZm4ucGFyZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3VsdHMgPSBbXSxcbiAgICAgICAgcGFyZW50LFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghfnJlc3VsdHMuaW5kZXhPZihwYXJlbnQgPSB0aGlzW2ldLnBhcmVudEVsZW1lbnQpICYmIHBhcmVudCkge1xuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHBhcmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gakJvbmUocmVzdWx0cyk7XG59O1xuXG5mbi50b0FycmF5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHNsaWNlLmNhbGwodGhpcyk7XG59O1xuXG5mbi5pcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgcmV0dXJuIHRoaXMuc29tZShmdW5jdGlvbihlbCkge1xuICAgICAgICByZXR1cm4gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBhcmdzWzBdO1xuICAgIH0pO1xufTtcblxuZm4uaGFzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICByZXR1cm4gdGhpcy5zb21lKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHJldHVybiBlbC5xdWVyeVNlbGVjdG9yQWxsKGFyZ3NbMF0pLmxlbmd0aDtcbiAgICB9KTtcbn07XG5cbmZuLmFkZCA9IGZ1bmN0aW9uKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMucHVzaFN0YWNrKFxuICAgICAgICBqQm9uZS51bmlxdWUoXG4gICAgICAgICAgICBqQm9uZS5tZXJnZSh0aGlzLmdldCgpLCBqQm9uZShzZWxlY3RvciwgY29udGV4dCkpXG4gICAgICAgIClcbiAgICApO1xufTtcblxuZm4uYXR0ciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBzZXR0ZXI7XG5cbiAgICBpZiAoaXNTdHJpbmcoa2V5KSAmJiBhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gdGhpc1swXSAmJiB0aGlzWzBdLmdldEF0dHJpYnV0ZShrZXkpO1xuICAgIH1cblxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBzZXR0ZXIgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgICAgICB9O1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3Qoa2V5KSkge1xuICAgICAgICBzZXR0ZXIgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAga2V5cyhrZXkpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShuYW1lLCBrZXlbbmFtZV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBzZXR0ZXIodGhpc1tpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5yZW1vdmVBdHRyID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpc1tpXS5yZW1vdmVBdHRyaWJ1dGUoa2V5KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLnZhbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzWzBdICYmIHRoaXNbMF0udmFsdWU7XG4gICAgfVxuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB0aGlzW2ldLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5jc3MgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgc2V0dGVyO1xuXG4gICAgLy8gR2V0IGF0dHJpYnV0ZVxuICAgIGlmIChpc1N0cmluZyhrZXkpICYmIGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiB0aGlzWzBdICYmIHdpbi5nZXRDb21wdXRlZFN0eWxlKHRoaXNbMF0pW2tleV07XG4gICAgfVxuXG4gICAgLy8gU2V0IGF0dHJpYnV0ZXNcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgc2V0dGVyID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGVsLnN0eWxlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGtleSkpIHtcbiAgICAgICAgc2V0dGVyID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGtleXMoa2V5KS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBlbC5zdHlsZVtuYW1lXSA9IGtleVtuYW1lXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2V0dGVyKHRoaXNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4uZGF0YSA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cywgZGF0YSA9IHt9LFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIHNldHRlcixcbiAgICAgICAgc2V0VmFsdWUgPSBmdW5jdGlvbihlbCwga2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGVsLmpkYXRhID0gZWwuamRhdGEgfHwge307XG4gICAgICAgICAgICAgICAgZWwuamRhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbC5kYXRhc2V0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VmFsdWUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlID09PSBcInRydWVcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAvLyBHZXQgYWxsIGRhdGFcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpc1swXS5qZGF0YSAmJiAoZGF0YSA9IHRoaXNbMF0uamRhdGEpO1xuXG4gICAgICAgIGtleXModGhpc1swXS5kYXRhc2V0KS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgZGF0YVtrZXldID0gZ2V0VmFsdWUodGhpc1swXS5kYXRhc2V0W2tleV0pO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgLy8gR2V0IGRhdGEgYnkgbmFtZVxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSAmJiBpc1N0cmluZyhrZXkpKSB7XG4gICAgICAgIHJldHVybiB0aGlzWzBdICYmIGdldFZhbHVlKHRoaXNbMF0uZGF0YXNldFtrZXldIHx8IHRoaXNbMF0uamRhdGEgJiYgdGhpc1swXS5qZGF0YVtrZXldKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgZGF0YVxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSAmJiBpc09iamVjdChrZXkpKSB7XG4gICAgICAgIHNldHRlciA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBrZXlzKGtleSkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICAgICAgc2V0VmFsdWUoZWwsIG5hbWUsIGtleVtuYW1lXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHNldHRlciA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBzZXRWYWx1ZShlbCwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBzZXR0ZXIodGhpc1tpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5yZW1vdmVEYXRhID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgamRhdGEsIGRhdGFzZXQ7XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGpkYXRhID0gdGhpc1tpXS5qZGF0YTtcbiAgICAgICAgZGF0YXNldCA9IHRoaXNbaV0uZGF0YXNldDtcblxuICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICBqZGF0YSAmJiBqZGF0YVtrZXldICYmIGRlbGV0ZSBqZGF0YVtrZXldO1xuICAgICAgICAgICAgZGVsZXRlIGRhdGFzZXRba2V5XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoa2V5IGluIGpkYXRhKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGpkYXRhW2tleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoa2V5IGluIGRhdGFzZXQpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgZGF0YXNldFtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5hZGRDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgaiA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBjbGFzc2VzID0gY2xhc3NOYW1lID8gY2xhc3NOYW1lLnRyaW0oKS5zcGxpdCgvXFxzKy8pIDogW107XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGogPSAwO1xuXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBjbGFzc2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB0aGlzW2ldLmNsYXNzTGlzdC5hZGQoY2xhc3Nlc1tqXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBqID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIGNsYXNzZXMgPSBjbGFzc05hbWUgPyBjbGFzc05hbWUudHJpbSgpLnNwbGl0KC9cXHMrLykgOiBbXTtcblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaiA9IDA7XG5cbiAgICAgICAgZm9yIChqID0gMDsgaiA8IGNsYXNzZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHRoaXNbaV0uY2xhc3NMaXN0LnJlbW92ZShjbGFzc2VzW2pdKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4udG9nZ2xlQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUsIGZvcmNlKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgbWV0aG9kID0gXCJ0b2dnbGVcIjtcblxuICAgIGZvcmNlID09PSB0cnVlICYmIChtZXRob2QgPSBcImFkZFwiKSB8fCBmb3JjZSA9PT0gZmFsc2UgJiYgKG1ldGhvZCA9IFwicmVtb3ZlXCIpO1xuXG4gICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzW2ldLmNsYXNzTGlzdFttZXRob2RdKGNsYXNzTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLmhhc0NsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lKSB7XG4gICAgdmFyIGkgPSAwLCBsZW5ndGggPSB0aGlzLmxlbmd0aDtcblxuICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXNbaV0uY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbmZuLmh0bWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBlbDtcblxuICAgIC8vIGFkZCBIVE1MIGludG8gZWxlbWVudHNcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDEgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbXB0eSgpLmFwcGVuZCh2YWx1ZSk7XG4gICAgfVxuICAgIC8vIGdldCBIVE1MIGZyb20gZWxlbWVudFxuICAgIGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAwICYmIChlbCA9IHRoaXNbMF0pKSB7XG4gICAgICAgIHJldHVybiBlbC5pbm5lckhUTUw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5hcHBlbmQgPSBmdW5jdGlvbihhcHBlbmRlZCkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIHNldHRlcjtcblxuICAgIC8vIGNyZWF0ZSBqQm9uZSBvYmplY3QgYW5kIHRoZW4gYXBwZW5kXG4gICAgaWYgKGlzU3RyaW5nKGFwcGVuZGVkKSAmJiBycXVpY2tFeHByLmV4ZWMoYXBwZW5kZWQpKSB7XG4gICAgICAgIGFwcGVuZGVkID0gakJvbmUoYXBwZW5kZWQpO1xuICAgIH1cbiAgICAvLyBjcmVhdGUgdGV4dCBub2RlIGZvciBpbnNlcnRpb25cbiAgICBlbHNlIGlmICghaXNPYmplY3QoYXBwZW5kZWQpKSB7XG4gICAgICAgIGFwcGVuZGVkID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXBwZW5kZWQpO1xuICAgIH1cblxuICAgIGFwcGVuZGVkID0gYXBwZW5kZWQgaW5zdGFuY2VvZiBqQm9uZSA/IGFwcGVuZGVkIDogakJvbmUoYXBwZW5kZWQpO1xuXG4gICAgc2V0dGVyID0gZnVuY3Rpb24oZWwsIGkpIHtcbiAgICAgICAgYXBwZW5kZWQuZm9yRWFjaChmdW5jdGlvbihub2RlKSB7XG4gICAgICAgICAgICBpZiAoaSkge1xuICAgICAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKG5vZGUuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWwuYXBwZW5kQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNldHRlcih0aGlzW2ldLCBpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLmFwcGVuZFRvID0gZnVuY3Rpb24odG8pIHtcbiAgICBqQm9uZSh0bykuYXBwZW5kKHRoaXMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5lbXB0eSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIGVsO1xuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBlbCA9IHRoaXNbaV07XG5cbiAgICAgICAgd2hpbGUgKGVsLmxhc3RDaGlsZCkge1xuICAgICAgICAgICAgZWwucmVtb3ZlQ2hpbGQoZWwubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4ucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgZWw7XG5cbiAgICAvLyByZW1vdmUgYWxsIGxpc3RlbmVyc1xuICAgIHRoaXMub2ZmKCk7XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVsID0gdGhpc1tpXTtcblxuICAgICAgICAvLyByZW1vdmUgZGF0YSBhbmQgbm9kZXNcbiAgICAgICAgZGVsZXRlIGVsLmpkYXRhO1xuICAgICAgICBlbC5wYXJlbnROb2RlICYmIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgbW9kdWxlICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgIC8vIEV4cG9zZSBqQm9uZSBhcyBtb2R1bGUuZXhwb3J0cyBpbiBsb2FkZXJzIHRoYXQgaW1wbGVtZW50IHRoZSBOb2RlXG4gICAgLy8gbW9kdWxlIHBhdHRlcm4gKGluY2x1ZGluZyBicm93c2VyaWZ5KS4gRG8gbm90IGNyZWF0ZSB0aGUgZ2xvYmFsLCBzaW5jZVxuICAgIC8vIHRoZSB1c2VyIHdpbGwgYmUgc3RvcmluZyBpdCB0aGVtc2VsdmVzIGxvY2FsbHksIGFuZCBnbG9iYWxzIGFyZSBmcm93bmVkXG4gICAgLy8gdXBvbiBpbiB0aGUgTm9kZSBtb2R1bGUgd29ybGQuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBqQm9uZTtcbn1cbi8vIFJlZ2lzdGVyIGFzIGEgQU1EIG1vZHVsZVxuZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBqQm9uZTtcbiAgICB9KTtcblxuICAgIHdpbi5qQm9uZSA9IHdpbi4kID0gakJvbmU7XG59IGVsc2UgaWYgKHR5cGVvZiB3aW4gPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHdpbi5kb2N1bWVudCA9PT0gXCJvYmplY3RcIikge1xuICAgIHdpbi5qQm9uZSA9IHdpbi4kID0gakJvbmU7XG59XG5cbn0od2luZG93KSk7XG4iLCIvKiFcbiAqIHJldmVhbC5qc1xuICogaHR0cDovL2xhYi5oYWtpbS5zZS9yZXZlYWwtanNcbiAqIE1JVCBsaWNlbnNlZFxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxNiBIYWtpbSBFbCBIYXR0YWIsIGh0dHA6Ly9oYWtpbS5zZVxuICovXG4oZnVuY3Rpb24oIHJvb3QsIGZhY3RvcnkgKSB7XG5cdGlmKCB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgKSB7XG5cdFx0Ly8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuXHRcdGRlZmluZSggZnVuY3Rpb24oKSB7XG5cdFx0XHRyb290LlJldmVhbCA9IGZhY3RvcnkoKTtcblx0XHRcdHJldHVybiByb290LlJldmVhbDtcblx0XHR9ICk7XG5cdH0gZWxzZSBpZiggdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICkge1xuXHRcdC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMuXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gQnJvd3NlciBnbG9iYWxzLlxuXHRcdHJvb3QuUmV2ZWFsID0gZmFjdG9yeSgpO1xuXHR9XG59KCB0aGlzLCBmdW5jdGlvbigpIHtcblxuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIFJldmVhbDtcblxuXHQvLyBUaGUgcmV2ZWFsLmpzIHZlcnNpb25cblx0dmFyIFZFUlNJT04gPSAnMy4zLjAnO1xuXG5cdHZhciBTTElERVNfU0VMRUNUT1IgPSAnLnNsaWRlcyBzZWN0aW9uJyxcblx0XHRIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiA9ICcuc2xpZGVzPnNlY3Rpb24nLFxuXHRcdFZFUlRJQ0FMX1NMSURFU19TRUxFQ1RPUiA9ICcuc2xpZGVzPnNlY3Rpb24ucHJlc2VudD5zZWN0aW9uJyxcblx0XHRIT01FX1NMSURFX1NFTEVDVE9SID0gJy5zbGlkZXM+c2VjdGlvbjpmaXJzdC1vZi10eXBlJyxcblx0XHRVQSA9IG5hdmlnYXRvci51c2VyQWdlbnQsXG5cblx0XHQvLyBDb25maWd1cmF0aW9uIGRlZmF1bHRzLCBjYW4gYmUgb3ZlcnJpZGRlbiBhdCBpbml0aWFsaXphdGlvbiB0aW1lXG5cdFx0Y29uZmlnID0ge1xuXG5cdFx0XHQvLyBUaGUgXCJub3JtYWxcIiBzaXplIG9mIHRoZSBwcmVzZW50YXRpb24sIGFzcGVjdCByYXRpbyB3aWxsIGJlIHByZXNlcnZlZFxuXHRcdFx0Ly8gd2hlbiB0aGUgcHJlc2VudGF0aW9uIGlzIHNjYWxlZCB0byBmaXQgZGlmZmVyZW50IHJlc29sdXRpb25zXG5cdFx0XHR3aWR0aDogOTYwLFxuXHRcdFx0aGVpZ2h0OiA3MDAsXG5cblx0XHRcdC8vIEZhY3RvciBvZiB0aGUgZGlzcGxheSBzaXplIHRoYXQgc2hvdWxkIHJlbWFpbiBlbXB0eSBhcm91bmQgdGhlIGNvbnRlbnRcblx0XHRcdG1hcmdpbjogMC4xLFxuXG5cdFx0XHQvLyBCb3VuZHMgZm9yIHNtYWxsZXN0L2xhcmdlc3QgcG9zc2libGUgc2NhbGUgdG8gYXBwbHkgdG8gY29udGVudFxuXHRcdFx0bWluU2NhbGU6IDAuMixcblx0XHRcdG1heFNjYWxlOiAxLjUsXG5cblx0XHRcdC8vIERpc3BsYXkgY29udHJvbHMgaW4gdGhlIGJvdHRvbSByaWdodCBjb3JuZXJcblx0XHRcdGNvbnRyb2xzOiB0cnVlLFxuXG5cdFx0XHQvLyBEaXNwbGF5IGEgcHJlc2VudGF0aW9uIHByb2dyZXNzIGJhclxuXHRcdFx0cHJvZ3Jlc3M6IHRydWUsXG5cblx0XHRcdC8vIERpc3BsYXkgdGhlIHBhZ2UgbnVtYmVyIG9mIHRoZSBjdXJyZW50IHNsaWRlXG5cdFx0XHRzbGlkZU51bWJlcjogZmFsc2UsXG5cblx0XHRcdC8vIFB1c2ggZWFjaCBzbGlkZSBjaGFuZ2UgdG8gdGhlIGJyb3dzZXIgaGlzdG9yeVxuXHRcdFx0aGlzdG9yeTogZmFsc2UsXG5cblx0XHRcdC8vIEVuYWJsZSBrZXlib2FyZCBzaG9ydGN1dHMgZm9yIG5hdmlnYXRpb25cblx0XHRcdGtleWJvYXJkOiB0cnVlLFxuXG5cdFx0XHQvLyBPcHRpb25hbCBmdW5jdGlvbiB0aGF0IGJsb2NrcyBrZXlib2FyZCBldmVudHMgd2hlbiByZXR1bmluZyBmYWxzZVxuXHRcdFx0a2V5Ym9hcmRDb25kaXRpb246IG51bGwsXG5cblx0XHRcdC8vIEVuYWJsZSB0aGUgc2xpZGUgb3ZlcnZpZXcgbW9kZVxuXHRcdFx0b3ZlcnZpZXc6IHRydWUsXG5cblx0XHRcdC8vIFZlcnRpY2FsIGNlbnRlcmluZyBvZiBzbGlkZXNcblx0XHRcdGNlbnRlcjogdHJ1ZSxcblxuXHRcdFx0Ly8gRW5hYmxlcyB0b3VjaCBuYXZpZ2F0aW9uIG9uIGRldmljZXMgd2l0aCB0b3VjaCBpbnB1dFxuXHRcdFx0dG91Y2g6IHRydWUsXG5cblx0XHRcdC8vIExvb3AgdGhlIHByZXNlbnRhdGlvblxuXHRcdFx0bG9vcDogZmFsc2UsXG5cblx0XHRcdC8vIENoYW5nZSB0aGUgcHJlc2VudGF0aW9uIGRpcmVjdGlvbiB0byBiZSBSVExcblx0XHRcdHJ0bDogZmFsc2UsXG5cblx0XHRcdC8vIFJhbmRvbWl6ZXMgdGhlIG9yZGVyIG9mIHNsaWRlcyBlYWNoIHRpbWUgdGhlIHByZXNlbnRhdGlvbiBsb2Fkc1xuXHRcdFx0c2h1ZmZsZTogZmFsc2UsXG5cblx0XHRcdC8vIFR1cm5zIGZyYWdtZW50cyBvbiBhbmQgb2ZmIGdsb2JhbGx5XG5cdFx0XHRmcmFnbWVudHM6IHRydWUsXG5cblx0XHRcdC8vIEZsYWdzIGlmIHRoZSBwcmVzZW50YXRpb24gaXMgcnVubmluZyBpbiBhbiBlbWJlZGRlZCBtb2RlLFxuXHRcdFx0Ly8gaS5lLiBjb250YWluZWQgd2l0aGluIGEgbGltaXRlZCBwb3J0aW9uIG9mIHRoZSBzY3JlZW5cblx0XHRcdGVtYmVkZGVkOiBmYWxzZSxcblxuXHRcdFx0Ly8gRmxhZ3MgaWYgd2Ugc2hvdWxkIHNob3cgYSBoZWxwIG92ZXJsYXkgd2hlbiB0aGUgcXVlc3Rpb25tYXJrXG5cdFx0XHQvLyBrZXkgaXMgcHJlc3NlZFxuXHRcdFx0aGVscDogdHJ1ZSxcblxuXHRcdFx0Ly8gRmxhZ3MgaWYgaXQgc2hvdWxkIGJlIHBvc3NpYmxlIHRvIHBhdXNlIHRoZSBwcmVzZW50YXRpb24gKGJsYWNrb3V0KVxuXHRcdFx0cGF1c2U6IHRydWUsXG5cblx0XHRcdC8vIEZsYWdzIGlmIHNwZWFrZXIgbm90ZXMgc2hvdWxkIGJlIHZpc2libGUgdG8gYWxsIHZpZXdlcnNcblx0XHRcdHNob3dOb3RlczogZmFsc2UsXG5cblx0XHRcdC8vIE51bWJlciBvZiBtaWxsaXNlY29uZHMgYmV0d2VlbiBhdXRvbWF0aWNhbGx5IHByb2NlZWRpbmcgdG8gdGhlXG5cdFx0XHQvLyBuZXh0IHNsaWRlLCBkaXNhYmxlZCB3aGVuIHNldCB0byAwLCB0aGlzIHZhbHVlIGNhbiBiZSBvdmVyd3JpdHRlblxuXHRcdFx0Ly8gYnkgdXNpbmcgYSBkYXRhLWF1dG9zbGlkZSBhdHRyaWJ1dGUgb24geW91ciBzbGlkZXNcblx0XHRcdGF1dG9TbGlkZTogMCxcblxuXHRcdFx0Ly8gU3RvcCBhdXRvLXNsaWRpbmcgYWZ0ZXIgdXNlciBpbnB1dFxuXHRcdFx0YXV0b1NsaWRlU3RvcHBhYmxlOiB0cnVlLFxuXG5cdFx0XHQvLyBVc2UgdGhpcyBtZXRob2QgZm9yIG5hdmlnYXRpb24gd2hlbiBhdXRvLXNsaWRpbmcgKGRlZmF1bHRzIHRvIG5hdmlnYXRlTmV4dClcblx0XHRcdGF1dG9TbGlkZU1ldGhvZDogbnVsbCxcblxuXHRcdFx0Ly8gRW5hYmxlIHNsaWRlIG5hdmlnYXRpb24gdmlhIG1vdXNlIHdoZWVsXG5cdFx0XHRtb3VzZVdoZWVsOiBmYWxzZSxcblxuXHRcdFx0Ly8gQXBwbHkgYSAzRCByb2xsIHRvIGxpbmtzIG9uIGhvdmVyXG5cdFx0XHRyb2xsaW5nTGlua3M6IGZhbHNlLFxuXG5cdFx0XHQvLyBIaWRlcyB0aGUgYWRkcmVzcyBiYXIgb24gbW9iaWxlIGRldmljZXNcblx0XHRcdGhpZGVBZGRyZXNzQmFyOiB0cnVlLFxuXG5cdFx0XHQvLyBPcGVucyBsaW5rcyBpbiBhbiBpZnJhbWUgcHJldmlldyBvdmVybGF5XG5cdFx0XHRwcmV2aWV3TGlua3M6IGZhbHNlLFxuXG5cdFx0XHQvLyBFeHBvc2VzIHRoZSByZXZlYWwuanMgQVBJIHRocm91Z2ggd2luZG93LnBvc3RNZXNzYWdlXG5cdFx0XHRwb3N0TWVzc2FnZTogdHJ1ZSxcblxuXHRcdFx0Ly8gRGlzcGF0Y2hlcyBhbGwgcmV2ZWFsLmpzIGV2ZW50cyB0byB0aGUgcGFyZW50IHdpbmRvdyB0aHJvdWdoIHBvc3RNZXNzYWdlXG5cdFx0XHRwb3N0TWVzc2FnZUV2ZW50czogZmFsc2UsXG5cblx0XHRcdC8vIEZvY3VzZXMgYm9keSB3aGVuIHBhZ2UgY2hhbmdlcyB2aXNpYmxpdHkgdG8gZW5zdXJlIGtleWJvYXJkIHNob3J0Y3V0cyB3b3JrXG5cdFx0XHRmb2N1c0JvZHlPblBhZ2VWaXNpYmlsaXR5Q2hhbmdlOiB0cnVlLFxuXG5cdFx0XHQvLyBUcmFuc2l0aW9uIHN0eWxlXG5cdFx0XHR0cmFuc2l0aW9uOiAnc2xpZGUnLCAvLyBub25lL2ZhZGUvc2xpZGUvY29udmV4L2NvbmNhdmUvem9vbVxuXG5cdFx0XHQvLyBUcmFuc2l0aW9uIHNwZWVkXG5cdFx0XHR0cmFuc2l0aW9uU3BlZWQ6ICdkZWZhdWx0JywgLy8gZGVmYXVsdC9mYXN0L3Nsb3dcblxuXHRcdFx0Ly8gVHJhbnNpdGlvbiBzdHlsZSBmb3IgZnVsbCBwYWdlIHNsaWRlIGJhY2tncm91bmRzXG5cdFx0XHRiYWNrZ3JvdW5kVHJhbnNpdGlvbjogJ2ZhZGUnLCAvLyBub25lL2ZhZGUvc2xpZGUvY29udmV4L2NvbmNhdmUvem9vbVxuXG5cdFx0XHQvLyBQYXJhbGxheCBiYWNrZ3JvdW5kIGltYWdlXG5cdFx0XHRwYXJhbGxheEJhY2tncm91bmRJbWFnZTogJycsIC8vIENTUyBzeW50YXgsIGUuZy4gXCJhLmpwZ1wiXG5cblx0XHRcdC8vIFBhcmFsbGF4IGJhY2tncm91bmQgc2l6ZVxuXHRcdFx0cGFyYWxsYXhCYWNrZ3JvdW5kU2l6ZTogJycsIC8vIENTUyBzeW50YXgsIGUuZy4gXCIzMDAwcHggMjAwMHB4XCJcblxuXHRcdFx0Ly8gQW1vdW50IG9mIHBpeGVscyB0byBtb3ZlIHRoZSBwYXJhbGxheCBiYWNrZ3JvdW5kIHBlciBzbGlkZSBzdGVwXG5cdFx0XHRwYXJhbGxheEJhY2tncm91bmRIb3Jpem9udGFsOiBudWxsLFxuXHRcdFx0cGFyYWxsYXhCYWNrZ3JvdW5kVmVydGljYWw6IG51bGwsXG5cblx0XHRcdC8vIE51bWJlciBvZiBzbGlkZXMgYXdheSBmcm9tIHRoZSBjdXJyZW50IHRoYXQgYXJlIHZpc2libGVcblx0XHRcdHZpZXdEaXN0YW5jZTogMyxcblxuXHRcdFx0Ly8gU2NyaXB0IGRlcGVuZGVuY2llcyB0byBsb2FkXG5cdFx0XHRkZXBlbmRlbmNpZXM6IFtdXG5cblx0XHR9LFxuXG5cdFx0Ly8gRmxhZ3MgaWYgcmV2ZWFsLmpzIGlzIGxvYWRlZCAoaGFzIGRpc3BhdGNoZWQgdGhlICdyZWFkeScgZXZlbnQpXG5cdFx0bG9hZGVkID0gZmFsc2UsXG5cblx0XHQvLyBGbGFncyBpZiB0aGUgb3ZlcnZpZXcgbW9kZSBpcyBjdXJyZW50bHkgYWN0aXZlXG5cdFx0b3ZlcnZpZXcgPSBmYWxzZSxcblxuXHRcdC8vIEhvbGRzIHRoZSBkaW1lbnNpb25zIG9mIG91ciBvdmVydmlldyBzbGlkZXMsIGluY2x1ZGluZyBtYXJnaW5zXG5cdFx0b3ZlcnZpZXdTbGlkZVdpZHRoID0gbnVsbCxcblx0XHRvdmVydmlld1NsaWRlSGVpZ2h0ID0gbnVsbCxcblxuXHRcdC8vIFRoZSBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBpbmRleCBvZiB0aGUgY3VycmVudGx5IGFjdGl2ZSBzbGlkZVxuXHRcdGluZGV4aCxcblx0XHRpbmRleHYsXG5cblx0XHQvLyBUaGUgcHJldmlvdXMgYW5kIGN1cnJlbnQgc2xpZGUgSFRNTCBlbGVtZW50c1xuXHRcdHByZXZpb3VzU2xpZGUsXG5cdFx0Y3VycmVudFNsaWRlLFxuXG5cdFx0cHJldmlvdXNCYWNrZ3JvdW5kLFxuXG5cdFx0Ly8gU2xpZGVzIG1heSBob2xkIGEgZGF0YS1zdGF0ZSBhdHRyaWJ1dGUgd2hpY2ggd2UgcGljayB1cCBhbmQgYXBwbHlcblx0XHQvLyBhcyBhIGNsYXNzIHRvIHRoZSBib2R5LiBUaGlzIGxpc3QgY29udGFpbnMgdGhlIGNvbWJpbmVkIHN0YXRlIG9mXG5cdFx0Ly8gYWxsIGN1cnJlbnQgc2xpZGVzLlxuXHRcdHN0YXRlID0gW10sXG5cblx0XHQvLyBUaGUgY3VycmVudCBzY2FsZSBvZiB0aGUgcHJlc2VudGF0aW9uIChzZWUgd2lkdGgvaGVpZ2h0IGNvbmZpZylcblx0XHRzY2FsZSA9IDEsXG5cblx0XHQvLyBDU1MgdHJhbnNmb3JtIHRoYXQgaXMgY3VycmVudGx5IGFwcGxpZWQgdG8gdGhlIHNsaWRlcyBjb250YWluZXIsXG5cdFx0Ly8gc3BsaXQgaW50byB0d28gZ3JvdXBzXG5cdFx0c2xpZGVzVHJhbnNmb3JtID0geyBsYXlvdXQ6ICcnLCBvdmVydmlldzogJycgfSxcblxuXHRcdC8vIENhY2hlZCByZWZlcmVuY2VzIHRvIERPTSBlbGVtZW50c1xuXHRcdGRvbSA9IHt9LFxuXG5cdFx0Ly8gRmVhdHVyZXMgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCBzZWUgI2NoZWNrQ2FwYWJpbGl0aWVzKClcblx0XHRmZWF0dXJlcyA9IHt9LFxuXG5cdFx0Ly8gQ2xpZW50IGlzIGEgbW9iaWxlIGRldmljZSwgc2VlICNjaGVja0NhcGFiaWxpdGllcygpXG5cdFx0aXNNb2JpbGVEZXZpY2UsXG5cblx0XHQvLyBDbGllbnQgaXMgYSBkZXNrdG9wIENocm9tZSwgc2VlICNjaGVja0NhcGFiaWxpdGllcygpXG5cdFx0aXNDaHJvbWUsXG5cblx0XHQvLyBUaHJvdHRsZXMgbW91c2Ugd2hlZWwgbmF2aWdhdGlvblxuXHRcdGxhc3RNb3VzZVdoZWVsU3RlcCA9IDAsXG5cblx0XHQvLyBEZWxheXMgdXBkYXRlcyB0byB0aGUgVVJMIGR1ZSB0byBhIENocm9tZSB0aHVtYm5haWxlciBidWdcblx0XHR3cml0ZVVSTFRpbWVvdXQgPSAwLFxuXG5cdFx0Ly8gRmxhZ3MgaWYgdGhlIGludGVyYWN0aW9uIGV2ZW50IGxpc3RlbmVycyBhcmUgYm91bmRcblx0XHRldmVudHNBcmVCb3VuZCA9IGZhbHNlLFxuXG5cdFx0Ly8gVGhlIGN1cnJlbnQgYXV0by1zbGlkZSBkdXJhdGlvblxuXHRcdGF1dG9TbGlkZSA9IDAsXG5cblx0XHQvLyBBdXRvIHNsaWRlIHByb3BlcnRpZXNcblx0XHRhdXRvU2xpZGVQbGF5ZXIsXG5cdFx0YXV0b1NsaWRlVGltZW91dCA9IDAsXG5cdFx0YXV0b1NsaWRlU3RhcnRUaW1lID0gLTEsXG5cdFx0YXV0b1NsaWRlUGF1c2VkID0gZmFsc2UsXG5cblx0XHQvLyBIb2xkcyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudGx5IG9uZ29pbmcgdG91Y2ggaW5wdXRcblx0XHR0b3VjaCA9IHtcblx0XHRcdHN0YXJ0WDogMCxcblx0XHRcdHN0YXJ0WTogMCxcblx0XHRcdHN0YXJ0U3BhbjogMCxcblx0XHRcdHN0YXJ0Q291bnQ6IDAsXG5cdFx0XHRjYXB0dXJlZDogZmFsc2UsXG5cdFx0XHR0aHJlc2hvbGQ6IDQwXG5cdFx0fSxcblxuXHRcdC8vIEhvbGRzIGluZm9ybWF0aW9uIGFib3V0IHRoZSBrZXlib2FyZCBzaG9ydGN1dHNcblx0XHRrZXlib2FyZFNob3J0Y3V0cyA9IHtcblx0XHRcdCdOICAsICBTUEFDRSc6XHRcdFx0J05leHQgc2xpZGUnLFxuXHRcdFx0J1AnOlx0XHRcdFx0XHQnUHJldmlvdXMgc2xpZGUnLFxuXHRcdFx0JyYjODU5MjsgICwgIEgnOlx0XHQnTmF2aWdhdGUgbGVmdCcsXG5cdFx0XHQnJiM4NTk0OyAgLCAgTCc6XHRcdCdOYXZpZ2F0ZSByaWdodCcsXG5cdFx0XHQnJiM4NTkzOyAgLCAgSyc6XHRcdCdOYXZpZ2F0ZSB1cCcsXG5cdFx0XHQnJiM4NTk1OyAgLCAgSic6XHRcdCdOYXZpZ2F0ZSBkb3duJyxcblx0XHRcdCdIb21lJzpcdFx0XHRcdFx0J0ZpcnN0IHNsaWRlJyxcblx0XHRcdCdFbmQnOlx0XHRcdFx0XHQnTGFzdCBzbGlkZScsXG5cdFx0XHQnQiAgLCAgLic6XHRcdFx0XHQnUGF1c2UnLFxuXHRcdFx0J0YnOlx0XHRcdFx0XHQnRnVsbHNjcmVlbicsXG5cdFx0XHQnRVNDLCBPJzpcdFx0XHRcdCdTbGlkZSBvdmVydmlldydcblx0XHR9O1xuXG5cdC8qKlxuXHQgKiBTdGFydHMgdXAgdGhlIHByZXNlbnRhdGlvbiBpZiB0aGUgY2xpZW50IGlzIGNhcGFibGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0aWFsaXplKCBvcHRpb25zICkge1xuXG5cdFx0Y2hlY2tDYXBhYmlsaXRpZXMoKTtcblxuXHRcdGlmKCAhZmVhdHVyZXMudHJhbnNmb3JtczJkICYmICFmZWF0dXJlcy50cmFuc2Zvcm1zM2QgKSB7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ25vLXRyYW5zZm9ybXMnICk7XG5cblx0XHRcdC8vIFNpbmNlIEpTIHdvbid0IGJlIHJ1bm5pbmcgYW55IGZ1cnRoZXIsIHdlIGxvYWQgYWxsIGxhenlcblx0XHRcdC8vIGxvYWRpbmcgZWxlbWVudHMgdXBmcm9udFxuXHRcdFx0dmFyIGltYWdlcyA9IHRvQXJyYXkoIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnaW1nJyApICksXG5cdFx0XHRcdGlmcmFtZXMgPSB0b0FycmF5KCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2lmcmFtZScgKSApO1xuXG5cdFx0XHR2YXIgbGF6eUxvYWRhYmxlID0gaW1hZ2VzLmNvbmNhdCggaWZyYW1lcyApO1xuXG5cdFx0XHRmb3IoIHZhciBpID0gMCwgbGVuID0gbGF6eUxvYWRhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0XHR2YXIgZWxlbWVudCA9IGxhenlMb2FkYWJsZVtpXTtcblx0XHRcdFx0aWYoIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1zcmMnICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdzcmMnLCBlbGVtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApICk7XG5cdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkYXRhLXNyYycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgY29yZSBmZWF0dXJlcyB3ZSB3b24ndCBiZVxuXHRcdFx0Ly8gdXNpbmcgSmF2YVNjcmlwdCB0byBjb250cm9sIHRoZSBwcmVzZW50YXRpb25cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDYWNoZSByZWZlcmVuY2VzIHRvIGtleSBET00gZWxlbWVudHNcblx0XHRkb20ud3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcucmV2ZWFsJyApO1xuXHRcdGRvbS5zbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnJldmVhbCAuc2xpZGVzJyApO1xuXG5cdFx0Ly8gRm9yY2UgYSBsYXlvdXQgd2hlbiB0aGUgd2hvbGUgcGFnZSwgaW5jbCBmb250cywgaGFzIGxvYWRlZFxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbG9hZCcsIGxheW91dCwgZmFsc2UgKTtcblxuXHRcdHZhciBxdWVyeSA9IFJldmVhbC5nZXRRdWVyeUhhc2goKTtcblxuXHRcdC8vIERvIG5vdCBhY2NlcHQgbmV3IGRlcGVuZGVuY2llcyB2aWEgcXVlcnkgY29uZmlnIHRvIGF2b2lkXG5cdFx0Ly8gdGhlIHBvdGVudGlhbCBvZiBtYWxpY2lvdXMgc2NyaXB0IGluamVjdGlvblxuXHRcdGlmKCB0eXBlb2YgcXVlcnlbJ2RlcGVuZGVuY2llcyddICE9PSAndW5kZWZpbmVkJyApIGRlbGV0ZSBxdWVyeVsnZGVwZW5kZW5jaWVzJ107XG5cblx0XHQvLyBDb3B5IG9wdGlvbnMgb3ZlciB0byBvdXIgY29uZmlnIG9iamVjdFxuXHRcdGV4dGVuZCggY29uZmlnLCBvcHRpb25zICk7XG5cdFx0ZXh0ZW5kKCBjb25maWcsIHF1ZXJ5ICk7XG5cblx0XHQvLyBIaWRlIHRoZSBhZGRyZXNzIGJhciBpbiBtb2JpbGUgYnJvd3NlcnNcblx0XHRoaWRlQWRkcmVzc0JhcigpO1xuXG5cdFx0Ly8gTG9hZHMgdGhlIGRlcGVuZGVuY2llcyBhbmQgY29udGludWVzIHRvICNzdGFydCgpIG9uY2UgZG9uZVxuXHRcdGxvYWQoKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEluc3BlY3QgdGhlIGNsaWVudCB0byBzZWUgd2hhdCBpdCdzIGNhcGFibGUgb2YsIHRoaXNcblx0ICogc2hvdWxkIG9ubHkgaGFwcGVucyBvbmNlIHBlciBydW50aW1lLlxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tDYXBhYmlsaXRpZXMoKSB7XG5cblx0XHRpc01vYmlsZURldmljZSA9IC8oaXBob25lfGlwb2R8aXBhZHxhbmRyb2lkKS9naS50ZXN0KCBVQSApO1xuXHRcdGlzQ2hyb21lID0gL2Nocm9tZS9pLnRlc3QoIFVBICkgJiYgIS9lZGdlL2kudGVzdCggVUEgKTtcblxuXHRcdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cblx0XHRmZWF0dXJlcy50cmFuc2Zvcm1zM2QgPSAnV2Via2l0UGVyc3BlY3RpdmUnIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J01velBlcnNwZWN0aXZlJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSB8fFxuXHRcdFx0XHRcdFx0XHRcdCdtc1BlcnNwZWN0aXZlJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSB8fFxuXHRcdFx0XHRcdFx0XHRcdCdPUGVyc3BlY3RpdmUnIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J3BlcnNwZWN0aXZlJyBpbiB0ZXN0RWxlbWVudC5zdHlsZTtcblxuXHRcdGZlYXR1cmVzLnRyYW5zZm9ybXMyZCA9ICdXZWJraXRUcmFuc2Zvcm0nIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J01velRyYW5zZm9ybScgaW4gdGVzdEVsZW1lbnQuc3R5bGUgfHxcblx0XHRcdFx0XHRcdFx0XHQnbXNUcmFuc2Zvcm0nIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J09UcmFuc2Zvcm0nIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J3RyYW5zZm9ybScgaW4gdGVzdEVsZW1lbnQuc3R5bGU7XG5cblx0XHRmZWF0dXJlcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVNZXRob2QgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0XHRmZWF0dXJlcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB0eXBlb2YgZmVhdHVyZXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lTWV0aG9kID09PSAnZnVuY3Rpb24nO1xuXG5cdFx0ZmVhdHVyZXMuY2FudmFzID0gISFkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApLmdldENvbnRleHQ7XG5cblx0XHQvLyBUcmFuc2l0aW9ucyBpbiB0aGUgb3ZlcnZpZXcgYXJlIGRpc2FibGVkIGluIGRlc2t0b3AgYW5kXG5cdFx0Ly8gU2FmYXJpIGR1ZSB0byBsYWdcblx0XHRmZWF0dXJlcy5vdmVydmlld1RyYW5zaXRpb25zID0gIS9WZXJzaW9uXFwvW1xcZFxcLl0rLipTYWZhcmkvLnRlc3QoIFVBICk7XG5cblx0XHQvLyBGbGFncyBpZiB3ZSBzaG91bGQgdXNlIHpvb20gaW5zdGVhZCBvZiB0cmFuc2Zvcm0gdG8gc2NhbGVcblx0XHQvLyB1cCBzbGlkZXMuIFpvb20gcHJvZHVjZXMgY3Jpc3BlciByZXN1bHRzIGJ1dCBoYXMgYSBsb3Qgb2Zcblx0XHQvLyB4YnJvd3NlciBxdWlya3Mgc28gd2Ugb25seSB1c2UgaXQgaW4gd2hpdGVsc2l0ZWQgYnJvd3NlcnMuXG5cdFx0ZmVhdHVyZXMuem9vbSA9ICd6b29tJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSAmJiAhaXNNb2JpbGVEZXZpY2UgJiZcblx0XHRcdFx0XHRcdCggaXNDaHJvbWUgfHwgL1ZlcnNpb25cXC9bXFxkXFwuXSsuKlNhZmFyaS8udGVzdCggVUEgKSApO1xuXG5cdH1cblxuICAgIC8qKlxuICAgICAqIExvYWRzIHRoZSBkZXBlbmRlbmNpZXMgb2YgcmV2ZWFsLmpzLiBEZXBlbmRlbmNpZXMgYXJlXG4gICAgICogZGVmaW5lZCB2aWEgdGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9uICdkZXBlbmRlbmNpZXMnXG4gICAgICogYW5kIHdpbGwgYmUgbG9hZGVkIHByaW9yIHRvIHN0YXJ0aW5nL2JpbmRpbmcgcmV2ZWFsLmpzLlxuICAgICAqIFNvbWUgZGVwZW5kZW5jaWVzIG1heSBoYXZlIGFuICdhc3luYycgZmxhZywgaWYgc28gdGhleVxuICAgICAqIHdpbGwgbG9hZCBhZnRlciByZXZlYWwuanMgaGFzIGJlZW4gc3RhcnRlZCB1cC5cbiAgICAgKi9cblx0ZnVuY3Rpb24gbG9hZCgpIHtcblxuXHRcdHZhciBzY3JpcHRzID0gW10sXG5cdFx0XHRzY3JpcHRzQXN5bmMgPSBbXSxcblx0XHRcdHNjcmlwdHNUb1ByZWxvYWQgPSAwO1xuXG5cdFx0Ly8gQ2FsbGVkIG9uY2Ugc3luY2hyb25vdXMgc2NyaXB0cyBmaW5pc2ggbG9hZGluZ1xuXHRcdGZ1bmN0aW9uIHByb2NlZWQoKSB7XG5cdFx0XHRpZiggc2NyaXB0c0FzeW5jLmxlbmd0aCApIHtcblx0XHRcdFx0Ly8gTG9hZCBhc3luY2hyb25vdXMgc2NyaXB0c1xuXHRcdFx0XHRoZWFkLmpzLmFwcGx5KCBudWxsLCBzY3JpcHRzQXN5bmMgKTtcblx0XHRcdH1cblxuXHRcdFx0c3RhcnQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBsb2FkU2NyaXB0KCBzICkge1xuXHRcdFx0aGVhZC5yZWFkeSggcy5zcmMubWF0Y2goIC8oW1xcd1xcZF9cXC1dKilcXC4/anMkfFteXFxcXFxcL10qJC9pIClbMF0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBFeHRlbnNpb24gbWF5IGNvbnRhaW4gY2FsbGJhY2sgZnVuY3Rpb25zXG5cdFx0XHRcdGlmKCB0eXBlb2Ygcy5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRzLmNhbGxiYWNrLmFwcGx5KCB0aGlzICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiggLS1zY3JpcHRzVG9QcmVsb2FkID09PSAwICkge1xuXHRcdFx0XHRcdHByb2NlZWQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IGNvbmZpZy5kZXBlbmRlbmNpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHR2YXIgcyA9IGNvbmZpZy5kZXBlbmRlbmNpZXNbaV07XG5cblx0XHRcdC8vIExvYWQgaWYgdGhlcmUncyBubyBjb25kaXRpb24gb3IgdGhlIGNvbmRpdGlvbiBpcyB0cnV0aHlcblx0XHRcdGlmKCAhcy5jb25kaXRpb24gfHwgcy5jb25kaXRpb24oKSApIHtcblx0XHRcdFx0aWYoIHMuYXN5bmMgKSB7XG5cdFx0XHRcdFx0c2NyaXB0c0FzeW5jLnB1c2goIHMuc3JjICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c2NyaXB0cy5wdXNoKCBzLnNyYyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bG9hZFNjcmlwdCggcyApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKCBzY3JpcHRzLmxlbmd0aCApIHtcblx0XHRcdHNjcmlwdHNUb1ByZWxvYWQgPSBzY3JpcHRzLmxlbmd0aDtcblxuXHRcdFx0Ly8gTG9hZCBzeW5jaHJvbm91cyBzY3JpcHRzXG5cdFx0XHRoZWFkLmpzLmFwcGx5KCBudWxsLCBzY3JpcHRzICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cHJvY2VlZCgpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFN0YXJ0cyB1cCByZXZlYWwuanMgYnkgYmluZGluZyBpbnB1dCBldmVudHMgYW5kIG5hdmlnYXRpbmdcblx0ICogdG8gdGhlIGN1cnJlbnQgVVJMIGRlZXBsaW5rIGlmIHRoZXJlIGlzIG9uZS5cblx0ICovXG5cdGZ1bmN0aW9uIHN0YXJ0KCkge1xuXG5cdFx0Ly8gTWFrZSBzdXJlIHdlJ3ZlIGdvdCBhbGwgdGhlIERPTSBlbGVtZW50cyB3ZSBuZWVkXG5cdFx0c2V0dXBET00oKTtcblxuXHRcdC8vIExpc3RlbiB0byBtZXNzYWdlcyBwb3N0ZWQgdG8gdGhpcyB3aW5kb3dcblx0XHRzZXR1cFBvc3RNZXNzYWdlKCk7XG5cblx0XHQvLyBQcmV2ZW50IHRoZSBzbGlkZXMgZnJvbSBiZWluZyBzY3JvbGxlZCBvdXQgb2Ygdmlld1xuXHRcdHNldHVwU2Nyb2xsUHJldmVudGlvbigpO1xuXG5cdFx0Ly8gUmVzZXRzIGFsbCB2ZXJ0aWNhbCBzbGlkZXMgc28gdGhhdCBvbmx5IHRoZSBmaXJzdCBpcyB2aXNpYmxlXG5cdFx0cmVzZXRWZXJ0aWNhbFNsaWRlcygpO1xuXG5cdFx0Ly8gVXBkYXRlcyB0aGUgcHJlc2VudGF0aW9uIHRvIG1hdGNoIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gdmFsdWVzXG5cdFx0Y29uZmlndXJlKCk7XG5cblx0XHQvLyBSZWFkIHRoZSBpbml0aWFsIGhhc2hcblx0XHRyZWFkVVJMKCk7XG5cblx0XHQvLyBVcGRhdGUgYWxsIGJhY2tncm91bmRzXG5cdFx0dXBkYXRlQmFja2dyb3VuZCggdHJ1ZSApO1xuXG5cdFx0Ly8gTm90aWZ5IGxpc3RlbmVycyB0aGF0IHRoZSBwcmVzZW50YXRpb24gaXMgcmVhZHkgYnV0IHVzZSBhIDFtc1xuXHRcdC8vIHRpbWVvdXQgdG8gZW5zdXJlIGl0J3Mgbm90IGZpcmVkIHN5bmNocm9ub3VzbHkgYWZ0ZXIgI2luaXRpYWxpemUoKVxuXHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gRW5hYmxlIHRyYW5zaXRpb25zIG5vdyB0aGF0IHdlJ3JlIGxvYWRlZFxuXHRcdFx0ZG9tLnNsaWRlcy5jbGFzc0xpc3QucmVtb3ZlKCAnbm8tdHJhbnNpdGlvbicgKTtcblxuXHRcdFx0bG9hZGVkID0gdHJ1ZTtcblxuXHRcdFx0ZGlzcGF0Y2hFdmVudCggJ3JlYWR5Jywge1xuXHRcdFx0XHQnaW5kZXhoJzogaW5kZXhoLFxuXHRcdFx0XHQnaW5kZXh2JzogaW5kZXh2LFxuXHRcdFx0XHQnY3VycmVudFNsaWRlJzogY3VycmVudFNsaWRlXG5cdFx0XHR9ICk7XG5cdFx0fSwgMSApO1xuXG5cdFx0Ly8gU3BlY2lhbCBzZXR1cCBhbmQgY29uZmlnIGlzIHJlcXVpcmVkIHdoZW4gcHJpbnRpbmcgdG8gUERGXG5cdFx0aWYoIGlzUHJpbnRpbmdQREYoKSApIHtcblx0XHRcdHJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG5cblx0XHRcdC8vIFRoZSBkb2N1bWVudCBuZWVkcyB0byBoYXZlIGxvYWRlZCBmb3IgdGhlIFBERiBsYXlvdXRcblx0XHRcdC8vIG1lYXN1cmVtZW50cyB0byBiZSBhY2N1cmF0ZVxuXHRcdFx0aWYoIGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScgKSB7XG5cdFx0XHRcdHNldHVwUERGKCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgc2V0dXBQREYgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBGaW5kcyBhbmQgc3RvcmVzIHJlZmVyZW5jZXMgdG8gRE9NIGVsZW1lbnRzIHdoaWNoIGFyZVxuXHQgKiByZXF1aXJlZCBieSB0aGUgcHJlc2VudGF0aW9uLiBJZiBhIHJlcXVpcmVkIGVsZW1lbnQgaXNcblx0ICogbm90IGZvdW5kLCBpdCBpcyBjcmVhdGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0dXBET00oKSB7XG5cblx0XHQvLyBQcmV2ZW50IHRyYW5zaXRpb25zIHdoaWxlIHdlJ3JlIGxvYWRpbmdcblx0XHRkb20uc2xpZGVzLmNsYXNzTGlzdC5hZGQoICduby10cmFuc2l0aW9uJyApO1xuXG5cdFx0Ly8gQmFja2dyb3VuZCBlbGVtZW50XG5cdFx0ZG9tLmJhY2tncm91bmQgPSBjcmVhdGVTaW5nbGV0b25Ob2RlKCBkb20ud3JhcHBlciwgJ2RpdicsICdiYWNrZ3JvdW5kcycsIG51bGwgKTtcblxuXHRcdC8vIFByb2dyZXNzIGJhclxuXHRcdGRvbS5wcm9ncmVzcyA9IGNyZWF0ZVNpbmdsZXRvbk5vZGUoIGRvbS53cmFwcGVyLCAnZGl2JywgJ3Byb2dyZXNzJywgJzxzcGFuPjwvc3Bhbj4nICk7XG5cdFx0ZG9tLnByb2dyZXNzYmFyID0gZG9tLnByb2dyZXNzLnF1ZXJ5U2VsZWN0b3IoICdzcGFuJyApO1xuXG5cdFx0Ly8gQXJyb3cgY29udHJvbHNcblx0XHRjcmVhdGVTaW5nbGV0b25Ob2RlKCBkb20ud3JhcHBlciwgJ2FzaWRlJywgJ2NvbnRyb2xzJyxcblx0XHRcdCc8YnV0dG9uIGNsYXNzPVwibmF2aWdhdGUtbGVmdFwiIGFyaWEtbGFiZWw9XCJwcmV2aW91cyBzbGlkZVwiPjwvYnV0dG9uPicgK1xuXHRcdFx0JzxidXR0b24gY2xhc3M9XCJuYXZpZ2F0ZS1yaWdodFwiIGFyaWEtbGFiZWw9XCJuZXh0IHNsaWRlXCI+PC9idXR0b24+JyArXG5cdFx0XHQnPGJ1dHRvbiBjbGFzcz1cIm5hdmlnYXRlLXVwXCIgYXJpYS1sYWJlbD1cImFib3ZlIHNsaWRlXCI+PC9idXR0b24+JyArXG5cdFx0XHQnPGJ1dHRvbiBjbGFzcz1cIm5hdmlnYXRlLWRvd25cIiBhcmlhLWxhYmVsPVwiYmVsb3cgc2xpZGVcIj48L2J1dHRvbj4nICk7XG5cblx0XHQvLyBTbGlkZSBudW1iZXJcblx0XHRkb20uc2xpZGVOdW1iZXIgPSBjcmVhdGVTaW5nbGV0b25Ob2RlKCBkb20ud3JhcHBlciwgJ2RpdicsICdzbGlkZS1udW1iZXInLCAnJyApO1xuXG5cdFx0Ly8gRWxlbWVudCBjb250YWluaW5nIG5vdGVzIHRoYXQgYXJlIHZpc2libGUgdG8gdGhlIGF1ZGllbmNlXG5cdFx0ZG9tLnNwZWFrZXJOb3RlcyA9IGNyZWF0ZVNpbmdsZXRvbk5vZGUoIGRvbS53cmFwcGVyLCAnZGl2JywgJ3NwZWFrZXItbm90ZXMnLCBudWxsICk7XG5cdFx0ZG9tLnNwZWFrZXJOb3Rlcy5zZXRBdHRyaWJ1dGUoICdkYXRhLXByZXZlbnQtc3dpcGUnLCAnJyApO1xuXG5cdFx0Ly8gT3ZlcmxheSBncmFwaGljIHdoaWNoIGlzIGRpc3BsYXllZCBkdXJpbmcgdGhlIHBhdXNlZCBtb2RlXG5cdFx0Y3JlYXRlU2luZ2xldG9uTm9kZSggZG9tLndyYXBwZXIsICdkaXYnLCAncGF1c2Utb3ZlcmxheScsIG51bGwgKTtcblxuXHRcdC8vIENhY2hlIHJlZmVyZW5jZXMgdG8gZWxlbWVudHNcblx0XHRkb20uY29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnJldmVhbCAuY29udHJvbHMnICk7XG5cdFx0ZG9tLnRoZW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJyN0aGVtZScgKTtcblxuXHRcdGRvbS53cmFwcGVyLnNldEF0dHJpYnV0ZSggJ3JvbGUnLCAnYXBwbGljYXRpb24nICk7XG5cblx0XHQvLyBUaGVyZSBjYW4gYmUgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIGNvbnRyb2xzIHRocm91Z2hvdXQgdGhlIHBhZ2Vcblx0XHRkb20uY29udHJvbHNMZWZ0ID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5uYXZpZ2F0ZS1sZWZ0JyApICk7XG5cdFx0ZG9tLmNvbnRyb2xzUmlnaHQgPSB0b0FycmF5KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm5hdmlnYXRlLXJpZ2h0JyApICk7XG5cdFx0ZG9tLmNvbnRyb2xzVXAgPSB0b0FycmF5KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm5hdmlnYXRlLXVwJyApICk7XG5cdFx0ZG9tLmNvbnRyb2xzRG93biA9IHRvQXJyYXkoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubmF2aWdhdGUtZG93bicgKSApO1xuXHRcdGRvbS5jb250cm9sc1ByZXYgPSB0b0FycmF5KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm5hdmlnYXRlLXByZXYnICkgKTtcblx0XHRkb20uY29udHJvbHNOZXh0ID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5uYXZpZ2F0ZS1uZXh0JyApICk7XG5cblx0XHRkb20uc3RhdHVzRGl2ID0gY3JlYXRlU3RhdHVzRGl2KCk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIGhpZGRlbiBkaXYgd2l0aCByb2xlIGFyaWEtbGl2ZSB0byBhbm5vdW5jZSB0aGVcblx0ICogY3VycmVudCBzbGlkZSBjb250ZW50LiBIaWRlIHRoZSBkaXYgb2ZmLXNjcmVlbiB0byBtYWtlIGl0XG5cdCAqIGF2YWlsYWJsZSBvbmx5IHRvIEFzc2lzdGl2ZSBUZWNobm9sb2dpZXMuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVTdGF0dXNEaXYoKSB7XG5cblx0XHR2YXIgc3RhdHVzRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdhcmlhLXN0YXR1cy1kaXYnICk7XG5cdFx0aWYoICFzdGF0dXNEaXYgKSB7XG5cdFx0XHRzdGF0dXNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdFx0c3RhdHVzRGl2LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblx0XHRcdHN0YXR1c0Rpdi5zdHlsZS5oZWlnaHQgPSAnMXB4Jztcblx0XHRcdHN0YXR1c0Rpdi5zdHlsZS53aWR0aCA9ICcxcHgnO1xuXHRcdFx0c3RhdHVzRGl2LnN0eWxlLm92ZXJmbG93ID0naGlkZGVuJztcblx0XHRcdHN0YXR1c0Rpdi5zdHlsZS5jbGlwID0gJ3JlY3QoIDFweCwgMXB4LCAxcHgsIDFweCApJztcblx0XHRcdHN0YXR1c0Rpdi5zZXRBdHRyaWJ1dGUoICdpZCcsICdhcmlhLXN0YXR1cy1kaXYnICk7XG5cdFx0XHRzdGF0dXNEaXYuc2V0QXR0cmlidXRlKCAnYXJpYS1saXZlJywgJ3BvbGl0ZScgKTtcblx0XHRcdHN0YXR1c0Rpdi5zZXRBdHRyaWJ1dGUoICdhcmlhLWF0b21pYycsJ3RydWUnICk7XG5cdFx0XHRkb20ud3JhcHBlci5hcHBlbmRDaGlsZCggc3RhdHVzRGl2ICk7XG5cdFx0fVxuXHRcdHJldHVybiBzdGF0dXNEaXY7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb25maWd1cmVzIHRoZSBwcmVzZW50YXRpb24gZm9yIHByaW50aW5nIHRvIGEgc3RhdGljXG5cdCAqIFBERi5cblx0ICovXG5cdGZ1bmN0aW9uIHNldHVwUERGKCkge1xuXG5cdFx0dmFyIHNsaWRlU2l6ZSA9IGdldENvbXB1dGVkU2xpZGVTaXplKCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0ICk7XG5cblx0XHQvLyBEaW1lbnNpb25zIG9mIHRoZSBQREYgcGFnZXNcblx0XHR2YXIgcGFnZVdpZHRoID0gTWF0aC5mbG9vciggc2xpZGVTaXplLndpZHRoICogKCAxICsgY29uZmlnLm1hcmdpbiApICksXG5cdFx0XHRwYWdlSGVpZ2h0ID0gTWF0aC5mbG9vciggc2xpZGVTaXplLmhlaWdodCAqICggMSArIGNvbmZpZy5tYXJnaW4gICkgKTtcblxuXHRcdC8vIERpbWVuc2lvbnMgb2Ygc2xpZGVzIHdpdGhpbiB0aGUgcGFnZXNcblx0XHR2YXIgc2xpZGVXaWR0aCA9IHNsaWRlU2l6ZS53aWR0aCxcblx0XHRcdHNsaWRlSGVpZ2h0ID0gc2xpZGVTaXplLmhlaWdodDtcblxuXHRcdC8vIExldCB0aGUgYnJvd3NlciBrbm93IHdoYXQgcGFnZSBzaXplIHdlIHdhbnQgdG8gcHJpbnRcblx0XHRpbmplY3RTdHlsZVNoZWV0KCAnQHBhZ2V7c2l6ZTonKyBwYWdlV2lkdGggKydweCAnKyBwYWdlSGVpZ2h0ICsncHg7IG1hcmdpbjogMDt9JyApO1xuXG5cdFx0Ly8gTGltaXQgdGhlIHNpemUgb2YgY2VydGFpbiBlbGVtZW50cyB0byB0aGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVcblx0XHRpbmplY3RTdHlsZVNoZWV0KCAnLnJldmVhbCBzZWN0aW9uPmltZywgLnJldmVhbCBzZWN0aW9uPnZpZGVvLCAucmV2ZWFsIHNlY3Rpb24+aWZyYW1le21heC13aWR0aDogJysgc2xpZGVXaWR0aCArJ3B4OyBtYXgtaGVpZ2h0OicrIHNsaWRlSGVpZ2h0ICsncHh9JyApO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCAncHJpbnQtcGRmJyApO1xuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUud2lkdGggPSBwYWdlV2lkdGggKyAncHgnO1xuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUuaGVpZ2h0ID0gcGFnZUhlaWdodCArICdweCc7XG5cblx0XHQvLyBBZGQgZWFjaCBzbGlkZSdzIGluZGV4IGFzIGF0dHJpYnV0ZXMgb24gaXRzZWxmLCB3ZSBuZWVkIHRoZXNlXG5cdFx0Ly8gaW5kaWNlcyB0byBnZW5lcmF0ZSBzbGlkZSBudW1iZXJzIGJlbG93XG5cdFx0dG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBoc2xpZGUsIGggKSB7XG5cdFx0XHRoc2xpZGUuc2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC1oJywgaCApO1xuXG5cdFx0XHRpZiggaHNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ3N0YWNrJyApICkge1xuXHRcdFx0XHR0b0FycmF5KCBoc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggdnNsaWRlLCB2ICkge1xuXHRcdFx0XHRcdHZzbGlkZS5zZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LWgnLCBoICk7XG5cdFx0XHRcdFx0dnNsaWRlLnNldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtdicsIHYgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIFNsaWRlIGFuZCBzbGlkZSBiYWNrZ3JvdW5kIGxheW91dFxuXHRcdHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFNMSURFU19TRUxFQ1RPUiApICkuZm9yRWFjaCggZnVuY3Rpb24oIHNsaWRlICkge1xuXG5cdFx0XHQvLyBWZXJ0aWNhbCBzdGFja3MgYXJlIG5vdCBjZW50cmVkIHNpbmNlIHRoZWlyIHNlY3Rpb25cblx0XHRcdC8vIGNoaWxkcmVuIHdpbGwgYmVcblx0XHRcdGlmKCBzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoICdzdGFjaycgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdC8vIENlbnRlciB0aGUgc2xpZGUgaW5zaWRlIG9mIHRoZSBwYWdlLCBnaXZpbmcgdGhlIHNsaWRlIHNvbWUgbWFyZ2luXG5cdFx0XHRcdHZhciBsZWZ0ID0gKCBwYWdlV2lkdGggLSBzbGlkZVdpZHRoICkgLyAyLFxuXHRcdFx0XHRcdHRvcCA9ICggcGFnZUhlaWdodCAtIHNsaWRlSGVpZ2h0ICkgLyAyO1xuXG5cdFx0XHRcdHZhciBjb250ZW50SGVpZ2h0ID0gZ2V0QWJzb2x1dGVIZWlnaHQoIHNsaWRlICk7XG5cdFx0XHRcdHZhciBudW1iZXJPZlBhZ2VzID0gTWF0aC5tYXgoIE1hdGguY2VpbCggY29udGVudEhlaWdodCAvIHBhZ2VIZWlnaHQgKSwgMSApO1xuXG5cdFx0XHRcdC8vIENlbnRlciBzbGlkZXMgdmVydGljYWxseVxuXHRcdFx0XHRpZiggbnVtYmVyT2ZQYWdlcyA9PT0gMSAmJiBjb25maWcuY2VudGVyIHx8IHNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ2NlbnRlcicgKSApIHtcblx0XHRcdFx0XHR0b3AgPSBNYXRoLm1heCggKCBwYWdlSGVpZ2h0IC0gY29udGVudEhlaWdodCApIC8gMiwgMCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUG9zaXRpb24gdGhlIHNsaWRlIGluc2lkZSBvZiB0aGUgcGFnZVxuXHRcdFx0XHRzbGlkZS5zdHlsZS5sZWZ0ID0gbGVmdCArICdweCc7XG5cdFx0XHRcdHNsaWRlLnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG5cdFx0XHRcdHNsaWRlLnN0eWxlLndpZHRoID0gc2xpZGVXaWR0aCArICdweCc7XG5cblx0XHRcdFx0Ly8gVE9ETyBCYWNrZ3JvdW5kcyBuZWVkIHRvIGJlIG11bHRpcGxpZWQgd2hlbiB0aGUgc2xpZGVcblx0XHRcdFx0Ly8gc3RyZXRjaGVzIG92ZXIgbXVsdGlwbGUgcGFnZXNcblx0XHRcdFx0dmFyIGJhY2tncm91bmQgPSBzbGlkZS5xdWVyeVNlbGVjdG9yKCAnLnNsaWRlLWJhY2tncm91bmQnICk7XG5cdFx0XHRcdGlmKCBiYWNrZ3JvdW5kICkge1xuXHRcdFx0XHRcdGJhY2tncm91bmQuc3R5bGUud2lkdGggPSBwYWdlV2lkdGggKyAncHgnO1xuXHRcdFx0XHRcdGJhY2tncm91bmQuc3R5bGUuaGVpZ2h0ID0gKCBwYWdlSGVpZ2h0ICogbnVtYmVyT2ZQYWdlcyApICsgJ3B4Jztcblx0XHRcdFx0XHRiYWNrZ3JvdW5kLnN0eWxlLnRvcCA9IC10b3AgKyAncHgnO1xuXHRcdFx0XHRcdGJhY2tncm91bmQuc3R5bGUubGVmdCA9IC1sZWZ0ICsgJ3B4Jztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEluamVjdCBub3RlcyBpZiBgc2hvd05vdGVzYCBpcyBlbmFibGVkXG5cdFx0XHRcdGlmKCBjb25maWcuc2hvd05vdGVzICkge1xuXHRcdFx0XHRcdHZhciBub3RlcyA9IGdldFNsaWRlTm90ZXMoIHNsaWRlICk7XG5cdFx0XHRcdFx0aWYoIG5vdGVzICkge1xuXHRcdFx0XHRcdFx0dmFyIG5vdGVzU3BhY2luZyA9IDg7XG5cdFx0XHRcdFx0XHR2YXIgbm90ZXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRcdFx0XHRcdG5vdGVzRWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnc3BlYWtlci1ub3RlcycgKTtcblx0XHRcdFx0XHRcdG5vdGVzRWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnc3BlYWtlci1ub3Rlcy1wZGYnICk7XG5cdFx0XHRcdFx0XHRub3Rlc0VsZW1lbnQuaW5uZXJIVE1MID0gbm90ZXM7XG5cdFx0XHRcdFx0XHRub3Rlc0VsZW1lbnQuc3R5bGUubGVmdCA9ICggbm90ZXNTcGFjaW5nIC0gbGVmdCApICsgJ3B4Jztcblx0XHRcdFx0XHRcdG5vdGVzRWxlbWVudC5zdHlsZS5ib3R0b20gPSAoIG5vdGVzU3BhY2luZyAtIHRvcCApICsgJ3B4Jztcblx0XHRcdFx0XHRcdG5vdGVzRWxlbWVudC5zdHlsZS53aWR0aCA9ICggcGFnZVdpZHRoIC0gbm90ZXNTcGFjaW5nKjIgKSArICdweCc7XG5cdFx0XHRcdFx0XHRzbGlkZS5hcHBlbmRDaGlsZCggbm90ZXNFbGVtZW50ICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSW5qZWN0IHNsaWRlIG51bWJlcnMgaWYgYHNsaWRlTnVtYmVyc2AgYXJlIGVuYWJsZWRcblx0XHRcdFx0aWYoIGNvbmZpZy5zbGlkZU51bWJlciApIHtcblx0XHRcdFx0XHR2YXIgc2xpZGVOdW1iZXJIID0gcGFyc2VJbnQoIHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtaCcgKSwgMTAgKSArIDEsXG5cdFx0XHRcdFx0XHRzbGlkZU51bWJlclYgPSBwYXJzZUludCggc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC12JyApLCAxMCApICsgMTtcblxuXHRcdFx0XHRcdHZhciBudW1iZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRcdFx0XHRudW1iZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdzbGlkZS1udW1iZXInICk7XG5cdFx0XHRcdFx0bnVtYmVyRWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnc2xpZGUtbnVtYmVyLXBkZicgKTtcblx0XHRcdFx0XHRudW1iZXJFbGVtZW50LmlubmVySFRNTCA9IGZvcm1hdFNsaWRlTnVtYmVyKCBzbGlkZU51bWJlckgsICcuJywgc2xpZGVOdW1iZXJWICk7XG5cdFx0XHRcdFx0YmFja2dyb3VuZC5hcHBlbmRDaGlsZCggbnVtYmVyRWxlbWVudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cblx0XHQvLyBTaG93IGFsbCBmcmFnbWVudHNcblx0XHR0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKyAnIC5mcmFnbWVudCcgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBmcmFnbWVudCApIHtcblx0XHRcdGZyYWdtZW50LmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFRoaXMgaXMgYW4gdW5mb3J0dW5hdGUgbmVjZXNzaXR5LiBTb21lIGFjdGlvbnMg4oCTIHN1Y2ggYXNcblx0ICogYW4gaW5wdXQgZmllbGQgYmVpbmcgZm9jdXNlZCBpbiBhbiBpZnJhbWUgb3IgdXNpbmcgdGhlXG5cdCAqIGtleWJvYXJkIHRvIGV4cGFuZCB0ZXh0IHNlbGVjdGlvbiBiZXlvbmQgdGhlIGJvdW5kcyBvZlxuXHQgKiBhIHNsaWRlIOKAkyBjYW4gdHJpZ2dlciBvdXIgY29udGVudCB0byBiZSBwdXNoZWQgb3V0IG9mIHZpZXcuXG5cdCAqIFRoaXMgc2Nyb2xsaW5nIGNhbiBub3QgYmUgcHJldmVudGVkIGJ5IGhpZGluZyBvdmVyZmxvdyBpblxuXHQgKiBDU1MgKHdlIGFscmVhZHkgZG8pIHNvIHdlIGhhdmUgdG8gcmVzb3J0IHRvIHJlcGVhdGVkbHlcblx0ICogY2hlY2tpbmcgaWYgdGhlIHNsaWRlcyBoYXZlIGJlZW4gb2Zmc2V0IDooXG5cdCAqL1xuXHRmdW5jdGlvbiBzZXR1cFNjcm9sbFByZXZlbnRpb24oKSB7XG5cblx0XHRzZXRJbnRlcnZhbCggZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiggZG9tLndyYXBwZXIuc2Nyb2xsVG9wICE9PSAwIHx8IGRvbS53cmFwcGVyLnNjcm9sbExlZnQgIT09IDAgKSB7XG5cdFx0XHRcdGRvbS53cmFwcGVyLnNjcm9sbFRvcCA9IDA7XG5cdFx0XHRcdGRvbS53cmFwcGVyLnNjcm9sbExlZnQgPSAwO1xuXHRcdFx0fVxuXHRcdH0sIDEwMDAgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYW4gSFRNTCBlbGVtZW50IGFuZCByZXR1cm5zIGEgcmVmZXJlbmNlIHRvIGl0LlxuXHQgKiBJZiB0aGUgZWxlbWVudCBhbHJlYWR5IGV4aXN0cyB0aGUgZXhpc3RpbmcgaW5zdGFuY2Ugd2lsbFxuXHQgKiBiZSByZXR1cm5lZC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVNpbmdsZXRvbk5vZGUoIGNvbnRhaW5lciwgdGFnbmFtZSwgY2xhc3NuYW1lLCBpbm5lckhUTUwgKSB7XG5cblx0XHQvLyBGaW5kIGFsbCBub2RlcyBtYXRjaGluZyB0aGUgZGVzY3JpcHRpb25cblx0XHR2YXIgbm9kZXMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCggJy4nICsgY2xhc3NuYW1lICk7XG5cblx0XHQvLyBDaGVjayBhbGwgbWF0Y2hlcyB0byBmaW5kIG9uZSB3aGljaCBpcyBhIGRpcmVjdCBjaGlsZCBvZlxuXHRcdC8vIHRoZSBzcGVjaWZpZWQgY29udGFpbmVyXG5cdFx0Zm9yKCB2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdHZhciB0ZXN0Tm9kZSA9IG5vZGVzW2ldO1xuXHRcdFx0aWYoIHRlc3ROb2RlLnBhcmVudE5vZGUgPT09IGNvbnRhaW5lciApIHtcblx0XHRcdFx0cmV0dXJuIHRlc3ROb2RlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIElmIG5vIG5vZGUgd2FzIGZvdW5kLCBjcmVhdGUgaXQgbm93XG5cdFx0dmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCB0YWduYW1lICk7XG5cdFx0bm9kZS5jbGFzc0xpc3QuYWRkKCBjbGFzc25hbWUgKTtcblx0XHRpZiggdHlwZW9mIGlubmVySFRNTCA9PT0gJ3N0cmluZycgKSB7XG5cdFx0XHRub2RlLmlubmVySFRNTCA9IGlubmVySFRNTDtcblx0XHR9XG5cdFx0Y29udGFpbmVyLmFwcGVuZENoaWxkKCBub2RlICk7XG5cblx0XHRyZXR1cm4gbm9kZTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgdGhlIHNsaWRlIGJhY2tncm91bmQgZWxlbWVudHMgYW5kIGFwcGVuZHMgdGhlbVxuXHQgKiB0byB0aGUgYmFja2dyb3VuZCBjb250YWluZXIuIE9uZSBlbGVtZW50IGlzIGNyZWF0ZWQgcGVyXG5cdCAqIHNsaWRlIG5vIG1hdHRlciBpZiB0aGUgZ2l2ZW4gc2xpZGUgaGFzIHZpc2libGUgYmFja2dyb3VuZC5cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUJhY2tncm91bmRzKCkge1xuXG5cdFx0dmFyIHByaW50TW9kZSA9IGlzUHJpbnRpbmdQREYoKTtcblxuXHRcdC8vIENsZWFyIHByaW9yIGJhY2tncm91bmRzXG5cdFx0ZG9tLmJhY2tncm91bmQuaW5uZXJIVE1MID0gJyc7XG5cdFx0ZG9tLmJhY2tncm91bmQuY2xhc3NMaXN0LmFkZCggJ25vLXRyYW5zaXRpb24nICk7XG5cblx0XHQvLyBJdGVyYXRlIG92ZXIgYWxsIGhvcml6b250YWwgc2xpZGVzXG5cdFx0dG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBzbGlkZWggKSB7XG5cblx0XHRcdHZhciBiYWNrZ3JvdW5kU3RhY2s7XG5cblx0XHRcdGlmKCBwcmludE1vZGUgKSB7XG5cdFx0XHRcdGJhY2tncm91bmRTdGFjayA9IGNyZWF0ZUJhY2tncm91bmQoIHNsaWRlaCwgc2xpZGVoICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YmFja2dyb3VuZFN0YWNrID0gY3JlYXRlQmFja2dyb3VuZCggc2xpZGVoLCBkb20uYmFja2dyb3VuZCApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJdGVyYXRlIG92ZXIgYWxsIHZlcnRpY2FsIHNsaWRlc1xuXHRcdFx0dG9BcnJheSggc2xpZGVoLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIHNsaWRldiApIHtcblxuXHRcdFx0XHRpZiggcHJpbnRNb2RlICkge1xuXHRcdFx0XHRcdGNyZWF0ZUJhY2tncm91bmQoIHNsaWRldiwgc2xpZGV2ICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Y3JlYXRlQmFja2dyb3VuZCggc2xpZGV2LCBiYWNrZ3JvdW5kU3RhY2sgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJhY2tncm91bmRTdGFjay5jbGFzc0xpc3QuYWRkKCAnc3RhY2snICk7XG5cblx0XHRcdH0gKTtcblxuXHRcdH0gKTtcblxuXHRcdC8vIEFkZCBwYXJhbGxheCBiYWNrZ3JvdW5kIGlmIHNwZWNpZmllZFxuXHRcdGlmKCBjb25maWcucGFyYWxsYXhCYWNrZ3JvdW5kSW1hZ2UgKSB7XG5cblx0XHRcdGRvbS5iYWNrZ3JvdW5kLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoXCInICsgY29uZmlnLnBhcmFsbGF4QmFja2dyb3VuZEltYWdlICsgJ1wiKSc7XG5cdFx0XHRkb20uYmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9IGNvbmZpZy5wYXJhbGxheEJhY2tncm91bmRTaXplO1xuXG5cdFx0XHQvLyBNYWtlIHN1cmUgdGhlIGJlbG93IHByb3BlcnRpZXMgYXJlIHNldCBvbiB0aGUgZWxlbWVudCAtIHRoZXNlIHByb3BlcnRpZXMgYXJlXG5cdFx0XHQvLyBuZWVkZWQgZm9yIHByb3BlciB0cmFuc2l0aW9ucyB0byBiZSBzZXQgb24gdGhlIGVsZW1lbnQgdmlhIENTUy4gVG8gcmVtb3ZlXG5cdFx0XHQvLyBhbm5veWluZyBiYWNrZ3JvdW5kIHNsaWRlLWluIGVmZmVjdCB3aGVuIHRoZSBwcmVzZW50YXRpb24gc3RhcnRzLCBhcHBseVxuXHRcdFx0Ly8gdGhlc2UgcHJvcGVydGllcyBhZnRlciBzaG9ydCB0aW1lIGRlbGF5XG5cdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggJ2hhcy1wYXJhbGxheC1iYWNrZ3JvdW5kJyApO1xuXHRcdFx0fSwgMSApO1xuXG5cdFx0fVxuXHRcdGVsc2Uge1xuXG5cdFx0XHRkb20uYmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAnJztcblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoICdoYXMtcGFyYWxsYXgtYmFja2dyb3VuZCcgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBiYWNrZ3JvdW5kIGZvciB0aGUgZ2l2ZW4gc2xpZGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNsaWRlXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciBUaGUgZWxlbWVudCB0aGF0IHRoZSBiYWNrZ3JvdW5kXG5cdCAqIHNob3VsZCBiZSBhcHBlbmRlZCB0b1xuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlQmFja2dyb3VuZCggc2xpZGUsIGNvbnRhaW5lciApIHtcblxuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YmFja2dyb3VuZDogc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kJyApLFxuXHRcdFx0YmFja2dyb3VuZFNpemU6IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1zaXplJyApLFxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtaW1hZ2UnICksXG5cdFx0XHRiYWNrZ3JvdW5kVmlkZW86IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC12aWRlbycgKSxcblx0XHRcdGJhY2tncm91bmRJZnJhbWU6IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1pZnJhbWUnICksXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1jb2xvcicgKSxcblx0XHRcdGJhY2tncm91bmRSZXBlYXQ6IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1yZXBlYXQnICksXG5cdFx0XHRiYWNrZ3JvdW5kUG9zaXRpb246IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1wb3NpdGlvbicgKSxcblx0XHRcdGJhY2tncm91bmRUcmFuc2l0aW9uOiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtdHJhbnNpdGlvbicgKVxuXHRcdH07XG5cblx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cblx0XHQvLyBDYXJyeSBvdmVyIGN1c3RvbSBjbGFzc2VzIGZyb20gdGhlIHNsaWRlIHRvIHRoZSBiYWNrZ3JvdW5kXG5cdFx0ZWxlbWVudC5jbGFzc05hbWUgPSAnc2xpZGUtYmFja2dyb3VuZCAnICsgc2xpZGUuY2xhc3NOYW1lLnJlcGxhY2UoIC9wcmVzZW50fHBhc3R8ZnV0dXJlLywgJycgKTtcblxuXHRcdGlmKCBkYXRhLmJhY2tncm91bmQgKSB7XG5cdFx0XHQvLyBBdXRvLXdyYXAgaW1hZ2UgdXJscyBpbiB1cmwoLi4uKVxuXHRcdFx0aWYoIC9eKGh0dHB8ZmlsZXxcXC9cXC8pL2dpLnRlc3QoIGRhdGEuYmFja2dyb3VuZCApIHx8IC9cXC4oc3ZnfHBuZ3xqcGd8anBlZ3xnaWZ8Ym1wKSQvZ2kudGVzdCggZGF0YS5iYWNrZ3JvdW5kICkgKSB7XG5cdFx0XHRcdHNsaWRlLnNldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1pbWFnZScsIGRhdGEuYmFja2dyb3VuZCApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IGRhdGEuYmFja2dyb3VuZDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDcmVhdGUgYSBoYXNoIGZvciB0aGlzIGNvbWJpbmF0aW9uIG9mIGJhY2tncm91bmQgc2V0dGluZ3MuXG5cdFx0Ly8gVGhpcyBpcyB1c2VkIHRvIGRldGVybWluZSB3aGVuIHR3byBzbGlkZSBiYWNrZ3JvdW5kcyBhcmVcblx0XHQvLyB0aGUgc2FtZS5cblx0XHRpZiggZGF0YS5iYWNrZ3JvdW5kIHx8IGRhdGEuYmFja2dyb3VuZENvbG9yIHx8IGRhdGEuYmFja2dyb3VuZEltYWdlIHx8IGRhdGEuYmFja2dyb3VuZFZpZGVvIHx8IGRhdGEuYmFja2dyb3VuZElmcmFtZSApIHtcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWhhc2gnLCBkYXRhLmJhY2tncm91bmQgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5iYWNrZ3JvdW5kU2l6ZSArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmJhY2tncm91bmRJbWFnZSArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmJhY2tncm91bmRWaWRlbyArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmJhY2tncm91bmRJZnJhbWUgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5iYWNrZ3JvdW5kQ29sb3IgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5iYWNrZ3JvdW5kUmVwZWF0ICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuYmFja2dyb3VuZFBvc2l0aW9uICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuYmFja2dyb3VuZFRyYW5zaXRpb24gKTtcblx0XHR9XG5cblx0XHQvLyBBZGRpdGlvbmFsIGFuZCBvcHRpb25hbCBiYWNrZ3JvdW5kIHByb3BlcnRpZXNcblx0XHRpZiggZGF0YS5iYWNrZ3JvdW5kU2l6ZSApIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBkYXRhLmJhY2tncm91bmRTaXplO1xuXHRcdGlmKCBkYXRhLmJhY2tncm91bmRDb2xvciApIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZGF0YS5iYWNrZ3JvdW5kQ29sb3I7XG5cdFx0aWYoIGRhdGEuYmFja2dyb3VuZFJlcGVhdCApIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9IGRhdGEuYmFja2dyb3VuZFJlcGVhdDtcblx0XHRpZiggZGF0YS5iYWNrZ3JvdW5kUG9zaXRpb24gKSBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IGRhdGEuYmFja2dyb3VuZFBvc2l0aW9uO1xuXHRcdGlmKCBkYXRhLmJhY2tncm91bmRUcmFuc2l0aW9uICkgZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtdHJhbnNpdGlvbicsIGRhdGEuYmFja2dyb3VuZFRyYW5zaXRpb24gKTtcblxuXHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZCggZWxlbWVudCApO1xuXG5cdFx0Ly8gSWYgYmFja2dyb3VuZHMgYXJlIGJlaW5nIHJlY3JlYXRlZCwgY2xlYXIgb2xkIGNsYXNzZXNcblx0XHRzbGlkZS5jbGFzc0xpc3QucmVtb3ZlKCAnaGFzLWRhcmstYmFja2dyb3VuZCcgKTtcblx0XHRzbGlkZS5jbGFzc0xpc3QucmVtb3ZlKCAnaGFzLWxpZ2h0LWJhY2tncm91bmQnICk7XG5cblx0XHQvLyBJZiB0aGlzIHNsaWRlIGhhcyBhIGJhY2tncm91bmQgY29sb3IsIGFkZCBhIGNsYXNzIHRoYXRcblx0XHQvLyBzaWduYWxzIGlmIGl0IGlzIGxpZ2h0IG9yIGRhcmsuIElmIHRoZSBzbGlkZSBoYXMgbm8gYmFja2dyb3VuZFxuXHRcdC8vIGNvbG9yLCBubyBjbGFzcyB3aWxsIGJlIHNldFxuXHRcdHZhciBjb21wdXRlZEJhY2tncm91bmRDb2xvciA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBlbGVtZW50ICkuYmFja2dyb3VuZENvbG9yO1xuXHRcdGlmKCBjb21wdXRlZEJhY2tncm91bmRDb2xvciApIHtcblx0XHRcdHZhciByZ2IgPSBjb2xvclRvUmdiKCBjb21wdXRlZEJhY2tncm91bmRDb2xvciApO1xuXG5cdFx0XHQvLyBJZ25vcmUgZnVsbHkgdHJhbnNwYXJlbnQgYmFja2dyb3VuZHMuIFNvbWUgYnJvd3NlcnMgcmV0dXJuXG5cdFx0XHQvLyByZ2JhKDAsMCwwLDApIHdoZW4gcmVhZGluZyB0aGUgY29tcHV0ZWQgYmFja2dyb3VuZCBjb2xvciBvZlxuXHRcdFx0Ly8gYW4gZWxlbWVudCB3aXRoIG5vIGJhY2tncm91bmRcblx0XHRcdGlmKCByZ2IgJiYgcmdiLmEgIT09IDAgKSB7XG5cdFx0XHRcdGlmKCBjb2xvckJyaWdodG5lc3MoIGNvbXB1dGVkQmFja2dyb3VuZENvbG9yICkgPCAxMjggKSB7XG5cdFx0XHRcdFx0c2xpZGUuY2xhc3NMaXN0LmFkZCggJ2hhcy1kYXJrLWJhY2tncm91bmQnICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c2xpZGUuY2xhc3NMaXN0LmFkZCggJ2hhcy1saWdodC1iYWNrZ3JvdW5kJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGVsZW1lbnQ7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlcnMgYSBsaXN0ZW5lciB0byBwb3N0TWVzc2FnZSBldmVudHMsIHRoaXMgbWFrZXMgaXRcblx0ICogcG9zc2libGUgdG8gY2FsbCBhbGwgcmV2ZWFsLmpzIEFQSSBtZXRob2RzIGZyb20gYW5vdGhlclxuXHQgKiB3aW5kb3cuIEZvciBleGFtcGxlOlxuXHQgKlxuXHQgKiByZXZlYWxXaW5kb3cucG9zdE1lc3NhZ2UoIEpTT04uc3RyaW5naWZ5KHtcblx0ICogICBtZXRob2Q6ICdzbGlkZScsXG5cdCAqICAgYXJnczogWyAyIF1cblx0ICogfSksICcqJyApO1xuXHQgKi9cblx0ZnVuY3Rpb24gc2V0dXBQb3N0TWVzc2FnZSgpIHtcblxuXHRcdGlmKCBjb25maWcucG9zdE1lc3NhZ2UgKSB7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21lc3NhZ2UnLCBmdW5jdGlvbiAoIGV2ZW50ICkge1xuXHRcdFx0XHR2YXIgZGF0YSA9IGV2ZW50LmRhdGE7XG5cblx0XHRcdFx0Ly8gTWFrZSBzdXJlIHdlJ3JlIGRlYWxpbmcgd2l0aCBKU09OXG5cdFx0XHRcdGlmKCB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgJiYgZGF0YS5jaGFyQXQoIDAgKSA9PT0gJ3snICYmIGRhdGEuY2hhckF0KCBkYXRhLmxlbmd0aCAtIDEgKSA9PT0gJ30nICkge1xuXHRcdFx0XHRcdGRhdGEgPSBKU09OLnBhcnNlKCBkYXRhICk7XG5cblx0XHRcdFx0XHQvLyBDaGVjayBpZiB0aGUgcmVxdWVzdGVkIG1ldGhvZCBjYW4gYmUgZm91bmRcblx0XHRcdFx0XHRpZiggZGF0YS5tZXRob2QgJiYgdHlwZW9mIFJldmVhbFtkYXRhLm1ldGhvZF0gPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0XHRSZXZlYWxbZGF0YS5tZXRob2RdLmFwcGx5KCBSZXZlYWwsIGRhdGEuYXJncyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSwgZmFsc2UgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBBcHBsaWVzIHRoZSBjb25maWd1cmF0aW9uIHNldHRpbmdzIGZyb20gdGhlIGNvbmZpZ1xuXHQgKiBvYmplY3QuIE1heSBiZSBjYWxsZWQgbXVsdGlwbGUgdGltZXMuXG5cdCAqL1xuXHRmdW5jdGlvbiBjb25maWd1cmUoIG9wdGlvbnMgKSB7XG5cblx0XHR2YXIgbnVtYmVyT2ZTbGlkZXMgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKS5sZW5ndGg7XG5cblx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCBjb25maWcudHJhbnNpdGlvbiApO1xuXG5cdFx0Ly8gTmV3IGNvbmZpZyBvcHRpb25zIG1heSBiZSBwYXNzZWQgd2hlbiB0aGlzIG1ldGhvZFxuXHRcdC8vIGlzIGludm9rZWQgdGhyb3VnaCB0aGUgQVBJIGFmdGVyIGluaXRpYWxpemF0aW9uXG5cdFx0aWYoIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyApIGV4dGVuZCggY29uZmlnLCBvcHRpb25zICk7XG5cblx0XHQvLyBGb3JjZSBsaW5lYXIgdHJhbnNpdGlvbiBiYXNlZCBvbiBicm93c2VyIGNhcGFiaWxpdGllc1xuXHRcdGlmKCBmZWF0dXJlcy50cmFuc2Zvcm1zM2QgPT09IGZhbHNlICkgY29uZmlnLnRyYW5zaXRpb24gPSAnbGluZWFyJztcblxuXHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoIGNvbmZpZy50cmFuc2l0aW9uICk7XG5cblx0XHRkb20ud3JhcHBlci5zZXRBdHRyaWJ1dGUoICdkYXRhLXRyYW5zaXRpb24tc3BlZWQnLCBjb25maWcudHJhbnNpdGlvblNwZWVkICk7XG5cdFx0ZG9tLndyYXBwZXIuc2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLXRyYW5zaXRpb24nLCBjb25maWcuYmFja2dyb3VuZFRyYW5zaXRpb24gKTtcblxuXHRcdGRvbS5jb250cm9scy5zdHlsZS5kaXNwbGF5ID0gY29uZmlnLmNvbnRyb2xzID8gJ2Jsb2NrJyA6ICdub25lJztcblx0XHRkb20ucHJvZ3Jlc3Muc3R5bGUuZGlzcGxheSA9IGNvbmZpZy5wcm9ncmVzcyA/ICdibG9jaycgOiAnbm9uZSc7XG5cdFx0ZG9tLnNsaWRlTnVtYmVyLnN0eWxlLmRpc3BsYXkgPSBjb25maWcuc2xpZGVOdW1iZXIgJiYgIWlzUHJpbnRpbmdQREYoKSA/ICdibG9jaycgOiAnbm9uZSc7XG5cblx0XHRpZiggY29uZmlnLnNodWZmbGUgKSB7XG5cdFx0XHRzaHVmZmxlKCk7XG5cdFx0fVxuXG5cdFx0aWYoIGNvbmZpZy5ydGwgKSB7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCAncnRsJyApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoICdydGwnICk7XG5cdFx0fVxuXG5cdFx0aWYoIGNvbmZpZy5jZW50ZXIgKSB7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCAnY2VudGVyJyApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoICdjZW50ZXInICk7XG5cdFx0fVxuXG5cdFx0Ly8gRXhpdCB0aGUgcGF1c2VkIG1vZGUgaWYgaXQgd2FzIGNvbmZpZ3VyZWQgb2ZmXG5cdFx0aWYoIGNvbmZpZy5wYXVzZSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRyZXN1bWUoKTtcblx0XHR9XG5cblx0XHRpZiggY29uZmlnLnNob3dOb3RlcyApIHtcblx0XHRcdGRvbS5zcGVha2VyTm90ZXMuY2xhc3NMaXN0LmFkZCggJ3Zpc2libGUnICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZG9tLnNwZWFrZXJOb3Rlcy5jbGFzc0xpc3QucmVtb3ZlKCAndmlzaWJsZScgKTtcblx0XHR9XG5cblx0XHRpZiggY29uZmlnLm1vdXNlV2hlZWwgKSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnRE9NTW91c2VTY3JvbGwnLCBvbkRvY3VtZW50TW91c2VTY3JvbGwsIGZhbHNlICk7IC8vIEZGXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAnbW91c2V3aGVlbCcsIG9uRG9jdW1lbnRNb3VzZVNjcm9sbCwgZmFsc2UgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnRE9NTW91c2VTY3JvbGwnLCBvbkRvY3VtZW50TW91c2VTY3JvbGwsIGZhbHNlICk7IC8vIEZGXG5cdFx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbW91c2V3aGVlbCcsIG9uRG9jdW1lbnRNb3VzZVNjcm9sbCwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHQvLyBSb2xsaW5nIDNEIGxpbmtzXG5cdFx0aWYoIGNvbmZpZy5yb2xsaW5nTGlua3MgKSB7XG5cdFx0XHRlbmFibGVSb2xsaW5nTGlua3MoKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRkaXNhYmxlUm9sbGluZ0xpbmtzKCk7XG5cdFx0fVxuXG5cdFx0Ly8gSWZyYW1lIGxpbmsgcHJldmlld3Ncblx0XHRpZiggY29uZmlnLnByZXZpZXdMaW5rcyApIHtcblx0XHRcdGVuYWJsZVByZXZpZXdMaW5rcygpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGRpc2FibGVQcmV2aWV3TGlua3MoKTtcblx0XHRcdGVuYWJsZVByZXZpZXdMaW5rcyggJ1tkYXRhLXByZXZpZXctbGlua10nICk7XG5cdFx0fVxuXG5cdFx0Ly8gUmVtb3ZlIGV4aXN0aW5nIGF1dG8tc2xpZGUgY29udHJvbHNcblx0XHRpZiggYXV0b1NsaWRlUGxheWVyICkge1xuXHRcdFx0YXV0b1NsaWRlUGxheWVyLmRlc3Ryb3koKTtcblx0XHRcdGF1dG9TbGlkZVBsYXllciA9IG51bGw7XG5cdFx0fVxuXG5cdFx0Ly8gR2VuZXJhdGUgYXV0by1zbGlkZSBjb250cm9scyBpZiBuZWVkZWRcblx0XHRpZiggbnVtYmVyT2ZTbGlkZXMgPiAxICYmIGNvbmZpZy5hdXRvU2xpZGUgJiYgY29uZmlnLmF1dG9TbGlkZVN0b3BwYWJsZSAmJiBmZWF0dXJlcy5jYW52YXMgJiYgZmVhdHVyZXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lICkge1xuXHRcdFx0YXV0b1NsaWRlUGxheWVyID0gbmV3IFBsYXliYWNrKCBkb20ud3JhcHBlciwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiBNYXRoLm1pbiggTWF0aC5tYXgoICggRGF0ZS5ub3coKSAtIGF1dG9TbGlkZVN0YXJ0VGltZSApIC8gYXV0b1NsaWRlLCAwICksIDEgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0YXV0b1NsaWRlUGxheWVyLm9uKCAnY2xpY2snLCBvbkF1dG9TbGlkZVBsYXllckNsaWNrICk7XG5cdFx0XHRhdXRvU2xpZGVQYXVzZWQgPSBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBXaGVuIGZyYWdtZW50cyBhcmUgdHVybmVkIG9mZiB0aGV5IHNob3VsZCBiZSB2aXNpYmxlXG5cdFx0aWYoIGNvbmZpZy5mcmFnbWVudHMgPT09IGZhbHNlICkge1xuXHRcdFx0dG9BcnJheSggZG9tLnNsaWRlcy5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ3Zpc2libGUnICk7XG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ2N1cnJlbnQtZnJhZ21lbnQnICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0c3luYygpO1xuXG5cdH1cblxuXHQvKipcblx0ICogQmluZHMgYWxsIGV2ZW50IGxpc3RlbmVycy5cblx0ICovXG5cdGZ1bmN0aW9uIGFkZEV2ZW50TGlzdGVuZXJzKCkge1xuXG5cdFx0ZXZlbnRzQXJlQm91bmQgPSB0cnVlO1xuXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdoYXNoY2hhbmdlJywgb25XaW5kb3dIYXNoQ2hhbmdlLCBmYWxzZSApO1xuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAncmVzaXplJywgb25XaW5kb3dSZXNpemUsIGZhbHNlICk7XG5cblx0XHRpZiggY29uZmlnLnRvdWNoICkge1xuXHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoc3RhcnQnLCBvblRvdWNoU3RhcnQsIGZhbHNlICk7XG5cdFx0XHRkb20ud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCAndG91Y2htb3ZlJywgb25Ub3VjaE1vdmUsIGZhbHNlICk7XG5cdFx0XHRkb20ud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCAndG91Y2hlbmQnLCBvblRvdWNoRW5kLCBmYWxzZSApO1xuXG5cdFx0XHQvLyBTdXBwb3J0IHBvaW50ZXItc3R5bGUgdG91Y2ggaW50ZXJhY3Rpb24gYXMgd2VsbFxuXHRcdFx0aWYoIHdpbmRvdy5uYXZpZ2F0b3IucG9pbnRlckVuYWJsZWQgKSB7XG5cdFx0XHRcdC8vIElFIDExIHVzZXMgdW4tcHJlZml4ZWQgdmVyc2lvbiBvZiBwb2ludGVyIGV2ZW50c1xuXHRcdFx0XHRkb20ud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCAncG9pbnRlcmRvd24nLCBvblBvaW50ZXJEb3duLCBmYWxzZSApO1xuXHRcdFx0XHRkb20ud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCAncG9pbnRlcm1vdmUnLCBvblBvaW50ZXJNb3ZlLCBmYWxzZSApO1xuXHRcdFx0XHRkb20ud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCAncG9pbnRlcnVwJywgb25Qb2ludGVyVXAsIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCB3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgKSB7XG5cdFx0XHRcdC8vIElFIDEwIHVzZXMgcHJlZml4ZWQgdmVyc2lvbiBvZiBwb2ludGVyIGV2ZW50c1xuXHRcdFx0XHRkb20ud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyRG93bicsIG9uUG9pbnRlckRvd24sIGZhbHNlICk7XG5cdFx0XHRcdGRvbS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoICdNU1BvaW50ZXJNb3ZlJywgb25Qb2ludGVyTW92ZSwgZmFsc2UgKTtcblx0XHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlclVwJywgb25Qb2ludGVyVXAsIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoIGNvbmZpZy5rZXlib2FyZCApIHtcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywgb25Eb2N1bWVudEtleURvd24sIGZhbHNlICk7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAna2V5cHJlc3MnLCBvbkRvY3VtZW50S2V5UHJlc3MsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0aWYoIGNvbmZpZy5wcm9ncmVzcyAmJiBkb20ucHJvZ3Jlc3MgKSB7XG5cdFx0XHRkb20ucHJvZ3Jlc3MuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgb25Qcm9ncmVzc0NsaWNrZWQsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0aWYoIGNvbmZpZy5mb2N1c0JvZHlPblBhZ2VWaXNpYmlsaXR5Q2hhbmdlICkge1xuXHRcdFx0dmFyIHZpc2liaWxpdHlDaGFuZ2U7XG5cblx0XHRcdGlmKCAnaGlkZGVuJyBpbiBkb2N1bWVudCApIHtcblx0XHRcdFx0dmlzaWJpbGl0eUNoYW5nZSA9ICd2aXNpYmlsaXR5Y2hhbmdlJztcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoICdtc0hpZGRlbicgaW4gZG9jdW1lbnQgKSB7XG5cdFx0XHRcdHZpc2liaWxpdHlDaGFuZ2UgPSAnbXN2aXNpYmlsaXR5Y2hhbmdlJztcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoICd3ZWJraXRIaWRkZW4nIGluIGRvY3VtZW50ICkge1xuXHRcdFx0XHR2aXNpYmlsaXR5Q2hhbmdlID0gJ3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiggdmlzaWJpbGl0eUNoYW5nZSApIHtcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggdmlzaWJpbGl0eUNoYW5nZSwgb25QYWdlVmlzaWJpbGl0eUNoYW5nZSwgZmFsc2UgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBMaXN0ZW4gdG8gYm90aCB0b3VjaCBhbmQgY2xpY2sgZXZlbnRzLCBpbiBjYXNlIHRoZSBkZXZpY2Vcblx0XHQvLyBzdXBwb3J0cyBib3RoXG5cdFx0dmFyIHBvaW50ZXJFdmVudHMgPSBbICd0b3VjaHN0YXJ0JywgJ2NsaWNrJyBdO1xuXG5cdFx0Ly8gT25seSBzdXBwb3J0IHRvdWNoIGZvciBBbmRyb2lkLCBmaXhlcyBkb3VibGUgbmF2aWdhdGlvbnMgaW5cblx0XHQvLyBzdG9jayBicm93c2VyXG5cdFx0aWYoIFVBLm1hdGNoKCAvYW5kcm9pZC9naSApICkge1xuXHRcdFx0cG9pbnRlckV2ZW50cyA9IFsgJ3RvdWNoc3RhcnQnIF07XG5cdFx0fVxuXG5cdFx0cG9pbnRlckV2ZW50cy5mb3JFYWNoKCBmdW5jdGlvbiggZXZlbnROYW1lICkge1xuXHRcdFx0ZG9tLmNvbnRyb2xzTGVmdC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZUxlZnRDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNSaWdodC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZVJpZ2h0Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzVXAuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5hZGRFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVVcENsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc0Rvd24uZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5hZGRFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVEb3duQ2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzUHJldi5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZVByZXZDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNOZXh0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlTmV4dENsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVbmJpbmRzIGFsbCBldmVudCBsaXN0ZW5lcnMuXG5cdCAqL1xuXHRmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVycygpIHtcblxuXHRcdGV2ZW50c0FyZUJvdW5kID0gZmFsc2U7XG5cblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIG9uRG9jdW1lbnRLZXlEb3duLCBmYWxzZSApO1xuXHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdrZXlwcmVzcycsIG9uRG9jdW1lbnRLZXlQcmVzcywgZmFsc2UgKTtcblx0XHR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2hhc2hjaGFuZ2UnLCBvbldpbmRvd0hhc2hDaGFuZ2UsIGZhbHNlICk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdyZXNpemUnLCBvbldpbmRvd1Jlc2l6ZSwgZmFsc2UgKTtcblxuXHRcdGRvbS53cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0LCBmYWxzZSApO1xuXHRcdGRvbS53cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSwgZmFsc2UgKTtcblx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAndG91Y2hlbmQnLCBvblRvdWNoRW5kLCBmYWxzZSApO1xuXG5cdFx0Ly8gSUUxMVxuXHRcdGlmKCB3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkICkge1xuXHRcdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJkb3duJywgb25Qb2ludGVyRG93biwgZmFsc2UgKTtcblx0XHRcdGRvbS53cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdwb2ludGVybW92ZScsIG9uUG9pbnRlck1vdmUsIGZhbHNlICk7XG5cdFx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAncG9pbnRlcnVwJywgb25Qb2ludGVyVXAsIGZhbHNlICk7XG5cdFx0fVxuXHRcdC8vIElFMTBcblx0XHRlbHNlIGlmKCB3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgKSB7XG5cdFx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyRG93bicsIG9uUG9pbnRlckRvd24sIGZhbHNlICk7XG5cdFx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyTW92ZScsIG9uUG9pbnRlck1vdmUsIGZhbHNlICk7XG5cdFx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyVXAnLCBvblBvaW50ZXJVcCwgZmFsc2UgKTtcblx0XHR9XG5cblx0XHRpZiAoIGNvbmZpZy5wcm9ncmVzcyAmJiBkb20ucHJvZ3Jlc3MgKSB7XG5cdFx0XHRkb20ucHJvZ3Jlc3MucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgb25Qcm9ncmVzc0NsaWNrZWQsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0WyAndG91Y2hzdGFydCcsICdjbGljaycgXS5mb3JFYWNoKCBmdW5jdGlvbiggZXZlbnROYW1lICkge1xuXHRcdFx0ZG9tLmNvbnRyb2xzTGVmdC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZUxlZnRDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNSaWdodC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZVJpZ2h0Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzVXAuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVVcENsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc0Rvd24uZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVEb3duQ2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzUHJldi5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZVByZXZDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNOZXh0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlTmV4dENsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBFeHRlbmQgb2JqZWN0IGEgd2l0aCB0aGUgcHJvcGVydGllcyBvZiBvYmplY3QgYi5cblx0ICogSWYgdGhlcmUncyBhIGNvbmZsaWN0LCBvYmplY3QgYiB0YWtlcyBwcmVjZWRlbmNlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZXh0ZW5kKCBhLCBiICkge1xuXG5cdFx0Zm9yKCB2YXIgaSBpbiBiICkge1xuXHRcdFx0YVsgaSBdID0gYlsgaSBdO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIHRoZSB0YXJnZXQgb2JqZWN0IHRvIGFuIGFycmF5LlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9BcnJheSggbyApIHtcblxuXHRcdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggbyApO1xuXG5cdH1cblxuXHQvKipcblx0ICogVXRpbGl0eSBmb3IgZGVzZXJpYWxpemluZyBhIHZhbHVlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGVzZXJpYWxpemUoIHZhbHVlICkge1xuXG5cdFx0aWYoIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgKSB7XG5cdFx0XHRpZiggdmFsdWUgPT09ICdudWxsJyApIHJldHVybiBudWxsO1xuXHRcdFx0ZWxzZSBpZiggdmFsdWUgPT09ICd0cnVlJyApIHJldHVybiB0cnVlO1xuXHRcdFx0ZWxzZSBpZiggdmFsdWUgPT09ICdmYWxzZScgKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRlbHNlIGlmKCB2YWx1ZS5tYXRjaCggL15cXGQrJC8gKSApIHJldHVybiBwYXJzZUZsb2F0KCB2YWx1ZSApO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWx1ZTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIE1lYXN1cmVzIHRoZSBkaXN0YW5jZSBpbiBwaXhlbHMgYmV0d2VlbiBwb2ludCBhXG5cdCAqIGFuZCBwb2ludCBiLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gYSBwb2ludCB3aXRoIHgveSBwcm9wZXJ0aWVzXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBiIHBvaW50IHdpdGggeC95IHByb3BlcnRpZXNcblx0ICovXG5cdGZ1bmN0aW9uIGRpc3RhbmNlQmV0d2VlbiggYSwgYiApIHtcblxuXHRcdHZhciBkeCA9IGEueCAtIGIueCxcblx0XHRcdGR5ID0gYS55IC0gYi55O1xuXG5cdFx0cmV0dXJuIE1hdGguc3FydCggZHgqZHggKyBkeSpkeSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyBhIENTUyB0cmFuc2Zvcm0gdG8gdGhlIHRhcmdldCBlbGVtZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gdHJhbnNmb3JtRWxlbWVudCggZWxlbWVudCwgdHJhbnNmb3JtICkge1xuXG5cdFx0ZWxlbWVudC5zdHlsZS5XZWJraXRUcmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cdFx0ZWxlbWVudC5zdHlsZS5Nb3pUcmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cdFx0ZWxlbWVudC5zdHlsZS5tc1RyYW5zZm9ybSA9IHRyYW5zZm9ybTtcblx0XHRlbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgQ1NTIHRyYW5zZm9ybXMgdG8gdGhlIHNsaWRlcyBjb250YWluZXIuIFRoZSBjb250YWluZXJcblx0ICogaXMgdHJhbnNmb3JtZWQgZnJvbSB0d28gc2VwYXJhdGUgc291cmNlczogbGF5b3V0IGFuZCB0aGUgb3ZlcnZpZXdcblx0ICogbW9kZS5cblx0ICovXG5cdGZ1bmN0aW9uIHRyYW5zZm9ybVNsaWRlcyggdHJhbnNmb3JtcyApIHtcblxuXHRcdC8vIFBpY2sgdXAgbmV3IHRyYW5zZm9ybXMgZnJvbSBhcmd1bWVudHNcblx0XHRpZiggdHlwZW9mIHRyYW5zZm9ybXMubGF5b3V0ID09PSAnc3RyaW5nJyApIHNsaWRlc1RyYW5zZm9ybS5sYXlvdXQgPSB0cmFuc2Zvcm1zLmxheW91dDtcblx0XHRpZiggdHlwZW9mIHRyYW5zZm9ybXMub3ZlcnZpZXcgPT09ICdzdHJpbmcnICkgc2xpZGVzVHJhbnNmb3JtLm92ZXJ2aWV3ID0gdHJhbnNmb3Jtcy5vdmVydmlldztcblxuXHRcdC8vIEFwcGx5IHRoZSB0cmFuc2Zvcm1zIHRvIHRoZSBzbGlkZXMgY29udGFpbmVyXG5cdFx0aWYoIHNsaWRlc1RyYW5zZm9ybS5sYXlvdXQgKSB7XG5cdFx0XHR0cmFuc2Zvcm1FbGVtZW50KCBkb20uc2xpZGVzLCBzbGlkZXNUcmFuc2Zvcm0ubGF5b3V0ICsgJyAnICsgc2xpZGVzVHJhbnNmb3JtLm92ZXJ2aWV3ICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dHJhbnNmb3JtRWxlbWVudCggZG9tLnNsaWRlcywgc2xpZGVzVHJhbnNmb3JtLm92ZXJ2aWV3ICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSW5qZWN0cyB0aGUgZ2l2ZW4gQ1NTIHN0eWxlcyBpbnRvIHRoZSBET00uXG5cdCAqL1xuXHRmdW5jdGlvbiBpbmplY3RTdHlsZVNoZWV0KCB2YWx1ZSApIHtcblxuXHRcdHZhciB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3R5bGUnICk7XG5cdFx0dGFnLnR5cGUgPSAndGV4dC9jc3MnO1xuXHRcdGlmKCB0YWcuc3R5bGVTaGVldCApIHtcblx0XHRcdHRhZy5zdHlsZVNoZWV0LmNzc1RleHQgPSB2YWx1ZTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0YWcuYXBwZW5kQ2hpbGQoIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCB2YWx1ZSApICk7XG5cdFx0fVxuXHRcdGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnaGVhZCcgKVswXS5hcHBlbmRDaGlsZCggdGFnICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyB2YXJpb3VzIGNvbG9yIGlucHV0IGZvcm1hdHMgdG8gYW4ge3I6MCxnOjAsYjowfSBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBjb2xvciBUaGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgY29sb3IsXG5cdCAqIHRoZSBmb2xsb3dpbmcgZm9ybWF0cyBhcmUgc3VwcG9ydGVkOlxuXHQgKiAtICMwMDBcblx0ICogLSAjMDAwMDAwXG5cdCAqIC0gcmdiKDAsMCwwKVxuXHQgKi9cblx0ZnVuY3Rpb24gY29sb3JUb1JnYiggY29sb3IgKSB7XG5cblx0XHR2YXIgaGV4MyA9IGNvbG9yLm1hdGNoKCAvXiMoWzAtOWEtZl17M30pJC9pICk7XG5cdFx0aWYoIGhleDMgJiYgaGV4M1sxXSApIHtcblx0XHRcdGhleDMgPSBoZXgzWzFdO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cjogcGFyc2VJbnQoIGhleDMuY2hhckF0KCAwICksIDE2ICkgKiAweDExLFxuXHRcdFx0XHRnOiBwYXJzZUludCggaGV4My5jaGFyQXQoIDEgKSwgMTYgKSAqIDB4MTEsXG5cdFx0XHRcdGI6IHBhcnNlSW50KCBoZXgzLmNoYXJBdCggMiApLCAxNiApICogMHgxMVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHR2YXIgaGV4NiA9IGNvbG9yLm1hdGNoKCAvXiMoWzAtOWEtZl17Nn0pJC9pICk7XG5cdFx0aWYoIGhleDYgJiYgaGV4NlsxXSApIHtcblx0XHRcdGhleDYgPSBoZXg2WzFdO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cjogcGFyc2VJbnQoIGhleDYuc3Vic3RyKCAwLCAyICksIDE2ICksXG5cdFx0XHRcdGc6IHBhcnNlSW50KCBoZXg2LnN1YnN0ciggMiwgMiApLCAxNiApLFxuXHRcdFx0XHRiOiBwYXJzZUludCggaGV4Ni5zdWJzdHIoIDQsIDIgKSwgMTYgKVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHR2YXIgcmdiID0gY29sb3IubWF0Y2goIC9ecmdiXFxzKlxcKFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqXFwpJC9pICk7XG5cdFx0aWYoIHJnYiApIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHI6IHBhcnNlSW50KCByZ2JbMV0sIDEwICksXG5cdFx0XHRcdGc6IHBhcnNlSW50KCByZ2JbMl0sIDEwICksXG5cdFx0XHRcdGI6IHBhcnNlSW50KCByZ2JbM10sIDEwIClcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0dmFyIHJnYmEgPSBjb2xvci5tYXRjaCggL15yZ2JhXFxzKlxcKFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqLFxccyooXFxkKylcXHMqXFwsXFxzKihbXFxkXSt8W1xcZF0qLltcXGRdKylcXHMqXFwpJC9pICk7XG5cdFx0aWYoIHJnYmEgKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyOiBwYXJzZUludCggcmdiYVsxXSwgMTAgKSxcblx0XHRcdFx0ZzogcGFyc2VJbnQoIHJnYmFbMl0sIDEwICksXG5cdFx0XHRcdGI6IHBhcnNlSW50KCByZ2JhWzNdLCAxMCApLFxuXHRcdFx0XHRhOiBwYXJzZUZsb2F0KCByZ2JhWzRdIClcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGVzIGJyaWdodG5lc3Mgb24gYSBzY2FsZSBvZiAwLTI1NS5cblx0ICpcblx0ICogQHBhcmFtIGNvbG9yIFNlZSBjb2xvclN0cmluZ1RvUmdiIGZvciBzdXBwb3J0ZWQgZm9ybWF0cy5cblx0ICovXG5cdGZ1bmN0aW9uIGNvbG9yQnJpZ2h0bmVzcyggY29sb3IgKSB7XG5cblx0XHRpZiggdHlwZW9mIGNvbG9yID09PSAnc3RyaW5nJyApIGNvbG9yID0gY29sb3JUb1JnYiggY29sb3IgKTtcblxuXHRcdGlmKCBjb2xvciApIHtcblx0XHRcdHJldHVybiAoIGNvbG9yLnIgKiAyOTkgKyBjb2xvci5nICogNTg3ICsgY29sb3IuYiAqIDExNCApIC8gMTAwMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgaGVpZ2h0IG9mIHRoZSBnaXZlbiBlbGVtZW50IGJ5IGxvb2tpbmdcblx0ICogYXQgdGhlIHBvc2l0aW9uIGFuZCBoZWlnaHQgb2YgaXRzIGltbWVkaWF0ZSBjaGlsZHJlbi5cblx0ICovXG5cdGZ1bmN0aW9uIGdldEFic29sdXRlSGVpZ2h0KCBlbGVtZW50ICkge1xuXG5cdFx0dmFyIGhlaWdodCA9IDA7XG5cblx0XHRpZiggZWxlbWVudCApIHtcblx0XHRcdHZhciBhYnNvbHV0ZUNoaWxkcmVuID0gMDtcblxuXHRcdFx0dG9BcnJheSggZWxlbWVudC5jaGlsZE5vZGVzICkuZm9yRWFjaCggZnVuY3Rpb24oIGNoaWxkICkge1xuXG5cdFx0XHRcdGlmKCB0eXBlb2YgY2hpbGQub2Zmc2V0VG9wID09PSAnbnVtYmVyJyAmJiBjaGlsZC5zdHlsZSApIHtcblx0XHRcdFx0XHQvLyBDb3VudCAjIG9mIGFicyBjaGlsZHJlblxuXHRcdFx0XHRcdGlmKCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggY2hpbGQgKS5wb3NpdGlvbiA9PT0gJ2Fic29sdXRlJyApIHtcblx0XHRcdFx0XHRcdGFic29sdXRlQ2hpbGRyZW4gKz0gMTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRoZWlnaHQgPSBNYXRoLm1heCggaGVpZ2h0LCBjaGlsZC5vZmZzZXRUb3AgKyBjaGlsZC5vZmZzZXRIZWlnaHQgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIElmIHRoZXJlIGFyZSBubyBhYnNvbHV0ZSBjaGlsZHJlbiwgdXNlIG9mZnNldEhlaWdodFxuXHRcdFx0aWYoIGFic29sdXRlQ2hpbGRyZW4gPT09IDAgKSB7XG5cdFx0XHRcdGhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhlaWdodDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHJlbWFpbmluZyBoZWlnaHQgd2l0aGluIHRoZSBwYXJlbnQgb2YgdGhlXG5cdCAqIHRhcmdldCBlbGVtZW50LlxuXHQgKlxuXHQgKiByZW1haW5pbmcgaGVpZ2h0ID0gWyBjb25maWd1cmVkIHBhcmVudCBoZWlnaHQgXSAtIFsgY3VycmVudCBwYXJlbnQgaGVpZ2h0IF1cblx0ICovXG5cdGZ1bmN0aW9uIGdldFJlbWFpbmluZ0hlaWdodCggZWxlbWVudCwgaGVpZ2h0ICkge1xuXG5cdFx0aGVpZ2h0ID0gaGVpZ2h0IHx8IDA7XG5cblx0XHRpZiggZWxlbWVudCApIHtcblx0XHRcdHZhciBuZXdIZWlnaHQsIG9sZEhlaWdodCA9IGVsZW1lbnQuc3R5bGUuaGVpZ2h0O1xuXG5cdFx0XHQvLyBDaGFuZ2UgdGhlIC5zdHJldGNoIGVsZW1lbnQgaGVpZ2h0IHRvIDAgaW4gb3JkZXIgZmluZCB0aGUgaGVpZ2h0IG9mIGFsbFxuXHRcdFx0Ly8gdGhlIG90aGVyIGVsZW1lbnRzXG5cdFx0XHRlbGVtZW50LnN0eWxlLmhlaWdodCA9ICcwcHgnO1xuXHRcdFx0bmV3SGVpZ2h0ID0gaGVpZ2h0IC0gZWxlbWVudC5wYXJlbnROb2RlLm9mZnNldEhlaWdodDtcblxuXHRcdFx0Ly8gUmVzdG9yZSB0aGUgb2xkIGhlaWdodCwganVzdCBpbiBjYXNlXG5cdFx0XHRlbGVtZW50LnN0eWxlLmhlaWdodCA9IG9sZEhlaWdodCArICdweCc7XG5cblx0XHRcdHJldHVybiBuZXdIZWlnaHQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhlaWdodDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGlzIGluc3RhbmNlIGlzIGJlaW5nIHVzZWQgdG8gcHJpbnQgYSBQREYuXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1ByaW50aW5nUERGKCkge1xuXG5cdFx0cmV0dXJuICggL3ByaW50LXBkZi9naSApLnRlc3QoIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEhpZGVzIHRoZSBhZGRyZXNzIGJhciBpZiB3ZSdyZSBvbiBhIG1vYmlsZSBkZXZpY2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBoaWRlQWRkcmVzc0JhcigpIHtcblxuXHRcdGlmKCBjb25maWcuaGlkZUFkZHJlc3NCYXIgJiYgaXNNb2JpbGVEZXZpY2UgKSB7XG5cdFx0XHQvLyBFdmVudHMgdGhhdCBzaG91bGQgdHJpZ2dlciB0aGUgYWRkcmVzcyBiYXIgdG8gaGlkZVxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgcmVtb3ZlQWRkcmVzc0JhciwgZmFsc2UgKTtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnb3JpZW50YXRpb25jaGFuZ2UnLCByZW1vdmVBZGRyZXNzQmFyLCBmYWxzZSApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENhdXNlcyB0aGUgYWRkcmVzcyBiYXIgdG8gaGlkZSBvbiBtb2JpbGUgZGV2aWNlcyxcblx0ICogbW9yZSB2ZXJ0aWNhbCBzcGFjZSBmdHcuXG5cdCAqL1xuXHRmdW5jdGlvbiByZW1vdmVBZGRyZXNzQmFyKCkge1xuXG5cdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oIDAsIDEgKTtcblx0XHR9LCAxMCApO1xuXG5cdH1cblxuXHQvKipcblx0ICogRGlzcGF0Y2hlcyBhbiBldmVudCBvZiB0aGUgc3BlY2lmaWVkIHR5cGUgZnJvbSB0aGVcblx0ICogcmV2ZWFsIERPTSBlbGVtZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlzcGF0Y2hFdmVudCggdHlwZSwgYXJncyApIHtcblxuXHRcdHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCAnSFRNTEV2ZW50cycsIDEsIDIgKTtcblx0XHRldmVudC5pbml0RXZlbnQoIHR5cGUsIHRydWUsIHRydWUgKTtcblx0XHRleHRlbmQoIGV2ZW50LCBhcmdzICk7XG5cdFx0ZG9tLndyYXBwZXIuZGlzcGF0Y2hFdmVudCggZXZlbnQgKTtcblxuXHRcdC8vIElmIHdlJ3JlIGluIGFuIGlmcmFtZSwgcG9zdCBlYWNoIHJldmVhbC5qcyBldmVudCB0byB0aGVcblx0XHQvLyBwYXJlbnQgd2luZG93LiBVc2VkIGJ5IHRoZSBub3RlcyBwbHVnaW5cblx0XHRpZiggY29uZmlnLnBvc3RNZXNzYWdlRXZlbnRzICYmIHdpbmRvdy5wYXJlbnQgIT09IHdpbmRvdy5zZWxmICkge1xuXHRcdFx0d2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSggSlNPTi5zdHJpbmdpZnkoeyBuYW1lc3BhY2U6ICdyZXZlYWwnLCBldmVudE5hbWU6IHR5cGUsIHN0YXRlOiBnZXRTdGF0ZSgpIH0pLCAnKicgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBXcmFwIGFsbCBsaW5rcyBpbiAzRCBnb29kbmVzcy5cblx0ICovXG5cdGZ1bmN0aW9uIGVuYWJsZVJvbGxpbmdMaW5rcygpIHtcblxuXHRcdGlmKCBmZWF0dXJlcy50cmFuc2Zvcm1zM2QgJiYgISggJ21zUGVyc3BlY3RpdmUnIGluIGRvY3VtZW50LmJvZHkuc3R5bGUgKSApIHtcblx0XHRcdHZhciBhbmNob3JzID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICsgJyBhJyApO1xuXG5cdFx0XHRmb3IoIHZhciBpID0gMCwgbGVuID0gYW5jaG9ycy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0dmFyIGFuY2hvciA9IGFuY2hvcnNbaV07XG5cblx0XHRcdFx0aWYoIGFuY2hvci50ZXh0Q29udGVudCAmJiAhYW5jaG9yLnF1ZXJ5U2VsZWN0b3IoICcqJyApICYmICggIWFuY2hvci5jbGFzc05hbWUgfHwgIWFuY2hvci5jbGFzc0xpc3QuY29udGFpbnMoIGFuY2hvciwgJ3JvbGwnICkgKSApIHtcblx0XHRcdFx0XHR2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRcdFx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScsIGFuY2hvci50ZXh0KTtcblx0XHRcdFx0XHRzcGFuLmlubmVySFRNTCA9IGFuY2hvci5pbm5lckhUTUw7XG5cblx0XHRcdFx0XHRhbmNob3IuY2xhc3NMaXN0LmFkZCggJ3JvbGwnICk7XG5cdFx0XHRcdFx0YW5jaG9yLmlubmVySFRNTCA9ICcnO1xuXHRcdFx0XHRcdGFuY2hvci5hcHBlbmRDaGlsZChzcGFuKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFVud3JhcCBhbGwgM0QgbGlua3MuXG5cdCAqL1xuXHRmdW5jdGlvbiBkaXNhYmxlUm9sbGluZ0xpbmtzKCkge1xuXG5cdFx0dmFyIGFuY2hvcnMgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKyAnIGEucm9sbCcgKTtcblxuXHRcdGZvciggdmFyIGkgPSAwLCBsZW4gPSBhbmNob3JzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0dmFyIGFuY2hvciA9IGFuY2hvcnNbaV07XG5cdFx0XHR2YXIgc3BhbiA9IGFuY2hvci5xdWVyeVNlbGVjdG9yKCAnc3BhbicgKTtcblxuXHRcdFx0aWYoIHNwYW4gKSB7XG5cdFx0XHRcdGFuY2hvci5jbGFzc0xpc3QucmVtb3ZlKCAncm9sbCcgKTtcblx0XHRcdFx0YW5jaG9yLmlubmVySFRNTCA9IHNwYW4uaW5uZXJIVE1MO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmQgcHJldmlldyBmcmFtZSBsaW5rcy5cblx0ICovXG5cdGZ1bmN0aW9uIGVuYWJsZVByZXZpZXdMaW5rcyggc2VsZWN0b3IgKSB7XG5cblx0XHR2YXIgYW5jaG9ycyA9IHRvQXJyYXkoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIHNlbGVjdG9yID8gc2VsZWN0b3IgOiAnYScgKSApO1xuXG5cdFx0YW5jaG9ycy5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRcdGlmKCAvXihodHRwfHd3dykvZ2kudGVzdCggZWxlbWVudC5nZXRBdHRyaWJ1dGUoICdocmVmJyApICkgKSB7XG5cdFx0XHRcdGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgb25QcmV2aWV3TGlua0NsaWNrZWQsIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogVW5iaW5kIHByZXZpZXcgZnJhbWUgbGlua3MuXG5cdCAqL1xuXHRmdW5jdGlvbiBkaXNhYmxlUHJldmlld0xpbmtzKCkge1xuXG5cdFx0dmFyIGFuY2hvcnMgPSB0b0FycmF5KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnYScgKSApO1xuXG5cdFx0YW5jaG9ycy5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCApIHtcblx0XHRcdGlmKCAvXihodHRwfHd3dykvZ2kudGVzdCggZWxlbWVudC5nZXRBdHRyaWJ1dGUoICdocmVmJyApICkgKSB7XG5cdFx0XHRcdGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgb25QcmV2aWV3TGlua0NsaWNrZWQsIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogT3BlbnMgYSBwcmV2aWV3IHdpbmRvdyBmb3IgdGhlIHRhcmdldCBVUkwuXG5cdCAqL1xuXHRmdW5jdGlvbiBzaG93UHJldmlldyggdXJsICkge1xuXG5cdFx0Y2xvc2VPdmVybGF5KCk7XG5cblx0XHRkb20ub3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0ZG9tLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCggJ292ZXJsYXknICk7XG5cdFx0ZG9tLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCggJ292ZXJsYXktcHJldmlldycgKTtcblx0XHRkb20ud3JhcHBlci5hcHBlbmRDaGlsZCggZG9tLm92ZXJsYXkgKTtcblxuXHRcdGRvbS5vdmVybGF5LmlubmVySFRNTCA9IFtcblx0XHRcdCc8aGVhZGVyPicsXG5cdFx0XHRcdCc8YSBjbGFzcz1cImNsb3NlXCIgaHJlZj1cIiNcIj48c3BhbiBjbGFzcz1cImljb25cIj48L3NwYW4+PC9hPicsXG5cdFx0XHRcdCc8YSBjbGFzcz1cImV4dGVybmFsXCIgaHJlZj1cIicrIHVybCArJ1wiIHRhcmdldD1cIl9ibGFua1wiPjxzcGFuIGNsYXNzPVwiaWNvblwiPjwvc3Bhbj48L2E+Jyxcblx0XHRcdCc8L2hlYWRlcj4nLFxuXHRcdFx0JzxkaXYgY2xhc3M9XCJzcGlubmVyXCI+PC9kaXY+Jyxcblx0XHRcdCc8ZGl2IGNsYXNzPVwidmlld3BvcnRcIj4nLFxuXHRcdFx0XHQnPGlmcmFtZSBzcmM9XCInKyB1cmwgKydcIj48L2lmcmFtZT4nLFxuXHRcdFx0JzwvZGl2Pidcblx0XHRdLmpvaW4oJycpO1xuXG5cdFx0ZG9tLm92ZXJsYXkucXVlcnlTZWxlY3RvciggJ2lmcmFtZScgKS5hZGRFdmVudExpc3RlbmVyKCAnbG9hZCcsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGRvbS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoICdsb2FkZWQnICk7XG5cdFx0fSwgZmFsc2UgKTtcblxuXHRcdGRvbS5vdmVybGF5LnF1ZXJ5U2VsZWN0b3IoICcuY2xvc2UnICkuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0Y2xvc2VPdmVybGF5KCk7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0sIGZhbHNlICk7XG5cblx0XHRkb20ub3ZlcmxheS5xdWVyeVNlbGVjdG9yKCAnLmV4dGVybmFsJyApLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGNsb3NlT3ZlcmxheSgpO1xuXHRcdH0sIGZhbHNlICk7XG5cblx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdGRvbS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xuXHRcdH0sIDEgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW5zIGEgb3ZlcmxheSB3aW5kb3cgd2l0aCBoZWxwIG1hdGVyaWFsLlxuXHQgKi9cblx0ZnVuY3Rpb24gc2hvd0hlbHAoKSB7XG5cblx0XHRpZiggY29uZmlnLmhlbHAgKSB7XG5cblx0XHRcdGNsb3NlT3ZlcmxheSgpO1xuXG5cdFx0XHRkb20ub3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0XHRkb20ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCAnb3ZlcmxheScgKTtcblx0XHRcdGRvbS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoICdvdmVybGF5LWhlbHAnICk7XG5cdFx0XHRkb20ud3JhcHBlci5hcHBlbmRDaGlsZCggZG9tLm92ZXJsYXkgKTtcblxuXHRcdFx0dmFyIGh0bWwgPSAnPHAgY2xhc3M9XCJ0aXRsZVwiPktleWJvYXJkIFNob3J0Y3V0czwvcD48YnIvPic7XG5cblx0XHRcdGh0bWwgKz0gJzx0YWJsZT48dGg+S0VZPC90aD48dGg+QUNUSU9OPC90aD4nO1xuXHRcdFx0Zm9yKCB2YXIga2V5IGluIGtleWJvYXJkU2hvcnRjdXRzICkge1xuXHRcdFx0XHRodG1sICs9ICc8dHI+PHRkPicgKyBrZXkgKyAnPC90ZD48dGQ+JyArIGtleWJvYXJkU2hvcnRjdXRzWyBrZXkgXSArICc8L3RkPjwvdHI+Jztcblx0XHRcdH1cblxuXHRcdFx0aHRtbCArPSAnPC90YWJsZT4nO1xuXG5cdFx0XHRkb20ub3ZlcmxheS5pbm5lckhUTUwgPSBbXG5cdFx0XHRcdCc8aGVhZGVyPicsXG5cdFx0XHRcdFx0JzxhIGNsYXNzPVwiY2xvc2VcIiBocmVmPVwiI1wiPjxzcGFuIGNsYXNzPVwiaWNvblwiPjwvc3Bhbj48L2E+Jyxcblx0XHRcdFx0JzwvaGVhZGVyPicsXG5cdFx0XHRcdCc8ZGl2IGNsYXNzPVwidmlld3BvcnRcIj4nLFxuXHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwidmlld3BvcnQtaW5uZXJcIj4nKyBodG1sICsnPC9kaXY+Jyxcblx0XHRcdFx0JzwvZGl2Pidcblx0XHRcdF0uam9pbignJyk7XG5cblx0XHRcdGRvbS5vdmVybGF5LnF1ZXJ5U2VsZWN0b3IoICcuY2xvc2UnICkuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRjbG9zZU92ZXJsYXkoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0sIGZhbHNlICk7XG5cblx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkb20ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCAndmlzaWJsZScgKTtcblx0XHRcdH0sIDEgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENsb3NlcyBhbnkgY3VycmVudGx5IG9wZW4gb3ZlcmxheS5cblx0ICovXG5cdGZ1bmN0aW9uIGNsb3NlT3ZlcmxheSgpIHtcblxuXHRcdGlmKCBkb20ub3ZlcmxheSApIHtcblx0XHRcdGRvbS5vdmVybGF5LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGRvbS5vdmVybGF5ICk7XG5cdFx0XHRkb20ub3ZlcmxheSA9IG51bGw7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyBKYXZhU2NyaXB0LWNvbnRyb2xsZWQgbGF5b3V0IHJ1bGVzIHRvIHRoZVxuXHQgKiBwcmVzZW50YXRpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBsYXlvdXQoKSB7XG5cblx0XHRpZiggZG9tLndyYXBwZXIgJiYgIWlzUHJpbnRpbmdQREYoKSApIHtcblxuXHRcdFx0dmFyIHNpemUgPSBnZXRDb21wdXRlZFNsaWRlU2l6ZSgpO1xuXG5cdFx0XHR2YXIgc2xpZGVQYWRkaW5nID0gMjA7IC8vIFRPRE8gRGlnIHRoaXMgb3V0IG9mIERPTVxuXG5cdFx0XHQvLyBMYXlvdXQgdGhlIGNvbnRlbnRzIG9mIHRoZSBzbGlkZXNcblx0XHRcdGxheW91dFNsaWRlQ29udGVudHMoIGNvbmZpZy53aWR0aCwgY29uZmlnLmhlaWdodCwgc2xpZGVQYWRkaW5nICk7XG5cblx0XHRcdGRvbS5zbGlkZXMuc3R5bGUud2lkdGggPSBzaXplLndpZHRoICsgJ3B4Jztcblx0XHRcdGRvbS5zbGlkZXMuc3R5bGUuaGVpZ2h0ID0gc2l6ZS5oZWlnaHQgKyAncHgnO1xuXG5cdFx0XHQvLyBEZXRlcm1pbmUgc2NhbGUgb2YgY29udGVudCB0byBmaXQgd2l0aGluIGF2YWlsYWJsZSBzcGFjZVxuXHRcdFx0c2NhbGUgPSBNYXRoLm1pbiggc2l6ZS5wcmVzZW50YXRpb25XaWR0aCAvIHNpemUud2lkdGgsIHNpemUucHJlc2VudGF0aW9uSGVpZ2h0IC8gc2l6ZS5oZWlnaHQgKTtcblxuXHRcdFx0Ly8gUmVzcGVjdCBtYXgvbWluIHNjYWxlIHNldHRpbmdzXG5cdFx0XHRzY2FsZSA9IE1hdGgubWF4KCBzY2FsZSwgY29uZmlnLm1pblNjYWxlICk7XG5cdFx0XHRzY2FsZSA9IE1hdGgubWluKCBzY2FsZSwgY29uZmlnLm1heFNjYWxlICk7XG5cblx0XHRcdC8vIERvbid0IGFwcGx5IGFueSBzY2FsaW5nIHN0eWxlcyBpZiBzY2FsZSBpcyAxXG5cdFx0XHRpZiggc2NhbGUgPT09IDEgKSB7XG5cdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUuem9vbSA9ICcnO1xuXHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLmxlZnQgPSAnJztcblx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS50b3AgPSAnJztcblx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5ib3R0b20gPSAnJztcblx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5yaWdodCA9ICcnO1xuXHRcdFx0XHR0cmFuc2Zvcm1TbGlkZXMoIHsgbGF5b3V0OiAnJyB9ICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gUHJlZmVyIHpvb20gZm9yIHNjYWxpbmcgdXAgc28gdGhhdCBjb250ZW50IHJlbWFpbnMgY3Jpc3AuXG5cdFx0XHRcdC8vIERvbid0IHVzZSB6b29tIHRvIHNjYWxlIGRvd24gc2luY2UgdGhhdCBjYW4gbGVhZCB0byBzaGlmdHNcblx0XHRcdFx0Ly8gaW4gdGV4dCBsYXlvdXQvbGluZSBicmVha3MuXG5cdFx0XHRcdGlmKCBzY2FsZSA+IDEgJiYgZmVhdHVyZXMuem9vbSApIHtcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLnpvb20gPSBzY2FsZTtcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLmxlZnQgPSAnJztcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLnRvcCA9ICcnO1xuXHRcdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUuYm90dG9tID0gJyc7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5yaWdodCA9ICcnO1xuXHRcdFx0XHRcdHRyYW5zZm9ybVNsaWRlcyggeyBsYXlvdXQ6ICcnIH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBBcHBseSBzY2FsZSB0cmFuc2Zvcm0gYXMgYSBmYWxsYmFja1xuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLnpvb20gPSAnJztcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLmxlZnQgPSAnNTAlJztcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLnRvcCA9ICc1MCUnO1xuXHRcdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUuYm90dG9tID0gJ2F1dG8nO1xuXHRcdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUucmlnaHQgPSAnYXV0byc7XG5cdFx0XHRcdFx0dHJhbnNmb3JtU2xpZGVzKCB7IGxheW91dDogJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSBzY2FsZSgnKyBzY2FsZSArJyknIH0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBTZWxlY3QgYWxsIHNsaWRlcywgdmVydGljYWwgYW5kIGhvcml6b250YWxcblx0XHRcdHZhciBzbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKSApO1xuXG5cdFx0XHRmb3IoIHZhciBpID0gMCwgbGVuID0gc2xpZGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0XHR2YXIgc2xpZGUgPSBzbGlkZXNbIGkgXTtcblxuXHRcdFx0XHQvLyBEb24ndCBib3RoZXIgdXBkYXRpbmcgaW52aXNpYmxlIHNsaWRlc1xuXHRcdFx0XHRpZiggc2xpZGUuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnICkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoIGNvbmZpZy5jZW50ZXIgfHwgc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnY2VudGVyJyApICkge1xuXHRcdFx0XHRcdC8vIFZlcnRpY2FsIHN0YWNrcyBhcmUgbm90IGNlbnRyZWQgc2luY2UgdGhlaXIgc2VjdGlvblxuXHRcdFx0XHRcdC8vIGNoaWxkcmVuIHdpbGwgYmVcblx0XHRcdFx0XHRpZiggc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnc3RhY2snICkgKSB7XG5cdFx0XHRcdFx0XHRzbGlkZS5zdHlsZS50b3AgPSAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHNsaWRlLnN0eWxlLnRvcCA9IE1hdGgubWF4KCAoICggc2l6ZS5oZWlnaHQgLSBnZXRBYnNvbHV0ZUhlaWdodCggc2xpZGUgKSApIC8gMiApIC0gc2xpZGVQYWRkaW5nLCAwICkgKyAncHgnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRzbGlkZS5zdHlsZS50b3AgPSAnJztcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZVByb2dyZXNzKCk7XG5cdFx0XHR1cGRhdGVQYXJhbGxheCgpO1xuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyBsYXlvdXQgbG9naWMgdG8gdGhlIGNvbnRlbnRzIG9mIGFsbCBzbGlkZXMgaW5cblx0ICogdGhlIHByZXNlbnRhdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGxheW91dFNsaWRlQ29udGVudHMoIHdpZHRoLCBoZWlnaHQsIHBhZGRpbmcgKSB7XG5cblx0XHQvLyBIYW5kbGUgc2l6aW5nIG9mIGVsZW1lbnRzIHdpdGggdGhlICdzdHJldGNoJyBjbGFzc1xuXHRcdHRvQXJyYXkoIGRvbS5zbGlkZXMucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24gPiAuc3RyZXRjaCcgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXG5cdFx0XHQvLyBEZXRlcm1pbmUgaG93IG11Y2ggdmVydGljYWwgc3BhY2Ugd2UgY2FuIHVzZVxuXHRcdFx0dmFyIHJlbWFpbmluZ0hlaWdodCA9IGdldFJlbWFpbmluZ0hlaWdodCggZWxlbWVudCwgaGVpZ2h0ICk7XG5cblx0XHRcdC8vIENvbnNpZGVyIHRoZSBhc3BlY3QgcmF0aW8gb2YgbWVkaWEgZWxlbWVudHNcblx0XHRcdGlmKCAvKGltZ3x2aWRlbykvZ2kudGVzdCggZWxlbWVudC5ub2RlTmFtZSApICkge1xuXHRcdFx0XHR2YXIgbncgPSBlbGVtZW50Lm5hdHVyYWxXaWR0aCB8fCBlbGVtZW50LnZpZGVvV2lkdGgsXG5cdFx0XHRcdFx0bmggPSBlbGVtZW50Lm5hdHVyYWxIZWlnaHQgfHwgZWxlbWVudC52aWRlb0hlaWdodDtcblxuXHRcdFx0XHR2YXIgZXMgPSBNYXRoLm1pbiggd2lkdGggLyBudywgcmVtYWluaW5nSGVpZ2h0IC8gbmggKTtcblxuXHRcdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gKCBudyAqIGVzICkgKyAncHgnO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmhlaWdodCA9ICggbmggKiBlcyApICsgJ3B4JztcblxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gcmVtYWluaW5nSGVpZ2h0ICsgJ3B4Jztcblx0XHRcdH1cblxuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZXMgdGhlIGNvbXB1dGVkIHBpeGVsIHNpemUgb2Ygb3VyIHNsaWRlcy4gVGhlc2Vcblx0ICogdmFsdWVzIGFyZSBiYXNlZCBvbiB0aGUgd2lkdGggYW5kIGhlaWdodCBjb25maWd1cmF0aW9uXG5cdCAqIG9wdGlvbnMuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRDb21wdXRlZFNsaWRlU2l6ZSggcHJlc2VudGF0aW9uV2lkdGgsIHByZXNlbnRhdGlvbkhlaWdodCApIHtcblxuXHRcdHZhciBzaXplID0ge1xuXHRcdFx0Ly8gU2xpZGUgc2l6ZVxuXHRcdFx0d2lkdGg6IGNvbmZpZy53aWR0aCxcblx0XHRcdGhlaWdodDogY29uZmlnLmhlaWdodCxcblxuXHRcdFx0Ly8gUHJlc2VudGF0aW9uIHNpemVcblx0XHRcdHByZXNlbnRhdGlvbldpZHRoOiBwcmVzZW50YXRpb25XaWR0aCB8fCBkb20ud3JhcHBlci5vZmZzZXRXaWR0aCxcblx0XHRcdHByZXNlbnRhdGlvbkhlaWdodDogcHJlc2VudGF0aW9uSGVpZ2h0IHx8IGRvbS53cmFwcGVyLm9mZnNldEhlaWdodFxuXHRcdH07XG5cblx0XHQvLyBSZWR1Y2UgYXZhaWxhYmxlIHNwYWNlIGJ5IG1hcmdpblxuXHRcdHNpemUucHJlc2VudGF0aW9uV2lkdGggLT0gKCBzaXplLnByZXNlbnRhdGlvbldpZHRoICogY29uZmlnLm1hcmdpbiApO1xuXHRcdHNpemUucHJlc2VudGF0aW9uSGVpZ2h0IC09ICggc2l6ZS5wcmVzZW50YXRpb25IZWlnaHQgKiBjb25maWcubWFyZ2luICk7XG5cblx0XHQvLyBTbGlkZSB3aWR0aCBtYXkgYmUgYSBwZXJjZW50YWdlIG9mIGF2YWlsYWJsZSB3aWR0aFxuXHRcdGlmKCB0eXBlb2Ygc2l6ZS53aWR0aCA9PT0gJ3N0cmluZycgJiYgLyUkLy50ZXN0KCBzaXplLndpZHRoICkgKSB7XG5cdFx0XHRzaXplLndpZHRoID0gcGFyc2VJbnQoIHNpemUud2lkdGgsIDEwICkgLyAxMDAgKiBzaXplLnByZXNlbnRhdGlvbldpZHRoO1xuXHRcdH1cblxuXHRcdC8vIFNsaWRlIGhlaWdodCBtYXkgYmUgYSBwZXJjZW50YWdlIG9mIGF2YWlsYWJsZSBoZWlnaHRcblx0XHRpZiggdHlwZW9mIHNpemUuaGVpZ2h0ID09PSAnc3RyaW5nJyAmJiAvJSQvLnRlc3QoIHNpemUuaGVpZ2h0ICkgKSB7XG5cdFx0XHRzaXplLmhlaWdodCA9IHBhcnNlSW50KCBzaXplLmhlaWdodCwgMTAgKSAvIDEwMCAqIHNpemUucHJlc2VudGF0aW9uSGVpZ2h0O1xuXHRcdH1cblxuXHRcdHJldHVybiBzaXplO1xuXG5cdH1cblxuXHQvKipcblx0ICogU3RvcmVzIHRoZSB2ZXJ0aWNhbCBpbmRleCBvZiBhIHN0YWNrIHNvIHRoYXQgdGhlIHNhbWVcblx0ICogdmVydGljYWwgc2xpZGUgY2FuIGJlIHNlbGVjdGVkIHdoZW4gbmF2aWdhdGluZyB0byBhbmRcblx0ICogZnJvbSB0aGUgc3RhY2suXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHN0YWNrIFRoZSB2ZXJ0aWNhbCBzdGFjayBlbGVtZW50XG5cdCAqIEBwYXJhbSB7aW50fSB2IEluZGV4IHRvIG1lbW9yaXplXG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRQcmV2aW91c1ZlcnRpY2FsSW5kZXgoIHN0YWNrLCB2ICkge1xuXG5cdFx0aWYoIHR5cGVvZiBzdGFjayA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHN0YWNrLnNldEF0dHJpYnV0ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdHN0YWNrLnNldEF0dHJpYnV0ZSggJ2RhdGEtcHJldmlvdXMtaW5kZXh2JywgdiB8fCAwICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSB2ZXJ0aWNhbCBpbmRleCB3aGljaCB3YXMgc3RvcmVkIHVzaW5nXG5cdCAqICNzZXRQcmV2aW91c1ZlcnRpY2FsSW5kZXgoKSBvciAwIGlmIG5vIHByZXZpb3VzIGluZGV4XG5cdCAqIGV4aXN0cy5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc3RhY2sgVGhlIHZlcnRpY2FsIHN0YWNrIGVsZW1lbnRcblx0ICovXG5cdGZ1bmN0aW9uIGdldFByZXZpb3VzVmVydGljYWxJbmRleCggc3RhY2sgKSB7XG5cblx0XHRpZiggdHlwZW9mIHN0YWNrID09PSAnb2JqZWN0JyAmJiB0eXBlb2Ygc3RhY2suc2V0QXR0cmlidXRlID09PSAnZnVuY3Rpb24nICYmIHN0YWNrLmNsYXNzTGlzdC5jb250YWlucyggJ3N0YWNrJyApICkge1xuXHRcdFx0Ly8gUHJlZmVyIG1hbnVhbGx5IGRlZmluZWQgc3RhcnQtaW5kZXh2XG5cdFx0XHR2YXIgYXR0cmlidXRlTmFtZSA9IHN0YWNrLmhhc0F0dHJpYnV0ZSggJ2RhdGEtc3RhcnQtaW5kZXh2JyApID8gJ2RhdGEtc3RhcnQtaW5kZXh2JyA6ICdkYXRhLXByZXZpb3VzLWluZGV4dic7XG5cblx0XHRcdHJldHVybiBwYXJzZUludCggc3RhY2suZ2V0QXR0cmlidXRlKCBhdHRyaWJ1dGVOYW1lICkgfHwgMCwgMTAgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gMDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIERpc3BsYXlzIHRoZSBvdmVydmlldyBvZiBzbGlkZXMgKHF1aWNrIG5hdikgYnkgc2NhbGluZ1xuXHQgKiBkb3duIGFuZCBhcnJhbmdpbmcgYWxsIHNsaWRlIGVsZW1lbnRzLlxuXHQgKi9cblx0ZnVuY3Rpb24gYWN0aXZhdGVPdmVydmlldygpIHtcblxuXHRcdC8vIE9ubHkgcHJvY2VlZCBpZiBlbmFibGVkIGluIGNvbmZpZ1xuXHRcdGlmKCBjb25maWcub3ZlcnZpZXcgJiYgIWlzT3ZlcnZpZXcoKSApIHtcblxuXHRcdFx0b3ZlcnZpZXcgPSB0cnVlO1xuXG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCAnb3ZlcnZpZXcnICk7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCAnb3ZlcnZpZXctZGVhY3RpdmF0aW5nJyApO1xuXG5cdFx0XHRpZiggZmVhdHVyZXMub3ZlcnZpZXdUcmFuc2l0aW9ucyApIHtcblx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggJ292ZXJ2aWV3LWFuaW1hdGVkJyApO1xuXHRcdFx0XHR9LCAxICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIERvbid0IGF1dG8tc2xpZGUgd2hpbGUgaW4gb3ZlcnZpZXcgbW9kZVxuXHRcdFx0Y2FuY2VsQXV0b1NsaWRlKCk7XG5cblx0XHRcdC8vIE1vdmUgdGhlIGJhY2tncm91bmRzIGVsZW1lbnQgaW50byB0aGUgc2xpZGUgY29udGFpbmVyIHRvXG5cdFx0XHQvLyB0aGF0IHRoZSBzYW1lIHNjYWxpbmcgaXMgYXBwbGllZFxuXHRcdFx0ZG9tLnNsaWRlcy5hcHBlbmRDaGlsZCggZG9tLmJhY2tncm91bmQgKTtcblxuXHRcdFx0Ly8gQ2xpY2tpbmcgb24gYW4gb3ZlcnZpZXcgc2xpZGUgbmF2aWdhdGVzIHRvIGl0XG5cdFx0XHR0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBzbGlkZSApIHtcblx0XHRcdFx0aWYoICFzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoICdzdGFjaycgKSApIHtcblx0XHRcdFx0XHRzbGlkZS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBvbk92ZXJ2aWV3U2xpZGVDbGlja2VkLCB0cnVlICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQ2FsY3VsYXRlIHNsaWRlIHNpemVzXG5cdFx0XHR2YXIgbWFyZ2luID0gNzA7XG5cdFx0XHR2YXIgc2xpZGVTaXplID0gZ2V0Q29tcHV0ZWRTbGlkZVNpemUoKTtcblx0XHRcdG92ZXJ2aWV3U2xpZGVXaWR0aCA9IHNsaWRlU2l6ZS53aWR0aCArIG1hcmdpbjtcblx0XHRcdG92ZXJ2aWV3U2xpZGVIZWlnaHQgPSBzbGlkZVNpemUuaGVpZ2h0ICsgbWFyZ2luO1xuXG5cdFx0XHQvLyBSZXZlcnNlIGluIFJUTCBtb2RlXG5cdFx0XHRpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdFx0b3ZlcnZpZXdTbGlkZVdpZHRoID0gLW92ZXJ2aWV3U2xpZGVXaWR0aDtcblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlU2xpZGVzVmlzaWJpbGl0eSgpO1xuXHRcdFx0bGF5b3V0T3ZlcnZpZXcoKTtcblx0XHRcdHVwZGF0ZU92ZXJ2aWV3KCk7XG5cblx0XHRcdGxheW91dCgpO1xuXG5cdFx0XHQvLyBOb3RpZnkgb2JzZXJ2ZXJzIG9mIHRoZSBvdmVydmlldyBzaG93aW5nXG5cdFx0XHRkaXNwYXRjaEV2ZW50KCAnb3ZlcnZpZXdzaG93bicsIHtcblx0XHRcdFx0J2luZGV4aCc6IGluZGV4aCxcblx0XHRcdFx0J2luZGV4dic6IGluZGV4dixcblx0XHRcdFx0J2N1cnJlbnRTbGlkZSc6IGN1cnJlbnRTbGlkZVxuXHRcdFx0fSApO1xuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogVXNlcyBDU1MgdHJhbnNmb3JtcyB0byBwb3NpdGlvbiBhbGwgc2xpZGVzIGluIGEgZ3JpZCBmb3Jcblx0ICogZGlzcGxheSBpbnNpZGUgb2YgdGhlIG92ZXJ2aWV3IG1vZGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBsYXlvdXRPdmVydmlldygpIHtcblxuXHRcdC8vIExheW91dCBzbGlkZXNcblx0XHR0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICkuZm9yRWFjaCggZnVuY3Rpb24oIGhzbGlkZSwgaCApIHtcblx0XHRcdGhzbGlkZS5zZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LWgnLCBoICk7XG5cdFx0XHR0cmFuc2Zvcm1FbGVtZW50KCBoc2xpZGUsICd0cmFuc2xhdGUzZCgnICsgKCBoICogb3ZlcnZpZXdTbGlkZVdpZHRoICkgKyAncHgsIDAsIDApJyApO1xuXG5cdFx0XHRpZiggaHNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ3N0YWNrJyApICkge1xuXG5cdFx0XHRcdHRvQXJyYXkoIGhzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApLmZvckVhY2goIGZ1bmN0aW9uKCB2c2xpZGUsIHYgKSB7XG5cdFx0XHRcdFx0dnNsaWRlLnNldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtaCcsIGggKTtcblx0XHRcdFx0XHR2c2xpZGUuc2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC12JywgdiApO1xuXG5cdFx0XHRcdFx0dHJhbnNmb3JtRWxlbWVudCggdnNsaWRlLCAndHJhbnNsYXRlM2QoMCwgJyArICggdiAqIG92ZXJ2aWV3U2xpZGVIZWlnaHQgKSArICdweCwgMCknICk7XG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIExheW91dCBzbGlkZSBiYWNrZ3JvdW5kc1xuXHRcdHRvQXJyYXkoIGRvbS5iYWNrZ3JvdW5kLmNoaWxkTm9kZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiggaGJhY2tncm91bmQsIGggKSB7XG5cdFx0XHR0cmFuc2Zvcm1FbGVtZW50KCBoYmFja2dyb3VuZCwgJ3RyYW5zbGF0ZTNkKCcgKyAoIGggKiBvdmVydmlld1NsaWRlV2lkdGggKSArICdweCwgMCwgMCknICk7XG5cblx0XHRcdHRvQXJyYXkoIGhiYWNrZ3JvdW5kLnF1ZXJ5U2VsZWN0b3JBbGwoICcuc2xpZGUtYmFja2dyb3VuZCcgKSApLmZvckVhY2goIGZ1bmN0aW9uKCB2YmFja2dyb3VuZCwgdiApIHtcblx0XHRcdFx0dHJhbnNmb3JtRWxlbWVudCggdmJhY2tncm91bmQsICd0cmFuc2xhdGUzZCgwLCAnICsgKCB2ICogb3ZlcnZpZXdTbGlkZUhlaWdodCApICsgJ3B4LCAwKScgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBNb3ZlcyB0aGUgb3ZlcnZpZXcgdmlld3BvcnQgdG8gdGhlIGN1cnJlbnQgc2xpZGVzLlxuXHQgKiBDYWxsZWQgZWFjaCB0aW1lIHRoZSBjdXJyZW50IHNsaWRlIGNoYW5nZXMuXG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVPdmVydmlldygpIHtcblxuXHRcdHRyYW5zZm9ybVNsaWRlcygge1xuXHRcdFx0b3ZlcnZpZXc6IFtcblx0XHRcdFx0J3RyYW5zbGF0ZVgoJysgKCAtaW5kZXhoICogb3ZlcnZpZXdTbGlkZVdpZHRoICkgKydweCknLFxuXHRcdFx0XHQndHJhbnNsYXRlWSgnKyAoIC1pbmRleHYgKiBvdmVydmlld1NsaWRlSGVpZ2h0ICkgKydweCknLFxuXHRcdFx0XHQndHJhbnNsYXRlWignKyAoIHdpbmRvdy5pbm5lcldpZHRoIDwgNDAwID8gLTEwMDAgOiAtMjUwMCApICsncHgpJ1xuXHRcdFx0XS5qb2luKCAnICcgKVxuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEV4aXRzIHRoZSBzbGlkZSBvdmVydmlldyBhbmQgZW50ZXJzIHRoZSBjdXJyZW50bHlcblx0ICogYWN0aXZlIHNsaWRlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGVhY3RpdmF0ZU92ZXJ2aWV3KCkge1xuXG5cdFx0Ly8gT25seSBwcm9jZWVkIGlmIGVuYWJsZWQgaW4gY29uZmlnXG5cdFx0aWYoIGNvbmZpZy5vdmVydmlldyApIHtcblxuXHRcdFx0b3ZlcnZpZXcgPSBmYWxzZTtcblxuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggJ292ZXJ2aWV3JyApO1xuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggJ292ZXJ2aWV3LWFuaW1hdGVkJyApO1xuXG5cdFx0XHQvLyBUZW1wb3JhcmlseSBhZGQgYSBjbGFzcyBzbyB0aGF0IHRyYW5zaXRpb25zIGNhbiBkbyBkaWZmZXJlbnQgdGhpbmdzXG5cdFx0XHQvLyBkZXBlbmRpbmcgb24gd2hldGhlciB0aGV5IGFyZSBleGl0aW5nL2VudGVyaW5nIG92ZXJ2aWV3LCBvciBqdXN0XG5cdFx0XHQvLyBtb3ZpbmcgZnJvbSBzbGlkZSB0byBzbGlkZVxuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggJ292ZXJ2aWV3LWRlYWN0aXZhdGluZycgKTtcblxuXHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCAnb3ZlcnZpZXctZGVhY3RpdmF0aW5nJyApO1xuXHRcdFx0fSwgMSApO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBiYWNrZ3JvdW5kIGVsZW1lbnQgYmFjayBvdXRcblx0XHRcdGRvbS53cmFwcGVyLmFwcGVuZENoaWxkKCBkb20uYmFja2dyb3VuZCApO1xuXG5cdFx0XHQvLyBDbGVhbiB1cCBjaGFuZ2VzIG1hZGUgdG8gc2xpZGVzXG5cdFx0XHR0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBzbGlkZSApIHtcblx0XHRcdFx0dHJhbnNmb3JtRWxlbWVudCggc2xpZGUsICcnICk7XG5cblx0XHRcdFx0c2xpZGUucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgb25PdmVydmlld1NsaWRlQ2xpY2tlZCwgdHJ1ZSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBDbGVhbiB1cCBjaGFuZ2VzIG1hZGUgdG8gYmFja2dyb3VuZHNcblx0XHRcdHRvQXJyYXkoIGRvbS5iYWNrZ3JvdW5kLnF1ZXJ5U2VsZWN0b3JBbGwoICcuc2xpZGUtYmFja2dyb3VuZCcgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBiYWNrZ3JvdW5kICkge1xuXHRcdFx0XHR0cmFuc2Zvcm1FbGVtZW50KCBiYWNrZ3JvdW5kLCAnJyApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHR0cmFuc2Zvcm1TbGlkZXMoIHsgb3ZlcnZpZXc6ICcnIH0gKTtcblxuXHRcdFx0c2xpZGUoIGluZGV4aCwgaW5kZXh2ICk7XG5cblx0XHRcdGxheW91dCgpO1xuXG5cdFx0XHRjdWVBdXRvU2xpZGUoKTtcblxuXHRcdFx0Ly8gTm90aWZ5IG9ic2VydmVycyBvZiB0aGUgb3ZlcnZpZXcgaGlkaW5nXG5cdFx0XHRkaXNwYXRjaEV2ZW50KCAnb3ZlcnZpZXdoaWRkZW4nLCB7XG5cdFx0XHRcdCdpbmRleGgnOiBpbmRleGgsXG5cdFx0XHRcdCdpbmRleHYnOiBpbmRleHYsXG5cdFx0XHRcdCdjdXJyZW50U2xpZGUnOiBjdXJyZW50U2xpZGVcblx0XHRcdH0gKTtcblxuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIHRoZSBzbGlkZSBvdmVydmlldyBtb2RlIG9uIGFuZCBvZmYuXG5cdCAqXG5cdCAqIEBwYXJhbSB7Qm9vbGVhbn0gb3ZlcnJpZGUgT3B0aW9uYWwgZmxhZyB3aGljaCBvdmVycmlkZXMgdGhlXG5cdCAqIHRvZ2dsZSBsb2dpYyBhbmQgZm9yY2libHkgc2V0cyB0aGUgZGVzaXJlZCBzdGF0ZS4gVHJ1ZSBtZWFuc1xuXHQgKiBvdmVydmlldyBpcyBvcGVuLCBmYWxzZSBtZWFucyBpdCdzIGNsb3NlZC5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU92ZXJ2aWV3KCBvdmVycmlkZSApIHtcblxuXHRcdGlmKCB0eXBlb2Ygb3ZlcnJpZGUgPT09ICdib29sZWFuJyApIHtcblx0XHRcdG92ZXJyaWRlID8gYWN0aXZhdGVPdmVydmlldygpIDogZGVhY3RpdmF0ZU92ZXJ2aWV3KCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aXNPdmVydmlldygpID8gZGVhY3RpdmF0ZU92ZXJ2aWV3KCkgOiBhY3RpdmF0ZU92ZXJ2aWV3KCk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBvdmVydmlldyBpcyBjdXJyZW50bHkgYWN0aXZlLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBvdmVydmlldyBpcyBhY3RpdmUsXG5cdCAqIGZhbHNlIG90aGVyd2lzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNPdmVydmlldygpIHtcblxuXHRcdHJldHVybiBvdmVydmlldztcblxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBvciBzcGVjaWZpZWQgc2xpZGUgaXMgdmVydGljYWxcblx0ICogKG5lc3RlZCB3aXRoaW4gYW5vdGhlciBzbGlkZSkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNsaWRlIFtvcHRpb25hbF0gVGhlIHNsaWRlIHRvIGNoZWNrXG5cdCAqIG9yaWVudGF0aW9uIG9mXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1ZlcnRpY2FsU2xpZGUoIHNsaWRlICkge1xuXG5cdFx0Ly8gUHJlZmVyIHNsaWRlIGFyZ3VtZW50LCBvdGhlcndpc2UgdXNlIGN1cnJlbnQgc2xpZGVcblx0XHRzbGlkZSA9IHNsaWRlID8gc2xpZGUgOiBjdXJyZW50U2xpZGU7XG5cblx0XHRyZXR1cm4gc2xpZGUgJiYgc2xpZGUucGFyZW50Tm9kZSAmJiAhIXNsaWRlLnBhcmVudE5vZGUubm9kZU5hbWUubWF0Y2goIC9zZWN0aW9uL2kgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsaW5nIHRoZSBmdWxsc2NyZWVuIGZ1bmN0aW9uYWxpdHkgdmlhIHRoZSBmdWxsc2NyZWVuIEFQSVxuXHQgKlxuXHQgKiBAc2VlIGh0dHA6Ly9mdWxsc2NyZWVuLnNwZWMud2hhdHdnLm9yZy9cblx0ICogQHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0RPTS9Vc2luZ19mdWxsc2NyZWVuX21vZGVcblx0ICovXG5cdGZ1bmN0aW9uIGVudGVyRnVsbHNjcmVlbigpIHtcblxuXHRcdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuYm9keTtcblxuXHRcdC8vIENoZWNrIHdoaWNoIGltcGxlbWVudGF0aW9uIGlzIGF2YWlsYWJsZVxuXHRcdHZhciByZXF1ZXN0TWV0aG9kID0gZWxlbWVudC5yZXF1ZXN0RnVsbFNjcmVlbiB8fFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuIHx8XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4gfHxcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbiB8fFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW47XG5cblx0XHRpZiggcmVxdWVzdE1ldGhvZCApIHtcblx0XHRcdHJlcXVlc3RNZXRob2QuYXBwbHkoIGVsZW1lbnQgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBFbnRlcnMgdGhlIHBhdXNlZCBtb2RlIHdoaWNoIGZhZGVzIGV2ZXJ5dGhpbmcgb24gc2NyZWVuIHRvXG5cdCAqIGJsYWNrLlxuXHQgKi9cblx0ZnVuY3Rpb24gcGF1c2UoKSB7XG5cblx0XHRpZiggY29uZmlnLnBhdXNlICkge1xuXHRcdFx0dmFyIHdhc1BhdXNlZCA9IGRvbS53cmFwcGVyLmNsYXNzTGlzdC5jb250YWlucyggJ3BhdXNlZCcgKTtcblxuXHRcdFx0Y2FuY2VsQXV0b1NsaWRlKCk7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCAncGF1c2VkJyApO1xuXG5cdFx0XHRpZiggd2FzUGF1c2VkID09PSBmYWxzZSApIHtcblx0XHRcdFx0ZGlzcGF0Y2hFdmVudCggJ3BhdXNlZCcgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBFeGl0cyBmcm9tIHRoZSBwYXVzZWQgbW9kZS5cblx0ICovXG5cdGZ1bmN0aW9uIHJlc3VtZSgpIHtcblxuXHRcdHZhciB3YXNQYXVzZWQgPSBkb20ud3JhcHBlci5jbGFzc0xpc3QuY29udGFpbnMoICdwYXVzZWQnICk7XG5cdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggJ3BhdXNlZCcgKTtcblxuXHRcdGN1ZUF1dG9TbGlkZSgpO1xuXG5cdFx0aWYoIHdhc1BhdXNlZCApIHtcblx0XHRcdGRpc3BhdGNoRXZlbnQoICdyZXN1bWVkJyApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgdGhlIHBhdXNlZCBtb2RlIG9uIGFuZCBvZmYuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVQYXVzZSggb3ZlcnJpZGUgKSB7XG5cblx0XHRpZiggdHlwZW9mIG92ZXJyaWRlID09PSAnYm9vbGVhbicgKSB7XG5cdFx0XHRvdmVycmlkZSA/IHBhdXNlKCkgOiByZXN1bWUoKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpc1BhdXNlZCgpID8gcmVzdW1lKCkgOiBwYXVzZSgpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB3ZSBhcmUgY3VycmVudGx5IGluIHRoZSBwYXVzZWQgbW9kZS5cblx0ICovXG5cdGZ1bmN0aW9uIGlzUGF1c2VkKCkge1xuXG5cdFx0cmV0dXJuIGRvbS53cmFwcGVyLmNsYXNzTGlzdC5jb250YWlucyggJ3BhdXNlZCcgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgdGhlIGF1dG8gc2xpZGUgbW9kZSBvbiBhbmQgb2ZmLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IG92ZXJyaWRlIE9wdGlvbmFsIGZsYWcgd2hpY2ggc2V0cyB0aGUgZGVzaXJlZCBzdGF0ZS5cblx0ICogVHJ1ZSBtZWFucyBhdXRvcGxheSBzdGFydHMsIGZhbHNlIG1lYW5zIGl0IHN0b3BzLlxuXHQgKi9cblxuXHRmdW5jdGlvbiB0b2dnbGVBdXRvU2xpZGUoIG92ZXJyaWRlICkge1xuXG5cdFx0aWYoIHR5cGVvZiBvdmVycmlkZSA9PT0gJ2Jvb2xlYW4nICkge1xuXHRcdFx0b3ZlcnJpZGUgPyByZXN1bWVBdXRvU2xpZGUoKSA6IHBhdXNlQXV0b1NsaWRlKCk7XG5cdFx0fVxuXG5cdFx0ZWxzZSB7XG5cdFx0XHRhdXRvU2xpZGVQYXVzZWQgPyByZXN1bWVBdXRvU2xpZGUoKSA6IHBhdXNlQXV0b1NsaWRlKCk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBhdXRvIHNsaWRlIG1vZGUgaXMgY3VycmVudGx5IG9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gaXNBdXRvU2xpZGluZygpIHtcblxuXHRcdHJldHVybiAhISggYXV0b1NsaWRlICYmICFhdXRvU2xpZGVQYXVzZWQgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFN0ZXBzIGZyb20gdGhlIGN1cnJlbnQgcG9pbnQgaW4gdGhlIHByZXNlbnRhdGlvbiB0byB0aGVcblx0ICogc2xpZGUgd2hpY2ggbWF0Y2hlcyB0aGUgc3BlY2lmaWVkIGhvcml6b250YWwgYW5kIHZlcnRpY2FsXG5cdCAqIGluZGljZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7aW50fSBoIEhvcml6b250YWwgaW5kZXggb2YgdGhlIHRhcmdldCBzbGlkZVxuXHQgKiBAcGFyYW0ge2ludH0gdiBWZXJ0aWNhbCBpbmRleCBvZiB0aGUgdGFyZ2V0IHNsaWRlXG5cdCAqIEBwYXJhbSB7aW50fSBmIE9wdGlvbmFsIGluZGV4IG9mIGEgZnJhZ21lbnQgd2l0aGluIHRoZVxuXHQgKiB0YXJnZXQgc2xpZGUgdG8gYWN0aXZhdGVcblx0ICogQHBhcmFtIHtpbnR9IG8gT3B0aW9uYWwgb3JpZ2luIGZvciB1c2UgaW4gbXVsdGltYXN0ZXIgZW52aXJvbm1lbnRzXG5cdCAqL1xuXHRmdW5jdGlvbiBzbGlkZSggaCwgdiwgZiwgbyApIHtcblxuXHRcdC8vIFJlbWVtYmVyIHdoZXJlIHdlIHdlcmUgYXQgYmVmb3JlXG5cdFx0cHJldmlvdXNTbGlkZSA9IGN1cnJlbnRTbGlkZTtcblxuXHRcdC8vIFF1ZXJ5IGFsbCBob3Jpem9udGFsIHNsaWRlcyBpbiB0aGUgZGVja1xuXHRcdHZhciBob3Jpem9udGFsU2xpZGVzID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKTtcblxuXHRcdC8vIElmIG5vIHZlcnRpY2FsIGluZGV4IGlzIHNwZWNpZmllZCBhbmQgdGhlIHVwY29taW5nIHNsaWRlIGlzIGFcblx0XHQvLyBzdGFjaywgcmVzdW1lIGF0IGl0cyBwcmV2aW91cyB2ZXJ0aWNhbCBpbmRleFxuXHRcdGlmKCB2ID09PSB1bmRlZmluZWQgJiYgIWlzT3ZlcnZpZXcoKSApIHtcblx0XHRcdHYgPSBnZXRQcmV2aW91c1ZlcnRpY2FsSW5kZXgoIGhvcml6b250YWxTbGlkZXNbIGggXSApO1xuXHRcdH1cblxuXHRcdC8vIElmIHdlIHdlcmUgb24gYSB2ZXJ0aWNhbCBzdGFjaywgcmVtZW1iZXIgd2hhdCB2ZXJ0aWNhbCBpbmRleFxuXHRcdC8vIGl0IHdhcyBvbiBzbyB3ZSBjYW4gcmVzdW1lIGF0IHRoZSBzYW1lIHBvc2l0aW9uIHdoZW4gcmV0dXJuaW5nXG5cdFx0aWYoIHByZXZpb3VzU2xpZGUgJiYgcHJldmlvdXNTbGlkZS5wYXJlbnROb2RlICYmIHByZXZpb3VzU2xpZGUucGFyZW50Tm9kZS5jbGFzc0xpc3QuY29udGFpbnMoICdzdGFjaycgKSApIHtcblx0XHRcdHNldFByZXZpb3VzVmVydGljYWxJbmRleCggcHJldmlvdXNTbGlkZS5wYXJlbnROb2RlLCBpbmRleHYgKTtcblx0XHR9XG5cblx0XHQvLyBSZW1lbWJlciB0aGUgc3RhdGUgYmVmb3JlIHRoaXMgc2xpZGVcblx0XHR2YXIgc3RhdGVCZWZvcmUgPSBzdGF0ZS5jb25jYXQoKTtcblxuXHRcdC8vIFJlc2V0IHRoZSBzdGF0ZSBhcnJheVxuXHRcdHN0YXRlLmxlbmd0aCA9IDA7XG5cblx0XHR2YXIgaW5kZXhoQmVmb3JlID0gaW5kZXhoIHx8IDAsXG5cdFx0XHRpbmRleHZCZWZvcmUgPSBpbmRleHYgfHwgMDtcblxuXHRcdC8vIEFjdGl2YXRlIGFuZCB0cmFuc2l0aW9uIHRvIHRoZSBuZXcgc2xpZGVcblx0XHRpbmRleGggPSB1cGRhdGVTbGlkZXMoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SLCBoID09PSB1bmRlZmluZWQgPyBpbmRleGggOiBoICk7XG5cdFx0aW5kZXh2ID0gdXBkYXRlU2xpZGVzKCBWRVJUSUNBTF9TTElERVNfU0VMRUNUT1IsIHYgPT09IHVuZGVmaW5lZCA/IGluZGV4diA6IHYgKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgdmlzaWJpbGl0eSBvZiBzbGlkZXMgbm93IHRoYXQgdGhlIGluZGljZXMgaGF2ZSBjaGFuZ2VkXG5cdFx0dXBkYXRlU2xpZGVzVmlzaWJpbGl0eSgpO1xuXG5cdFx0bGF5b3V0KCk7XG5cblx0XHQvLyBBcHBseSB0aGUgbmV3IHN0YXRlXG5cdFx0c3RhdGVMb29wOiBmb3IoIHZhciBpID0gMCwgbGVuID0gc3RhdGUubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHQvLyBDaGVjayBpZiB0aGlzIHN0YXRlIGV4aXN0ZWQgb24gdGhlIHByZXZpb3VzIHNsaWRlLiBJZiBpdFxuXHRcdFx0Ly8gZGlkLCB3ZSB3aWxsIGF2b2lkIGFkZGluZyBpdCByZXBlYXRlZGx5XG5cdFx0XHRmb3IoIHZhciBqID0gMDsgaiA8IHN0YXRlQmVmb3JlLmxlbmd0aDsgaisrICkge1xuXHRcdFx0XHRpZiggc3RhdGVCZWZvcmVbal0gPT09IHN0YXRlW2ldICkge1xuXHRcdFx0XHRcdHN0YXRlQmVmb3JlLnNwbGljZSggaiwgMSApO1xuXHRcdFx0XHRcdGNvbnRpbnVlIHN0YXRlTG9vcDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCggc3RhdGVbaV0gKTtcblxuXHRcdFx0Ly8gRGlzcGF0Y2ggY3VzdG9tIGV2ZW50IG1hdGNoaW5nIHRoZSBzdGF0ZSdzIG5hbWVcblx0XHRcdGRpc3BhdGNoRXZlbnQoIHN0YXRlW2ldICk7XG5cdFx0fVxuXG5cdFx0Ly8gQ2xlYW4gdXAgdGhlIHJlbWFpbnMgb2YgdGhlIHByZXZpb3VzIHN0YXRlXG5cdFx0d2hpbGUoIHN0YXRlQmVmb3JlLmxlbmd0aCApIHtcblx0XHRcdGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCBzdGF0ZUJlZm9yZS5wb3AoKSApO1xuXHRcdH1cblxuXHRcdC8vIFVwZGF0ZSB0aGUgb3ZlcnZpZXcgaWYgaXQncyBjdXJyZW50bHkgYWN0aXZlXG5cdFx0aWYoIGlzT3ZlcnZpZXcoKSApIHtcblx0XHRcdHVwZGF0ZU92ZXJ2aWV3KCk7XG5cdFx0fVxuXG5cdFx0Ly8gRmluZCB0aGUgY3VycmVudCBob3Jpem9udGFsIHNsaWRlIGFuZCBhbnkgcG9zc2libGUgdmVydGljYWwgc2xpZGVzXG5cdFx0Ly8gd2l0aGluIGl0XG5cdFx0dmFyIGN1cnJlbnRIb3Jpem9udGFsU2xpZGUgPSBob3Jpem9udGFsU2xpZGVzWyBpbmRleGggXSxcblx0XHRcdGN1cnJlbnRWZXJ0aWNhbFNsaWRlcyA9IGN1cnJlbnRIb3Jpem9udGFsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICk7XG5cblx0XHQvLyBTdG9yZSByZWZlcmVuY2VzIHRvIHRoZSBwcmV2aW91cyBhbmQgY3VycmVudCBzbGlkZXNcblx0XHRjdXJyZW50U2xpZGUgPSBjdXJyZW50VmVydGljYWxTbGlkZXNbIGluZGV4diBdIHx8IGN1cnJlbnRIb3Jpem9udGFsU2xpZGU7XG5cblx0XHQvLyBTaG93IGZyYWdtZW50LCBpZiBzcGVjaWZpZWRcblx0XHRpZiggdHlwZW9mIGYgIT09ICd1bmRlZmluZWQnICkge1xuXHRcdFx0bmF2aWdhdGVGcmFnbWVudCggZiApO1xuXHRcdH1cblxuXHRcdC8vIERpc3BhdGNoIGFuIGV2ZW50IGlmIHRoZSBzbGlkZSBjaGFuZ2VkXG5cdFx0dmFyIHNsaWRlQ2hhbmdlZCA9ICggaW5kZXhoICE9PSBpbmRleGhCZWZvcmUgfHwgaW5kZXh2ICE9PSBpbmRleHZCZWZvcmUgKTtcblx0XHRpZiggc2xpZGVDaGFuZ2VkICkge1xuXHRcdFx0ZGlzcGF0Y2hFdmVudCggJ3NsaWRlY2hhbmdlZCcsIHtcblx0XHRcdFx0J2luZGV4aCc6IGluZGV4aCxcblx0XHRcdFx0J2luZGV4dic6IGluZGV4dixcblx0XHRcdFx0J3ByZXZpb3VzU2xpZGUnOiBwcmV2aW91c1NsaWRlLFxuXHRcdFx0XHQnY3VycmVudFNsaWRlJzogY3VycmVudFNsaWRlLFxuXHRcdFx0XHQnb3JpZ2luJzogb1xuXHRcdFx0fSApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIEVuc3VyZSB0aGF0IHRoZSBwcmV2aW91cyBzbGlkZSBpcyBuZXZlciB0aGUgc2FtZSBhcyB0aGUgY3VycmVudFxuXHRcdFx0cHJldmlvdXNTbGlkZSA9IG51bGw7XG5cdFx0fVxuXG5cdFx0Ly8gU29sdmVzIGFuIGVkZ2UgY2FzZSB3aGVyZSB0aGUgcHJldmlvdXMgc2xpZGUgbWFpbnRhaW5zIHRoZVxuXHRcdC8vICdwcmVzZW50JyBjbGFzcyB3aGVuIG5hdmlnYXRpbmcgYmV0d2VlbiBhZGphY2VudCB2ZXJ0aWNhbFxuXHRcdC8vIHN0YWNrc1xuXHRcdGlmKCBwcmV2aW91c1NsaWRlICkge1xuXHRcdFx0cHJldmlvdXNTbGlkZS5jbGFzc0xpc3QucmVtb3ZlKCAncHJlc2VudCcgKTtcblx0XHRcdHByZXZpb3VzU2xpZGUuc2V0QXR0cmlidXRlKCAnYXJpYS1oaWRkZW4nLCAndHJ1ZScgKTtcblxuXHRcdFx0Ly8gUmVzZXQgYWxsIHNsaWRlcyB1cG9uIG5hdmlnYXRlIHRvIGhvbWVcblx0XHRcdC8vIElzc3VlOiAjMjg1XG5cdFx0XHRpZiAoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoIEhPTUVfU0xJREVfU0VMRUNUT1IgKS5jbGFzc0xpc3QuY29udGFpbnMoICdwcmVzZW50JyApICkge1xuXHRcdFx0XHQvLyBMYXVuY2ggYXN5bmMgdGFza1xuXHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHNsaWRlcyA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICsgJy5zdGFjaycpICksIGk7XG5cdFx0XHRcdFx0Zm9yKCBpIGluIHNsaWRlcyApIHtcblx0XHRcdFx0XHRcdGlmKCBzbGlkZXNbaV0gKSB7XG5cdFx0XHRcdFx0XHRcdC8vIFJlc2V0IHN0YWNrXG5cdFx0XHRcdFx0XHRcdHNldFByZXZpb3VzVmVydGljYWxJbmRleCggc2xpZGVzW2ldLCAwICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LCAwICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIGVtYmVkZGVkIGNvbnRlbnRcblx0XHRpZiggc2xpZGVDaGFuZ2VkIHx8ICFwcmV2aW91c1NsaWRlICkge1xuXHRcdFx0c3RvcEVtYmVkZGVkQ29udGVudCggcHJldmlvdXNTbGlkZSApO1xuXHRcdFx0c3RhcnRFbWJlZGRlZENvbnRlbnQoIGN1cnJlbnRTbGlkZSApO1xuXHRcdH1cblxuXHRcdC8vIEFubm91bmNlIHRoZSBjdXJyZW50IHNsaWRlIGNvbnRlbnRzLCBmb3Igc2NyZWVuIHJlYWRlcnNcblx0XHRkb20uc3RhdHVzRGl2LnRleHRDb250ZW50ID0gY3VycmVudFNsaWRlLnRleHRDb250ZW50O1xuXG5cdFx0dXBkYXRlQ29udHJvbHMoKTtcblx0XHR1cGRhdGVQcm9ncmVzcygpO1xuXHRcdHVwZGF0ZUJhY2tncm91bmQoKTtcblx0XHR1cGRhdGVQYXJhbGxheCgpO1xuXHRcdHVwZGF0ZVNsaWRlTnVtYmVyKCk7XG5cdFx0dXBkYXRlTm90ZXMoKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgVVJMIGhhc2hcblx0XHR3cml0ZVVSTCgpO1xuXG5cdFx0Y3VlQXV0b1NsaWRlKCk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBTeW5jcyB0aGUgcHJlc2VudGF0aW9uIHdpdGggdGhlIGN1cnJlbnQgRE9NLiBVc2VmdWxcblx0ICogd2hlbiBuZXcgc2xpZGVzIG9yIGNvbnRyb2wgZWxlbWVudHMgYXJlIGFkZGVkIG9yIHdoZW5cblx0ICogdGhlIGNvbmZpZ3VyYXRpb24gaGFzIGNoYW5nZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiBzeW5jKCkge1xuXG5cdFx0Ly8gU3Vic2NyaWJlIHRvIGlucHV0XG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcblx0XHRhZGRFdmVudExpc3RlbmVycygpO1xuXG5cdFx0Ly8gRm9yY2UgYSBsYXlvdXQgdG8gbWFrZSBzdXJlIHRoZSBjdXJyZW50IGNvbmZpZyBpcyBhY2NvdW50ZWQgZm9yXG5cdFx0bGF5b3V0KCk7XG5cblx0XHQvLyBSZWZsZWN0IHRoZSBjdXJyZW50IGF1dG9TbGlkZSB2YWx1ZVxuXHRcdGF1dG9TbGlkZSA9IGNvbmZpZy5hdXRvU2xpZGU7XG5cblx0XHQvLyBTdGFydCBhdXRvLXNsaWRpbmcgaWYgaXQncyBlbmFibGVkXG5cdFx0Y3VlQXV0b1NsaWRlKCk7XG5cblx0XHQvLyBSZS1jcmVhdGUgdGhlIHNsaWRlIGJhY2tncm91bmRzXG5cdFx0Y3JlYXRlQmFja2dyb3VuZHMoKTtcblxuXHRcdC8vIFdyaXRlIHRoZSBjdXJyZW50IGhhc2ggdG8gdGhlIFVSTFxuXHRcdHdyaXRlVVJMKCk7XG5cblx0XHRzb3J0QWxsRnJhZ21lbnRzKCk7XG5cblx0XHR1cGRhdGVDb250cm9scygpO1xuXHRcdHVwZGF0ZVByb2dyZXNzKCk7XG5cdFx0dXBkYXRlQmFja2dyb3VuZCggdHJ1ZSApO1xuXHRcdHVwZGF0ZVNsaWRlTnVtYmVyKCk7XG5cdFx0dXBkYXRlU2xpZGVzVmlzaWJpbGl0eSgpO1xuXHRcdHVwZGF0ZU5vdGVzKCk7XG5cblx0XHRmb3JtYXRFbWJlZGRlZENvbnRlbnQoKTtcblx0XHRzdGFydEVtYmVkZGVkQ29udGVudCggY3VycmVudFNsaWRlICk7XG5cblx0XHRpZiggaXNPdmVydmlldygpICkge1xuXHRcdFx0bGF5b3V0T3ZlcnZpZXcoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNldHMgYWxsIHZlcnRpY2FsIHNsaWRlcyBzbyB0aGF0IG9ubHkgdGhlIGZpcnN0XG5cdCAqIGlzIHZpc2libGUuXG5cdCAqL1xuXHRmdW5jdGlvbiByZXNldFZlcnRpY2FsU2xpZGVzKCkge1xuXG5cdFx0dmFyIGhvcml6b250YWxTbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICk7XG5cdFx0aG9yaXpvbnRhbFNsaWRlcy5mb3JFYWNoKCBmdW5jdGlvbiggaG9yaXpvbnRhbFNsaWRlICkge1xuXG5cdFx0XHR2YXIgdmVydGljYWxTbGlkZXMgPSB0b0FycmF5KCBob3Jpem9udGFsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKTtcblx0XHRcdHZlcnRpY2FsU2xpZGVzLmZvckVhY2goIGZ1bmN0aW9uKCB2ZXJ0aWNhbFNsaWRlLCB5ICkge1xuXG5cdFx0XHRcdGlmKCB5ID4gMCApIHtcblx0XHRcdFx0XHR2ZXJ0aWNhbFNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoICdwcmVzZW50JyApO1xuXHRcdFx0XHRcdHZlcnRpY2FsU2xpZGUuY2xhc3NMaXN0LnJlbW92ZSggJ3Bhc3QnICk7XG5cdFx0XHRcdFx0dmVydGljYWxTbGlkZS5jbGFzc0xpc3QuYWRkKCAnZnV0dXJlJyApO1xuXHRcdFx0XHRcdHZlcnRpY2FsU2xpZGUuc2V0QXR0cmlidXRlKCAnYXJpYS1oaWRkZW4nLCAndHJ1ZScgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9ICk7XG5cblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBTb3J0cyBhbmQgZm9ybWF0cyBhbGwgb2YgZnJhZ21lbnRzIGluIHRoZVxuXHQgKiBwcmVzZW50YXRpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBzb3J0QWxsRnJhZ21lbnRzKCkge1xuXG5cdFx0dmFyIGhvcml6b250YWxTbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICk7XG5cdFx0aG9yaXpvbnRhbFNsaWRlcy5mb3JFYWNoKCBmdW5jdGlvbiggaG9yaXpvbnRhbFNsaWRlICkge1xuXG5cdFx0XHR2YXIgdmVydGljYWxTbGlkZXMgPSB0b0FycmF5KCBob3Jpem9udGFsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKTtcblx0XHRcdHZlcnRpY2FsU2xpZGVzLmZvckVhY2goIGZ1bmN0aW9uKCB2ZXJ0aWNhbFNsaWRlLCB5ICkge1xuXG5cdFx0XHRcdHNvcnRGcmFnbWVudHMoIHZlcnRpY2FsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKSApO1xuXG5cdFx0XHR9ICk7XG5cblx0XHRcdGlmKCB2ZXJ0aWNhbFNsaWRlcy5sZW5ndGggPT09IDAgKSBzb3J0RnJhZ21lbnRzKCBob3Jpem9udGFsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKSApO1xuXG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmFuZG9tbHkgc2h1ZmZsZXMgYWxsIHNsaWRlcyBpbiB0aGUgZGVjay5cblx0ICovXG5cdGZ1bmN0aW9uIHNodWZmbGUoKSB7XG5cblx0XHR2YXIgc2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApO1xuXG5cdFx0c2xpZGVzLmZvckVhY2goIGZ1bmN0aW9uKCBzbGlkZSApIHtcblxuXHRcdFx0Ly8gSW5zZXJ0IHRoaXMgc2xpZGUgbmV4dCB0byBhbm90aGVyIHJhbmRvbSBzbGlkZS4gVGhpcyBtYXlcblx0XHRcdC8vIGNhdXNlIHRoZSBzbGlkZSB0byBpbnNlcnQgYmVmb3JlIGl0c2VsZiBidXQgdGhhdCdzIGZpbmUuXG5cdFx0XHRkb20uc2xpZGVzLmluc2VydEJlZm9yZSggc2xpZGUsIHNsaWRlc1sgTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIHNsaWRlcy5sZW5ndGggKSBdICk7XG5cblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIG9uZSBkaW1lbnNpb24gb2Ygc2xpZGVzIGJ5IHNob3dpbmcgdGhlIHNsaWRlXG5cdCAqIHdpdGggdGhlIHNwZWNpZmllZCBpbmRleC5cblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIEEgQ1NTIHNlbGVjdG9yIHRoYXQgd2lsbCBmZXRjaFxuXHQgKiB0aGUgZ3JvdXAgb2Ygc2xpZGVzIHdlIGFyZSB3b3JraW5nIHdpdGhcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgc2xpZGUgdGhhdCBzaG91bGQgYmVcblx0ICogc2hvd25cblx0ICpcblx0ICogQHJldHVybiB7TnVtYmVyfSBUaGUgaW5kZXggb2YgdGhlIHNsaWRlIHRoYXQgaXMgbm93IHNob3duLFxuXHQgKiBtaWdodCBkaWZmZXIgZnJvbSB0aGUgcGFzc2VkIGluIGluZGV4IGlmIGl0IHdhcyBvdXQgb2Zcblx0ICogYm91bmRzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlU2xpZGVzKCBzZWxlY3RvciwgaW5kZXggKSB7XG5cblx0XHQvLyBTZWxlY3QgYWxsIHNsaWRlcyBhbmQgY29udmVydCB0aGUgTm9kZUxpc3QgcmVzdWx0IHRvXG5cdFx0Ly8gYW4gYXJyYXlcblx0XHR2YXIgc2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKSApLFxuXHRcdFx0c2xpZGVzTGVuZ3RoID0gc2xpZGVzLmxlbmd0aDtcblxuXHRcdHZhciBwcmludE1vZGUgPSBpc1ByaW50aW5nUERGKCk7XG5cblx0XHRpZiggc2xpZGVzTGVuZ3RoICkge1xuXG5cdFx0XHQvLyBTaG91bGQgdGhlIGluZGV4IGxvb3A/XG5cdFx0XHRpZiggY29uZmlnLmxvb3AgKSB7XG5cdFx0XHRcdGluZGV4ICU9IHNsaWRlc0xlbmd0aDtcblxuXHRcdFx0XHRpZiggaW5kZXggPCAwICkge1xuXHRcdFx0XHRcdGluZGV4ID0gc2xpZGVzTGVuZ3RoICsgaW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gRW5mb3JjZSBtYXggYW5kIG1pbmltdW0gaW5kZXggYm91bmRzXG5cdFx0XHRpbmRleCA9IE1hdGgubWF4KCBNYXRoLm1pbiggaW5kZXgsIHNsaWRlc0xlbmd0aCAtIDEgKSwgMCApO1xuXG5cdFx0XHRmb3IoIHZhciBpID0gMDsgaSA8IHNsaWRlc0xlbmd0aDsgaSsrICkge1xuXHRcdFx0XHR2YXIgZWxlbWVudCA9IHNsaWRlc1tpXTtcblxuXHRcdFx0XHR2YXIgcmV2ZXJzZSA9IGNvbmZpZy5ydGwgJiYgIWlzVmVydGljYWxTbGlkZSggZWxlbWVudCApO1xuXG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ3Bhc3QnICk7XG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ3ByZXNlbnQnICk7XG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ2Z1dHVyZScgKTtcblxuXHRcdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9odG1sL3dnL2RyYWZ0cy9odG1sL21hc3Rlci9lZGl0aW5nLmh0bWwjdGhlLWhpZGRlbi1hdHRyaWJ1dGVcblx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdoaWRkZW4nLCAnJyApO1xuXHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSggJ2FyaWEtaGlkZGVuJywgJ3RydWUnICk7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBlbGVtZW50IGNvbnRhaW5zIHZlcnRpY2FsIHNsaWRlc1xuXHRcdFx0XHRpZiggZWxlbWVudC5xdWVyeVNlbGVjdG9yKCAnc2VjdGlvbicgKSApIHtcblx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoICdzdGFjaycgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIHdlJ3JlIHByaW50aW5nIHN0YXRpYyBzbGlkZXMsIGFsbCBzbGlkZXMgYXJlIFwicHJlc2VudFwiXG5cdFx0XHRcdGlmKCBwcmludE1vZGUgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCAncHJlc2VudCcgKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCBpIDwgaW5kZXggKSB7XG5cdFx0XHRcdFx0Ly8gQW55IGVsZW1lbnQgcHJldmlvdXMgdG8gaW5kZXggaXMgZ2l2ZW4gdGhlICdwYXN0JyBjbGFzc1xuXHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCggcmV2ZXJzZSA/ICdmdXR1cmUnIDogJ3Bhc3QnICk7XG5cblx0XHRcdFx0XHRpZiggY29uZmlnLmZyYWdtZW50cyApIHtcblx0XHRcdFx0XHRcdHZhciBwYXN0RnJhZ21lbnRzID0gdG9BcnJheSggZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApICk7XG5cblx0XHRcdFx0XHRcdC8vIFNob3cgYWxsIGZyYWdtZW50cyBvbiBwcmlvciBzbGlkZXNcblx0XHRcdFx0XHRcdHdoaWxlKCBwYXN0RnJhZ21lbnRzLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0dmFyIHBhc3RGcmFnbWVudCA9IHBhc3RGcmFnbWVudHMucG9wKCk7XG5cdFx0XHRcdFx0XHRcdHBhc3RGcmFnbWVudC5jbGFzc0xpc3QuYWRkKCAndmlzaWJsZScgKTtcblx0XHRcdFx0XHRcdFx0cGFzdEZyYWdtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdjdXJyZW50LWZyYWdtZW50JyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCBpID4gaW5kZXggKSB7XG5cdFx0XHRcdFx0Ly8gQW55IGVsZW1lbnQgc3Vic2VxdWVudCB0byBpbmRleCBpcyBnaXZlbiB0aGUgJ2Z1dHVyZScgY2xhc3Ncblx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoIHJldmVyc2UgPyAncGFzdCcgOiAnZnV0dXJlJyApO1xuXG5cdFx0XHRcdFx0aWYoIGNvbmZpZy5mcmFnbWVudHMgKSB7XG5cdFx0XHRcdFx0XHR2YXIgZnV0dXJlRnJhZ21lbnRzID0gdG9BcnJheSggZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50LnZpc2libGUnICkgKTtcblxuXHRcdFx0XHRcdFx0Ly8gTm8gZnJhZ21lbnRzIGluIGZ1dHVyZSBzbGlkZXMgc2hvdWxkIGJlIHZpc2libGUgYWhlYWQgb2YgdGltZVxuXHRcdFx0XHRcdFx0d2hpbGUoIGZ1dHVyZUZyYWdtZW50cy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBmdXR1cmVGcmFnbWVudCA9IGZ1dHVyZUZyYWdtZW50cy5wb3AoKTtcblx0XHRcdFx0XHRcdFx0ZnV0dXJlRnJhZ21lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ3Zpc2libGUnICk7XG5cdFx0XHRcdFx0XHRcdGZ1dHVyZUZyYWdtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdjdXJyZW50LWZyYWdtZW50JyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBNYXJrIHRoZSBjdXJyZW50IHNsaWRlIGFzIHByZXNlbnRcblx0XHRcdHNsaWRlc1tpbmRleF0uY2xhc3NMaXN0LmFkZCggJ3ByZXNlbnQnICk7XG5cdFx0XHRzbGlkZXNbaW5kZXhdLnJlbW92ZUF0dHJpYnV0ZSggJ2hpZGRlbicgKTtcblx0XHRcdHNsaWRlc1tpbmRleF0ucmVtb3ZlQXR0cmlidXRlKCAnYXJpYS1oaWRkZW4nICk7XG5cblx0XHRcdC8vIElmIHRoaXMgc2xpZGUgaGFzIGEgc3RhdGUgYXNzb2NpYXRlZCB3aXRoIGl0LCBhZGQgaXRcblx0XHRcdC8vIG9udG8gdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGRlY2tcblx0XHRcdHZhciBzbGlkZVN0YXRlID0gc2xpZGVzW2luZGV4XS5nZXRBdHRyaWJ1dGUoICdkYXRhLXN0YXRlJyApO1xuXHRcdFx0aWYoIHNsaWRlU3RhdGUgKSB7XG5cdFx0XHRcdHN0YXRlID0gc3RhdGUuY29uY2F0KCBzbGlkZVN0YXRlLnNwbGl0KCAnICcgKSApO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gU2luY2UgdGhlcmUgYXJlIG5vIHNsaWRlcyB3ZSBjYW4ndCBiZSBhbnl3aGVyZSBiZXlvbmQgdGhlXG5cdFx0XHQvLyB6ZXJvdGggaW5kZXhcblx0XHRcdGluZGV4ID0gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW5kZXg7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBPcHRpbWl6YXRpb24gbWV0aG9kOyBoaWRlIGFsbCBzbGlkZXMgdGhhdCBhcmUgZmFyIGF3YXlcblx0ICogZnJvbSB0aGUgcHJlc2VudCBzbGlkZS5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZVNsaWRlc1Zpc2liaWxpdHkoKSB7XG5cblx0XHQvLyBTZWxlY3QgYWxsIHNsaWRlcyBhbmQgY29udmVydCB0aGUgTm9kZUxpc3QgcmVzdWx0IHRvXG5cdFx0Ly8gYW4gYXJyYXlcblx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlcyA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICkgKSxcblx0XHRcdGhvcml6b250YWxTbGlkZXNMZW5ndGggPSBob3Jpem9udGFsU2xpZGVzLmxlbmd0aCxcblx0XHRcdGRpc3RhbmNlWCxcblx0XHRcdGRpc3RhbmNlWTtcblxuXHRcdGlmKCBob3Jpem9udGFsU2xpZGVzTGVuZ3RoICYmIHR5cGVvZiBpbmRleGggIT09ICd1bmRlZmluZWQnICkge1xuXG5cdFx0XHQvLyBUaGUgbnVtYmVyIG9mIHN0ZXBzIGF3YXkgZnJvbSB0aGUgcHJlc2VudCBzbGlkZSB0aGF0IHdpbGxcblx0XHRcdC8vIGJlIHZpc2libGVcblx0XHRcdHZhciB2aWV3RGlzdGFuY2UgPSBpc092ZXJ2aWV3KCkgPyAxMCA6IGNvbmZpZy52aWV3RGlzdGFuY2U7XG5cblx0XHRcdC8vIExpbWl0IHZpZXcgZGlzdGFuY2Ugb24gd2Vha2VyIGRldmljZXNcblx0XHRcdGlmKCBpc01vYmlsZURldmljZSApIHtcblx0XHRcdFx0dmlld0Rpc3RhbmNlID0gaXNPdmVydmlldygpID8gNiA6IDI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFsbCBzbGlkZXMgbmVlZCB0byBiZSB2aXNpYmxlIHdoZW4gZXhwb3J0aW5nIHRvIFBERlxuXHRcdFx0aWYoIGlzUHJpbnRpbmdQREYoKSApIHtcblx0XHRcdFx0dmlld0Rpc3RhbmNlID0gTnVtYmVyLk1BWF9WQUxVRTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKCB2YXIgeCA9IDA7IHggPCBob3Jpem9udGFsU2xpZGVzTGVuZ3RoOyB4KysgKSB7XG5cdFx0XHRcdHZhciBob3Jpem9udGFsU2xpZGUgPSBob3Jpem9udGFsU2xpZGVzW3hdO1xuXG5cdFx0XHRcdHZhciB2ZXJ0aWNhbFNsaWRlcyA9IHRvQXJyYXkoIGhvcml6b250YWxTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApLFxuXHRcdFx0XHRcdHZlcnRpY2FsU2xpZGVzTGVuZ3RoID0gdmVydGljYWxTbGlkZXMubGVuZ3RoO1xuXG5cdFx0XHRcdC8vIERldGVybWluZSBob3cgZmFyIGF3YXkgdGhpcyBzbGlkZSBpcyBmcm9tIHRoZSBwcmVzZW50XG5cdFx0XHRcdGRpc3RhbmNlWCA9IE1hdGguYWJzKCAoIGluZGV4aCB8fCAwICkgLSB4ICkgfHwgMDtcblxuXHRcdFx0XHQvLyBJZiB0aGUgcHJlc2VudGF0aW9uIGlzIGxvb3BlZCwgZGlzdGFuY2Ugc2hvdWxkIG1lYXN1cmVcblx0XHRcdFx0Ly8gMSBiZXR3ZWVuIHRoZSBmaXJzdCBhbmQgbGFzdCBzbGlkZXNcblx0XHRcdFx0aWYoIGNvbmZpZy5sb29wICkge1xuXHRcdFx0XHRcdGRpc3RhbmNlWCA9IE1hdGguYWJzKCAoICggaW5kZXhoIHx8IDAgKSAtIHggKSAlICggaG9yaXpvbnRhbFNsaWRlc0xlbmd0aCAtIHZpZXdEaXN0YW5jZSApICkgfHwgMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFNob3cgdGhlIGhvcml6b250YWwgc2xpZGUgaWYgaXQncyB3aXRoaW4gdGhlIHZpZXcgZGlzdGFuY2Vcblx0XHRcdFx0aWYoIGRpc3RhbmNlWCA8IHZpZXdEaXN0YW5jZSApIHtcblx0XHRcdFx0XHRzaG93U2xpZGUoIGhvcml6b250YWxTbGlkZSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGhpZGVTbGlkZSggaG9yaXpvbnRhbFNsaWRlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiggdmVydGljYWxTbGlkZXNMZW5ndGggKSB7XG5cblx0XHRcdFx0XHR2YXIgb3kgPSBnZXRQcmV2aW91c1ZlcnRpY2FsSW5kZXgoIGhvcml6b250YWxTbGlkZSApO1xuXG5cdFx0XHRcdFx0Zm9yKCB2YXIgeSA9IDA7IHkgPCB2ZXJ0aWNhbFNsaWRlc0xlbmd0aDsgeSsrICkge1xuXHRcdFx0XHRcdFx0dmFyIHZlcnRpY2FsU2xpZGUgPSB2ZXJ0aWNhbFNsaWRlc1t5XTtcblxuXHRcdFx0XHRcdFx0ZGlzdGFuY2VZID0geCA9PT0gKCBpbmRleGggfHwgMCApID8gTWF0aC5hYnMoICggaW5kZXh2IHx8IDAgKSAtIHkgKSA6IE1hdGguYWJzKCB5IC0gb3kgKTtcblxuXHRcdFx0XHRcdFx0aWYoIGRpc3RhbmNlWCArIGRpc3RhbmNlWSA8IHZpZXdEaXN0YW5jZSApIHtcblx0XHRcdFx0XHRcdFx0c2hvd1NsaWRlKCB2ZXJ0aWNhbFNsaWRlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0aGlkZVNsaWRlKCB2ZXJ0aWNhbFNsaWRlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFBpY2sgdXAgbm90ZXMgZnJvbSB0aGUgY3VycmVudCBzbGlkZSBhbmQgZGlzcGxheSB0aGFtXG5cdCAqIHRvIHRoZSB2aWV3ZXIuXG5cdCAqXG5cdCAqIEBzZWUgYHNob3dOb3Rlc2AgY29uZmlnIHZhbHVlXG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVOb3RlcygpIHtcblxuXHRcdGlmKCBjb25maWcuc2hvd05vdGVzICYmIGRvbS5zcGVha2VyTm90ZXMgJiYgY3VycmVudFNsaWRlICYmICFpc1ByaW50aW5nUERGKCkgKSB7XG5cblx0XHRcdGRvbS5zcGVha2VyTm90ZXMuaW5uZXJIVE1MID0gZ2V0U2xpZGVOb3RlcygpIHx8ICcnO1xuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgcHJvZ3Jlc3MgYmFyIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgc2xpZGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVQcm9ncmVzcygpIHtcblxuXHRcdC8vIFVwZGF0ZSBwcm9ncmVzcyBpZiBlbmFibGVkXG5cdFx0aWYoIGNvbmZpZy5wcm9ncmVzcyAmJiBkb20ucHJvZ3Jlc3NiYXIgKSB7XG5cblx0XHRcdGRvbS5wcm9ncmVzc2Jhci5zdHlsZS53aWR0aCA9IGdldFByb2dyZXNzKCkgKiBkb20ud3JhcHBlci5vZmZzZXRXaWR0aCArICdweCc7XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBzbGlkZSBudW1iZXIgZGl2IHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgc2xpZGUuXG5cdCAqXG5cdCAqIFRoZSBmb2xsb3dpbmcgc2xpZGUgbnVtYmVyIGZvcm1hdHMgYXJlIGF2YWlsYWJsZTpcblx0ICogIFwiaC52XCI6IFx0aG9yaXpvbnRhbCAuIHZlcnRpY2FsIHNsaWRlIG51bWJlciAoZGVmYXVsdClcblx0ICogIFwiaC92XCI6IFx0aG9yaXpvbnRhbCAvIHZlcnRpY2FsIHNsaWRlIG51bWJlclxuXHQgKiAgICBcImNcIjogXHRmbGF0dGVuZWQgc2xpZGUgbnVtYmVyXG5cdCAqICBcImMvdFwiOiBcdGZsYXR0ZW5lZCBzbGlkZSBudW1iZXIgLyB0b3RhbCBzbGlkZXNcblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZVNsaWRlTnVtYmVyKCkge1xuXG5cdFx0Ly8gVXBkYXRlIHNsaWRlIG51bWJlciBpZiBlbmFibGVkXG5cdFx0aWYoIGNvbmZpZy5zbGlkZU51bWJlciAmJiBkb20uc2xpZGVOdW1iZXIgKSB7XG5cblx0XHRcdHZhciB2YWx1ZSA9IFtdO1xuXHRcdFx0dmFyIGZvcm1hdCA9ICdoLnYnO1xuXG5cdFx0XHQvLyBDaGVjayBpZiBhIGN1c3RvbSBudW1iZXIgZm9ybWF0IGlzIGF2YWlsYWJsZVxuXHRcdFx0aWYoIHR5cGVvZiBjb25maWcuc2xpZGVOdW1iZXIgPT09ICdzdHJpbmcnICkge1xuXHRcdFx0XHRmb3JtYXQgPSBjb25maWcuc2xpZGVOdW1iZXI7XG5cdFx0XHR9XG5cblx0XHRcdHN3aXRjaCggZm9ybWF0ICkge1xuXHRcdFx0XHRjYXNlICdjJzpcblx0XHRcdFx0XHR2YWx1ZS5wdXNoKCBnZXRTbGlkZVBhc3RDb3VudCgpICsgMSApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdjL3QnOlxuXHRcdFx0XHRcdHZhbHVlLnB1c2goIGdldFNsaWRlUGFzdENvdW50KCkgKyAxLCAnLycsIGdldFRvdGFsU2xpZGVzKCkgKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnaC92Jzpcblx0XHRcdFx0XHR2YWx1ZS5wdXNoKCBpbmRleGggKyAxICk7XG5cdFx0XHRcdFx0aWYoIGlzVmVydGljYWxTbGlkZSgpICkgdmFsdWUucHVzaCggJy8nLCBpbmRleHYgKyAxICk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dmFsdWUucHVzaCggaW5kZXhoICsgMSApO1xuXHRcdFx0XHRcdGlmKCBpc1ZlcnRpY2FsU2xpZGUoKSApIHZhbHVlLnB1c2goICcuJywgaW5kZXh2ICsgMSApO1xuXHRcdFx0fVxuXG5cdFx0XHRkb20uc2xpZGVOdW1iZXIuaW5uZXJIVE1MID0gZm9ybWF0U2xpZGVOdW1iZXIoIHZhbHVlWzBdLCB2YWx1ZVsxXSwgdmFsdWVbMl0gKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBBcHBsaWVzIEhUTUwgZm9ybWF0dGluZyB0byBhIHNsaWRlIG51bWJlciBiZWZvcmUgaXQnc1xuXHQgKiB3cml0dGVuIHRvIHRoZSBET00uXG5cdCAqL1xuXHRmdW5jdGlvbiBmb3JtYXRTbGlkZU51bWJlciggYSwgZGVsaW1pdGVyLCBiICkge1xuXG5cdFx0aWYoIHR5cGVvZiBiID09PSAnbnVtYmVyJyAmJiAhaXNOYU4oIGIgKSApIHtcblx0XHRcdHJldHVybiAgJzxzcGFuIGNsYXNzPVwic2xpZGUtbnVtYmVyLWFcIj4nKyBhICsnPC9zcGFuPicgK1xuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cInNsaWRlLW51bWJlci1kZWxpbWl0ZXJcIj4nKyBkZWxpbWl0ZXIgKyc8L3NwYW4+JyArXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwic2xpZGUtbnVtYmVyLWJcIj4nKyBiICsnPC9zcGFuPic7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmV0dXJuICc8c3BhbiBjbGFzcz1cInNsaWRlLW51bWJlci1hXCI+JysgYSArJzwvc3Bhbj4nO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIHN0YXRlIG9mIGFsbCBjb250cm9sL25hdmlnYXRpb24gYXJyb3dzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlQ29udHJvbHMoKSB7XG5cblx0XHR2YXIgcm91dGVzID0gYXZhaWxhYmxlUm91dGVzKCk7XG5cdFx0dmFyIGZyYWdtZW50cyA9IGF2YWlsYWJsZUZyYWdtZW50cygpO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSAnZW5hYmxlZCcgY2xhc3MgZnJvbSBhbGwgZGlyZWN0aW9uc1xuXHRcdGRvbS5jb250cm9sc0xlZnQuY29uY2F0KCBkb20uY29udHJvbHNSaWdodCApXG5cdFx0XHRcdFx0XHQuY29uY2F0KCBkb20uY29udHJvbHNVcCApXG5cdFx0XHRcdFx0XHQuY29uY2F0KCBkb20uY29udHJvbHNEb3duIClcblx0XHRcdFx0XHRcdC5jb25jYXQoIGRvbS5jb250cm9sc1ByZXYgKVxuXHRcdFx0XHRcdFx0LmNvbmNhdCggZG9tLmNvbnRyb2xzTmV4dCApLmZvckVhY2goIGZ1bmN0aW9uKCBub2RlICkge1xuXHRcdFx0bm9kZS5jbGFzc0xpc3QucmVtb3ZlKCAnZW5hYmxlZCcgKTtcblx0XHRcdG5vZGUuY2xhc3NMaXN0LnJlbW92ZSggJ2ZyYWdtZW50ZWQnICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gQWRkIHRoZSAnZW5hYmxlZCcgY2xhc3MgdG8gdGhlIGF2YWlsYWJsZSByb3V0ZXNcblx0XHRpZiggcm91dGVzLmxlZnQgKSBkb20uY29udHJvbHNMZWZ0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2VuYWJsZWQnICk7XHR9ICk7XG5cdFx0aWYoIHJvdXRlcy5yaWdodCApIGRvbS5jb250cm9sc1JpZ2h0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2VuYWJsZWQnICk7IH0gKTtcblx0XHRpZiggcm91dGVzLnVwICkgZG9tLmNvbnRyb2xzVXAuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZW5hYmxlZCcgKTtcdH0gKTtcblx0XHRpZiggcm91dGVzLmRvd24gKSBkb20uY29udHJvbHNEb3duLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2VuYWJsZWQnICk7IH0gKTtcblxuXHRcdC8vIFByZXYvbmV4dCBidXR0b25zXG5cdFx0aWYoIHJvdXRlcy5sZWZ0IHx8IHJvdXRlcy51cCApIGRvbS5jb250cm9sc1ByZXYuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZW5hYmxlZCcgKTsgfSApO1xuXHRcdGlmKCByb3V0ZXMucmlnaHQgfHwgcm91dGVzLmRvd24gKSBkb20uY29udHJvbHNOZXh0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2VuYWJsZWQnICk7IH0gKTtcblxuXHRcdC8vIEhpZ2hsaWdodCBmcmFnbWVudCBkaXJlY3Rpb25zXG5cdFx0aWYoIGN1cnJlbnRTbGlkZSApIHtcblxuXHRcdFx0Ly8gQWx3YXlzIGFwcGx5IGZyYWdtZW50IGRlY29yYXRvciB0byBwcmV2L25leHQgYnV0dG9uc1xuXHRcdFx0aWYoIGZyYWdtZW50cy5wcmV2ICkgZG9tLmNvbnRyb2xzUHJldi5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdmcmFnbWVudGVkJywgJ2VuYWJsZWQnICk7IH0gKTtcblx0XHRcdGlmKCBmcmFnbWVudHMubmV4dCApIGRvbS5jb250cm9sc05leHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZnJhZ21lbnRlZCcsICdlbmFibGVkJyApOyB9ICk7XG5cblx0XHRcdC8vIEFwcGx5IGZyYWdtZW50IGRlY29yYXRvcnMgdG8gZGlyZWN0aW9uYWwgYnV0dG9ucyBiYXNlZCBvblxuXHRcdFx0Ly8gd2hhdCBzbGlkZSBheGlzIHRoZXkgYXJlIGluXG5cdFx0XHRpZiggaXNWZXJ0aWNhbFNsaWRlKCBjdXJyZW50U2xpZGUgKSApIHtcblx0XHRcdFx0aWYoIGZyYWdtZW50cy5wcmV2ICkgZG9tLmNvbnRyb2xzVXAuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZnJhZ21lbnRlZCcsICdlbmFibGVkJyApOyB9ICk7XG5cdFx0XHRcdGlmKCBmcmFnbWVudHMubmV4dCApIGRvbS5jb250cm9sc0Rvd24uZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZnJhZ21lbnRlZCcsICdlbmFibGVkJyApOyB9ICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWYoIGZyYWdtZW50cy5wcmV2ICkgZG9tLmNvbnRyb2xzTGVmdC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdmcmFnbWVudGVkJywgJ2VuYWJsZWQnICk7IH0gKTtcblx0XHRcdFx0aWYoIGZyYWdtZW50cy5uZXh0ICkgZG9tLmNvbnRyb2xzUmlnaHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZnJhZ21lbnRlZCcsICdlbmFibGVkJyApOyB9ICk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBiYWNrZ3JvdW5kIGVsZW1lbnRzIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnRcblx0ICogc2xpZGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5jbHVkZUFsbCBJZiB0cnVlLCB0aGUgYmFja2dyb3VuZHMgb2Zcblx0ICogYWxsIHZlcnRpY2FsIHNsaWRlcyAobm90IGp1c3QgdGhlIHByZXNlbnQpIHdpbGwgYmUgdXBkYXRlZC5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZUJhY2tncm91bmQoIGluY2x1ZGVBbGwgKSB7XG5cblx0XHR2YXIgY3VycmVudEJhY2tncm91bmQgPSBudWxsO1xuXG5cdFx0Ly8gUmV2ZXJzZSBwYXN0L2Z1dHVyZSBjbGFzc2VzIHdoZW4gaW4gUlRMIG1vZGVcblx0XHR2YXIgaG9yaXpvbnRhbFBhc3QgPSBjb25maWcucnRsID8gJ2Z1dHVyZScgOiAncGFzdCcsXG5cdFx0XHRob3Jpem9udGFsRnV0dXJlID0gY29uZmlnLnJ0bCA/ICdwYXN0JyA6ICdmdXR1cmUnO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBjbGFzc2VzIG9mIGFsbCBiYWNrZ3JvdW5kcyB0byBtYXRjaCB0aGVcblx0XHQvLyBzdGF0ZXMgb2YgdGhlaXIgc2xpZGVzIChwYXN0L3ByZXNlbnQvZnV0dXJlKVxuXHRcdHRvQXJyYXkoIGRvbS5iYWNrZ3JvdW5kLmNoaWxkTm9kZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiggYmFja2dyb3VuZGgsIGggKSB7XG5cblx0XHRcdGJhY2tncm91bmRoLmNsYXNzTGlzdC5yZW1vdmUoICdwYXN0JyApO1xuXHRcdFx0YmFja2dyb3VuZGguY2xhc3NMaXN0LnJlbW92ZSggJ3ByZXNlbnQnICk7XG5cdFx0XHRiYWNrZ3JvdW5kaC5jbGFzc0xpc3QucmVtb3ZlKCAnZnV0dXJlJyApO1xuXG5cdFx0XHRpZiggaCA8IGluZGV4aCApIHtcblx0XHRcdFx0YmFja2dyb3VuZGguY2xhc3NMaXN0LmFkZCggaG9yaXpvbnRhbFBhc3QgKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBoID4gaW5kZXhoICkge1xuXHRcdFx0XHRiYWNrZ3JvdW5kaC5jbGFzc0xpc3QuYWRkKCBob3Jpem9udGFsRnV0dXJlICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YmFja2dyb3VuZGguY2xhc3NMaXN0LmFkZCggJ3ByZXNlbnQnICk7XG5cblx0XHRcdFx0Ly8gU3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgYmFja2dyb3VuZCBlbGVtZW50XG5cdFx0XHRcdGN1cnJlbnRCYWNrZ3JvdW5kID0gYmFja2dyb3VuZGg7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCBpbmNsdWRlQWxsIHx8IGggPT09IGluZGV4aCApIHtcblx0XHRcdFx0dG9BcnJheSggYmFja2dyb3VuZGgucXVlcnlTZWxlY3RvckFsbCggJy5zbGlkZS1iYWNrZ3JvdW5kJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGJhY2tncm91bmR2LCB2ICkge1xuXG5cdFx0XHRcdFx0YmFja2dyb3VuZHYuY2xhc3NMaXN0LnJlbW92ZSggJ3Bhc3QnICk7XG5cdFx0XHRcdFx0YmFja2dyb3VuZHYuY2xhc3NMaXN0LnJlbW92ZSggJ3ByZXNlbnQnICk7XG5cdFx0XHRcdFx0YmFja2dyb3VuZHYuY2xhc3NMaXN0LnJlbW92ZSggJ2Z1dHVyZScgKTtcblxuXHRcdFx0XHRcdGlmKCB2IDwgaW5kZXh2ICkge1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZHYuY2xhc3NMaXN0LmFkZCggJ3Bhc3QnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKCB2ID4gaW5kZXh2ICkge1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZHYuY2xhc3NMaXN0LmFkZCggJ2Z1dHVyZScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kdi5jbGFzc0xpc3QuYWRkKCAncHJlc2VudCcgKTtcblxuXHRcdFx0XHRcdFx0Ly8gT25seSBpZiB0aGlzIGlzIHRoZSBwcmVzZW50IGhvcml6b250YWwgYW5kIHZlcnRpY2FsIHNsaWRlXG5cdFx0XHRcdFx0XHRpZiggaCA9PT0gaW5kZXhoICkgY3VycmVudEJhY2tncm91bmQgPSBiYWNrZ3JvdW5kdjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXG5cdFx0fSApO1xuXG5cdFx0Ly8gU3RvcCBhbnkgY3VycmVudGx5IHBsYXlpbmcgdmlkZW8gYmFja2dyb3VuZFxuXHRcdGlmKCBwcmV2aW91c0JhY2tncm91bmQgKSB7XG5cblx0XHRcdHZhciBwcmV2aW91c1ZpZGVvID0gcHJldmlvdXNCYWNrZ3JvdW5kLnF1ZXJ5U2VsZWN0b3IoICd2aWRlbycgKTtcblx0XHRcdGlmKCBwcmV2aW91c1ZpZGVvICkgcHJldmlvdXNWaWRlby5wYXVzZSgpO1xuXG5cdFx0fVxuXG5cdFx0aWYoIGN1cnJlbnRCYWNrZ3JvdW5kICkge1xuXG5cdFx0XHQvLyBTdGFydCB2aWRlbyBwbGF5YmFja1xuXHRcdFx0dmFyIGN1cnJlbnRWaWRlbyA9IGN1cnJlbnRCYWNrZ3JvdW5kLnF1ZXJ5U2VsZWN0b3IoICd2aWRlbycgKTtcblx0XHRcdGlmKCBjdXJyZW50VmlkZW8gKSB7XG5cblx0XHRcdFx0dmFyIHN0YXJ0VmlkZW8gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjdXJyZW50VmlkZW8uY3VycmVudFRpbWUgPSAwO1xuXHRcdFx0XHRcdGN1cnJlbnRWaWRlby5wbGF5KCk7XG5cdFx0XHRcdFx0Y3VycmVudFZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdsb2FkZWRkYXRhJywgc3RhcnRWaWRlbyApO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmKCBjdXJyZW50VmlkZW8ucmVhZHlTdGF0ZSA+IDEgKSB7XG5cdFx0XHRcdFx0c3RhcnRWaWRlbygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGN1cnJlbnRWaWRlby5hZGRFdmVudExpc3RlbmVyKCAnbG9hZGVkZGF0YScsIHN0YXJ0VmlkZW8gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHZhciBiYWNrZ3JvdW5kSW1hZ2VVUkwgPSBjdXJyZW50QmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgfHwgJyc7XG5cblx0XHRcdC8vIFJlc3RhcnQgR0lGcyAoZG9lc24ndCB3b3JrIGluIEZpcmVmb3gpXG5cdFx0XHRpZiggL1xcLmdpZi9pLnRlc3QoIGJhY2tncm91bmRJbWFnZVVSTCApICkge1xuXHRcdFx0XHRjdXJyZW50QmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAnJztcblx0XHRcdFx0d2luZG93LmdldENvbXB1dGVkU3R5bGUoIGN1cnJlbnRCYWNrZ3JvdW5kICkub3BhY2l0eTtcblx0XHRcdFx0Y3VycmVudEJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYmFja2dyb3VuZEltYWdlVVJMO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBEb24ndCB0cmFuc2l0aW9uIGJldHdlZW4gaWRlbnRpY2FsIGJhY2tncm91bmRzLiBUaGlzXG5cdFx0XHQvLyBwcmV2ZW50cyB1bndhbnRlZCBmbGlja2VyLlxuXHRcdFx0dmFyIHByZXZpb3VzQmFja2dyb3VuZEhhc2ggPSBwcmV2aW91c0JhY2tncm91bmQgPyBwcmV2aW91c0JhY2tncm91bmQuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWhhc2gnICkgOiBudWxsO1xuXHRcdFx0dmFyIGN1cnJlbnRCYWNrZ3JvdW5kSGFzaCA9IGN1cnJlbnRCYWNrZ3JvdW5kLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1oYXNoJyApO1xuXHRcdFx0aWYoIGN1cnJlbnRCYWNrZ3JvdW5kSGFzaCAmJiBjdXJyZW50QmFja2dyb3VuZEhhc2ggPT09IHByZXZpb3VzQmFja2dyb3VuZEhhc2ggJiYgY3VycmVudEJhY2tncm91bmQgIT09IHByZXZpb3VzQmFja2dyb3VuZCApIHtcblx0XHRcdFx0ZG9tLmJhY2tncm91bmQuY2xhc3NMaXN0LmFkZCggJ25vLXRyYW5zaXRpb24nICk7XG5cdFx0XHR9XG5cblx0XHRcdHByZXZpb3VzQmFja2dyb3VuZCA9IGN1cnJlbnRCYWNrZ3JvdW5kO1xuXG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlcmUncyBhIGJhY2tncm91bmQgYnJpZ2h0bmVzcyBmbGFnIGZvciB0aGlzIHNsaWRlLFxuXHRcdC8vIGJ1YmJsZSBpdCB0byB0aGUgLnJldmVhbCBjb250YWluZXJcblx0XHRpZiggY3VycmVudFNsaWRlICkge1xuXHRcdFx0WyAnaGFzLWxpZ2h0LWJhY2tncm91bmQnLCAnaGFzLWRhcmstYmFja2dyb3VuZCcgXS5mb3JFYWNoKCBmdW5jdGlvbiggY2xhc3NUb0J1YmJsZSApIHtcblx0XHRcdFx0aWYoIGN1cnJlbnRTbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoIGNsYXNzVG9CdWJibGUgKSApIHtcblx0XHRcdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCBjbGFzc1RvQnViYmxlICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggY2xhc3NUb0J1YmJsZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0Ly8gQWxsb3cgdGhlIGZpcnN0IGJhY2tncm91bmQgdG8gYXBwbHkgd2l0aG91dCB0cmFuc2l0aW9uXG5cdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRkb20uYmFja2dyb3VuZC5jbGFzc0xpc3QucmVtb3ZlKCAnbm8tdHJhbnNpdGlvbicgKTtcblx0XHR9LCAxICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcGFyYWxsYXggYmFja2dyb3VuZCBiYXNlZFxuXHQgKiBvbiB0aGUgY3VycmVudCBzbGlkZSBpbmRleC5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZVBhcmFsbGF4KCkge1xuXG5cdFx0aWYoIGNvbmZpZy5wYXJhbGxheEJhY2tncm91bmRJbWFnZSApIHtcblxuXHRcdFx0dmFyIGhvcml6b250YWxTbGlkZXMgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApLFxuXHRcdFx0XHR2ZXJ0aWNhbFNsaWRlcyA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFZFUlRJQ0FMX1NMSURFU19TRUxFQ1RPUiApO1xuXG5cdFx0XHR2YXIgYmFja2dyb3VuZFNpemUgPSBkb20uYmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kU2l6ZS5zcGxpdCggJyAnICksXG5cdFx0XHRcdGJhY2tncm91bmRXaWR0aCwgYmFja2dyb3VuZEhlaWdodDtcblxuXHRcdFx0aWYoIGJhY2tncm91bmRTaXplLmxlbmd0aCA9PT0gMSApIHtcblx0XHRcdFx0YmFja2dyb3VuZFdpZHRoID0gYmFja2dyb3VuZEhlaWdodCA9IHBhcnNlSW50KCBiYWNrZ3JvdW5kU2l6ZVswXSwgMTAgKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRiYWNrZ3JvdW5kV2lkdGggPSBwYXJzZUludCggYmFja2dyb3VuZFNpemVbMF0sIDEwICk7XG5cdFx0XHRcdGJhY2tncm91bmRIZWlnaHQgPSBwYXJzZUludCggYmFja2dyb3VuZFNpemVbMV0sIDEwICk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzbGlkZVdpZHRoID0gZG9tLmJhY2tncm91bmQub2Zmc2V0V2lkdGgsXG5cdFx0XHRcdGhvcml6b250YWxTbGlkZUNvdW50ID0gaG9yaXpvbnRhbFNsaWRlcy5sZW5ndGgsXG5cdFx0XHRcdGhvcml6b250YWxPZmZzZXRNdWx0aXBsaWVyLFxuXHRcdFx0XHRob3Jpem9udGFsT2Zmc2V0O1xuXG5cdFx0XHRpZiggdHlwZW9mIGNvbmZpZy5wYXJhbGxheEJhY2tncm91bmRIb3Jpem9udGFsID09PSAnbnVtYmVyJyApIHtcblx0XHRcdFx0aG9yaXpvbnRhbE9mZnNldE11bHRpcGxpZXIgPSBjb25maWcucGFyYWxsYXhCYWNrZ3JvdW5kSG9yaXpvbnRhbDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRob3Jpem9udGFsT2Zmc2V0TXVsdGlwbGllciA9IGhvcml6b250YWxTbGlkZUNvdW50ID4gMSA/ICggYmFja2dyb3VuZFdpZHRoIC0gc2xpZGVXaWR0aCApIC8gKCBob3Jpem9udGFsU2xpZGVDb3VudC0xICkgOiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRob3Jpem9udGFsT2Zmc2V0ID0gaG9yaXpvbnRhbE9mZnNldE11bHRpcGxpZXIgKiBpbmRleGggKiAtMTtcblxuXHRcdFx0dmFyIHNsaWRlSGVpZ2h0ID0gZG9tLmJhY2tncm91bmQub2Zmc2V0SGVpZ2h0LFxuXHRcdFx0XHR2ZXJ0aWNhbFNsaWRlQ291bnQgPSB2ZXJ0aWNhbFNsaWRlcy5sZW5ndGgsXG5cdFx0XHRcdHZlcnRpY2FsT2Zmc2V0TXVsdGlwbGllcixcblx0XHRcdFx0dmVydGljYWxPZmZzZXQ7XG5cblx0XHRcdGlmKCB0eXBlb2YgY29uZmlnLnBhcmFsbGF4QmFja2dyb3VuZFZlcnRpY2FsID09PSAnbnVtYmVyJyApIHtcblx0XHRcdFx0dmVydGljYWxPZmZzZXRNdWx0aXBsaWVyID0gY29uZmlnLnBhcmFsbGF4QmFja2dyb3VuZFZlcnRpY2FsO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHZlcnRpY2FsT2Zmc2V0TXVsdGlwbGllciA9ICggYmFja2dyb3VuZEhlaWdodCAtIHNsaWRlSGVpZ2h0ICkgLyAoIHZlcnRpY2FsU2xpZGVDb3VudC0xICk7XG5cdFx0XHR9XG5cblx0XHRcdHZlcnRpY2FsT2Zmc2V0ID0gdmVydGljYWxTbGlkZUNvdW50ID4gMCA/ICB2ZXJ0aWNhbE9mZnNldE11bHRpcGxpZXIgKiBpbmRleHYgKiAxIDogMDtcblxuXHRcdFx0ZG9tLmJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gaG9yaXpvbnRhbE9mZnNldCArICdweCAnICsgLXZlcnRpY2FsT2Zmc2V0ICsgJ3B4JztcblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENhbGxlZCB3aGVuIHRoZSBnaXZlbiBzbGlkZSBpcyB3aXRoaW4gdGhlIGNvbmZpZ3VyZWQgdmlld1xuXHQgKiBkaXN0YW5jZS4gU2hvd3MgdGhlIHNsaWRlIGVsZW1lbnQgYW5kIGxvYWRzIGFueSBjb250ZW50XG5cdCAqIHRoYXQgaXMgc2V0IHRvIGxvYWQgbGF6aWx5IChkYXRhLXNyYykuXG5cdCAqL1xuXHRmdW5jdGlvbiBzaG93U2xpZGUoIHNsaWRlICkge1xuXG5cdFx0Ly8gU2hvdyB0aGUgc2xpZGUgZWxlbWVudFxuXHRcdHNsaWRlLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuXG5cdFx0Ly8gTWVkaWEgZWxlbWVudHMgd2l0aCBkYXRhLXNyYyBhdHRyaWJ1dGVzXG5cdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ2ltZ1tkYXRhLXNyY10sIHZpZGVvW2RhdGEtc3JjXSwgYXVkaW9bZGF0YS1zcmNdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSggJ3NyYycsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1zcmMnICkgKTtcblx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGF0YS1zcmMnICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gTWVkaWEgZWxlbWVudHMgd2l0aCA8c291cmNlPiBjaGlsZHJlblxuXHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICd2aWRlbywgYXVkaW8nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggbWVkaWEgKSB7XG5cdFx0XHR2YXIgc291cmNlcyA9IDA7XG5cblx0XHRcdHRvQXJyYXkoIG1lZGlhLnF1ZXJ5U2VsZWN0b3JBbGwoICdzb3VyY2VbZGF0YS1zcmNdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIHNvdXJjZSApIHtcblx0XHRcdFx0c291cmNlLnNldEF0dHJpYnV0ZSggJ3NyYycsIHNvdXJjZS5nZXRBdHRyaWJ1dGUoICdkYXRhLXNyYycgKSApO1xuXHRcdFx0XHRzb3VyY2UucmVtb3ZlQXR0cmlidXRlKCAnZGF0YS1zcmMnICk7XG5cdFx0XHRcdHNvdXJjZXMgKz0gMTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gSWYgd2UgcmV3cm90ZSBzb3VyY2VzIGZvciB0aGlzIHZpZGVvL2F1ZGlvIGVsZW1lbnQsIHdlIG5lZWRcblx0XHRcdC8vIHRvIG1hbnVhbGx5IHRlbGwgaXQgdG8gbG9hZCBmcm9tIGl0cyBuZXcgb3JpZ2luXG5cdFx0XHRpZiggc291cmNlcyA+IDAgKSB7XG5cdFx0XHRcdG1lZGlhLmxvYWQoKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblxuXHRcdC8vIFNob3cgdGhlIGNvcnJlc3BvbmRpbmcgYmFja2dyb3VuZCBlbGVtZW50XG5cdFx0dmFyIGluZGljZXMgPSBnZXRJbmRpY2VzKCBzbGlkZSApO1xuXHRcdHZhciBiYWNrZ3JvdW5kID0gZ2V0U2xpZGVCYWNrZ3JvdW5kKCBpbmRpY2VzLmgsIGluZGljZXMudiApO1xuXHRcdGlmKCBiYWNrZ3JvdW5kICkge1xuXHRcdFx0YmFja2dyb3VuZC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuXHRcdFx0Ly8gSWYgdGhlIGJhY2tncm91bmQgY29udGFpbnMgbWVkaWEsIGxvYWQgaXRcblx0XHRcdGlmKCBiYWNrZ3JvdW5kLmhhc0F0dHJpYnV0ZSggJ2RhdGEtbG9hZGVkJyApID09PSBmYWxzZSApIHtcblx0XHRcdFx0YmFja2dyb3VuZC5zZXRBdHRyaWJ1dGUoICdkYXRhLWxvYWRlZCcsICd0cnVlJyApO1xuXG5cdFx0XHRcdHZhciBiYWNrZ3JvdW5kSW1hZ2UgPSBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtaW1hZ2UnICksXG5cdFx0XHRcdFx0YmFja2dyb3VuZFZpZGVvID0gc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLXZpZGVvJyApLFxuXHRcdFx0XHRcdGJhY2tncm91bmRWaWRlb0xvb3AgPSBzbGlkZS5oYXNBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtdmlkZW8tbG9vcCcgKSxcblx0XHRcdFx0XHRiYWNrZ3JvdW5kVmlkZW9NdXRlZCA9IHNsaWRlLmhhc0F0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC12aWRlby1tdXRlZCcgKSxcblx0XHRcdFx0XHRiYWNrZ3JvdW5kSWZyYW1lID0gc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWlmcmFtZScgKTtcblxuXHRcdFx0XHQvLyBJbWFnZXNcblx0XHRcdFx0aWYoIGJhY2tncm91bmRJbWFnZSApIHtcblx0XHRcdFx0XHRiYWNrZ3JvdW5kLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICd1cmwoJysgYmFja2dyb3VuZEltYWdlICsnKSc7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gVmlkZW9zXG5cdFx0XHRcdGVsc2UgaWYgKCBiYWNrZ3JvdW5kVmlkZW8gJiYgIWlzU3BlYWtlck5vdGVzKCkgKSB7XG5cdFx0XHRcdFx0dmFyIHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3ZpZGVvJyApO1xuXG5cdFx0XHRcdFx0aWYoIGJhY2tncm91bmRWaWRlb0xvb3AgKSB7XG5cdFx0XHRcdFx0XHR2aWRlby5zZXRBdHRyaWJ1dGUoICdsb29wJywgJycgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiggYmFja2dyb3VuZFZpZGVvTXV0ZWQgKSB7XG5cdFx0XHRcdFx0XHR2aWRlby5tdXRlZCA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gU3VwcG9ydCBjb21tYSBzZXBhcmF0ZWQgbGlzdHMgb2YgdmlkZW8gc291cmNlc1xuXHRcdFx0XHRcdGJhY2tncm91bmRWaWRlby5zcGxpdCggJywnICkuZm9yRWFjaCggZnVuY3Rpb24oIHNvdXJjZSApIHtcblx0XHRcdFx0XHRcdHZpZGVvLmlubmVySFRNTCArPSAnPHNvdXJjZSBzcmM9XCInKyBzb3VyY2UgKydcIj4nO1xuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdGJhY2tncm91bmQuYXBwZW5kQ2hpbGQoIHZpZGVvICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gSWZyYW1lc1xuXHRcdFx0XHRlbHNlIGlmKCBiYWNrZ3JvdW5kSWZyYW1lICkge1xuXHRcdFx0XHRcdHZhciBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaWZyYW1lJyApO1xuXHRcdFx0XHRcdFx0aWZyYW1lLnNldEF0dHJpYnV0ZSggJ3NyYycsIGJhY2tncm91bmRJZnJhbWUgKTtcblx0XHRcdFx0XHRcdGlmcmFtZS5zdHlsZS53aWR0aCAgPSAnMTAwJSc7XG5cdFx0XHRcdFx0XHRpZnJhbWUuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuXHRcdFx0XHRcdFx0aWZyYW1lLnN0eWxlLm1heEhlaWdodCA9ICcxMDAlJztcblx0XHRcdFx0XHRcdGlmcmFtZS5zdHlsZS5tYXhXaWR0aCA9ICcxMDAlJztcblxuXHRcdFx0XHRcdGJhY2tncm91bmQuYXBwZW5kQ2hpbGQoIGlmcmFtZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2FsbGVkIHdoZW4gdGhlIGdpdmVuIHNsaWRlIGlzIG1vdmVkIG91dHNpZGUgb2YgdGhlXG5cdCAqIGNvbmZpZ3VyZWQgdmlldyBkaXN0YW5jZS5cblx0ICovXG5cdGZ1bmN0aW9uIGhpZGVTbGlkZSggc2xpZGUgKSB7XG5cblx0XHQvLyBIaWRlIHRoZSBzbGlkZSBlbGVtZW50XG5cdFx0c2xpZGUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdC8vIEhpZGUgdGhlIGNvcnJlc3BvbmRpbmcgYmFja2dyb3VuZCBlbGVtZW50XG5cdFx0dmFyIGluZGljZXMgPSBnZXRJbmRpY2VzKCBzbGlkZSApO1xuXHRcdHZhciBiYWNrZ3JvdW5kID0gZ2V0U2xpZGVCYWNrZ3JvdW5kKCBpbmRpY2VzLmgsIGluZGljZXMudiApO1xuXHRcdGlmKCBiYWNrZ3JvdW5kICkge1xuXHRcdFx0YmFja2dyb3VuZC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIERldGVybWluZSB3aGF0IGF2YWlsYWJsZSByb3V0ZXMgdGhlcmUgYXJlIGZvciBuYXZpZ2F0aW9uLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IGNvbnRhaW5pbmcgZm91ciBib29sZWFuczogbGVmdC9yaWdodC91cC9kb3duXG5cdCAqL1xuXHRmdW5jdGlvbiBhdmFpbGFibGVSb3V0ZXMoKSB7XG5cblx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlcyA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICksXG5cdFx0XHR2ZXJ0aWNhbFNsaWRlcyA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFZFUlRJQ0FMX1NMSURFU19TRUxFQ1RPUiApO1xuXG5cdFx0dmFyIHJvdXRlcyA9IHtcblx0XHRcdGxlZnQ6IGluZGV4aCA+IDAgfHwgY29uZmlnLmxvb3AsXG5cdFx0XHRyaWdodDogaW5kZXhoIDwgaG9yaXpvbnRhbFNsaWRlcy5sZW5ndGggLSAxIHx8IGNvbmZpZy5sb29wLFxuXHRcdFx0dXA6IGluZGV4diA+IDAsXG5cdFx0XHRkb3duOiBpbmRleHYgPCB2ZXJ0aWNhbFNsaWRlcy5sZW5ndGggLSAxXG5cdFx0fTtcblxuXHRcdC8vIHJldmVyc2UgaG9yaXpvbnRhbCBjb250cm9scyBmb3IgcnRsXG5cdFx0aWYoIGNvbmZpZy5ydGwgKSB7XG5cdFx0XHR2YXIgbGVmdCA9IHJvdXRlcy5sZWZ0O1xuXHRcdFx0cm91dGVzLmxlZnQgPSByb3V0ZXMucmlnaHQ7XG5cdFx0XHRyb3V0ZXMucmlnaHQgPSBsZWZ0O1xuXHRcdH1cblxuXHRcdHJldHVybiByb3V0ZXM7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIG9iamVjdCBkZXNjcmliaW5nIHRoZSBhdmFpbGFibGUgZnJhZ21lbnRcblx0ICogZGlyZWN0aW9ucy5cblx0ICpcblx0ICogQHJldHVybiB7T2JqZWN0fSB0d28gYm9vbGVhbiBwcm9wZXJ0aWVzOiBwcmV2L25leHRcblx0ICovXG5cdGZ1bmN0aW9uIGF2YWlsYWJsZUZyYWdtZW50cygpIHtcblxuXHRcdGlmKCBjdXJyZW50U2xpZGUgJiYgY29uZmlnLmZyYWdtZW50cyApIHtcblx0XHRcdHZhciBmcmFnbWVudHMgPSBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKTtcblx0XHRcdHZhciBoaWRkZW5GcmFnbWVudHMgPSBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudDpub3QoLnZpc2libGUpJyApO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRwcmV2OiBmcmFnbWVudHMubGVuZ3RoIC0gaGlkZGVuRnJhZ21lbnRzLmxlbmd0aCA+IDAsXG5cdFx0XHRcdG5leHQ6ICEhaGlkZGVuRnJhZ21lbnRzLmxlbmd0aFxuXHRcdFx0fTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXR1cm4geyBwcmV2OiBmYWxzZSwgbmV4dDogZmFsc2UgfTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBFbmZvcmNlcyBvcmlnaW4tc3BlY2lmaWMgZm9ybWF0IHJ1bGVzIGZvciBlbWJlZGRlZCBtZWRpYS5cblx0ICovXG5cdGZ1bmN0aW9uIGZvcm1hdEVtYmVkZGVkQ29udGVudCgpIHtcblxuXHRcdHZhciBfYXBwZW5kUGFyYW1Ub0lmcmFtZVNvdXJjZSA9IGZ1bmN0aW9uKCBzb3VyY2VBdHRyaWJ1dGUsIHNvdXJjZVVSTCwgcGFyYW0gKSB7XG5cdFx0XHR0b0FycmF5KCBkb20uc2xpZGVzLnF1ZXJ5U2VsZWN0b3JBbGwoICdpZnJhbWVbJysgc291cmNlQXR0cmlidXRlICsnKj1cIicrIHNvdXJjZVVSTCArJ1wiXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0dmFyIHNyYyA9IGVsLmdldEF0dHJpYnV0ZSggc291cmNlQXR0cmlidXRlICk7XG5cdFx0XHRcdGlmKCBzcmMgJiYgc3JjLmluZGV4T2YoIHBhcmFtICkgPT09IC0xICkge1xuXHRcdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSggc291cmNlQXR0cmlidXRlLCBzcmMgKyAoICEvXFw/Ly50ZXN0KCBzcmMgKSA/ICc/JyA6ICcmJyApICsgcGFyYW0gKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdC8vIFlvdVR1YmUgZnJhbWVzIG11c3QgaW5jbHVkZSBcIj9lbmFibGVqc2FwaT0xXCJcblx0XHRfYXBwZW5kUGFyYW1Ub0lmcmFtZVNvdXJjZSggJ3NyYycsICd5b3V0dWJlLmNvbS9lbWJlZC8nLCAnZW5hYmxlanNhcGk9MScgKTtcblx0XHRfYXBwZW5kUGFyYW1Ub0lmcmFtZVNvdXJjZSggJ2RhdGEtc3JjJywgJ3lvdXR1YmUuY29tL2VtYmVkLycsICdlbmFibGVqc2FwaT0xJyApO1xuXG5cdFx0Ly8gVmltZW8gZnJhbWVzIG11c3QgaW5jbHVkZSBcIj9hcGk9MVwiXG5cdFx0X2FwcGVuZFBhcmFtVG9JZnJhbWVTb3VyY2UoICdzcmMnLCAncGxheWVyLnZpbWVvLmNvbS8nLCAnYXBpPTEnICk7XG5cdFx0X2FwcGVuZFBhcmFtVG9JZnJhbWVTb3VyY2UoICdkYXRhLXNyYycsICdwbGF5ZXIudmltZW8uY29tLycsICdhcGk9MScgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFN0YXJ0IHBsYXliYWNrIG9mIGFueSBlbWJlZGRlZCBjb250ZW50IGluc2lkZSBvZlxuXHQgKiB0aGUgdGFyZ2V0ZWQgc2xpZGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBzdGFydEVtYmVkZGVkQ29udGVudCggc2xpZGUgKSB7XG5cblx0XHRpZiggc2xpZGUgJiYgIWlzU3BlYWtlck5vdGVzKCkgKSB7XG5cdFx0XHQvLyBSZXN0YXJ0IEdJRnNcblx0XHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdpbWdbc3JjJD1cIi5naWZcIl0nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdC8vIFNldHRpbmcgdGhlIHNhbWUgdW5jaGFuZ2VkIHNvdXJjZSBsaWtlIHRoaXMgd2FzIGNvbmZpcm1lZFxuXHRcdFx0XHQvLyB0byB3b3JrIGluIENocm9tZSwgRkYgJiBTYWZhcmlcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCAnc3JjJywgZWwuZ2V0QXR0cmlidXRlKCAnc3JjJyApICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEhUTUw1IG1lZGlhIGVsZW1lbnRzXG5cdFx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAndmlkZW8sIGF1ZGlvJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRpZiggZWwuaGFzQXR0cmlidXRlKCAnZGF0YS1hdXRvcGxheScgKSAmJiB0eXBlb2YgZWwucGxheSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRlbC5wbGF5KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gTm9ybWFsIGlmcmFtZXNcblx0XHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdpZnJhbWVbc3JjXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0c3RhcnRFbWJlZGRlZElmcmFtZSggeyB0YXJnZXQ6IGVsIH0gKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gTGF6eSBsb2FkaW5nIGlmcmFtZXNcblx0XHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdpZnJhbWVbZGF0YS1zcmNdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRpZiggZWwuZ2V0QXR0cmlidXRlKCAnc3JjJyApICE9PSBlbC5nZXRBdHRyaWJ1dGUoICdkYXRhLXNyYycgKSApIHtcblx0XHRcdFx0XHRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCAnbG9hZCcsIHN0YXJ0RW1iZWRkZWRJZnJhbWUgKTsgLy8gcmVtb3ZlIGZpcnN0IHRvIGF2b2lkIGR1cGVzXG5cdFx0XHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBzdGFydEVtYmVkZGVkSWZyYW1lICk7XG5cdFx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCAnc3JjJywgZWwuZ2V0QXR0cmlidXRlKCAnZGF0YS1zcmMnICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFwiU3RhcnRzXCIgdGhlIGNvbnRlbnQgb2YgYW4gZW1iZWRkZWQgaWZyYW1lIHVzaW5nIHRoZVxuXHQgKiBwb3N0bWVzc2FnZSBBUEkuXG5cdCAqL1xuXHRmdW5jdGlvbiBzdGFydEVtYmVkZGVkSWZyYW1lKCBldmVudCApIHtcblxuXHRcdHZhciBpZnJhbWUgPSBldmVudC50YXJnZXQ7XG5cblx0XHQvLyBZb3VUdWJlIHBvc3RNZXNzYWdlIEFQSVxuXHRcdGlmKCAveW91dHViZVxcLmNvbVxcL2VtYmVkXFwvLy50ZXN0KCBpZnJhbWUuZ2V0QXR0cmlidXRlKCAnc3JjJyApICkgJiYgaWZyYW1lLmhhc0F0dHJpYnV0ZSggJ2RhdGEtYXV0b3BsYXknICkgKSB7XG5cdFx0XHRpZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSggJ3tcImV2ZW50XCI6XCJjb21tYW5kXCIsXCJmdW5jXCI6XCJwbGF5VmlkZW9cIixcImFyZ3NcIjpcIlwifScsICcqJyApO1xuXHRcdH1cblx0XHQvLyBWaW1lbyBwb3N0TWVzc2FnZSBBUElcblx0XHRlbHNlIGlmKCAvcGxheWVyXFwudmltZW9cXC5jb21cXC8vLnRlc3QoIGlmcmFtZS5nZXRBdHRyaWJ1dGUoICdzcmMnICkgKSAmJiBpZnJhbWUuaGFzQXR0cmlidXRlKCAnZGF0YS1hdXRvcGxheScgKSApIHtcblx0XHRcdGlmcmFtZS5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCAne1wibWV0aG9kXCI6XCJwbGF5XCJ9JywgJyonICk7XG5cdFx0fVxuXHRcdC8vIEdlbmVyaWMgcG9zdE1lc3NhZ2UgQVBJXG5cdFx0ZWxzZSB7XG5cdFx0XHRpZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSggJ3NsaWRlOnN0YXJ0JywgJyonICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogU3RvcCBwbGF5YmFjayBvZiBhbnkgZW1iZWRkZWQgY29udGVudCBpbnNpZGUgb2Zcblx0ICogdGhlIHRhcmdldGVkIHNsaWRlLlxuXHQgKi9cblx0ZnVuY3Rpb24gc3RvcEVtYmVkZGVkQ29udGVudCggc2xpZGUgKSB7XG5cblx0XHRpZiggc2xpZGUgJiYgc2xpZGUucGFyZW50Tm9kZSApIHtcblx0XHRcdC8vIEhUTUw1IG1lZGlhIGVsZW1lbnRzXG5cdFx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAndmlkZW8sIGF1ZGlvJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRpZiggIWVsLmhhc0F0dHJpYnV0ZSggJ2RhdGEtaWdub3JlJyApICYmIHR5cGVvZiBlbC5wYXVzZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRlbC5wYXVzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEdlbmVyaWMgcG9zdE1lc3NhZ2UgQVBJIGZvciBub24tbGF6eSBsb2FkZWQgaWZyYW1lc1xuXHRcdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ2lmcmFtZScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0ZWwuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSggJ3NsaWRlOnN0b3AnLCAnKicgKTtcblx0XHRcdFx0ZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBzdGFydEVtYmVkZGVkSWZyYW1lICk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gWW91VHViZSBwb3N0TWVzc2FnZSBBUElcblx0XHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdpZnJhbWVbc3JjKj1cInlvdXR1YmUuY29tL2VtYmVkL1wiXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0aWYoICFlbC5oYXNBdHRyaWJ1dGUoICdkYXRhLWlnbm9yZScgKSAmJiB0eXBlb2YgZWwuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRlbC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCAne1wiZXZlbnRcIjpcImNvbW1hbmRcIixcImZ1bmNcIjpcInBhdXNlVmlkZW9cIixcImFyZ3NcIjpcIlwifScsICcqJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gVmltZW8gcG9zdE1lc3NhZ2UgQVBJXG5cdFx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnaWZyYW1lW3NyYyo9XCJwbGF5ZXIudmltZW8uY29tL1wiXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0aWYoICFlbC5oYXNBdHRyaWJ1dGUoICdkYXRhLWlnbm9yZScgKSAmJiB0eXBlb2YgZWwuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRlbC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCAne1wibWV0aG9kXCI6XCJwYXVzZVwifScsICcqJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gTGF6eSBsb2FkaW5nIGlmcmFtZXNcblx0XHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdpZnJhbWVbZGF0YS1zcmNdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHQvLyBPbmx5IHJlbW92aW5nIHRoZSBzcmMgZG9lc24ndCBhY3R1YWxseSB1bmxvYWQgdGhlIGZyYW1lXG5cdFx0XHRcdC8vIGluIGFsbCBicm93c2VycyAoRmlyZWZveCkgc28gd2Ugc2V0IGl0IHRvIGJsYW5rIGZpcnN0XG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSggJ3NyYycsICdhYm91dDpibGFuaycgKTtcblx0XHRcdFx0ZWwucmVtb3ZlQXR0cmlidXRlKCAnc3JjJyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwYXN0IHNsaWRlcy4gVGhpcyBjYW4gYmUgdXNlZCBhcyBhIGdsb2JhbFxuXHQgKiBmbGF0dGVuZWQgaW5kZXggZm9yIHNsaWRlcy5cblx0ICovXG5cdGZ1bmN0aW9uIGdldFNsaWRlUGFzdENvdW50KCkge1xuXG5cdFx0dmFyIGhvcml6b250YWxTbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICk7XG5cblx0XHQvLyBUaGUgbnVtYmVyIG9mIHBhc3Qgc2xpZGVzXG5cdFx0dmFyIHBhc3RDb3VudCA9IDA7XG5cblx0XHQvLyBTdGVwIHRocm91Z2ggYWxsIHNsaWRlcyBhbmQgY291bnQgdGhlIHBhc3Qgb25lc1xuXHRcdG1haW5Mb29wOiBmb3IoIHZhciBpID0gMDsgaSA8IGhvcml6b250YWxTbGlkZXMubGVuZ3RoOyBpKysgKSB7XG5cblx0XHRcdHZhciBob3Jpem9udGFsU2xpZGUgPSBob3Jpem9udGFsU2xpZGVzW2ldO1xuXHRcdFx0dmFyIHZlcnRpY2FsU2xpZGVzID0gdG9BcnJheSggaG9yaXpvbnRhbFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApICk7XG5cblx0XHRcdGZvciggdmFyIGogPSAwOyBqIDwgdmVydGljYWxTbGlkZXMubGVuZ3RoOyBqKysgKSB7XG5cblx0XHRcdFx0Ly8gU3RvcCBhcyBzb29uIGFzIHdlIGFycml2ZSBhdCB0aGUgcHJlc2VudFxuXHRcdFx0XHRpZiggdmVydGljYWxTbGlkZXNbal0uY2xhc3NMaXN0LmNvbnRhaW5zKCAncHJlc2VudCcgKSApIHtcblx0XHRcdFx0XHRicmVhayBtYWluTG9vcDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHBhc3RDb3VudCsrO1xuXG5cdFx0XHR9XG5cblx0XHRcdC8vIFN0b3AgYXMgc29vbiBhcyB3ZSBhcnJpdmUgYXQgdGhlIHByZXNlbnRcblx0XHRcdGlmKCBob3Jpem9udGFsU2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAncHJlc2VudCcgKSApIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdC8vIERvbid0IGNvdW50IHRoZSB3cmFwcGluZyBzZWN0aW9uIGZvciB2ZXJ0aWNhbCBzbGlkZXNcblx0XHRcdGlmKCBob3Jpem9udGFsU2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnc3RhY2snICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHRwYXN0Q291bnQrKztcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiBwYXN0Q291bnQ7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGEgdmFsdWUgcmFuZ2luZyBmcm9tIDAtMSB0aGF0IHJlcHJlc2VudHNcblx0ICogaG93IGZhciBpbnRvIHRoZSBwcmVzZW50YXRpb24gd2UgaGF2ZSBuYXZpZ2F0ZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRQcm9ncmVzcygpIHtcblxuXHRcdC8vIFRoZSBudW1iZXIgb2YgcGFzdCBhbmQgdG90YWwgc2xpZGVzXG5cdFx0dmFyIHRvdGFsQ291bnQgPSBnZXRUb3RhbFNsaWRlcygpO1xuXHRcdHZhciBwYXN0Q291bnQgPSBnZXRTbGlkZVBhc3RDb3VudCgpO1xuXG5cdFx0aWYoIGN1cnJlbnRTbGlkZSApIHtcblxuXHRcdFx0dmFyIGFsbEZyYWdtZW50cyA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApO1xuXG5cdFx0XHQvLyBJZiB0aGVyZSBhcmUgZnJhZ21lbnRzIGluIHRoZSBjdXJyZW50IHNsaWRlIHRob3NlIHNob3VsZCBiZVxuXHRcdFx0Ly8gYWNjb3VudGVkIGZvciBpbiB0aGUgcHJvZ3Jlc3MuXG5cdFx0XHRpZiggYWxsRnJhZ21lbnRzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdHZhciB2aXNpYmxlRnJhZ21lbnRzID0gY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQudmlzaWJsZScgKTtcblxuXHRcdFx0XHQvLyBUaGlzIHZhbHVlIHJlcHJlc2VudHMgaG93IGJpZyBhIHBvcnRpb24gb2YgdGhlIHNsaWRlIHByb2dyZXNzXG5cdFx0XHRcdC8vIHRoYXQgaXMgbWFkZSB1cCBieSBpdHMgZnJhZ21lbnRzICgwLTEpXG5cdFx0XHRcdHZhciBmcmFnbWVudFdlaWdodCA9IDAuOTtcblxuXHRcdFx0XHQvLyBBZGQgZnJhZ21lbnQgcHJvZ3Jlc3MgdG8gdGhlIHBhc3Qgc2xpZGUgY291bnRcblx0XHRcdFx0cGFzdENvdW50ICs9ICggdmlzaWJsZUZyYWdtZW50cy5sZW5ndGggLyBhbGxGcmFnbWVudHMubGVuZ3RoICkgKiBmcmFnbWVudFdlaWdodDtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiBwYXN0Q291bnQgLyAoIHRvdGFsQ291bnQgLSAxICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhpcyBwcmVzZW50YXRpb24gaXMgcnVubmluZyBpbnNpZGUgb2YgdGhlXG5cdCAqIHNwZWFrZXIgbm90ZXMgd2luZG93LlxuXHQgKi9cblx0ZnVuY3Rpb24gaXNTcGVha2VyTm90ZXMoKSB7XG5cblx0XHRyZXR1cm4gISF3aW5kb3cubG9jYXRpb24uc2VhcmNoLm1hdGNoKCAvcmVjZWl2ZXIvZ2kgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJlYWRzIHRoZSBjdXJyZW50IFVSTCAoaGFzaCkgYW5kIG5hdmlnYXRlcyBhY2NvcmRpbmdseS5cblx0ICovXG5cdGZ1bmN0aW9uIHJlYWRVUkwoKSB7XG5cblx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXG5cdFx0Ly8gQXR0ZW1wdCB0byBwYXJzZSB0aGUgaGFzaCBhcyBlaXRoZXIgYW4gaW5kZXggb3IgbmFtZVxuXHRcdHZhciBiaXRzID0gaGFzaC5zbGljZSggMiApLnNwbGl0KCAnLycgKSxcblx0XHRcdG5hbWUgPSBoYXNoLnJlcGxhY2UoIC8jfFxcLy9naSwgJycgKTtcblxuXHRcdC8vIElmIHRoZSBmaXJzdCBiaXQgaXMgaW52YWxpZCBhbmQgdGhlcmUgaXMgYSBuYW1lIHdlIGNhblxuXHRcdC8vIGFzc3VtZSB0aGF0IHRoaXMgaXMgYSBuYW1lZCBsaW5rXG5cdFx0aWYoIGlzTmFOKCBwYXJzZUludCggYml0c1swXSwgMTAgKSApICYmIG5hbWUubGVuZ3RoICkge1xuXHRcdFx0dmFyIGVsZW1lbnQ7XG5cblx0XHRcdC8vIEVuc3VyZSB0aGUgbmFtZWQgbGluayBpcyBhIHZhbGlkIEhUTUwgSUQgYXR0cmlidXRlXG5cdFx0XHRpZiggL15bYS16QS1aXVtcXHc6Li1dKiQvLnRlc3QoIG5hbWUgKSApIHtcblx0XHRcdFx0Ly8gRmluZCB0aGUgc2xpZGUgd2l0aCB0aGUgc3BlY2lmaWVkIElEXG5cdFx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbmFtZSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiggZWxlbWVudCApIHtcblx0XHRcdFx0Ly8gRmluZCB0aGUgcG9zaXRpb24gb2YgdGhlIG5hbWVkIHNsaWRlIGFuZCBuYXZpZ2F0ZSB0byBpdFxuXHRcdFx0XHR2YXIgaW5kaWNlcyA9IFJldmVhbC5nZXRJbmRpY2VzKCBlbGVtZW50ICk7XG5cdFx0XHRcdHNsaWRlKCBpbmRpY2VzLmgsIGluZGljZXMudiApO1xuXHRcdFx0fVxuXHRcdFx0Ly8gSWYgdGhlIHNsaWRlIGRvZXNuJ3QgZXhpc3QsIG5hdmlnYXRlIHRvIHRoZSBjdXJyZW50IHNsaWRlXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2xpZGUoIGluZGV4aCB8fCAwLCBpbmRleHYgfHwgMCApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIFJlYWQgdGhlIGluZGV4IGNvbXBvbmVudHMgb2YgdGhlIGhhc2hcblx0XHRcdHZhciBoID0gcGFyc2VJbnQoIGJpdHNbMF0sIDEwICkgfHwgMCxcblx0XHRcdFx0diA9IHBhcnNlSW50KCBiaXRzWzFdLCAxMCApIHx8IDA7XG5cblx0XHRcdGlmKCBoICE9PSBpbmRleGggfHwgdiAhPT0gaW5kZXh2ICkge1xuXHRcdFx0XHRzbGlkZSggaCwgdiApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIHBhZ2UgVVJMIChoYXNoKSB0byByZWZsZWN0IHRoZSBjdXJyZW50XG5cdCAqIHN0YXRlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge051bWJlcn0gZGVsYXkgVGhlIHRpbWUgaW4gbXMgdG8gd2FpdCBiZWZvcmVcblx0ICogd3JpdGluZyB0aGUgaGFzaFxuXHQgKi9cblx0ZnVuY3Rpb24gd3JpdGVVUkwoIGRlbGF5ICkge1xuXG5cdFx0aWYoIGNvbmZpZy5oaXN0b3J5ICkge1xuXG5cdFx0XHQvLyBNYWtlIHN1cmUgdGhlcmUncyBuZXZlciBtb3JlIHRoYW4gb25lIHRpbWVvdXQgcnVubmluZ1xuXHRcdFx0Y2xlYXJUaW1lb3V0KCB3cml0ZVVSTFRpbWVvdXQgKTtcblxuXHRcdFx0Ly8gSWYgYSBkZWxheSBpcyBzcGVjaWZpZWQsIHRpbWVvdXQgdGhpcyBjYWxsXG5cdFx0XHRpZiggdHlwZW9mIGRlbGF5ID09PSAnbnVtYmVyJyApIHtcblx0XHRcdFx0d3JpdGVVUkxUaW1lb3V0ID0gc2V0VGltZW91dCggd3JpdGVVUkwsIGRlbGF5ICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCBjdXJyZW50U2xpZGUgKSB7XG5cdFx0XHRcdHZhciB1cmwgPSAnLyc7XG5cblx0XHRcdFx0Ly8gQXR0ZW1wdCB0byBjcmVhdGUgYSBuYW1lZCBsaW5rIGJhc2VkIG9uIHRoZSBzbGlkZSdzIElEXG5cdFx0XHRcdHZhciBpZCA9IGN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoICdpZCcgKTtcblx0XHRcdFx0aWYoIGlkICkge1xuXHRcdFx0XHRcdGlkID0gaWQucmVwbGFjZSggL1teYS16QS1aMC05XFwtXFxfXFw6XFwuXS9nLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgdGhlIGN1cnJlbnQgc2xpZGUgaGFzIGFuIElELCB1c2UgdGhhdCBhcyBhIG5hbWVkIGxpbmtcblx0XHRcdFx0aWYoIHR5cGVvZiBpZCA9PT0gJ3N0cmluZycgJiYgaWQubGVuZ3RoICkge1xuXHRcdFx0XHRcdHVybCA9ICcvJyArIGlkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIE90aGVyd2lzZSB1c2UgdGhlIC9oL3YgaW5kZXhcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aWYoIGluZGV4aCA+IDAgfHwgaW5kZXh2ID4gMCApIHVybCArPSBpbmRleGg7XG5cdFx0XHRcdFx0aWYoIGluZGV4diA+IDAgKSB1cmwgKz0gJy8nICsgaW5kZXh2O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSB1cmw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBoL3YgbG9jYXRpb24gb2YgdGhlIGN1cnJlbnQsIG9yIHNwZWNpZmllZCxcblx0ICogc2xpZGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNsaWRlIElmIHNwZWNpZmllZCwgdGhlIHJldHVybmVkXG5cdCAqIGluZGV4IHdpbGwgYmUgZm9yIHRoaXMgc2xpZGUgcmF0aGVyIHRoYW4gdGhlIGN1cnJlbnRseVxuXHQgKiBhY3RpdmUgb25lXG5cdCAqXG5cdCAqIEByZXR1cm4ge09iamVjdH0geyBoOiA8aW50PiwgdjogPGludD4sIGY6IDxpbnQ+IH1cblx0ICovXG5cdGZ1bmN0aW9uIGdldEluZGljZXMoIHNsaWRlICkge1xuXG5cdFx0Ly8gQnkgZGVmYXVsdCwgcmV0dXJuIHRoZSBjdXJyZW50IGluZGljZXNcblx0XHR2YXIgaCA9IGluZGV4aCxcblx0XHRcdHYgPSBpbmRleHYsXG5cdFx0XHRmO1xuXG5cdFx0Ly8gSWYgYSBzbGlkZSBpcyBzcGVjaWZpZWQsIHJldHVybiB0aGUgaW5kaWNlcyBvZiB0aGF0IHNsaWRlXG5cdFx0aWYoIHNsaWRlICkge1xuXHRcdFx0dmFyIGlzVmVydGljYWwgPSBpc1ZlcnRpY2FsU2xpZGUoIHNsaWRlICk7XG5cdFx0XHR2YXIgc2xpZGVoID0gaXNWZXJ0aWNhbCA/IHNsaWRlLnBhcmVudE5vZGUgOiBzbGlkZTtcblxuXHRcdFx0Ly8gU2VsZWN0IGFsbCBob3Jpem9udGFsIHNsaWRlc1xuXHRcdFx0dmFyIGhvcml6b250YWxTbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICk7XG5cblx0XHRcdC8vIE5vdyB0aGF0IHdlIGtub3cgd2hpY2ggdGhlIGhvcml6b250YWwgc2xpZGUgaXMsIGdldCBpdHMgaW5kZXhcblx0XHRcdGggPSBNYXRoLm1heCggaG9yaXpvbnRhbFNsaWRlcy5pbmRleE9mKCBzbGlkZWggKSwgMCApO1xuXG5cdFx0XHQvLyBBc3N1bWUgd2UncmUgbm90IHZlcnRpY2FsXG5cdFx0XHR2ID0gdW5kZWZpbmVkO1xuXG5cdFx0XHQvLyBJZiB0aGlzIGlzIGEgdmVydGljYWwgc2xpZGUsIGdyYWIgdGhlIHZlcnRpY2FsIGluZGV4XG5cdFx0XHRpZiggaXNWZXJ0aWNhbCApIHtcblx0XHRcdFx0diA9IE1hdGgubWF4KCB0b0FycmF5KCBzbGlkZS5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApICkuaW5kZXhPZiggc2xpZGUgKSwgMCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKCAhc2xpZGUgJiYgY3VycmVudFNsaWRlICkge1xuXHRcdFx0dmFyIGhhc0ZyYWdtZW50cyA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApLmxlbmd0aCA+IDA7XG5cdFx0XHRpZiggaGFzRnJhZ21lbnRzICkge1xuXHRcdFx0XHR2YXIgY3VycmVudEZyYWdtZW50ID0gY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3IoICcuY3VycmVudC1mcmFnbWVudCcgKTtcblx0XHRcdFx0aWYoIGN1cnJlbnRGcmFnbWVudCAmJiBjdXJyZW50RnJhZ21lbnQuaGFzQXR0cmlidXRlKCAnZGF0YS1mcmFnbWVudC1pbmRleCcgKSApIHtcblx0XHRcdFx0XHRmID0gcGFyc2VJbnQoIGN1cnJlbnRGcmFnbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLWZyYWdtZW50LWluZGV4JyApLCAxMCApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGYgPSBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudC52aXNpYmxlJyApLmxlbmd0aCAtIDE7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4geyBoOiBoLCB2OiB2LCBmOiBmIH07XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIHRvdGFsIG51bWJlciBvZiBzbGlkZXMgaW4gdGhpcyBwcmVzZW50YXRpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRUb3RhbFNsaWRlcygpIHtcblxuXHRcdHJldHVybiBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKyAnOm5vdCguc3RhY2spJyApLmxlbmd0aDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHNsaWRlIGVsZW1lbnQgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBpbmRleC5cblx0ICovXG5cdGZ1bmN0aW9uIGdldFNsaWRlKCB4LCB5ICkge1xuXG5cdFx0dmFyIGhvcml6b250YWxTbGlkZSA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SIClbIHggXTtcblx0XHR2YXIgdmVydGljYWxTbGlkZXMgPSBob3Jpem9udGFsU2xpZGUgJiYgaG9yaXpvbnRhbFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApO1xuXG5cdFx0aWYoIHZlcnRpY2FsU2xpZGVzICYmIHZlcnRpY2FsU2xpZGVzLmxlbmd0aCAmJiB0eXBlb2YgeSA9PT0gJ251bWJlcicgKSB7XG5cdFx0XHRyZXR1cm4gdmVydGljYWxTbGlkZXMgPyB2ZXJ0aWNhbFNsaWRlc1sgeSBdIDogdW5kZWZpbmVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBob3Jpem9udGFsU2xpZGU7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBiYWNrZ3JvdW5kIGVsZW1lbnQgZm9yIHRoZSBnaXZlbiBzbGlkZS5cblx0ICogQWxsIHNsaWRlcywgZXZlbiB0aGUgb25lcyB3aXRoIG5vIGJhY2tncm91bmQgcHJvcGVydGllc1xuXHQgKiBkZWZpbmVkLCBoYXZlIGEgYmFja2dyb3VuZCBlbGVtZW50IHNvIGFzIGxvbmcgYXMgdGhlXG5cdCAqIGluZGV4IGlzIHZhbGlkIGFuIGVsZW1lbnQgd2lsbCBiZSByZXR1cm5lZC5cblx0ICovXG5cdGZ1bmN0aW9uIGdldFNsaWRlQmFja2dyb3VuZCggeCwgeSApIHtcblxuXHRcdC8vIFdoZW4gcHJpbnRpbmcgdG8gUERGIHRoZSBzbGlkZSBiYWNrZ3JvdW5kcyBhcmUgbmVzdGVkXG5cdFx0Ly8gaW5zaWRlIG9mIHRoZSBzbGlkZXNcblx0XHRpZiggaXNQcmludGluZ1BERigpICkge1xuXHRcdFx0dmFyIHNsaWRlID0gZ2V0U2xpZGUoIHgsIHkgKTtcblx0XHRcdGlmKCBzbGlkZSApIHtcblx0XHRcdFx0dmFyIGJhY2tncm91bmQgPSBzbGlkZS5xdWVyeVNlbGVjdG9yKCAnLnNsaWRlLWJhY2tncm91bmQnICk7XG5cdFx0XHRcdGlmKCBiYWNrZ3JvdW5kICYmIGJhY2tncm91bmQucGFyZW50Tm9kZSA9PT0gc2xpZGUgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGJhY2tncm91bmQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHR2YXIgaG9yaXpvbnRhbEJhY2tncm91bmQgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCAnLmJhY2tncm91bmRzPi5zbGlkZS1iYWNrZ3JvdW5kJyApWyB4IF07XG5cdFx0dmFyIHZlcnRpY2FsQmFja2dyb3VuZHMgPSBob3Jpem9udGFsQmFja2dyb3VuZCAmJiBob3Jpem9udGFsQmFja2dyb3VuZC5xdWVyeVNlbGVjdG9yQWxsKCAnLnNsaWRlLWJhY2tncm91bmQnICk7XG5cblx0XHRpZiggdmVydGljYWxCYWNrZ3JvdW5kcyAmJiB2ZXJ0aWNhbEJhY2tncm91bmRzLmxlbmd0aCAmJiB0eXBlb2YgeSA9PT0gJ251bWJlcicgKSB7XG5cdFx0XHRyZXR1cm4gdmVydGljYWxCYWNrZ3JvdW5kcyA/IHZlcnRpY2FsQmFja2dyb3VuZHNbIHkgXSA6IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gaG9yaXpvbnRhbEJhY2tncm91bmQ7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIHNwZWFrZXIgbm90ZXMgZnJvbSBhIHNsaWRlLiBOb3RlcyBjYW4gYmVcblx0ICogZGVmaW5lZCBpbiB0d28gd2F5czpcblx0ICogMS4gQXMgYSBkYXRhLW5vdGVzIGF0dHJpYnV0ZSBvbiB0aGUgc2xpZGUgPHNlY3Rpb24+XG5cdCAqIDIuIEFzIGFuIDxhc2lkZSBjbGFzcz1cIm5vdGVzXCI+IGluc2lkZSBvZiB0aGUgc2xpZGVcblx0ICovXG5cdGZ1bmN0aW9uIGdldFNsaWRlTm90ZXMoIHNsaWRlICkge1xuXG5cdFx0Ly8gRGVmYXVsdCB0byB0aGUgY3VycmVudCBzbGlkZVxuXHRcdHNsaWRlID0gc2xpZGUgfHwgY3VycmVudFNsaWRlO1xuXG5cdFx0Ly8gTm90ZXMgY2FuIGJlIHNwZWNpZmllZCB2aWEgdGhlIGRhdGEtbm90ZXMgYXR0cmlidXRlLi4uXG5cdFx0aWYoIHNsaWRlLmhhc0F0dHJpYnV0ZSggJ2RhdGEtbm90ZXMnICkgKSB7XG5cdFx0XHRyZXR1cm4gc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1ub3RlcycgKTtcblx0XHR9XG5cblx0XHQvLyAuLi4gb3IgdXNpbmcgYW4gPGFzaWRlIGNsYXNzPVwibm90ZXNcIj4gZWxlbWVudFxuXHRcdHZhciBub3Rlc0VsZW1lbnQgPSBzbGlkZS5xdWVyeVNlbGVjdG9yKCAnYXNpZGUubm90ZXMnICk7XG5cdFx0aWYoIG5vdGVzRWxlbWVudCApIHtcblx0XHRcdHJldHVybiBub3Rlc0VsZW1lbnQuaW5uZXJIVE1MO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBwcmVzZW50YXRpb24gYXNcblx0ICogYW4gb2JqZWN0LiBUaGlzIHN0YXRlIGNhbiB0aGVuIGJlIHJlc3RvcmVkIGF0IGFueVxuXHQgKiB0aW1lLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0U3RhdGUoKSB7XG5cblx0XHR2YXIgaW5kaWNlcyA9IGdldEluZGljZXMoKTtcblxuXHRcdHJldHVybiB7XG5cdFx0XHRpbmRleGg6IGluZGljZXMuaCxcblx0XHRcdGluZGV4djogaW5kaWNlcy52LFxuXHRcdFx0aW5kZXhmOiBpbmRpY2VzLmYsXG5cdFx0XHRwYXVzZWQ6IGlzUGF1c2VkKCksXG5cdFx0XHRvdmVydmlldzogaXNPdmVydmlldygpXG5cdFx0fTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJlc3RvcmVzIHRoZSBwcmVzZW50YXRpb24gdG8gdGhlIGdpdmVuIHN0YXRlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gc3RhdGUgQXMgZ2VuZXJhdGVkIGJ5IGdldFN0YXRlKClcblx0ICovXG5cdGZ1bmN0aW9uIHNldFN0YXRlKCBzdGF0ZSApIHtcblxuXHRcdGlmKCB0eXBlb2Ygc3RhdGUgPT09ICdvYmplY3QnICkge1xuXHRcdFx0c2xpZGUoIGRlc2VyaWFsaXplKCBzdGF0ZS5pbmRleGggKSwgZGVzZXJpYWxpemUoIHN0YXRlLmluZGV4diApLCBkZXNlcmlhbGl6ZSggc3RhdGUuaW5kZXhmICkgKTtcblxuXHRcdFx0dmFyIHBhdXNlZEZsYWcgPSBkZXNlcmlhbGl6ZSggc3RhdGUucGF1c2VkICksXG5cdFx0XHRcdG92ZXJ2aWV3RmxhZyA9IGRlc2VyaWFsaXplKCBzdGF0ZS5vdmVydmlldyApO1xuXG5cdFx0XHRpZiggdHlwZW9mIHBhdXNlZEZsYWcgPT09ICdib29sZWFuJyAmJiBwYXVzZWRGbGFnICE9PSBpc1BhdXNlZCgpICkge1xuXHRcdFx0XHR0b2dnbGVQYXVzZSggcGF1c2VkRmxhZyApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiggdHlwZW9mIG92ZXJ2aWV3RmxhZyA9PT0gJ2Jvb2xlYW4nICYmIG92ZXJ2aWV3RmxhZyAhPT0gaXNPdmVydmlldygpICkge1xuXHRcdFx0XHR0b2dnbGVPdmVydmlldyggb3ZlcnZpZXdGbGFnICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJuIGEgc29ydGVkIGZyYWdtZW50cyBsaXN0LCBvcmRlcmVkIGJ5IGFuIGluY3JlYXNpbmdcblx0ICogXCJkYXRhLWZyYWdtZW50LWluZGV4XCIgYXR0cmlidXRlLlxuXHQgKlxuXHQgKiBGcmFnbWVudHMgd2lsbCBiZSByZXZlYWxlZCBpbiB0aGUgb3JkZXIgdGhhdCB0aGV5IGFyZSByZXR1cm5lZCBieVxuXHQgKiB0aGlzIGZ1bmN0aW9uLCBzbyB5b3UgY2FuIHVzZSB0aGUgaW5kZXggYXR0cmlidXRlcyB0byBjb250cm9sIHRoZVxuXHQgKiBvcmRlciBvZiBmcmFnbWVudCBhcHBlYXJhbmNlLlxuXHQgKlxuXHQgKiBUbyBtYWludGFpbiBhIHNlbnNpYmxlIGRlZmF1bHQgZnJhZ21lbnQgb3JkZXIsIGZyYWdtZW50cyBhcmUgcHJlc3VtZWRcblx0ICogdG8gYmUgcGFzc2VkIGluIGRvY3VtZW50IG9yZGVyLiBUaGlzIGZ1bmN0aW9uIGFkZHMgYSBcImZyYWdtZW50LWluZGV4XCJcblx0ICogYXR0cmlidXRlIHRvIGVhY2ggbm9kZSBpZiBzdWNoIGFuIGF0dHJpYnV0ZSBpcyBub3QgYWxyZWFkeSBwcmVzZW50LFxuXHQgKiBhbmQgc2V0cyB0aGF0IGF0dHJpYnV0ZSB0byBhbiBpbnRlZ2VyIHZhbHVlIHdoaWNoIGlzIHRoZSBwb3NpdGlvbiBvZlxuXHQgKiB0aGUgZnJhZ21lbnQgd2l0aGluIHRoZSBmcmFnbWVudHMgbGlzdC5cblx0ICovXG5cdGZ1bmN0aW9uIHNvcnRGcmFnbWVudHMoIGZyYWdtZW50cyApIHtcblxuXHRcdGZyYWdtZW50cyA9IHRvQXJyYXkoIGZyYWdtZW50cyApO1xuXG5cdFx0dmFyIG9yZGVyZWQgPSBbXSxcblx0XHRcdHVub3JkZXJlZCA9IFtdLFxuXHRcdFx0c29ydGVkID0gW107XG5cblx0XHQvLyBHcm91cCBvcmRlcmVkIGFuZCB1bm9yZGVyZWQgZWxlbWVudHNcblx0XHRmcmFnbWVudHMuZm9yRWFjaCggZnVuY3Rpb24oIGZyYWdtZW50LCBpICkge1xuXHRcdFx0aWYoIGZyYWdtZW50Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnICkgKSB7XG5cdFx0XHRcdHZhciBpbmRleCA9IHBhcnNlSW50KCBmcmFnbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLWZyYWdtZW50LWluZGV4JyApLCAxMCApO1xuXG5cdFx0XHRcdGlmKCAhb3JkZXJlZFtpbmRleF0gKSB7XG5cdFx0XHRcdFx0b3JkZXJlZFtpbmRleF0gPSBbXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG9yZGVyZWRbaW5kZXhdLnB1c2goIGZyYWdtZW50ICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dW5vcmRlcmVkLnB1c2goIFsgZnJhZ21lbnQgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEFwcGVuZCBmcmFnbWVudHMgd2l0aG91dCBleHBsaWNpdCBpbmRpY2VzIGluIHRoZWlyXG5cdFx0Ly8gRE9NIG9yZGVyXG5cdFx0b3JkZXJlZCA9IG9yZGVyZWQuY29uY2F0KCB1bm9yZGVyZWQgKTtcblxuXHRcdC8vIE1hbnVhbGx5IGNvdW50IHRoZSBpbmRleCB1cCBwZXIgZ3JvdXAgdG8gZW5zdXJlIHRoZXJlXG5cdFx0Ly8gYXJlIG5vIGdhcHNcblx0XHR2YXIgaW5kZXggPSAwO1xuXG5cdFx0Ly8gUHVzaCBhbGwgZnJhZ21lbnRzIGluIHRoZWlyIHNvcnRlZCBvcmRlciB0byBhbiBhcnJheSxcblx0XHQvLyB0aGlzIGZsYXR0ZW5zIHRoZSBncm91cHNcblx0XHRvcmRlcmVkLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cCApIHtcblx0XHRcdGdyb3VwLmZvckVhY2goIGZ1bmN0aW9uKCBmcmFnbWVudCApIHtcblx0XHRcdFx0c29ydGVkLnB1c2goIGZyYWdtZW50ICk7XG5cdFx0XHRcdGZyYWdtZW50LnNldEF0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnLCBpbmRleCApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRpbmRleCArKztcblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gc29ydGVkO1xuXG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGUgdG8gdGhlIHNwZWNpZmllZCBzbGlkZSBmcmFnbWVudC5cblx0ICpcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgZnJhZ21lbnQgdGhhdFxuXHQgKiBzaG91bGQgYmUgc2hvd24sIC0xIG1lYW5zIGFsbCBhcmUgaW52aXNpYmxlXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgSW50ZWdlciBvZmZzZXQgdG8gYXBwbHkgdG8gdGhlXG5cdCAqIGZyYWdtZW50IGluZGV4XG5cdCAqXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgYSBjaGFuZ2Ugd2FzIG1hZGUgaW4gYW55XG5cdCAqIGZyYWdtZW50cyB2aXNpYmlsaXR5IGFzIHBhcnQgb2YgdGhpcyBjYWxsXG5cdCAqL1xuXHRmdW5jdGlvbiBuYXZpZ2F0ZUZyYWdtZW50KCBpbmRleCwgb2Zmc2V0ICkge1xuXG5cdFx0aWYoIGN1cnJlbnRTbGlkZSAmJiBjb25maWcuZnJhZ21lbnRzICkge1xuXG5cdFx0XHR2YXIgZnJhZ21lbnRzID0gc29ydEZyYWdtZW50cyggY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQnICkgKTtcblx0XHRcdGlmKCBmcmFnbWVudHMubGVuZ3RoICkge1xuXG5cdFx0XHRcdC8vIElmIG5vIGluZGV4IGlzIHNwZWNpZmllZCwgZmluZCB0aGUgY3VycmVudFxuXHRcdFx0XHRpZiggdHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJyApIHtcblx0XHRcdFx0XHR2YXIgbGFzdFZpc2libGVGcmFnbWVudCA9IHNvcnRGcmFnbWVudHMoIGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50LnZpc2libGUnICkgKS5wb3AoKTtcblxuXHRcdFx0XHRcdGlmKCBsYXN0VmlzaWJsZUZyYWdtZW50ICkge1xuXHRcdFx0XHRcdFx0aW5kZXggPSBwYXJzZUludCggbGFzdFZpc2libGVGcmFnbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLWZyYWdtZW50LWluZGV4JyApIHx8IDAsIDEwICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0aW5kZXggPSAtMTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJZiBhbiBvZmZzZXQgaXMgc3BlY2lmaWVkLCBhcHBseSBpdCB0byB0aGUgaW5kZXhcblx0XHRcdFx0aWYoIHR5cGVvZiBvZmZzZXQgPT09ICdudW1iZXInICkge1xuXHRcdFx0XHRcdGluZGV4ICs9IG9mZnNldDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBmcmFnbWVudHNTaG93biA9IFtdLFxuXHRcdFx0XHRcdGZyYWdtZW50c0hpZGRlbiA9IFtdO1xuXG5cdFx0XHRcdHRvQXJyYXkoIGZyYWdtZW50cyApLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50LCBpICkge1xuXG5cdFx0XHRcdFx0aWYoIGVsZW1lbnQuaGFzQXR0cmlidXRlKCAnZGF0YS1mcmFnbWVudC1pbmRleCcgKSApIHtcblx0XHRcdFx0XHRcdGkgPSBwYXJzZUludCggZWxlbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLWZyYWdtZW50LWluZGV4JyApLCAxMCApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFZpc2libGUgZnJhZ21lbnRzXG5cdFx0XHRcdFx0aWYoIGkgPD0gaW5kZXggKSB7XG5cdFx0XHRcdFx0XHRpZiggIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCAndmlzaWJsZScgKSApIGZyYWdtZW50c1Nob3duLnB1c2goIGVsZW1lbnQgKTtcblx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ3Zpc2libGUnICk7XG5cdFx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdjdXJyZW50LWZyYWdtZW50JyApO1xuXG5cdFx0XHRcdFx0XHQvLyBBbm5vdW5jZSB0aGUgZnJhZ21lbnRzIG9uZSBieSBvbmUgdG8gdGhlIFNjcmVlbiBSZWFkZXJcblx0XHRcdFx0XHRcdGRvbS5zdGF0dXNEaXYudGV4dENvbnRlbnQgPSBlbGVtZW50LnRleHRDb250ZW50O1xuXG5cdFx0XHRcdFx0XHRpZiggaSA9PT0gaW5kZXggKSB7XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ2N1cnJlbnQtZnJhZ21lbnQnICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIEhpZGRlbiBmcmFnbWVudHNcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGlmKCBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyggJ3Zpc2libGUnICkgKSBmcmFnbWVudHNIaWRkZW4ucHVzaCggZWxlbWVudCApO1xuXHRcdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAndmlzaWJsZScgKTtcblx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ2N1cnJlbnQtZnJhZ21lbnQnICk7XG5cdFx0XHRcdFx0fVxuXG5cblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdGlmKCBmcmFnbWVudHNIaWRkZW4ubGVuZ3RoICkge1xuXHRcdFx0XHRcdGRpc3BhdGNoRXZlbnQoICdmcmFnbWVudGhpZGRlbicsIHsgZnJhZ21lbnQ6IGZyYWdtZW50c0hpZGRlblswXSwgZnJhZ21lbnRzOiBmcmFnbWVudHNIaWRkZW4gfSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoIGZyYWdtZW50c1Nob3duLmxlbmd0aCApIHtcblx0XHRcdFx0XHRkaXNwYXRjaEV2ZW50KCAnZnJhZ21lbnRzaG93bicsIHsgZnJhZ21lbnQ6IGZyYWdtZW50c1Nob3duWzBdLCBmcmFnbWVudHM6IGZyYWdtZW50c1Nob3duIH0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHVwZGF0ZUNvbnRyb2xzKCk7XG5cdFx0XHRcdHVwZGF0ZVByb2dyZXNzKCk7XG5cblx0XHRcdFx0cmV0dXJuICEhKCBmcmFnbWVudHNTaG93bi5sZW5ndGggfHwgZnJhZ21lbnRzSGlkZGVuLmxlbmd0aCApO1xuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZSB0byB0aGUgbmV4dCBzbGlkZSBmcmFnbWVudC5cblx0ICpcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGVyZSB3YXMgYSBuZXh0IGZyYWdtZW50LFxuXHQgKiBmYWxzZSBvdGhlcndpc2Vcblx0ICovXG5cdGZ1bmN0aW9uIG5leHRGcmFnbWVudCgpIHtcblxuXHRcdHJldHVybiBuYXZpZ2F0ZUZyYWdtZW50KCBudWxsLCAxICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZSB0byB0aGUgcHJldmlvdXMgc2xpZGUgZnJhZ21lbnQuXG5cdCAqXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlcmUgd2FzIGEgcHJldmlvdXMgZnJhZ21lbnQsXG5cdCAqIGZhbHNlIG90aGVyd2lzZVxuXHQgKi9cblx0ZnVuY3Rpb24gcHJldmlvdXNGcmFnbWVudCgpIHtcblxuXHRcdHJldHVybiBuYXZpZ2F0ZUZyYWdtZW50KCBudWxsLCAtMSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogQ3VlcyBhIG5ldyBhdXRvbWF0ZWQgc2xpZGUgaWYgZW5hYmxlZCBpbiB0aGUgY29uZmlnLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3VlQXV0b1NsaWRlKCkge1xuXG5cdFx0Y2FuY2VsQXV0b1NsaWRlKCk7XG5cblx0XHRpZiggY3VycmVudFNsaWRlICkge1xuXG5cdFx0XHR2YXIgY3VycmVudEZyYWdtZW50ID0gY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3IoICcuY3VycmVudC1mcmFnbWVudCcgKTtcblxuXHRcdFx0dmFyIGZyYWdtZW50QXV0b1NsaWRlID0gY3VycmVudEZyYWdtZW50ID8gY3VycmVudEZyYWdtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtYXV0b3NsaWRlJyApIDogbnVsbDtcblx0XHRcdHZhciBwYXJlbnRBdXRvU2xpZGUgPSBjdXJyZW50U2xpZGUucGFyZW50Tm9kZSA/IGN1cnJlbnRTbGlkZS5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYXV0b3NsaWRlJyApIDogbnVsbDtcblx0XHRcdHZhciBzbGlkZUF1dG9TbGlkZSA9IGN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWF1dG9zbGlkZScgKTtcblxuXHRcdFx0Ly8gUGljayB2YWx1ZSBpbiB0aGUgZm9sbG93aW5nIHByaW9yaXR5IG9yZGVyOlxuXHRcdFx0Ly8gMS4gQ3VycmVudCBmcmFnbWVudCdzIGRhdGEtYXV0b3NsaWRlXG5cdFx0XHQvLyAyLiBDdXJyZW50IHNsaWRlJ3MgZGF0YS1hdXRvc2xpZGVcblx0XHRcdC8vIDMuIFBhcmVudCBzbGlkZSdzIGRhdGEtYXV0b3NsaWRlXG5cdFx0XHQvLyA0LiBHbG9iYWwgYXV0b1NsaWRlIHNldHRpbmdcblx0XHRcdGlmKCBmcmFnbWVudEF1dG9TbGlkZSApIHtcblx0XHRcdFx0YXV0b1NsaWRlID0gcGFyc2VJbnQoIGZyYWdtZW50QXV0b1NsaWRlLCAxMCApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggc2xpZGVBdXRvU2xpZGUgKSB7XG5cdFx0XHRcdGF1dG9TbGlkZSA9IHBhcnNlSW50KCBzbGlkZUF1dG9TbGlkZSwgMTAgKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoIHBhcmVudEF1dG9TbGlkZSApIHtcblx0XHRcdFx0YXV0b1NsaWRlID0gcGFyc2VJbnQoIHBhcmVudEF1dG9TbGlkZSwgMTAgKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRhdXRvU2xpZGUgPSBjb25maWcuYXV0b1NsaWRlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB0aGVyZSBhcmUgbWVkaWEgZWxlbWVudHMgd2l0aCBkYXRhLWF1dG9wbGF5LFxuXHRcdFx0Ly8gYXV0b21hdGljYWxseSBzZXQgdGhlIGF1dG9TbGlkZSBkdXJhdGlvbiB0byB0aGVcblx0XHRcdC8vIGxlbmd0aCBvZiB0aGF0IG1lZGlhLiBOb3QgYXBwbGljYWJsZSBpZiB0aGUgc2xpZGVcblx0XHRcdC8vIGlzIGRpdmlkZWQgdXAgaW50byBmcmFnbWVudHMuXG5cdFx0XHRpZiggY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQnICkubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHR0b0FycmF5KCBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3ZpZGVvLCBhdWRpbycgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0XHRpZiggZWwuaGFzQXR0cmlidXRlKCAnZGF0YS1hdXRvcGxheScgKSApIHtcblx0XHRcdFx0XHRcdGlmKCBhdXRvU2xpZGUgJiYgZWwuZHVyYXRpb24gKiAxMDAwID4gYXV0b1NsaWRlICkge1xuXHRcdFx0XHRcdFx0XHRhdXRvU2xpZGUgPSAoIGVsLmR1cmF0aW9uICogMTAwMCApICsgMTAwMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ3VlIHRoZSBuZXh0IGF1dG8tc2xpZGUgaWY6XG5cdFx0XHQvLyAtIFRoZXJlIGlzIGFuIGF1dG9TbGlkZSB2YWx1ZVxuXHRcdFx0Ly8gLSBBdXRvLXNsaWRpbmcgaXNuJ3QgcGF1c2VkIGJ5IHRoZSB1c2VyXG5cdFx0XHQvLyAtIFRoZSBwcmVzZW50YXRpb24gaXNuJ3QgcGF1c2VkXG5cdFx0XHQvLyAtIFRoZSBvdmVydmlldyBpc24ndCBhY3RpdmVcblx0XHRcdC8vIC0gVGhlIHByZXNlbnRhdGlvbiBpc24ndCBvdmVyXG5cdFx0XHRpZiggYXV0b1NsaWRlICYmICFhdXRvU2xpZGVQYXVzZWQgJiYgIWlzUGF1c2VkKCkgJiYgIWlzT3ZlcnZpZXcoKSAmJiAoICFSZXZlYWwuaXNMYXN0U2xpZGUoKSB8fCBhdmFpbGFibGVGcmFnbWVudHMoKS5uZXh0IHx8IGNvbmZpZy5sb29wID09PSB0cnVlICkgKSB7XG5cdFx0XHRcdGF1dG9TbGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHR0eXBlb2YgY29uZmlnLmF1dG9TbGlkZU1ldGhvZCA9PT0gJ2Z1bmN0aW9uJyA/IGNvbmZpZy5hdXRvU2xpZGVNZXRob2QoKSA6IG5hdmlnYXRlTmV4dCgpO1xuXHRcdFx0XHRcdGN1ZUF1dG9TbGlkZSgpO1xuXHRcdFx0XHR9LCBhdXRvU2xpZGUgKTtcblx0XHRcdFx0YXV0b1NsaWRlU3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIGF1dG9TbGlkZVBsYXllciApIHtcblx0XHRcdFx0YXV0b1NsaWRlUGxheWVyLnNldFBsYXlpbmcoIGF1dG9TbGlkZVRpbWVvdXQgIT09IC0xICk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDYW5jZWxzIGFueSBvbmdvaW5nIHJlcXVlc3QgdG8gYXV0by1zbGlkZS5cblx0ICovXG5cdGZ1bmN0aW9uIGNhbmNlbEF1dG9TbGlkZSgpIHtcblxuXHRcdGNsZWFyVGltZW91dCggYXV0b1NsaWRlVGltZW91dCApO1xuXHRcdGF1dG9TbGlkZVRpbWVvdXQgPSAtMTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gcGF1c2VBdXRvU2xpZGUoKSB7XG5cblx0XHRpZiggYXV0b1NsaWRlICYmICFhdXRvU2xpZGVQYXVzZWQgKSB7XG5cdFx0XHRhdXRvU2xpZGVQYXVzZWQgPSB0cnVlO1xuXHRcdFx0ZGlzcGF0Y2hFdmVudCggJ2F1dG9zbGlkZXBhdXNlZCcgKTtcblx0XHRcdGNsZWFyVGltZW91dCggYXV0b1NsaWRlVGltZW91dCApO1xuXG5cdFx0XHRpZiggYXV0b1NsaWRlUGxheWVyICkge1xuXHRcdFx0XHRhdXRvU2xpZGVQbGF5ZXIuc2V0UGxheWluZyggZmFsc2UgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHJlc3VtZUF1dG9TbGlkZSgpIHtcblxuXHRcdGlmKCBhdXRvU2xpZGUgJiYgYXV0b1NsaWRlUGF1c2VkICkge1xuXHRcdFx0YXV0b1NsaWRlUGF1c2VkID0gZmFsc2U7XG5cdFx0XHRkaXNwYXRjaEV2ZW50KCAnYXV0b3NsaWRlcmVzdW1lZCcgKTtcblx0XHRcdGN1ZUF1dG9TbGlkZSgpO1xuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gbmF2aWdhdGVMZWZ0KCkge1xuXG5cdFx0Ly8gUmV2ZXJzZSBmb3IgUlRMXG5cdFx0aWYoIGNvbmZpZy5ydGwgKSB7XG5cdFx0XHRpZiggKCBpc092ZXJ2aWV3KCkgfHwgbmV4dEZyYWdtZW50KCkgPT09IGZhbHNlICkgJiYgYXZhaWxhYmxlUm91dGVzKCkubGVmdCApIHtcblx0XHRcdFx0c2xpZGUoIGluZGV4aCArIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gTm9ybWFsIG5hdmlnYXRpb25cblx0XHRlbHNlIGlmKCAoIGlzT3ZlcnZpZXcoKSB8fCBwcmV2aW91c0ZyYWdtZW50KCkgPT09IGZhbHNlICkgJiYgYXZhaWxhYmxlUm91dGVzKCkubGVmdCApIHtcblx0XHRcdHNsaWRlKCBpbmRleGggLSAxICk7XG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBuYXZpZ2F0ZVJpZ2h0KCkge1xuXG5cdFx0Ly8gUmV2ZXJzZSBmb3IgUlRMXG5cdFx0aWYoIGNvbmZpZy5ydGwgKSB7XG5cdFx0XHRpZiggKCBpc092ZXJ2aWV3KCkgfHwgcHJldmlvdXNGcmFnbWVudCgpID09PSBmYWxzZSApICYmIGF2YWlsYWJsZVJvdXRlcygpLnJpZ2h0ICkge1xuXHRcdFx0XHRzbGlkZSggaW5kZXhoIC0gMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBOb3JtYWwgbmF2aWdhdGlvblxuXHRcdGVsc2UgaWYoICggaXNPdmVydmlldygpIHx8IG5leHRGcmFnbWVudCgpID09PSBmYWxzZSApICYmIGF2YWlsYWJsZVJvdXRlcygpLnJpZ2h0ICkge1xuXHRcdFx0c2xpZGUoIGluZGV4aCArIDEgKTtcblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG5hdmlnYXRlVXAoKSB7XG5cblx0XHQvLyBQcmlvcml0aXplIGhpZGluZyBmcmFnbWVudHNcblx0XHRpZiggKCBpc092ZXJ2aWV3KCkgfHwgcHJldmlvdXNGcmFnbWVudCgpID09PSBmYWxzZSApICYmIGF2YWlsYWJsZVJvdXRlcygpLnVwICkge1xuXHRcdFx0c2xpZGUoIGluZGV4aCwgaW5kZXh2IC0gMSApO1xuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gbmF2aWdhdGVEb3duKCkge1xuXG5cdFx0Ly8gUHJpb3JpdGl6ZSByZXZlYWxpbmcgZnJhZ21lbnRzXG5cdFx0aWYoICggaXNPdmVydmlldygpIHx8IG5leHRGcmFnbWVudCgpID09PSBmYWxzZSApICYmIGF2YWlsYWJsZVJvdXRlcygpLmRvd24gKSB7XG5cdFx0XHRzbGlkZSggaW5kZXhoLCBpbmRleHYgKyAxICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGVzIGJhY2t3YXJkcywgcHJpb3JpdGl6ZWQgaW4gdGhlIGZvbGxvd2luZyBvcmRlcjpcblx0ICogMSkgUHJldmlvdXMgZnJhZ21lbnRcblx0ICogMikgUHJldmlvdXMgdmVydGljYWwgc2xpZGVcblx0ICogMykgUHJldmlvdXMgaG9yaXpvbnRhbCBzbGlkZVxuXHQgKi9cblx0ZnVuY3Rpb24gbmF2aWdhdGVQcmV2KCkge1xuXG5cdFx0Ly8gUHJpb3JpdGl6ZSByZXZlYWxpbmcgZnJhZ21lbnRzXG5cdFx0aWYoIHByZXZpb3VzRnJhZ21lbnQoKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRpZiggYXZhaWxhYmxlUm91dGVzKCkudXAgKSB7XG5cdFx0XHRcdG5hdmlnYXRlVXAoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHQvLyBGZXRjaCB0aGUgcHJldmlvdXMgaG9yaXpvbnRhbCBzbGlkZSwgaWYgdGhlcmUgaXMgb25lXG5cdFx0XHRcdHZhciBwcmV2aW91c1NsaWRlO1xuXG5cdFx0XHRcdGlmKCBjb25maWcucnRsICkge1xuXHRcdFx0XHRcdHByZXZpb3VzU2xpZGUgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiArICcuZnV0dXJlJyApICkucG9wKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cHJldmlvdXNTbGlkZSA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICsgJy5wYXN0JyApICkucG9wKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiggcHJldmlvdXNTbGlkZSApIHtcblx0XHRcdFx0XHR2YXIgdiA9ICggcHJldmlvdXNTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKS5sZW5ndGggLSAxICkgfHwgdW5kZWZpbmVkO1xuXHRcdFx0XHRcdHZhciBoID0gaW5kZXhoIC0gMTtcblx0XHRcdFx0XHRzbGlkZSggaCwgdiApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogVGhlIHJldmVyc2Ugb2YgI25hdmlnYXRlUHJldigpLlxuXHQgKi9cblx0ZnVuY3Rpb24gbmF2aWdhdGVOZXh0KCkge1xuXG5cdFx0Ly8gUHJpb3JpdGl6ZSByZXZlYWxpbmcgZnJhZ21lbnRzXG5cdFx0aWYoIG5leHRGcmFnbWVudCgpID09PSBmYWxzZSApIHtcblx0XHRcdGlmKCBhdmFpbGFibGVSb3V0ZXMoKS5kb3duICkge1xuXHRcdFx0XHRuYXZpZ2F0ZURvd24oKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoIGNvbmZpZy5ydGwgKSB7XG5cdFx0XHRcdG5hdmlnYXRlTGVmdCgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdG5hdmlnYXRlUmlnaHQoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIHRhcmdldCBlbGVtZW50IHByZXZlbnRzIHRoZSB0cmlnZ2VyaW5nIG9mXG5cdCAqIHN3aXBlIG5hdmlnYXRpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1N3aXBlUHJldmVudGVkKCB0YXJnZXQgKSB7XG5cblx0XHR3aGlsZSggdGFyZ2V0ICYmIHR5cGVvZiB0YXJnZXQuaGFzQXR0cmlidXRlID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0aWYoIHRhcmdldC5oYXNBdHRyaWJ1dGUoICdkYXRhLXByZXZlbnQtc3dpcGUnICkgKSByZXR1cm4gdHJ1ZTtcblx0XHRcdHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblxuXHR9XG5cblxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEVWRU5UUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXG5cdC8qKlxuXHQgKiBDYWxsZWQgYnkgYWxsIGV2ZW50IGhhbmRsZXJzIHRoYXQgYXJlIGJhc2VkIG9uIHVzZXJcblx0ICogaW5wdXQuXG5cdCAqL1xuXHRmdW5jdGlvbiBvblVzZXJJbnB1dCggZXZlbnQgKSB7XG5cblx0XHRpZiggY29uZmlnLmF1dG9TbGlkZVN0b3BwYWJsZSApIHtcblx0XHRcdHBhdXNlQXV0b1NsaWRlKCk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlciBmb3IgdGhlIGRvY3VtZW50IGxldmVsICdrZXlwcmVzcycgZXZlbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBvbkRvY3VtZW50S2V5UHJlc3MoIGV2ZW50ICkge1xuXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIHByZXNzZWQga2V5IGlzIHF1ZXN0aW9uIG1hcmtcblx0XHRpZiggZXZlbnQuc2hpZnRLZXkgJiYgZXZlbnQuY2hhckNvZGUgPT09IDYzICkge1xuXHRcdFx0aWYoIGRvbS5vdmVybGF5ICkge1xuXHRcdFx0XHRjbG9zZU92ZXJsYXkoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzaG93SGVscCggdHJ1ZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHRoZSBkb2N1bWVudCBsZXZlbCAna2V5ZG93bicgZXZlbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBvbkRvY3VtZW50S2V5RG93biggZXZlbnQgKSB7XG5cblx0XHQvLyBJZiB0aGVyZSdzIGEgY29uZGl0aW9uIHNwZWNpZmllZCBhbmQgaXQgcmV0dXJucyBmYWxzZSxcblx0XHQvLyBpZ25vcmUgdGhpcyBldmVudFxuXHRcdGlmKCB0eXBlb2YgY29uZmlnLmtleWJvYXJkQ29uZGl0aW9uID09PSAnZnVuY3Rpb24nICYmIGNvbmZpZy5rZXlib2FyZENvbmRpdGlvbigpID09PSBmYWxzZSApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdC8vIFJlbWVtYmVyIGlmIGF1dG8tc2xpZGluZyB3YXMgcGF1c2VkIHNvIHdlIGNhbiB0b2dnbGUgaXRcblx0XHR2YXIgYXV0b1NsaWRlV2FzUGF1c2VkID0gYXV0b1NsaWRlUGF1c2VkO1xuXG5cdFx0b25Vc2VySW5wdXQoIGV2ZW50ICk7XG5cblx0XHQvLyBDaGVjayBpZiB0aGVyZSdzIGEgZm9jdXNlZCBlbGVtZW50IHRoYXQgY291bGQgYmUgdXNpbmdcblx0XHQvLyB0aGUga2V5Ym9hcmRcblx0XHR2YXIgYWN0aXZlRWxlbWVudElzQ0UgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY29udGVudEVkaXRhYmxlICE9PSAnaW5oZXJpdCc7XG5cdFx0dmFyIGFjdGl2ZUVsZW1lbnRJc0lucHV0ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LnRhZ05hbWUgJiYgL2lucHV0fHRleHRhcmVhL2kudGVzdCggZG9jdW1lbnQuYWN0aXZlRWxlbWVudC50YWdOYW1lICk7XG5cblx0XHQvLyBEaXNyZWdhcmQgdGhlIGV2ZW50IGlmIHRoZXJlJ3MgYSBmb2N1c2VkIGVsZW1lbnQgb3IgYVxuXHRcdC8vIGtleWJvYXJkIG1vZGlmaWVyIGtleSBpcyBwcmVzZW50XG5cdFx0aWYoIGFjdGl2ZUVsZW1lbnRJc0NFIHx8IGFjdGl2ZUVsZW1lbnRJc0lucHV0IHx8IChldmVudC5zaGlmdEtleSAmJiBldmVudC5rZXlDb2RlICE9PSAzMikgfHwgZXZlbnQuYWx0S2V5IHx8IGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSApIHJldHVybjtcblxuXHRcdC8vIFdoaWxlIHBhdXNlZCBvbmx5IGFsbG93IHJlc3VtZSBrZXlib2FyZCBldmVudHM7ICdiJywgJy4nJ1xuXHRcdHZhciByZXN1bWVLZXlDb2RlcyA9IFs2NiwxOTAsMTkxXTtcblx0XHR2YXIga2V5O1xuXG5cdFx0Ly8gQ3VzdG9tIGtleSBiaW5kaW5ncyBmb3IgdG9nZ2xlUGF1c2Ugc2hvdWxkIGJlIGFibGUgdG8gcmVzdW1lXG5cdFx0aWYoIHR5cGVvZiBjb25maWcua2V5Ym9hcmQgPT09ICdvYmplY3QnICkge1xuXHRcdFx0Zm9yKCBrZXkgaW4gY29uZmlnLmtleWJvYXJkICkge1xuXHRcdFx0XHRpZiggY29uZmlnLmtleWJvYXJkW2tleV0gPT09ICd0b2dnbGVQYXVzZScgKSB7XG5cdFx0XHRcdFx0cmVzdW1lS2V5Q29kZXMucHVzaCggcGFyc2VJbnQoIGtleSwgMTAgKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoIGlzUGF1c2VkKCkgJiYgcmVzdW1lS2V5Q29kZXMuaW5kZXhPZiggZXZlbnQua2V5Q29kZSApID09PSAtMSApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR2YXIgdHJpZ2dlcmVkID0gZmFsc2U7XG5cblx0XHQvLyAxLiBVc2VyIGRlZmluZWQga2V5IGJpbmRpbmdzXG5cdFx0aWYoIHR5cGVvZiBjb25maWcua2V5Ym9hcmQgPT09ICdvYmplY3QnICkge1xuXG5cdFx0XHRmb3IoIGtleSBpbiBjb25maWcua2V5Ym9hcmQgKSB7XG5cblx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhpcyBiaW5kaW5nIG1hdGNoZXMgdGhlIHByZXNzZWQga2V5XG5cdFx0XHRcdGlmKCBwYXJzZUludCgga2V5LCAxMCApID09PSBldmVudC5rZXlDb2RlICkge1xuXG5cdFx0XHRcdFx0dmFyIHZhbHVlID0gY29uZmlnLmtleWJvYXJkWyBrZXkgXTtcblxuXHRcdFx0XHRcdC8vIENhbGxiYWNrIGZ1bmN0aW9uXG5cdFx0XHRcdFx0aWYoIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRcdHZhbHVlLmFwcGx5KCBudWxsLCBbIGV2ZW50IF0gKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gU3RyaW5nIHNob3J0Y3V0cyB0byByZXZlYWwuanMgQVBJXG5cdFx0XHRcdFx0ZWxzZSBpZiggdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgUmV2ZWFsWyB2YWx1ZSBdID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdFx0UmV2ZWFsWyB2YWx1ZSBdLmNhbGwoKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR0cmlnZ2VyZWQgPSB0cnVlO1xuXG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gMi4gU3lzdGVtIGRlZmluZWQga2V5IGJpbmRpbmdzXG5cdFx0aWYoIHRyaWdnZXJlZCA9PT0gZmFsc2UgKSB7XG5cblx0XHRcdC8vIEFzc3VtZSB0cnVlIGFuZCB0cnkgdG8gcHJvdmUgZmFsc2Vcblx0XHRcdHRyaWdnZXJlZCA9IHRydWU7XG5cblx0XHRcdHN3aXRjaCggZXZlbnQua2V5Q29kZSApIHtcblx0XHRcdFx0Ly8gcCwgcGFnZSB1cFxuXHRcdFx0XHRjYXNlIDgwOiBjYXNlIDMzOiBuYXZpZ2F0ZVByZXYoKTsgYnJlYWs7XG5cdFx0XHRcdC8vIG4sIHBhZ2UgZG93blxuXHRcdFx0XHRjYXNlIDc4OiBjYXNlIDM0OiBuYXZpZ2F0ZU5leHQoKTsgYnJlYWs7XG5cdFx0XHRcdC8vIGgsIGxlZnRcblx0XHRcdFx0Y2FzZSA3MjogY2FzZSAzNzogbmF2aWdhdGVMZWZ0KCk7IGJyZWFrO1xuXHRcdFx0XHQvLyBsLCByaWdodFxuXHRcdFx0XHRjYXNlIDc2OiBjYXNlIDM5OiBuYXZpZ2F0ZVJpZ2h0KCk7IGJyZWFrO1xuXHRcdFx0XHQvLyBrLCB1cFxuXHRcdFx0XHRjYXNlIDc1OiBjYXNlIDM4OiBuYXZpZ2F0ZVVwKCk7IGJyZWFrO1xuXHRcdFx0XHQvLyBqLCBkb3duXG5cdFx0XHRcdGNhc2UgNzQ6IGNhc2UgNDA6IG5hdmlnYXRlRG93bigpOyBicmVhaztcblx0XHRcdFx0Ly8gaG9tZVxuXHRcdFx0XHRjYXNlIDM2OiBzbGlkZSggMCApOyBicmVhaztcblx0XHRcdFx0Ly8gZW5kXG5cdFx0XHRcdGNhc2UgMzU6IHNsaWRlKCBOdW1iZXIuTUFYX1ZBTFVFICk7IGJyZWFrO1xuXHRcdFx0XHQvLyBzcGFjZVxuXHRcdFx0XHRjYXNlIDMyOiBpc092ZXJ2aWV3KCkgPyBkZWFjdGl2YXRlT3ZlcnZpZXcoKSA6IGV2ZW50LnNoaWZ0S2V5ID8gbmF2aWdhdGVQcmV2KCkgOiBuYXZpZ2F0ZU5leHQoKTsgYnJlYWs7XG5cdFx0XHRcdC8vIHJldHVyblxuXHRcdFx0XHRjYXNlIDEzOiBpc092ZXJ2aWV3KCkgPyBkZWFjdGl2YXRlT3ZlcnZpZXcoKSA6IHRyaWdnZXJlZCA9IGZhbHNlOyBicmVhaztcblx0XHRcdFx0Ly8gdHdvLXNwb3QsIHNlbWljb2xvbiwgYiwgcGVyaW9kLCBMb2dpdGVjaCBwcmVzZW50ZXIgdG9vbHMgXCJibGFjayBzY3JlZW5cIiBidXR0b25cblx0XHRcdFx0Y2FzZSA1ODogY2FzZSA1OTogY2FzZSA2NjogY2FzZSAxOTA6IGNhc2UgMTkxOiB0b2dnbGVQYXVzZSgpOyBicmVhaztcblx0XHRcdFx0Ly8gZlxuXHRcdFx0XHRjYXNlIDcwOiBlbnRlckZ1bGxzY3JlZW4oKTsgYnJlYWs7XG5cdFx0XHRcdC8vIGFcblx0XHRcdFx0Y2FzZSA2NTogaWYgKCBjb25maWcuYXV0b1NsaWRlU3RvcHBhYmxlICkgdG9nZ2xlQXV0b1NsaWRlKCBhdXRvU2xpZGVXYXNQYXVzZWQgKTsgYnJlYWs7XG5cdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0dHJpZ2dlcmVkID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHQvLyBJZiB0aGUgaW5wdXQgcmVzdWx0ZWQgaW4gYSB0cmlnZ2VyZWQgYWN0aW9uIHdlIHNob3VsZCBwcmV2ZW50XG5cdFx0Ly8gdGhlIGJyb3dzZXJzIGRlZmF1bHQgYmVoYXZpb3Jcblx0XHRpZiggdHJpZ2dlcmVkICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQgJiYgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cdFx0Ly8gRVNDIG9yIE8ga2V5XG5cdFx0ZWxzZSBpZiAoICggZXZlbnQua2V5Q29kZSA9PT0gMjcgfHwgZXZlbnQua2V5Q29kZSA9PT0gNzkgKSAmJiBmZWF0dXJlcy50cmFuc2Zvcm1zM2QgKSB7XG5cdFx0XHRpZiggZG9tLm92ZXJsYXkgKSB7XG5cdFx0XHRcdGNsb3NlT3ZlcmxheSgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRvZ2dsZU92ZXJ2aWV3KCk7XG5cdFx0XHR9XG5cblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0ICYmIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXG5cdFx0Ly8gSWYgYXV0by1zbGlkaW5nIGlzIGVuYWJsZWQgd2UgbmVlZCB0byBjdWUgdXBcblx0XHQvLyBhbm90aGVyIHRpbWVvdXRcblx0XHRjdWVBdXRvU2xpZGUoKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHRoZSAndG91Y2hzdGFydCcgZXZlbnQsIGVuYWJsZXMgc3VwcG9ydCBmb3Jcblx0ICogc3dpcGUgYW5kIHBpbmNoIGdlc3R1cmVzLlxuXHQgKi9cblx0ZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KCBldmVudCApIHtcblxuXHRcdGlmKCBpc1N3aXBlUHJldmVudGVkKCBldmVudC50YXJnZXQgKSApIHJldHVybiB0cnVlO1xuXG5cdFx0dG91Y2guc3RhcnRYID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuXHRcdHRvdWNoLnN0YXJ0WSA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WTtcblx0XHR0b3VjaC5zdGFydENvdW50ID0gZXZlbnQudG91Y2hlcy5sZW5ndGg7XG5cblx0XHQvLyBJZiB0aGVyZSdzIHR3byB0b3VjaGVzIHdlIG5lZWQgdG8gbWVtb3JpemUgdGhlIGRpc3RhbmNlXG5cdFx0Ly8gYmV0d2VlbiB0aG9zZSB0d28gcG9pbnRzIHRvIGRldGVjdCBwaW5jaGluZ1xuXHRcdGlmKCBldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiBjb25maWcub3ZlcnZpZXcgKSB7XG5cdFx0XHR0b3VjaC5zdGFydFNwYW4gPSBkaXN0YW5jZUJldHdlZW4oIHtcblx0XHRcdFx0eDogZXZlbnQudG91Y2hlc1sxXS5jbGllbnRYLFxuXHRcdFx0XHR5OiBldmVudC50b3VjaGVzWzFdLmNsaWVudFlcblx0XHRcdH0sIHtcblx0XHRcdFx0eDogdG91Y2guc3RhcnRYLFxuXHRcdFx0XHR5OiB0b3VjaC5zdGFydFlcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVyIGZvciB0aGUgJ3RvdWNobW92ZScgZXZlbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBvblRvdWNoTW92ZSggZXZlbnQgKSB7XG5cblx0XHRpZiggaXNTd2lwZVByZXZlbnRlZCggZXZlbnQudGFyZ2V0ICkgKSByZXR1cm4gdHJ1ZTtcblxuXHRcdC8vIEVhY2ggdG91Y2ggc2hvdWxkIG9ubHkgdHJpZ2dlciBvbmUgYWN0aW9uXG5cdFx0aWYoICF0b3VjaC5jYXB0dXJlZCApIHtcblx0XHRcdG9uVXNlcklucHV0KCBldmVudCApO1xuXG5cdFx0XHR2YXIgY3VycmVudFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG5cdFx0XHR2YXIgY3VycmVudFkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFk7XG5cblx0XHRcdC8vIElmIHRoZSB0b3VjaCBzdGFydGVkIHdpdGggdHdvIHBvaW50cyBhbmQgc3RpbGwgaGFzXG5cdFx0XHQvLyB0d28gYWN0aXZlIHRvdWNoZXM7IHRlc3QgZm9yIHRoZSBwaW5jaCBnZXN0dXJlXG5cdFx0XHRpZiggZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgdG91Y2guc3RhcnRDb3VudCA9PT0gMiAmJiBjb25maWcub3ZlcnZpZXcgKSB7XG5cblx0XHRcdFx0Ly8gVGhlIGN1cnJlbnQgZGlzdGFuY2UgaW4gcGl4ZWxzIGJldHdlZW4gdGhlIHR3byB0b3VjaCBwb2ludHNcblx0XHRcdFx0dmFyIGN1cnJlbnRTcGFuID0gZGlzdGFuY2VCZXR3ZWVuKCB7XG5cdFx0XHRcdFx0eDogZXZlbnQudG91Y2hlc1sxXS5jbGllbnRYLFxuXHRcdFx0XHRcdHk6IGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0eDogdG91Y2guc3RhcnRYLFxuXHRcdFx0XHRcdHk6IHRvdWNoLnN0YXJ0WVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0Ly8gSWYgdGhlIHNwYW4gaXMgbGFyZ2VyIHRoYW4gdGhlIGRlc2lyZSBhbW91bnQgd2UndmUgZ290XG5cdFx0XHRcdC8vIG91cnNlbHZlcyBhIHBpbmNoXG5cdFx0XHRcdGlmKCBNYXRoLmFicyggdG91Y2guc3RhcnRTcGFuIC0gY3VycmVudFNwYW4gKSA+IHRvdWNoLnRocmVzaG9sZCApIHtcblx0XHRcdFx0XHR0b3VjaC5jYXB0dXJlZCA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiggY3VycmVudFNwYW4gPCB0b3VjaC5zdGFydFNwYW4gKSB7XG5cdFx0XHRcdFx0XHRhY3RpdmF0ZU92ZXJ2aWV3KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGVhY3RpdmF0ZU92ZXJ2aWV3KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0fVxuXHRcdFx0Ly8gVGhlcmUgd2FzIG9ubHkgb25lIHRvdWNoIHBvaW50LCBsb29rIGZvciBhIHN3aXBlXG5cdFx0XHRlbHNlIGlmKCBldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSAmJiB0b3VjaC5zdGFydENvdW50ICE9PSAyICkge1xuXG5cdFx0XHRcdHZhciBkZWx0YVggPSBjdXJyZW50WCAtIHRvdWNoLnN0YXJ0WCxcblx0XHRcdFx0XHRkZWx0YVkgPSBjdXJyZW50WSAtIHRvdWNoLnN0YXJ0WTtcblxuXHRcdFx0XHRpZiggZGVsdGFYID4gdG91Y2gudGhyZXNob2xkICYmIE1hdGguYWJzKCBkZWx0YVggKSA+IE1hdGguYWJzKCBkZWx0YVkgKSApIHtcblx0XHRcdFx0XHR0b3VjaC5jYXB0dXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0bmF2aWdhdGVMZWZ0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiggZGVsdGFYIDwgLXRvdWNoLnRocmVzaG9sZCAmJiBNYXRoLmFicyggZGVsdGFYICkgPiBNYXRoLmFicyggZGVsdGFZICkgKSB7XG5cdFx0XHRcdFx0dG91Y2guY2FwdHVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdG5hdmlnYXRlUmlnaHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCBkZWx0YVkgPiB0b3VjaC50aHJlc2hvbGQgKSB7XG5cdFx0XHRcdFx0dG91Y2guY2FwdHVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdG5hdmlnYXRlVXAoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCBkZWx0YVkgPCAtdG91Y2gudGhyZXNob2xkICkge1xuXHRcdFx0XHRcdHRvdWNoLmNhcHR1cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRuYXZpZ2F0ZURvd24oKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIHdlJ3JlIGVtYmVkZGVkLCBvbmx5IGJsb2NrIHRvdWNoIGV2ZW50cyBpZiB0aGV5IGhhdmVcblx0XHRcdFx0Ly8gdHJpZ2dlcmVkIGFuIGFjdGlvblxuXHRcdFx0XHRpZiggY29uZmlnLmVtYmVkZGVkICkge1xuXHRcdFx0XHRcdGlmKCB0b3VjaC5jYXB0dXJlZCB8fCBpc1ZlcnRpY2FsU2xpZGUoIGN1cnJlbnRTbGlkZSApICkge1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gTm90IGVtYmVkZGVkPyBCbG9jayB0aGVtIGFsbCB0byBhdm9pZCBuZWVkbGVzcyB0b3NzaW5nXG5cdFx0XHRcdC8vIGFyb3VuZCBvZiB0aGUgdmlld3BvcnQgaW4gaU9TXG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBUaGVyZSdzIGEgYnVnIHdpdGggc3dpcGluZyBvbiBzb21lIEFuZHJvaWQgZGV2aWNlcyB1bmxlc3Ncblx0XHQvLyB0aGUgZGVmYXVsdCBhY3Rpb24gaXMgYWx3YXlzIHByZXZlbnRlZFxuXHRcdGVsc2UgaWYoIFVBLm1hdGNoKCAvYW5kcm9pZC9naSApICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVyIGZvciB0aGUgJ3RvdWNoZW5kJyBldmVudC5cblx0ICovXG5cdGZ1bmN0aW9uIG9uVG91Y2hFbmQoIGV2ZW50ICkge1xuXG5cdFx0dG91Y2guY2FwdHVyZWQgPSBmYWxzZTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnQgcG9pbnRlciBkb3duIHRvIHRvdWNoIHN0YXJ0LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25Qb2ludGVyRG93biggZXZlbnQgKSB7XG5cblx0XHRpZiggZXZlbnQucG9pbnRlclR5cGUgPT09IGV2ZW50Lk1TUE9JTlRFUl9UWVBFX1RPVUNIIHx8IGV2ZW50LnBvaW50ZXJUeXBlID09PSBcInRvdWNoXCIgKSB7XG5cdFx0XHRldmVudC50b3VjaGVzID0gW3sgY2xpZW50WDogZXZlbnQuY2xpZW50WCwgY2xpZW50WTogZXZlbnQuY2xpZW50WSB9XTtcblx0XHRcdG9uVG91Y2hTdGFydCggZXZlbnQgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0IHBvaW50ZXIgbW92ZSB0byB0b3VjaCBtb3ZlLlxuXHQgKi9cblx0ZnVuY3Rpb24gb25Qb2ludGVyTW92ZSggZXZlbnQgKSB7XG5cblx0XHRpZiggZXZlbnQucG9pbnRlclR5cGUgPT09IGV2ZW50Lk1TUE9JTlRFUl9UWVBFX1RPVUNIIHx8IGV2ZW50LnBvaW50ZXJUeXBlID09PSBcInRvdWNoXCIgKSAge1xuXHRcdFx0ZXZlbnQudG91Y2hlcyA9IFt7IGNsaWVudFg6IGV2ZW50LmNsaWVudFgsIGNsaWVudFk6IGV2ZW50LmNsaWVudFkgfV07XG5cdFx0XHRvblRvdWNoTW92ZSggZXZlbnQgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0IHBvaW50ZXIgdXAgdG8gdG91Y2ggZW5kLlxuXHQgKi9cblx0ZnVuY3Rpb24gb25Qb2ludGVyVXAoIGV2ZW50ICkge1xuXG5cdFx0aWYoIGV2ZW50LnBvaW50ZXJUeXBlID09PSBldmVudC5NU1BPSU5URVJfVFlQRV9UT1VDSCB8fCBldmVudC5wb2ludGVyVHlwZSA9PT0gXCJ0b3VjaFwiICkgIHtcblx0XHRcdGV2ZW50LnRvdWNoZXMgPSBbeyBjbGllbnRYOiBldmVudC5jbGllbnRYLCBjbGllbnRZOiBldmVudC5jbGllbnRZIH1dO1xuXHRcdFx0b25Ub3VjaEVuZCggZXZlbnQgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIG1vdXNlIHdoZWVsIHNjcm9sbGluZywgdGhyb3R0bGVkIHRvIGF2b2lkIHNraXBwaW5nXG5cdCAqIG11bHRpcGxlIHNsaWRlcy5cblx0ICovXG5cdGZ1bmN0aW9uIG9uRG9jdW1lbnRNb3VzZVNjcm9sbCggZXZlbnQgKSB7XG5cblx0XHRpZiggRGF0ZS5ub3coKSAtIGxhc3RNb3VzZVdoZWVsU3RlcCA+IDYwMCApIHtcblxuXHRcdFx0bGFzdE1vdXNlV2hlZWxTdGVwID0gRGF0ZS5ub3coKTtcblxuXHRcdFx0dmFyIGRlbHRhID0gZXZlbnQuZGV0YWlsIHx8IC1ldmVudC53aGVlbERlbHRhO1xuXHRcdFx0aWYoIGRlbHRhID4gMCApIHtcblx0XHRcdFx0bmF2aWdhdGVOZXh0KCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bmF2aWdhdGVQcmV2KCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDbGlja2luZyBvbiB0aGUgcHJvZ3Jlc3MgYmFyIHJlc3VsdHMgaW4gYSBuYXZpZ2F0aW9uIHRvIHRoZVxuXHQgKiBjbG9zZXN0IGFwcHJveGltYXRlIGhvcml6b250YWwgc2xpZGUgdXNpbmcgdGhpcyBlcXVhdGlvbjpcblx0ICpcblx0ICogKCBjbGlja1ggLyBwcmVzZW50YXRpb25XaWR0aCApICogbnVtYmVyT2ZTbGlkZXNcblx0ICovXG5cdGZ1bmN0aW9uIG9uUHJvZ3Jlc3NDbGlja2VkKCBldmVudCApIHtcblxuXHRcdG9uVXNlcklucHV0KCBldmVudCApO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdHZhciBzbGlkZXNUb3RhbCA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICkgKS5sZW5ndGg7XG5cdFx0dmFyIHNsaWRlSW5kZXggPSBNYXRoLmZsb29yKCAoIGV2ZW50LmNsaWVudFggLyBkb20ud3JhcHBlci5vZmZzZXRXaWR0aCApICogc2xpZGVzVG90YWwgKTtcblxuXHRcdGlmKCBjb25maWcucnRsICkge1xuXHRcdFx0c2xpZGVJbmRleCA9IHNsaWRlc1RvdGFsIC0gc2xpZGVJbmRleDtcblx0XHR9XG5cblx0XHRzbGlkZSggc2xpZGVJbmRleCApO1xuXG5cdH1cblxuXHQvKipcblx0ICogRXZlbnQgaGFuZGxlciBmb3IgbmF2aWdhdGlvbiBjb250cm9sIGJ1dHRvbnMuXG5cdCAqL1xuXHRmdW5jdGlvbiBvbk5hdmlnYXRlTGVmdENsaWNrZWQoIGV2ZW50ICkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBvblVzZXJJbnB1dCgpOyBuYXZpZ2F0ZUxlZnQoKTsgfVxuXHRmdW5jdGlvbiBvbk5hdmlnYXRlUmlnaHRDbGlja2VkKCBldmVudCApIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgb25Vc2VySW5wdXQoKTsgbmF2aWdhdGVSaWdodCgpOyB9XG5cdGZ1bmN0aW9uIG9uTmF2aWdhdGVVcENsaWNrZWQoIGV2ZW50ICkgeyBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyBvblVzZXJJbnB1dCgpOyBuYXZpZ2F0ZVVwKCk7IH1cblx0ZnVuY3Rpb24gb25OYXZpZ2F0ZURvd25DbGlja2VkKCBldmVudCApIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgb25Vc2VySW5wdXQoKTsgbmF2aWdhdGVEb3duKCk7IH1cblx0ZnVuY3Rpb24gb25OYXZpZ2F0ZVByZXZDbGlja2VkKCBldmVudCApIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgb25Vc2VySW5wdXQoKTsgbmF2aWdhdGVQcmV2KCk7IH1cblx0ZnVuY3Rpb24gb25OYXZpZ2F0ZU5leHRDbGlja2VkKCBldmVudCApIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgb25Vc2VySW5wdXQoKTsgbmF2aWdhdGVOZXh0KCk7IH1cblxuXHQvKipcblx0ICogSGFuZGxlciBmb3IgdGhlIHdpbmRvdyBsZXZlbCAnaGFzaGNoYW5nZScgZXZlbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBvbldpbmRvd0hhc2hDaGFuZ2UoIGV2ZW50ICkge1xuXG5cdFx0cmVhZFVSTCgpO1xuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlciBmb3IgdGhlIHdpbmRvdyBsZXZlbCAncmVzaXplJyBldmVudC5cblx0ICovXG5cdGZ1bmN0aW9uIG9uV2luZG93UmVzaXplKCBldmVudCApIHtcblxuXHRcdGxheW91dCgpO1xuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlIGZvciB0aGUgd2luZG93IGxldmVsICd2aXNpYmlsaXR5Y2hhbmdlJyBldmVudC5cblx0ICovXG5cdGZ1bmN0aW9uIG9uUGFnZVZpc2liaWxpdHlDaGFuZ2UoIGV2ZW50ICkge1xuXG5cdFx0dmFyIGlzSGlkZGVuID0gIGRvY3VtZW50LndlYmtpdEhpZGRlbiB8fFxuXHRcdFx0XHRcdFx0ZG9jdW1lbnQubXNIaWRkZW4gfHxcblx0XHRcdFx0XHRcdGRvY3VtZW50LmhpZGRlbjtcblxuXHRcdC8vIElmLCBhZnRlciBjbGlja2luZyBhIGxpbmsgb3Igc2ltaWxhciBhbmQgd2UncmUgY29taW5nIGJhY2ssXG5cdFx0Ly8gZm9jdXMgdGhlIGRvY3VtZW50LmJvZHkgdG8gZW5zdXJlIHdlIGNhbiB1c2Uga2V5Ym9hcmQgc2hvcnRjdXRzXG5cdFx0aWYoIGlzSGlkZGVuID09PSBmYWxzZSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICE9PSBkb2N1bWVudC5ib2R5ICkge1xuXHRcdFx0Ly8gTm90IGFsbCBlbGVtZW50cyBzdXBwb3J0IC5ibHVyKCkgLSBTVkdzIGFtb25nIHRoZW0uXG5cdFx0XHRpZiggdHlwZW9mIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1ciA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0ZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG5cdFx0XHR9XG5cdFx0XHRkb2N1bWVudC5ib2R5LmZvY3VzKCk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSW52b2tlZCB3aGVuIGEgc2xpZGUgaXMgYW5kIHdlJ3JlIGluIHRoZSBvdmVydmlldy5cblx0ICovXG5cdGZ1bmN0aW9uIG9uT3ZlcnZpZXdTbGlkZUNsaWNrZWQoIGV2ZW50ICkge1xuXG5cdFx0Ly8gVE9ETyBUaGVyZSdzIGEgYnVnIGhlcmUgd2hlcmUgdGhlIGV2ZW50IGxpc3RlbmVycyBhcmUgbm90XG5cdFx0Ly8gcmVtb3ZlZCBhZnRlciBkZWFjdGl2YXRpbmcgdGhlIG92ZXJ2aWV3LlxuXHRcdGlmKCBldmVudHNBcmVCb3VuZCAmJiBpc092ZXJ2aWV3KCkgKSB7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHR2YXIgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcblxuXHRcdFx0d2hpbGUoIGVsZW1lbnQgJiYgIWVsZW1lbnQubm9kZU5hbWUubWF0Y2goIC9zZWN0aW9uL2dpICkgKSB7XG5cdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCBlbGVtZW50ICYmICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyggJ2Rpc2FibGVkJyApICkge1xuXG5cdFx0XHRcdGRlYWN0aXZhdGVPdmVydmlldygpO1xuXG5cdFx0XHRcdGlmKCBlbGVtZW50Lm5vZGVOYW1lLm1hdGNoKCAvc2VjdGlvbi9naSApICkge1xuXHRcdFx0XHRcdHZhciBoID0gcGFyc2VJbnQoIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC1oJyApLCAxMCApLFxuXHRcdFx0XHRcdFx0diA9IHBhcnNlSW50KCBlbGVtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtdicgKSwgMTAgKTtcblxuXHRcdFx0XHRcdHNsaWRlKCBoLCB2ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgY2xpY2tzIG9uIGxpbmtzIHRoYXQgYXJlIHNldCB0byBwcmV2aWV3IGluIHRoZVxuXHQgKiBpZnJhbWUgb3ZlcmxheS5cblx0ICovXG5cdGZ1bmN0aW9uIG9uUHJldmlld0xpbmtDbGlja2VkKCBldmVudCApIHtcblxuXHRcdGlmKCBldmVudC5jdXJyZW50VGFyZ2V0ICYmIGV2ZW50LmN1cnJlbnRUYXJnZXQuaGFzQXR0cmlidXRlKCAnaHJlZicgKSApIHtcblx0XHRcdHZhciB1cmwgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSggJ2hyZWYnICk7XG5cdFx0XHRpZiggdXJsICkge1xuXHRcdFx0XHRzaG93UHJldmlldyggdXJsICk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBjbGljayBvbiB0aGUgYXV0by1zbGlkaW5nIGNvbnRyb2xzIGVsZW1lbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBvbkF1dG9TbGlkZVBsYXllckNsaWNrKCBldmVudCApIHtcblxuXHRcdC8vIFJlcGxheVxuXHRcdGlmKCBSZXZlYWwuaXNMYXN0U2xpZGUoKSAmJiBjb25maWcubG9vcCA9PT0gZmFsc2UgKSB7XG5cdFx0XHRzbGlkZSggMCwgMCApO1xuXHRcdFx0cmVzdW1lQXV0b1NsaWRlKCk7XG5cdFx0fVxuXHRcdC8vIFJlc3VtZVxuXHRcdGVsc2UgaWYoIGF1dG9TbGlkZVBhdXNlZCApIHtcblx0XHRcdHJlc3VtZUF1dG9TbGlkZSgpO1xuXHRcdH1cblx0XHQvLyBQYXVzZVxuXHRcdGVsc2Uge1xuXHRcdFx0cGF1c2VBdXRvU2xpZGUoKTtcblx0XHR9XG5cblx0fVxuXG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUExBWUJBQ0sgQ09NUE9ORU5UIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RvciBmb3IgdGhlIHBsYXliYWNrIGNvbXBvbmVudCwgd2hpY2ggZGlzcGxheXNcblx0ICogcGxheS9wYXVzZS9wcm9ncmVzcyBjb250cm9scy5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIFRoZSBjb21wb25lbnQgd2lsbCBhcHBlbmRcblx0ICogaXRzZWxmIHRvIHRoaXNcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gcHJvZ3Jlc3NDaGVjayBBIG1ldGhvZCB3aGljaCB3aWxsIGJlXG5cdCAqIGNhbGxlZCBmcmVxdWVudGx5IHRvIGdldCB0aGUgY3VycmVudCBwcm9ncmVzcyBvbiBhIHJhbmdlXG5cdCAqIG9mIDAtMVxuXHQgKi9cblx0ZnVuY3Rpb24gUGxheWJhY2soIGNvbnRhaW5lciwgcHJvZ3Jlc3NDaGVjayApIHtcblxuXHRcdC8vIENvc21ldGljc1xuXHRcdHRoaXMuZGlhbWV0ZXIgPSAxMDA7XG5cdFx0dGhpcy5kaWFtZXRlcjIgPSB0aGlzLmRpYW1ldGVyLzI7XG5cdFx0dGhpcy50aGlja25lc3MgPSA2O1xuXG5cdFx0Ly8gRmxhZ3MgaWYgd2UgYXJlIGN1cnJlbnRseSBwbGF5aW5nXG5cdFx0dGhpcy5wbGF5aW5nID0gZmFsc2U7XG5cblx0XHQvLyBDdXJyZW50IHByb2dyZXNzIG9uIGEgMC0xIHJhbmdlXG5cdFx0dGhpcy5wcm9ncmVzcyA9IDA7XG5cblx0XHQvLyBVc2VkIHRvIGxvb3AgdGhlIGFuaW1hdGlvbiBzbW9vdGhseVxuXHRcdHRoaXMucHJvZ3Jlc3NPZmZzZXQgPSAxO1xuXG5cdFx0dGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cdFx0dGhpcy5wcm9ncmVzc0NoZWNrID0gcHJvZ3Jlc3NDaGVjaztcblxuXHRcdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2NhbnZhcycgKTtcblx0XHR0aGlzLmNhbnZhcy5jbGFzc05hbWUgPSAncGxheWJhY2snO1xuXHRcdHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5kaWFtZXRlcjtcblx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmRpYW1ldGVyO1xuXHRcdHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy5kaWFtZXRlcjIgKyAncHgnO1xuXHRcdHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuZGlhbWV0ZXIyICsgJ3B4Jztcblx0XHR0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCAnMmQnICk7XG5cblx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCggdGhpcy5jYW52YXMgKTtcblxuXHRcdHRoaXMucmVuZGVyKCk7XG5cblx0fVxuXG5cdFBsYXliYWNrLnByb3RvdHlwZS5zZXRQbGF5aW5nID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdFx0dmFyIHdhc1BsYXlpbmcgPSB0aGlzLnBsYXlpbmc7XG5cblx0XHR0aGlzLnBsYXlpbmcgPSB2YWx1ZTtcblxuXHRcdC8vIFN0YXJ0IHJlcGFpbnRpbmcgaWYgd2Ugd2VyZW4ndCBhbHJlYWR5XG5cdFx0aWYoICF3YXNQbGF5aW5nICYmIHRoaXMucGxheWluZyApIHtcblx0XHRcdHRoaXMuYW5pbWF0ZSgpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0UGxheWJhY2sucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBwcm9ncmVzc0JlZm9yZSA9IHRoaXMucHJvZ3Jlc3M7XG5cblx0XHR0aGlzLnByb2dyZXNzID0gdGhpcy5wcm9ncmVzc0NoZWNrKCk7XG5cblx0XHQvLyBXaGVuIHdlIGxvb3AsIG9mZnNldCB0aGUgcHJvZ3Jlc3Mgc28gdGhhdCBpdCBlYXNlc1xuXHRcdC8vIHNtb290aGx5IHJhdGhlciB0aGFuIGltbWVkaWF0ZWx5IHJlc2V0dGluZ1xuXHRcdGlmKCBwcm9ncmVzc0JlZm9yZSA+IDAuOCAmJiB0aGlzLnByb2dyZXNzIDwgMC4yICkge1xuXHRcdFx0dGhpcy5wcm9ncmVzc09mZnNldCA9IHRoaXMucHJvZ3Jlc3M7XG5cdFx0fVxuXG5cdFx0dGhpcy5yZW5kZXIoKTtcblxuXHRcdGlmKCB0aGlzLnBsYXlpbmcgKSB7XG5cdFx0XHRmZWF0dXJlcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVNZXRob2QuY2FsbCggd2luZG93LCB0aGlzLmFuaW1hdGUuYmluZCggdGhpcyApICk7XG5cdFx0fVxuXG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgdGhlIGN1cnJlbnQgcHJvZ3Jlc3MgYW5kIHBsYXliYWNrIHN0YXRlLlxuXHQgKi9cblx0UGxheWJhY2sucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIHByb2dyZXNzID0gdGhpcy5wbGF5aW5nID8gdGhpcy5wcm9ncmVzcyA6IDAsXG5cdFx0XHRyYWRpdXMgPSAoIHRoaXMuZGlhbWV0ZXIyICkgLSB0aGlzLnRoaWNrbmVzcyxcblx0XHRcdHggPSB0aGlzLmRpYW1ldGVyMixcblx0XHRcdHkgPSB0aGlzLmRpYW1ldGVyMixcblx0XHRcdGljb25TaXplID0gMjg7XG5cblx0XHQvLyBFYXNlIHRvd2FyZHMgMVxuXHRcdHRoaXMucHJvZ3Jlc3NPZmZzZXQgKz0gKCAxIC0gdGhpcy5wcm9ncmVzc09mZnNldCApICogMC4xO1xuXG5cdFx0dmFyIGVuZEFuZ2xlID0gKCAtIE1hdGguUEkgLyAyICkgKyAoIHByb2dyZXNzICogKCBNYXRoLlBJICogMiApICk7XG5cdFx0dmFyIHN0YXJ0QW5nbGUgPSAoIC0gTWF0aC5QSSAvIDIgKSArICggdGhpcy5wcm9ncmVzc09mZnNldCAqICggTWF0aC5QSSAqIDIgKSApO1xuXG5cdFx0dGhpcy5jb250ZXh0LnNhdmUoKTtcblx0XHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KCAwLCAwLCB0aGlzLmRpYW1ldGVyLCB0aGlzLmRpYW1ldGVyICk7XG5cblx0XHQvLyBTb2xpZCBiYWNrZ3JvdW5kIGNvbG9yXG5cdFx0dGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdHRoaXMuY29udGV4dC5hcmMoIHgsIHksIHJhZGl1cyArIDQsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSApO1xuXHRcdHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSggMCwgMCwgMCwgMC40ICknO1xuXHRcdHRoaXMuY29udGV4dC5maWxsKCk7XG5cblx0XHQvLyBEcmF3IHByb2dyZXNzIHRyYWNrXG5cdFx0dGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdHRoaXMuY29udGV4dC5hcmMoIHgsIHksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlICk7XG5cdFx0dGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMudGhpY2tuZXNzO1xuXHRcdHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9ICcjNjY2Jztcblx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cblx0XHRpZiggdGhpcy5wbGF5aW5nICkge1xuXHRcdFx0Ly8gRHJhdyBwcm9ncmVzcyBvbiB0b3Agb2YgdHJhY2tcblx0XHRcdHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRcdHRoaXMuY29udGV4dC5hcmMoIHgsIHksIHJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGZhbHNlICk7XG5cdFx0XHR0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy50aGlja25lc3M7XG5cdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI2ZmZic7XG5cdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5jb250ZXh0LnRyYW5zbGF0ZSggeCAtICggaWNvblNpemUgLyAyICksIHkgLSAoIGljb25TaXplIC8gMiApICk7XG5cblx0XHQvLyBEcmF3IHBsYXkvcGF1c2UgaWNvbnNcblx0XHRpZiggdGhpcy5wbGF5aW5nICkge1xuXHRcdFx0dGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICcjZmZmJztcblx0XHRcdHRoaXMuY29udGV4dC5maWxsUmVjdCggMCwgMCwgaWNvblNpemUgLyAyIC0gNCwgaWNvblNpemUgKTtcblx0XHRcdHRoaXMuY29udGV4dC5maWxsUmVjdCggaWNvblNpemUgLyAyICsgNCwgMCwgaWNvblNpemUgLyAyIC0gNCwgaWNvblNpemUgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0XHR0aGlzLmNvbnRleHQudHJhbnNsYXRlKCA0LCAwICk7XG5cdFx0XHR0aGlzLmNvbnRleHQubW92ZVRvKCAwLCAwICk7XG5cdFx0XHR0aGlzLmNvbnRleHQubGluZVRvKCBpY29uU2l6ZSAtIDQsIGljb25TaXplIC8gMiApO1xuXHRcdFx0dGhpcy5jb250ZXh0LmxpbmVUbyggMCwgaWNvblNpemUgKTtcblx0XHRcdHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZic7XG5cdFx0XHR0aGlzLmNvbnRleHQuZmlsbCgpO1xuXHRcdH1cblxuXHRcdHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cblx0fTtcblxuXHRQbGF5YmFjay5wcm90b3R5cGUub24gPSBmdW5jdGlvbiggdHlwZSwgbGlzdGVuZXIgKSB7XG5cdFx0dGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIsIGZhbHNlICk7XG5cdH07XG5cblx0UGxheWJhY2sucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKCB0eXBlLCBsaXN0ZW5lciApIHtcblx0XHR0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UgKTtcblx0fTtcblxuXHRQbGF5YmFjay5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dGhpcy5wbGF5aW5nID0gZmFsc2U7XG5cblx0XHRpZiggdGhpcy5jYW52YXMucGFyZW50Tm9kZSApIHtcblx0XHRcdHRoaXMuY29udGFpbmVyLnJlbW92ZUNoaWxkKCB0aGlzLmNhbnZhcyApO1xuXHRcdH1cblxuXHR9O1xuXG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEFQSSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuXG5cdFJldmVhbCA9IHtcblx0XHRWRVJTSU9OOiBWRVJTSU9OLFxuXG5cdFx0aW5pdGlhbGl6ZTogaW5pdGlhbGl6ZSxcblx0XHRjb25maWd1cmU6IGNvbmZpZ3VyZSxcblx0XHRzeW5jOiBzeW5jLFxuXG5cdFx0Ly8gTmF2aWdhdGlvbiBtZXRob2RzXG5cdFx0c2xpZGU6IHNsaWRlLFxuXHRcdGxlZnQ6IG5hdmlnYXRlTGVmdCxcblx0XHRyaWdodDogbmF2aWdhdGVSaWdodCxcblx0XHR1cDogbmF2aWdhdGVVcCxcblx0XHRkb3duOiBuYXZpZ2F0ZURvd24sXG5cdFx0cHJldjogbmF2aWdhdGVQcmV2LFxuXHRcdG5leHQ6IG5hdmlnYXRlTmV4dCxcblxuXHRcdC8vIEZyYWdtZW50IG1ldGhvZHNcblx0XHRuYXZpZ2F0ZUZyYWdtZW50OiBuYXZpZ2F0ZUZyYWdtZW50LFxuXHRcdHByZXZGcmFnbWVudDogcHJldmlvdXNGcmFnbWVudCxcblx0XHRuZXh0RnJhZ21lbnQ6IG5leHRGcmFnbWVudCxcblxuXHRcdC8vIERlcHJlY2F0ZWQgYWxpYXNlc1xuXHRcdG5hdmlnYXRlVG86IHNsaWRlLFxuXHRcdG5hdmlnYXRlTGVmdDogbmF2aWdhdGVMZWZ0LFxuXHRcdG5hdmlnYXRlUmlnaHQ6IG5hdmlnYXRlUmlnaHQsXG5cdFx0bmF2aWdhdGVVcDogbmF2aWdhdGVVcCxcblx0XHRuYXZpZ2F0ZURvd246IG5hdmlnYXRlRG93bixcblx0XHRuYXZpZ2F0ZVByZXY6IG5hdmlnYXRlUHJldixcblx0XHRuYXZpZ2F0ZU5leHQ6IG5hdmlnYXRlTmV4dCxcblxuXHRcdC8vIEZvcmNlcyBhbiB1cGRhdGUgaW4gc2xpZGUgbGF5b3V0XG5cdFx0bGF5b3V0OiBsYXlvdXQsXG5cblx0XHQvLyBSYW5kb21pemVzIHRoZSBvcmRlciBvZiBzbGlkZXNcblx0XHRzaHVmZmxlOiBzaHVmZmxlLFxuXG5cdFx0Ly8gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgYXZhaWxhYmxlIHJvdXRlcyBhcyBib29sZWFucyAobGVmdC9yaWdodC90b3AvYm90dG9tKVxuXHRcdGF2YWlsYWJsZVJvdXRlczogYXZhaWxhYmxlUm91dGVzLFxuXG5cdFx0Ly8gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgYXZhaWxhYmxlIGZyYWdtZW50cyBhcyBib29sZWFucyAocHJldi9uZXh0KVxuXHRcdGF2YWlsYWJsZUZyYWdtZW50czogYXZhaWxhYmxlRnJhZ21lbnRzLFxuXG5cdFx0Ly8gVG9nZ2xlcyB0aGUgb3ZlcnZpZXcgbW9kZSBvbi9vZmZcblx0XHR0b2dnbGVPdmVydmlldzogdG9nZ2xlT3ZlcnZpZXcsXG5cblx0XHQvLyBUb2dnbGVzIHRoZSBcImJsYWNrIHNjcmVlblwiIG1vZGUgb24vb2ZmXG5cdFx0dG9nZ2xlUGF1c2U6IHRvZ2dsZVBhdXNlLFxuXG5cdFx0Ly8gVG9nZ2xlcyB0aGUgYXV0byBzbGlkZSBtb2RlIG9uL29mZlxuXHRcdHRvZ2dsZUF1dG9TbGlkZTogdG9nZ2xlQXV0b1NsaWRlLFxuXG5cdFx0Ly8gU3RhdGUgY2hlY2tzXG5cdFx0aXNPdmVydmlldzogaXNPdmVydmlldyxcblx0XHRpc1BhdXNlZDogaXNQYXVzZWQsXG5cdFx0aXNBdXRvU2xpZGluZzogaXNBdXRvU2xpZGluZyxcblxuXHRcdC8vIEFkZHMgb3IgcmVtb3ZlcyBhbGwgaW50ZXJuYWwgZXZlbnQgbGlzdGVuZXJzIChzdWNoIGFzIGtleWJvYXJkKVxuXHRcdGFkZEV2ZW50TGlzdGVuZXJzOiBhZGRFdmVudExpc3RlbmVycyxcblx0XHRyZW1vdmVFdmVudExpc3RlbmVyczogcmVtb3ZlRXZlbnRMaXN0ZW5lcnMsXG5cblx0XHQvLyBGYWNpbGl0eSBmb3IgcGVyc2lzdGluZyBhbmQgcmVzdG9yaW5nIHRoZSBwcmVzZW50YXRpb24gc3RhdGVcblx0XHRnZXRTdGF0ZTogZ2V0U3RhdGUsXG5cdFx0c2V0U3RhdGU6IHNldFN0YXRlLFxuXG5cdFx0Ly8gUHJlc2VudGF0aW9uIHByb2dyZXNzIG9uIHJhbmdlIG9mIDAtMVxuXHRcdGdldFByb2dyZXNzOiBnZXRQcm9ncmVzcyxcblxuXHRcdC8vIFJldHVybnMgdGhlIGluZGljZXMgb2YgdGhlIGN1cnJlbnQsIG9yIHNwZWNpZmllZCwgc2xpZGVcblx0XHRnZXRJbmRpY2VzOiBnZXRJbmRpY2VzLFxuXG5cdFx0Z2V0VG90YWxTbGlkZXM6IGdldFRvdGFsU2xpZGVzLFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgc2xpZGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4XG5cdFx0Z2V0U2xpZGU6IGdldFNsaWRlLFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgc2xpZGUgYmFja2dyb3VuZCBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXhcblx0XHRnZXRTbGlkZUJhY2tncm91bmQ6IGdldFNsaWRlQmFja2dyb3VuZCxcblxuXHRcdC8vIFJldHVybnMgdGhlIHNwZWFrZXIgbm90ZXMgc3RyaW5nIGZvciBhIHNsaWRlLCBvciBudWxsXG5cdFx0Z2V0U2xpZGVOb3RlczogZ2V0U2xpZGVOb3RlcyxcblxuXHRcdC8vIFJldHVybnMgdGhlIHByZXZpb3VzIHNsaWRlIGVsZW1lbnQsIG1heSBiZSBudWxsXG5cdFx0Z2V0UHJldmlvdXNTbGlkZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gcHJldmlvdXNTbGlkZTtcblx0XHR9LFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgY3VycmVudCBzbGlkZSBlbGVtZW50XG5cdFx0Z2V0Q3VycmVudFNsaWRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBjdXJyZW50U2xpZGU7XG5cdFx0fSxcblxuXHRcdC8vIFJldHVybnMgdGhlIGN1cnJlbnQgc2NhbGUgb2YgdGhlIHByZXNlbnRhdGlvbiBjb250ZW50XG5cdFx0Z2V0U2NhbGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHNjYWxlO1xuXHRcdH0sXG5cblx0XHQvLyBSZXR1cm5zIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gb2JqZWN0XG5cdFx0Z2V0Q29uZmlnOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBjb25maWc7XG5cdFx0fSxcblxuXHRcdC8vIEhlbHBlciBtZXRob2QsIHJldHJpZXZlcyBxdWVyeSBzdHJpbmcgYXMgYSBrZXkvdmFsdWUgaGFzaFxuXHRcdGdldFF1ZXJ5SGFzaDogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgcXVlcnkgPSB7fTtcblxuXHRcdFx0bG9jYXRpb24uc2VhcmNoLnJlcGxhY2UoIC9bQS1aMC05XSs/PShbXFx3XFwuJS1dKikvZ2ksIGZ1bmN0aW9uKGEpIHtcblx0XHRcdFx0cXVlcnlbIGEuc3BsaXQoICc9JyApLnNoaWZ0KCkgXSA9IGEuc3BsaXQoICc9JyApLnBvcCgpO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBCYXNpYyBkZXNlcmlhbGl6YXRpb25cblx0XHRcdGZvciggdmFyIGkgaW4gcXVlcnkgKSB7XG5cdFx0XHRcdHZhciB2YWx1ZSA9IHF1ZXJ5WyBpIF07XG5cblx0XHRcdFx0cXVlcnlbIGkgXSA9IGRlc2VyaWFsaXplKCB1bmVzY2FwZSggdmFsdWUgKSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcXVlcnk7XG5cdFx0fSxcblxuXHRcdC8vIFJldHVybnMgdHJ1ZSBpZiB3ZSdyZSBjdXJyZW50bHkgb24gdGhlIGZpcnN0IHNsaWRlXG5cdFx0aXNGaXJzdFNsaWRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiAoIGluZGV4aCA9PT0gMCAmJiBpbmRleHYgPT09IDAgKTtcblx0XHR9LFxuXG5cdFx0Ly8gUmV0dXJucyB0cnVlIGlmIHdlJ3JlIGN1cnJlbnRseSBvbiB0aGUgbGFzdCBzbGlkZVxuXHRcdGlzTGFzdFNsaWRlOiBmdW5jdGlvbigpIHtcblx0XHRcdGlmKCBjdXJyZW50U2xpZGUgKSB7XG5cdFx0XHRcdC8vIERvZXMgdGhpcyBzbGlkZSBoYXMgbmV4dCBhIHNpYmxpbmc/XG5cdFx0XHRcdGlmKCBjdXJyZW50U2xpZGUubmV4dEVsZW1lbnRTaWJsaW5nICkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0XHRcdC8vIElmIGl0J3MgdmVydGljYWwsIGRvZXMgaXRzIHBhcmVudCBoYXZlIGEgbmV4dCBzaWJsaW5nP1xuXHRcdFx0XHRpZiggaXNWZXJ0aWNhbFNsaWRlKCBjdXJyZW50U2xpZGUgKSAmJiBjdXJyZW50U2xpZGUucGFyZW50Tm9kZS5uZXh0RWxlbWVudFNpYmxpbmcgKSByZXR1cm4gZmFsc2U7XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9LFxuXG5cdFx0Ly8gQ2hlY2tzIGlmIHJldmVhbC5qcyBoYXMgYmVlbiBsb2FkZWQgYW5kIGlzIHJlYWR5IGZvciB1c2Vcblx0XHRpc1JlYWR5OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBsb2FkZWQ7XG5cdFx0fSxcblxuXHRcdC8vIEZvcndhcmQgZXZlbnQgYmluZGluZyB0byB0aGUgcmV2ZWFsIERPTSBlbGVtZW50XG5cdFx0YWRkRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24oIHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICkge1xuXHRcdFx0aWYoICdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cgKSB7XG5cdFx0XHRcdCggZG9tLndyYXBwZXIgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5yZXZlYWwnICkgKS5hZGRFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lcjogZnVuY3Rpb24oIHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICkge1xuXHRcdFx0aWYoICdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cgKSB7XG5cdFx0XHRcdCggZG9tLndyYXBwZXIgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5yZXZlYWwnICkgKS5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvLyBQcm9ncmFtYXRpY2FsbHkgdHJpZ2dlcnMgYSBrZXlib2FyZCBldmVudFxuXHRcdHRyaWdnZXJLZXk6IGZ1bmN0aW9uKCBrZXlDb2RlICkge1xuXHRcdFx0b25Eb2N1bWVudEtleURvd24oIHsga2V5Q29kZToga2V5Q29kZSB9ICk7XG5cdFx0fSxcblxuXHRcdC8vIFJlZ2lzdGVycyBhIG5ldyBzaG9ydGN1dCB0byBpbmNsdWRlIGluIHRoZSBoZWxwIG92ZXJsYXlcblx0XHRyZWdpc3RlcktleWJvYXJkU2hvcnRjdXQ6IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuXHRcdFx0a2V5Ym9hcmRTaG9ydGN1dHNba2V5XSA9IHZhbHVlO1xuXHRcdH1cblx0fTtcblxuXHRyZXR1cm4gUmV2ZWFsO1xuXG59KSk7XG4iLCJ2YXIgUmV2ZWFsID0gcmVxdWlyZSgncmV2ZWFsLmpzJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pib25lJyk7XG52YXIgc2xpZGVzID0gcmVxdWlyZSgnLi9qcy9tb2R1bGVzL3NsaWRlcycpLmdldFNsaWRlcygpO1xudmFyIFZJREVPX1RZUEUgPSByZXF1aXJlKCcuL2pzL2NvbnN0YW50cy5qcycpLlZJREVPX1RZUEU7XG52YXIgQVVESU9fVFlQRSA9IHJlcXVpcmUoJy4vanMvY29uc3RhbnRzLmpzJykuQVVESU9fVFlQRTtcbnZhciBBVURJT19QQVRIID0gcmVxdWlyZSgnLi9qcy9jb25zdGFudHMuanMnKS5BVURJT19QQVRIO1xuXG5cblJldmVhbC5pbml0aWFsaXplKHtcbiAgICB3aWR0aDogMTAwMCxcbiAgICBoZWlnaHQ6IDc0MCxcbiAgICBjZW50ZXI6IGZhbHNlLFxuICAgIGNvbnRyb2xzOiBmYWxzZSxcbiAgICAvL2hpc3Rvcnk6IHRydWUsXG4gICAga2V5Ym9hcmQ6IGZhbHNlXG59KTtcblxudmFyIHN0ZXBJbmRleCA9IDAsXG4gICAgbG9vcEluZGV4ID0gMCxcbiAgICBpc1BsYXlpbmcgPSBmYWxzZSxcbiAgICBtZWRpYUlzUmVhZHkgPSBmYWxzZSxcbiAgICAkYXVkaW8gPSAkKCdhdWRpbycpO1xuXG5cblxudmFyIHRvZ2dsZVBsYXkgID0gZnVuY3Rpb24gKCkge1xuICAgIGlmKCFtZWRpYUlzUmVhZHkpIHtcbiAgICAgICAgbG9hZGluZ01lZGlhTG9vcCgpO1xuICAgICAgICByZXR1cm5cbiAgICB9XG4gICAgdmFyICRvdmVybGF5ID0gJCgnI292ZXJsYXknKTtcblxuICAgIGlmKGlzUGxheWluZykgeyAvL3BhdXNlXG4gICAgICAgICRvdmVybGF5LmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICBpc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgY2hhbmdlTWVkaWFTdGF0ZSgncGF1c2UnKTtcbiAgICB9IGVsc2V7IC8vcGxheVxuICAgICAgICBjaGFuZ2VNZWRpYVN0YXRlKCdwbGF5Jyk7XG4gICAgICAgICRvdmVybGF5LmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgIGlzUGxheWluZyA9IHRydWU7XG4gICAgICAgIHBsYXlMb29wKCk7XG4gICAgfVxufTtcblxuJChkb2N1bWVudCkub24oJ2NsaWNrJywgdG9nZ2xlUGxheSk7XG4kKEFVRElPX1RZUEUpWzBdLm9ud2FpdGluZyA9IHRvZ2dsZVBsYXk7XG4kKFZJREVPX1RZUEUpWzBdLm9ud2FpdGluZyA9IHRvZ2dsZVBsYXk7XG5cbi8vdmFyIGluaXRNZWRpYSA9IGZ1bmN0aW9uICgpIHtcbi8vICAgIHZhciBtZWRpYVR5cGUgPSBzbGlkZXNbUmV2ZWFsLmdldEluZGljZXMoKS5oXS5tZWRpYVR5cGU7XG4vL1xuLy8gICAgaWYobWVkaWFUeXBlID09PSBBVURJT19UWVBFKSB7XG4vL1xuLy8gICAgfSBlbHNlIGlmKG1lZGlhVHlwZSA9PT0gVklERU9fVFlQRSkge1xuLy9cbi8vICAgIH1cbi8vfTtcblxuXG5cblxuXG5cblxudmFyIHBsYXlMb29wID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjdXJyU2xpZGUgPSBudWxsO1xuICAgIGNvbnNvbGUubG9nKGxvb3BJbmRleCk7XG4gICAgaWYgKGlzUGxheWluZyAmJiBtZWRpYUlzUmVhZHkpIHtcbiAgICAgICAgY3VyclNsaWRlID0gUmV2ZWFsLmdldEluZGljZXMoKS5oO1xuXG4gICAgICAgIGlmIChzbGlkZXNbY3VyclNsaWRlXS5zdGVwc1tzdGVwSW5kZXhdKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBsYXlMb29wLCAyNTApO1xuICAgICAgICAgICAgaWYgKHNsaWRlc1tjdXJyU2xpZGVdLnN0ZXBzW3N0ZXBJbmRleF0uZGVsYXkgPT09IGxvb3BJbmRleCkge1xuICAgICAgICAgICAgICAgIC8vbG9vcEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBzbGlkZXNbY3VyclNsaWRlXS5zdGVwc1tzdGVwSW5kZXgrK10uY21kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbG9vcEluZGV4Kys7XG4gICAgfVxufTtcblxudmFyIGNoYW5nZU1lZGlhU3RhdGUgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XG4gICAgdmFyIG1lZGlhVHlwZSA9IHNsaWRlc1tSZXZlYWwuZ2V0SW5kaWNlcygpLmhdLm1lZGlhVHlwZTtcblxuICAgIGlmKG1lZGlhVHlwZSA9PT0gQVVESU9fVFlQRSkge1xuICAgICAgICAkYXVkaW9bMF1bYWN0aW9uXSgpO1xuICAgIH0gZWxzZSBpZihtZWRpYVR5cGUgPT09IFZJREVPX1RZUEUpIHtcbiAgICAgICAgJChSZXZlYWwuZ2V0Q3VycmVudFNsaWRlKCkpLmZpbmQoJ3ZpZGVvJylbMF1bYWN0aW9uXSgpO1xuICAgIH1cbn07XG5cbnZhciBsb2FkaW5nTWVkaWFMb29wID0gZnVuY3Rpb24gKHNsaWRlSW5kZXgpIHtcbiAgICBjb25zb2xlLmxvZyhcImxvYWRpbmcuLi5cIiwgJGF1ZGlvWzBdLnJlYWR5U3RhdGUgKTtcbiAgICB2YXIgaW5kZXhoID0gc2xpZGVJbmRleCB8fCBSZXZlYWwuZ2V0SW5kaWNlcygpLmg7XG4gICAgdmFyIG1lZGlhVHlwZSA9IHNsaWRlc1tpbmRleGhdLm1lZGlhVHlwZTtcblxuXG4gICAgbWVkaWFJc1JlYWR5ID0gKG1lZGlhVHlwZSA9PT0gQVVESU9fVFlQRSAmJiAkYXVkaW9bMF0ucmVhZHlTdGF0ZSA9PT0gNClcbiAgICAgICAgfHwgKG1lZGlhVHlwZSA9PT0gVklERU9fVFlQRSAmJiAgJChSZXZlYWwuZ2V0Q3VycmVudFNsaWRlKCkpLmZpbmQoJ3ZpZGVvJylbMF0ucmVhZHlTdGF0ZSA9PT0gNCk7XG5cblxuICAgIGlmIChtZWRpYUlzUmVhZHkpIHtcbiAgICAgICAgaW5kZXhoID4gMCAmJiBjaGFuZ2VNZWRpYVN0YXRlKCdwbGF5Jyk7XG4gICAgICAgIHNldFRpbWVvdXQocGxheUxvb3AsIDI1MCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGltZW91dChsb2FkaW5nTWVkaWFMb29wLCAyNTApO1xuICAgIH1cbn07XG5cbmxvYWRpbmdNZWRpYUxvb3AoKTtcblxuXG5cblxuUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ3NsaWRlY2hhbmdlZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICBjb25zb2xlLmxvZyhcIlNMSURFIENIQU5HRURcIik7XG4gICAgbWVkaWFJc1JlYWR5ID0gZmFsc2U7XG4gICAgc3RlcEluZGV4ID0gMDtcbiAgICBsb29wSW5kZXggPSAwO1xuXG4gICAgdmFyIG1lZGlhRmlsZU51bWJlciA9IGUuaW5kZXhoICsgMTtcbiAgICBpZihzbGlkZXNbZS5pbmRleGhdLm1lZGlhVHlwZSA9PT0gQVVESU9fVFlQRSkge1xuICAgICAgICAkYXVkaW8uZmluZCgnc291cmNlJykuYXR0cignc3JjJywgQVVESU9fUEFUSCArIG1lZGlhRmlsZU51bWJlciArIFwiLm1wM1wiKTtcblxuICAgICAgICAkYXVkaW9bMF0ubG9hZCgpO1xuICAgIH1cblxuICAgIGxvYWRpbmdNZWRpYUxvb3AoZS5pbmRleGgpO1xufSk7XG5cblJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeScsIGZ1bmN0aW9uKCkge1xuICAgICQoJy5qcy1sb2FkZXInKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xufSk7XG5cbi8vUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmdW5jdGlvbihlKSB7XG4vLyAgICAvL3ZhciAkZWwgPSAkKGUuZnJhZ21lbnQpO1xuLy99KTtcbi8vXG4vL1JldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIGZ1bmN0aW9uKGUpIHtcbi8vICAgIC8vdmFyICRlbCA9ICQoZS5mcmFnbWVudCk7XG4vL30pO1xuXG4kKCcubmV4dC1idG4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgUmV2ZWFsLm5leHQoKTtcbn0pOyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEFVRElPX1RZUEUgOiBcImF1ZGlvXCIsXG4gICAgVklERU9fVFlQRSA6IFwidmlkZW9cIixcbiAgICBBVURJT19QQVRIIDogXCIuL2RhdGEvcGFnZVwiXG59O1xuXG4iLCJ2YXIgUmV2ZWFsID0gcmVxdWlyZSgncmV2ZWFsLmpzJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pib25lJyk7XG52YXIgVklERU9fVFlQRSA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy5qcycpLlZJREVPX1RZUEU7XG52YXIgQVVESU9fVFlQRSA9IHJlcXVpcmUoJy4uLy4uL2NvbnN0YW50cy5qcycpLkFVRElPX1RZUEU7XG5cbnZhciBzbGlkZXMgPSB7XG4gICAgMDoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMTUsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDUwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMjAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE3OCwgY21kOiBSZXZlYWwubmV4dCB9XG4gICAgICAgIF0sXG4gICAgICAgIG1lZGlhVHlwZTogVklERU9fVFlQRVxuICAgIH0sXG4gICAgMToge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMzIsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDg0LCBjbWQ6IFJldmVhbC5uZXh0fSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDkzLCBjbWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBSZXZlYWwubmV4dCgpOyBSZXZlYWwubmV4dCgpO1xuICAgICAgICAgICAgfSB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTEwLCBjbWQ6IFJldmVhbC5uZXh0fSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEyMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTMwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMzksIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE3NSwgY21kOiBSZXZlYWwubmV4dCB9XG4gICAgICAgIF0sXG4gICAgICAgIG1lZGlhVHlwZTogQVVESU9fVFlQRVxuICAgIH0sXG4gICAgMjoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMzAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDQwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA1MiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNjQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDY4LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMDAsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDM6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDksIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDI0LCBjbWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKCcuYmxvY2stMS1zbC00IHVsIGxpJykuZXEoMykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgJCgnLmJsb2NrLTMtc2wtNCB1bCBsaScpLmVxKDApXG4gICAgICAgICAgICAgICAgICAgIC5odG1sKFwiaG9iYnk6IGdvbGZpbmdcIilcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgfSB9LFxuICAgICAgICAgICAgeyBkZWxheTogNjAsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDQ6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDE2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNDAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDQ0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA0OCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNTIsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDU2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA3NiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTcyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxODQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE5MCwgY21kOiBSZXZlYWwubmV4dCB9XG4gICAgICAgIF0sXG4gICAgICAgIG1lZGlhVHlwZTogQVVESU9fVFlQRVxuICAgIH0sXG4gICAgNToge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMzMsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDY0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA3NywgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogODAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEwMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTQwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNjQsIGNtZDogUmV2ZWFsLm5leHQgfVxuXG4gICAgICAgIF0sXG4gICAgICAgIG1lZGlhVHlwZTogQVVESU9fVFlQRVxuICAgIH0sXG4gICAgNjoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogNDgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDYwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA4OCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTEyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMzYsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE0MCwgY21kOiBSZXZlYWwubmV4dCB9XG5cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICA3OiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiAzNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNzIsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDg6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDI4LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNjQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEyMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTU2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAyMTIsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDk6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDU2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA4MCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogODYsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDExMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTI4LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMzYsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDEwOiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiAyNCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDMyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNDAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDg0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMTAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEyMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTMyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNzYsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDExOiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiAzNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNDQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDc2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMDgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDExMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTM2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNjgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE4OCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjA0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAyMjAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDMwNCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMzcyLCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAxMjoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogNDQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDY4LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA5NywgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTE0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMzQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE1MywgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjA1LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAyNTQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDI3NywgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjkyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzMDQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDMxNSwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMzIwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzNTIsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDEzOiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiAxMzAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE0MCwgY21kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJCgnLmZ1bmQtYmxvY2snKS5hZGRDbGFzcygnbW92ZWQnKTtcbiAgICAgICAgICAgIH19LFxuICAgICAgICAgICAgeyBkZWxheTogMTYxLCBjbWQ6IFJldmVhbC5uZXh0IH1cblxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDE0OiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiAyOCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNTYsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDc2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA5MiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTI0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxOTIsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDIzMiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjg0LCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAxNToge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMjEsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDM5LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA3MCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTAwLCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAxNjoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMTIzLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNDAsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IFZJREVPX1RZUEVcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXRTbGlkZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHNsaWRlc1xuICAgIH1cbn07Il19

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
var VIDEO_TYPE = require('./js/constants.js').VIDEO_TYPE;
var AUDIO_TYPE = require('./js/constants.js').AUDIO_TYPE;
var AUDIO_PATH = require('./js/constants.js').AUDIO_PATH;
var Draggable = require ('./js/lib/draggable.js');
var detectIE = require('./js/detectie.js').detectIE;


var isEdge14 = detectIE() === 14;

if (isEdge14) {
    $('body').addClass("edge-14");
}



Reveal.initialize({
    width: 1000,
    height: 740,
    center: false,
    controls: false,
    //history: true,
    keyboard: false,
    progress: false
});


var stepIndex = 0,
    loopIndex = 0,
    isPlaying = false,
    mediaIsReady = false,
    $audio = $('audio'),
    $overlay = $('#overlay'),
    $pauseBtn = $('.pause-btn'),
    isFinished = false;

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
            { delay: 26, cmd: function () {
                //$('.block-1-sl-4 ul li').eq(3).addClass("active");
                //$('.block-3-sl-4 ul li').eq(0)
                //    .html("hobby: golfing")
                //    .addClass("active");
                togglePlay(true);

            } },
            { delay: 60, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    4: {
        steps: [
            { delay: 16, cmd: Reveal.next },
            { delay: 36, cmd: Reveal.next },
            { delay: 46, cmd: Reveal.next },
            { delay: 47, cmd: Reveal.next },
            { delay: 57, cmd: Reveal.next },
            { delay: 58, cmd: Reveal.next },
            { delay: 68, cmd: Reveal.next },
            { delay: 87, cmd: Reveal.next },//
            { delay: 172, cmd: Reveal.next },
            { delay: 184, cmd: Reveal.next }
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
            { delay: 78, cmd: Reveal.next }
        ],
        mediaType: AUDIO_TYPE
    },
    8: {
        steps: [
            { delay: 28, cmd: Reveal.next },
            { delay: 60, cmd: Reveal.next },
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
            { delay: 20, cmd: Reveal.next },
            { delay: 24, cmd: Reveal.next },
            { delay: 28, cmd: Reveal.next },
            { delay: 32, cmd: Reveal.next },
            { delay: 36, cmd: Reveal.next },
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
            { delay: 114, cmd: function () {
                togglePlay(true);
            } },
            { delay: 136, cmd: Reveal.next },
            { delay: 169, cmd: Reveal.next },
            { delay: 190, cmd: Reveal.next },
            { delay: 207, cmd: Reveal.next },
            { delay: 227, cmd: Reveal.next },
            { delay: 304, cmd: Reveal.next },
            { delay: 382, cmd: Reveal.next }
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
            { delay: 261, cmd: Reveal.next },
            { delay: 276, cmd: Reveal.next },
            { delay: 289, cmd: Reveal.next },
            { delay: 303, cmd: Reveal.next },
            { delay: 316, cmd: Reveal.next },
            { delay: 378, cmd: Reveal.next }
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



var togglePlay  = function (withoutScreen, action) {
    withoutScreen = typeof withoutScreen === 'boolean' ? withoutScreen : false;

    if(!mediaIsReady) {
        loadingMediaLoop();
        return
    }

    if(isPlaying) { //pause
        $pauseBtn.removeClass('active');
        !withoutScreen && $overlay.css('display', 'block');
        isPlaying = false;
        changeMediaState('pause');
    } else{ //play
        $pauseBtn.addClass('active');
        changeMediaState('play');
        !withoutScreen && $overlay.css('display', 'none');
        isPlaying = true;
        playLoop();
    }
};

$overlay.on('click', togglePlay);
$pauseBtn.on('click', togglePlay);
$(AUDIO_TYPE)[0].onwaiting = togglePlay;
$(VIDEO_TYPE)[0].onwaiting = togglePlay;

//slide 3
$('.hobbies-list li').on('click', function () {
    if(isPlaying) {
        return
    }
    if(!$(this).parent().find('.active').length) {
        togglePlay(true);
    }
    $(this).parent().find('.active').removeClass('active');
    $(this).addClass("active");
    $('.block-3-sl-4 ul li').eq(0)
        .html("hobby: " + $(this).html())
        .addClass("active");
});

$('.panic-btn').on('click', function () {
    !isPlaying && togglePlay(true);
});

$('.js-yes-btn, .js-no-btn').on('click', Reveal.next);

//slide 8
$('.savings-table tr').on('click', function () {
    if(!isFinished) {
        return
    }
    if(!$(this).parent().find('.active').length) {
        Reveal.next();
    }
    $(this).parent().find('.active').removeClass('active');
    $(this).addClass("active");

});



var playLoop = function () {
    isFinished = false;
    var currSlide = null;
    //console.log(loopIndex);
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
            isFinished = true;
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
    //console.log("loading...", $audio[0].readyState );
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

var $circleItems = $('.circle-items'),
    $circles = $('.circle-items').find('.circle');

new Draggable (document.getElementById('js-fund-block'),{
    limit: {
        x: [295, 865],
        y: [0, 0]
    },
    setPosition: false,
    onDrag: function (el, x, y, e) {
        $circles.forEach(function (circle) {
            if(circle.offsetLeft >= x && x + 140 >= circle.offsetLeft + 132) {
                $circleItems.find('.active').removeClass('active');
                var lineNumber = $(circle).attr('data-line');
                $('[data-line="' + lineNumber + '"]').addClass('active');
                return false;
            }
        });
    }

});
},{"./js/constants.js":4,"./js/detectie.js":5,"./js/lib/draggable.js":6,"jbone":1,"reveal.js":2}],4:[function(require,module,exports){
module.exports = {
    AUDIO_TYPE : "audio",
    VIDEO_TYPE : "video",
    AUDIO_PATH : "./data/page"
};


},{}],5:[function(require,module,exports){
module.exports = {
    detectIE: function () {
        var ua = window.navigator.userAgent;

        // Test values; Uncomment to check result …

        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

        // Edge 12 (Spartan)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

        // Edge 13
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    }
};
},{}],6:[function(require,module,exports){
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.Draggable = factory();
    }
}(this, function () {

    'use strict';

    var defaults = {

        // settings
        grid: 0,                // grid cell size for snapping to on drag
        filterTarget: null,     // disallow drag when target passes this test
        limit: {                // limit the drag bounds
            x: null,              // [minimum position, maximum position] || position
            y: null               // [minimum position, maximum position] || position
        },
        threshold: 0,           // threshold to move before drag begins (in px)

        // flags
        setCursor: false,       // change cursor to reflect draggable?
        setPosition: true,      // change draggable position to absolute?
        smoothDrag: true,       // snap to grid when dropped, but not during
        useGPU: true,           // move graphics calculation/composition to the GPU

        // event hooks
        onDrag: noop,           // function(element, X, Y, event)
        onDragStart: noop,      // function(element, X, Y, event)
        onDragEnd: noop         // function(element, X, Y, event)

    };

    var env = {

        // CSS vendor-prefixed transform property
        transform: (function(){

            var prefixes = ' -o- -ms- -moz- -webkit-'.split(' ');
            var style = document.body.style;

            for (var n = prefixes.length; n--;) {
                var property = prefixes[n] + 'transform';
                if (property in style) {
                    return property;
                }
            }

        })()

    };

    var util = {

        assign: function () {

            var obj = arguments[0];
            var count = arguments.length;

            for ( var n = 1; n < count; n++ ) {
                var argument = arguments[n];
                for ( var key in argument ) {
                    obj[key] = argument[key];
                }
            }

            return obj;

        },

        bind: function (fn, context) {
            return function() {
                fn.apply(context, arguments);
            }
        },

        on: function (element, e, fn) {
            if (e && fn) {
                util.addEvent (element, e, fn);
            } else if (e) {
                for (var ee in e) {
                    util.addEvent (element, ee, e[ee]);
                }
            }
        },

        off: function (element, e, fn) {
            if (e && fn) {
                util.removeEvent (element, e, fn);
            } else if (e) {
                for (var ee in e) {
                    util.removeEvent (element, ee, e[ee]);
                }
            }
        },

        // Example:
        //
        //     util.limit(x, limit.x)
        limit: function (n, limit) {
            // {Array} limit.x
            if (isArray(limit)) {
                limit = [+limit[0], +limit[1]];
                if (n < limit[0]) n = limit[0];
                else if (n > limit[1]) n = limit[1];
                // {Number} limit.x
            } else {
                n = +limit;
            }

            return n;
        },

        addEvent: ('attachEvent' in Element.prototype)
            ? function (element, e, fn) { element.attachEvent('on'+e, fn) }
            : function (element, e, fn) { element.addEventListener(e, fn, false) },

        removeEvent: ('attachEvent' in Element.prototype)
            ? function (element, e, fn) { element.detachEvent('on'+e, fn) }
            : function (element, e, fn) { element.removeEventListener(e, fn) }

    };

    /*
     usage:

     new Draggable (element, options)
     - or -
     new Draggable (element)
     */

    function Draggable (element, options) {

        var me = this,
            start = util.bind(me.start, me),
            drag = util.bind(me.drag, me),
            stop = util.bind(me.stop, me);

        // sanity check
        if (!isElement(element)) {
            throw new TypeError('Draggable expects argument 0 to be an Element');
        }

        // set instance properties
        util.assign(me, {

            // DOM element
            element: element,

            // DOM event handlers
            handlers: {
                start: {
                    mousedown: start,
                    touchstart: start
                },
                move: {
                    mousemove: drag,
                    mouseup: stop,
                    touchmove: drag,
                    touchend: stop
                }
            },

            // options
            options: util.assign({}, defaults, options)

        });

        // initialize
        me.initialize();

    }

    util.assign (Draggable.prototype, {

        // public

        setOption: function (property, value) {

            var me = this;

            me.options[property] = value;
            me.initialize();

            return me;

        },

        get: function() {

            var dragEvent = this.dragEvent;

            return {
                x: dragEvent.x,
                y: dragEvent.y
            };

        },

        set: function (x, y) {

            var me = this,
                dragEvent = me.dragEvent;

            dragEvent.original = {
                x: dragEvent.x,
                y: dragEvent.y
            };

            me.move(x, y);

            return me;

        },

        // internal

        dragEvent: {
            started: false,
            x: 0,
            y: 0
        },

        initialize: function() {

            var me = this,
                element = me.element,
                style = element.style,
                compStyle = getStyle(element),
                options = me.options,
                transform = env.transform,
                oldTransform;

            // cache element dimensions (for performance)

            var _dimensions = me._dimensions = {
                height: element.offsetHeight,
                left: element.offsetLeft,
                top: element.offsetTop,
                width: element.offsetWidth
            };

            // shift compositing over to the GPU if the browser supports it (for performance)

            if (options.useGPU && transform) {

                // concatenate to any existing transform
                // so we don't accidentally override it
                oldTransform = compStyle[transform];

                if (oldTransform === 'none') {
                    oldTransform = '';
                }

                style[transform] = oldTransform + ' translate3d(0,0,0)';
            }

            // optional styling

            if (options.setPosition) {
                style.display = 'block';
                style.left = _dimensions.left + 'px';
                style.top = _dimensions.top + 'px';
                style.bottom = style.right = 'auto';
                style.margin = 0;
                style.position = 'absolute';
            }

            if (options.setCursor) {
                style.cursor = 'move';
            }

            // set limit
            me.setLimit(options.limit);

            // set position in model
            util.assign(me.dragEvent, {
                x: _dimensions.left,
                y: _dimensions.top
            });

            // attach mousedown event
            util.on(me.element, me.handlers.start);

        },

        start: function (e) {

            var me = this;
            var cursor = me.getCursor(e);
            var element = me.element;

            // filter the target?
            if (!me.useTarget(e.target || e.srcElement)) {
                return;
            }

            // prevent browsers from visually dragging the element's outline
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false; // IE10
            }

            // set a high z-index, just in case
            me.dragEvent.oldZindex = element.style.zIndex;
            element.style.zIndex = 10000;

            // set initial position
            me.setCursor(cursor);
            me.setPosition();
            me.setZoom();

            // add event listeners
            util.on(document, me.handlers.move);

        },

        drag: function (e) {
            var me = this,
                dragEvent = me.dragEvent,
                element = me.element,
                initialCursor = me._cursor,
                initialPosition = me._dimensions,
                options = me.options,
                zoom = initialPosition.zoom,
                cursor = me.getCursor(e),
                threshold = options.threshold,
                slideScale = document.getElementsByClassName("slides")[0].style.transform.split("scale")[1],
                parsedSlideScale = slideScale ? parseFloat(slideScale.replace(/\(/,"").replace(/\)/, "")) : 1,
                slideZoom = parseFloat(document.getElementsByClassName("slides")[0].style.zoom),
                parsedSlideZoom = slideZoom || 1,
                x = (cursor.x - initialCursor.x) / zoom / parsedSlideScale / parsedSlideZoom + initialPosition.left,
                y = (cursor.y - initialCursor.y) / zoom / parsedSlideScale / parsedSlideZoom + initialPosition.top;


            // check threshold
            if (!dragEvent.started && threshold &&
                (Math.abs(initialCursor.x - cursor.x) < threshold) &&
                (Math.abs(initialCursor.y - cursor.y) < threshold)
            ) {
                return;
            }

            // save original position?
            if (!dragEvent.original) {
                dragEvent.original = { x: x, y: y };
            }

            // trigger start event?
            if (!dragEvent.started) {
                options.onDragStart(element, x, y, e);
                dragEvent.started = true;
            }

            // move the element
            if (me.move(x, y)) {

                // trigger drag event
                options.onDrag(element, dragEvent.x, dragEvent.y, e);
            }

        },

        move: function (x, y) {

            var me = this,
                dragEvent = me.dragEvent,
                options = me.options,
                grid = options.grid,
                style = me.element.style,
                pos = me.limit(x, y, dragEvent.original.x, dragEvent.original.y);

            // snap to grid?
            if (!options.smoothDrag && grid) {
                pos = me.round (pos, grid);
            }

            // move it
            if (pos.x !== dragEvent.x || pos.y !== dragEvent.y) {

                dragEvent.x = pos.x;
                dragEvent.y = pos.y;
                style.left = pos.x + 'px';
                style.top = pos.y + 'px';

                return true;
            }

            return false;

        },

        stop: function (e) {

            var me = this,
                dragEvent = me.dragEvent,
                element = me.element,
                options = me.options,
                grid = options.grid,
                pos;

            // remove event listeners
            util.off(document, me.handlers.move);

            // resent element's z-index
            element.style.zIndex = dragEvent.oldZindex;

            // snap to grid?
            if (options.smoothDrag && grid) {
                pos = me.round({ x: dragEvent.x, y: dragEvent.y }, grid);
                me.move(pos.x, pos.y);
                util.assign(me.dragEvent, pos);
            }

            // trigger dragend event
            if (me.dragEvent.started) {
                options.onDragEnd(element, dragEvent.x, dragEvent.y, e);
            }

            // clear temp vars
            me.reset();

        },

        reset: function() {

            this.dragEvent.started = false;

        },

        round: function (pos) {

            var grid = this.options.grid;

            return {
                x: grid * Math.round(pos.x/grid),
                y: grid * Math.round(pos.y/grid)
            };

        },

        getCursor: function (e) {

            return {
                x: (e.targetTouches ? e.targetTouches[0] : e).clientX,
                y: (e.targetTouches ? e.targetTouches[0] : e).clientY
            };

        },

        setCursor: function (xy) {

            this._cursor = xy;

        },

        setLimit: function (limit) {

            var me = this,
                _true = function (x, y) {
                    return { x:x, y:y };
                };

            // limit is a function
            if (isFunction(limit)) {

                me.limit = limit;

            }

            // limit is an element
            else if (isElement(limit)) {

                var draggableSize = me._dimensions,
                    height = limit.scrollHeight - draggableSize.height,
                    width = limit.scrollWidth - draggableSize.width;

                me.limit = function (x, y) {
                    return {
                        x: util.limit(x, [0, width]),
                        y: util.limit(y, [0, height])
                    }
                };

            }

            // limit is defined
            else if (limit) {

                var defined = {
                    x: isDefined(limit.x),
                    y: isDefined(limit.y)
                };
                var _x, _y;

                // {Undefined} limit.x, {Undefined} limit.y
                if (!defined.x && !defined.y) {

                    me.limit = _true;

                } else {

                    me.limit = function (x, y) {
                        return {
                            x: defined.x ? util.limit(x, limit.x) : x,
                            y: defined.y ? util.limit(y, limit.y) : y
                        };
                    };

                }
            }

            // limit is `null` or `undefined`
            else {

                me.limit = _true;

            }

        },

        setPosition: function() {

            var me = this,
                element = me.element,
                style = element.style;

            util.assign(me._dimensions, {
                left: parse(style.left) || element.offsetLeft,
                top: parse(style.top) || element.offsetTop
            });

        },

        setZoom: function() {

            var me = this;
            var element = me.element;
            var zoom = 1;

            while (element = element.offsetParent) {

                var z = getStyle(element).zoom;

                if (z && z !== 'normal') {
                    zoom = z;
                    break;
                }

            }

            me._dimensions.zoom = zoom;

        },

        useTarget: function (element) {

            var filterTarget = this.options.filterTarget;

            if (filterTarget instanceof Function) {
                return filterTarget(element);
            }

            return true;

        },

        destroy: function () {

            util.off(this.element, this.handlers.start);
            util.off(document, this.handlers.move);

        }

    });

    // helpers

    function parse (string) {
        return parseInt(string, 10);
    }

    function getStyle (element) {
        return 'currentStyle' in element ? element.currentStyle : getComputedStyle(element);
    }

    function isArray (thing) {
        return thing instanceof Array; // HTMLElement
    }

    function isDefined (thing) {
        return thing !== void 0 && thing !== null;
    }

    function isElement (thing) {
        return thing instanceof Element || thing instanceof document.constructor;
    }

    function isFunction (thing) {
        return thing instanceof Function;
    }

    function noop (){};

    return Draggable;

}));

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvamJvbmUvZGlzdC9qYm9uZS5qcyIsIm5vZGVfbW9kdWxlcy9yZXZlYWwuanMvanMvcmV2ZWFsLmpzIiwic3JjL2FwcC5qcyIsInNyYy9qcy9jb25zdGFudHMuanMiLCJzcmMvanMvZGV0ZWN0aWUuanMiLCJzcmMvanMvbGliL2RyYWdnYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RpQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4b0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyohXG4gKiBqQm9uZSB2MS4yLjAgLSAyMDE2LTA0LTEzIC0gTGlicmFyeSBmb3IgRE9NIG1hbmlwdWxhdGlvblxuICpcbiAqIGh0dHA6Ly9qYm9uZS5qcy5vcmdcbiAqXG4gKiBDb3B5cmlnaHQgMjAxNiBBbGV4ZXkgS3Vwcml5YW5lbmtvXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKi9cblxuKGZ1bmN0aW9uICh3aW4pIHtcblxudmFyXG4vLyBjYWNoZSBwcmV2aW91cyB2ZXJzaW9uc1xuXyQgPSB3aW4uJCxcbl9qQm9uZSA9IHdpbi5qQm9uZSxcblxuLy8gUXVpY2sgbWF0Y2ggYSBzdGFuZGFsb25lIHRhZ1xucnF1aWNrU2luZ2xlVGFnID0gL148KFxcdyspXFxzKlxcLz8+JC8sXG5cbi8vIEEgc2ltcGxlIHdheSB0byBjaGVjayBmb3IgSFRNTCBzdHJpbmdzXG4vLyBQcmlvcml0aXplICNpZCBvdmVyIDx0YWc+IHRvIGF2b2lkIFhTUyB2aWEgbG9jYXRpb24uaGFzaFxucnF1aWNrRXhwciA9IC9eKD86W14jPF0qKDxbXFx3XFxXXSs+KVtePl0qJHwjKFtcXHdcXC1dKikkKS8sXG5cbi8vIEFsaWFzIGZvciBmdW5jdGlvblxuc2xpY2UgPSBbXS5zbGljZSxcbnNwbGljZSA9IFtdLnNwbGljZSxcbmtleXMgPSBPYmplY3Qua2V5cyxcblxuLy8gQWxpYXMgZm9yIGdsb2JhbCB2YXJpYWJsZXNcbmRvYyA9IGRvY3VtZW50LFxuXG5pc1N0cmluZyA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBlbCA9PT0gXCJzdHJpbmdcIjtcbn0sXG5pc09iamVjdCA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgcmV0dXJuIGVsIGluc3RhbmNlb2YgT2JqZWN0O1xufSxcbmlzRnVuY3Rpb24gPSBmdW5jdGlvbihlbCkge1xuICAgIHJldHVybiAoe30pLnRvU3RyaW5nLmNhbGwoZWwpID09PSBcIltvYmplY3QgRnVuY3Rpb25dXCI7XG59LFxuaXNBcnJheSA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZWwpO1xufSxcbmpCb25lID0gZnVuY3Rpb24oZWxlbWVudCwgZGF0YSkge1xuICAgIHJldHVybiBuZXcgZm4uaW5pdChlbGVtZW50LCBkYXRhKTtcbn0sXG5mbjtcblxuLy8gc2V0IHByZXZpb3VzIHZhbHVlcyBhbmQgcmV0dXJuIHRoZSBpbnN0YW5jZSB1cG9uIGNhbGxpbmcgdGhlIG5vLWNvbmZsaWN0IG1vZGVcbmpCb25lLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICB3aW4uJCA9IF8kO1xuICAgIHdpbi5qQm9uZSA9IF9qQm9uZTtcblxuICAgIHJldHVybiBqQm9uZTtcbn07XG5cbmZuID0gakJvbmUuZm4gPSBqQm9uZS5wcm90b3R5cGUgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWxlbWVudCwgZGF0YSkge1xuICAgICAgICB2YXIgZWxlbWVudHMsIHRhZywgd3JhcGVyLCBmcmFnbWVudDtcblxuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1N0cmluZyhlbGVtZW50KSkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIHNpbmdsZSBET00gZWxlbWVudFxuICAgICAgICAgICAgaWYgKHRhZyA9IHJxdWlja1NpbmdsZVRhZy5leGVjKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgdGhpc1swXSA9IGRvYy5jcmVhdGVFbGVtZW50KHRhZ1sxXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5sZW5ndGggPSAxO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0cihkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIENyZWF0ZSBET00gY29sbGVjdGlvblxuICAgICAgICAgICAgaWYgKCh0YWcgPSBycXVpY2tFeHByLmV4ZWMoZWxlbWVudCkpICYmIHRhZ1sxXSkge1xuICAgICAgICAgICAgICAgIGZyYWdtZW50ID0gZG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgICAgICAgICAgICB3cmFwZXIgPSBkb2MuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICB3cmFwZXIuaW5uZXJIVE1MID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICB3aGlsZSAod3JhcGVyLmxhc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZCh3cmFwZXIuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gc2xpY2UuY2FsbChmcmFnbWVudC5jaGlsZE5vZGVzKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBqQm9uZS5tZXJnZSh0aGlzLCBlbGVtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBGaW5kIERPTSBlbGVtZW50cyB3aXRoIHF1ZXJ5U2VsZWN0b3JBbGxcbiAgICAgICAgICAgIGlmIChqQm9uZS5pc0VsZW1lbnQoZGF0YSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gakJvbmUoZGF0YSkuZmluZChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBlbGVtZW50cyA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGpCb25lLm1lcmdlKHRoaXMsIGVsZW1lbnRzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBXcmFwIERPTUVsZW1lbnRcbiAgICAgICAgaWYgKGVsZW1lbnQubm9kZVR5cGUpIHtcbiAgICAgICAgICAgIHRoaXNbMF0gPSBlbGVtZW50O1xuICAgICAgICAgICAgdGhpcy5sZW5ndGggPSAxO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICAvLyBSdW4gZnVuY3Rpb25cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmV0dXJuIGpCb25lIGVsZW1lbnQgYXMgaXNcbiAgICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBqQm9uZSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gZWxlbWVudCB3cmFwcGVkIGJ5IGpCb25lXG4gICAgICAgIHJldHVybiBqQm9uZS5tYWtlQXJyYXkoZWxlbWVudCwgdGhpcyk7XG4gICAgfSxcblxuICAgIHBvcDogW10ucG9wLFxuICAgIHB1c2g6IFtdLnB1c2gsXG4gICAgcmV2ZXJzZTogW10ucmV2ZXJzZSxcbiAgICBzaGlmdDogW10uc2hpZnQsXG4gICAgc29ydDogW10uc29ydCxcbiAgICBzcGxpY2U6IFtdLnNwbGljZSxcbiAgICBzbGljZTogW10uc2xpY2UsXG4gICAgaW5kZXhPZjogW10uaW5kZXhPZixcbiAgICBmb3JFYWNoOiBbXS5mb3JFYWNoLFxuICAgIHVuc2hpZnQ6IFtdLnVuc2hpZnQsXG4gICAgY29uY2F0OiBbXS5jb25jYXQsXG4gICAgam9pbjogW10uam9pbixcbiAgICBldmVyeTogW10uZXZlcnksXG4gICAgc29tZTogW10uc29tZSxcbiAgICBmaWx0ZXI6IFtdLmZpbHRlcixcbiAgICBtYXA6IFtdLm1hcCxcbiAgICByZWR1Y2U6IFtdLnJlZHVjZSxcbiAgICByZWR1Y2VSaWdodDogW10ucmVkdWNlUmlnaHQsXG4gICAgbGVuZ3RoOiAwXG59O1xuXG5mbi5jb25zdHJ1Y3RvciA9IGpCb25lO1xuXG5mbi5pbml0LnByb3RvdHlwZSA9IGZuO1xuXG5qQm9uZS5zZXRJZCA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgdmFyIGppZCA9IGVsLmppZDtcblxuICAgIGlmIChlbCA9PT0gd2luKSB7XG4gICAgICAgIGppZCA9IFwid2luZG93XCI7XG4gICAgfSBlbHNlIGlmIChlbC5qaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBlbC5qaWQgPSBqaWQgPSArK2pCb25lLl9jYWNoZS5qaWQ7XG4gICAgfVxuXG4gICAgaWYgKCFqQm9uZS5fY2FjaGUuZXZlbnRzW2ppZF0pIHtcbiAgICAgICAgakJvbmUuX2NhY2hlLmV2ZW50c1tqaWRdID0ge307XG4gICAgfVxufTtcblxuakJvbmUuZ2V0RGF0YSA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgZWwgPSBlbCBpbnN0YW5jZW9mIGpCb25lID8gZWxbMF0gOiBlbDtcblxuICAgIHZhciBqaWQgPSBlbCA9PT0gd2luID8gXCJ3aW5kb3dcIiA6IGVsLmppZDtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGppZDogamlkLFxuICAgICAgICBldmVudHM6IGpCb25lLl9jYWNoZS5ldmVudHNbamlkXVxuICAgIH07XG59O1xuXG5qQm9uZS5pc0VsZW1lbnQgPSBmdW5jdGlvbihlbCkge1xuICAgIHJldHVybiBlbCAmJiBlbCBpbnN0YW5jZW9mIGpCb25lIHx8IGVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgaXNTdHJpbmcoZWwpO1xufTtcblxuakJvbmUuX2NhY2hlID0ge1xuICAgIGV2ZW50czoge30sXG4gICAgamlkOiAwXG59O1xuXG5mdW5jdGlvbiBpc0FycmF5bGlrZShvYmopIHtcbiAgICB2YXIgbGVuZ3RoID0gb2JqLmxlbmd0aCxcbiAgICAgICAgdHlwZSA9IHR5cGVvZiBvYmo7XG5cbiAgICBpZiAoaXNGdW5jdGlvbih0eXBlKSB8fCBvYmogPT09IHdpbikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG9iai5ub2RlVHlwZSA9PT0gMSAmJiBsZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzQXJyYXkodHlwZSkgfHwgbGVuZ3RoID09PSAwIHx8XG4gICAgICAgIHR5cGVvZiBsZW5ndGggPT09IFwibnVtYmVyXCIgJiYgbGVuZ3RoID4gMCAmJiAobGVuZ3RoIC0gMSkgaW4gb2JqO1xufVxuXG5mbi5wdXNoU3RhY2sgPSBmdW5jdGlvbihlbGVtcykge1xuICAgIHZhciByZXQgPSBqQm9uZS5tZXJnZSh0aGlzLmNvbnN0cnVjdG9yKCksIGVsZW1zKTtcblxuICAgIHJldHVybiByZXQ7XG59O1xuXG5qQm9uZS5tZXJnZSA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbiAgICB2YXIgbCA9IHNlY29uZC5sZW5ndGgsXG4gICAgICAgIGkgPSBmaXJzdC5sZW5ndGgsXG4gICAgICAgIGogPSAwO1xuXG4gICAgd2hpbGUgKGogPCBsKSB7XG4gICAgICAgIGZpcnN0W2krK10gPSBzZWNvbmRbaisrXTtcbiAgICB9XG5cbiAgICBmaXJzdC5sZW5ndGggPSBpO1xuXG4gICAgcmV0dXJuIGZpcnN0O1xufTtcblxuakJvbmUuY29udGFpbnMgPSBmdW5jdGlvbihjb250YWluZXIsIGNvbnRhaW5lZCkge1xuICAgIHJldHVybiBjb250YWluZXIuY29udGFpbnMoY29udGFpbmVkKTtcbn07XG5cbmpCb25lLmV4dGVuZCA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICAgIHZhciB0ZztcblxuICAgIHNwbGljZS5jYWxsKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbihzb3VyY2UpIHtcbiAgICAgICAgdGcgPSB0YXJnZXQ7IC8vY2FjaGluZyB0YXJnZXQgZm9yIHBlcmYgaW1wcm92ZW1lbnRcblxuICAgICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgIHRnW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcblxuakJvbmUubWFrZUFycmF5ID0gZnVuY3Rpb24oYXJyLCByZXN1bHRzKSB7XG4gICAgdmFyIHJldCA9IHJlc3VsdHMgfHwgW107XG5cbiAgICBpZiAoYXJyICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChpc0FycmF5bGlrZShhcnIpKSB7XG4gICAgICAgICAgICBqQm9uZS5tZXJnZShyZXQsIGlzU3RyaW5nKGFycikgPyBbYXJyXSA6IGFycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXQucHVzaChhcnIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cbmpCb25lLnVuaXF1ZSA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgaWYgKGFycmF5ID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBhcnJheS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgdmFsdWUgPSBhcnJheVtpXTtcbiAgICAgICAgaWYgKHJlc3VsdC5pbmRleE9mKHZhbHVlKSA8IDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuZnVuY3Rpb24gQm9uZUV2ZW50KGUsIGRhdGEpIHtcbiAgICB2YXIga2V5LCBzZXR0ZXI7XG5cbiAgICB0aGlzLm9yaWdpbmFsRXZlbnQgPSBlO1xuXG4gICAgc2V0dGVyID0gZnVuY3Rpb24oa2V5LCBlKSB7XG4gICAgICAgIGlmIChrZXkgPT09IFwicHJldmVudERlZmF1bHRcIikge1xuICAgICAgICAgICAgdGhpc1trZXldID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0UHJldmVudGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZVtrZXldKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25cIikge1xuICAgICAgICAgICAgdGhpc1trZXldID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBlW2tleV0oKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihlW2tleV0pKSB7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZVtrZXldKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpc1trZXldID0gZVtrZXldO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZvciAoa2V5IGluIGUpIHtcbiAgICAgICAgaWYgKGVba2V5XSB8fCB0eXBlb2YgZVtrZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHNldHRlci5jYWxsKHRoaXMsIGtleSwgZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBqQm9uZS5leHRlbmQodGhpcywgZGF0YSwge1xuICAgICAgICBpc0ltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gISF0aGlzLmltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZDtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5qQm9uZS5FdmVudCA9IGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XG4gICAgdmFyIG5hbWVzcGFjZSwgZXZlbnRUeXBlO1xuXG4gICAgaWYgKGV2ZW50LnR5cGUgJiYgIWRhdGEpIHtcbiAgICAgICAgZGF0YSA9IGV2ZW50O1xuICAgICAgICBldmVudCA9IGV2ZW50LnR5cGU7XG4gICAgfVxuXG4gICAgbmFtZXNwYWNlID0gZXZlbnQuc3BsaXQoXCIuXCIpLnNwbGljZSgxKS5qb2luKFwiLlwiKTtcbiAgICBldmVudFR5cGUgPSBldmVudC5zcGxpdChcIi5cIilbMF07XG5cbiAgICBldmVudCA9IGRvYy5jcmVhdGVFdmVudChcIkV2ZW50XCIpO1xuICAgIGV2ZW50LmluaXRFdmVudChldmVudFR5cGUsIHRydWUsIHRydWUpO1xuXG4gICAgcmV0dXJuIGpCb25lLmV4dGVuZChldmVudCwge1xuICAgICAgICBuYW1lc3BhY2U6IG5hbWVzcGFjZSxcbiAgICAgICAgaXNEZWZhdWx0UHJldmVudGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBldmVudC5kZWZhdWx0UHJldmVudGVkO1xuICAgICAgICB9XG4gICAgfSwgZGF0YSk7XG59O1xuXG5qQm9uZS5ldmVudCA9IHtcblxuICAgIC8qKlxuICAgICAqIEF0dGFjaCBhIGhhbmRsZXIgdG8gYW4gZXZlbnQgZm9yIHRoZSBlbGVtZW50c1xuICAgICAqIEBwYXJhbSB7Tm9kZX0gICAgICAgIGVsICAgICAgICAgLSBFdmVudHMgd2lsbCBiZSBhdHRhY2hlZCB0byB0aGlzIERPTSBOb2RlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgdHlwZXMgICAgICAtIE9uZSBvciBtb3JlIHNwYWNlLXNlcGFyYXRlZCBldmVudCB0eXBlcyBhbmQgb3B0aW9uYWwgbmFtZXNwYWNlc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259ICAgIGhhbmRsZXIgICAgLSBBIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkXG4gICAgICogQHBhcmFtIHtPYmplY3R9ICAgICAgW2RhdGFdICAgICAtIERhdGEgdG8gYmUgcGFzc2VkIHRvIHRoZSBoYW5kbGVyIGluIGV2ZW50LmRhdGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICBbc2VsZWN0b3JdIC0gQSBzZWxlY3RvciBzdHJpbmcgdG8gZmlsdGVyIHRoZSBkZXNjZW5kYW50cyBvZiB0aGUgc2VsZWN0ZWQgZWxlbWVudHNcbiAgICAgKi9cbiAgICBhZGQ6IGZ1bmN0aW9uKGVsLCB0eXBlcywgaGFuZGxlciwgZGF0YSwgc2VsZWN0b3IpIHtcbiAgICAgICAgakJvbmUuc2V0SWQoZWwpO1xuXG4gICAgICAgIHZhciBldmVudEhhbmRsZXIgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgakJvbmUuZXZlbnQuZGlzcGF0Y2guY2FsbChlbCwgZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXZlbnRzID0gakJvbmUuZ2V0RGF0YShlbCkuZXZlbnRzLFxuICAgICAgICAgICAgZXZlbnRUeXBlLCB0LCBldmVudDtcblxuICAgICAgICB0eXBlcyA9IHR5cGVzLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgdCA9IHR5cGVzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKHQtLSkge1xuICAgICAgICAgICAgZXZlbnQgPSB0eXBlc1t0XTtcblxuICAgICAgICAgICAgZXZlbnRUeXBlID0gZXZlbnQuc3BsaXQoXCIuXCIpWzBdO1xuICAgICAgICAgICAgZXZlbnRzW2V2ZW50VHlwZV0gPSBldmVudHNbZXZlbnRUeXBlXSB8fCBbXTtcblxuICAgICAgICAgICAgaWYgKGV2ZW50c1tldmVudFR5cGVdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIC8vIG92ZXJyaWRlIHdpdGggcHJldmlvdXMgZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgICAgIGV2ZW50SGFuZGxlciA9IGV2ZW50c1tldmVudFR5cGVdWzBdLmZuO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyICYmIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBldmVudEhhbmRsZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXZlbnRzW2V2ZW50VHlwZV0ucHVzaCh7XG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlOiBldmVudC5zcGxpdChcIi5cIikuc3BsaWNlKDEpLmpvaW4oXCIuXCIpLFxuICAgICAgICAgICAgICAgIGZuOiBldmVudEhhbmRsZXIsXG4gICAgICAgICAgICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICAgICAgb3JpZ2luZm46IGhhbmRsZXJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbiBldmVudCBoYW5kbGVyXG4gICAgICogQHBhcmFtICB7Tm9kZX0gICAgICAgZWwgICAgICAgIC0gRXZlbnRzIHdpbGwgYmUgZGVhdHRhY2hlZCBmcm9tIHRoaXMgRE9NIE5vZGVcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICB0eXBlcyAgICAgLSBPbmUgb3IgbW9yZSBzcGFjZS1zZXBhcmF0ZWQgZXZlbnQgdHlwZXMgYW5kIG9wdGlvbmFsIG5hbWVzcGFjZXNcbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gICBoYW5kbGVyICAgLSBBIGhhbmRsZXIgZnVuY3Rpb24gcHJldmlvdXNseSBhdHRhY2hlZCBmb3IgdGhlIGV2ZW50KHMpXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSAgICAgW3NlbGVjdG9yXSAtIEEgc2VsZWN0b3Igc3RyaW5nIHRvIGZpbHRlciB0aGUgZGVzY2VuZGFudHMgb2YgdGhlIHNlbGVjdGVkIGVsZW1lbnRzXG4gICAgICovXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihlbCwgdHlwZXMsIGhhbmRsZXIsIHNlbGVjdG9yKSB7XG4gICAgICAgIHZhciByZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50cywgZXZlbnRUeXBlLCBpbmRleCwgZWwsIGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2s7XG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICBpZiAoKGhhbmRsZXIgJiYgZS5vcmlnaW5mbiA9PT0gaGFuZGxlcikgfHwgIWhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBlLmZuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChldmVudHNbZXZlbnRUeXBlXVtpbmRleF0uZm4gPT09IGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBoYW5kbGVyIGZyb20gY2FjaGVcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzW2V2ZW50VHlwZV0uc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWV2ZW50c1tldmVudFR5cGVdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudHMgPSBqQm9uZS5nZXREYXRhKGVsKS5ldmVudHMsXG4gICAgICAgICAgICBsLFxuICAgICAgICAgICAgZXZlbnRzQnlUeXBlO1xuXG4gICAgICAgIGlmICghZXZlbnRzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgYWxsIGV2ZW50c1xuICAgICAgICBpZiAoIXR5cGVzICYmIGV2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuIGtleXMoZXZlbnRzKS5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50VHlwZSkge1xuICAgICAgICAgICAgICAgIGV2ZW50c0J5VHlwZSA9IGV2ZW50c1tldmVudFR5cGVdO1xuICAgICAgICAgICAgICAgIGwgPSBldmVudHNCeVR5cGUubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgd2hpbGUobC0tKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGV2ZW50cywgZXZlbnRUeXBlLCBsLCBlbCwgZXZlbnRzQnlUeXBlW2xdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHR5cGVzLnNwbGl0KFwiIFwiKS5mb3JFYWNoKGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgdmFyIGV2ZW50VHlwZSA9IGV2ZW50TmFtZS5zcGxpdChcIi5cIilbMF0sXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlID0gZXZlbnROYW1lLnNwbGl0KFwiLlwiKS5zcGxpY2UoMSkuam9pbihcIi5cIiksXG4gICAgICAgICAgICAgICAgZTtcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIG5hbWVkIGV2ZW50c1xuICAgICAgICAgICAgaWYgKGV2ZW50c1tldmVudFR5cGVdKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRzQnlUeXBlID0gZXZlbnRzW2V2ZW50VHlwZV07XG4gICAgICAgICAgICAgICAgbCA9IGV2ZW50c0J5VHlwZS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICB3aGlsZShsLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgZSA9IGV2ZW50c0J5VHlwZVtsXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCghbmFtZXNwYWNlIHx8IChuYW1lc3BhY2UgJiYgZS5uYW1lc3BhY2UgPT09IG5hbWVzcGFjZSkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAoIXNlbGVjdG9yICB8fCAoc2VsZWN0b3IgICYmIGUuc2VsZWN0b3IgPT09IHNlbGVjdG9yKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUxpc3RlbmVyKGV2ZW50cywgZXZlbnRUeXBlLCBsLCBlbCwgZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZW1vdmUgYWxsIG5hbWVzcGFjZWQgZXZlbnRzXG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lc3BhY2UpIHtcbiAgICAgICAgICAgICAgICBrZXlzKGV2ZW50cykuZm9yRWFjaChmdW5jdGlvbihldmVudFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzQnlUeXBlID0gZXZlbnRzW2V2ZW50VHlwZV07XG4gICAgICAgICAgICAgICAgICAgIGwgPSBldmVudHNCeVR5cGUubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlKGwtLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZSA9IGV2ZW50c0J5VHlwZVtsXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLm5hbWVzcGFjZS5zcGxpdChcIi5cIilbMF0gPT09IG5hbWVzcGFjZS5zcGxpdChcIi5cIilbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVMaXN0ZW5lcihldmVudHMsIGV2ZW50VHlwZSwgbCwgZWwsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGFsbCBoYW5kbGVycyBhbmQgYmVoYXZpb3JzIGF0dGFjaGVkIHRvIHRoZSBtYXRjaGVkIGVsZW1lbnRzIGZvciB0aGUgZ2l2ZW4gZXZlbnQgdHlwZS5cbiAgICAgKiBAcGFyYW0gIHtOb2RlfSAgICAgICBlbCAgICAgICAtIEV2ZW50cyB3aWxsIGJlIHRyaWdnZXJlZCBmb3IgdGhpZSBET00gTm9kZVxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gICAgIGV2ZW50ICAgIC0gT25lIG9yIG1vcmUgc3BhY2Utc2VwYXJhdGVkIGV2ZW50IHR5cGVzIGFuZCBvcHRpb25hbCBuYW1lc3BhY2VzXG4gICAgICovXG4gICAgdHJpZ2dlcjogZnVuY3Rpb24oZWwsIGV2ZW50KSB7XG4gICAgICAgIHZhciBldmVudHMgPSBbXTtcblxuICAgICAgICBpZiAoaXNTdHJpbmcoZXZlbnQpKSB7XG4gICAgICAgICAgICBldmVudHMgPSBldmVudC5zcGxpdChcIiBcIikubWFwKGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGpCb25lLkV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXZlbnQgPSBldmVudCBpbnN0YW5jZW9mIEV2ZW50ID8gZXZlbnQgOiBqQm9uZS5FdmVudChldmVudCk7XG4gICAgICAgICAgICBldmVudHMgPSBbZXZlbnRdO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnRzLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICghZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudCAmJiBlbC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICAgIGogPSAwLFxuICAgICAgICAgICAgZWwgPSB0aGlzLFxuICAgICAgICAgICAgaGFuZGxlcnMgPSBqQm9uZS5nZXREYXRhKGVsKS5ldmVudHNbZS50eXBlXSxcbiAgICAgICAgICAgIGxlbmd0aCA9IGhhbmRsZXJzLmxlbmd0aCxcbiAgICAgICAgICAgIGhhbmRsZXJRdWV1ZSA9IFtdLFxuICAgICAgICAgICAgdGFyZ2V0cyA9IFtdLFxuICAgICAgICAgICAgbCxcbiAgICAgICAgICAgIGV4cGVjdGVkVGFyZ2V0LFxuICAgICAgICAgICAgaGFuZGxlcixcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgZXZlbnRPcHRpb25zO1xuXG4gICAgICAgIC8vIGNhY2hlIGFsbCBldmVudHMgaGFuZGxlcnMsIGZpeCBpc3N1ZSB3aXRoIG11bHRpcGxlIGhhbmRsZXJzIChpc3N1ZSAjNDUpXG4gICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhbmRsZXJRdWV1ZS5wdXNoKGhhbmRsZXJzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGkgPSAwO1xuICAgICAgICBsZW5ndGggPSBoYW5kbGVyUXVldWUubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoO1xuICAgICAgICAgICAgLy8gaWYgZXZlbnQgZXhpc3RzXG4gICAgICAgICAgICBpIDwgbGVuZ3RoICYmXG4gICAgICAgICAgICAvLyBpZiBoYW5kbGVyIGlzIG5vdCByZW1vdmVkIGZyb20gc3RhY2tcbiAgICAgICAgICAgIH5oYW5kbGVycy5pbmRleE9mKGhhbmRsZXJRdWV1ZVtpXSkgJiZcbiAgICAgICAgICAgIC8vIGlmIHByb3BhZ2F0aW9uIGlzIG5vdCBzdG9wcGVkXG4gICAgICAgICAgICAhKGV2ZW50ICYmIGV2ZW50LmlzSW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkKCkpO1xuICAgICAgICBpKyspIHtcbiAgICAgICAgICAgIGV4cGVjdGVkVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgICAgIGV2ZW50T3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgaGFuZGxlciA9IGhhbmRsZXJRdWV1ZVtpXTtcbiAgICAgICAgICAgIGhhbmRsZXIuZGF0YSAmJiAoZXZlbnRPcHRpb25zLmRhdGEgPSBoYW5kbGVyLmRhdGEpO1xuXG4gICAgICAgICAgICAvLyBldmVudCBoYW5kbGVyIHdpdGhvdXQgc2VsZWN0b3JcbiAgICAgICAgICAgIGlmICghaGFuZGxlci5zZWxlY3Rvcikge1xuICAgICAgICAgICAgICAgIGV2ZW50ID0gbmV3IEJvbmVFdmVudChlLCBldmVudE9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoZS5uYW1lc3BhY2UgJiYgZS5uYW1lc3BhY2UgIT09IGhhbmRsZXIubmFtZXNwYWNlKSkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLm9yaWdpbmZuLmNhbGwoZWwsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBldmVudCBoYW5kbGVyIHdpdGggc2VsZWN0b3JcbiAgICAgICAgICAgIGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIC8vIGlmIHRhcmdldCBhbmQgc2VsZWN0ZWQgZWxlbWVudCB0aGUgc2FtZVxuICAgICAgICAgICAgICAgIH4odGFyZ2V0cyA9IGpCb25lKGVsKS5maW5kKGhhbmRsZXIuc2VsZWN0b3IpKS5pbmRleE9mKGUudGFyZ2V0KSAmJiAoZXhwZWN0ZWRUYXJnZXQgPSBlLnRhcmdldCkgfHxcbiAgICAgICAgICAgICAgICAvLyBpZiBvbmUgb2YgZWxlbWVudCBtYXRjaGVkIHdpdGggc2VsZWN0b3IgY29udGFpbnMgdGFyZ2V0XG4gICAgICAgICAgICAgICAgKGVsICE9PSBlLnRhcmdldCAmJiBlbC5jb250YWlucyhlLnRhcmdldCkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBnZXQgZWxlbWVudCBtYXRjaGVkIHdpdGggc2VsZWN0b3JcbiAgICAgICAgICAgICAgICBpZiAoIWV4cGVjdGVkVGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGwgPSB0YXJnZXRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaiA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICg7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRzW2pdICYmIHRhcmdldHNbal0uY29udGFpbnMoZS50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWRUYXJnZXQgPSB0YXJnZXRzW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFleHBlY3RlZFRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBldmVudE9wdGlvbnMuY3VycmVudFRhcmdldCA9IGV4cGVjdGVkVGFyZ2V0O1xuICAgICAgICAgICAgICAgIGV2ZW50ID0gbmV3IEJvbmVFdmVudChlLCBldmVudE9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoZS5uYW1lc3BhY2UgJiYgZS5uYW1lc3BhY2UgIT09IGhhbmRsZXIubmFtZXNwYWNlKSkge1xuICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLm9yaWdpbmZuLmNhbGwoZXhwZWN0ZWRUYXJnZXQsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mbi5vbiA9IGZ1bmN0aW9uKHR5cGVzLCBzZWxlY3RvciwgZGF0YSwgZm4pIHtcbiAgICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIGkgPSAwO1xuXG4gICAgaWYgKGRhdGEgPT0gbnVsbCAmJiBmbiA9PSBudWxsKSB7XG4gICAgICAgIC8vICh0eXBlcywgZm4pXG4gICAgICAgIGZuID0gc2VsZWN0b3I7XG4gICAgICAgIGRhdGEgPSBzZWxlY3RvciA9IHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKGZuID09IG51bGwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgLy8gKHR5cGVzLCBzZWxlY3RvciwgZm4pXG4gICAgICAgICAgICBmbiA9IGRhdGE7XG4gICAgICAgICAgICBkYXRhID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gKHR5cGVzLCBkYXRhLCBmbilcbiAgICAgICAgICAgIGZuID0gZGF0YTtcbiAgICAgICAgICAgIGRhdGEgPSBzZWxlY3RvcjtcbiAgICAgICAgICAgIHNlbGVjdG9yID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFmbikge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGpCb25lLmV2ZW50LmFkZCh0aGlzW2ldLCB0eXBlcywgZm4sIGRhdGEsIHNlbGVjdG9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLm9uZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgb25lQXJncyA9IHNsaWNlLmNhbGwoYXJncywgMSwgYXJncy5sZW5ndGggLSAxKSxcbiAgICAgICAgY2FsbGJhY2sgPSBzbGljZS5jYWxsKGFyZ3MsIC0xKVswXSxcbiAgICAgICAgYWRkTGlzdGVuZXI7XG5cbiAgICBhZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHZhciAkZWwgPSBqQm9uZShlbCk7XG5cbiAgICAgICAgZXZlbnQuc3BsaXQoXCIgXCIpLmZvckVhY2goZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBmbiA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAkZWwub2ZmKGV2ZW50LCBmbik7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChlbCwgZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkZWwub24uYXBwbHkoJGVsLCBbZXZlbnRdLmNvbmNhdChvbmVBcmdzLCBmbikpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBhZGRMaXN0ZW5lcih0aGlzW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLnRyaWdnZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICBpZiAoIWV2ZW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgakJvbmUuZXZlbnQudHJpZ2dlcih0aGlzW2ldLCBldmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5vZmYgPSBmdW5jdGlvbih0eXBlcywgc2VsZWN0b3IsIGhhbmRsZXIpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oc2VsZWN0b3IpKSB7XG4gICAgICAgIGhhbmRsZXIgPSBzZWxlY3RvcjtcbiAgICAgICAgc2VsZWN0b3IgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBqQm9uZS5ldmVudC5yZW1vdmUodGhpc1tpXSwgdHlwZXMsIGhhbmRsZXIsIHNlbGVjdG9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLmZpbmQgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgIHZhciByZXN1bHRzID0gW10sXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgZmluZGVyID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKGVsLnF1ZXJ5U2VsZWN0b3JBbGwpKSB7XG4gICAgICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLCBmdW5jdGlvbihmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goZm91bmQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBmaW5kZXIodGhpc1tpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGpCb25lKHJlc3VsdHMpO1xufTtcblxuZm4uZ2V0ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gaW5kZXggIT0gbnVsbCA/XG5cbiAgICAgICAgLy8gUmV0dXJuIGp1c3Qgb25lIGVsZW1lbnQgZnJvbSB0aGUgc2V0XG4gICAgICAgIChpbmRleCA8IDAgPyB0aGlzW2luZGV4ICsgdGhpcy5sZW5ndGhdIDogdGhpc1tpbmRleF0pIDpcblxuICAgICAgICAvLyBSZXR1cm4gYWxsIHRoZSBlbGVtZW50cyBpbiBhIGNsZWFuIGFycmF5XG4gICAgICAgIHNsaWNlLmNhbGwodGhpcyk7XG59O1xuXG5mbi5lcSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgcmV0dXJuIGpCb25lKHRoaXNbaW5kZXhdKTtcbn07XG5cbmZuLnBhcmVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXN1bHRzID0gW10sXG4gICAgICAgIHBhcmVudCxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIX5yZXN1bHRzLmluZGV4T2YocGFyZW50ID0gdGhpc1tpXS5wYXJlbnRFbGVtZW50KSAmJiBwYXJlbnQpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChwYXJlbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGpCb25lKHJlc3VsdHMpO1xufTtcblxuZm4udG9BcnJheSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzbGljZS5jYWxsKHRoaXMpO1xufTtcblxuZm4uaXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcblxuICAgIHJldHVybiB0aGlzLnNvbWUoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgcmV0dXJuIGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gYXJnc1swXTtcbiAgICB9KTtcbn07XG5cbmZuLmhhcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuXG4gICAgcmV0dXJuIHRoaXMuc29tZShmdW5jdGlvbihlbCkge1xuICAgICAgICByZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbChhcmdzWzBdKS5sZW5ndGg7XG4gICAgfSk7XG59O1xuXG5mbi5hZGQgPSBmdW5jdGlvbihzZWxlY3RvciwgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLnB1c2hTdGFjayhcbiAgICAgICAgakJvbmUudW5pcXVlKFxuICAgICAgICAgICAgakJvbmUubWVyZ2UodGhpcy5nZXQoKSwgakJvbmUoc2VsZWN0b3IsIGNvbnRleHQpKVxuICAgICAgICApXG4gICAgKTtcbn07XG5cbmZuLmF0dHIgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgc2V0dGVyO1xuXG4gICAgaWYgKGlzU3RyaW5nKGtleSkgJiYgYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbMF0gJiYgdGhpc1swXS5nZXRBdHRyaWJ1dGUoa2V5KTtcbiAgICB9XG5cbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgc2V0dGVyID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGtleSkpIHtcbiAgICAgICAgc2V0dGVyID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGtleXMoa2V5KS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUobmFtZSwga2V5W25hbWVdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2V0dGVyKHRoaXNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4ucmVtb3ZlQXR0ciA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHRoaXNbaV0ucmVtb3ZlQXR0cmlidXRlKGtleSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi52YWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpc1swXSAmJiB0aGlzWzBdLnZhbHVlO1xuICAgIH1cblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpc1tpXS52YWx1ZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4uY3NzID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIHNldHRlcjtcblxuICAgIC8vIEdldCBhdHRyaWJ1dGVcbiAgICBpZiAoaXNTdHJpbmcoa2V5KSAmJiBhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gdGhpc1swXSAmJiB3aW4uZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzWzBdKVtrZXldO1xuICAgIH1cblxuICAgIC8vIFNldCBhdHRyaWJ1dGVzXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHNldHRlciA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBlbC5zdHlsZVtrZXldID0gdmFsdWU7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmIChpc09iamVjdChrZXkpKSB7XG4gICAgICAgIHNldHRlciA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICBrZXlzKGtleSkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGVbbmFtZV0gPSBrZXlbbmFtZV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNldHRlcih0aGlzW2ldKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLmRhdGEgPSBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsIGRhdGEgPSB7fSxcbiAgICAgICAgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBzZXR0ZXIsXG4gICAgICAgIHNldFZhbHVlID0gZnVuY3Rpb24oZWwsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgICAgIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBlbC5qZGF0YSA9IGVsLmpkYXRhIHx8IHt9O1xuICAgICAgICAgICAgICAgIGVsLmpkYXRhW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWwuZGF0YXNldFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGdldFZhbHVlID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09IFwiZmFsc2VcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgLy8gR2V0IGFsbCBkYXRhXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXNbMF0uamRhdGEgJiYgKGRhdGEgPSB0aGlzWzBdLmpkYXRhKTtcblxuICAgICAgICBrZXlzKHRoaXNbMF0uZGF0YXNldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICAgIGRhdGFba2V5XSA9IGdldFZhbHVlKHRoaXNbMF0uZGF0YXNldFtrZXldKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIC8vIEdldCBkYXRhIGJ5IG5hbWVcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDEgJiYgaXNTdHJpbmcoa2V5KSkge1xuICAgICAgICByZXR1cm4gdGhpc1swXSAmJiBnZXRWYWx1ZSh0aGlzWzBdLmRhdGFzZXRba2V5XSB8fCB0aGlzWzBdLmpkYXRhICYmIHRoaXNbMF0uamRhdGFba2V5XSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IGRhdGFcbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDEgJiYgaXNPYmplY3Qoa2V5KSkge1xuICAgICAgICBzZXR0ZXIgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAga2V5cyhrZXkpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICAgICAgICAgIHNldFZhbHVlKGVsLCBuYW1lLCBrZXlbbmFtZV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBzZXR0ZXIgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgc2V0VmFsdWUoZWwsIGtleSwgdmFsdWUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2V0dGVyKHRoaXNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4ucmVtb3ZlRGF0YSA9IGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIGpkYXRhLCBkYXRhc2V0O1xuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBqZGF0YSA9IHRoaXNbaV0uamRhdGE7XG4gICAgICAgIGRhdGFzZXQgPSB0aGlzW2ldLmRhdGFzZXQ7XG5cbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgamRhdGEgJiYgamRhdGFba2V5XSAmJiBkZWxldGUgamRhdGFba2V5XTtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhc2V0W2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBqZGF0YSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBqZGF0YVtrZXldO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBkYXRhc2V0KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFzZXRba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4uYWRkQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGogPSAwLFxuICAgICAgICBsZW5ndGggPSB0aGlzLmxlbmd0aCxcbiAgICAgICAgY2xhc3NlcyA9IGNsYXNzTmFtZSA/IGNsYXNzTmFtZS50cmltKCkuc3BsaXQoL1xccysvKSA6IFtdO1xuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBqID0gMDtcblxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgY2xhc3Nlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdGhpc1tpXS5jbGFzc0xpc3QuYWRkKGNsYXNzZXNbal0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgaiA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBjbGFzc2VzID0gY2xhc3NOYW1lID8gY2xhc3NOYW1lLnRyaW0oKS5zcGxpdCgvXFxzKy8pIDogW107XG5cbiAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGogPSAwO1xuXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBjbGFzc2VzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB0aGlzW2ldLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3Nlc1tqXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLnRvZ2dsZUNsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lLCBmb3JjZSkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIG1ldGhvZCA9IFwidG9nZ2xlXCI7XG5cbiAgICBmb3JjZSA9PT0gdHJ1ZSAmJiAobWV0aG9kID0gXCJhZGRcIikgfHwgZm9yY2UgPT09IGZhbHNlICYmIChtZXRob2QgPSBcInJlbW92ZVwiKTtcblxuICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpc1tpXS5jbGFzc0xpc3RbbWV0aG9kXShjbGFzc05hbWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5oYXNDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSkge1xuICAgIHZhciBpID0gMCwgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG5cbiAgICBpZiAoY2xhc3NOYW1lKSB7XG4gICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzW2ldLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5mbi5odG1sID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgZWw7XG5cbiAgICAvLyBhZGQgSFRNTCBpbnRvIGVsZW1lbnRzXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZW1wdHkoKS5hcHBlbmQodmFsdWUpO1xuICAgIH1cbiAgICAvLyBnZXQgSFRNTCBmcm9tIGVsZW1lbnRcbiAgICBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMCAmJiAoZWwgPSB0aGlzWzBdKSkge1xuICAgICAgICByZXR1cm4gZWwuaW5uZXJIVE1MO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4uYXBwZW5kID0gZnVuY3Rpb24oYXBwZW5kZWQpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBzZXR0ZXI7XG5cbiAgICAvLyBjcmVhdGUgakJvbmUgb2JqZWN0IGFuZCB0aGVuIGFwcGVuZFxuICAgIGlmIChpc1N0cmluZyhhcHBlbmRlZCkgJiYgcnF1aWNrRXhwci5leGVjKGFwcGVuZGVkKSkge1xuICAgICAgICBhcHBlbmRlZCA9IGpCb25lKGFwcGVuZGVkKTtcbiAgICB9XG4gICAgLy8gY3JlYXRlIHRleHQgbm9kZSBmb3IgaW5zZXJ0aW9uXG4gICAgZWxzZSBpZiAoIWlzT2JqZWN0KGFwcGVuZGVkKSkge1xuICAgICAgICBhcHBlbmRlZCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFwcGVuZGVkKTtcbiAgICB9XG5cbiAgICBhcHBlbmRlZCA9IGFwcGVuZGVkIGluc3RhbmNlb2YgakJvbmUgPyBhcHBlbmRlZCA6IGpCb25lKGFwcGVuZGVkKTtcblxuICAgIHNldHRlciA9IGZ1bmN0aW9uKGVsLCBpKSB7XG4gICAgICAgIGFwcGVuZGVkLmZvckVhY2goZnVuY3Rpb24obm9kZSkge1xuICAgICAgICAgICAgaWYgKGkpIHtcbiAgICAgICAgICAgICAgICBlbC5hcHBlbmRDaGlsZChub2RlLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsLmFwcGVuZENoaWxkKG5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBzZXR0ZXIodGhpc1tpXSwgaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG5mbi5hcHBlbmRUbyA9IGZ1bmN0aW9uKHRvKSB7XG4gICAgakJvbmUodG8pLmFwcGVuZCh0aGlzKTtcblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuZm4uZW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuICAgICAgICBlbDtcblxuICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZWwgPSB0aGlzW2ldO1xuXG4gICAgICAgIHdoaWxlIChlbC5sYXN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUNoaWxkKGVsLmxhc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmZuLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGgsXG4gICAgICAgIGVsO1xuXG4gICAgLy8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnNcbiAgICB0aGlzLm9mZigpO1xuXG4gICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBlbCA9IHRoaXNbaV07XG5cbiAgICAgICAgLy8gcmVtb3ZlIGRhdGEgYW5kIG5vZGVzXG4gICAgICAgIGRlbGV0ZSBlbC5qZGF0YTtcbiAgICAgICAgZWwucGFyZW50Tm9kZSAmJiBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbn07XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIG1vZHVsZSAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICAvLyBFeHBvc2UgakJvbmUgYXMgbW9kdWxlLmV4cG9ydHMgaW4gbG9hZGVycyB0aGF0IGltcGxlbWVudCB0aGUgTm9kZVxuICAgIC8vIG1vZHVsZSBwYXR0ZXJuIChpbmNsdWRpbmcgYnJvd3NlcmlmeSkuIERvIG5vdCBjcmVhdGUgdGhlIGdsb2JhbCwgc2luY2VcbiAgICAvLyB0aGUgdXNlciB3aWxsIGJlIHN0b3JpbmcgaXQgdGhlbXNlbHZlcyBsb2NhbGx5LCBhbmQgZ2xvYmFscyBhcmUgZnJvd25lZFxuICAgIC8vIHVwb24gaW4gdGhlIE5vZGUgbW9kdWxlIHdvcmxkLlxuICAgIG1vZHVsZS5leHBvcnRzID0gakJvbmU7XG59XG4vLyBSZWdpc3RlciBhcyBhIEFNRCBtb2R1bGVcbmVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gakJvbmU7XG4gICAgfSk7XG5cbiAgICB3aW4uakJvbmUgPSB3aW4uJCA9IGpCb25lO1xufSBlbHNlIGlmICh0eXBlb2Ygd2luID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiB3aW4uZG9jdW1lbnQgPT09IFwib2JqZWN0XCIpIHtcbiAgICB3aW4uakJvbmUgPSB3aW4uJCA9IGpCb25lO1xufVxuXG59KHdpbmRvdykpO1xuIiwiLyohXG4gKiByZXZlYWwuanNcbiAqIGh0dHA6Ly9sYWIuaGFraW0uc2UvcmV2ZWFsLWpzXG4gKiBNSVQgbGljZW5zZWRcbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgSGFraW0gRWwgSGF0dGFiLCBodHRwOi8vaGFraW0uc2VcbiAqL1xuKGZ1bmN0aW9uKCByb290LCBmYWN0b3J5ICkge1xuXHRpZiggdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kICkge1xuXHRcdC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cblx0XHRkZWZpbmUoIGZ1bmN0aW9uKCkge1xuXHRcdFx0cm9vdC5SZXZlYWwgPSBmYWN0b3J5KCk7XG5cdFx0XHRyZXR1cm4gcm9vdC5SZXZlYWw7XG5cdFx0fSApO1xuXHR9IGVsc2UgaWYoIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyApIHtcblx0XHQvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLlxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHR9IGVsc2Uge1xuXHRcdC8vIEJyb3dzZXIgZ2xvYmFscy5cblx0XHRyb290LlJldmVhbCA9IGZhY3RvcnkoKTtcblx0fVxufSggdGhpcywgZnVuY3Rpb24oKSB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBSZXZlYWw7XG5cblx0Ly8gVGhlIHJldmVhbC5qcyB2ZXJzaW9uXG5cdHZhciBWRVJTSU9OID0gJzMuMy4wJztcblxuXHR2YXIgU0xJREVTX1NFTEVDVE9SID0gJy5zbGlkZXMgc2VjdGlvbicsXG5cdFx0SE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgPSAnLnNsaWRlcz5zZWN0aW9uJyxcblx0XHRWRVJUSUNBTF9TTElERVNfU0VMRUNUT1IgPSAnLnNsaWRlcz5zZWN0aW9uLnByZXNlbnQ+c2VjdGlvbicsXG5cdFx0SE9NRV9TTElERV9TRUxFQ1RPUiA9ICcuc2xpZGVzPnNlY3Rpb246Zmlyc3Qtb2YtdHlwZScsXG5cdFx0VUEgPSBuYXZpZ2F0b3IudXNlckFnZW50LFxuXG5cdFx0Ly8gQ29uZmlndXJhdGlvbiBkZWZhdWx0cywgY2FuIGJlIG92ZXJyaWRkZW4gYXQgaW5pdGlhbGl6YXRpb24gdGltZVxuXHRcdGNvbmZpZyA9IHtcblxuXHRcdFx0Ly8gVGhlIFwibm9ybWFsXCIgc2l6ZSBvZiB0aGUgcHJlc2VudGF0aW9uLCBhc3BlY3QgcmF0aW8gd2lsbCBiZSBwcmVzZXJ2ZWRcblx0XHRcdC8vIHdoZW4gdGhlIHByZXNlbnRhdGlvbiBpcyBzY2FsZWQgdG8gZml0IGRpZmZlcmVudCByZXNvbHV0aW9uc1xuXHRcdFx0d2lkdGg6IDk2MCxcblx0XHRcdGhlaWdodDogNzAwLFxuXG5cdFx0XHQvLyBGYWN0b3Igb2YgdGhlIGRpc3BsYXkgc2l6ZSB0aGF0IHNob3VsZCByZW1haW4gZW1wdHkgYXJvdW5kIHRoZSBjb250ZW50XG5cdFx0XHRtYXJnaW46IDAuMSxcblxuXHRcdFx0Ly8gQm91bmRzIGZvciBzbWFsbGVzdC9sYXJnZXN0IHBvc3NpYmxlIHNjYWxlIHRvIGFwcGx5IHRvIGNvbnRlbnRcblx0XHRcdG1pblNjYWxlOiAwLjIsXG5cdFx0XHRtYXhTY2FsZTogMS41LFxuXG5cdFx0XHQvLyBEaXNwbGF5IGNvbnRyb2xzIGluIHRoZSBib3R0b20gcmlnaHQgY29ybmVyXG5cdFx0XHRjb250cm9sczogdHJ1ZSxcblxuXHRcdFx0Ly8gRGlzcGxheSBhIHByZXNlbnRhdGlvbiBwcm9ncmVzcyBiYXJcblx0XHRcdHByb2dyZXNzOiB0cnVlLFxuXG5cdFx0XHQvLyBEaXNwbGF5IHRoZSBwYWdlIG51bWJlciBvZiB0aGUgY3VycmVudCBzbGlkZVxuXHRcdFx0c2xpZGVOdW1iZXI6IGZhbHNlLFxuXG5cdFx0XHQvLyBQdXNoIGVhY2ggc2xpZGUgY2hhbmdlIHRvIHRoZSBicm93c2VyIGhpc3Rvcnlcblx0XHRcdGhpc3Rvcnk6IGZhbHNlLFxuXG5cdFx0XHQvLyBFbmFibGUga2V5Ym9hcmQgc2hvcnRjdXRzIGZvciBuYXZpZ2F0aW9uXG5cdFx0XHRrZXlib2FyZDogdHJ1ZSxcblxuXHRcdFx0Ly8gT3B0aW9uYWwgZnVuY3Rpb24gdGhhdCBibG9ja3Mga2V5Ym9hcmQgZXZlbnRzIHdoZW4gcmV0dW5pbmcgZmFsc2Vcblx0XHRcdGtleWJvYXJkQ29uZGl0aW9uOiBudWxsLFxuXG5cdFx0XHQvLyBFbmFibGUgdGhlIHNsaWRlIG92ZXJ2aWV3IG1vZGVcblx0XHRcdG92ZXJ2aWV3OiB0cnVlLFxuXG5cdFx0XHQvLyBWZXJ0aWNhbCBjZW50ZXJpbmcgb2Ygc2xpZGVzXG5cdFx0XHRjZW50ZXI6IHRydWUsXG5cblx0XHRcdC8vIEVuYWJsZXMgdG91Y2ggbmF2aWdhdGlvbiBvbiBkZXZpY2VzIHdpdGggdG91Y2ggaW5wdXRcblx0XHRcdHRvdWNoOiB0cnVlLFxuXG5cdFx0XHQvLyBMb29wIHRoZSBwcmVzZW50YXRpb25cblx0XHRcdGxvb3A6IGZhbHNlLFxuXG5cdFx0XHQvLyBDaGFuZ2UgdGhlIHByZXNlbnRhdGlvbiBkaXJlY3Rpb24gdG8gYmUgUlRMXG5cdFx0XHRydGw6IGZhbHNlLFxuXG5cdFx0XHQvLyBSYW5kb21pemVzIHRoZSBvcmRlciBvZiBzbGlkZXMgZWFjaCB0aW1lIHRoZSBwcmVzZW50YXRpb24gbG9hZHNcblx0XHRcdHNodWZmbGU6IGZhbHNlLFxuXG5cdFx0XHQvLyBUdXJucyBmcmFnbWVudHMgb24gYW5kIG9mZiBnbG9iYWxseVxuXHRcdFx0ZnJhZ21lbnRzOiB0cnVlLFxuXG5cdFx0XHQvLyBGbGFncyBpZiB0aGUgcHJlc2VudGF0aW9uIGlzIHJ1bm5pbmcgaW4gYW4gZW1iZWRkZWQgbW9kZSxcblx0XHRcdC8vIGkuZS4gY29udGFpbmVkIHdpdGhpbiBhIGxpbWl0ZWQgcG9ydGlvbiBvZiB0aGUgc2NyZWVuXG5cdFx0XHRlbWJlZGRlZDogZmFsc2UsXG5cblx0XHRcdC8vIEZsYWdzIGlmIHdlIHNob3VsZCBzaG93IGEgaGVscCBvdmVybGF5IHdoZW4gdGhlIHF1ZXN0aW9ubWFya1xuXHRcdFx0Ly8ga2V5IGlzIHByZXNzZWRcblx0XHRcdGhlbHA6IHRydWUsXG5cblx0XHRcdC8vIEZsYWdzIGlmIGl0IHNob3VsZCBiZSBwb3NzaWJsZSB0byBwYXVzZSB0aGUgcHJlc2VudGF0aW9uIChibGFja291dClcblx0XHRcdHBhdXNlOiB0cnVlLFxuXG5cdFx0XHQvLyBGbGFncyBpZiBzcGVha2VyIG5vdGVzIHNob3VsZCBiZSB2aXNpYmxlIHRvIGFsbCB2aWV3ZXJzXG5cdFx0XHRzaG93Tm90ZXM6IGZhbHNlLFxuXG5cdFx0XHQvLyBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIGJldHdlZW4gYXV0b21hdGljYWxseSBwcm9jZWVkaW5nIHRvIHRoZVxuXHRcdFx0Ly8gbmV4dCBzbGlkZSwgZGlzYWJsZWQgd2hlbiBzZXQgdG8gMCwgdGhpcyB2YWx1ZSBjYW4gYmUgb3ZlcndyaXR0ZW5cblx0XHRcdC8vIGJ5IHVzaW5nIGEgZGF0YS1hdXRvc2xpZGUgYXR0cmlidXRlIG9uIHlvdXIgc2xpZGVzXG5cdFx0XHRhdXRvU2xpZGU6IDAsXG5cblx0XHRcdC8vIFN0b3AgYXV0by1zbGlkaW5nIGFmdGVyIHVzZXIgaW5wdXRcblx0XHRcdGF1dG9TbGlkZVN0b3BwYWJsZTogdHJ1ZSxcblxuXHRcdFx0Ly8gVXNlIHRoaXMgbWV0aG9kIGZvciBuYXZpZ2F0aW9uIHdoZW4gYXV0by1zbGlkaW5nIChkZWZhdWx0cyB0byBuYXZpZ2F0ZU5leHQpXG5cdFx0XHRhdXRvU2xpZGVNZXRob2Q6IG51bGwsXG5cblx0XHRcdC8vIEVuYWJsZSBzbGlkZSBuYXZpZ2F0aW9uIHZpYSBtb3VzZSB3aGVlbFxuXHRcdFx0bW91c2VXaGVlbDogZmFsc2UsXG5cblx0XHRcdC8vIEFwcGx5IGEgM0Qgcm9sbCB0byBsaW5rcyBvbiBob3ZlclxuXHRcdFx0cm9sbGluZ0xpbmtzOiBmYWxzZSxcblxuXHRcdFx0Ly8gSGlkZXMgdGhlIGFkZHJlc3MgYmFyIG9uIG1vYmlsZSBkZXZpY2VzXG5cdFx0XHRoaWRlQWRkcmVzc0JhcjogdHJ1ZSxcblxuXHRcdFx0Ly8gT3BlbnMgbGlua3MgaW4gYW4gaWZyYW1lIHByZXZpZXcgb3ZlcmxheVxuXHRcdFx0cHJldmlld0xpbmtzOiBmYWxzZSxcblxuXHRcdFx0Ly8gRXhwb3NlcyB0aGUgcmV2ZWFsLmpzIEFQSSB0aHJvdWdoIHdpbmRvdy5wb3N0TWVzc2FnZVxuXHRcdFx0cG9zdE1lc3NhZ2U6IHRydWUsXG5cblx0XHRcdC8vIERpc3BhdGNoZXMgYWxsIHJldmVhbC5qcyBldmVudHMgdG8gdGhlIHBhcmVudCB3aW5kb3cgdGhyb3VnaCBwb3N0TWVzc2FnZVxuXHRcdFx0cG9zdE1lc3NhZ2VFdmVudHM6IGZhbHNlLFxuXG5cdFx0XHQvLyBGb2N1c2VzIGJvZHkgd2hlbiBwYWdlIGNoYW5nZXMgdmlzaWJsaXR5IHRvIGVuc3VyZSBrZXlib2FyZCBzaG9ydGN1dHMgd29ya1xuXHRcdFx0Zm9jdXNCb2R5T25QYWdlVmlzaWJpbGl0eUNoYW5nZTogdHJ1ZSxcblxuXHRcdFx0Ly8gVHJhbnNpdGlvbiBzdHlsZVxuXHRcdFx0dHJhbnNpdGlvbjogJ3NsaWRlJywgLy8gbm9uZS9mYWRlL3NsaWRlL2NvbnZleC9jb25jYXZlL3pvb21cblxuXHRcdFx0Ly8gVHJhbnNpdGlvbiBzcGVlZFxuXHRcdFx0dHJhbnNpdGlvblNwZWVkOiAnZGVmYXVsdCcsIC8vIGRlZmF1bHQvZmFzdC9zbG93XG5cblx0XHRcdC8vIFRyYW5zaXRpb24gc3R5bGUgZm9yIGZ1bGwgcGFnZSBzbGlkZSBiYWNrZ3JvdW5kc1xuXHRcdFx0YmFja2dyb3VuZFRyYW5zaXRpb246ICdmYWRlJywgLy8gbm9uZS9mYWRlL3NsaWRlL2NvbnZleC9jb25jYXZlL3pvb21cblxuXHRcdFx0Ly8gUGFyYWxsYXggYmFja2dyb3VuZCBpbWFnZVxuXHRcdFx0cGFyYWxsYXhCYWNrZ3JvdW5kSW1hZ2U6ICcnLCAvLyBDU1Mgc3ludGF4LCBlLmcuIFwiYS5qcGdcIlxuXG5cdFx0XHQvLyBQYXJhbGxheCBiYWNrZ3JvdW5kIHNpemVcblx0XHRcdHBhcmFsbGF4QmFja2dyb3VuZFNpemU6ICcnLCAvLyBDU1Mgc3ludGF4LCBlLmcuIFwiMzAwMHB4IDIwMDBweFwiXG5cblx0XHRcdC8vIEFtb3VudCBvZiBwaXhlbHMgdG8gbW92ZSB0aGUgcGFyYWxsYXggYmFja2dyb3VuZCBwZXIgc2xpZGUgc3RlcFxuXHRcdFx0cGFyYWxsYXhCYWNrZ3JvdW5kSG9yaXpvbnRhbDogbnVsbCxcblx0XHRcdHBhcmFsbGF4QmFja2dyb3VuZFZlcnRpY2FsOiBudWxsLFxuXG5cdFx0XHQvLyBOdW1iZXIgb2Ygc2xpZGVzIGF3YXkgZnJvbSB0aGUgY3VycmVudCB0aGF0IGFyZSB2aXNpYmxlXG5cdFx0XHR2aWV3RGlzdGFuY2U6IDMsXG5cblx0XHRcdC8vIFNjcmlwdCBkZXBlbmRlbmNpZXMgdG8gbG9hZFxuXHRcdFx0ZGVwZW5kZW5jaWVzOiBbXVxuXG5cdFx0fSxcblxuXHRcdC8vIEZsYWdzIGlmIHJldmVhbC5qcyBpcyBsb2FkZWQgKGhhcyBkaXNwYXRjaGVkIHRoZSAncmVhZHknIGV2ZW50KVxuXHRcdGxvYWRlZCA9IGZhbHNlLFxuXG5cdFx0Ly8gRmxhZ3MgaWYgdGhlIG92ZXJ2aWV3IG1vZGUgaXMgY3VycmVudGx5IGFjdGl2ZVxuXHRcdG92ZXJ2aWV3ID0gZmFsc2UsXG5cblx0XHQvLyBIb2xkcyB0aGUgZGltZW5zaW9ucyBvZiBvdXIgb3ZlcnZpZXcgc2xpZGVzLCBpbmNsdWRpbmcgbWFyZ2luc1xuXHRcdG92ZXJ2aWV3U2xpZGVXaWR0aCA9IG51bGwsXG5cdFx0b3ZlcnZpZXdTbGlkZUhlaWdodCA9IG51bGwsXG5cblx0XHQvLyBUaGUgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgaW5kZXggb2YgdGhlIGN1cnJlbnRseSBhY3RpdmUgc2xpZGVcblx0XHRpbmRleGgsXG5cdFx0aW5kZXh2LFxuXG5cdFx0Ly8gVGhlIHByZXZpb3VzIGFuZCBjdXJyZW50IHNsaWRlIEhUTUwgZWxlbWVudHNcblx0XHRwcmV2aW91c1NsaWRlLFxuXHRcdGN1cnJlbnRTbGlkZSxcblxuXHRcdHByZXZpb3VzQmFja2dyb3VuZCxcblxuXHRcdC8vIFNsaWRlcyBtYXkgaG9sZCBhIGRhdGEtc3RhdGUgYXR0cmlidXRlIHdoaWNoIHdlIHBpY2sgdXAgYW5kIGFwcGx5XG5cdFx0Ly8gYXMgYSBjbGFzcyB0byB0aGUgYm9keS4gVGhpcyBsaXN0IGNvbnRhaW5zIHRoZSBjb21iaW5lZCBzdGF0ZSBvZlxuXHRcdC8vIGFsbCBjdXJyZW50IHNsaWRlcy5cblx0XHRzdGF0ZSA9IFtdLFxuXG5cdFx0Ly8gVGhlIGN1cnJlbnQgc2NhbGUgb2YgdGhlIHByZXNlbnRhdGlvbiAoc2VlIHdpZHRoL2hlaWdodCBjb25maWcpXG5cdFx0c2NhbGUgPSAxLFxuXG5cdFx0Ly8gQ1NTIHRyYW5zZm9ybSB0aGF0IGlzIGN1cnJlbnRseSBhcHBsaWVkIHRvIHRoZSBzbGlkZXMgY29udGFpbmVyLFxuXHRcdC8vIHNwbGl0IGludG8gdHdvIGdyb3Vwc1xuXHRcdHNsaWRlc1RyYW5zZm9ybSA9IHsgbGF5b3V0OiAnJywgb3ZlcnZpZXc6ICcnIH0sXG5cblx0XHQvLyBDYWNoZWQgcmVmZXJlbmNlcyB0byBET00gZWxlbWVudHNcblx0XHRkb20gPSB7fSxcblxuXHRcdC8vIEZlYXR1cmVzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3Nlciwgc2VlICNjaGVja0NhcGFiaWxpdGllcygpXG5cdFx0ZmVhdHVyZXMgPSB7fSxcblxuXHRcdC8vIENsaWVudCBpcyBhIG1vYmlsZSBkZXZpY2UsIHNlZSAjY2hlY2tDYXBhYmlsaXRpZXMoKVxuXHRcdGlzTW9iaWxlRGV2aWNlLFxuXG5cdFx0Ly8gQ2xpZW50IGlzIGEgZGVza3RvcCBDaHJvbWUsIHNlZSAjY2hlY2tDYXBhYmlsaXRpZXMoKVxuXHRcdGlzQ2hyb21lLFxuXG5cdFx0Ly8gVGhyb3R0bGVzIG1vdXNlIHdoZWVsIG5hdmlnYXRpb25cblx0XHRsYXN0TW91c2VXaGVlbFN0ZXAgPSAwLFxuXG5cdFx0Ly8gRGVsYXlzIHVwZGF0ZXMgdG8gdGhlIFVSTCBkdWUgdG8gYSBDaHJvbWUgdGh1bWJuYWlsZXIgYnVnXG5cdFx0d3JpdGVVUkxUaW1lb3V0ID0gMCxcblxuXHRcdC8vIEZsYWdzIGlmIHRoZSBpbnRlcmFjdGlvbiBldmVudCBsaXN0ZW5lcnMgYXJlIGJvdW5kXG5cdFx0ZXZlbnRzQXJlQm91bmQgPSBmYWxzZSxcblxuXHRcdC8vIFRoZSBjdXJyZW50IGF1dG8tc2xpZGUgZHVyYXRpb25cblx0XHRhdXRvU2xpZGUgPSAwLFxuXG5cdFx0Ly8gQXV0byBzbGlkZSBwcm9wZXJ0aWVzXG5cdFx0YXV0b1NsaWRlUGxheWVyLFxuXHRcdGF1dG9TbGlkZVRpbWVvdXQgPSAwLFxuXHRcdGF1dG9TbGlkZVN0YXJ0VGltZSA9IC0xLFxuXHRcdGF1dG9TbGlkZVBhdXNlZCA9IGZhbHNlLFxuXG5cdFx0Ly8gSG9sZHMgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnRseSBvbmdvaW5nIHRvdWNoIGlucHV0XG5cdFx0dG91Y2ggPSB7XG5cdFx0XHRzdGFydFg6IDAsXG5cdFx0XHRzdGFydFk6IDAsXG5cdFx0XHRzdGFydFNwYW46IDAsXG5cdFx0XHRzdGFydENvdW50OiAwLFxuXHRcdFx0Y2FwdHVyZWQ6IGZhbHNlLFxuXHRcdFx0dGhyZXNob2xkOiA0MFxuXHRcdH0sXG5cblx0XHQvLyBIb2xkcyBpbmZvcm1hdGlvbiBhYm91dCB0aGUga2V5Ym9hcmQgc2hvcnRjdXRzXG5cdFx0a2V5Ym9hcmRTaG9ydGN1dHMgPSB7XG5cdFx0XHQnTiAgLCAgU1BBQ0UnOlx0XHRcdCdOZXh0IHNsaWRlJyxcblx0XHRcdCdQJzpcdFx0XHRcdFx0J1ByZXZpb3VzIHNsaWRlJyxcblx0XHRcdCcmIzg1OTI7ICAsICBIJzpcdFx0J05hdmlnYXRlIGxlZnQnLFxuXHRcdFx0JyYjODU5NDsgICwgIEwnOlx0XHQnTmF2aWdhdGUgcmlnaHQnLFxuXHRcdFx0JyYjODU5MzsgICwgIEsnOlx0XHQnTmF2aWdhdGUgdXAnLFxuXHRcdFx0JyYjODU5NTsgICwgIEonOlx0XHQnTmF2aWdhdGUgZG93bicsXG5cdFx0XHQnSG9tZSc6XHRcdFx0XHRcdCdGaXJzdCBzbGlkZScsXG5cdFx0XHQnRW5kJzpcdFx0XHRcdFx0J0xhc3Qgc2xpZGUnLFxuXHRcdFx0J0IgICwgIC4nOlx0XHRcdFx0J1BhdXNlJyxcblx0XHRcdCdGJzpcdFx0XHRcdFx0J0Z1bGxzY3JlZW4nLFxuXHRcdFx0J0VTQywgTyc6XHRcdFx0XHQnU2xpZGUgb3ZlcnZpZXcnXG5cdFx0fTtcblxuXHQvKipcblx0ICogU3RhcnRzIHVwIHRoZSBwcmVzZW50YXRpb24gaWYgdGhlIGNsaWVudCBpcyBjYXBhYmxlLlxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdGlhbGl6ZSggb3B0aW9ucyApIHtcblxuXHRcdGNoZWNrQ2FwYWJpbGl0aWVzKCk7XG5cblx0XHRpZiggIWZlYXR1cmVzLnRyYW5zZm9ybXMyZCAmJiAhZmVhdHVyZXMudHJhbnNmb3JtczNkICkge1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5zZXRBdHRyaWJ1dGUoICdjbGFzcycsICduby10cmFuc2Zvcm1zJyApO1xuXG5cdFx0XHQvLyBTaW5jZSBKUyB3b24ndCBiZSBydW5uaW5nIGFueSBmdXJ0aGVyLCB3ZSBsb2FkIGFsbCBsYXp5XG5cdFx0XHQvLyBsb2FkaW5nIGVsZW1lbnRzIHVwZnJvbnRcblx0XHRcdHZhciBpbWFnZXMgPSB0b0FycmF5KCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2ltZycgKSApLFxuXHRcdFx0XHRpZnJhbWVzID0gdG9BcnJheSggZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdpZnJhbWUnICkgKTtcblxuXHRcdFx0dmFyIGxhenlMb2FkYWJsZSA9IGltYWdlcy5jb25jYXQoIGlmcmFtZXMgKTtcblxuXHRcdFx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IGxhenlMb2FkYWJsZS5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0dmFyIGVsZW1lbnQgPSBsYXp5TG9hZGFibGVbaV07XG5cdFx0XHRcdGlmKCBlbGVtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApICkge1xuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnc3JjJywgZWxlbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLXNyYycgKSApO1xuXHRcdFx0XHRcdGVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCAnZGF0YS1zcmMnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IGNvcmUgZmVhdHVyZXMgd2Ugd29uJ3QgYmVcblx0XHRcdC8vIHVzaW5nIEphdmFTY3JpcHQgdG8gY29udHJvbCB0aGUgcHJlc2VudGF0aW9uXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ2FjaGUgcmVmZXJlbmNlcyB0byBrZXkgRE9NIGVsZW1lbnRzXG5cdFx0ZG9tLndyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnJldmVhbCcgKTtcblx0XHRkb20uc2xpZGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5yZXZlYWwgLnNsaWRlcycgKTtcblxuXHRcdC8vIEZvcmNlIGEgbGF5b3V0IHdoZW4gdGhlIHdob2xlIHBhZ2UsIGluY2wgZm9udHMsIGhhcyBsb2FkZWRcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBsYXlvdXQsIGZhbHNlICk7XG5cblx0XHR2YXIgcXVlcnkgPSBSZXZlYWwuZ2V0UXVlcnlIYXNoKCk7XG5cblx0XHQvLyBEbyBub3QgYWNjZXB0IG5ldyBkZXBlbmRlbmNpZXMgdmlhIHF1ZXJ5IGNvbmZpZyB0byBhdm9pZFxuXHRcdC8vIHRoZSBwb3RlbnRpYWwgb2YgbWFsaWNpb3VzIHNjcmlwdCBpbmplY3Rpb25cblx0XHRpZiggdHlwZW9mIHF1ZXJ5WydkZXBlbmRlbmNpZXMnXSAhPT0gJ3VuZGVmaW5lZCcgKSBkZWxldGUgcXVlcnlbJ2RlcGVuZGVuY2llcyddO1xuXG5cdFx0Ly8gQ29weSBvcHRpb25zIG92ZXIgdG8gb3VyIGNvbmZpZyBvYmplY3Rcblx0XHRleHRlbmQoIGNvbmZpZywgb3B0aW9ucyApO1xuXHRcdGV4dGVuZCggY29uZmlnLCBxdWVyeSApO1xuXG5cdFx0Ly8gSGlkZSB0aGUgYWRkcmVzcyBiYXIgaW4gbW9iaWxlIGJyb3dzZXJzXG5cdFx0aGlkZUFkZHJlc3NCYXIoKTtcblxuXHRcdC8vIExvYWRzIHRoZSBkZXBlbmRlbmNpZXMgYW5kIGNvbnRpbnVlcyB0byAjc3RhcnQoKSBvbmNlIGRvbmVcblx0XHRsb2FkKCk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBJbnNwZWN0IHRoZSBjbGllbnQgdG8gc2VlIHdoYXQgaXQncyBjYXBhYmxlIG9mLCB0aGlzXG5cdCAqIHNob3VsZCBvbmx5IGhhcHBlbnMgb25jZSBwZXIgcnVudGltZS5cblx0ICovXG5cdGZ1bmN0aW9uIGNoZWNrQ2FwYWJpbGl0aWVzKCkge1xuXG5cdFx0aXNNb2JpbGVEZXZpY2UgPSAvKGlwaG9uZXxpcG9kfGlwYWR8YW5kcm9pZCkvZ2kudGVzdCggVUEgKTtcblx0XHRpc0Nocm9tZSA9IC9jaHJvbWUvaS50ZXN0KCBVQSApICYmICEvZWRnZS9pLnRlc3QoIFVBICk7XG5cblx0XHR2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXG5cdFx0ZmVhdHVyZXMudHJhbnNmb3JtczNkID0gJ1dlYmtpdFBlcnNwZWN0aXZlJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSB8fFxuXHRcdFx0XHRcdFx0XHRcdCdNb3pQZXJzcGVjdGl2ZScgaW4gdGVzdEVsZW1lbnQuc3R5bGUgfHxcblx0XHRcdFx0XHRcdFx0XHQnbXNQZXJzcGVjdGl2ZScgaW4gdGVzdEVsZW1lbnQuc3R5bGUgfHxcblx0XHRcdFx0XHRcdFx0XHQnT1BlcnNwZWN0aXZlJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSB8fFxuXHRcdFx0XHRcdFx0XHRcdCdwZXJzcGVjdGl2ZScgaW4gdGVzdEVsZW1lbnQuc3R5bGU7XG5cblx0XHRmZWF0dXJlcy50cmFuc2Zvcm1zMmQgPSAnV2Via2l0VHJhbnNmb3JtJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSB8fFxuXHRcdFx0XHRcdFx0XHRcdCdNb3pUcmFuc2Zvcm0nIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J21zVHJhbnNmb3JtJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSB8fFxuXHRcdFx0XHRcdFx0XHRcdCdPVHJhbnNmb3JtJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSB8fFxuXHRcdFx0XHRcdFx0XHRcdCd0cmFuc2Zvcm0nIGluIHRlc3RFbGVtZW50LnN0eWxlO1xuXG5cdFx0ZmVhdHVyZXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lTWV0aG9kID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdFx0ZmVhdHVyZXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gdHlwZW9mIGZlYXR1cmVzLnJlcXVlc3RBbmltYXRpb25GcmFtZU1ldGhvZCA9PT0gJ2Z1bmN0aW9uJztcblxuXHRcdGZlYXR1cmVzLmNhbnZhcyA9ICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2NhbnZhcycgKS5nZXRDb250ZXh0O1xuXG5cdFx0Ly8gVHJhbnNpdGlvbnMgaW4gdGhlIG92ZXJ2aWV3IGFyZSBkaXNhYmxlZCBpbiBkZXNrdG9wIGFuZFxuXHRcdC8vIFNhZmFyaSBkdWUgdG8gbGFnXG5cdFx0ZmVhdHVyZXMub3ZlcnZpZXdUcmFuc2l0aW9ucyA9ICEvVmVyc2lvblxcL1tcXGRcXC5dKy4qU2FmYXJpLy50ZXN0KCBVQSApO1xuXG5cdFx0Ly8gRmxhZ3MgaWYgd2Ugc2hvdWxkIHVzZSB6b29tIGluc3RlYWQgb2YgdHJhbnNmb3JtIHRvIHNjYWxlXG5cdFx0Ly8gdXAgc2xpZGVzLiBab29tIHByb2R1Y2VzIGNyaXNwZXIgcmVzdWx0cyBidXQgaGFzIGEgbG90IG9mXG5cdFx0Ly8geGJyb3dzZXIgcXVpcmtzIHNvIHdlIG9ubHkgdXNlIGl0IGluIHdoaXRlbHNpdGVkIGJyb3dzZXJzLlxuXHRcdGZlYXR1cmVzLnpvb20gPSAnem9vbScgaW4gdGVzdEVsZW1lbnQuc3R5bGUgJiYgIWlzTW9iaWxlRGV2aWNlICYmXG5cdFx0XHRcdFx0XHQoIGlzQ2hyb21lIHx8IC9WZXJzaW9uXFwvW1xcZFxcLl0rLipTYWZhcmkvLnRlc3QoIFVBICkgKTtcblxuXHR9XG5cbiAgICAvKipcbiAgICAgKiBMb2FkcyB0aGUgZGVwZW5kZW5jaWVzIG9mIHJldmVhbC5qcy4gRGVwZW5kZW5jaWVzIGFyZVxuICAgICAqIGRlZmluZWQgdmlhIHRoZSBjb25maWd1cmF0aW9uIG9wdGlvbiAnZGVwZW5kZW5jaWVzJ1xuICAgICAqIGFuZCB3aWxsIGJlIGxvYWRlZCBwcmlvciB0byBzdGFydGluZy9iaW5kaW5nIHJldmVhbC5qcy5cbiAgICAgKiBTb21lIGRlcGVuZGVuY2llcyBtYXkgaGF2ZSBhbiAnYXN5bmMnIGZsYWcsIGlmIHNvIHRoZXlcbiAgICAgKiB3aWxsIGxvYWQgYWZ0ZXIgcmV2ZWFsLmpzIGhhcyBiZWVuIHN0YXJ0ZWQgdXAuXG4gICAgICovXG5cdGZ1bmN0aW9uIGxvYWQoKSB7XG5cblx0XHR2YXIgc2NyaXB0cyA9IFtdLFxuXHRcdFx0c2NyaXB0c0FzeW5jID0gW10sXG5cdFx0XHRzY3JpcHRzVG9QcmVsb2FkID0gMDtcblxuXHRcdC8vIENhbGxlZCBvbmNlIHN5bmNocm9ub3VzIHNjcmlwdHMgZmluaXNoIGxvYWRpbmdcblx0XHRmdW5jdGlvbiBwcm9jZWVkKCkge1xuXHRcdFx0aWYoIHNjcmlwdHNBc3luYy5sZW5ndGggKSB7XG5cdFx0XHRcdC8vIExvYWQgYXN5bmNocm9ub3VzIHNjcmlwdHNcblx0XHRcdFx0aGVhZC5qcy5hcHBseSggbnVsbCwgc2NyaXB0c0FzeW5jICk7XG5cdFx0XHR9XG5cblx0XHRcdHN0YXJ0KCk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gbG9hZFNjcmlwdCggcyApIHtcblx0XHRcdGhlYWQucmVhZHkoIHMuc3JjLm1hdGNoKCAvKFtcXHdcXGRfXFwtXSopXFwuP2pzJHxbXlxcXFxcXC9dKiQvaSApWzBdLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gRXh0ZW5zaW9uIG1heSBjb250YWluIGNhbGxiYWNrIGZ1bmN0aW9uc1xuXHRcdFx0XHRpZiggdHlwZW9mIHMuY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0cy5jYWxsYmFjay5hcHBseSggdGhpcyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoIC0tc2NyaXB0c1RvUHJlbG9hZCA9PT0gMCApIHtcblx0XHRcdFx0XHRwcm9jZWVkKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdGZvciggdmFyIGkgPSAwLCBsZW4gPSBjb25maWcuZGVwZW5kZW5jaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0dmFyIHMgPSBjb25maWcuZGVwZW5kZW5jaWVzW2ldO1xuXG5cdFx0XHQvLyBMb2FkIGlmIHRoZXJlJ3Mgbm8gY29uZGl0aW9uIG9yIHRoZSBjb25kaXRpb24gaXMgdHJ1dGh5XG5cdFx0XHRpZiggIXMuY29uZGl0aW9uIHx8IHMuY29uZGl0aW9uKCkgKSB7XG5cdFx0XHRcdGlmKCBzLmFzeW5jICkge1xuXHRcdFx0XHRcdHNjcmlwdHNBc3luYy5wdXNoKCBzLnNyYyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHNjcmlwdHMucHVzaCggcy5zcmMgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxvYWRTY3JpcHQoIHMgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiggc2NyaXB0cy5sZW5ndGggKSB7XG5cdFx0XHRzY3JpcHRzVG9QcmVsb2FkID0gc2NyaXB0cy5sZW5ndGg7XG5cblx0XHRcdC8vIExvYWQgc3luY2hyb25vdXMgc2NyaXB0c1xuXHRcdFx0aGVhZC5qcy5hcHBseSggbnVsbCwgc2NyaXB0cyApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHByb2NlZWQoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBTdGFydHMgdXAgcmV2ZWFsLmpzIGJ5IGJpbmRpbmcgaW5wdXQgZXZlbnRzIGFuZCBuYXZpZ2F0aW5nXG5cdCAqIHRvIHRoZSBjdXJyZW50IFVSTCBkZWVwbGluayBpZiB0aGVyZSBpcyBvbmUuXG5cdCAqL1xuXHRmdW5jdGlvbiBzdGFydCgpIHtcblxuXHRcdC8vIE1ha2Ugc3VyZSB3ZSd2ZSBnb3QgYWxsIHRoZSBET00gZWxlbWVudHMgd2UgbmVlZFxuXHRcdHNldHVwRE9NKCk7XG5cblx0XHQvLyBMaXN0ZW4gdG8gbWVzc2FnZXMgcG9zdGVkIHRvIHRoaXMgd2luZG93XG5cdFx0c2V0dXBQb3N0TWVzc2FnZSgpO1xuXG5cdFx0Ly8gUHJldmVudCB0aGUgc2xpZGVzIGZyb20gYmVpbmcgc2Nyb2xsZWQgb3V0IG9mIHZpZXdcblx0XHRzZXR1cFNjcm9sbFByZXZlbnRpb24oKTtcblxuXHRcdC8vIFJlc2V0cyBhbGwgdmVydGljYWwgc2xpZGVzIHNvIHRoYXQgb25seSB0aGUgZmlyc3QgaXMgdmlzaWJsZVxuXHRcdHJlc2V0VmVydGljYWxTbGlkZXMoKTtcblxuXHRcdC8vIFVwZGF0ZXMgdGhlIHByZXNlbnRhdGlvbiB0byBtYXRjaCB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIHZhbHVlc1xuXHRcdGNvbmZpZ3VyZSgpO1xuXG5cdFx0Ly8gUmVhZCB0aGUgaW5pdGlhbCBoYXNoXG5cdFx0cmVhZFVSTCgpO1xuXG5cdFx0Ly8gVXBkYXRlIGFsbCBiYWNrZ3JvdW5kc1xuXHRcdHVwZGF0ZUJhY2tncm91bmQoIHRydWUgKTtcblxuXHRcdC8vIE5vdGlmeSBsaXN0ZW5lcnMgdGhhdCB0aGUgcHJlc2VudGF0aW9uIGlzIHJlYWR5IGJ1dCB1c2UgYSAxbXNcblx0XHQvLyB0aW1lb3V0IHRvIGVuc3VyZSBpdCdzIG5vdCBmaXJlZCBzeW5jaHJvbm91c2x5IGFmdGVyICNpbml0aWFsaXplKClcblx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdC8vIEVuYWJsZSB0cmFuc2l0aW9ucyBub3cgdGhhdCB3ZSdyZSBsb2FkZWRcblx0XHRcdGRvbS5zbGlkZXMuY2xhc3NMaXN0LnJlbW92ZSggJ25vLXRyYW5zaXRpb24nICk7XG5cblx0XHRcdGxvYWRlZCA9IHRydWU7XG5cblx0XHRcdGRpc3BhdGNoRXZlbnQoICdyZWFkeScsIHtcblx0XHRcdFx0J2luZGV4aCc6IGluZGV4aCxcblx0XHRcdFx0J2luZGV4dic6IGluZGV4dixcblx0XHRcdFx0J2N1cnJlbnRTbGlkZSc6IGN1cnJlbnRTbGlkZVxuXHRcdFx0fSApO1xuXHRcdH0sIDEgKTtcblxuXHRcdC8vIFNwZWNpYWwgc2V0dXAgYW5kIGNvbmZpZyBpcyByZXF1aXJlZCB3aGVuIHByaW50aW5nIHRvIFBERlxuXHRcdGlmKCBpc1ByaW50aW5nUERGKCkgKSB7XG5cdFx0XHRyZW1vdmVFdmVudExpc3RlbmVycygpO1xuXG5cdFx0XHQvLyBUaGUgZG9jdW1lbnQgbmVlZHMgdG8gaGF2ZSBsb2FkZWQgZm9yIHRoZSBQREYgbGF5b3V0XG5cdFx0XHQvLyBtZWFzdXJlbWVudHMgdG8gYmUgYWNjdXJhdGVcblx0XHRcdGlmKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnICkge1xuXHRcdFx0XHRzZXR1cFBERigpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbG9hZCcsIHNldHVwUERGICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogRmluZHMgYW5kIHN0b3JlcyByZWZlcmVuY2VzIHRvIERPTSBlbGVtZW50cyB3aGljaCBhcmVcblx0ICogcmVxdWlyZWQgYnkgdGhlIHByZXNlbnRhdGlvbi4gSWYgYSByZXF1aXJlZCBlbGVtZW50IGlzXG5cdCAqIG5vdCBmb3VuZCwgaXQgaXMgY3JlYXRlZC5cblx0ICovXG5cdGZ1bmN0aW9uIHNldHVwRE9NKCkge1xuXG5cdFx0Ly8gUHJldmVudCB0cmFuc2l0aW9ucyB3aGlsZSB3ZSdyZSBsb2FkaW5nXG5cdFx0ZG9tLnNsaWRlcy5jbGFzc0xpc3QuYWRkKCAnbm8tdHJhbnNpdGlvbicgKTtcblxuXHRcdC8vIEJhY2tncm91bmQgZWxlbWVudFxuXHRcdGRvbS5iYWNrZ3JvdW5kID0gY3JlYXRlU2luZ2xldG9uTm9kZSggZG9tLndyYXBwZXIsICdkaXYnLCAnYmFja2dyb3VuZHMnLCBudWxsICk7XG5cblx0XHQvLyBQcm9ncmVzcyBiYXJcblx0XHRkb20ucHJvZ3Jlc3MgPSBjcmVhdGVTaW5nbGV0b25Ob2RlKCBkb20ud3JhcHBlciwgJ2RpdicsICdwcm9ncmVzcycsICc8c3Bhbj48L3NwYW4+JyApO1xuXHRcdGRvbS5wcm9ncmVzc2JhciA9IGRvbS5wcm9ncmVzcy5xdWVyeVNlbGVjdG9yKCAnc3BhbicgKTtcblxuXHRcdC8vIEFycm93IGNvbnRyb2xzXG5cdFx0Y3JlYXRlU2luZ2xldG9uTm9kZSggZG9tLndyYXBwZXIsICdhc2lkZScsICdjb250cm9scycsXG5cdFx0XHQnPGJ1dHRvbiBjbGFzcz1cIm5hdmlnYXRlLWxlZnRcIiBhcmlhLWxhYmVsPVwicHJldmlvdXMgc2xpZGVcIj48L2J1dHRvbj4nICtcblx0XHRcdCc8YnV0dG9uIGNsYXNzPVwibmF2aWdhdGUtcmlnaHRcIiBhcmlhLWxhYmVsPVwibmV4dCBzbGlkZVwiPjwvYnV0dG9uPicgK1xuXHRcdFx0JzxidXR0b24gY2xhc3M9XCJuYXZpZ2F0ZS11cFwiIGFyaWEtbGFiZWw9XCJhYm92ZSBzbGlkZVwiPjwvYnV0dG9uPicgK1xuXHRcdFx0JzxidXR0b24gY2xhc3M9XCJuYXZpZ2F0ZS1kb3duXCIgYXJpYS1sYWJlbD1cImJlbG93IHNsaWRlXCI+PC9idXR0b24+JyApO1xuXG5cdFx0Ly8gU2xpZGUgbnVtYmVyXG5cdFx0ZG9tLnNsaWRlTnVtYmVyID0gY3JlYXRlU2luZ2xldG9uTm9kZSggZG9tLndyYXBwZXIsICdkaXYnLCAnc2xpZGUtbnVtYmVyJywgJycgKTtcblxuXHRcdC8vIEVsZW1lbnQgY29udGFpbmluZyBub3RlcyB0aGF0IGFyZSB2aXNpYmxlIHRvIHRoZSBhdWRpZW5jZVxuXHRcdGRvbS5zcGVha2VyTm90ZXMgPSBjcmVhdGVTaW5nbGV0b25Ob2RlKCBkb20ud3JhcHBlciwgJ2RpdicsICdzcGVha2VyLW5vdGVzJywgbnVsbCApO1xuXHRcdGRvbS5zcGVha2VyTm90ZXMuc2V0QXR0cmlidXRlKCAnZGF0YS1wcmV2ZW50LXN3aXBlJywgJycgKTtcblxuXHRcdC8vIE92ZXJsYXkgZ3JhcGhpYyB3aGljaCBpcyBkaXNwbGF5ZWQgZHVyaW5nIHRoZSBwYXVzZWQgbW9kZVxuXHRcdGNyZWF0ZVNpbmdsZXRvbk5vZGUoIGRvbS53cmFwcGVyLCAnZGl2JywgJ3BhdXNlLW92ZXJsYXknLCBudWxsICk7XG5cblx0XHQvLyBDYWNoZSByZWZlcmVuY2VzIHRvIGVsZW1lbnRzXG5cdFx0ZG9tLmNvbnRyb2xzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJy5yZXZlYWwgLmNvbnRyb2xzJyApO1xuXHRcdGRvbS50aGVtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcjdGhlbWUnICk7XG5cblx0XHRkb20ud3JhcHBlci5zZXRBdHRyaWJ1dGUoICdyb2xlJywgJ2FwcGxpY2F0aW9uJyApO1xuXG5cdFx0Ly8gVGhlcmUgY2FuIGJlIG11bHRpcGxlIGluc3RhbmNlcyBvZiBjb250cm9scyB0aHJvdWdob3V0IHRoZSBwYWdlXG5cdFx0ZG9tLmNvbnRyb2xzTGVmdCA9IHRvQXJyYXkoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubmF2aWdhdGUtbGVmdCcgKSApO1xuXHRcdGRvbS5jb250cm9sc1JpZ2h0ID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5uYXZpZ2F0ZS1yaWdodCcgKSApO1xuXHRcdGRvbS5jb250cm9sc1VwID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5uYXZpZ2F0ZS11cCcgKSApO1xuXHRcdGRvbS5jb250cm9sc0Rvd24gPSB0b0FycmF5KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm5hdmlnYXRlLWRvd24nICkgKTtcblx0XHRkb20uY29udHJvbHNQcmV2ID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5uYXZpZ2F0ZS1wcmV2JyApICk7XG5cdFx0ZG9tLmNvbnRyb2xzTmV4dCA9IHRvQXJyYXkoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubmF2aWdhdGUtbmV4dCcgKSApO1xuXG5cdFx0ZG9tLnN0YXR1c0RpdiA9IGNyZWF0ZVN0YXR1c0RpdigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBoaWRkZW4gZGl2IHdpdGggcm9sZSBhcmlhLWxpdmUgdG8gYW5ub3VuY2UgdGhlXG5cdCAqIGN1cnJlbnQgc2xpZGUgY29udGVudC4gSGlkZSB0aGUgZGl2IG9mZi1zY3JlZW4gdG8gbWFrZSBpdFxuXHQgKiBhdmFpbGFibGUgb25seSB0byBBc3Npc3RpdmUgVGVjaG5vbG9naWVzLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlU3RhdHVzRGl2KCkge1xuXG5cdFx0dmFyIHN0YXR1c0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAnYXJpYS1zdGF0dXMtZGl2JyApO1xuXHRcdGlmKCAhc3RhdHVzRGl2ICkge1xuXHRcdFx0c3RhdHVzRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRcdHN0YXR1c0Rpdi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG5cdFx0XHRzdGF0dXNEaXYuc3R5bGUuaGVpZ2h0ID0gJzFweCc7XG5cdFx0XHRzdGF0dXNEaXYuc3R5bGUud2lkdGggPSAnMXB4Jztcblx0XHRcdHN0YXR1c0Rpdi5zdHlsZS5vdmVyZmxvdyA9J2hpZGRlbic7XG5cdFx0XHRzdGF0dXNEaXYuc3R5bGUuY2xpcCA9ICdyZWN0KCAxcHgsIDFweCwgMXB4LCAxcHggKSc7XG5cdFx0XHRzdGF0dXNEaXYuc2V0QXR0cmlidXRlKCAnaWQnLCAnYXJpYS1zdGF0dXMtZGl2JyApO1xuXHRcdFx0c3RhdHVzRGl2LnNldEF0dHJpYnV0ZSggJ2FyaWEtbGl2ZScsICdwb2xpdGUnICk7XG5cdFx0XHRzdGF0dXNEaXYuc2V0QXR0cmlidXRlKCAnYXJpYS1hdG9taWMnLCd0cnVlJyApO1xuXHRcdFx0ZG9tLndyYXBwZXIuYXBwZW5kQ2hpbGQoIHN0YXR1c0RpdiApO1xuXHRcdH1cblx0XHRyZXR1cm4gc3RhdHVzRGl2O1xuXG5cdH1cblxuXHQvKipcblx0ICogQ29uZmlndXJlcyB0aGUgcHJlc2VudGF0aW9uIGZvciBwcmludGluZyB0byBhIHN0YXRpY1xuXHQgKiBQREYuXG5cdCAqL1xuXHRmdW5jdGlvbiBzZXR1cFBERigpIHtcblxuXHRcdHZhciBzbGlkZVNpemUgPSBnZXRDb21wdXRlZFNsaWRlU2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xuXG5cdFx0Ly8gRGltZW5zaW9ucyBvZiB0aGUgUERGIHBhZ2VzXG5cdFx0dmFyIHBhZ2VXaWR0aCA9IE1hdGguZmxvb3IoIHNsaWRlU2l6ZS53aWR0aCAqICggMSArIGNvbmZpZy5tYXJnaW4gKSApLFxuXHRcdFx0cGFnZUhlaWdodCA9IE1hdGguZmxvb3IoIHNsaWRlU2l6ZS5oZWlnaHQgKiAoIDEgKyBjb25maWcubWFyZ2luICApICk7XG5cblx0XHQvLyBEaW1lbnNpb25zIG9mIHNsaWRlcyB3aXRoaW4gdGhlIHBhZ2VzXG5cdFx0dmFyIHNsaWRlV2lkdGggPSBzbGlkZVNpemUud2lkdGgsXG5cdFx0XHRzbGlkZUhlaWdodCA9IHNsaWRlU2l6ZS5oZWlnaHQ7XG5cblx0XHQvLyBMZXQgdGhlIGJyb3dzZXIga25vdyB3aGF0IHBhZ2Ugc2l6ZSB3ZSB3YW50IHRvIHByaW50XG5cdFx0aW5qZWN0U3R5bGVTaGVldCggJ0BwYWdle3NpemU6JysgcGFnZVdpZHRoICsncHggJysgcGFnZUhlaWdodCArJ3B4OyBtYXJnaW46IDA7fScgKTtcblxuXHRcdC8vIExpbWl0IHRoZSBzaXplIG9mIGNlcnRhaW4gZWxlbWVudHMgdG8gdGhlIGRpbWVuc2lvbnMgb2YgdGhlIHNsaWRlXG5cdFx0aW5qZWN0U3R5bGVTaGVldCggJy5yZXZlYWwgc2VjdGlvbj5pbWcsIC5yZXZlYWwgc2VjdGlvbj52aWRlbywgLnJldmVhbCBzZWN0aW9uPmlmcmFtZXttYXgtd2lkdGg6ICcrIHNsaWRlV2lkdGggKydweDsgbWF4LWhlaWdodDonKyBzbGlkZUhlaWdodCArJ3B4fScgKTtcblxuXHRcdGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCggJ3ByaW50LXBkZicgKTtcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLndpZHRoID0gcGFnZVdpZHRoICsgJ3B4Jztcblx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLmhlaWdodCA9IHBhZ2VIZWlnaHQgKyAncHgnO1xuXG5cdFx0Ly8gQWRkIGVhY2ggc2xpZGUncyBpbmRleCBhcyBhdHRyaWJ1dGVzIG9uIGl0c2VsZiwgd2UgbmVlZCB0aGVzZVxuXHRcdC8vIGluZGljZXMgdG8gZ2VuZXJhdGUgc2xpZGUgbnVtYmVycyBiZWxvd1xuXHRcdHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggaHNsaWRlLCBoICkge1xuXHRcdFx0aHNsaWRlLnNldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtaCcsIGggKTtcblxuXHRcdFx0aWYoIGhzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoICdzdGFjaycgKSApIHtcblx0XHRcdFx0dG9BcnJheSggaHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIHZzbGlkZSwgdiApIHtcblx0XHRcdFx0XHR2c2xpZGUuc2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC1oJywgaCApO1xuXHRcdFx0XHRcdHZzbGlkZS5zZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LXYnLCB2ICk7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBTbGlkZSBhbmQgc2xpZGUgYmFja2dyb3VuZCBsYXlvdXRcblx0XHR0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBzbGlkZSApIHtcblxuXHRcdFx0Ly8gVmVydGljYWwgc3RhY2tzIGFyZSBub3QgY2VudHJlZCBzaW5jZSB0aGVpciBzZWN0aW9uXG5cdFx0XHQvLyBjaGlsZHJlbiB3aWxsIGJlXG5cdFx0XHRpZiggc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnc3RhY2snICkgPT09IGZhbHNlICkge1xuXHRcdFx0XHQvLyBDZW50ZXIgdGhlIHNsaWRlIGluc2lkZSBvZiB0aGUgcGFnZSwgZ2l2aW5nIHRoZSBzbGlkZSBzb21lIG1hcmdpblxuXHRcdFx0XHR2YXIgbGVmdCA9ICggcGFnZVdpZHRoIC0gc2xpZGVXaWR0aCApIC8gMixcblx0XHRcdFx0XHR0b3AgPSAoIHBhZ2VIZWlnaHQgLSBzbGlkZUhlaWdodCApIC8gMjtcblxuXHRcdFx0XHR2YXIgY29udGVudEhlaWdodCA9IGdldEFic29sdXRlSGVpZ2h0KCBzbGlkZSApO1xuXHRcdFx0XHR2YXIgbnVtYmVyT2ZQYWdlcyA9IE1hdGgubWF4KCBNYXRoLmNlaWwoIGNvbnRlbnRIZWlnaHQgLyBwYWdlSGVpZ2h0ICksIDEgKTtcblxuXHRcdFx0XHQvLyBDZW50ZXIgc2xpZGVzIHZlcnRpY2FsbHlcblx0XHRcdFx0aWYoIG51bWJlck9mUGFnZXMgPT09IDEgJiYgY29uZmlnLmNlbnRlciB8fCBzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoICdjZW50ZXInICkgKSB7XG5cdFx0XHRcdFx0dG9wID0gTWF0aC5tYXgoICggcGFnZUhlaWdodCAtIGNvbnRlbnRIZWlnaHQgKSAvIDIsIDAgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFBvc2l0aW9uIHRoZSBzbGlkZSBpbnNpZGUgb2YgdGhlIHBhZ2Vcblx0XHRcdFx0c2xpZGUuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuXHRcdFx0XHRzbGlkZS5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuXHRcdFx0XHRzbGlkZS5zdHlsZS53aWR0aCA9IHNsaWRlV2lkdGggKyAncHgnO1xuXG5cdFx0XHRcdC8vIFRPRE8gQmFja2dyb3VuZHMgbmVlZCB0byBiZSBtdWx0aXBsaWVkIHdoZW4gdGhlIHNsaWRlXG5cdFx0XHRcdC8vIHN0cmV0Y2hlcyBvdmVyIG11bHRpcGxlIHBhZ2VzXG5cdFx0XHRcdHZhciBiYWNrZ3JvdW5kID0gc2xpZGUucXVlcnlTZWxlY3RvciggJy5zbGlkZS1iYWNrZ3JvdW5kJyApO1xuXHRcdFx0XHRpZiggYmFja2dyb3VuZCApIHtcblx0XHRcdFx0XHRiYWNrZ3JvdW5kLnN0eWxlLndpZHRoID0gcGFnZVdpZHRoICsgJ3B4Jztcblx0XHRcdFx0XHRiYWNrZ3JvdW5kLnN0eWxlLmhlaWdodCA9ICggcGFnZUhlaWdodCAqIG51bWJlck9mUGFnZXMgKSArICdweCc7XG5cdFx0XHRcdFx0YmFja2dyb3VuZC5zdHlsZS50b3AgPSAtdG9wICsgJ3B4Jztcblx0XHRcdFx0XHRiYWNrZ3JvdW5kLnN0eWxlLmxlZnQgPSAtbGVmdCArICdweCc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJbmplY3Qgbm90ZXMgaWYgYHNob3dOb3Rlc2AgaXMgZW5hYmxlZFxuXHRcdFx0XHRpZiggY29uZmlnLnNob3dOb3RlcyApIHtcblx0XHRcdFx0XHR2YXIgbm90ZXMgPSBnZXRTbGlkZU5vdGVzKCBzbGlkZSApO1xuXHRcdFx0XHRcdGlmKCBub3RlcyApIHtcblx0XHRcdFx0XHRcdHZhciBub3Rlc1NwYWNpbmcgPSA4O1xuXHRcdFx0XHRcdFx0dmFyIG5vdGVzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0XHRcdFx0XHRub3Rlc0VsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ3NwZWFrZXItbm90ZXMnICk7XG5cdFx0XHRcdFx0XHRub3Rlc0VsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ3NwZWFrZXItbm90ZXMtcGRmJyApO1xuXHRcdFx0XHRcdFx0bm90ZXNFbGVtZW50LmlubmVySFRNTCA9IG5vdGVzO1xuXHRcdFx0XHRcdFx0bm90ZXNFbGVtZW50LnN0eWxlLmxlZnQgPSAoIG5vdGVzU3BhY2luZyAtIGxlZnQgKSArICdweCc7XG5cdFx0XHRcdFx0XHRub3Rlc0VsZW1lbnQuc3R5bGUuYm90dG9tID0gKCBub3Rlc1NwYWNpbmcgLSB0b3AgKSArICdweCc7XG5cdFx0XHRcdFx0XHRub3Rlc0VsZW1lbnQuc3R5bGUud2lkdGggPSAoIHBhZ2VXaWR0aCAtIG5vdGVzU3BhY2luZyoyICkgKyAncHgnO1xuXHRcdFx0XHRcdFx0c2xpZGUuYXBwZW5kQ2hpbGQoIG5vdGVzRWxlbWVudCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEluamVjdCBzbGlkZSBudW1iZXJzIGlmIGBzbGlkZU51bWJlcnNgIGFyZSBlbmFibGVkXG5cdFx0XHRcdGlmKCBjb25maWcuc2xpZGVOdW1iZXIgKSB7XG5cdFx0XHRcdFx0dmFyIHNsaWRlTnVtYmVySCA9IHBhcnNlSW50KCBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LWgnICksIDEwICkgKyAxLFxuXHRcdFx0XHRcdFx0c2xpZGVOdW1iZXJWID0gcGFyc2VJbnQoIHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtdicgKSwgMTAgKSArIDE7XG5cblx0XHRcdFx0XHR2YXIgbnVtYmVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0XHRcdFx0bnVtYmVyRWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnc2xpZGUtbnVtYmVyJyApO1xuXHRcdFx0XHRcdG51bWJlckVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ3NsaWRlLW51bWJlci1wZGYnICk7XG5cdFx0XHRcdFx0bnVtYmVyRWxlbWVudC5pbm5lckhUTUwgPSBmb3JtYXRTbGlkZU51bWJlciggc2xpZGVOdW1iZXJILCAnLicsIHNsaWRlTnVtYmVyViApO1xuXHRcdFx0XHRcdGJhY2tncm91bmQuYXBwZW5kQ2hpbGQoIG51bWJlckVsZW1lbnQgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fSApO1xuXG5cdFx0Ly8gU2hvdyBhbGwgZnJhZ21lbnRzXG5cdFx0dG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICsgJyAuZnJhZ21lbnQnICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZnJhZ21lbnQgKSB7XG5cdFx0XHRmcmFnbWVudC5jbGFzc0xpc3QuYWRkKCAndmlzaWJsZScgKTtcblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIGlzIGFuIHVuZm9ydHVuYXRlIG5lY2Vzc2l0eS4gU29tZSBhY3Rpb25zIOKAkyBzdWNoIGFzXG5cdCAqIGFuIGlucHV0IGZpZWxkIGJlaW5nIGZvY3VzZWQgaW4gYW4gaWZyYW1lIG9yIHVzaW5nIHRoZVxuXHQgKiBrZXlib2FyZCB0byBleHBhbmQgdGV4dCBzZWxlY3Rpb24gYmV5b25kIHRoZSBib3VuZHMgb2Zcblx0ICogYSBzbGlkZSDigJMgY2FuIHRyaWdnZXIgb3VyIGNvbnRlbnQgdG8gYmUgcHVzaGVkIG91dCBvZiB2aWV3LlxuXHQgKiBUaGlzIHNjcm9sbGluZyBjYW4gbm90IGJlIHByZXZlbnRlZCBieSBoaWRpbmcgb3ZlcmZsb3cgaW5cblx0ICogQ1NTICh3ZSBhbHJlYWR5IGRvKSBzbyB3ZSBoYXZlIHRvIHJlc29ydCB0byByZXBlYXRlZGx5XG5cdCAqIGNoZWNraW5nIGlmIHRoZSBzbGlkZXMgaGF2ZSBiZWVuIG9mZnNldCA6KFxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0dXBTY3JvbGxQcmV2ZW50aW9uKCkge1xuXG5cdFx0c2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYoIGRvbS53cmFwcGVyLnNjcm9sbFRvcCAhPT0gMCB8fCBkb20ud3JhcHBlci5zY3JvbGxMZWZ0ICE9PSAwICkge1xuXHRcdFx0XHRkb20ud3JhcHBlci5zY3JvbGxUb3AgPSAwO1xuXHRcdFx0XHRkb20ud3JhcHBlci5zY3JvbGxMZWZ0ID0gMDtcblx0XHRcdH1cblx0XHR9LCAxMDAwICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGFuIEhUTUwgZWxlbWVudCBhbmQgcmV0dXJucyBhIHJlZmVyZW5jZSB0byBpdC5cblx0ICogSWYgdGhlIGVsZW1lbnQgYWxyZWFkeSBleGlzdHMgdGhlIGV4aXN0aW5nIGluc3RhbmNlIHdpbGxcblx0ICogYmUgcmV0dXJuZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVTaW5nbGV0b25Ob2RlKCBjb250YWluZXIsIHRhZ25hbWUsIGNsYXNzbmFtZSwgaW5uZXJIVE1MICkge1xuXG5cdFx0Ly8gRmluZCBhbGwgbm9kZXMgbWF0Y2hpbmcgdGhlIGRlc2NyaXB0aW9uXG5cdFx0dmFyIG5vZGVzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoICcuJyArIGNsYXNzbmFtZSApO1xuXG5cdFx0Ly8gQ2hlY2sgYWxsIG1hdGNoZXMgdG8gZmluZCBvbmUgd2hpY2ggaXMgYSBkaXJlY3QgY2hpbGQgb2Zcblx0XHQvLyB0aGUgc3BlY2lmaWVkIGNvbnRhaW5lclxuXHRcdGZvciggdmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHR2YXIgdGVzdE5vZGUgPSBub2Rlc1tpXTtcblx0XHRcdGlmKCB0ZXN0Tm9kZS5wYXJlbnROb2RlID09PSBjb250YWluZXIgKSB7XG5cdFx0XHRcdHJldHVybiB0ZXN0Tm9kZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBJZiBubyBub2RlIHdhcyBmb3VuZCwgY3JlYXRlIGl0IG5vd1xuXHRcdHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggdGFnbmFtZSApO1xuXHRcdG5vZGUuY2xhc3NMaXN0LmFkZCggY2xhc3NuYW1lICk7XG5cdFx0aWYoIHR5cGVvZiBpbm5lckhUTUwgPT09ICdzdHJpbmcnICkge1xuXHRcdFx0bm9kZS5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG5cdFx0fVxuXHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZCggbm9kZSApO1xuXG5cdFx0cmV0dXJuIG5vZGU7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBzbGlkZSBiYWNrZ3JvdW5kIGVsZW1lbnRzIGFuZCBhcHBlbmRzIHRoZW1cblx0ICogdG8gdGhlIGJhY2tncm91bmQgY29udGFpbmVyLiBPbmUgZWxlbWVudCBpcyBjcmVhdGVkIHBlclxuXHQgKiBzbGlkZSBubyBtYXR0ZXIgaWYgdGhlIGdpdmVuIHNsaWRlIGhhcyB2aXNpYmxlIGJhY2tncm91bmQuXG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVCYWNrZ3JvdW5kcygpIHtcblxuXHRcdHZhciBwcmludE1vZGUgPSBpc1ByaW50aW5nUERGKCk7XG5cblx0XHQvLyBDbGVhciBwcmlvciBiYWNrZ3JvdW5kc1xuXHRcdGRvbS5iYWNrZ3JvdW5kLmlubmVySFRNTCA9ICcnO1xuXHRcdGRvbS5iYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoICduby10cmFuc2l0aW9uJyApO1xuXG5cdFx0Ly8gSXRlcmF0ZSBvdmVyIGFsbCBob3Jpem9udGFsIHNsaWRlc1xuXHRcdHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggc2xpZGVoICkge1xuXG5cdFx0XHR2YXIgYmFja2dyb3VuZFN0YWNrO1xuXG5cdFx0XHRpZiggcHJpbnRNb2RlICkge1xuXHRcdFx0XHRiYWNrZ3JvdW5kU3RhY2sgPSBjcmVhdGVCYWNrZ3JvdW5kKCBzbGlkZWgsIHNsaWRlaCApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGJhY2tncm91bmRTdGFjayA9IGNyZWF0ZUJhY2tncm91bmQoIHNsaWRlaCwgZG9tLmJhY2tncm91bmQgKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSXRlcmF0ZSBvdmVyIGFsbCB2ZXJ0aWNhbCBzbGlkZXNcblx0XHRcdHRvQXJyYXkoIHNsaWRlaC5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBzbGlkZXYgKSB7XG5cblx0XHRcdFx0aWYoIHByaW50TW9kZSApIHtcblx0XHRcdFx0XHRjcmVhdGVCYWNrZ3JvdW5kKCBzbGlkZXYsIHNsaWRldiApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGNyZWF0ZUJhY2tncm91bmQoIHNsaWRldiwgYmFja2dyb3VuZFN0YWNrICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRiYWNrZ3JvdW5kU3RhY2suY2xhc3NMaXN0LmFkZCggJ3N0YWNrJyApO1xuXG5cdFx0XHR9ICk7XG5cblx0XHR9ICk7XG5cblx0XHQvLyBBZGQgcGFyYWxsYXggYmFja2dyb3VuZCBpZiBzcGVjaWZpZWRcblx0XHRpZiggY29uZmlnLnBhcmFsbGF4QmFja2dyb3VuZEltYWdlICkge1xuXG5cdFx0XHRkb20uYmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiJyArIGNvbmZpZy5wYXJhbGxheEJhY2tncm91bmRJbWFnZSArICdcIiknO1xuXHRcdFx0ZG9tLmJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBjb25maWcucGFyYWxsYXhCYWNrZ3JvdW5kU2l6ZTtcblxuXHRcdFx0Ly8gTWFrZSBzdXJlIHRoZSBiZWxvdyBwcm9wZXJ0aWVzIGFyZSBzZXQgb24gdGhlIGVsZW1lbnQgLSB0aGVzZSBwcm9wZXJ0aWVzIGFyZVxuXHRcdFx0Ly8gbmVlZGVkIGZvciBwcm9wZXIgdHJhbnNpdGlvbnMgdG8gYmUgc2V0IG9uIHRoZSBlbGVtZW50IHZpYSBDU1MuIFRvIHJlbW92ZVxuXHRcdFx0Ly8gYW5ub3lpbmcgYmFja2dyb3VuZCBzbGlkZS1pbiBlZmZlY3Qgd2hlbiB0aGUgcHJlc2VudGF0aW9uIHN0YXJ0cywgYXBwbHlcblx0XHRcdC8vIHRoZXNlIHByb3BlcnRpZXMgYWZ0ZXIgc2hvcnQgdGltZSBkZWxheVxuXHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoICdoYXMtcGFyYWxsYXgtYmFja2dyb3VuZCcgKTtcblx0XHRcdH0sIDEgKTtcblxuXHRcdH1cblx0XHRlbHNlIHtcblxuXHRcdFx0ZG9tLmJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJyc7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCAnaGFzLXBhcmFsbGF4LWJhY2tncm91bmQnICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgYmFja2dyb3VuZCBmb3IgdGhlIGdpdmVuIHNsaWRlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzbGlkZVxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgVGhlIGVsZW1lbnQgdGhhdCB0aGUgYmFja2dyb3VuZFxuXHQgKiBzaG91bGQgYmUgYXBwZW5kZWQgdG9cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZUJhY2tncm91bmQoIHNsaWRlLCBjb250YWluZXIgKSB7XG5cblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdGJhY2tncm91bmQ6IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZCcgKSxcblx0XHRcdGJhY2tncm91bmRTaXplOiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtc2l6ZScgKSxcblx0XHRcdGJhY2tncm91bmRJbWFnZTogc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWltYWdlJyApLFxuXHRcdFx0YmFja2dyb3VuZFZpZGVvOiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtdmlkZW8nICksXG5cdFx0XHRiYWNrZ3JvdW5kSWZyYW1lOiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtaWZyYW1lJyApLFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtY29sb3InICksXG5cdFx0XHRiYWNrZ3JvdW5kUmVwZWF0OiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtcmVwZWF0JyApLFxuXHRcdFx0YmFja2dyb3VuZFBvc2l0aW9uOiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtcG9zaXRpb24nICksXG5cdFx0XHRiYWNrZ3JvdW5kVHJhbnNpdGlvbjogc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLXRyYW5zaXRpb24nIClcblx0XHR9O1xuXG5cdFx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXG5cdFx0Ly8gQ2Fycnkgb3ZlciBjdXN0b20gY2xhc3NlcyBmcm9tIHRoZSBzbGlkZSB0byB0aGUgYmFja2dyb3VuZFxuXHRcdGVsZW1lbnQuY2xhc3NOYW1lID0gJ3NsaWRlLWJhY2tncm91bmQgJyArIHNsaWRlLmNsYXNzTmFtZS5yZXBsYWNlKCAvcHJlc2VudHxwYXN0fGZ1dHVyZS8sICcnICk7XG5cblx0XHRpZiggZGF0YS5iYWNrZ3JvdW5kICkge1xuXHRcdFx0Ly8gQXV0by13cmFwIGltYWdlIHVybHMgaW4gdXJsKC4uLilcblx0XHRcdGlmKCAvXihodHRwfGZpbGV8XFwvXFwvKS9naS50ZXN0KCBkYXRhLmJhY2tncm91bmQgKSB8fCAvXFwuKHN2Z3xwbmd8anBnfGpwZWd8Z2lmfGJtcCkkL2dpLnRlc3QoIGRhdGEuYmFja2dyb3VuZCApICkge1xuXHRcdFx0XHRzbGlkZS5zZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtaW1hZ2UnLCBkYXRhLmJhY2tncm91bmQgKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmJhY2tncm91bmQgPSBkYXRhLmJhY2tncm91bmQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gQ3JlYXRlIGEgaGFzaCBmb3IgdGhpcyBjb21iaW5hdGlvbiBvZiBiYWNrZ3JvdW5kIHNldHRpbmdzLlxuXHRcdC8vIFRoaXMgaXMgdXNlZCB0byBkZXRlcm1pbmUgd2hlbiB0d28gc2xpZGUgYmFja2dyb3VuZHMgYXJlXG5cdFx0Ly8gdGhlIHNhbWUuXG5cdFx0aWYoIGRhdGEuYmFja2dyb3VuZCB8fCBkYXRhLmJhY2tncm91bmRDb2xvciB8fCBkYXRhLmJhY2tncm91bmRJbWFnZSB8fCBkYXRhLmJhY2tncm91bmRWaWRlbyB8fCBkYXRhLmJhY2tncm91bmRJZnJhbWUgKSB7XG5cdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1oYXNoJywgZGF0YS5iYWNrZ3JvdW5kICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuYmFja2dyb3VuZFNpemUgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5iYWNrZ3JvdW5kSW1hZ2UgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5iYWNrZ3JvdW5kVmlkZW8gK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5iYWNrZ3JvdW5kSWZyYW1lICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuYmFja2dyb3VuZENvbG9yICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuYmFja2dyb3VuZFJlcGVhdCArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmJhY2tncm91bmRQb3NpdGlvbiArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmJhY2tncm91bmRUcmFuc2l0aW9uICk7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkaXRpb25hbCBhbmQgb3B0aW9uYWwgYmFja2dyb3VuZCBwcm9wZXJ0aWVzXG5cdFx0aWYoIGRhdGEuYmFja2dyb3VuZFNpemUgKSBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRTaXplID0gZGF0YS5iYWNrZ3JvdW5kU2l6ZTtcblx0XHRpZiggZGF0YS5iYWNrZ3JvdW5kQ29sb3IgKSBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGRhdGEuYmFja2dyb3VuZENvbG9yO1xuXHRcdGlmKCBkYXRhLmJhY2tncm91bmRSZXBlYXQgKSBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSBkYXRhLmJhY2tncm91bmRSZXBlYXQ7XG5cdFx0aWYoIGRhdGEuYmFja2dyb3VuZFBvc2l0aW9uICkgZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBkYXRhLmJhY2tncm91bmRQb3NpdGlvbjtcblx0XHRpZiggZGF0YS5iYWNrZ3JvdW5kVHJhbnNpdGlvbiApIGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLXRyYW5zaXRpb24nLCBkYXRhLmJhY2tncm91bmRUcmFuc2l0aW9uICk7XG5cblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQoIGVsZW1lbnQgKTtcblxuXHRcdC8vIElmIGJhY2tncm91bmRzIGFyZSBiZWluZyByZWNyZWF0ZWQsIGNsZWFyIG9sZCBjbGFzc2VzXG5cdFx0c2xpZGUuY2xhc3NMaXN0LnJlbW92ZSggJ2hhcy1kYXJrLWJhY2tncm91bmQnICk7XG5cdFx0c2xpZGUuY2xhc3NMaXN0LnJlbW92ZSggJ2hhcy1saWdodC1iYWNrZ3JvdW5kJyApO1xuXG5cdFx0Ly8gSWYgdGhpcyBzbGlkZSBoYXMgYSBiYWNrZ3JvdW5kIGNvbG9yLCBhZGQgYSBjbGFzcyB0aGF0XG5cdFx0Ly8gc2lnbmFscyBpZiBpdCBpcyBsaWdodCBvciBkYXJrLiBJZiB0aGUgc2xpZGUgaGFzIG5vIGJhY2tncm91bmRcblx0XHQvLyBjb2xvciwgbm8gY2xhc3Mgd2lsbCBiZSBzZXRcblx0XHR2YXIgY29tcHV0ZWRCYWNrZ3JvdW5kQ29sb3IgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggZWxlbWVudCApLmJhY2tncm91bmRDb2xvcjtcblx0XHRpZiggY29tcHV0ZWRCYWNrZ3JvdW5kQ29sb3IgKSB7XG5cdFx0XHR2YXIgcmdiID0gY29sb3JUb1JnYiggY29tcHV0ZWRCYWNrZ3JvdW5kQ29sb3IgKTtcblxuXHRcdFx0Ly8gSWdub3JlIGZ1bGx5IHRyYW5zcGFyZW50IGJhY2tncm91bmRzLiBTb21lIGJyb3dzZXJzIHJldHVyblxuXHRcdFx0Ly8gcmdiYSgwLDAsMCwwKSB3aGVuIHJlYWRpbmcgdGhlIGNvbXB1dGVkIGJhY2tncm91bmQgY29sb3Igb2Zcblx0XHRcdC8vIGFuIGVsZW1lbnQgd2l0aCBubyBiYWNrZ3JvdW5kXG5cdFx0XHRpZiggcmdiICYmIHJnYi5hICE9PSAwICkge1xuXHRcdFx0XHRpZiggY29sb3JCcmlnaHRuZXNzKCBjb21wdXRlZEJhY2tncm91bmRDb2xvciApIDwgMTI4ICkge1xuXHRcdFx0XHRcdHNsaWRlLmNsYXNzTGlzdC5hZGQoICdoYXMtZGFyay1iYWNrZ3JvdW5kJyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHNsaWRlLmNsYXNzTGlzdC5hZGQoICdoYXMtbGlnaHQtYmFja2dyb3VuZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBlbGVtZW50O1xuXG5cdH1cblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIGEgbGlzdGVuZXIgdG8gcG9zdE1lc3NhZ2UgZXZlbnRzLCB0aGlzIG1ha2VzIGl0XG5cdCAqIHBvc3NpYmxlIHRvIGNhbGwgYWxsIHJldmVhbC5qcyBBUEkgbWV0aG9kcyBmcm9tIGFub3RoZXJcblx0ICogd2luZG93LiBGb3IgZXhhbXBsZTpcblx0ICpcblx0ICogcmV2ZWFsV2luZG93LnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSh7XG5cdCAqICAgbWV0aG9kOiAnc2xpZGUnLFxuXHQgKiAgIGFyZ3M6IFsgMiBdXG5cdCAqIH0pLCAnKicgKTtcblx0ICovXG5cdGZ1bmN0aW9uIHNldHVwUG9zdE1lc3NhZ2UoKSB7XG5cblx0XHRpZiggY29uZmlnLnBvc3RNZXNzYWdlICkge1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtZXNzYWdlJywgZnVuY3Rpb24gKCBldmVudCApIHtcblx0XHRcdFx0dmFyIGRhdGEgPSBldmVudC5kYXRhO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSdyZSBkZWFsaW5nIHdpdGggSlNPTlxuXHRcdFx0XHRpZiggdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnICYmIGRhdGEuY2hhckF0KCAwICkgPT09ICd7JyAmJiBkYXRhLmNoYXJBdCggZGF0YS5sZW5ndGggLSAxICkgPT09ICd9JyApIHtcblx0XHRcdFx0XHRkYXRhID0gSlNPTi5wYXJzZSggZGF0YSApO1xuXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIHJlcXVlc3RlZCBtZXRob2QgY2FuIGJlIGZvdW5kXG5cdFx0XHRcdFx0aWYoIGRhdGEubWV0aG9kICYmIHR5cGVvZiBSZXZlYWxbZGF0YS5tZXRob2RdID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdFx0UmV2ZWFsW2RhdGEubWV0aG9kXS5hcHBseSggUmV2ZWFsLCBkYXRhLmFyZ3MgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sIGZhbHNlICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyB0aGUgY29uZmlndXJhdGlvbiBzZXR0aW5ncyBmcm9tIHRoZSBjb25maWdcblx0ICogb2JqZWN0LiBNYXkgYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzLlxuXHQgKi9cblx0ZnVuY3Rpb24gY29uZmlndXJlKCBvcHRpb25zICkge1xuXG5cdFx0dmFyIG51bWJlck9mU2xpZGVzID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICkubGVuZ3RoO1xuXG5cdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggY29uZmlnLnRyYW5zaXRpb24gKTtcblxuXHRcdC8vIE5ldyBjb25maWcgb3B0aW9ucyBtYXkgYmUgcGFzc2VkIHdoZW4gdGhpcyBtZXRob2Rcblx0XHQvLyBpcyBpbnZva2VkIHRocm91Z2ggdGhlIEFQSSBhZnRlciBpbml0aWFsaXphdGlvblxuXHRcdGlmKCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgKSBleHRlbmQoIGNvbmZpZywgb3B0aW9ucyApO1xuXG5cdFx0Ly8gRm9yY2UgbGluZWFyIHRyYW5zaXRpb24gYmFzZWQgb24gYnJvd3NlciBjYXBhYmlsaXRpZXNcblx0XHRpZiggZmVhdHVyZXMudHJhbnNmb3JtczNkID09PSBmYWxzZSApIGNvbmZpZy50cmFuc2l0aW9uID0gJ2xpbmVhcic7XG5cblx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCBjb25maWcudHJhbnNpdGlvbiApO1xuXG5cdFx0ZG9tLndyYXBwZXIuc2V0QXR0cmlidXRlKCAnZGF0YS10cmFuc2l0aW9uLXNwZWVkJywgY29uZmlnLnRyYW5zaXRpb25TcGVlZCApO1xuXHRcdGRvbS53cmFwcGVyLnNldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC10cmFuc2l0aW9uJywgY29uZmlnLmJhY2tncm91bmRUcmFuc2l0aW9uICk7XG5cblx0XHRkb20uY29udHJvbHMuc3R5bGUuZGlzcGxheSA9IGNvbmZpZy5jb250cm9scyA/ICdibG9jaycgOiAnbm9uZSc7XG5cdFx0ZG9tLnByb2dyZXNzLnN0eWxlLmRpc3BsYXkgPSBjb25maWcucHJvZ3Jlc3MgPyAnYmxvY2snIDogJ25vbmUnO1xuXHRcdGRvbS5zbGlkZU51bWJlci5zdHlsZS5kaXNwbGF5ID0gY29uZmlnLnNsaWRlTnVtYmVyICYmICFpc1ByaW50aW5nUERGKCkgPyAnYmxvY2snIDogJ25vbmUnO1xuXG5cdFx0aWYoIGNvbmZpZy5zaHVmZmxlICkge1xuXHRcdFx0c2h1ZmZsZSgpO1xuXHRcdH1cblxuXHRcdGlmKCBjb25maWcucnRsICkge1xuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggJ3J0bCcgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCAncnRsJyApO1xuXHRcdH1cblxuXHRcdGlmKCBjb25maWcuY2VudGVyICkge1xuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggJ2NlbnRlcicgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCAnY2VudGVyJyApO1xuXHRcdH1cblxuXHRcdC8vIEV4aXQgdGhlIHBhdXNlZCBtb2RlIGlmIGl0IHdhcyBjb25maWd1cmVkIG9mZlxuXHRcdGlmKCBjb25maWcucGF1c2UgPT09IGZhbHNlICkge1xuXHRcdFx0cmVzdW1lKCk7XG5cdFx0fVxuXG5cdFx0aWYoIGNvbmZpZy5zaG93Tm90ZXMgKSB7XG5cdFx0XHRkb20uc3BlYWtlck5vdGVzLmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGRvbS5zcGVha2VyTm90ZXMuY2xhc3NMaXN0LnJlbW92ZSggJ3Zpc2libGUnICk7XG5cdFx0fVxuXG5cdFx0aWYoIGNvbmZpZy5tb3VzZVdoZWVsICkge1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTU1vdXNlU2Nyb2xsJywgb25Eb2N1bWVudE1vdXNlU2Nyb2xsLCBmYWxzZSApOyAvLyBGRlxuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNld2hlZWwnLCBvbkRvY3VtZW50TW91c2VTY3JvbGwsIGZhbHNlICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ0RPTU1vdXNlU2Nyb2xsJywgb25Eb2N1bWVudE1vdXNlU2Nyb2xsLCBmYWxzZSApOyAvLyBGRlxuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNld2hlZWwnLCBvbkRvY3VtZW50TW91c2VTY3JvbGwsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0Ly8gUm9sbGluZyAzRCBsaW5rc1xuXHRcdGlmKCBjb25maWcucm9sbGluZ0xpbmtzICkge1xuXHRcdFx0ZW5hYmxlUm9sbGluZ0xpbmtzKCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZGlzYWJsZVJvbGxpbmdMaW5rcygpO1xuXHRcdH1cblxuXHRcdC8vIElmcmFtZSBsaW5rIHByZXZpZXdzXG5cdFx0aWYoIGNvbmZpZy5wcmV2aWV3TGlua3MgKSB7XG5cdFx0XHRlbmFibGVQcmV2aWV3TGlua3MoKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRkaXNhYmxlUHJldmlld0xpbmtzKCk7XG5cdFx0XHRlbmFibGVQcmV2aWV3TGlua3MoICdbZGF0YS1wcmV2aWV3LWxpbmtdJyApO1xuXHRcdH1cblxuXHRcdC8vIFJlbW92ZSBleGlzdGluZyBhdXRvLXNsaWRlIGNvbnRyb2xzXG5cdFx0aWYoIGF1dG9TbGlkZVBsYXllciApIHtcblx0XHRcdGF1dG9TbGlkZVBsYXllci5kZXN0cm95KCk7XG5cdFx0XHRhdXRvU2xpZGVQbGF5ZXIgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vIEdlbmVyYXRlIGF1dG8tc2xpZGUgY29udHJvbHMgaWYgbmVlZGVkXG5cdFx0aWYoIG51bWJlck9mU2xpZGVzID4gMSAmJiBjb25maWcuYXV0b1NsaWRlICYmIGNvbmZpZy5hdXRvU2xpZGVTdG9wcGFibGUgJiYgZmVhdHVyZXMuY2FudmFzICYmIGZlYXR1cmVzLnJlcXVlc3RBbmltYXRpb25GcmFtZSApIHtcblx0XHRcdGF1dG9TbGlkZVBsYXllciA9IG5ldyBQbGF5YmFjayggZG9tLndyYXBwZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gTWF0aC5taW4oIE1hdGgubWF4KCAoIERhdGUubm93KCkgLSBhdXRvU2xpZGVTdGFydFRpbWUgKSAvIGF1dG9TbGlkZSwgMCApLCAxICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGF1dG9TbGlkZVBsYXllci5vbiggJ2NsaWNrJywgb25BdXRvU2xpZGVQbGF5ZXJDbGljayApO1xuXHRcdFx0YXV0b1NsaWRlUGF1c2VkID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gV2hlbiBmcmFnbWVudHMgYXJlIHR1cm5lZCBvZmYgdGhleSBzaG91bGQgYmUgdmlzaWJsZVxuXHRcdGlmKCBjb25maWcuZnJhZ21lbnRzID09PSBmYWxzZSApIHtcblx0XHRcdHRvQXJyYXkoIGRvbS5zbGlkZXMucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdjdXJyZW50LWZyYWdtZW50JyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdHN5bmMoKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmRzIGFsbCBldmVudCBsaXN0ZW5lcnMuXG5cdCAqL1xuXHRmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVycygpIHtcblxuXHRcdGV2ZW50c0FyZUJvdW5kID0gdHJ1ZTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnaGFzaGNoYW5nZScsIG9uV2luZG93SGFzaENoYW5nZSwgZmFsc2UgKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplLCBmYWxzZSApO1xuXG5cdFx0aWYoIGNvbmZpZy50b3VjaCApIHtcblx0XHRcdGRvbS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0LCBmYWxzZSApO1xuXHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlLCBmYWxzZSApO1xuXHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCwgZmFsc2UgKTtcblxuXHRcdFx0Ly8gU3VwcG9ydCBwb2ludGVyLXN0eWxlIHRvdWNoIGludGVyYWN0aW9uIGFzIHdlbGxcblx0XHRcdGlmKCB3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkICkge1xuXHRcdFx0XHQvLyBJRSAxMSB1c2VzIHVuLXByZWZpeGVkIHZlcnNpb24gb2YgcG9pbnRlciBldmVudHNcblx0XHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJkb3duJywgb25Qb2ludGVyRG93biwgZmFsc2UgKTtcblx0XHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJtb3ZlJywgb25Qb2ludGVyTW92ZSwgZmFsc2UgKTtcblx0XHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJ1cCcsIG9uUG9pbnRlclVwLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkICkge1xuXHRcdFx0XHQvLyBJRSAxMCB1c2VzIHByZWZpeGVkIHZlcnNpb24gb2YgcG9pbnRlciBldmVudHNcblx0XHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlckRvd24nLCBvblBvaW50ZXJEb3duLCBmYWxzZSApO1xuXHRcdFx0XHRkb20ud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyTW92ZScsIG9uUG9pbnRlck1vdmUsIGZhbHNlICk7XG5cdFx0XHRcdGRvbS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoICdNU1BvaW50ZXJVcCcsIG9uUG9pbnRlclVwLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKCBjb25maWcua2V5Ym9hcmQgKSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIG9uRG9jdW1lbnRLZXlEb3duLCBmYWxzZSApO1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2tleXByZXNzJywgb25Eb2N1bWVudEtleVByZXNzLCBmYWxzZSApO1xuXHRcdH1cblxuXHRcdGlmKCBjb25maWcucHJvZ3Jlc3MgJiYgZG9tLnByb2dyZXNzICkge1xuXHRcdFx0ZG9tLnByb2dyZXNzLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIG9uUHJvZ3Jlc3NDbGlja2VkLCBmYWxzZSApO1xuXHRcdH1cblxuXHRcdGlmKCBjb25maWcuZm9jdXNCb2R5T25QYWdlVmlzaWJpbGl0eUNoYW5nZSApIHtcblx0XHRcdHZhciB2aXNpYmlsaXR5Q2hhbmdlO1xuXG5cdFx0XHRpZiggJ2hpZGRlbicgaW4gZG9jdW1lbnQgKSB7XG5cdFx0XHRcdHZpc2liaWxpdHlDaGFuZ2UgPSAndmlzaWJpbGl0eWNoYW5nZSc7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCAnbXNIaWRkZW4nIGluIGRvY3VtZW50ICkge1xuXHRcdFx0XHR2aXNpYmlsaXR5Q2hhbmdlID0gJ21zdmlzaWJpbGl0eWNoYW5nZSc7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCAnd2Via2l0SGlkZGVuJyBpbiBkb2N1bWVudCApIHtcblx0XHRcdFx0dmlzaWJpbGl0eUNoYW5nZSA9ICd3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlJztcblx0XHRcdH1cblxuXHRcdFx0aWYoIHZpc2liaWxpdHlDaGFuZ2UgKSB7XG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIHZpc2liaWxpdHlDaGFuZ2UsIG9uUGFnZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gTGlzdGVuIHRvIGJvdGggdG91Y2ggYW5kIGNsaWNrIGV2ZW50cywgaW4gY2FzZSB0aGUgZGV2aWNlXG5cdFx0Ly8gc3VwcG9ydHMgYm90aFxuXHRcdHZhciBwb2ludGVyRXZlbnRzID0gWyAndG91Y2hzdGFydCcsICdjbGljaycgXTtcblxuXHRcdC8vIE9ubHkgc3VwcG9ydCB0b3VjaCBmb3IgQW5kcm9pZCwgZml4ZXMgZG91YmxlIG5hdmlnYXRpb25zIGluXG5cdFx0Ly8gc3RvY2sgYnJvd3NlclxuXHRcdGlmKCBVQS5tYXRjaCggL2FuZHJvaWQvZ2kgKSApIHtcblx0XHRcdHBvaW50ZXJFdmVudHMgPSBbICd0b3VjaHN0YXJ0JyBdO1xuXHRcdH1cblxuXHRcdHBvaW50ZXJFdmVudHMuZm9yRWFjaCggZnVuY3Rpb24oIGV2ZW50TmFtZSApIHtcblx0XHRcdGRvbS5jb250cm9sc0xlZnQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5hZGRFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVMZWZ0Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzUmlnaHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5hZGRFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVSaWdodENsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc1VwLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlVXBDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNEb3duLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlRG93bkNsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc1ByZXYuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5hZGRFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVQcmV2Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzTmV4dC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZU5leHRDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogVW5iaW5kcyBhbGwgZXZlbnQgbGlzdGVuZXJzLlxuXHQgKi9cblx0ZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG5cblx0XHRldmVudHNBcmVCb3VuZCA9IGZhbHNlO1xuXG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBvbkRvY3VtZW50S2V5RG93biwgZmFsc2UgKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAna2V5cHJlc3MnLCBvbkRvY3VtZW50S2V5UHJlc3MsIGZhbHNlICk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdoYXNoY2hhbmdlJywgb25XaW5kb3dIYXNoQ2hhbmdlLCBmYWxzZSApO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAncmVzaXplJywgb25XaW5kb3dSZXNpemUsIGZhbHNlICk7XG5cblx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIG9uVG91Y2hTdGFydCwgZmFsc2UgKTtcblx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAndG91Y2htb3ZlJywgb25Ub3VjaE1vdmUsIGZhbHNlICk7XG5cdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCwgZmFsc2UgKTtcblxuXHRcdC8vIElFMTFcblx0XHRpZiggd2luZG93Lm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCApIHtcblx0XHRcdGRvbS53cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdwb2ludGVyZG93bicsIG9uUG9pbnRlckRvd24sIGZhbHNlICk7XG5cdFx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAncG9pbnRlcm1vdmUnLCBvblBvaW50ZXJNb3ZlLCBmYWxzZSApO1xuXHRcdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJ1cCcsIG9uUG9pbnRlclVwLCBmYWxzZSApO1xuXHRcdH1cblx0XHQvLyBJRTEwXG5cdFx0ZWxzZSBpZiggd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkICkge1xuXHRcdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlckRvd24nLCBvblBvaW50ZXJEb3duLCBmYWxzZSApO1xuXHRcdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlck1vdmUnLCBvblBvaW50ZXJNb3ZlLCBmYWxzZSApO1xuXHRcdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlclVwJywgb25Qb2ludGVyVXAsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBjb25maWcucHJvZ3Jlc3MgJiYgZG9tLnByb2dyZXNzICkge1xuXHRcdFx0ZG9tLnByb2dyZXNzLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjbGljaycsIG9uUHJvZ3Jlc3NDbGlja2VkLCBmYWxzZSApO1xuXHRcdH1cblxuXHRcdFsgJ3RvdWNoc3RhcnQnLCAnY2xpY2snIF0uZm9yRWFjaCggZnVuY3Rpb24oIGV2ZW50TmFtZSApIHtcblx0XHRcdGRvbS5jb250cm9sc0xlZnQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVMZWZ0Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzUmlnaHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVSaWdodENsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc1VwLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlVXBDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNEb3duLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlRG93bkNsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc1ByZXYuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVQcmV2Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzTmV4dC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZU5leHRDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogRXh0ZW5kIG9iamVjdCBhIHdpdGggdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG5cdCAqIElmIHRoZXJlJ3MgYSBjb25mbGljdCwgb2JqZWN0IGIgdGFrZXMgcHJlY2VkZW5jZS5cblx0ICovXG5cdGZ1bmN0aW9uIGV4dGVuZCggYSwgYiApIHtcblxuXHRcdGZvciggdmFyIGkgaW4gYiApIHtcblx0XHRcdGFbIGkgXSA9IGJbIGkgXTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyB0aGUgdGFyZ2V0IG9iamVjdCB0byBhbiBhcnJheS5cblx0ICovXG5cdGZ1bmN0aW9uIHRvQXJyYXkoIG8gKSB7XG5cblx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIG8gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFV0aWxpdHkgZm9yIGRlc2VyaWFsaXppbmcgYSB2YWx1ZS5cblx0ICovXG5cdGZ1bmN0aW9uIGRlc2VyaWFsaXplKCB2YWx1ZSApIHtcblxuXHRcdGlmKCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICkge1xuXHRcdFx0aWYoIHZhbHVlID09PSAnbnVsbCcgKSByZXR1cm4gbnVsbDtcblx0XHRcdGVsc2UgaWYoIHZhbHVlID09PSAndHJ1ZScgKSByZXR1cm4gdHJ1ZTtcblx0XHRcdGVsc2UgaWYoIHZhbHVlID09PSAnZmFsc2UnICkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0ZWxzZSBpZiggdmFsdWUubWF0Y2goIC9eXFxkKyQvICkgKSByZXR1cm4gcGFyc2VGbG9hdCggdmFsdWUgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBNZWFzdXJlcyB0aGUgZGlzdGFuY2UgaW4gcGl4ZWxzIGJldHdlZW4gcG9pbnQgYVxuXHQgKiBhbmQgcG9pbnQgYi5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGEgcG9pbnQgd2l0aCB4L3kgcHJvcGVydGllc1xuXHQgKiBAcGFyYW0ge09iamVjdH0gYiBwb2ludCB3aXRoIHgveSBwcm9wZXJ0aWVzXG5cdCAqL1xuXHRmdW5jdGlvbiBkaXN0YW5jZUJldHdlZW4oIGEsIGIgKSB7XG5cblx0XHR2YXIgZHggPSBhLnggLSBiLngsXG5cdFx0XHRkeSA9IGEueSAtIGIueTtcblxuXHRcdHJldHVybiBNYXRoLnNxcnQoIGR4KmR4ICsgZHkqZHkgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgYSBDU1MgdHJhbnNmb3JtIHRvIHRoZSB0YXJnZXQgZWxlbWVudC5cblx0ICovXG5cdGZ1bmN0aW9uIHRyYW5zZm9ybUVsZW1lbnQoIGVsZW1lbnQsIHRyYW5zZm9ybSApIHtcblxuXHRcdGVsZW1lbnQuc3R5bGUuV2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuXHRcdGVsZW1lbnQuc3R5bGUuTW96VHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuXHRcdGVsZW1lbnQuc3R5bGUubXNUcmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cdFx0ZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBBcHBsaWVzIENTUyB0cmFuc2Zvcm1zIHRvIHRoZSBzbGlkZXMgY29udGFpbmVyLiBUaGUgY29udGFpbmVyXG5cdCAqIGlzIHRyYW5zZm9ybWVkIGZyb20gdHdvIHNlcGFyYXRlIHNvdXJjZXM6IGxheW91dCBhbmQgdGhlIG92ZXJ2aWV3XG5cdCAqIG1vZGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB0cmFuc2Zvcm1TbGlkZXMoIHRyYW5zZm9ybXMgKSB7XG5cblx0XHQvLyBQaWNrIHVwIG5ldyB0cmFuc2Zvcm1zIGZyb20gYXJndW1lbnRzXG5cdFx0aWYoIHR5cGVvZiB0cmFuc2Zvcm1zLmxheW91dCA9PT0gJ3N0cmluZycgKSBzbGlkZXNUcmFuc2Zvcm0ubGF5b3V0ID0gdHJhbnNmb3Jtcy5sYXlvdXQ7XG5cdFx0aWYoIHR5cGVvZiB0cmFuc2Zvcm1zLm92ZXJ2aWV3ID09PSAnc3RyaW5nJyApIHNsaWRlc1RyYW5zZm9ybS5vdmVydmlldyA9IHRyYW5zZm9ybXMub3ZlcnZpZXc7XG5cblx0XHQvLyBBcHBseSB0aGUgdHJhbnNmb3JtcyB0byB0aGUgc2xpZGVzIGNvbnRhaW5lclxuXHRcdGlmKCBzbGlkZXNUcmFuc2Zvcm0ubGF5b3V0ICkge1xuXHRcdFx0dHJhbnNmb3JtRWxlbWVudCggZG9tLnNsaWRlcywgc2xpZGVzVHJhbnNmb3JtLmxheW91dCArICcgJyArIHNsaWRlc1RyYW5zZm9ybS5vdmVydmlldyApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIGRvbS5zbGlkZXMsIHNsaWRlc1RyYW5zZm9ybS5vdmVydmlldyApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEluamVjdHMgdGhlIGdpdmVuIENTUyBzdHlsZXMgaW50byB0aGUgRE9NLlxuXHQgKi9cblx0ZnVuY3Rpb24gaW5qZWN0U3R5bGVTaGVldCggdmFsdWUgKSB7XG5cblx0XHR2YXIgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ3N0eWxlJyApO1xuXHRcdHRhZy50eXBlID0gJ3RleHQvY3NzJztcblx0XHRpZiggdGFnLnN0eWxlU2hlZXQgKSB7XG5cdFx0XHR0YWcuc3R5bGVTaGVldC5jc3NUZXh0ID0gdmFsdWU7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGFnLmFwcGVuZENoaWxkKCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSggdmFsdWUgKSApO1xuXHRcdH1cblx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2hlYWQnIClbMF0uYXBwZW5kQ2hpbGQoIHRhZyApO1xuXG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgdmFyaW91cyBjb2xvciBpbnB1dCBmb3JtYXRzIHRvIGFuIHtyOjAsZzowLGI6MH0gb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gY29sb3IgVGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIGNvbG9yLFxuXHQgKiB0aGUgZm9sbG93aW5nIGZvcm1hdHMgYXJlIHN1cHBvcnRlZDpcblx0ICogLSAjMDAwXG5cdCAqIC0gIzAwMDAwMFxuXHQgKiAtIHJnYigwLDAsMClcblx0ICovXG5cdGZ1bmN0aW9uIGNvbG9yVG9SZ2IoIGNvbG9yICkge1xuXG5cdFx0dmFyIGhleDMgPSBjb2xvci5tYXRjaCggL14jKFswLTlhLWZdezN9KSQvaSApO1xuXHRcdGlmKCBoZXgzICYmIGhleDNbMV0gKSB7XG5cdFx0XHRoZXgzID0gaGV4M1sxXTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHI6IHBhcnNlSW50KCBoZXgzLmNoYXJBdCggMCApLCAxNiApICogMHgxMSxcblx0XHRcdFx0ZzogcGFyc2VJbnQoIGhleDMuY2hhckF0KCAxICksIDE2ICkgKiAweDExLFxuXHRcdFx0XHRiOiBwYXJzZUludCggaGV4My5jaGFyQXQoIDIgKSwgMTYgKSAqIDB4MTFcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0dmFyIGhleDYgPSBjb2xvci5tYXRjaCggL14jKFswLTlhLWZdezZ9KSQvaSApO1xuXHRcdGlmKCBoZXg2ICYmIGhleDZbMV0gKSB7XG5cdFx0XHRoZXg2ID0gaGV4NlsxXTtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHI6IHBhcnNlSW50KCBoZXg2LnN1YnN0ciggMCwgMiApLCAxNiApLFxuXHRcdFx0XHRnOiBwYXJzZUludCggaGV4Ni5zdWJzdHIoIDIsIDIgKSwgMTYgKSxcblx0XHRcdFx0YjogcGFyc2VJbnQoIGhleDYuc3Vic3RyKCA0LCAyICksIDE2IClcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0dmFyIHJnYiA9IGNvbG9yLm1hdGNoKCAvXnJnYlxccypcXChcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKlxcKSQvaSApO1xuXHRcdGlmKCByZ2IgKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyOiBwYXJzZUludCggcmdiWzFdLCAxMCApLFxuXHRcdFx0XHRnOiBwYXJzZUludCggcmdiWzJdLCAxMCApLFxuXHRcdFx0XHRiOiBwYXJzZUludCggcmdiWzNdLCAxMCApXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHZhciByZ2JhID0gY29sb3IubWF0Y2goIC9ecmdiYVxccypcXChcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKixcXHMqKFxcZCspXFxzKlxcLFxccyooW1xcZF0rfFtcXGRdKi5bXFxkXSspXFxzKlxcKSQvaSApO1xuXHRcdGlmKCByZ2JhICkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cjogcGFyc2VJbnQoIHJnYmFbMV0sIDEwICksXG5cdFx0XHRcdGc6IHBhcnNlSW50KCByZ2JhWzJdLCAxMCApLFxuXHRcdFx0XHRiOiBwYXJzZUludCggcmdiYVszXSwgMTAgKSxcblx0XHRcdFx0YTogcGFyc2VGbG9hdCggcmdiYVs0XSApXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXG5cdH1cblxuXHQvKipcblx0ICogQ2FsY3VsYXRlcyBicmlnaHRuZXNzIG9uIGEgc2NhbGUgb2YgMC0yNTUuXG5cdCAqXG5cdCAqIEBwYXJhbSBjb2xvciBTZWUgY29sb3JTdHJpbmdUb1JnYiBmb3Igc3VwcG9ydGVkIGZvcm1hdHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBjb2xvckJyaWdodG5lc3MoIGNvbG9yICkge1xuXG5cdFx0aWYoIHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycgKSBjb2xvciA9IGNvbG9yVG9SZ2IoIGNvbG9yICk7XG5cblx0XHRpZiggY29sb3IgKSB7XG5cdFx0XHRyZXR1cm4gKCBjb2xvci5yICogMjk5ICsgY29sb3IuZyAqIDU4NyArIGNvbG9yLmIgKiAxMTQgKSAvIDEwMDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG51bGw7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGhlaWdodCBvZiB0aGUgZ2l2ZW4gZWxlbWVudCBieSBsb29raW5nXG5cdCAqIGF0IHRoZSBwb3NpdGlvbiBhbmQgaGVpZ2h0IG9mIGl0cyBpbW1lZGlhdGUgY2hpbGRyZW4uXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRBYnNvbHV0ZUhlaWdodCggZWxlbWVudCApIHtcblxuXHRcdHZhciBoZWlnaHQgPSAwO1xuXG5cdFx0aWYoIGVsZW1lbnQgKSB7XG5cdFx0XHR2YXIgYWJzb2x1dGVDaGlsZHJlbiA9IDA7XG5cblx0XHRcdHRvQXJyYXkoIGVsZW1lbnQuY2hpbGROb2RlcyApLmZvckVhY2goIGZ1bmN0aW9uKCBjaGlsZCApIHtcblxuXHRcdFx0XHRpZiggdHlwZW9mIGNoaWxkLm9mZnNldFRvcCA9PT0gJ251bWJlcicgJiYgY2hpbGQuc3R5bGUgKSB7XG5cdFx0XHRcdFx0Ly8gQ291bnQgIyBvZiBhYnMgY2hpbGRyZW5cblx0XHRcdFx0XHRpZiggd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGNoaWxkICkucG9zaXRpb24gPT09ICdhYnNvbHV0ZScgKSB7XG5cdFx0XHRcdFx0XHRhYnNvbHV0ZUNoaWxkcmVuICs9IDE7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aGVpZ2h0ID0gTWF0aC5tYXgoIGhlaWdodCwgY2hpbGQub2Zmc2V0VG9wICsgY2hpbGQub2Zmc2V0SGVpZ2h0ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBJZiB0aGVyZSBhcmUgbm8gYWJzb2x1dGUgY2hpbGRyZW4sIHVzZSBvZmZzZXRIZWlnaHRcblx0XHRcdGlmKCBhYnNvbHV0ZUNoaWxkcmVuID09PSAwICkge1xuXHRcdFx0XHRoZWlnaHQgPSBlbGVtZW50Lm9mZnNldEhlaWdodDtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiBoZWlnaHQ7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSByZW1haW5pbmcgaGVpZ2h0IHdpdGhpbiB0aGUgcGFyZW50IG9mIHRoZVxuXHQgKiB0YXJnZXQgZWxlbWVudC5cblx0ICpcblx0ICogcmVtYWluaW5nIGhlaWdodCA9IFsgY29uZmlndXJlZCBwYXJlbnQgaGVpZ2h0IF0gLSBbIGN1cnJlbnQgcGFyZW50IGhlaWdodCBdXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRSZW1haW5pbmdIZWlnaHQoIGVsZW1lbnQsIGhlaWdodCApIHtcblxuXHRcdGhlaWdodCA9IGhlaWdodCB8fCAwO1xuXG5cdFx0aWYoIGVsZW1lbnQgKSB7XG5cdFx0XHR2YXIgbmV3SGVpZ2h0LCBvbGRIZWlnaHQgPSBlbGVtZW50LnN0eWxlLmhlaWdodDtcblxuXHRcdFx0Ly8gQ2hhbmdlIHRoZSAuc3RyZXRjaCBlbGVtZW50IGhlaWdodCB0byAwIGluIG9yZGVyIGZpbmQgdGhlIGhlaWdodCBvZiBhbGxcblx0XHRcdC8vIHRoZSBvdGhlciBlbGVtZW50c1xuXHRcdFx0ZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMHB4Jztcblx0XHRcdG5ld0hlaWdodCA9IGhlaWdodCAtIGVsZW1lbnQucGFyZW50Tm9kZS5vZmZzZXRIZWlnaHQ7XG5cblx0XHRcdC8vIFJlc3RvcmUgdGhlIG9sZCBoZWlnaHQsIGp1c3QgaW4gY2FzZVxuXHRcdFx0ZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBvbGRIZWlnaHQgKyAncHgnO1xuXG5cdFx0XHRyZXR1cm4gbmV3SGVpZ2h0O1xuXHRcdH1cblxuXHRcdHJldHVybiBoZWlnaHQ7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhpcyBpbnN0YW5jZSBpcyBiZWluZyB1c2VkIHRvIHByaW50IGEgUERGLlxuXHQgKi9cblx0ZnVuY3Rpb24gaXNQcmludGluZ1BERigpIHtcblxuXHRcdHJldHVybiAoIC9wcmludC1wZGYvZ2kgKS50ZXN0KCB3aW5kb3cubG9jYXRpb24uc2VhcmNoICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIaWRlcyB0aGUgYWRkcmVzcyBiYXIgaWYgd2UncmUgb24gYSBtb2JpbGUgZGV2aWNlLlxuXHQgKi9cblx0ZnVuY3Rpb24gaGlkZUFkZHJlc3NCYXIoKSB7XG5cblx0XHRpZiggY29uZmlnLmhpZGVBZGRyZXNzQmFyICYmIGlzTW9iaWxlRGV2aWNlICkge1xuXHRcdFx0Ly8gRXZlbnRzIHRoYXQgc2hvdWxkIHRyaWdnZXIgdGhlIGFkZHJlc3MgYmFyIHRvIGhpZGVcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbG9hZCcsIHJlbW92ZUFkZHJlc3NCYXIsIGZhbHNlICk7XG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ29yaWVudGF0aW9uY2hhbmdlJywgcmVtb3ZlQWRkcmVzc0JhciwgZmFsc2UgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDYXVzZXMgdGhlIGFkZHJlc3MgYmFyIHRvIGhpZGUgb24gbW9iaWxlIGRldmljZXMsXG5cdCAqIG1vcmUgdmVydGljYWwgc3BhY2UgZnR3LlxuXHQgKi9cblx0ZnVuY3Rpb24gcmVtb3ZlQWRkcmVzc0JhcigpIHtcblxuXHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0d2luZG93LnNjcm9sbFRvKCAwLCAxICk7XG5cdFx0fSwgMTAgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIERpc3BhdGNoZXMgYW4gZXZlbnQgb2YgdGhlIHNwZWNpZmllZCB0eXBlIGZyb20gdGhlXG5cdCAqIHJldmVhbCBET00gZWxlbWVudC5cblx0ICovXG5cdGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQoIHR5cGUsIGFyZ3MgKSB7XG5cblx0XHR2YXIgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCggJ0hUTUxFdmVudHMnLCAxLCAyICk7XG5cdFx0ZXZlbnQuaW5pdEV2ZW50KCB0eXBlLCB0cnVlLCB0cnVlICk7XG5cdFx0ZXh0ZW5kKCBldmVudCwgYXJncyApO1xuXHRcdGRvbS53cmFwcGVyLmRpc3BhdGNoRXZlbnQoIGV2ZW50ICk7XG5cblx0XHQvLyBJZiB3ZSdyZSBpbiBhbiBpZnJhbWUsIHBvc3QgZWFjaCByZXZlYWwuanMgZXZlbnQgdG8gdGhlXG5cdFx0Ly8gcGFyZW50IHdpbmRvdy4gVXNlZCBieSB0aGUgbm90ZXMgcGx1Z2luXG5cdFx0aWYoIGNvbmZpZy5wb3N0TWVzc2FnZUV2ZW50cyAmJiB3aW5kb3cucGFyZW50ICE9PSB3aW5kb3cuc2VsZiApIHtcblx0XHRcdHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoIEpTT04uc3RyaW5naWZ5KHsgbmFtZXNwYWNlOiAncmV2ZWFsJywgZXZlbnROYW1lOiB0eXBlLCBzdGF0ZTogZ2V0U3RhdGUoKSB9KSwgJyonICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogV3JhcCBhbGwgbGlua3MgaW4gM0QgZ29vZG5lc3MuXG5cdCAqL1xuXHRmdW5jdGlvbiBlbmFibGVSb2xsaW5nTGlua3MoKSB7XG5cblx0XHRpZiggZmVhdHVyZXMudHJhbnNmb3JtczNkICYmICEoICdtc1BlcnNwZWN0aXZlJyBpbiBkb2N1bWVudC5ib2R5LnN0eWxlICkgKSB7XG5cdFx0XHR2YXIgYW5jaG9ycyA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFNMSURFU19TRUxFQ1RPUiArICcgYScgKTtcblxuXHRcdFx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IGFuY2hvcnMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHRcdHZhciBhbmNob3IgPSBhbmNob3JzW2ldO1xuXG5cdFx0XHRcdGlmKCBhbmNob3IudGV4dENvbnRlbnQgJiYgIWFuY2hvci5xdWVyeVNlbGVjdG9yKCAnKicgKSAmJiAoICFhbmNob3IuY2xhc3NOYW1lIHx8ICFhbmNob3IuY2xhc3NMaXN0LmNvbnRhaW5zKCBhbmNob3IsICdyb2xsJyApICkgKSB7XG5cdFx0XHRcdFx0dmFyIHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cdFx0XHRcdFx0c3Bhbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGl0bGUnLCBhbmNob3IudGV4dCk7XG5cdFx0XHRcdFx0c3Bhbi5pbm5lckhUTUwgPSBhbmNob3IuaW5uZXJIVE1MO1xuXG5cdFx0XHRcdFx0YW5jaG9yLmNsYXNzTGlzdC5hZGQoICdyb2xsJyApO1xuXHRcdFx0XHRcdGFuY2hvci5pbm5lckhUTUwgPSAnJztcblx0XHRcdFx0XHRhbmNob3IuYXBwZW5kQ2hpbGQoc3Bhbik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVbndyYXAgYWxsIDNEIGxpbmtzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlzYWJsZVJvbGxpbmdMaW5rcygpIHtcblxuXHRcdHZhciBhbmNob3JzID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICsgJyBhLnJvbGwnICk7XG5cblx0XHRmb3IoIHZhciBpID0gMCwgbGVuID0gYW5jaG9ycy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdHZhciBhbmNob3IgPSBhbmNob3JzW2ldO1xuXHRcdFx0dmFyIHNwYW4gPSBhbmNob3IucXVlcnlTZWxlY3RvciggJ3NwYW4nICk7XG5cblx0XHRcdGlmKCBzcGFuICkge1xuXHRcdFx0XHRhbmNob3IuY2xhc3NMaXN0LnJlbW92ZSggJ3JvbGwnICk7XG5cdFx0XHRcdGFuY2hvci5pbm5lckhUTUwgPSBzcGFuLmlubmVySFRNTDtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kIHByZXZpZXcgZnJhbWUgbGlua3MuXG5cdCAqL1xuXHRmdW5jdGlvbiBlbmFibGVQcmV2aWV3TGlua3MoIHNlbGVjdG9yICkge1xuXG5cdFx0dmFyIGFuY2hvcnMgPSB0b0FycmF5KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciA/IHNlbGVjdG9yIDogJ2EnICkgKTtcblxuXHRcdGFuY2hvcnMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0XHRpZiggL14oaHR0cHx3d3cpL2dpLnRlc3QoIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnaHJlZicgKSApICkge1xuXHRcdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIG9uUHJldmlld0xpbmtDbGlja2VkLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFVuYmluZCBwcmV2aWV3IGZyYW1lIGxpbmtzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlzYWJsZVByZXZpZXdMaW5rcygpIHtcblxuXHRcdHZhciBhbmNob3JzID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ2EnICkgKTtcblxuXHRcdGFuY2hvcnMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0XHRpZiggL14oaHR0cHx3d3cpL2dpLnRlc3QoIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnaHJlZicgKSApICkge1xuXHRcdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjbGljaycsIG9uUHJldmlld0xpbmtDbGlja2VkLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW5zIGEgcHJldmlldyB3aW5kb3cgZm9yIHRoZSB0YXJnZXQgVVJMLlxuXHQgKi9cblx0ZnVuY3Rpb24gc2hvd1ByZXZpZXcoIHVybCApIHtcblxuXHRcdGNsb3NlT3ZlcmxheSgpO1xuXG5cdFx0ZG9tLm92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdGRvbS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoICdvdmVybGF5JyApO1xuXHRcdGRvbS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoICdvdmVybGF5LXByZXZpZXcnICk7XG5cdFx0ZG9tLndyYXBwZXIuYXBwZW5kQ2hpbGQoIGRvbS5vdmVybGF5ICk7XG5cblx0XHRkb20ub3ZlcmxheS5pbm5lckhUTUwgPSBbXG5cdFx0XHQnPGhlYWRlcj4nLFxuXHRcdFx0XHQnPGEgY2xhc3M9XCJjbG9zZVwiIGhyZWY9XCIjXCI+PHNwYW4gY2xhc3M9XCJpY29uXCI+PC9zcGFuPjwvYT4nLFxuXHRcdFx0XHQnPGEgY2xhc3M9XCJleHRlcm5hbFwiIGhyZWY9XCInKyB1cmwgKydcIiB0YXJnZXQ9XCJfYmxhbmtcIj48c3BhbiBjbGFzcz1cImljb25cIj48L3NwYW4+PC9hPicsXG5cdFx0XHQnPC9oZWFkZXI+Jyxcblx0XHRcdCc8ZGl2IGNsYXNzPVwic3Bpbm5lclwiPjwvZGl2PicsXG5cdFx0XHQnPGRpdiBjbGFzcz1cInZpZXdwb3J0XCI+Jyxcblx0XHRcdFx0JzxpZnJhbWUgc3JjPVwiJysgdXJsICsnXCI+PC9pZnJhbWU+Jyxcblx0XHRcdCc8L2Rpdj4nXG5cdFx0XS5qb2luKCcnKTtcblxuXHRcdGRvbS5vdmVybGF5LnF1ZXJ5U2VsZWN0b3IoICdpZnJhbWUnICkuYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRkb20ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCAnbG9hZGVkJyApO1xuXHRcdH0sIGZhbHNlICk7XG5cblx0XHRkb20ub3ZlcmxheS5xdWVyeVNlbGVjdG9yKCAnLmNsb3NlJyApLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdGNsb3NlT3ZlcmxheSgpO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9LCBmYWxzZSApO1xuXG5cdFx0ZG9tLm92ZXJsYXkucXVlcnlTZWxlY3RvciggJy5leHRlcm5hbCcgKS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRjbG9zZU92ZXJsYXkoKTtcblx0XHR9LCBmYWxzZSApO1xuXG5cdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRkb20ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCAndmlzaWJsZScgKTtcblx0XHR9LCAxICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBPcGVucyBhIG92ZXJsYXkgd2luZG93IHdpdGggaGVscCBtYXRlcmlhbC5cblx0ICovXG5cdGZ1bmN0aW9uIHNob3dIZWxwKCkge1xuXG5cdFx0aWYoIGNvbmZpZy5oZWxwICkge1xuXG5cdFx0XHRjbG9zZU92ZXJsYXkoKTtcblxuXHRcdFx0ZG9tLm92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdFx0ZG9tLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCggJ292ZXJsYXknICk7XG5cdFx0XHRkb20ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCAnb3ZlcmxheS1oZWxwJyApO1xuXHRcdFx0ZG9tLndyYXBwZXIuYXBwZW5kQ2hpbGQoIGRvbS5vdmVybGF5ICk7XG5cblx0XHRcdHZhciBodG1sID0gJzxwIGNsYXNzPVwidGl0bGVcIj5LZXlib2FyZCBTaG9ydGN1dHM8L3A+PGJyLz4nO1xuXG5cdFx0XHRodG1sICs9ICc8dGFibGU+PHRoPktFWTwvdGg+PHRoPkFDVElPTjwvdGg+Jztcblx0XHRcdGZvciggdmFyIGtleSBpbiBrZXlib2FyZFNob3J0Y3V0cyApIHtcblx0XHRcdFx0aHRtbCArPSAnPHRyPjx0ZD4nICsga2V5ICsgJzwvdGQ+PHRkPicgKyBrZXlib2FyZFNob3J0Y3V0c1sga2V5IF0gKyAnPC90ZD48L3RyPic7XG5cdFx0XHR9XG5cblx0XHRcdGh0bWwgKz0gJzwvdGFibGU+JztcblxuXHRcdFx0ZG9tLm92ZXJsYXkuaW5uZXJIVE1MID0gW1xuXHRcdFx0XHQnPGhlYWRlcj4nLFxuXHRcdFx0XHRcdCc8YSBjbGFzcz1cImNsb3NlXCIgaHJlZj1cIiNcIj48c3BhbiBjbGFzcz1cImljb25cIj48L3NwYW4+PC9hPicsXG5cdFx0XHRcdCc8L2hlYWRlcj4nLFxuXHRcdFx0XHQnPGRpdiBjbGFzcz1cInZpZXdwb3J0XCI+Jyxcblx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cInZpZXdwb3J0LWlubmVyXCI+JysgaHRtbCArJzwvZGl2PicsXG5cdFx0XHRcdCc8L2Rpdj4nXG5cdFx0XHRdLmpvaW4oJycpO1xuXG5cdFx0XHRkb20ub3ZlcmxheS5xdWVyeVNlbGVjdG9yKCAnLmNsb3NlJyApLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0Y2xvc2VPdmVybGF5KCk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9LCBmYWxzZSApO1xuXG5cdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZG9tLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCggJ3Zpc2libGUnICk7XG5cdFx0XHR9LCAxICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDbG9zZXMgYW55IGN1cnJlbnRseSBvcGVuIG92ZXJsYXkuXG5cdCAqL1xuXHRmdW5jdGlvbiBjbG9zZU92ZXJsYXkoKSB7XG5cblx0XHRpZiggZG9tLm92ZXJsYXkgKSB7XG5cdFx0XHRkb20ub3ZlcmxheS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKCBkb20ub3ZlcmxheSApO1xuXHRcdFx0ZG9tLm92ZXJsYXkgPSBudWxsO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgSmF2YVNjcmlwdC1jb250cm9sbGVkIGxheW91dCBydWxlcyB0byB0aGVcblx0ICogcHJlc2VudGF0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gbGF5b3V0KCkge1xuXG5cdFx0aWYoIGRvbS53cmFwcGVyICYmICFpc1ByaW50aW5nUERGKCkgKSB7XG5cblx0XHRcdHZhciBzaXplID0gZ2V0Q29tcHV0ZWRTbGlkZVNpemUoKTtcblxuXHRcdFx0dmFyIHNsaWRlUGFkZGluZyA9IDIwOyAvLyBUT0RPIERpZyB0aGlzIG91dCBvZiBET01cblxuXHRcdFx0Ly8gTGF5b3V0IHRoZSBjb250ZW50cyBvZiB0aGUgc2xpZGVzXG5cdFx0XHRsYXlvdXRTbGlkZUNvbnRlbnRzKCBjb25maWcud2lkdGgsIGNvbmZpZy5oZWlnaHQsIHNsaWRlUGFkZGluZyApO1xuXG5cdFx0XHRkb20uc2xpZGVzLnN0eWxlLndpZHRoID0gc2l6ZS53aWR0aCArICdweCc7XG5cdFx0XHRkb20uc2xpZGVzLnN0eWxlLmhlaWdodCA9IHNpemUuaGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0Ly8gRGV0ZXJtaW5lIHNjYWxlIG9mIGNvbnRlbnQgdG8gZml0IHdpdGhpbiBhdmFpbGFibGUgc3BhY2Vcblx0XHRcdHNjYWxlID0gTWF0aC5taW4oIHNpemUucHJlc2VudGF0aW9uV2lkdGggLyBzaXplLndpZHRoLCBzaXplLnByZXNlbnRhdGlvbkhlaWdodCAvIHNpemUuaGVpZ2h0ICk7XG5cblx0XHRcdC8vIFJlc3BlY3QgbWF4L21pbiBzY2FsZSBzZXR0aW5nc1xuXHRcdFx0c2NhbGUgPSBNYXRoLm1heCggc2NhbGUsIGNvbmZpZy5taW5TY2FsZSApO1xuXHRcdFx0c2NhbGUgPSBNYXRoLm1pbiggc2NhbGUsIGNvbmZpZy5tYXhTY2FsZSApO1xuXG5cdFx0XHQvLyBEb24ndCBhcHBseSBhbnkgc2NhbGluZyBzdHlsZXMgaWYgc2NhbGUgaXMgMVxuXHRcdFx0aWYoIHNjYWxlID09PSAxICkge1xuXHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLnpvb20gPSAnJztcblx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5sZWZ0ID0gJyc7XG5cdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUudG9wID0gJyc7XG5cdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUuYm90dG9tID0gJyc7XG5cdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUucmlnaHQgPSAnJztcblx0XHRcdFx0dHJhbnNmb3JtU2xpZGVzKCB7IGxheW91dDogJycgfSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIFByZWZlciB6b29tIGZvciBzY2FsaW5nIHVwIHNvIHRoYXQgY29udGVudCByZW1haW5zIGNyaXNwLlxuXHRcdFx0XHQvLyBEb24ndCB1c2Ugem9vbSB0byBzY2FsZSBkb3duIHNpbmNlIHRoYXQgY2FuIGxlYWQgdG8gc2hpZnRzXG5cdFx0XHRcdC8vIGluIHRleHQgbGF5b3V0L2xpbmUgYnJlYWtzLlxuXHRcdFx0XHRpZiggc2NhbGUgPiAxICYmIGZlYXR1cmVzLnpvb20gKSB7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS56b29tID0gc2NhbGU7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5sZWZ0ID0gJyc7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS50b3AgPSAnJztcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLmJvdHRvbSA9ICcnO1xuXHRcdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUucmlnaHQgPSAnJztcblx0XHRcdFx0XHR0cmFuc2Zvcm1TbGlkZXMoIHsgbGF5b3V0OiAnJyB9ICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gQXBwbHkgc2NhbGUgdHJhbnNmb3JtIGFzIGEgZmFsbGJhY2tcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS56b29tID0gJyc7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5sZWZ0ID0gJzUwJSc7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS50b3AgPSAnNTAlJztcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLmJvdHRvbSA9ICdhdXRvJztcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xuXHRcdFx0XHRcdHRyYW5zZm9ybVNsaWRlcyggeyBsYXlvdXQ6ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSkgc2NhbGUoJysgc2NhbGUgKycpJyB9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gU2VsZWN0IGFsbCBzbGlkZXMsIHZlcnRpY2FsIGFuZCBob3Jpem9udGFsXG5cdFx0XHR2YXIgc2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICkgKTtcblxuXHRcdFx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHNsaWRlcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0dmFyIHNsaWRlID0gc2xpZGVzWyBpIF07XG5cblx0XHRcdFx0Ly8gRG9uJ3QgYm90aGVyIHVwZGF0aW5nIGludmlzaWJsZSBzbGlkZXNcblx0XHRcdFx0aWYoIHNsaWRlLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJyApIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCBjb25maWcuY2VudGVyIHx8IHNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ2NlbnRlcicgKSApIHtcblx0XHRcdFx0XHQvLyBWZXJ0aWNhbCBzdGFja3MgYXJlIG5vdCBjZW50cmVkIHNpbmNlIHRoZWlyIHNlY3Rpb25cblx0XHRcdFx0XHQvLyBjaGlsZHJlbiB3aWxsIGJlXG5cdFx0XHRcdFx0aWYoIHNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ3N0YWNrJyApICkge1xuXHRcdFx0XHRcdFx0c2xpZGUuc3R5bGUudG9wID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRzbGlkZS5zdHlsZS50b3AgPSBNYXRoLm1heCggKCAoIHNpemUuaGVpZ2h0IC0gZ2V0QWJzb2x1dGVIZWlnaHQoIHNsaWRlICkgKSAvIDIgKSAtIHNsaWRlUGFkZGluZywgMCApICsgJ3B4Jztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c2xpZGUuc3R5bGUudG9wID0gJyc7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGVQcm9ncmVzcygpO1xuXHRcdFx0dXBkYXRlUGFyYWxsYXgoKTtcblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgbGF5b3V0IGxvZ2ljIHRvIHRoZSBjb250ZW50cyBvZiBhbGwgc2xpZGVzIGluXG5cdCAqIHRoZSBwcmVzZW50YXRpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBsYXlvdXRTbGlkZUNvbnRlbnRzKCB3aWR0aCwgaGVpZ2h0LCBwYWRkaW5nICkge1xuXG5cdFx0Ly8gSGFuZGxlIHNpemluZyBvZiBlbGVtZW50cyB3aXRoIHRoZSAnc3RyZXRjaCcgY2xhc3Ncblx0XHR0b0FycmF5KCBkb20uc2xpZGVzLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uID4gLnN0cmV0Y2gnICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCApIHtcblxuXHRcdFx0Ly8gRGV0ZXJtaW5lIGhvdyBtdWNoIHZlcnRpY2FsIHNwYWNlIHdlIGNhbiB1c2Vcblx0XHRcdHZhciByZW1haW5pbmdIZWlnaHQgPSBnZXRSZW1haW5pbmdIZWlnaHQoIGVsZW1lbnQsIGhlaWdodCApO1xuXG5cdFx0XHQvLyBDb25zaWRlciB0aGUgYXNwZWN0IHJhdGlvIG9mIG1lZGlhIGVsZW1lbnRzXG5cdFx0XHRpZiggLyhpbWd8dmlkZW8pL2dpLnRlc3QoIGVsZW1lbnQubm9kZU5hbWUgKSApIHtcblx0XHRcdFx0dmFyIG53ID0gZWxlbWVudC5uYXR1cmFsV2lkdGggfHwgZWxlbWVudC52aWRlb1dpZHRoLFxuXHRcdFx0XHRcdG5oID0gZWxlbWVudC5uYXR1cmFsSGVpZ2h0IHx8IGVsZW1lbnQudmlkZW9IZWlnaHQ7XG5cblx0XHRcdFx0dmFyIGVzID0gTWF0aC5taW4oIHdpZHRoIC8gbncsIHJlbWFpbmluZ0hlaWdodCAvIG5oICk7XG5cblx0XHRcdFx0ZWxlbWVudC5zdHlsZS53aWR0aCA9ICggbncgKiBlcyApICsgJ3B4Jztcblx0XHRcdFx0ZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAoIG5oICogZXMgKSArICdweCc7XG5cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmhlaWdodCA9IHJlbWFpbmluZ0hlaWdodCArICdweCc7XG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxjdWxhdGVzIHRoZSBjb21wdXRlZCBwaXhlbCBzaXplIG9mIG91ciBzbGlkZXMuIFRoZXNlXG5cdCAqIHZhbHVlcyBhcmUgYmFzZWQgb24gdGhlIHdpZHRoIGFuZCBoZWlnaHQgY29uZmlndXJhdGlvblxuXHQgKiBvcHRpb25zLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0Q29tcHV0ZWRTbGlkZVNpemUoIHByZXNlbnRhdGlvbldpZHRoLCBwcmVzZW50YXRpb25IZWlnaHQgKSB7XG5cblx0XHR2YXIgc2l6ZSA9IHtcblx0XHRcdC8vIFNsaWRlIHNpemVcblx0XHRcdHdpZHRoOiBjb25maWcud2lkdGgsXG5cdFx0XHRoZWlnaHQ6IGNvbmZpZy5oZWlnaHQsXG5cblx0XHRcdC8vIFByZXNlbnRhdGlvbiBzaXplXG5cdFx0XHRwcmVzZW50YXRpb25XaWR0aDogcHJlc2VudGF0aW9uV2lkdGggfHwgZG9tLndyYXBwZXIub2Zmc2V0V2lkdGgsXG5cdFx0XHRwcmVzZW50YXRpb25IZWlnaHQ6IHByZXNlbnRhdGlvbkhlaWdodCB8fCBkb20ud3JhcHBlci5vZmZzZXRIZWlnaHRcblx0XHR9O1xuXG5cdFx0Ly8gUmVkdWNlIGF2YWlsYWJsZSBzcGFjZSBieSBtYXJnaW5cblx0XHRzaXplLnByZXNlbnRhdGlvbldpZHRoIC09ICggc2l6ZS5wcmVzZW50YXRpb25XaWR0aCAqIGNvbmZpZy5tYXJnaW4gKTtcblx0XHRzaXplLnByZXNlbnRhdGlvbkhlaWdodCAtPSAoIHNpemUucHJlc2VudGF0aW9uSGVpZ2h0ICogY29uZmlnLm1hcmdpbiApO1xuXG5cdFx0Ly8gU2xpZGUgd2lkdGggbWF5IGJlIGEgcGVyY2VudGFnZSBvZiBhdmFpbGFibGUgd2lkdGhcblx0XHRpZiggdHlwZW9mIHNpemUud2lkdGggPT09ICdzdHJpbmcnICYmIC8lJC8udGVzdCggc2l6ZS53aWR0aCApICkge1xuXHRcdFx0c2l6ZS53aWR0aCA9IHBhcnNlSW50KCBzaXplLndpZHRoLCAxMCApIC8gMTAwICogc2l6ZS5wcmVzZW50YXRpb25XaWR0aDtcblx0XHR9XG5cblx0XHQvLyBTbGlkZSBoZWlnaHQgbWF5IGJlIGEgcGVyY2VudGFnZSBvZiBhdmFpbGFibGUgaGVpZ2h0XG5cdFx0aWYoIHR5cGVvZiBzaXplLmhlaWdodCA9PT0gJ3N0cmluZycgJiYgLyUkLy50ZXN0KCBzaXplLmhlaWdodCApICkge1xuXHRcdFx0c2l6ZS5oZWlnaHQgPSBwYXJzZUludCggc2l6ZS5oZWlnaHQsIDEwICkgLyAxMDAgKiBzaXplLnByZXNlbnRhdGlvbkhlaWdodDtcblx0XHR9XG5cblx0XHRyZXR1cm4gc2l6ZTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFN0b3JlcyB0aGUgdmVydGljYWwgaW5kZXggb2YgYSBzdGFjayBzbyB0aGF0IHRoZSBzYW1lXG5cdCAqIHZlcnRpY2FsIHNsaWRlIGNhbiBiZSBzZWxlY3RlZCB3aGVuIG5hdmlnYXRpbmcgdG8gYW5kXG5cdCAqIGZyb20gdGhlIHN0YWNrLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzdGFjayBUaGUgdmVydGljYWwgc3RhY2sgZWxlbWVudFxuXHQgKiBAcGFyYW0ge2ludH0gdiBJbmRleCB0byBtZW1vcml6ZVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0UHJldmlvdXNWZXJ0aWNhbEluZGV4KCBzdGFjaywgdiApIHtcblxuXHRcdGlmKCB0eXBlb2Ygc3RhY2sgPT09ICdvYmplY3QnICYmIHR5cGVvZiBzdGFjay5zZXRBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRzdGFjay5zZXRBdHRyaWJ1dGUoICdkYXRhLXByZXZpb3VzLWluZGV4dicsIHYgfHwgMCApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgdmVydGljYWwgaW5kZXggd2hpY2ggd2FzIHN0b3JlZCB1c2luZ1xuXHQgKiAjc2V0UHJldmlvdXNWZXJ0aWNhbEluZGV4KCkgb3IgMCBpZiBubyBwcmV2aW91cyBpbmRleFxuXHQgKiBleGlzdHMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHN0YWNrIFRoZSB2ZXJ0aWNhbCBzdGFjayBlbGVtZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRQcmV2aW91c1ZlcnRpY2FsSW5kZXgoIHN0YWNrICkge1xuXG5cdFx0aWYoIHR5cGVvZiBzdGFjayA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHN0YWNrLnNldEF0dHJpYnV0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiBzdGFjay5jbGFzc0xpc3QuY29udGFpbnMoICdzdGFjaycgKSApIHtcblx0XHRcdC8vIFByZWZlciBtYW51YWxseSBkZWZpbmVkIHN0YXJ0LWluZGV4dlxuXHRcdFx0dmFyIGF0dHJpYnV0ZU5hbWUgPSBzdGFjay5oYXNBdHRyaWJ1dGUoICdkYXRhLXN0YXJ0LWluZGV4dicgKSA/ICdkYXRhLXN0YXJ0LWluZGV4dicgOiAnZGF0YS1wcmV2aW91cy1pbmRleHYnO1xuXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQoIHN0YWNrLmdldEF0dHJpYnV0ZSggYXR0cmlidXRlTmFtZSApIHx8IDAsIDEwICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDA7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBEaXNwbGF5cyB0aGUgb3ZlcnZpZXcgb2Ygc2xpZGVzIChxdWljayBuYXYpIGJ5IHNjYWxpbmdcblx0ICogZG93biBhbmQgYXJyYW5naW5nIGFsbCBzbGlkZSBlbGVtZW50cy5cblx0ICovXG5cdGZ1bmN0aW9uIGFjdGl2YXRlT3ZlcnZpZXcoKSB7XG5cblx0XHQvLyBPbmx5IHByb2NlZWQgaWYgZW5hYmxlZCBpbiBjb25maWdcblx0XHRpZiggY29uZmlnLm92ZXJ2aWV3ICYmICFpc092ZXJ2aWV3KCkgKSB7XG5cblx0XHRcdG92ZXJ2aWV3ID0gdHJ1ZTtcblxuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggJ292ZXJ2aWV3JyApO1xuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggJ292ZXJ2aWV3LWRlYWN0aXZhdGluZycgKTtcblxuXHRcdFx0aWYoIGZlYXR1cmVzLm92ZXJ2aWV3VHJhbnNpdGlvbnMgKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoICdvdmVydmlldy1hbmltYXRlZCcgKTtcblx0XHRcdFx0fSwgMSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBEb24ndCBhdXRvLXNsaWRlIHdoaWxlIGluIG92ZXJ2aWV3IG1vZGVcblx0XHRcdGNhbmNlbEF1dG9TbGlkZSgpO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBiYWNrZ3JvdW5kcyBlbGVtZW50IGludG8gdGhlIHNsaWRlIGNvbnRhaW5lciB0b1xuXHRcdFx0Ly8gdGhhdCB0aGUgc2FtZSBzY2FsaW5nIGlzIGFwcGxpZWRcblx0XHRcdGRvbS5zbGlkZXMuYXBwZW5kQ2hpbGQoIGRvbS5iYWNrZ3JvdW5kICk7XG5cblx0XHRcdC8vIENsaWNraW5nIG9uIGFuIG92ZXJ2aWV3IHNsaWRlIG5hdmlnYXRlcyB0byBpdFxuXHRcdFx0dG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggc2xpZGUgKSB7XG5cdFx0XHRcdGlmKCAhc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnc3RhY2snICkgKSB7XG5cdFx0XHRcdFx0c2xpZGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgb25PdmVydmlld1NsaWRlQ2xpY2tlZCwgdHJ1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIENhbGN1bGF0ZSBzbGlkZSBzaXplc1xuXHRcdFx0dmFyIG1hcmdpbiA9IDcwO1xuXHRcdFx0dmFyIHNsaWRlU2l6ZSA9IGdldENvbXB1dGVkU2xpZGVTaXplKCk7XG5cdFx0XHRvdmVydmlld1NsaWRlV2lkdGggPSBzbGlkZVNpemUud2lkdGggKyBtYXJnaW47XG5cdFx0XHRvdmVydmlld1NsaWRlSGVpZ2h0ID0gc2xpZGVTaXplLmhlaWdodCArIG1hcmdpbjtcblxuXHRcdFx0Ly8gUmV2ZXJzZSBpbiBSVEwgbW9kZVxuXHRcdFx0aWYoIGNvbmZpZy5ydGwgKSB7XG5cdFx0XHRcdG92ZXJ2aWV3U2xpZGVXaWR0aCA9IC1vdmVydmlld1NsaWRlV2lkdGg7XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZVNsaWRlc1Zpc2liaWxpdHkoKTtcblx0XHRcdGxheW91dE92ZXJ2aWV3KCk7XG5cdFx0XHR1cGRhdGVPdmVydmlldygpO1xuXG5cdFx0XHRsYXlvdXQoKTtcblxuXHRcdFx0Ly8gTm90aWZ5IG9ic2VydmVycyBvZiB0aGUgb3ZlcnZpZXcgc2hvd2luZ1xuXHRcdFx0ZGlzcGF0Y2hFdmVudCggJ292ZXJ2aWV3c2hvd24nLCB7XG5cdFx0XHRcdCdpbmRleGgnOiBpbmRleGgsXG5cdFx0XHRcdCdpbmRleHYnOiBpbmRleHYsXG5cdFx0XHRcdCdjdXJyZW50U2xpZGUnOiBjdXJyZW50U2xpZGVcblx0XHRcdH0gKTtcblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFVzZXMgQ1NTIHRyYW5zZm9ybXMgdG8gcG9zaXRpb24gYWxsIHNsaWRlcyBpbiBhIGdyaWQgZm9yXG5cdCAqIGRpc3BsYXkgaW5zaWRlIG9mIHRoZSBvdmVydmlldyBtb2RlLlxuXHQgKi9cblx0ZnVuY3Rpb24gbGF5b3V0T3ZlcnZpZXcoKSB7XG5cblx0XHQvLyBMYXlvdXQgc2xpZGVzXG5cdFx0dG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBoc2xpZGUsIGggKSB7XG5cdFx0XHRoc2xpZGUuc2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC1oJywgaCApO1xuXHRcdFx0dHJhbnNmb3JtRWxlbWVudCggaHNsaWRlLCAndHJhbnNsYXRlM2QoJyArICggaCAqIG92ZXJ2aWV3U2xpZGVXaWR0aCApICsgJ3B4LCAwLCAwKScgKTtcblxuXHRcdFx0aWYoIGhzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoICdzdGFjaycgKSApIHtcblxuXHRcdFx0XHR0b0FycmF5KCBoc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggdnNsaWRlLCB2ICkge1xuXHRcdFx0XHRcdHZzbGlkZS5zZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LWgnLCBoICk7XG5cdFx0XHRcdFx0dnNsaWRlLnNldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtdicsIHYgKTtcblxuXHRcdFx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIHZzbGlkZSwgJ3RyYW5zbGF0ZTNkKDAsICcgKyAoIHYgKiBvdmVydmlld1NsaWRlSGVpZ2h0ICkgKyAncHgsIDApJyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBMYXlvdXQgc2xpZGUgYmFja2dyb3VuZHNcblx0XHR0b0FycmF5KCBkb20uYmFja2dyb3VuZC5jaGlsZE5vZGVzICkuZm9yRWFjaCggZnVuY3Rpb24oIGhiYWNrZ3JvdW5kLCBoICkge1xuXHRcdFx0dHJhbnNmb3JtRWxlbWVudCggaGJhY2tncm91bmQsICd0cmFuc2xhdGUzZCgnICsgKCBoICogb3ZlcnZpZXdTbGlkZVdpZHRoICkgKyAncHgsIDAsIDApJyApO1xuXG5cdFx0XHR0b0FycmF5KCBoYmFja2dyb3VuZC5xdWVyeVNlbGVjdG9yQWxsKCAnLnNsaWRlLWJhY2tncm91bmQnICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggdmJhY2tncm91bmQsIHYgKSB7XG5cdFx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIHZiYWNrZ3JvdW5kLCAndHJhbnNsYXRlM2QoMCwgJyArICggdiAqIG92ZXJ2aWV3U2xpZGVIZWlnaHQgKSArICdweCwgMCknICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogTW92ZXMgdGhlIG92ZXJ2aWV3IHZpZXdwb3J0IHRvIHRoZSBjdXJyZW50IHNsaWRlcy5cblx0ICogQ2FsbGVkIGVhY2ggdGltZSB0aGUgY3VycmVudCBzbGlkZSBjaGFuZ2VzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlT3ZlcnZpZXcoKSB7XG5cblx0XHR0cmFuc2Zvcm1TbGlkZXMoIHtcblx0XHRcdG92ZXJ2aWV3OiBbXG5cdFx0XHRcdCd0cmFuc2xhdGVYKCcrICggLWluZGV4aCAqIG92ZXJ2aWV3U2xpZGVXaWR0aCApICsncHgpJyxcblx0XHRcdFx0J3RyYW5zbGF0ZVkoJysgKCAtaW5kZXh2ICogb3ZlcnZpZXdTbGlkZUhlaWdodCApICsncHgpJyxcblx0XHRcdFx0J3RyYW5zbGF0ZVooJysgKCB3aW5kb3cuaW5uZXJXaWR0aCA8IDQwMCA/IC0xMDAwIDogLTI1MDAgKSArJ3B4KSdcblx0XHRcdF0uam9pbiggJyAnIClcblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBFeGl0cyB0aGUgc2xpZGUgb3ZlcnZpZXcgYW5kIGVudGVycyB0aGUgY3VycmVudGx5XG5cdCAqIGFjdGl2ZSBzbGlkZS5cblx0ICovXG5cdGZ1bmN0aW9uIGRlYWN0aXZhdGVPdmVydmlldygpIHtcblxuXHRcdC8vIE9ubHkgcHJvY2VlZCBpZiBlbmFibGVkIGluIGNvbmZpZ1xuXHRcdGlmKCBjb25maWcub3ZlcnZpZXcgKSB7XG5cblx0XHRcdG92ZXJ2aWV3ID0gZmFsc2U7XG5cblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoICdvdmVydmlldycgKTtcblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoICdvdmVydmlldy1hbmltYXRlZCcgKTtcblxuXHRcdFx0Ly8gVGVtcG9yYXJpbHkgYWRkIGEgY2xhc3Mgc28gdGhhdCB0cmFuc2l0aW9ucyBjYW4gZG8gZGlmZmVyZW50IHRoaW5nc1xuXHRcdFx0Ly8gZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhleSBhcmUgZXhpdGluZy9lbnRlcmluZyBvdmVydmlldywgb3IganVzdFxuXHRcdFx0Ly8gbW92aW5nIGZyb20gc2xpZGUgdG8gc2xpZGVcblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoICdvdmVydmlldy1kZWFjdGl2YXRpbmcnICk7XG5cblx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggJ292ZXJ2aWV3LWRlYWN0aXZhdGluZycgKTtcblx0XHRcdH0sIDEgKTtcblxuXHRcdFx0Ly8gTW92ZSB0aGUgYmFja2dyb3VuZCBlbGVtZW50IGJhY2sgb3V0XG5cdFx0XHRkb20ud3JhcHBlci5hcHBlbmRDaGlsZCggZG9tLmJhY2tncm91bmQgKTtcblxuXHRcdFx0Ly8gQ2xlYW4gdXAgY2hhbmdlcyBtYWRlIHRvIHNsaWRlc1xuXHRcdFx0dG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggc2xpZGUgKSB7XG5cdFx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIHNsaWRlLCAnJyApO1xuXG5cdFx0XHRcdHNsaWRlLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjbGljaycsIG9uT3ZlcnZpZXdTbGlkZUNsaWNrZWQsIHRydWUgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQ2xlYW4gdXAgY2hhbmdlcyBtYWRlIHRvIGJhY2tncm91bmRzXG5cdFx0XHR0b0FycmF5KCBkb20uYmFja2dyb3VuZC5xdWVyeVNlbGVjdG9yQWxsKCAnLnNsaWRlLWJhY2tncm91bmQnICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggYmFja2dyb3VuZCApIHtcblx0XHRcdFx0dHJhbnNmb3JtRWxlbWVudCggYmFja2dyb3VuZCwgJycgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0dHJhbnNmb3JtU2xpZGVzKCB7IG92ZXJ2aWV3OiAnJyB9ICk7XG5cblx0XHRcdHNsaWRlKCBpbmRleGgsIGluZGV4diApO1xuXG5cdFx0XHRsYXlvdXQoKTtcblxuXHRcdFx0Y3VlQXV0b1NsaWRlKCk7XG5cblx0XHRcdC8vIE5vdGlmeSBvYnNlcnZlcnMgb2YgdGhlIG92ZXJ2aWV3IGhpZGluZ1xuXHRcdFx0ZGlzcGF0Y2hFdmVudCggJ292ZXJ2aWV3aGlkZGVuJywge1xuXHRcdFx0XHQnaW5kZXhoJzogaW5kZXhoLFxuXHRcdFx0XHQnaW5kZXh2JzogaW5kZXh2LFxuXHRcdFx0XHQnY3VycmVudFNsaWRlJzogY3VycmVudFNsaWRlXG5cdFx0XHR9ICk7XG5cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyB0aGUgc2xpZGUgb3ZlcnZpZXcgbW9kZSBvbiBhbmQgb2ZmLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IG92ZXJyaWRlIE9wdGlvbmFsIGZsYWcgd2hpY2ggb3ZlcnJpZGVzIHRoZVxuXHQgKiB0b2dnbGUgbG9naWMgYW5kIGZvcmNpYmx5IHNldHMgdGhlIGRlc2lyZWQgc3RhdGUuIFRydWUgbWVhbnNcblx0ICogb3ZlcnZpZXcgaXMgb3BlbiwgZmFsc2UgbWVhbnMgaXQncyBjbG9zZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVPdmVydmlldyggb3ZlcnJpZGUgKSB7XG5cblx0XHRpZiggdHlwZW9mIG92ZXJyaWRlID09PSAnYm9vbGVhbicgKSB7XG5cdFx0XHRvdmVycmlkZSA/IGFjdGl2YXRlT3ZlcnZpZXcoKSA6IGRlYWN0aXZhdGVPdmVydmlldygpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlzT3ZlcnZpZXcoKSA/IGRlYWN0aXZhdGVPdmVydmlldygpIDogYWN0aXZhdGVPdmVydmlldygpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgb3ZlcnZpZXcgaXMgY3VycmVudGx5IGFjdGl2ZS5cblx0ICpcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZSBpZiB0aGUgb3ZlcnZpZXcgaXMgYWN0aXZlLFxuXHQgKiBmYWxzZSBvdGhlcndpc2Vcblx0ICovXG5cdGZ1bmN0aW9uIGlzT3ZlcnZpZXcoKSB7XG5cblx0XHRyZXR1cm4gb3ZlcnZpZXc7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgb3Igc3BlY2lmaWVkIHNsaWRlIGlzIHZlcnRpY2FsXG5cdCAqIChuZXN0ZWQgd2l0aGluIGFub3RoZXIgc2xpZGUpLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzbGlkZSBbb3B0aW9uYWxdIFRoZSBzbGlkZSB0byBjaGVja1xuXHQgKiBvcmllbnRhdGlvbiBvZlxuXHQgKi9cblx0ZnVuY3Rpb24gaXNWZXJ0aWNhbFNsaWRlKCBzbGlkZSApIHtcblxuXHRcdC8vIFByZWZlciBzbGlkZSBhcmd1bWVudCwgb3RoZXJ3aXNlIHVzZSBjdXJyZW50IHNsaWRlXG5cdFx0c2xpZGUgPSBzbGlkZSA/IHNsaWRlIDogY3VycmVudFNsaWRlO1xuXG5cdFx0cmV0dXJuIHNsaWRlICYmIHNsaWRlLnBhcmVudE5vZGUgJiYgISFzbGlkZS5wYXJlbnROb2RlLm5vZGVOYW1lLm1hdGNoKCAvc2VjdGlvbi9pICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGluZyB0aGUgZnVsbHNjcmVlbiBmdW5jdGlvbmFsaXR5IHZpYSB0aGUgZnVsbHNjcmVlbiBBUElcblx0ICpcblx0ICogQHNlZSBodHRwOi8vZnVsbHNjcmVlbi5zcGVjLndoYXR3Zy5vcmcvXG5cdCAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9ET00vVXNpbmdfZnVsbHNjcmVlbl9tb2RlXG5cdCAqL1xuXHRmdW5jdGlvbiBlbnRlckZ1bGxzY3JlZW4oKSB7XG5cblx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmJvZHk7XG5cblx0XHQvLyBDaGVjayB3aGljaCBpbXBsZW1lbnRhdGlvbiBpcyBhdmFpbGFibGVcblx0XHR2YXIgcmVxdWVzdE1ldGhvZCA9IGVsZW1lbnQucmVxdWVzdEZ1bGxTY3JlZW4gfHxcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbiB8fFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuIHx8XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4gfHxcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuO1xuXG5cdFx0aWYoIHJlcXVlc3RNZXRob2QgKSB7XG5cdFx0XHRyZXF1ZXN0TWV0aG9kLmFwcGx5KCBlbGVtZW50ICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogRW50ZXJzIHRoZSBwYXVzZWQgbW9kZSB3aGljaCBmYWRlcyBldmVyeXRoaW5nIG9uIHNjcmVlbiB0b1xuXHQgKiBibGFjay5cblx0ICovXG5cdGZ1bmN0aW9uIHBhdXNlKCkge1xuXG5cdFx0aWYoIGNvbmZpZy5wYXVzZSApIHtcblx0XHRcdHZhciB3YXNQYXVzZWQgPSBkb20ud3JhcHBlci5jbGFzc0xpc3QuY29udGFpbnMoICdwYXVzZWQnICk7XG5cblx0XHRcdGNhbmNlbEF1dG9TbGlkZSgpO1xuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggJ3BhdXNlZCcgKTtcblxuXHRcdFx0aWYoIHdhc1BhdXNlZCA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdGRpc3BhdGNoRXZlbnQoICdwYXVzZWQnICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogRXhpdHMgZnJvbSB0aGUgcGF1c2VkIG1vZGUuXG5cdCAqL1xuXHRmdW5jdGlvbiByZXN1bWUoKSB7XG5cblx0XHR2YXIgd2FzUGF1c2VkID0gZG9tLndyYXBwZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCAncGF1c2VkJyApO1xuXHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoICdwYXVzZWQnICk7XG5cblx0XHRjdWVBdXRvU2xpZGUoKTtcblxuXHRcdGlmKCB3YXNQYXVzZWQgKSB7XG5cdFx0XHRkaXNwYXRjaEV2ZW50KCAncmVzdW1lZCcgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIHRoZSBwYXVzZWQgbW9kZSBvbiBhbmQgb2ZmLlxuXHQgKi9cblx0ZnVuY3Rpb24gdG9nZ2xlUGF1c2UoIG92ZXJyaWRlICkge1xuXG5cdFx0aWYoIHR5cGVvZiBvdmVycmlkZSA9PT0gJ2Jvb2xlYW4nICkge1xuXHRcdFx0b3ZlcnJpZGUgPyBwYXVzZSgpIDogcmVzdW1lKCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aXNQYXVzZWQoKSA/IHJlc3VtZSgpIDogcGF1c2UoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgd2UgYXJlIGN1cnJlbnRseSBpbiB0aGUgcGF1c2VkIG1vZGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1BhdXNlZCgpIHtcblxuXHRcdHJldHVybiBkb20ud3JhcHBlci5jbGFzc0xpc3QuY29udGFpbnMoICdwYXVzZWQnICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBUb2dnbGVzIHRoZSBhdXRvIHNsaWRlIG1vZGUgb24gYW5kIG9mZi5cblx0ICpcblx0ICogQHBhcmFtIHtCb29sZWFufSBvdmVycmlkZSBPcHRpb25hbCBmbGFnIHdoaWNoIHNldHMgdGhlIGRlc2lyZWQgc3RhdGUuXG5cdCAqIFRydWUgbWVhbnMgYXV0b3BsYXkgc3RhcnRzLCBmYWxzZSBtZWFucyBpdCBzdG9wcy5cblx0ICovXG5cblx0ZnVuY3Rpb24gdG9nZ2xlQXV0b1NsaWRlKCBvdmVycmlkZSApIHtcblxuXHRcdGlmKCB0eXBlb2Ygb3ZlcnJpZGUgPT09ICdib29sZWFuJyApIHtcblx0XHRcdG92ZXJyaWRlID8gcmVzdW1lQXV0b1NsaWRlKCkgOiBwYXVzZUF1dG9TbGlkZSgpO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0YXV0b1NsaWRlUGF1c2VkID8gcmVzdW1lQXV0b1NsaWRlKCkgOiBwYXVzZUF1dG9TbGlkZSgpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgYXV0byBzbGlkZSBtb2RlIGlzIGN1cnJlbnRseSBvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGlzQXV0b1NsaWRpbmcoKSB7XG5cblx0XHRyZXR1cm4gISEoIGF1dG9TbGlkZSAmJiAhYXV0b1NsaWRlUGF1c2VkICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBTdGVwcyBmcm9tIHRoZSBjdXJyZW50IHBvaW50IGluIHRoZSBwcmVzZW50YXRpb24gdG8gdGhlXG5cdCAqIHNsaWRlIHdoaWNoIG1hdGNoZXMgdGhlIHNwZWNpZmllZCBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbFxuXHQgKiBpbmRpY2VzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2ludH0gaCBIb3Jpem9udGFsIGluZGV4IG9mIHRoZSB0YXJnZXQgc2xpZGVcblx0ICogQHBhcmFtIHtpbnR9IHYgVmVydGljYWwgaW5kZXggb2YgdGhlIHRhcmdldCBzbGlkZVxuXHQgKiBAcGFyYW0ge2ludH0gZiBPcHRpb25hbCBpbmRleCBvZiBhIGZyYWdtZW50IHdpdGhpbiB0aGVcblx0ICogdGFyZ2V0IHNsaWRlIHRvIGFjdGl2YXRlXG5cdCAqIEBwYXJhbSB7aW50fSBvIE9wdGlvbmFsIG9yaWdpbiBmb3IgdXNlIGluIG11bHRpbWFzdGVyIGVudmlyb25tZW50c1xuXHQgKi9cblx0ZnVuY3Rpb24gc2xpZGUoIGgsIHYsIGYsIG8gKSB7XG5cblx0XHQvLyBSZW1lbWJlciB3aGVyZSB3ZSB3ZXJlIGF0IGJlZm9yZVxuXHRcdHByZXZpb3VzU2xpZGUgPSBjdXJyZW50U2xpZGU7XG5cblx0XHQvLyBRdWVyeSBhbGwgaG9yaXpvbnRhbCBzbGlkZXMgaW4gdGhlIGRlY2tcblx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlcyA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICk7XG5cblx0XHQvLyBJZiBubyB2ZXJ0aWNhbCBpbmRleCBpcyBzcGVjaWZpZWQgYW5kIHRoZSB1cGNvbWluZyBzbGlkZSBpcyBhXG5cdFx0Ly8gc3RhY2ssIHJlc3VtZSBhdCBpdHMgcHJldmlvdXMgdmVydGljYWwgaW5kZXhcblx0XHRpZiggdiA9PT0gdW5kZWZpbmVkICYmICFpc092ZXJ2aWV3KCkgKSB7XG5cdFx0XHR2ID0gZ2V0UHJldmlvdXNWZXJ0aWNhbEluZGV4KCBob3Jpem9udGFsU2xpZGVzWyBoIF0gKTtcblx0XHR9XG5cblx0XHQvLyBJZiB3ZSB3ZXJlIG9uIGEgdmVydGljYWwgc3RhY2ssIHJlbWVtYmVyIHdoYXQgdmVydGljYWwgaW5kZXhcblx0XHQvLyBpdCB3YXMgb24gc28gd2UgY2FuIHJlc3VtZSBhdCB0aGUgc2FtZSBwb3NpdGlvbiB3aGVuIHJldHVybmluZ1xuXHRcdGlmKCBwcmV2aW91c1NsaWRlICYmIHByZXZpb3VzU2xpZGUucGFyZW50Tm9kZSAmJiBwcmV2aW91c1NsaWRlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnc3RhY2snICkgKSB7XG5cdFx0XHRzZXRQcmV2aW91c1ZlcnRpY2FsSW5kZXgoIHByZXZpb3VzU2xpZGUucGFyZW50Tm9kZSwgaW5kZXh2ICk7XG5cdFx0fVxuXG5cdFx0Ly8gUmVtZW1iZXIgdGhlIHN0YXRlIGJlZm9yZSB0aGlzIHNsaWRlXG5cdFx0dmFyIHN0YXRlQmVmb3JlID0gc3RhdGUuY29uY2F0KCk7XG5cblx0XHQvLyBSZXNldCB0aGUgc3RhdGUgYXJyYXlcblx0XHRzdGF0ZS5sZW5ndGggPSAwO1xuXG5cdFx0dmFyIGluZGV4aEJlZm9yZSA9IGluZGV4aCB8fCAwLFxuXHRcdFx0aW5kZXh2QmVmb3JlID0gaW5kZXh2IHx8IDA7XG5cblx0XHQvLyBBY3RpdmF0ZSBhbmQgdHJhbnNpdGlvbiB0byB0aGUgbmV3IHNsaWRlXG5cdFx0aW5kZXhoID0gdXBkYXRlU2xpZGVzKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiwgaCA9PT0gdW5kZWZpbmVkID8gaW5kZXhoIDogaCApO1xuXHRcdGluZGV4diA9IHVwZGF0ZVNsaWRlcyggVkVSVElDQUxfU0xJREVTX1NFTEVDVE9SLCB2ID09PSB1bmRlZmluZWQgPyBpbmRleHYgOiB2ICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIHZpc2liaWxpdHkgb2Ygc2xpZGVzIG5vdyB0aGF0IHRoZSBpbmRpY2VzIGhhdmUgY2hhbmdlZFxuXHRcdHVwZGF0ZVNsaWRlc1Zpc2liaWxpdHkoKTtcblxuXHRcdGxheW91dCgpO1xuXG5cdFx0Ly8gQXBwbHkgdGhlIG5ldyBzdGF0ZVxuXHRcdHN0YXRlTG9vcDogZm9yKCB2YXIgaSA9IDAsIGxlbiA9IHN0YXRlLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhpcyBzdGF0ZSBleGlzdGVkIG9uIHRoZSBwcmV2aW91cyBzbGlkZS4gSWYgaXRcblx0XHRcdC8vIGRpZCwgd2Ugd2lsbCBhdm9pZCBhZGRpbmcgaXQgcmVwZWF0ZWRseVxuXHRcdFx0Zm9yKCB2YXIgaiA9IDA7IGogPCBzdGF0ZUJlZm9yZS5sZW5ndGg7IGorKyApIHtcblx0XHRcdFx0aWYoIHN0YXRlQmVmb3JlW2pdID09PSBzdGF0ZVtpXSApIHtcblx0XHRcdFx0XHRzdGF0ZUJlZm9yZS5zcGxpY2UoIGosIDEgKTtcblx0XHRcdFx0XHRjb250aW51ZSBzdGF0ZUxvb3A7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoIHN0YXRlW2ldICk7XG5cblx0XHRcdC8vIERpc3BhdGNoIGN1c3RvbSBldmVudCBtYXRjaGluZyB0aGUgc3RhdGUncyBuYW1lXG5cdFx0XHRkaXNwYXRjaEV2ZW50KCBzdGF0ZVtpXSApO1xuXHRcdH1cblxuXHRcdC8vIENsZWFuIHVwIHRoZSByZW1haW5zIG9mIHRoZSBwcmV2aW91cyBzdGF0ZVxuXHRcdHdoaWxlKCBzdGF0ZUJlZm9yZS5sZW5ndGggKSB7XG5cdFx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggc3RhdGVCZWZvcmUucG9wKCkgKTtcblx0XHR9XG5cblx0XHQvLyBVcGRhdGUgdGhlIG92ZXJ2aWV3IGlmIGl0J3MgY3VycmVudGx5IGFjdGl2ZVxuXHRcdGlmKCBpc092ZXJ2aWV3KCkgKSB7XG5cdFx0XHR1cGRhdGVPdmVydmlldygpO1xuXHRcdH1cblxuXHRcdC8vIEZpbmQgdGhlIGN1cnJlbnQgaG9yaXpvbnRhbCBzbGlkZSBhbmQgYW55IHBvc3NpYmxlIHZlcnRpY2FsIHNsaWRlc1xuXHRcdC8vIHdpdGhpbiBpdFxuXHRcdHZhciBjdXJyZW50SG9yaXpvbnRhbFNsaWRlID0gaG9yaXpvbnRhbFNsaWRlc1sgaW5kZXhoIF0sXG5cdFx0XHRjdXJyZW50VmVydGljYWxTbGlkZXMgPSBjdXJyZW50SG9yaXpvbnRhbFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApO1xuXG5cdFx0Ly8gU3RvcmUgcmVmZXJlbmNlcyB0byB0aGUgcHJldmlvdXMgYW5kIGN1cnJlbnQgc2xpZGVzXG5cdFx0Y3VycmVudFNsaWRlID0gY3VycmVudFZlcnRpY2FsU2xpZGVzWyBpbmRleHYgXSB8fCBjdXJyZW50SG9yaXpvbnRhbFNsaWRlO1xuXG5cdFx0Ly8gU2hvdyBmcmFnbWVudCwgaWYgc3BlY2lmaWVkXG5cdFx0aWYoIHR5cGVvZiBmICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdG5hdmlnYXRlRnJhZ21lbnQoIGYgKTtcblx0XHR9XG5cblx0XHQvLyBEaXNwYXRjaCBhbiBldmVudCBpZiB0aGUgc2xpZGUgY2hhbmdlZFxuXHRcdHZhciBzbGlkZUNoYW5nZWQgPSAoIGluZGV4aCAhPT0gaW5kZXhoQmVmb3JlIHx8IGluZGV4diAhPT0gaW5kZXh2QmVmb3JlICk7XG5cdFx0aWYoIHNsaWRlQ2hhbmdlZCApIHtcblx0XHRcdGRpc3BhdGNoRXZlbnQoICdzbGlkZWNoYW5nZWQnLCB7XG5cdFx0XHRcdCdpbmRleGgnOiBpbmRleGgsXG5cdFx0XHRcdCdpbmRleHYnOiBpbmRleHYsXG5cdFx0XHRcdCdwcmV2aW91c1NsaWRlJzogcHJldmlvdXNTbGlkZSxcblx0XHRcdFx0J2N1cnJlbnRTbGlkZSc6IGN1cnJlbnRTbGlkZSxcblx0XHRcdFx0J29yaWdpbic6IG9cblx0XHRcdH0gKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyBFbnN1cmUgdGhhdCB0aGUgcHJldmlvdXMgc2xpZGUgaXMgbmV2ZXIgdGhlIHNhbWUgYXMgdGhlIGN1cnJlbnRcblx0XHRcdHByZXZpb3VzU2xpZGUgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vIFNvbHZlcyBhbiBlZGdlIGNhc2Ugd2hlcmUgdGhlIHByZXZpb3VzIHNsaWRlIG1haW50YWlucyB0aGVcblx0XHQvLyAncHJlc2VudCcgY2xhc3Mgd2hlbiBuYXZpZ2F0aW5nIGJldHdlZW4gYWRqYWNlbnQgdmVydGljYWxcblx0XHQvLyBzdGFja3Ncblx0XHRpZiggcHJldmlvdXNTbGlkZSApIHtcblx0XHRcdHByZXZpb3VzU2xpZGUuY2xhc3NMaXN0LnJlbW92ZSggJ3ByZXNlbnQnICk7XG5cdFx0XHRwcmV2aW91c1NsaWRlLnNldEF0dHJpYnV0ZSggJ2FyaWEtaGlkZGVuJywgJ3RydWUnICk7XG5cblx0XHRcdC8vIFJlc2V0IGFsbCBzbGlkZXMgdXBvbiBuYXZpZ2F0ZSB0byBob21lXG5cdFx0XHQvLyBJc3N1ZTogIzI4NVxuXHRcdFx0aWYgKCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yKCBIT01FX1NMSURFX1NFTEVDVE9SICkuY2xhc3NMaXN0LmNvbnRhaW5zKCAncHJlc2VudCcgKSApIHtcblx0XHRcdFx0Ly8gTGF1bmNoIGFzeW5jIHRhc2tcblx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBzbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiArICcuc3RhY2snKSApLCBpO1xuXHRcdFx0XHRcdGZvciggaSBpbiBzbGlkZXMgKSB7XG5cdFx0XHRcdFx0XHRpZiggc2xpZGVzW2ldICkge1xuXHRcdFx0XHRcdFx0XHQvLyBSZXNldCBzdGFja1xuXHRcdFx0XHRcdFx0XHRzZXRQcmV2aW91c1ZlcnRpY2FsSW5kZXgoIHNsaWRlc1tpXSwgMCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgMCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEhhbmRsZSBlbWJlZGRlZCBjb250ZW50XG5cdFx0aWYoIHNsaWRlQ2hhbmdlZCB8fCAhcHJldmlvdXNTbGlkZSApIHtcblx0XHRcdHN0b3BFbWJlZGRlZENvbnRlbnQoIHByZXZpb3VzU2xpZGUgKTtcblx0XHRcdHN0YXJ0RW1iZWRkZWRDb250ZW50KCBjdXJyZW50U2xpZGUgKTtcblx0XHR9XG5cblx0XHQvLyBBbm5vdW5jZSB0aGUgY3VycmVudCBzbGlkZSBjb250ZW50cywgZm9yIHNjcmVlbiByZWFkZXJzXG5cdFx0ZG9tLnN0YXR1c0Rpdi50ZXh0Q29udGVudCA9IGN1cnJlbnRTbGlkZS50ZXh0Q29udGVudDtcblxuXHRcdHVwZGF0ZUNvbnRyb2xzKCk7XG5cdFx0dXBkYXRlUHJvZ3Jlc3MoKTtcblx0XHR1cGRhdGVCYWNrZ3JvdW5kKCk7XG5cdFx0dXBkYXRlUGFyYWxsYXgoKTtcblx0XHR1cGRhdGVTbGlkZU51bWJlcigpO1xuXHRcdHVwZGF0ZU5vdGVzKCk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIFVSTCBoYXNoXG5cdFx0d3JpdGVVUkwoKTtcblxuXHRcdGN1ZUF1dG9TbGlkZSgpO1xuXG5cdH1cblxuXHQvKipcblx0ICogU3luY3MgdGhlIHByZXNlbnRhdGlvbiB3aXRoIHRoZSBjdXJyZW50IERPTS4gVXNlZnVsXG5cdCAqIHdoZW4gbmV3IHNsaWRlcyBvciBjb250cm9sIGVsZW1lbnRzIGFyZSBhZGRlZCBvciB3aGVuXG5cdCAqIHRoZSBjb25maWd1cmF0aW9uIGhhcyBjaGFuZ2VkLlxuXHQgKi9cblx0ZnVuY3Rpb24gc3luYygpIHtcblxuXHRcdC8vIFN1YnNjcmliZSB0byBpbnB1dFxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXJzKCk7XG5cdFx0YWRkRXZlbnRMaXN0ZW5lcnMoKTtcblxuXHRcdC8vIEZvcmNlIGEgbGF5b3V0IHRvIG1ha2Ugc3VyZSB0aGUgY3VycmVudCBjb25maWcgaXMgYWNjb3VudGVkIGZvclxuXHRcdGxheW91dCgpO1xuXG5cdFx0Ly8gUmVmbGVjdCB0aGUgY3VycmVudCBhdXRvU2xpZGUgdmFsdWVcblx0XHRhdXRvU2xpZGUgPSBjb25maWcuYXV0b1NsaWRlO1xuXG5cdFx0Ly8gU3RhcnQgYXV0by1zbGlkaW5nIGlmIGl0J3MgZW5hYmxlZFxuXHRcdGN1ZUF1dG9TbGlkZSgpO1xuXG5cdFx0Ly8gUmUtY3JlYXRlIHRoZSBzbGlkZSBiYWNrZ3JvdW5kc1xuXHRcdGNyZWF0ZUJhY2tncm91bmRzKCk7XG5cblx0XHQvLyBXcml0ZSB0aGUgY3VycmVudCBoYXNoIHRvIHRoZSBVUkxcblx0XHR3cml0ZVVSTCgpO1xuXG5cdFx0c29ydEFsbEZyYWdtZW50cygpO1xuXG5cdFx0dXBkYXRlQ29udHJvbHMoKTtcblx0XHR1cGRhdGVQcm9ncmVzcygpO1xuXHRcdHVwZGF0ZUJhY2tncm91bmQoIHRydWUgKTtcblx0XHR1cGRhdGVTbGlkZU51bWJlcigpO1xuXHRcdHVwZGF0ZVNsaWRlc1Zpc2liaWxpdHkoKTtcblx0XHR1cGRhdGVOb3RlcygpO1xuXG5cdFx0Zm9ybWF0RW1iZWRkZWRDb250ZW50KCk7XG5cdFx0c3RhcnRFbWJlZGRlZENvbnRlbnQoIGN1cnJlbnRTbGlkZSApO1xuXG5cdFx0aWYoIGlzT3ZlcnZpZXcoKSApIHtcblx0XHRcdGxheW91dE92ZXJ2aWV3KCk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogUmVzZXRzIGFsbCB2ZXJ0aWNhbCBzbGlkZXMgc28gdGhhdCBvbmx5IHRoZSBmaXJzdFxuXHQgKiBpcyB2aXNpYmxlLlxuXHQgKi9cblx0ZnVuY3Rpb24gcmVzZXRWZXJ0aWNhbFNsaWRlcygpIHtcblxuXHRcdHZhciBob3Jpem9udGFsU2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApO1xuXHRcdGhvcml6b250YWxTbGlkZXMuZm9yRWFjaCggZnVuY3Rpb24oIGhvcml6b250YWxTbGlkZSApIHtcblxuXHRcdFx0dmFyIHZlcnRpY2FsU2xpZGVzID0gdG9BcnJheSggaG9yaXpvbnRhbFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApICk7XG5cdFx0XHR2ZXJ0aWNhbFNsaWRlcy5mb3JFYWNoKCBmdW5jdGlvbiggdmVydGljYWxTbGlkZSwgeSApIHtcblxuXHRcdFx0XHRpZiggeSA+IDAgKSB7XG5cdFx0XHRcdFx0dmVydGljYWxTbGlkZS5jbGFzc0xpc3QucmVtb3ZlKCAncHJlc2VudCcgKTtcblx0XHRcdFx0XHR2ZXJ0aWNhbFNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoICdwYXN0JyApO1xuXHRcdFx0XHRcdHZlcnRpY2FsU2xpZGUuY2xhc3NMaXN0LmFkZCggJ2Z1dHVyZScgKTtcblx0XHRcdFx0XHR2ZXJ0aWNhbFNsaWRlLnNldEF0dHJpYnV0ZSggJ2FyaWEtaGlkZGVuJywgJ3RydWUnICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSApO1xuXG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogU29ydHMgYW5kIGZvcm1hdHMgYWxsIG9mIGZyYWdtZW50cyBpbiB0aGVcblx0ICogcHJlc2VudGF0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gc29ydEFsbEZyYWdtZW50cygpIHtcblxuXHRcdHZhciBob3Jpem9udGFsU2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApO1xuXHRcdGhvcml6b250YWxTbGlkZXMuZm9yRWFjaCggZnVuY3Rpb24oIGhvcml6b250YWxTbGlkZSApIHtcblxuXHRcdFx0dmFyIHZlcnRpY2FsU2xpZGVzID0gdG9BcnJheSggaG9yaXpvbnRhbFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApICk7XG5cdFx0XHR2ZXJ0aWNhbFNsaWRlcy5mb3JFYWNoKCBmdW5jdGlvbiggdmVydGljYWxTbGlkZSwgeSApIHtcblxuXHRcdFx0XHRzb3J0RnJhZ21lbnRzKCB2ZXJ0aWNhbFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQnICkgKTtcblxuXHRcdFx0fSApO1xuXG5cdFx0XHRpZiggdmVydGljYWxTbGlkZXMubGVuZ3RoID09PSAwICkgc29ydEZyYWdtZW50cyggaG9yaXpvbnRhbFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQnICkgKTtcblxuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJhbmRvbWx5IHNodWZmbGVzIGFsbCBzbGlkZXMgaW4gdGhlIGRlY2suXG5cdCAqL1xuXHRmdW5jdGlvbiBzaHVmZmxlKCkge1xuXG5cdFx0dmFyIHNsaWRlcyA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICkgKTtcblxuXHRcdHNsaWRlcy5mb3JFYWNoKCBmdW5jdGlvbiggc2xpZGUgKSB7XG5cblx0XHRcdC8vIEluc2VydCB0aGlzIHNsaWRlIG5leHQgdG8gYW5vdGhlciByYW5kb20gc2xpZGUuIFRoaXMgbWF5XG5cdFx0XHQvLyBjYXVzZSB0aGUgc2xpZGUgdG8gaW5zZXJ0IGJlZm9yZSBpdHNlbGYgYnV0IHRoYXQncyBmaW5lLlxuXHRcdFx0ZG9tLnNsaWRlcy5pbnNlcnRCZWZvcmUoIHNsaWRlLCBzbGlkZXNbIE1hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiBzbGlkZXMubGVuZ3RoICkgXSApO1xuXG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyBvbmUgZGltZW5zaW9uIG9mIHNsaWRlcyBieSBzaG93aW5nIHRoZSBzbGlkZVxuXHQgKiB3aXRoIHRoZSBzcGVjaWZpZWQgaW5kZXguXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciBBIENTUyBzZWxlY3RvciB0aGF0IHdpbGwgZmV0Y2hcblx0ICogdGhlIGdyb3VwIG9mIHNsaWRlcyB3ZSBhcmUgd29ya2luZyB3aXRoXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIHNsaWRlIHRoYXQgc2hvdWxkIGJlXG5cdCAqIHNob3duXG5cdCAqXG5cdCAqIEByZXR1cm4ge051bWJlcn0gVGhlIGluZGV4IG9mIHRoZSBzbGlkZSB0aGF0IGlzIG5vdyBzaG93bixcblx0ICogbWlnaHQgZGlmZmVyIGZyb20gdGhlIHBhc3NlZCBpbiBpbmRleCBpZiBpdCB3YXMgb3V0IG9mXG5cdCAqIGJvdW5kcy5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZVNsaWRlcyggc2VsZWN0b3IsIGluZGV4ICkge1xuXG5cdFx0Ly8gU2VsZWN0IGFsbCBzbGlkZXMgYW5kIGNvbnZlcnQgdGhlIE5vZGVMaXN0IHJlc3VsdCB0b1xuXHRcdC8vIGFuIGFycmF5XG5cdFx0dmFyIHNsaWRlcyA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIHNlbGVjdG9yICkgKSxcblx0XHRcdHNsaWRlc0xlbmd0aCA9IHNsaWRlcy5sZW5ndGg7XG5cblx0XHR2YXIgcHJpbnRNb2RlID0gaXNQcmludGluZ1BERigpO1xuXG5cdFx0aWYoIHNsaWRlc0xlbmd0aCApIHtcblxuXHRcdFx0Ly8gU2hvdWxkIHRoZSBpbmRleCBsb29wP1xuXHRcdFx0aWYoIGNvbmZpZy5sb29wICkge1xuXHRcdFx0XHRpbmRleCAlPSBzbGlkZXNMZW5ndGg7XG5cblx0XHRcdFx0aWYoIGluZGV4IDwgMCApIHtcblx0XHRcdFx0XHRpbmRleCA9IHNsaWRlc0xlbmd0aCArIGluZGV4O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIEVuZm9yY2UgbWF4IGFuZCBtaW5pbXVtIGluZGV4IGJvdW5kc1xuXHRcdFx0aW5kZXggPSBNYXRoLm1heCggTWF0aC5taW4oIGluZGV4LCBzbGlkZXNMZW5ndGggLSAxICksIDAgKTtcblxuXHRcdFx0Zm9yKCB2YXIgaSA9IDA7IGkgPCBzbGlkZXNMZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0dmFyIGVsZW1lbnQgPSBzbGlkZXNbaV07XG5cblx0XHRcdFx0dmFyIHJldmVyc2UgPSBjb25maWcucnRsICYmICFpc1ZlcnRpY2FsU2xpZGUoIGVsZW1lbnQgKTtcblxuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdwYXN0JyApO1xuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdwcmVzZW50JyApO1xuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdmdXR1cmUnICk7XG5cblx0XHRcdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvaHRtbC93Zy9kcmFmdHMvaHRtbC9tYXN0ZXIvZWRpdGluZy5odG1sI3RoZS1oaWRkZW4tYXR0cmlidXRlXG5cdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnaGlkZGVuJywgJycgKTtcblx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdhcmlhLWhpZGRlbicsICd0cnVlJyApO1xuXG5cdFx0XHRcdC8vIElmIHRoaXMgZWxlbWVudCBjb250YWlucyB2ZXJ0aWNhbCBzbGlkZXNcblx0XHRcdFx0aWYoIGVsZW1lbnQucXVlcnlTZWxlY3RvciggJ3NlY3Rpb24nICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnc3RhY2snICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJZiB3ZSdyZSBwcmludGluZyBzdGF0aWMgc2xpZGVzLCBhbGwgc2xpZGVzIGFyZSBcInByZXNlbnRcIlxuXHRcdFx0XHRpZiggcHJpbnRNb2RlICkge1xuXHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ3ByZXNlbnQnICk7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiggaSA8IGluZGV4ICkge1xuXHRcdFx0XHRcdC8vIEFueSBlbGVtZW50IHByZXZpb3VzIHRvIGluZGV4IGlzIGdpdmVuIHRoZSAncGFzdCcgY2xhc3Ncblx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoIHJldmVyc2UgPyAnZnV0dXJlJyA6ICdwYXN0JyApO1xuXG5cdFx0XHRcdFx0aWYoIGNvbmZpZy5mcmFnbWVudHMgKSB7XG5cdFx0XHRcdFx0XHR2YXIgcGFzdEZyYWdtZW50cyA9IHRvQXJyYXkoIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKSApO1xuXG5cdFx0XHRcdFx0XHQvLyBTaG93IGFsbCBmcmFnbWVudHMgb24gcHJpb3Igc2xpZGVzXG5cdFx0XHRcdFx0XHR3aGlsZSggcGFzdEZyYWdtZW50cy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBwYXN0RnJhZ21lbnQgPSBwYXN0RnJhZ21lbnRzLnBvcCgpO1xuXHRcdFx0XHRcdFx0XHRwYXN0RnJhZ21lbnQuY2xhc3NMaXN0LmFkZCggJ3Zpc2libGUnICk7XG5cdFx0XHRcdFx0XHRcdHBhc3RGcmFnbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnY3VycmVudC1mcmFnbWVudCcgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiggaSA+IGluZGV4ICkge1xuXHRcdFx0XHRcdC8vIEFueSBlbGVtZW50IHN1YnNlcXVlbnQgdG8gaW5kZXggaXMgZ2l2ZW4gdGhlICdmdXR1cmUnIGNsYXNzXG5cdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCByZXZlcnNlID8gJ3Bhc3QnIDogJ2Z1dHVyZScgKTtcblxuXHRcdFx0XHRcdGlmKCBjb25maWcuZnJhZ21lbnRzICkge1xuXHRcdFx0XHRcdFx0dmFyIGZ1dHVyZUZyYWdtZW50cyA9IHRvQXJyYXkoIGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudC52aXNpYmxlJyApICk7XG5cblx0XHRcdFx0XHRcdC8vIE5vIGZyYWdtZW50cyBpbiBmdXR1cmUgc2xpZGVzIHNob3VsZCBiZSB2aXNpYmxlIGFoZWFkIG9mIHRpbWVcblx0XHRcdFx0XHRcdHdoaWxlKCBmdXR1cmVGcmFnbWVudHMubGVuZ3RoICkge1xuXHRcdFx0XHRcdFx0XHR2YXIgZnV0dXJlRnJhZ21lbnQgPSBmdXR1cmVGcmFnbWVudHMucG9wKCk7XG5cdFx0XHRcdFx0XHRcdGZ1dHVyZUZyYWdtZW50LmNsYXNzTGlzdC5yZW1vdmUoICd2aXNpYmxlJyApO1xuXHRcdFx0XHRcdFx0XHRmdXR1cmVGcmFnbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnY3VycmVudC1mcmFnbWVudCcgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gTWFyayB0aGUgY3VycmVudCBzbGlkZSBhcyBwcmVzZW50XG5cdFx0XHRzbGlkZXNbaW5kZXhdLmNsYXNzTGlzdC5hZGQoICdwcmVzZW50JyApO1xuXHRcdFx0c2xpZGVzW2luZGV4XS5yZW1vdmVBdHRyaWJ1dGUoICdoaWRkZW4nICk7XG5cdFx0XHRzbGlkZXNbaW5kZXhdLnJlbW92ZUF0dHJpYnV0ZSggJ2FyaWEtaGlkZGVuJyApO1xuXG5cdFx0XHQvLyBJZiB0aGlzIHNsaWRlIGhhcyBhIHN0YXRlIGFzc29jaWF0ZWQgd2l0aCBpdCwgYWRkIGl0XG5cdFx0XHQvLyBvbnRvIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBkZWNrXG5cdFx0XHR2YXIgc2xpZGVTdGF0ZSA9IHNsaWRlc1tpbmRleF0uZ2V0QXR0cmlidXRlKCAnZGF0YS1zdGF0ZScgKTtcblx0XHRcdGlmKCBzbGlkZVN0YXRlICkge1xuXHRcdFx0XHRzdGF0ZSA9IHN0YXRlLmNvbmNhdCggc2xpZGVTdGF0ZS5zcGxpdCggJyAnICkgKTtcblx0XHRcdH1cblxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIFNpbmNlIHRoZXJlIGFyZSBubyBzbGlkZXMgd2UgY2FuJ3QgYmUgYW55d2hlcmUgYmV5b25kIHRoZVxuXHRcdFx0Ly8gemVyb3RoIGluZGV4XG5cdFx0XHRpbmRleCA9IDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGluZGV4O1xuXG5cdH1cblxuXHQvKipcblx0ICogT3B0aW1pemF0aW9uIG1ldGhvZDsgaGlkZSBhbGwgc2xpZGVzIHRoYXQgYXJlIGZhciBhd2F5XG5cdCAqIGZyb20gdGhlIHByZXNlbnQgc2xpZGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVTbGlkZXNWaXNpYmlsaXR5KCkge1xuXG5cdFx0Ly8gU2VsZWN0IGFsbCBzbGlkZXMgYW5kIGNvbnZlcnQgdGhlIE5vZGVMaXN0IHJlc3VsdCB0b1xuXHRcdC8vIGFuIGFycmF5XG5cdFx0dmFyIGhvcml6b250YWxTbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICksXG5cdFx0XHRob3Jpem9udGFsU2xpZGVzTGVuZ3RoID0gaG9yaXpvbnRhbFNsaWRlcy5sZW5ndGgsXG5cdFx0XHRkaXN0YW5jZVgsXG5cdFx0XHRkaXN0YW5jZVk7XG5cblx0XHRpZiggaG9yaXpvbnRhbFNsaWRlc0xlbmd0aCAmJiB0eXBlb2YgaW5kZXhoICE9PSAndW5kZWZpbmVkJyApIHtcblxuXHRcdFx0Ly8gVGhlIG51bWJlciBvZiBzdGVwcyBhd2F5IGZyb20gdGhlIHByZXNlbnQgc2xpZGUgdGhhdCB3aWxsXG5cdFx0XHQvLyBiZSB2aXNpYmxlXG5cdFx0XHR2YXIgdmlld0Rpc3RhbmNlID0gaXNPdmVydmlldygpID8gMTAgOiBjb25maWcudmlld0Rpc3RhbmNlO1xuXG5cdFx0XHQvLyBMaW1pdCB2aWV3IGRpc3RhbmNlIG9uIHdlYWtlciBkZXZpY2VzXG5cdFx0XHRpZiggaXNNb2JpbGVEZXZpY2UgKSB7XG5cdFx0XHRcdHZpZXdEaXN0YW5jZSA9IGlzT3ZlcnZpZXcoKSA/IDYgOiAyO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBBbGwgc2xpZGVzIG5lZWQgdG8gYmUgdmlzaWJsZSB3aGVuIGV4cG9ydGluZyB0byBQREZcblx0XHRcdGlmKCBpc1ByaW50aW5nUERGKCkgKSB7XG5cdFx0XHRcdHZpZXdEaXN0YW5jZSA9IE51bWJlci5NQVhfVkFMVUU7XG5cdFx0XHR9XG5cblx0XHRcdGZvciggdmFyIHggPSAwOyB4IDwgaG9yaXpvbnRhbFNsaWRlc0xlbmd0aDsgeCsrICkge1xuXHRcdFx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlID0gaG9yaXpvbnRhbFNsaWRlc1t4XTtcblxuXHRcdFx0XHR2YXIgdmVydGljYWxTbGlkZXMgPSB0b0FycmF5KCBob3Jpem9udGFsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKSxcblx0XHRcdFx0XHR2ZXJ0aWNhbFNsaWRlc0xlbmd0aCA9IHZlcnRpY2FsU2xpZGVzLmxlbmd0aDtcblxuXHRcdFx0XHQvLyBEZXRlcm1pbmUgaG93IGZhciBhd2F5IHRoaXMgc2xpZGUgaXMgZnJvbSB0aGUgcHJlc2VudFxuXHRcdFx0XHRkaXN0YW5jZVggPSBNYXRoLmFicyggKCBpbmRleGggfHwgMCApIC0geCApIHx8IDA7XG5cblx0XHRcdFx0Ly8gSWYgdGhlIHByZXNlbnRhdGlvbiBpcyBsb29wZWQsIGRpc3RhbmNlIHNob3VsZCBtZWFzdXJlXG5cdFx0XHRcdC8vIDEgYmV0d2VlbiB0aGUgZmlyc3QgYW5kIGxhc3Qgc2xpZGVzXG5cdFx0XHRcdGlmKCBjb25maWcubG9vcCApIHtcblx0XHRcdFx0XHRkaXN0YW5jZVggPSBNYXRoLmFicyggKCAoIGluZGV4aCB8fCAwICkgLSB4ICkgJSAoIGhvcml6b250YWxTbGlkZXNMZW5ndGggLSB2aWV3RGlzdGFuY2UgKSApIHx8IDA7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTaG93IHRoZSBob3Jpem9udGFsIHNsaWRlIGlmIGl0J3Mgd2l0aGluIHRoZSB2aWV3IGRpc3RhbmNlXG5cdFx0XHRcdGlmKCBkaXN0YW5jZVggPCB2aWV3RGlzdGFuY2UgKSB7XG5cdFx0XHRcdFx0c2hvd1NsaWRlKCBob3Jpem9udGFsU2xpZGUgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRoaWRlU2xpZGUoIGhvcml6b250YWxTbGlkZSApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoIHZlcnRpY2FsU2xpZGVzTGVuZ3RoICkge1xuXG5cdFx0XHRcdFx0dmFyIG95ID0gZ2V0UHJldmlvdXNWZXJ0aWNhbEluZGV4KCBob3Jpem9udGFsU2xpZGUgKTtcblxuXHRcdFx0XHRcdGZvciggdmFyIHkgPSAwOyB5IDwgdmVydGljYWxTbGlkZXNMZW5ndGg7IHkrKyApIHtcblx0XHRcdFx0XHRcdHZhciB2ZXJ0aWNhbFNsaWRlID0gdmVydGljYWxTbGlkZXNbeV07XG5cblx0XHRcdFx0XHRcdGRpc3RhbmNlWSA9IHggPT09ICggaW5kZXhoIHx8IDAgKSA/IE1hdGguYWJzKCAoIGluZGV4diB8fCAwICkgLSB5ICkgOiBNYXRoLmFicyggeSAtIG95ICk7XG5cblx0XHRcdFx0XHRcdGlmKCBkaXN0YW5jZVggKyBkaXN0YW5jZVkgPCB2aWV3RGlzdGFuY2UgKSB7XG5cdFx0XHRcdFx0XHRcdHNob3dTbGlkZSggdmVydGljYWxTbGlkZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGhpZGVTbGlkZSggdmVydGljYWxTbGlkZSApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBQaWNrIHVwIG5vdGVzIGZyb20gdGhlIGN1cnJlbnQgc2xpZGUgYW5kIGRpc3BsYXkgdGhhbVxuXHQgKiB0byB0aGUgdmlld2VyLlxuXHQgKlxuXHQgKiBAc2VlIGBzaG93Tm90ZXNgIGNvbmZpZyB2YWx1ZVxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlTm90ZXMoKSB7XG5cblx0XHRpZiggY29uZmlnLnNob3dOb3RlcyAmJiBkb20uc3BlYWtlck5vdGVzICYmIGN1cnJlbnRTbGlkZSAmJiAhaXNQcmludGluZ1BERigpICkge1xuXG5cdFx0XHRkb20uc3BlYWtlck5vdGVzLmlubmVySFRNTCA9IGdldFNsaWRlTm90ZXMoKSB8fCAnJztcblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIHByb2dyZXNzIGJhciB0byByZWZsZWN0IHRoZSBjdXJyZW50IHNsaWRlLlxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlUHJvZ3Jlc3MoKSB7XG5cblx0XHQvLyBVcGRhdGUgcHJvZ3Jlc3MgaWYgZW5hYmxlZFxuXHRcdGlmKCBjb25maWcucHJvZ3Jlc3MgJiYgZG9tLnByb2dyZXNzYmFyICkge1xuXG5cdFx0XHRkb20ucHJvZ3Jlc3NiYXIuc3R5bGUud2lkdGggPSBnZXRQcm9ncmVzcygpICogZG9tLndyYXBwZXIub2Zmc2V0V2lkdGggKyAncHgnO1xuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgc2xpZGUgbnVtYmVyIGRpdiB0byByZWZsZWN0IHRoZSBjdXJyZW50IHNsaWRlLlxuXHQgKlxuXHQgKiBUaGUgZm9sbG93aW5nIHNsaWRlIG51bWJlciBmb3JtYXRzIGFyZSBhdmFpbGFibGU6XG5cdCAqICBcImgudlwiOiBcdGhvcml6b250YWwgLiB2ZXJ0aWNhbCBzbGlkZSBudW1iZXIgKGRlZmF1bHQpXG5cdCAqICBcImgvdlwiOiBcdGhvcml6b250YWwgLyB2ZXJ0aWNhbCBzbGlkZSBudW1iZXJcblx0ICogICAgXCJjXCI6IFx0ZmxhdHRlbmVkIHNsaWRlIG51bWJlclxuXHQgKiAgXCJjL3RcIjogXHRmbGF0dGVuZWQgc2xpZGUgbnVtYmVyIC8gdG90YWwgc2xpZGVzXG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVTbGlkZU51bWJlcigpIHtcblxuXHRcdC8vIFVwZGF0ZSBzbGlkZSBudW1iZXIgaWYgZW5hYmxlZFxuXHRcdGlmKCBjb25maWcuc2xpZGVOdW1iZXIgJiYgZG9tLnNsaWRlTnVtYmVyICkge1xuXG5cdFx0XHR2YXIgdmFsdWUgPSBbXTtcblx0XHRcdHZhciBmb3JtYXQgPSAnaC52JztcblxuXHRcdFx0Ly8gQ2hlY2sgaWYgYSBjdXN0b20gbnVtYmVyIGZvcm1hdCBpcyBhdmFpbGFibGVcblx0XHRcdGlmKCB0eXBlb2YgY29uZmlnLnNsaWRlTnVtYmVyID09PSAnc3RyaW5nJyApIHtcblx0XHRcdFx0Zm9ybWF0ID0gY29uZmlnLnNsaWRlTnVtYmVyO1xuXHRcdFx0fVxuXG5cdFx0XHRzd2l0Y2goIGZvcm1hdCApIHtcblx0XHRcdFx0Y2FzZSAnYyc6XG5cdFx0XHRcdFx0dmFsdWUucHVzaCggZ2V0U2xpZGVQYXN0Q291bnQoKSArIDEgKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnYy90Jzpcblx0XHRcdFx0XHR2YWx1ZS5wdXNoKCBnZXRTbGlkZVBhc3RDb3VudCgpICsgMSwgJy8nLCBnZXRUb3RhbFNsaWRlcygpICk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2gvdic6XG5cdFx0XHRcdFx0dmFsdWUucHVzaCggaW5kZXhoICsgMSApO1xuXHRcdFx0XHRcdGlmKCBpc1ZlcnRpY2FsU2xpZGUoKSApIHZhbHVlLnB1c2goICcvJywgaW5kZXh2ICsgMSApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHZhbHVlLnB1c2goIGluZGV4aCArIDEgKTtcblx0XHRcdFx0XHRpZiggaXNWZXJ0aWNhbFNsaWRlKCkgKSB2YWx1ZS5wdXNoKCAnLicsIGluZGV4diArIDEgKTtcblx0XHRcdH1cblxuXHRcdFx0ZG9tLnNsaWRlTnVtYmVyLmlubmVySFRNTCA9IGZvcm1hdFNsaWRlTnVtYmVyKCB2YWx1ZVswXSwgdmFsdWVbMV0sIHZhbHVlWzJdICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyBIVE1MIGZvcm1hdHRpbmcgdG8gYSBzbGlkZSBudW1iZXIgYmVmb3JlIGl0J3Ncblx0ICogd3JpdHRlbiB0byB0aGUgRE9NLlxuXHQgKi9cblx0ZnVuY3Rpb24gZm9ybWF0U2xpZGVOdW1iZXIoIGEsIGRlbGltaXRlciwgYiApIHtcblxuXHRcdGlmKCB0eXBlb2YgYiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKCBiICkgKSB7XG5cdFx0XHRyZXR1cm4gICc8c3BhbiBjbGFzcz1cInNsaWRlLW51bWJlci1hXCI+JysgYSArJzwvc3Bhbj4nICtcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJzbGlkZS1udW1iZXItZGVsaW1pdGVyXCI+JysgZGVsaW1pdGVyICsnPC9zcGFuPicgK1xuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cInNsaWRlLW51bWJlci1iXCI+JysgYiArJzwvc3Bhbj4nO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiAnPHNwYW4gY2xhc3M9XCJzbGlkZS1udW1iZXItYVwiPicrIGEgKyc8L3NwYW4+Jztcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBzdGF0ZSBvZiBhbGwgY29udHJvbC9uYXZpZ2F0aW9uIGFycm93cy5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZUNvbnRyb2xzKCkge1xuXG5cdFx0dmFyIHJvdXRlcyA9IGF2YWlsYWJsZVJvdXRlcygpO1xuXHRcdHZhciBmcmFnbWVudHMgPSBhdmFpbGFibGVGcmFnbWVudHMoKTtcblxuXHRcdC8vIFJlbW92ZSB0aGUgJ2VuYWJsZWQnIGNsYXNzIGZyb20gYWxsIGRpcmVjdGlvbnNcblx0XHRkb20uY29udHJvbHNMZWZ0LmNvbmNhdCggZG9tLmNvbnRyb2xzUmlnaHQgKVxuXHRcdFx0XHRcdFx0LmNvbmNhdCggZG9tLmNvbnRyb2xzVXAgKVxuXHRcdFx0XHRcdFx0LmNvbmNhdCggZG9tLmNvbnRyb2xzRG93biApXG5cdFx0XHRcdFx0XHQuY29uY2F0KCBkb20uY29udHJvbHNQcmV2IClcblx0XHRcdFx0XHRcdC5jb25jYXQoIGRvbS5jb250cm9sc05leHQgKS5mb3JFYWNoKCBmdW5jdGlvbiggbm9kZSApIHtcblx0XHRcdG5vZGUuY2xhc3NMaXN0LnJlbW92ZSggJ2VuYWJsZWQnICk7XG5cdFx0XHRub2RlLmNsYXNzTGlzdC5yZW1vdmUoICdmcmFnbWVudGVkJyApO1xuXHRcdH0gKTtcblxuXHRcdC8vIEFkZCB0aGUgJ2VuYWJsZWQnIGNsYXNzIHRvIHRoZSBhdmFpbGFibGUgcm91dGVzXG5cdFx0aWYoIHJvdXRlcy5sZWZ0ICkgZG9tLmNvbnRyb2xzTGVmdC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdlbmFibGVkJyApO1x0fSApO1xuXHRcdGlmKCByb3V0ZXMucmlnaHQgKSBkb20uY29udHJvbHNSaWdodC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdlbmFibGVkJyApOyB9ICk7XG5cdFx0aWYoIHJvdXRlcy51cCApIGRvbS5jb250cm9sc1VwLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2VuYWJsZWQnICk7XHR9ICk7XG5cdFx0aWYoIHJvdXRlcy5kb3duICkgZG9tLmNvbnRyb2xzRG93bi5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdlbmFibGVkJyApOyB9ICk7XG5cblx0XHQvLyBQcmV2L25leHQgYnV0dG9uc1xuXHRcdGlmKCByb3V0ZXMubGVmdCB8fCByb3V0ZXMudXAgKSBkb20uY29udHJvbHNQcmV2LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2VuYWJsZWQnICk7IH0gKTtcblx0XHRpZiggcm91dGVzLnJpZ2h0IHx8IHJvdXRlcy5kb3duICkgZG9tLmNvbnRyb2xzTmV4dC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdlbmFibGVkJyApOyB9ICk7XG5cblx0XHQvLyBIaWdobGlnaHQgZnJhZ21lbnQgZGlyZWN0aW9uc1xuXHRcdGlmKCBjdXJyZW50U2xpZGUgKSB7XG5cblx0XHRcdC8vIEFsd2F5cyBhcHBseSBmcmFnbWVudCBkZWNvcmF0b3IgdG8gcHJldi9uZXh0IGJ1dHRvbnNcblx0XHRcdGlmKCBmcmFnbWVudHMucHJldiApIGRvbS5jb250cm9sc1ByZXYuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZnJhZ21lbnRlZCcsICdlbmFibGVkJyApOyB9ICk7XG5cdFx0XHRpZiggZnJhZ21lbnRzLm5leHQgKSBkb20uY29udHJvbHNOZXh0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2ZyYWdtZW50ZWQnLCAnZW5hYmxlZCcgKTsgfSApO1xuXG5cdFx0XHQvLyBBcHBseSBmcmFnbWVudCBkZWNvcmF0b3JzIHRvIGRpcmVjdGlvbmFsIGJ1dHRvbnMgYmFzZWQgb25cblx0XHRcdC8vIHdoYXQgc2xpZGUgYXhpcyB0aGV5IGFyZSBpblxuXHRcdFx0aWYoIGlzVmVydGljYWxTbGlkZSggY3VycmVudFNsaWRlICkgKSB7XG5cdFx0XHRcdGlmKCBmcmFnbWVudHMucHJldiApIGRvbS5jb250cm9sc1VwLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2ZyYWdtZW50ZWQnLCAnZW5hYmxlZCcgKTsgfSApO1xuXHRcdFx0XHRpZiggZnJhZ21lbnRzLm5leHQgKSBkb20uY29udHJvbHNEb3duLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2ZyYWdtZW50ZWQnLCAnZW5hYmxlZCcgKTsgfSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmKCBmcmFnbWVudHMucHJldiApIGRvbS5jb250cm9sc0xlZnQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZnJhZ21lbnRlZCcsICdlbmFibGVkJyApOyB9ICk7XG5cdFx0XHRcdGlmKCBmcmFnbWVudHMubmV4dCApIGRvbS5jb250cm9sc1JpZ2h0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2ZyYWdtZW50ZWQnLCAnZW5hYmxlZCcgKTsgfSApO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgYmFja2dyb3VuZCBlbGVtZW50cyB0byByZWZsZWN0IHRoZSBjdXJyZW50XG5cdCAqIHNsaWRlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IGluY2x1ZGVBbGwgSWYgdHJ1ZSwgdGhlIGJhY2tncm91bmRzIG9mXG5cdCAqIGFsbCB2ZXJ0aWNhbCBzbGlkZXMgKG5vdCBqdXN0IHRoZSBwcmVzZW50KSB3aWxsIGJlIHVwZGF0ZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVCYWNrZ3JvdW5kKCBpbmNsdWRlQWxsICkge1xuXG5cdFx0dmFyIGN1cnJlbnRCYWNrZ3JvdW5kID0gbnVsbDtcblxuXHRcdC8vIFJldmVyc2UgcGFzdC9mdXR1cmUgY2xhc3NlcyB3aGVuIGluIFJUTCBtb2RlXG5cdFx0dmFyIGhvcml6b250YWxQYXN0ID0gY29uZmlnLnJ0bCA/ICdmdXR1cmUnIDogJ3Bhc3QnLFxuXHRcdFx0aG9yaXpvbnRhbEZ1dHVyZSA9IGNvbmZpZy5ydGwgPyAncGFzdCcgOiAnZnV0dXJlJztcblxuXHRcdC8vIFVwZGF0ZSB0aGUgY2xhc3NlcyBvZiBhbGwgYmFja2dyb3VuZHMgdG8gbWF0Y2ggdGhlXG5cdFx0Ly8gc3RhdGVzIG9mIHRoZWlyIHNsaWRlcyAocGFzdC9wcmVzZW50L2Z1dHVyZSlcblx0XHR0b0FycmF5KCBkb20uYmFja2dyb3VuZC5jaGlsZE5vZGVzICkuZm9yRWFjaCggZnVuY3Rpb24oIGJhY2tncm91bmRoLCBoICkge1xuXG5cdFx0XHRiYWNrZ3JvdW5kaC5jbGFzc0xpc3QucmVtb3ZlKCAncGFzdCcgKTtcblx0XHRcdGJhY2tncm91bmRoLmNsYXNzTGlzdC5yZW1vdmUoICdwcmVzZW50JyApO1xuXHRcdFx0YmFja2dyb3VuZGguY2xhc3NMaXN0LnJlbW92ZSggJ2Z1dHVyZScgKTtcblxuXHRcdFx0aWYoIGggPCBpbmRleGggKSB7XG5cdFx0XHRcdGJhY2tncm91bmRoLmNsYXNzTGlzdC5hZGQoIGhvcml6b250YWxQYXN0ICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICggaCA+IGluZGV4aCApIHtcblx0XHRcdFx0YmFja2dyb3VuZGguY2xhc3NMaXN0LmFkZCggaG9yaXpvbnRhbEZ1dHVyZSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGJhY2tncm91bmRoLmNsYXNzTGlzdC5hZGQoICdwcmVzZW50JyApO1xuXG5cdFx0XHRcdC8vIFN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50IGJhY2tncm91bmQgZWxlbWVudFxuXHRcdFx0XHRjdXJyZW50QmFja2dyb3VuZCA9IGJhY2tncm91bmRoO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiggaW5jbHVkZUFsbCB8fCBoID09PSBpbmRleGggKSB7XG5cdFx0XHRcdHRvQXJyYXkoIGJhY2tncm91bmRoLnF1ZXJ5U2VsZWN0b3JBbGwoICcuc2xpZGUtYmFja2dyb3VuZCcgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBiYWNrZ3JvdW5kdiwgdiApIHtcblxuXHRcdFx0XHRcdGJhY2tncm91bmR2LmNsYXNzTGlzdC5yZW1vdmUoICdwYXN0JyApO1xuXHRcdFx0XHRcdGJhY2tncm91bmR2LmNsYXNzTGlzdC5yZW1vdmUoICdwcmVzZW50JyApO1xuXHRcdFx0XHRcdGJhY2tncm91bmR2LmNsYXNzTGlzdC5yZW1vdmUoICdmdXR1cmUnICk7XG5cblx0XHRcdFx0XHRpZiggdiA8IGluZGV4diApIHtcblx0XHRcdFx0XHRcdGJhY2tncm91bmR2LmNsYXNzTGlzdC5hZGQoICdwYXN0JyApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICggdiA+IGluZGV4diApIHtcblx0XHRcdFx0XHRcdGJhY2tncm91bmR2LmNsYXNzTGlzdC5hZGQoICdmdXR1cmUnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZHYuY2xhc3NMaXN0LmFkZCggJ3ByZXNlbnQnICk7XG5cblx0XHRcdFx0XHRcdC8vIE9ubHkgaWYgdGhpcyBpcyB0aGUgcHJlc2VudCBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBzbGlkZVxuXHRcdFx0XHRcdFx0aWYoIGggPT09IGluZGV4aCApIGN1cnJlbnRCYWNrZ3JvdW5kID0gYmFja2dyb3VuZHY7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gKTtcblx0XHRcdH1cblxuXHRcdH0gKTtcblxuXHRcdC8vIFN0b3AgYW55IGN1cnJlbnRseSBwbGF5aW5nIHZpZGVvIGJhY2tncm91bmRcblx0XHRpZiggcHJldmlvdXNCYWNrZ3JvdW5kICkge1xuXG5cdFx0XHR2YXIgcHJldmlvdXNWaWRlbyA9IHByZXZpb3VzQmFja2dyb3VuZC5xdWVyeVNlbGVjdG9yKCAndmlkZW8nICk7XG5cdFx0XHRpZiggcHJldmlvdXNWaWRlbyApIHByZXZpb3VzVmlkZW8ucGF1c2UoKTtcblxuXHRcdH1cblxuXHRcdGlmKCBjdXJyZW50QmFja2dyb3VuZCApIHtcblxuXHRcdFx0Ly8gU3RhcnQgdmlkZW8gcGxheWJhY2tcblx0XHRcdHZhciBjdXJyZW50VmlkZW8gPSBjdXJyZW50QmFja2dyb3VuZC5xdWVyeVNlbGVjdG9yKCAndmlkZW8nICk7XG5cdFx0XHRpZiggY3VycmVudFZpZGVvICkge1xuXG5cdFx0XHRcdHZhciBzdGFydFZpZGVvID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y3VycmVudFZpZGVvLmN1cnJlbnRUaW1lID0gMDtcblx0XHRcdFx0XHRjdXJyZW50VmlkZW8ucGxheSgpO1xuXHRcdFx0XHRcdGN1cnJlbnRWaWRlby5yZW1vdmVFdmVudExpc3RlbmVyKCAnbG9hZGVkZGF0YScsIHN0YXJ0VmlkZW8gKTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiggY3VycmVudFZpZGVvLnJlYWR5U3RhdGUgPiAxICkge1xuXHRcdFx0XHRcdHN0YXJ0VmlkZW8oKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRjdXJyZW50VmlkZW8uYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWRlZGRhdGEnLCBzdGFydFZpZGVvICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgYmFja2dyb3VuZEltYWdlVVJMID0gY3VycmVudEJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZEltYWdlIHx8ICcnO1xuXG5cdFx0XHQvLyBSZXN0YXJ0IEdJRnMgKGRvZXNuJ3Qgd29yayBpbiBGaXJlZm94KVxuXHRcdFx0aWYoIC9cXC5naWYvaS50ZXN0KCBiYWNrZ3JvdW5kSW1hZ2VVUkwgKSApIHtcblx0XHRcdFx0Y3VycmVudEJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJyc7XG5cdFx0XHRcdHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBjdXJyZW50QmFja2dyb3VuZCApLm9wYWNpdHk7XG5cdFx0XHRcdGN1cnJlbnRCYWNrZ3JvdW5kLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGJhY2tncm91bmRJbWFnZVVSTDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gRG9uJ3QgdHJhbnNpdGlvbiBiZXR3ZWVuIGlkZW50aWNhbCBiYWNrZ3JvdW5kcy4gVGhpc1xuXHRcdFx0Ly8gcHJldmVudHMgdW53YW50ZWQgZmxpY2tlci5cblx0XHRcdHZhciBwcmV2aW91c0JhY2tncm91bmRIYXNoID0gcHJldmlvdXNCYWNrZ3JvdW5kID8gcHJldmlvdXNCYWNrZ3JvdW5kLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1oYXNoJyApIDogbnVsbDtcblx0XHRcdHZhciBjdXJyZW50QmFja2dyb3VuZEhhc2ggPSBjdXJyZW50QmFja2dyb3VuZC5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtaGFzaCcgKTtcblx0XHRcdGlmKCBjdXJyZW50QmFja2dyb3VuZEhhc2ggJiYgY3VycmVudEJhY2tncm91bmRIYXNoID09PSBwcmV2aW91c0JhY2tncm91bmRIYXNoICYmIGN1cnJlbnRCYWNrZ3JvdW5kICE9PSBwcmV2aW91c0JhY2tncm91bmQgKSB7XG5cdFx0XHRcdGRvbS5iYWNrZ3JvdW5kLmNsYXNzTGlzdC5hZGQoICduby10cmFuc2l0aW9uJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRwcmV2aW91c0JhY2tncm91bmQgPSBjdXJyZW50QmFja2dyb3VuZDtcblxuXHRcdH1cblxuXHRcdC8vIElmIHRoZXJlJ3MgYSBiYWNrZ3JvdW5kIGJyaWdodG5lc3MgZmxhZyBmb3IgdGhpcyBzbGlkZSxcblx0XHQvLyBidWJibGUgaXQgdG8gdGhlIC5yZXZlYWwgY29udGFpbmVyXG5cdFx0aWYoIGN1cnJlbnRTbGlkZSApIHtcblx0XHRcdFsgJ2hhcy1saWdodC1iYWNrZ3JvdW5kJywgJ2hhcy1kYXJrLWJhY2tncm91bmQnIF0uZm9yRWFjaCggZnVuY3Rpb24oIGNsYXNzVG9CdWJibGUgKSB7XG5cdFx0XHRcdGlmKCBjdXJyZW50U2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCBjbGFzc1RvQnViYmxlICkgKSB7XG5cdFx0XHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggY2xhc3NUb0J1YmJsZSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoIGNsYXNzVG9CdWJibGUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdC8vIEFsbG93IHRoZSBmaXJzdCBiYWNrZ3JvdW5kIHRvIGFwcGx5IHdpdGhvdXQgdHJhbnNpdGlvblxuXHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZG9tLmJhY2tncm91bmQuY2xhc3NMaXN0LnJlbW92ZSggJ25vLXRyYW5zaXRpb24nICk7XG5cdFx0fSwgMSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgcG9zaXRpb24gb2YgdGhlIHBhcmFsbGF4IGJhY2tncm91bmQgYmFzZWRcblx0ICogb24gdGhlIGN1cnJlbnQgc2xpZGUgaW5kZXguXG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVQYXJhbGxheCgpIHtcblxuXHRcdGlmKCBjb25maWcucGFyYWxsYXhCYWNrZ3JvdW5kSW1hZ2UgKSB7XG5cblx0XHRcdHZhciBob3Jpem9udGFsU2xpZGVzID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSxcblx0XHRcdFx0dmVydGljYWxTbGlkZXMgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBWRVJUSUNBTF9TTElERVNfU0VMRUNUT1IgKTtcblxuXHRcdFx0dmFyIGJhY2tncm91bmRTaXplID0gZG9tLmJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZFNpemUuc3BsaXQoICcgJyApLFxuXHRcdFx0XHRiYWNrZ3JvdW5kV2lkdGgsIGJhY2tncm91bmRIZWlnaHQ7XG5cblx0XHRcdGlmKCBiYWNrZ3JvdW5kU2l6ZS5sZW5ndGggPT09IDEgKSB7XG5cdFx0XHRcdGJhY2tncm91bmRXaWR0aCA9IGJhY2tncm91bmRIZWlnaHQgPSBwYXJzZUludCggYmFja2dyb3VuZFNpemVbMF0sIDEwICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YmFja2dyb3VuZFdpZHRoID0gcGFyc2VJbnQoIGJhY2tncm91bmRTaXplWzBdLCAxMCApO1xuXHRcdFx0XHRiYWNrZ3JvdW5kSGVpZ2h0ID0gcGFyc2VJbnQoIGJhY2tncm91bmRTaXplWzFdLCAxMCApO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc2xpZGVXaWR0aCA9IGRvbS5iYWNrZ3JvdW5kLm9mZnNldFdpZHRoLFxuXHRcdFx0XHRob3Jpem9udGFsU2xpZGVDb3VudCA9IGhvcml6b250YWxTbGlkZXMubGVuZ3RoLFxuXHRcdFx0XHRob3Jpem9udGFsT2Zmc2V0TXVsdGlwbGllcixcblx0XHRcdFx0aG9yaXpvbnRhbE9mZnNldDtcblxuXHRcdFx0aWYoIHR5cGVvZiBjb25maWcucGFyYWxsYXhCYWNrZ3JvdW5kSG9yaXpvbnRhbCA9PT0gJ251bWJlcicgKSB7XG5cdFx0XHRcdGhvcml6b250YWxPZmZzZXRNdWx0aXBsaWVyID0gY29uZmlnLnBhcmFsbGF4QmFja2dyb3VuZEhvcml6b250YWw7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aG9yaXpvbnRhbE9mZnNldE11bHRpcGxpZXIgPSBob3Jpem9udGFsU2xpZGVDb3VudCA+IDEgPyAoIGJhY2tncm91bmRXaWR0aCAtIHNsaWRlV2lkdGggKSAvICggaG9yaXpvbnRhbFNsaWRlQ291bnQtMSApIDogMDtcblx0XHRcdH1cblxuXHRcdFx0aG9yaXpvbnRhbE9mZnNldCA9IGhvcml6b250YWxPZmZzZXRNdWx0aXBsaWVyICogaW5kZXhoICogLTE7XG5cblx0XHRcdHZhciBzbGlkZUhlaWdodCA9IGRvbS5iYWNrZ3JvdW5kLm9mZnNldEhlaWdodCxcblx0XHRcdFx0dmVydGljYWxTbGlkZUNvdW50ID0gdmVydGljYWxTbGlkZXMubGVuZ3RoLFxuXHRcdFx0XHR2ZXJ0aWNhbE9mZnNldE11bHRpcGxpZXIsXG5cdFx0XHRcdHZlcnRpY2FsT2Zmc2V0O1xuXG5cdFx0XHRpZiggdHlwZW9mIGNvbmZpZy5wYXJhbGxheEJhY2tncm91bmRWZXJ0aWNhbCA9PT0gJ251bWJlcicgKSB7XG5cdFx0XHRcdHZlcnRpY2FsT2Zmc2V0TXVsdGlwbGllciA9IGNvbmZpZy5wYXJhbGxheEJhY2tncm91bmRWZXJ0aWNhbDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR2ZXJ0aWNhbE9mZnNldE11bHRpcGxpZXIgPSAoIGJhY2tncm91bmRIZWlnaHQgLSBzbGlkZUhlaWdodCApIC8gKCB2ZXJ0aWNhbFNsaWRlQ291bnQtMSApO1xuXHRcdFx0fVxuXG5cdFx0XHR2ZXJ0aWNhbE9mZnNldCA9IHZlcnRpY2FsU2xpZGVDb3VudCA+IDAgPyAgdmVydGljYWxPZmZzZXRNdWx0aXBsaWVyICogaW5kZXh2ICogMSA6IDA7XG5cblx0XHRcdGRvbS5iYWNrZ3JvdW5kLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IGhvcml6b250YWxPZmZzZXQgKyAncHggJyArIC12ZXJ0aWNhbE9mZnNldCArICdweCc7XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDYWxsZWQgd2hlbiB0aGUgZ2l2ZW4gc2xpZGUgaXMgd2l0aGluIHRoZSBjb25maWd1cmVkIHZpZXdcblx0ICogZGlzdGFuY2UuIFNob3dzIHRoZSBzbGlkZSBlbGVtZW50IGFuZCBsb2FkcyBhbnkgY29udGVudFxuXHQgKiB0aGF0IGlzIHNldCB0byBsb2FkIGxhemlseSAoZGF0YS1zcmMpLlxuXHQgKi9cblx0ZnVuY3Rpb24gc2hvd1NsaWRlKCBzbGlkZSApIHtcblxuXHRcdC8vIFNob3cgdGhlIHNsaWRlIGVsZW1lbnRcblx0XHRzbGlkZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuXHRcdC8vIE1lZGlhIGVsZW1lbnRzIHdpdGggZGF0YS1zcmMgYXR0cmlidXRlc1xuXHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdpbWdbZGF0YS1zcmNdLCB2aWRlb1tkYXRhLXNyY10sIGF1ZGlvW2RhdGEtc3JjXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdzcmMnLCBlbGVtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApICk7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApO1xuXHRcdH0gKTtcblxuXHRcdC8vIE1lZGlhIGVsZW1lbnRzIHdpdGggPHNvdXJjZT4gY2hpbGRyZW5cblx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAndmlkZW8sIGF1ZGlvJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIG1lZGlhICkge1xuXHRcdFx0dmFyIHNvdXJjZXMgPSAwO1xuXG5cdFx0XHR0b0FycmF5KCBtZWRpYS5xdWVyeVNlbGVjdG9yQWxsKCAnc291cmNlW2RhdGEtc3JjXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBzb3VyY2UgKSB7XG5cdFx0XHRcdHNvdXJjZS5zZXRBdHRyaWJ1dGUoICdzcmMnLCBzb3VyY2UuZ2V0QXR0cmlidXRlKCAnZGF0YS1zcmMnICkgKTtcblx0XHRcdFx0c291cmNlLnJlbW92ZUF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApO1xuXHRcdFx0XHRzb3VyY2VzICs9IDE7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIElmIHdlIHJld3JvdGUgc291cmNlcyBmb3IgdGhpcyB2aWRlby9hdWRpbyBlbGVtZW50LCB3ZSBuZWVkXG5cdFx0XHQvLyB0byBtYW51YWxseSB0ZWxsIGl0IHRvIGxvYWQgZnJvbSBpdHMgbmV3IG9yaWdpblxuXHRcdFx0aWYoIHNvdXJjZXMgPiAwICkge1xuXHRcdFx0XHRtZWRpYS5sb2FkKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cblx0XHQvLyBTaG93IHRoZSBjb3JyZXNwb25kaW5nIGJhY2tncm91bmQgZWxlbWVudFxuXHRcdHZhciBpbmRpY2VzID0gZ2V0SW5kaWNlcyggc2xpZGUgKTtcblx0XHR2YXIgYmFja2dyb3VuZCA9IGdldFNsaWRlQmFja2dyb3VuZCggaW5kaWNlcy5oLCBpbmRpY2VzLnYgKTtcblx0XHRpZiggYmFja2dyb3VuZCApIHtcblx0XHRcdGJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cblx0XHRcdC8vIElmIHRoZSBiYWNrZ3JvdW5kIGNvbnRhaW5zIG1lZGlhLCBsb2FkIGl0XG5cdFx0XHRpZiggYmFja2dyb3VuZC5oYXNBdHRyaWJ1dGUoICdkYXRhLWxvYWRlZCcgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdGJhY2tncm91bmQuc2V0QXR0cmlidXRlKCAnZGF0YS1sb2FkZWQnLCAndHJ1ZScgKTtcblxuXHRcdFx0XHR2YXIgYmFja2dyb3VuZEltYWdlID0gc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWltYWdlJyApLFxuXHRcdFx0XHRcdGJhY2tncm91bmRWaWRlbyA9IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC12aWRlbycgKSxcblx0XHRcdFx0XHRiYWNrZ3JvdW5kVmlkZW9Mb29wID0gc2xpZGUuaGFzQXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLXZpZGVvLWxvb3AnICksXG5cdFx0XHRcdFx0YmFja2dyb3VuZFZpZGVvTXV0ZWQgPSBzbGlkZS5oYXNBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtdmlkZW8tbXV0ZWQnICksXG5cdFx0XHRcdFx0YmFja2dyb3VuZElmcmFtZSA9IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1pZnJhbWUnICk7XG5cblx0XHRcdFx0Ly8gSW1hZ2VzXG5cdFx0XHRcdGlmKCBiYWNrZ3JvdW5kSW1hZ2UgKSB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcrIGJhY2tncm91bmRJbWFnZSArJyknO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIFZpZGVvc1xuXHRcdFx0XHRlbHNlIGlmICggYmFja2dyb3VuZFZpZGVvICYmICFpc1NwZWFrZXJOb3RlcygpICkge1xuXHRcdFx0XHRcdHZhciB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICd2aWRlbycgKTtcblxuXHRcdFx0XHRcdGlmKCBiYWNrZ3JvdW5kVmlkZW9Mb29wICkge1xuXHRcdFx0XHRcdFx0dmlkZW8uc2V0QXR0cmlidXRlKCAnbG9vcCcsICcnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYoIGJhY2tncm91bmRWaWRlb011dGVkICkge1xuXHRcdFx0XHRcdFx0dmlkZW8ubXV0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFN1cHBvcnQgY29tbWEgc2VwYXJhdGVkIGxpc3RzIG9mIHZpZGVvIHNvdXJjZXNcblx0XHRcdFx0XHRiYWNrZ3JvdW5kVmlkZW8uc3BsaXQoICcsJyApLmZvckVhY2goIGZ1bmN0aW9uKCBzb3VyY2UgKSB7XG5cdFx0XHRcdFx0XHR2aWRlby5pbm5lckhUTUwgKz0gJzxzb3VyY2Ugc3JjPVwiJysgc291cmNlICsnXCI+Jztcblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHRiYWNrZ3JvdW5kLmFwcGVuZENoaWxkKCB2aWRlbyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIElmcmFtZXNcblx0XHRcdFx0ZWxzZSBpZiggYmFja2dyb3VuZElmcmFtZSApIHtcblx0XHRcdFx0XHR2YXIgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lmcmFtZScgKTtcblx0XHRcdFx0XHRcdGlmcmFtZS5zZXRBdHRyaWJ1dGUoICdzcmMnLCBiYWNrZ3JvdW5kSWZyYW1lICk7XG5cdFx0XHRcdFx0XHRpZnJhbWUuc3R5bGUud2lkdGggID0gJzEwMCUnO1xuXHRcdFx0XHRcdFx0aWZyYW1lLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcblx0XHRcdFx0XHRcdGlmcmFtZS5zdHlsZS5tYXhIZWlnaHQgPSAnMTAwJSc7XG5cdFx0XHRcdFx0XHRpZnJhbWUuc3R5bGUubWF4V2lkdGggPSAnMTAwJSc7XG5cblx0XHRcdFx0XHRiYWNrZ3JvdW5kLmFwcGVuZENoaWxkKCBpZnJhbWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENhbGxlZCB3aGVuIHRoZSBnaXZlbiBzbGlkZSBpcyBtb3ZlZCBvdXRzaWRlIG9mIHRoZVxuXHQgKiBjb25maWd1cmVkIHZpZXcgZGlzdGFuY2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBoaWRlU2xpZGUoIHNsaWRlICkge1xuXG5cdFx0Ly8gSGlkZSB0aGUgc2xpZGUgZWxlbWVudFxuXHRcdHNsaWRlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cblx0XHQvLyBIaWRlIHRoZSBjb3JyZXNwb25kaW5nIGJhY2tncm91bmQgZWxlbWVudFxuXHRcdHZhciBpbmRpY2VzID0gZ2V0SW5kaWNlcyggc2xpZGUgKTtcblx0XHR2YXIgYmFja2dyb3VuZCA9IGdldFNsaWRlQmFja2dyb3VuZCggaW5kaWNlcy5oLCBpbmRpY2VzLnYgKTtcblx0XHRpZiggYmFja2dyb3VuZCApIHtcblx0XHRcdGJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgd2hhdCBhdmFpbGFibGUgcm91dGVzIHRoZXJlIGFyZSBmb3IgbmF2aWdhdGlvbi5cblx0ICpcblx0ICogQHJldHVybiB7T2JqZWN0fSBjb250YWluaW5nIGZvdXIgYm9vbGVhbnM6IGxlZnQvcmlnaHQvdXAvZG93blxuXHQgKi9cblx0ZnVuY3Rpb24gYXZhaWxhYmxlUm91dGVzKCkge1xuXG5cdFx0dmFyIGhvcml6b250YWxTbGlkZXMgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApLFxuXHRcdFx0dmVydGljYWxTbGlkZXMgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBWRVJUSUNBTF9TTElERVNfU0VMRUNUT1IgKTtcblxuXHRcdHZhciByb3V0ZXMgPSB7XG5cdFx0XHRsZWZ0OiBpbmRleGggPiAwIHx8IGNvbmZpZy5sb29wLFxuXHRcdFx0cmlnaHQ6IGluZGV4aCA8IGhvcml6b250YWxTbGlkZXMubGVuZ3RoIC0gMSB8fCBjb25maWcubG9vcCxcblx0XHRcdHVwOiBpbmRleHYgPiAwLFxuXHRcdFx0ZG93bjogaW5kZXh2IDwgdmVydGljYWxTbGlkZXMubGVuZ3RoIC0gMVxuXHRcdH07XG5cblx0XHQvLyByZXZlcnNlIGhvcml6b250YWwgY29udHJvbHMgZm9yIHJ0bFxuXHRcdGlmKCBjb25maWcucnRsICkge1xuXHRcdFx0dmFyIGxlZnQgPSByb3V0ZXMubGVmdDtcblx0XHRcdHJvdXRlcy5sZWZ0ID0gcm91dGVzLnJpZ2h0O1xuXHRcdFx0cm91dGVzLnJpZ2h0ID0gbGVmdDtcblx0XHR9XG5cblx0XHRyZXR1cm4gcm91dGVzO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhbiBvYmplY3QgZGVzY3JpYmluZyB0aGUgYXZhaWxhYmxlIGZyYWdtZW50XG5cdCAqIGRpcmVjdGlvbnMuXG5cdCAqXG5cdCAqIEByZXR1cm4ge09iamVjdH0gdHdvIGJvb2xlYW4gcHJvcGVydGllczogcHJldi9uZXh0XG5cdCAqL1xuXHRmdW5jdGlvbiBhdmFpbGFibGVGcmFnbWVudHMoKSB7XG5cblx0XHRpZiggY3VycmVudFNsaWRlICYmIGNvbmZpZy5mcmFnbWVudHMgKSB7XG5cdFx0XHR2YXIgZnJhZ21lbnRzID0gY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQnICk7XG5cdFx0XHR2YXIgaGlkZGVuRnJhZ21lbnRzID0gY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQ6bm90KC52aXNpYmxlKScgKTtcblxuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cHJldjogZnJhZ21lbnRzLmxlbmd0aCAtIGhpZGRlbkZyYWdtZW50cy5sZW5ndGggPiAwLFxuXHRcdFx0XHRuZXh0OiAhIWhpZGRlbkZyYWdtZW50cy5sZW5ndGhcblx0XHRcdH07XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmV0dXJuIHsgcHJldjogZmFsc2UsIG5leHQ6IGZhbHNlIH07XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogRW5mb3JjZXMgb3JpZ2luLXNwZWNpZmljIGZvcm1hdCBydWxlcyBmb3IgZW1iZWRkZWQgbWVkaWEuXG5cdCAqL1xuXHRmdW5jdGlvbiBmb3JtYXRFbWJlZGRlZENvbnRlbnQoKSB7XG5cblx0XHR2YXIgX2FwcGVuZFBhcmFtVG9JZnJhbWVTb3VyY2UgPSBmdW5jdGlvbiggc291cmNlQXR0cmlidXRlLCBzb3VyY2VVUkwsIHBhcmFtICkge1xuXHRcdFx0dG9BcnJheSggZG9tLnNsaWRlcy5xdWVyeVNlbGVjdG9yQWxsKCAnaWZyYW1lWycrIHNvdXJjZUF0dHJpYnV0ZSArJyo9XCInKyBzb3VyY2VVUkwgKydcIl0nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdHZhciBzcmMgPSBlbC5nZXRBdHRyaWJ1dGUoIHNvdXJjZUF0dHJpYnV0ZSApO1xuXHRcdFx0XHRpZiggc3JjICYmIHNyYy5pbmRleE9mKCBwYXJhbSApID09PSAtMSApIHtcblx0XHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoIHNvdXJjZUF0dHJpYnV0ZSwgc3JjICsgKCAhL1xcPy8udGVzdCggc3JjICkgPyAnPycgOiAnJicgKSArIHBhcmFtICk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH07XG5cblx0XHQvLyBZb3VUdWJlIGZyYW1lcyBtdXN0IGluY2x1ZGUgXCI/ZW5hYmxlanNhcGk9MVwiXG5cdFx0X2FwcGVuZFBhcmFtVG9JZnJhbWVTb3VyY2UoICdzcmMnLCAneW91dHViZS5jb20vZW1iZWQvJywgJ2VuYWJsZWpzYXBpPTEnICk7XG5cdFx0X2FwcGVuZFBhcmFtVG9JZnJhbWVTb3VyY2UoICdkYXRhLXNyYycsICd5b3V0dWJlLmNvbS9lbWJlZC8nLCAnZW5hYmxlanNhcGk9MScgKTtcblxuXHRcdC8vIFZpbWVvIGZyYW1lcyBtdXN0IGluY2x1ZGUgXCI/YXBpPTFcIlxuXHRcdF9hcHBlbmRQYXJhbVRvSWZyYW1lU291cmNlKCAnc3JjJywgJ3BsYXllci52aW1lby5jb20vJywgJ2FwaT0xJyApO1xuXHRcdF9hcHBlbmRQYXJhbVRvSWZyYW1lU291cmNlKCAnZGF0YS1zcmMnLCAncGxheWVyLnZpbWVvLmNvbS8nLCAnYXBpPTEnICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBTdGFydCBwbGF5YmFjayBvZiBhbnkgZW1iZWRkZWQgY29udGVudCBpbnNpZGUgb2Zcblx0ICogdGhlIHRhcmdldGVkIHNsaWRlLlxuXHQgKi9cblx0ZnVuY3Rpb24gc3RhcnRFbWJlZGRlZENvbnRlbnQoIHNsaWRlICkge1xuXG5cdFx0aWYoIHNsaWRlICYmICFpc1NwZWFrZXJOb3RlcygpICkge1xuXHRcdFx0Ly8gUmVzdGFydCBHSUZzXG5cdFx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnaW1nW3NyYyQ9XCIuZ2lmXCJdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHQvLyBTZXR0aW5nIHRoZSBzYW1lIHVuY2hhbmdlZCBzb3VyY2UgbGlrZSB0aGlzIHdhcyBjb25maXJtZWRcblx0XHRcdFx0Ly8gdG8gd29yayBpbiBDaHJvbWUsIEZGICYgU2FmYXJpXG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSggJ3NyYycsIGVsLmdldEF0dHJpYnV0ZSggJ3NyYycgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBIVE1MNSBtZWRpYSBlbGVtZW50c1xuXHRcdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3ZpZGVvLCBhdWRpbycgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0aWYoIGVsLmhhc0F0dHJpYnV0ZSggJ2RhdGEtYXV0b3BsYXknICkgJiYgdHlwZW9mIGVsLnBsYXkgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0ZWwucGxheSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIE5vcm1hbCBpZnJhbWVzXG5cdFx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnaWZyYW1lW3NyY10nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdHN0YXJ0RW1iZWRkZWRJZnJhbWUoIHsgdGFyZ2V0OiBlbCB9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIExhenkgbG9hZGluZyBpZnJhbWVzXG5cdFx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnaWZyYW1lW2RhdGEtc3JjXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0aWYoIGVsLmdldEF0dHJpYnV0ZSggJ3NyYycgKSAhPT0gZWwuZ2V0QXR0cmlidXRlKCAnZGF0YS1zcmMnICkgKSB7XG5cdFx0XHRcdFx0ZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBzdGFydEVtYmVkZGVkSWZyYW1lICk7IC8vIHJlbW92ZSBmaXJzdCB0byBhdm9pZCBkdXBlc1xuXHRcdFx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgc3RhcnRFbWJlZGRlZElmcmFtZSApO1xuXHRcdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSggJ3NyYycsIGVsLmdldEF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBcIlN0YXJ0c1wiIHRoZSBjb250ZW50IG9mIGFuIGVtYmVkZGVkIGlmcmFtZSB1c2luZyB0aGVcblx0ICogcG9zdG1lc3NhZ2UgQVBJLlxuXHQgKi9cblx0ZnVuY3Rpb24gc3RhcnRFbWJlZGRlZElmcmFtZSggZXZlbnQgKSB7XG5cblx0XHR2YXIgaWZyYW1lID0gZXZlbnQudGFyZ2V0O1xuXG5cdFx0Ly8gWW91VHViZSBwb3N0TWVzc2FnZSBBUElcblx0XHRpZiggL3lvdXR1YmVcXC5jb21cXC9lbWJlZFxcLy8udGVzdCggaWZyYW1lLmdldEF0dHJpYnV0ZSggJ3NyYycgKSApICYmIGlmcmFtZS5oYXNBdHRyaWJ1dGUoICdkYXRhLWF1dG9wbGF5JyApICkge1xuXHRcdFx0aWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoICd7XCJldmVudFwiOlwiY29tbWFuZFwiLFwiZnVuY1wiOlwicGxheVZpZGVvXCIsXCJhcmdzXCI6XCJcIn0nLCAnKicgKTtcblx0XHR9XG5cdFx0Ly8gVmltZW8gcG9zdE1lc3NhZ2UgQVBJXG5cdFx0ZWxzZSBpZiggL3BsYXllclxcLnZpbWVvXFwuY29tXFwvLy50ZXN0KCBpZnJhbWUuZ2V0QXR0cmlidXRlKCAnc3JjJyApICkgJiYgaWZyYW1lLmhhc0F0dHJpYnV0ZSggJ2RhdGEtYXV0b3BsYXknICkgKSB7XG5cdFx0XHRpZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSggJ3tcIm1ldGhvZFwiOlwicGxheVwifScsICcqJyApO1xuXHRcdH1cblx0XHQvLyBHZW5lcmljIHBvc3RNZXNzYWdlIEFQSVxuXHRcdGVsc2Uge1xuXHRcdFx0aWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoICdzbGlkZTpzdGFydCcsICcqJyApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFN0b3AgcGxheWJhY2sgb2YgYW55IGVtYmVkZGVkIGNvbnRlbnQgaW5zaWRlIG9mXG5cdCAqIHRoZSB0YXJnZXRlZCBzbGlkZS5cblx0ICovXG5cdGZ1bmN0aW9uIHN0b3BFbWJlZGRlZENvbnRlbnQoIHNsaWRlICkge1xuXG5cdFx0aWYoIHNsaWRlICYmIHNsaWRlLnBhcmVudE5vZGUgKSB7XG5cdFx0XHQvLyBIVE1MNSBtZWRpYSBlbGVtZW50c1xuXHRcdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3ZpZGVvLCBhdWRpbycgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0aWYoICFlbC5oYXNBdHRyaWJ1dGUoICdkYXRhLWlnbm9yZScgKSAmJiB0eXBlb2YgZWwucGF1c2UgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0ZWwucGF1c2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBHZW5lcmljIHBvc3RNZXNzYWdlIEFQSSBmb3Igbm9uLWxhenkgbG9hZGVkIGlmcmFtZXNcblx0XHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdpZnJhbWUnICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdGVsLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoICdzbGlkZTpzdG9wJywgJyonICk7XG5cdFx0XHRcdGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdsb2FkJywgc3RhcnRFbWJlZGRlZElmcmFtZSApO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIFlvdVR1YmUgcG9zdE1lc3NhZ2UgQVBJXG5cdFx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnaWZyYW1lW3NyYyo9XCJ5b3V0dWJlLmNvbS9lbWJlZC9cIl0nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdGlmKCAhZWwuaGFzQXR0cmlidXRlKCAnZGF0YS1pZ25vcmUnICkgJiYgdHlwZW9mIGVsLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0ZWwuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSggJ3tcImV2ZW50XCI6XCJjb21tYW5kXCIsXCJmdW5jXCI6XCJwYXVzZVZpZGVvXCIsXCJhcmdzXCI6XCJcIn0nLCAnKicgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIFZpbWVvIHBvc3RNZXNzYWdlIEFQSVxuXHRcdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ2lmcmFtZVtzcmMqPVwicGxheWVyLnZpbWVvLmNvbS9cIl0nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdGlmKCAhZWwuaGFzQXR0cmlidXRlKCAnZGF0YS1pZ25vcmUnICkgJiYgdHlwZW9mIGVsLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0ZWwuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSggJ3tcIm1ldGhvZFwiOlwicGF1c2VcIn0nLCAnKicgKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vIExhenkgbG9hZGluZyBpZnJhbWVzXG5cdFx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnaWZyYW1lW2RhdGEtc3JjXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0Ly8gT25seSByZW1vdmluZyB0aGUgc3JjIGRvZXNuJ3QgYWN0dWFsbHkgdW5sb2FkIHRoZSBmcmFtZVxuXHRcdFx0XHQvLyBpbiBhbGwgYnJvd3NlcnMgKEZpcmVmb3gpIHNvIHdlIHNldCBpdCB0byBibGFuayBmaXJzdFxuXHRcdFx0XHRlbC5zZXRBdHRyaWJ1dGUoICdzcmMnLCAnYWJvdXQ6YmxhbmsnICk7XG5cdFx0XHRcdGVsLnJlbW92ZUF0dHJpYnV0ZSggJ3NyYycgKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgcGFzdCBzbGlkZXMuIFRoaXMgY2FuIGJlIHVzZWQgYXMgYSBnbG9iYWxcblx0ICogZmxhdHRlbmVkIGluZGV4IGZvciBzbGlkZXMuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTbGlkZVBhc3RDb3VudCgpIHtcblxuXHRcdHZhciBob3Jpem9udGFsU2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApO1xuXG5cdFx0Ly8gVGhlIG51bWJlciBvZiBwYXN0IHNsaWRlc1xuXHRcdHZhciBwYXN0Q291bnQgPSAwO1xuXG5cdFx0Ly8gU3RlcCB0aHJvdWdoIGFsbCBzbGlkZXMgYW5kIGNvdW50IHRoZSBwYXN0IG9uZXNcblx0XHRtYWluTG9vcDogZm9yKCB2YXIgaSA9IDA7IGkgPCBob3Jpem9udGFsU2xpZGVzLmxlbmd0aDsgaSsrICkge1xuXG5cdFx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlID0gaG9yaXpvbnRhbFNsaWRlc1tpXTtcblx0XHRcdHZhciB2ZXJ0aWNhbFNsaWRlcyA9IHRvQXJyYXkoIGhvcml6b250YWxTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApO1xuXG5cdFx0XHRmb3IoIHZhciBqID0gMDsgaiA8IHZlcnRpY2FsU2xpZGVzLmxlbmd0aDsgaisrICkge1xuXG5cdFx0XHRcdC8vIFN0b3AgYXMgc29vbiBhcyB3ZSBhcnJpdmUgYXQgdGhlIHByZXNlbnRcblx0XHRcdFx0aWYoIHZlcnRpY2FsU2xpZGVzW2pdLmNsYXNzTGlzdC5jb250YWlucyggJ3ByZXNlbnQnICkgKSB7XG5cdFx0XHRcdFx0YnJlYWsgbWFpbkxvb3A7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwYXN0Q291bnQrKztcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdG9wIGFzIHNvb24gYXMgd2UgYXJyaXZlIGF0IHRoZSBwcmVzZW50XG5cdFx0XHRpZiggaG9yaXpvbnRhbFNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ3ByZXNlbnQnICkgKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBEb24ndCBjb3VudCB0aGUgd3JhcHBpbmcgc2VjdGlvbiBmb3IgdmVydGljYWwgc2xpZGVzXG5cdFx0XHRpZiggaG9yaXpvbnRhbFNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ3N0YWNrJyApID09PSBmYWxzZSApIHtcblx0XHRcdFx0cGFzdENvdW50Kys7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gcGFzdENvdW50O1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhIHZhbHVlIHJhbmdpbmcgZnJvbSAwLTEgdGhhdCByZXByZXNlbnRzXG5cdCAqIGhvdyBmYXIgaW50byB0aGUgcHJlc2VudGF0aW9uIHdlIGhhdmUgbmF2aWdhdGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0UHJvZ3Jlc3MoKSB7XG5cblx0XHQvLyBUaGUgbnVtYmVyIG9mIHBhc3QgYW5kIHRvdGFsIHNsaWRlc1xuXHRcdHZhciB0b3RhbENvdW50ID0gZ2V0VG90YWxTbGlkZXMoKTtcblx0XHR2YXIgcGFzdENvdW50ID0gZ2V0U2xpZGVQYXN0Q291bnQoKTtcblxuXHRcdGlmKCBjdXJyZW50U2xpZGUgKSB7XG5cblx0XHRcdHZhciBhbGxGcmFnbWVudHMgPSBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKTtcblxuXHRcdFx0Ly8gSWYgdGhlcmUgYXJlIGZyYWdtZW50cyBpbiB0aGUgY3VycmVudCBzbGlkZSB0aG9zZSBzaG91bGQgYmVcblx0XHRcdC8vIGFjY291bnRlZCBmb3IgaW4gdGhlIHByb2dyZXNzLlxuXHRcdFx0aWYoIGFsbEZyYWdtZW50cy5sZW5ndGggPiAwICkge1xuXHRcdFx0XHR2YXIgdmlzaWJsZUZyYWdtZW50cyA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50LnZpc2libGUnICk7XG5cblx0XHRcdFx0Ly8gVGhpcyB2YWx1ZSByZXByZXNlbnRzIGhvdyBiaWcgYSBwb3J0aW9uIG9mIHRoZSBzbGlkZSBwcm9ncmVzc1xuXHRcdFx0XHQvLyB0aGF0IGlzIG1hZGUgdXAgYnkgaXRzIGZyYWdtZW50cyAoMC0xKVxuXHRcdFx0XHR2YXIgZnJhZ21lbnRXZWlnaHQgPSAwLjk7XG5cblx0XHRcdFx0Ly8gQWRkIGZyYWdtZW50IHByb2dyZXNzIHRvIHRoZSBwYXN0IHNsaWRlIGNvdW50XG5cdFx0XHRcdHBhc3RDb3VudCArPSAoIHZpc2libGVGcmFnbWVudHMubGVuZ3RoIC8gYWxsRnJhZ21lbnRzLmxlbmd0aCApICogZnJhZ21lbnRXZWlnaHQ7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gcGFzdENvdW50IC8gKCB0b3RhbENvdW50IC0gMSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoaXMgcHJlc2VudGF0aW9uIGlzIHJ1bm5pbmcgaW5zaWRlIG9mIHRoZVxuXHQgKiBzcGVha2VyIG5vdGVzIHdpbmRvdy5cblx0ICovXG5cdGZ1bmN0aW9uIGlzU3BlYWtlck5vdGVzKCkge1xuXG5cdFx0cmV0dXJuICEhd2luZG93LmxvY2F0aW9uLnNlYXJjaC5tYXRjaCggL3JlY2VpdmVyL2dpICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZWFkcyB0aGUgY3VycmVudCBVUkwgKGhhc2gpIGFuZCBuYXZpZ2F0ZXMgYWNjb3JkaW5nbHkuXG5cdCAqL1xuXHRmdW5jdGlvbiByZWFkVVJMKCkge1xuXG5cdFx0dmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcblxuXHRcdC8vIEF0dGVtcHQgdG8gcGFyc2UgdGhlIGhhc2ggYXMgZWl0aGVyIGFuIGluZGV4IG9yIG5hbWVcblx0XHR2YXIgYml0cyA9IGhhc2guc2xpY2UoIDIgKS5zcGxpdCggJy8nICksXG5cdFx0XHRuYW1lID0gaGFzaC5yZXBsYWNlKCAvI3xcXC8vZ2ksICcnICk7XG5cblx0XHQvLyBJZiB0aGUgZmlyc3QgYml0IGlzIGludmFsaWQgYW5kIHRoZXJlIGlzIGEgbmFtZSB3ZSBjYW5cblx0XHQvLyBhc3N1bWUgdGhhdCB0aGlzIGlzIGEgbmFtZWQgbGlua1xuXHRcdGlmKCBpc05hTiggcGFyc2VJbnQoIGJpdHNbMF0sIDEwICkgKSAmJiBuYW1lLmxlbmd0aCApIHtcblx0XHRcdHZhciBlbGVtZW50O1xuXG5cdFx0XHQvLyBFbnN1cmUgdGhlIG5hbWVkIGxpbmsgaXMgYSB2YWxpZCBIVE1MIElEIGF0dHJpYnV0ZVxuXHRcdFx0aWYoIC9eW2EtekEtWl1bXFx3Oi4tXSokLy50ZXN0KCBuYW1lICkgKSB7XG5cdFx0XHRcdC8vIEZpbmQgdGhlIHNsaWRlIHdpdGggdGhlIHNwZWNpZmllZCBJRFxuXHRcdFx0XHRlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIG5hbWUgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIGVsZW1lbnQgKSB7XG5cdFx0XHRcdC8vIEZpbmQgdGhlIHBvc2l0aW9uIG9mIHRoZSBuYW1lZCBzbGlkZSBhbmQgbmF2aWdhdGUgdG8gaXRcblx0XHRcdFx0dmFyIGluZGljZXMgPSBSZXZlYWwuZ2V0SW5kaWNlcyggZWxlbWVudCApO1xuXHRcdFx0XHRzbGlkZSggaW5kaWNlcy5oLCBpbmRpY2VzLnYgKTtcblx0XHRcdH1cblx0XHRcdC8vIElmIHRoZSBzbGlkZSBkb2Vzbid0IGV4aXN0LCBuYXZpZ2F0ZSB0byB0aGUgY3VycmVudCBzbGlkZVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHNsaWRlKCBpbmRleGggfHwgMCwgaW5kZXh2IHx8IDAgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyBSZWFkIHRoZSBpbmRleCBjb21wb25lbnRzIG9mIHRoZSBoYXNoXG5cdFx0XHR2YXIgaCA9IHBhcnNlSW50KCBiaXRzWzBdLCAxMCApIHx8IDAsXG5cdFx0XHRcdHYgPSBwYXJzZUludCggYml0c1sxXSwgMTAgKSB8fCAwO1xuXG5cdFx0XHRpZiggaCAhPT0gaW5kZXhoIHx8IHYgIT09IGluZGV4diApIHtcblx0XHRcdFx0c2xpZGUoIGgsIHYgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBwYWdlIFVSTCAoaGFzaCkgdG8gcmVmbGVjdCB0aGUgY3VycmVudFxuXHQgKiBzdGF0ZS5cblx0ICpcblx0ICogQHBhcmFtIHtOdW1iZXJ9IGRlbGF5IFRoZSB0aW1lIGluIG1zIHRvIHdhaXQgYmVmb3JlXG5cdCAqIHdyaXRpbmcgdGhlIGhhc2hcblx0ICovXG5cdGZ1bmN0aW9uIHdyaXRlVVJMKCBkZWxheSApIHtcblxuXHRcdGlmKCBjb25maWcuaGlzdG9yeSApIHtcblxuXHRcdFx0Ly8gTWFrZSBzdXJlIHRoZXJlJ3MgbmV2ZXIgbW9yZSB0aGFuIG9uZSB0aW1lb3V0IHJ1bm5pbmdcblx0XHRcdGNsZWFyVGltZW91dCggd3JpdGVVUkxUaW1lb3V0ICk7XG5cblx0XHRcdC8vIElmIGEgZGVsYXkgaXMgc3BlY2lmaWVkLCB0aW1lb3V0IHRoaXMgY2FsbFxuXHRcdFx0aWYoIHR5cGVvZiBkZWxheSA9PT0gJ251bWJlcicgKSB7XG5cdFx0XHRcdHdyaXRlVVJMVGltZW91dCA9IHNldFRpbWVvdXQoIHdyaXRlVVJMLCBkZWxheSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggY3VycmVudFNsaWRlICkge1xuXHRcdFx0XHR2YXIgdXJsID0gJy8nO1xuXG5cdFx0XHRcdC8vIEF0dGVtcHQgdG8gY3JlYXRlIGEgbmFtZWQgbGluayBiYXNlZCBvbiB0aGUgc2xpZGUncyBJRFxuXHRcdFx0XHR2YXIgaWQgPSBjdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKCAnaWQnICk7XG5cdFx0XHRcdGlmKCBpZCApIHtcblx0XHRcdFx0XHRpZCA9IGlkLnJlcGxhY2UoIC9bXmEtekEtWjAtOVxcLVxcX1xcOlxcLl0vZywgJycgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIHRoZSBjdXJyZW50IHNsaWRlIGhhcyBhbiBJRCwgdXNlIHRoYXQgYXMgYSBuYW1lZCBsaW5rXG5cdFx0XHRcdGlmKCB0eXBlb2YgaWQgPT09ICdzdHJpbmcnICYmIGlkLmxlbmd0aCApIHtcblx0XHRcdFx0XHR1cmwgPSAnLycgKyBpZDtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBPdGhlcndpc2UgdXNlIHRoZSAvaC92IGluZGV4XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGlmKCBpbmRleGggPiAwIHx8IGluZGV4diA+IDAgKSB1cmwgKz0gaW5kZXhoO1xuXHRcdFx0XHRcdGlmKCBpbmRleHYgPiAwICkgdXJsICs9ICcvJyArIGluZGV4djtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gdXJsO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgaC92IGxvY2F0aW9uIG9mIHRoZSBjdXJyZW50LCBvciBzcGVjaWZpZWQsXG5cdCAqIHNsaWRlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzbGlkZSBJZiBzcGVjaWZpZWQsIHRoZSByZXR1cm5lZFxuXHQgKiBpbmRleCB3aWxsIGJlIGZvciB0aGlzIHNsaWRlIHJhdGhlciB0aGFuIHRoZSBjdXJyZW50bHlcblx0ICogYWN0aXZlIG9uZVxuXHQgKlxuXHQgKiBAcmV0dXJuIHtPYmplY3R9IHsgaDogPGludD4sIHY6IDxpbnQ+LCBmOiA8aW50PiB9XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRJbmRpY2VzKCBzbGlkZSApIHtcblxuXHRcdC8vIEJ5IGRlZmF1bHQsIHJldHVybiB0aGUgY3VycmVudCBpbmRpY2VzXG5cdFx0dmFyIGggPSBpbmRleGgsXG5cdFx0XHR2ID0gaW5kZXh2LFxuXHRcdFx0ZjtcblxuXHRcdC8vIElmIGEgc2xpZGUgaXMgc3BlY2lmaWVkLCByZXR1cm4gdGhlIGluZGljZXMgb2YgdGhhdCBzbGlkZVxuXHRcdGlmKCBzbGlkZSApIHtcblx0XHRcdHZhciBpc1ZlcnRpY2FsID0gaXNWZXJ0aWNhbFNsaWRlKCBzbGlkZSApO1xuXHRcdFx0dmFyIHNsaWRlaCA9IGlzVmVydGljYWwgPyBzbGlkZS5wYXJlbnROb2RlIDogc2xpZGU7XG5cblx0XHRcdC8vIFNlbGVjdCBhbGwgaG9yaXpvbnRhbCBzbGlkZXNcblx0XHRcdHZhciBob3Jpem9udGFsU2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApO1xuXG5cdFx0XHQvLyBOb3cgdGhhdCB3ZSBrbm93IHdoaWNoIHRoZSBob3Jpem9udGFsIHNsaWRlIGlzLCBnZXQgaXRzIGluZGV4XG5cdFx0XHRoID0gTWF0aC5tYXgoIGhvcml6b250YWxTbGlkZXMuaW5kZXhPZiggc2xpZGVoICksIDAgKTtcblxuXHRcdFx0Ly8gQXNzdW1lIHdlJ3JlIG5vdCB2ZXJ0aWNhbFxuXHRcdFx0diA9IHVuZGVmaW5lZDtcblxuXHRcdFx0Ly8gSWYgdGhpcyBpcyBhIHZlcnRpY2FsIHNsaWRlLCBncmFiIHRoZSB2ZXJ0aWNhbCBpbmRleFxuXHRcdFx0aWYoIGlzVmVydGljYWwgKSB7XG5cdFx0XHRcdHYgPSBNYXRoLm1heCggdG9BcnJheSggc2xpZGUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApLmluZGV4T2YoIHNsaWRlICksIDAgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiggIXNsaWRlICYmIGN1cnJlbnRTbGlkZSApIHtcblx0XHRcdHZhciBoYXNGcmFnbWVudHMgPSBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKS5sZW5ndGggPiAwO1xuXHRcdFx0aWYoIGhhc0ZyYWdtZW50cyApIHtcblx0XHRcdFx0dmFyIGN1cnJlbnRGcmFnbWVudCA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yKCAnLmN1cnJlbnQtZnJhZ21lbnQnICk7XG5cdFx0XHRcdGlmKCBjdXJyZW50RnJhZ21lbnQgJiYgY3VycmVudEZyYWdtZW50Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnICkgKSB7XG5cdFx0XHRcdFx0ZiA9IHBhcnNlSW50KCBjdXJyZW50RnJhZ21lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1mcmFnbWVudC1pbmRleCcgKSwgMTAgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRmID0gY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQudmlzaWJsZScgKS5sZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHsgaDogaCwgdjogdiwgZjogZiB9O1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSB0b3RhbCBudW1iZXIgb2Ygc2xpZGVzIGluIHRoaXMgcHJlc2VudGF0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0VG90YWxTbGlkZXMoKSB7XG5cblx0XHRyZXR1cm4gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICsgJzpub3QoLnN0YWNrKScgKS5sZW5ndGg7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBzbGlkZSBlbGVtZW50IG1hdGNoaW5nIHRoZSBzcGVjaWZpZWQgaW5kZXguXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTbGlkZSggeCwgeSApIHtcblxuXHRcdHZhciBob3Jpem9udGFsU2xpZGUgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApWyB4IF07XG5cdFx0dmFyIHZlcnRpY2FsU2xpZGVzID0gaG9yaXpvbnRhbFNsaWRlICYmIGhvcml6b250YWxTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKTtcblxuXHRcdGlmKCB2ZXJ0aWNhbFNsaWRlcyAmJiB2ZXJ0aWNhbFNsaWRlcy5sZW5ndGggJiYgdHlwZW9mIHkgPT09ICdudW1iZXInICkge1xuXHRcdFx0cmV0dXJuIHZlcnRpY2FsU2xpZGVzID8gdmVydGljYWxTbGlkZXNbIHkgXSA6IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gaG9yaXpvbnRhbFNsaWRlO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgYmFja2dyb3VuZCBlbGVtZW50IGZvciB0aGUgZ2l2ZW4gc2xpZGUuXG5cdCAqIEFsbCBzbGlkZXMsIGV2ZW4gdGhlIG9uZXMgd2l0aCBubyBiYWNrZ3JvdW5kIHByb3BlcnRpZXNcblx0ICogZGVmaW5lZCwgaGF2ZSBhIGJhY2tncm91bmQgZWxlbWVudCBzbyBhcyBsb25nIGFzIHRoZVxuXHQgKiBpbmRleCBpcyB2YWxpZCBhbiBlbGVtZW50IHdpbGwgYmUgcmV0dXJuZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTbGlkZUJhY2tncm91bmQoIHgsIHkgKSB7XG5cblx0XHQvLyBXaGVuIHByaW50aW5nIHRvIFBERiB0aGUgc2xpZGUgYmFja2dyb3VuZHMgYXJlIG5lc3RlZFxuXHRcdC8vIGluc2lkZSBvZiB0aGUgc2xpZGVzXG5cdFx0aWYoIGlzUHJpbnRpbmdQREYoKSApIHtcblx0XHRcdHZhciBzbGlkZSA9IGdldFNsaWRlKCB4LCB5ICk7XG5cdFx0XHRpZiggc2xpZGUgKSB7XG5cdFx0XHRcdHZhciBiYWNrZ3JvdW5kID0gc2xpZGUucXVlcnlTZWxlY3RvciggJy5zbGlkZS1iYWNrZ3JvdW5kJyApO1xuXHRcdFx0XHRpZiggYmFja2dyb3VuZCAmJiBiYWNrZ3JvdW5kLnBhcmVudE5vZGUgPT09IHNsaWRlICkge1xuXHRcdFx0XHRcdHJldHVybiBiYWNrZ3JvdW5kO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0dmFyIGhvcml6b250YWxCYWNrZ3JvdW5kID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggJy5iYWNrZ3JvdW5kcz4uc2xpZGUtYmFja2dyb3VuZCcgKVsgeCBdO1xuXHRcdHZhciB2ZXJ0aWNhbEJhY2tncm91bmRzID0gaG9yaXpvbnRhbEJhY2tncm91bmQgJiYgaG9yaXpvbnRhbEJhY2tncm91bmQucXVlcnlTZWxlY3RvckFsbCggJy5zbGlkZS1iYWNrZ3JvdW5kJyApO1xuXG5cdFx0aWYoIHZlcnRpY2FsQmFja2dyb3VuZHMgJiYgdmVydGljYWxCYWNrZ3JvdW5kcy5sZW5ndGggJiYgdHlwZW9mIHkgPT09ICdudW1iZXInICkge1xuXHRcdFx0cmV0dXJuIHZlcnRpY2FsQmFja2dyb3VuZHMgPyB2ZXJ0aWNhbEJhY2tncm91bmRzWyB5IF0gOiB1bmRlZmluZWQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhvcml6b250YWxCYWNrZ3JvdW5kO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBzcGVha2VyIG5vdGVzIGZyb20gYSBzbGlkZS4gTm90ZXMgY2FuIGJlXG5cdCAqIGRlZmluZWQgaW4gdHdvIHdheXM6XG5cdCAqIDEuIEFzIGEgZGF0YS1ub3RlcyBhdHRyaWJ1dGUgb24gdGhlIHNsaWRlIDxzZWN0aW9uPlxuXHQgKiAyLiBBcyBhbiA8YXNpZGUgY2xhc3M9XCJub3Rlc1wiPiBpbnNpZGUgb2YgdGhlIHNsaWRlXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTbGlkZU5vdGVzKCBzbGlkZSApIHtcblxuXHRcdC8vIERlZmF1bHQgdG8gdGhlIGN1cnJlbnQgc2xpZGVcblx0XHRzbGlkZSA9IHNsaWRlIHx8IGN1cnJlbnRTbGlkZTtcblxuXHRcdC8vIE5vdGVzIGNhbiBiZSBzcGVjaWZpZWQgdmlhIHRoZSBkYXRhLW5vdGVzIGF0dHJpYnV0ZS4uLlxuXHRcdGlmKCBzbGlkZS5oYXNBdHRyaWJ1dGUoICdkYXRhLW5vdGVzJyApICkge1xuXHRcdFx0cmV0dXJuIHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtbm90ZXMnICk7XG5cdFx0fVxuXG5cdFx0Ly8gLi4uIG9yIHVzaW5nIGFuIDxhc2lkZSBjbGFzcz1cIm5vdGVzXCI+IGVsZW1lbnRcblx0XHR2YXIgbm90ZXNFbGVtZW50ID0gc2xpZGUucXVlcnlTZWxlY3RvciggJ2FzaWRlLm5vdGVzJyApO1xuXHRcdGlmKCBub3Rlc0VsZW1lbnQgKSB7XG5cdFx0XHRyZXR1cm4gbm90ZXNFbGVtZW50LmlubmVySFRNTDtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgcHJlc2VudGF0aW9uIGFzXG5cdCAqIGFuIG9iamVjdC4gVGhpcyBzdGF0ZSBjYW4gdGhlbiBiZSByZXN0b3JlZCBhdCBhbnlcblx0ICogdGltZS5cblx0ICovXG5cdGZ1bmN0aW9uIGdldFN0YXRlKCkge1xuXG5cdFx0dmFyIGluZGljZXMgPSBnZXRJbmRpY2VzKCk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0aW5kZXhoOiBpbmRpY2VzLmgsXG5cdFx0XHRpbmRleHY6IGluZGljZXMudixcblx0XHRcdGluZGV4ZjogaW5kaWNlcy5mLFxuXHRcdFx0cGF1c2VkOiBpc1BhdXNlZCgpLFxuXHRcdFx0b3ZlcnZpZXc6IGlzT3ZlcnZpZXcoKVxuXHRcdH07XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXN0b3JlcyB0aGUgcHJlc2VudGF0aW9uIHRvIHRoZSBnaXZlbiBzdGF0ZS5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHN0YXRlIEFzIGdlbmVyYXRlZCBieSBnZXRTdGF0ZSgpXG5cdCAqL1xuXHRmdW5jdGlvbiBzZXRTdGF0ZSggc3RhdGUgKSB7XG5cblx0XHRpZiggdHlwZW9mIHN0YXRlID09PSAnb2JqZWN0JyApIHtcblx0XHRcdHNsaWRlKCBkZXNlcmlhbGl6ZSggc3RhdGUuaW5kZXhoICksIGRlc2VyaWFsaXplKCBzdGF0ZS5pbmRleHYgKSwgZGVzZXJpYWxpemUoIHN0YXRlLmluZGV4ZiApICk7XG5cblx0XHRcdHZhciBwYXVzZWRGbGFnID0gZGVzZXJpYWxpemUoIHN0YXRlLnBhdXNlZCApLFxuXHRcdFx0XHRvdmVydmlld0ZsYWcgPSBkZXNlcmlhbGl6ZSggc3RhdGUub3ZlcnZpZXcgKTtcblxuXHRcdFx0aWYoIHR5cGVvZiBwYXVzZWRGbGFnID09PSAnYm9vbGVhbicgJiYgcGF1c2VkRmxhZyAhPT0gaXNQYXVzZWQoKSApIHtcblx0XHRcdFx0dG9nZ2xlUGF1c2UoIHBhdXNlZEZsYWcgKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIHR5cGVvZiBvdmVydmlld0ZsYWcgPT09ICdib29sZWFuJyAmJiBvdmVydmlld0ZsYWcgIT09IGlzT3ZlcnZpZXcoKSApIHtcblx0XHRcdFx0dG9nZ2xlT3ZlcnZpZXcoIG92ZXJ2aWV3RmxhZyApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybiBhIHNvcnRlZCBmcmFnbWVudHMgbGlzdCwgb3JkZXJlZCBieSBhbiBpbmNyZWFzaW5nXG5cdCAqIFwiZGF0YS1mcmFnbWVudC1pbmRleFwiIGF0dHJpYnV0ZS5cblx0ICpcblx0ICogRnJhZ21lbnRzIHdpbGwgYmUgcmV2ZWFsZWQgaW4gdGhlIG9yZGVyIHRoYXQgdGhleSBhcmUgcmV0dXJuZWQgYnlcblx0ICogdGhpcyBmdW5jdGlvbiwgc28geW91IGNhbiB1c2UgdGhlIGluZGV4IGF0dHJpYnV0ZXMgdG8gY29udHJvbCB0aGVcblx0ICogb3JkZXIgb2YgZnJhZ21lbnQgYXBwZWFyYW5jZS5cblx0ICpcblx0ICogVG8gbWFpbnRhaW4gYSBzZW5zaWJsZSBkZWZhdWx0IGZyYWdtZW50IG9yZGVyLCBmcmFnbWVudHMgYXJlIHByZXN1bWVkXG5cdCAqIHRvIGJlIHBhc3NlZCBpbiBkb2N1bWVudCBvcmRlci4gVGhpcyBmdW5jdGlvbiBhZGRzIGEgXCJmcmFnbWVudC1pbmRleFwiXG5cdCAqIGF0dHJpYnV0ZSB0byBlYWNoIG5vZGUgaWYgc3VjaCBhbiBhdHRyaWJ1dGUgaXMgbm90IGFscmVhZHkgcHJlc2VudCxcblx0ICogYW5kIHNldHMgdGhhdCBhdHRyaWJ1dGUgdG8gYW4gaW50ZWdlciB2YWx1ZSB3aGljaCBpcyB0aGUgcG9zaXRpb24gb2Zcblx0ICogdGhlIGZyYWdtZW50IHdpdGhpbiB0aGUgZnJhZ21lbnRzIGxpc3QuXG5cdCAqL1xuXHRmdW5jdGlvbiBzb3J0RnJhZ21lbnRzKCBmcmFnbWVudHMgKSB7XG5cblx0XHRmcmFnbWVudHMgPSB0b0FycmF5KCBmcmFnbWVudHMgKTtcblxuXHRcdHZhciBvcmRlcmVkID0gW10sXG5cdFx0XHR1bm9yZGVyZWQgPSBbXSxcblx0XHRcdHNvcnRlZCA9IFtdO1xuXG5cdFx0Ly8gR3JvdXAgb3JkZXJlZCBhbmQgdW5vcmRlcmVkIGVsZW1lbnRzXG5cdFx0ZnJhZ21lbnRzLmZvckVhY2goIGZ1bmN0aW9uKCBmcmFnbWVudCwgaSApIHtcblx0XHRcdGlmKCBmcmFnbWVudC5oYXNBdHRyaWJ1dGUoICdkYXRhLWZyYWdtZW50LWluZGV4JyApICkge1xuXHRcdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggZnJhZ21lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1mcmFnbWVudC1pbmRleCcgKSwgMTAgKTtcblxuXHRcdFx0XHRpZiggIW9yZGVyZWRbaW5kZXhdICkge1xuXHRcdFx0XHRcdG9yZGVyZWRbaW5kZXhdID0gW107XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRvcmRlcmVkW2luZGV4XS5wdXNoKCBmcmFnbWVudCApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHVub3JkZXJlZC5wdXNoKCBbIGZyYWdtZW50IF0gKTtcblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBBcHBlbmQgZnJhZ21lbnRzIHdpdGhvdXQgZXhwbGljaXQgaW5kaWNlcyBpbiB0aGVpclxuXHRcdC8vIERPTSBvcmRlclxuXHRcdG9yZGVyZWQgPSBvcmRlcmVkLmNvbmNhdCggdW5vcmRlcmVkICk7XG5cblx0XHQvLyBNYW51YWxseSBjb3VudCB0aGUgaW5kZXggdXAgcGVyIGdyb3VwIHRvIGVuc3VyZSB0aGVyZVxuXHRcdC8vIGFyZSBubyBnYXBzXG5cdFx0dmFyIGluZGV4ID0gMDtcblxuXHRcdC8vIFB1c2ggYWxsIGZyYWdtZW50cyBpbiB0aGVpciBzb3J0ZWQgb3JkZXIgdG8gYW4gYXJyYXksXG5cdFx0Ly8gdGhpcyBmbGF0dGVucyB0aGUgZ3JvdXBzXG5cdFx0b3JkZXJlZC5mb3JFYWNoKCBmdW5jdGlvbiggZ3JvdXAgKSB7XG5cdFx0XHRncm91cC5mb3JFYWNoKCBmdW5jdGlvbiggZnJhZ21lbnQgKSB7XG5cdFx0XHRcdHNvcnRlZC5wdXNoKCBmcmFnbWVudCApO1xuXHRcdFx0XHRmcmFnbWVudC5zZXRBdHRyaWJ1dGUoICdkYXRhLWZyYWdtZW50LWluZGV4JywgaW5kZXggKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0aW5kZXggKys7XG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIHNvcnRlZDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlIHRvIHRoZSBzcGVjaWZpZWQgc2xpZGUgZnJhZ21lbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIGZyYWdtZW50IHRoYXRcblx0ICogc2hvdWxkIGJlIHNob3duLCAtMSBtZWFucyBhbGwgYXJlIGludmlzaWJsZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IEludGVnZXIgb2Zmc2V0IHRvIGFwcGx5IHRvIHRoZVxuXHQgKiBmcmFnbWVudCBpbmRleFxuXHQgKlxuXHQgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGEgY2hhbmdlIHdhcyBtYWRlIGluIGFueVxuXHQgKiBmcmFnbWVudHMgdmlzaWJpbGl0eSBhcyBwYXJ0IG9mIHRoaXMgY2FsbFxuXHQgKi9cblx0ZnVuY3Rpb24gbmF2aWdhdGVGcmFnbWVudCggaW5kZXgsIG9mZnNldCApIHtcblxuXHRcdGlmKCBjdXJyZW50U2xpZGUgJiYgY29uZmlnLmZyYWdtZW50cyApIHtcblxuXHRcdFx0dmFyIGZyYWdtZW50cyA9IHNvcnRGcmFnbWVudHMoIGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApICk7XG5cdFx0XHRpZiggZnJhZ21lbnRzLmxlbmd0aCApIHtcblxuXHRcdFx0XHQvLyBJZiBubyBpbmRleCBpcyBzcGVjaWZpZWQsIGZpbmQgdGhlIGN1cnJlbnRcblx0XHRcdFx0aWYoIHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicgKSB7XG5cdFx0XHRcdFx0dmFyIGxhc3RWaXNpYmxlRnJhZ21lbnQgPSBzb3J0RnJhZ21lbnRzKCBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudC52aXNpYmxlJyApICkucG9wKCk7XG5cblx0XHRcdFx0XHRpZiggbGFzdFZpc2libGVGcmFnbWVudCApIHtcblx0XHRcdFx0XHRcdGluZGV4ID0gcGFyc2VJbnQoIGxhc3RWaXNpYmxlRnJhZ21lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1mcmFnbWVudC1pbmRleCcgKSB8fCAwLCAxMCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGluZGV4ID0gLTE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgYW4gb2Zmc2V0IGlzIHNwZWNpZmllZCwgYXBwbHkgaXQgdG8gdGhlIGluZGV4XG5cdFx0XHRcdGlmKCB0eXBlb2Ygb2Zmc2V0ID09PSAnbnVtYmVyJyApIHtcblx0XHRcdFx0XHRpbmRleCArPSBvZmZzZXQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgZnJhZ21lbnRzU2hvd24gPSBbXSxcblx0XHRcdFx0XHRmcmFnbWVudHNIaWRkZW4gPSBbXTtcblxuXHRcdFx0XHR0b0FycmF5KCBmcmFnbWVudHMgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCwgaSApIHtcblxuXHRcdFx0XHRcdGlmKCBlbGVtZW50Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnICkgKSB7XG5cdFx0XHRcdFx0XHRpID0gcGFyc2VJbnQoIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1mcmFnbWVudC1pbmRleCcgKSwgMTAgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBWaXNpYmxlIGZyYWdtZW50c1xuXHRcdFx0XHRcdGlmKCBpIDw9IGluZGV4ICkge1xuXHRcdFx0XHRcdFx0aWYoICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyggJ3Zpc2libGUnICkgKSBmcmFnbWVudHNTaG93bi5wdXNoKCBlbGVtZW50ICk7XG5cdFx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xuXHRcdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnY3VycmVudC1mcmFnbWVudCcgKTtcblxuXHRcdFx0XHRcdFx0Ly8gQW5ub3VuY2UgdGhlIGZyYWdtZW50cyBvbmUgYnkgb25lIHRvIHRoZSBTY3JlZW4gUmVhZGVyXG5cdFx0XHRcdFx0XHRkb20uc3RhdHVzRGl2LnRleHRDb250ZW50ID0gZWxlbWVudC50ZXh0Q29udGVudDtcblxuXHRcdFx0XHRcdFx0aWYoIGkgPT09IGluZGV4ICkge1xuXHRcdFx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoICdjdXJyZW50LWZyYWdtZW50JyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBIaWRkZW4gZnJhZ21lbnRzXG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRpZiggZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoICd2aXNpYmxlJyApICkgZnJhZ21lbnRzSGlkZGVuLnB1c2goIGVsZW1lbnQgKTtcblx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ3Zpc2libGUnICk7XG5cdFx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdjdXJyZW50LWZyYWdtZW50JyApO1xuXHRcdFx0XHRcdH1cblxuXG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRpZiggZnJhZ21lbnRzSGlkZGVuLmxlbmd0aCApIHtcblx0XHRcdFx0XHRkaXNwYXRjaEV2ZW50KCAnZnJhZ21lbnRoaWRkZW4nLCB7IGZyYWdtZW50OiBmcmFnbWVudHNIaWRkZW5bMF0sIGZyYWdtZW50czogZnJhZ21lbnRzSGlkZGVuIH0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCBmcmFnbWVudHNTaG93bi5sZW5ndGggKSB7XG5cdFx0XHRcdFx0ZGlzcGF0Y2hFdmVudCggJ2ZyYWdtZW50c2hvd24nLCB7IGZyYWdtZW50OiBmcmFnbWVudHNTaG93blswXSwgZnJhZ21lbnRzOiBmcmFnbWVudHNTaG93biB9ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR1cGRhdGVDb250cm9scygpO1xuXHRcdFx0XHR1cGRhdGVQcm9ncmVzcygpO1xuXG5cdFx0XHRcdHJldHVybiAhISggZnJhZ21lbnRzU2hvd24ubGVuZ3RoIHx8IGZyYWdtZW50c0hpZGRlbi5sZW5ndGggKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGUgdG8gdGhlIG5leHQgc2xpZGUgZnJhZ21lbnQuXG5cdCAqXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWUgaWYgdGhlcmUgd2FzIGEgbmV4dCBmcmFnbWVudCxcblx0ICogZmFsc2Ugb3RoZXJ3aXNlXG5cdCAqL1xuXHRmdW5jdGlvbiBuZXh0RnJhZ21lbnQoKSB7XG5cblx0XHRyZXR1cm4gbmF2aWdhdGVGcmFnbWVudCggbnVsbCwgMSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGUgdG8gdGhlIHByZXZpb3VzIHNsaWRlIGZyYWdtZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZXJlIHdhcyBhIHByZXZpb3VzIGZyYWdtZW50LFxuXHQgKiBmYWxzZSBvdGhlcndpc2Vcblx0ICovXG5cdGZ1bmN0aW9uIHByZXZpb3VzRnJhZ21lbnQoKSB7XG5cblx0XHRyZXR1cm4gbmF2aWdhdGVGcmFnbWVudCggbnVsbCwgLTEgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEN1ZXMgYSBuZXcgYXV0b21hdGVkIHNsaWRlIGlmIGVuYWJsZWQgaW4gdGhlIGNvbmZpZy5cblx0ICovXG5cdGZ1bmN0aW9uIGN1ZUF1dG9TbGlkZSgpIHtcblxuXHRcdGNhbmNlbEF1dG9TbGlkZSgpO1xuXG5cdFx0aWYoIGN1cnJlbnRTbGlkZSApIHtcblxuXHRcdFx0dmFyIGN1cnJlbnRGcmFnbWVudCA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yKCAnLmN1cnJlbnQtZnJhZ21lbnQnICk7XG5cblx0XHRcdHZhciBmcmFnbWVudEF1dG9TbGlkZSA9IGN1cnJlbnRGcmFnbWVudCA/IGN1cnJlbnRGcmFnbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLWF1dG9zbGlkZScgKSA6IG51bGw7XG5cdFx0XHR2YXIgcGFyZW50QXV0b1NsaWRlID0gY3VycmVudFNsaWRlLnBhcmVudE5vZGUgPyBjdXJyZW50U2xpZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWF1dG9zbGlkZScgKSA6IG51bGw7XG5cdFx0XHR2YXIgc2xpZGVBdXRvU2xpZGUgPSBjdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1hdXRvc2xpZGUnICk7XG5cblx0XHRcdC8vIFBpY2sgdmFsdWUgaW4gdGhlIGZvbGxvd2luZyBwcmlvcml0eSBvcmRlcjpcblx0XHRcdC8vIDEuIEN1cnJlbnQgZnJhZ21lbnQncyBkYXRhLWF1dG9zbGlkZVxuXHRcdFx0Ly8gMi4gQ3VycmVudCBzbGlkZSdzIGRhdGEtYXV0b3NsaWRlXG5cdFx0XHQvLyAzLiBQYXJlbnQgc2xpZGUncyBkYXRhLWF1dG9zbGlkZVxuXHRcdFx0Ly8gNC4gR2xvYmFsIGF1dG9TbGlkZSBzZXR0aW5nXG5cdFx0XHRpZiggZnJhZ21lbnRBdXRvU2xpZGUgKSB7XG5cdFx0XHRcdGF1dG9TbGlkZSA9IHBhcnNlSW50KCBmcmFnbWVudEF1dG9TbGlkZSwgMTAgKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoIHNsaWRlQXV0b1NsaWRlICkge1xuXHRcdFx0XHRhdXRvU2xpZGUgPSBwYXJzZUludCggc2xpZGVBdXRvU2xpZGUsIDEwICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCBwYXJlbnRBdXRvU2xpZGUgKSB7XG5cdFx0XHRcdGF1dG9TbGlkZSA9IHBhcnNlSW50KCBwYXJlbnRBdXRvU2xpZGUsIDEwICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YXV0b1NsaWRlID0gY29uZmlnLmF1dG9TbGlkZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgdGhlcmUgYXJlIG1lZGlhIGVsZW1lbnRzIHdpdGggZGF0YS1hdXRvcGxheSxcblx0XHRcdC8vIGF1dG9tYXRpY2FsbHkgc2V0IHRoZSBhdXRvU2xpZGUgZHVyYXRpb24gdG8gdGhlXG5cdFx0XHQvLyBsZW5ndGggb2YgdGhhdCBtZWRpYS4gTm90IGFwcGxpY2FibGUgaWYgdGhlIHNsaWRlXG5cdFx0XHQvLyBpcyBkaXZpZGVkIHVwIGludG8gZnJhZ21lbnRzLlxuXHRcdFx0aWYoIGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0dG9BcnJheSggY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICd2aWRlbywgYXVkaW8nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7XG5cdFx0XHRcdFx0aWYoIGVsLmhhc0F0dHJpYnV0ZSggJ2RhdGEtYXV0b3BsYXknICkgKSB7XG5cdFx0XHRcdFx0XHRpZiggYXV0b1NsaWRlICYmIGVsLmR1cmF0aW9uICogMTAwMCA+IGF1dG9TbGlkZSApIHtcblx0XHRcdFx0XHRcdFx0YXV0b1NsaWRlID0gKCBlbC5kdXJhdGlvbiAqIDEwMDAgKSArIDEwMDA7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEN1ZSB0aGUgbmV4dCBhdXRvLXNsaWRlIGlmOlxuXHRcdFx0Ly8gLSBUaGVyZSBpcyBhbiBhdXRvU2xpZGUgdmFsdWVcblx0XHRcdC8vIC0gQXV0by1zbGlkaW5nIGlzbid0IHBhdXNlZCBieSB0aGUgdXNlclxuXHRcdFx0Ly8gLSBUaGUgcHJlc2VudGF0aW9uIGlzbid0IHBhdXNlZFxuXHRcdFx0Ly8gLSBUaGUgb3ZlcnZpZXcgaXNuJ3QgYWN0aXZlXG5cdFx0XHQvLyAtIFRoZSBwcmVzZW50YXRpb24gaXNuJ3Qgb3ZlclxuXHRcdFx0aWYoIGF1dG9TbGlkZSAmJiAhYXV0b1NsaWRlUGF1c2VkICYmICFpc1BhdXNlZCgpICYmICFpc092ZXJ2aWV3KCkgJiYgKCAhUmV2ZWFsLmlzTGFzdFNsaWRlKCkgfHwgYXZhaWxhYmxlRnJhZ21lbnRzKCkubmV4dCB8fCBjb25maWcubG9vcCA9PT0gdHJ1ZSApICkge1xuXHRcdFx0XHRhdXRvU2xpZGVUaW1lb3V0ID0gc2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0dHlwZW9mIGNvbmZpZy5hdXRvU2xpZGVNZXRob2QgPT09ICdmdW5jdGlvbicgPyBjb25maWcuYXV0b1NsaWRlTWV0aG9kKCkgOiBuYXZpZ2F0ZU5leHQoKTtcblx0XHRcdFx0XHRjdWVBdXRvU2xpZGUoKTtcblx0XHRcdFx0fSwgYXV0b1NsaWRlICk7XG5cdFx0XHRcdGF1dG9TbGlkZVN0YXJ0VGltZSA9IERhdGUubm93KCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCBhdXRvU2xpZGVQbGF5ZXIgKSB7XG5cdFx0XHRcdGF1dG9TbGlkZVBsYXllci5zZXRQbGF5aW5nKCBhdXRvU2xpZGVUaW1lb3V0ICE9PSAtMSApO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2FuY2VscyBhbnkgb25nb2luZyByZXF1ZXN0IHRvIGF1dG8tc2xpZGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBjYW5jZWxBdXRvU2xpZGUoKSB7XG5cblx0XHRjbGVhclRpbWVvdXQoIGF1dG9TbGlkZVRpbWVvdXQgKTtcblx0XHRhdXRvU2xpZGVUaW1lb3V0ID0gLTE7XG5cblx0fVxuXG5cdGZ1bmN0aW9uIHBhdXNlQXV0b1NsaWRlKCkge1xuXG5cdFx0aWYoIGF1dG9TbGlkZSAmJiAhYXV0b1NsaWRlUGF1c2VkICkge1xuXHRcdFx0YXV0b1NsaWRlUGF1c2VkID0gdHJ1ZTtcblx0XHRcdGRpc3BhdGNoRXZlbnQoICdhdXRvc2xpZGVwYXVzZWQnICk7XG5cdFx0XHRjbGVhclRpbWVvdXQoIGF1dG9TbGlkZVRpbWVvdXQgKTtcblxuXHRcdFx0aWYoIGF1dG9TbGlkZVBsYXllciApIHtcblx0XHRcdFx0YXV0b1NsaWRlUGxheWVyLnNldFBsYXlpbmcoIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiByZXN1bWVBdXRvU2xpZGUoKSB7XG5cblx0XHRpZiggYXV0b1NsaWRlICYmIGF1dG9TbGlkZVBhdXNlZCApIHtcblx0XHRcdGF1dG9TbGlkZVBhdXNlZCA9IGZhbHNlO1xuXHRcdFx0ZGlzcGF0Y2hFdmVudCggJ2F1dG9zbGlkZXJlc3VtZWQnICk7XG5cdFx0XHRjdWVBdXRvU2xpZGUoKTtcblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG5hdmlnYXRlTGVmdCgpIHtcblxuXHRcdC8vIFJldmVyc2UgZm9yIFJUTFxuXHRcdGlmKCBjb25maWcucnRsICkge1xuXHRcdFx0aWYoICggaXNPdmVydmlldygpIHx8IG5leHRGcmFnbWVudCgpID09PSBmYWxzZSApICYmIGF2YWlsYWJsZVJvdXRlcygpLmxlZnQgKSB7XG5cdFx0XHRcdHNsaWRlKCBpbmRleGggKyAxICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIE5vcm1hbCBuYXZpZ2F0aW9uXG5cdFx0ZWxzZSBpZiggKCBpc092ZXJ2aWV3KCkgfHwgcHJldmlvdXNGcmFnbWVudCgpID09PSBmYWxzZSApICYmIGF2YWlsYWJsZVJvdXRlcygpLmxlZnQgKSB7XG5cdFx0XHRzbGlkZSggaW5kZXhoIC0gMSApO1xuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gbmF2aWdhdGVSaWdodCgpIHtcblxuXHRcdC8vIFJldmVyc2UgZm9yIFJUTFxuXHRcdGlmKCBjb25maWcucnRsICkge1xuXHRcdFx0aWYoICggaXNPdmVydmlldygpIHx8IHByZXZpb3VzRnJhZ21lbnQoKSA9PT0gZmFsc2UgKSAmJiBhdmFpbGFibGVSb3V0ZXMoKS5yaWdodCApIHtcblx0XHRcdFx0c2xpZGUoIGluZGV4aCAtIDEgKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gTm9ybWFsIG5hdmlnYXRpb25cblx0XHRlbHNlIGlmKCAoIGlzT3ZlcnZpZXcoKSB8fCBuZXh0RnJhZ21lbnQoKSA9PT0gZmFsc2UgKSAmJiBhdmFpbGFibGVSb3V0ZXMoKS5yaWdodCApIHtcblx0XHRcdHNsaWRlKCBpbmRleGggKyAxICk7XG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBuYXZpZ2F0ZVVwKCkge1xuXG5cdFx0Ly8gUHJpb3JpdGl6ZSBoaWRpbmcgZnJhZ21lbnRzXG5cdFx0aWYoICggaXNPdmVydmlldygpIHx8IHByZXZpb3VzRnJhZ21lbnQoKSA9PT0gZmFsc2UgKSAmJiBhdmFpbGFibGVSb3V0ZXMoKS51cCApIHtcblx0XHRcdHNsaWRlKCBpbmRleGgsIGluZGV4diAtIDEgKTtcblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG5hdmlnYXRlRG93bigpIHtcblxuXHRcdC8vIFByaW9yaXRpemUgcmV2ZWFsaW5nIGZyYWdtZW50c1xuXHRcdGlmKCAoIGlzT3ZlcnZpZXcoKSB8fCBuZXh0RnJhZ21lbnQoKSA9PT0gZmFsc2UgKSAmJiBhdmFpbGFibGVSb3V0ZXMoKS5kb3duICkge1xuXHRcdFx0c2xpZGUoIGluZGV4aCwgaW5kZXh2ICsgMSApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIE5hdmlnYXRlcyBiYWNrd2FyZHMsIHByaW9yaXRpemVkIGluIHRoZSBmb2xsb3dpbmcgb3JkZXI6XG5cdCAqIDEpIFByZXZpb3VzIGZyYWdtZW50XG5cdCAqIDIpIFByZXZpb3VzIHZlcnRpY2FsIHNsaWRlXG5cdCAqIDMpIFByZXZpb3VzIGhvcml6b250YWwgc2xpZGVcblx0ICovXG5cdGZ1bmN0aW9uIG5hdmlnYXRlUHJldigpIHtcblxuXHRcdC8vIFByaW9yaXRpemUgcmV2ZWFsaW5nIGZyYWdtZW50c1xuXHRcdGlmKCBwcmV2aW91c0ZyYWdtZW50KCkgPT09IGZhbHNlICkge1xuXHRcdFx0aWYoIGF2YWlsYWJsZVJvdXRlcygpLnVwICkge1xuXHRcdFx0XHRuYXZpZ2F0ZVVwKCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gRmV0Y2ggdGhlIHByZXZpb3VzIGhvcml6b250YWwgc2xpZGUsIGlmIHRoZXJlIGlzIG9uZVxuXHRcdFx0XHR2YXIgcHJldmlvdXNTbGlkZTtcblxuXHRcdFx0XHRpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdFx0XHRwcmV2aW91c1NsaWRlID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKyAnLmZ1dHVyZScgKSApLnBvcCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHByZXZpb3VzU2xpZGUgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiArICcucGFzdCcgKSApLnBvcCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoIHByZXZpb3VzU2xpZGUgKSB7XG5cdFx0XHRcdFx0dmFyIHYgPSAoIHByZXZpb3VzU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkubGVuZ3RoIC0gMSApIHx8IHVuZGVmaW5lZDtcblx0XHRcdFx0XHR2YXIgaCA9IGluZGV4aCAtIDE7XG5cdFx0XHRcdFx0c2xpZGUoIGgsIHYgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFRoZSByZXZlcnNlIG9mICNuYXZpZ2F0ZVByZXYoKS5cblx0ICovXG5cdGZ1bmN0aW9uIG5hdmlnYXRlTmV4dCgpIHtcblxuXHRcdC8vIFByaW9yaXRpemUgcmV2ZWFsaW5nIGZyYWdtZW50c1xuXHRcdGlmKCBuZXh0RnJhZ21lbnQoKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRpZiggYXZhaWxhYmxlUm91dGVzKCkuZG93biApIHtcblx0XHRcdFx0bmF2aWdhdGVEb3duKCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCBjb25maWcucnRsICkge1xuXHRcdFx0XHRuYXZpZ2F0ZUxlZnQoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRuYXZpZ2F0ZVJpZ2h0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSB0YXJnZXQgZWxlbWVudCBwcmV2ZW50cyB0aGUgdHJpZ2dlcmluZyBvZlxuXHQgKiBzd2lwZSBuYXZpZ2F0aW9uLlxuXHQgKi9cblx0ZnVuY3Rpb24gaXNTd2lwZVByZXZlbnRlZCggdGFyZ2V0ICkge1xuXG5cdFx0d2hpbGUoIHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0Lmhhc0F0dHJpYnV0ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdGlmKCB0YXJnZXQuaGFzQXR0cmlidXRlKCAnZGF0YS1wcmV2ZW50LXN3aXBlJyApICkgcmV0dXJuIHRydWU7XG5cdFx0XHR0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0fVxuXG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBFVkVOVFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuXHQvKipcblx0ICogQ2FsbGVkIGJ5IGFsbCBldmVudCBoYW5kbGVycyB0aGF0IGFyZSBiYXNlZCBvbiB1c2VyXG5cdCAqIGlucHV0LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25Vc2VySW5wdXQoIGV2ZW50ICkge1xuXG5cdFx0aWYoIGNvbmZpZy5hdXRvU2xpZGVTdG9wcGFibGUgKSB7XG5cdFx0XHRwYXVzZUF1dG9TbGlkZSgpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHRoZSBkb2N1bWVudCBsZXZlbCAna2V5cHJlc3MnIGV2ZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25Eb2N1bWVudEtleVByZXNzKCBldmVudCApIHtcblxuXHRcdC8vIENoZWNrIGlmIHRoZSBwcmVzc2VkIGtleSBpcyBxdWVzdGlvbiBtYXJrXG5cdFx0aWYoIGV2ZW50LnNoaWZ0S2V5ICYmIGV2ZW50LmNoYXJDb2RlID09PSA2MyApIHtcblx0XHRcdGlmKCBkb20ub3ZlcmxheSApIHtcblx0XHRcdFx0Y2xvc2VPdmVybGF5KCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2hvd0hlbHAoIHRydWUgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVyIGZvciB0aGUgZG9jdW1lbnQgbGV2ZWwgJ2tleWRvd24nIGV2ZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25Eb2N1bWVudEtleURvd24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gSWYgdGhlcmUncyBhIGNvbmRpdGlvbiBzcGVjaWZpZWQgYW5kIGl0IHJldHVybnMgZmFsc2UsXG5cdFx0Ly8gaWdub3JlIHRoaXMgZXZlbnRcblx0XHRpZiggdHlwZW9mIGNvbmZpZy5rZXlib2FyZENvbmRpdGlvbiA9PT0gJ2Z1bmN0aW9uJyAmJiBjb25maWcua2V5Ym9hcmRDb25kaXRpb24oKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBSZW1lbWJlciBpZiBhdXRvLXNsaWRpbmcgd2FzIHBhdXNlZCBzbyB3ZSBjYW4gdG9nZ2xlIGl0XG5cdFx0dmFyIGF1dG9TbGlkZVdhc1BhdXNlZCA9IGF1dG9TbGlkZVBhdXNlZDtcblxuXHRcdG9uVXNlcklucHV0KCBldmVudCApO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlcmUncyBhIGZvY3VzZWQgZWxlbWVudCB0aGF0IGNvdWxkIGJlIHVzaW5nXG5cdFx0Ly8gdGhlIGtleWJvYXJkXG5cdFx0dmFyIGFjdGl2ZUVsZW1lbnRJc0NFID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmNvbnRlbnRFZGl0YWJsZSAhPT0gJ2luaGVyaXQnO1xuXHRcdHZhciBhY3RpdmVFbGVtZW50SXNJbnB1dCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC50YWdOYW1lICYmIC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudGFnTmFtZSApO1xuXG5cdFx0Ly8gRGlzcmVnYXJkIHRoZSBldmVudCBpZiB0aGVyZSdzIGEgZm9jdXNlZCBlbGVtZW50IG9yIGFcblx0XHQvLyBrZXlib2FyZCBtb2RpZmllciBrZXkgaXMgcHJlc2VudFxuXHRcdGlmKCBhY3RpdmVFbGVtZW50SXNDRSB8fCBhY3RpdmVFbGVtZW50SXNJbnB1dCB8fCAoZXZlbnQuc2hpZnRLZXkgJiYgZXZlbnQua2V5Q29kZSAhPT0gMzIpIHx8IGV2ZW50LmFsdEtleSB8fCBldmVudC5jdHJsS2V5IHx8IGV2ZW50Lm1ldGFLZXkgKSByZXR1cm47XG5cblx0XHQvLyBXaGlsZSBwYXVzZWQgb25seSBhbGxvdyByZXN1bWUga2V5Ym9hcmQgZXZlbnRzOyAnYicsICcuJydcblx0XHR2YXIgcmVzdW1lS2V5Q29kZXMgPSBbNjYsMTkwLDE5MV07XG5cdFx0dmFyIGtleTtcblxuXHRcdC8vIEN1c3RvbSBrZXkgYmluZGluZ3MgZm9yIHRvZ2dsZVBhdXNlIHNob3VsZCBiZSBhYmxlIHRvIHJlc3VtZVxuXHRcdGlmKCB0eXBlb2YgY29uZmlnLmtleWJvYXJkID09PSAnb2JqZWN0JyApIHtcblx0XHRcdGZvcigga2V5IGluIGNvbmZpZy5rZXlib2FyZCApIHtcblx0XHRcdFx0aWYoIGNvbmZpZy5rZXlib2FyZFtrZXldID09PSAndG9nZ2xlUGF1c2UnICkge1xuXHRcdFx0XHRcdHJlc3VtZUtleUNvZGVzLnB1c2goIHBhcnNlSW50KCBrZXksIDEwICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKCBpc1BhdXNlZCgpICYmIHJlc3VtZUtleUNvZGVzLmluZGV4T2YoIGV2ZW50LmtleUNvZGUgKSA9PT0gLTEgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dmFyIHRyaWdnZXJlZCA9IGZhbHNlO1xuXG5cdFx0Ly8gMS4gVXNlciBkZWZpbmVkIGtleSBiaW5kaW5nc1xuXHRcdGlmKCB0eXBlb2YgY29uZmlnLmtleWJvYXJkID09PSAnb2JqZWN0JyApIHtcblxuXHRcdFx0Zm9yKCBrZXkgaW4gY29uZmlnLmtleWJvYXJkICkge1xuXG5cdFx0XHRcdC8vIENoZWNrIGlmIHRoaXMgYmluZGluZyBtYXRjaGVzIHRoZSBwcmVzc2VkIGtleVxuXHRcdFx0XHRpZiggcGFyc2VJbnQoIGtleSwgMTAgKSA9PT0gZXZlbnQua2V5Q29kZSApIHtcblxuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGNvbmZpZy5rZXlib2FyZFsga2V5IF07XG5cblx0XHRcdFx0XHQvLyBDYWxsYmFjayBmdW5jdGlvblxuXHRcdFx0XHRcdGlmKCB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZS5hcHBseSggbnVsbCwgWyBldmVudCBdICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIFN0cmluZyBzaG9ydGN1dHMgdG8gcmV2ZWFsLmpzIEFQSVxuXHRcdFx0XHRcdGVsc2UgaWYoIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIFJldmVhbFsgdmFsdWUgXSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRcdFJldmVhbFsgdmFsdWUgXS5jYWxsKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dHJpZ2dlcmVkID0gdHJ1ZTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIDIuIFN5c3RlbSBkZWZpbmVkIGtleSBiaW5kaW5nc1xuXHRcdGlmKCB0cmlnZ2VyZWQgPT09IGZhbHNlICkge1xuXG5cdFx0XHQvLyBBc3N1bWUgdHJ1ZSBhbmQgdHJ5IHRvIHByb3ZlIGZhbHNlXG5cdFx0XHR0cmlnZ2VyZWQgPSB0cnVlO1xuXG5cdFx0XHRzd2l0Y2goIGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHRcdC8vIHAsIHBhZ2UgdXBcblx0XHRcdFx0Y2FzZSA4MDogY2FzZSAzMzogbmF2aWdhdGVQcmV2KCk7IGJyZWFrO1xuXHRcdFx0XHQvLyBuLCBwYWdlIGRvd25cblx0XHRcdFx0Y2FzZSA3ODogY2FzZSAzNDogbmF2aWdhdGVOZXh0KCk7IGJyZWFrO1xuXHRcdFx0XHQvLyBoLCBsZWZ0XG5cdFx0XHRcdGNhc2UgNzI6IGNhc2UgMzc6IG5hdmlnYXRlTGVmdCgpOyBicmVhaztcblx0XHRcdFx0Ly8gbCwgcmlnaHRcblx0XHRcdFx0Y2FzZSA3NjogY2FzZSAzOTogbmF2aWdhdGVSaWdodCgpOyBicmVhaztcblx0XHRcdFx0Ly8gaywgdXBcblx0XHRcdFx0Y2FzZSA3NTogY2FzZSAzODogbmF2aWdhdGVVcCgpOyBicmVhaztcblx0XHRcdFx0Ly8gaiwgZG93blxuXHRcdFx0XHRjYXNlIDc0OiBjYXNlIDQwOiBuYXZpZ2F0ZURvd24oKTsgYnJlYWs7XG5cdFx0XHRcdC8vIGhvbWVcblx0XHRcdFx0Y2FzZSAzNjogc2xpZGUoIDAgKTsgYnJlYWs7XG5cdFx0XHRcdC8vIGVuZFxuXHRcdFx0XHRjYXNlIDM1OiBzbGlkZSggTnVtYmVyLk1BWF9WQUxVRSApOyBicmVhaztcblx0XHRcdFx0Ly8gc3BhY2Vcblx0XHRcdFx0Y2FzZSAzMjogaXNPdmVydmlldygpID8gZGVhY3RpdmF0ZU92ZXJ2aWV3KCkgOiBldmVudC5zaGlmdEtleSA/IG5hdmlnYXRlUHJldigpIDogbmF2aWdhdGVOZXh0KCk7IGJyZWFrO1xuXHRcdFx0XHQvLyByZXR1cm5cblx0XHRcdFx0Y2FzZSAxMzogaXNPdmVydmlldygpID8gZGVhY3RpdmF0ZU92ZXJ2aWV3KCkgOiB0cmlnZ2VyZWQgPSBmYWxzZTsgYnJlYWs7XG5cdFx0XHRcdC8vIHR3by1zcG90LCBzZW1pY29sb24sIGIsIHBlcmlvZCwgTG9naXRlY2ggcHJlc2VudGVyIHRvb2xzIFwiYmxhY2sgc2NyZWVuXCIgYnV0dG9uXG5cdFx0XHRcdGNhc2UgNTg6IGNhc2UgNTk6IGNhc2UgNjY6IGNhc2UgMTkwOiBjYXNlIDE5MTogdG9nZ2xlUGF1c2UoKTsgYnJlYWs7XG5cdFx0XHRcdC8vIGZcblx0XHRcdFx0Y2FzZSA3MDogZW50ZXJGdWxsc2NyZWVuKCk7IGJyZWFrO1xuXHRcdFx0XHQvLyBhXG5cdFx0XHRcdGNhc2UgNjU6IGlmICggY29uZmlnLmF1dG9TbGlkZVN0b3BwYWJsZSApIHRvZ2dsZUF1dG9TbGlkZSggYXV0b1NsaWRlV2FzUGF1c2VkICk7IGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRyaWdnZXJlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlIGlucHV0IHJlc3VsdGVkIGluIGEgdHJpZ2dlcmVkIGFjdGlvbiB3ZSBzaG91bGQgcHJldmVudFxuXHRcdC8vIHRoZSBicm93c2VycyBkZWZhdWx0IGJlaGF2aW9yXG5cdFx0aWYoIHRyaWdnZXJlZCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0ICYmIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHRcdC8vIEVTQyBvciBPIGtleVxuXHRcdGVsc2UgaWYgKCAoIGV2ZW50LmtleUNvZGUgPT09IDI3IHx8IGV2ZW50LmtleUNvZGUgPT09IDc5ICkgJiYgZmVhdHVyZXMudHJhbnNmb3JtczNkICkge1xuXHRcdFx0aWYoIGRvbS5vdmVybGF5ICkge1xuXHRcdFx0XHRjbG9zZU92ZXJsYXkoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0b2dnbGVPdmVydmlldygpO1xuXHRcdFx0fVxuXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCAmJiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHRcdC8vIElmIGF1dG8tc2xpZGluZyBpcyBlbmFibGVkIHdlIG5lZWQgdG8gY3VlIHVwXG5cdFx0Ly8gYW5vdGhlciB0aW1lb3V0XG5cdFx0Y3VlQXV0b1NsaWRlKCk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVyIGZvciB0aGUgJ3RvdWNoc3RhcnQnIGV2ZW50LCBlbmFibGVzIHN1cHBvcnQgZm9yXG5cdCAqIHN3aXBlIGFuZCBwaW5jaCBnZXN0dXJlcy5cblx0ICovXG5cdGZ1bmN0aW9uIG9uVG91Y2hTdGFydCggZXZlbnQgKSB7XG5cblx0XHRpZiggaXNTd2lwZVByZXZlbnRlZCggZXZlbnQudGFyZ2V0ICkgKSByZXR1cm4gdHJ1ZTtcblxuXHRcdHRvdWNoLnN0YXJ0WCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcblx0XHR0b3VjaC5zdGFydFkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFk7XG5cdFx0dG91Y2guc3RhcnRDb3VudCA9IGV2ZW50LnRvdWNoZXMubGVuZ3RoO1xuXG5cdFx0Ly8gSWYgdGhlcmUncyB0d28gdG91Y2hlcyB3ZSBuZWVkIHRvIG1lbW9yaXplIHRoZSBkaXN0YW5jZVxuXHRcdC8vIGJldHdlZW4gdGhvc2UgdHdvIHBvaW50cyB0byBkZXRlY3QgcGluY2hpbmdcblx0XHRpZiggZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgY29uZmlnLm92ZXJ2aWV3ICkge1xuXHRcdFx0dG91Y2guc3RhcnRTcGFuID0gZGlzdGFuY2VCZXR3ZWVuKCB7XG5cdFx0XHRcdHg6IGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WCxcblx0XHRcdFx0eTogZXZlbnQudG91Y2hlc1sxXS5jbGllbnRZXG5cdFx0XHR9LCB7XG5cdFx0XHRcdHg6IHRvdWNoLnN0YXJ0WCxcblx0XHRcdFx0eTogdG91Y2guc3RhcnRZXG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlciBmb3IgdGhlICd0b3VjaG1vdmUnIGV2ZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25Ub3VjaE1vdmUoIGV2ZW50ICkge1xuXG5cdFx0aWYoIGlzU3dpcGVQcmV2ZW50ZWQoIGV2ZW50LnRhcmdldCApICkgcmV0dXJuIHRydWU7XG5cblx0XHQvLyBFYWNoIHRvdWNoIHNob3VsZCBvbmx5IHRyaWdnZXIgb25lIGFjdGlvblxuXHRcdGlmKCAhdG91Y2guY2FwdHVyZWQgKSB7XG5cdFx0XHRvblVzZXJJbnB1dCggZXZlbnQgKTtcblxuXHRcdFx0dmFyIGN1cnJlbnRYID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuXHRcdFx0dmFyIGN1cnJlbnRZID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZO1xuXG5cdFx0XHQvLyBJZiB0aGUgdG91Y2ggc3RhcnRlZCB3aXRoIHR3byBwb2ludHMgYW5kIHN0aWxsIGhhc1xuXHRcdFx0Ly8gdHdvIGFjdGl2ZSB0b3VjaGVzOyB0ZXN0IGZvciB0aGUgcGluY2ggZ2VzdHVyZVxuXHRcdFx0aWYoIGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAyICYmIHRvdWNoLnN0YXJ0Q291bnQgPT09IDIgJiYgY29uZmlnLm92ZXJ2aWV3ICkge1xuXG5cdFx0XHRcdC8vIFRoZSBjdXJyZW50IGRpc3RhbmNlIGluIHBpeGVscyBiZXR3ZWVuIHRoZSB0d28gdG91Y2ggcG9pbnRzXG5cdFx0XHRcdHZhciBjdXJyZW50U3BhbiA9IGRpc3RhbmNlQmV0d2Vlbigge1xuXHRcdFx0XHRcdHg6IGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WCxcblx0XHRcdFx0XHR5OiBldmVudC50b3VjaGVzWzFdLmNsaWVudFlcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdHg6IHRvdWNoLnN0YXJ0WCxcblx0XHRcdFx0XHR5OiB0b3VjaC5zdGFydFlcblx0XHRcdFx0fSApO1xuXG5cdFx0XHRcdC8vIElmIHRoZSBzcGFuIGlzIGxhcmdlciB0aGFuIHRoZSBkZXNpcmUgYW1vdW50IHdlJ3ZlIGdvdFxuXHRcdFx0XHQvLyBvdXJzZWx2ZXMgYSBwaW5jaFxuXHRcdFx0XHRpZiggTWF0aC5hYnMoIHRvdWNoLnN0YXJ0U3BhbiAtIGN1cnJlbnRTcGFuICkgPiB0b3VjaC50aHJlc2hvbGQgKSB7XG5cdFx0XHRcdFx0dG91Y2guY2FwdHVyZWQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0aWYoIGN1cnJlbnRTcGFuIDwgdG91Y2guc3RhcnRTcGFuICkge1xuXHRcdFx0XHRcdFx0YWN0aXZhdGVPdmVydmlldygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGRlYWN0aXZhdGVPdmVydmlldygpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdH1cblx0XHRcdC8vIFRoZXJlIHdhcyBvbmx5IG9uZSB0b3VjaCBwb2ludCwgbG9vayBmb3IgYSBzd2lwZVxuXHRcdFx0ZWxzZSBpZiggZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDEgJiYgdG91Y2guc3RhcnRDb3VudCAhPT0gMiApIHtcblxuXHRcdFx0XHR2YXIgZGVsdGFYID0gY3VycmVudFggLSB0b3VjaC5zdGFydFgsXG5cdFx0XHRcdFx0ZGVsdGFZID0gY3VycmVudFkgLSB0b3VjaC5zdGFydFk7XG5cblx0XHRcdFx0aWYoIGRlbHRhWCA+IHRvdWNoLnRocmVzaG9sZCAmJiBNYXRoLmFicyggZGVsdGFYICkgPiBNYXRoLmFicyggZGVsdGFZICkgKSB7XG5cdFx0XHRcdFx0dG91Y2guY2FwdHVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdG5hdmlnYXRlTGVmdCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYoIGRlbHRhWCA8IC10b3VjaC50aHJlc2hvbGQgJiYgTWF0aC5hYnMoIGRlbHRhWCApID4gTWF0aC5hYnMoIGRlbHRhWSApICkge1xuXHRcdFx0XHRcdHRvdWNoLmNhcHR1cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRuYXZpZ2F0ZVJpZ2h0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiggZGVsdGFZID4gdG91Y2gudGhyZXNob2xkICkge1xuXHRcdFx0XHRcdHRvdWNoLmNhcHR1cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRuYXZpZ2F0ZVVwKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiggZGVsdGFZIDwgLXRvdWNoLnRocmVzaG9sZCApIHtcblx0XHRcdFx0XHR0b3VjaC5jYXB0dXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0bmF2aWdhdGVEb3duKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJZiB3ZSdyZSBlbWJlZGRlZCwgb25seSBibG9jayB0b3VjaCBldmVudHMgaWYgdGhleSBoYXZlXG5cdFx0XHRcdC8vIHRyaWdnZXJlZCBhbiBhY3Rpb25cblx0XHRcdFx0aWYoIGNvbmZpZy5lbWJlZGRlZCApIHtcblx0XHRcdFx0XHRpZiggdG91Y2guY2FwdHVyZWQgfHwgaXNWZXJ0aWNhbFNsaWRlKCBjdXJyZW50U2xpZGUgKSApIHtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIE5vdCBlbWJlZGRlZD8gQmxvY2sgdGhlbSBhbGwgdG8gYXZvaWQgbmVlZGxlc3MgdG9zc2luZ1xuXHRcdFx0XHQvLyBhcm91bmQgb2YgdGhlIHZpZXdwb3J0IGluIGlPU1xuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cdFx0Ly8gVGhlcmUncyBhIGJ1ZyB3aXRoIHN3aXBpbmcgb24gc29tZSBBbmRyb2lkIGRldmljZXMgdW5sZXNzXG5cdFx0Ly8gdGhlIGRlZmF1bHQgYWN0aW9uIGlzIGFsd2F5cyBwcmV2ZW50ZWRcblx0XHRlbHNlIGlmKCBVQS5tYXRjaCggL2FuZHJvaWQvZ2kgKSApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlciBmb3IgdGhlICd0b3VjaGVuZCcgZXZlbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBvblRvdWNoRW5kKCBldmVudCApIHtcblxuXHRcdHRvdWNoLmNhcHR1cmVkID0gZmFsc2U7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0IHBvaW50ZXIgZG93biB0byB0b3VjaCBzdGFydC5cblx0ICovXG5cdGZ1bmN0aW9uIG9uUG9pbnRlckRvd24oIGV2ZW50ICkge1xuXG5cdFx0aWYoIGV2ZW50LnBvaW50ZXJUeXBlID09PSBldmVudC5NU1BPSU5URVJfVFlQRV9UT1VDSCB8fCBldmVudC5wb2ludGVyVHlwZSA9PT0gXCJ0b3VjaFwiICkge1xuXHRcdFx0ZXZlbnQudG91Y2hlcyA9IFt7IGNsaWVudFg6IGV2ZW50LmNsaWVudFgsIGNsaWVudFk6IGV2ZW50LmNsaWVudFkgfV07XG5cdFx0XHRvblRvdWNoU3RhcnQoIGV2ZW50ICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydCBwb2ludGVyIG1vdmUgdG8gdG91Y2ggbW92ZS5cblx0ICovXG5cdGZ1bmN0aW9uIG9uUG9pbnRlck1vdmUoIGV2ZW50ICkge1xuXG5cdFx0aWYoIGV2ZW50LnBvaW50ZXJUeXBlID09PSBldmVudC5NU1BPSU5URVJfVFlQRV9UT1VDSCB8fCBldmVudC5wb2ludGVyVHlwZSA9PT0gXCJ0b3VjaFwiICkgIHtcblx0XHRcdGV2ZW50LnRvdWNoZXMgPSBbeyBjbGllbnRYOiBldmVudC5jbGllbnRYLCBjbGllbnRZOiBldmVudC5jbGllbnRZIH1dO1xuXHRcdFx0b25Ub3VjaE1vdmUoIGV2ZW50ICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydCBwb2ludGVyIHVwIHRvIHRvdWNoIGVuZC5cblx0ICovXG5cdGZ1bmN0aW9uIG9uUG9pbnRlclVwKCBldmVudCApIHtcblxuXHRcdGlmKCBldmVudC5wb2ludGVyVHlwZSA9PT0gZXZlbnQuTVNQT0lOVEVSX1RZUEVfVE9VQ0ggfHwgZXZlbnQucG9pbnRlclR5cGUgPT09IFwidG91Y2hcIiApICB7XG5cdFx0XHRldmVudC50b3VjaGVzID0gW3sgY2xpZW50WDogZXZlbnQuY2xpZW50WCwgY2xpZW50WTogZXZlbnQuY2xpZW50WSB9XTtcblx0XHRcdG9uVG91Y2hFbmQoIGV2ZW50ICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBtb3VzZSB3aGVlbCBzY3JvbGxpbmcsIHRocm90dGxlZCB0byBhdm9pZCBza2lwcGluZ1xuXHQgKiBtdWx0aXBsZSBzbGlkZXMuXG5cdCAqL1xuXHRmdW5jdGlvbiBvbkRvY3VtZW50TW91c2VTY3JvbGwoIGV2ZW50ICkge1xuXG5cdFx0aWYoIERhdGUubm93KCkgLSBsYXN0TW91c2VXaGVlbFN0ZXAgPiA2MDAgKSB7XG5cblx0XHRcdGxhc3RNb3VzZVdoZWVsU3RlcCA9IERhdGUubm93KCk7XG5cblx0XHRcdHZhciBkZWx0YSA9IGV2ZW50LmRldGFpbCB8fCAtZXZlbnQud2hlZWxEZWx0YTtcblx0XHRcdGlmKCBkZWx0YSA+IDAgKSB7XG5cdFx0XHRcdG5hdmlnYXRlTmV4dCgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdG5hdmlnYXRlUHJldigpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2xpY2tpbmcgb24gdGhlIHByb2dyZXNzIGJhciByZXN1bHRzIGluIGEgbmF2aWdhdGlvbiB0byB0aGVcblx0ICogY2xvc2VzdCBhcHByb3hpbWF0ZSBob3Jpem9udGFsIHNsaWRlIHVzaW5nIHRoaXMgZXF1YXRpb246XG5cdCAqXG5cdCAqICggY2xpY2tYIC8gcHJlc2VudGF0aW9uV2lkdGggKSAqIG51bWJlck9mU2xpZGVzXG5cdCAqL1xuXHRmdW5jdGlvbiBvblByb2dyZXNzQ2xpY2tlZCggZXZlbnQgKSB7XG5cblx0XHRvblVzZXJJbnB1dCggZXZlbnQgKTtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgc2xpZGVzVG90YWwgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICkubGVuZ3RoO1xuXHRcdHZhciBzbGlkZUluZGV4ID0gTWF0aC5mbG9vciggKCBldmVudC5jbGllbnRYIC8gZG9tLndyYXBwZXIub2Zmc2V0V2lkdGggKSAqIHNsaWRlc1RvdGFsICk7XG5cblx0XHRpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdHNsaWRlSW5kZXggPSBzbGlkZXNUb3RhbCAtIHNsaWRlSW5kZXg7XG5cdFx0fVxuXG5cdFx0c2xpZGUoIHNsaWRlSW5kZXggKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEV2ZW50IGhhbmRsZXIgZm9yIG5hdmlnYXRpb24gY29udHJvbCBidXR0b25zLlxuXHQgKi9cblx0ZnVuY3Rpb24gb25OYXZpZ2F0ZUxlZnRDbGlja2VkKCBldmVudCApIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgb25Vc2VySW5wdXQoKTsgbmF2aWdhdGVMZWZ0KCk7IH1cblx0ZnVuY3Rpb24gb25OYXZpZ2F0ZVJpZ2h0Q2xpY2tlZCggZXZlbnQgKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IG9uVXNlcklucHV0KCk7IG5hdmlnYXRlUmlnaHQoKTsgfVxuXHRmdW5jdGlvbiBvbk5hdmlnYXRlVXBDbGlja2VkKCBldmVudCApIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgb25Vc2VySW5wdXQoKTsgbmF2aWdhdGVVcCgpOyB9XG5cdGZ1bmN0aW9uIG9uTmF2aWdhdGVEb3duQ2xpY2tlZCggZXZlbnQgKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IG9uVXNlcklucHV0KCk7IG5hdmlnYXRlRG93bigpOyB9XG5cdGZ1bmN0aW9uIG9uTmF2aWdhdGVQcmV2Q2xpY2tlZCggZXZlbnQgKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IG9uVXNlcklucHV0KCk7IG5hdmlnYXRlUHJldigpOyB9XG5cdGZ1bmN0aW9uIG9uTmF2aWdhdGVOZXh0Q2xpY2tlZCggZXZlbnQgKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IG9uVXNlcklucHV0KCk7IG5hdmlnYXRlTmV4dCgpOyB9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHRoZSB3aW5kb3cgbGV2ZWwgJ2hhc2hjaGFuZ2UnIGV2ZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25XaW5kb3dIYXNoQ2hhbmdlKCBldmVudCApIHtcblxuXHRcdHJlYWRVUkwoKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHRoZSB3aW5kb3cgbGV2ZWwgJ3Jlc2l6ZScgZXZlbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSggZXZlbnQgKSB7XG5cblx0XHRsYXlvdXQoKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZSBmb3IgdGhlIHdpbmRvdyBsZXZlbCAndmlzaWJpbGl0eWNoYW5nZScgZXZlbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBvblBhZ2VWaXNpYmlsaXR5Q2hhbmdlKCBldmVudCApIHtcblxuXHRcdHZhciBpc0hpZGRlbiA9ICBkb2N1bWVudC53ZWJraXRIaWRkZW4gfHxcblx0XHRcdFx0XHRcdGRvY3VtZW50Lm1zSGlkZGVuIHx8XG5cdFx0XHRcdFx0XHRkb2N1bWVudC5oaWRkZW47XG5cblx0XHQvLyBJZiwgYWZ0ZXIgY2xpY2tpbmcgYSBsaW5rIG9yIHNpbWlsYXIgYW5kIHdlJ3JlIGNvbWluZyBiYWNrLFxuXHRcdC8vIGZvY3VzIHRoZSBkb2N1bWVudC5ib2R5IHRvIGVuc3VyZSB3ZSBjYW4gdXNlIGtleWJvYXJkIHNob3J0Y3V0c1xuXHRcdGlmKCBpc0hpZGRlbiA9PT0gZmFsc2UgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSApIHtcblx0XHRcdC8vIE5vdCBhbGwgZWxlbWVudHMgc3VwcG9ydCAuYmx1cigpIC0gU1ZHcyBhbW9uZyB0aGVtLlxuXHRcdFx0aWYoIHR5cGVvZiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuXHRcdFx0fVxuXHRcdFx0ZG9jdW1lbnQuYm9keS5mb2N1cygpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEludm9rZWQgd2hlbiBhIHNsaWRlIGlzIGFuZCB3ZSdyZSBpbiB0aGUgb3ZlcnZpZXcuXG5cdCAqL1xuXHRmdW5jdGlvbiBvbk92ZXJ2aWV3U2xpZGVDbGlja2VkKCBldmVudCApIHtcblxuXHRcdC8vIFRPRE8gVGhlcmUncyBhIGJ1ZyBoZXJlIHdoZXJlIHRoZSBldmVudCBsaXN0ZW5lcnMgYXJlIG5vdFxuXHRcdC8vIHJlbW92ZWQgYWZ0ZXIgZGVhY3RpdmF0aW5nIHRoZSBvdmVydmlldy5cblx0XHRpZiggZXZlbnRzQXJlQm91bmQgJiYgaXNPdmVydmlldygpICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0dmFyIGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XG5cblx0XHRcdHdoaWxlKCBlbGVtZW50ICYmICFlbGVtZW50Lm5vZGVOYW1lLm1hdGNoKCAvc2VjdGlvbi9naSApICkge1xuXHRcdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiggZWxlbWVudCAmJiAhZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoICdkaXNhYmxlZCcgKSApIHtcblxuXHRcdFx0XHRkZWFjdGl2YXRlT3ZlcnZpZXcoKTtcblxuXHRcdFx0XHRpZiggZWxlbWVudC5ub2RlTmFtZS5tYXRjaCggL3NlY3Rpb24vZ2kgKSApIHtcblx0XHRcdFx0XHR2YXIgaCA9IHBhcnNlSW50KCBlbGVtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtaCcgKSwgMTAgKSxcblx0XHRcdFx0XHRcdHYgPSBwYXJzZUludCggZWxlbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LXYnICksIDEwICk7XG5cblx0XHRcdFx0XHRzbGlkZSggaCwgdiApO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVzIGNsaWNrcyBvbiBsaW5rcyB0aGF0IGFyZSBzZXQgdG8gcHJldmlldyBpbiB0aGVcblx0ICogaWZyYW1lIG92ZXJsYXkuXG5cdCAqL1xuXHRmdW5jdGlvbiBvblByZXZpZXdMaW5rQ2xpY2tlZCggZXZlbnQgKSB7XG5cblx0XHRpZiggZXZlbnQuY3VycmVudFRhcmdldCAmJiBldmVudC5jdXJyZW50VGFyZ2V0Lmhhc0F0dHJpYnV0ZSggJ2hyZWYnICkgKSB7XG5cdFx0XHR2YXIgdXJsID0gZXZlbnQuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoICdocmVmJyApO1xuXHRcdFx0aWYoIHVybCApIHtcblx0XHRcdFx0c2hvd1ByZXZpZXcoIHVybCApO1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXMgY2xpY2sgb24gdGhlIGF1dG8tc2xpZGluZyBjb250cm9scyBlbGVtZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gb25BdXRvU2xpZGVQbGF5ZXJDbGljayggZXZlbnQgKSB7XG5cblx0XHQvLyBSZXBsYXlcblx0XHRpZiggUmV2ZWFsLmlzTGFzdFNsaWRlKCkgJiYgY29uZmlnLmxvb3AgPT09IGZhbHNlICkge1xuXHRcdFx0c2xpZGUoIDAsIDAgKTtcblx0XHRcdHJlc3VtZUF1dG9TbGlkZSgpO1xuXHRcdH1cblx0XHQvLyBSZXN1bWVcblx0XHRlbHNlIGlmKCBhdXRvU2xpZGVQYXVzZWQgKSB7XG5cdFx0XHRyZXN1bWVBdXRvU2xpZGUoKTtcblx0XHR9XG5cdFx0Ly8gUGF1c2Vcblx0XHRlbHNlIHtcblx0XHRcdHBhdXNlQXV0b1NsaWRlKCk7XG5cdFx0fVxuXG5cdH1cblxuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFBMQVlCQUNLIENPTVBPTkVOVCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cblxuXHQvKipcblx0ICogQ29uc3RydWN0b3IgZm9yIHRoZSBwbGF5YmFjayBjb21wb25lbnQsIHdoaWNoIGRpc3BsYXlzXG5cdCAqIHBsYXkvcGF1c2UvcHJvZ3Jlc3MgY29udHJvbHMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRhaW5lciBUaGUgY29tcG9uZW50IHdpbGwgYXBwZW5kXG5cdCAqIGl0c2VsZiB0byB0aGlzXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IHByb2dyZXNzQ2hlY2sgQSBtZXRob2Qgd2hpY2ggd2lsbCBiZVxuXHQgKiBjYWxsZWQgZnJlcXVlbnRseSB0byBnZXQgdGhlIGN1cnJlbnQgcHJvZ3Jlc3Mgb24gYSByYW5nZVxuXHQgKiBvZiAwLTFcblx0ICovXG5cdGZ1bmN0aW9uIFBsYXliYWNrKCBjb250YWluZXIsIHByb2dyZXNzQ2hlY2sgKSB7XG5cblx0XHQvLyBDb3NtZXRpY3Ncblx0XHR0aGlzLmRpYW1ldGVyID0gMTAwO1xuXHRcdHRoaXMuZGlhbWV0ZXIyID0gdGhpcy5kaWFtZXRlci8yO1xuXHRcdHRoaXMudGhpY2tuZXNzID0gNjtcblxuXHRcdC8vIEZsYWdzIGlmIHdlIGFyZSBjdXJyZW50bHkgcGxheWluZ1xuXHRcdHRoaXMucGxheWluZyA9IGZhbHNlO1xuXG5cdFx0Ly8gQ3VycmVudCBwcm9ncmVzcyBvbiBhIDAtMSByYW5nZVxuXHRcdHRoaXMucHJvZ3Jlc3MgPSAwO1xuXG5cdFx0Ly8gVXNlZCB0byBsb29wIHRoZSBhbmltYXRpb24gc21vb3RobHlcblx0XHR0aGlzLnByb2dyZXNzT2Zmc2V0ID0gMTtcblxuXHRcdHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuXHRcdHRoaXMucHJvZ3Jlc3NDaGVjayA9IHByb2dyZXNzQ2hlY2s7XG5cblx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdjYW52YXMnICk7XG5cdFx0dGhpcy5jYW52YXMuY2xhc3NOYW1lID0gJ3BsYXliYWNrJztcblx0XHR0aGlzLmNhbnZhcy53aWR0aCA9IHRoaXMuZGlhbWV0ZXI7XG5cdFx0dGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5kaWFtZXRlcjtcblx0XHR0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHRoaXMuZGlhbWV0ZXIyICsgJ3B4Jztcblx0XHR0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSB0aGlzLmRpYW1ldGVyMiArICdweCc7XG5cdFx0dGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCggJzJkJyApO1xuXG5cdFx0dGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoIHRoaXMuY2FudmFzICk7XG5cblx0XHR0aGlzLnJlbmRlcigpO1xuXG5cdH1cblxuXHRQbGF5YmFjay5wcm90b3R5cGUuc2V0UGxheWluZyA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblxuXHRcdHZhciB3YXNQbGF5aW5nID0gdGhpcy5wbGF5aW5nO1xuXG5cdFx0dGhpcy5wbGF5aW5nID0gdmFsdWU7XG5cblx0XHQvLyBTdGFydCByZXBhaW50aW5nIGlmIHdlIHdlcmVuJ3QgYWxyZWFkeVxuXHRcdGlmKCAhd2FzUGxheWluZyAmJiB0aGlzLnBsYXlpbmcgKSB7XG5cdFx0XHR0aGlzLmFuaW1hdGUoKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLnJlbmRlcigpO1xuXHRcdH1cblxuXHR9O1xuXG5cdFBsYXliYWNrLnByb3RvdHlwZS5hbmltYXRlID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgcHJvZ3Jlc3NCZWZvcmUgPSB0aGlzLnByb2dyZXNzO1xuXG5cdFx0dGhpcy5wcm9ncmVzcyA9IHRoaXMucHJvZ3Jlc3NDaGVjaygpO1xuXG5cdFx0Ly8gV2hlbiB3ZSBsb29wLCBvZmZzZXQgdGhlIHByb2dyZXNzIHNvIHRoYXQgaXQgZWFzZXNcblx0XHQvLyBzbW9vdGhseSByYXRoZXIgdGhhbiBpbW1lZGlhdGVseSByZXNldHRpbmdcblx0XHRpZiggcHJvZ3Jlc3NCZWZvcmUgPiAwLjggJiYgdGhpcy5wcm9ncmVzcyA8IDAuMiApIHtcblx0XHRcdHRoaXMucHJvZ3Jlc3NPZmZzZXQgPSB0aGlzLnByb2dyZXNzO1xuXHRcdH1cblxuXHRcdHRoaXMucmVuZGVyKCk7XG5cblx0XHRpZiggdGhpcy5wbGF5aW5nICkge1xuXHRcdFx0ZmVhdHVyZXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lTWV0aG9kLmNhbGwoIHdpbmRvdywgdGhpcy5hbmltYXRlLmJpbmQoIHRoaXMgKSApO1xuXHRcdH1cblxuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZW5kZXJzIHRoZSBjdXJyZW50IHByb2dyZXNzIGFuZCBwbGF5YmFjayBzdGF0ZS5cblx0ICovXG5cdFBsYXliYWNrLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBwcm9ncmVzcyA9IHRoaXMucGxheWluZyA/IHRoaXMucHJvZ3Jlc3MgOiAwLFxuXHRcdFx0cmFkaXVzID0gKCB0aGlzLmRpYW1ldGVyMiApIC0gdGhpcy50aGlja25lc3MsXG5cdFx0XHR4ID0gdGhpcy5kaWFtZXRlcjIsXG5cdFx0XHR5ID0gdGhpcy5kaWFtZXRlcjIsXG5cdFx0XHRpY29uU2l6ZSA9IDI4O1xuXG5cdFx0Ly8gRWFzZSB0b3dhcmRzIDFcblx0XHR0aGlzLnByb2dyZXNzT2Zmc2V0ICs9ICggMSAtIHRoaXMucHJvZ3Jlc3NPZmZzZXQgKSAqIDAuMTtcblxuXHRcdHZhciBlbmRBbmdsZSA9ICggLSBNYXRoLlBJIC8gMiApICsgKCBwcm9ncmVzcyAqICggTWF0aC5QSSAqIDIgKSApO1xuXHRcdHZhciBzdGFydEFuZ2xlID0gKCAtIE1hdGguUEkgLyAyICkgKyAoIHRoaXMucHJvZ3Jlc3NPZmZzZXQgKiAoIE1hdGguUEkgKiAyICkgKTtcblxuXHRcdHRoaXMuY29udGV4dC5zYXZlKCk7XG5cdFx0dGhpcy5jb250ZXh0LmNsZWFyUmVjdCggMCwgMCwgdGhpcy5kaWFtZXRlciwgdGhpcy5kaWFtZXRlciApO1xuXG5cdFx0Ly8gU29saWQgYmFja2dyb3VuZCBjb2xvclxuXHRcdHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHR0aGlzLmNvbnRleHQuYXJjKCB4LCB5LCByYWRpdXMgKyA0LCAwLCBNYXRoLlBJICogMiwgZmFsc2UgKTtcblx0XHR0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJ3JnYmEoIDAsIDAsIDAsIDAuNCApJztcblx0XHR0aGlzLmNvbnRleHQuZmlsbCgpO1xuXG5cdFx0Ly8gRHJhdyBwcm9ncmVzcyB0cmFja1xuXHRcdHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHR0aGlzLmNvbnRleHQuYXJjKCB4LCB5LCByYWRpdXMsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSApO1xuXHRcdHRoaXMuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLnRoaWNrbmVzcztcblx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnIzY2Nic7XG5cdFx0dGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXG5cdFx0aWYoIHRoaXMucGxheWluZyApIHtcblx0XHRcdC8vIERyYXcgcHJvZ3Jlc3Mgb24gdG9wIG9mIHRyYWNrXG5cdFx0XHR0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0XHR0aGlzLmNvbnRleHQuYXJjKCB4LCB5LCByYWRpdXMsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlLCBmYWxzZSApO1xuXHRcdFx0dGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMudGhpY2tuZXNzO1xuXHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZVN0eWxlID0gJyNmZmYnO1xuXHRcdFx0dGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuXHRcdH1cblxuXHRcdHRoaXMuY29udGV4dC50cmFuc2xhdGUoIHggLSAoIGljb25TaXplIC8gMiApLCB5IC0gKCBpY29uU2l6ZSAvIDIgKSApO1xuXG5cdFx0Ly8gRHJhdyBwbGF5L3BhdXNlIGljb25zXG5cdFx0aWYoIHRoaXMucGxheWluZyApIHtcblx0XHRcdHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZic7XG5cdFx0XHR0aGlzLmNvbnRleHQuZmlsbFJlY3QoIDAsIDAsIGljb25TaXplIC8gMiAtIDQsIGljb25TaXplICk7XG5cdFx0XHR0aGlzLmNvbnRleHQuZmlsbFJlY3QoIGljb25TaXplIC8gMiArIDQsIDAsIGljb25TaXplIC8gMiAtIDQsIGljb25TaXplICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdFx0dGhpcy5jb250ZXh0LnRyYW5zbGF0ZSggNCwgMCApO1xuXHRcdFx0dGhpcy5jb250ZXh0Lm1vdmVUbyggMCwgMCApO1xuXHRcdFx0dGhpcy5jb250ZXh0LmxpbmVUbyggaWNvblNpemUgLSA0LCBpY29uU2l6ZSAvIDIgKTtcblx0XHRcdHRoaXMuY29udGV4dC5saW5lVG8oIDAsIGljb25TaXplICk7XG5cdFx0XHR0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmYnO1xuXHRcdFx0dGhpcy5jb250ZXh0LmZpbGwoKTtcblx0XHR9XG5cblx0XHR0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuXG5cdH07XG5cblx0UGxheWJhY2sucHJvdG90eXBlLm9uID0gZnVuY3Rpb24oIHR5cGUsIGxpc3RlbmVyICkge1xuXHRcdHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyLCBmYWxzZSApO1xuXHR9O1xuXG5cdFBsYXliYWNrLnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiggdHlwZSwgbGlzdGVuZXIgKSB7XG5cdFx0dGhpcy5jYW52YXMucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIsIGZhbHNlICk7XG5cdH07XG5cblx0UGxheWJhY2sucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcblxuXHRcdHRoaXMucGxheWluZyA9IGZhbHNlO1xuXG5cdFx0aWYoIHRoaXMuY2FudmFzLnBhcmVudE5vZGUgKSB7XG5cdFx0XHR0aGlzLmNvbnRhaW5lci5yZW1vdmVDaGlsZCggdGhpcy5jYW52YXMgKTtcblx0XHR9XG5cblx0fTtcblxuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBBUEkgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cblxuXHRSZXZlYWwgPSB7XG5cdFx0VkVSU0lPTjogVkVSU0lPTixcblxuXHRcdGluaXRpYWxpemU6IGluaXRpYWxpemUsXG5cdFx0Y29uZmlndXJlOiBjb25maWd1cmUsXG5cdFx0c3luYzogc3luYyxcblxuXHRcdC8vIE5hdmlnYXRpb24gbWV0aG9kc1xuXHRcdHNsaWRlOiBzbGlkZSxcblx0XHRsZWZ0OiBuYXZpZ2F0ZUxlZnQsXG5cdFx0cmlnaHQ6IG5hdmlnYXRlUmlnaHQsXG5cdFx0dXA6IG5hdmlnYXRlVXAsXG5cdFx0ZG93bjogbmF2aWdhdGVEb3duLFxuXHRcdHByZXY6IG5hdmlnYXRlUHJldixcblx0XHRuZXh0OiBuYXZpZ2F0ZU5leHQsXG5cblx0XHQvLyBGcmFnbWVudCBtZXRob2RzXG5cdFx0bmF2aWdhdGVGcmFnbWVudDogbmF2aWdhdGVGcmFnbWVudCxcblx0XHRwcmV2RnJhZ21lbnQ6IHByZXZpb3VzRnJhZ21lbnQsXG5cdFx0bmV4dEZyYWdtZW50OiBuZXh0RnJhZ21lbnQsXG5cblx0XHQvLyBEZXByZWNhdGVkIGFsaWFzZXNcblx0XHRuYXZpZ2F0ZVRvOiBzbGlkZSxcblx0XHRuYXZpZ2F0ZUxlZnQ6IG5hdmlnYXRlTGVmdCxcblx0XHRuYXZpZ2F0ZVJpZ2h0OiBuYXZpZ2F0ZVJpZ2h0LFxuXHRcdG5hdmlnYXRlVXA6IG5hdmlnYXRlVXAsXG5cdFx0bmF2aWdhdGVEb3duOiBuYXZpZ2F0ZURvd24sXG5cdFx0bmF2aWdhdGVQcmV2OiBuYXZpZ2F0ZVByZXYsXG5cdFx0bmF2aWdhdGVOZXh0OiBuYXZpZ2F0ZU5leHQsXG5cblx0XHQvLyBGb3JjZXMgYW4gdXBkYXRlIGluIHNsaWRlIGxheW91dFxuXHRcdGxheW91dDogbGF5b3V0LFxuXG5cdFx0Ly8gUmFuZG9taXplcyB0aGUgb3JkZXIgb2Ygc2xpZGVzXG5cdFx0c2h1ZmZsZTogc2h1ZmZsZSxcblxuXHRcdC8vIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGF2YWlsYWJsZSByb3V0ZXMgYXMgYm9vbGVhbnMgKGxlZnQvcmlnaHQvdG9wL2JvdHRvbSlcblx0XHRhdmFpbGFibGVSb3V0ZXM6IGF2YWlsYWJsZVJvdXRlcyxcblxuXHRcdC8vIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGF2YWlsYWJsZSBmcmFnbWVudHMgYXMgYm9vbGVhbnMgKHByZXYvbmV4dClcblx0XHRhdmFpbGFibGVGcmFnbWVudHM6IGF2YWlsYWJsZUZyYWdtZW50cyxcblxuXHRcdC8vIFRvZ2dsZXMgdGhlIG92ZXJ2aWV3IG1vZGUgb24vb2ZmXG5cdFx0dG9nZ2xlT3ZlcnZpZXc6IHRvZ2dsZU92ZXJ2aWV3LFxuXG5cdFx0Ly8gVG9nZ2xlcyB0aGUgXCJibGFjayBzY3JlZW5cIiBtb2RlIG9uL29mZlxuXHRcdHRvZ2dsZVBhdXNlOiB0b2dnbGVQYXVzZSxcblxuXHRcdC8vIFRvZ2dsZXMgdGhlIGF1dG8gc2xpZGUgbW9kZSBvbi9vZmZcblx0XHR0b2dnbGVBdXRvU2xpZGU6IHRvZ2dsZUF1dG9TbGlkZSxcblxuXHRcdC8vIFN0YXRlIGNoZWNrc1xuXHRcdGlzT3ZlcnZpZXc6IGlzT3ZlcnZpZXcsXG5cdFx0aXNQYXVzZWQ6IGlzUGF1c2VkLFxuXHRcdGlzQXV0b1NsaWRpbmc6IGlzQXV0b1NsaWRpbmcsXG5cblx0XHQvLyBBZGRzIG9yIHJlbW92ZXMgYWxsIGludGVybmFsIGV2ZW50IGxpc3RlbmVycyAoc3VjaCBhcyBrZXlib2FyZClcblx0XHRhZGRFdmVudExpc3RlbmVyczogYWRkRXZlbnRMaXN0ZW5lcnMsXG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lcnM6IHJlbW92ZUV2ZW50TGlzdGVuZXJzLFxuXG5cdFx0Ly8gRmFjaWxpdHkgZm9yIHBlcnNpc3RpbmcgYW5kIHJlc3RvcmluZyB0aGUgcHJlc2VudGF0aW9uIHN0YXRlXG5cdFx0Z2V0U3RhdGU6IGdldFN0YXRlLFxuXHRcdHNldFN0YXRlOiBzZXRTdGF0ZSxcblxuXHRcdC8vIFByZXNlbnRhdGlvbiBwcm9ncmVzcyBvbiByYW5nZSBvZiAwLTFcblx0XHRnZXRQcm9ncmVzczogZ2V0UHJvZ3Jlc3MsXG5cblx0XHQvLyBSZXR1cm5zIHRoZSBpbmRpY2VzIG9mIHRoZSBjdXJyZW50LCBvciBzcGVjaWZpZWQsIHNsaWRlXG5cdFx0Z2V0SW5kaWNlczogZ2V0SW5kaWNlcyxcblxuXHRcdGdldFRvdGFsU2xpZGVzOiBnZXRUb3RhbFNsaWRlcyxcblxuXHRcdC8vIFJldHVybnMgdGhlIHNsaWRlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleFxuXHRcdGdldFNsaWRlOiBnZXRTbGlkZSxcblxuXHRcdC8vIFJldHVybnMgdGhlIHNsaWRlIGJhY2tncm91bmQgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGluZGV4XG5cdFx0Z2V0U2xpZGVCYWNrZ3JvdW5kOiBnZXRTbGlkZUJhY2tncm91bmQsXG5cblx0XHQvLyBSZXR1cm5zIHRoZSBzcGVha2VyIG5vdGVzIHN0cmluZyBmb3IgYSBzbGlkZSwgb3IgbnVsbFxuXHRcdGdldFNsaWRlTm90ZXM6IGdldFNsaWRlTm90ZXMsXG5cblx0XHQvLyBSZXR1cm5zIHRoZSBwcmV2aW91cyBzbGlkZSBlbGVtZW50LCBtYXkgYmUgbnVsbFxuXHRcdGdldFByZXZpb3VzU2xpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHByZXZpb3VzU2xpZGU7XG5cdFx0fSxcblxuXHRcdC8vIFJldHVybnMgdGhlIGN1cnJlbnQgc2xpZGUgZWxlbWVudFxuXHRcdGdldEN1cnJlbnRTbGlkZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gY3VycmVudFNsaWRlO1xuXHRcdH0sXG5cblx0XHQvLyBSZXR1cm5zIHRoZSBjdXJyZW50IHNjYWxlIG9mIHRoZSBwcmVzZW50YXRpb24gY29udGVudFxuXHRcdGdldFNjYWxlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBzY2FsZTtcblx0XHR9LFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIG9iamVjdFxuXHRcdGdldENvbmZpZzogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gY29uZmlnO1xuXHRcdH0sXG5cblx0XHQvLyBIZWxwZXIgbWV0aG9kLCByZXRyaWV2ZXMgcXVlcnkgc3RyaW5nIGFzIGEga2V5L3ZhbHVlIGhhc2hcblx0XHRnZXRRdWVyeUhhc2g6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHF1ZXJ5ID0ge307XG5cblx0XHRcdGxvY2F0aW9uLnNlYXJjaC5yZXBsYWNlKCAvW0EtWjAtOV0rPz0oW1xcd1xcLiUtXSopL2dpLCBmdW5jdGlvbihhKSB7XG5cdFx0XHRcdHF1ZXJ5WyBhLnNwbGl0KCAnPScgKS5zaGlmdCgpIF0gPSBhLnNwbGl0KCAnPScgKS5wb3AoKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQmFzaWMgZGVzZXJpYWxpemF0aW9uXG5cdFx0XHRmb3IoIHZhciBpIGluIHF1ZXJ5ICkge1xuXHRcdFx0XHR2YXIgdmFsdWUgPSBxdWVyeVsgaSBdO1xuXG5cdFx0XHRcdHF1ZXJ5WyBpIF0gPSBkZXNlcmlhbGl6ZSggdW5lc2NhcGUoIHZhbHVlICkgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHF1ZXJ5O1xuXHRcdH0sXG5cblx0XHQvLyBSZXR1cm5zIHRydWUgaWYgd2UncmUgY3VycmVudGx5IG9uIHRoZSBmaXJzdCBzbGlkZVxuXHRcdGlzRmlyc3RTbGlkZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gKCBpbmRleGggPT09IDAgJiYgaW5kZXh2ID09PSAwICk7XG5cdFx0fSxcblxuXHRcdC8vIFJldHVybnMgdHJ1ZSBpZiB3ZSdyZSBjdXJyZW50bHkgb24gdGhlIGxhc3Qgc2xpZGVcblx0XHRpc0xhc3RTbGlkZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiggY3VycmVudFNsaWRlICkge1xuXHRcdFx0XHQvLyBEb2VzIHRoaXMgc2xpZGUgaGFzIG5leHQgYSBzaWJsaW5nP1xuXHRcdFx0XHRpZiggY3VycmVudFNsaWRlLm5leHRFbGVtZW50U2libGluZyApIHJldHVybiBmYWxzZTtcblxuXHRcdFx0XHQvLyBJZiBpdCdzIHZlcnRpY2FsLCBkb2VzIGl0cyBwYXJlbnQgaGF2ZSBhIG5leHQgc2libGluZz9cblx0XHRcdFx0aWYoIGlzVmVydGljYWxTbGlkZSggY3VycmVudFNsaWRlICkgJiYgY3VycmVudFNsaWRlLnBhcmVudE5vZGUubmV4dEVsZW1lbnRTaWJsaW5nICkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSxcblxuXHRcdC8vIENoZWNrcyBpZiByZXZlYWwuanMgaGFzIGJlZW4gbG9hZGVkIGFuZCBpcyByZWFkeSBmb3IgdXNlXG5cdFx0aXNSZWFkeTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gbG9hZGVkO1xuXHRcdH0sXG5cblx0XHQvLyBGb3J3YXJkIGV2ZW50IGJpbmRpbmcgdG8gdGhlIHJldmVhbCBET00gZWxlbWVudFxuXHRcdGFkZEV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uKCB0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApIHtcblx0XHRcdGlmKCAnYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93ICkge1xuXHRcdFx0XHQoIGRvbS53cmFwcGVyIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcucmV2ZWFsJyApICkuYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXI6IGZ1bmN0aW9uKCB0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSApIHtcblx0XHRcdGlmKCAnYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93ICkge1xuXHRcdFx0XHQoIGRvbS53cmFwcGVyIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcucmV2ZWFsJyApICkucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Ly8gUHJvZ3JhbWF0aWNhbGx5IHRyaWdnZXJzIGEga2V5Ym9hcmQgZXZlbnRcblx0XHR0cmlnZ2VyS2V5OiBmdW5jdGlvbigga2V5Q29kZSApIHtcblx0XHRcdG9uRG9jdW1lbnRLZXlEb3duKCB7IGtleUNvZGU6IGtleUNvZGUgfSApO1xuXHRcdH0sXG5cblx0XHQvLyBSZWdpc3RlcnMgYSBuZXcgc2hvcnRjdXQgdG8gaW5jbHVkZSBpbiB0aGUgaGVscCBvdmVybGF5XG5cdFx0cmVnaXN0ZXJLZXlib2FyZFNob3J0Y3V0OiBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcblx0XHRcdGtleWJvYXJkU2hvcnRjdXRzW2tleV0gPSB2YWx1ZTtcblx0XHR9XG5cdH07XG5cblx0cmV0dXJuIFJldmVhbDtcblxufSkpO1xuIiwidmFyIFJldmVhbCA9IHJlcXVpcmUoJ3JldmVhbC5qcycpO1xudmFyICQgPSByZXF1aXJlKCdqYm9uZScpO1xudmFyIFZJREVPX1RZUEUgPSByZXF1aXJlKCcuL2pzL2NvbnN0YW50cy5qcycpLlZJREVPX1RZUEU7XG52YXIgQVVESU9fVFlQRSA9IHJlcXVpcmUoJy4vanMvY29uc3RhbnRzLmpzJykuQVVESU9fVFlQRTtcbnZhciBBVURJT19QQVRIID0gcmVxdWlyZSgnLi9qcy9jb25zdGFudHMuanMnKS5BVURJT19QQVRIO1xudmFyIERyYWdnYWJsZSA9IHJlcXVpcmUgKCcuL2pzL2xpYi9kcmFnZ2FibGUuanMnKTtcbnZhciBkZXRlY3RJRSA9IHJlcXVpcmUoJy4vanMvZGV0ZWN0aWUuanMnKS5kZXRlY3RJRTtcblxuXG52YXIgaXNFZGdlMTQgPSBkZXRlY3RJRSgpID09PSAxNDtcblxuaWYgKGlzRWRnZTE0KSB7XG4gICAgJCgnYm9keScpLmFkZENsYXNzKFwiZWRnZS0xNFwiKTtcbn1cblxuXG5cblJldmVhbC5pbml0aWFsaXplKHtcbiAgICB3aWR0aDogMTAwMCxcbiAgICBoZWlnaHQ6IDc0MCxcbiAgICBjZW50ZXI6IGZhbHNlLFxuICAgIGNvbnRyb2xzOiBmYWxzZSxcbiAgICAvL2hpc3Rvcnk6IHRydWUsXG4gICAga2V5Ym9hcmQ6IGZhbHNlLFxuICAgIHByb2dyZXNzOiBmYWxzZVxufSk7XG5cblxudmFyIHN0ZXBJbmRleCA9IDAsXG4gICAgbG9vcEluZGV4ID0gMCxcbiAgICBpc1BsYXlpbmcgPSBmYWxzZSxcbiAgICBtZWRpYUlzUmVhZHkgPSBmYWxzZSxcbiAgICAkYXVkaW8gPSAkKCdhdWRpbycpLFxuICAgICRvdmVybGF5ID0gJCgnI292ZXJsYXknKSxcbiAgICAkcGF1c2VCdG4gPSAkKCcucGF1c2UtYnRuJyksXG4gICAgaXNGaW5pc2hlZCA9IGZhbHNlO1xuXG52YXIgc2xpZGVzID0ge1xuICAgIDA6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDE1LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA1MCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTIwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNzgsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IFZJREVPX1RZUEVcbiAgICB9LFxuICAgIDE6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDMyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA4NCwgY21kOiBSZXZlYWwubmV4dH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA5MywgY21kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgUmV2ZWFsLm5leHQoKTsgUmV2ZWFsLm5leHQoKTtcbiAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDExMCwgY21kOiBSZXZlYWwubmV4dH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMjAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEzMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTM5LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNzUsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDI6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDMwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA0MCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNTIsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDY0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA2OCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTAwLCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAzOiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiA5LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAyNiwgY21kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8kKCcuYmxvY2stMS1zbC00IHVsIGxpJykuZXEoMykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgLy8kKCcuYmxvY2stMy1zbC00IHVsIGxpJykuZXEoMClcbiAgICAgICAgICAgICAgICAvLyAgICAuaHRtbChcImhvYmJ5OiBnb2xmaW5nXCIpXG4gICAgICAgICAgICAgICAgLy8gICAgLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgIHRvZ2dsZVBsYXkodHJ1ZSk7XG5cbiAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDYwLCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICA0OiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiAxNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMzYsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDQ2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA0NywgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNTcsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDU4LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA2OCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogODcsIGNtZDogUmV2ZWFsLm5leHQgfSwvL1xuICAgICAgICAgICAgeyBkZWxheTogMTcyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxODQsIGNtZDogUmV2ZWFsLm5leHQgfVxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDU6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDMzLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA2NCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNzcsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDgwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMDAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE0MCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTY0LCBjbWQ6IFJldmVhbC5uZXh0IH1cblxuICAgICAgICBdLFxuICAgICAgICBtZWRpYVR5cGU6IEFVRElPX1RZUEVcbiAgICB9LFxuICAgIDY6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDQ4LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA2MCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogODgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDExMiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTM2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNDAsIGNtZDogUmV2ZWFsLm5leHQgfVxuXG4gICAgICAgIF0sXG4gICAgICAgIG1lZGlhVHlwZTogQVVESU9fVFlQRVxuICAgIH0sXG4gICAgNzoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMzYsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDc4LCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICA4OiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiAyOCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNjAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDY0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMjAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE1NiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjEyLCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICA5OiB7XG4gICAgICAgIHN0ZXBzOiBbXG4gICAgICAgICAgICB7IGRlbGF5OiA4LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA1NiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogODAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDg2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMTAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEyOCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTM2LCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAxMDoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMjAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDI0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAyOCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMzIsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDM2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA4NCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTEwLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMjAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEzMiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTc2LCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAxMToge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMzYsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDQ0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA3NiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTA4LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxMTAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDExNCwgY21kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdG9nZ2xlUGxheSh0cnVlKTtcbiAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEzNiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTY5LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxOTAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDIwNywgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjI3LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzMDQsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDM4MiwgY21kOiBSZXZlYWwubmV4dCB9XG4gICAgICAgIF0sXG4gICAgICAgIG1lZGlhVHlwZTogQVVESU9fVFlQRVxuICAgIH0sXG4gICAgMTI6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDQ0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA2OCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogOTcsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDExNCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTM0LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAxNTMsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDIwNSwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMjYxLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAyNzYsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDI4OSwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMzAzLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzMTYsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDM3OCwgY21kOiBSZXZlYWwubmV4dCB9XG4gICAgICAgIF0sXG4gICAgICAgIG1lZGlhVHlwZTogQVVESU9fVFlQRVxuICAgIH0sXG4gICAgMTM6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDEzMCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTQwLCBjbWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyQoJy5mdW5kLWJsb2NrJykuYWRkQ2xhc3MoJ21vdmVkJyk7XG4gICAgICAgICAgICB9fSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDE2MSwgY21kOiBSZXZlYWwubmV4dCB9XG5cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBBVURJT19UWVBFXG4gICAgfSxcbiAgICAxNDoge1xuICAgICAgICBzdGVwczogW1xuICAgICAgICAgICAgeyBkZWxheTogMjgsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDU2LCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiA3NiwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogOTIsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEyNCwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTkyLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAyMzIsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDI4NCwgY21kOiBSZXZlYWwubmV4dCB9XG4gICAgICAgIF0sXG4gICAgICAgIG1lZGlhVHlwZTogQVVESU9fVFlQRVxuICAgIH0sXG4gICAgMTU6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDIxLCBjbWQ6IFJldmVhbC5uZXh0IH0sXG4gICAgICAgICAgICB7IGRlbGF5OiAzOSwgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogNzAsIGNtZDogUmV2ZWFsLm5leHQgfSxcbiAgICAgICAgICAgIHsgZGVsYXk6IDEwMCwgY21kOiBSZXZlYWwubmV4dCB9XG4gICAgICAgIF0sXG4gICAgICAgIG1lZGlhVHlwZTogQVVESU9fVFlQRVxuICAgIH0sXG4gICAgMTY6IHtcbiAgICAgICAgc3RlcHM6IFtcbiAgICAgICAgICAgIHsgZGVsYXk6IDEyMywgY21kOiBSZXZlYWwubmV4dCB9LFxuICAgICAgICAgICAgeyBkZWxheTogMTQwLCBjbWQ6IFJldmVhbC5uZXh0IH1cbiAgICAgICAgXSxcbiAgICAgICAgbWVkaWFUeXBlOiBWSURFT19UWVBFXG4gICAgfVxufTtcblxuXG5cbnZhciB0b2dnbGVQbGF5ICA9IGZ1bmN0aW9uICh3aXRob3V0U2NyZWVuLCBhY3Rpb24pIHtcbiAgICB3aXRob3V0U2NyZWVuID0gdHlwZW9mIHdpdGhvdXRTY3JlZW4gPT09ICdib29sZWFuJyA/IHdpdGhvdXRTY3JlZW4gOiBmYWxzZTtcblxuICAgIGlmKCFtZWRpYUlzUmVhZHkpIHtcbiAgICAgICAgbG9hZGluZ01lZGlhTG9vcCgpO1xuICAgICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZihpc1BsYXlpbmcpIHsgLy9wYXVzZVxuICAgICAgICAkcGF1c2VCdG4ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAhd2l0aG91dFNjcmVlbiAmJiAkb3ZlcmxheS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgaXNQbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIGNoYW5nZU1lZGlhU3RhdGUoJ3BhdXNlJyk7XG4gICAgfSBlbHNleyAvL3BsYXlcbiAgICAgICAgJHBhdXNlQnRuLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgY2hhbmdlTWVkaWFTdGF0ZSgncGxheScpO1xuICAgICAgICAhd2l0aG91dFNjcmVlbiAmJiAkb3ZlcmxheS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICBpc1BsYXlpbmcgPSB0cnVlO1xuICAgICAgICBwbGF5TG9vcCgpO1xuICAgIH1cbn07XG5cbiRvdmVybGF5Lm9uKCdjbGljaycsIHRvZ2dsZVBsYXkpO1xuJHBhdXNlQnRuLm9uKCdjbGljaycsIHRvZ2dsZVBsYXkpO1xuJChBVURJT19UWVBFKVswXS5vbndhaXRpbmcgPSB0b2dnbGVQbGF5O1xuJChWSURFT19UWVBFKVswXS5vbndhaXRpbmcgPSB0b2dnbGVQbGF5O1xuXG4vL3NsaWRlIDNcbiQoJy5ob2JiaWVzLWxpc3QgbGknKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYoaXNQbGF5aW5nKSB7XG4gICAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZighJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuYWN0aXZlJykubGVuZ3RoKSB7XG4gICAgICAgIHRvZ2dsZVBsYXkodHJ1ZSk7XG4gICAgfVxuICAgICQodGhpcykucGFyZW50KCkuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAkKHRoaXMpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICQoJy5ibG9jay0zLXNsLTQgdWwgbGknKS5lcSgwKVxuICAgICAgICAuaHRtbChcImhvYmJ5OiBcIiArICQodGhpcykuaHRtbCgpKVxuICAgICAgICAuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG59KTtcblxuJCgnLnBhbmljLWJ0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAhaXNQbGF5aW5nICYmIHRvZ2dsZVBsYXkodHJ1ZSk7XG59KTtcblxuJCgnLmpzLXllcy1idG4sIC5qcy1uby1idG4nKS5vbignY2xpY2snLCBSZXZlYWwubmV4dCk7XG5cbi8vc2xpZGUgOFxuJCgnLnNhdmluZ3MtdGFibGUgdHInKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYoIWlzRmluaXNoZWQpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmKCEkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5hY3RpdmUnKS5sZW5ndGgpIHtcbiAgICAgICAgUmV2ZWFsLm5leHQoKTtcbiAgICB9XG4gICAgJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICQodGhpcykuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG5cbn0pO1xuXG5cblxudmFyIHBsYXlMb29wID0gZnVuY3Rpb24gKCkge1xuICAgIGlzRmluaXNoZWQgPSBmYWxzZTtcbiAgICB2YXIgY3VyclNsaWRlID0gbnVsbDtcbiAgICAvL2NvbnNvbGUubG9nKGxvb3BJbmRleCk7XG4gICAgaWYgKGlzUGxheWluZyAmJiBtZWRpYUlzUmVhZHkpIHtcbiAgICAgICAgY3VyclNsaWRlID0gUmV2ZWFsLmdldEluZGljZXMoKS5oO1xuXG4gICAgICAgIGlmIChzbGlkZXNbY3VyclNsaWRlXS5zdGVwc1tzdGVwSW5kZXhdKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHBsYXlMb29wLCAyNTApO1xuICAgICAgICAgICAgaWYgKHNsaWRlc1tjdXJyU2xpZGVdLnN0ZXBzW3N0ZXBJbmRleF0uZGVsYXkgPT09IGxvb3BJbmRleCkge1xuICAgICAgICAgICAgICAgIC8vbG9vcEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICBzbGlkZXNbY3VyclNsaWRlXS5zdGVwc1tzdGVwSW5kZXgrK10uY21kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZXtcbiAgICAgICAgICAgICRwYXVzZUJ0bi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICBpc0ZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBsb29wSW5kZXgrKztcbiAgICB9XG59O1xuXG52YXIgY2hhbmdlTWVkaWFTdGF0ZSA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcbiAgICB2YXIgbWVkaWFUeXBlID0gc2xpZGVzW1JldmVhbC5nZXRJbmRpY2VzKCkuaF0ubWVkaWFUeXBlO1xuXG4gICAgaWYobWVkaWFUeXBlID09PSBBVURJT19UWVBFKSB7XG4gICAgICAgICRhdWRpb1swXVthY3Rpb25dKCk7XG4gICAgfSBlbHNlIGlmKG1lZGlhVHlwZSA9PT0gVklERU9fVFlQRSkge1xuICAgICAgICAkKFJldmVhbC5nZXRDdXJyZW50U2xpZGUoKSkuZmluZCgndmlkZW8nKVswXVthY3Rpb25dKCk7XG4gICAgfVxufTtcblxudmFyIGxvYWRpbmdNZWRpYUxvb3AgPSBmdW5jdGlvbiAoc2xpZGVJbmRleCkge1xuICAgIC8vY29uc29sZS5sb2coXCJsb2FkaW5nLi4uXCIsICRhdWRpb1swXS5yZWFkeVN0YXRlICk7XG4gICAgdmFyIGluZGV4aCA9IHNsaWRlSW5kZXggfHwgUmV2ZWFsLmdldEluZGljZXMoKS5oO1xuICAgIHZhciBtZWRpYVR5cGUgPSBzbGlkZXNbaW5kZXhoXS5tZWRpYVR5cGU7XG5cblxuICAgIG1lZGlhSXNSZWFkeSA9IChtZWRpYVR5cGUgPT09IEFVRElPX1RZUEUgJiYgJGF1ZGlvWzBdLnJlYWR5U3RhdGUgPT09IDQpXG4gICAgICAgIHx8IChtZWRpYVR5cGUgPT09IFZJREVPX1RZUEUgJiYgICQoUmV2ZWFsLmdldEN1cnJlbnRTbGlkZSgpKS5maW5kKCd2aWRlbycpWzBdLnJlYWR5U3RhdGUgPT09IDQpO1xuXG5cbiAgICBpZiAobWVkaWFJc1JlYWR5KSB7XG4gICAgICAgIGluZGV4aCA+IDAgJiYgY2hhbmdlTWVkaWFTdGF0ZSgncGxheScpO1xuICAgICAgICBzZXRUaW1lb3V0KHBsYXlMb29wLCAyNTApO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQobG9hZGluZ01lZGlhTG9vcCwgMjUwKTtcbiAgICB9XG59O1xuXG5sb2FkaW5nTWVkaWFMb29wKCk7XG5cblxuXG5cblJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdzbGlkZWNoYW5nZWQnLCBmdW5jdGlvbihlKSB7XG4gICAgY29uc29sZS5sb2coXCJTTElERSBDSEFOR0VEXCIpO1xuICAgICRwYXVzZUJ0bi5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgbWVkaWFJc1JlYWR5ID0gZmFsc2U7XG4gICAgc3RlcEluZGV4ID0gMDtcbiAgICBsb29wSW5kZXggPSAwO1xuXG4gICAgdmFyIG1lZGlhRmlsZU51bWJlciA9IGUuaW5kZXhoICsgMTtcbiAgICBpZihzbGlkZXNbZS5pbmRleGhdLm1lZGlhVHlwZSA9PT0gQVVESU9fVFlQRSkge1xuICAgICAgICAkYXVkaW8uZmluZCgnc291cmNlJykuYXR0cignc3JjJywgQVVESU9fUEFUSCArIG1lZGlhRmlsZU51bWJlciArIFwiLm1wM1wiKTtcblxuICAgICAgICAkYXVkaW9bMF0ubG9hZCgpO1xuICAgIH1cblxuICAgIGxvYWRpbmdNZWRpYUxvb3AoZS5pbmRleGgpO1xufSk7XG5cblJldmVhbC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeScsIGZ1bmN0aW9uKCkge1xuICAgICQoJy5qcy1sb2FkZXInKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xufSk7XG5cbi8vUmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2ZyYWdtZW50c2hvd24nLCBmdW5jdGlvbihlKSB7XG4vLyAgICAvL3ZhciAkZWwgPSAkKGUuZnJhZ21lbnQpO1xuLy99KTtcbi8vXG4vL1JldmVhbC5hZGRFdmVudExpc3RlbmVyKCdmcmFnbWVudGhpZGRlbicsIGZ1bmN0aW9uKGUpIHtcbi8vICAgIC8vdmFyICRlbCA9ICQoZS5mcmFnbWVudCk7XG4vL30pO1xuXG4kKCcubmV4dC1idG4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgUmV2ZWFsLm5leHQoKTtcbn0pO1xuXG52YXIgJGNpcmNsZUl0ZW1zID0gJCgnLmNpcmNsZS1pdGVtcycpLFxuICAgICRjaXJjbGVzID0gJCgnLmNpcmNsZS1pdGVtcycpLmZpbmQoJy5jaXJjbGUnKTtcblxubmV3IERyYWdnYWJsZSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzLWZ1bmQtYmxvY2snKSx7XG4gICAgbGltaXQ6IHtcbiAgICAgICAgeDogWzI5NSwgODY1XSxcbiAgICAgICAgeTogWzAsIDBdXG4gICAgfSxcbiAgICBzZXRQb3NpdGlvbjogZmFsc2UsXG4gICAgb25EcmFnOiBmdW5jdGlvbiAoZWwsIHgsIHksIGUpIHtcbiAgICAgICAgJGNpcmNsZXMuZm9yRWFjaChmdW5jdGlvbiAoY2lyY2xlKSB7XG4gICAgICAgICAgICBpZihjaXJjbGUub2Zmc2V0TGVmdCA+PSB4ICYmIHggKyAxNDAgPj0gY2lyY2xlLm9mZnNldExlZnQgKyAxMzIpIHtcbiAgICAgICAgICAgICAgICAkY2lyY2xlSXRlbXMuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB2YXIgbGluZU51bWJlciA9ICQoY2lyY2xlKS5hdHRyKCdkYXRhLWxpbmUnKTtcbiAgICAgICAgICAgICAgICAkKCdbZGF0YS1saW5lPVwiJyArIGxpbmVOdW1iZXIgKyAnXCJdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBBVURJT19UWVBFIDogXCJhdWRpb1wiLFxuICAgIFZJREVPX1RZUEUgOiBcInZpZGVvXCIsXG4gICAgQVVESU9fUEFUSCA6IFwiLi9kYXRhL3BhZ2VcIlxufTtcblxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZGV0ZWN0SUU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgICAgICAgLy8gVGVzdCB2YWx1ZXM7IFVuY29tbWVudCB0byBjaGVjayByZXN1bHQg4oCmXG5cbiAgICAgICAgLy8gSUUgMTBcbiAgICAgICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKGNvbXBhdGlibGU7IE1TSUUgMTAuMDsgV2luZG93cyBOVCA2LjI7IFRyaWRlbnQvNi4wKSc7XG5cbiAgICAgICAgLy8gSUUgMTFcbiAgICAgICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgNi4zOyBUcmlkZW50LzcuMDsgcnY6MTEuMCkgbGlrZSBHZWNrbyc7XG5cbiAgICAgICAgLy8gRWRnZSAxMiAoU3BhcnRhbilcbiAgICAgICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV09XNjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8zOS4wLjIxNzEuNzEgU2FmYXJpLzUzNy4zNiBFZGdlLzEyLjAnO1xuXG4gICAgICAgIC8vIEVkZ2UgMTNcbiAgICAgICAgLy8gdWEgPSAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzQ2LjAuMjQ4Ni4wIFNhZmFyaS81MzcuMzYgRWRnZS8xMy4xMDU4Nic7XG5cbiAgICAgICAgdmFyIG1zaWUgPSB1YS5pbmRleE9mKCdNU0lFICcpO1xuICAgICAgICBpZiAobXNpZSA+IDApIHtcbiAgICAgICAgICAgIC8vIElFIDEwIG9yIG9sZGVyID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhtc2llICsgNSwgdWEuaW5kZXhPZignLicsIG1zaWUpKSwgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRyaWRlbnQgPSB1YS5pbmRleE9mKCdUcmlkZW50LycpO1xuICAgICAgICBpZiAodHJpZGVudCA+IDApIHtcbiAgICAgICAgICAgIC8vIElFIDExID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgICAgICAgdmFyIHJ2ID0gdWEuaW5kZXhPZigncnY6Jyk7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQodWEuc3Vic3RyaW5nKHJ2ICsgMywgdWEuaW5kZXhPZignLicsIHJ2KSksIDEwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBlZGdlID0gdWEuaW5kZXhPZignRWRnZS8nKTtcbiAgICAgICAgaWYgKGVkZ2UgPiAwKSB7XG4gICAgICAgICAgICAvLyBFZGdlIChJRSAxMispID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHVhLnN1YnN0cmluZyhlZGdlICsgNSwgdWEuaW5kZXhPZignLicsIGVkZ2UpKSwgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gb3RoZXIgYnJvd3NlclxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTsiLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5EcmFnZ2FibGUgPSBmYWN0b3J5KCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZGVmYXVsdHMgPSB7XG5cbiAgICAgICAgLy8gc2V0dGluZ3NcbiAgICAgICAgZ3JpZDogMCwgICAgICAgICAgICAgICAgLy8gZ3JpZCBjZWxsIHNpemUgZm9yIHNuYXBwaW5nIHRvIG9uIGRyYWdcbiAgICAgICAgZmlsdGVyVGFyZ2V0OiBudWxsLCAgICAgLy8gZGlzYWxsb3cgZHJhZyB3aGVuIHRhcmdldCBwYXNzZXMgdGhpcyB0ZXN0XG4gICAgICAgIGxpbWl0OiB7ICAgICAgICAgICAgICAgIC8vIGxpbWl0IHRoZSBkcmFnIGJvdW5kc1xuICAgICAgICAgICAgeDogbnVsbCwgICAgICAgICAgICAgIC8vIFttaW5pbXVtIHBvc2l0aW9uLCBtYXhpbXVtIHBvc2l0aW9uXSB8fCBwb3NpdGlvblxuICAgICAgICAgICAgeTogbnVsbCAgICAgICAgICAgICAgIC8vIFttaW5pbXVtIHBvc2l0aW9uLCBtYXhpbXVtIHBvc2l0aW9uXSB8fCBwb3NpdGlvblxuICAgICAgICB9LFxuICAgICAgICB0aHJlc2hvbGQ6IDAsICAgICAgICAgICAvLyB0aHJlc2hvbGQgdG8gbW92ZSBiZWZvcmUgZHJhZyBiZWdpbnMgKGluIHB4KVxuXG4gICAgICAgIC8vIGZsYWdzXG4gICAgICAgIHNldEN1cnNvcjogZmFsc2UsICAgICAgIC8vIGNoYW5nZSBjdXJzb3IgdG8gcmVmbGVjdCBkcmFnZ2FibGU/XG4gICAgICAgIHNldFBvc2l0aW9uOiB0cnVlLCAgICAgIC8vIGNoYW5nZSBkcmFnZ2FibGUgcG9zaXRpb24gdG8gYWJzb2x1dGU/XG4gICAgICAgIHNtb290aERyYWc6IHRydWUsICAgICAgIC8vIHNuYXAgdG8gZ3JpZCB3aGVuIGRyb3BwZWQsIGJ1dCBub3QgZHVyaW5nXG4gICAgICAgIHVzZUdQVTogdHJ1ZSwgICAgICAgICAgIC8vIG1vdmUgZ3JhcGhpY3MgY2FsY3VsYXRpb24vY29tcG9zaXRpb24gdG8gdGhlIEdQVVxuXG4gICAgICAgIC8vIGV2ZW50IGhvb2tzXG4gICAgICAgIG9uRHJhZzogbm9vcCwgICAgICAgICAgIC8vIGZ1bmN0aW9uKGVsZW1lbnQsIFgsIFksIGV2ZW50KVxuICAgICAgICBvbkRyYWdTdGFydDogbm9vcCwgICAgICAvLyBmdW5jdGlvbihlbGVtZW50LCBYLCBZLCBldmVudClcbiAgICAgICAgb25EcmFnRW5kOiBub29wICAgICAgICAgLy8gZnVuY3Rpb24oZWxlbWVudCwgWCwgWSwgZXZlbnQpXG5cbiAgICB9O1xuXG4gICAgdmFyIGVudiA9IHtcblxuICAgICAgICAvLyBDU1MgdmVuZG9yLXByZWZpeGVkIHRyYW5zZm9ybSBwcm9wZXJ0eVxuICAgICAgICB0cmFuc2Zvcm06IChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICB2YXIgcHJlZml4ZXMgPSAnIC1vLSAtbXMtIC1tb3otIC13ZWJraXQtJy5zcGxpdCgnICcpO1xuICAgICAgICAgICAgdmFyIHN0eWxlID0gZG9jdW1lbnQuYm9keS5zdHlsZTtcblxuICAgICAgICAgICAgZm9yICh2YXIgbiA9IHByZWZpeGVzLmxlbmd0aDsgbi0tOykge1xuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHByZWZpeGVzW25dICsgJ3RyYW5zZm9ybSc7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5IGluIHN0eWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSkoKVxuXG4gICAgfTtcblxuICAgIHZhciB1dGlsID0ge1xuXG4gICAgICAgIGFzc2lnbjogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgb2JqID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgdmFyIGNvdW50ID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yICggdmFyIG4gPSAxOyBuIDwgY291bnQ7IG4rKyApIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJndW1lbnQgPSBhcmd1bWVudHNbbl07XG4gICAgICAgICAgICAgICAgZm9yICggdmFyIGtleSBpbiBhcmd1bWVudCApIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0gPSBhcmd1bWVudFtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG9iajtcblxuICAgICAgICB9LFxuXG4gICAgICAgIGJpbmQ6IGZ1bmN0aW9uIChmbiwgY29udGV4dCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgb246IGZ1bmN0aW9uIChlbGVtZW50LCBlLCBmbikge1xuICAgICAgICAgICAgaWYgKGUgJiYgZm4pIHtcbiAgICAgICAgICAgICAgICB1dGlsLmFkZEV2ZW50IChlbGVtZW50LCBlLCBmbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBlZSBpbiBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHV0aWwuYWRkRXZlbnQgKGVsZW1lbnQsIGVlLCBlW2VlXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG9mZjogZnVuY3Rpb24gKGVsZW1lbnQsIGUsIGZuKSB7XG4gICAgICAgICAgICBpZiAoZSAmJiBmbikge1xuICAgICAgICAgICAgICAgIHV0aWwucmVtb3ZlRXZlbnQgKGVsZW1lbnQsIGUsIGZuKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGVlIGluIGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbC5yZW1vdmVFdmVudCAoZWxlbWVudCwgZWUsIGVbZWVdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gRXhhbXBsZTpcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgIHV0aWwubGltaXQoeCwgbGltaXQueClcbiAgICAgICAgbGltaXQ6IGZ1bmN0aW9uIChuLCBsaW1pdCkge1xuICAgICAgICAgICAgLy8ge0FycmF5fSBsaW1pdC54XG4gICAgICAgICAgICBpZiAoaXNBcnJheShsaW1pdCkpIHtcbiAgICAgICAgICAgICAgICBsaW1pdCA9IFsrbGltaXRbMF0sICtsaW1pdFsxXV07XG4gICAgICAgICAgICAgICAgaWYgKG4gPCBsaW1pdFswXSkgbiA9IGxpbWl0WzBdO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG4gPiBsaW1pdFsxXSkgbiA9IGxpbWl0WzFdO1xuICAgICAgICAgICAgICAgIC8vIHtOdW1iZXJ9IGxpbWl0LnhcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbiA9ICtsaW1pdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkRXZlbnQ6ICgnYXR0YWNoRXZlbnQnIGluIEVsZW1lbnQucHJvdG90eXBlKVxuICAgICAgICAgICAgPyBmdW5jdGlvbiAoZWxlbWVudCwgZSwgZm4pIHsgZWxlbWVudC5hdHRhY2hFdmVudCgnb24nK2UsIGZuKSB9XG4gICAgICAgICAgICA6IGZ1bmN0aW9uIChlbGVtZW50LCBlLCBmbikgeyBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZSwgZm4sIGZhbHNlKSB9LFxuXG4gICAgICAgIHJlbW92ZUV2ZW50OiAoJ2F0dGFjaEV2ZW50JyBpbiBFbGVtZW50LnByb3RvdHlwZSlcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKGVsZW1lbnQsIGUsIGZuKSB7IGVsZW1lbnQuZGV0YWNoRXZlbnQoJ29uJytlLCBmbikgfVxuICAgICAgICAgICAgOiBmdW5jdGlvbiAoZWxlbWVudCwgZSwgZm4pIHsgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGUsIGZuKSB9XG5cbiAgICB9O1xuXG4gICAgLypcbiAgICAgdXNhZ2U6XG5cbiAgICAgbmV3IERyYWdnYWJsZSAoZWxlbWVudCwgb3B0aW9ucylcbiAgICAgLSBvciAtXG4gICAgIG5ldyBEcmFnZ2FibGUgKGVsZW1lbnQpXG4gICAgICovXG5cbiAgICBmdW5jdGlvbiBEcmFnZ2FibGUgKGVsZW1lbnQsIG9wdGlvbnMpIHtcblxuICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgc3RhcnQgPSB1dGlsLmJpbmQobWUuc3RhcnQsIG1lKSxcbiAgICAgICAgICAgIGRyYWcgPSB1dGlsLmJpbmQobWUuZHJhZywgbWUpLFxuICAgICAgICAgICAgc3RvcCA9IHV0aWwuYmluZChtZS5zdG9wLCBtZSk7XG5cbiAgICAgICAgLy8gc2FuaXR5IGNoZWNrXG4gICAgICAgIGlmICghaXNFbGVtZW50KGVsZW1lbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdEcmFnZ2FibGUgZXhwZWN0cyBhcmd1bWVudCAwIHRvIGJlIGFuIEVsZW1lbnQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNldCBpbnN0YW5jZSBwcm9wZXJ0aWVzXG4gICAgICAgIHV0aWwuYXNzaWduKG1lLCB7XG5cbiAgICAgICAgICAgIC8vIERPTSBlbGVtZW50XG4gICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuXG4gICAgICAgICAgICAvLyBET00gZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgICAgIGhhbmRsZXJzOiB7XG4gICAgICAgICAgICAgICAgc3RhcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbW91c2Vkb3duOiBzdGFydCxcbiAgICAgICAgICAgICAgICAgICAgdG91Y2hzdGFydDogc3RhcnRcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1vdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbW91c2Vtb3ZlOiBkcmFnLFxuICAgICAgICAgICAgICAgICAgICBtb3VzZXVwOiBzdG9wLFxuICAgICAgICAgICAgICAgICAgICB0b3VjaG1vdmU6IGRyYWcsXG4gICAgICAgICAgICAgICAgICAgIHRvdWNoZW5kOiBzdG9wXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gb3B0aW9uc1xuICAgICAgICAgICAgb3B0aW9uczogdXRpbC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRpb25zKVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGluaXRpYWxpemVcbiAgICAgICAgbWUuaW5pdGlhbGl6ZSgpO1xuXG4gICAgfVxuXG4gICAgdXRpbC5hc3NpZ24gKERyYWdnYWJsZS5wcm90b3R5cGUsIHtcblxuICAgICAgICAvLyBwdWJsaWNcblxuICAgICAgICBzZXRPcHRpb246IGZ1bmN0aW9uIChwcm9wZXJ0eSwgdmFsdWUpIHtcblxuICAgICAgICAgICAgdmFyIG1lID0gdGhpcztcblxuICAgICAgICAgICAgbWUub3B0aW9uc1twcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIG1lLmluaXRpYWxpemUoKTtcblxuICAgICAgICAgICAgcmV0dXJuIG1lO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdmFyIGRyYWdFdmVudCA9IHRoaXMuZHJhZ0V2ZW50O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHg6IGRyYWdFdmVudC54LFxuICAgICAgICAgICAgICAgIHk6IGRyYWdFdmVudC55XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoeCwgeSkge1xuXG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGRyYWdFdmVudCA9IG1lLmRyYWdFdmVudDtcblxuICAgICAgICAgICAgZHJhZ0V2ZW50Lm9yaWdpbmFsID0ge1xuICAgICAgICAgICAgICAgIHg6IGRyYWdFdmVudC54LFxuICAgICAgICAgICAgICAgIHk6IGRyYWdFdmVudC55XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBtZS5tb3ZlKHgsIHkpO1xuXG4gICAgICAgICAgICByZXR1cm4gbWU7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBpbnRlcm5hbFxuXG4gICAgICAgIGRyYWdFdmVudDoge1xuICAgICAgICAgICAgc3RhcnRlZDogZmFsc2UsXG4gICAgICAgICAgICB4OiAwLFxuICAgICAgICAgICAgeTogMFxuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBtZS5lbGVtZW50LFxuICAgICAgICAgICAgICAgIHN0eWxlID0gZWxlbWVudC5zdHlsZSxcbiAgICAgICAgICAgICAgICBjb21wU3R5bGUgPSBnZXRTdHlsZShlbGVtZW50KSxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gbWUub3B0aW9ucyxcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0gPSBlbnYudHJhbnNmb3JtLFxuICAgICAgICAgICAgICAgIG9sZFRyYW5zZm9ybTtcblxuICAgICAgICAgICAgLy8gY2FjaGUgZWxlbWVudCBkaW1lbnNpb25zIChmb3IgcGVyZm9ybWFuY2UpXG5cbiAgICAgICAgICAgIHZhciBfZGltZW5zaW9ucyA9IG1lLl9kaW1lbnNpb25zID0ge1xuICAgICAgICAgICAgICAgIGhlaWdodDogZWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgICAgICAgbGVmdDogZWxlbWVudC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgIHRvcDogZWxlbWVudC5vZmZzZXRUb3AsXG4gICAgICAgICAgICAgICAgd2lkdGg6IGVsZW1lbnQub2Zmc2V0V2lkdGhcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIHNoaWZ0IGNvbXBvc2l0aW5nIG92ZXIgdG8gdGhlIEdQVSBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBpdCAoZm9yIHBlcmZvcm1hbmNlKVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy51c2VHUFUgJiYgdHJhbnNmb3JtKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBjb25jYXRlbmF0ZSB0byBhbnkgZXhpc3RpbmcgdHJhbnNmb3JtXG4gICAgICAgICAgICAgICAgLy8gc28gd2UgZG9uJ3QgYWNjaWRlbnRhbGx5IG92ZXJyaWRlIGl0XG4gICAgICAgICAgICAgICAgb2xkVHJhbnNmb3JtID0gY29tcFN0eWxlW3RyYW5zZm9ybV07XG5cbiAgICAgICAgICAgICAgICBpZiAob2xkVHJhbnNmb3JtID09PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICAgICAgb2xkVHJhbnNmb3JtID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3R5bGVbdHJhbnNmb3JtXSA9IG9sZFRyYW5zZm9ybSArICcgdHJhbnNsYXRlM2QoMCwwLDApJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gb3B0aW9uYWwgc3R5bGluZ1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zZXRQb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIHN0eWxlLmxlZnQgPSBfZGltZW5zaW9ucy5sZWZ0ICsgJ3B4JztcbiAgICAgICAgICAgICAgICBzdHlsZS50b3AgPSBfZGltZW5zaW9ucy50b3AgKyAncHgnO1xuICAgICAgICAgICAgICAgIHN0eWxlLmJvdHRvbSA9IHN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xuICAgICAgICAgICAgICAgIHN0eWxlLm1hcmdpbiA9IDA7XG4gICAgICAgICAgICAgICAgc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zZXRDdXJzb3IpIHtcbiAgICAgICAgICAgICAgICBzdHlsZS5jdXJzb3IgPSAnbW92ZSc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldCBsaW1pdFxuICAgICAgICAgICAgbWUuc2V0TGltaXQob3B0aW9ucy5saW1pdCk7XG5cbiAgICAgICAgICAgIC8vIHNldCBwb3NpdGlvbiBpbiBtb2RlbFxuICAgICAgICAgICAgdXRpbC5hc3NpZ24obWUuZHJhZ0V2ZW50LCB7XG4gICAgICAgICAgICAgICAgeDogX2RpbWVuc2lvbnMubGVmdCxcbiAgICAgICAgICAgICAgICB5OiBfZGltZW5zaW9ucy50b3BcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBhdHRhY2ggbW91c2Vkb3duIGV2ZW50XG4gICAgICAgICAgICB1dGlsLm9uKG1lLmVsZW1lbnQsIG1lLmhhbmRsZXJzLnN0YXJ0KTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGN1cnNvciA9IG1lLmdldEN1cnNvcihlKTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gbWUuZWxlbWVudDtcblxuICAgICAgICAgICAgLy8gZmlsdGVyIHRoZSB0YXJnZXQ/XG4gICAgICAgICAgICBpZiAoIW1lLnVzZVRhcmdldChlLnRhcmdldCB8fCBlLnNyY0VsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBwcmV2ZW50IGJyb3dzZXJzIGZyb20gdmlzdWFsbHkgZHJhZ2dpbmcgdGhlIGVsZW1lbnQncyBvdXRsaW5lXG4gICAgICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlOyAvLyBJRTEwXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldCBhIGhpZ2ggei1pbmRleCwganVzdCBpbiBjYXNlXG4gICAgICAgICAgICBtZS5kcmFnRXZlbnQub2xkWmluZGV4ID0gZWxlbWVudC5zdHlsZS56SW5kZXg7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9IDEwMDAwO1xuXG4gICAgICAgICAgICAvLyBzZXQgaW5pdGlhbCBwb3NpdGlvblxuICAgICAgICAgICAgbWUuc2V0Q3Vyc29yKGN1cnNvcik7XG4gICAgICAgICAgICBtZS5zZXRQb3NpdGlvbigpO1xuICAgICAgICAgICAgbWUuc2V0Wm9vbSgpO1xuXG4gICAgICAgICAgICAvLyBhZGQgZXZlbnQgbGlzdGVuZXJzXG4gICAgICAgICAgICB1dGlsLm9uKGRvY3VtZW50LCBtZS5oYW5kbGVycy5tb3ZlKTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIGRyYWc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGRyYWdFdmVudCA9IG1lLmRyYWdFdmVudCxcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gbWUuZWxlbWVudCxcbiAgICAgICAgICAgICAgICBpbml0aWFsQ3Vyc29yID0gbWUuX2N1cnNvcixcbiAgICAgICAgICAgICAgICBpbml0aWFsUG9zaXRpb24gPSBtZS5fZGltZW5zaW9ucyxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gbWUub3B0aW9ucyxcbiAgICAgICAgICAgICAgICB6b29tID0gaW5pdGlhbFBvc2l0aW9uLnpvb20sXG4gICAgICAgICAgICAgICAgY3Vyc29yID0gbWUuZ2V0Q3Vyc29yKGUpLFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCA9IG9wdGlvbnMudGhyZXNob2xkLFxuICAgICAgICAgICAgICAgIHNsaWRlU2NhbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2xpZGVzXCIpWzBdLnN0eWxlLnRyYW5zZm9ybS5zcGxpdChcInNjYWxlXCIpWzFdLFxuICAgICAgICAgICAgICAgIHBhcnNlZFNsaWRlU2NhbGUgPSBzbGlkZVNjYWxlID8gcGFyc2VGbG9hdChzbGlkZVNjYWxlLnJlcGxhY2UoL1xcKC8sXCJcIikucmVwbGFjZSgvXFwpLywgXCJcIikpIDogMSxcbiAgICAgICAgICAgICAgICBzbGlkZVpvb20gPSBwYXJzZUZsb2F0KGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzbGlkZXNcIilbMF0uc3R5bGUuem9vbSksXG4gICAgICAgICAgICAgICAgcGFyc2VkU2xpZGVab29tID0gc2xpZGVab29tIHx8IDEsXG4gICAgICAgICAgICAgICAgeCA9IChjdXJzb3IueCAtIGluaXRpYWxDdXJzb3IueCkgLyB6b29tIC8gcGFyc2VkU2xpZGVTY2FsZSAvIHBhcnNlZFNsaWRlWm9vbSArIGluaXRpYWxQb3NpdGlvbi5sZWZ0LFxuICAgICAgICAgICAgICAgIHkgPSAoY3Vyc29yLnkgLSBpbml0aWFsQ3Vyc29yLnkpIC8gem9vbSAvIHBhcnNlZFNsaWRlU2NhbGUgLyBwYXJzZWRTbGlkZVpvb20gKyBpbml0aWFsUG9zaXRpb24udG9wO1xuXG5cbiAgICAgICAgICAgIC8vIGNoZWNrIHRocmVzaG9sZFxuICAgICAgICAgICAgaWYgKCFkcmFnRXZlbnQuc3RhcnRlZCAmJiB0aHJlc2hvbGQgJiZcbiAgICAgICAgICAgICAgICAoTWF0aC5hYnMoaW5pdGlhbEN1cnNvci54IC0gY3Vyc29yLngpIDwgdGhyZXNob2xkKSAmJlxuICAgICAgICAgICAgICAgIChNYXRoLmFicyhpbml0aWFsQ3Vyc29yLnkgLSBjdXJzb3IueSkgPCB0aHJlc2hvbGQpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNhdmUgb3JpZ2luYWwgcG9zaXRpb24/XG4gICAgICAgICAgICBpZiAoIWRyYWdFdmVudC5vcmlnaW5hbCkge1xuICAgICAgICAgICAgICAgIGRyYWdFdmVudC5vcmlnaW5hbCA9IHsgeDogeCwgeTogeSB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyB0cmlnZ2VyIHN0YXJ0IGV2ZW50P1xuICAgICAgICAgICAgaWYgKCFkcmFnRXZlbnQuc3RhcnRlZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMub25EcmFnU3RhcnQoZWxlbWVudCwgeCwgeSwgZSk7XG4gICAgICAgICAgICAgICAgZHJhZ0V2ZW50LnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBtb3ZlIHRoZSBlbGVtZW50XG4gICAgICAgICAgICBpZiAobWUubW92ZSh4LCB5KSkge1xuXG4gICAgICAgICAgICAgICAgLy8gdHJpZ2dlciBkcmFnIGV2ZW50XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5vbkRyYWcoZWxlbWVudCwgZHJhZ0V2ZW50LngsIGRyYWdFdmVudC55LCBlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuXG4gICAgICAgIG1vdmU6IGZ1bmN0aW9uICh4LCB5KSB7XG5cbiAgICAgICAgICAgIHZhciBtZSA9IHRoaXMsXG4gICAgICAgICAgICAgICAgZHJhZ0V2ZW50ID0gbWUuZHJhZ0V2ZW50LFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBtZS5vcHRpb25zLFxuICAgICAgICAgICAgICAgIGdyaWQgPSBvcHRpb25zLmdyaWQsXG4gICAgICAgICAgICAgICAgc3R5bGUgPSBtZS5lbGVtZW50LnN0eWxlLFxuICAgICAgICAgICAgICAgIHBvcyA9IG1lLmxpbWl0KHgsIHksIGRyYWdFdmVudC5vcmlnaW5hbC54LCBkcmFnRXZlbnQub3JpZ2luYWwueSk7XG5cbiAgICAgICAgICAgIC8vIHNuYXAgdG8gZ3JpZD9cbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5zbW9vdGhEcmFnICYmIGdyaWQpIHtcbiAgICAgICAgICAgICAgICBwb3MgPSBtZS5yb3VuZCAocG9zLCBncmlkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbW92ZSBpdFxuICAgICAgICAgICAgaWYgKHBvcy54ICE9PSBkcmFnRXZlbnQueCB8fCBwb3MueSAhPT0gZHJhZ0V2ZW50LnkpIHtcblxuICAgICAgICAgICAgICAgIGRyYWdFdmVudC54ID0gcG9zLng7XG4gICAgICAgICAgICAgICAgZHJhZ0V2ZW50LnkgPSBwb3MueTtcbiAgICAgICAgICAgICAgICBzdHlsZS5sZWZ0ID0gcG9zLnggKyAncHgnO1xuICAgICAgICAgICAgICAgIHN0eWxlLnRvcCA9IHBvcy55ICsgJ3B4JztcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBzdG9wOiBmdW5jdGlvbiAoZSkge1xuXG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGRyYWdFdmVudCA9IG1lLmRyYWdFdmVudCxcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gbWUuZWxlbWVudCxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gbWUub3B0aW9ucyxcbiAgICAgICAgICAgICAgICBncmlkID0gb3B0aW9ucy5ncmlkLFxuICAgICAgICAgICAgICAgIHBvcztcblxuICAgICAgICAgICAgLy8gcmVtb3ZlIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICAgICAgdXRpbC5vZmYoZG9jdW1lbnQsIG1lLmhhbmRsZXJzLm1vdmUpO1xuXG4gICAgICAgICAgICAvLyByZXNlbnQgZWxlbWVudCdzIHotaW5kZXhcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuekluZGV4ID0gZHJhZ0V2ZW50Lm9sZFppbmRleDtcblxuICAgICAgICAgICAgLy8gc25hcCB0byBncmlkP1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc21vb3RoRHJhZyAmJiBncmlkKSB7XG4gICAgICAgICAgICAgICAgcG9zID0gbWUucm91bmQoeyB4OiBkcmFnRXZlbnQueCwgeTogZHJhZ0V2ZW50LnkgfSwgZ3JpZCk7XG4gICAgICAgICAgICAgICAgbWUubW92ZShwb3MueCwgcG9zLnkpO1xuICAgICAgICAgICAgICAgIHV0aWwuYXNzaWduKG1lLmRyYWdFdmVudCwgcG9zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gdHJpZ2dlciBkcmFnZW5kIGV2ZW50XG4gICAgICAgICAgICBpZiAobWUuZHJhZ0V2ZW50LnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLm9uRHJhZ0VuZChlbGVtZW50LCBkcmFnRXZlbnQueCwgZHJhZ0V2ZW50LnksIGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjbGVhciB0ZW1wIHZhcnNcbiAgICAgICAgICAgIG1lLnJlc2V0KCk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICByZXNldDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ0V2ZW50LnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIHJvdW5kOiBmdW5jdGlvbiAocG9zKSB7XG5cbiAgICAgICAgICAgIHZhciBncmlkID0gdGhpcy5vcHRpb25zLmdyaWQ7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgeDogZ3JpZCAqIE1hdGgucm91bmQocG9zLngvZ3JpZCksXG4gICAgICAgICAgICAgICAgeTogZ3JpZCAqIE1hdGgucm91bmQocG9zLnkvZ3JpZClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSxcblxuICAgICAgICBnZXRDdXJzb3I6IGZ1bmN0aW9uIChlKSB7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgeDogKGUudGFyZ2V0VG91Y2hlcyA/IGUudGFyZ2V0VG91Y2hlc1swXSA6IGUpLmNsaWVudFgsXG4gICAgICAgICAgICAgICAgeTogKGUudGFyZ2V0VG91Y2hlcyA/IGUudGFyZ2V0VG91Y2hlc1swXSA6IGUpLmNsaWVudFlcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgfSxcblxuICAgICAgICBzZXRDdXJzb3I6IGZ1bmN0aW9uICh4eSkge1xuXG4gICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSB4eTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIHNldExpbWl0OiBmdW5jdGlvbiAobGltaXQpIHtcblxuICAgICAgICAgICAgdmFyIG1lID0gdGhpcyxcbiAgICAgICAgICAgICAgICBfdHJ1ZSA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHg6eCwgeTp5IH07XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gbGltaXQgaXMgYSBmdW5jdGlvblxuICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24obGltaXQpKSB7XG5cbiAgICAgICAgICAgICAgICBtZS5saW1pdCA9IGxpbWl0O1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGxpbWl0IGlzIGFuIGVsZW1lbnRcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzRWxlbWVudChsaW1pdCkpIHtcblxuICAgICAgICAgICAgICAgIHZhciBkcmFnZ2FibGVTaXplID0gbWUuX2RpbWVuc2lvbnMsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA9IGxpbWl0LnNjcm9sbEhlaWdodCAtIGRyYWdnYWJsZVNpemUuaGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgICB3aWR0aCA9IGxpbWl0LnNjcm9sbFdpZHRoIC0gZHJhZ2dhYmxlU2l6ZS53aWR0aDtcblxuICAgICAgICAgICAgICAgIG1lLmxpbWl0ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IHV0aWwubGltaXQoeCwgWzAsIHdpZHRoXSksXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiB1dGlsLmxpbWl0KHksIFswLCBoZWlnaHRdKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBsaW1pdCBpcyBkZWZpbmVkXG4gICAgICAgICAgICBlbHNlIGlmIChsaW1pdCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIGRlZmluZWQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHg6IGlzRGVmaW5lZChsaW1pdC54KSxcbiAgICAgICAgICAgICAgICAgICAgeTogaXNEZWZpbmVkKGxpbWl0LnkpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB2YXIgX3gsIF95O1xuXG4gICAgICAgICAgICAgICAgLy8ge1VuZGVmaW5lZH0gbGltaXQueCwge1VuZGVmaW5lZH0gbGltaXQueVxuICAgICAgICAgICAgICAgIGlmICghZGVmaW5lZC54ICYmICFkZWZpbmVkLnkpIHtcblxuICAgICAgICAgICAgICAgICAgICBtZS5saW1pdCA9IF90cnVlO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBtZS5saW1pdCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IGRlZmluZWQueCA/IHV0aWwubGltaXQoeCwgbGltaXQueCkgOiB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGRlZmluZWQueSA/IHV0aWwubGltaXQoeSwgbGltaXQueSkgOiB5XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBsaW1pdCBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGBcbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgbWUubGltaXQgPSBfdHJ1ZTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgc2V0UG9zaXRpb246IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBtZS5lbGVtZW50LFxuICAgICAgICAgICAgICAgIHN0eWxlID0gZWxlbWVudC5zdHlsZTtcblxuICAgICAgICAgICAgdXRpbC5hc3NpZ24obWUuX2RpbWVuc2lvbnMsIHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBwYXJzZShzdHlsZS5sZWZ0KSB8fCBlbGVtZW50Lm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgdG9wOiBwYXJzZShzdHlsZS50b3ApIHx8IGVsZW1lbnQub2Zmc2V0VG9wXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIHNldFpvb206IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgbWUgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBtZS5lbGVtZW50O1xuICAgICAgICAgICAgdmFyIHpvb20gPSAxO1xuXG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50KSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgeiA9IGdldFN0eWxlKGVsZW1lbnQpLnpvb207XG5cbiAgICAgICAgICAgICAgICBpZiAoeiAmJiB6ICE9PSAnbm9ybWFsJykge1xuICAgICAgICAgICAgICAgICAgICB6b29tID0gejtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1lLl9kaW1lbnNpb25zLnpvb20gPSB6b29tO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXNlVGFyZ2V0OiBmdW5jdGlvbiAoZWxlbWVudCkge1xuXG4gICAgICAgICAgICB2YXIgZmlsdGVyVGFyZ2V0ID0gdGhpcy5vcHRpb25zLmZpbHRlclRhcmdldDtcblxuICAgICAgICAgICAgaWYgKGZpbHRlclRhcmdldCBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclRhcmdldChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHV0aWwub2ZmKHRoaXMuZWxlbWVudCwgdGhpcy5oYW5kbGVycy5zdGFydCk7XG4gICAgICAgICAgICB1dGlsLm9mZihkb2N1bWVudCwgdGhpcy5oYW5kbGVycy5tb3ZlKTtcblxuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIC8vIGhlbHBlcnNcblxuICAgIGZ1bmN0aW9uIHBhcnNlIChzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHN0cmluZywgMTApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFN0eWxlIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiAnY3VycmVudFN0eWxlJyBpbiBlbGVtZW50ID8gZWxlbWVudC5jdXJyZW50U3R5bGUgOiBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQXJyYXkgKHRoaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGluZyBpbnN0YW5jZW9mIEFycmF5OyAvLyBIVE1MRWxlbWVudFxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRGVmaW5lZCAodGhpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaW5nICE9PSB2b2lkIDAgJiYgdGhpbmcgIT09IG51bGw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNFbGVtZW50ICh0aGluZykge1xuICAgICAgICByZXR1cm4gdGhpbmcgaW5zdGFuY2VvZiBFbGVtZW50IHx8IHRoaW5nIGluc3RhbmNlb2YgZG9jdW1lbnQuY29uc3RydWN0b3I7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbiAodGhpbmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaW5nIGluc3RhbmNlb2YgRnVuY3Rpb247XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9vcCAoKXt9O1xuXG4gICAgcmV0dXJuIERyYWdnYWJsZTtcblxufSkpO1xuIl19

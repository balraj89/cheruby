! function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define([], e);
    else {
        var t;
        "undefined" != typeof window ? t = window : "undefined" != typeof global ? t = global : "undefined" != typeof self && (t = self);
        var n = t;
        (n = (n = n.Phaser || (n.Phaser = {})).Plugin || (n.Plugin = {})).Debug = e()
    }
}(function() {
    return function e(t, n, i) {
        function a(r, l) {
            if (!n[r]) {
                if (!t[r]) {
                    var o = "function" == typeof require && require;
                    if (!l && o) return o(r, !0);
                    if (s) return s(r, !0);
                    var h = new Error("Cannot find module '" + r + "'");
                    throw h.code = "MODULE_NOT_FOUND", h
                }
                var p = n[r] = {
                    exports: {}
                };
                t[r][0].call(p.exports, function(e) {
                    var n = t[r][1][e];
                    return a(n || e)
                }, p, p.exports, e, t, n, i)
            }
            return n[r].exports
        }
        for (var s = "function" == typeof require && require, r = 0; r < i.length; r++) a(i[r]);
        return a
    }({
        1: [function(e, t, n) {
            var i = e("./util/ui"),
                a = e("./styles/main.less"),
                s = e("./panels/Performance"),
                r = e("./panels/Scene");

            function l(e, t) {
                Phaser.Plugin.call(this, e, t), this.panels = {
                    performance: null,
                    scene: null
                }, this.tickTimings = {
                    lastStart: 0,
                    start: 0,
                    ms: 0
                }, this.timings = {
                    preUpdate: {
                        physics: 0,
                        state: 0,
                        plugins: 0,
                        stage: 0
                    },
                    update: {
                        state: 0,
                        stage: 0,
                        tweens: 0,
                        sound: 0,
                        input: 0,
                        physics: 0,
                        particles: 0,
                        plugins: 0
                    },
                    postUpdate: {
                        stage: 0,
                        plugins: 0
                    },
                    preRender: {
                        state: 0
                    },
                    render: {
                        renderer: 0,
                        plugins: 0,
                        state: 0
                    },
                    postRender: {
                        plugins: 0
                    }
                }, this._container = null, this._bar = null, this._stats = {
                    ms: null,
                    fps: null,
                    dpf: null,
                    ent: null
                }, this.timer = window.performance ? window.performance : Date
            }
            l.prototype = Object.create(Phaser.Plugin.prototype), l.prototype.constructor = l, l.PKG = e("../package.json"), l.VERSION = l.PKG.version, t.exports = l, l.prototype.init = function() {
                for (var e in this.panels.performance = new s(this.game, this), this.panels.scene = new r(this.game, this), i.addCss(a), document.body.appendChild(this._createElement()), this._bindEvents(), this.timings)
                    for (var t in this.timings[e]) this._wrap(this.game, t, e, t);
                for (var n in this._wrap(this, "game", "update"), this.panels) this.panels[n].init && this.panels[n].init.apply(this.panels[n], arguments)
            }, l.prototype.postUpdate = function() {
                for (var e in this.panels) this.panels[e].update && this.panels[e].active && this.panels[e].update();
                var t = Math.round(1e3 / (this.tickTimings.start - this.tickTimings.lastStart)),
                    n = this.game.renderer.renderSession.drawCount;
                t = t > 60 ? 60 : t, i.setText(this._stats.dpf.firstElementChild, void 0 === n ? "(N/A)" : n, 3), i.setText(this._stats.ms.firstElementChild, Math.round(this.tickTimings.ms), 4), i.setText(this._stats.fps.firstElementChild, Math.round(t), 2)
            }, l.prototype.mark = function(e) {
                this.panels.performance && this.panels.performance.mark(e)
            }, l.prototype.destroy = function() {
                for (var e in Phaser.Plugin.prototype.destroy.call(this), this.panels) this.panels[e].destroy();
                this.panels = null, this.tickTimings = null, this.timings = null, this._container = null, this._bar = null, this._stats = null, this.timer = null
            }, l.prototype._wrap = function(e, t, n, i) {
                e[t] && e[t][n] && (e[t][n] = function(e, t, n, i, a) {
                    var s = 0,
                        r = 0;
                    return "game" !== t || "update" !== n || i ? function() {
                        s = e.timer.now(), a.apply(this, arguments), r = e.timer.now(), e.timings[n][i] = r - s
                    } : function() {
                        s = e.timer.now(), e.tickTimings.lastStart = e.tickTimings.start, e.tickTimings.start = s, a.apply(this, arguments), r = e.timer.now(), e.tickTimings.ms = r - s
                    }
                }(this, t, n, i, e[t][n]))
            }, l.prototype._bindEvents = function() {
                var e, t = this;
                i.on(this._bar, "click", ".pdebug-menu-item", function(n) {
                    n.preventDefault();
                    var a = t.panels[n.target.getAttribute("href").replace("#", "")];
                    a && (e && (e.toggle(), i.removeClass(e._menuItem, "active"), e.name === a.name) ? e = null : (i.addClass(n.target, "active"), a.toggle(), e = a))
                })
            }, l.prototype._createElement = function() {
                var e = this._container = document.createElement("div"),
                    t = this._bar = document.createElement("div");
                for (var n in i.addClass(e, "pdebug"), e.appendChild(t), i.addClass(t, "pdebug-menu"), t.appendChild(this._createMenuHead()), t.appendChild(this._createMenuStats()), this.panels) t.appendChild(this.panels[n].createMenuElement()), e.appendChild(this.panels[n].createPanelElement());
                return e
            }, l.prototype._createMenuHead = function() {
                var e = document.createElement("span"),
                    t = this.game.renderType,
                    n = t === Phaser.WEBGL ? "WebGL" : t === Phaser.HEADLESS ? "Headless" : "Canvas";
                return i.addClass(e, "pdebug-head"), i.setText(e, "Phaser Debug (" + n + "):"), e
            }, l.prototype._createMenuStats = function() {
                var e = document.createElement("div");
                return i.addClass(e, "pdebug-stats"), this._stats.ms = document.createElement("span"), this._stats.fps = document.createElement("span"), this._stats.dpf = document.createElement("span"), i.addClass(this._stats.ms, "pdebug-stats-item ms"), i.setHtml(this._stats.ms, "<span>0</span> ms"), e.appendChild(this._stats.ms), i.addClass(this._stats.fps, "pdebug-stats-item fps"), i.setHtml(this._stats.fps, "<span>0</span> fps"), e.appendChild(this._stats.fps), i.addClass(this._stats.dpf, "pdebug-stats-item dpf"), i.setHtml(this._stats.dpf, "<span>0</span> draws"), e.appendChild(this._stats.dpf), e
            }
        }, {
            "../package.json": 10,
            "./panels/Performance": 15,
            "./panels/Scene": 16,
            "./styles/main.less": 17,
            "./util/ui": 19
        }],
        2: [function(e, t, n) {
            "use strict";
            var i = e("./handlebars/base"),
                a = e("./handlebars/safe-string").default,
                s = e("./handlebars/exception").default,
                r = e("./handlebars/utils"),
                l = e("./handlebars/runtime"),
                o = function() {
                    var e = new i.HandlebarsEnvironment;
                    return r.extend(e, i), e.SafeString = a, e.Exception = s, e.Utils = r, e.escapeExpression = r.escapeExpression, e.VM = l, e.template = function(t) {
                        return l.template(t, e)
                    }, e
                },
                h = o();
            h.create = o, h.default = h, n.default = h
        }, {
            "./handlebars/base": 3,
            "./handlebars/exception": 4,
            "./handlebars/runtime": 5,
            "./handlebars/safe-string": 6,
            "./handlebars/utils": 7
        }],
        3: [function(e, t, n) {
            "use strict";
            var i = e("./utils"),
                a = e("./exception").default;
            n.VERSION = "2.0.0";
            n.COMPILER_REVISION = 6;
            n.REVISION_CHANGES = {
                1: "<= 1.0.rc.2",
                2: "== 1.0.0-rc.3",
                3: "== 1.0.0-rc.4",
                4: "== 1.x.x",
                5: "== 2.0.0-alpha.x",
                6: ">= 2.0.0-beta.1"
            };
            var s = i.isArray,
                r = i.isFunction,
                l = i.toString;

            function o(e, t) {
                var n;
                this.helpers = e || {}, this.partials = t || {}, (n = this).registerHelper("helperMissing", function() {
                    if (1 !== arguments.length) throw new a("Missing helper: '" + arguments[arguments.length - 1].name + "'")
                }), n.registerHelper("blockHelperMissing", function(e, t) {
                    var a = t.inverse,
                        r = t.fn;
                    if (!0 === e) return r(this);
                    if (!1 === e || null == e) return a(this);
                    if (s(e)) return e.length > 0 ? (t.ids && (t.ids = [t.name]), n.helpers.each(e, t)) : a(this);
                    if (t.data && t.ids) {
                        var l = d(t.data);
                        l.contextPath = i.appendContextPath(t.data.contextPath, t.name), t = {
                            data: l
                        }
                    }
                    return r(e, t)
                }), n.registerHelper("each", function(e, t) {
                    if (!t) throw new a("Must pass iterator to #each");
                    var n, l, o = t.fn,
                        h = t.inverse,
                        p = 0,
                        u = "";
                    if (t.data && t.ids && (l = i.appendContextPath(t.data.contextPath, t.ids[0]) + "."), r(e) && (e = e.call(this)), t.data && (n = d(t.data)), e && "object" == typeof e)
                        if (s(e))
                            for (var c = e.length; p < c; p++) n && (n.index = p, n.first = 0 === p, n.last = p === e.length - 1, l && (n.contextPath = l + p)), u += o(e[p], {
                                data: n
                            });
                        else
                            for (var f in e) e.hasOwnProperty(f) && (n && (n.key = f, n.index = p, n.first = 0 === p, l && (n.contextPath = l + f)), u += o(e[f], {
                                data: n
                            }), p++);
                    return 0 === p && (u = h(this)), u
                }), n.registerHelper("if", function(e, t) {
                    return r(e) && (e = e.call(this)), !t.hash.includeZero && !e || i.isEmpty(e) ? t.inverse(this) : t.fn(this)
                }), n.registerHelper("unless", function(e, t) {
                    return n.helpers.if.call(this, e, {
                        fn: t.inverse,
                        inverse: t.fn,
                        hash: t.hash
                    })
                }), n.registerHelper("with", function(e, t) {
                    r(e) && (e = e.call(this));
                    var n = t.fn;
                    if (i.isEmpty(e)) return t.inverse(this);
                    if (t.data && t.ids) {
                        var a = d(t.data);
                        a.contextPath = i.appendContextPath(t.data.contextPath, t.ids[0]), t = {
                            data: a
                        }
                    }
                    return n(e, t)
                }), n.registerHelper("log", function(e, t) {
                    var i = t.data && null != t.data.level ? parseInt(t.data.level, 10) : 1;
                    n.log(i, e)
                }), n.registerHelper("lookup", function(e, t) {
                    return e && e[t]
                })
            }
            n.HandlebarsEnvironment = o, o.prototype = {
                constructor: o,
                logger: h,
                log: p,
                registerHelper: function(e, t) {
                    if ("[object Object]" === l.call(e)) {
                        if (t) throw new a("Arg not supported with multiple helpers");
                        i.extend(this.helpers, e)
                    } else this.helpers[e] = t
                },
                unregisterHelper: function(e) {
                    delete this.helpers[e]
                },
                registerPartial: function(e, t) {
                    "[object Object]" === l.call(e) ? i.extend(this.partials, e) : this.partials[e] = t
                },
                unregisterPartial: function(e) {
                    delete this.partials[e]
                }
            };
            var h = {
                methodMap: {
                    0: "debug",
                    1: "info",
                    2: "warn",
                    3: "error"
                },
                DEBUG: 0,
                INFO: 1,
                WARN: 2,
                ERROR: 3,
                level: 3,
                log: function(e, t) {
                    if (h.level <= e) {
                        var n = h.methodMap[e];
                        "undefined" != typeof console && console[n] && console[n].call(console, t)
                    }
                }
            };
            n.logger = h;
            var p = h.log;
            n.log = p;
            var d = function(e) {
                var t = i.extend({}, e);
                return t._parent = e, t
            };
            n.createFrame = d
        }, {
            "./exception": 4,
            "./utils": 7
        }],
        4: [function(e, t, n) {
            "use strict";
            var i = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];

            function a(e, t) {
                var n;
                t && t.firstLine && (e += " - " + (n = t.firstLine) + ":" + t.firstColumn);
                for (var a = Error.prototype.constructor.call(this, e), s = 0; s < i.length; s++) this[i[s]] = a[i[s]];
                n && (this.lineNumber = n, this.column = t.firstColumn)
            }
            a.prototype = new Error, n.default = a
        }, {}],
        5: [function(e, t, n) {
            "use strict";
            var i = e("./utils"),
                a = e("./exception").default,
                s = e("./base").COMPILER_REVISION,
                r = e("./base").REVISION_CHANGES,
                l = e("./base").createFrame;

            function o(e, t, n, i, a) {
                var s = function(t, s) {
                    return s = s || {}, n.call(e, t, e.helpers, e.partials, s.data || i, a && [t].concat(a))
                };
                return s.program = t, s.depth = a ? a.length : 0, s
            }
            n.checkRevision = function(e) {
                var t = e && e[0] || 1;
                if (t !== s) {
                    if (t < s) {
                        var n = r[s],
                            i = r[t];
                        throw new a("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + n + ") or downgrade your runtime to an older version (" + i + ").")
                    }
                    throw new a("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + e[1] + ").")
                }
            }, n.template = function(e, t) {
                if (!t) throw new a("No environment passed to template");
                if (!e || !e.main) throw new a("Unknown template object: " + typeof e);
                t.VM.checkRevision(e.compiler);
                var n = {
                        lookup: function(e, t) {
                            for (var n = e.length, i = 0; i < n; i++)
                                if (e[i] && null != e[i][t]) return e[i][t]
                        },
                        lambda: function(e, t) {
                            return "function" == typeof e ? e.call(t) : e
                        },
                        escapeExpression: i.escapeExpression,
                        invokePartial: function(n, s, r, l, o, h, p, d, u) {
                            o && (l = i.extend({}, l, o));
                            var c = t.VM.invokePartial.call(this, n, r, l, h, p, d, u);
                            if (null == c && t.compile) {
                                var f = {
                                    helpers: h,
                                    partials: p,
                                    data: d,
                                    depths: u
                                };
                                p[r] = t.compile(n, {
                                    data: void 0 !== d,
                                    compat: e.compat
                                }, t), c = p[r](l, f)
                            }
                            if (null != c) {
                                if (s) {
                                    for (var g = c.split("\n"), b = 0, m = g.length; b < m && (g[b] || b + 1 !== m); b++) g[b] = s + g[b];
                                    c = g.join("\n")
                                }
                                return c
                            }
                            throw new a("The partial " + r + " could not be compiled when running in runtime-only mode")
                        },
                        fn: function(t) {
                            return e[t]
                        },
                        programs: [],
                        program: function(e, t, n) {
                            var i = this.programs[e],
                                a = this.fn(e);
                            return t || n ? i = o(this, e, a, t, n) : i || (i = this.programs[e] = o(this, e, a)), i
                        },
                        data: function(e, t) {
                            for (; e && t--;) e = e._parent;
                            return e
                        },
                        merge: function(e, t) {
                            var n = e || t;
                            return e && t && e !== t && (n = i.extend({}, t, e)), n
                        },
                        noop: t.VM.noop,
                        compilerInfo: e.compiler
                    },
                    s = function(t, i) {
                        var a, r = (i = i || {}).data;
                        return s._setup(i), !i.partial && e.useData && (r = function(e, t) {
                            return t && "root" in t || ((t = t ? l(t) : {}).root = e), t
                        }(t, r)), e.useDepths && (a = i.depths ? [t].concat(i.depths) : [t]), e.main.call(n, t, n.helpers, n.partials, r, a)
                    };
                return s.isTop = !0, s._setup = function(i) {
                    i.partial ? (n.helpers = i.helpers, n.partials = i.partials) : (n.helpers = n.merge(i.helpers, t.helpers), e.usePartial && (n.partials = n.merge(i.partials, t.partials)))
                }, s._child = function(t, i, s) {
                    if (e.useDepths && !s) throw new a("must pass parent depths");
                    return o(n, t, e[t], i, s)
                }, s
            }, n.program = o, n.invokePartial = function(e, t, n, i, s, r, l) {
                var o = {
                    partial: !0,
                    helpers: i,
                    partials: s,
                    data: r,
                    depths: l
                };
                if (void 0 === e) throw new a("The partial " + t + " could not be found");
                if (e instanceof Function) return e(n, o)
            }, n.noop = function() {
                return ""
            }
        }, {
            "./base": 3,
            "./exception": 4,
            "./utils": 7
        }],
        6: [function(e, t, n) {
            "use strict";

            function i(e) {
                this.string = e
            }
            i.prototype.toString = function() {
                return "" + this.string
            }, n.default = i
        }, {}],
        7: [function(e, t, n) {
            "use strict";
            var i = e("./safe-string").default,
                a = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#x27;",
                    "`": "&#x60;"
                },
                s = /[&<>"'`]/g,
                r = /[&<>"'`]/;

            function l(e) {
                return a[e]
            }
            n.extend = function(e) {
                for (var t = 1; t < arguments.length; t++)
                    for (var n in arguments[t]) Object.prototype.hasOwnProperty.call(arguments[t], n) && (e[n] = arguments[t][n]);
                return e
            };
            var o, h = Object.prototype.toString;
            n.toString = h, (o = function(e) {
                return "function" == typeof e
            })(/x/) && (o = function(e) {
                return "function" == typeof e && "[object Function]" === h.call(e)
            }), n.isFunction = o;
            var p = Array.isArray || function(e) {
                return !(!e || "object" != typeof e) && "[object Array]" === h.call(e)
            };
            n.isArray = p, n.escapeExpression = function(e) {
                return e instanceof i ? e.toString() : null == e ? "" : e ? (e = "" + e, r.test(e) ? e.replace(s, l) : e) : e + ""
            }, n.isEmpty = function(e) {
                return !e && 0 !== e || !(!p(e) || 0 !== e.length)
            }, n.appendContextPath = function(e, t) {
                return (e ? e + "." : "") + t
            }
        }, {
            "./safe-string": 6
        }],
        8: [function(e, t, n) {
            t.exports = e("./dist/cjs/handlebars.runtime")
        }, {
            "./dist/cjs/handlebars.runtime": 2
        }],
        9: [function(e, t, n) {
            t.exports = e("handlebars/runtime").default
        }, {
            "handlebars/runtime": 8
        }],
        10: [function(e, t, n) {
            t.exports = {
                name: "phaser-debug",
                version: "1.1.9",
                description: "Simple debug module for phaser",
                author: "Chad Engler <chad@pantherdev.com>",
                license: "MIT",
                homepage: "https://github.com/englercj/phaser-debug",
                repository: {
                    type: "git",
                    url: "https://github.com/englercj/phaser-debug.git"
                },
                bugs: {
                    url: "https://github.com/englercj/phaser-debug/issues"
                },
                keywords: ["phaser", "debug", "html5", "game", "engine"],
                dependencies: {
                    handlebars: "^2.0.0",
                    "node-lessify": "^0.0.5",
                    hbsfy: "^2.1.0"
                },
                devDependencies: {
                    browserify: "^5.11.1",
                    "event-stream": "^3.1.7",
                    gulp: "^3.8.8",
                    "gulp-bump": "^0.1.11",
                    "gulp-git": "^0.5.3",
                    "gulp-jshint": "^1.8.4",
                    "gulp-util": "^3.0.1",
                    "jshint-summary": "^0.4.0",
                    "vinyl-source-stream": "^0.1.1",
                    watchify: "^1.0.2"
                },
                main: "./dist/phaser-debug.js",
                browser: "./src/index.js",
                browserify: {
                    transform: ["hbsfy", "node-lessify"],
                    "transform-options": {
                        "node-lessify": "textMode"
                    }
                }
            }
        }, {}],
        11: [function(e, t, n) {
            var i = e("hbsfy/runtime");
            t.exports = i.template({
                1: function(e, t, n, i) {
                    var a, s = this.lambda;
                    return "    <label>Children:</label>\n    <strong>" + (0, this.escapeExpression)(s(null != (a = null != e ? e.children : e) ? a.length : a, e)) + "</strong>\n    <br/>\n"
                },
                3: function(e, t, n, i) {
                    var a, s = "    <label>Texture:</label>\n";
                    return null != (a = t.if.call(e, null != (a = null != (a = null != (a = null != e ? e.texture : e) ? a.baseTexture : a) ? a.source : a) ? a.src : a, {
                        name: "if",
                        hash: {},
                        fn: this.program(4, i),
                        inverse: this.program(6, i),
                        data: i
                    })) && (s += a), s + "    <br/>\n"
                },
                4: function(e, t, n, i) {
                    var a, s = this.lambda,
                        r = this.escapeExpression;
                    return '        <a href="' + r(s(null != (a = null != (a = null != (a = null != e ? e.texture : e) ? a.baseTexture : a) ? a.source : a) ? a.src : a, e)) + '" target="_blank">' + r(s(null != (a = null != (a = null != (a = null != e ? e.texture : e) ? a.baseTexture : a) ? a.source : a) ? a.src : a, e)) + "</a>\n"
                },
                6: function(e, t, n, i) {
                    var a, s = this.lambda;
                    return "        <strong>" + (0, this.escapeExpression)(s(null != (a = null != (a = null != e ? e.texture : e) ? a.baseTexture : a) ? a.source : a, e)) + "</strong>\n"
                },
                compiler: [6, ">= 2.0.0-beta.1"],
                main: function(e, t, n, i) {
                    var a, s, r = t.helperMissing,
                        l = this.escapeExpression,
                        o = this.lambda,
                        h = "<br/><br/>\n\n<label>Name:</label>\n<strong>" + l("function" == typeof(s = null != (s = t.name || (null != e ? e.name : e)) ? s : r) ? s.call(e, {
                            name: "name",
                            hash: {},
                            data: i
                        }) : s) + "</strong>\n<br/>\n\n<label>Type:</label>\n<strong>" + l("function" == typeof(s = null != (s = t.typeString || (null != e ? e.typeString : e)) ? s : r) ? s.call(e, {
                            name: "typeString",
                            hash: {},
                            data: i
                        }) : s) + "</strong>\n<br/>\n\n<label>Visible:</label>\n<strong>" + l("function" == typeof(s = null != (s = t.visible || (null != e ? e.visible : e)) ? s : r) ? s.call(e, {
                            name: "visible",
                            hash: {},
                            data: i
                        }) : s) + "</strong>\n<br/>\n\n<label>Rotation:</label>\n<strong>" + l("function" == typeof(s = null != (s = t.rotation || (null != e ? e.rotation : e)) ? s : r) ? s.call(e, {
                            name: "rotation",
                            hash: {},
                            data: i
                        }) : s) + "</strong>\n<br/>\n\n<label>Position:</label>\n<strong>" + l(o(null != (a = null != e ? e.position : e) ? a.x : a, e)) + "</strong> x <strong>" + l(o(null != (a = null != e ? e.position : e) ? a.y : a, e)) + "</strong>\n<br/>\n\n<label>Scale:</label>\n<strong>" + l(o(null != (a = null != e ? e.scale : e) ? a.x : a, e)) + "</strong> x <strong>" + l(o(null != (a = null != e ? e.scale : e) ? a.y : a, e)) + "</strong>\n<br/>\n\n<label>Alpha:</label>\n<strong>" + l("function" == typeof(s = null != (s = t.alpha || (null != e ? e.alpha : e)) ? s : r) ? s.call(e, {
                            name: "alpha",
                            hash: {},
                            data: i
                        }) : s) + "</strong>\n<br/>\n\n<hr />\n\n<label>World Visible:</label>\n<strong>" + l("function" == typeof(s = null != (s = t.worldVisible || (null != e ? e.worldVisible : e)) ? s : r) ? s.call(e, {
                            name: "worldVisible",
                            hash: {},
                            data: i
                        }) : s) + "</strong>\n<br/>\n\n<label>World Rotation:</label>\n<strong>" + l("function" == typeof(s = null != (s = t.worldRotation || (null != e ? e.worldRotation : e)) ? s : r) ? s.call(e, {
                            name: "worldRotation",
                            hash: {},
                            data: i
                        }) : s) + "</strong>\n<br/>\n\n<label>World Position:</label>\n<strong>" + l(o(null != (a = null != e ? e.worldPosition : e) ? a.x : a, e)) + "</strong> x <strong>" + l(o(null != (a = null != e ? e.worldPosition : e) ? a.y : a, e)) + "</strong>\n<br/>\n\n<label>World Scale:</label>\n<strong>" + l(o(null != (a = null != e ? e.worldScale : e) ? a.x : a, e)) + "</strong> x <strong>" + l(o(null != (a = null != e ? e.worldScale : e) ? a.y : a, e)) + "</strong>\n<br/>\n\n<label>World Alpha:</label>\n<strong>" + l("function" == typeof(s = null != (s = t.worldAlpha || (null != e ? e.worldAlpha : e)) ? s : r) ? s.call(e, {
                            name: "worldAlpha",
                            hash: {},
                            data: i
                        }) : s) + "</strong>\n<br/>\n\n<hr />\n\n";
                    return null != (a = t.if.call(e, null != e ? e.children : e, {
                        name: "if",
                        hash: {},
                        fn: this.program(1, i),
                        inverse: this.noop,
                        data: i
                    })) && (h += a), h += "\n", null != (a = t.if.call(e, null != e ? e.texture : e, {
                        name: "if",
                        hash: {},
                        fn: this.program(3, i),
                        inverse: this.noop,
                        data: i
                    })) && (h += a), h
                },
                useData: !0
            })
        }, {
            "hbsfy/runtime": 9
        }],
        12: [function(e, t, n) {
            var i = e("hbsfy/runtime");
            t.exports = i.template({
                compiler: [6, ">= 2.0.0-beta.1"],
                main: function(e, t, n, i) {
                    return '<ul class="sidebar">\n</ul>\n\n<a href="#" class="refresh">refresh</a>\n<div class="details">\n</div>\n'
                },
                useData: !0
            })
        }, {
            "hbsfy/runtime": 9
        }],
        13: [function(e, t, n) {
            var i = e("hbsfy/runtime");
            t.exports = i.template({
                1: function(e, t, n, i) {
                    var a, s = t.helperMissing;
                    return '        <span class="weak">(' + (0, this.escapeExpression)("function" == typeof(a = null != (a = t.name || (null != e ? e.name : e)) ? a : s) ? a.call(e, {
                        name: "name",
                        hash: {},
                        data: i
                    }) : a) + ")</span>\n"
                },
                3: function(e, t, n, i) {
                    var a, s = "        <ul>\n";
                    return null != (a = t.each.call(e, null != e ? e.children : e, {
                        name: "each",
                        hash: {},
                        fn: this.program(4, i),
                        inverse: this.noop,
                        data: i
                    })) && (s += a), s + "        </ul>\n"
                },
                4: function(e, t, n, i) {
                    var a, s = "";
                    return null != (a = this.invokePartial(n.sceneTree, "                ", "sceneTree", e, void 0, t, n, i)) && (s += a), s
                },
                compiler: [6, ">= 2.0.0-beta.1"],
                main: function(e, t, n, i) {
                    var a, s, r = t.helperMissing,
                        l = this.escapeExpression,
                        o = l("function" == typeof(s = null != (s = t.listItemOpen || (null != e ? e.listItemOpen : e)) ? s : r) ? s.call(e, {
                            name: "listItemOpen",
                            hash: {},
                            data: i
                        }) : s) + "\n    " + l("function" == typeof(s = null != (s = t.typeString || (null != e ? e.typeString : e)) ? s : r) ? s.call(e, {
                            name: "typeString",
                            hash: {},
                            data: i
                        }) : s) + "\n\n";
                    return null != (a = t.if.call(e, null != e ? e.name : e, {
                        name: "if",
                        hash: {},
                        fn: this.program(1, i),
                        inverse: this.noop,
                        data: i
                    })) && (o += a), o += "\n", null != (a = t.if.call(e, null != e ? e.children : e, {
                        name: "if",
                        hash: {},
                        fn: this.program(3, i),
                        inverse: this.noop,
                        data: i
                    })) && (o += a), o + "</li>\n"
                },
                usePartial: !0,
                useData: !0
            })
        }, {
            "hbsfy/runtime": 9
        }],
        14: [function(e, t, n) {
            var i = e("../util/ui");

            function a(e, t) {
                this.game = e, this.parent = t, this.name = "", this.title = "", this.active = !1, this._panel = null
            }
            a.prototype.constructor = a, t.exports = a, a.prototype.createPanelElement = function() {
                var e = this._panel = document.createElement("div");
                return i.addClass(e, "pdebug-panel " + this.name), e
            }, a.prototype.createMenuElement = function() {
                var e = this._menuItem = document.createElement("a");
                return e.href = "#" + this.name, i.addClass(e, "pdebug-menu-item " + this.name), i.setText(e, this.title), e
            }, a.prototype.toggle = function() {
                this.active ? this.hide() : this.show()
            }, a.prototype.show = function() {
                this.active = !0, i.setStyle(this._panel, "display", "block")
            }, a.prototype.hide = function() {
                this.active = !1, i.setStyle(this._panel, "display", "none")
            }, a.prototype.destroy = function() {
                this.game = null, this.parent = null, this.name = null, this.title = null, this.active = null, this._panel = null
            }
        }, {
            "../util/ui": 19
        }],
        15: [function(e, t, n) {
            var i = e("./Panel"),
                a = e("../util/Graph");

            function s(e, t) {
                i.call(this, e, t), this.name = "performance", this.title = "Performance", this.eventQueue = [], this.graph = null, this.colorPalettes = {
                    _default: ["#058DC7", "#50B432", "#ED561B", "#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#FFF263", "#6AF9C4", "#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"]
                }
            }
            s.prototype = Object.create(i.prototype), s.prototype.constructor = s, t.exports = s, s.prototype.createPanelElement = function() {
                var e = i.prototype.createPanelElement.call(this);
                return this.graph = new a(e, window.innerWidth - 20, 256, this.colorPalettes._default), e
            }, s.prototype.update = function() {
                this.graph.addData(this.parent.timings, this.eventQueue.shift())
            }, s.prototype.mark = function(e) {
                this.eventQueue.push(e)
            }, s.prototype.destroy = function() {
                i.prototype.destroy.call(this), this.graph.destroy(), this.eventQueue = null, this.graph = null, this.colorPalettes = null
            }
        }, {
            "../util/Graph": 18,
            "./Panel": 14
        }],
        16: [function(e, t, n) {
            var i = e("./Panel"),
                a = e("../util/ui"),
                s = e("hbsfy/runtime"),
                r = e("../hbs/scene/panel.hbs"),
                l = e("../hbs/scene/details.hbs"),
                o = e("../hbs/scene/tree.hbs"),
                h = {},
                p = 0;

            function d(e, t) {
                i.call(this, e, t), this.name = "scene", this.title = "Scene Tree", this._tree = null, this.tree = null, this.details = null, this.refresh = null, this.selected = null
            }
            s.registerPartial("sceneDetails", l), s.registerPartial("sceneTree", o), s.registerHelper("typeString", function() {
                if (void 0 === this.type) return this instanceof Phaser.Stage ? "Stage" : void 0 !== PIXI.Stage && this instanceof PIXI.Stage ? "PIXI Stage" : this instanceof PIXI.Sprite ? "PIXI Sprite" : this instanceof PIXI.DisplayObjectContainer ? "PIXI DisplayObjectContainer" : this instanceof PIXI.DisplayObject ? "PIXI DisplayObject" : "Unknown";
                switch (this.type) {
                    case Phaser.SPRITE:
                        return "Sprite";
                    case Phaser.BUTTON:
                        return "Button";
                    case Phaser.IMAGE:
                        return "Image";
                    case Phaser.GRAPHICS:
                        return "Graphics";
                    case Phaser.TEXT:
                        return "Text";
                    case Phaser.TILESPRITE:
                        return "Tile Sprite";
                    case Phaser.BITMAPTEXT:
                        return "Bitmap Text";
                    case Phaser.GROUP:
                        return "Group";
                    case Phaser.RENDERTEXTURE:
                        return "Render Texture";
                    case Phaser.TILEMAP:
                        return "Tilemap";
                    case Phaser.TILEMAPLAYER:
                        return "Tilemap Layer";
                    case Phaser.EMITTER:
                        return "Emitter";
                    case Phaser.POLYGON:
                        return "Polygon";
                    case Phaser.BITMAPDATA:
                        return "Bitmap Data";
                    case Phaser.CANVAS_FILTER:
                        return "Canvas Filter";
                    case Phaser.WEBGL_FILTER:
                        return "WebGL Filter";
                    case Phaser.ELLIPSE:
                        return "Ellipse";
                    case Phaser.SPRITEBATCH:
                        return "Sprite Batch";
                    case Phaser.RETROFONT:
                        return "Retro Font";
                    case Phaser.POINTER:
                        return "Pointer";
                    case Phaser.ROPE:
                        return "Rope";
                    default:
                        return "Unknown"
                }
            }), s.registerHelper("listItemOpen", function() {
                return h[++p] = this, new s.SafeString("<li " + (this.children && this.children.length ? 'class="has-children" ' : "") + 'data-id="' + p + '">')
            }), d.prototype = Object.create(i.prototype), d.prototype.constructor = d, t.exports = d, d.prototype.createPanelElement = function() {
                return i.prototype.createPanelElement.call(this), this._panel.innerHTML = r(this.game.stage), this.tree = this._panel.querySelector(".sidebar"), this.details = this._panel.querySelector(".details"), this.refresh = this._panel.querySelector(".refresh"), a.on(this.tree, "click", "li", this._onLiClick.bind(this)), a.on(this.refresh, "click", this._onRefreshClick.bind(this)), this.bmd = this.game.add.bitmapData(512, 256), this._panel
            }, d.prototype.rebuildTree = function() {
                a.empty(this.tree), h = {}, this.tree.innerHTML = o(this.game.stage), this.select(this.tree.querySelector("li:first-child")), a.addClass(this.selected, "expanded"), this.reloadDetails()
            }, d.prototype.reloadDetails = function() {
                var e = this.selected.dataset.id,
                    t = h[e];
                if (this.details.innerHTML = l(t), t.texture) {
                    this.details.appendChild(this.bmd.canvas);
                    var n = Math.min(512, t.width),
                        i = Math.min(256, t.height);
                    this.bmd.clear(), this.bmd.resize(n, i);
                    try {
                        this.bmd.draw(t, 0, 0, n, i)
                    } catch (e) {}
                }
            }, d.prototype.select = function(e) {
                this.selected && a.removeClass(this.selected, "selected"), this.selected = e, a.addClass(this.selected, "selected")
            }, d.prototype.show = function() {
                this.rebuildTree(), i.prototype.show.call(this)
            }, d.prototype.destroy = function() {
                i.prototype.destroy.call(this), this.tree = null, this.details = null, this.refresh = null
            }, d.prototype._onLiClick = function(e) {
                e.stopPropagation(), this.select(e.delegateTarget), a.toggleClass(e.delegateTarget, "expanded"), this.reloadDetails()
            }, d.prototype._onRefreshClick = function(e) {
                e.preventDefault(), e.stopPropagation(), this.rebuildTree()
            }
        }, {
            "../hbs/scene/details.hbs": 11,
            "../hbs/scene/panel.hbs": 12,
            "../hbs/scene/tree.hbs": 13,
            "../util/ui": 19,
            "./Panel": 14,
            "hbsfy/runtime": 9
        }],
        17: [function(e, t, n) {
            t.exports = ".pdebug{font-size:14px;position:fixed;bottom:0;width:100%;color:#aaa;background:#333;border-top:3px solid #00bf00;z-index:999999}.pdebug a{color:#00bf00}.pdebug label{display:inline-block;width:100px}.pdebug strong{font-weight:400;color:#fff}.pdebug .weak{color:#aaa}.pdebug .pdebug-menu{height:32px;padding:0 15px;text-shadow:1px 1px 0 #111;background:#333}.pdebug .pdebug-menu span{display:inline-block;height:32px;line-height:32px}.pdebug .pdebug-menu .pdebug-head{padding-right:25px;border-right:1px solid #666}.pdebug .pdebug-menu .pdebug-stats{float:right;padding:0 0 0 10px}.pdebug .pdebug-menu .pdebug-stats .pdebug-stats-item{display:inline-block;width:100px;text-align:right}.pdebug .pdebug-menu .pdebug-stats .pdebug-stats-item>span{color:#fff}.pdebug .pdebug-menu .pdebug-stats .pdebug-stats-item.obj{width:100px;border:0}.pdebug .pdebug-menu .pdebug-menu-item{color:#fff;display:inline-block;text-decoration:none;padding:0 10px;height:32px;line-height:32px;border-right:1px solid #666}.pdebug .pdebug-menu .pdebug-menu-item.active{color:#00bf00;background:#111}.pdebug .pdebug-panel{display:none;height:265px;overflow:auto;font-size:12px;background:#111}.pdebug .pdebug-panel.scene .sidebar{float:left;height:100%;min-width:175px;max-width:500px;resize:horizontal;overflow:auto}.pdebug .pdebug-panel.scene .details{float:left;height:100%}.pdebug .pdebug-panel.scene .refresh{position:absolute}.pdebug .pdebug-panel.scene>ul{padding:0;margin:0;border-right:solid 1px #aaa;margin-right:10px}.pdebug .pdebug-panel.scene>ul li{color:#fff;list-style:none;cursor:pointer}.pdebug .pdebug-panel.scene>ul li.expanded>ul{display:block}.pdebug .pdebug-panel.scene>ul li.selected{color:#00bf00}.pdebug .pdebug-panel.scene>ul li::before{content:'-';display:inline-block;width:12px;height:1px;color:#aaa}.pdebug .pdebug-panel.scene>ul li.has-children::before{content:'';display:inline-block;width:0;height:0;margin:0 6px 0 0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-right:0;border-left:6px solid rgba(255,255,255,.3)}.pdebug .pdebug-panel.scene>ul li.has-children.expanded::before{margin:0 4px 0 -4px;border-top:6px solid rgba(255,255,255,.3);border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:0}.pdebug .pdebug-panel.scene>ul li>ul{display:none;padding:0 0 0 10px}.pdebug input[type=checkbox]{visibility:hidden}.pdebug .checkbox{width:75px;height:26px;background:#333;position:relative;line-height:normal;-webkit-border-radius:50px;-moz-border-radius:50px;border-radius:50px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.5),0 1px 0 rgba(255,255,255,.2);-moz-box-shadow:inset 0 1px 1px rgba(0,0,0,.5),0 1px 0 rgba(255,255,255,.2);-o-box-shadow:inset 0 1px 1px rgba(0,0,0,.5),0 1px 0 rgba(255,255,255,.2);-ms-box-shadow:inset 0 1px 1px rgba(0,0,0,.5),0 1px 0 rgba(255,255,255,.2);box-shadow:inset 0 1px 1px rgba(0,0,0,.5),0 1px 0 rgba(255,255,255,.2)}.pdebug .checkbox:after{content:'OFF';font:12px/26px Arial,sans-serif;color:#000;position:absolute;right:10px;z-index:0;font-weight:700;text-shadow:1px 1px 0 rgba(255,255,255,.15)}.pdebug .checkbox:before{content:'ON';font:12px/26px Arial,sans-serif;color:#00bf00;position:absolute;left:10px;z-index:0;font-weight:700}.pdebug .checkbox+span{position:relative;display:block;top:-25px;left:90px;width:200px;color:#fcfff4;font-size:1.1em}.pdebug .checkbox input[type=checkbox]:checked+label{left:38px}.pdebug .checkbox label{display:block;width:34px;height:20px;-webkit-border-radius:50px;-moz-border-radius:50px;border-radius:50px;-webkit-transition:all .4s ease;-moz-transition:all .4s ease;-o-transition:all .4s ease;-ms-transition:all .4s ease;transition:all .4s ease;cursor:pointer;position:absolute;top:3px;left:3px;z-index:1;background:#fcfff4;background:-webkit-linear-gradient(top,#fcfff4 0,#dfe5d7 40%,#b3bead 100%);background:-moz-linear-gradient(top,#fcfff4 0,#dfe5d7 40%,#b3bead 100%);background:-o-linear-gradient(top,#fcfff4 0,#dfe5d7 40%,#b3bead 100%);background:-ms-linear-gradient(top,#fcfff4 0,#dfe5d7 40%,#b3bead 100%);background:linear-gradient(top,#fcfff4 0,#dfe5d7 40%,#b3bead 100%);-webkit-box-shadow:0 2px 5px 0 rgba(0,0,0,.3);-moz-box-shadow:0 2px 5px 0 rgba(0,0,0,.3);box-shadow:0 2px 5px 0 rgba(0,0,0,.3)}"
        }, {}],
        18: [function(e, t, n) {
            function i(e, t, n, i, a) {
                a = a || {}, this.canvas = document.createElement("canvas"), this.canvas.width = t, this.canvas.height = n, e.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d"), this.labelStyle = "rgba(200, 200, 200, 0.6)", this.maxValue = a.maxValue || 50, this.padding = a.labelPadding || 5, this.dataLineWidth = a.lineWidth || 1, this.legendWidth = 230, this.legendBoxSize = 10, this.legendIndent = 5, this.eventY = 2 * this.padding, this.colors = i, this.dataCanvas = document.createElement("canvas"), this.dataCanvas.width = t - this.legendWidth, this.dataCanvas.height = n, this.dctx = this.dataCanvas.getContext("2d"), this.dataCanvasBuffer = document.createElement("canvas"), this.dataCanvasBuffer.width = this.dataCanvas.width - this.dataLineWidth, this.dataCanvasBuffer.height = this.dataCanvas.height, this.bctx = this.dataCanvasBuffer.getContext("2d")
            }
            i.prototype.constructor = i, t.exports = i, i.prototype.addData = function(e, t) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height), this.drawBg(), this.drawLegend(e), this.drawData(e, t)
            }, i.prototype.drawBg = function() {
                var e = Math.floor(this.canvas.height - this.canvas.height * (16 / this.maxValue)) + .5,
                    t = Math.floor(this.canvas.height - this.canvas.height * (33 / this.maxValue)) + .5;
                this.ctx.strokeStyle = this.ctx.fillStyle = this.labelStyle, this.ctx.lineWidth = 1, this.ctx.beginPath(), this.ctx.moveTo(this.legendWidth, e), this.ctx.lineTo(this.canvas.width, e), this.ctx.stroke(), this.ctx.fillText("16ms (60 fps)", this.legendWidth + this.padding, e - this.padding), this.ctx.beginPath(), this.ctx.moveTo(this.legendWidth, t), this.ctx.lineTo(this.canvas.width, t), this.ctx.stroke(), this.ctx.fillText("33ms (30 fps)", this.legendWidth + this.padding, t - this.padding), this.ctx.beginPath(), this.ctx.moveTo(this.legendWidth, this.canvas.height - .5), this.ctx.lineTo(this.canvas.width, this.canvas.height - .5), this.ctx.stroke()
            }, i.prototype.drawLegend = function(e) {
                var t = 0,
                    n = 0,
                    i = this.padding,
                    a = 0;
                for (var s in e)
                    for (var r in a = n * this.legendBoxSize + this.padding * (n + 1) + this.padding, this.ctx.fillStyle = this.labelStyle, this.ctx.fillText(s, i, a), ++n, e[s]) a = n * this.legendBoxSize + this.padding * n, this.ctx.fillStyle = this.colors[t++ % this.colors.length], this.ctx.fillRect(i + this.legendIndent, a, this.legendBoxSize, this.legendBoxSize), this.ctx.fillStyle = this.labelStyle, this.ctx.fillText(Math.round(e[s][r]) + "ms - " + r, i + this.legendIndent + this.legendBoxSize + this.padding, a + this.legendBoxSize), ++n > 16 && (i += this.legendWidth / 2, n = 0)
            }, i.prototype.drawData = function(e, t) {
                var n = this.dataCanvas.width - this.dataLineWidth + .5,
                    i = this.dataCanvas.height - .5;
                this.bctx.clearRect(0, 0, this.dataCanvasBuffer.width, this.dataCanvasBuffer.height), this.bctx.drawImage(this.dataCanvas, this.dataLineWidth, 0, n, i, 0, 0, n, i), this.dctx.clearRect(0, 0, this.dataCanvas.width, this.dataCanvas.height), this.dctx.drawImage(this.dataCanvasBuffer, 0, 0), t && (this.dctx.beginPath(), this.dctx.strokeStyle = this.dctx.fillStyle = "#ff0000", this.dctx.lineWidth = this.dataLineWidth, this.dctx.moveTo(n, i), this.dctx.lineTo(n, 0), this.dctx.stroke(), this.dctx.textAlign = "right", this.dctx.fillText(t, n - this.padding, this.eventY), this.eventY += 2 * this.padding, this.eventY > this.dataCanvas.height / 2 && (this.eventY = 2 * this.padding));
                var a = 0,
                    s = 0;
                for (var r in e)
                    for (var l in e[r]) this.dctx.beginPath(), this.dctx.strokeStyle = this.dctx.fillStyle = this.colors[a++ % this.colors.length], this.dctx.lineWidth = this.dataLineWidth, s = (s = e[r][l] / this.maxValue * this.dataCanvas.height) < 0 ? 0 : s, this.dctx.moveTo(n, i), this.dctx.lineTo(n, i -= s), this.dctx.stroke();
                this.ctx.drawImage(this.dataCanvas, this.legendWidth, 0)
            }, i.prototype.destroy = function() {
                this.canvas = null, this.ctx = null, this.labelStyle = null, this.maxValue = null, this.padding = null, this.dataLineWidth = null, this.legendWidth = null, this.legendBoxSize = null, this.legendIndent = null, this.colors = null, this.dataCanvas = null, this.dctx = null, this.dataCanvasBuffer = null, this.bctx = null
            }
        }, {}],
        19: [function(e, t, n) {
            var i = {
                delegate: function(e, t, n, i) {
                    e.addEventListener(t, function(e) {
                        window.target = e.target, e.target && e.target.matches(n) ? (e.delegateTarget = e.target, i && i(e)) : e.target.parentElement && e.target.parentElement.matches(n) && (e.delegateTarget = e.target.parentElement, i && i(e))
                    })
                },
                on: function(e, t, n, a) {
                    if ("function" == typeof n && (a = n, n = null), n) return i.delegate(e, t, n, a);
                    e.addEventListener(t, a)
                },
                removeClass: function(e, t) {
                    var n = e.className.split(" "),
                        i = n.indexOf(t); - 1 !== i && (n.splice(i, 1), e.className = n.join(" ").trim())
                },
                addClass: function(e, t) {
                    var n = e.className.split(" ");
                    n.push(t), e.className = n.join(" ").trim()
                },
                hasClass: function(e, t) {
                    return -1 !== e.className.split(" ").indexOf(t)
                },
                toggleClass: function(e, t) {
                    i.hasClass(e, t) ? i.removeClass(e, t) : i.addClass(e, t)
                },
                setText: function(e, t) {
                    e.textContent = t
                },
                setHtml: function(e, t) {
                    e.innerHTML = t
                },
                setStyle: function(e, t, n) {
                    if ("string" == typeof t) e.style[t] = n;
                    else
                        for (var i in t) e.style[i] = t[i]
                },
                empty: function(e) {
                    for (; e.firstChild;) e.removeChild(e.firstChild)
                },
                show: function(e) {
                    i.setStyle(e, "display", "block")
                },
                hide: function(e) {
                    i.setStyle(e, "display", "none")
                },
                clear: function() {
                    var e = document.createElement("br");
                    return i.setStyle(e, "clear", "both"), e
                },
                addCss: function(e) {
                    var t = document.createElement("style");
                    t.type = "text/css", t.styleSheet ? t.styleSheet.cssText = e : t.appendChild(document.createTextNode(e)), document.head.appendChild(t)
                }
            };
            if (t.exports = i, !HTMLElement.prototype.matches) {
                var a = HTMLElement.prototype;
                a.matches = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.msMatchesSelector || a.oMatchesSelector || function(e) {
                    for (var t, n = this.parentElement.querySelectorAll(e), i = 0; t = n[i++];)
                        if (t === this) return !0;
                    return !1
                }
            }
        }, {}]
    }, {}, [1])(1)
});
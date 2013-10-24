/*!
 * notify.me 0.3.0
 * https://github.com/oltodo/notify.me
 * Copyright 2013 Oltodo, Inc. and other contributors; Licensed MIT
 */

(function($) {
    (function() {
        var types = {
            info: {
                icon: "icon icon-info",
                duration: 5
            },
            warning: {
                icon: "icon icon-warning",
                duration: 10
            },
            success: {
                icon: "icon icon-success",
                duration: 5
            },
            error: {
                icon: "icon icon-error",
                duration: false
            }
        };
        var stacks = {
            top: null,
            "top-left": null,
            "top-right": null,
            bottom: null,
            "bottom-left": null,
            "bottom-right": null,
            center: null
        };
        var notice = function(type, options) {
            var stack = Stack.getStack(options.stack || "top-right"), timer = null;
            var tmp = type;
            type = types[tmp];
            type.name = tmp;
            var icon = type.icon;
            if (typeof options.icon !== "undefined") {
                icon = options.icon;
            }
            var duration = type.duration;
            if (typeof options.duration !== "undefined") {
                duration = options.duration;
            }
            var show = function() {
                $view.addClass("ni-shown");
            };
            var close = function() {
                $view.addClass("ni-hidden");
                setTimeout(function() {
                    $view.remove();
                    stack._calculPositionsForCenterStack();
                }, 300);
            };
            var clearTimer = function() {
                if (timer !== null) {
                    clearTimeout(timer);
                }
            };
            var setTimer = function() {
                clearTimer();
                timer = setTimeout(close, duration * 1e3);
            };
            var content = "";
            content += '<div class="notifyme-item ni-' + type.name + '">';
            content += '    <span class="ni-close">&times;</span>';
            if (icon) {
                content += '    <span class="ni-icon">';
                content += '        <i class="' + icon + '"></i>';
                content += "    </span>";
            }
            if (options.title) {
                content += '<p class="ni-title">' + options.title + "</p>";
            }
            if (options.text) {
                content += '<p class="ni-text">' + options.text + "</p>";
            }
            content += "</div>";
            var $view = $(content);
            $view.find(".ni-close").on("click", function() {
                close();
            });
            if (duration) {
                setTimer();
                $view.hover(clearTimer, setTimer);
            }
            if (/^bottom/.test(stack.name)) {
                stack.prepend($view);
            } else {
                stack.append($view);
            }
            setTimeout(show, 10);
            return {
                show: show,
                close: close
            };
        };
        var Stack = function(name) {
            this._init(name);
        };
        Stack.getStack = function(name) {
            if (typeof stacks[name] === "undefined") {
                throw new Error("Unknown stack `" + name + "`");
            }
            if (stacks[name] === null) {
                stacks[name] = new Stack(name);
            }
            return stacks[name];
        };
        Stack.prototype = {
            _init: function(name) {
                this.name = name;
                this._initView();
                $("body").append(this.$view);
            },
            _initView: function() {
                var content = "";
                content += '<div class="notifyme-stack ns-' + this.name + '">';
                content += "</div>";
                this.$view = $(content);
                return this;
            },
            _add: function(method, $view) {
                this.$view[method]($view);
                this._calculPositionsForCenterStack();
                return this;
            },
            _calculPositionsForCenterStack: function() {
                if (this.name != "center") {
                    return;
                }
                var height = this.$view.height();
                var width = this.$view.width();
                this.$view.css({
                    marginTop: "-" + height / 2 + "px",
                    marginLeft: "-" + width / 2 + "px"
                });
            },
            append: function($view) {
                return this._add("append", $view);
            },
            prepend: function($view) {
                return this._add("prepend", $view);
            }
        };
        $.notify = function() {};
        $.notify.useBootstrap3 = function() {
            types.info.icon = "glyphicon glyphicon-info-sign";
            types.warning.icon = "glyphicon glyphicon-exclamation-sign";
            types.success.icon = "glyphicon glyphicon-ok-sign";
            types.error.icon = "glyphicon glyphicon-warning-sign";
        };
        $.notify.useBootstrap2 = function() {
            types.info.icon = "icon-info-sign";
            types.warning.icon = "icon-exclamation-sign";
            types.success.icon = "icon-ok-sign";
            types.error.icon = "icon-warning-sign";
        };
        $.notify.useFontAwesome = $.notify.useBootstrap2;
        $.notify.useFontAwesome4 = function() {
            types.info.icon = "fa fa-info-circle";
            types.warning.icon = "fa fa-exclamation-triangle";
            types.success.icon = "fa fa-check-circle";
            types.error.icon = "fa fa-exclamation-circle";
        };
        var getTypeFunction = function(type) {
            return function() {
                var args = arguments;
                if (args.length > 3) {
                    throw new Error("Too much arguments");
                }
                var options = {};
                for (var i in args) {
                    var arg = args[i];
                    switch (typeof arg) {
                      case "string":
                        if (options.text) {
                            options.title = options.text;
                        }
                        options.text = arg;
                        break;

                      case "object":
                        options = $.extend(options, arg);
                        break;

                      default:
                        throw new Error("Unknown argument type `" + typeof arg + "` of `" + arg + "`");
                    }
                }
                return notice(type, options);
            };
        };
        for (var i in types) {
            $.notify[i] = getTypeFunction(i);
        }
    })();
})(window.jQuery);
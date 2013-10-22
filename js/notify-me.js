/*!
 * notify.me 0.0.1
 * https://github.com/oltodo/notify.me
 * Copyright 2013 Oltodo, Inc. and other contributors; Licensed MIT
 */

(function($) {
    (function() {
        var types = {
            info: {
                icon: "icon icon-info"
            },
            warning: {
                icon: "icon icon-warning"
            },
            success: {
                icon: "icon icon-success"
            },
            error: {
                icon: "icon icon-error"
            }
        };
        var stacks = {
            "top-left": null,
            "top-right": null,
            "bottom-left": null,
            "bottom-right": null
        };
        var notice = function(type, options) {
            var stack = Stack.getStack(options.stack || "top-right");
            var icon = types[type].icon;
            if (typeof options.icon !== "undefined") {
                icon = options.icon;
            }
            var show = function() {
                $view.addClass("shown");
            };
            var close = function() {
                $view.animate({
                    top: -1e3,
                    opacity: 0
                }, 300, function() {
                    $view.remove();
                });
            };
            var content = "";
            content += '<div class="notifyme-item ni-' + type + '">';
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
            stack.append($view);
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
            append: function($view) {
                this.$view.append($view);
                return this;
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
        $.notify.fontAwesome = $.notify.useBootstrap2;
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
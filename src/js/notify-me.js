/*
 * notify.me
 * https://github.com/oltodo/notify.me
 * Copyright 2013 Oltodo, Inc. and other contributors; Licensed MIT
 */

(function () {

    var types = {
        info: {
            icon: 'icon icon-info',
            duration: 5 // seconds
        },
        warning: {
            icon: 'icon icon-warning',
            duration: 10 // seconds
        },
        success: {
            icon: 'icon icon-success',
            duration: 5 // seconds
        },
        error: {
            icon: 'icon icon-error',
            duration: false // no duration
        }
    };

    var stacks = {
        'top': null,
        'top-left': null,
        'top-right': null,
        'bottom': null,
        'bottom-left': null,
        'bottom-right': null,
        'center': null
    };

    var defaultOptions = {
        frozen: false,
        zIndex: 100
    };

    // Notice class
    var notice = function (type, options) {

        var
            stack = Stack.getStack(options.stack || 'top-right'),
            timer = null;

        // Get type
        var tmp = type;
        type = types[tmp];
        type.name = tmp;

        // Get options
        options = $.extend({
            icon: type.icon,
            duration: type.duration
        }, defaultOptions, options);

        // Show method
        var show = function () {
            $view.addClass('ni-shown');
        };

        // Close method
        var close = function () {
            $view.addClass('ni-hidden');

            setTimeout(function () {
                $view.remove();
                stack._calculPositionsForCenterStack();
            }, 300);
        };

        var clearTimer = function () {
            if(timer !== null) {
                clearTimeout(timer);
            }
        };

        var setTimer = function () {
            clearTimer();
            timer = setTimeout(close, options.duration*1000);
        };

        // Init view
        var content = '';

        content += '<div class="notifyme-item ni-'+type.name+'" style="z-index: '+options.zIndex+'">';

        if(!options.frozen) {
            content += '    <span class="ni-close">&times;</span>';
        }

        if(options.icon) {
            content += '    <span class="ni-icon">';
            content += '        <i class="'+options.icon+'"></i>';
            content += '    </span>';
        }

        if(options.title) {
            content += '<p class="ni-title">'+options.title+'</p>';
        }

        if(options.text) {
            content += '<p class="ni-text">'+options.text+'</p>';
        }

        content += '</div>';

        var $view = $(content);

        // Set events
        $view.find('.ni-close').on('click', function () {
            close();
        });

        // Set duration
        if(options.duration) {
            setTimer();
            $view.hover(clearTimer, setTimer);
        }

        // Add view to stack
        if(/^bottom/.test(stack.name)) {
            stack.prepend($view);
        } else {
            stack.append($view);
        }

        setTimeout(show, 10);

        return {
            close: close
        };
    };



    // Stack class
    var Stack = function (name) {
        this._init(name);
    };

    Stack.getStack = function (name) {
        if(typeof stacks[name] === 'undefined') {
            throw new Error('Unknown stack `'+name+'`');
        }

        if(stacks[name] === null) {
            stacks[name] = new Stack(name);
        }

        return stacks[name];
    };

    Stack.prototype = {

        _init: function (name) {
            this.name = name;
            this._initView();

            $('body').append(this.$view);
        },

        _initView: function () {
            var content = '';

            content += '<div class="notifyme-stack ns-'+this.name+'">';
            content += '</div>';

            this.$view = $(content);
            return this;
        },

        _add: function (method, $view) {

            this.$view[method]($view);
            this._calculPositionsForCenterStack();

            return this;
        },

        _calculPositionsForCenterStack: function () {
            if(this.name != 'center') {
                return;
            }

            var height = this.$view.height();
            var width = this.$view.width();

            this.$view
                .css({
                    marginTop: '-'+(height/2)+'px',
                    marginLeft: '-'+(width/2)+'px'
                });
        },

        append: function ($view) {
            return this._add('append', $view);
        },

        prepend: function ($view) {
            return this._add('prepend', $view);
        }
    };


    $.notify = function () {
    };

    $.notify.setDefaultOptions = function(options) {
        defaultOptions = $.extend({}, defaultOptions, options);
    };

    $.notify.useBootstrap3 = function () {
        types.info.icon = 'glyphicon glyphicon-info-sign';
        types.warning.icon = 'glyphicon glyphicon-exclamation-sign';
        types.success.icon = 'glyphicon glyphicon-ok-sign';
        types.error.icon = 'glyphicon glyphicon-warning-sign';

    };

    $.notify.useBootstrap2 = function () {
        types.info.icon = 'icon-info-sign';
        types.warning.icon = 'icon-exclamation-sign';
        types.success.icon = 'icon-ok-sign';
        types.error.icon = 'icon-warning-sign';
    };

    $.notify.useFontAwesome = $.notify.useBootstrap2;

    $.notify.useFontAwesome4 = function () {
        types.info.icon = 'fa fa-info-circle';
        types.warning.icon = 'fa fa-exclamation-triangle';
        types.success.icon = 'fa fa-check-circle';
        types.error.icon = 'fa fa-exclamation-circle';
    };

    /**
     * Return the function to call for one type
     * @param  {String} type Type name
     * @return {Function} The function
     */
    var getTypeFunction = function (type) {

        return function () {
            var args = arguments;

            if(args.length > 3) {
                throw new Error('Too much arguments');
            }

            var options = {};

            for(var i = 0; i < args.length; i++) {
                var arg = args[i];

                switch(typeof arg) {

                    case 'string':
                        if(options.text) {
                            options.title = options.text;
                        }

                        options.text = arg;
                        break;

                    case 'object':
                        options = $.extend(options, arg);
                        break;

                    default:
                        throw new Error('Unknown argument type `'+(typeof arg)+'` of `'+arg+'`');
                }
            }

            return notice(type, options);
        };
    };

    for(var i in types) {
        $.notify[i] = getTypeFunction(i);
    }

})();

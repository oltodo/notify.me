(function ($) {

    var types = {
        info: {
            icon: 'glyphicon glyphicon-info-sign'
        },
        warning: {
            icon: 'glyphicon glyphicon-exclamation-sign'
        },
        success: {
            icon: 'glyphicon glyphicon-ok-sign'
        },
        error: {
            icon: 'glyphicon glyphicon-warning-sign'
        }
    };

    var stacks = {
        'top-left': null,
        'top-right': null,
        'bottom-left': null,
        'bottom-right': null,
    }


    // Notice class
    var Notice = function(type, options) {

        // Get stack
        var stack = Stack.getStack(options.stack || 'top-right');


        // Get icon
        var icon = types[type].icon;

        if(typeof options.icon !== undefined) {
            icon = options.icon;
        }


        // Show method
        var show = function () {
            $view.addClass('shown');
        };

        // Close method
        var close = function () {
            $view.animate({
                top: -1000,
                opacity: 0
            }, 300, function() {
                $view.remove();
            });
        };


        // Init view
        var content = '';

        content += '<div class="notifyme-item ni-'+type+'">';
        content += '    <span class="ni-close">&times;</span>';

        if(icon) {
            content += '    <span class="ni-icon">';
            content += '        <i class="'+icon+'"></i>';
            content += '    </span>';
        }

        if(options.title) {
            content += '<h3>'+options.title+'</h3>';
        }

        if(options.text) {
            content += '<p>'+options.text+'</p>';
        }

        content += '</div>';

        var $view = $(content);


        // Set events
        $view.find('.ni-close').on('click', function () {
            close();
        });

        // Append view to stack
        stack.append($view);

        setTimeout(show, 10);

        return {
            show: show,
            close: close
        }
    }





    // Stack class
    var Stack = function (name) {
        this._init(name);
    };

    Stack.getStack = function (name) {
        if(typeof stacks[name] == undefined) {
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

        append: function ($view) {
            this.$view.append($view);
            return this;
        }
    };




    $.notify = {};

    for(var i in types) {
        $.notify[i] = (function (type) {

            return function () {
                var args = arguments;

                if(args.length > 3) {
                    throw new Error('Too much arguments');
                }

                var options = {};

                for(var i in args) {
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

                return Notice(type, options);
            };
        })(i);
    }

})(jQuery);
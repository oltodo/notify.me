
(function() {

    window.code = function (language) {
        var lines = [];
        var test = false;

        var escape = function (str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
        };

        return {

            line: function (str) {
                lines.push(str);
                return this;
            },

            test: function (trueOrFalse) {
                test = trueOrFalse;
                return this;
            },

            render: function () {
                var content = '';

                content += '<pre><code class="'+language+'">';
                content += escape(lines.join("\n"));
                content += '</code></pre>';

                if(test) {
                    content += '<div class="clearfix" style="margin-bottom: 10px">';
                    content += '    <div class="btn btn-default btn-xs pull-right" onclick="'+escape(lines.join(' '))+'">Test it</div>';
                    content += '</div>';
                }

                return content;
            },

            write: function () {
                document.write(this.render());
            },
        };
    };


    // Title's color by mouse move
    (function () {

        var $window = $(window),
            w       = 0,
            h       = 0,
            rgb     = [],

        getWidth = function () {
            w = $window.width();
            h = $window.height();
        };

        $window.resize(getWidth).mousemove(function (e) {
            
            rgb = [
                Math.round(e.pageX/w * 255),
                Math.round(e.pageY/h * 255),
                150
            ];
            
            $('#title span+span').css('background-color','rgb('+rgb.join(',')+')');
            
        }).resize();

    })();

    // Notify settings
    $.notify.useBootstrap3();

    // Welcome notice
    setTimeout(function () {
        $.notify.info('Hi !', 'Welcome on notify.me page', {
            //  icon: false
        });
    }, 1000);
    
    // Init highlight JS
    hljs.initHighlightingOnLoad();
})();


// Angular app

var app = angular.module('notifyApp', []);

app
    .controller('MakeCtrl', function MakeCtrl($scope) {
        $scope.type = 'info';
        $scope.title = 'My notice';
        $scope.text = 'The text of my notice';
        $scope.stack = null;
        $scope.duration = 'default';
        $scope.duration_value = 5;

        $scope.toggleStack = function(stack) {
            $scope.stack = ($scope.stack == stack ? null : stack);
        }
    })
    .directive('make', function () {
        return function (scope, elm, attrs) {
            var $pre = $(elm[0]);

            var br = "\n";
            var indent = '    ';

            var renderValue = function(value, indent) {
                indent = indent || '';

                var content = '';

                switch(typeof value) {

                    case 'string':
                        content += "'"+value.replace(/'/g, "\\'")+"'";
                        break;

                    case 'boolean':
                        content += (value ? 'true' : 'false');
                        break;

                    case 'array':
                        content += '[';
                        content += br+indent+']';
                        break;

                    case 'object':
                        content += '{';

                        for(var i in value) {
                            content += br+indent+'    ';
                            content += i+': ';
                            content += renderValue(value[i], indent+'    ')+',';
                        }

                        content = content.substr(0, content.length-1);
                        content += br+indent+'}';
                        break;

                    default:
                        content += value;
                }

                return content; 
            };

            scope.$watch(function() { 

                var arguments = [];
                var options = [];

                arguments.push(renderValue(scope.text || ''));

                if(scope.title) {
                    arguments.unshift(renderValue(scope.title));
                }

                // If stack
                if(scope.stack) {
                    options.stack = scope.stack;
                }

                // If duration
                if(scope.duration) {
                    switch(scope.duration) {
                        case 'infinite':
                            options.duration = false;
                            break;

                        case 'custom':
                            options.duration = parseInt(scope.duration_value);
                            break;
                    }
                }

                if(!jQuery.isEmptyObject(options)) {
                    arguments.push(renderValue(options));
                }

                var content = code('javascript')
                    .line('$.notify.'+scope.type+'('+arguments.join(', ')+');')
                    .test(true);

                $pre.html(content.render());

                    hljs.highlightBlock($pre.find('code').get(0));
            });
        };
    });

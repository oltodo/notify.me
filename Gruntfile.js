module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // uglify: {
        //     options: {
        //         banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        //     },
        //     build: {
        //         src: 'src/<%= pkg.name %>.js',
        //         dest: 'build/<%= pkg.name %>.min.js'
        //     }
        // }

        copy: {
            main: {
                files: [{
                    src: 'notify.me/dist/js/notify-me.js',
                    dest: 'js/notify-me.js',
                }, {
                    src: 'notify.me/dist/css/notify-me.css',
                    dest: 'css/notify-me.css',
                }, {
                    src: 'notify.me/dist/img/icons.png',
                    dest: 'img/icons.png',
                }, {
                    src: 'bower_components/angular/angular.min.js',
                    dest: 'js/angular.js',
                }, {
                    src: 'bower_components/highlightjs/styles/github.css',
                    dest: 'css/highlight.css',
                }, {
                    src: 'bower_components/jquery/jquery.min.js',
                    dest: 'js/jquery.js',
                }, {
                    src: 'bower_components/highlightjs/highlight.pack.js',
                    dest: 'js/highlight.js',
                }, {
                    src: 'bower_components/font-awesome/css/font-awesome.min.css',
                    dest: 'css/font-awesome.css',
                }, {
                    expand: true,
                    cwd: 'bower_components/bootstrap/fonts/',
                    src: '*',
                    dest: 'fonts/'
                }, {
                    expand: true,
                    cwd: 'bower_components/font-awesome/fonts/',
                    src: '*',
                    dest: 'fonts/'
                }]
            }
        },

        less: {
            development: {
                files: {
                    "css/main.css": "less/main.less"
                }
            }
        },

        watch: {
            main: {
                files: ['**/*.js', '**/*.css'],
                tasks: ['copy'],
                options: {
                    spawn: false,
                },
            },
            less: {
                files: ['**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false,
                },
            }
        },
    });

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    // Default task(s).
    grunt.registerTask('default', ['less', 'copy']);

};
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
                    src: 'bower_components/highlightjs/styles/github.css',
                    dest: 'css/highlight.css',
                }, {
                    src: 'bower_components/jquery/jquery.min.js',
                    dest: 'js/jquery.js',
                }, {
                    src: 'bower_components/notify.me/src/js/notify-me.js',
                    dest: 'js/notify-me.js',
                }, {
                    src: 'bower_components/highlightjs/highlight.pack.js',
                    dest: 'js/highlight.js',
                }]
            }
        },

        less: {
            development: {
                files: {
                    "css/main.css": "less/main.less",
                    "css/notify-me.css": "bower_components/notify.me/src/less/notify-me.less"
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    
    // Default task(s).
    grunt.registerTask('default', ['less', 'copy']);

};
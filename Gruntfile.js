var semver   = require('semver'),
    f        = require('util').format,
    jsFiles  = [
        '<%= srcDir %>/js/notify-me.js'
    ];

module.exports = function(grunt) {
    grunt.initConfig({
        version: grunt.file.readJSON('package.json').version,

        srcDir: 'src',
        buildDir: 'dist',

        banner: [
            '/*!',
            ' * notify.me <%= version %>',
            ' * https://github.com/oltodo/notify.me',
            ' * Copyright 2013 Oltodo, Inc. and other contributors; Licensed MIT',
            ' */\n\n'
        ].join('\n'),

        clean: ['<%= buildDir %>/*'],

        uglify: {
            options: {
                banner: '<%= banner %>',
                enclose: { 'window.jQuery': '$' }
            },
            js: {
                options: {
                    mangle: false,
                    beautify: true,
                    compress: false
                },
                src: jsFiles,
                dest: '<%= buildDir %>/js/notify-me.js'
            },
            jsmin: {
                options: {
                    mangle: true,
                    compress: true
                },
                src: jsFiles,
                dest: '<%= buildDir %>/js/notify-me.min.js'
            }
        },

        less: {
            all: {
                files: {
                    '<%= buildDir %>/css/notify-me.css': '<%= srcDir %>/less/main.less'
                }
            }
        },

        cssmin: {
            combine: {
                files: {
                    '<%= buildDir %>/css/notify-me.min.css': '<%= buildDir %>/css/notify-me.css'
                }
            }
        },

        imagemin: {
            'static': {
                options: {
                    optimizationLevel: 3
                },
                files: {
                    '<%= buildDir %>/img/icons.png': '<%= srcDir %>/img/icons.png'
                }
            }
        },

        sed: {
            version: {
                pattern: '%VERSION%',
                replacement: '<%= version %>',
                path: ['<%= uglify.js.dest %>', '<%= uglify.jsmin.dest %>']
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            src: jsFiles,
            tests: ['test/*.js'],
            gruntfile: ['Gruntfile.js']
        },

        watch: {
            js: {
                files: jsFiles,
                tasks: 'build:js'
            }
        },

        jasmine: {
            js: {
                src: jsFiles,
                options: {
                    specs: 'test/*_spec.js',
                    helpers: 'test/helpers/*',
                    vendor: 'test/vendor/*'
                }
            }
        },

        exec: {
            open_spec_runner: {
                cmd: 'open _SpecRunner.html'
            },
            git_is_clean: {
                cmd: 'test -z "$(git status --porcelain src)"'
            },
            git_on_master: {
                cmd: 'test $(git symbolic-ref --short -q HEAD) = master'
            },
            git_add: {
                cmd: 'git add dist bower.json package.json'
            },
            git_commit: {
                cmd: function(m) { return f('git commit -m "%s"', m); }
            },
            git_tag: {
                cmd: function(v) { return f('git tag v%s -am "%s"', v, v); }
            },
            git_push: {
                cmd: 'git push && git push --tags'
            },
            publish_assets: {
                cmd: [
                    'cp -r <%= buildDir %> notify-me.js',
                    'zip -r notify-me.js/notify-me.js.zip notify-me.js',
                    'git checkout gh-pages',
                    'rm -rf releases/latest',
                    'cp -r notify-me.js releases/<%= version %>',
                    'cp -r notify-me.js releases/latest',
                    'git add releases/<%= version %> releases/latest',
                    'sed -E -i "" \'s/v[0-9]+\\.[0-9]+\\.[0-9]+/v<%= version %>/\' index.html',
                    'git add index.html',
                    'git commit -m "Add assets for <%= version %>."',
                    'git push',
                    'git checkout -',
                    'rm -rf notify-me.js'
                ].join(' && ')
            }
        },

        connect: {
            server: {
                options: {
                    port: 8888, keepalive: true
                }
            }
        },

        parallel: {
            dev: [
                { grunt: true, args: ['server'] },
                { grunt: true, args: ['watch'] }
            ]
        }
    });

    grunt.registerTask('sprite', 'Build the sprite', function() {
    });

    grunt.registerTask('release', 'Ship it.', function(version) {
        var curVersion = grunt.config.get('version');

        version = semver.inc(curVersion, version) || version;

        if (!semver.valid(version) || semver.lte(version, curVersion)) {
            grunt.fatal('invalid version dummy');
        }

        grunt.config.set('version', version);

        grunt.task.run([
            'exec:git_on_master',
            'exec:git_is_clean',
            'lint',
            'manifests:' + version,
            'build',
            'exec:git_add',
            'exec:git_commit:' + version,
            'exec:git_tag:' + version,
            'exec:git_push'/*,
            'exec:publish_assets'*/
        ]);
    });

    grunt.registerTask('manifests', 'Update manifests.', function(version) {
        var _ = grunt.util._,
            pkg = grunt.file.readJSON('package.json'),
            bower = grunt.file.readJSON('bower.json')/*,
            jqueryPlugin = grunt.file.readJSON('notify-me.js.jquery.json')*/;

        bower = JSON.stringify(_.extend(bower, {
            name: pkg.name,
            version: version
        }), null, 2);

        // jqueryPlugin = JSON.stringify(_.extend(jqueryPlugin, {
        //     name: pkg.name,
        //     title: pkg.name,
        //     version: version,
        //     author: pkg.author,
        //     description: pkg.description,
        //     keywords: pkg.keywords,
        //     homepage: pkg.homepage,
        //     bugs: pkg.bugs,
        //     maintainers: pkg.contributors
        // }), null, 2);

        pkg = JSON.stringify(_.extend(pkg, {
            version: version
        }), null, 2);

        grunt.file.write('package.json', pkg);
        grunt.file.write('bower.json', bower);
        // grunt.file.write('notify-me.js.jquery.json', jqueryPlugin);
    });

    // aliases
    // -------

    grunt.registerTask('default', 'build');
    grunt.registerTask('build', ['clean', 'uglify', 'sed:version', 'less', 'cssmin', 'imagemin']);
    grunt.registerTask('server', 'connect:server');
    grunt.registerTask('lint', 'jshint');
    grunt.registerTask('test', 'jasmine:js');
    grunt.registerTask('test:browser', ['jasmine:js:build', 'exec:open_spec_runner']);
    grunt.registerTask('dev', 'parallel:dev');

    // load tasks
    // ----------

    grunt.loadNpmTasks('grunt-sed');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-parallel');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-less');
};
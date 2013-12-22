'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // configurable paths
        directories: {
            app: 'app',
            dist: 'dist'
        },
        watch: {
            styles: {
                files: ['<%= directories.app %>/styles/{,*/}*.css'],
                tasks: ['copy:styles', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= directories.app %>/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp,<%= directories.app %>}/scripts/{,*/}*.js',
                    '<%= directories.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= directories.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= directories.dist %>'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= directories.dist %>/*',
                        '!<%= directories.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= directories.app %>/scripts/{,*/}*.js',
                '!<%= directories.app %>/scripts/vendor/*',
            ]
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },
        concat: {
            requirejs: {
                src: ['.tmp/require.min.js', '.tmp/requirejs/ht.js'],
                dest: '<%= directories.dist %>/scripts/ht.js'
            },
            style: {
                src: ['.tmp/styles/{,*/}*.css'],
                dest: '<%= directories.dist %>/styles/main.css'
            }
        },
        'bower-install': {
            app: {
                html: '<%= directories.app %>/index.html',
                ignorePath: '<%= directories.app %>/'
            }
        },
        uglify: {
            config: {
                files: {
                    '.tmp/require.min.js': ['<%= directories.app %>/bower_components/requirejs/require.js', '.tmp/require-config.js']
                }
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    baseUrl: '<%= directories.app %>/scripts',
                    dir: '.tmp/requirejs',
                    mainConfigFile: '<%= directories.app %>/scripts/requirejs-config.js',
                    modules: [
                        {
                            name: 'ZipLoader'
                        },
                        {
                            name: 'ht',
                            exclude: ['ZipLoader'],
                            insertRequire: ['ht']
                        }
                    ],
                    optimize: 'uglify2',
                    generateSourceMaps: false,
                    preserveLicenseComments: false,
                    removeCombined: true,
                    useStrict: true,
                    skipDirOptimize: true,
                    wrap: false
                }
            }
        },
        rev: {
            zip: {
                files: {
                    src: [
                        '<%= directories.dist %>/scripts/ZipLoader.js',
                    ]
                }
            },
            dist: {
                files: {
                    src: [
                        '<%= directories.dist %>/scripts/{,*/}*.js',
                        '!<%= directories.dist %>/scripts/*.ZipLoader.js',
                        '<%= directories.dist %>/styles/{,*/}*.css',
                        '<%= directories.dist %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        },
        preprocess: {
            dist: {
                options: {
                    inline: true,
                    context: {
                        DEMO: false
                    }
                },
                src: '<%= directories.dist %>/index.html'
            },
            demo: {
                options: {
                    inline: true,
                    context: {
                        DEMO: true
                    }
                },
                src: '<%= directories.dist %>/index.html'
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= directories.dist %>'
            },
            html: '<%= directories.app %>/index.html'
        },
        usemin: {
            options: {
                dirs: ['<%= directories.dist %>']
            },
            html: ['<%= directories.dist %>/{,*/}*.html'],
            css: ['<%= directories.dist %>/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= directories.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= directories.dist %>/images'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= directories.app %>',
                    src: '*.html',
                    dest: '<%= directories.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= directories.app %>',
                    dest: '<%= directories.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/{,*/}*.*',
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= directories.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            zip: {
                src: '.tmp/requirejs/ZipLoader.js',
                dest: '<%= directories.dist %>/scripts/ZipLoader.js'
            }
        },
        modernizr: {
            devFile: '<%= directories.app %>/bower_components/modernizr/modernizr.js',
            outputFile: '<%= directories.dist %>/scripts/vendor/modernizr.js',
            files: [
                '<%= directories.app %>/scripts/{,*/}*.js',
                '<%= directories.dist %>/styles/{,*/}*.css',
                '!<%= directories.app %>/scripts/vendor/*'
            ],
            uglify: true
        },
        concurrent: {
            server: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'htmlmin'
            ]
        },
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        } else if (target === 'demo') {
            return grunt.task.run(['demo', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('writeconfig', function () {
        var path = grunt.file.expand({cwd: grunt.config.get('directories.dist'), filter: 'isFile'}, 'scripts/*.ZipLoader.js')[0].replace(/\.[^\.]*$/, '');
        grunt.file.write('.tmp/require-config.js', 'require.config({paths:{\'ZipLoader\':\'' + path + '\'}});');
    });

    grunt.registerTask('writescripttag', function () {
        var path = grunt.file.expand({cwd: grunt.config.get('directories.dist') + '/scripts', filter: 'isFile'}, '*.ht.js')[0];
        grunt.file.write('.tmp/scripttag.html', '<script src="scripts/' + path + '"></script>');
    });

    grunt.registerTask('build', [
        'clean:dist',
        'requirejs',
        'copy:zip',
        'rev:zip',
        'writeconfig',
        'uglify:config',
        'concat:requirejs',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'modernizr',
        'concat:style',
        'cssmin',
        'copy:dist',
        'rev:dist',
        'writescripttag',
        'usemin',
        'preprocess:dist'
    ]);

    grunt.registerTask('demo', [
        'clean:dist',
        'requirejs',
        'copy:zip',
        'rev:zip',
        'writeconfig',
        'uglify:config',
        'concat:requirejs',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'modernizr',
        'concat:style',
        'cssmin',
        'copy:dist',
        'rev:dist',
        'writescripttag',
        'usemin',
        'preprocess:demo'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);
};

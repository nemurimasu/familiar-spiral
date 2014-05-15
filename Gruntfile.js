'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    var path = require('path');

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
            bootstrap: {
                files: {
                    '.tmp/require.min.js': ['<%= directories.app %>/bower_components/requirejs/require.js', '.tmp/require-config.js', '.tmp/asset-paths.js']
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
                            exclude: ['ZipLoader', 'asset-paths'],
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
            assets: {
                files: {
                    src: [
                        '<%= directories.dist %>/styles/{,*/}*.css',
                        '<%= directories.dist %>/styles/fonts/{,*/}*',
                        '<%= directories.dist %>/images/{,*/}*'
                    ]
                }
            },
            scripts: {
                files: {
                    src: [
                        '<%= directories.dist %>/scripts/{,*/}*.js',
                        '!<%= directories.dist %>/scripts/*.ZipLoader.js'
                    ]
                }
            },
            manifest: {
                files: {
                    src: [
                        '<%= directories.dist %>/manifest.appcache',
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
        'dom_munger': {
            dist: {
                options: {
                    callback: function($) {
                        var dist = grunt.config.get('directories.dist');
                        $('html').attr('manifest', grunt.file.expand({cwd: dist, filter: 'isFile'}, '*.manifest.appcache')[0]);
                        $('script[type="text/x-hypno"]').each(function(i, script) {
                            $(script).html($(script).html().split('\n').map(function(l) {
                                l = l.trim();
                                var match;
                                if ((match = l.match(/^(-(?:whirl)?image\s+)([^'"()]*)/)) !== null) {
                                    if (match[2] !== 'noimage' && match[2] !== 'no image') {
                                        return match[1] + grunt.file.expand({cwd: dist, filter: 'isFile'}, path.join(path.dirname(match[2]), '*.' + path.basename(match[2])))[0];
                                    }
                                }
                                return l;
                            }).join('\n'));
                        });
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
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= directories.dist %>',
                    src: '*.html',
                    dest: '<%= directories.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            assets: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= directories.app %>',
                    dest: '<%= directories.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/{,*/}*',
                        'styles/ht-glyph-ie7.css',
                        '!styles/fonts/*.json',
                        '*.html'
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
            copyassets: [
                'copy:assets',
                'imagemin'
            ],
            firstlayer: [
                'placeassets',
                'buildscripts',
                'styles'
            ],
            server: [
                'copy:styles'
            ]
        },
        appcache: {
            options: {
                basePath: '<%= directories.dist %>'
            },
            dist: {
                dest: '<%= directories.dist %>/manifest.appcache',
                cache: [
                    '<%= directories.dist %>/**/*'
                ]
            },
            demo: {
                dest: '<%= directories.dist %>/manifest.appcache',
                cache: [
                    '<%= directories.dist %>/**/*',
                    '//s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png'
                ],
                network: [
                    'https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png'
                ]
            }
        },
        cssmin: {
            '<%= directories.dist %>/styles/ht-glyph-ie7.css': '<%= directories.dist %>/styles/ht-glyph-ie7.css'
        }
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

    grunt.registerTask('writeassetpaths', function () {
        var path = grunt.file.expand({cwd: grunt.config.get('directories.dist'), filter: 'isFile'}, 'images/*.spiral.png')[0];
        grunt.file.write('.tmp/asset-paths.js', 'define(\'asset-paths\',function(){\'use strict\';return{\'spiral\':\'' + path + '\'}});');
    });

    grunt.registerTask('writescripttag', function () {
        var path = grunt.file.expand({cwd: grunt.config.get('directories.dist') + '/scripts', filter: 'isFile'}, '*.ht.js')[0];
        grunt.file.write('.tmp/scripttag.html', '<script src="scripts/' + path + '"></script>');
    });

    grunt.registerTask('styles', [
        'copy:styles',
        'autoprefixer',
        'concat:style'
    ]);

    grunt.registerTask('placeassets', [
        'concurrent:copyassets',
        'rev:assets',
        'writeassetpaths'
    ]);

    grunt.registerTask('buildscripts', [
        'requirejs',
        'copy:zip',
        'rev:zip',
        'writeconfig'
    ]);

    grunt.registerTask('build', [
        'clean:dist',

        'concurrent:firstlayer',

        'uglify:bootstrap',
        'concat:requirejs',
        'modernizr',
        'rev:scripts',
        'writescripttag',

        'useminPrepare',
        'cssmin',
        'appcache:dist',
        'rev:manifest',
        'usemin',
        'preprocess:dist',
        'dom_munger:dist',
        'htmlmin'
    ]);

    grunt.registerTask('demo', [
        'clean:dist',

        'concurrent:firstlayer',

        'uglify:bootstrap',
        'concat:requirejs',
        'modernizr',
        'rev:scripts',
        'writescripttag',

        'useminPrepare',
        'cssmin',
        'appcache:demo',
        'rev:manifest',
        'usemin',
        'preprocess:demo',
        'dom_munger:dist',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);
};

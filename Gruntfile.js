module.exports = function(grunt) {

    'use strict';

	// Loader auto...
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({

		// Compliation des styles
		sass: {
		    dist: {
				options: {
					style: 'expanded',
                    sourcemap: 'auto',
                    loadPath: 'node_modules/foundation-sites/scss'
				},
				files: {
					'docs/assets/markdocs.css': 'src/scss/markdocs.scss'
				}
		    }
		},

        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 10']
            },
            target: {
                src: 'docs/assets/markdocs.css',
                dest: 'docs/assets/markdocs.css'
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'docs/assets/markdocs.min.css': ['docs/assets/markdocs.css']
                }
            }
        },



		// compilation des scripts
		babel: {
			options: {
				sourceMap: false,
				presets: ['babel-preset-es2015']
			},
			dist: {
				files: {
					'src/scripts/app.dev.js': 'src/scripts/app.js'
				}
			}
		},
		browserify: {
            dist: {
                files: {
                    'docs/assets/markdocs.js': ['src/scripts/app.dev.js']
                }
            }
		},
        uglify: {
		    bim: {
		        files: {
		            'docs/assets/markdocs.min.js': ['docs/assets/markdocs.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/scripts/*.js'],
                tasks: ['babel', 'browserify', 'uglify:bim'],
                options: {}
            },
            styles: {
                files: ['src/scss/*.scss'],
                tasks: ['sass', 'autoprefixer', 'cssmin'],
                options: {}
            }
        }

	});

	// Task(s).
	grunt.registerTask('js', ['watch:scripts']);
	grunt.registerTask('css', ['watch:styles']);
};
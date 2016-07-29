module.exports = function(grunt) {

	// Loader auto...
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({

		// Compliation des styles
		sass: {
		    dist: {
				options: {
					style: 'expanded',
					sourcemap: 'none'
				},
				files: {
					'docs/assets/markdocs.css': 'src/scss/markdocs.scss'
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
		            'docs/assets/markdocs.js': ['docs/assets/markdocs.js']
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
                tasks: ['sass'],
                options: {}
            }
        }

	});

	// Task(s).
	grunt.registerTask('js', ['watch:scripts']);
	grunt.registerTask('css', ['watch:styles']);
};
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
					'app/styles/sample.css': 'src/sass/sample.sass'
				}
		    }
		},

		// compilation des scripts
		babel: {
			options: {
				sourceMap: false,
				presets: ['babel-preset-es2015'],
			},
			dist: {
				files: {
					'app/js/app.js': 'src/scripts/sample.js'
				}
			}
		},
		watch: {
		  scripts: {
		    files: ['src/scripts/*.js'],
		    tasks: ['babel'],
		    options: {},
		  },
		  styles: {
		    files: ['src/sass/*.sass'],
		    tasks: ['sass'],
		    options: {},
		  }
		}

	});

	// Task(s).
	grunt.registerTask('js', ['watch:scripts']);
	grunt.registerTask('css', ['watch:styles']);
}
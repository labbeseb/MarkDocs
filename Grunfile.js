module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({


	});

	// Loaders
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');

	// Task(s).
	grunt.registerTask('default', ['uglify']);
}
module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: ';'
			}, 
			dist: {
				src: ['src/js/variables.js', 'src/js/main.js', 'src/js/calculator.js', 'src/js/scale.js'],
				dest: 'js/app.js'
			}
		},

		watch: {
			files: ['src/js/variables.js', 'src/js/main.js', 'src/js/calculator.js', 'src/js/scale.js'], 
			tasks: ['concat']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat']);
}

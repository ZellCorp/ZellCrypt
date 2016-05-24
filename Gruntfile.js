module.exports = function(grunt) {
//to do !
    // Project configurations
    grunt.initConfig({
        concat: {
            prod: {
                src: [''], // source files
                dest: '' // destination files
            }
        },
        uglify: {
            prod: {
                src: '',
                dest: ''
            }
        },
        clean: {
            prod: {
                src: ''
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Definition of Grunt's task
    grunt.registerTask('ZellCrypt', ['concat:prod','uglify:prod', 'clean:prod'])

};
module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            all: {
                options: {
                    compress: true,
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
                    ]
                },
                files: {
                    "css/main.min.css": "less/main.less"
                }
            }
        },
        uglify: {
            my_target: {
                files: {
                    'js/main.min.js': ['js/main.js']
                }
            }
        },
        watch: {
            files: ['less/*', 'js/main.js'],
            tasks: ['less', 'uglify']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
};

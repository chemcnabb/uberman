module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      dist: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          sourceMap: true
        },
        files: {
          'static/bundle.min.js': ['<%= browserify.js.dest %>']
        }
      },
    },

    jshint: {
      files: ['Gruntfile.js', 'js/**/*.js', '!js/lib/**/*.js'],
      options: {
        // options here to override JSHint defaults
        reporterOutput: "",
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },

    sass: {
      options: {
        style: 'expanded',
        loadPath: ['bower_components/foundation/scss']
      },
      dist: {
        files: {
          '../bishi/apps/ui/static/core.css' : 'css/main.scss'
        }
      },
      foundation: {
        files: {
          '../bishi/apps/ui/static/foundation.css' : 'css/foundation/app.scss'
        }
      }
    },

    browserify: {
      js: {
        // A single entry point for our app
        src: 'js/app.js',
        // Compile to a single file to add a script tag for in your HTML
        dest: 'static/bundle.js'
      },
    },

    /*copy: {
      main: {
        src: 'dist/*',
        dest: 'static/',
      },
    },
    */

    connect: {
      server: {
        options: {
          port: 9000,
          base: '.',
          hostname: '127.0.0.1',
          protocol: 'http',
          livereload: true,
          open: true,
        }
      }
    },
    watch: {
      options: {
        livereload:true
      },
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint','browserify','uglify']

      }
    }
  });

  grunt.task.registerTask('js', ['jshint','browserify','uglify']);

  grunt.task.registerTask('default', ['connect','watch']);
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');


};
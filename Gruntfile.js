module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc : {
        dist : {
            src: ['src/**/*.js'], 
            options: {
                destination: 'doc'
            }
        }
    },
    dox: {
      options: {
        title: "PGR projekt - Webová 3D hra"
      },
      files: {
        src: ['src/game.js','src/shaders','src/textures','src/scene'],
        ignore: ['_worker.js'],
        dest: 'doc'
      }
    },
    clean: ['doc/*'],
    execute: {
        target: {
            src: ['./models/build.js'],
            options: {
                cwd: './models/'
            },
        }
    }


  });

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.loadNpmTasks('grunt-dox');


  grunt.registerTask('doc',['dox']);

  grunt.registerTask('models',['execute']);

  grunt.registerTask('build',['clean','execute','doc']);

};
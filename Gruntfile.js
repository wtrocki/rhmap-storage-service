'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: ['gruntfile.js', 'application.js', 'lib/**/*.js', 'test/**/*.js'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['public/views/**', 'app/views/**'],
        options: {
          livereload: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'application.js',
        options: {
          args: [],
          ignore: ['public/**'],
          ext: 'js,html',
          nodeArgs: [],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      serve: ['nodemon', 'watch'],
      debug: ['node-inspector', 'shell:debug', 'open:debug'],
      options: {
        logConcurrentOutput: true
      }
    },
    env: {
      options: {},
      // environment variables - see https://github.com/jsoverson/grunt-env for more information
      local: {
        FH_USE_LOCAL_DB: true,
        FH_SERVICE_MAP: function() {
          /*
           * Define the mappings for your services here - for local development.
           * You must provide a mapping for each service you wish to access
           * This can be a mapping to a locally running instance of the service (for local development)
           * or a remote instance.
           */
          var serviceMap = {
            'SERVICE_GUID_1': 'http://127.0.0.1:8010',
            'SERVICE_GUID_2': 'https://host-and-path-to-service'
          };
          return JSON.stringify(serviceMap);
        }
      }
    },
    'node-inspector': {
      dev: {}
    },
    shell: {
      debug: {
        options: {
          stdout: true
        },
        command: 'env NODE_PATH=. node --debug-brk application.js'
      },
      unit: {
        options: {
          stdout: true,
          stderr: true
        },
        command: 'env NODE_PATH=. ./node_modules/.bin/mocha -A -u exports --recursive test/unit/'
      },
      accept: {
        options: {
          stdout: true,
          stderr: true
        },
        command: 'env NODE_PATH=. ./node_modules/.bin/mocha -A -u exports --recursive test/server.js test/accept/'
      },
      coverage_unit: {
        options: {
          stdout: true,
          stderr: true
        },
        command: [
          'rm -rf coverage cov-unit',
          'env NODE_PATH=. ./node_modules/.bin/istanbul cover --dir cov-unit ./node_modules/.bin/turbo -- test/unit',
          './node_modules/.bin/istanbul report',
          'echo "See html coverage at: `pwd`/coverage/lcov-report/index.html"'
        ].join('&&')
      },
      coverage_accept: {
        options: {
          stdout: true,
          stderr: true
        },
        command: [
          'rm -rf coverage cov-accept',
          'env NODE_PATH=. ./node_modules/.bin/istanbul cover --dir cov-accept ./node_modules/.bin/turbo -- --setUp=test/accept/server.js --tearDown=test/accept/server.js test/accept',
          './node_modules/.bin/istanbul report',
          'echo "See html coverage at: `pwd`/coverage/lcov-report/index.html"'
        ].join('&&')
      }
    },
    open: {
      debug: {
        path: 'http://127.0.0.1:8080/debug?port=5858',
        app: 'Google Chrome'
      },
      platoReport: {
        path: './plato/index.html',
        app: 'Google Chrome'
      }
    },
    plato: {
      src: {
        options: {
          jshint: grunt.file.readJSON('.jshintrc')
        },
        files: {
          'plato': ['lib/**/*.js']
        }
      }
    },
    jshint: {
      files: ['*.js', 'lib/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: true
      }
    },
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Testing tasks
  grunt.registerTask('test', ['jshint', 'shell:unit', 'shell:accept']);
  grunt.registerTask('unit', ['jshint', 'shell:unit']);
  grunt.registerTask('accept', ['env:local', 'shell:accept']);

  // Coverate tasks
  grunt.registerTask('coverage', ['shell:coverage_unit', 'shell:coverage_accept']);
  grunt.registerTask('coverage-unit', ['shell:coverage_unit']);
  grunt.registerTask('coverage-accept', ['env:local', 'shell:coverage_accept']);


  grunt.registerTask('analysis', ['plato:src', 'open:platoReport']);

  grunt.registerTask('serve', ['env:local', 'concurrent:serve']);
  grunt.registerTask('debug', ['env:local', 'concurrent:debug']);
  grunt.registerTask('default', ['serve']);
};

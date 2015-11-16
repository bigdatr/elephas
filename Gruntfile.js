module.exports = function(grunt){
    grunt.initConfig({
//        mochaTest: {
//            test: {
//                options: {
//                    require: './tests/blanket',
//                    reporter: 'spec',
//                    quiet: false, // Optionally suppress output to standard out (defaults to false)
//                },
//                src: ['**/__test__/*.js']
//            },
//            coverage:{
//                options : {
//                    require: './tests/bable-setup.js',
//                    reporter: 'html-cov',
//                    quiet: false,
//                    captureFile: 'coverage.html'
//                },
//                src: ['**/__test__/*.js']
//            }
//        }
        mocha_istanbul: {
            target : {
                options : {
                    dryRun: true,
                    ui: true,
                    scriptPath: require.resolve('babel-istanbul'),
                    istanbulOptions: '--use-babel-runtime',
                    require: './test/test-setup.js'
                    //mochaOptions: '--require ./tests/bable-setup.js' 
                }
            },
            coverage: {
                src: ['**/__test__/*.js'], 
                options : {
                    dryRun: false,
                    coverageFolder: 'coverage',
                    root: './lib',
                    excludes: ['**/__test__/*.js'],
                    print: 'detail',
//                    scriptPath: require.resolve('babel-istanbul'),
                    istanbulOptions: ['--use-babel-runtime'],
                    //mochaOptions: ['require ./tests/bable-setup.js'],
                    require: './test/test-setup.js',
                    recursive: true,
                    istanbulOptions: ['--include-all-sources'],
//                    reportFormats:  ['lcov', 'html'] 
                }
            }
        },
        coveralls: {
        // Options relevant to all targets
            options: {
              // When true, grunt-coveralls will only print a warning rather than
              // an error, to prevent CI builds from failing unnecessarily (e.g. if
              // coveralls.io is down). Optional, defaults to false.
              force: true
            },

            post_lcov: {
            // LCOV coverage file (can be string, glob or array)
                src: 'coverage/lcov.info',
                options: {
                    // Any options for just this target
                }
            },
        },
    });
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.registerTask('test', ['mocha_istanbul:coverage']);
};



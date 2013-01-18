/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dirs:{
            src: 'dev/js/libs/impact/lib',
            dest:'dist/<%= pkg.name %>/<%= pkg.version %>'
        },
        meta: {
            banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
        },
        server: {
            port: 9999,
            base: 'dev'
        },
        lint: {
            files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
        },
        qunit: {
            files: ['test/**/*.html']
        },
        concat: {
            basic: {
              src: [
              '<%= dirs.src %>/game/main.js',
              '<%= dirs.src %>/game/models/player-model.js',
              '<%= dirs.src %>/game/models/sprites-data.js',
              '<%= dirs.src %>/game/levels/levelOne.js',
              '<%= dirs.src %>/game/levels/levelTwo.js',
              '<%= dirs.src %>/game/levels/levelThree.js'
                    ],
              dest: '<%= dirs.dest %>/min.js'
            },
        },
        min: {
            dist: {
                src: ['<%= dirs.dest %>/min.js'],
                dest: '<%= dirs.dest %>/archie.min.js'
            }
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'lint qunit'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {
                jQuery: true
            }
        },
        uglify: {
            target: {
                files: {
                    '<%= dirs.dest %>/archie.min.js': ['<%= dirs.dest %>/archie.min.js']
                },
                mangle: {toplevel: true},
                squeeze: {dead_code: false},
                codegen: {quote_keys: true}
             }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify')

    // Default task.
    grunt.registerTask('default', 'lint qunit concat min');

    grunt.registerTask('wait', 'Wait for a set amount of time.', function(delay) {
        var d = delay ? delay + ' second' + (delay === '1' ? '' : 's') : 'forever';
        grunt.log.write('Waiting ' + d + '...');
        var done = this.async();
        if (delay) { setTimeout(done, delay * 1000); }
    });

    grunt.registerTask('test-server', ['server', 'wait']);
    grunt.registerTask('build', ['concat', 'min', 'uglify'])
};

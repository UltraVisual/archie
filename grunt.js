/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: '<json:package.json>',
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
            dist: {
                src: ['<banner:meta.banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        min: {
            dist: {
                src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest: 'dist/<%= pkg.name %>.min.js'
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
        uglify: {}
    });

    // Default task.
    grunt.registerTask('default', 'lint qunit concat min');

    grunt.registerTask('wait', 'Wait for a set amount of time.', function(delay) {
        var d = delay ? delay + ' second' + (delay === '1' ? '' : 's') : 'forever';
        grunt.log.write('Waiting ' + d + '...');
        var done = this.async();
        if (delay) { setTimeout(done, delay * 1000); }
    });

    grunt.registerTask('test-server', ['server', 'wait']);
};

# vim: sw=2
module.exports = (grunt) ->

  filterForJS = (files) -> files.filter (file)->file.match(/\.js$/)
  filterForCSS = (files) -> files.filter (file)->file.match(/\.css$/)

  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-conventional-changelog"
  grunt.loadNpmTasks "grunt-bump"
  grunt.loadNpmTasks "grunt-git"
  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-karma"
  grunt.loadNpmTasks "grunt-http-server"
  grunt.loadNpmTasks "grunt-ngmin"
  grunt.loadNpmTasks "grunt-html2js"
  grunt.loadNpmTasks 'grunt-angular-gettext'

  _ = require("underscore")
  path = require("path")

  taskConfig =
    pkg: grunt.file.readJSON("package.json")

    gitpush:
      all:
        options:
          remote: "origin"
          all: true
    gitmerge:
      devel:
        options:
          branch: "devel"
    gitcheckout:
      devel:
        options:
          branch: "devel"
      master:
        options:
          branch: "master"

    nggettext_extract:
      pot:
        files:
          'po/template.pot': ['src/**/*.html', 'src/**/*.coffee']
    nggettext_compile:
      all:
        files:
          '<%= build_dir %>/src/app/translations.js': ["<%= app_files.po %>"]
    meta:
      banner: "/**\n" + " * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd\") %>\n" + " * <%= pkg.homepage %>\n" + " *\n" + " * Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author %>\n" + " * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n" + " */\n"
    "http-server":
      dev:
        root: "build"
        port: 8000
        host: "127.0.0.1"
        showDir: true
        autoIndex: true
        defaultExt: "html"
        runInBackground: false
    changelog:
      options:
        dest: "CHANGELOG.md"
        template: "changelog.tpl"
    bump:
      options:
        files: [
          "package.json"
          "bower.json"
        ]
        commit: false
        commitMessage: "chore(release): v%VERSION%"
        commitFiles: [
          "package.json"
          "client/bower.json"
        ]
        createTag: false
        tagName: "v%VERSION%"
        tagMessage: "Version %VERSION%"
        push: false
        pushTo: "origin"
    clean: [
      "<%= build_dir %>"
      "<%= compile_dir %>"
    ]
    copy:
      build_app_assets:
        files: [
          src: ["**"]
          dest: "<%= build_dir %>/assets/"
          cwd: "src/assets"
          expand: true
        ]
      build_vendor_assets:
        files: [
          src: ["<%= vendor_files.assets %>"]
          dest: "<%= build_dir %>/assets/"
          cwd: "."
          expand: true
          flatten: true
        ]
      build_appjs:
        files: [
          src: ["<%= app_files.js %>"]
          dest: "<%= build_dir %>/"
          cwd: "."
          expand: true
        ]
      build_vendorjs:
        files: [
          src: ["<%= vendor_files.js %>"]
          dest: "<%= build_dir %>/"
          cwd: "."
          expand: true
        ]
      compile_assets:
        files: [
          src: ["**"]
          dest: "<%= compile_dir %>/assets"
          cwd: "<%= build_dir %>/assets"
          expand: true
        ]
      deploy:
        files: [
          src: ["**"]
          dest: "<%= deploy_dir %>"
          cwd: "<%= compile_dir %>"
          expand: true
        ]
    concat:
      build_css:
        src: [
          "<%= vendor_files.css %>"
          "<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css"
        ]
        dest: "<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css"
      compile_js:
        options:
          banner: "<%= meta.banner %>"
        src: [
          "<%= vendor_files.js %>"
          "module.prefix"
          "<%= build_dir %>/src/**/*.js"
          "<%= html2js.app.dest %>"
          "<%= html2js.common.dest %>"
          "module.suffix"
        ]
        dest: "<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js"
    coffee:
      source:
        options:
          bare: true
        expand: true
        cwd: "."
        src: ["<%= app_files.coffee %>"]
        dest: "<%= build_dir %>"
        ext: ".js"
    ngmin:
      compile:
        files: [
          src: ["<%= app_files.js %>"]
          cwd: "<%= build_dir %>"
          dest: "<%= build_dir %>"
          expand: true
        ]
    uglify:
      compile:
        options:
          banner: "<%= meta.banner %>"
        files:
          "<%= concat.compile_js.dest %>": "<%= concat.compile_js.dest %>"
    less:
      build:
        files:
          "<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css": "<%= app_files.less %>"
        options: {}
      compile:
        files:
          "<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css": "<%= app_files.less %>"
        options: {}
    jshint:
      src: ["<%= app_files.js %>"]
      test: ["<%= app_files.jsunit %>"]
      gruntfile: ["Gruntfile.js"]
      options:
        curly: true
        immed: true
        newcap: true
        noarg: true
        sub: true
        boss: true
        eqnull: true
      globals: {}
    coffeelint:
      src:
        files:
          src: ["<%= app_files.coffee %>"]
      test:
        files:
          src: ["<%= app_files.coffeeunit %>"]
    html2js:
      app:
        options:
          base: "src/app"
          rename: (moduleName) ->
            path.basename moduleName, ".tpl.html"
        src: ["<%= app_files.atpl %>"]
        dest: "<%= build_dir %>/templates-app.js"
      common:
        options:
          base: "src/common"
          rename: (moduleName) ->
            path.basename moduleName, ".html"
        src: ["<%= app_files.ctpl %>"]
        dest: "<%= build_dir %>/templates-common.js"
    karma:
      options:
        configFile: "<%= build_dir %>/karma-unit.js"
      unit:
        runnerPort: 9101
        background: true
      continuous:
        singleRun: true
        background: true
    index:
      build:
        dir: "<%= build_dir %>"
        src: [
          "<%= vendor_files.js %>"
          "<%= build_dir %>/src/**/*.js"
          "<%= html2js.common.dest %>"
          "<%= html2js.app.dest %>"
          "<%= vendor_files.css %>"
          "<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css"
        ]
      compile:
        dir: "<%= compile_dir %>"
        src: [
          "<%= concat.compile_js.dest %>"
          "<%= vendor_files.css %>"
          "<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css"
        ]
    karmaconfig:
      unit:
        dir: "<%= build_dir %>"
        src: [
          "<%= vendor_files.js %>"
          "<%= html2js.app.dest %>"
          "<%= html2js.common.dest %>"
          "<%= test_files.js %>"
        ]
    delta:
      options:
        livereload: true
      gruntfile:
        files: "Gruntfile.js"
        tasks: ["jshint:gruntfile"]
        options:
          livereload: false
      jssrc:
        files: ["<%= app_files.js %>"]
        tasks: [
          "jshint:src"
          "karma:unit:run"
          "copy:build_appjs"
        ]
      coffeesrc:
        files: ["<%= app_files.coffee %>"]
        tasks: [
          "coffeelint:src"
          "coffee:source"
          "karma:unit:run"
          "copy:build_appjs"
        ]
      assets:
        files: ["src/assets/**/*"]
        tasks: ["copy:build_assets"]
      html:
        files: ["<%= app_files.html %>"]
        tasks: ["index:build"]
      tpls:
        files: [
          "<%= app_files.atpl %>"
          "<%= app_files.ctpl %>"
        ]
        tasks: ["html2js"]
      less:
        files: ["src/**/*.less"]
        tasks: ["less:build"]
      jsunit:
        files: ["<%= app_files.jsunit %>"]
        tasks: [
          "jshint:test"
          "karma:unit:run"
        ]
        options:
          livereload: false
      coffeeunit:
        files: ["<%= app_files.coffeeunit %>"]
        tasks: [
          "coffeelint:test"
          "karma:unit:run"
        ]
        options:
          livereload: false

  userConfig = require("./build.config.js")
  grunt.initConfig _.extend(taskConfig, userConfig)

  grunt.renameTask "watch", "delta"
  grunt.registerTask "watch", [
    "build"
    "karma:unit"
    "delta"
  ]

  grunt.registerTask "push", [
    "gitcheckout:master"
    "gitmerge:devel"
    "gitcheckout:devel"
    "gitpush:all"
  ]

  grunt.registerTask "server", ["http-server:dev"]

  grunt.registerTask "default", [
    "build"
    "compile"
  ]
  grunt.registerTask "build", [
    "clean"
    "html2js"
    "jshint"
    "coffeelint"
    "coffee"
    "nggettext_compile"
    "less:build"
    "concat:build_css"
    "copy:build_app_assets"
    "copy:build_vendor_assets"
    "copy:build_appjs"
    "copy:build_vendorjs"
    "index:build"
    "karmaconfig"
    "karma:continuous"
  ]
  grunt.registerTask "compile", [
    "less:compile"
    "copy:compile_assets"
    "ngmin"
    "concat:compile_js"
    "uglify"
    "index:compile"
  ]
  grunt.registerTask "deploy", [
    "push"
    "compile"
    "copy:deploy"
  ]
  grunt.registerMultiTask "index", "Process index.html template", ->
    dirRE = new RegExp("^(" + grunt.config("build_dir") + "|" + grunt.config("compile_dir") + ")/", "g")
    jsFiles = filterForJS(@filesSrc).map((file) ->
      file.replace dirRE, ""
    )
    cssFiles = filterForCSS(@filesSrc).map((file) ->
      file.replace dirRE, ""
    )
    grunt.file.copy "src/index.html", @data.dir + "/index.html",
      process: (contents, path) ->
        grunt.template.process contents,
          data:
            scripts: jsFiles
            styles: cssFiles
            version: grunt.config("pkg.version")
    return
  grunt.registerMultiTask "karmaconfig", "Process karma config templates", ->
    jsFiles = filterForJS(@filesSrc)
    grunt.file.copy "karma/karma-unit.tpl.js", grunt.config("build_dir") + "/karma-unit.js",
      process: (contents, path) ->
        grunt.template.process contents,
          data:
            scripts: jsFiles
    return

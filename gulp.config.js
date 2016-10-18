module.exports = function () {
  const client = './src/client/';
  const server = './src/server/';
  const clientApp = client + 'app/';
  const report = './report/';
  const root = './';
  const specRunnerFile = 'specs.html';
  const temp = './.tmp/';
  const wiredep = require('wiredep');
  const bowerFiles = wiredep({ devDependencies: true }).js;
  const bower = {
    json: require('./bower.json'),
    directory: './bower_components/',
    ignorePath: '../..',
  };
  const nodeModules = 'node_modules';

  const config = {
    /**
     * File paths
     */
    // all javascript that we want to vet
    alljs: [
      './src/**/*.js',
      './*.js',
    ],
    build: './build/',
    client,
    css: temp + 'styles.css',
    fonts: [
      bower.directory + 'bootstrap/fonts/**/*.*',
      bower.directory + 'font-awesome/fonts/**/*.*',
    ],
    html: client + '**/*.html',
    htmltemplates: clientApp + '**/*.html',
    images: client + 'images/**/*.*',
    index: client + 'index.html',
    // app js, with no specs
    js: [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js',
      '!' + clientApp + '**/*.spec.js',
    ],
    jsOrder: [
      '**/app.module.js',
      '**/*.module.js',
      '**/*.js',
    ],
    less: client + 'styles/*.less',
    report,
    root,
    server,
    source: 'src/',
    stubsjs: [
      bower.directory + 'angular-mocks/angular-mocks.js',
      client + 'stubs/**/*.js',
    ],
    temp,

    /**
     * optimized files
     */
    optimized: {
      app: 'start.js',
      lib: 'lib.js',
    },

    /**
     * plato
     */
    plato: { js: clientApp + '**/*.js' },

    /**
     * browser sync
     */
    browserReloadDelay: 1000,

    /**
     * template cache
     */
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'app.core',
        root: 'app/',
        standalone: false,
      },
    },

    /**
     * Bower and NPM files
     */
    bower,
    packages: [
      './package.json',
      './bower.json',
    ],

    /**
     * specs.html, our HTML spec runner
     */
    specRunner: client + specRunnerFile,
    specRunnerFile,

    /**
     * The sequence of the injections into specs.html:
     *  1 testlibraries
     *      mocha setup
     *  2 bower
     *  3 js
     *  4 spechelpers
     *  5 specs
     *  6 templates
     */
    testlibraries: [
      nodeModules + '/mocha/mocha.js',
      nodeModules + '/chai/chai.js',
      nodeModules + '/sinon-chai/lib/sinon-chai.js',
    ],
    specHelpers: [client + 'test-helpers/*.js'],
    specs: [clientApp + '**/*.spec.js'],
    serverIntegrationSpecs: [client + '/tests/server-integration/**/*.spec.js'],
    serverHelpers: [server + '/tests/helpers'],
    serverSpecs: [server + '/tests/**/*.js'],

    /**
     * Node settings
     */
    nodeServerDev: server + 'start.js',
    nodeServerBuild: server + 'start.js',
    defaultPort: '3000',
  };

  /**
   * wiredep and bower settings
   */
  config.getWiredepDefaultOptions = function () {
    const options = {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath,
    };
    return options;
  };

  /**
   * karma settings
   */
  config.karma = getKarmaOptions();

  return config;

  // //////////////

  function getKarmaOptions() {
    const options = {
      files: [].concat(
        bowerFiles,
        config.specHelpers,
        clientApp + '**/*.module.js',
        clientApp + '**/*.js',
        temp + config.templateCache.file,
        config.serverIntegrationSpecs
      ),
      exclude: [],
      coverage: {
        dir: report + 'coverage',
        reporters: [
          // reporters not supporting the `file` property
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' },
          { type: 'text-summary' }, // , subdir: '.', file: 'text-summary.txt'}
        ],
      },
      preprocessors: {
        'src/**/*.js': ['babel'],
      },
      babelPreprocessor: {
        options: {
          presets: ['es2015'],
          sourceMap: 'inline',
        },
        filename(file) {
          return file.originalPath.replace(/\.js$/, '.es5.js');
        },
        sourceFileName(file) {
          return file.originalPath;
        },
      },
    };
    options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
    return options;
  }
};

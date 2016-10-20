import del from 'del';
import glob from 'glob';
import gulp from 'gulp';
import path from 'path';
import mocha from 'gulp-mocha';
import _ from 'lodash';
import sourcemaps from 'gulp-sourcemaps';
import istanbul from 'gulp-istanbul';
import coveralls from 'gulp-coveralls';
import runSequence from 'run-sequence';
import merger from 'lcov-result-merger';

const isparta = require('isparta');
const args = require('yargs').argv;
const config = require('./gulp.config')();
const $ = require('gulp-load-plugins')({ lazy: true });
const port = process.env.PORT || config.defaultPort;

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-dev
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --nosync   : Don't launch the browser with browser-sync when serving code.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 * --startServers: Will start servers for midway tests on the test task.
 */

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', () => {
  log('Analyzing source with eslint');
  return gulp
    .src(config.alljs)
    .pipe($.eslint())
    .pipe($.eslint.format());
});

/**
 * Create a visualizer report
 */
gulp.task('plato', (done) => {
  log('Analyzing source with Plato');
  log('Browse to /report/plato/index.html to see Plato results');

  startPlatoVisualizer(done);
});

/**
 * Compile less to css
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], () => {
  log('Compiling Less --> CSS');

  return gulp
    .src(config.less)
    .pipe($.plumber()) // exit gracefully if something fails after this
    .pipe($.less())
    //        .on('error', errorLogger) // more verbose and dupe output. requires emit.
    .pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
    .pipe(gulp.dest(config.temp));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', ['clean-fonts'], () => {
  log('Copying fonts');

  return gulp
    .src(config.fonts)
    .pipe(gulp.dest(config.build + 'fonts'));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], () => {
  log('Compressing and copying images');

  return gulp
    .src(config.images)
    .pipe($.imagemin({ optimizationLevel: 4 }))
    .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('less-watcher', () => {
  gulp.watch([config.less], ['styles']);
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], () => {
  log('Creating an AngularJS $templateCache');

  return gulp
    .src(config.htmltemplates)
    .pipe($.if(args.verbose, $.bytediff.start()))
    .pipe($.minifyHtml({ empty: true }))
    .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
    .pipe($.angularTemplatecache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe(gulp.dest(config.temp));
});

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', () => {
  log('Wiring the bower dependencies into the html');

  const wiredep = require('wiredep').stream;
  const options = config.getWiredepDefaultOptions();

  // Only include stubs if flag is enabled
  const js = args.stubs ? [].concat(config.js, config.stubsjs) : config.js;

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe(inject(js, '', config.jsOrder))
    .pipe(gulp.dest(config.client));
});

gulp.task('inject', ['wiredep', 'styles', 'templatecache'], () => {
  log('Wire up css into the html, after files are ready');

  return gulp
    .src(config.index)
    .pipe(inject(config.css))
    .pipe(gulp.dest(config.client));
});

/**
 * Run the spec runner
 * @return {Stream}
 */
gulp.task('serve-specs', ['build-specs'], (done) => {
  log('run the spec runner');
  serve(true /* isDev */, true /* specRunner */);
  done();
});

/**
 * Inject all the spec files into the specs.html
 * @return {Stream}
 */
gulp.task('build-specs', ['templatecache'], (done) => {
  log('building the spec runner');

  const wiredep = require('wiredep').stream;
  const templateCache = config.temp + config.templateCache.file;
  const options = config.getWiredepDefaultOptions();
  let specs = config.specs;

  if (args.startServers) {
    specs = [].concat(specs, config.serverIntegrationSpecs);
  }
  options.devDependencies = true;

  return gulp
    .src(config.specRunner)
    .pipe(wiredep(options))
    .pipe(inject(config.js, '', config.jsOrder))
    .pipe(inject(config.testlibraries, 'testlibraries'))
    .pipe(inject(config.specHelpers, 'spechelpers'))
    .pipe(inject(specs, 'specs', ['**/*']))
    .pipe(inject(templateCache, 'templates'))
    .pipe(gulp.dest(config.client));
});

/**
 * Build everything
 * This is separate so we can run tests on
 * optimize before handling image or fonts
 */
gulp.task('build', ['optimize-babel-js', 'images', 'fonts'], () => {
  log('Building everything');

  const msg = {
    title: 'gulp build',
    subtitle: 'Deployed to the build folder',
    message: 'Running `gulp serve-build`',
  };
  del(config.temp);
  log(msg);
  notify(msg);
});

gulp.task('optimize-babel-js', ['optimize'], () => {
  const dir = config.build + '/js/';

  const jsFilter = $.filter('**/app*.js');

  return gulp.src(dir + 'app**.js')
    .pipe(sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(jsFilter)
    .pipe($.uglify({
      mangle: false,
    }))
    .pipe(jsFilter.restore())
    .pipe(gulp.dest(dir));
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('optimize', ['inject'], () => {
  log('Optimizing the js, css, and html');

  const assets = $.useref.assets({ searchPath: './' });
  // Filters are named for the gulp-useref path
  const cssFilter = $.filter('**/*.css');
  const jsAppFilter = $.filter('**/' + config.optimized.app);
  const jslibFilter = $.filter('**/' + config.optimized.lib);

  const templateCache = config.temp + config.templateCache.file;

  return gulp
    .src(config.index)
    .pipe($.plumber())
    .pipe(inject(templateCache, 'templates'))
    .pipe(assets) // Gather all assets from the html with useref
    // Get the css
    .pipe(cssFilter)
    .pipe($.minifyCss())
    .pipe(cssFilter.restore())
    // Get the custom javascript
    .pipe(jsAppFilter)
    .pipe($.ngAnnotate({ add: true }))
    .pipe($.uglify())
    .pipe(getHeader())
    .pipe(jsAppFilter.restore())
    // Get the vendor javascript
    .pipe(jslibFilter)
    .pipe($.uglify()) // another option is to override wiredep to use min files
    .pipe(jslibFilter.restore())
    // Take inventory of the file names for future rev numbers
    .pipe($.rev())
    // Apply the concat and file replacement with useref
    .pipe(assets.restore())
    .pipe($.useref())
    // Replace the file names in the html with rev numbers
    .pipe($.revReplace())
    .pipe(gulp.dest(config.build));
});

/**
 * Remove all files from the build, temp, and reports folders
 * @param  [Function] done - callback when complete
 */
gulp.task('clean', (done) => {
  const delconfig = [].concat(config.build, config.temp, config.report);
  log('Cleaning: ' + $.util.colors.blue(delconfig));
  del(delconfig, done);
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', (done) => {
  clean(config.build + 'fonts/**/*.*', done);
});

/**
 * Remove all images from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', (done) => {
  clean(config.build + 'images/**/*.*', done);
});

/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', (done) => {
  const files = [].concat(
    config.temp + '**/*.css',
    config.build + 'styles/**/*.css'
  );
  clean(files, done);
});

/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', (done) => {
  const files = [].concat(
    config.temp + '**/*.js',
    config.build + 'js/**/*.js',
    config.build + '**/*.html'
  );
  clean(files, done);
});

/**
 * Runs the server-side test after ['vet'] task is successful
 */
gulp.task('server-test', (done) => {
  process.env.NODE_ENV = 'test';

  gulp.src([config.serverSrcFiles])
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
      includeUntested: true,
    }))
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      return gulp.src(config.serverSpecs, {
        read: false,
      })
      .pipe(mocha({
        require: config.serverHelpers,
        reporter: 'spec',
        slow: 5000,
        timeout: 10000,
      }))
      .once('end', () => {
        process.env.NODE_ENV = 'development';
        done();
      });
    });
});

/**
 * Report for server side test coverage
 */
gulp.task('server-coverage-report', ['server-test'], () => {
  return gulp.src(config.serverSpecs)
    .pipe(istanbul.writeReports({
      dir: 'coverage/server',
      reportOpts: { dir: './coverage/server' },
      reporters: ['lcov', 'text-summary'],
    }));
});
/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('client-test', ['templatecache'], (done) => {
  runClientTests(true /* singleRun*/, done);
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('client-autotest', (done) => {
  runClientTests(false /* singleRun*/, done);
});

/**
 * Run specs, return report and exit
 */
gulp.task('client-coverage-report', (done) => {
  clientCoverageReport(true, done);
});

/**
 * Merge server and client coverage reports
 */
gulp.task('merge-coverage-report', () => {
  return gulp.src('./coverage/**/lcov.info')
    .pipe(merger())
    .pipe(gulp.dest('./coverage/merged/'));
});

/**
 * Upload server side test coverage report to coveralls
 */
gulp.task('publish-coverage-report', () => {
  if (!process.env.CI) {
    return;
  }
  gulp.src(path.join(__dirname, 'coverage/merged/lcov.info'))
    .pipe(coveralls());
});

/**
 * Run server and client tests
 */
gulp.task('test', (done) => {
  runSequence('server-test', 'client-test', done);
});

/**
 * Run server and client test coverage report
 */
gulp.task('test-coverage', (done) => {
  runSequence('server-coverage-report', 'client-coverage-report', done);
});

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-dev', ['inject'], () => {
  serve(true /* isDev*/);
});

/**
 * serve the build environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-build', ['build'], () => {
  serve(false /* isDev*/);
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', () => {
  let msg = 'Bumping versions';
  const type = args.type;
  const version = args.ver;
  const options = {};
  if (version) {
    options.version = version;
    msg += ' to ' + version;
  } else {
    options.type = type;
    msg += ' for a ' + type;
  }
  log(msg);

  return gulp
    .src(config.packages)
    .pipe($.print())
    .pipe($.bump(options))
    .pipe(gulp.dest(config.root));
});

/**
 * Run specs on client side
 */
function runClientTests(singleRun, done) {
  const Karma = require('karma').Server;
  new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: !!singleRun,
  }, done).start();
}

/**
 * Report client side coverage using karm
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function clientCoverageReport(singleRun, done) {
  let child;
  let excludeFiles = [];
  const Karma = require('karma').Server;
  const fork = require('child_process').fork;
  const serverSpecs = config.serverIntegrationSpecs;

  if (args.startServers) {
    log('Starting servers');
    const savedEnv = process.env;
    savedEnv.NODE_ENV = 'dev';
    savedEnv.PORT = 8888;
    child = fork(config.nodeServer);
  } else {
    if (serverSpecs && serverSpecs.length) {
      excludeFiles = serverSpecs;
    }
  }

  new Karma({
    configFile: __dirname + '/karma.conf.js',
    exclude: excludeFiles,
    singleRun: !!singleRun,
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: config.karma.coverage.dir,
      reporters: config.karma.coverage.reporters,
    },
  }, karmaCompleted).start();

  // ////////////

  function karmaCompleted(karmaResult) {
    log('Karma completed');
    if (child) {
      log('shutting down the child process');
      child.kill();
    }
    if (karmaResult === 1) {
      done('karma: tests failed with code ' + karmaResult);
    } else {
      process.exit(0);
      done();
    }
  }
}


// //////////////

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(cleanPath, done) {
  log('Cleaning: ' + $.util.colors.blue(cleanPath));
  del(cleanPath, done);
}

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {
  const options = { read: false };
  if (label) {
    options.name = 'inject:' + label;
  }

  return $.inject(orderSrc(src, order), options);
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc(src, order) {
  // order = order || ['**/*'];
  return gulp
    .src(src)
    .pipe($.if(order, $.order(order)));
}

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev, specRunner) {
  const nodeOptions = getNodeOptions(isDev);

  if (args.verbose) {
    console.log(nodeOptions);
  }

  if (isDev) {
    gulp.watch([config.less], ['styles']);
    gulp.watch([config.alljs], ['vet']);
  }

  return $.nodemon(nodeOptions)
    .on('restart', ['vet'], function (ev) {
      log('*** nodemon restarted');
      log('files changed:\n' + ev);
    })
    .on('start', () => {
      log('*** nodemon started');
    })
    .on('crash', () => {
      log('*** nodemon crashed: script crashed for some reason');
    })
    .on('exit', () => {
      log('*** nodemon exited cleanly');
    });
}

function getNodeOptions(isDev) {
  return {
    nodeArgs: isDev ? ['--debug=5858'] : [],
    script: isDev ? config.nodeServerDev : config.nodeServerBuild,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDev ? 'development' : 'production',
    },
    watch: [config.server],
  };
}

// function runNodeInspector() {
//    log('Running node-inspector.');
//    log('Browse to http://localhost:8080/debug?port=5858');
//    const exec = require('child_process').exec;
//    exec('node-inspector');
// }


/**
 * Start Plato inspector and visualizer
 */
function startPlatoVisualizer(done) {
  log('Running Plato');

  const files = glob.sync(config.plato.js);
  const excludeFiles = /.*\.spec\.js/;
  const plato = require('plato');

  const options = {
    title: 'Plato Inspections Report',
    exclude: excludeFiles,
  };
  const outputDir = config.report + '/plato';

  plato.inspect(files, outputDir, options, platoCompleted);

  function platoCompleted(report) {
    const overview = plato.getOverviewReport(report);
    if (args.verbose) {
      log(overview.summary);
    }
    if (done) { done(); }
  }
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String}      Difference in bytes, formatted
 */
function bytediffFormatter(data) {
  const difference = (data.savings > 0) ? ' smaller.' : ' larger.';
  return data.fileName + ' went from ' +
    (data.startSize / 1000).toFixed(2) + ' kB to ' +
    (data.endSize / 1000).toFixed(2) + ' kB and is ' +
    formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Log an error message and emit the end of a task
 */
// function errorLogger(error) {
//    log('*** Start of Error ***');
//    log(error);
//    log('*** End of Error ***');
//    this.emit('end');
// }

/**
 * Format a number as a percentage
 * @param  {Number} num       Number to format as a percent
 * @param  {Number} precision Precision of the decimal
 * @return {String}           Formatted perentage
 */
function formatPercent(num, precision) {
  return (num * 100).toFixed(precision);
}

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
  const pkg = require('./package.json');
  const template = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @authors <%= pkg.authors %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    '',
  ].join('\n');
  return $.header(template, {
    pkg,
  });
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
  if (typeof (msg) === 'object') {
    for (const item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
  const notifier = require('node-notifier');
  const notifyOptions = {
    sound: 'Bottle',
    contentImage: path.join(__dirname, 'gulp.png'),
    icon: path.join(__dirname, 'gulp.png'),
  };
  _.assign(notifyOptions, options);
  notifier.notify(notifyOptions);
}

module.exports = gulp;

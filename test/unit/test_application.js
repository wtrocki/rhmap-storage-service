var sinon = require('sinon');
var proxyquire = require('proxyquire');

// mock out express app to allow verification in tests
var mockExpress = {
  use: function() {},
  listen: function() {},
  static: function() {}
};
var mockExpressApp = function() {
  return mockExpress;
};
var mockStaticHandler = function static(){};
mockExpressApp.static = function() {
  return mockStaticHandler;
};

// mock out fh-mbaas-api to allow verification in tests
var mockMbaasApi;
var mockSys;
var mockFhMiddleware;
var mockCloud;
var mockError;
var mockSysHandler = function sys(){};
var mockMbaasHandler = function mbaas(){};
var mockFhMiddlewareHandler = function fhmiddleware(){};
var mockCloudHandler = function cloud(){};
var mockErrorHandler = function errorHandler(){};
var createMockMbaasApi = function() {
  return {
    mbaasExpress: sinon.spy(function() {
      mockSys = sinon.spy(function() {
        return mockSysHandler;
      });

      mockFhMiddleware = sinon.spy(function() {
        return mockFhMiddlewareHandler;
      });

      mockCloud = sinon.spy(function() {
        return mockCloudHandler;
      });

      mockError = sinon.spy(function() {
        return mockErrorHandler;
      });

      return {
        sys: mockSys,
        mbaas: mockMbaasHandler,
        fhmiddleware: mockFhMiddleware,
        cloud: mockCloud,
        errorHandler: mockError
      };
    })
  };
};

// simple mock cors middleware
var mockCorsHandler = function cors(){};
var mockCors = function() {
  return mockCorsHandler;
};

// require the main app file, with mocked dependencies
var runApp = function() {
  mockMbaasApi = createMockMbaasApi();
  proxyquire('application.js', {
    'express': mockExpressApp,
    'fh-mbaas-api': mockMbaasApi,
    'cors': mockCors
  });
};

exports['test express app listen is called'] = function(done) {
  var mock = sinon.mock(mockExpress);
  mock.expects("listen").once().withArgs(8001, '0.0.0.0');

  runApp();

  mock.verify();
  return done();
};

exports['test all mbaas routes are mounted'] = function(done) {
  var mock = sinon.mock(mockExpress);
  mock.expects("use").once().withArgs('/sys', mockSysHandler);
  mock.expects("use").once().withArgs('/mbaas', mockMbaasHandler);
  mock.expects("use").atLeast(4); // allow for other calls to use()

  runApp();

  mock.verify();
  return done();
};

exports['test all mbaas setup functions are called'] = function(done) {
  runApp();

  // easier to use assertions here on spies instead of mocks
  // because of the nesting of functions & handlers in fh-mbaas-api
  sinon.assert.calledOnce(mockMbaasApi.mbaasExpress);
  sinon.assert.calledOnce(mockSys);
  sinon.assert.calledOnce(mockFhMiddleware);
  sinon.assert.calledOnce(mockError);

  return done();
};

exports['test all required middleware is added to express'] = function(done) {
  var mock = sinon.mock(mockExpress);
  mock.expects("use").once().withArgs(mockCorsHandler);
  mock.expects("use").once().withArgs(mockStaticHandler);
  mock.expects("use").once().withArgs(mockFhMiddlewareHandler);
  mock.expects("use").once().withArgs(mockErrorHandler);
  mock.expects("use").atLeast(3); // allow for other calls to use()

  runApp();

  mock.verify();
  return done();
};
# Grunt

This template uses [Grunt](http://gruntjs.com/), the Javascript Task Runner. To use Grunt with this Template App, do the following:

* Install grunt: ```npm install -g grunt-cli```
* In your App directory, run: ```npm install```. This installs Grunt plugins, etc for use with this App.

# Tasks

The following are a short overview of the Grunt tasks available for this App. You can get a full list of tasks from Grunt with ```grunt --help```.

## grunt serve

Run ```grunt serve``` to serve this App locally. By default this App will run on http://localhost:8001.

Note that 'grunt serve' supports live reload, i.e. it will monitor for any changes in your node.js application and automatically restart the server

## grunt debug

Run ```grunt debug``` to debug this App locally. This task uses [Node Inspector](https://github.com/node-inspector/node-inspector) to debug your application, and will open the Debugger at 'application.js' in Google Chrome. See the documentation for [Node Inspector](https://github.com/node-inspector/node-inspector) for more information on how to use Node Inspector.

## grunt test

Run ```grunt test``` to run the unit tests for this App.

## grunt coverage

This App uses [Istanbul](https://github.com/gotwarlost/istanbul) for generating code coverage for your tests.

Run ```grunt coverage``` to run code coverage for this App.

## grunt analysis

Run ```grunt analysis``` to get a static analysis report of your code. This task uses [Plato](https://github.com/es-analysis/plato) to generate the report. See the documentaion for [Plato](https://github.com/es-analysis/plato) for more information on how to use and configure Plato.

## Environment variables

The [grunt env](https://www.npmjs.org/package/grunt-env) plugin is included by default. To set your own environment variables, modify the `env` config accordingly, e.g.

```
 env : {
      options : {},
      // Sample environment variable - see https://github.com/jsoverson/grunt-env for more information
      local : {
        SAMPLE_ENV_VAR : 'sample-env-var'
      }
    },
```

Alternatively you can load environment variables from a local file, see the `grunt env` [documentation](https://www.npmjs.org/package/grunt-env#using-external-files) for more details.



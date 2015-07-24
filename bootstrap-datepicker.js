angular.module("schemaForm").run(["$templateCache", function($templateCache) {$templateCache.put("directives/decorators/bootstrap/datepicker/datepicker.html","<div class=\"form-group {{form.htmlClass}}\" ng-class=\"{\'has-error\': hasError()}\">\n  <label class=\"control-label\" ng-show=\"showTitle()\">{{form.title}}</label>\n  <div ng-class=\"{\'input-group\': (form.fieldAddonLeft || form.fieldAddonRight)}\">\n    <span ng-if=\"form.fieldAddonLeft\"\n          class=\"input-group-addon\"\n          ng-bind-html=\"form.fieldAddonLeft\"></span>\n    <input ng-show=\"form.key\"\n           style=\"background-color: white\"\n           type=\"text\"\n           class=\"form-control {{form.fieldHtmlClass}}\"\n           schema-validate=\"form\"\n           ng-model=\"$$value$$\"\n           ng-disabled=\"form.readonly\"\n           pick-a-date=\"form.pickadate\"\n           min-date=\"form.minDate\"\n           max-date=\"form.maxDate\"\n           name=\"{{form.key.slice(-1)[0]}}\"\n           pick-a-date-options=\"form.pickerOption\"\n    />\n    <span ng-if=\"form.fieldAddonRight\"\n          class=\"input-group-addon\"\n          ng-bind-html=\"form.fieldAddonRight\"></span>\n  </div>\n  <span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\n</div>\n");
$templateCache.put("directives/decorators/bootstrap/datepicker/timepicker.html","<div class=\"form-group {{form.htmlClass}}\" ng-class=\"{\'has-error\': hasError()}\">\n  <label class=\"control-label\" ng-show=\"showTitle()\">{{form.title}}</label>\n  <div ng-class=\"{\'input-group\': (form.fieldAddonLeft || form.fieldAddonRight)}\">\n    <span ng-if=\"form.fieldAddonLeft\"\n          class=\"input-group-addon\"\n          ng-bind-html=\"form.fieldAddonLeft\"></span>\n    <input ng-show=\"form.key\"\n           style=\"background-color: white\"\n           type=\"text\"\n           class=\"form-control {{form.fieldHtmlClass}}\"\n           schema-validate=\"form\"\n           ng-model=\"$$value$$\"\n           ng-disabled=\"form.readonly\"\n           pick-a-time=\"form.pickatime\"\n           min-date=\"form.minDate\"\n           max-date=\"form.maxDate\"\n           name=\"{{form.key.slice(-1)[0]}}\"\n           pick-a-time-options=\"form.pickerOption\"\n    />\n    <span ng-if=\"form.fieldAddonRight\"\n          class=\"input-group-addon\"\n          ng-bind-html=\"form.fieldAddonRight\"></span>\n  </div>\n  <span class=\"help-block\">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\n</div>\n");}]);
angular.module('schemaForm-datepicker', ['schemaForm', 'pickadate']).config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

    var datepicker = function(name, schema, options) {
      if (schema.type === 'string' && (schema.format === 'date' || schema.format === 'date-time')) {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'datepicker';
        f.pickerOption = f.pickerOption || {};
        if (f.onChange) {
          f.pickerOption.onSet = f.onChange;
        }
        f.pickerOption.format = f.pickerOption.format || 'yyyy-mm-dd';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };

    schemaFormProvider.defaults.string.unshift(datepicker);

    //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping(
      'bootstrapDecorator',
      'datepicker',
      'directives/decorators/bootstrap/datepicker/datepicker.html'
    );
    schemaFormDecoratorsProvider.createDirective(
      'datepicker',
      'directives/decorators/bootstrap/datepicker/datepicker.html'
    );
  }
]);

angular.module('schemaForm-timepicker', ['schemaForm', 'pickadate']).config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

    var timepicker = function(name, schema, options) {
      if (schema.type === 'string' && schema.format === 'time') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'timepicker';
        f.pickerOption = f.pickerOption || {};
        if (f.onChange) {
          f.pickerOption.onSet = f.onChange;
        }
        f.pickerOption.format = f.pickerOption.format || 'HH:i';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };

    schemaFormProvider.defaults.string.unshift(timepicker);

    //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping(
      'bootstrapDecorator',
      'timepicker',
      'directives/decorators/bootstrap/datepicker/timepicker.html'
    );
    schemaFormDecoratorsProvider.createDirective(
      'timepicker',
      'directives/decorators/bootstrap/datepicker/timepicker.html'
    );
  }
]);

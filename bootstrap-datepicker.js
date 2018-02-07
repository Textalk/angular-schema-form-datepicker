angular.module('schemaForm').run(['$templateCache', function($templateCache) {$templateCache.put('directives/decorators/bootstrap/datepicker/datepicker.html','<div class="form-group {{form.htmlClass}}" ng-class="{\'has-error\': hasError()}">\n  <label class="control-label {{form.labelHtmlClass}}"\n         ng-class="{\'sr-only\': !showTitle()}"\n         for="{{form.key.slice(-1)[0]}}">{{form.title}}</label>\n  <div ng-class="{\'input-group\': (form.fieldAddonLeft || form.fieldAddonRight)}">\n    <span ng-if="form.fieldAddonLeft" class="input-group-addon" ng-bind-html="form.fieldAddonLeft"></span>\n    <input id="{{form.key.slice(-1)[0]}}"\n           ng-show="form.key"\n           type="text"\n           class="form-control {{form.fieldHtmlClass}}"\n           schema-validate="form"\n           sf-field-model\n           ng-disabled="form.readonly"\n           pick-a-date="form.pickadate"\n           min-date="form.minDate"\n           max-date="form.maxDate"\n           select-years="form.selectYears"\n           select-months="form.selectMonths"\n           name="{{form.key.slice(-1)[0]}}"\n           format="form.format" />\n    <span ng-if="form.fieldAddonRight" class="input-group-addon" ng-bind-html="form.fieldAddonRight"></span>\n  </div>\n  <span class="help-block">{{ (hasError() && errorMessage(schemaError())) || form.description}}</span>\n</div>\n');}]);
/**
 * @ngdoc directive
 * @module schemaForm
 * @name pickADate
 * @description
 * Creates a directive to pass through to $.fn.pickadate
 */
(function(angular) {
  'use strict';

  angular
      .module('schemaForm')
      .directive('pickADate', pickADateDirective);

  function pickADateDirective() {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          pickADate: '=',
          minDate: '=',
          maxDate: '=',
          format: '=',
          selectYears: '=?',
          selectMonths: '=?'
        },
        link: function(scope, element, attrs, ngModel) {
            //Bail out gracefully if pickadate is not loaded.
            if (!element.pickadate) {
              return;
            }

            //By setting formatSubmit to null we inhibit the
            //hidden field that pickadate likes to create.
            //We use ngModel formatters instead to format the value.
            var opts = {
                onClose: function() {
                  element.blur();
                },
                formatSubmit: null,
                selectYears: (scope.selectYears || false),
                selectMonths: (scope.selectMonths || false)
              };
            if (scope.pickADate) {
              angular.extend(opts, scope.pickADate);
            }
            element.pickadate(opts);

            //Defaultformat is for json schema date-time is ISO8601
            //i.e.  "yyyy-mm-dd"
            var defaultFormat = 'yyyy-mm-dd';

            //View format on the other hand we get from the pickadate translation file
            var viewFormat    = $.fn.pickadate.defaults.format;

            var picker = element.pickadate('picker');

            //The view value
            ngModel.$formatters.push(function(value) {
                if (angular.isUndefined(value) || value === null) {
                  return value;
                }

                //We set 'view' and 'highlight' instead of 'select'
                //since the latter also changes the input, which we do not want.
                picker.set('view', value, {format: scope.format || defaultFormat});
                picker.set('highlight', value, {format: scope.format || defaultFormat});

                //piggy back on highlight to and let pickadate do the transformation.
                return picker.get('highlight', viewFormat);
              });

            ngModel.$parsers.push(function() {
                return picker.get('select', scope.format || defaultFormat);
              });

            //bind once.
            if (angular.isDefined(attrs.minDate)) {
              var onceMin = scope.$watch('minDate', function(value) {
                  if (value) {
                    picker.set('min', formatDate(value));
                    onceMin();
                  }
                }, true);
            }

            if (angular.isDefined(attrs.maxDate)) {
              var onceMax = scope.$watch('maxDate', function(value) {
                  if (value) {
                    picker.set('max', formatDate(value));
                    onceMax();
                  }
                }, true);
            }
          }
      };

    //String dates for min and max is not supported
    //https://github.com/amsul/pickadate.js/issues/439
    //So strings we create dates from
    function formatDate(value) {
      //Strings or timestamps we make a date of
      if (angular.isString(value) || angular.isNumber(value)) {

        return new Date(value);
      }

      return value; //We hope it's a date object
    }
  }
}(window.angular));

(function(angular) {
  'use strict';

  angular
      .module('schemaForm')
      .config([
          'schemaFormProvider',
          'schemaFormDecoratorsProvider',
          'sfPathProvider',
          'sfBuilderProvider',
          datepickerConfig
      ]);

  /**
   * Define the datepicker addon in schemaForm
   * @param {schemaFormProvider} schemaFormProvider
   * @param {schemaFormDecoratorsProvider} schemaFormDecoratorsProvider
   * @param {sfPathProvider} sfPathProvider
   * @param {sfBuilderProvider} sfBuilderProvider
   */
  function datepickerConfig(
      schemaFormProvider,
      schemaFormDecoratorsProvider,
      sfPathProvider,
      sfBuilderProvider
  ) {
    schemaFormProvider.defaults.string.unshift(datepicker);
    //Add to the bootstrap directive
    schemaFormDecoratorsProvider.defineAddOn(
        'bootstrapDecorator',
        'datepicker',
        'directives/decorators/bootstrap/datepicker/datepicker.html',
        sfBuilderProvider.stdBuilders
    );

    /**
     * Sets date and date-time formats to use datepicker by default.
     * @param {string} name
     * @param {object} schema
     * @param {object} options
     * @returns {object|undefined}
     */
    function datepicker(name, schema, options) {
      if (schema.type === 'string' && (schema.format === 'date' || schema.format === 'date-time')) {
        var f = schemaFormProvider.stdFormObj(name, schema, options);

        f.key  = options.path;
        f.type = 'datepicker';
        options.lookup[sfPathProvider.stringify(options.path)] = f;

        return f;
      }
    }
  }
}(window.angular));

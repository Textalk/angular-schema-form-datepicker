angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

    var timepicker = function(name, schema, options) {
      if (schema.type === 'string' && schema.format === 'time') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'timepicker';
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

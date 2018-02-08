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

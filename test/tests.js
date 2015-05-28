/* jshint expr: true */
chai.should();

describe('Schema form', function() {

  describe('directive', function() {
    beforeEach(module('templates'));
    beforeEach(module('schemaForm'));
    beforeEach(
      //We don't need no sanitation. We don't need no though control.
      module(function($sceProvider) {
        $sceProvider.enabled(false);
      })
    );

    it('should use datepicker directive when format is "date"', function() {

      //Mock pickadate
      $.fn.pickadate = sinon.stub().returns({
        set: sinon.stub(),
        get: sinon.stub().returns('get')
      });
      $.fn.pickadate.defaults = {format: 'yyyy-mm-dd'};

      inject(function($compile, $rootScope) {
        var scope = $rootScope.$new();
        scope.person = {partee: '2014-01-01'};

        scope.schema = {
          type: 'object',
          properties: {
            partee: {
              title: 'Parteeeeee',
              type: 'string',
              format: 'date'
            }
          }
        };

        scope.form = [{
          key: 'partee',
          maxDate: new Date(),
          minDate: '2014-02-13',
        }];

        var tmpl = angular
                  .element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();
        tmpl.children().length.should.be.equal(1);
        tmpl.children().eq(0).children().eq(0).is('div').should.be.true;
        tmpl.children().eq(0).children().eq(0).find('input[pick-a-date]').length.should.ok;
        tmpl.children().eq(0).children().eq(0).find('input[pick-a-date]').attr('max-date').should.be.ok;
        tmpl.children().eq(0).children().eq(0).find('input[pick-a-date]').attr('min-date').should.be.ok;

        $.fn.pickadate.should.have.beenCalled;

      });
    });


    it('should be disabled when readonly', function() {

      //Mock pickadate
      $.fn.pickadate = sinon.stub().returns({
        set: sinon.stub(),
        get: sinon.stub().returns('get')
      });
      $.fn.pickadate.defaults = {format: 'yyyy-mm-dd'};

      inject(function($compile, $rootScope) {
        var scope = $rootScope.$new();
        scope.person = {partee: '2014-01-01'};

        scope.schema = {
          type: 'object',
          properties: {
            partee: {
              title: 'Parteeeeee',
              type: 'string',
              format: 'date'
            }
          }
        };

        scope.form = [{
          key: 'partee',
          maxDate: new Date(),
          minDate: '2014-02-13',
          readonly: true
        }];

        var tmpl = angular
                  .element('<form sf-schema="schema" sf-form="form" sf-model="person"></form>');

        $compile(tmpl)(scope);
        $rootScope.$apply();
        tmpl.children().eq(0).children().eq(0).find('input[pick-a-date]').attr('disabled').should.ok;

        $.fn.pickadate.should.have.beenCalled;

      });
    });

  });

});

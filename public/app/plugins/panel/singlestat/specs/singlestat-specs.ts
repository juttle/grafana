///<reference path="../../../../headers/common.d.ts" />

import {describe, beforeEach, it, sinon, expect, angularMocks} from '../../../../../test/lib/common';

import angular from 'angular';
import helpers from '../../../../../test/specs/helpers';
import {SingleStatCtrl} from '../controller';

describe('SingleStatCtrl', function() {
  var ctx = new helpers.ControllerTestContext();

  function singleStatScenario(desc, func) {

    describe(desc, function() {

      ctx.setup = function (setupFunc) {

        beforeEach(angularMocks.module('grafana.services'));
        beforeEach(angularMocks.module('grafana.controllers'));

        beforeEach(ctx.providePhase());
        beforeEach(ctx.createPanelController(SingleStatCtrl));

        beforeEach(function() {
          setupFunc();
          ctx.datasource.query = sinon.stub().returns(ctx.$q.when({
            data: [{target: 'test.cpu1', datapoints: ctx.datapoints}]
          }));

          ctx.ctrl.refreshData(ctx.datasource);
          ctx.scope.$digest();
          ctx.data = ctx.ctrl.data;
        });
      };

      func(ctx);
    });
  }

  singleStatScenario('with defaults', function(ctx) {
    ctx.setup(function() {
      ctx.datapoints = [[10,1], [20,2]];
    });

    it('Should use series avg as default main value', function() {
      expect(ctx.data.value).to.be(15);
      expect(ctx.data.valueRounded).to.be(15);
    });

    it('should set formated falue', function() {
      expect(ctx.data.valueFormated).to.be('15');
    });
  });

  singleStatScenario('MainValue should use same number for decimals as displayed when checking thresholds', function(ctx) {
    ctx.setup(function() {
      ctx.datapoints = [[99.999,1], [99.99999,2]];
    });

    it('Should be rounded', function() {
      expect(ctx.data.value).to.be(99.999495);
      expect(ctx.data.valueRounded).to.be(100);
    });

    it('should set formated falue', function() {
      expect(ctx.data.valueFormated).to.be('100');
    });
  });

  singleStatScenario('When value to text mapping is specified', function(ctx) {
    ctx.setup(function() {
      ctx.datapoints = [[10,1]];
      ctx.ctrl.panel.valueMaps = [{value: '10', text: 'OK'}];
    });

    it('Should replace value with text', function() {
      expect(ctx.data.value).to.be(10);
      expect(ctx.data.valueFormated).to.be('OK');
    });

  });
});

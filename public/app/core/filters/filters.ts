///<reference path="../../headers/common.d.ts" />
'use strict';

import angular = require('angular');
import jquery = require('jquery');
import moment = require('moment');
import _ = require('lodash');

var module = angular.module('grafana.filters');

module.filter('stringSort', function() {
  return function(input) {
    return input.sort();
  };
});

module.filter('slice', function() {
  return function(arr, start, end) {
    if (!_.isUndefined(arr)) {
      return arr.slice(start, end);
    }
  };
});

module.filter('stringify', function() {
  return function(arr) {
    if (_.isObject(arr) && !_.isArray(arr)) {
      return angular.toJson(arr);
    } else {
      return _.isNull(arr) ? null : arr.toString();
    }
  };
});

module.filter('moment', function() {
  return function(date, mode) {
    switch (mode) {
      case 'ago':
        return moment(date).fromNow();
    }
    return moment(date).fromNow();
  };
});

module.filter('noXml', function() {
  var noXml = function(text) {
  return _.isString(text)
    ? text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    : text;
  };
  return function(text) {
    return _.isArray(text)
      ? _.map(text, noXml)
      : noXml(text);
  };
});

module.filter('interpolateTemplateVars', function (templateSrv) {
  var filterFunc : any = function (text, scope) {
    if (scope.panel) {
      return templateSrv.replaceWithText(text, scope.panel.scopedVars);
    } else {
      return templateSrv.replaceWithText(text, scope.row.scopedVars);
    }
  };

  filterFunc.$stateful = true;
  return filterFunc;
});

export {};
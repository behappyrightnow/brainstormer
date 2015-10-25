///<reference path="lib/vendorTypeDefinitions/angular.d.ts"/>
'use strict';
angular.module('brainstormer', [
    'ngRoute',
    'brainstormer.login',
    'brainstormer.stories']).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({ redirectTo: '/login' });
    }]);
//# sourceMappingURL=app.js.map
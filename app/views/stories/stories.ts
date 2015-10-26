///<reference path="../../lib/vendorTypeDefinitions/angular.d.ts"/>
///<reference path="../../lib/vendorTypeDefinitions/firebase.d.ts"/>
'use strict';
var astro;

angular.module('brainstormer.stories', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stories', {
    templateUrl: 'views/stories/stories.html',
    controller: 'StoriesCtrl'
  });
}])
.controller('StoriesCtrl', ['$scope','$location','$route', function($scope, $location, $rootScope) {
        var myDataRef = new Firebase('https://pn7jcaj0hcs.firebaseio-demo.com/');
        $scope.tiles = [];
        var myScope = $scope;
        myDataRef.on('child_added', function(snapshot) {
            var newStory = snapshot.val();
            newStory.templateUrl = "views/stories/popover.html";
            newStory.flipped = false;
            $scope.tiles.push(newStory);
            console.log("Pushed "+newStory.name+", "+newStory.story);
            $scope.$apply();
          });

    }]);
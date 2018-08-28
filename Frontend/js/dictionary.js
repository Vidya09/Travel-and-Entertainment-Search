/*$(document).ready(function () {
    debugger;
    $.getJSON("/dictionary-api?test=works", printTerms);
    
});

function printTerms(terms) {
    debugger;
    alert("gotdata");
}*/

var myApp = angular.module('myApp', ['ngAnimate']);

myApp.controller('MyController', function MyController($scope,$http) {
    
  $scope.keywordName = '';
  $scope.distance = '';
  $scope.otherLocation = '';
  $scope.disableSearchButton = true;
  $scope.category = "default";
  $scope.searchResults = '';
  $scope.placeSearchInProgress = false;
  $scope.hideSearchTable = false;
  $scope.rowPlace = '';
  $scope.placeDetails = {};
  $scope.places = {};
    
  $http.get('http://ip-api.com/json').then(function(response) {
      debugger;
    $scope.geometryValues = response.data;
      if(response.status == 200 ){
          $scope.disableSearchButton = false;
      }
  }); 
    
   $scope.getPlaceDetails = function(test){
      debugger;
      //$scope.rowPlace = test;
      $scope.hideSearchTable = true;
      var request = test.place_id;
      //$scope.searchResults
       
      var service = new google.maps.places.PlacesService(document.getElementById('map'));
      service.getDetails({placeId:request}, function(place, status) {
          debugger;
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                $scope.placeDetails = place;
                //alert($scope.placeDetails);
                fillInfoTab($scope.placeDetails);
            }
        });
      //$scope.places = $scope.placeDetails;
       //alert($scope.places);
        
  };
    
    $scope.getPhotos = function(){
        fillPhotosTab($scope.placeDetails);
    };
    
    $scope.directionWithTravelMode = function(){
        debugger;
        directionTravelMode();
    }
    
    $scope.getMaps = function(){
        debugger;
        var sourcelat,sourcelng;
        if(document.getElementById("otherlocation").value != ''){
            var otherLocation = document.getElementById("otherlocation").value;
            $http.get('/lnglat-api?&otherlocation='+ otherLocation+'').then(function(response) {
              debugger;
              var geometryValues = response;
                sourcelat = response.data.location.lat;
                sourcelng = response.data.location.lng;
                fillMapsTab($scope.placeDetails,sourcelat,sourcelng);
            }); 
        }else{
            sourcelat = parseFloat($scope.geometryValues.lat);
            sourcelng = parseFloat($scope.geometryValues.lon);
            fillMapsTab($scope.placeDetails,sourcelat,sourcelng);
        }
        
    };
    
  $scope.getSerachResults = function(){
      $scope.searchResults = '';
      $scope.placeSearchInProgress = true;
      $scope.hideSearchTable = false;
      
      var lat = parseFloat($scope.geometryValues.lat);
      var lon = parseFloat($scope.geometryValues.lon);
      var keywordText = $scope.keywordName;
      var distance = $scope.distance;
      var category = $scope.category;
      var otherLocation = document.getElementById("otherlocation").value;
      $http.get('/dictionary-api?lat='+lat+'&lon='+lon+'&keyword='+keywordText+'&distance='+distance+'&otherlocation='+ otherLocation+'&category='+category+'').then(function(response) {
      debugger;
          $scope.searchResults = response.data.results;
          $scope.placeSearchInProgress = false;
         
     }); 
  };
    
 
  $scope.maptoggle = function(){
      togglemap();
  }
 
  
});



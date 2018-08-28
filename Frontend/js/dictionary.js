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
    
   $scope.getPlaceDetails = function(places){
      $scope.hideSearchTable = true;
      var request = places.place_id;
     
      var service = new google.maps.places.PlacesService(document.getElementById('map'));
      service.getDetails({placeId:request}, function(place, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                $scope.placeDetails = place;
                fillInfoTab($scope.placeDetails);
            }
        });
  };
    
    $scope.getPhotos = function(){
        fillPhotosTab($scope.placeDetails);
    };
    
    $scope.directionWithTravelMode = function(){
        directionTravelMode();
    }
    
    $scope.getMaps = function(){
        var sourcelat,sourcelng;
        if(document.getElementById("otherlocation").value != ''){
            var otherLocation = document.getElementById("otherlocation").value;
            $http.get('/lnglat-api?&otherlocation='+ otherLocation+'').then(function(response) {
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
          $scope.searchResults = response.data.results;
          $scope.placeSearchInProgress = false;
         
     }); 
  };
   
  $scope.maptoggle = function(){
      togglemap();
  }
});



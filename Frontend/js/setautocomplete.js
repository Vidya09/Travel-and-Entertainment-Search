

function setLocation(e){
     
            
           if(e.defaultValue== "location"){
                document.getElementById("otherlocation").disabled = false;
                document.getElementById("otherlocation").required = true;
            }else if(e.defaultValue == "From"){
                document.getElementById("otherlocation").value = "";
                document.getElementById("otherlocation").disabled = true;
                document.getElementById("otherlocation").required = false;
            }
        
}

function initAutocomplete() {
  

  // Create the search box and link it to the UI element.
  var input = document.getElementById('otherlocation');
    debugger;
  var searchBox = new google.maps.places.SearchBox(input);
  
  
}

function fillInfoTab(data){
    debugger;
    var arrayObjects = [];
    document.getElementById("placeName").innerHTML = data.name;
    if(data.formatted_address){
        arrayObjects.push({'key':'Address','value':data.formatted_address});
    }
    if(data.international_phone_number){
        arrayObjects.push({'key':'Phone Number','value':data.international_phone_number});
    }
    if(data.price_level){
         arrayObjects.push({'key':'Price Level','value':data.price_level});  
    }
    if(data.rating){
           arrayObjects.push({'key':'Rating','value':data.rating});   
    }
    if(data.url){
         arrayObjects.push({'key':'Google Page','value':data.url});          
    }
    if(data.website){
        arrayObjects.push({'key':'Website','value':data.website});
    }
    if(data.opening_hours){
        if(data.opening_hours.open_now){
            var dayIndex;
            var dayValue = moment().utcOffset(data.utc_offset).format("dddd");
            var weekDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
            for (var j=0;j<weekDays.length;j++){
                if(weekDays[j] == dayValue){
                    dayIndex = j;
                    break;
                }
            }
            var presentDay = data.opening_hours.weekday_text[j];
            var presentHours = presentDay.split(": ")
            var value = "open now: "+presentHours[1]
            arrayObjects.push({'key':'Hours','value':value});
        }else{
            arrayObjects.push({'key':'Hours','value':"Closed"});
        }
        
    }
    var ratingValue;
    var infoTable ='<table class="table table-striped">'
    infoTable += '<tbody>';
    for(var i=0;i<arrayObjects.length;i++){
        infoTable += '<tr>';
        if(arrayObjects[i].key=="Google Page"||arrayObjects[i].key=="Website"){
            infoTable += '<td style="width:25%;text-align: left;">'+arrayObjects[i].key+'</td>';
            infoTable += '<td style="width:75%;text-align: left;"><a style="width:auto;cursor:pointer;" href='+arrayObjects[i].value+' target="_blank">'+arrayObjects[i].value+'</td>';
        }else if(arrayObjects[i].key=="Hours"){
            infoTable += '<td style="width:25%;text-align: left;">'+arrayObjects[i].key+'</td>';
            infoTable += '<td style="width:75%;text-align: left;"><div style="float:left;">'+arrayObjects[i].value+'</div><a style="margin-left:5px;float:left;" data-toggle="modal" data-target="#myModal">Daily open hours</td>';
        }else if(arrayObjects[i].key=="Rating"){
            infoTable += '<td style="width:25%;text-align: left;">'+arrayObjects[i].key+'</td>';
            infoTable += '<td style="width:75%;text-align: left;">'+arrayObjects[i].value+'<div id="ratevalue"></div></td>';
            ratingValue = arrayObjects[i].value;
            
        }else{
            infoTable += '<td style="width:25%;text-align: left;">'+arrayObjects[i].key+'</td>';
            infoTable += '<td style="width:75%;text-align: left;">'+arrayObjects[i].value+'</td>';
        }
        infoTable += '</tr>';
    }
    infoTable += '</tbody>';
    infoTable += '</table>';
    document.getElementById("infoTable").innerHTML = infoTable;
    if(data.formatted_address||data.international_phone_number||data.price_level||data.rating||data.url||data.website||data.opening_hours){
        document.getElementById("twitterId").disabled = false;
        document.getElementById("infoTabFav").disabled = false;
    }
    setRating("ratevalue", ratingValue);
}

function setRating(id,value){
    debugger;
     $("#"+id).rateYo({
               rating:value,
                precision:1,
               readOnly:true,
                startsWith:"20px"
         }); 
    $("#"+id).rateYo("rating", value);
}

function fillPhotosTab(data){
    debugger
    var photos = data.photos;
    var urls = [];
    var originalUrls = [];
    for(var k=0;k<photos.length;k++){
        urls.push(photos[k].getUrl({'maxWidth': 200, 'maxHeight': 200}))
    }
   for(var k=0;k<photos.length;k++){
        var maxWid = photos[k].width;
        var maxHei = photos[k].height
        originalUrls.push(photos[k].getUrl({'maxWidth': maxWid, 'maxHeight':maxHei}));
    }
    var column1 = document.getElementById("column1");
    var column2 = document.getElementById("column2");
    var column3 = document.getElementById("column3");
    var column4 = document.getElementById("column4");
    for(var i=0,j=1;i<urls.length;i++,j++){
        //var columnName = "column"+j;
        if(j==1){
            column1.innerHTML += "<a style='width:"+photos[i].width+"px;height:"+photos[i].height+"px;cursor:pointer;' href='"+originalUrls[i] +"' target='_blank'><img src='"+urls[i] +"' alt='image'/></a>";
        }else if(j==2){
            column2.innerHTML += "<a style='width:"+photos[i].width+"px;height:"+photos[i].height+"px;cursor:pointer;' href='"+originalUrls[i] +"' target='_blank'><img src='"+urls[i] +"' alt='image'/></a>";
        }else if(j==3){
            column3.innerHTML += "<a style='width:"+photos[i].width+"px;height:"+photos[i].height+"px;cursor:pointer;' href='"+originalUrls[i] +"' target='_blank'><img src='"+urls[i] +"' alt='image'/></a>";
        }else if(j==4){
            column4.innerHTML += "<a style='width:"+photos[i].width+"px;height:"+photos[i].height+"px;cursor:pointer;' href='"+originalUrls[i] +"' target='_blank'><img src='"+urls[i] +"' alt='image'/></a>";
        }
        if(j==4)j=0;
    }
    //var urls = photos[1].getUrl({'maxWidth': 35, 'maxHeight': 35})
}
var desLat,desLng,srcLat,srcLng
function fillMapsTab(data,sourcelat,sourcelng){
    debugger;
    desLat = data.geometry.viewport.f.f;
    desLng = data.geometry.viewport.b.b;
    srcLat = sourcelat;
    srcLng = sourcelng;
    document.getElementById("mapto").value = data.formatted_address;
    if (document.getElementById("otherlocation").disabled){
        document.getElementById("mapfrom").value = "Your Location";    
    }else{
        document.getElementById("mapfrom").value = document.getElementById("otherlocation").value; 
    }
    
     var directionsDisplay = new google.maps.DirectionsRenderer;
            var directionsService = new google.maps.DirectionsService;
            var map = new google.maps.Map(document.getElementById("showmapsdiv"), {
                zoom: 14,
                center: {lat: data.geometry.viewport.f.f, lng: data.geometry.viewport.b.b}/*destination*/
            });
            
            var marker = new google.maps.Marker({
                    position: {lat: data.geometry.viewport.f.f, lng: data.geometry.viewport.b.b},
                    map: map,
                    title: ''
            });
     directionsDisplay.setMap(map);
    
    
}
function directionTravelMode(){
    debugger;
            var mapdeslat = desLat;
            var mapdeslng = desLng;
            //var mapdesid  = element.getAttribute("mapid");
            //document.getElementById("showmapsdiv").innerHTML = '';
            //var mapsid = document.getElementById("showmapsdiv");
            //document.getElementById(mapsid).innerHTML= '';
            
            var directionsDisplay = new google.maps.DirectionsRenderer;
            var directionsService = new google.maps.DirectionsService;
            var map = new google.maps.Map(document.getElementById("showmapsdiv"), {
                zoom: 14,
                center: {lat: mapdeslat, lng: mapdeslng}
            });
            var selectedMode;
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById('down-panel'));
                var selectElementMode = document.getElementById("mode").value;
               /* if(selectElement == "Walking"){
                    selectedMode= "WALKING";
                }else if (selectElement == "Bicycling"){
                              selectedMode="BICYCLING";
                          }else if(selectElement == "Driving"){
                                selectedMode= "DRIVING";
                          }else if(selectElement == "Transit"){
                                   selectedMode = "TRANSIT";
                                   }*/
            calculateAndDisplayRoute(directionsService, directionsDisplay,selectElementMode,mapdeslat,mapdeslng);
            
}
        
function calculateAndDisplayRoute(directionsService, directionsDisplay,selectedMode,mapdeslat,mapdeslng) {
          debugger;
           /* directionsService.route({
              origin: {lat:srcLat ,lng:srcLng },  
              destination: {lat: mapdeslat, lng: mapdeslng}, 
              travelMode: google.maps.TravelMode[selectedMode]
            }, function(response, status) {
              if (status == 'OK') {
                directionsDisplay.setDirections(response);
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            });*/
             var start = document.getElementById('mapfrom').value;
             var end = document.getElementById('mapto').value;
            directionsService.route({
              origin: start,
              destination: end,
              travelMode: selectedMode
            }, function(response, status) {
              if (status === 'OK') {
                directionsDisplay.setDirections(response);
              } else {
                window.alert('Directions request failed due to ' + status);
              }
            });
      }

function togglemap(){
    debugger;
    var panorama;
      
        panorama = new google.maps.StreetViewPanorama(
            document.getElementById('showmapsdiv'),
            {
              position: {lat: desLat, lng: desLng},
              pov: {heading: 165, pitch: 0},
              zoom: 1
            });
      
}
  


this.GeoLoc = {};

GeoLoc.init = function(inputId,goButton,map){

     var geocoder;

     var theMap = map;

     goButton.bind("click", function(){codeAddress();} );

     function callBackGeoLoc(results, status) {
         if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();    
            var lon = results[0].geometry.location.lng();   
            theMap.SetCenter(lat,lon);
            console.log(lat,lon);
         }
         else {
            alert("Geocode was not successful for the following reason: " + status);
         }
     }

     function codeAddress() {
         var address = document.getElementById(inputId).value;
         geocoder.geocode( { 'address': address}, function (results,status) { callBackGeoLoc(results,status);  }  );
     }
     
     function initialize2(){
         var input = document.getElementById(inputId);
         console.log(input);
         var options = {
             componentRestrictions: {country: 'fr'},
             types: ['geocode']
         };
         var autocomplete = new google.maps.places.Autocomplete(input,options);
         google.maps.event.addListener(autocomplete, 'place_changed', function() {
             codeAddress();
         });
         codeAddress();
     }

     function callBackGeoLocNav(position){
         var lat = position.coords.latitude;
         var lon = position.coords.longitude;
         var zoom = 13;
         console.log(lat,lon);
         theMap.SetCenter(lat,lon);
         initialize2();
     }  

     function initialize() {
         geocoder = new google.maps.Geocoder();
         // default value
         var lat = 3.1;
         var lon = 45.3;
         var zoom = 13;

         if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(callBackGeoLocNav);
         }
         else{
            alert("Dommage... Votre navigateur ne prend pas en compte la géolocalisation HTML5");
         }

         initialize2();       
     }

     ////////////////////
     initialize();
     ////////////////////
};



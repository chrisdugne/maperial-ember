this.GeoLoc = {};

GeoLoc.init = function(inputId,goButton,map){

     var geocoder;

     var theMap = map;

     goButton.bind("click", function(){ codeAddress(); } );

     // when ajax geocoder returns
     function callBackGeoLoc(results, status) {
         if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();    
            var lon = results[0].geometry.location.lng();   
            theMap.SetCenter(lat,lon);
         }
         else {
            console.log("Geocode failed: " + status);
         }
     }

     // when button "go" is clicked or "autocomplete"
     function codeAddress() {
         var address = document.getElementById(inputId).value;
         geocoder.geocode( { 'address': address}, function (results,status) { callBackGeoLoc(results,status);  }  );
     }
     
     // init autocomplete
     function initialize2(){
         var input = document.getElementById(inputId);
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

     // when geoloc ajax returns
     function callBackGeoLocNav(position){
         var lat = position.coords.latitude;
         var lon = position.coords.longitude;
         var zoom = 13;
         theMap.SetCenter(lat,lon);
         initialize2();
     }  

     // init geocoder and geoloc
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
            console.log("No HTML5 geoloc");
            initialize2();       
         }
     }

     ////////////////////
     initialize();
     ////////////////////
};



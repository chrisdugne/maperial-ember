//-------------------------------------------//
//UserManager
//-------------------------------------------//

this.UserManager = {};

//-------------------------------------------//
//init getPublicData

$.ajax({  
   type: "POST",  
   url: "/getPublicData",
   dataType: "json",
   success: function (publicData, textStatus, jqXHR)
   {
      console.log(publicData);

      App.publicData.set("maps", publicData.maps);
      App.publicData.set("styles", publicData.styles);
      App.publicData.set("datasets", publicData.datasets);
      App.publicData.set("colorbars", publicData.colorbars);
      App.publicData.set("fonts", publicData.fonts);
      App.publicData.set("icons", publicData.icons);
   }
});

//-------------------------------------------//

UserManager.getAccount = function()
{
   var params = new Object();
   params["user"] = App.user;

   $.ajax({  
      type: "POST",  
      url: "/getAccount",
      data: JSON.stringify(params),  
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (account, textStatus, jqXHR)
      {
         console.log(account);

         App.user.set("uid", account.uid);
         App.user.set("email", account.email);
         App.user.set("name", account.name);
         App.user.set("maps", account.maps);
         App.user.set("styles", account.styles);
         App.user.set("datasets", account.datasets);
         App.user.set("colorbars", account.colorbars);
         App.user.set("fonts", account.fonts);
         App.user.set("icons", account.icons);
      }
   });
}

//-------------------------------------------//
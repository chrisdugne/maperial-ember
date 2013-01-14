// -------------------------------------------//
//	 			StyleManager
// -------------------------------------------//

this.StyleManager = {};

// -------------------------------------------//

StyleManager.uploadNewStyle = function(style)
{
	$.ajax({
	    type: "POST",
	    url: Globals.mapServer + "/api/style?_method=DATA",
	    data: style.content,  
	    dataType: "text",
	    success: function (data, textStatus, jqXHR)
		{
	    	var result = $.parseJSON(data).files[0];
	    	var styleUID = result.styleUID;
	    	
	    	var newStyle = App.stylesData.selectedStyle;
	    	newStyle.uid = styleUID;
	    	
			App.user.styles.pushObject(newStyle);
			App.get('router').transitionTo('styles');
			
			StyleManager.addStyleInDB(newStyle);
		}
	});
}


StyleManager.editStyle = function(style)
{
	$.ajax({
		type: "POST",
		url: Globals.mapServer + "/api/style?_method=DATA?uid=" + style.uid,
		data: style.content,  
		dataType: "text",
		success: function (data, textStatus, jqXHR)
		{
			console.log("StyleManager.editStyle : saved");
		}
	});
}

// -------------------------------------------//

StyleManager.addStyleInDB = function(style)
{
	var params = new Object();
	params["user"] = App.user;
	params["style"] = style;
	
	$.ajax({  
	    type: "POST",  
	    url: "/addStyle",
	    data: JSON.stringify(params),  
	    contentType: "application/json; charset=utf-8",
	    dataType: "text",
	    success: function (data, textStatus, jqXHR)
		{
	    	
		}
	});
}

// -------------------------------------------//

StyleManager.getStyle = function(styleUID, next)
{
	console.log("getStyle : " + styleUID);

	$.ajax({  
	    type: "GET",  
	    url: Globals.mapServer + "/api/style/" + styleUID,
	    dataType: "text",
	    success: function (data, textStatus, jqXHR)
		{
    		App.stylesData.selectedStyle.content = data;
    		
    		// TO REMOVE : SHOULD PASS App.stylesData.selectedStyle.content as a parameter
    		MapnifyMenu.__style = data;
    		
    		next();
		}
	});
}

// -------------------------------------------//

StyleManager.deleteStyle = function(style)
{
	$.ajax({  
	    type: "DELETE",  
	    url: Globals.mapServer + "/api/style?key=" + style.uid,
	    dataType: "text",
	    success: function (data, textStatus, jqXHR)
		{
	    	// remove from the user list
    		App.user.styles.removeObject(style);
    		
    		// remove from the db
    		var params = new Object();
    		params["style"] = style;
    		
    		$.ajax({  
    		    type: "POST",  
    		    url: "/removeStyle",
    		    data: JSON.stringify(params),  
    		    contentType: "application/json; charset=utf-8"
    		});
		}
	});
}

// -------------------------------------------//
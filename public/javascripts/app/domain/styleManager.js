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
			
	    	var newStyle = {
				name : style.name,
				content : style.content,
				uid  : styleUID
    		};
	    	
			window.Webapp.user.styles.pushObject(newStyle);
			window.Webapp.get('router').transitionTo('styles');
			
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
	params["user"] = window.Webapp.user;
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

StyleManager.getStyle = function(styleUID)
{
	console.log("getStyle : " + styleUID);

	$.ajax({  
	    type: "GET",  
	    url: Globals.mapServer + "/api/style/" + styleUID,
	    dataType: "text",
	    success: function (data, textStatus, jqXHR)
		{
	    	console.log("style received : " + data);
    		window.Webapp.stylesData.selectedStyle.content = data;
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
    		window.Webapp.user.styles.removeObject(style);
    		
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
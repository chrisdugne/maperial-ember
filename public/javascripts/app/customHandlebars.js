//---------------------------------------------------------------------------------------//

Ember.Handlebars.registerBoundHelper('fileSize', 
	function(size, options) {
		return Utils.formatFileSize(size);
	}
);

//---------------------------------------------------------------------------------------//

Ember.Handlebars.registerBoundHelper('formatDate', 
	function(uploadTime, options) {
		return Utils.formatDate(uploadTime);
	}
);

//---------------------------------------------------------------------------------------//
/*
 * this = context
 * Route.openView puts the current view in "context.currentView"
 * 
 */
Ember.Handlebars.registerHelper('isCurrentView', 
	function(view, options) 
	{
		var currentView = Ember.Handlebars.get(this, "currentView", options);
	
		if(view == currentView)
			return options.fn(this);
	}
);

//---------------------------------------------------------------------------------------//

Ember.Handlebars.registerBoundHelper('thumb', 
	function(styleUID, options) 
	{
		return new Handlebars.SafeString("<img src=\""+Utils.thumbURL(styleUID)+"\"></img>");
	}
);

//---------------------------------------------------------------------------------------//

/**
 * Define a dynamic onclick methode : )
 * for now just 1 parameter.
 */
Ember.Handlebars.registerHelper('click', 
	function(chain, options) 
	{
		var paramProperty = chain.substring(chain.indexOf("(") + 1, chain.indexOf(")"));
		var method = chain.substring(0, chain.indexOf("("));
		
		param = Ember.Handlebars.get(this, paramProperty, options);
		
		return new Handlebars.SafeString("onclick=\"window.Webapp."+method+"('"+param+"')\" ");
	}
);
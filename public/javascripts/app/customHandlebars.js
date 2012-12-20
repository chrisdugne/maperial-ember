
Ember.Handlebars.registerHelper('fileSize', 
	function(property, options) {
		var size = Ember.Handlebars.get(this, property, options);
		return Utils.formatFileSize(size);
	}
);


Ember.Handlebars.registerHelper('formatDate', 
	function(property, options) {
		var uploadTime = Ember.Handlebars.get(this, property, options);
		return Utils.formatDate(uploadTime);
	}
);


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

Ember.Handlebars.registerHelper('thumb', 
	function(property, options) 
	{
		var styleUID = Ember.Handlebars.get(this, property, options);
		return new Handlebars.SafeString("<img src=\""+Utils.thumbURL(styleUID)+"\"></img>");
	}
);
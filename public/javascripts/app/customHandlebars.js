
Ember.Handlebars.registerHelper('fileSize', 
	function(property, options) {
		var size = Ember.Handlebars.get(this, property, options);
		return formatFileSize(size);
	}
);
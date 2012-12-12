
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

//---------------------------------------------------------------------------------------//

Ember.Handlebars.registerBoundHelper('buttonContinueWithStyle', 
	function(selectedStyle, options) 
	{
		console.log("buttonContinueWithStyle");
		console.log(selectedStyle);
		if(selectedStyle != undefined && selectedStyle != null){
			return new Handlebars.SafeString("<div class=\"span3 offset2 btn-large btn-primary\">Continue with this preset</div>");
		}
		else{
			return new Handlebars.SafeString("Select a preset");
		}
	}
);

//---------------------------------------------------------------------------------------//
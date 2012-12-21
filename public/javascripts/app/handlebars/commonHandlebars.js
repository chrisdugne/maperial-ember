//---------------------------------------------------------------------------------------//

/**
 * transform 40303 ==> 40.30 KB
 */
Ember.Handlebars.registerBoundHelper('fileSize', 
	function(size, options) {
		return Utils.formatFileSize(size);
	}
);

//---------------------------------------------------------------------------------------//

/**
 * transform 1356095267229 ==> 21/12/2012
 */
Ember.Handlebars.registerBoundHelper('formatDate', 
	function(uploadTime, options) {
		return Utils.formatDate(uploadTime);
	}
);

//---------------------------------------------------------------------------------------//

/**
 * Display a specific html template whether the currentView is the wanted one or not
 */
Ember.Handlebars.registerHelper('isCurrentView', 
	function(view, options) 
	{
		// 'this' is the context
		// Route.openView puts the current view in "context.currentView")
		var currentView = Ember.Handlebars.get(this, "currentView", options);
	
		if(view == currentView)
			return options.fn(this);
		else
			return options.inverse(this);
	}
);
		
//---------------------------------------------------------------------------------------//

/**
 * Display a style thumb from its styleUID 
 */ 
Ember.Handlebars.registerBoundHelper('thumb', 
	function(styleUID, options) 
	{
		return new Handlebars.SafeString("<img src=\""+Utils.thumbURL(styleUID)+"\"></img>");
	}
);

//---------------------------------------------------------------------------------------//

/**
 * Display a specific html template whether the data is set or not 
 * This helper can evaluate Javascript functions. Use {function(params)}.
 * To use the context params, do not forget to add 'context.' in front of your params.
 * 
 * 
 * Examples : 
    {{isset container.data
      yes='<div>OK</div>'
      no='<div>Null</div>'}}

    {{isset controller.style
      yes='<div><img src="{Utils.thumbURL(context.controller.style)}"></img></div>'
      no='<div>select the sytle !</div>'}}
 */
Ember.Handlebars.registerBoundHelper('isset', 
	function(data, options) 
	{
    	var currentContext = (options.contexts && options.contexts[0]) || this;
    	var context = currentContext[Ember.META_KEY].values.content;

    	if(data != undefined && data != null){
			return new Handlebars.SafeString(Utils.toHtml(options.hash.yes, context));
		}
		else{
			return new Handlebars.SafeString(Utils.toHtml(options.hash.no, context));
		}
	}
);

//---------------------------------------------------------------------------------------//

/**
 * Define a dynamic onclick method : )
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
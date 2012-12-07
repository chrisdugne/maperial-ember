// ----------------------------//
//	 ScriptLoader
// ----------------------------//

var scriptCache = new Object();

// ----------------------------//

var scriptsRemaining;
var callbackFunction;

// ----------------------------//

function getScripts(scripts, callback) 
{
	callbackFunction = callback;
	
	if(scripts.length > 0)
	{
		var script = scripts.shift();
		scriptsRemaining = scripts;
		loadScript(script);
	}
	else
	{
		callback();
	}
}

function loadScript(src) 
{
	console.log("loading " + src);
	
	if(scriptCache[src])
	{
		getScripts(scriptsRemaining, callbackFunction);
		return;
	}
	
	$.getScript(src, function() {
		scriptCache[src] = "ok";
		getScripts(scriptsRemaining, callbackFunction);
	});
	   
}

// ----------------------------//
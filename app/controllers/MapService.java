package controllers;

import org.codehaus.jackson.JsonNode;

import play.Logger;
import play.mvc.Result;

public class MapService extends Application 
{
	// ---------------------------------------------//

	public static Result createMap()
	{
		JsonNode params = request().body().asJson();
		JsonNode userJson = params.get("user");
		JsonNode mapJson = params.get("map");
		
		Logger.debug(userJson.toString());
		Logger.debug(mapJson.toString());
		
		return ok(params);
	}

	// ---------------------------------------------//
}
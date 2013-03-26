package controllers;

import java.util.Date;

import models.Map;
import models.Style;

import org.codehaus.jackson.JsonNode;

import play.Logger;
import play.mvc.Result;
import domain.AccountManager;

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

		//----------//
		
		Map map = new Map();

		String accountUID = userJson.get("uid").asText();
		String mapUID = mapJson.get("uid").asText();
		String mapName = mapJson.get("name").asText();
		
		map.setUid(mapUID);
		map.setName(mapName);
		map.setCreationTime(new Date().getTime());
		map.setLastModifiedTime(new Date().getTime());

		//----------//

		AccountManager.addMap(accountUID, map);
		
		//----------//

		return ok(gson.toJson(map));
	}

	// ---------------------------------------------//
	
	public static Result editMap()
	{
		//----------//
		
		JsonNode params = request().body().asJson();
		JsonNode mapJson = params.get("map");
		
		//----------//
		
		Map map = new Map();
		
		String mapUID = mapJson.get("uid").asText();
		String mapName = mapJson.get("name").asText();
		
		map.setUid(mapUID);
		map.setName(mapName);
		
		//----------//
		
		AccountManager.editMap(map);
		
		//----------//
		
		return ok(gson.toJson(map));
	}


	// ---------------------------------------------//
	
	public static Result removeMap()
	{
		//----------//
		
		JsonNode params = request().body().asJson();
		JsonNode mapJson = params.get("map");
		
		//----------//

		String mapUID = mapJson.get("uid").asText();
		
		//----------//
		
		AccountManager.removeMap(mapUID);
		
		//----------//
		
		return ok();
	}
	
	// ---------------------------------------------//
}
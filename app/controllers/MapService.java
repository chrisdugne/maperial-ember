package controllers;

import java.util.Date;

import models.Export;
import models.Map;

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
	
	// ===================================================================  //
	
	public static Result addExport()
	{
		//----------//

		JsonNode params = request().body().asJson();
		JsonNode mapJson = params.get("map");
		JsonNode exportJson = params.get("export");
		
		//----------//
		
		Export export = new Export();
		
		String mapUID = mapJson.get("uid").asText();
		String exportUID = exportJson.get("uid").asText();
		String name = exportJson.get("name").asText();
		
		export.setUid(exportUID);
		export.setName(name);
		export.setCreationTime(new Date().getTime());
		
		//----------//
		
		AccountManager.addExport(mapUID, export);
		
		//----------//
		
		return ok(gson.toJson(export));
	}

	
	public static Result removeExport()
	{
		//----------//
		
		JsonNode params = request().body().asJson();
		JsonNode exportJson = params.get("export");
		
		//----------//

		String exportUID = exportJson.get("uid").asText();
		
		//----------//
		
		AccountManager.removeExport(exportUID);
		
		//----------//
		
		return ok();
	}
}
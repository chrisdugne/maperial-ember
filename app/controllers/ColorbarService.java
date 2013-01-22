package controllers;

import models.Colorbar;

import org.codehaus.jackson.JsonNode;

import play.mvc.Result;
import domain.AccountManager;

public class ColorbarService extends Application 
{
	// ---------------------------------------------//

	public static Result addColorbar()
	{
		//----------//

		JsonNode params = request().body().asJson();
		JsonNode userJson = params.get("user");
		JsonNode colorbarJson = params.get("colorbar");
		
		//----------//
		
		Colorbar colorbar = new Colorbar();

		String accountUID = userJson.get("uid").asText();
		String colorbarUID = colorbarJson.get("uid").asText();
		String colorbarName = colorbarJson.get("name").asText();
		
		colorbar.setUid(colorbarUID);
		colorbar.setName(colorbarName);
		colorbar.setIsPublic(false);

		//----------//

		AccountManager.addColorbar(accountUID, colorbar);
		
		//----------//
		
		return ok(gson.toJson(colorbar));
	}

	// ---------------------------------------------//
	
	public static Result editColorbar()
	{
		//----------//
		
		JsonNode params = request().body().asJson();
		JsonNode colorbarJson = params.get("colorbar");
		
		//----------//
		
		Colorbar colorbar = new Colorbar();
		
		String colorbarUID = colorbarJson.get("uid").asText();
		String colorbarName = colorbarJson.get("name").asText();
		
		colorbar.setUid(colorbarUID);
		colorbar.setName(colorbarName);
		
		//----------//
		
		AccountManager.editColorbar(colorbar);
		
		//----------//
		
		return ok(gson.toJson(colorbar));
	}


	// ---------------------------------------------//
	
	public static Result removeColorbar()
	{
		//----------//
		
		JsonNode params = request().body().asJson();
		JsonNode colorbarJson = params.get("colorbar");
		
		//----------//

		String colorbarUID = colorbarJson.get("uid").asText();
		
		//----------//
		
		AccountManager.removeColorbar(colorbarUID);
		
		//----------//
		
		return ok();
	}
	
	// ---------------------------------------------//

}
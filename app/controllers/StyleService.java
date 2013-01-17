package controllers;

import models.Style;

import org.codehaus.jackson.JsonNode;

import play.mvc.Result;
import domain.AccountManager;

public class StyleService extends Application 
{
	// ---------------------------------------------//

	public static Result addStyle()
	{
		//----------//

		JsonNode params = request().body().asJson();
		JsonNode userJson = params.get("user");
		JsonNode styleJson = params.get("style");
		
		//----------//
		
		Style style = new Style();

		String accountUID = userJson.get("uid").asText();
		String styleUID = styleJson.get("uid").asText();
		String styleName = styleJson.get("name").asText();
		
		style.setUid(styleUID);
		style.setName(styleName);
		style.setIsPublic(false);

		//----------//

		AccountManager.addStyle(accountUID, style);
		
		//----------//
		
		return ok(gson.toJson(style));
	}

	// ---------------------------------------------//
	
	public static Result editStyle()
	{
		//----------//
		
		JsonNode params = request().body().asJson();
		JsonNode styleJson = params.get("style");
		
		//----------//
		
		Style style = new Style();
		
		String styleUID = styleJson.get("uid").asText();
		String styleName = styleJson.get("name").asText();
		
		style.setUid(styleUID);
		style.setName(styleName);
		
		//----------//
		
		AccountManager.editStyle(style);
		
		//----------//
		
		return ok(gson.toJson(style));
	}


	// ---------------------------------------------//
	
	public static Result removeStyle()
	{
		//----------//
		
		JsonNode params = request().body().asJson();
		JsonNode styleJson = params.get("style");
		
		//----------//

		String styleUID = styleJson.get("uid").asText();
		
		//----------//
		
		AccountManager.removeStyle(styleUID);
		
		//----------//
		
		return ok();
	}
	
	// ---------------------------------------------//

}
package controllers;

import models.User;

import org.codehaus.jackson.JsonNode;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import domain.UserManager;

import play.mvc.Result;


public class UserService extends Application 
{
	// ---------------------------------------------//

	public static Result getGoogleUser()
	{
		JsonNode params = request().body().asJson();
		JsonNode userJson = params.get("user");
		
		User user = UserManager.getGoogleUser(userJson);
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		
		return ok(gson.toJson(user));
	}

	// ---------------------------------------------//
}
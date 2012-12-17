package controllers;

import models.Account;

import org.codehaus.jackson.JsonNode;

import play.mvc.Result;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import domain.AccountManager;


public class AccountService extends Application 
{
	// ---------------------------------------------//

	public static Result getAccount()
	{
		JsonNode params = request().body().asJson();
		JsonNode userJson = params.get("user");
		
		Account account = AccountManager.getAccount(userJson);
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		
		return ok(gson.toJson(account));
	}

	// ---------------------------------------------//
}
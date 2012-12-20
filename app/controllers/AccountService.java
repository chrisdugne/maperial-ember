package controllers;

import models.Account;

import org.codehaus.jackson.JsonNode;

import play.mvc.Result;
import domain.AccountManager;

public class AccountService extends Application 
{
	// ---------------------------------------------//

	public static Result getAccount()
	{
		JsonNode params = request().body().asJson();
		JsonNode userJson = params.get("user");
		
		Account account = AccountManager.getAccount(userJson);
		
		return ok(gson.toJson(account));
	}

	// ---------------------------------------------//
	
	public static Result getPublicData()
	{
		Account publicDataContainer = new Account();
		AccountManager.getPublicData(publicDataContainer);
		
		return ok(gson.toJson(publicDataContainer));
	}

	// ---------------------------------------------//
}
package domain;

import models.Dataset;
import models.Account;

import org.codehaus.jackson.JsonNode;

import play.db.ebean.Transactional;
import utils.Utils;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.ExpressionList;

public class AccountManager {

	//------------------------------------------------------------------------------------//
	// Google users
	
	public static Account getAccount(JsonNode userJson)
	{
		String email = userJson.get("email").asText();
		ExpressionList<Account> accounts = Account.find.where().ilike("email", email);
		
		if(accounts.findRowCount() == 1)
			return accounts.findUnique();
		else 
			return createNewAccountFromGoogle(userJson);
		
	}

	@Transactional
	private static Account createNewAccountFromGoogle(JsonNode userJson) 
	{
		String email = userJson.get("email").asText();
		String name = userJson.get("name").asText();
		
		Account account = new Account();
		account.setEmail(email);
		account.setName(name);
		account.setAccountUID(Utils.generateUID());
	
	    Ebean.save(account);  
		
		return account;
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void addDataset(String accountUID, Dataset dataset) 
	{
		Account account = Account.find.where().ilike("accountUID", accountUID).findUnique();

		dataset.setAccount(account);

		Ebean.save(dataset);  
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void removeDataset(String datasetUID) 
	{
		Dataset dataset = Dataset.find.where().ilike("datasetUID", datasetUID).findUnique();

		Ebean.delete(dataset);
	}
	
	//------------------------------------------------------------------------------------//
}

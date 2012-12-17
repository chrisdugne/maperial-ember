package domain;

import java.util.List;
import java.util.Set;

import models.Colorbar;
import models.Dataset;
import models.Account;
import models.Font;
import models.Icon;
import models.Style;

import org.codehaus.jackson.JsonNode;

import play.Logger;
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
		account.setUid(Utils.generateUID());
	
	    Ebean.save(account);  
		
		return account;
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void addDataset(String accountUID, Dataset dataset) 
	{
		Account account = Account.find.where().ilike("uid", accountUID).findUnique();

		dataset.setAccount(account);

		Ebean.save(dataset);  
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void removeDataset(String datasetUID) 
	{
		Dataset dataset = Dataset.find.where().ilike("uid", datasetUID).findUnique();

		Ebean.delete(dataset);
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void fetchPublicData(Account account) 
	{
		Logger.debug("fetchPublicData");
		List<Style> styles = Style.find.where("isPublic = true").findList();
		Logger.debug("styles ok");
		Logger.debug(styles.size() + "" );
		account.getStyles().addAll(styles);

		List<Colorbar> colorbars = Colorbar.find.where("isPublic = true").findList();
		account.getColorbars().addAll(colorbars);
		
		List<Font> fonts = Font.find.where("isPublic = true").findList();
		account.getFonts().addAll(fonts);
		
		List<Icon> icons = Icon.find.where("isPublic = true").findList();
		account.getIcons().addAll(icons);
	}
	
	//------------------------------------------------------------------------------------//
}

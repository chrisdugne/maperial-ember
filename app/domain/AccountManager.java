package domain;

import java.util.ArrayList;
import java.util.List;

import models.Account;
import models.Colorbar;
import models.Dataset;
import models.Export;
import models.Font;
import models.Icon;
import models.Map;
import models.Raster;
import models.Style;

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
			return createNewAccount(userJson);

	}

	@Transactional
	private static Account createNewAccount(JsonNode userJson) 
	{
		String email = userJson.get("email").asText();

		Account account = new Account();

		account.setEmail(email);
		account.setUid(Utils.generateUID());

		account.setMaps(new ArrayList<Map>());
		account.setDatasets(new ArrayList<Dataset>());
		account.setStyles(new ArrayList<Style>());
		account.setColorbars(new ArrayList<Colorbar>());
		account.setIcons(new ArrayList<Icon>());
		account.setFonts(new ArrayList<Font>());

		Ebean.save(account);  

		return account;
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	@Deprecated
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

	//======================================================================================//
	//
	// - Datasets
	//

	@Transactional
	public static void addDataset(String accountUID, Dataset dataset) 
	{
		Account account = Account.find.where().ilike("uid", accountUID).findUnique();

		dataset.setAccount(account);

		Ebean.save(dataset);  
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void editDataset(String datasetUID, String name, String separator) 
	{
		Dataset dataset = Dataset.find.where().ilike("uid", datasetUID).findUnique();
		dataset.setName(name);
		dataset.setSeparator(separator);
		Ebean.save(dataset);  
	}

	//------------------------------------------------------------------------------------//
	
	@Transactional
	public static void removeDataset(String datasetUID) 
	{
		Dataset dataset = Dataset.find.where().ilike("uid", datasetUID).findUnique();
		
		Ebean.delete(dataset);
	}

	//======================================================================================//
	//
	// - Rasters
	//

	@Transactional
	public static void addRaster(String datasetUID, Raster raster) 
	{
		Dataset dataset = Dataset.find.where().ilike("uid", datasetUID).findUnique();

		raster.setDataset(dataset);

		Ebean.save(raster);  
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void removeRaster(String rasterUID) 
	{
		Raster raster = Raster.find.where().ilike("uid", rasterUID).findUnique();

		Ebean.delete(raster);
	}

	//======================================================================================//
	//
	// - Styles
	//

	@Transactional
	public static void addStyle(String accountUID, Style style) 
	{
		Account account = Account.find.where().ilike("uid", accountUID).findUnique();

		style.setAccount(account);

		Ebean.save(style);  
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void editStyle(Style style) 
	{
		Style styleInDb = Style.find.where().ilike("uid", style.getUid()).findUnique();

		styleInDb.setName(style.getName());

		Ebean.save(styleInDb); 
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void removeStyle(String styleUID) 
	{
		Style style = Style.find.where().ilike("uid", styleUID).findUnique();

		Ebean.delete(style);
	}

	//======================================================================================//
	//
	// - Colorbars
	//

	@Transactional
	public static void addColorbar(String accountUID, Colorbar colorbar) 
	{
		Account account = Account.find.where().ilike("uid", accountUID).findUnique();

		colorbar.setAccount(account);

		Ebean.save(colorbar);  
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void editColorbar(Colorbar colorbar) 
	{
		Colorbar colorbarInDb = Colorbar.find.where().ilike("uid", colorbar.getUid()).findUnique();

		colorbarInDb.setName(colorbar.getName());

		Ebean.save(colorbarInDb); 
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void removeColorbar(String colorbarUID) 
	{
		Colorbar colorbar = Colorbar.find.where().ilike("uid", colorbarUID).findUnique();

		Ebean.delete(colorbar);
	}

	//======================================================================================//
	//
	// - Maps
	//

	@Transactional
	public static void addMap(String accountUID, Map map) 
	{
		Account account = Account.find.where().ilike("uid", accountUID).findUnique();

		map.setAccount(account);

		Ebean.save(map);  
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void editMap(Map map) 
	{
		Map mapInDb = Map.find.where().ilike("uid", map.getUid()).findUnique();

		mapInDb.setName(map.getName());

		Ebean.save(mapInDb); 
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void removeMap(String mapUID) 
	{
		Map map = Map.find.where().ilike("uid", mapUID).findUnique();

		Ebean.delete(map);
	}

	//======================================================================================//
	//
	// - Exports
	//

	@Transactional
	public static void addExport(String mapUID, Export export) 
	{
		Map map = Map.find.where().ilike("uid", mapUID).findUnique();

		export.setMap(map);

		Ebean.save(export);  
	}

	//------------------------------------------------------------------------------------//

	@Transactional
	public static void removeExport(String exportUID) 
	{
		Export export = Export.find.where().ilike("uid", exportUID).findUnique();

		Ebean.delete(export);
	}
	
	//======================================================================================//
	//
	// - Public
	//

	@Transactional
	public static void getPublicData(Account publicDataContainer) 
	{
		List<Style> styles = Style.find.where("isPublic = true").findList();
		publicDataContainer.setStyles(styles);

		List<Colorbar> colorbars = Colorbar.find.where("isPublic = true").findList();
		publicDataContainer.setColorbars(colorbars);

		List<Font> fonts = Font.find.where("isPublic = true").findList();
		publicDataContainer.setFonts(fonts);

		List<Icon> icons = Icon.find.where("isPublic = true").findList();
		publicDataContainer.setIcons(icons);
	}


	//------------------------------------------------------------------------------------//
}

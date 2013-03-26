package controllers;

import java.util.Date;

import models.Dataset;
import models.Raster;

import org.codehaus.jackson.JsonNode;

import play.mvc.Result;
import domain.AccountManager;

public class DatasetService extends Application 
{
	// ===================================================================  //

	public static Result addDataset()
	{
		//----------//

		JsonNode params = request().body().asJson();
		JsonNode userJson = params.get("user");
		JsonNode datasetJson = params.get("dataset");
		
		//----------//
		
		Dataset dataset = new Dataset();

		String accountUID = userJson.get("uid").asText();
		String datasetUID = datasetJson.get("uid").asText();
		String datasetName = datasetJson.get("name").asText();
		Long datasetSize = datasetJson.get("size").asLong();
		
		dataset.setUid(datasetUID);
		dataset.setName(datasetName);
		dataset.setSeparator(",");
		dataset.setSize(datasetSize);
		dataset.setUploadTime(new Date().getTime());

		//----------//

		AccountManager.addDataset(accountUID, dataset);
		
		//----------//
		
		return ok(gson.toJson(dataset));
	}

	
	// ---------------------------------------------//
	
	
	public static Result editDataset()
	{
		//----------//
		
		JsonNode params = request().body().asJson();
		JsonNode datasetJson = params.get("dataset");
		
		//----------//

		String datasetUID = datasetJson.get("uid").asText();
		String name = datasetJson.get("name").asText();
		String separator = datasetJson.get("separator").asText();
		
		//----------//
		
		AccountManager.editDataset(datasetUID, name, separator);
		
		//----------//
		
		return ok();
	}
	
	
	// ---------------------------------------------//
	
	
	public static Result removeDataset()
	{
		//----------//
		
		JsonNode params = request().body().asJson();
		JsonNode datasetJson = params.get("dataset");
		
		//----------//

		String datasetUID = datasetJson.get("uid").asText();
		
		//----------//
		
		AccountManager.removeDataset(datasetUID);
		
		//----------//
		
		return ok();
	}

	// ===================================================================  //
	
	public static Result addRaster()
	{
		//----------//

		JsonNode params = request().body().asJson();
		JsonNode datasetJson = params.get("dataset");
		JsonNode rasterJson = params.get("raster");
		
		//----------//
		
		Raster raster = new Raster();
		
		String datasetUID = datasetJson.get("uid").asText();
		String rasterUID = rasterJson.get("uid").asText();
		String name = rasterJson.get("name").asText();
		
		raster.setUid(rasterUID);
		raster.setName(name);
		raster.setCreationTime(new Date().getTime());
		
		//----------//
		
		AccountManager.addRaster(datasetUID, raster);
		
		//----------//
		
		return ok(gson.toJson(raster));
	}

	
	public static Result removeRaster()
	{
		//----------//
		
		JsonNode params = request().body().asJson();
		JsonNode rasterJson = params.get("raster");
		
		//----------//

		String rasterUID = rasterJson.get("uid").asText();
		
		//----------//
		
		AccountManager.removeRaster(rasterUID);
		
		//----------//
		
		return ok();
	}
}
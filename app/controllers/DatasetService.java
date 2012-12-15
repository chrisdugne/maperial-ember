package controllers;

import java.util.Date;

import models.Dataset;

import org.codehaus.jackson.JsonNode;

import play.mvc.Result;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import domain.AccountManager;

public class DatasetService extends Application 
{
	// ---------------------------------------------//

	public static Result addDataset()
	{
		//----------//

		JsonNode params = request().body().asJson();
		JsonNode accountJson = params.get("account");
		JsonNode datasetJson = params.get("dataset");
		
		//----------//
		
		Dataset dataset = new Dataset();

		String accountUID = accountJson.get("accountUID").asText();
		String datasetUID = datasetJson.get("datasetUID").asText();
		String datasetName = datasetJson.get("name").asText();
		Long datasetSize = datasetJson.get("size").asLong();
		
		dataset.setDatasetUID(datasetUID);
		dataset.setName(datasetName);
		dataset.setSize(datasetSize);
		dataset.setUploadTime(new Date().getTime());

		//----------//

		AccountManager.addDataset(accountUID, dataset);
		
		//----------//
		
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		return ok(gson.toJson(dataset));
	}

	
	// ---------------------------------------------//
	
	
	public static Result removeDataset()
	{
		//----------//
		
		JsonNode params = request().body().asJson();
		JsonNode datasetJson = params.get("dataset");
		
		//----------//

		String datasetUID = datasetJson.get("datasetUID").asText();
		
		//----------//
		
		AccountManager.removeDataset(datasetUID);
		
		//----------//
		
		return ok();
	}
	
	// ---------------------------------------------//

}
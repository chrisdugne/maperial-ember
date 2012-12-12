package controllers;

import java.util.Date;

import models.Dataset;

import org.codehaus.jackson.JsonNode;

import play.mvc.Result;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import domain.UserManager;


public class DatasetService extends Application 
{
	// ---------------------------------------------//

	public static Result addDataset()
	{
		//----------//
		JsonNode params = request().body().asJson();
		JsonNode userJson = params.get("user");
		JsonNode datasetJson = params.get("dataset");
		
		//----------//
		
		Dataset dataset = new Dataset();

		String userUID = userJson.get("userUID").asText();
		String datasetUID = datasetJson.get("uid").asText();
		String datasetName = datasetJson.get("name").asText();
		
		dataset.setDatasetUID(datasetUID);
		dataset.setName(datasetName);
		dataset.setUploadTime(new Date().getTime());

		//----------//

		UserManager.addDataset(userUID, dataset);
		
		//----------//
		
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		return ok(gson.toJson(dataset));
	}

	// ---------------------------------------------//
}
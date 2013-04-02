package controllers;

import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import play.Logger;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.main;

public class Application extends Controller
{
	private static final String NETWORK_NAME = "Maperial";
	private static final String PROTECTED_RESOURCE_URL = "http://google.com";

	protected static Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
	
	// ---------------------------------------------//

	public static Result home()
	{
		Map<String, String[]> queryParameters = request().queryString();
		String[] login = queryParameters.get("login");
		
		Boolean isLocal = request().host().contains("localhost");
		Boolean popupLoginWindow = login != null;
		
		return ok(main.render(isLocal, popupLoginWindow));
	}

	// ---------------------------------------------//
}
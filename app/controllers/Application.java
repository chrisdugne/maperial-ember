package controllers;

import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import play.Logger;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.main;
import views.html.mainDev;

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
		
		Boolean isDeploy = request().host().contains("deploy");
		Boolean isDev = request().host().contains("localhost");
		Boolean popupLoginWindow = login != null;
		
		if(isDev && !isDeploy)
			return ok(mainDev.render(popupLoginWindow));
		
		if(isDeploy)
			return ok(main.render(false, popupLoginWindow));

		// prod
		return ok(main.render(true, popupLoginWindow));
	}

	// ---------------------------------------------//
}
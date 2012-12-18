package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.main;

public class Application extends Controller
{
	private static final String NETWORK_NAME = "Mapnify";
	private static final String PROTECTED_RESOURCE_URL = "http://google.com";

	// ---------------------------------------------//

	public static Result home()
	{
		return ok(main.render());
	}

	// ---------------------------------------------//
}
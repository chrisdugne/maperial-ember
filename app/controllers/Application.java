package controllers;

import play.mvc.Controller;
import play.mvc.Result;
import views.html.main;

public class Application extends Controller
{
	// ---------------------------------------------//

	public static Result home()
	{
		return ok(main.render());
	}

	// ---------------------------------------------//
}
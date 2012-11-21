package controllers;

import com.avaje.ebean.Ebean;

import models.User;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.main;

public class Application extends Controller
{
	// ---------------------------------------------//

	public static Result home()
	{
		User user = new User();
		user.email = "chris.dugne@mapnify.com";
		
		Ebean.save(user);
		
		return ok(main.render());
	}

	// ---------------------------------------------//
}
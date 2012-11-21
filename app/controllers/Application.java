package controllers;

import com.avaje.ebean.Ebean;

import models.User;
import play.Logger;
import play.db.ebean.Transactional;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.main;

public class Application extends Controller
{
	// ---------------------------------------------//

	@Transactional
	public static Result home()
	{
		Logger.debug("---------------");
		Logger.debug("new user");
		User user = new User();
		user.setEmail("chris.dugne@mapnify.com");
		user.setGoogleUID("no");
		user.setPassword("pwd");
		user.setUserUID("777777");
		Logger.debug("---------------");
		Logger.debug("saving user");
		
		Ebean.save(user);
		Logger.debug("---------------");
		Logger.debug("rendering");
		
		return ok(main.render());
	}

	// ---------------------------------------------//
}
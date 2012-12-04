package domain;

import models.User;

import org.codehaus.jackson.JsonNode;

import play.db.ebean.Transactional;
import utils.Utils;

import com.avaje.ebean.Ebean;
import com.avaje.ebean.ExpressionList;

public class UserManager {

	//------------------------------------------------------------------------------------//
	// Google users
	
	public static User getGoogleUser(JsonNode userJson)
	{
		String email = userJson.get("email").asText();
		ExpressionList<User> users = User.find.where().ilike("email", email);
		
		if(users.findRowCount() == 1)
			return users.findUnique();
		else 
			return createNewUserFromGoogle(userJson);
		
	}

	@Transactional
	private static User createNewUserFromGoogle(JsonNode userJson) 
	{
		String email = userJson.get("email").asText();
		String name = userJson.get("name").asText();
		
		User user = new User();
		user.setEmail(email);
		user.setName(name);
		user.setUserUID(Utils.generateUID());
	
	    Ebean.save(user);  
		
		return user;
	}
	
	//------------------------------------------------------------------------------------//
}

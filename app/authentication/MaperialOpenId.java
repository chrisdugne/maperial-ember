package authentication;

import java.util.HashMap;
import java.util.Map;

import play.Logger;
import play.mvc.Result;
import views.html.auth.badtoken;
import views.html.auth.goodtoken;

import utils.HttpHelper;

import com.google.gson.Gson;

import controllers.Application;

public class MaperialOpenId extends Application {

	public static String CLIENT_ID = "FI4ZNGH5843JD3F";
	public static String SECRET = "P#RJ!!42FVJ@TZE&52?5345VDFGk";
	
	/**
	 * The token is received : proceed to the validation.
	 * 
	 * @return
	 */
	public static Result receivedToken() 
	{
		//--------------------------------------------------------------------------------//

		Map<String, String[]> queryParameters = request().queryString();
		String token = queryParameters.get("token")[0];

		//--------------------------------------------------------------------------------//
		
		String url = "http://map.x-ray.fr/user/validate";
		Map<String, String> parameters = new HashMap<String, String>(); 
		parameters.put("token", token);
		parameters.put("clientid", CLIENT_ID);
		parameters.put("secret", SECRET);
		
		//--------------------------------------------------------------------------------//
		
		String response = HttpHelper.post(url, parameters);

		//--------------------------------------------------------------------------------//
		
		ValidateResponse validation = new Gson().fromJson(response, ValidateResponse.class);
		
		//--------------------------------------------------------------------------------//

		if(validation.result.equals(ValidateResponse.ERROR))
		{
			// Token is not validated = PIRATE !!!
			Logger.debug("(PIRATE!) error | message : " + validation.error);
			return ok(badtoken.render());
		}

		//--------------------------------------------------------------------------------//
		
		else
		{
			Logger.debug("validation.result : " + validation.result);
			return ok(goodtoken.render(token, validation.email));
		}

		//--------------------------------------------------------------------------------//
	}
	
	private class ValidateResponse
	{
		static final String ERROR = "error";
		String result;
		String error;
		String email;
	}
}

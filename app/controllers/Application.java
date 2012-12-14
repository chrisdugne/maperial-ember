package controllers;

import java.util.Scanner;

import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.GoogleApi;
import org.scribe.builder.api.TwitterApi;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

import play.Logger;
import play.db.ebean.Transactional;
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
//		OAuthService service = new ServiceBuilder()
//		  .provider(MapnifyApi.class) 
//		  .apiKey("93efb0403eb7080ad68b7b1b8aab90") // clientId
//		  .apiSecret("1880c5b0ebe7e7eab30c76adf7da86")
//		  .build();
//		
//		
//		Scanner in = new Scanner(System.in);
//		
//		System.out.println("=== " + NETWORK_NAME + "'s OAuth Workflow ===");
//		System.out.println();
//		
//		// Obtain the Request Token
//		System.out.println("Fetching the Request Token...");
//		Token requestToken = service.getRequestToken();
//		System.out.println("Got the Request Token!");
//		System.out.println("(if your curious it looks like this: " + requestToken + " )");
//		System.out.println();
//		
//		System.out.println("Now go and authorize Scribe here:");
//		System.out.println(MapnifyApi.AUTHORIZATION_URL + requestToken.getToken());
//		System.out.println("And paste the verifier here");
//		System.out.print(">>");
//		Verifier verifier = new Verifier(in.nextLine());
//		System.out.println();
//		
//		// Trade the Request Token and Verfier for the Access Token
//		System.out.println("Trading the Request Token for an Access Token...");
//		Token accessToken = service.getAccessToken(requestToken, verifier);
//		System.out.println("Got the Access Token!");
//		System.out.println("(if your curious it looks like this: " + accessToken + " )");
//		System.out.println();
//		
//		// Now let's go and ask for a protected resource!
//		System.out.println("Now we're going to access a protected resource...");
//		OAuthRequest request = new OAuthRequest(Verb.GET, PROTECTED_RESOURCE_URL);
//		service.signRequest(accessToken, request);
//		request.addHeader("GData-Version", "3.0");
//		Response response = request.send();
//		System.out.println("Got it! Lets see what we found...");
//		System.out.println();
//		System.out.println(response.getCode());
//		System.out.println(response.getBody());
//		
//		System.out.println();
//		System.out.println("Thats it man! Go and build something awesome with Scribe! :)");
		return ok(main.render());
	}

	// ---------------------------------------------//
}
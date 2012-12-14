package authentication;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

import play.Logger;
import play.mvc.Controller;
import play.mvc.Result;

public class MapnifyOAuth2 extends Controller {


	public static Result receivedCode() throws IOException
	{
		Map<String, String[]> queryParameters = request().queryString();
		String code = queryParameters.get("code")[0];
		
		Logger.debug("receivedCode : " + code);
		
		String urlParameters = "param1=a&param2=b&param3=c";
		String request = "http://example.com/index.php";
		URL url = new URL(request); 
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();           
		connection.setDoOutput(true);
		connection.setDoInput(true);
		connection.setInstanceFollowRedirects(false); 
		connection.setRequestMethod("POST"); 
		connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded"); 
		connection.setRequestProperty("charset", "utf-8");
		connection.setRequestProperty("Content-Length", "" + Integer.toString(urlParameters.getBytes().length));
		connection.setUseCaches (false);

		DataOutputStream wr = new DataOutputStream(connection.getOutputStream ());
		wr.writeBytes(urlParameters);
		wr.flush();
		wr.close();
		connection.disconnect();
		
		
		return ok();
	}
}

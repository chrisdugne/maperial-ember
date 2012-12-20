package utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map;

public class HttpHelper {

	public static String post(String url, Map<String, String> parameters)
	{
		//--------------------------------------------------------------------------------//
		// Set parameters

		String charset = "UTF-8";
		Object[] paramValues = new Object[parameters.size()];
		String paramsURL = "";

		int i = 0;
		for(String param : parameters.keySet())
		{
			try {
				paramValues[i++] = URLEncoder.encode(parameters.get(param), charset);
				paramsURL += param + "=%s&";
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}

		String query = String.format(paramsURL, paramValues);

		//--------------------------------------------------------------------------------//
		// Post Request

		HttpURLConnection connection = null;
		OutputStream output = null;

		try {
			connection = (HttpURLConnection) new URL(url).openConnection();
			connection.setRequestMethod("POST");
			connection.setDoOutput(true); // Triggers POST.
			connection.setRequestProperty("Accept-Charset", charset);
			connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=" + charset);
			output = connection.getOutputStream();
			output.write(query.getBytes(charset));
		} 
		catch (MalformedURLException e) {
			e.printStackTrace();
		} 
		catch (IOException e) {
			e.printStackTrace();

		} finally {
			if (output != null) try { output.close(); } catch (IOException logOrIgnore) {}
		}

		//--------------------------------------------------------------------------------//
		// Get Response

		String response = null;
		InputStream httpResponse = null;

		try {
			httpResponse = connection.getInputStream();
		} catch (IOException e) {
			e.printStackTrace();
		}

		String contentType = connection.getHeaderField("Content-Type");

		for (String param : contentType.replace(" ", "").split(";")) {
			if (param.startsWith("charset=")) {
				charset = param.split("=", 2)[1];
				break;
			}
		}

		BufferedReader reader = null;
		try {
			reader = new BufferedReader(new InputStreamReader(httpResponse, charset));
			response = reader.readLine();
//			for (String line; (line = reader.readLine()) != null;) {
//				result += line;
//			}
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		finally {
			if (reader != null) try { reader.close(); } catch (IOException logOrIgnore) {}
		}
		
		
		return response;
	}
}

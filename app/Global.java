import play.*;
import play.mvc.*;
import play.mvc.Http.RequestHeader;

public class Global extends GlobalSettings {
	 
	@Override
	public Result onHandlerNotFound(RequestHeader request) {
	  return controllers.Application.home();
  }  
    
}
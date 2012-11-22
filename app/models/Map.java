package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import play.db.ebean.Model;

@Entity
@Table(name="public.map")
public class Map extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	private String mapUID;

	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Map> find = new Finder<String, Map>(String.class, Map.class);

	// -----------------------------------------------------------------------------------------------//
	
	private static final long serialVersionUID = -5124473460158929523L;
}

package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import play.db.ebean.Model;

@Entity
@Table(name="public.style")
public class Style extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	private String styleUID;

	private String name;

	// -----------------------------------------------------------------------------------------------//
	// -- Queries

	public static Model.Finder<String, Style> find = new Finder<String, Style>(String.class, Style.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getStyleUID() {
		return styleUID;
	}

	public void setStyleUID(String styleUID) {
		this.styleUID = styleUID;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	// -----------------------------------------------------------------------------------------------//

	private static final long serialVersionUID = -1480435014105026829L;
}

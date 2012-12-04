package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.google.gson.annotations.Expose;

import play.db.ebean.Model;

@Entity
@Table(name="public.style")
public class Style extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String styleUID;

	@Expose
	private String name;

	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private User user;
	
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

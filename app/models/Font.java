package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import play.db.ebean.Model;

@Entity
@Table(name="public.font")
public class Font extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	private String fontUID;
	
	private String name;

	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private User user;
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Font> find = new Finder<String, Font>(String.class, Font.class);

	// -----------------------------------------------------------------------------------------------//

	public String getFontUID() {
		return fontUID;
	}
	
	public void setFontUID(String fontUID) {
		this.fontUID = fontUID;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	// -----------------------------------------------------------------------------------------------//

	private static final long serialVersionUID = -4917075197471183246L;

	// -----------------------------------------------------------------------------------------------//

}

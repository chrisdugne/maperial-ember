package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.google.gson.annotations.Expose;

import play.db.ebean.Model;

@Entity
@Table(name="public.font")
public class Font extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String fontUID;
	
	@Expose
	private String name;

	@Expose
	private Boolean isPublic;
	
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

	public Boolean getIsPublic() {
		return isPublic;
	}

	public void setIsPublic(Boolean isPublic) {
		this.isPublic = isPublic;
	}

	// -----------------------------------------------------------------------------------------------//

	private static final long serialVersionUID = -4917075197471183246L;

	// -----------------------------------------------------------------------------------------------//

}

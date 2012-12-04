package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.google.gson.annotations.Expose;

import play.db.ebean.Model;

@Entity
@Table(name="public.colorbar")
public class ColorBar extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String colorBarUID;

	@Expose
	private String name;

	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private User user;
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, ColorBar> find = new Finder<String, ColorBar>(String.class, ColorBar.class);

	// -----------------------------------------------------------------------------------------------//

	public String getColorBarUID() {
		return colorBarUID;
	}
	
	public void setColorBarUID(String colorBarUID) {
		this.colorBarUID = colorBarUID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	// -----------------------------------------------------------------------------------------------//

	private static final long serialVersionUID = 7522352657099709486L;
}

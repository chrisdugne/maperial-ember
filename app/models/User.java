package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import play.db.ebean.Model;

@Entity
@Table(name="public.user")
public class User extends Model {

	// -----------------------------------------------------------------------------------------------//

	@Id
	private String userUID;
	
	private String googleUID;
	private String email;
	private String name;
	private String password;
	
	@OneToMany
	private List<Map> maps;

	@OneToMany
	private List<Style> styles;
	
	@OneToMany
	private List<DataSet> datasets;
	
	@OneToMany
	private List<ColorBar> colorbars;
	
	@OneToMany
	private List<Font> fonts;
	
	@OneToMany
	private List<Icon> icons;

	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, User> find = new Finder<String, User>(String.class, User.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getUserUID() {
		return userUID;
	}

	public void setUserUID(String userUID) {
		this.userUID = userUID;
	}

	public String getGoogleUID() {
		return googleUID;
	}

	public void setGoogleUID(String googleUID) {
		this.googleUID = googleUID;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Map> getMaps() {
		return maps;
	}

	public void setMaps(List<Map> maps) {
		this.maps = maps;
	}

	public List<Style> getStyles() {
		return styles;
	}

	public void setStyles(List<Style> styles) {
		this.styles = styles;
	}

	public List<DataSet> getDatasets() {
		return datasets;
	}

	public void setDatasets(List<DataSet> datasets) {
		this.datasets = datasets;
	}

	public List<ColorBar> getColorbars() {
		return colorbars;
	}

	public void setColorbars(List<ColorBar> colorbars) {
		this.colorbars = colorbars;
	}

	public List<Font> getFonts() {
		return fonts;
	}

	public void setFonts(List<Font> fonts) {
		this.fonts = fonts;
	}

	public List<Icon> getIcons() {
		return icons;
	}

	public void setIcons(List<Icon> icons) {
		this.icons = icons;
	}

	// -----------------------------------------------------------------------------------------------//
	
	private static final long serialVersionUID = -8425213041824976820L;
	
}

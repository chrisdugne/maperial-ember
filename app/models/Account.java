package models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Account extends Model { 

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String uid;
	
	@Expose
	private String email;
	@Expose
	private String name;
	@Expose
	private String password;
	
	// dixit Iban : attention : 1-4 different de 1-100000 dans le schema : or ici generation automatique
	// effectivement une liste de 100000 trucs on ne la veut pas en objet !
	// list a virer pour test ! (le ManyToOne doit suffire)
	// J2M : add des parametres : cascade par exemple
	@OneToMany
	@Expose
	private List<Map> maps;

	@OneToMany
	@Expose
	private List<Style> styles;
	
	@OneToMany
	@Expose
	private List<Dataset> datasets;
	
	@OneToMany
	@Expose
	private List<Colorbar> colorbars;
	
	@OneToMany
	@Expose
	private List<Font> fonts;
	
	@OneToMany
	@Expose
	private List<Icon> icons;

	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Account> find = new Finder<String, Account>(String.class, Account.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getUid() {
		return uid;
	}

	public void setUid(String accountUID) {
		this.uid = accountUID;
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

	public List<Dataset> getDatasets() {
		return datasets;
	}

	public void setDatasets(List<Dataset> datasets) {
		this.datasets = datasets;
	}

	public List<Colorbar> getColorbars() {
		return colorbars;
	}

	public void setColorbars(List<Colorbar> colorbars) {
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

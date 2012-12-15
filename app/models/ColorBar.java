package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class ColorBar extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String colorBarUID;

	@Expose
	private String name;

	@Expose
	private Boolean isPublic;
	
	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private Account account;
	
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

	public Boolean getIsPublic() {
		return isPublic;
	}

	public void setIsPublic(Boolean isPublic) {
		this.isPublic = isPublic;
	}
	
	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}
	
	// -----------------------------------------------------------------------------------------------//

	private static final long serialVersionUID = 7522352657099709486L;
}

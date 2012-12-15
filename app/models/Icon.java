package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Icon extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String iconUID;
	
	@Expose
	private String name;

	@Expose
	private Boolean isPublic;
	
	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private Account account;
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Icon> find = new Finder<String, Icon>(String.class, Icon.class);

	// -----------------------------------------------------------------------------------------------//

	public String getIconUID() {
		return iconUID;
	}
	
	public void setIconUID(String iconUID) {
		this.iconUID = iconUID;
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

	private static final long serialVersionUID = -2129947718996775259L;

	// -----------------------------------------------------------------------------------------------//

}

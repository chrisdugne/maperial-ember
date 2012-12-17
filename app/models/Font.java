package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Font extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String uid;
	
	@Expose
	private String name;

	@Expose
	private Boolean isPublic;
	
	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private Account account; 
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Font> find = new Finder<String, Font>(String.class, Font.class);

	// -----------------------------------------------------------------------------------------------//

	public String getUid() {
		return uid;
	}
	
	public void setUid(String fontUID) {
		this.uid = fontUID;
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

	private static final long serialVersionUID = -4917075197471183246L;

	// -----------------------------------------------------------------------------------------------//

}

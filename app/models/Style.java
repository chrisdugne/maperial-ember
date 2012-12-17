package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Style extends Model{

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

	public static Model.Finder<String, Style> find = new Finder<String, Style>(String.class, Style.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getUid() {
		return uid;
	}

	public void setUid(String styleUID) {
		this.uid = styleUID;
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

	private static final long serialVersionUID = -1480435014105026829L;
}

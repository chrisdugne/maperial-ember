package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Map extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Expose
	@Id
	private String uid;
	
	@Expose
	private String name;
	
	@Expose
	private String config;
	
	@Expose
	private Long creationTime;

	@Expose
	private Long lastModifiedTime;

	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private Account account;

	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Map> find = new Finder<String, Map>(String.class, Map.class);

	// -----------------------------------------------------------------------------------------------//

	public String getUid() {
		return uid;
	}
	
	public void setUid(String mapUID) {
		this.uid = mapUID;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getConfig() {
		return config;
	}

	public void setConfig(String config) {
		this.config = config;
	}

	public Long getCreationTime() {
		return creationTime;
	}

	public void setCreationTime(Long creationTime) {
		this.creationTime = creationTime;
	}

	public Long getLastModifiedTime() {
		return lastModifiedTime;
	}

	public void setLastModifiedTime(Long lastModifiedTime) {
		this.lastModifiedTime = lastModifiedTime;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}
	
	// -----------------------------------------------------------------------------------------------//

	private static final long serialVersionUID = -5124473460158929523L;

	// -----------------------------------------------------------------------------------------------//

}

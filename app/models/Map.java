package models;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

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
	private Long creationTime;

	@Expose
	private Long lastModifiedTime;

	@OneToMany(cascade=CascadeType.ALL)
	@Expose
	private List<Export> exports;
	
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

	public List<Export> getExports() {
		return exports;
	}

	public void setExports(List<Export> exports) {
		this.exports = exports;
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

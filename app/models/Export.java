package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Export extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String uid; 
	
	@Expose
	private String name;

	@Expose
	private Long creationTime;

	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private Map map;
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Export> find = new Finder<String, Export>(String.class, Export.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getUid() {
		return uid;
	}
	
	public void setUid(String datasetUID) {
		this.uid = datasetUID;
	}
	
	public Long getCreationTime() {
		return creationTime;
	}

	public void setCreationTime(Long creationTime) {
		this.creationTime = creationTime;
	}

	public Map getMap() {
		return map;
	}

	public void setMap(Map map) {
		this.map = map;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	// -----------------------------------------------------------------------------------------------//

	/**
	 * 
	 */
   private static final long serialVersionUID = 1L;	
   
}

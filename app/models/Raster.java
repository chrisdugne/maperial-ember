package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import play.db.ebean.Model;

import com.google.gson.annotations.Expose;

@Entity
public class Raster extends Model{

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
	private Dataset dataset;
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Raster> find = new Finder<String, Raster>(String.class, Raster.class);

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

	public Dataset getDataset() {
		return dataset;
	}

	public void setDataset(Dataset dataset) {
		this.dataset = dataset;
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

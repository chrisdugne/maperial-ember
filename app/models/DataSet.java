package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.google.gson.annotations.Expose;

import play.db.ebean.Model;

@Entity
@Table(name="public.dataset")
public class DataSet extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String dataSetUID;
	
	@Expose
	private String name;
	@Expose
	private Long uploadTime;

	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private User user;
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	

	public static Model.Finder<String, DataSet> find = new Finder<String, DataSet>(String.class, DataSet.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getDataSetUID() {
		return dataSetUID;
	}
	
	public void setDataSetUID(String dataSetUID) {
		this.dataSetUID = dataSetUID;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getUploadTime() {
		return uploadTime;
	}

	public void setUploadTime(Long uploadTime) {
		this.uploadTime = uploadTime;
	}

	// -----------------------------------------------------------------------------------------------//
	
	private static final long serialVersionUID = 8056258933792278781L;
}

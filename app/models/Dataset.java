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
public class Dataset extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	@Expose
	private String uid;
	
	@Expose
	private String name;
	
	@Expose
	private String separator;

	@Expose
	private Long size;

	@Expose
	private Long uploadTime;

	@OneToMany(cascade=CascadeType.ALL)
	@Expose
	private List<Raster> rasters;

	// -----------------------------------------------------------------------------------------------//

	@ManyToOne
	private Account account;
	
	
	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Dataset> find = new Finder<String, Dataset>(String.class, Dataset.class);

	// -----------------------------------------------------------------------------------------------//
	
	public String getUid() {
		return uid;
	}
	
	public void setUid(String datasetUID) {
		this.uid = datasetUID;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSeparator() {
		return separator;
	}

	public void setSeparator(String separator) {
		this.separator = separator;
	}

	public Long getUploadTime() {
		return uploadTime;
	}

	public void setUploadTime(Long uploadTime) {
		this.uploadTime = uploadTime;
	}
	
	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}
	
	public List<Raster> getRasters() {
		return rasters;
	}

	public void setRasters(List<Raster> rasters) {
		this.rasters = rasters;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

	// -----------------------------------------------------------------------------------------------//
	
	private static final long serialVersionUID = 8056258933792278781L;
}

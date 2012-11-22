package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import play.db.ebean.Model;

@Entity
@Table(name="public.dataset")
public class DataSet extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	private String dataSetUID;

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

	// -----------------------------------------------------------------------------------------------//
	
	private static final long serialVersionUID = 8056258933792278781L;
}

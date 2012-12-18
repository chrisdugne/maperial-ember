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
	@ManyToOne
	private Style style;

	@Expose
	@ManyToOne
	private Colorbar colorbar;

	@Expose
	@ManyToOne
	private Dataset dataset;

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
	
	public Style getStyle() {
		return style;
	}

	public void setStyle(Style style) {
		this.style = style;
	}

	public Colorbar getColorbar() {
		return colorbar;
	}

	public void setColorbar(Colorbar colorbar) {
		this.colorbar = colorbar;
	}

	public Dataset getDataset() {
		return dataset;
	}

	public void setDataset(Dataset dataset) {
		this.dataset = dataset;
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

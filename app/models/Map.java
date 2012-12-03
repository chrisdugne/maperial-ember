package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import play.db.ebean.Model;

@Entity
@Table(name="public.map")
public class Map extends Model{

	// -----------------------------------------------------------------------------------------------//

	@Id
	private String mapUID;
	
	private String name;
	private Style style;
	private ColorBar colorbar;
	private DataSet dataset;

	// -----------------------------------------------------------------------------------------------//
	// -- Queries
	
	public static Model.Finder<String, Map> find = new Finder<String, Map>(String.class, Map.class);

	// -----------------------------------------------------------------------------------------------//

	public String getMapUID() {
		return mapUID;
	}
	
	public void setMapUID(String mapUID) {
		this.mapUID = mapUID;
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

	public ColorBar getColorbar() {
		return colorbar;
	}

	public void setColorbar(ColorBar colorbar) {
		this.colorbar = colorbar;
	}

	public DataSet getDataset() {
		return dataset;
	}

	public void setDataset(DataSet dataset) {
		this.dataset = dataset;
	}
	
	// -----------------------------------------------------------------------------------------------//

	private static final long serialVersionUID = -5124473460158929523L;

	// -----------------------------------------------------------------------------------------------//

}

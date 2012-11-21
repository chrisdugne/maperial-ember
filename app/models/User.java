package models;

import javax.persistence.Entity;

import play.db.ebean.Model;

@Entity
public class User extends Model {

	private static final long serialVersionUID = -8425213041824976820L;

	public String userUID;
	public String googleUID;
	public String email;
	public String password;

	// -- Queries
	public static Model.Finder<String, User> find = new Finder<String, User>(String.class, User.class);
}

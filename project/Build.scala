import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

	//------------------------------------------------------------------------------------//

    val appName         = "MapnifyClient"
    val appVersion      = "1.0-SNAPSHOT"

	//------------------------------------------------------------------------------------//

	// Only compile the bootstrap bootstrap.less file and any other *.less file in the stylesheets directory
  	def customLessEntryPoints(base: File): PathFinder = (
       (base / "app" / "assets" / "stylesheets" / "bootstrap" * "bootstrap.less") +++
       (base / "app" / "assets" / "stylesheets" / "bootstrap" * "responsive.less") +++
       (base / "app" / "assets" / "stylesheets" * "*.less")
  	)

	//------------------------------------------------------------------------------------//

	val postgresql = "postgresql" % "postgresql" % "9.1-901.jdbc4"
	val gson = "com.google.code.gson" % "gson" % "2.2.2"

	//------------------------------------------------------------------------------------//
 
    val appDependencies = Seq(
  		javaCore, javaEbean, postgresql, gson
    )

	//------------------------------------------------------------------------------------//

    val main = play.Project(appName, appVersion, appDependencies).settings(
      resolvers += "Maven repository" at "http://mvnrepository.com/",
      lessEntryPoints <<= baseDirectory(customLessEntryPoints)
    )

 
}

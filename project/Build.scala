import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

    val appName         = "MapnifyClient"
    val appVersion      = "1.0-SNAPSHOT"

	// Only compile the bootstrap bootstrap.less file and any other *.less file in the stylesheets directory
  	def customLessEntryPoints(base: File): PathFinder = (
       (base / "app" / "assets" / "stylesheets" / "bootstrap" * "bootstrap.less") +++
       (base / "app" / "assets" / "stylesheets" / "bootstrap" * "responsive.less") 
  	)

    val appDependencies = Seq(
  		javaCore, 
  		javaEbean, 
  		"postgresql" % "postgresql" % "9.1-901.jdbc4", 
  		"com.google.code.gson" % "gson" % "2.2.2"
    )

    val main = play.Project(appName, appVersion, appDependencies).settings(
      lessEntryPoints <<= baseDirectory(customLessEntryPoints),
//      lessEntryPoints := Nil,
      resolvers += "Maven repository" at "http://mvnrepository.com/"
    )

}

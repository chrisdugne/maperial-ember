import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

    val appName         = "MapnifyClient"
    val appVersion      = "1.0-SNAPSHOT"

	// Only compile the bootstrap bootstrap.less file and any other *.less file in the stylesheets directory
  	def customLessEntryPoints(base: File): PathFinder = (
       (base / "app" / "assets" / "stylesheets" / "bootstrap" * "bootstrap.less") +++
       (base / "app" / "assets" / "stylesheets" / "bootstrap" * "responsive.less") +++
       (base / "app" / "assets" / "stylesheets" * "*.less")
  	)

	val postgresql = "postgresql" % "postgresql" % "9.1-901.jdbc4"
 
    val appDependencies = Seq(
  		postgresql
    )

    val main = PlayProject(appName, appVersion, appDependencies, mainLang = JAVA).settings(
      lessEntryPoints <<= baseDirectory(customLessEntryPoints)
    )

 
}

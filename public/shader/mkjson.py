import shutil
import os
import sys
import glob
import json


path = "."

glList = glob.glob ( path + "/*.gl")

for g in glList :
   tmp = os.path.basename ( g ).split(".")
   basename = tmp[:len(tmp)-1]
   basename = str().join(basename)
   jsonf = basename + ".json"
   if not os.path.exists ( path + "/" +  jsonf ) :
      continue
   
   print "Make " + g
   c = str()
   f = open ( g , "r" )
   for l in f:
      c = c + l.strip() + "---";
   
   f.close()
   
   f = open ( jsonf , "r")
   j = json.load (f)
   if not "code" in j:
      continue
   j["code"] = c
     
   f = open ( jsonf , "w")
   json.dump ( j,f,indent=1)
   f.close()
   print g + " ok"
   
   
   
   
        
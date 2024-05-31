# iot_project_Alexandru_Vasile_4812579


<h3>Demo:</h3>
- https://youtu.be/gHaeA7A_p5w

<h3>Git clone issue:</h3>
In Windows, after you have cloned the repository there may be the error "error: invalid path 'cs_simulator/aux.js'".<br>
To overcome it:
- go inside the git directory
- run: git config core.protectNTFS false
- run: git restore --source=HEAD :/


There are three main components:
- CSMS in node-red
- mobile app in AndroidStudio
- CS simulators in JavaScript

<h3>Modules to download in node-red</h3> 
After you have imported in node-red the file csms/flows.json execute the following commands:<br>
cd ~/.node-red;<br>
npm install @gogovega/node-red-contrib-firebase-realtime-database;<br>
npm install node-red-dashboard;<br>
npm install node-red-contrib-aedes;<br>
npm install node-red-node-sqlite;<br>
npm install node-red-contrib-web-worldmap;<br>

<h3>Node-red nodes to configure</h3>
SET node of firebase<br>
- insert the secret file already present under /cs_simulator/secrets<br>
- insert the link of the realtimedatabase: https://iotprojectfirebase-c5a62-default-rtdb.firebaseio.com/<br>
sqlite node<br>
- be aware that the path of the sqlite database is relative to the current directory where you run node-red


<h3>An example of cs simulator execution</h3>
- node CS_simulator.js ./cs/cs_sqbf.json

<h3>Connecting the mobile app to the same local network of the other components by using adb executable under the folder platform-tools</h3>
- .\adb.exe reverse tcp:1880 tcp:1880

<h3>How to start the system</h3>
- run the cs simulator scripts<br>
- click on "add tables" node in the CSMS tab of node-red<br>
- in each tab related to CS click on "add info about the cs in the db"<br>
- then use the mobile app<br>
<br>
In case you have problems with the configuration contact me at s4812579@studenti.unige.it

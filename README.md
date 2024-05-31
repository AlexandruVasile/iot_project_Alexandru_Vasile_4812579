# iot_project_Alexandru_Vasile_4812579

```bash
Demo:
- https://youtu.be/gHaeA7A_p5w

Git clone issue:
In Windows, after you have cloned the repository there may be the following error "error: invalid path 'cs_simulator/aux.js'"
To overcome it:
- go inside the git directory
- run: git config core.protectNTFS false
- run: git restore --source=HEAD :/


There are three main components:
- CSMS in node-red
- mobile app in AndroidStudio
- CS simulators in JavaScript

Modules to download in node-red, after you have imported in node-red the file csms/flows.json:
cd ~/.node-red;
npm install @gogovega/node-red-contrib-firebase-realtime-database;
npm install node-red-dashboard;
npm install node-red-contrib-aedes;
npm install node-red-node-sqlite;
npm install node-red-contrib-web-worldmap;

Nodes to configure:
+ SET node of firebase
    - insert the secret file already present under /cs_simulator/secrets
    - insert the link of the realtimedatabase: https://iotprojectfirebase-c5a62-default-rtdb.firebaseio.com/
+ sqlite node
    - be aware that the path of the sqlite database is relative to the current directory where you run node-red


An example of cs simulator execution:
- node CS_simulator.js ./cs/cs_sqbf.json

Connecting the mobile app to the same local network of the other components:
- .\adb.exe reverse tcp:1880 tcp:1880

How to start the system:
- run the cs simulator scripts
- click on "add tables" node in the CSMS tab of node-red
- in each tab related to CS click on "add info about the cs in the db"
- then use the mobile app

In case you have problems with the configuration contact me at s4812579@studenti.unige.it

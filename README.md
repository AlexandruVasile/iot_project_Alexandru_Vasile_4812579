# iot_project_Alexandru_Vasile_4812579

There are three main components:
- csms in nodered
- mobile app in android studio
- CS simulators in JavaScript

Modules to download in node-red after you've imported in nodered flows.json file under the folder csms:
- npm install @gogovega/node-red-contrib-firebase-realtime-database
- npm install node-red-dashboard
- npm install node-red-contrib-aedes
- npm i --unsafe-perm node-red-node-sqlite
- npm install node-red-contrib-web-worldmap

Nodes to configure:
- SET node of firebase
- - insert the secret file already present under /cs_simulator/secrets
- - insert the link of the realtimedatabase: https://iotprojectfirebase-c5a62-default-rtdb.firebaseio.com/
- sqlite node
- -set a local path of sqlite database for example ~/Desktop/test.sqlite


An example of cs simulator execution:
- node CS_simulator.js ./cs/cs_sqbf.json


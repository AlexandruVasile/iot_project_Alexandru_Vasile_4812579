// import libraries
const mqtt = require('mqtt');
const aux = require('./aux');

// constants
const MQTT_BROKER_URL = 'mqtt://localhost:1883';
const PORT = 1883;

// create a mqtt connection
var settings = {
    port: PORT
};
var mqtt_client = mqtt.connect(MQTT_BROKER_URL, settings);
aux.log("Be aware to insert the path of the cs like following: ./cs/cs_xyzz");

// import the json file about a CS
var path_to_json_file = process.argv[2];
if(!path_to_json_file){
    console.log("A json file about a CS should be passed:  node CS_simulator.js <json_file>");
    process.exit();
}
var input = require(path_to_json_file);


// connect to the topics about commands and answers in order to
// respectively receive commands and send answers                                          
const cs_id = input['id'];
const commands_topic ="/"+cs_id+"/commands";
const answers_topic = "/"+cs_id+"/answers";
aux.log("Waiting to connect to MQTT broker.., ensure that node-red is running");
mqtt_client.on('connect', () => {
    aux.log('Connected');
    mqtt_client.subscribe([commands_topic], () => {
        aux.log(`Subscribed to topic '${commands_topic}'`)
    })
});

// manage the received commands
mqtt_client.on('message', (commands_topic, payload) => {
    let received_payload = JSON.parse(payload); 
    let command = received_payload['command'];
    let evses = input['evses'];
    let evse_id = received_payload['evse'];
    aux.log("Received command "+received_payload.command+' from the commands topic '+commands_topic);
    
    // start command
    if (command === "start") {
        // check if the evse can be started
        if(!aux.isInMaintenance(evses, evse_id) && aux.isStartable(evses, evse_id)){
            // update the evse to busy and publish its state
            let evse = aux.updateEvseStatus(evses, evse_id, "busy"); 
            mqtt_client.publish(answers_topic, JSON.stringify({"type":"status", "evse_id": evse_id, "status": "occupied", "evse_code":evse['id_code']}));
            // start charging
            aux.charge(cs_id, evse, answers_topic, mqtt_client);
        }
        else{
            aux.log("Evse " + evse_id + " is already started or is in maintenance");
        }

    // stop command
    } else if (command === "stop") {
        if(!aux.isInMaintenance(evses, evse_id)){
            // free the evse and publish its state
            let evse = aux.updateEvseStatus(evses, evse_id, "free");
            mqtt_client.publish(answers_topic, JSON.stringify({"type":"status", "evse_id": evse_id, "status": "free", "evse_code":evse['id_code']}));
        }
    }
    // info command
    else if (command === "info") {
        // get the info about the cs and publish it
        let ans = {"type":"info", "payload":JSON.stringify(input)};
        mqtt_client.publish(answers_topic, JSON.stringify(ans));
        aux.log("Info about the cs has been published");
    }

    // count command
    else if (command === "count"){
        if(!aux.isInMaintenance(evses, evse_id)){
            let evse = aux.updateEvseStatus(evses, evse_id, "count"); 
            mqtt_client.publish(answers_topic, JSON.stringify({"type":"status", "evse_id": evse_id, "status": "count", "evse_code":evse['id_code']}));
            aux.count(evse, answers_topic, mqtt_client);
        }
    }
    
    // maintenance command
    else if (command === "maintenance"){
        let evse = aux.updateEvseStatus(evses, evse_id, "maintenance"); 
        mqtt_client.publish(answers_topic, JSON.stringify({"type":"status", "evse_id": evse_id, "status": "maintenance", "evse_code":evse['id_code']}));
    }

    // remove_maintenance
    else if (command === "remove_maintenance"){
        let evse = aux.updateEvseStatus(evses, evse_id, "free"); 
        mqtt_client.publish(answers_topic, JSON.stringify({"type":"status", "evse_id": evse_id, "status": "free", "evse_code":evse['id_code']}));
    }
});
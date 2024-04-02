// check if the evse can run the start command
function isStartable(evses, evse_id){
    for (let i = 0; i < evses.length; ++i) {
        let evse = evses[i];
        if(evse['id'] == evse_id)
            return (evse['status'] === "free" || evse['status'] === "count");
    }
    return false;
}

// update the status of a given evse
function updateEvseStatus(evses, evse_id, new_status) {
    for (let i = 0; i < evses.length; ++i) {
        if (evses[i].id == evse_id) {
            evses[i].status = new_status;
            log(`Evse ${evses[i].id_code} is in status ${new_status}`);
            return evses[i];
        }
    }
}

// get the starting percentage of the ev battery
function getInitialPercentage(){
    return 1;
}

function charge(cs_id, evse, topic, mqtt_client) {
    log(`Evse ${evse.id_code} executing charge`);
    let percentage = getInitialPercentage();
    let payload = {"type":"metric", "evse_id":evse['id'], "percentage": "-1", "energy": -1, "evse_code":evse["id_code"]};
    const intervalId = setInterval(function () {
        // stop charging if the charge is complete or the evse has become free or has shifted to maintenance
        if (percentage > 99 || evse['status']=="free" || evse['status']=="maintenance") {
            clearInterval(intervalId);
            // free the evse if the charge is over
            if(percentage > 99){
                evse['status'] = "free";
                mqtt_client.publish(topic, JSON.stringify({"type":"status", "evse_id": evse['id'], "status": "free", "evse_code":evse['id_code']}));
                log(`Evse ${evse.id_code} has been freed after a completed charge`)
            }
            // reset the metric values if the evse is free or in maintenance
            if(evse['status']=="free" || evse['status']=="maintenance")
                mqtt_client.publish(topic, JSON.stringify({"type":"metric", "evse_id":evse['id'], "percentage": "-1", "energy": -1, "evse_code":evse["id_code"], "cs_id":cs_id}));
        } 
        else {
            // update and publish the metrics
            payload['percentage'] = ++percentage;
            payload['energy'] = samplePower(10);
            mqtt_client.publish(topic, JSON.stringify(payload));
        }
    }, 200); 
};

// sample the power from the evse
function samplePower(right_extreme){
  const randomDecimal = Math.random();
  const randomNumber = Math.floor(randomDecimal * right_extreme) + 1;
  return randomNumber;
}

function getEvse(evses, evse_id) {
    for (let i = 0; i < evses.length; ++i) {
        if (evses[i].id == evse_id)
            return evses[i];
    }
    return null;
}

// function that counts the seconds available for the user to press the start command
function count(evse, topic, mqtt_client){
    log(`Evse ${evse.id_code} executing count`);
    let counter = 20;
    let payload = {"type":"counter", "evse_code":evse['id_code'], "counter": counter};
    const intervalId = setInterval(function () {
        // if the counting is over free the evse
        if (counter == -1) {
            clearInterval(intervalId); // stop the count
            evse['status'] = "free";
            let ans = {"type":"status", "evse_id": evse['id'], "status": "free", "evse_code":evse['id_code']};
            mqtt_client.publish(topic, JSON.stringify(ans));
            log(`Count on ${evse['id_code']} is over`);

        } 
        // stop the count if the evse has become busy or has shifted to maintenance
        else if(evse['status'] === "busy" || evse['status'] === "maintenance"){
            clearInterval(intervalId); 
            log(`Count on ${evse['id_code']} has been interrupted due to busy or maintenance state`);
        }
        else {
            payload['counter'] = --counter;
            mqtt_client.publish(topic, JSON.stringify(payload));
        }
    }, 1000); 
}

// check if the evse is in maintenance
function isInMaintenance(evses, evse_id){
    for (let i = 0; i < evses.length; ++i) {
        let evse = evses[i];
        if(evse['id'] == evse_id)
            return (evse['status'] === "maintenance");
    }
    return false;
}

// return the current date
function getDate() {
    // create a new Date object to get the current date and time
    var currentDate = new Date();

    // extract individual date and time components
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Months are zero-based
    var day = ('0' + currentDate.getDate()).slice(-2);
    var hours = ('0' + currentDate.getHours()).slice(-2);
    var minutes = ('0' + currentDate.getMinutes()).slice(-2);
    var seconds = ('0' + currentDate.getSeconds()).slice(-2);

    // create a timestamp string in the desired format (e.g., MM-DD HH:MM:SS.MMM)
    var timestamp = "["+month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds+"]";

    return timestamp;
}

function log(msg){
    console.log(getDate()+" "+msg);
}

  
// Exporting functions
module.exports = {
    isStartable,
    updateEvseStatus,
    charge,
    samplePower,
    getEvse,
    count,
    isInMaintenance,
    getDate,
    log
};



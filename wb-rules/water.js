var water_state = 0;
defineVirtualDevice("water_control", {
    title: "Защита от протечек",
    cells: {
        water_tap: {
            type: "switch",
            value: false
        },
        water_fail: {
            type: "switch",
            value: false
        },
        water_meter: {
            type: "value",
            value: 0
        },
        water_pump: {
            type: "switch",
            value: false
        },
    }
});

defineRule("water_tap_control", {
    whenChanged: "water_control/water_tap",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            if (!dev["water_control"]["water_fail"]) {
                water_state = 1;
            } else {
                dev["water_control"]["water_tap"] = 0;
                log("ОШИБКА! Кран не открыт. Сначала устраните протечку и выключите аварийный режим");
            }
        } else {
            water_state = 0;
        }
        dev["wb-gpio"]["EXT1_R3A5"] = water_state;
    	dev["button_light"]["button1"] = water_state;
    }
});

defineRule("water_fail_control", {
    whenChanged: "water_control/water_fail",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            dev["water_control"]["water_tap"] = 0;
            log("Включен аварийный режим. Устраните протечку!");
            dev["button_light"]["blink1"] = 1;
        } else {
            dev["button_light"]["blink1"] = 0;
            log("Аварийный режим выключен. Перед включением кранов убедитесь, что протечка устранена.");
        }
    }
});

defineRule("water_meter_control", {
    whenChanged: "wb-gpio/EXT1_R3A5",
    then: function(newValue, devName, cellName) {
        dev["wb-gpio"]["EXT1_R3A6"] = newValue;
    }
});

defineRule("water_meter_count", {
    whenChanged: "wb-gpio/EXT2_DR8",
    then: function(newValue, devName, cellName) {
      if(newValue){
      var count_now = parseFloat(dev["water_control"]["water_meter"]);
      count_now = parseFloat(count_now) + parseFloat(0.01);
      dev["water_control"]["water_meter"] = parseFloat(count_now).toFixed(2);
      }
    }
});

defineRule("water_pump_control", {
    whenChanged: "water_control/water_pump",
    then: function(newValue, devName, cellName) {
        dev["button_light"]["button2"] = newValue;
    }
});

defineRule("water_pump_handle_control", {
    whenChanged: "wb-gpio/EXT2_DR2",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            if (dev["water_control"]["water_pump"] && dev["wb-gpio"]["EXT2_DR5"]) {
                log("Вы не можете отключить насос, пока не устранена затопленность помещения");
            } else {
                dev["water_control"]["water_pump"] = !dev["water_control"]["water_pump"];
              
            }
        }
    }
});

defineRule("water_fail_detected", {
    whenChanged: "wb-gpio/EXT2_DR5",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            dev["water_control"]["water_pump"] = 1;
            dev["water_control"]["water_fail"] = 1;
        } else {
            dev["water_control"]["water_pump"] = 0;
        }
    }
});

defineRule("water_fail_reset", {
    whenChanged: "wb-gpio/EXT2_DR1",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            if (dev["water_control"]["water_fail"]) {
                dev["water_control"]["water_fail"] = 0;
            } else {
              dev["water_control"]["water_tap"] = !dev["water_control"]["water_tap"];
            }
        }
    }
});
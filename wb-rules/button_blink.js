var light1_state = 0;
var light2_state = 0;
var light3_state = 0;
var light4_state = 0;
var blink_state = 0;

defineVirtualDevice("button_light", {
    title: "button light control",
    cells: {
        button1: {
            type: "switch",
            value: false
        },
        button2: {
            type: "switch",
            value: false
        },
        button3: {
            type: "switch",
            value: false
        },
        button4: {
            type: "switch",
            value: false
        },
        blink1: {
            type: "switch",
            value: false
        },
        blink2: {
            type: "switch",
            value: false
        },
        blink3: {
            type: "switch",
            value: false
        },
        blink4: {
            type: "switch",
            value: false
        }
    }
});

defineRule("light1_state_rule", {
    whenChanged: "button_light/button1",
    then: function(newValue, devName, cellName) {
        light1_state = newValue;
        if (!dev["button_light"]["blink1"]) {
            dev["wb-gpio"]["EXT1_R3A1"] = light1_state;
        }
    }
});

defineRule("light2_state_rule", {
    whenChanged: "button_light/button2",
    then: function(newValue, devName, cellName) {
        light2_state = newValue;
        if (!dev["button_light"]["blink2"]) {
            dev["wb-gpio"]["EXT1_R3A2"] = light2_state;
        }
    }
});

defineRule("light3_state_rule", {
    whenChanged: "button_light/button3",
    then: function(newValue, devName, cellName) {
        light3_state = newValue;
        if (!dev["button_light"]["blink3"]) {
            dev["wb-gpio"]["EXT1_R3A3"] = light3_state;
        }
    }
});

defineRule("light4_state_rule", {
    whenChanged: "button_light/button4",
    then: function(newValue, devName, cellName) {
        light4_state = newValue;
        if (!dev["button_light"]["blink4"]) {
            dev["wb-gpio"]["EXT1_R3A4"] = light4_state;
        }
    }
});

defineRule("cron_timer", {
    when: cron("@every 0h0m1s"),
    then: function() {
        blink_state = !blink_state;
        if (dev["button_light"]["blink1"]) {
            dev["wb-gpio"]["EXT1_R3A1"] = blink_state;
        } else {
            dev["wb-gpio"]["EXT1_R3A1"] = light1_state;
        }
        if (dev["button_light"]["blink2"]) {
            dev["wb-gpio"]["EXT1_R3A2"] = blink_state;
        } else {
            dev["wb-gpio"]["EXT1_R3A2"] = light2_state;
        }
        if (dev["button_light"]["blink3"]) {
            dev["wb-gpio"]["EXT1_R3A3"] = blink_state;
        } else {
            dev["wb-gpio"]["EXT1_R3A3"] = light3_state;
        }
        if (dev["button_light"]["blink4"]) {
            dev["wb-gpio"]["EXT1_R3A4"] = blink_state;
        } else {
            dev["wb-gpio"]["EXT1_R3A4"] = light4_state;
        }
    }
});
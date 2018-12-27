defineVirtualDevice("load_control", {
    title: "Управление нагрузками",
    cells: {
        ventilation_handle: {
            type: "switch",
            value: false
        },
        ventilation_auto: {
            type: "switch",
            value: false
        },
        high_load: {
            type: "switch",
            value: false
        },
        load_fail: {
            type: "switch",
            value: false
        },
    }
});

defineRule("ventilation_rule", {
    whenChanged: "load_control/ventilation_handle",
    then: function(newValue, devName, cellName) {
    	map_vent_fail_count = 0;
        dev["wb-mr6c_68"]["K4"] = newValue;
        dev["button_light"]["button4"] = newValue;
    }
});

defineRule("high_load_rule", {
    whenChanged: "load_control/high_load",
    then: function(newValue, devName, cellName) {
        dev["wb-mr6c_68"]["K3"] = newValue;
        dev["button_light"]["button3"] = newValue;
    }
});

defineRule("high_load_control", {
    whenChanged: "wb-gpio/EXT2_DR3",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            dev["load_control"]["high_load"] = !dev["load_control"]["high_load"];
        }
    }
});

defineRule("ventilation_control", {
    whenChanged: "wb-gpio/EXT2_DR4",
    then: function(newValue, devName, cellName) {
        if (newValue) {
          dev["load_control"]["ventilation_handle"] = !dev["load_control"]["ventilation_handle"];
          dev["load_control"]["ventilation_auto"] = 0;
        }
    }
});

defineRule("high_load_fail", {
    whenChanged: "wb-mr3_56/Input 2",
    then: function(newValue, devName, cellName) {
        if (dev["load_control"]["load_fail"]) {
            if (newValue) {
                dev["button_light"]["blink3"] = 0;
                log("Напряжение на втором автомате восстановленно.");
            } else {
                log("Пропало напряжение на втором автомате");
                dev["button_light"]["blink3"] = 1;
            }
        }
    }
});

defineRule("ventilation_fail", {
    whenChanged: "wb-mr3_56/Input 3",
    then: function(newValue, devName, cellName) {
        if (dev["load_control"]["load_fail"]) {
            if (newValue) {
                dev["button_light"]["blink4"] = 0;
                log("Напряжение на третьем автомате восстановленно.");
            } else {
                log("Пропало напряжение на третьем автомате");
                dev["button_light"]["blink4"] = 1;
            }
        }
    }
});
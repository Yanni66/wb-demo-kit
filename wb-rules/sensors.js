var map_vent_fail_count = 0;
defineRule("map_load_rule", {
    whenChanged: "wb-map3h_23/P L2",
    then: function(newValue, devName, cellName) {
        dev["wb-mr3_56"]["K2"] = newValue > 0.5;
    }
});

defineRule("map_vent_rule", {
    whenChanged: "wb-map3h_23/P L3",
    then: function(newValue, devName, cellName) {
        dev["wb-mr3_56"]["K3"] = newValue >= 1;
        if (newValue > 15.5) {
            map_vent_fail_count++
            log(map_vent_fail_count);
            if (map_vent_fail_count >= 3) {
                log("P = " + newValue + "W (нормальная нагрузка до 14W)");
                if (dev["load_control"]["ventilation_auto"]) {
                    dev["load_control"]["ventilation_auto"] = 0;
                }
                dev["load_control"]["ventilation_handle"] = 0;
                map_vent_fail_count = 0;
                log("Забилась вентиляция. Обратитесь к инженеру");
            }
        }
    }
});

defineRule("map_main_rule", {
    whenChanged: "wb-map3h_23/P L1",
    then: function(newValue, devName, cellName) {
      dev["wb-mr3_56"]["K1"] = newValue > 30;       
    }
});

defineRule("main_fuse_fail", {
    whenChanged: "wb-mr3_56/Input 1",
    then: function(newValue, devName, cellName) {       
       if (!newValue) {
          runShellCommand("python /fail.py");
          dev["load_control"]["load_fail"] = 0
          dev["button_light"]["blink3"] = 0;
          dev["button_light"]["blink4"] = 0;
        }else{
          dev["load_control"]["load_fail"] = 1;
        }    
    }
});

defineRule("msw3_co2", {
    whenChanged: "wb-msw-v3_21/CO2",
    then: function(newValue, devName, cellName) {
        var co2_good = newValue < 900;
        dev["wb-msw-v3_21/Green LED"] = co2_good;
        dev["wb-msw-v3_21/Red LED"] = !co2_good;
        dev["wb-msw-v3_21/LED Glow Duration (ms)"] = 50;
        dev["wb-msw-v3_21/LED Period (s)"] = 1;
    }
});

defineRule("msw3_voc", {
    whenChanged: "wb-msw-v3_21/Air Quality (VOC)",
    then: function(newValue, devName, cellName) {
        if (dev["load_control"]["ventilation_auto"]) {
            dev["load_control"]["ventilation_handle"] = newValue > 10;
        }
    }
});
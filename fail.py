import os
import time
from wb_common import leds, beeper
#leds.set_brightness('green', 0)
leds.set_brightness('red', 0)
leds.blink_fast('red')
beep = beeper.Beeper(0)
beep.setup()
beep.beep(0.07, 10)
time.sleep(2)
leds.set_brightness('red', 0)
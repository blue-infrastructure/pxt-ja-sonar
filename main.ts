enum PingUnit {
    //% block="μs"
    MicroSeconds,
    //% block="センチ"
    Centimeters,
    //% block="インチ"
    Inches
}

/**
 * Sonar and ping utilities
 */
//% color="#b0c4de" weight=10
namespace sonar {
    /**
     * Send a ping and get the echo time (in microseconds) as a result
     * @param trig tigger pin
     * @param echo echo pin
     * @param unit desired conversion unit
     * @param maxCmDistance maximum distance in centimeters (default is 500)
     */
    //% blockId=sonar_ping block="距離を測定する|trig %trig|echo %echo|unit %unit"
    export function ping(trig: DigitalPin, echo: DigitalPin, unit: PingUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(20);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

        let ricm = 0;
        let bcm = 0;

        switch (unit) {
            case PingUnit.Centimeters:
                ricm = d * 153 / 29 / 2 / 100;
                if (ricm > 0) bcm = ricm;
                else ricm = bcm;
                basic.pause(50);
                return ricm;
            case PingUnit.Inches: return Math.idiv(d, 148);
            default: return d;
        }
    }
} 
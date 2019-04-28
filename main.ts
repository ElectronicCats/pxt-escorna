/*
 * pxt-escornabot - Escornabot Makech library for MakeCode - Version 0.0.1
 *
 * Based in the work of https://github.com/chevyng/pxt-ucl-junkrobot
 * 
 * Ported to Maker Makecode      0.0.1   by Andres Sabas @ Electronic Cats
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 */

//% weight=2 color=#005585 icon="\uf188"
//% blockGap=8
//% groups='["Positional", "Ultrasonic", "Configuration"]'
enum PingUnit {
    //% block="cm"
    Centimeters,
    //% block="μs"
    MicroSeconds
}

enum DistUnit {
    //% block="steps"
    Steps,
    //% block="cm"
    Centimeters
}

/**
 * Escornabot prototype code using 28BYJ-48 stepper motors
 */
//% weight=100
namespace escornabot {

    export class Motor {

        private input1: DigitalInOutPin;
        private input2: DigitalInOutPin;
        private input3: DigitalInOutPin;
        private input4: DigitalInOutPin;
        private calibration: number;
        private state: number;

        setPins(in1: DigitalInOutPin, in2: DigitalInOutPin, in3: DigitalInOutPin, in4: DigitalInOutPin): void {
            // send pulse
            this.input1 = in1;
            this.input2 = in2;
            this.input3 = in3;
            this.input4 = in4;
        }

        //% blockId=set_motor_calibration block="%motor|set turning calibration value %calibration" blockGap=8
        //% advanced=true
        setCalibration(calibration: number): void {
            this.calibration = calibration;
        }

        getCalibration(): number {
            return this.calibration;
        }

        setState(stateNum: number): void {
            this.state = stateNum;
        }

        steps(direction: number): void {
            if (this.state == 0) {
                this.input1.digitalWrite(false);
                this.input2.digitalWrite(false);
                this.input3.digitalWrite(false);
                this.input3.digitalWrite(true);
            } else if (this.state == 1) {
                this.input1.digitalWrite(false);
                this.input2.digitalWrite(false);
                this.input3.digitalWrite(true);
                this.input3.digitalWrite(true);
            } else if (this.state == 2) {
                this.input1.digitalWrite(false);
                this.input2.digitalWrite(false);
                this.input3.digitalWrite(true);
                this.input3.digitalWrite(false);
            } else if (this.state == 3) {
                this.input1.digitalWrite(false);
                this.input2.digitalWrite(true);
                this.input3.digitalWrite(true);
                this.input3.digitalWrite(false);
            } else if (this.state == 4) {
                this.input1.digitalWrite(false);
                this.input2.digitalWrite(true);
                this.input3.digitalWrite(false);
                this.input3.digitalWrite(false);
            } else if (this.state == 5) {
                this.input1.digitalWrite(true);
                this.input2.digitalWrite(true);
                this.input3.digitalWrite(false);
                this.input3.digitalWrite(false);
            } else if (this.state == 6) {
                this.input1.digitalWrite(true);
                this.input2.digitalWrite(false);
                this.input3.digitalWrite(false);
                this.input3.digitalWrite(false);
            } else if (this.state == 7) {
                this.input1.digitalWrite(true);
                this.input2.digitalWrite(false);
                this.input3.digitalWrite(false);
                this.input3.digitalWrite(true);
            }

            this.state = this.state + direction;
            if (this.state < 0) {
                this.state = 7;
            } else if (this.state > 7) {
                this.state = 0;
            }
        }

    }

    export class Robot {
        private motorL: Motor;
        private motorR: Motor;

        setMotors(motorL: Motor, motorR: Motor): void {
            this.motorL = motorL;
            this.motorR = motorR;
        }

        //% blockId=move_forward block="%this|move %steps|%unit| forward"
        //% weight=81
        //% group="Positional"
        moveForward(steps: number, unit: DistUnit): void {
            switch (unit) {
                case DistUnit.Centimeters: steps = steps * 273; //273 steps = 1cm
                case DistUnit.Steps: steps = steps;
            }

            for (let i = 0; i < steps; i++) {
                this.motorL.steps(-1);
                this.motorR.steps(1);
                basic.pause(1);
            }
        }

        //% blockId=move_backward block="%this|move %steps|%unit| backward"
        //% weight=80
        //% group="Positional"
        moveBackward(steps: number, unit: DistUnit): void {
            switch (unit) {
                case DistUnit.Centimeters: steps = steps * 273; //273 steps = 1cm
                case DistUnit.Steps: steps = steps;
            }

            for (let i = 0; i < steps; i++) {
                this.motorL.steps(1);
                this.motorR.steps(-1);
                basic.pause(1);
            }
        }

        //% blockId=turn_left block="%this| turnLeft()"
        //% weight=71
        //% group="Positional"
        turnLeft(): void {
            for (let i = 0; i < 90 * (this.motorL.getCalibration()); i++) {
                this.motorL.steps(1);
                this.motorR.steps(1);
                basic.pause(1);
            }
        }

        //% blockId=turn_right block="%this| turnRight()"
        //% weight=70
        //% group="Positional"
        turnRight(): void {
            for (let i = 0; i < 90 * (this.motorL.getCalibration()); i++) {
                this.motorL.steps(-1);
                this.motorR.steps(-1);
                basic.pause(1);
            }
        }

        //% blockId=turn_right_error block="%this| turnRight()| with %error| steps calibration"
        //% advanced=true
        //% group="Positional"
        turnRight_steps(error: number): void {
            for (let i = 0; i < ((90 * this.motorL.getCalibration()) - error); i++) {
                this.motorL.steps(-1);
                this.motorR.steps(-1);
                basic.pause(1);
            }
        }

        //% blockId=turn_left_error block="%this| turnLeft()|with %error| steps calibration"
        //% advanced=true
        //% group="Positional"
        turnLeft_steps(error: number): void {
            for (let i = 0; i < ((90 * this.motorL.getCalibration()) - error); i++) {
                this.motorL.steps(1);
                this.motorR.steps(1);
                basic.pause(1);
            }
        }


        //% blockId=turn_n_degrees block="%robot|turn %angle|degrees"
        //% advanced=true
        //% group="Positional"
        turn(angle: number): void {
            let direction: number;
            //  var ticks: number = 34.249;
            console.log("Turning : " + angle);
            if (angle > 0) {
                direction = -1;
            }
            else if (angle < 0) {
                direction = 1;
                angle = (0 - angle);
            }
            else if (angle == 0) {
                direction = 0;
            }

            // console.log("new nTicks value: " + angle);
            if (direction != 0) {
                //var nTicks: number;
                //nTicks = angle * ticks;
                //console.log("nTicks value: " + nTicks);
                for (let i = 0; i < (angle * this.motorL.getCalibration()); i++) {
                    this.motorL.steps(direction);
                    this.motorR.steps(direction);
                    basic.pause(1);
                }
            }
        }

    }

    //% blockId=create_moto block="set pin1 %input1|set pin2 %input2|set pin3 %input3|set pin4 %input4"
    //% weight=99
    //% group="Configuration"
    export function createMotor(input1: DigitalInOutPin, input2: DigitalInOutPin, input3: DigitalInOutPin, input4: DigitalInOutPin)
        : Motor {
        let motor = new Motor();
        motor.setPins(input1, input2, input3, input4);
        motor.setCalibration(32); //standard calibration set to 32
        motor.setState(1);
        return motor;
    }

    //% blockId=create_robot block="set left motor %motor1|set right motor %motorR"
    //% weight=100
    //% group="Configuration"
    export function createEscornabot(motorL: Motor, motorR: Motor): Robot {
        let robot = new Robot();
        robot.setMotors(motorL, motorR);
        return robot;
    }



    //% blockId=ultrasonic_sensor block="sensor trig %trig|echo %echo|unit %unit"
    //% weight=95
    //% group="Ultrasonic"
    export function sensor(trig: DigitalInOutPin, echo: DigitalInOutPin, unit: PingUnit, maxCmDistance = 500): number {
        // send pulse
        trig.setPull(PinPullMode.PullNone);
        trig.digitalWrite(false);
        control.waitMicros(2);
        trig.digitalWrite(true);
        control.waitMicros(10);
        trig.digitalWrite(false);

        // read pulse
        let d = echo.pulseIn(PulseValue.High, maxCmDistance * 42);
        console.log("Distance: " + d / 42);

        switch (unit) {
            case PingUnit.Centimeters: return d / 42;
            default: return d;
        }
    }
}

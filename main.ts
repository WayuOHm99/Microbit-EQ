/**
 * Microbit-EQ: PTKidsBIT VX field mission.
 *
 * Button A: calibrate every line sensor. Put all sensors on black and press A;
 *           when the sound finishes, put all sensors on white and press A again.
 * Button B: run the yellow mission. Start at the cross below the centre line,
 *           with the front of the robot facing upward.
 *
 * This TypeScript is deliberately written with variables and functions that
 * MakeCode converts to editable Blocks.
 */

// ===== Values to tune on the real field =====
let lineMinSpeed = 40
let lineMaxSpeed = 70
let lineKp = 0.018
let lineKd = 0
let lineBreakTimeMs = 20

let turnSpeed = 50
let turn90FastTimeMs = 150
let turn180FastTimeMs = 300
let turnBreakTimeMs = 20
let settleTimeMs = 150

// The VX training document uses sensor 4 for both turns. Change only after a
// real-field test if the robot does not stop squarely on the line.
let turnDetectSensor = 4

// Small final movements after the last intersection. Adjust these for the
// actual position of the can and the drop-off cross; zero disables the move.
let pickupApproachMs = 0
let dropoffApproachMs = 0
let pickupApproachSpeed = 30

// PTKidsBIT VX servo sockets, confirmed by the supplied training document.
// Each robot may still need small degree adjustments.
let armServo = Servo_Write.S0
let gripperServo = Servo_Write.S1
let armUpDegree = 0
let armDownDegree = 90
let gripperOpenDegree = 175
let gripperCloseDegree = 135
let servoWaitMs = 300

// ===== VX line sensor setup =====
// Four front sensors, then the left and right wheel sensors.
let centerSensors = [1, 0, 7, 6]
let leftWheelSensors = [2]
let rightWheelSensors = [5]
let allLineSensors = [1, 0, 7, 6, 2, 5]

// ===== Editable route for the supplied field JPG =====
// These numbers count line intersections, not distance.
// Default route: START -> yellow pickup -> yellow drop-off.
let startToTopCenterCrosses = 4
let topCenterToYellowCrosses = 3
let yellowToTopCenterCrosses = 4
let topCenterToBottomCenterCrosses = 3
let bottomCenterToYellowGoalCrosses = 3

let isCalibrated = false
let isMissionRunning = false

function prepareLineSensors() {
    PTKidsBITVX.LINESensorSET(
        centerSensors,
        leftWheelSensors,
        rightWheelSensors,
        LED_Pin.Disable
    )
}

function pauseAfterMovement() {
    PTKidsBITVX.motorStop()
    basic.pause(settleTimeMs)
}

function setReadyArm() {
    PTKidsBITVX.servoWrite(armServo, armUpDegree)
    basic.pause(servoWaitMs)
    PTKidsBITVX.servoWrite(gripperServo, gripperOpenDegree)
    basic.pause(servoWaitMs)
}

function followCenterCrosses(crosses: number) {
    if (crosses <= 0) {
        return
    }
    PTKidsBITVX.ForwardLINECount(
        Forward_Direction.Forward,
        Find_Line.Center,
        crosses,
        lineMinSpeed,
        lineMaxSpeed,
        lineBreakTimeMs,
        lineKp,
        lineKd
    )
    pauseAfterMovement()
}

function followForApproach(timeMs: number) {
    if (timeMs <= 0) {
        return
    }
    PTKidsBITVX.ForwardTIME(
        Forward_Direction.Forward,
        timeMs,
        pickupApproachSpeed,
        lineMaxSpeed,
        lineKp,
        lineKd
    )
    pauseAfterMovement()
}

function turnLeft90() {
    PTKidsBITVX.TurnLINE(
        Turn_Line.Left,
        turnSpeed,
        turnDetectSensor,
        turn90FastTimeMs,
        turnBreakTimeMs
    )
    pauseAfterMovement()
}

function turnRight90() {
    PTKidsBITVX.TurnLINE(
        Turn_Line.Right,
        turnSpeed,
        turnDetectSensor,
        turn90FastTimeMs,
        turnBreakTimeMs
    )
    pauseAfterMovement()
}

function turnLeft180() {
    PTKidsBITVX.TurnLINE(
        Turn_Line.Left,
        turnSpeed,
        turnDetectSensor,
        turn180FastTimeMs,
        turnBreakTimeMs
    )
    pauseAfterMovement()
}

function pickUpCan() {
    PTKidsBITVX.servoWrite(armServo, armDownDegree)
    basic.pause(servoWaitMs)
    PTKidsBITVX.servoWrite(gripperServo, gripperCloseDegree)
    basic.pause(servoWaitMs)
    PTKidsBITVX.servoWrite(armServo, armUpDegree)
    basic.pause(servoWaitMs)
}

function dropOffCan() {
    PTKidsBITVX.servoWrite(armServo, armDownDegree)
    basic.pause(servoWaitMs)
    PTKidsBITVX.servoWrite(gripperServo, gripperOpenDegree)
    basic.pause(servoWaitMs)
    PTKidsBITVX.servoWrite(armServo, armUpDegree)
    basic.pause(servoWaitMs)
}

function runYellowMission() {
    // START is below the centre vertical line and the robot faces upward.
    followCenterCrosses(startToTopCenterCrosses)
    turnLeft90()
    followCenterCrosses(topCenterToYellowCrosses)
    followForApproach(pickupApproachMs)
    pickUpCan()

    turnLeft180()
    followCenterCrosses(yellowToTopCenterCrosses)
    turnRight90()
    followCenterCrosses(topCenterToBottomCenterCrosses)
    turnLeft90()
    followCenterCrosses(bottomCenterToYellowGoalCrosses)
    followForApproach(dropoffApproachMs)
    dropOffCan()
}

input.onButtonPressed(Button.A, function () {
    // The VX extension retains old calibration readings. Restart the micro:bit
    // before calibrating again, rather than running this block twice.
    if (isCalibrated || isMissionRunning) {
        basic.showString("RST")
        return
    }
    basic.showString("BLK")
    PTKidsBITVX.SensorCalibrate(allLineSensors)
    isCalibrated = true
    setReadyArm()
    basic.showIcon(IconNames.Yes)
})

input.onButtonPressed(Button.B, function () {
    if (!isCalibrated || isMissionRunning) {
        basic.showIcon(IconNames.No)
        return
    }
    isMissionRunning = true
    basic.showString("Y")
    runYellowMission()
    PTKidsBITVX.motorStop()
    isMissionRunning = false
    basic.showIcon(IconNames.Yes)
})

prepareLineSensors()
basic.showIcon(IconNames.SmallDiamond)

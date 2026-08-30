/**
 * Microbit-EQ: editable PTKidsBIT field mission.
 *
 * Button A: calibrate sensors. Put the front six sensors on black, press A;
 *           then put all six sensors on white and press A again.
 * Button B: run the selected mission. The robot must be at START, facing up.
 *
 * This first route follows the supplied field image:
 * START -> yellow pickup (upper-left) -> yellow drop-off (lower-right).
 */

// ===== Values to tune on the real field =====
let lineMinSpeed = 40
let lineMaxSpeed = 70
let lineKp = 0.018
let lineKd = 0

let turnSpeed = 50
let turn90FastTimeMs = 150
let turn180FastTimeMs = 300
let settleTimeMs = 150

// Small final movements after the last intersection. Adjust these for the
// actual position of the can and the drop-off cross; zero disables the move.
let pickupApproachMs = 0
let dropoffApproachMs = 0
let pickupApproachSpeed = 30

// Arm P8 and gripper P12. Adjust only after testing the physical robot.
let armUpDegree = 5
let armDownDegree = 90
let gripperOpenDegree = 175
let gripperCloseDegree = 135
let servoWaitMs = 300

// ===== Editable route for the supplied JPG field =====
// These numbers count line intersections, not distance.
// The default route is: START -> yellow -> yellow goal.
let startToTopCenterCrosses = 4
let topCenterToYellowCrosses = 3
let yellowToTopCenterCrosses = 4
let topCenterToBottomCenterCrosses = 3
let bottomCenterToYellowGoalCrosses = 3

let isCalibrated = false
let isMissionRunning = false

function pauseAfterMovement() {
    PTKidsBITRobot.motorStop()
    basic.pause(settleTimeMs)
}

function setReadyArm() {
    PTKidsBITRobot.servoWrite(Servo_Write.P8, armUpDegree)
    basic.pause(servoWaitMs)
    PTKidsBITRobot.servoWrite(Servo_Write.P12, gripperOpenDegree)
    basic.pause(servoWaitMs)
}

function followCenterCrosses(crosses: number) {
    if (crosses <= 0) {
        return
    }
    PTKidsBITRobot.ForwardLINECount(
        Find_Line.Center,
        crosses,
        lineMinSpeed,
        lineMaxSpeed,
        lineKp,
        lineKd
    )
    pauseAfterMovement()
}

function followForApproach(timeMs: number) {
    if (timeMs <= 0) {
        return
    }
    PTKidsBITRobot.ForwardTIME(
        timeMs,
        pickupApproachSpeed,
        lineMaxSpeed,
        lineKp,
        lineKd
    )
    pauseAfterMovement()
}

// The left and right turn sensors match the actual extension and the robot's
// six front line sensors: ADC1 is left of centre and ADC4 is right of centre.
function turnLeft90() {
    PTKidsBITRobot.TurnLINE(
        Turn_Line.Left,
        turnSpeed,
        Turn_ADC.ADC1,
        turn90FastTimeMs
    )
    pauseAfterMovement()
}

function turnRight90() {
    PTKidsBITRobot.TurnLINE(
        Turn_Line.Right,
        turnSpeed,
        Turn_ADC.ADC4,
        turn90FastTimeMs
    )
    pauseAfterMovement()
}

function turnLeft180() {
    PTKidsBITRobot.TurnLINE(
        Turn_Line.Left,
        turnSpeed,
        Turn_ADC.ADC1,
        turn180FastTimeMs
    )
    pauseAfterMovement()
}

function pickUpCan() {
    PTKidsBITRobot.servoWrite(Servo_Write.P8, armDownDegree)
    basic.pause(servoWaitMs)
    PTKidsBITRobot.servoWrite(Servo_Write.P12, gripperCloseDegree)
    basic.pause(servoWaitMs)
    PTKidsBITRobot.servoWrite(Servo_Write.P8, armUpDegree)
    basic.pause(servoWaitMs)
}

function dropOffCan() {
    PTKidsBITRobot.servoWrite(Servo_Write.P8, armDownDegree)
    basic.pause(servoWaitMs)
    PTKidsBITRobot.servoWrite(Servo_Write.P12, gripperOpenDegree)
    basic.pause(servoWaitMs)
    PTKidsBITRobot.servoWrite(Servo_Write.P8, armUpDegree)
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
    if (isMissionRunning) {
        return
    }
    isCalibrated = false
    basic.showString("BLACK")
    // The extension waits for the first A press on black, then a second A
    // press on white. It beeps after each captured reference.
    PTKidsBITRobot.SensorCalibrate()
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
    PTKidsBITRobot.motorStop()
    isMissionRunning = false
    basic.showIcon(IconNames.Yes)
})

setReadyArm()
basic.showIcon(IconNames.SmallDiamond)

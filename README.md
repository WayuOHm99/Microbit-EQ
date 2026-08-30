# Microbit-EQ field mission

This is a MakeCode project for the PTKidsBIT Education Robot and the field in
`Road map-EQ-Build bot plus v1.jpg`.

It supplies one editable first mission:

1. Start at the lower centre START cross, facing upward.
2. Follow the line to the upper-left yellow pickup point.
3. Pick up the yellow can.
4. Follow the line to the lower-right yellow drop-off cross.
5. Release the can.

## Use

1. Import this repository into [MakeCode for micro:bit](https://makecode.microbit.org/).
2. Connect or download to the micro:bit.
3. Place the six front line sensors on black. Press **A** once when the code
   shows `BLACK`.
4. Move all six front sensors to white. Press **A** once again. A tick means
   calibration is complete.
5. Place the robot at START, facing upward, and press **B**.

## Tune safely

All values intended for field tuning are grouped at the top of `main.ts`.

- Start with the wheels raised while testing a new turn.
- Tune the arm and gripper before placing a can on the field.
- Tune line speed and PD values on a simple straight line first.
- Change only one value at a time, then write down the result.

The route uses intersection counts. The two `ApproachMs` values are deliberately
zero until the physical can and target positions have been measured.

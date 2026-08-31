# Microbit-EQ field mission (PTKidsBIT VX)

This is an editable MakeCode project for the PTKidsBIT VX robot and the field
in `Road map-EQ-Build bot plus v1.jpg`.

It supplies one first mission:

1. Start at the lower-centre START cross, facing upward.
2. Follow the line to the upper-left yellow pickup point.
3. Pick up the yellow can.
4. Follow the line to the lower-right yellow drop-off cross.
5. Release the can.

## Open it as Blocks in MakeCode

1. Sign in to GitHub in [MakeCode for micro:bit](https://makecode.microbit.org/).
2. Import `WayuOHm99/Microbit-EQ` from GitHub. If MakeCode asks for GitHub
   access, allow it to read this existing repository.
3. The project downloads `pxt-kidsbit-vx` automatically from `pxt.json`.
4. Select the **Blocks** tab. `main.ts` was written using MakeCode variables
   and functions, so it converts to editable Blocks.

## Run it later on the robot

1. Do not press **B** until the robot is at START and faces upward.
2. Press **A** with all six line sensors on black. Wait for the sound to end.
3. Put all six sensors on white and press **A** again. The arm raises and the
   gripper opens when calibration finishes.
4. Press **B** to run the yellow mission.
5. To calibrate again, press the micro:bit reset button first. The VX
   extension retains the previous calibration values while it stays powered.

## Tune safely

All values intended for field tuning are grouped at the top of `main.ts`.

- `turnDetectSensor`, speed, time, and line settings need real-field testing.
- The supplied training material identifies arm lift as servo `S0` and gripper
  as `S1`; their degree values may still differ slightly between robots.
- Start with the wheels raised while testing a new turn.
- Change one value at a time and write down the result.

The route uses intersection counts. The two `ApproachMs` values stay at zero
until the physical can and target positions have been measured.

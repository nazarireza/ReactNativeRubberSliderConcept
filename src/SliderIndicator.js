import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  add,
  cond,
  eq,
  min,
  max,
  useCode,
  block,
  set,
  clockRunning,
  Easing,
  interpolate,
  color,
} from 'react-native-reanimated';
import {
  useValues,
  onGestureEvent,
  timing,
  useClocks,
} from 'react-native-redash';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

import {
  CANVAS_HEIGHT,
  INDICATOR_SIZE,
  LINE_STROKE_MAX_WIDTH,
} from './Constants.js';

const Y = CANVAS_HEIGHT / 2 - INDICATOR_SIZE / 2;
const NORMAL_COLOR = color(255, 255, 255, 1);
const PRIMARY_COLOR = color(207, 217, 237, 1);

export default ({initialX, minX, maxX, x, y, state}) => {
  const [lastX, translationX, translationY, yT, backgroundColor] = useValues(
    [initialX, 0, 0, 0, 0],
    [],
  );
  const [springClock] = useClocks(2, []);

  useCode(
    () =>
      block([
        cond(eq(backgroundColor, 0), set(backgroundColor, NORMAL_COLOR)),
        cond(
          eq(state, State.ACTIVE),
          [
            set(x, max(minX, min(add(lastX, translationX), maxX))),
            set(
              y,
              max(
                0,
                min(
                  add(Y, translationY),
                  CANVAS_HEIGHT - (INDICATOR_SIZE + LINE_STROKE_MAX_WIDTH) / 2,
                ),
              ),
            ),
            set(yT, y),
          ],
          cond(
            eq(state, State.END),
            [
              set(
                y,
                timing({
                  clock: springClock,
                  from: yT,
                  to: Y,
                  duration: 450,
                  easing: Easing.in(Easing.elastic(2)),
                }),
              ),
              cond(
                eq(clockRunning(springClock), 0),
                set(state, State.UNDETERMINED),
              ),
              set(backgroundColor, NORMAL_COLOR),
            ],
            [
              set(lastX, x),
              cond(eq(state, State.BEGAN), set(backgroundColor, PRIMARY_COLOR)),
            ],
          ),
        ),
      ]),
    [maxX],
  );

  return (
    <PanGestureHandler
      {...onGestureEvent({
        translationX,
        translationY,
        state,
      })}>
      <Animated.View
        style={[
          styles.indicator,
          {
            transform: [{translateX: x}, {translateY: y}],
            backgroundColor,
          },
        ]}
      />
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  indicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderWidth: 2,
    borderRadius: INDICATOR_SIZE / 2,
    borderColor: '#495fde',
    ...StyleSheet.absoluteFillObject,
  },
});

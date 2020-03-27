import React from 'react';
import Animated, {
  concat,
  add,
  divide,
  sub,
  eq,
  cond,
} from 'react-native-reanimated';
import {Path} from 'react-native-svg';
const AnimatedPath = Animated.createAnimatedComponent(Path);
import {CANVAS_ZOOM_RATE, INDICATOR_SIZE} from './Constants';

export default ({startX, startY, endX, endY, color, width}) => {
  const canvasStartX = add(
    divide(startX, CANVAS_ZOOM_RATE),
    cond(eq(startX, 0), 0, INDICATOR_SIZE),
  );
  const canvasStartY = add(divide(startY, CANVAS_ZOOM_RATE), INDICATOR_SIZE);
  const canvasEndX = add(divide(endX, CANVAS_ZOOM_RATE), INDICATOR_SIZE);
  const canvasEndY = add(divide(endY, CANVAS_ZOOM_RATE), INDICATOR_SIZE);

  const firstControlX = add(
    canvasStartX,
    divide(sub(canvasEndX, canvasStartX), 2),
  );
  const secondControlX = sub(
    canvasEndX,
    divide(sub(canvasEndX, canvasStartX), 2),
  );

  const d = concat(
    'M ',
    canvasStartX,
    ' ',
    canvasStartY,
    ' C ',
    firstControlX,
    ' ',
    canvasStartY,
    ' ',
    secondControlX,
    ' ',
    canvasEndY,
    ' ',
    canvasEndX,
    ' ',
    canvasEndY,
  );

  return <AnimatedPath {...{d}} strokeWidth={width} stroke={color} />;
};

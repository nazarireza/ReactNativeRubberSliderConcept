import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  add,
  cond,
  eq,
  greaterOrEq,
  sub,
  set,
  lessOrEq,
  useCode,
  block,
  and,
  multiply,
  divide,
  round,
} from 'react-native-reanimated';
import {useValues} from 'react-native-redash';
import {Svg} from 'react-native-svg';

import {
  CANVAS_HEIGHT,
  INDICATOR_SIZE,
  LEFT_INDICATOR_INITIAL_X,
  RIGHT_INDICATOR_INITIAL_X,
} from './Constants.js';
import SliderLine from './SliderLine';
import SliderIndicator from './SliderIndicator';
import {State} from 'react-native-gesture-handler';

export default ({max, start, end}) => {
  const [elementDimension, setElementDimension] = useState({
    width: -1,
    height: -1,
  });

  const [
    leftIndicatorX,
    leftIndicatorY,
    leftIndicatorState,
    rightIndicatorX,
    rightIndicatorY,
    rightIndicatorState,
  ] = useValues(
    [
      LEFT_INDICATOR_INITIAL_X,
      CANVAS_HEIGHT / 2 - INDICATOR_SIZE / 2,
      State.UNDETERMINED,
      RIGHT_INDICATOR_INITIAL_X,
      CANVAS_HEIGHT / 2 - INDICATOR_SIZE / 2,
      State.UNDETERMINED,
    ],
    [],
  );

  useCode(
    () =>
      block([
        cond(
          and(
            eq(leftIndicatorState, State.ACTIVE),
            greaterOrEq(leftIndicatorX, sub(rightIndicatorX, INDICATOR_SIZE)),
          ),
          set(rightIndicatorX, add(leftIndicatorX, INDICATOR_SIZE)),
        ),
        cond(
          and(
            eq(rightIndicatorState, State.ACTIVE),
            lessOrEq(rightIndicatorX, add(leftIndicatorX, INDICATOR_SIZE)),
          ),
          set(leftIndicatorX, sub(rightIndicatorX, INDICATOR_SIZE)),
        ),
        [
          set(
            start,
            round(
              divide(
                multiply(add(leftIndicatorX, INDICATOR_SIZE / 2), max),
                elementDimension.width,
              ),
            ),
          ),
          set(
            end,
            round(
              divide(
                multiply(add(rightIndicatorX, INDICATOR_SIZE / 2), max),
                elementDimension.width,
              ),
            ),
          ),
        ],
      ]),
    [elementDimension],
  );

  return (
    <View
      style={styles.container}
      onLayout={({
        nativeEvent: {
          layout: {width, height},
        },
      }) => {
        setElementDimension({width, height});
      }}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${elementDimension.width * 2} ${elementDimension.height *
          2}`}>
        <SliderLine
          startX="0"
          startY={CANVAS_HEIGHT / 2 - INDICATOR_SIZE / 2}
          endX={leftIndicatorX}
          endY={leftIndicatorY}
          width="4"
          color="rgba(0,0,0,.3)"
        />
        <SliderLine
          startX={leftIndicatorX}
          startY={leftIndicatorY}
          endX={rightIndicatorX}
          endY={rightIndicatorY}
          width="6"
          color="#495fde"
        />
        <SliderLine
          startX={rightIndicatorX}
          startY={rightIndicatorY}
          endX={elementDimension.width - INDICATOR_SIZE / 2}
          endY={CANVAS_HEIGHT / 2 - INDICATOR_SIZE / 2}
          width="4"
          color="rgba(0,0,0,.3)"
        />
      </Svg>
      <SliderIndicator
        initialX={LEFT_INDICATOR_INITIAL_X}
        minX={-INDICATOR_SIZE / 2}
        maxX={elementDimension.width - INDICATOR_SIZE / 2 - INDICATOR_SIZE}
        x={leftIndicatorX}
        y={leftIndicatorY}
        state={leftIndicatorState}
      />
      <SliderIndicator
        initialX={RIGHT_INDICATOR_INITIAL_X}
        minX={INDICATOR_SIZE / 2}
        maxX={elementDimension.width - INDICATOR_SIZE / 2}
        x={rightIndicatorX}
        y={rightIndicatorY}
        state={rightIndicatorState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CANVAS_HEIGHT,
  },
});

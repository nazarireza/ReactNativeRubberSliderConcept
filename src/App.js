import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';

import Slider from './Slider';

export default () => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.canvasContainer}>
          <Text style={styles.titleText}>Price Range</Text>
          <Text style={styles.valueRangeText}>{`$1800 - $7900`}</Text>
          <Text style={styles.currentValueText}>{`Current Range: $4423`}</Text>
          <Slider />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cfd9ed',
  },
  canvasContainer: {
    backgroundColor: '#FFFFFF',
    width: 350,
    borderRadius: 8,
    paddingHorizontal: 35,
    paddingVertical: 30,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '3rgba(0,0,0,.7)',
  },
  valueRangeText: {
    color: '#495fde',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
  },
  currentValueText: {
    color: 'rgba(0,0,0,.4)',
    marginVertical: 10,
  },
});

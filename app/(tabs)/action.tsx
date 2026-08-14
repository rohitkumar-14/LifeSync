import React from 'react';
import { View } from 'react-native';

// This is a dummy screen. It will never be rendered because the tabBarButton intercepts the press
// and opens a modal instead. However, Expo Router requires the route to exist to avoid warnings.
export default function ActionTab() {
  return <View />;
}

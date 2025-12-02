import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PlayerScreen({ route }) {
  const { videoId, title } = route.params;
  const { width } = Dimensions.get('window');
  const height = (width / 16) * 9;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?controls=1&autoplay=1`;
  return (
    <View style={{ flex:1 }}>
      <View style={{ height }}>
        <WebView source={{ uri: embedUrl }} style={{ flex:1 }} />
      </View>
      <View style={{ padding:10 }}>
        <Text style={{ fontWeight:'bold' }}>{title}</Text>
      </View>
    </View>
  );
}

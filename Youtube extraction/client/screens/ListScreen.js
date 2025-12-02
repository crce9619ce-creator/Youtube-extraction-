import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_BASE = 'http://10.0.2.2:8000'; // change to your server (localhost emulator: 10.0.2.2). Use machine IP for physical device.

export default function ListScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(){
    try {
      const res = await axios.get(`${API_BASE}/videos`);
      if (res.data && res.data.videos) setVideos(res.data.videos);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const renderItem = ({ item }) => {
    const thumb = item.thumbnails?.medium?.url || item.thumbnails?.default?.url;
    return (
      <TouchableOpacity style={{ flexDirection:'row', padding:10, alignItems:'center' }} onPress={()=>navigation.navigate('Player', { videoId: item.videoId, title: item.title })}>
        <Image source={{ uri: thumb }} style={{ width:120, height:68, marginRight:10 }} />
        <View style={{ flex:1 }}>
          <Text style={{ fontWeight:'bold' }}>{item.title}</Text>
          <Text>{item.channelTitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) return <ActivityIndicator style={{marginTop:40}} />;

  return (
    <FlatList
      data={videos}
      keyExtractor={v => v.videoId}
      renderItem={renderItem}
    />
  );
}

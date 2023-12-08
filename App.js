import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import styles from './Styles.css';

export default function App() {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [songs, setSongs] = useState([]);

  const db = SQLite.openDatabase('SongDB.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists song (id integer primary key not null, artist text, title text);');
    }, () => console.error("Error when creating DB"), updateList);
  }, []);

  readData = async () => {
    try {
      let value = await AsyncStorage.getItem('key');
    } catch (error) {
      Alert.alert('Error reading data');
    }
  }

  const saveItem = () => {
    try {
      db.transaction(tx => {
        tx.executeSql('insert into song (artist, title) values (?, ?);',
          [parseInt(artist), title]);
      }, null, updateList)
    } catch (error) {
      Alert.alert('Error saving item')
    }
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from song;', [], (_, { rows }) =>
        setSongs(rows._array)
      );
    }, null, null);
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => tx.executeSql('delete from song where id = ?;', [id]), null, updateList
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Artist'
        onChangeText={artist => setArtist(artist)}
        value={artist} />
      <TextInput
        placeholder='Song Title'
        onChangeText={title => setTitle(title)}
        value={title} />
      <Button onPress={saveItem} title="Add" />
      <FlatList
        style={{ marginLeft: "5%" }}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.listcontainer}>
            <Text>{item.artist},{item.title} </Text>
            <Text style={{ color: '#0000ff' }} onPress={() => deleteItem(item.id)}>Delete</Text>
          </View>}
        data={songs}
      />
    </View>
  );
};
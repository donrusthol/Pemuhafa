import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const [artist, setArtist] = useState('');
  const [title, setTitle] = useState('');
  const [songs, setSongs] = useState([]);
  const [youtubeResults, setYoutubeResults] = useState([]);

  const db = SQLite.openDatabase('SongDB.db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists song (id integer primary key not null, artist text, title text);');
    }, () => console.error("Error when creating DB"), updateList);
  }, []);

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
    }, null, () => {
      // Fetch YouTube search results based on each song title
      const promises = songs.map(item => {
        return fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${item.title}&key=AIzaSyAavvOPs-ZmyF_CrWw-DrilGoFLrfqvCnw`)
          .then(response => response.json())
          .then(data => data.items[0].id.videoId)
          .catch(error => console.error('Error fetching YouTube data:', error));
      });

      Promise.all(promises)
        .then(results => setYoutubeResults(results))
        .catch(error => console.error('Error fetching YouTube data:', error));
    });
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => tx.executeSql('delete from song where id = ?;', [id]), null, updateList
    );
  }

  return (
    <View style={styles.container}>
      <Text>Personal Music Hall of Fame</Text>
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
            <Text>{artist} - {item.title} </Text>
            <Text style={{ color: '#0000ff' }} onPress={() => deleteItem(item.id)}>Delete</Text>
            <Button title="YouTube Search" onPress={() => openYoutube(youtubeResults[index])} />
          </View>}
        data={songs}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dddddd',
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 100,
  },
  input: {
    width: '80%',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    padding: 10,
  },
  listItem: {
    padding: 60,
    backgroundColor: '#ffffff',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 60,
    borderRadius: 5, // add a value for border-radius
  },
});

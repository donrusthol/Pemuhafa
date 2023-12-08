import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';

export default function App() {
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);

  const handleAdd = () => {
    setItems([...items, { key: Math.random().toString(), value: item }]);
    setItem('');
  };

  const handleClear = () => {
    setItems([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Artist - Song Title"
        value={item}
        onChangeText={setItem}
      />
      <View style={styles.buttons}>
        <Button title="Add" onPress={handleAdd} />
        <Button title="Clear" onPress={handleClear} />
      </View>
      <FlatList
        data={items}
        renderItem={itemData => (
          <View style={styles.listItem}>
            <Text>{itemData.item.value}</Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
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
  },
  listItem: {
    padding: 10,
    backgroundColor: '#ccc',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
});

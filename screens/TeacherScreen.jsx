import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const TeacherScreen = ({route, navigation }) => {
  const { user, token } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Teacher: {user.name}</Text>
      <Text style={styles.text}>Here you can manage your classes, communicate with parents, and send updates.</Text>

      <Button
        title="Go to Class Management"
        onPress={() => navigation.navigate('ClassManagement')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default TeacherScreen;

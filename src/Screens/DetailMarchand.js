// DetailMarchand.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const DetailMarchand = ({ route, navigation }) => {
  const { marchand } = route.params; // Récupérer les détails du marchand

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{marchand.nom}</Text>
      <Text>CIN: {marchand.cin}</Text>
      <Text>Téléphone: {marchand.telephone}</Text>
      {/* <Button title="Retour" onPress={() => navigation.goBack()} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DetailMarchand;

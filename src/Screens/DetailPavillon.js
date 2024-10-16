import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailPavillon = ({ route, navigation }) => {
  // Correction: pavillon avec minuscule et vérification de l'existence
  const { pavillon } = route.params || {};

  if (!pavillon) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucun pavillon sélectionné</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{pavillon.Numero}</Text>
      <Text>Type: {pavillon.Type}</Text>
      <Text>Localité: {pavillon.Localite}</Text>
      <Text>Disponibilité: {pavillon.Disponibilite}</Text>
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
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default DetailPavillon;

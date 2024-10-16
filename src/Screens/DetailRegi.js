import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const DetailRegisseur = ({ route, navigation }) => {
  const { regisseur } = route.params; // Récupérer les détails du régisseur

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{regisseur.nom_reg}</Text>
      <Text>CIN: {regisseur.cin_reg}</Text>
      <Text>Téléphone: {regisseur.zone_occupe}</Text>
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

export default DetailRegisseur;

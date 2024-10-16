import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons'; 
import tw from 'twrnc'; 
import MenuScreen from './src/Screens/Menu';
import MarchandForm from './src/Screens/MarchandForm';
import ListeMarchand from './src/Screens/ListeMarchand';
import ListeReg from './src/Screens/ListeReg';
import RegisForm from './src/Screens/RegisForm';
import Pavillon from './src/Screens/Pavillon';
import DetailPavillon from './src/Screens/DetailPavillon';
import Dropdown from './src/Screens/Dropdown';
import PlaceForm from './src/Screens/PlaceForm';
import CategoriePavillon from './src/Screens/CategoriePav';
import Placeliste from './src/Screens/Placeliste';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MenuStack() {
  return (
    <Stack.Navigator initialRouteName="MenuPrincipal">
      <Stack.Screen 
        name="MenuPrincipal" 
        component={MenuScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="ListeMarchand" component={ListeMarchand} />
      <Stack.Screen name="MarchandForm" component={MarchandForm} />
      <Stack.Screen name="ListeReg" component={ListeReg} />
      <Stack.Screen name="RegisForm" component={RegisForm} />
      <Stack.Screen name="Pavillon" component={Pavillon} />
      <Stack.Screen name="DetailPavillon" component={DetailPavillon} />
      <Stack.Screen name="Dropdown" component={Dropdown} />
      <Stack.Screen name="PlaceForm" component={PlaceForm} />
      <Stack.Screen name="CategoriePavillon" component={CategoriePavillon} />
      <Stack.Screen name="Placeliste" component={Placeliste} />
    </Stack.Navigator>
  );
}

function AccueilScreen() {
  return (
    <SafeAreaView style={tw`flex-1 justify-center items-center bg-[#F7F8F3]`}>
      <Text style={tw`text-2xl text-[#52AEA]`}>Accueil</Text>
    </SafeAreaView>
  );
}

function ParametresScreen() {
  return (
    <SafeAreaView style={tw`flex-1 justify-center items-center bg-[#F7F8F3]`}>
      <Text style={tw`text-2xl text-[#52AEA]`}>Paramètres</Text>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Accueil') {
              iconName = 'home-outline';
            } else if (route.name === 'Menu') {
              iconName = 'list-outline';
            } else if (route.name === 'Paramètres') {
              iconName = 'settings-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#cccccc',
          tabBarStyle: {
            backgroundColor: '#AEDDCB', 
            paddingBottom: 4,
          },
        })}
      >
        <Tab.Screen name="Accueil" component={AccueilScreen} />
        <Tab.Screen name="Menu" component={MenuStack} />
        <Tab.Screen name="Paramètres" component={ParametresScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios'



export default function App() {


  function HomeScreen({navigation}) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <Button
        title="Go to scanner"
        onPress={() => navigation.navigate('Scaner')}
      />
      </View>
    );
  }

  function DetailsScreen({navigation}) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Details Screen</Text>
        <Button title='ir a home' onPress={()=> navigation.navigate('Home')}/>
      </View>
    );
  }


  const CodeScanner = ({navigation})=> {

    const [permisoCamara, setPermisoCamara] = useState(null);
    const [scanned, setScanned ] = useState(null)
    
    useEffect(() => {
      const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setPermisoCamara(status === 'granted');
      };
    
      getBarCodeScannerPermissions();
    }, []);
    
    const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Se ha detectado un codigo de tipo ${type} el cual tiene la info : ${data}`)
    axios.get(`http://192.168.0.105:3000/products/code/${data}`)
    .then(res => alert( JSON.stringify(res.data)))
    .catch(err => alert(err))
    if(permisoCamara === null) {
      return <Text>Solicitando pemiso de camara</Text>
    }
    if(permisoCamara === false){
      return <Text>Error , no hay acceso a la camara</Text>
    }
    }
    
    
    return (
        <View>
          <Text>Hello world</Text>
        <BarCodeScanner 
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{width:'70%',height:'90%'}}
      />
      {scanned && <Button title={'Presione para volver a escanear'} onPress={()=> setScanned(false)} />}
    </View>
    )
    }

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name='Scaner' component={CodeScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); */

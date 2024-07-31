import { View, Text, TextInput,Button,TouchableOpacity } from 'react-native'
import React,{useState,useEffect} from 'react';
import Signup from './src/pages/Signup';
import Login from './src/pages/Login';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './src/pages/Home';
import NavigatorComponent from './src/pages/NavigatorComponent';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

// function HomeScreen() {
//   return (
//     <Tab.Navigator>
//     <Tab.Screen name="Feed" component={Feed} />
//     <Tab.Screen name="Messages" component={Messages} />
//   </Tab.Navigator>
//   );
// }

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

function App() {
  const [fetchedUserArray,setFetchedUserArray] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    const fetchItems = async () => {
        try {
            
            const users = await AsyncStorage.getItem("users");
            // const itemsArray = await Promise.all(
            //     allKeys.map(async key => {
            //         const item = await AsyncStorage.getItem(key);
            //         return JSON.parse(item);
            //     })
            // );
            setFetchedUserArray(users);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchItems();
}, []);

console.log(fetchedUserArray)
  return (
    <NavigationContainer> 
      <Stack.Navigator initialRouteName="Quizz Categories">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Tabs" component={NavigatorComponent}/>
        <Stack.Screen name="Quizz Categories" 
        component={HomeScreen}  
        // initialParams={{setModalVisible,modalVisible}}
        // options={({ navigation }) => ({
        //     title: 'Home',
        //     headerRight: () => (
        //       <TouchableOpacity
        //       onPress={() => setModalVisible(true)}
        //         style={{ marginLeft: 15 }}
        //       >
        //         <Text>Add</Text>
        //         {/* <MaterialIcons name="add" size={30} color="#000" /> */}
        //       </TouchableOpacity>
            
        // )})}
        />
      </Stack.Navigator>
      {/* <Tab.Navigator>
        <Tab.Screen name="Questions" component={HomeScreen} />
        <Tab.Screen name="Result" component={SettingsScreen} />
      </Tab.Navigator> */}
    </NavigationContainer>
    // <View>
    //            <Text>Hii</Text>
    // </View>
  );
}

export default App
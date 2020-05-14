import React from 'react';
import {
  View,
  Text,
  Button
} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';



// class App extends React.Component{
//   async componentDidMount() {


    // this.setState({advancedStorage: contract});
    //
    // let accounts = await web3.eth.getAccounts();
    // this.setState({accounts});
    // await contract.methods.add('23').send({from:accounts[0]});
    // let results = await contract.methods.getAll().call();
  // }
//
// };

import { createStackNavigator } from '@react-navigation/stack';

import CreateUser from './src/Screens/CreateUser';
import Login from './src/Screens/Login';
import Posts from './src/Screens/Posts';
import CreatePost from './src/Screens/CreatePost';
import Post from './src/Screens/Post';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="CreateUser" component={CreateUser} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Posts" component={Posts} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="Post" component={Post} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

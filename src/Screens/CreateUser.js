import * as React from "react";
import {Image, StyleSheet, View, TouchableOpacity,Text, AsyncStorage} from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogo from "../assets/images/logo.png";
import Avatar from "../assets/images/avatar.jpg";
import colors from "../config/colors";
import strings from "../config/strings";
import ImagePicker from 'react-native-image-picker';
import AdvancedStorage from '../build/contracts/AdvancedStorage.json';
import Web3 from 'web3'
// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    // path: 'images',
  },
};

let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/matrim/upload';


interface State {
  email: string;
  password: string;
}

class CreateUser extends React.Component {
  state = {
    email: "",
    password: "",
    avatarSource: '',
    remoteImageUrl:''
  };

  async componentDidMount() {

    const web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.31.125:9545'));
    const deploymentKey = Object.keys(AdvancedStorage.networks)[0];
    let contract = new web3.eth.Contract(
      AdvancedStorage.abi,
      AdvancedStorage
        .networks[deploymentKey]
        .address
    );
    let accounts = await web3.eth.getAccounts();
    global.web3 = web3;
    global.contract = contract;
    global.account = accounts[0];

    try {
      const value = await AsyncStorage.getItem('userName');
      if (value !== null) {
        // We have data!!
        this.props.navigation.navigate('Posts');
      }
    } catch (error) {
      // Error retrieving data
    }
    // contract.methods.createUser('email', 'password', 'remoteImageUrl').send({from:accounts[0], gas:3000000});

  }

  handleEmailChange = (email: string) => {
    this.setState({email: email});
  };

  handlePasswordChange = (password: string) => {
    this.setState({password: password});
  };

  handleLoginPress = async () => {
    const {email, password, remoteImageUrl} = this.state;
    // console.warn(email, password,remoteImageUrl)
    await global.contract.methods.createUser(email, password, remoteImageUrl).send({from:global.account,gas:3000000});
    // let results = await global.contract.methods.getUsers().call();
    // console.warn(results);
    try {
      await AsyncStorage.setItem(
        'DPURL',
        remoteImageUrl
      );
    } catch (error) {
      // Error saving data
    }
    this.goToLogin();
  };

  goToLogin = ()=>{
    this.props.navigation.navigate('Login');
  }


    openImagePickerAsync = async () => {
       await ImagePicker.showImagePicker({
        allowsEditing: true,
        aspect: [4, 3],
        base64: true
      },
         (response) => {
           console.log('Response = ', response);

           if (response.didCancel) {
             console.log('User cancelled image picker');
           } else if (response.error) {
             console.log('ImagePicker Error: ', response.error);
           } else if (response.customButton) {
             console.log('User tapped custom button: ', response.customButton);
           } else {
             const source = {uri: response.uri};
             this.setState({
               avatarSource: source,
             });
             // console.warn(response)
             let base64Img = `data:image/jpg;base64,${response.data}`;

             let data = {
               "file": base64Img,
               "upload_preset": "fs7jtpjz",
             }

             fetch(CLOUDINARY_URL, {
               body: JSON.stringify(data),
               headers: {
                 'content-type': 'application/json'
               },
               method: 'POST',
             }).then(async r => {
               let data = await r.json()
               this.setState({remoteImageUrl:data.url});
               // console.warn('uploaded', this.state);
             }).catch(err => console.warn(err))
           }
         });


    };

  render() {
    return (
      <View style={styles.container}>
        <Image source={imageLogo} style={styles.logo}/>
        <View style={styles.form}>
          <FormTextInput
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            placeholder={strings.EMAIL_PLACEHOLDER}
          />
          <FormTextInput
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
          />
          <TouchableOpacity onPress={this.openImagePickerAsync}>
            <Text>Select Avatar</Text>
            {
              !!this.state.avatarSource && (
                <Image source={this.state.avatarSource} style={styles.avatar}/>
              )
            }
            {
              !this.state.avatarSource && (
                <Image source={Avatar} style={styles.avatar}/>
              )
            }
          </TouchableOpacity>
          <View style={{padding:10}}/>
          <Button disabled={!(this.state.email && this.state.password && this.state.remoteImageUrl)} label={'Create Account'} onPress={this.handleLoginPress}/>
          <Button label={'Login'} onPress={this.goToLogin}/>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  avatar: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 2,
    justifyContent: "center",
    width: "80%"
  }
});

export default CreateUser;




import * as React from "react";
import {Image, StyleSheet, View, TouchableOpacity, Text, AsyncStorage} from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogo from "../assets/images/logo.png";
import Place from "../assets/images/place.png";
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
    caption: "",
    avatarSource: '',
    remoteImageUrl: ''
  };


  handleCaptionChange = (caption: string) => {
    this.setState({caption: caption});
  };

  handleCreatePress = async () => {
    const {caption, remoteImageUrl} = this.state;
    try {
      const value = await AsyncStorage.getItem('userName');
      if (value !== null) {
        await global.contract.methods.createPost(caption, remoteImageUrl, value).send({
          from: global.account,
          gas: 3000000
        });
      }
    } catch (error) {
      console.warn(error)
    }

    this.props.navigation.pop();

  };


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
            this.setState({remoteImageUrl: data.url});
            // console.warn('uploaded', this.state);
          }).catch(err => console.warn(err))
        }
      });


  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <FormTextInput
            value={this.state.caption}
            onChangeText={this.handleCaptionChange}
            placeholder={'Enter caption'}
          />

          <TouchableOpacity onPress={this.openImagePickerAsync}>
            <Text>Select Image</Text>
            {
              !!this.state.avatarSource && (
                <Image source={this.state.avatarSource} style={styles.avatar}/>
              )
            }
            {
              !this.state.avatarSource && (
                <Image source={Place} style={styles.avatar}/>
              )
            }
          </TouchableOpacity>
          <View style={{padding: 10}}/>
          <Button disabled={!(this.state.caption  && this.state.remoteImageUrl)}
                  label={'Create Post'} onPress={this.handleCreatePress}/>

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
    width: 300,
    height: 300,
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




import * as React from "react";
import { Image, StyleSheet, View, Alert, AsyncStorage } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogo from "../assets/images/logo.png";
import colors from "../config/colors";
import strings from "../config/strings";

interface State {
  email: string;
  password: string;
}

class Login extends React.Component {
  state= {
    email: "",
    password: ""
  };

  handleEmailChange = (email: string) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

  handleLoginPress = async () => {
    const {email, password} = this.state;
    try{
      await global.contract.methods.login(email, password).call();
      try {
        await AsyncStorage.setItem(
          'userName',
          email
        );
      } catch (error) {
        // Error saving data
      }
      this.props.navigation.replace('Posts');
    }catch (e) {
      Alert.alert(
        'Error',
        'Invalid credentials',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: true }
      )
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={imageLogo} style={styles.logo} />
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
          <Button label={strings.LOGIN} onPress={this.handleLoginPress} />
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
  form: {
    flex: 1.5,
    justifyContent: "center",
    width: "80%"
  }
});

export default Login;

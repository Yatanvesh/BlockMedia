import * as React from "react";
import {Image, Text, TouchableOpacity, StyleSheet, View, AsyncStorage, FlatList, Dimensions} from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogo from "../assets/images/logo.png";
import colors from "../config/colors";
import strings from "../config/strings";
import Avatar from "../assets/images/avatar.jpg";

const screenWidth = Math.round(Dimensions.get('window').width);

class Posts extends React.Component {

  state = {
    posts: [],
    comments: [],
    users: [],
    userName: '',
    DPURL: ''
  }

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem('DPURL');
      if (value !== null) {
        this.setState({DPURL: value})
      }
    } catch (error) {
    }
    try {
      const value = await AsyncStorage.getItem('userName');
      if (value !== null) {
        this.setState({userName: value})
      }
    } catch (error) {
    }
    this.updateAPI();

    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.updateAPI()
    });
  }

  createPost = () => {
    this.props.navigation.navigate('CreatePost');
  }

  componentWillUnmount() {
    // this.focusListener && this.focusListener.remove();
  }

  PostMini = ({content}) => {
    const {caption, userName, imageURL, id} = content;
    let dpUrl = this.findUserDP(userName);
    return (
      <TouchableOpacity onPress={()=> this.props.navigation.navigate('Post', {id,comments:this.state.comments, users:this.state.users})} style={styles.postContainer}>
        <View style={{flexDirection: 'row', justifyContent:'space-around'}}>
          <Text style={styles.postTitle}>{userName}:{caption}</Text>
          <Image source={{uri: dpUrl}} style={styles.avatar}/>
        </View>

        <Image source={{uri: imageURL}} style={styles.postImage}/>
      </TouchableOpacity>
    );
  }

  updateAPI = async () => {
    let users = await global.contract.methods.getUsers().call();
    let posts = await global.contract.methods.getPosts().call();
    let comments = await global.contract.methods.getComments().call();
    this.setState({posts, users, comments});
  }

  findUserDP = (userName) => {
    let url = '';
    this.state.users.map( user => {
      if(user[0]=== userName)
        url = user[2];
    })
    return url;
  }
  render() {
    // console.log(this.state.users)
    return (
      <View style={styles.container}>
        {
          !!this.state.userName && !!this.state.DPURL && (
            <TouchableOpacity onPress={this.updateAPI} style={styles.userContainer}>
              {/*<Text style={styles.avatarTitle}>{this.state.userName}</Text>*/}
              <Image source={{uri: this.state.DPURL}} style={styles.avatar}/>
            </TouchableOpacity>
          )
        }
        <View style={{marginTop: 20}}>
          <Button label={'Click to create post'} onPress={this.createPost}/>
        </View>
        <FlatList
          data={this.state.posts.reverse()}
          renderItem={({item}) => <this.PostMini content={item}/>}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "center"
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    height: 60,
    alignSelf: 'flex-end',
    top: 10,
    position: 'absolute'
  },
  avatarTitle: {
    fontSize: 18,
    marginRight: 10
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    resizeMode: "contain",
    alignSelf: "center"
  },
  postContainer: {
    margin: 5,
    padding: 5,
    borderBottomWidth: 1
  },
  postImage: {
    width: screenWidth,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    borderRadius: 10
  },
  postTitle: {
    fontSize: 18,
    paddingLeft: 10,
    padding: 5
  }
});

export default Posts;

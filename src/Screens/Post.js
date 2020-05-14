import * as React from "react";
import {Image, StyleSheet, View, ScrollView, AsyncStorage, Text, Dimensions} from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogo from "../assets/images/logo.png";
import colors from "../config/colors";
import strings from "../config/strings";
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

class Post extends React.Component {
  state = {
    comment: "",
    comments: [],
    users: [],
    post: {}
  };

  handleCommentChange = (comment) => {
    this.setState({comment});
  };

  handleCommentPress = async () => {
    const postID = this.props.route.params.id;
    const {comment} = this.state;
    try {
      const userID = await AsyncStorage.getItem('userName');
      if (userID !== null) {
        await global.contract.methods.comment(postID, userID, comment).send({
          from: global.account,
          gas: 3000000
        });
      }
    } catch (error) {
      console.warn(error)
    }
    this.updateAPI();
    this.setState({comment:''})
  };

  updateAPI = async () => {
    let users = await global.contract.methods.getUsers().call();
    let comments = await global.contract.methods.getComments().call();
    this.setState({users, comments});
  }

  async componentDidMount() {
    this.updateAPI();
    const postID = this.props.route.params.id;
    let post = await global.contract.methods.getPost(postID).call();
    this.setState({post});
  }

  findUserDP = (userName) => {
    let url = '';
    this.state.users.map(user => {
      if (user.userName === userName)
        url = user.DPURL;
    })
    return url;
  }

  render() {
    console.log(this.state.comments)
    const postID = this.props.route.params.id;

    if (!this.state.post) return <View></View>;
    let dpUrl = this.findUserDP(this.state.post.userName);
    return (
      <ScrollView contentContainerStyle={{alignItems: 'center'}}>
        {
          !!this.state.post.imageURL && (
            <Image source={{uri: this.state.post.imageURL}} style={styles.postImage}/>
          )
        }
        <View style={styles.form}>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
            <Text style={styles.postTitle}>{this.state.post.userName}:{this.state.post.caption}</Text>
            {
              !!dpUrl && (
                <Image source={{uri: dpUrl}} style={styles.avatar}/>
              )
            }
          </View>
          <View style={styles.commentContainer}>
            {
              this.state.comments.map(comment => {
                if(comment.postID=== postID){
                  return (
                    <View key={comment.commentText} style={{flexDirection:'row',borderWidth:1,borderColor:'black', borderRadius:4,padding:8, margin:8, alignItems: 'center'}}>
                      <Image style={{width:40,height:40, borderRadius:10, marginRight:10}} source={{uri:this.findUserDP(comment.userName)}}/>
                      <Text style={styles.commentText}>{comment.userName}:{comment.commentText}</Text>
                  </View>
                  )
                }
              })
            }
          </View>
          <FormTextInput
            value={this.state.comment}
            onChangeText={this.handleCommentChange}
            placeholder={"Enter comment"}
          />
          <Button label={"Comment"} onPress={this.handleCommentPress}/>
        </View>
      </ScrollView>
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
    width: "80%",
    marginTop:15
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    resizeMode: "contain",
    alignSelf: "center"
  },
  postImage: {
    width: screenWidth,
    height: screenHeight/2,
    resizeMode: "contain",
    alignSelf: "center",
    borderRadius: 10
  },
  commentContainer:{
    padding:10,
  },
  commentText:{
    fontSize:16
  }
});

export default Post;

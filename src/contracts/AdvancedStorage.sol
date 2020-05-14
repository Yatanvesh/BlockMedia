pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract AdvancedStorage {
  struct User {
    string userName;
    string password;
    string DPURL;
  }

  struct Comment{
      string userName;
      string commentText;
      uint postID;
  }

  struct Post{
      uint id;
      string caption;
      string imageURL;
      string userName;
  }

  User[] public users;
  Post[] public posts;
  Comment[] public comments;
  uint nextPostID = 1;

  function createUser(string memory userName, string memory password, string memory DPURL) public {
    users.push(User(userName, password, DPURL));
  }

  function login(string memory userName, string memory password) public view returns(bool){
      uint position = findUser(userName);
      if(compareStrings( users[position].password,  password)) return true;
      else return false;
  }

  function createPost(string memory caption, string memory imageURL, string memory userName) public {
      posts.push(Post(nextPostID,caption, imageURL, userName));
      nextPostID++;
  }

  function getPosts() view public returns(Post[] memory){
      return posts;
  }

   function getComments() view public returns(Comment[] memory){
      return comments;
  }
   function getUsers() view public returns(User[] memory){
      return users;
  }

  function comment(uint postID, string memory userName, string memory commentText) public {
      comments.push(Comment(userName, commentText, postID));
  }

  function getPost(uint postID) public view returns(Post memory){
      uint index = findPost(postID);
      return posts[index];
  }

  function deletePost(uint postID) public {
      uint index = findPost(postID);
      delete posts[index];
  }


  function findUser(string memory userName) view internal returns(uint) {
    for(uint i = 0; i < users.length; i++) {
      if( compareStrings( users[i].userName, userName)) {
        return i;
      }
    }
    revert('User does not exist!');
  }

  function findPost(uint postID) view internal returns(uint) {
    for(uint i = 0; i < posts.length; i++) {
      if(posts[i].id == postID) {
        return i;
      }
    }
    revert('Post does not exist!');
  }

   function compareStrings (string memory a, string memory b) internal pure  returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
   }
}

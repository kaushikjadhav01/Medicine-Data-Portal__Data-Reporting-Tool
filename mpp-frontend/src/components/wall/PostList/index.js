import React, {useEffect, useState} from "react";
import PostItem from "./PostItem";
import WriteBox from "../../../components/wall/WriteBox/index";

const PostList = (props) => {

  const [postList, setPostList] = useState(props.postList);
  const [user, setUser] = useState(props.user);

  useEffect(() => {
    setUser(props.user)
  }, [props.user]);

  const addPost = (commentText, imageList) => {
    console.log("click ho gya");
    const post = {
      id: Math.random() * 1343300,
      text: commentText,
      user: user,
      date: new Date().toString(),
      mediaList: imageList.map(data => {
        return {image: data.thumbUrl}
      }),
      viewCount: 0,
      likeCount: 0,
      isLike: false,
      commentCount: 0,
      commentList: [],
    };
    setPostList([post, ...postList]);
  };

  return (
    <>
      <WriteBox addPost={addPost} user={user}/>
      {postList.map((post) => {
          return <PostItem key={post.id} index={post.id} postData={post} user={user}/>
        }
      )}
    </>
  )
};

export default PostList

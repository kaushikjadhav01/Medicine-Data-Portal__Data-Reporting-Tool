import React, {useEffect, useState} from "react";
import {Avatar, Button} from "antd";

import DisplayDate from "../DisplayDate/index";

const CommentBox = (props) => {

  const [isComment, setIsComment] = useState(false);

  const [commentData, setCommentData] = useState({
    id: 0,
    user: {},
    isLike: true,
    likeCount: 0,
    date: '',
    commentList: [],
    comment: ''
  });

  const _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCommentToggle();
    }
  };

  useEffect(() => {
    setCommentData(props.commentData)
  }, [props.commentData]);


  const handleLikeToggle = () => {
    setCommentData({
        ...commentData,
        isLike: !commentData.isLike,
        likeCount: (commentData.isLike === true ? commentData.likeCount - 1 :commentData.likeCount + 1)
    });
  };

  const handleCommentToggle = () => {
    setIsComment((previousState) => ({
        isComment: !previousState.isComment,
      }
    ));
  };

  const {user, isLike, date, comment} = commentData;
  return (
    <div className="gx-media gx-flex-nowrap gx-wall-user-info gx-mb-3">
      <Avatar className="gx-mr-3 gx-size-40" src={user.image}/>
      <div className="gx-media-body">
        <h5 className="gx-wall-user-title">{user.name}</h5>
        <DisplayDate date={date}/>
        <p className="gx-mt-2">{comment}</p>
        <div className="gx-flex-row">
          <Button type="primary" size="small"
                  onClick={handleLikeToggle}>{isLike === true ? 'Like' : 'UnLike'}</Button>
          <Button className="gx-btn-primary-light" size="small"
                  onClick={handleCommentToggle}>Comment</Button>
        </div>
        {isComment === true ? <div className="gx-media">
          <Avatar className="gx-mr-3 gx-size-30" src={user.image}/>
          <div className="gx-media-body">
            <input
              id="required" className="gx-border-0 ant-input"
              placeholder="Type Comments"
              onKeyPress={(event) => _handleKeyPress(event)}
            />
          </div>
        </div> : null}

      </div>
    </div>
  )
};

export default CommentBox;

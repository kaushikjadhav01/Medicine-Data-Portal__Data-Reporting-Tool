import React, {useEffect} from 'react';
import CircularProgress from "components/CircularProgress/index";
import Auxiliary from "util/Auxiliary";
import {useDispatch, useSelector} from "react-redux";
import {hideMessage} from "appRedux/actions/Common";

const InfoView = () => {

  const dispatch = useDispatch();

  const error = useSelector(({common}) => common.error);

  const loading = useSelector(({common}) => common.loading);

  const message = useSelector(({common}) => common.message);

  const displayMessage = message;

  useEffect(() => {
    if (error || message) {
      setTimeout(() => {
        dispatch(hideMessage());
      }, 3000);
    }
  }, [error, message, dispatch]);


  return (
    <Auxiliary>
      {loading && <div className="gx-loader-view gx-loader-position">
        <CircularProgress/>
      </div>}
      {error && message.error(<span id="message-id">{error}</span>)}
      {displayMessage && message.info(<span id="message-id">{displayMessage}</span>)}
    </Auxiliary>
  );
};

export default InfoView;

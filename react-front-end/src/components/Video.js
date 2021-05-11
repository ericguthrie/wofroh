import React from "react";
import ReactPlayer from "react-player/youtube";

function Video({ videoURL }) {
  return (
    <div>
      <p>Get help from the Coach Youtube by clicking on any exercise</p>
      <h1> Coach: </h1>
      <ReactPlayer url={videoURL} />
      {/* <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' /> */}
    </div>
  );
}

export default Video;
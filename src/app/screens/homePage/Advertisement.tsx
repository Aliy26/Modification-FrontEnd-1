import React from "react";
export default function Adverstisement() {
  return (
    <div className="ads-restaurant-frame">
      <video
        className={"ads-video"}
        autoPlay={true}
        loop
        muted
        playsInline
        data-video-media=""
      >
        <source type="video/mp4" src="video/gatorade-ad.mp4" />
      </video>
    </div>
  );
}

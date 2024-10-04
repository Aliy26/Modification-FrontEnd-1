import React from "react";
export default function ProductAdverstisement() {
  return (
    <div className="ads-gatorade-frame">
      <video
        className={"gatorade-video"}
        autoPlay={true}
        loop
        muted
        playsInline
        data-video-media=""
      >
        <source type="video/mp4" src="video/gaterode-commercial.mp4" />
      </video>
    </div>
  );
}

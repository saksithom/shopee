import React, { useState, useEffect } from "react";
import { PhotoView } from "react-photo-view"

const Images = ({src}) => {
  const [imageURL, setImageURL] = useState(null)
  useEffect(() => {
    if(src != imageURL){
      setImageURL(src)
    }
  },[src])
  return (
    <PhotoView src={imageURL}>
      <img src={imageURL} style={{ objectFit: 'cover' }} alt="" />
    </PhotoView>
  );
}

export default Images
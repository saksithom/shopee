import { useState } from "react";

const ProfileImage = ({ src, fallback, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      style={{ width: "200px", height: "200px", objectFit: "cover" }}
    />
  );
};

export default ProfileImage
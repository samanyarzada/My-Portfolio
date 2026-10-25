import { useState } from "react";

// Small screenshot in the list. Falls back to the first letter of the title.
export default function AdminThumb({ src, name = "" }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="admin-thumb" aria-hidden="true">
      {src && !failed ? (
        <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}   
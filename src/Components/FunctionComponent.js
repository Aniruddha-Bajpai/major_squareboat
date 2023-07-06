import React, { useState } from "react";

function FunctionComponent() {
  const [name, setName] = useState("Aniruddha");
  return <div> Welcome to FunctionComponent {name}</div>;
}

export default FunctionComponent;

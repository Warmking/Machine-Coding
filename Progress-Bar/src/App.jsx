import React, { useState, useEffect } from "react";
import "./App.css";
import Progress from "./components/Progress";

export default function App() {
  const [value, setValue] = useState(0);
  const [success,setSuccess] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
      setValue((prev) => {
        if (prev > 100) {
          clearInterval(interval); // Clear interval once it reaches 100%
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className='main__container'>
      <h1>Progress Bar</h1>
      <Progress value={value} onComplete = {()=>{setSuccess(true)}} />
      <span>{success?'Completed!':'Loading...'}</span>
    </div>
  );
}

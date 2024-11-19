import React, { useState, useEffect } from "react";
const Progress = ({ value = 0 ,onComplete=()=>{}}) => {
  const [percentage, setPercentage] = useState(value);
  useEffect(() => {
    const currentValue = Math.min(100, Math.max(0, value))
    setPercentage(currentValue);
    if(currentValue === 100){
        console.log('completed')
        onComplete()
    }
  }, [value]);
  return (
    <div className="progress__container">
      
      <span style={{
        color:`${percentage>50?'white':'black'}`
      }} className="progress__data">{percentage.toFixed()}%</span>
      <div role="progressbar"  aria-valuemin='0' aria-valuemax={100} aria-valuenow={percentage}
        style={{
          transform:`translateX(${percentage-100}%)`,
        }}
        className="progress__indicator"
      ></div>
    </div>
  );
};

export default Progress;

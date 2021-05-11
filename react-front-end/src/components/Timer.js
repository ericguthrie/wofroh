import React from "react";

function Timer({ exerciseTimes }) {
  return (
    <div>
      {`Your total workout time is: ${exerciseTimes.reduce(
        (total, num) => total + num,
        0
      )} min`}
    </div>
  );
}

export default Timer;
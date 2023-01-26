// import React from "react";
// import RadialSeparators from "./RadialSeparators";
// import { render } from "react-dom";

// import {
//   CircularProgressbarWithChildren,
//   buildStyles
// } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";


// export default function hart(props){
//     const percentage = 66;



//     <CircularProgressbarWithChildren
//       value={80}
//       text={`${80}%`}
//       strokeWidth={10}
//       styles={buildStyles({
//         strokeLinecap: "butt"
//       })}
//     >
//       <RadialSeparators
//         count={12}
//         style={{
//           background: "#fff",
//           width: "2px",
//           height: `${10}%`
//         }}
//       />
//     </CircularProgressbarWithChildren>




// return (
//     <div style={{ marginBottom: 80 }}>
//       <hr style={{ border: "2px solid #ddd" }} />
//       <div style={{ marginTop: 30, display: "flex" }}>
//         <div style={{ width: "30%", paddingRight: 30 }}>{props.children}</div>
//         <div style={{ width: "70%" }}>
//           <h3 className="h5">{props.label}</h3>
//           <p>{props.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { render } from "react-dom";
import RadialSeparators from "../RadialSeparator";

import {
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";




export default function Example(props) {
  return (
  
        <div className="titulo-card-g"  style={{ width: "94%"}}>{props.children}</div>
  );
}




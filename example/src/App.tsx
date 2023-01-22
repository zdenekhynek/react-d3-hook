import React from "react";

import { faker } from "@faker-js/faker";

//  @ts-ignore
// import { useD3 } from "react-d3-hook";
// import { useD3 } from "./react-d3-hook/use-d3";
import D3Wrapper from "./d3_wrapper";
import LineChart from "./line_chart";

function App() {
  const [width, height] = [800, 533];

  //  generate consistent fake data
  faker.seed(123);
  const data = Array.from({ length: 100 }).map((_, i) => {
    return {
      x: i,
      y: faker.datatype.number(100),
    };
  });

  return (
    <div className="App">
      <D3Wrapper
        wrapperEl="svg"
        data={data}
        width={width}
        height={height}
        xAxisLabel={"x axis label"}
        yAxisLabels={"y axis label"}
        //  @ts-ignore
        d3ComponentClass={LineChart}
      />
    </div>
  );
}

export default App;

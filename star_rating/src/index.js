import React from "react";
import { render } from "react-dom";
import App from "./App";
import colorData from "./data/color-data.json";

var myObject = {
    obj1: 10,
    obj2: "222"
};

render(
    <>
        <App myObj={myObject} colorData={colorData} />
        <App myObj={myObject} colorData={colorData} />
    </>,
    document.getElementById("root"));

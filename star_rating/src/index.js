import React from "react";
import { render } from "react-dom";
import App from "./App";
import colorData from "./data/color-data.json";

render(
    <App colorData={colorData} />,
    document.getElementById("root"));

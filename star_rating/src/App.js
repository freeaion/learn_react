import React, { useState } from "react";
//import colorData from "./data/color-data.json";
import ColorList from "./components/ColorList";

export default function App({
    myObj = { obj1: 0, obj2: "" }, colorData = []
}) {
    const [colors, setColors] = useState(colorData);
    myObj.obj1 += 2;
    myObj.obj2 += "oo";

    console.log(`myObj is evaluated: ${myObj.obj1}`);
    console.log(`myObj is evaluated: ${myObj.obj2}`);
    console.log(`myObj is evaluated: ${{ ...myObj }}`);
    return (
        <>
            <ColorList
                colors={colors}
                onRemoveColor={id => {
                    const newColors = colors.filter(color => color.id !== id);
                    setColors(newColors);
                }}
                onRateColor={(id, rating) => {
                    const newColors = colors.map(color =>
                        color.id === id ? { ...color, rating } : color);
                    setColors(newColors);
                }}
                {...myObj}
            />
            <p> my Obj value is {myObj.obj1}</p>
        </>
    );
}

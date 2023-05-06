import React from "react";
import Color from "./Color";
import { useColors } from "../hooks/color-hooks";

export default function ColorList() {
    const { colors } = useColors();
    if (!colors.length) return <div>No Colors Listed.</div>;
    return (
        <div>
            {colors.map(color =>
                <Color key={color.id} {...color} />)}
        </div>
    );
}

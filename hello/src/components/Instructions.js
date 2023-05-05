import React from "react";

export default function Instructions({ title, steps }) {
    return (
        <section className="instructions">
            <h1> {title} </h1>
            {steps.map((s, i) => (
                <p key={i}> {s} </p>
            ))}
        </section>
    );
}

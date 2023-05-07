import React, { useEffect, useState } from "react";

function GitHubUser({ login }) {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!login) return;
        setLoading(() => true);
        console.log(`${login} is still hungry`);
        fetch(`https://api.github.com/users/${login}`)
            .then(resp => resp.json())
            .then(setData)
            .then(() => setLoading(() => false))
            .catch(setError);
    }, [login]);

    if (loading) {
        return <h1> loading... </h1>;
    }
    if (error)
        return <pre>{JSON.stringify(error, null, 2)}</pre>;
    if (!data) return null;

    return (
        <div className="githubUser">
            <img
                src={data.avatar_url}
                alt={data.login}
                style={{ width: 200 }}
            />
            <div>
                <h1> {data.login} </h1>
                {data.name && <p>{data.name}</p>}
                {data.location && <p>{data.location}</p>}
            </div>
        </div>
    );
}

const tahoe_peaks = [
    { name: "Freel Peak", elevation: 10891 },
    { name: "Monument Peak", elevation: 10051 },
    { name: "Pyramid Peak", elevation: 891 }
];

function List({ data = [], renderItem, renderEmpty }) {
    if (!data.length) return renderEmpty;
    return (
        <ul>
            {data.map((item, i) => (
                <li key={i}>{renderItem(item)}</li>
            ))}
        </ul>
    );
}

export default function App() {
    return (
        <List
            data={tahoe_peaks}
            renderEmpty={<p>This list is empty</p>}
            renderItem={item => (
                <>
                    {item.name} - {item.elevation.toLocaleString()}ft
                </>
            )}
        />
    );
}

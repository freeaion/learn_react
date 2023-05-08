import React, { useCallback, useMemo, useEffect, useState } from "react";
import { FixedSizeList } from "react-window";

const useIterator = (
    items = [],
    initIndex = 0
) => {
    const [i, setIndex] = useState(initIndex);

    const prev = useCallback(() => {
        setIndex(i === 0 ? items.length - 1 : i - 1);
    }, [i]);
    const next = useCallback(() => {
        setIndex(i === items.length - 1 ? 0 : i + 1);
    }, [i]);

    const item = useMemo(() => items[i], [i]);
    return [item, prev, next];
}

function RepoMenu({
    repositories,
    onSelect = f => f
}) {
    const [{ name }, prev, next] = useIterator(
        repositories
    );

    useEffect(() => {
        if (!name) return;
        onSelect(name);
    }, [name]);

    return (
        <div style={{ display: "flex" }}>
            <button onClick={prev}>&lt;</button>
            <p>{name}</p>
            <button onClick={next}>&gt;</button>
        </div>
    );
}

function useFetch(uri) {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uri) return;
        setLoading(true);
        fetch(uri)
            .then(data => data.json())
            .then(setData)
            .then(() => setLoading(false))
            .catch(setError);
    }, [uri]);

    return { loading, data, error };
}

function Fetch({
    uri,
    renderSuccess,
    loadingFallback = <p> loading...</p>,
    renderError = error => (
        <pre>{JSON.stringify(error, null, 2)}</pre>
    )
}) {
    const { loading, data, error } = useFetch(uri);
    if (loading) return loadingFallback;
    if (error) return renderError(error);
    if (data) return renderSuccess({ data });

    // nothing to render
}

function UserRepositories({
    login,
    onSelect = f => f
}) {
    return (
        <Fetch
            uri={`https://api.github.com/users/${login}/repos`}
            renderSuccess={({ data }) => (
                <RepoMenu
                    repositories={data}
                    onSelect={onSelect}
                />
            )}
        />
    );
}

function UserDetails({ data }) {
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
            <UserRepositories
                login={data.login}
                onSelect={
                    repoName => console.log(`${repoName}!!`)}
            />
        </div>
    );
}

function GitHubUser({ login }) {
    return (
        Fetch({
            uri: `https://api.github.com/users/${login}`,
            renderSuccess: UserDetails,
        })
    );
}

export default function App() {
    const [login, setLogin] = useState("moontahoe");

    return <GitHubUser login={login} />;
}

// const tahoe_peaks = [
//     { name: "Freel Peak", elevation: 10891 },
//     { name: "Monument Peak", elevation: 10051 },
//     { name: "Pyramid Peak", elevation: 891 }
// ];

// function List({
//     data = [],
//     renderItem,
//     renderEmpty = (<p> This list is empty</p>)
// }) {
//     if (!data.length) return renderEmpty;
//     return (
//         <ul>
//             {data.map((item, i) => (
//                 <li key={i}>{renderItem(item)}</li>
//             ))}
//         </ul>
//     );
// }


// const bigList = [...Array(5000)].map(() => ({
//     name: faker.name.findName(),
//     email: faker.internet.email(),
//     avatar: faker.internet.avatar()
// }));

// export default function App() {
//     const renderRow = ({ index, style }) => (
//         <div style={{ ...style, ...{ display: "flex" } }}>
//             <img
//                 src={bigList[index].avatar}
//                 alt={bigList[index].name}
//                 width={50}
//             />
//             <p>
//                 {bigList[index].name} - {bigList[index].email}
//             </p>
//         </div>
//     );

//     return (
//         <FixedSizeList
//             height={window.innerHeight}
//             width={window.innerWidth - 20}
//             itemCount={bigList.length}
//             itemSize={50}
//         >
//             {renderRow}
//         </FixedSizeList>
//     );
// }

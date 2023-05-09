import React, {
    useCallback, useRef, useMemo, useEffect, useState
} from "react";
import ReactMarkdown from "react-markdown";

function useMountedRef() {
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => (mounted.current = false);
    });

    return mounted;
}

const useIterator = (
    items = [],
    initIndex = 0
) => {
    const [i, setIndex] = useState(initIndex >= 0 ? initIndex : 0);

    if (items.length === 0) {
        return [{}, () => { }, () => { }];
    }

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
    selected,
    onSelect = f => f
}) {
    const [{ name }, prev, next] = useIterator(
        repositories,
        selected ? repositories.findIndex(repo => repo.name === selected) : 0
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
    const [loading, setLoading] = useState(false);

    const mounted = useMountedRef();

    useEffect(() => {
        if (!uri) return;
        setLoading(true);
        fetch(uri)
            .then(data => {
                if (!mounted.current) {
                    throw new Error("component is not mounted");
                }
                if (data.status === 404) {
                    setLoading(false);
                    throw new Error('404 error. maybe wrong url');
                }
                return data.json();
            })
            .then(json => {
                setData(json);
            })
            .then(() => setLoading(false))
            .catch(error => {
                if (!mounted.current) return;
                setError(error);
            });
    }, [uri]);

    return { loading, data, error };
}

function Fetch({
    uri,
    renderSuccess,
    loadingFallback = <p> loading...</p>,
    renderError = error => (
        <pre>Error:{error.message} {JSON.stringify(error, null, 2)}</pre>
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
    repo,
    onSelect = f => f
}) {
    return (
        <Fetch
            uri={`https://api.github.com/users/${login}/repos`}
            renderSuccess={({ data }) => (
                <RepoMenu
                    repositories={data}
                    selected={repo}
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

function RepositoryReadme({ repo, login }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [markdown, setMarkdown] = useState("");

    const mounted = useMountedRef();

    const loadReadme = useCallback(async (login, repo) => {
        setLoading(true);
        const uri = `https://api.github.com/repos/${login}/${repo}/readme`;
        const { download_url } = await fetch(uri).then(res =>
            res.json()
        );

        if (!mounted.current) return;
        const markdown = await fetch(download_url).then(res =>
            res.text()
        );

        if (!mounted.current) return;
        setMarkdown(markdown);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!repo || !login) return;
        loadReadme(login, repo).catch(setError);
    }, [repo]);

    if (error)
        return <pre>{JSON.stringify(error, null, 2)}</pre>;
    if (loading) {
        return <p>Loading...</p>;
    }

    return <ReactMarkdown children={markdown} />;
}

export default function App() {
    const [login, setLogin] = useState("moonhighway");
    const [repo, setRepo] = useState();

    return (
        <>
            <GitHubUser login={login} />
            <UserRepositories
                login={login}
                repo={repo}
                onSelect={
                    repoName => {
                        setRepo(repoName);
                    }
                }
            />
            {repo && <RepositoryReadme repo={repo} login={login} />}
        </>
    );
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

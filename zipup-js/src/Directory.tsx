import React, { useState, useEffect } from "react"
import { Directory, File, directories, name, size, files, directory, path, file } from "./entities/File"

interface Props {
    root: Directory
}

export const DirectoryTree = ({ root }: Props) => {
    const [state, dispatch] = useState({dir: root, expanded: false, loaded: false})
    const { dir, expanded, loaded } = state;

    useEffect( () => {
        const fetchData = async () => {
            const result = await getDirInfo(path(dir)) 
            dispatch({dir: result, expanded, loaded: true})
        } 
        if (expanded && !loaded) {
            fetchData()
        }
    }, [expanded])

    return (
        <div>
            <p  onClick={() => dispatch({dir, expanded: !expanded, loaded}) }
                style={{cursor: "pointer"}}>
                { name(dir) }
            </p>
            <ul style={{ display: expanded ? "block" : "none" }}>
                { directories(dir).map((d, i) => (<li key={i}><DirectoryTree root={d} /></li>)) }
                { files(dir).map(renderFile) }
            </ul>    
        </div>
    )
}

const renderFile = (file: File) => {
    const _name = name(file);
    const _size = size(file);
    return (
        <li key={_name + _size}>
            {_name}<span>({_size})</span>
        </li>
    )
}

interface In {
    name: string
    size: number
    files: [string, number][],
    dirs: [string, number][]
  }

export const getDirInfo = async (path: string): Promise<Directory> => {
    const data = await fetch("http://localhost:8001/getdirinfo.php?dir=" + path)
        .then(r => r.json()).then(j => j as In)

        console.log(data);
    return directory(
        data.name,
        data.size,
        data.files.map(f => file(f[0], f[1])),
        data.dirs.map(d => directory(d[0], d[1]))
      );
}

const randomDirectory = (path: string): Directory => {
    return directory(
        path,
        Math.random(),
        [...Array(randomRange(0, 3))].map(() => randomFile(path)),
        [...Array(randomRange(0, 3))].map(() => randomDirectory(path + "/" + randomString(5)))    
    )
}

const randomFile = (path: string): File => {
    return file(path + "/" + randomString(5) + ".txt", Math.random() * 10)
}

function randomString(length: number): string {
   const maybe = ["hi", "ho", "what", "noe", "lets", "go", "willy"]
   return maybe[randomRange(0, maybe.length-1)]
}

function randomRange(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
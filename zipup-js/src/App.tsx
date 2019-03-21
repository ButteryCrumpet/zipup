import React, { useState, useEffect } from 'react';
import { DirectoryTree, getDirInfo } from "./Directory"
import { Directory, directory } from './entities/File';



const App = () => {
  const [state, dispatch] = useState<Directory|null>(null)

  useEffect(() => {
    const getData = async () => {
      const data = await getDirInfo("/Users/apple")
      dispatch(data)
    }
    if (state === null) {
      getData()
    }
  }, [state])

  if (state === null) {
    return <p>Loading..</p>
  }

  return (<DirectoryTree root={state} />)
}


export default App;

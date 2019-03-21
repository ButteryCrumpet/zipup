
export interface File {
  path: string;
  size: number;
}

export interface Directory extends File {
  files: File[]
  directories: Directory[]
}

type file = (path: string, size: number) => File
export const file: file = (path, size) =>
  ({ path, size })

type directory = (path: string, size: number, files?: File[], directories?: Directory[]) => Directory
export const directory: directory = (path, size, files, directories) =>
  ({ path, size, files: files ? files : [], directories: directories ? directories : [] })


type path = (file: File) => string
export const path: path = file => file.path

type name = (file: File) => string
export const name: path = file => {
  const split = file.path.split("/")
  return split[split.length - 1]
}

type size = (file: File) => number
export const size: size = file => file.size

type files = (dir: Directory) => File[]
export const files: files = dir => dir.files

type directories = (dir: Directory) => Directory[]
export const directories: directories = dir => dir.directories

export function isDir(file: File): file is File {
  return file.hasOwnProperty("files")
}

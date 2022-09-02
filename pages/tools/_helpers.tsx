

export const sumWallAssemblyParts = (wallAssembly) => {
  return wallAssembly
    .parts.map((p) => { return Number(p.weight) })
    .reduce((prev, cur) => { return prev + cur })
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export { }

export const Fp_ASCE716 = (S_DS, I_p, a_p, R_p, z = 1, h = 1) => {
  let fpMin = 0.3 * S_DS * I_p
  let fpMax = 1.6 * S_DS * I_p
  let fp = 0.4 * a_p * S_DS / (R_p / I_p) * (1 + 2 * (z / h))
  fp = Math.max(fp, fpMin)
  fp = Math.min(fp, fpMax)
  return fp
}

export const sumWallAssemblyParts = (wallAssembly) => {
  return wallAssembly
    .parts.map((p) => { return Number(p.weight) })
    .reduce((prev, cur) => { return prev + cur })
}

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export { }
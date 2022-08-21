
const FpChart = ({S_DS, I_p}) => {
  const zhIncrement = 0.05
  const zhs = Array(1/zhIncrement+1.0).fill().map((v,i)=>i*zhIncrement).reverse();
  let results = {}
  
  // ASCE 7-16: interior walls and partitions, a_p = 1.0, R_p = 2.5
  // fp/Wp = 0.4*a_p*S_DS/(R_p/I_p)*(1+2*(z/h))
  // subject to fpMin and fpMax
  let r = []
  let a_p = 1.0
  let R_p = 2.5
  let fpMin = 0.3*S_DS*I_p
  let fpMax = 1.6*S_DS*I_p
  let fp
  zhs.forEach((zh) => {
    fp = 0.4*a_p*S_DS/(R_p/I_p)*(1+2*zh)
    fp = Math.max(fp, fpMin)
    fp = Math.min(fp, fpMax)
    r.push(fp)
  })
  results["asce7-16_interior-walls"] = r

  // ASCE 7-16: exterior body, a_p = 1.0, R_p = 2.5
  // fp/Wp = 0.4*a_p*S_DS/(R_p/I_p)*(1+2*(z/h))
  // subject to fpMin and fpMax
  r = []
  a_p = 1.0
  R_p = 2.5
  fpMin = 0.3*S_DS*I_p
  fpMax = 1.6*S_DS*I_p
  zhs.forEach((zh) => {
    fp = 0.4*a_p*S_DS/(R_p/I_p)*(1+2*zh)
    fp = Math.max(fp, fpMin)
    fp = Math.min(fp, fpMax)
    r.push(fp)
  })
  results["asce7-16_exterior-body"] = r

  // ASCE 7-16: exterior connectors, a_p = 1.0, R_p = 2.5
  // fp/Wp = 0.4*a_p*S_DS/(R_p/I_p)*(1+2*(z/h))
  // subject to fpMin and fpMax
  r = []
  a_p = 1.25
  R_p = 1
  fpMin = 0.3*S_DS*I_p
  fpMax = 1.6*S_DS*I_p
  zhs.forEach((zh) => {
    fp = 0.4*a_p*S_DS/(R_p/I_p)*(1+2*zh)
    fp = Math.max(fp, fpMin)
    fp = Math.min(fp, fpMax)
    r.push(fp)
  })
  results["asce7-16_exterior-connectors"] = r
  
  return (
    <div>
      <h4 className="font-semibold py-4">ASCE 7-10 and 7-16 Chapter 13 F<sub>p</sub> Table</h4>
      <table>
        <thead className="text-center">
          <tr className="border-b border-b-gray-500">
            <td className="w-20">z/h</td>
            <td>
              <span className="text-xs">
                Interior nonstructural<br /> 
                walls and partitons<br /> 
                a<sub>p</sub> = 1.0, R<sub>p</sub> = 2.5
              </span>
            </td>
            <td>
              <span className="text-xs">
                Exterior nonstructural<br /> 
                wall elements<br />
                a<sub>p</sub> = 1.0, R<sub>p</sub> = 2.5
              </span>
            </td>
            <td>
              <span className="text-xs">
                Exterior fasteners of the<br />
                connecting system<br />
                a<sub>p</sub> = 1.25, R<sub>p</sub> = 1.0
              </span>
            </td>
          </tr>
        </thead>
        <tbody className="text-center">
          { zhs.map((element, index) => (
              <tr className="border-b border-b-gray-300 hover:bg-blue-100 even:bg-gray-100">
                <td>{element.toFixed(3)}</td>
                <td className="w-36">{results["asce7-16_interior-walls"][index].toFixed(3)}</td>
                <td className="w-36">{results["asce7-16_exterior-body"][index].toFixed(3)}</td>
                <td className="w-36">{results["asce7-16_exterior-connectors"][index].toFixed(3)}</td>
              </tr>
          ))} 
        </tbody>
      </table>
    </div>
  )
}

export { FpChart }
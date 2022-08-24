import { saveAs } from 'file-saver'
import { useEffect } from 'react';
import Router from 'next/router'
import { useFormikContext } from "formik"


const AutoSaveValues = ({ name, stateHandlers, ...props }) => {
  const initialValues = stateHandlers['initialValues']
  const setInitialValues = stateHandlers['setInitialValues']
  const formInitialized = stateHandlers['formInitialized']
  const setFormInitialized = stateHandlers['setFormInitialized']

  const { values, submitForm } = useFormikContext();
  // If the form has not been initialized, check if there are any values to
  // load from local storage. If there are, load them into initial values.
  // If the form had already been intialized, do an auto save: save the current values.
  useEffect(() => {
    if (typeof window !== 'undefined' && !formInitialized) {
      console.log('Initializing. Accessing localStorage...')
      let storedValues = localStorage.getItem(name)
      if (typeof storedValues !== 'undefined') {
        console.log('Found values. Setting initial values to:')
        setInitialValues(JSON.parse(storedValues) || {})
        console.log(initialValues)
      }
      setFormInitialized(true)
      return // exit the useEffect function so we don't trigger saving
    }
    if (typeof window !== 'undefined' && formInitialized) {
      console.log("Saving values:")
      localStorage.setItem(name, JSON.stringify(values))
      console.log(values)
    }
  })
  return null
}

const saveProjectToFile = () => {
  // https://github.com/eligrey/FileSaver.js/
  console.log("Saving project to file...")
  let data = {}
  Object.keys(localStorage).forEach((key) => {
    data[key] = localStorage.getItem(key)
  })
  data['__meta__'] = JSON.stringify({
    "app": "CFS Tools",
    "author": "Justin Martinez",
    "version": "0.1"
  })
  let blob = new Blob([JSON.stringify(data)], { type: "application/json" })
  saveAs(blob, "CFS Tools Project.json")
}

const loadProjectFromFile = () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
  console.log("Loading project from file")
  let input = document.getElementById("file-input")
  input.value = null
  input.click()
}

const handleLoadProjectFromFile = (event) => {
  console.log("Handling selected file...")
  const reader = new FileReader()
  reader.readAsText(event.target.files[0])
  let data = {}
  reader.onload = () => {
    try {
      data = JSON.parse(reader.result)
      if (!("__meta__" in data)) {
        throw ("Invalid file selected")
      } else {
        console.log("Found file contents")
        localStorage.clear()
        Object.keys(data).forEach((key) => {
          console.log("Loading " + key)
          localStorage.setItem(key, data[key])
        })
        // refresh the page
        // https://flaviocopes.com/nextjs-force-page-refresh/
        Router.reload(window.location.pathname)
      }
    } catch (e) {
      alert("Invalid file selected")
      console.log(e)
    }
  }
}

const FpChart = ({ S_DS, I_p }) => {
  const zhIncrement = 0.05
  const zhs = Array(1 / zhIncrement + 1.0).fill().map((v, i) => i * zhIncrement).reverse();
  let results = {}

  // ASCE 7-16: interior walls and partitions, a_p = 1.0, R_p = 2.5
  // fp/Wp = 0.4*a_p*S_DS/(R_p/I_p)*(1+2*(z/h))
  // subject to fpMin and fpMax
  let r = []
  let a_p = 1.0
  let R_p = 2.5
  let fpMin = 0.3 * S_DS * I_p
  let fpMax = 1.6 * S_DS * I_p
  let fp
  zhs.forEach((zh) => {
    fp = 0.4 * a_p * S_DS / (R_p / I_p) * (1 + 2 * zh)
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
  fpMin = 0.3 * S_DS * I_p
  fpMax = 1.6 * S_DS * I_p
  zhs.forEach((zh) => {
    fp = 0.4 * a_p * S_DS / (R_p / I_p) * (1 + 2 * zh)
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
  fpMin = 0.3 * S_DS * I_p
  fpMax = 1.6 * S_DS * I_p
  zhs.forEach((zh) => {
    fp = 0.4 * a_p * S_DS / (R_p / I_p) * (1 + 2 * zh)
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
          {zhs.map((element, index) => (
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

export { AutoSaveValues, FpChart, saveProjectToFile, loadProjectFromFile, handleLoadProjectFromFile }
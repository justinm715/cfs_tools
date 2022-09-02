import { saveAs } from 'file-saver'
import { useEffect } from 'react';
import Router from 'next/router'
import { useFormikContext } from "formik"

import { Field, FieldArray } from "formik"
import { ChevronDownIcon, PlusSmIcon, XIcon, PlusIcon, PencilIcon } from '@heroicons/react/solid'


import * as Helpers from './_helpers'

export const AutoSaveValues = ({ name, stateHandlers, ...props }) => {
  const initialValues = stateHandlers['initialValues']
  const setInitialValues = stateHandlers['setInitialValues']
  const formInitialized = stateHandlers['formInitialized']
  const setFormInitialized = stateHandlers['setFormInitialized']

  const { values, submitForm, setValues } = useFormikContext();
  // If the form has not been initialized, check if there are any values to
  // load from local storage. If there are, load them into initial values.
  // If the form had already been intialized, do an auto save: save the current values.
  useEffect(() => {
    if (typeof window !== 'undefined' && !formInitialized) {
      console.log('Initializing. Accessing localStorage...')
      let storedValues = localStorage.getItem(name)
      if (typeof storedValues !== 'undefined') {
        console.log('Found values. Setting initial values to:')
        let newValues = JSON.parse(storedValues) || {}
        setInitialValues(newValues)
        setValues(newValues)
        console.log(initialValues)
      }
      setFormInitialized(true)
      return // exit the useEffect function so we don't trigger saving
    } else if (typeof window !== 'undefined' && formInitialized) {
      console.log("Saving values:")
      if (Object.keys(values).length > 0) {
        localStorage.setItem(name, JSON.stringify(values))
        console.log(values)
      }
    }
  })
  return null
}

export const saveProjectToFile = () => {
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

export const loadProjectFromFile = () => {
  // https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications
  console.log("Loading project from file")
  let input = document.getElementById("file-input")
  input.value = null
  input.click()
}

export const handleLoadProjectFromFile = (event) => {
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

export const FpChart = ({ S_DS, I_p }) => {
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
            <tr className="border-b border-b-gray-300 hover:bg-blue-100 even:bg-gray-100" key={"z_" + element.toFixed(3)}>
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

export const AddNewInteriorSchedule = ({ wallAssemblies }) => {
  return (
    <Field as="select" name="new" className="border border-gray-400 py-1 mx-2 text-sm">
      <option value="0" key="invalid-new-wall-assembly">Select a wall assembly...</option>
      {wallAssemblies.map((wallAssembly, wallAssemblyIndex) => (
        <option
          value={wallAssembly.UUID}
          key={"newWallAssembly-" + wallAssemblyIndex}
        >
          {wallAssembly.name} -
          L/{wallAssembly.deflectionLimit},
          {Helpers.sumWallAssemblyParts(wallAssembly).toFixed(2)} PSF
        </option>
      ))}
    </Field>
  )
}

export const ActiveInteriorScheduleForm = ({ activeInteriorSchedule }) => {
  if (activeInteriorSchedule == null) {
    // TODO: Uncomment this return for no schedule selected. Defaulting to 0 for dev

    return (
      <div>
        <p>No schedule selected.</p>
      </div>
    )
    //activeInteriorSchedule = 0
  }
  const { values } = useFormikContext();

  return (
    <div>
      <p className="text-green-400 hidden">
        Currently selected schedule {activeInteriorSchedule}
      </p>
      <h3 className="text-xl mb-2 mt-2">Schedule Parameters</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          {/* Stud Sizes */}
          <span className="pr-4 w-32 inline-block">Stud Sizes:</span>
          <label className="hover:bg-blue-200 mr-6 p-1">
            <Field type="checkbox" name={`interiorSchedules[${activeInteriorSchedule}].studSizes-162`} />
            <span className="pl-2">1 5/8"</span>
          </label>
          <label className="hover:bg-blue-200 mr-6 p-1">
            <Field type="checkbox" name={`interiorSchedules[${activeInteriorSchedule}].studSizes-250`} />
            <span className="pl-2">2 1/2"</span>
          </label>
          <label className="hover:bg-blue-200 mr-6 p-1">
            <Field type="checkbox" name={`interiorSchedules[${activeInteriorSchedule}].studSizes-362`} />
            <span className="pl-2">3 5/8"</span>
          </label>
          <label className="hover:bg-blue-200 mr-6 p-1">
            <Field type="checkbox" name={`interiorSchedules[${activeInteriorSchedule}].studSizes-400`} />
            <span className="pl-2">4"</span>
          </label>
          <label className="hover:bg-blue-200 mr-6 p-1">
            <Field type="checkbox" name={`interiorSchedules[${activeInteriorSchedule}].studSizes-600`} />
            <span className="pl-2">6"</span>
          </label>
          <label className="hover:bg-blue-200 mr-6 p-1">
            <Field type="checkbox" name={`interiorSchedules[${activeInteriorSchedule}].studSizes-800`} />
            <span className="pl-2">8"</span>
          </label>
        </div>

        {/* Design which members */}
        <div className="col-span-2">
          <span className="pr-4 w-32 inline-block">Design Type:</span>
          <label className="hover:bg-blue-200 mr-6 p-1">
            <Field type="checkbox" name={`interiorSchedules[${activeInteriorSchedule}].designType-typicalStuds`} />
            <span className="pl-2">Typical Studs</span>
          </label>
          <label className="hover:bg-blue-200 mr-6 p-1">
            <Field type="checkbox" name={`interiorSchedules[${activeInteriorSchedule}].designType-headers`} />
            <span className="pl-2">Headers</span>
          </label>
          <label className="hover:bg-blue-200 mr-6 p-1">
            <Field type="checkbox" name={`interiorSchedules[${activeInteriorSchedule}].designType-jambs`} />
            <span className="pl-2">Jambs</span>
          </label>
          <label className="hover:bg-blue-200 mr-6 p-1">
            <Field type="checkbox" name={`interiorSchedules[${activeInteriorSchedule}].designType-sills`} />
            <span className="pl-2">Sills</span>
          </label>
        </div>

        {/* column 1 */}
        <div className="border-r m-r-1">
          {/* spacing */}
          <div>
            <span className="pr-4 w-32 inline-block mb-2">Spacing:</span>
            <Field type="text" className="border border-gray-400 w-12 pr-2 text-right" name={`interiorSchedules[${activeInteriorSchedule}].spacing`} />
            <span className="pl-2">in.</span>
          </div>

          {/* bracing */}
          <div>
            <span className="pr-4 w-32 inline-block mb-2">Bracing:</span>
            <Field type="text" className="border border-gray-400 w-12 pr-2 text-right" name={`interiorSchedules[${activeInteriorSchedule}].bracing`} />
            <span className="pl-2">in.</span>
          </div>

          {/* wall heights */}
          <FieldArray name={`interiorSchedules[${activeInteriorSchedule}][wallHeights]`} render={(wallHeightsArrayHelper) => (
            <>
              <span className="pr-4 block mb-2">
                Wall Heights:
                <button type="button" onClick={() => { wallHeightsArrayHelper.push({ span: "" }) }}>
                  <PlusIcon className="mx-2 inline h-4 w-4 text-green-500" aria-hidden="true" />
                </button>
              </span>
              <div className="ml-12">
                {(values.interiorSchedules[activeInteriorSchedule].wallHeights && values.interiorSchedules[activeInteriorSchedule].wallHeights.length > 0) ?
                  (values.interiorSchedules[activeInteriorSchedule].wallHeights.map((wallHeight, wallHeightIndex) => (
                    <>
                      <div className="mb-2">
                        <Field type="text" className="border border-gray-400 w-12 pr-2 text-right" name={`interiorSchedules[${activeInteriorSchedule}][wallHeights][${wallHeightIndex}].span`} />
                        <span className="pl-2 inline">ft</span>
                        <button type="button" onClick={() => { wallHeightsArrayHelper.remove(wallHeightIndex) }}>
                          <XIcon className="mx-2 inline h-3 w-3 text-red-400" aria-hidden="true" />
                        </button>
                      </div>
                    </>
                  ))
                  ) : ""}
              </div>
            </>
          )} />

          {/* opening widths */}
          <FieldArray name={`interiorSchedules[${activeInteriorSchedule}][openingWidths]`} render={(openingWidthsArrayHelper) => (
            <>
              <span className="pr-4 block mb-2">
                Opening Widths:
                <button type="button" onClick={() => { openingWidthsArrayHelper.push({ span: "" }) }}>
                  <PlusIcon className="mx-2 inline h-4 w-4 text-green-500" aria-hidden="true" />
                </button>
              </span>
              <div className="ml-12">
                {(values.interiorSchedules[activeInteriorSchedule].openingWidths && values.interiorSchedules[activeInteriorSchedule].openingWidths.length > 0) ?
                  (values.interiorSchedules[activeInteriorSchedule].openingWidths.map((openingWidth, openingWidthIndex) => (
                    <>
                      <div className="mb-2">
                        <Field type="text" className="border border-gray-400 w-12 pr-2 text-right" name={`interiorSchedules[${activeInteriorSchedule}][openingWidths][${openingWidthIndex}].span`} />
                        <span className="pl-2 inline">ft</span>
                        <button type="button" onClick={() => { openingWidthsArrayHelper.remove(openingWidthIndex) }}>
                          <XIcon className="mx-2 inline h-3 w-3 text-red-400" aria-hidden="true" />
                        </button>
                      </div>
                    </>
                  ))
                  ) : ""}
              </div>
            </>
          )} />

          {/* header height */}
          <span className="pr-4 w-32 inline-block mb-2">Header Height:</span>
          <Field type="text" className="border border-gray-400 w-12 pr-2 text-right" name={`interiorSchedules[${activeInteriorSchedule}].headerHeight`} />
          <span className="pl-2">ft.</span>

          {/* small-span headers trib */}
          <div>
            <label>
              <div className="hover:bg-blue-200">
                <Field type="checkbox" className="mx-2" name={`interiorSchedules[${activeInteriorSchedule}].smallSpanHeaderTrib`} />
                <span>Small-Span Headers</span>
                <p className="text-sm mx-6">
                  Design small-span headers (4.25 ft. or less) for dead load from tributary wall height equal to span of header.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* column 2 */}
        <div>

          {/* show wall assembly properties */}
          <h4 className="font-semibold">Wall Assembly</h4>
          <p>Properties were imported from wall assembly definition:</p>
          <ul className="ml-4">
            <li>
              - Dead Weight:
              <span className="border-b border-b-gray-400 ml-3">
                {Helpers.sumWallAssemblyParts(values.interiorSchedules[activeInteriorSchedule].wallAssembly)} lbs/sq ft
              </span>
            </li>
            <li>
              - Uniform Live Load:
              <span className="border-b border-b-gray-400 ml-3">
                {values.interiorSchedules[activeInteriorSchedule].wallAssembly.uniformLive} lbs/sq ft
              </span>
            </li>
            <li>
              - Live Load Deflection Criteria:
              <span className="border-b border-b-gray-400 ml-3">
                L/{values.interiorSchedules[activeInteriorSchedule].wallAssembly.deflectionLimit}
              </span>
            </li>
          </ul>

          {/* seismic option */}
          <h4 className="font-semibold mt-6">Seismic Option</h4>
          <label className="block">
            <Field type="radio" className="mx-2" name={`interiorSchedules[${activeInteriorSchedule}].seismicFpOption`} value="max" />Use F<sub>p</sub> for max z/h
          </label>
          <label>
            <Field type="radio" className="mx-2" name={`interiorSchedules[${activeInteriorSchedule}].seismicFpOption`} value="custom" />Use custom nominal F<sub>p</sub> :
            <Field type="text" className="border border-gray-400 w-16 pr-2 text-right ml-2" name={`interiorSchedules[${activeInteriorSchedule}].seismicFpOptionCustomValue`} />
          </label>

        </div>
      </div>
    </div>
  )
}

export const ActiveInteriorScheduleResultsTables = () => {
  return (
    <p>
      ActiveInteriorScheduleResultsTables
    </p>
  )
}
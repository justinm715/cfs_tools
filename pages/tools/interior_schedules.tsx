import Layout from '../../components/layout'
import Head from "next/head";
import { useEffect, useState } from 'react';
import moment from 'moment'

import { Formik, Form, useField, Field, FieldArray, useFormikContext } from "formik"
import { ChevronDownIcon, PlusSmIcon, XIcon, PlusIcon, PencilIcon } from '@heroicons/react/solid'

import { AutoSaveValues, AddNewInteriorSchedule } from './_utils'


export default function InteriorSchedules() {

  const [initialValues, setInitialValues] = useState({})
  const [formInitialized, setFormInitialized] = useState(false)

  // for <AutoSaveValues ... stateHandlers={stateHandlers} />
  const stateHandlers = {
    initialValues: initialValues,
    setInitialValues: setInitialValues,
    formInitialized: formInitialized,
    setFormInitialized: setFormInitialized
  }

  const [designCriteria, setDesignCriteria] = useState(null)
  const [designCriteriaInitialized, setDesignCriteriaInitialized] = useState(false)
  useEffect(() => {
    // load design criteria
    if (typeof window !== 'undefined' && !designCriteriaInitialized) {
      console.log('Initializing Design Criteria. Accessing localStorage...')
      let storedDesignCriteria = localStorage.getItem('cfs_tools_design_criteria')
      if (typeof storedDesignCriteria == 'undefined') {
        console.log('Design Criteria Not Found') // leave as null
      } else {
        // see if design criteria has at least 1 wall type defined and seismic params to work with
        let parsedDesignCriteria = JSON.parse(storedDesignCriteria) || {}
        if (
          Number(parsedDesignCriteria["I_p"]) >= 1.0 &&
          Number(parsedDesignCriteria["S_DS"]) >= 1.0 &&
          parsedDesignCriteria["wallAssemblies"] != undefined &&
          parsedDesignCriteria["wallAssemblies"].length > 0
        ) {
          console.log('Design Criteria Found')
          setDesignCriteria(parsedDesignCriteria)
        } else {
          console.log('Design Criteria Not Found') // leave as null
        }
      }
      setDesignCriteriaInitialized(true)
    }

  })

  return (
    <Layout>
      <Head>
        <title>Interior Schedules</title>
      </Head>

      <div className="grid grid-cols-3">
        <div className="overflow-y-auto h-[calc(100vh-65px)] col-span-2">
          <div className="overflow-y-auto p-2">
            <h2 className="text-2xl mb-4">Interior Schedules</h2>

            <Formik
              initialValues={initialValues}
              onSubmit={
                async () => {

                }
              }
            >{props => (
              <Form>
                {(designCriteria != null) ? (
                  <>
                    { /* select assembly, add schedule */}
                    <FieldArray name="interiorSchedules" render={(interiorSchedulesArrayHelpers) => (
                      <>
                        <p>Create a new schedule for:
                          <AddNewInteriorSchedule wallAssemblies={designCriteria["wallAssemblies"]} />
                          <button
                            className="py-1 px-2 border border-gray-400 bg-gray-100 text-sm"
                            onClick={() => {
                              let selectedWallAssemblyUUID = props.values.new || "0"
                              if (selectedWallAssemblyUUID == "0") {
                                alert("Invalid assembly selected.")
                              } else {
                                let selectedWallAssembly = designCriteria["wallAssemblies"].find((e) => e.UUID == selectedWallAssemblyUUID)
                                interiorSchedulesArrayHelpers.push({ wallAssembly: selectedWallAssembly, created: moment() })
                                console.log("Added new interior schedule")
                                console.log(selectedWallAssembly)
                              }
                            }}
                          >
                            Add
                          </button>
                        </p>
                        <hr className="my-2 border-gray-400" />

                        { /* list schedules */}
                        {(props.values.interiorSchedules && props.values.interiorSchedules.length > 0) ? (
                          <table className="text-sm">
                            <thead>
                              <tr className="border-b border-b-gray-400">
                                <td className="p-1 border-r border-r-gray-400">Edit</td>
                                <td className="p-1 border-r border-r-gray-400">Wall Assembly</td>
                                <td className="p-1 border-r border-r-gray-400">Created</td>
                                <td className="p-1 border-r border-r-gray-400">Last Run</td>
                                <td className="p-1">Delete</td>
                              </tr>
                            </thead>
                            <tbody>
                              {props.values.interiorSchedules.map((schedule, scheduleIndex) => (
                                <tr className="border-b border-b-gray-400 last:border-0 hover:bg-blue-100" key={'schedule-' + scheduleIndex}>
                                  <td className="p-1 border-r border-r-gray-400 text-center">
                                    <button type="button" onClick={() => { interiorSchedulesArrayHelpers.remove(scheduleIndex) }}>
                                      <PencilIcon className="mx-2 h-4 w-4 text-green-600" aria-hidden="true" />
                                    </button>
                                  </td>
                                  <td className="p-1 border-r border-r-gray-400">{schedule.wallAssembly.name}</td>
                                  <td className="p-1 border-r border-r-gray-400">{moment(schedule.created).calendar()}</td>
                                  <td className="p-1 border-r border-r-gray-400">TODO: Last Run</td>
                                  <td className="p-1 text-center">
                                    <button type="button" onClick={() => { interiorSchedulesArrayHelpers.remove(scheduleIndex) }}>
                                      <XIcon className="mx-2 h-3 w-3 text-red-400" aria-hidden="true" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) :
                          <p>You have no schedules defined.</p>
                        }

                        { /* active schedule */}
                        <p>

                        </p>
                      </>
                    )} /> {/* end interiorSchedules FieldArray*/}
                  </>
                ) :
                  <>
                    { /* no design criteria; show error */}
                    <p>No wall assemblies defined. Please define some in Design Criteria</p>
                  </>
                }

                <AutoSaveValues name="cfs_tools_interior_schedule" stateHandlers={stateHandlers} />
              </Form>
            )}</Formik>


          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-65px)] p-2 bg-gray-100">
          <p>Results will be displayed here.</p>
        </div>
      </div>



      {/* List of wall types */}

    </Layout >
  )
}
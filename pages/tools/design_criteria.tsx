import Layout from '../../components/layout'
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from 'react';

import { Formik, Form, useField, Field, FieldArray, useFormikContext } from "formik"
import * as Yup from "yup"
import { Menu } from '@headlessui/react'
import { ChevronDownIcon, PlusSmIcon, XIcon, PlusIcon } from '@heroicons/react/solid'

import { AutoSaveValues, FpChart, saveProjectToFile, loadProjectFromFile, handleLoadProjectFromFile } from './_utils'


const SimpleTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <div className="mb-1 col-span-1">
        <label htmlFor={props.id || props.name}>{label}</label>
      </div>
      <div className="col-span-1">
        <input
          className="text-input border border-gray-500 ml-1 w-32" {...field} {...props} />
      </div>
      <div className="col-span-2">
        {meta.touched && meta.error ? (
          <span className="text-red-500">{meta.error}</span>
        ) : null}
      </div>
    </>
  );
};

const SimpleSelectInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <div className="mb-1">
        <label htmlFor={props.id || props.name}>{label}</label>
      </div>
      <div>
        <select {...field} {...props} />
      </div>
      <div>
        {meta.touched && meta.error ? (
          <span className="text-red-500">{meta.error}</span>
        ) : null}
      </div>
    </>
  );
};



const DesignCriteria: NextPage = () => {

  // https://stackoverflow.com/questions/59987391/how-to-set-initial-values-to-formik-using-axios-with-typescript

  const [initialValues, setInitialValues] = useState({})
  const [formInitialized, setFormInitialized] = useState(false)
  const stateHandlers = {
    initialValues: initialValues,
    setInitialValues: setInitialValues,
    formInitialized: formInitialized,
    setFormInitialized: setFormInitialized
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <Layout>
      <Head>
        <title>Design Criteria</title>
      </Head>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={
          Yup.object(
            {
              projectName: Yup.string().required("Required"),
              projectNumber: Yup.string().required("Required"),
              S_DS: Yup.number().positive("Must be a positive number"),
            }
          )
        }
        onSubmit={
          async () => {

          }
        }
      >
        {props => (
          <Form>
            <div className="mb-8">
              <button onClick={saveProjectToFile} className="px-2 py-1 border border-gray-400 bg-blue-100 mr-2">Save</button>
              <button onClick={loadProjectFromFile} className="px-2 py-1 border border-gray-400 bg-blue-100">Load</button>
              <input id="file-input" onChange={handleLoadProjectFromFile} type="file" name="projectFile" accept=".json" className="hidden" />
            </div>

            <h2 className="text-2xl mb-8">Design Criteria</h2>

            <h3 className="font-bold">Project Meta</h3>
            <div className="grid grid-cols-6 py-1">
              <SimpleTextInput label="Project Name" name="projectName" />
            </div>
            <div className="grid grid-cols-6 py-1">
              <SimpleTextInput label="Project Number" name="projectNumber" />
            </div>
            <div className="grid grid-cols-6 py-1">
              <div className="mb-1">
                <label htmlFor="projectCode2">Project Code</label>
              </div>
              <div >
                <Field as="select" name="projectCode" className="border border-gray-500 ml-1">
                  <option value="CBC 2019">CBC 2019</option>
                  <option value="CBC 2016">CBC 2016</option>
                </Field>
              </div>
              <div className="col-span-4">
                <h3>Referenced Standards</h3>
                <p>CBC 2019: ASCE 7-16, ACI 318-14, AISI S100-16, AISI S400-15/S1-16</p>
                <p>CBC 2016: ASCE 7-10, ACI 318-14, AISI S100-12, AISI S212-07(2012)</p>
              </div>
            </div>

            { /* Seismic Parameters */}
            <h3 className="font-bold border-t border-t-gray-300 mt-2 pt-2">Seismic Parameters</h3>

            <div className="grid grid-cols-6 py-1">
              <div className="mb-1">
                <label htmlFor="I_p">I<sub>p</sub></label>
              </div>
              <div >
                <Field as="select" name="I_p" className="border border-gray-500 ml-1">
                  <option></option>
                  <option value="1.0">1.0</option>
                  <option value="1.5">1.5</option>
                </Field>
              </div>
              <div className="col-span-4">
                <p>Seismic importance factor</p>
              </div>
            </div>

            <div className="grid grid-cols-6 py-1">
              <div className="mb-1">
                <label htmlFor="S_DS">S<sub>DS</sub></label>
              </div>
              <div>
                <Field className="text-input border border-gray-500 ml-1 w-32" name="S_DS" />
              </div>
              <div>
                {(props.touched.S_DS && props.errors.S_DS) ? (
                  <span className="text-red-500">{props.errors.S_DS}</span>
                ) : ""}
              </div>
            </div>

            <FpChart S_DS={props.values.S_DS} I_p={props.values.I_p} />

            { /* Wall Assemblies */}
            { /* https://tailwindui.com/components/application-ui/elements/dropdowns */}
            <h3 className="font-bold border-t border-t-gray-300 mt-2 pt-2 mb-2">Wall Assemblies</h3>

            <FieldArray name="wallAssemblies"
              render={arrayHelpers => (
                <>
                  <button
                    onClick={() => arrayHelpers.push(
                      {
                        name: "Unnamed Wall Assembly",
                        parts: [ // part weight is in psf
                          { description: '5/8" Gypsum Board', weight: '2.5' },
                          { description: 'Stud Framing', weight: '1.5' },
                          { description: 'Insulation + Misc', weight: '0.5' }
                        ]
                      }
                    )}
                    className="inline-flex justify-center border bg-gray-200 border-gray-300 shadow-sm px-2 py-1 bg-blue-100 text-sm font-medium text-gray-700 hover:bg-blue-200">
                    Add
                    <PlusSmIcon className="h-5 w-5 ml-2 -mr-1" />
                  </button>

                  { /* Add & Add Preset Buttons */}
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-center w-full border bg-gray-200 border-gray-300 shadow-sm px-2 py-1 bg-blue-100 text-sm font-medium text-gray-700 hover:bg-blue-200 ">
                        Add Preset
                        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                      </Menu.Button>
                    </div>

                    { /* Add Preset Dropdown */}
                    <Menu.Items className="origin-top-right absolute right-0 w-56 shadow-lg border border-gray-200 bg-white focus:outline-none z-20">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-2 py-1 text-sm')}
                              onClick={() => {
                                arrayHelpers.push({
                                  name: "(1) 5/8\" Gyp Ea Side",
                                  parts: [
                                    { description: "(1) 5/8\" Gypsum Board", weight: 2.5 },
                                    { description: "Stud Framing", weight: 1.5 },
                                    { description: "Insulation & Misc", weight: 0.5 },
                                    { description: "(1) 5/8\" Gypsum Board", weight: 2.5 }
                                  ],
                                  uniformLive: 5,
                                  deflectionLimit: 240
                                })
                              }}
                            >
                              (1) 5/8" Gyp Ea Side
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-2 py-1 text-sm')}
                              onClick={() => {
                                arrayHelpers.push({
                                  name: "(2) 5/8\" Gyp Ea Side",
                                  parts: [
                                    { description: "(2) 5/8\" Gypsum Board", weight: 5.0 },
                                    { description: "Stud Framing", weight: 1.5 },
                                    { description: "Insulation & Misc", weight: 0.5 },
                                    { description: "(2) 5/8\" Gypsum Board", weight: 5.0 }
                                  ],
                                  uniformLive: 5,
                                  deflectionLimit: 240
                                })
                              }}
                            >
                              (2) 5/8" Gyp Ea Side
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-2 py-1 text-sm')}
                              onClick={() => {
                                arrayHelpers.push({
                                  name: "(2) 5/8\" Gyp + (1) 1\" Gyp Shaft",
                                  parts: [
                                    { description: "(2) 5/8\" Gypsum Board", weight: 5.0 },
                                    { description: "Shaft Framing", weight: 1.0 },
                                    { description: "Insulation & Misc", weight: 0.5 },
                                    { description: "(1) 1\" Gypsum Board", weight: 4.0 }
                                  ],
                                  uniformLive: 5,
                                  deflectionLimit: 240
                                })
                              }}
                            >
                              (2) 5/8" Gyp + 1" Gyp Shaft
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>


                  <div className="pt-2 my-3 w-96">
                    { /* Start Wall Assembly */}
                    {props.values.wallAssemblies && props.values.wallAssemblies.length > 0 ? (
                      props.values.wallAssemblies.map((wallAssembly, assemblyIndex) => (
                        <div className="mb-4 p-3 border">
                          <Field name={`wallAssemblies[${assemblyIndex}].name`} as="input" className="font-bold border-b border-b-gray-500 w-80" />

                          { /* Delete Wall Assembly */}
                          <button className="float-right" onClick={() => { arrayHelpers.remove(assemblyIndex) }}>
                            <XIcon className="h-3 w-3 text-red-400" aria-hidden="true" />
                          </button>

                          <h5 className="mt-2 text-sky-500">Assembly Parts</h5>

                          { /* List Parts */}
                          <FieldArray name={`wallAssemblies[${assemblyIndex}].parts`}
                            render={
                              partArrayHelpers => (
                                <div className="block ml-4 my-3">
                                  {wallAssembly.parts && wallAssembly.parts.length > 0 ? (wallAssembly.parts.map((wallAssemblyPart, partIndex) => (

                                    <div key={partIndex}>

                                      { /* Part name and weight (lbs/sq ft) */}

                                      <Field
                                        name={`wallAssemblies[${assemblyIndex}].parts[${partIndex}].description`} as="input" className="border-b border-b-gray-400 mr-3 w-48" placeholder="Unnamed Part"
                                      />

                                      <Field
                                        name={`wallAssemblies[${assemblyIndex}].parts[${partIndex}].weight`} as="input" className="border-b border-b-gray-400 w-8" placeholder="0"
                                      />

                                      <span className="ml-2">lbs/sq ft</span>

                                      { /* Delete Part */}
                                      <button onClick={() => { partArrayHelpers.remove(partIndex) }}>
                                        <XIcon className="-mr-1 ml-2 h-3 w-3 text-red-400" aria-hidden="true" />
                                      </button>

                                    </div>

                                  ))) : (
                                    <div>
                                      This assembly has no parts.
                                    </div>
                                  )}


                                  { /* Sum part weights and show total */}
                                  {wallAssembly.parts && wallAssembly.parts.length > 0 ? (
                                    <div className="block mt-2">
                                      <span className="inline-block w-48 mr-3">Total</span>
                                      <span className="inline-block w-8">
                                        {
                                          wallAssembly
                                            .parts.map((p) => { return Number(p.weight) })
                                            .reduce((prev, cur) => { return prev + cur })
                                            .toFixed(2)
                                        }
                                      </span>
                                      <span className="ml-2">lbs/sq ft</span>
                                    </div>
                                  ) : ""}

                                  { /* Add part */}
                                  <button className="text-sm border px-2 mt-2 bg-blue-100 hover:bg-blue-200"
                                    onClick={
                                      () => (partArrayHelpers.push({}))}
                                  >
                                    Add Part <PlusIcon className="h-3 w-3 ml-1 -mt-1 inline" aria-hidden="true" />
                                  </button>
                                </div>
                              )
                            }
                          />

                          <h5 className="mt-2 text-sky-500">Live Load Criteria</h5>
                          <div className="block">
                            <label className="w-48 ml-4 mr-4 inline-block">
                              Uniform Live
                            </label>
                            <Field as="select" name={`wallAssemblies[${assemblyIndex}].uniformLive`} className="border border-gray-400 mt-2">
                              <option value="5">5 lbs/sq ft</option>
                              <option value="10">10 lbs/sq ft</option>
                              <option value="15">15 lbs/sq ft</option>
                              <option value="20">20 lbs/sq ft</option>
                            </Field>
                            <br />
                            <label className="w-48 ml-4 mr-4 inline-block">
                              Deflection
                            </label>
                            <Field as="select" name={`wallAssemblies[${assemblyIndex}].deflectionLimit`} className="border border-gray-400 mt-2">
                              <option value="120">L/120</option>
                              <option value="240">L/240</option>
                              <option value="360">L/360</option>
                              <option value="480">L/480</option>
                              <option value="600">L/600</option>
                              <option value="720">L/720</option>
                              <option value="1000">L/1000</option>
                            </Field>
                          </div>
                        </div>
                      ))
                    ) : "No wall assemblies defined. Why don't you define some?"}
                    { /* End Wall Assembly */}
                  </div>
                </>
              )} />



            <h3 className="font-bold border-t border-t-gray-300 mt-2 pt-2">Soffit Assemblies</h3>

            {
              /*
              * TODO:
              * - code
              * - S_DS
              * - Interior / Exterior
              */
            }
            <AutoSaveValues name="cfs_tools_project" stateHandlers={stateHandlers} />
          </Form>
        )
        }
      </Formik >

    </Layout >
  )
}

export default DesignCriteria
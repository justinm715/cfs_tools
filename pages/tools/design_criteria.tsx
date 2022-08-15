import Layout from '../../components/layout'
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from 'react';

import { Formik, Form, useField, Field, FieldArray, useFormikContext } from "formik"
import * as Yup from "yup"
import { Menu } from '@headlessui/react'
import { ChevronDownIcon, PlusSmIcon, XIcon } from '@heroicons/react/solid'


const SimpleTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <div className="mb-1">
        <label htmlFor={props.id || props.name}>{label}</label>
      </div>
      <div>
        <input
          className="text-input border border-gray-500 ml-1" {...field} {...props} />
      </div>
      <div>
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

  const [initialValues, setInitialValues] = useState({
    projectName: 'Test Project'
  })
  const [formInitialized, setFormInitialized] = useState(false)

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const AutoSaveValues = ({ name, ...props }) => {
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

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={
          Yup.object(
            {
              projectName: Yup.string().required("Required"),
              projectNumber: Yup.string().required("Required")
            }
          )
        }
      /*onSubmit={
        async () => {
 
        }
      }*/
      >
        {props => (
          <Form>
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

            <h3 className="font-bold border-t border-t-gray-300 mt-2 pt-2">Seismic Parameters</h3>


            <h3 className="font-bold border-t border-t-gray-300 mt-2 pt-2 mb-2">Wall Assemblies</h3>

            { /* https://tailwindui.com/components/application-ui/elements/dropdowns */}

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
                    className="inline-flex justify-center border bg-gray-200 border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Add
                    <PlusSmIcon className="h-5 w-5 ml-2 -mr-1" />
                  </button>

                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex justify-center w-full border bg-gray-200 border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 ">
                        Add Preset
                        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                      </Menu.Button>
                    </div>

                    <Menu.Items className="origin-top-right absolute right-0 w-56 shadow-lg border border-gray-200 bg-white focus:outline-none z-20">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-2 py-1 text-sm')}
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
                            >
                              (2) 5/8" Gyp + 1" Gyp Shaft
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Menu>

                  <div className="pt-2">
                    {props.values.wallAssemblies && props.values.wallAssemblies.length > 0 ? (
                      props.values.wallAssemblies.map((wallAssembly, assemblyIndex) => (
                        <div className="mb-4">
                          <Field name={`wallAssemblies[${assemblyIndex}].name`} as="input" className="border-b border-b-gray-500 block w-80" />
                          <FieldArray name={`wallAssemblies[${assemblyIndex}].parts`}
                            render={
                              partArrayHelpers => (
                                <>
                                  {wallAssembly.parts && wallAssembly.parts.length > 0 ? (
                                    wallAssembly.parts.map((wallAssemblyPart, partIndex) => (
                                      <div className="block ml-4">
                                        <Field
                                          name={`wallAssemblies[${assemblyIndex}].parts[${partIndex}].description`} as="input" className="border-b border-b-gray-400 mr-3"
                                        />
                                        <Field
                                          name={`wallAssemblies[${assemblyIndex}].parts[${partIndex}].weight`} as="input" className="border-b border-b-gray-400 w-8"
                                        /> lbs/sq ft
                                        <button
                                          onClick={()=>{}}
                                        >
                                          <XIcon className="-mr-1 ml-2 h-3 w-3 text-red-400" aria-hidden="true" />
                                        </button>
                                      </div>
                                    ))

                                  ) : "This assembly has no parts. Why don't you add some?"}
                                </>
                              )
                            }
                          />
                        </div>
                      ))
                    ) : "No wall assemblies defined. Why don't you define some?"}
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
            <AutoSaveValues name="designCriteria" />
          </Form>
        )
        }
      </Formik >

    </Layout >
  )
}

export default DesignCriteria
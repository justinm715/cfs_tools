import Layout from '../../components/layout'
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from 'react';

import { Formik, Form, useField, useFormikContext } from "formik"
import * as Yup from "yup"
import { PersistFormikValues } from 'formik-persist-values';


const MyTextInput = ({ label, ...props }) => {
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





const DesignCriteria: NextPage = () => {

  // https://stackoverflow.com/questions/59987391/how-to-set-initial-values-to-formik-using-axios-with-typescript

  const [initialValues, setInitialValues] = useState(null)
  const [formInitialized, setFormInitialized] = useState(false)

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
      <p>This is Design Criteria</p>
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
        <Form>
          <div className="grid grid-cols-6">
            <MyTextInput label="Project Name" name="projectName" type="text" />
          </div>
          <div className="grid grid-cols-6">
            <MyTextInput label="Project Number" name="projectNumber" type="text" />
          </div>
          <AutoSaveValues name="designCriteria" />
        </Form>
      </Formik>

    </Layout>
  )
}

export default DesignCriteria
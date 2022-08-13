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

  let loadedValues = false

  // https://stackoverflow.com/questions/59987391/how-to-set-initial-values-to-formik-using-axios-with-typescript

  const [initialValues, setInitialValues] = useState(
    {
      projectName: '',
      projectNumber: '',
    }
  )

  const AutoSaveValues = () => {
    if (loadedValues == false) {
      if (typeof window !== 'undefined') {
        console.log('We are loaded!')
        let storedValues = localStorage.getItem('designCriteria')
        if (typeof storedValues != 'undefined') {
          setInitialValues(JSON.parse(storedValues) || {})
        }
      }
      loadedValues = true
    } else {
      // https://formik.org/docs/api/useFormikContext
      const { values, submitForm } = useFormikContext();
      useEffect(() => {
        console.log("AutoSaveValues called with formik context:")
        console.log(values)
        localStorage.setItem('designCriteria', JSON.stringify(values))
      }, [values])
    }

    return null
  }

  /*
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!loadedValues) {
        console.log('We are loaded!')
        let storedValues = localStorage.getItem('designCriteria')
        if (typeof storedValues != 'undefined') {
          setInitialValues(JSON.parse(storedValues) || {})
        }
      }
    }
  }, []) */

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

          {/* <PersistFormikValues name="designCriteria" /> */}
          <AutoSaveValues />
        </Form>
      </Formik>

    </Layout>
  )
}

export default DesignCriteria
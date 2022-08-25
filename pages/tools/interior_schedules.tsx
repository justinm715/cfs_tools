import Layout from '../../components/layout'
import Head from "next/head";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>Interior Schedules</title>
      </Head>

      <div className="grid grid-cols-3">
        <div className="overflow-y-auto h-[calc(100vh-65px)] col-span-2">
          <div className="overflow-y-auto p-2">
            <h2 className="text-2xl mb-8">Interior Schedules</h2>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-65px)] p-2 bg-gray-100">
          <p>Results will be displayed here.</p>
        </div>
      </div>



      {/* List of wall types */}

    </Layout>
  )
}
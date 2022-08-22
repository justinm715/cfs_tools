import Layout from '../components/layout'
import Link from 'next/link'
import Head from "next/head";

export default function Index() {
  return (
    <Layout>
      <Head>
        <title>CFS Tools by Justin Martinez</title>
      </Head>

      <p>
        This is the index.
      </p>
    </Layout>
  )
}
import Layout from '../components/layout'
import Link from 'next/link'

export default function Index() {
  return (
    <Layout>
      <p>This is the index</p>
      <p>
        <Link href="/about">
          <a>Link to About</a>
        </Link>
      </p>
      <section className="rounded-md border border-neutral-500 bg-neutral-700 hover:bg-neutral-600 transition-colors text-neutral-100 flex flex-row items-start cursor-pointer sm:w-5/6 md:w-4/6 lg:w-3/6">
        <img src="http://placekitten.com/100/100" alt="cat" className="py-4 pl-4 aspect-square" />
        <p className="mx-4 my-3 leading-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat.
        </p>
      </section>
    </Layout>
  )
}
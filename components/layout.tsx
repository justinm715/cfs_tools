import Navbar from './navbar'

export default function Layout({ children }) {
  return (
    <>
      <div className="container mx-auto text-sm min-w-[64rem] w-full ">
        <div className="border-b border-slate-500 m-3 pb-2.5">
          <h1 className="text-2xl">
            CFS Tools
          </h1>
          <p className="text-base">
            By Justin Martinez
          </p>
        </div>
        <div className="grid grid-cols-12 m-3">
          <div className="col-span-2">
            <Navbar />
          </div>
          <div className="col-span-10">
            <main>{children}</main>
          </div>
        </div>
      </div>
    </>
  )
}
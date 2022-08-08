import Navbar from './navbar'

export default function Layout({children}) {
  return (
    <>
      <div className="container mx-auto">
        <div className="border-b border-slate-500 mb-2.5 mt-2.5 pb-2.5">
          <h1 className="text-2xl">
            CFS Tools
          </h1>
          <p className="text-base">
            By Justin Martinez
          </p>
        </div>
        <div className="fixed w-[10rem] z-10">
          <Navbar />
        </div>
        <div className="fixed pl-[10rem]">
          <main>{children}</main>
        </div>
      </div>
    </>
  )
}
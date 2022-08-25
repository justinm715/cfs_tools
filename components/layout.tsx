import Navbar from './navbar'

export default function Layout({ children }) {
  return (
    <>
      <div className="flex flex-col h-screen min-w-[64rem] w-full h-[65px]">
        <div className="p-2 bg-slate-300">
          <h1 className="font-bold">
            CFS Tools
          </h1>
          <p className="text-base">
            By Justin Martinez
          </p>
        </div>
        <div className="flex-grow">
          <div className="grid grid-cols-8 h-[calc(100vh-65px)]">
            <div className="col-span-1 bg-gray-100">
              <Navbar />
            </div>
            <div className="col-span-7">
              <main>{children}</main>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
import Image from "next/image";
import Switch from "./components/darkModeSwitch"
import Form from "./components/formCard"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="flex h-20 md:h-24 w-full items-center justify-between bg-linear-to-br from-amber-500 via-orange-500 to-orange-600 px-6 md:px-12 lg:px-16 text-white border-b-4 md:border-b-8 border-orange-600 shadow-md">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-md">
          DMS Ticket System
        </h1>
        <a href="/tickets"></a>
        

        <div className="flex items-center">
          <Switch />
        </div>
      </header>

      <main className="flex-1 w-full p-6 md:p-12 flex justify-center items-start">
        <Form />
      </main>
    </div>
  );
}

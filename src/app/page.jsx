import Image from "next/image";
import { ClassProvider } from "./ClassContext"; 
export default function Home() {
  return (
    <ClassProvider><div className="text-blue-500 h-full w-full text-center "> HELLO</div></ClassProvider>
  );
}

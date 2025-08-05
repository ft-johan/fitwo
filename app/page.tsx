import { AddMeasurementForm} from "@/components/add-measurements-form";
import Bento from "@/components/dasboard-bento";
import { Greeting } from "@/components/ui/greeting";

export default function Home() {
  return (
       <div className="min-h-svh w-full p-6 md:p-10 flex flex-col justify-center">
       <div className="flex justify-between items-center  w-full"> <Greeting /><AddMeasurementForm /></div>
          <div className="flex flex-1 flex-col justify-center items-center w-full  gap-2">
            <div className=" md:min-w-8xl w-full max-w-7xl flex flex-col gap-4">
            <Bento />
            </div>
          </div>
        </div>
  );
}

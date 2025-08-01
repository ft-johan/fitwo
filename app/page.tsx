import { AddMeasurementForm} from "@/components/add-measurements-form";

export default function Home() {
  return (
       <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <AddMeasurementForm />
          </div>
        </div>
  );
}

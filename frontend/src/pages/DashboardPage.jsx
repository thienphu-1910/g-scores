import Card from "../components/Card";
import { MoveRight } from "lucide-react";

const DashboardPage = () => {
  return (
    <div className="w-full">
      <div className="w-full">
        <Card className="w-full flex flex-row justify-between px-4 py-6">
          <div className="w-full flex flex-col gap-2 justify-center items-start">
            <h3 className="text-lg text-black font-bold">User Registration</h3>
            <p className="text-black/70 text-xs">Enter registration number</p>
          </div>
          <div className="w-full flex flex-row gap-2 justify-end items-center">
            <input
              className="w-50 bg-slate-200 text-sm rounded-md border border-gray-400 py-2 px-2"
              placeholder="Registration Number"
            />
            <button className="bg-black rounded-lg flex flex-row gap-2 justify-center items-center px-4 py-2 hover:scale-102 active:scale-98">
              <p className="text-xs text-white font-semibold">Submit</p>
              <MoveRight color="#ffffff" size="18"/>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

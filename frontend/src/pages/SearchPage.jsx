import Card from "../components/Card";
import { MoveRight } from "lucide-react";

const SearchPage = () => {
  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-4">
        <Card className="w-full flex flex-row justify-between px-4 py-6">
          <div className="w-full flex flex-col gap-2 justify-center items-start">
            <h3 className="text-xl text-black font-bold">User Registration</h3>
            <p className="text-black/70 text-xs">Enter registration number</p>
          </div>
          <div className="relative flex flex-col gap-2 items-center justify-center">
            <div className="w-full flex flex-row gap-2 justify-end items-center">
              <input
                className="w-50 bg-slate-200 text-sm rounded-md border border-gray-400 py-2 px-2"
                placeholder="Registration Number"
              />
              <button className="bg-blue-900 rounded-lg flex flex-row gap-2 justify-center items-center px-4 py-2 hover:scale-102 active:scale-98">
                <p className="text-sm text-white font-normal">Submit</p>
                <MoveRight color="#ffffff" size="18" />
              </button>
            </div>
            <span className="text-xs text-red-400 font-light absolute -bottom-3 left-0">
              
            </span>
          </div>
        </Card>
        <Card className="w-full flex flex-col">
          <div className="w-full bg-gray-200/70 border-b border-b-gray-300 text-black font-bold rounded-t-lg px-4 py-2">
            Scores
          </div>
          <div className="bg-white rounded-b-lg px-4 py-2">
            Hey
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SearchPage;

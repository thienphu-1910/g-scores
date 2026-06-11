import { useEffect, useState } from "react";
import Card from "../components/Card";
import { MoveRight } from "lucide-react";
import { searchService } from "../services/searchService";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ScoresCard from "../components/ScoresCard";
import { convertVariableNameToSubjectName } from "../../utils/subjectUtils";

const SearchPage = () => {
  const nav = useNavigate();
  const { regisNumber } = useParams();

  const [scores, setScores] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      regisNumber: regisNumber,
    },
  });

  useEffect(() => {
    let isMount = true;
    const loadScores = async () => {
      try {
        const response = await searchService.searchScores(regisNumber);
        if (isMount) {
          setScores(response.data.scores.scores);
          console.log(response.data.scores.scores);
        }
      } catch (e) {
        if (isMount) {
          setError(e);
        }
      } finally {
        if (isMount) {
          setLoading(false);
        }
      }
    };

    if (regisNumber) {
      loadScores();
    }

    return () => {
      isMount = false;
    };
  }, [regisNumber]);

  const onSubmit = (data) => {
    console.log(data.regisNumber);
    if (data.regisNumber !== regisNumber) {
      nav(`/search-scores/${data.regisNumber}`);
    }
  };

  

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-4">
        <Card className="w-full flex flex-row justify-between px-4 py-6">
          <div className="w-full flex flex-col gap-2 justify-center items-start">
            <h3 className="text-xl text-black font-bold">User Registration</h3>
            <p className="text-black/70 text-xs">Enter registration number</p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative flex flex-col gap-2 items-center justify-center"
          >
            <div className="w-full flex flex-row gap-2 justify-end items-center">
              <input
                className="w-50 bg-slate-200 text-sm rounded-md border border-gray-400 py-2 px-2"
                placeholder="Registration Number"
                {...register("regisNumber", {
                  required: "Registration number is required",
                  validate: (value) => {
                    const regex = /^\d+$/;
                    const found = value.match(regex);
                    return found !== null || "Digits only";
                  },
                  minLength: { value: 8, message: "Must be 8 digits" },
                  maxLength: { value: 8, message: "Must be 8 digits" },
                })}
              />
              <button
                type="submit"
                className="bg-blue-900 rounded-lg flex flex-row gap-2 justify-center items-center px-4 py-2 hover:scale-102 active:scale-98"
              >
                <p className="text-sm text-white font-normal">Submit</p>
                <MoveRight color="#ffffff" size="18" />
              </button>
            </div>
            {errors.regisNumber && (
              <span className="text-xs text-red-400 font-light absolute -bottom-3 left-0">
                {errors.regisNumber.message}
              </span>
            )}
          </form>
        </Card>
        <Card className="w-full flex flex-col">
          <div className="w-full bg-gray-200/70 border-b border-b-gray-300 text-black font-bold rounded-t-lg px-4 py-2 flex flex-row gap-4">
            Detailed Scores 
            {regisNumber && <span className="text-red-600">({regisNumber})</span>}
          </div>
          <div className="w-full bg-white rounded-b-lg px-6 py-4">
            {scores ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(scores).map(([key, value]) => (
                  <ScoresCard
                    title={convertVariableNameToSubjectName(key)}
                    value={value}
                    key={key}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">
                No scores found.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SearchPage;

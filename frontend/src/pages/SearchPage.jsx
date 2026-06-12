import { useEffect, useState } from "react";
import { MoveRight, Search } from "lucide-react";
import { searchService } from "../services/searchService";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { convertVariableNameToSubjectName } from "../../utils/subjectUtils";

// Import the UI design system components
import { PageHeader } from "../components/PageHeader";
import { EmptyState, LoadingState } from "../components/StateDisplays";
import { ContentCard } from "../components/LayoutCards";
import { MetricCard } from "../components/MetricCard";

const SearchPage = () => {
  const nav = useNavigate();
  const { regisNumber } = useParams();

  const [scores, setScores] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core logic maintained exactly as provided
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      regisNumber: regisNumber || "",
    },
  });

  useEffect(() => {
    let isMount = true;
    const loadScores = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await searchService.searchScores(regisNumber);
        if (isMount) {
          setScores(response.data.scores.scores);
        }
      } catch (e) {
        if (isMount) {
          setError(e);
          setScores(null);
        }
      } finally {
        if (isMount) {
          setLoading(false);
        }
      }
    };

    if (regisNumber) {
      loadScores();
    } else {
      setLoading(false);
    }

    return () => {
      isMount = false;
    };
  }, [regisNumber]);

  const onSubmit = (data) => {
    if (data.regisNumber !== regisNumber) {
      nav(`/search-scores/${data.regisNumber}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 font-sans text-gray-900">
      <PageHeader
        title="Candidate Search"
        description="Lookup detailed component scores by candidate registration number."
      />

      <div className="flex flex-col gap-2">
        {/* Search Input Section */}
        <ContentCard
          title="Registry Lookup"
          subtitle="Enter the exact 8-digit registration number"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size="16" className="text-gray-400" />
              </div>
              <input
                className={`w-full bg-gray-50 text-sm rounded-lg border py-2.5 pl-10 pr-4 outline-none transition-colors focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.regisNumber
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-500"
                }`}
                placeholder="e.g. 01020304"
                {...register("regisNumber", {
                  required: "Registration number is required",
                  validate: (value) => {
                    const regex = /^\d+$/;
                    return regex.test(value) || "Digits only";
                  },
                  minLength: { value: 8, message: "Must be exactly 8 digits" },
                  maxLength: { value: 8, message: "Must be exactly 8 digits" },
                })}
              />
              {errors.regisNumber && (
                <span className="absolute -bottom-5 left-1 text-[10px] text-red-500 font-medium">
                  {errors.regisNumber.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all mt-2 sm:mt-0"
            >
              Search
              <MoveRight size="16" />
            </button>
          </form>
        </ContentCard>

        {/* Results Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 mt-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-black">
              Score Transcript
            </span>
            {regisNumber && !isLoading && !error && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs font-mono">
                {regisNumber}
              </span>
            )}
          </div>

          {!regisNumber ? (
            <EmptyState message="Enter a registration number above to view the candidate's transcript." />
          ) : isLoading ? (
            <LoadingState message={`Fetching records for ${regisNumber}...`} />
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center">
              <p className="text-red-500 text-sm font-medium">
                Record not found or network error occurred.
              </p>
              <p className="text-red-400 text-xs mt-1">
                Please verify the registration number and try again.
              </p>
            </div>
          ) : scores ? (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(scores).map(([key, value]) => (
                  <MetricCard
                    title={convertVariableNameToSubjectName(key)}
                    value={value}
                    key={key}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState message="No score data available for this candidate." />
          )}
        </section>
      </div>
    </div>
  );
};

export default SearchPage;

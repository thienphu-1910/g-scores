import { useEffect } from "react";
import { useJobStore } from "../store/useJobStore";

export const useReportJobSSE = () => {
  const { job, updateJob } = useJobStore();

  useEffect(() => {
    if (!job || job.status !== "processing") return;

    const es = new EventSource(`/api/calculate/${job.jobId}/progress`);

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      updateJob({
        progress: data.progress,
        status: data.status,
        result: data.result,
      });

      if (data.status !== "processing") es.close();
    };    

    es.onerror = () => {
      updateJob({ status: "error" });
      es.close();
    };
    
    return () => es.close();
  }, [job, updateJob]);
};

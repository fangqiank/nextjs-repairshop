import {useRouter} from "next/navigation";
import React from "react";

export const usePolling = (searchParam: string | null, ms: number = 60000) => {
  const router = useRouter();

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(`Interval Running`);

      if (!searchParam) {
        console.log("refreshing data");
        router.refresh();
      }
    }, ms);

    return () => clearInterval(intervalId);
  }, [searchParam, ms]); //eslint-disable-line
};

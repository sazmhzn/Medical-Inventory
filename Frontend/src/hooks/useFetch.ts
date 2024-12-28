import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/mis/";

export const useFetch = (url: string) => {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | unknown>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/${url}`);
      console.log(response);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // useEffect(() => {
  //   const getInvenotryData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(`${BASE_URL}/${url}`);
  //       console.log(`${BASE_URL}/${url}`);
  //       setData(response.data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getInvenotryData();
  //   console.log("Data called", url);
  // }, [url]);

  return { data, loading, error };
};

export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(BASE_URL)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

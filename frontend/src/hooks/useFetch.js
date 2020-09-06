import { useState, useCallback } from "react";

const useFetch = () => {
    const [error, setError] = useState(null);
    const [isLoading, setLoading] = useState(false);

    const sendRequest = useCallback(
        async (url, method = 'GET', body = null, headers = {}) => {
            const abortController = new AbortController();
            const signal = abortController.signal;

            try {
                setLoading(true);
                const response = await fetch(url,{
                    method,
                    body,
                    headers
                });
                const responseData = await response.json();
                if(!response.ok){
                    throw new Error(responseData.message)
                }
                return responseData;

            } catch (error) {
                if (!signal.aborted) {
                    setError(error.message)
                }
               
            }
            finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
            return () => {
                abortController.abort();
            };
        }, [])

    const clearError = () => {
        setError(null);
    };

    return { isLoading, error, sendRequest, clearError };
}


export default useFetch;

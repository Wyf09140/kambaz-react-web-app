import { useEffect, useState } from "react";
import * as client from "./client";

export default function HttpClient() {
  const [welcomeOnClick, setWelcomeOnClick] = useState("");
  const [welcomeOnLoad, setWelcomeOnLoad] = useState("");
  const [error, setError] = useState("");

  const fetchWelcomeOnClick = async () => {
    setError("");
    try {
      const message = await client.fetchWelcomeMessage();
      setWelcomeOnClick(message);
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
    }
  };

  const fetchWelcomeOnLoad = async () => {
    setError("");
    try {
      const message = await client.fetchWelcomeMessage();
      setWelcomeOnLoad(message);
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
    }
  };

  useEffect(() => {
    fetchWelcomeOnLoad();
  }, []);

  return (
    <div id="wd-http-client">
      <h3>HTTP Client</h3>

      <h4>Requesting on Click</h4>
      <button className="btn btn-primary me-2" onClick={fetchWelcomeOnClick}>
        Fetch Welcome
      </button>
      <div className="mt-2">
        <b>Response from server:</b> {welcomeOnClick}
      </div>

      {error && (
        <div className="text-danger mt-2">
          <b>Error:</b> {error}
        </div>
      )}

      <h4 className="mt-3">Requesting on Load</h4>
      Response from server: <b>{welcomeOnLoad}</b>
      <hr />
    </div>
  );
}

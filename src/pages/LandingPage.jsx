import React, { useState } from "react";
import Card from "../components/Card";
import { Copy, Check } from "lucide-react";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { accessToken } = useSelector((state) => state.auth);
  console.log(accessToken)

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowResult(false);

    try {
      const response = await fetch("http://localhost:8082/api/v1/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify({ original_url: url }),
      });

      const data = await response.json();

      if (data.success) {
        setShortUrl(`http://localhost:8082/${data.data.short_code}`);
        setShowResult(true);
      } else {
        setError(data.message || "Failed to shorten URL");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 sm:pb-20">
        <div className="text-center max-w-3xl mx-auto">
         
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-900 mb-3">
            Shorten Your Links,
          </h1>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-blue-600 mb-6">
            Amplify Your Reach
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-8 px-4">
            Create short, memorable links in seconds. Track clicks, manage
            campaigns, and optimize your digital presence.
          </p>
          <form
            onSubmit={handleShorten}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto px-4"
          >
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="[https://google.com](https://google.com)"
              className="flex-1 px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base shadow-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white font-medium px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
          {showResult && (
            <div className="mt-8 max-w-2xl mx-auto px-4">
             
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8">
               
                <p className="text-sm text-gray-600 mb-4">
                  Your shortened URL:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 sm:px-6 py-3 sm:py-4">
                    <p className="text-sm sm:text-base text-gray-900 font-medium truncate">
                      {shortUrl}
                    </p>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto bg-gray-900 text-white font-medium px-6 py-3 sm:py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Sign in to track analytics and manage your links
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <Card />
      </section>
    </div>
  );
};

export default LandingPage;

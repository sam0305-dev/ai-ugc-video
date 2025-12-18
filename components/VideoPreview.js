export default function VideoPreview({ data }) {
  if (!data) {
    return <p>No video generated yet. Submit a script to generate one.</p>;
  }

  // Different D-ID plans/responses may return different fields.
  // We try a few common ones and fall back to showing raw JSON.
  const possibleUrl =
    data.result_url ||
    data.url ||
    (data.result && data.result.url) ||
    null;

  return (
    <div>
      <h2>Video Result</h2>
      {possibleUrl ? (
        <video
          src={possibleUrl}
          controls
          style={{ maxWidth: "100%", borderRadius: "8px" }}
        />
      ) : (
        <>
          <p>
            The video was created, but a direct video URL was not found in the
            response. Here is the raw response from the API:
          </p>
          <pre
            style={{
              background: "#111",
              color: "#eee",
              padding: "1rem",
              borderRadius: "8px",
              maxWidth: "100%",
              overflowX: "auto",
              fontSize: "0.8rem",
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

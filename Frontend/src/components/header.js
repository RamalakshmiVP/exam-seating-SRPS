import React from "react";

export default function Header() {
  return (
    <header
      style={{
        padding: "20px",
        background: "#880000", // 🔴 Background stays red
        color: "white",        // Default text white
        textAlign: "center",
      }}
    >
      {/* Logo + College Name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
       
        <div>
          {/* 👇 Only this heading in #fadb9cff */}
          <h2 style={{ margin: 0, color: "#ffdd98ff" }}>
            St. Xavier’s College (Autonomous)
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              fontSize: "0.9rem",
              fontStyle: "italic",
              color: "#ffdd98ff"
            }}
          >
            Recognized as <b>'College with Potential for Excellence'</b> by UGC
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "0.9rem",
              fontStyle: "italic",
              color: "#ffdd98ff"
            }}
          >
            Accredited at <b>A++ Grade</b> with a CGPA of 3.66/4 in the IV cycle
            by NAAC
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "0.9rem",color: "#ffde9cff" }}>
            Palayamkottai - 627 002
          </p>
        </div>
      </div>
    </header>
  );
}

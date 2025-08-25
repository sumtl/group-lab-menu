"use client";


import "swagger-ui-react/swagger-ui.css";
import React from "react";
import dynamic from "next/dynamic";
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

async function getSwaggerSpec() {
  const response = await fetch("/api/swagger");
  return response.json();
}
export default function ApiDocsPage() {
  return (
    <div style={{ height: "100vh" }}>
      <h1>API Documentation</h1>
      <SwaggerUIComponent />
    </div>
  );
}

function SwaggerUIComponent() {
  const [spec, setSpec] = React.useState(null);

  React.useEffect(() => {
    getSwaggerSpec().then(setSpec);
  }, []);

  if (!spec) {
    return <div>Loading...</div>;
  }

  return <SwaggerUI spec={spec} />;
}
import { useRouteError } from "react-router-dom";

interface RouteError {
  message?: string;
  statusText?: string;
}

function isRouteError(error: unknown): error is RouteError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("message" in error || "statusText" in error) &&
    (typeof (error as RouteError).message === "string" || typeof (error as RouteError).statusText === "string")
  );
}

const NotFound = () => {
  const error: unknown = useRouteError();

  if (isRouteError(error)) {
    return (
      <div id="error-page">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    );
  }

  return null;
};

export default NotFound;

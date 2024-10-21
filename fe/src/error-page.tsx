import { useRouteError } from "react-router-dom";

interface ErrorWithMessage {
  statusText?: string;
  message?: string;
}

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return typeof error === "object" && error !== null && "message" in error;
}

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {isErrorWithMessage(error) ? (
          <i>{error.statusText || error.message}</i>
        ) : (
          <i>Unknown error</i>
        )}
      </p>
    </div>
  );
}

export default ErrorPage;
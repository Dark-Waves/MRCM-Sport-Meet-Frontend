import { Link, useLocation } from "react-router-dom";

interface ErrorMessage {
  code: number;
  message: string | null;
}

const ErrorPage: React.FC<{ code: number }> = ({ code }) => {
  const errorMessage: ErrorMessage = {
    code,
    message: null,
  };

  switch (errorMessage.code) {
    case 404: {
      errorMessage.message = "Cannot find the page you've been looking for 💀";
      break;
    }
    case 400: {
      errorMessage.message = "API error. Please contact support.";
      break;
    }
    case 310: {
      errorMessage.message = "I want to have sex if you are a girl";
      break;
    }
    default:
      errorMessage.message = "Unknown error occurred.";
  }

  return (
    <div className="m-auto h-full w-full flex-col-center">
      <div className="box p-8 bg-jet flex-col-center rounded-lg g-2">
        <h1>Error Occurred</h1>
        <p>
          <strong>Error Code:</strong> {errorMessage.code}
        </p>
        <p>
          <strong>Message:</strong> {errorMessage.message}
        </p>
        <Link to={"/"} className="p-2 bg-main rounded-lg font-weight-600 m-t-3">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;

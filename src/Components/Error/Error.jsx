import { Link, useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  const { error } = location.state || {};

  // Default message for Page Not Found
  const defaultMessage = { code: "404", message: "Page Not Found" };

  const displayError = error || defaultMessage;

  return (
    <div className="m-auto h-full w-full flex-col-center">
      <div className="box p-8 bg-jet flex-col-center rounded-lg g-2">
        <h1>Error Occurred</h1>
        <p>
          <strong>Error Code:</strong> {displayError.code}
        </p>
        <p>
          <strong>Message:</strong> {displayError.message}
        </p>
        <Link to={"/"} className="p-2 bg-main rounded-lg font-weight-600 m-t-3" >Back to Home</Link>
      </div>
    </div>
  );
};

export default ErrorPage;

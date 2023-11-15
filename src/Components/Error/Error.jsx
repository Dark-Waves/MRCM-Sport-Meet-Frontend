import { Link, useLocation } from "react-router-dom";

const ErrorPage = ({ code }) => {

  const errorMessage = {
    code, message: null
  }
  switch (errorMessage.code) {
    case 404: {
      errorMessage.message = "cannot found the page you been loking for 💀"
      break
    }
    case 400: {
      errorMessage.message = "API error please contact support"
      break
    }
    case 310: {
      errorMessage.message = "i want to have sex if you are a girl"
      break
    }
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
        <Link to={"/"} className="p-2 bg-main rounded-lg font-weight-600 m-t-3" >Back to Home</Link>
      </div>
    </div>
  );
};

export default ErrorPage;

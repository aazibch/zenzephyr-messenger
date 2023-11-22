import { ErrorResponse, useRouteError } from 'react-router-dom';
import Layout from '../components/UI/Layout';
import Logo from '../components/UI/Logo';
import AuthLogoutWrapper from '../components/Auth/AutoLogoutWrapper';

const ErrorPage = () => {
  const error = useRouteError() as ErrorResponse;
  let message = error.data;

  if (error.status === 404) {
    message = 'Page not found.';
  }

  return (
    <AuthLogoutWrapper>
      <Layout>
        <div className="flex items-center justify-center max-w-2xl h-full mx-auto">
          <div>
            <Logo className="mb-1" />
            <p className="text-lg">
              <span className="font-medium text-red-500">Error:</span> {message}
            </p>
          </div>
        </div>
      </Layout>
    </AuthLogoutWrapper>
  );
};

export default ErrorPage;

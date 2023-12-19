import { ErrorResponse, useNavigate, useRouteError } from 'react-router-dom';
import Layout from '../components/UI/Layout';
import Logo from '../components/UI/Logo';
import AuthLogoutWrapper from '../components/Auth/AutoLogoutWrapper';
import { clearAuthState } from '../utils/auth';

const ErrorPage = () => {
  const error = useRouteError() as ErrorResponse;
  const navigate = useNavigate();

  console.log('[ErrorPage] error', error);

  if (error.status === 401 && error.data === 'You are not logged in.') {
    setTimeout(() => {
      clearAuthState();
      navigate('/');
    }, 1500);
  }

  let message = error.data;

  if (!error.data) {
    message = 'Something went wrong.';
  }

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

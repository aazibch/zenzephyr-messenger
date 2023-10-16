import { useRouteError } from 'react-router-dom';
import Layout from '../components/UI/Layout';
import Logo from '../components/UI/Logo';

interface ErrorObj extends Response {
  data: {
    message?: string;
  };
}

const ErrorPage = () => {
  const error = useRouteError() as ErrorObj;

  console.log(error, error);

  return (
    <Layout>
      <div className="flex items-center justify-center max-w-2xl h-full mx-auto">
        <div>
          <Logo className="mb-1" />
          <p className="text-lg">
            <span className="font-medium text-red-500">Error:</span>{' '}
            {error.data.message}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ErrorPage;

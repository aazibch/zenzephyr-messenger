import AuthFormContainer from '../components/Auth/AuthFormContainer';
import AppIntro from '../components/UI/AppIntro';

const HomePage = () => {
  return (
    <div className="flex">
      <section className="basis-1/2 border-r">
        <AppIntro />
      </section>
      <section className="flex items-center justify-center basis-1/2">
        <AuthFormContainer />
      </section>
    </div>
  );
};

export default HomePage;

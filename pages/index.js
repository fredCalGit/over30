import Layout from '../components/Layout';
import Link from 'next/link';
import { loginWithGoogle } from '../actions/auth';
import Image from 'next/image';

const Index = () => {
  const logo = () => {
    return (
      <Image
        src="/logoblue.png"
        alt="Fred Cal's Portfolio"
        width={70}
        height={70}
      />
    );
  };
  return (
    <Layout>
      <article className="overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h1 className="display-4 font-weight-bold">
                PROGRAMMING & WEB DEVELOPMENT BLOGS/TUTORIALS
              </h1>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center pt-4 pb-5">
              <p className="lead">
                Join us on the path of learning to code! It's never too late to
                start!
              </p>
              <br />
              "You should learn whatever keeps you doing it tomorrow."
              <br />
              <br />
              <a href="https://www.fredcal.com" target="_blank">
                {logo()}
              </a>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default Index;

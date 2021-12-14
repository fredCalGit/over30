import Layout from '../../../components/Layout';
import Private from '../../../components/auth/Private';
import ReadBlogs from '../../../components/crud/ReadBlogs';
import Link from 'next/link';
import { isAuth } from '../../../actions/auth';

const Blog = () => {
  const username = isAuth() && isAuth().username;
  return (
    <Layout>
      <Private>
        <div className="container">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage blogs</h2>
            </div>
            <div className="col-md-12">
              <ReadBlogs username={username} />
            </div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default Blog;

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';
import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import SmallCard from '../../components/blog/SmallCard';
import { singleBlog, listRelated } from '../../actions/blog';

import { API, DOMAIN, APP_NAME, FB_APP_ID } from '../../config';
import DisqusThread from '../../components/DisqusThread';

const SingleBlog = ({ blog, query }) => {
  const [related, setRelated] = useState([]);

  const loadRelated = () => {
    listRelated({ blog }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
  };

  useEffect(() => {
    loadRelated();
  }, []);

  const head = () => (
    <Head>
      <title>
        {blog.title} | {APP_NAME}
      </title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={blog.mdesc} />
      <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta property="og:description" content={blog.mdesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${API}/blog/photo/${blog.photo}`} />
      <meta
        property="og:image:segure_url"
        content={`${API}/blog/photo/${blog.photo}`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const showBlogCategories = (blog) =>
    blog.categories.map((categ, i) => (
      <Link key={i} href={`/categories/${categ.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{categ.name}</a>
      </Link>
    ));

  const showBlogTags = (blog) =>
    blog.tags.map((tag, i) => (
      <Link key={i} href={`/tags/${tag.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{tag.name}</a>
      </Link>
    ));

  const showRelatedBlogs = () => {
    return related.map((blog, i) => (
      <div className="col-md-4" key={i}>
        <article>
          <SmallCard blog={blog} />
        </article>
      </div>
    ));
  };

  const showComments = () => {
    return (
      <div>
        <DisqusThread
          id={blog.id}
          title={blog.title}
          path={`/blog/${blog.slug}`}
        />
      </div>
    );
  };
  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row" style={{ marginTop: '-30px' }}>
                  <img
                    src={`${API}/blog/photo/${blog.slug}`}
                    alt={blog.title}
                    className="img img-fluid featured-image"
                  />
                </div>
              </section>
              <section>
                <div className="container">
                  <h1 className="display-2 pb-3 text-center font-weight-bold pt-3">
                    {blog.title}
                  </h1>
                  <p className="lead mt-3 mark">
                    Written by{' '}
                    <Link href={`/profile/${blog.postedBy.username}`}>
                      <a>{blog.postedBy.username}</a>
                    </Link>{' '}
                    | Published {moment(blog.updatedAt).fromNow()}
                  </p>
                  <div className="pb-3">
                    {showBlogCategories(blog)}
                    {showBlogTags(blog)}
                    <br />
                    <br />
                  </div>
                </div>
              </section>
            </div>
            <div className="container">
              <section>
                <div className="col-md-12 lead">{renderHTML(blog.body)}</div>
              </section>
            </div>
            <div className="container">
              <h4 className="text-center pt-5 pb-5 h2">Related Blogs</h4>
              <hr />
              <div className="row">{showRelatedBlogs()}</div>
            </div>
            <div className="container pt-5 pb-5">{showComments()}</div>
          </article>
        </main>
      </Layout>
    </React.Fragment>
  );
};

SingleBlog.getInitialProps = ({ query }) => {
  return singleBlog(query.slug).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      //console.log('get initial data on single blog', data)
      return { blog: data, query };
    }
  });
};

export default SingleBlog;

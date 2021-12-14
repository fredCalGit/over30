import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { withRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getCookie, isAuth } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { singleBlog, updateBlog } from '../../actions/blog';
import { QuillModules, QuillFormats } from '../../helpers/quill';
import { DOMAIN, API } from '../../config';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const UpdateBlog = ({ router }) => {
  const [body, setBody] = useState('');
  const [checked, setChecked] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [values, setValues] = useState({
    error: '',
    title: '',
    success: '',
    formData: '',
    title: '',
    body: '',
  });

  const { error, success, formData, title } = values;
  const token = getCookie('token');

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });

    initBlog();
    initCategories();
    initTags();
  }, [router]);

  const initBlog = () => {
    if (router.query.slug) {
      singleBlog(router.query.slug).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title });
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = (blogCategories) => {
    let categ = [];
    blogCategories.map((c, i) => {
      categ.push(c._id);
    });
    setChecked(categ);
  };

  const setTagsArray = (blogTags) => {
    let ta = [];
    blogTags.map((t, i) => {
      ta.push(t._id);
    });
    setCheckedTag(ta);
  };

  const initCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    });
  };

  const initTags = () => {
    getTags().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((category, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleToggle(category._id)}
            checked={findOutCategory(category._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{category.name}</label>
        </li>
      ))
    );
  };

  const findOutCategory = (categ) => {
    const result = checked.indexOf(categ);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const findOutTag = (tag) => {
    const result = checkedTag.indexOf(tag);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((tag, index) => (
        <li key={index} className="list-unstyled">
          <input
            onChange={handleTagToggle(tag._id)}
            checked={findOutTag(tag._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{tag.name}</label>
        </li>
      ))
    );
  };

  const handleToggle = (c) => () => {
    setValues({ ...values, error: '' });

    const clickedCategory = checked.indexOf(c);
    const all = [...checked];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    setChecked(all);
    formData.set('categories', all);
  };

  const handleTagToggle = (t) => () => {
    setValues({ ...values, error: '' });

    const clickedTag = checkedTag.indexOf(t);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    setCheckedTag(all);
    formData.set('tags', all);
  };

  const handleBody = (e) => {
    setBody(e);
    formData.set('body', e);
  };

  const handleChange = (name) => (e) => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;

    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: '' });
  };

  const editBlog = (e) => {
    e.preventDefault();

    updateBlog(formData, token, router.query.slug).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: '',
          success: `Blog titled "${data.title}" is updated`,
        });
        if (isAuth() && isAuth().role === 1) {
          setTimeout(() => {
            Router.reload();
          }, 500);
          Router.push(`/admin`);
        } else if (isAuth() && isAuth().role === 0) {
          setTimeout(() => {
            Router.reload();
          }, 500);
          Router.push(`/user`);
        }
      }
    });
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? '' : 'none' }}
    >
      {success}
    </div>
  );

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange('title')}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
            theme="snow"
            value={body}
            placeholder="Write something amazing!"
            onChange={handleBody}
          />
        </div>
        <div>
          <button className="btn btn-primary" type="submit">
            Update
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}

          <div className="pt-3">
            {showSuccess()}
            {showError()}
          </div>

          {body && (
            <img
              src={`${API}/blog/photo/${router.query.slug}`}
              alt={title}
              style={{ width: '100%' }}
            />
          )}
        </div>

        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Featured image</h5>
              <hr />

              <small className="text-muted">Max size: 1mb</small>
              <br />
              <label className="btn btn-outline-info">
                Upload featured image
                <input
                  onChange={handleChange('photo')}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>
          <div>
            <h5>Categories</h5>
            <hr />

            <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>
              {showCategories()}
            </ul>
          </div>
          <div>
            <h5>Tags</h5>
            <hr />
            <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}>
              {showTags()}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(UpdateBlog);

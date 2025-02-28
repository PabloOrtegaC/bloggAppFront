import React, { useState } from 'react';
import SimpleWysiwyg from './SimpleWysiwyg';
import useUpdatePost from './hooks/useUpdatePost';

const EditPost = ({ post, onClose, onPostEdited }) => {
  const { updatePost, loading, error } = useUpdatePost();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [tagsInput, setTagsInput] = useState(post.tags ? post.tags.join(', ') : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    const updatedData = {
      title,
      content,
      tags,
    };
    const result = await updatePost(post.id, updatedData);
    if (result) {
      alert('Post updated successfully');
      onPostEdited(result);
      onClose();
    } else {
      alert('Failed to update post');
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div style={formGroupStyle}>
            <label>Content:</label>
            <SimpleWysiwyg 
              value={content}
              onChange={setContent}
              style={{ marginBottom: '1rem' }}
            />
          </div>
          <div style={formGroupStyle}>
            <label htmlFor="tags">Tags (comma separated):</label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Python, FastAPI, NewTag"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error.message}</p>}
          <div style={buttonContainerStyle}>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  width: '500px',
  maxWidth: '90%',
};

const formGroupStyle = {
  marginBottom: '1rem',
  display: 'flex',
  flexDirection: 'column',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

export default EditPost;

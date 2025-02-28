import React, { useState } from 'react';
import SimpleWysiwyg from './SimpleWysiwyg';
import useCreatePost from './hooks/useCreatePost';

const CreatePost = ({ onClose, onPostCreated }) => {
  const { createPost, loading, error } = useCreatePost();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); 
  const [tagIds, setTagIds] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tags = tagIds
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    const postData = {
      title,
      content,
      tags
    };

    const result = await createPost(postData);
    if (result) {
      if (onPostCreated) onPostCreated(result);
      onClose();
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h2>Create Post</h2>
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
            <label htmlFor="tagIds">Tags (comma separated):</label>
            <input 
              id="tagIds"
              type="text"
              value={tagIds}
              onChange={(e) => setTagIds(e.target.value)}
              placeholder="e.g. tag1, tag2"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error.message}</p>}
          <div style={buttonContainerStyle}>
            <button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
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
  justifyContent: 'center'
};

const modalStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  width: '500px',
  maxWidth: '90%'
};

const formGroupStyle = {
  marginBottom: '1rem',
  display: 'flex',
  flexDirection: 'column'
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between'
};

export default CreatePost;

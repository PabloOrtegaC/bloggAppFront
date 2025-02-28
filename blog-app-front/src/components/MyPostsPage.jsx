import React, { useEffect, useState } from 'react';
import useMyPosts from './hooks/useMyPosts';
import useDeletePost from './hooks/useDeletePost';
import EditPost from './EditPost';

const MyPostsPage = ({ user }) => {
  const [editPostData, setEditPostData] = useState(null);
  const { posts, loading, error, refetchPosts } = useMyPosts();
  const { deletePost } = useDeletePost();

  useEffect(() => {
    console.log('MyPostsPage mounted');
  }, []);

  const handleEdit = (post) => {
    setEditPostData(post);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = await deletePost(postId);
      if (result) {
        alert('Post deleted successfully');
        refetchPosts();
      } else {
        alert('Failed to delete post');
      }
    }
  };

  const closeEditModal = () => {
    setEditPostData(null);
  };

  const handlePostEdited = (updatedPost) => {
    refetchPosts();
  };

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1>My Posts Page</h1>
        {loading && <p>Loading your posts...</p>}
        {error && <p>Error loading your posts: {error.message}</p>}
        {posts.length === 0 && !loading && <p>No posts found for you.</p>}
        {posts.map((post) => (
          <div key={post.id} style={styles.postCard}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p>
              <strong>Author:</strong> {post.author_name}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              {post.tags && post.tags.length > 0
                ? post.tags.map(tag => tag.name).join(', ')
                : ''}
            </p>
            <p>
              <strong>Average Rating:</strong>{" "}
              {post.ratings && post.ratings.length > 0
                ? ((post.ratings.reduce((sum, rating) => sum + rating.score, 0) / post.ratings.length).toFixed(1) + " ★")
                : "No ratings"}
            </p>
            <div style={styles.buttonContainer}>
              <button style={styles.editButton} onClick={() => handleEdit(post)}>
                Edit
              </button>
              <button style={styles.deleteButton} onClick={() => handleDelete(post.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {editPostData && (
        <EditPost 
          post={editPostData} 
          onClose={closeEditModal} 
          onPostEdited={handlePostEdited}
        />
      )}
    </main>
  );
};

const styles = {
  main: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  postCard: {
    backgroundColor: '#fff',
    marginBottom: '1rem',
    padding: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  editButton: {
    backgroundColor: '#ffc107',
    border: 'none',
    padding: '0.5rem 1rem',
    color: '#000',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    border: 'none',
    padding: '0.5rem 1rem',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default MyPostsPage;

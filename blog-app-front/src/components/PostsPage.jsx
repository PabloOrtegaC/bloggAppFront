// src/components/common/PostsPage.jsx
import React, { useState, useEffect } from 'react';
import usePosts from './hooks/usePosts';
import CreatePost from './CreatePost';
import useCreateRating from './hooks/useCreateRating';

const PostsPage = ({ user }) => {
  const { posts, loading, error, refetchPosts } = usePosts();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { createRating } = useCreateRating();
  const [selectedTag, setSelectedTag] = useState('All');

  // Extract unique tags from posts. Each tag is an object with a name.
  const uniqueTags = React.useMemo(() => {
    const tagSet = new Set();
    posts.forEach(post => {
      if (post.tags && post.tags.length > 0) {
        post.tags.forEach(tag => tagSet.add(tag.name));
      }
    });
    return Array.from(tagSet);
  }, [posts]);

  // Filter posts based on selectedTag
  const filteredPosts = React.useMemo(() => {
    if (selectedTag === 'All') return posts;
    return posts.filter(post =>
      post.tags && post.tags.some(tag => tag.name === selectedTag)
    );
  }, [posts, selectedTag]);

  // StarRating component compares the logged in user's id (user.id)
  // with each rating object's user_id to determine the current rating.
  const StarRating = ({ post }) => {
    const backendRating =
      user && post.ratings
        ? (post.ratings.find(r => r.user_id === user.id)?.score || 0)
        : 0;
    const [localRating, setLocalRating] = useState(backendRating);

    useEffect(() => {
      const updatedRating =
        user && post.ratings
          ? (post.ratings.find(r => r.user_id === user.id)?.score || 0)
          : 0;
      setLocalRating(updatedRating);
    }, [post.ratings, user]);

    const handleRating = async (score) => {
      if (!user) {
        alert("Please log in to rate posts.");
        return;
      }
      setLocalRating(score);
      console.log("User", user.id, "clicked rating:", score, "for post", post.id);
      const result = await createRating(post.id, score);
      console.log("Rating result:", result);
      if (result) {
        refetchPosts();
      }
    };

    return (
      <div>
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => handleRating(star)}
            style={{
              cursor: 'pointer',
              color: star <= localRating ? '#ffc107' : '#ccc',
              fontSize: '1.5rem',
              marginRight: '0.2rem'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        {/* Tag Filter */}
        <div style={styles.filterContainer}>
          <strong>Filter by tag:</strong>
          <button
            style={selectedTag === 'All' ? styles.filterActiveButton : styles.filterButton}
            onClick={() => setSelectedTag('All')}
          >
            All
          </button>
          {uniqueTags.map(tagName => (
            <button
              key={tagName}
              style={selectedTag === tagName ? styles.filterActiveButton : styles.filterButton}
              onClick={() => setSelectedTag(tagName)}
            >
              {tagName}
            </button>
          ))}
        </div>

        <button 
          style={styles.createPostButton} 
          onClick={() => setShowCreatePost(true)}
        >
          Create Post
        </button>
        {filteredPosts.map((post) => (
          <div key={post.id} style={styles.postCard}>
            <h2>{post.title}</h2>
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
            <div>
              <strong>Your Rating:</strong> <StarRating post={post} />
            </div>
          </div>
        ))}
        {loading && <p>Loading posts...</p>}
        {error && <p>Error loading posts: {error.message}</p>}
        {showCreatePost && (
          <CreatePost 
            onClose={() => setShowCreatePost(false)} 
            onPostCreated={() => {
              refetchPosts();
              setShowCreatePost(false);
            }}
          />
        )}
      </div>
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
  createPostButton: {
    display: 'block',
    marginLeft: 'auto',
    marginBottom: '1rem',
    backgroundColor: '#28a745',
    border: 'none',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  postCard: {
    backgroundColor: '#fff',
    marginBottom: '1rem',
    padding: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  filterContainer: {
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  filterButton: {
    backgroundColor: '#e0e0e0',
    border: 'none',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  filterActiveButton: {
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    padding: '0.3rem 0.6rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default PostsPage;

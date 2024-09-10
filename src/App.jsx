import React, { useState, useEffect } from "react";
import './App.css';  

function CreatePost({ addPost }) {
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addPost({ author, title, content, comments: [] });
    setAuthor("");
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a new post</h2>
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}

function PostList({ posts, setSelectedPost }) {
  const [sortOrder, setSortOrder] = useState("newest");

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.id - a.id;
    }
    return a.id - b.id;
  });

  return (
    <div>
      <h2>Post Overview</h2>
      <label>
        Sort by: 
        <select onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </label>
      <ul>
        {sortedPosts.map((post) => (
          <li key={post.id} onClick={() => setSelectedPost(post)}>
            <h3>{post.title}</h3>
            <p>by {post.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PostDetails({ post, addComment }) {
  const [comment, setComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    addComment(post.id, comment);
    setComment("");
  };

  return (
    <div>
      <h2>{post.title}</h2>
      <p>by {post.author}</p>
      <p>{post.content}</p>

      <h3>Comments</h3>
      <ul>
        {post.comments.map((c, index) => (
          <li key={index}>{c}</li>
        ))}
      </ul>

      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(savedPosts);
  }, []);


  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const addPost = (post) => {
    post.id = posts.length + 1;
    setPosts([...posts, post]);
  };

  const addComment = (postId, comment) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  return (
    <div>
      <h1>Forum</h1>
      {selectedPost ? (
        <PostDetails post={selectedPost} addComment={addComment} />
      ) : (
        <>
          <CreatePost addPost={addPost} />
          <PostList posts={posts} setSelectedPost={setSelectedPost} />
        </>
      )}
      {selectedPost && (
        <button onClick={() => setSelectedPost(null)}>Back to posts</button>
      )}
    </div>
  );
}

export default App;
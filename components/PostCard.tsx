import React from 'react';

function PostCard({post}) {
    
    return (
        <section className="card my-4 py-4">
            <div className="container">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <p>{post.created_at}</p>
            </div>
        </section>

    )
}
export default PostCard;
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export function Discussion({ comments = [] }) {
  const [newComment, setNewComment] = useState('');
  const [thread, setThread] = useState(comments);
  const { user } = useAuth();

  const handlePost = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setThread([...thread, {
      id: Date.now().toString(),
      author: user.name,
      role: user.role,
      content: newComment,
      timestamp: 'Just now',
    }]);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">Discussion</h3>
      
      <div className="space-y-4">
        {thread.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              {comment.author.charAt(0)}
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-semibold text-slate-900">{comment.author}</span>
                  <span className="ml-2 text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded">{comment.role}</span>
                </div>
                <span className="text-xs text-slate-400">{comment.timestamp}</span>
              </div>
              <p className="text-slate-700 text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}
        {thread.length === 0 && (
          <p className="text-sm text-slate-500 text-center py-4">No comments yet. Start the conversation!</p>
        )}
      </div>

      <form onSubmit={handlePost} className="mt-6">
        <label htmlFor="comment" className="sr-only">Add your comment</label>
        <textarea
          id="comment"
          rows="3"
          className="block w-full rounded-md border border-slate-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Add your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <Button type="submit">Post Comment</Button>
        </div>
      </form>
    </div>
  );
}

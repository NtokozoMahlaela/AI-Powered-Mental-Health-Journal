import React, { useState } from 'react';
import API from '../utils/api';

export default function JournalForm({ onEntryCreated }) {
  const [content, setContent] = useState('');
  const [entry, setEntry] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post('/journal', { content });
    setEntry(res.data);
    onEntryCreated();
    setContent('');
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-32 p-2 border"
          placeholder="How are you feeling today?"
        />
        <button className="btn mt-2">Submit Entry</button>
      </form>

      {entry && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <p><strong>Emotion:</strong> {entry.emotion}</p>
          <p><strong>Suggestion:</strong> {entry.suggestion}</p>
        </div>
      )}
    </div>
  );
}

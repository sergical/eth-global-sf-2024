// pages/index.tsx
"use client"; // <-- Add this at the top

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Home() {
  const [blobs, setBlobs] = useState<{ blob_id: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlobIds = async () => {
      const user_id = '80a9ef87-371d-4614-a823-333b7111c69c'; // Replace with your user ID logic
      const { data, error } = await supabase
        .from('user_blobs') // Replace with your actual table name
        .select('blob_id')
        .eq('user_id', user_id);

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        console.log('Supabase data:', data); // Debugging step
        setBlobs(data || []);
      }
    };

    fetchBlobIds();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Your Blob IDs</h1>
      <ul>
        {blobs.map((blob) => (
          <li key={blob.blob_id}>{blob.blob_id}</li>
        ))}
      </ul>
    </div>
  );
}

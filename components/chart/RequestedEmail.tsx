"use client";
import { Button } from '@/components/ui/button';
import React, { useEffect, useState, useCallback } from 'react';

const RequestedEmail = ({ token, userEmail }: { token: string, userEmail: string }) => {
  const [requestedEmails, setRequestedEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized API call to fetch requested emails
  const fetchRequestedEmails = useCallback(async () => {
    try {
      const response = await fetch(`/api/get-access-request-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, userEmail }),
      });

      const data = await response.json();
      if (response.ok) {
        setRequestedEmails(data.requestEmails || []);
        setError(null);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error fetching requested emails:', error);
      setError('Failed to fetch requested emails.');
    } finally {
      setLoading(false);
    }
  }, [token, userEmail]);

  // Fetch data on component mount
  useEffect(() => {
    fetchRequestedEmails();
  }, [fetchRequestedEmails]);

  // Memoized function to handle access request updates
  const updateAccessRequest = useCallback(async (email: string, action: 'accept' | 'reject') => {
    try {
      const response = await fetch(`/api/chart-access-request-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, userEmail, requestedEmail: email, action }),
      });

      if (response.ok) {
        setRequestedEmails((prev) => prev.filter((e) => e !== email)); // Remove the email from list
      } else {
        const data = await response.json();
        console.error(`Error ${action}ing access:`, data.message);
      }
    } catch (error) {
      console.error(`Error ${action}ing access:`, error);
    }
  }, [token, userEmail]);

  // Handle accept and reject actions with memoized callbacks
  const handleAccept = useCallback((email: string) => {
    updateAccessRequest(email, 'accept');
  }, [updateAccessRequest]);

  const handleReject = useCallback((email: string) => {
    updateAccessRequest(email, 'reject');
  }, [updateAccessRequest]);

  // Conditional rendering based on loading and error states
  if (loading) return <p>Loading requested emails...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='w-full px-5'>
      <h3>Access Requests</h3>
      {requestedEmails.length > 0 ? (
        <ul>
          {requestedEmails.map((email) => (
            <li className="flex gap-5 items-center" key={email}>
              {email}
              <Button onClick={() => handleAccept(email)}>Accept</Button>
              <Button onClick={() => handleReject(email)}>Reject</Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No access requests found.</p>
      )}
    </div>
  );
}

export default React.memo(RequestedEmail);
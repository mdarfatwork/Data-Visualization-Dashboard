"use client"
import React, { useState } from 'react';

const RequestPage = ({ token, userEmail, isRequested }: { token: string, userEmail: string, isRequested: boolean }) => {
    const [requestSent, setRequestSent] = useState(isRequested);

    const handleRequestAccess = async () => {
        try {
            const response = await fetch(`/api/request-access`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, userEmail }),
            });

            const data = await response.json();
            if (response.ok) {
                // Mark the request as sent after the successful API call
                setRequestSent(true);
            } else {
                console.error('Error requesting access:', data.error);
            }
        } catch (error) {
            console.error('Error while requesting access:', error);
        }
    };

    return (
        <div className='text-center py-5'>
            {requestSent ? (
                <p>Access request already sent!</p>
            ) : (
                <button onClick={handleRequestAccess}>
                    Request Access
                </button>
            )}
        </div>
    );
};

export default RequestPage;
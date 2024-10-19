"use client"
import React, { useState, useCallback } from 'react'
import SignUpForm from './SignUpForm';
import Verification from './Verification';

const SignUpFlow = () => {
  const [verifying, setVerifying] = useState(false);

  const handleChange = useCallback((isVerifying: boolean) => {
    setVerifying(isVerifying);
  }, []);

  return !verifying ? <SignUpForm onSend={handleChange} /> : <Verification />;
};

export default SignUpFlow;
import React from 'react';
import DocsBottomBar from '../components/DocsBottomBar';

export default function Root({ children }) {
  return (
    <>
      {children}
      <DocsBottomBar />
    </>
  );
}

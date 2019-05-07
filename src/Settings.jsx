/* eslint-disable react/self-closing-comp */
import React, { useEffect } from 'react';

let importEl;

// @ts-ignore
const Settings = () => {
  useEffect(() => {
    if (!importEl) {
      importEl = document.createElement('link');
      importEl.rel = 'import';
      importEl.href = '/humla-settings.html';
      importEl.id = 'humla-settings-import';
      document.head.appendChild(importEl);
    }
  }, []);
  return <humla-settings>Loading...</humla-settings>;
};

export default Settings;

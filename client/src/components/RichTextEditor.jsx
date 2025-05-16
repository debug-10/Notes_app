import React from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const RichTextEditor = ({ value, onChange }) => {
  return (
    <BraftEditor
      value={value}
      onChange={onChange}
      style={{ border: '1px solid #ccc' }}
      contentStyle={{ minHeight: '200px' }}
    />
  );
};

export default RichTextEditor;

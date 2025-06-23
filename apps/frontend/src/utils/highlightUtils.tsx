import React, { ReactNode } from 'react';
import { removeVietnameseTones } from './vietnameseUtils';

export const highlightMatches = (text: string, keyword: string): ReactNode => {
  if (!keyword) return text;

  const normalizedText = removeVietnameseTones(text);
  const normalizedKeyword = removeVietnameseTones(keyword.trim().toLowerCase());

  const matchIndex = normalizedText.indexOf(normalizedKeyword);
  if (matchIndex === -1) return text;
  let startOriginal = -1;
  let endOriginal = -1;
  let currentNormalized = '';
  
  for (let i = 0; i < text.length; i++) {
    currentNormalized += removeVietnameseTones(text[i]);
    
    if (currentNormalized.length === matchIndex && startOriginal === -1) {
      startOriginal = i + 1;
    }
    if (currentNormalized.length === matchIndex + normalizedKeyword.length) {
      endOriginal = i + 1;
      break;
    }
  }

  if (startOriginal === -1 || endOriginal === -1) return text;

  const before = text.slice(0, startOriginal);
  const match = text.slice(startOriginal, endOriginal);
  const after = text.slice(endOriginal);

  return (
    <>
      {before}
      <span className="text-red-500 font-semibold">{match}</span>
      {after}
    </>
  );
};

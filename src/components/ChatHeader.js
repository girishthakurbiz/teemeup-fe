import React from 'react';

const getLastTwoKeywords = (url, param) => {
  const val = new URL(url).searchParams.get(param);
  return val ? val.split('-').slice(-2).join('-') : null;
};

const ChatHeader = () => {
  const url = window.location.href;
  const productType = getLastTwoKeywords(url, "product");

  return (
    <div className="chat-header">
      <span>{`Customize your ${productType ?? 'Design'}`}</span>
    </div>
  );
};

export default ChatHeader;

"use client";

import React from 'react';
import io from 'socket.io-client';

const socket = io('https://iruka541.github.io/NextChat/');

const HybridChatComponent = () => {
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState<any[]>([]);
  const [username, setUsername] = React.useState<string | null>(null);

  React.useEffect(() => {
    // クライアントサイドでWebSocket接続
    socket.on('connect', () => {
      console.log('Connected to WebSocket on the client side');
    });

    // メッセージを受信したときの処理
    socket.on('message', (data: any) => {
      setMessages((prevMessages: any[]) => [data, ...prevMessages]);
    });

    // コンポーネントのアンマウント時にイベントリスナーを解除
    return () => {
      socket.off('connect');
      socket.off('message');
    };
  }, []);

  // メッセージを送信する関数
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { username: username || '匿名', message: message });
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-4 bg-white rounded shadow">
        <div className="mb-2">
          <input
            className="w-full p-2 border rounded"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="メッセージを入力"
          />
          <input
            className="w-full p-2 border rounded mt-2"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名を入力"
          />
          <button
            className="w-full p-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            onClick={sendMessage}
          >
            送信
          </button>
        </div>
        <div className="h-64 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 border-b">{msg.username}: {msg.message}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HybridChatComponent;
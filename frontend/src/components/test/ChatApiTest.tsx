// src/components/test/ChatApiTest.tsx
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { chatApiService } from '../../services/chatApi';
import { useAuth } from '../../contexts/AuthContext';

export default function ChatApiTest() {
  const { isAuthenticated, token, user } = useAuth();
  const [conversationId, setConversationId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createConversation = async () => {
    setIsLoading(true);
    try {
      const result = await chatApiService.createConversation();
      setConversationId(result.conversation_id);
      setResponse(`Conversation created: ${result.conversation_id}`);
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!conversationId || !message) return;
    
    setIsLoading(true);
    try {
      const result = await chatApiService.sendMessage({
        conversation_id: conversationId,
        content: message,
        content_type: 0
      });
      setResponse(`Bot: ${result.content}`);
      
      // Try to parse trip object
      if (result.object) {
        const tripData = chatApiService.parseTripObject(result.object);
        console.log('Parsed trip data:', tripData);
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLegacyMethod = async () => {
    setIsLoading(true);
    try {
      const result = await chatApiService.sendLegacyMessage({
        message: message || 'Hello, I want to travel to Japan',
        conversationId: conversationId || undefined
      });
      setResponse(`Legacy Bot: ${result.message}`);
      if (!conversationId) {
        setConversationId(result.conversationId);
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800">Authentication Required</h2>
        <p className="text-yellow-700">Please sign in to test the chat API.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Chat API Test</h2>
        <p className="text-sm text-blue-700">User: {user?.username}</p>
        <p className="text-sm text-blue-700">Token: {token ? '✅ Present' : '❌ Missing'}</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Conversation ID:</label>
        <Input
          value={conversationId}
          onChange={(e) => setConversationId(e.target.value)}
          placeholder="Will be generated when creating conversation"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Message:</label>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="hello i want to travel tomorrow, i want to go to japan alone"
          disabled={isLoading}
        />
      </div>

      <div className="flex space-x-2">
        <Button onClick={createConversation} disabled={isLoading}>
          Create Conversation
        </Button>
        <Button onClick={sendMessage} disabled={isLoading || !conversationId}>
          Send Message
        </Button>
        <Button onClick={testLegacyMethod} disabled={isLoading}>
          Test Legacy Method
        </Button>
      </div>

      {response && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium mb-2">Response:</h3>
          <pre className="text-sm whitespace-pre-wrap">{response}</pre>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>API Endpoints:</strong></p>
        <p>• POST /chat/create (creates conversation)</p>
        <p>• POST /chat (sends message with conversation_id, content, content_type)</p>
        <p><strong>Authentication:</strong> Bearer token in Authorization header</p>
      </div>
    </div>
  );
}
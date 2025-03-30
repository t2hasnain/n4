'use client';

import { useState, useEffect } from 'react';
import { db, rtdb } from '@/app/lib/firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { ref, get, remove, update } from 'firebase/database';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: any;
  read: boolean;
  source: 'firestore' | 'realtime';
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (date: any) => {
    if (!date) return 'Unknown date';
    
    try {
      // Handle Firestore Timestamp
      if (date instanceof Timestamp) {
        return new Date(date.toMillis()).toLocaleString();
      }
      
      // Handle ISO string from Realtime DB
      if (typeof date === 'string') {
        return new Date(date).toLocaleString();
      }
      
      // Handle date objects
      if (date instanceof Date) {
        return date.toLocaleString();
      }
      
      return 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date error';
    }
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // Get messages from Firestore
      const firestoreMessages: Message[] = [];
      const messagesQuery = query(
        collection(db, 'messages'), 
        orderBy('createdAt', 'desc')
      );
      
      const messagesSnapshot = await getDocs(messagesQuery);
      messagesSnapshot.forEach(doc => {
        firestoreMessages.push({
          id: doc.id,
          ...doc.data(),
          source: 'firestore'
        } as Message);
      });
      
      // Get messages from Realtime Database
      const realtimeMessages: Message[] = [];
      const messagesRef = ref(rtdb, 'messages');
      const snapshot = await get(messagesRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.entries(data).forEach(([id, messageData]: [string, any]) => {
          realtimeMessages.push({
            id,
            ...messageData,
            source: 'realtime'
          } as Message);
        });
      }
      
      // Combine and sort all messages
      const allMessages = [...firestoreMessages, ...realtimeMessages];
      allMessages.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp 
          ? a.createdAt.toMillis() 
          : new Date(a.createdAt).getTime();
        
        const dateB = b.createdAt instanceof Timestamp 
          ? b.createdAt.toMillis() 
          : new Date(b.createdAt).getTime();
        
        return dateB - dateA;
      });
      
      setMessages(allMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // Mark as read if unread
    if (!message.read) {
      markAsRead(message);
    }
  };

  const markAsRead = async (message: Message) => {
    try {
      if (message.source === 'firestore') {
        await updateDoc(doc(db, 'messages', message.id), {
          read: true
        });
      } else if (message.source === 'realtime') {
        await update(ref(rtdb, `messages/${message.id}`), {
          read: true
        });
      }
      
      // Update local state
      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      ));
      
      if (selectedMessage && selectedMessage.id === message.id) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
      setError('Failed to mark message as read.');
    }
  };

  const handleDeleteMessage = async (message: Message) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      if (message.source === 'firestore') {
        await deleteDoc(doc(db, 'messages', message.id));
      } else if (message.source === 'realtime') {
        await remove(ref(rtdb, `messages/${message.id}`));
      }
      
      // Update local state
      setMessages(messages.filter(m => m.id !== message.id));
      
      if (showModal && selectedMessage && selectedMessage.id === message.id) {
        setShowModal(false);
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setError('Failed to delete message.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Messages</h1>
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No messages received yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map((message) => (
                  <tr 
                    key={`${message.source}-${message.id}`} 
                    className={`${!message.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''} hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {message.read ? (
                        <FaEnvelopeOpen className="text-gray-400" />
                      ) : (
                        <FaEnvelope className="text-blue-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${!message.read ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                        {message.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {message.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${!message.read ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                        {message.subject || '(No subject)'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        message.source === 'firestore' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {message.source === 'firestore' ? 'Firestore' : 'Realtime DB'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message);
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedMessage.subject || '(No subject)'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">From:</p>
                    <p className="text-gray-900 dark:text-white">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email:</p>
                    <a 
                      href={`mailto:${selectedMessage.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      {selectedMessage.email}
                      <FaExternalLinkAlt className="ml-2 h-3 w-3" />
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Received:</p>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Source:</p>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedMessage.source === 'firestore' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {selectedMessage.source === 'firestore' ? 'Firestore' : 'Realtime DB'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Message:</p>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <pre className="whitespace-pre-wrap text-gray-900 dark:text-white font-sans">
                    {selectedMessage.message}
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
              <button
                onClick={() => handleDeleteMessage(selectedMessage)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <FaTrash className="mr-2" />
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
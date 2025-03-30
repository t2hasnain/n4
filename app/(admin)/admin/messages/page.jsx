'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { db, rtdb } from '@/app/lib/firebase.js';
import { collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { ref, onValue, update, remove } from 'firebase/database';
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaExternalLinkAlt, FaEye, FaTimes, FaCheck } from 'react-icons/fa';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      
      // Get messages from Firestore
      const messagesQuery = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
      const messagesSnapshot = await getDocs(messagesQuery);
      
      const firestoreMessages = messagesSnapshot.docs.map(doc => {
        const data = doc.data();
        // Format the timestamp
        let formattedDate = 'Unknown date';
        if (data.timestamp) {
          // Handle Firestore timestamp
          if (data.timestamp.toDate) {
            formattedDate = format(data.timestamp.toDate(), 'PPpp');
          } 
          // Handle ISO string from Realtime DB
          else if (typeof data.timestamp === 'string') {
            formattedDate = format(new Date(data.timestamp), 'PPpp');
          }
        }
        
        return {
          id: doc.id,
          name: data.name || 'Unknown',
          email: data.email || 'No email provided',
          phone: data.phone || 'No phone provided',
          subject: data.subject || 'No subject',
          message: data.message || 'No message content',
          timestamp: data.timestamp,
          formattedDate,
          read: data.read || false,
          source: 'firestore'
        };
      });
      
      // Get messages from Realtime Database
      const realtimeMessages = [];
      const messagesRef = ref(rtdb, 'messages');
      
      // Using promise to wait for onValue to complete
      await new Promise(resolve => {
        onValue(messagesRef, (snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const data = childSnapshot.val();
              realtimeMessages.push({
                id: childSnapshot.key,
                ...data,
                formattedDate: data.timestamp ? format(new Date(data.timestamp), 'PPpp') : 'Unknown date',
                source: 'realtime'
              });
            });
          }
          console.log("Realtime DB messages:", realtimeMessages);
          resolve();
        }, { onlyOnce: true });
      });
      
      const allMessages = [...firestoreMessages, ...realtimeMessages];
      
      // Sort by timestamp descending
      allMessages.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp.seconds ? a.timestamp.seconds * 1000 : a.timestamp) : new Date(0);
        const dateB = b.timestamp ? new Date(b.timestamp.seconds ? b.timestamp.seconds * 1000 : b.timestamp) : new Date(0);
        return dateB - dateA;
      });
      
      setMessages(allMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMessages();
  }, []);
  
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // Mark as read if not already
    if (!message.read) {
      markAsRead(message);
    }
  };
  
  const markAsRead = async (message) => {
    try {
      if (message.source === 'firestore') {
        const messageRef = doc(db, 'messages', message.id);
        await updateDoc(messageRef, {
          read: true
        });
      } else if (message.source === 'realtime') {
        await update(ref(rtdb, `messages/${message.id}`), {
          read: true
        });
      }
      
      // Update local state
      setMessages(prevMessages =>
        prevMessages.map(m =>
          m.id === message.id ? { ...m, read: true } : m
        )
      );
      
      if (selectedMessage && selectedMessage.id === message.id) {
        setSelectedMessage({ ...selectedMessage, read: true });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };
  
  const handleDeleteMessage = async (message) => {
    if (!confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      if (message.source === 'firestore') {
        const messageRef = doc(db, 'messages', message.id);
        await deleteDoc(messageRef);
      } else if (message.source === 'realtime') {
        await remove(ref(rtdb, `messages/${message.id}`));
      }
      
      // Remove from local state
      setMessages(prevMessages => prevMessages.filter(m => m.id !== message.id));
      
      // Close modal if the deleted message was selected
      if (selectedMessage && selectedMessage.id === message.id) {
        closeModal();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedMessage(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>{error}</p>
        <button 
          onClick={fetchMessages}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Messages</h1>
        <button
          onClick={fetchMessages}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {messages.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">No messages found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {messages.map(message => (
                  <tr 
                    key={`${message.source}-${message.id}`} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!message.read ? 'font-semibold bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {message.read ? (
                        <div className="text-gray-400 dark:text-gray-500">
                          <FaEnvelopeOpen size={18} />
                        </div>
                      ) : (
                        <div className="text-blue-500">
                          <FaEnvelope size={18} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{message.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{message.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{message.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{message.formattedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        message.source === 'firestore' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {message.source === 'firestore' ? 'Firestore' : 'Realtime DB'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMessage(message);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(message);
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
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
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold dark:text-white">{selectedMessage.subject}</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                  <p className="font-medium dark:text-white">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                  <p className="font-medium dark:text-white">{selectedMessage.formattedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium dark:text-white">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium dark:text-white">{selectedMessage.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Source</p>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedMessage.source === 'firestore' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                    {selectedMessage.source === 'firestore' ? 'Firestore' : 'Realtime DB'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedMessage.read 
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {selectedMessage.read ? (
                      <span className="flex items-center"><FaCheck className="mr-1" /> Read</span>
                    ) : (
                      <span className="flex items-center"><FaEnvelope className="mr-1" /> Unread</span>
                    )}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Message</p>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="whitespace-pre-line dark:text-white">{selectedMessage.message}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => handleDeleteMessage(selectedMessage)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
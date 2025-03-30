'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db, rtdb } from '@/app/lib/firebase.js';
import { collection, addDoc, serverTimestamp, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { ref, set, get } from 'firebase/database';
import { FaPaperPlane } from 'react-icons/fa';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [userIP, setUserIP] = useState('');
  const [submissionCount, setSubmissionCount] = useState(0);
  
  // Add a debug component to show Firebase connection status
  const [debugMode, setDebugMode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    firestoreConnected: false,
    rtdbConnected: false
  });
  
  // Fetch user IP on component mount
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip);
        console.log('User IP:', data.ip);
        
        // Check previous submissions from this IP
        await checkPreviousSubmissions(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
        // Fallback
        setUserIP('unknown');
      }
    };
    
    fetchIP();
  }, []);
  
  useEffect(() => {
    // Check Firebase connections
    const checkConnections = async () => {
      // Check Firestore
      try {
        const testQuery = query(collection(db, 'messages'), where('test', '==', true));
        await getDocs(testQuery);
        setConnectionStatus(prev => ({ ...prev, firestoreConnected: true }));
        console.log('Firestore connection successful');
      } catch (error) {
        console.error('Firestore connection error:', error);
        setConnectionStatus(prev => ({ ...prev, firestoreConnected: false }));
      }
      
      // Check Realtime Database
      try {
        const testRef = ref(rtdb, '.info/connected');
        const snapshot = await get(testRef);
        setConnectionStatus(prev => ({ ...prev, rtdbConnected: snapshot.exists() }));
        console.log('Realtime Database connection:', snapshot.exists());
      } catch (error) {
        console.error('Realtime Database connection error:', error);
        setConnectionStatus(prev => ({ ...prev, rtdbConnected: false }));
      }
    };
    
    checkConnections();
  }, []);
  
  // Add Firebase connection check and initialization logic
  useEffect(() => {
    const checkFirebaseAndReinitialize = async () => {
      try {
        console.log('Firebase initialization check:');
        console.log('- DB app:', db?._firestore?.app?.name || 'not initialized');
        console.log('- RTDB app:', rtdb?.app?.name || 'not initialized');
        
        // Test Firebase Firestore connection
        try {
          const testRef = collection(db, 'test');
          const testDoc = await addDoc(testRef, { 
            test: true, 
            timestamp: serverTimestamp() 
          });
          console.log('Firestore test successful, test document created:', testDoc.id);
          // Clean up test document
          await deleteDoc(doc(db, 'test', testDoc.id));
          console.log('Firestore test document cleaned up');
          setConnectionStatus(prev => ({ ...prev, firestoreConnected: true }));
        } catch (firestoreError) {
          console.error('Firestore test failed:', firestoreError);
          setConnectionStatus(prev => ({ ...prev, firestoreConnected: false }));
        }
        
        // Test Realtime Database connection
        try {
          const testRef = ref(rtdb, 'test');
          await set(testRef, { 
            test: true, 
            timestamp: new Date().toISOString() 
          });
          console.log('Realtime Database test successful');
          setConnectionStatus(prev => ({ ...prev, rtdbConnected: true }));
        } catch (rtdbError) {
          console.error('Realtime Database test failed:', rtdbError);
          setConnectionStatus(prev => ({ ...prev, rtdbConnected: false }));
        }
      } catch (error) {
        console.error('Firebase check failed:', error);
      }
    };
    
    checkFirebaseAndReinitialize();
  }, []);
  
  const checkPreviousSubmissions = async (ip) => {
    try {
      // Check Firestore for previous submissions
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, where('ip', '==', ip));
      const querySnapshot = await getDocs(q);
      
      // Count submissions
      const count = querySnapshot.size;
      setSubmissionCount(count);
      console.log(`Previous submissions from IP ${ip}: ${count}`);
      
      // If already submitted 2+ times, show admin contact info
      if (count >= 2) {
        setSubmitError('You have already submitted multiple messages. Please contact us directly at admin@t2hasnain.com or call +1234567890 for assistance.');
      }
    } catch (error) {
      console.error('Error checking previous submissions:', error);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check submission limit
    if (submissionCount >= 2) {
      setSubmitError('You have already submitted multiple messages. Please contact us directly at admin@t2hasnain.com or call +1234567890 for assistance.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    try {
      // Generate a unique ID for the message
      const messageId = uuidv4();
      const timestamp = new Date().toISOString();
      
      console.log('Submitting to Firestore and Realtime Database...');
      console.log('Message data:', { ...formData, id: messageId, ip: userIP });
      console.log('Firebase config project ID:', db?._firestore?.app?.options?.projectId || 'unknown');
      console.log('Realtime Database URL:', rtdb?.app?.options?.databaseURL || 'unknown');
      
      let firestoreSuccess = false;
      let rtdbSuccess = false;
      
      // Save to Firestore
      try {
        // Using direct collection path
        const messagesCollection = collection(db, 'messages');
        console.log('Writing to Firestore collection:', messagesCollection.path);
        
        const docRef = await addDoc(messagesCollection, {
          ...formData,
          id: messageId,
          createdAt: serverTimestamp(),
          read: false,
          source: 'website',
          ip: userIP
        });
        console.log('Message saved to Firestore with ID:', docRef.id);
        firestoreSuccess = true;
      } catch (firestoreError) {
        console.error('Error saving to Firestore:', firestoreError);
        // Continue with Realtime Database even if Firestore fails
      }
      
      // Save to Realtime Database
      try {
        // Use a specific path for this project
        const rtdbPath = `contacts/${messageId}`;
        console.log('Writing to Realtime Database path:', rtdbPath);
        
        const rtdbRef = ref(rtdb, rtdbPath);
        await set(rtdbRef, {
          ...formData,
          id: messageId,
          createdAt: timestamp,
          read: false,
          source: 'website',
          ip: userIP
        });
        console.log('Message saved to Realtime Database with ID:', messageId);
        rtdbSuccess = true;
      } catch (rtdbError) {
        console.error('Error saving to Realtime Database:', rtdbError);
      }
      
      if (!firestoreSuccess && !rtdbSuccess) {
        throw new Error('Failed to save message to any database');
      }
      
      console.log('Message submitted successfully');
      setSubmitSuccess('Your message has been sent successfully! We will get back to you soon.');
      
      // Update submission count
      setSubmissionCount(prev => prev + 1);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitError('Failed to send your message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Debug toggle button - hidden in production */}
      <div className="text-right mb-2">
        <button 
          onClick={() => setDebugMode(!debugMode)} 
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {debugMode ? 'Hide Debug' : 'Debug'}
        </button>
      </div>
      
      {/* Debug information */}
      {debugMode && (
        <div className="mb-4 p-3 bg-gray-100 text-gray-800 rounded-lg text-xs font-mono">
          <p>Firebase Connections:</p>
          <ul className="list-disc pl-5 mt-1">
            <li className={connectionStatus.firestoreConnected ? 'text-green-600' : 'text-red-600'}>
              Firestore: {connectionStatus.firestoreConnected ? 'Connected' : 'Disconnected'}
            </li>
            <li className={connectionStatus.rtdbConnected ? 'text-green-600' : 'text-red-600'}>
              Realtime DB: {connectionStatus.rtdbConnected ? 'Connected' : 'Disconnected'}
            </li>
          </ul>
          <p className="mt-2">User IP: {userIP || 'unknown'}</p>
          <p>Submission Count: {submissionCount}</p>
        </div>
      )}
      
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
          {submitSuccess}
        </div>
      )}
      
      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
          {submitError}
        </div>
      )}
      
      {submissionCount >= 2 ? (
        <div className="mb-4 p-6 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100">
          <h3 className="font-bold text-lg mb-2">Contact Us Directly</h3>
          <p className="mb-2">You've reached the maximum number of contact form submissions. Please reach out to us directly:</p>
          <ul className="list-disc pl-5 mb-2">
            <li>Email: <a href="mailto:admin@t2hasnain.com" className="text-blue-600 underline">admin@t2hasnain.com</a></li>
            <li>Phone: +1234567890</li>
          </ul>
          <p>We'll respond to your inquiry as soon as possible.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Your email address"
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Message subject"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Your message"
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || submissionCount >= 2}
            className={`w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting || submissionCount >= 2 ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane className="mr-2" />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
} 
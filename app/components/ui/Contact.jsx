'use client';

import ContactForm from './ContactForm';

export default function Contact() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Get In Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Have a project in mind or just want to say hello? I'd love to hear from you!
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Contact Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Feel free to reach out through any of these channels:
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Email</h4>
                    <a href="mailto:hasnainff9999@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                      hasnainff9999@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Phone</h4>
                    <a href="tel:+447745819191" className="text-blue-600 dark:text-blue-400 hover:underline">
                      +44 7745819191
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">Location</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-7">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Send me a message
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
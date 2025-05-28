import { useState } from 'react';
import { Search, MessageSquare, Phone, Mail, ExternalLink, ChevronRight } from 'lucide-react';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const commonQuestions = [
    {
      question: 'How do I create a new test?',
      answer: 'Click on "New Test" button in My Tests section, then follow the step-by-step configuration process.'
    },
    {
      question: 'How can I add students to my database?',
      answer: 'Go to Result Database section, click "Add Students" and fill in the required information.'
    },
    {
      question: 'How do I export test results?',
      answer: 'In the Results Database section, find the database you want to export and click the "Export" button.'
    },
    {
      question: 'Can I edit a test after creating it?',
      answer: 'Yes, you can edit both the test configuration and questions by clicking the edit button on the test card.'
    }
  ];

  const supportChannels = [
    {
      icon: <MessageSquare size={24} />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: <Phone size={24} />,
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      action: 'Call Now',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email Support',
      description: 'support@example.com',
      action: 'Send Email',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {supportChannels.map((channel, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className={`w-12 h-12 rounded-lg ${channel.color} flex items-center justify-center mb-4`}>
              {channel.icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{channel.title}</h3>
            <p className="text-gray-600 mb-4">{channel.description}</p>
            <button className="flex items-center text-emerald-600 hover:text-emerald-700">
              <span>{channel.action}</span>
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y">
          {commonQuestions.map((item, index) => (
            <div key={index} className="p-6">
              <h3 className="text-base font-medium mb-2">{item.question}</h3>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-50 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-emerald-900 mb-2">Need more help?</h2>
            <p className="text-emerald-700">Check out our comprehensive documentation for detailed guides and tutorials.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
            <span>View Documentation</span>
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
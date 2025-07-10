import React from 'react';
import { Video, Book, FileText, Link as LinkIcon } from 'lucide-react';

const PathwayContent = ({ pathwayTitle, content }) => {
  // Helper function to render content based on type
  const renderContentItem = (item, index) => {
    const getIcon = (type) => {
      switch (type) {
        case 'video':
          return <Video className="w-5 h-5 text-blue-500" />;
        case 'reading':
          return <Book className="w-5 h-5 text-green-500" />;
        case 'worksheet':
          return <FileText className="w-5 h-5 text-purple-500" />;
        case 'resource':
          return <LinkIcon className="w-5 h-5 text-orange-500" />;
        default:
          return null;
      }
    };

    return (
      <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-50 rounded-lg">
            {getIcon(item.type)}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-800">{item.title}</h4>
            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
            {item.type === 'video' && (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                <iframe
                  src={item.url}
                  title={item.title}
                  className="w-full h-full"
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              </div>
            )}
            {item.type === 'reading' && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                Read Material
                <LinkIcon className="w-4 h-4 ml-1" />
              </a>
            )}
            {item.type === 'worksheet' && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 hover:text-purple-800"
              >
                Download Worksheet
                <LinkIcon className="w-4 h-4 ml-1" />
              </a>
            )}
            {item.type === 'resource' && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-orange-600 hover:text-orange-800"
              >
                Access Resource
                <LinkIcon className="w-4 h-4 ml-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{pathwayTitle} Content</h3>
      <div className="grid gap-4">
        {content.map((item, index) => renderContentItem(item, index))}
      </div>
    </div>
  );
};

export default PathwayContent; 
import React from "react";

const ContactItem = ({ contact, onClick }) => (
    <div onClick={onClick}
         className="flex items-center px-2 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
        <div className="relative">
            <img
                src={contact.avatar}
                alt={contact.name}
                className="w-9 h-9 rounded-full object-cover"
            />
            {contact.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
        </div>
        <div className="ml-3 flex-1 min-w-0">
            <div className="text-gray-800 text-sm font-medium truncate">
                {contact.name}
            </div>
            {contact.lastSeen && (
                <div className="text-green-600 text-xs">
                    {contact.lastSeen}
                </div>
            )}
        </div>
    </div>
);
export default ContactItem;
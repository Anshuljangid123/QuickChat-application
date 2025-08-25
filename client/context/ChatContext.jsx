import { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({children}) => {

    const [messages , setMessages] = useState([]);
    const [users , setUsers] = useState([]);// list of user for left side bar . 
    const [selectedUser , setSelectedUser] = useState(null);// id of the user with whome we want to chat . 
    const [unseenMessages , setUnseenMessages] = useState({}); 
    // user id and number of messages that is unseen for the perticular user

    

    const value = {
        // when we add any variable or function , we can access that in any component 

    }
    return (

        <ChatContext.Provider>
            {children}
        </ChatContext.Provider>
    )
}
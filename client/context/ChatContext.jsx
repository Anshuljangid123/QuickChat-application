import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({children}) => {

    const [messages , setMessages] = useState([]);
    const [users , setUsers] = useState([]);// list of user for left side bar . 
    const [selectedUser , setSelectedUser] = useState(null);// id of the user with whome we want to chat . 
    const [unseenMessages , setUnseenMessages] = useState({}); 
    // user id and number of messages that is unseen for the perticular user

    const {socket , axios} = useContext(AuthContext);

    // get users for the sidebar . function () ;

    const getUsers = async() => {

        // function to get the list of the users for the sidebar.
        try{
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        }
        catch(error){
            toast.error(error.messages); 
        }
    }

    //function to get messages to get messages for the selected user . 
    const getMessages = async (userId) =>{
        try{
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }

        }
        catch(error){
            toast.error(error.message);
        }
    }

    // send the msg to selected user . 
    const sendMessage = async(messageData) =>{
        try{
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}` , messageData);
            if(data.success){
                // store this new message data in the messages state
                setMessages((prevMessages) => [...prevMessages , data.newMessage])
            }
            else{
                toast.error(data.message);
            }

        }
        catch(error){
            toast.error(error.message);
        }
    }

    // function to subscribe to message for selected user
    // to get the msg in real time 
    const subscribeToMessages = async() => {
        if(!socket) return ; 

        socket.on("newMessage" , (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                // A user is selected, and
                //The message comes from that same user (newMessage.senderId === selectedUser._id)

                // chatbox is open for the selected user . 
                // the user is currently chatting with the sender . 
                newMessage.seen = true;
                setMessages((prevMessage) => [...prevMessage , newMessage]);
                // add the new message in the new state . 
                // api call to update the seen property 
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else{
                //  a new msg emit on the socket but msg sender id != selected user id 
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages , [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1 
                }))
            }
        })
    }

    //function to unsubscribe from messages 
    const unsubscribeFromMessages = () => {
        if(socket) socket.off("newMessage");


    }

    useEffect(()=>{
        subscribeToMessages();
        return () => unsubscribeFromMessages();
        // run these function when ever we connect or disconnect form the socket 
    }, [socket , selectedUser])

    const value = {
        // when we add any variable or function , we can access that in any component 
        messages , users , selectedUser , getUsers , getMessages , sendMessage , setSelectedUser , unseenMessages, setUnseenMessages 

    }
    return (

        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
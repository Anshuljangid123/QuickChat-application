import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
//import { text } from 'stream/consumers';
import toast from 'react-hot-toast';

const ChatContainer = () => {

    const {messages , selectedUser , setSelectedUser ,  sendMessage, getMessages} = useContext(ChatContext);
    const {authUser , onlineUsers } = useContext(AuthContext);

    const scrollEnd = useRef();

    const [input , setInput] = useState('');

    // handle sending a message 
    const handleSendMessage = async(e) =>{
        e.preventDefault();
        if(input.trim() === "" ){
            // not send the msg 
            return null;
        }

        await sendMessage({text : input.trim()});

        // create the input field 
        setInput('');

    }

    // handle sending a image 
    const handleSendImage = async (e) => {
        const file  = e.target.files[0];
        if(!file || !file.type.startsWith("image/")){
            // if the file not exist or the file is not of image types 
            toast.error("select an image file");
            return 
        }

        const reader = new FileReader();

        // When the FileReader finishes reading the file (onloadend), do the following:

        //await sendMessage({image: reader.result});
        //reader.result contains the Base64 encoded string of the image.
        //This sends the image as a message payload (instead of plain text).

        reader.onloadend = async ()=> {
            await sendMessage({image: reader.result});
            e.target.value = "";
            // it will clear the image after sending to the api 
        }
        reader.readAsDataURL(file);
    }

    useEffect(() =>{
        if(selectedUser){
            getMessages(selectedUser._id)
        }
    },[selectedUser])


    useEffect(() =>{
        if(scrollEnd.current && messages){
            scrollEnd.current.scrollIntoView({behavior : "smooth"})
            //Smoothly scrolls the chat window until the div at the bottom (ref={scrollEnd}) is visible.
            // This ensures the user always sees the latest message.
        }
    } , [messages])


  return selectedUser ?  (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
        {/* headder part ------- */}
        <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
            <img src={selectedUser.profilePic || assets.avatar_icon} className='w-8 rounded-full' alt=''/>
            <p className='flex-1 text-lg text-white flex items-center gap-2'>

                {selectedUser.fullName}

                {/* green dot */}
                {onlineUsers?.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
            </p>

            <img src={assets.arrow_icon} className='md:hidden w-7' onClick={() => setSelectedUser(null)}/>
            <img src={assets.help_icon} alt='' className='max-md:hidden w-5'/>
        </div>

        {/* -------- chat area--------- */}
        <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
            {messages.map((msg ,index) => (

                <div  className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`} key={index}>

                    {msg.image ? (
                        <img src={msg.image} alt='' className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>
                    ) : (
                        <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'} `}>{msg.text}</p>
                    )}

                    <div className='text-center text-xs'>
                        <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} className='w-7 rounded-full'/>

                        {/* display the time when the msg is sent */}
                        <p className='text-gray-500'> {formatMessageTime(msg.createdAt)}</p>

                    </div>
                </div>
            ))}

            <div ref={scrollEnd}>
                {/* // create this reference using use ref */}
                {/* it will scroll smoothly till this div component */}
            </div>
        </div>

        {/* ---------bottome area----------- */}

        <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
            <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                <input onChange={(e)=> setInput(e.target.value)} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null } className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400' type='text' placeholder='send message'/>
                <input onChange={handleSendImage} type='file' id='image' accept='image/png , image/jpeg'  hidden/>
                <label htmlFor='image'>
                    <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer'/>
                </label>
            </div>

            <img onClick={handleSendMessage} src={assets.send_button} className='w-7 cursor-pointer'/>

        </div>
    </div>
  ) :  (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
        <img className='max-w-16' src={assets.logo_icon}/>
        <p className='text-lg font-medium text-white'>Chat anytime , anywhere</p>
    </div>
  )
}

export default ChatContainer
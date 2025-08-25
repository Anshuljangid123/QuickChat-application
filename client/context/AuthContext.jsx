// central contailner
// state variable and function related to authentication 

import { Children, useEffect, useState } from "react";
import { createContext } from "vm";

import axios from "axios";
import toast from "react-hot-toast";
import { connect } from "http2";

import {io} from "socket.io-client";

// we need backend url 

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// add the backend url as the base url in the axios api cll // restful api call
axios.defaults.baseURL = backendUrl;
// This line makes Axios automatically use your backend’s root URL (from .env) for every API request. It prevents duplication, reduces errors, and makes your code cleaner.

export const AuthContext = createContext();
// createContext() is a function in React that allows you to create a Context object.
//Context in React provides a way to share values (like data, functions, or state) between components without passing props manually at every level (called prop drilling).

// auth provider func
export const AuthProvider = ({Children}) => {

    const [token , setToken] = useState(localStorage.getItem("token"));
    const [authUser , setAuthUser] = useState(null);
    const [onlineUser , setOnlineUser] = useState([]);
    const [socket, setSocket] = useState(null);

    // check the user is authenticated and if so , set the user data and connect the socket 
    // execute this function whenever we execute the web page . 

    const checkAuth = async () => {
        try{
            const {data} = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }

    // login function to hanlde user authentication and socket connection. 
    const login = async (state , credentials) => {
        // state: a string that decides which auth endpoint to hit, e.g. "login" or "signup".credentials: the form data you send to the server (e.g. { email, password } for login or { fullName, email, password,bio } for signup).

        try{
            // for login and registration api calls 
            // sign up and login

            // {
            //   "success": true,
            //   "userData": { "_id": "...", "fullName": "...", ... },
            //   "token": "eyJhbGciOi...",
            //   "message": "Account created successfully"
            // }

            const {data} = await axios.post(`/api/auth/${state}` , credentials);
            if(data.success){
                setAuthUser(data.userData);

                connectSocket(data.userData);
                //Immediately opens a Socket.IO connection and identifies the user (so you can get online users, live messages, etc.).

                axios.defaults.headers.common["token"] = data.token;
                //Sets a global default header for all future axios requests:
                //Adds a header named token with the JWT value.
                //Your backend middleware is reading req.headers.token, so this matches your current setup

                setToken(data.token);
                //Stores the token in your React state/context (handy for components that need to know if you’re logged in).
                // store the token in the browser local storage . 

                localStorage.setItem("token" , data.token);
                //Persists the token in the browser so a page refresh keeps you logged in.On app startup, you can read it back and restore auth state.
                toast.success(data.message);

            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);

        }
    }

    // logout function to handle user logout and socket disconnection 
    

    //connect socket function to handle socket connection and online users updates .
    const connectSocket = (userData) => {
        // if socket.conneted is false then return ;
        // don’t create a new socket if the user is not logged in or already connected.
        if(!userData || socket?.connected)  return ;
        const newSocket = io(backendUrl , {
            query : {
                userId : userData._id , 
            }
            // query → extra info sent to the backend when connecting.Here we’re sending the user’s id (userData._id) so the backend knows who is connecting.
        });

        newSocket.connect();
        // This actually establishes the connection with the backend server.

        setSocket(newSocket);
        // We save the new socket instance into React state (probably using useState).

        newSocket.on("getOnlineUsers" , (userIds) => {
            setOnlineUser(userIds);
            // When the server sends an event called "getOnlineUsers",
            //It will also send a list of userIds (IDs of users who are currently online).
            // Then we call setOnlineUser(userIds) → which updates your React state of online users.
        })
    }

    useEffect(() => {
        if(token) {
            axios.defaults.headers.common["token"] = token ; 
            // it will add the token for all the api request made using axios when the token is available in the storage .
        }
        checkAuth();
    } , [])

    const value = {
        axios , 
        authUser, 
        onlineUser, 
        socket 
        
    }
    return (
        <AuthContext.provider value={value}>
            {Children}
        </AuthContext.provider>
    )
}
import React, {useEffect, useState} from 'react'
import {Spin} from 'antd';
import { uid } from 'uid';
import { users, rooms } from './Data';


export const AuthContext = React.createContext();


async function getUser(){
  return new Promise((resolve, reject) => {
      const userIndex = Math.floor(Math.random() * users.length);
    resolve(users[userIndex]);
  })
}


const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [user, setUser] = useState({});
  const [messages, setMessages] = useState([]);


  const members = [{
      id:uid()
  }];

  const selectedRoom = React.useMemo(
      () => rooms.find((room) => room.id === selectedRoomId) || {},
      [rooms, selectedRoomId]
  );
  useEffect( () => {

    async function getAUser(){
        const newUser = await getUser();
        setUser(newUser);
      if (newUser){
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
    }
  getAUser();

  }, [user])
  return (
      <AuthContext.Provider value={{
        user,
        rooms,
        members,
        selectedRoom,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        messages,
        setMessages,
      }}>
        {isLoading ? <Spin/> : children}
      </AuthContext.Provider>
  )
}

export default AuthProvider;

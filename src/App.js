import './App.css';
import AuthProvider from "./Context/AuthProvider";
import ChatRoom from './components/ChatRoom'
import AddRoomModal from "./components/Modals/AddRoomModal";



function App() {
  return (
    <AuthProvider>
        <ChatRoom />
        <AddRoomModal />
    </AuthProvider>
  );
}

export default App;

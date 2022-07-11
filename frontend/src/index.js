import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

import App from './App';
import Home from './components/Home/Home';
import Features from './components/Features/Features';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Profile from './components/Profile/Profile';
import Logout from './components/Logout/Logout';
import SchoolClass from './components/SchoolClass/SchoolClass';
import StudentProfile from './components/StudentProfile/StudentProfile';
import ChatHub from './components/ChatHub/ChatHub';
import ChatGroup from './components/ChatGroup/Chatgroup';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetPassword" element={<ForgotPassword/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/class/:id" element={<SchoolClass />} />
          <Route path="/studentProfile/:id" element={<StudentProfile />} />
          <Route path="/chatHub" element={<ChatHub />} />
          <Route path="/chatGroup/:id" element={<ChatGroup />} />
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

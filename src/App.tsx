
import { useState } from 'react';
import {Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './stateful/lvl-1/login-page';
import EmployeePage from './stateful/lvl-2/employee-page';
import ManageRequestsPage from './stateful/lvl-3/manage-requests-page';
import user from "./assets/dtos"
import StatisticsPage from './stateful/lvl-4/statistics-page';

export default function App() {

    const [thisUser, setThisUser] = useState<user>()
    const [userlist, setUserList] = useState<user[]>()

    function setUserlist(userlist: user[]){
        setUserList(userlist)
    } 

    function setUser(user: user){
        setThisUser(user)
    }

    return (<>

    <Routes>
        <Route path="/my-requests" element={<EmployeePage user={thisUser}/>}/>
        <Route path="/manage-requests" element={<ManageRequestsPage user={thisUser} userlist={userlist} setUserlist={setUserlist}/>}/>
        <Route path="/statistics" element={<StatisticsPage userlist={userlist} />}/>
        <Route path="/" element={<LoginPage user={thisUser} setUser={setUser} />}/>
    </Routes>  

    </>)
}

import React, {useRef, useState} from "react"
import user from "../../assets/dtos"
import fetcher from "../../stateless/fetcher"
import EmployeePage from "../lvl-2/employee-page"



export default function LoginPage(componentInputs:{user: user, setUser: Function}){
    
    //states
    const usernameInput = useRef(null)
    const pwInput = useRef(null)
    const [attemptWarning, setWarning] = useState('')

    //button click function
    async function checkCredentials(){

        const inputsToCheck = {   
            username: usernameInput.current.value,
            pw: pwInput.current.value
        } 
        
        //fetch a user if one exists
        const resBody = await fetcher(inputsToCheck, 'check-if-user')

        console.log("the fetched response expense array is",resBody.expenseHistory)
        
        //if the user exists
        if (resBody !== 'Not a user'){
             componentInputs.setUser({
                id: resBody.id, 
                username: resBody.username, 
                pw: resBody.pw,
                isManager: resBody.isManager,
                expenseHistory: resBody.expenseHistory
            })  
        }
        else{
            setWarning("The username and/or password is incorrect.")
        }
    }

    //returns either this login page or the employee page if the user is logged it
    return(<> 
    {
        
        !componentInputs.user? 
        <> 
            <h1 className='page-name'>Login</h1>
            <div className="divLogin">
            <input ref={usernameInput} id="username" className="usernamelogin" placeholder="username" />
            <input ref={pwInput} type="password" id="pw" className="pw" placeholder="password" />
            </div>
            <button onClick={checkCredentials} className="log-in-button">Log In</button>
            <h2 className="warning">{attemptWarning}</h2>
        </> : <EmployeePage user = {componentInputs.user}/>
    }
    </>)
}

import {useRef, useState} from "react"
import user from "../../assets/dtos"
import fetcher from "../../stateless/fetcher"
import EmployeePage from "../lvl-2/employee-page"



export default function LoginPage(){
    
    //states
    const usernameInput = useRef(null)
    const pwInput = useRef(null)
    const [attemptWarning, setWarning] = useState('')
    const [user, setUser] = useState<user>(
        // {
        //     id:"",
        //     username:"",
        //     pw:"",
        //     isManager:false,
        //     expenseHistory: [
        //         {
        //             name:'',
        //             amount:0,
        //             reason:'',
        //             isApproved:''
        //         }
        //     ] 
        // }
    )

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
             setUser({
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

    //returns either this login page or the employee page
    return(<>{
        
        !user ? 
        <> 
            <h1 className='App-logo'>Login</h1>
            <div className="divLogin">
            <input ref={usernameInput} id="username" className="username" placeholder="username" />
            <input ref={pwInput} id="pw" className="pw" placeholder="password" />
            </div>
            <button onClick={checkCredentials} className="log-in">Log In</button>
            <h2 className="warning">{attemptWarning}</h2>
        </> : <EmployeePage user = {user}/>
    }
    </>)
}

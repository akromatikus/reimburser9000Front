import {useRef, useState} from "react"
import EmployeePage from "./employee-page"

export default function LoginPage(){
    
    //states
    
    //!need the null for instantialization
    const usernameInput = useRef(null)

    const pwInput = useRef(null)
    const loginButton = (null)
    const [user, setUser] = useState({username:'', pw:''})
    
    //check the backend to make sure a pw and username match
    //an anon function is needed to guarentee a void return
    async function checkCredentials(){

        const inputsToCheck = {   
            username: usernameInput.current.value,
            pw: pwInput.current.value
        } 

        console.log("getting ready to fetch")

        const backendRes = 
            await fetch('http://localhost:5000/users', {
                    method:'PATCH', body: JSON.stringify(inputsToCheck), 
                    headers:{'Content-Type':'application/json'}
            })


        console.log("fetch header completed, parsing json") 
        //should return a user object   
        const resBody = await backendRes.json()
        console.log("the response body is:")
        console.log(resBody)
        
        if (resBody !== 'Not a user'){
            setUser({username: resBody.username, pw:resBody.pw})
            //rerendering happens before these comments are made
            console.log("The user state inside login-page has been set to: ")
            console.log(user)
            console.log("Preparing to rerender")
        }
        //props.updateUserProp({username:resBody.username, pw:resBody.pw})
    
    }

    // async function getAllUsers(){

    //     //send the http request to the backend and store the response
    //     const backendResponse = await fetch('http://localhost:5000/users')

    //     //parse the response body
    //     const users = await backendResponse.json()

    //     console.log(users)
    // }

    return(<>{
        
        user.username === '' ? 
        <> 
            <h1 className='App-logo'>Login</h1>
            <div className="login">
            <input ref={usernameInput} id="username" className="username" placeholder="username" />
            <input ref={pwInput} id="pw" className="pw" placeholder="password" />
            </div>
            <button ref={loginButton} onClick={checkCredentials} className="log-in">Log In</button>
        </> : 
            <EmployeePage employeeName = {user.username}/>
        }
    </>)
}
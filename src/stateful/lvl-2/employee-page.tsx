import { produceWithPatches } from "immer"
import { useEffect, useRef, useState } from "react"
import { JsxElement } from "typescript"
import user, { expenseHistory } from "../../assets/dtos"
import ExpenseRow from "../../stateless/lvl 1/expense-row"
import ManageRequestsPage from "../lvl-3/manage-requests-page"
import ManageRequests from "../lvl-3/manage-requests-page"
import { v4 as randomID } from 'uuid';
import fetcher from "../../stateless/fetcher"

export default function EmployeePage(componentInputs:{user: user}){
    
    //delete a request, rerender, and save the del button index
    const [deleteCounter, setDelIndex] = useState<number>(0)

    //the boolean thats tells react to add an new request
    const [isSaved, setToSaved] = useState<boolean>(true)
    const [newRequest, setNewRequest] = useState<boolean>(false)
    const [gotoManageReqPage, setGotoManageReqPage] = useState<boolean>(false)

    const newRequestName = useRef<HTMLInputElement>(null)
    const newRequestAmount = useRef<HTMLInputElement>(null)
    const newRequestReason = useRef<HTMLInputElement>(null)

    let expenseTable: JSX.Element[]

    // console.log("The states passed down to the employee page is the user: ", 
    //     componentInputs.user, 
    //     "the expenses are", 
    //     componentInputs.user.expenseHistory 
    // )

    function createPage(){

        //create the username text in the top left corner of the screen
        const usernameDisplay = <h1 id="username" className="employeeName">{componentInputs.user.username}</h1>
        
        //create the table of requests. the component input will be updated as necessary, so that when this functioin
        // gets called on render it will update appropraely
        expenseTable = (componentInputs.user.expenseHistory.map( (expense: expenseHistory, index: number) => 

            <tr key={randomID()}> 
                <ExpenseRow key={randomID()} {...expense}/> 
                <td><button className="deleteBtn" value={index} onClick={ (clickEvent) => deleteRequest(clickEvent) }>  DEL{index} </button></td> 
            </tr>  
        ))
        

        return(<>
            <h1 className="App-logo">My Requests</h1>
            <div>{usernameDisplay}</div>
            <table cellPadding={20} >
                <colgroup>
                    <col width={'9%'}></col>
                    <col width={'5%'}></col>
                    <col width={'70%'}></col>
                    <col width={'5%'}></col>
                    <col width={'5%'}></col>
                </colgroup>
                
                <thead>
                    <tr>
                        <th>Request Name</th>
                        <th>Amount Requested</th>
                        <th>Reason</th>
                        <th>Approval Status</th>
                        <th>Options</th>
                    </tr>  
                </thead>
                <tbody>
                    {expenseTable}
                    {newRequest? <tr>
                        <td><input id="1" ref={newRequestName} className="newReq" placeholder="name" ></input></td> 
                        <td><input id="2" ref={newRequestAmount} className="newReq" placeholder="amount" ></input></td> 
                        <td><input id="3" ref={newRequestReason} className="newReq" placeholder="reason" ></input></td> 
                    </tr> : null}
                </tbody>
            </table>
        </>)
    }

    function addRequest(){
        if (newRequest){
            console.log("you must save your changes before adding another request")
        }
        else{

            //const newRequest: expenseHistory = null
            //componentInputs.user.expenseHistory.push(newRequest)

            console.log("request made")
            //createPage will be rerendered with a new request input added
            setNewRequest(true)

            //teh saved button will be updated
            setToSaved(false)
        }
    }

    function deleteRequest(clickEvent){

        console.log("The click counter", deleteCounter)
        //update the local user profile
        componentInputs.user.expenseHistory.splice(clickEvent.target.value, 1)
        console.log("expenseHistory before rerender:", componentInputs.user.expenseHistory)

        //!state will not update and rerender if the values passed to it are the same as the previous values!
        //cause a rerender
        
        //will remove a new request from the rerender if it has not been saved yet
        setNewRequest(false)

        //will set the page to being unsaved
        setToSaved(false)
        console.log("expenseHistory after rerender:", componentInputs.user.expenseHistory)

        //used to rerender for every button click, incase the other two states are already false
        //the click event sends the del button index for each click, which ensures a rerender
        const counterClone = deleteCounter + 1
        setDelIndex(counterClone)
    }

    async function saveChanges(){
        //fill out the new request using the input states
        //!null check not working

        if (newRequest){
            const newRequest: expenseHistory = 
            {
                name: newRequestName.current?.value?? 'no name', 
                amount: Number(newRequestAmount.current?.value?? 0)?? 0, 
                reason: newRequestReason.current?.value?? 'no reason',
                isApproved: 'n',
            }

            //add it to this users information profile (this component only)
            componentInputs.user.expenseHistory.push(newRequest)
            console.log("The expenses after saving are" , componentInputs.user.expenseHistory)
        }

        //signal by state that all changes have been saved by resetting the isSaved to false
        isSaved? 
            console.log("everything is already up to date") 
            : 
            //push (fetch request) the users updated info to the backend 
            await fetcher( [componentInputs.user], 'update-users')
            
            setNewRequest(false); 
            setToSaved(true);
        
    }


    //! adding () to a function here will determine whether it is called or rendered. Only A react component child can have no ()
    return(
    <> 
        {!gotoManageReqPage?
            <>
                {createPage()}
                <button onClick={addRequest} className="addReqBtn">Add A Request</button>
                <button onClick={saveChanges} style={isSaved? {color:'black'} : {color:'red'} } className="saveBtn">{isSaved? "Up To Date" : "Save Changes"}</button>  
                {componentInputs.user.isManager? <button className="managerBtn" onClick={() => setGotoManageReqPage(true) }>Manage Employee Requests</button> : null }          
            </>   
        : <ManageRequestsPage user={componentInputs.user}/>
        }
    </>
    )
}
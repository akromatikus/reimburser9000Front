
import {useRef, useState } from "react"
import user, { expenseHistory } from "../../assets/dtos"
import ExpenseRow from "../../stateless/lvl 4/expense-row"
import { v4 as randomID } from 'uuid'
import fetcher from "../../fetcher"
import ReactTooltip from "react-tooltip"
import {Link} from "react-router-dom"

export default function EmployeePage(componentInputs:{user: user}){
    
    //delete a request, rerender, and save the del button index
    //needed so a rerender happens on every request delete
    const [deleteCounter, setDelIndex] = useState<number>(0)

    //the booleans thats tells react to add an new request and set save state
    const [isSaved, setToSaved] = useState<boolean>(true)
    const [newRequest, setNewRequest] = useState<boolean>(false)

    //new request inputs
    const newRequestName = useRef<HTMLInputElement>(null)
    const newRequestAmount = useRef<HTMLInputElement>(null)
    const newRequestReason = useRef<HTMLInputElement>(null)

    const [warning, setWarning] = useState<string>()

    let expenseTable: JSX.Element[]
    function createPage(){

        //create the username text in the top left corner of the screen
        const usernameDisplay = <h1 id="username" className="employeeName">{componentInputs.user.username}</h1>
        
        //create the table of requests. the component input will be updated as necessary, so that when this functioin
        // gets called on render it will update appropraely
        expenseTable = (componentInputs.user.expenseHistory.map( (expense: expenseHistory, index: number) => 

            <tr key={randomID()}> 
                <ExpenseRow key={randomID()} {...expense}/> 
                <td><button className="tableBtn" value={index} onClick={ (clickEvent) => deleteRequest(clickEvent) }>Delete</button></td> 
                <ReactTooltip/>
            </tr>
        ))
        
        return(<>
            <h1 className="page-name">My Requests</h1>
            <div className='topleftdiv'>
                {usernameDisplay}
                <h3>{warning}</h3> 
            </div>
            <table cellPadding={20} >
                <colgroup>
                    <col width={'7.5%'}></col>
                    <col width={'7.5%'}></col>
                    <col width={'70%'}></col>
                    <col width={'7.5%'}></col>
                    <col width={'7.5%'}></col>
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
            setWarning('You must save your changes before adding another request!')
            console.log("you must save your changes before adding another request")
        }
        else{
            setWarning("")

            console.log("request made")
            //createPage will be rerendered with a new request input added
            setNewRequest(true)

            //teh saved button will be updated
            setToSaved(false)
        }
    }

    function deleteRequest(clickEvent){
        
        //update the local user profile
        componentInputs.user.expenseHistory.splice(clickEvent.target.value, 1)

        //!state will not update and rerender if the values passed to it are the same as the previous values!

        //will remove a new request from the rerender if it has not been saved yet
        setNewRequest(false)

        //will set the page to being unsaved
        setToSaved(false)

        //used to rerender for every button click, incase the other two states are already false
        //the click event sends the del button index for each click, which ensures a rerender
        const counterClone = deleteCounter + 1
        setDelIndex(counterClone)
    }

    async function saveChanges(){
        //fill out the new request using the input states
        //!null check not working

        console.log("new request is ", newRequest)
        if (newRequest){
            try{
                console.log("starting try")
                const newRequestInputs: expenseHistory = 
                {
                    name: newRequestName.current.value, 
                    amount: Number(newRequestAmount.current.value)?? NaN, 
                    reason: newRequestReason.current.value,
                    isApproved: 'Pending',
                    comment: ""
                }
                
                console.log("The new request is ", newRequestInputs, "the amount is", newRequestInputs.amount )
                if (newRequestInputs.name === '' || 
                    newRequestInputs.reason === '' || 
                    Number.isNaN(newRequestInputs.amount) || 
                    newRequestInputs.amount <= 0 )
                    {throw new Error("bad EENPOOTS")}
                
                //add it to this users information profile (this component only)
                componentInputs.user.expenseHistory.push(newRequestInputs)
                console.log("The expenses after saving are" , componentInputs.user.expenseHistory)

                await fetcher( [componentInputs.user], 'update-users'); 
                console.log("pushing to backend in try");
    
                
            }
            
            //throw an error if the inputs are invalid
            catch(error){
                
                //if there are deletes that were made
                setWarning("All request fields must be filled out, and the amount must be a plain number. Try adding another request!")
                if (deleteCounter > 0){
                    await fetcher( [componentInputs.user], 'update-users'); 
                    console.log("pushing to backend in catch");
                }

            }
            
            //this will remove the new request on rerender if it is invalid, but also when it is passed in to the component input expenseHistory list
            setNewRequest(false);
        }
        
        //if no new request was made, but deletes were made, update the DB
        else if (deleteCounter > 0){
            await fetcher( [componentInputs.user], 'update-users'); 
            console.log("pushing to backend with no new request added");
        }

        //signal by state that all changes have been saved by resetting the isSaved to false
        if (isSaved){
            console.log("everything is already up to date"); 
            setWarning("Everything is already up to date")
        }
        
        //needs to reset regardless
        setDelIndex(0)
        setToSaved(true)
            
    }

    //! adding () to a function here will determine whether it is called or rendered. Only A react component child can have no ()
    return(
    <>   
            {createPage()}
            <div className="toprightbuttons">
            <button onClick={saveChanges} style={isSaved? {color:'white'} : {color:'red'} } className="button">{isSaved? "Up To Date" : "Save Changes"}</button>  
                <button onClick={addRequest} className="button">Add A Request</button> 
                {componentInputs.user.isManager? <Link style={{textDecoration: 'none'}} className='button' to='/manage-requests'>Manage Employee Requests -{'>'}</Link> : null }
            </div>                           
    </>
    )
}
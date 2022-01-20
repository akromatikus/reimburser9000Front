import { useEffect, useRef, useState } from "react"
import user, { expenseHistory } from "../../assets/dtos"
import fetcher from "../../stateless/fetcher"
import ExpenseRow from "../../stateless/lvl 1/expense-row"
import { v4 as randomID } from 'uuid';

export default function ManageRequestsPage(componentInputs:{user: user}){

    //updated initially  with a userlist by useEffect
    const [userlist, setUserList] = useState<user[]>()
    const [isSaved, setToSaved] = useState<boolean>(true)
    const [update, setUpdate] = useState<string>('')
    const [userIndexes, setNewIndex] = useState<number[]>([])
    const buttonClick = useRef()

    //get the userlist on page load
    useEffect(()=> 
    {
        (
            async()=> 
            {
                //send a request to backend
                const fetchedUserlist: user[] = await fetcher(null, 'get-userlist'); 
                console.log(fetchedUserlist)

                //update state with fetched userlist
                setUserList(fetchedUserlist);
            }
        )()
    }, 
    [])

    //console.log("the userlist is", userlist)

    function approveRequest(clickEvent){

        //get the local index of the user request
        const [userIndex, reqIndex] = clickEvent.target.value.split('.')
        console.log("indeces are",userIndex, reqIndex)


        const userlistClone = userlist
        console.log("The userlistClone is", userlistClone)
        //update the users approval status for this request
        if (userlistClone[Number(userIndex)].expenseHistory[Number(reqIndex)].isApproved !== 'y'){
            userlistClone[Number(userIndex)].expenseHistory[Number(reqIndex)].isApproved = 'y'
        }
        else{
            userlistClone[Number(userIndex)].expenseHistory[Number(reqIndex)].isApproved = 'n'
        }
        
        console.log("the clone was updated and the user request is now", userlistClone[Number(userIndex)])

        //clone the user indeces list state
        const userIndexesClone: number[] = userIndexes

        //add the index of the user who's requests were approved/disapproved
        userIndexesClone?.push(Number(userIndex))

        //update the UserIndeces state 
        setNewIndex(userIndexesClone)

        console.log("The userIndexesClone is now", userIndexesClone)
        console.log("The userIndexes are", userIndexes)
        console.log("approved")

        //update the userlist state
        setUserList(userlistClone)

        //rerender if the click event changes
        setUpdate(clickEvent)

        setToSaved(false)
    }

    function createUserTableList(){
        const userlistTable: JSX.Element[] = []
        for (let index = 0; index < userlist.length; index++){
            userlistTable.push( createUserTable(index) )
        }
        return userlistTable

    }

    function createUserTable(userIndex: number): JSX.Element {

        //create the username text in the top left corner of the screen
        // const usernameDisplay = <h1 id="username" className="employeeName">{componentInputs.user.username}</h1>
        
        //create the table of requests. the component input will be updated as necessary, so that when this functioin
        // gets called on render it will update the backend
        const expenseTable = (userlist[userIndex].expenseHistory.map( (expense: expenseHistory, index: number) => 

            <tr key={randomID()}> 
                <ExpenseRow key={randomID()} {...expense}/> 
                <td><button className="deleteBtn" value={`${userIndex}.${index}`} onClick={ (clickEvent) => approveRequest(clickEvent) }>  Approve{`${userIndex}.${index}`} </button></td> 
            </tr>  
        ))
        
        // cellPadding={20}
        return(<>
            {/* old h1 */}
            {/* <h1 className="App-logo">Request Management</h1>
            <div>{usernameDisplay}</div> */}
            <div><h1 className='userlistname'>{userlist[userIndex].pw}</h1></div>
            <table>
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
                </tbody>
            </table>
        </>)
    }

    async function saveChanges(){

        //create a set of the userIdeces state (removes duplicate indeces)
        const indecesOfUsersToUpdate = new Set(userIndexes)
        console.log("The userToUpdate List is ", indecesOfUsersToUpdate)

        //turn the set back into an array
        const userIterator = Array.from(indecesOfUsersToUpdate)
        console.log("the iterated set is",userIterator)

        //iterate through the array and create a new userlist of 
        //all the users with changes
        let usersToUpdate: user[] = []
        for (const index of userIterator){usersToUpdate.push(userlist[index])}
        
        isSaved? 
            console.log("everything is already up to date") :
            console.log("updating backend");
            await fetcher(usersToUpdate, 'update-users');    
            setToSaved(true);   
    }

    //! if a conditional on userlist is not defined, it will render an undefined error.
    return(<>
        <h1 className="App-logo">Manage Requests</h1>
        <button onClick={saveChanges} style={isSaved? {color:'black'} : {color:'red'} } className="saveBtn">{isSaved? "Up To Date" : "Save Changes"}</button>  
        <div><h1 id="username" className="employeeName">{componentInputs.user.username}</h1></div>
        {userlist? createUserTableList() : <h1>hmmm</h1>}
    
    </>)
}
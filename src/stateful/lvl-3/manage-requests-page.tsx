import React, { useEffect, useRef, useState } from "react"
import user, { expenseHistory } from "../../assets/dtos"
import fetcher from "../../fetcher"
import ExpenseRow from "../../stateless/lvl 4/expense-row"
import { v4 as randomID } from 'uuid';
import ReactTooltip from "react-tooltip";
import {Link} from "react-router-dom";

export default function ManageRequestsPage(componentInputs:{user: user, userlist: user[], setUserlist: Function}){

    //updated initially  with a userlist by useEffect
    const [isSaved, setToSaved] = useState<boolean>(true)
    const [update, setUpdate] = useState<string>('')
    const [indicesOfUsersToUpdate, setUsersToUpdateIndices] = useState<number[]>([])

    //@params addCommentBox: say whether the save feature will 
    // const [commentBox, setCommentBox] = useState<{addCommentBox: boolean[], comment: string[], commentID: string[]}>()
    const [commentBox, setCommentBox] = useState<boolean>(false)
    const comment = useRef<HTMLTextAreaElement>()
    const [commentBoxCurrent, setcommentBoxCurrent] = useState<string>()

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
                componentInputs.setUserlist(fetchedUserlist);
            }
        )()
    }, 
    [componentInputs])

    //console.log("the userlist is", userlist)

    function changeRequest(clickEvent){ 

        //get the local index of the user request
        const [userIndex, reqIndex] = clickEvent.target.value.split('.')
        console.log("indices are",userIndex, reqIndex)

        // //will need a conditional to see if the commentID already exists so it knows not to override it with a new input
        // const {...commentBoxClone} = commentBox
        // commentBoxClone.addCommentBox.push(true)
        // commentBoxClone.commentID.push(clickEvent.target.value) //remember this is a string so that saveChanges can update correctly

        //setCommentBox(true)

        //clone the userlist
        const userlistClone = componentInputs.userlist
        console.log("The userlistClone is", userlistClone)
        
        //if the request is not approved
        if (userlistClone[Number(userIndex)].expenseHistory[Number(reqIndex)].isApproved !== 'Yes'){
            //approve it
            userlistClone[Number(userIndex)].expenseHistory[Number(reqIndex)].isApproved = 'Yes' 
            
        }
        else{
            //otherwise deny it
            userlistClone[Number(userIndex)].expenseHistory[Number(reqIndex)].isApproved = 'No'
        }


        
        console.log("the clone was updated and the user request is now", userlistClone[Number(userIndex)])

        //clone the state of the user indices list
        const indicesOfUsersToUpdateClone: number[] = indicesOfUsersToUpdate

        //add the index of the user who's requests were approved/disapproved to the list which will fetch update the backend
        //when saved, by using this list to pick which users to send
        indicesOfUsersToUpdateClone?.push(Number(userIndex))

        //update the UserIndices state 
        setUsersToUpdateIndices(indicesOfUsersToUpdateClone)

        // console.log("The userIndexesClone is now", userIndicesClone)
        // console.log("The userIndexes are", userIndices)
        // console.log("approved")

        //update the userlist state
        componentInputs.setUserlist(userlistClone)

        //rerender if the click event changes
        setUpdate(clickEvent)
        console.log("so azure wont yell at me, ignore",update)

        setToSaved(false)
    }

    function saveComment(clickEvent){ 

        //get the local index of the user request
        const [userIndex, reqIndex] = clickEvent.target.value.split('.')
        console.log("indices are",userIndex, reqIndex)
        setcommentBoxCurrent(clickEvent.target.value)

        const showCommentBox = !commentBox
        console.log("toggleCommentBox is ",showCommentBox)
        setCommentBox(showCommentBox)

        console.log('comment box is now', commentBox)

        // if the comment box was closed
        if (showCommentBox === false){
            //clone the userlist
            const userlistClone = componentInputs.userlist
            console.log("The userlistClone is", userlistClone)

            userlistClone[userIndex].expenseHistory[reqIndex].comment = comment.current?.value ?? ''
            
            // //if the request is not approved
            // if (userlistClone[Number(userIndex)].expenseHistory[Number(reqIndex)].isApproved !== 'Yes'){
            //     //approve it
            //     userlistClone[Number(userIndex)].expenseHistory[Number(reqIndex)].isApproved = 'Yes' 
                
            // }
            // else{
            //     //otherwise deny it
            //     userlistClone[Number(userIndex)].expenseHistory[Number(reqIndex)].isApproved = 'No'
            // }


            
            console.log("the clone was updated and the user request is now", userlistClone[Number(userIndex)])

            //clone the state of the user indices list
            const indicesOfUsersToUpdateClone: number[] = indicesOfUsersToUpdate

            //add the index of the user who's requests were approved/disapproved to the list which will fetch update the backend
            //when saved, by using this list to pick which users to send
            indicesOfUsersToUpdateClone?.push(Number(userIndex))

            //update the UserIndices state 
            setUsersToUpdateIndices(indicesOfUsersToUpdateClone)

            // console.log("The userIndexesClone is now", userIndicesClone)
            // console.log("The userIndexes are", userIndices)
            // console.log("approved")

            //update the userlist state
            componentInputs.setUserlist(userlistClone)

            //rerender if the click event changes
            setUpdate(clickEvent)

            setToSaved(false)
        }
    }


    function createUserTableList(){
        const userlistTable: JSX.Element[] = []
        // const currentManagerIndex = componentInputs.userlist.indexOf(componentInputs.user)
        // console.log("manager index is ", currentManagerIndex)
        for (let index = 0; index < componentInputs.userlist.length; index++){
            if (componentInputs.userlist[index].id !== componentInputs.user.id){
                userlistTable.push( createUserTable(index) )
            }
        }
        return userlistTable

    }

    function createUserTable(userIndex: number): JSX.Element {

        //create the username text in the top left corner of the screen
        // const usernameDisplay = <h1 id="username" className="employeeName">{componentInputs.user.username}</h1>
        
        //create the table of requests. the component input will be updated as necessary, so that when this functioin
        // gets called on render it will update the backend
        const expenseTable = (componentInputs.userlist[userIndex].expenseHistory.map( (expense: expenseHistory, index: number) => 
            <tr key={randomID()}> 
                <ExpenseRow key={randomID()} {...expense}/> 
                <td> 
                    <button className="tableBtn" value={`${userIndex}.${index}`} onClick={ (clickEvent) => changeRequest(clickEvent) }>  Approve/Deny </button>
                    <button 
                        style={`${userIndex}.${index}` === commentBoxCurrent && commentBox? {color:'red'} : {color:'white'} }
                        className="tableBtn" 
                        value={`${userIndex}.${index}`} 
                        onClick={(clickEvent) => saveComment(clickEvent)}
                    > 
                        Set Comment 
                    </button>
                </td> 
                <ReactTooltip/>
            </tr>  
        ))
        
        // cellPadding={20}
        return(<>
            {/* old h1 */}
            {/* <h1 className="App-logo">Request Management</h1>
            <div>{usernameDisplay}</div> */}
            <div><h1 className='userlistname'>{componentInputs.userlist[userIndex].pw}</h1></div>
            <table>
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
                </tbody>
            </table>
        </>)
    }

    async function saveChanges(){

        //create a set of the userIndices state (removes duplicate indices)
        const UserIndicesToUpdate = new Set(indicesOfUsersToUpdate)
        console.log("The userToUpdate List is ", UserIndicesToUpdate)

        //turn the set back into an array
        const userIterator = Array.from(UserIndicesToUpdate)
        console.log("the iterated set is",userIterator)

        //iterate through the array and create a new userlist of 
        //all the users with changes, as 
        let usersToUpdate: user[] = []
        for (const index of userIterator){usersToUpdate.push(componentInputs.userlist[index])}
        
        isSaved? 
            console.log("everything is already up to date") 
            :
            console.log("updating backend");
            await fetcher(usersToUpdate, 'update-users'); 
            //setOpenCommentBox(false);  
            setUsersToUpdateIndices([]) 
            setToSaved(true);   
    }

    //! if a conditional on userlist is not defined, it will render an undefined error.
    return(<>       
        <>
            <h1 className="page-name">Manage Requests</h1>
            <div className="toprightbuttons">
                <button 
                    onClick={saveChanges} style={isSaved? {color:'white'} : {color:'red'} } 
                    className="button">{isSaved? "Up To Date" : "Save Changes"}
                </button>
                {/* <button className='button' onClick={()=> setGotoStatistics(true)}>Statistics Page</button> */}
                <Link style= { { textDecoration: 'none'}} className='button' to="/statistics">Statistics {'->'}</Link>
            </div>
            <div className="topleftdiv">
                <h1 id="username" className="employeeName">{componentInputs.user.username}</h1>
                <Link style= { { textDecoration: 'none' }} className='button' to="/my-requests">{'<- '}Back To My Requests</Link>
                {/* <button className='button' onClick={gotoPage}>Back</button> */}
            </div>
            {commentBox? <textarea ref={comment} className='commentbox' placeholder="Enter a comment (optional) and hit 'set comment' to close this window"></textarea> : null}
            {componentInputs.userlist? createUserTableList() : <h1>hmmm</h1>}
            
        
        </> 
    </>)
}
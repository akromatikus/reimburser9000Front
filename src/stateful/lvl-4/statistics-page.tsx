import {useState } from "react"
import user from "../../assets/dtos"
import { Link } from "react-router-dom";

export default function StatisticsPage(componentInputs:{userlist: user[]}){

    //updated initially with the callback function 
    const [stats] = useState<number[]>(
        ()=> createStatDisplay(componentInputs.userlist)
    )

    function createStatDisplay(userlist: user[]){
        const numberOfUsers = userlist.length
        const {requestVolume, currencyVolume, amountPending} = getRequestVolume(userlist)
        const avgRequestVolume = (requestVolume/numberOfUsers)
        const avgCurrencyVolume = (currencyVolume/numberOfUsers)
        
        console.log("DERPA")
        const resultsArray = [
            numberOfUsers, 
            requestVolume, 
            currencyVolume, 
            avgRequestVolume, 
            avgCurrencyVolume, 
            amountPending
        ]
        // setStats(resultsArray)
        return resultsArray
    }

    function getRequestVolume(userlist: user[]){
        let currencyVolume = 0
        let requestVolume = 0
        let amountPending = 0
        
        for (let user of userlist){
            requestVolume += user.expenseHistory.length
            for (let expense of user.expenseHistory){
                currencyVolume += expense.amount
                if(expense.isApproved === 'Pending'){
                    amountPending++
                }
            }
        }       
        return {requestVolume, currencyVolume, amountPending}
    }


    //! if a conditional on userlist is not defined, it will render an undefined error.
    return(<>
        <h1 className="page-name" style={{width:"100vh"}}>Statistics</h1>
        <div className="topleftdiv"><Link style= { { textDecoration: 'none' }} className='button' to="/manage-requests">{'<- '}Back To Request Management</Link></div>

            <table style={{width:'50vh', margin:"auto"}}>
                <tbody>
                    <tr><th>Number Of users</th><td>{stats[0]}</td></tr>
                    <tr><th>Number of requests</th><td>{stats[1]}</td></tr>
                    <tr><th>Total dollar value of all requests</th><td>${stats[2]}</td></tr>
                    <tr><th>Average number of requests per user</th><td>{stats[3].toFixed(1)}</td></tr>
                    <tr><th>Average total dollar value requested by each user</th><td>${stats[4].toFixed(2)}</td></tr>
                    <tr><th>Number of pending requests</th><td>{stats[5]}</td></tr>
                </tbody>
            </table>
        
    </>
        
    

   )
}
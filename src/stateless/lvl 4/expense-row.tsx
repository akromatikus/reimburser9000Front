
import { expenseHistory } from "../../assets/dtos";


export default function ExpenseRow(userExpenses: expenseHistory){
    
    return(
        <>
            <td>{userExpenses.name?? 'HUH'} </td>
            <td>${userExpenses.amount?? 4 } </td>
            <td>{userExpenses.reason?? "dap"} </td> 
            <td data-tip={userExpenses.comment}>{userExpenses.isApproved?? "Pending"} </td>
        </>)

}    
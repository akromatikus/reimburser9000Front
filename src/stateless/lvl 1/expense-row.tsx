import { expenseHistory } from "../../assets/dtos";

export default function ExpenseRow(userExpenses: expenseHistory){
    
    return(
        <>
            <td>{userExpenses.name?? 'HUH'} </td>
            <td>${userExpenses.amount?? 4 } </td>
            <td>{userExpenses.reason?? "dap"} </td>
            <td>{userExpenses.isApproved?? "n"} </td>
        </>)

}
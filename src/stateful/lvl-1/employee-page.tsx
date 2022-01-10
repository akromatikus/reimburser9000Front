export default function EmployeePage(props:{employeeName: string}){
    console.log("The property passed down to the employee page is the username: ")
    console.log(props.employeeName)
    
    return(<>
        
        <h1>Employee Page</h1>
    
    </>)
}
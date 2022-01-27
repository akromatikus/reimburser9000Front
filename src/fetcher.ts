import user from "./assets/dtos";

export default async function fetcher(inputs, fetchtype:string){
    let backendRes = null
    switch(fetchtype) {
        case 'check-if-user':
            const {...input} = inputs
            backendRes = 
            await fetch('http://localhost:5000/check-if-user', {
                    method:'PATCH', body: JSON.stringify(input), 
                    headers:{'Content-Type':'application/json'}
            })
            return (await backendRes.json())
        case 'get-userlist':
            backendRes =
            await fetch('http://localhost:5000/userlist')
            return (await backendRes.json())
        case 'update-users':
            const usersToUpdate: user[] = inputs
            backendRes =
            await fetch('http://localhost:5000/update-users', {
                method:'PATCH', body: JSON.stringify(usersToUpdate), 
                headers:{'Content-Type':'application/json'}
            })
            break;
        default:
            return (Error("no fetch of that type exists"))       
    }
}
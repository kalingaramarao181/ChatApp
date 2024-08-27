import Cookies from "js-cookie";
import {Redirect, Route} from 'react-router-dom';

const Secure =(props)=>{

    const token = Cookies.get('jwtToken')
    if(token === undefined){
        return   <Redirect to="/login"/>
    }
    return <Route { ...props} />
}
export default Secure
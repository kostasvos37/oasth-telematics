import React from "react"
import Search from "./Search.js"

class Main extends React.Component{
    render(){
        return (
            <div className = "grid_container">
                
                <div className="searching-form-box">
                    <Search/>           
                </div>    
            </div>
        )
    }
}
export default Main;
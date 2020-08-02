import React from "react"
import SearchView from "./SearchView.js"

class Home extends React.Component{
    render(){
        return (
            <div className = "grid_container">
                    <SearchView/>                  
            </div>
        )
    }
}

export default Home;
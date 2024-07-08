import React from "react";

const Loader = ()=>{
    return(
        <div className="flex items-center justify-center min-h-screen">
          <div className="ui active inverted dimmer">
            <div className="ui text loader">Loading</div>
          </div>
      </div>
    )
}
export default Loader
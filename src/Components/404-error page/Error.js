import React from "react";

const Error = () => {
    return (
        <div className="row">
            <div className="col-md-12 d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
                <h1 className={'text-muted'}
                    style={{
                        fontSize: "120px",
                        fontFamily: "sans-serif",
                        fontWeight: "bold"
                    }}> 404 </h1>
                <h4>Sorry page not found</h4>
            </div>
        </div>
    )
}
export default Error;

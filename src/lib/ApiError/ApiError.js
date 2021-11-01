import React from "react";
import { Modal } from "react-bootstrap";
import "./ApiError.css";

const ApiError = (props) => {


    const modal = (
        <Modal show={props.show} size={'md'} style={{marginTop: "15%"}} className="StaffEditCard ">
            <Modal.Body>
                <div className="text-center">
                    <p style={{color: "red", fontWeight: "bold"}}>Please Check Your Internet Connection</p>
                </div>
                <button className={'btn btn-send btn-block'} onClick={
                    () => window.location.reload()
                }> ReLoad </button>
            </Modal.Body>
        </Modal>

    )


    return modal
}

export default ApiError;
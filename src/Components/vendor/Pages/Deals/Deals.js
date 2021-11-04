import React, { useState, useEffect } from "react";
import axios from "axios";
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import { Col, Modal, Row } from "react-bootstrap";
import { Form, FormGroup, Input, Label } from "reactstrap";
import Loader from "../../../../lib/customer/Loader/Loader";



const Deals = (props) => {

    const [show, setShow] = useState(false);
    const [addOns, setAddOns] = useState(null);
    const [submitLoader, setSubmitLoader] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
    })

    const token = localStorage.getItem('vendorToken');

    useEffect(() => {
        axios.get('/vendor/add-ons', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                console.log(res.data)
                setAddOns(res.data);
            })
    }, [submitLoader])

    const ModalOpenHandler = () => {
        setShow(!show);
    }
    const handleClose = () => setShow(false);

    const onFormSubmit = (e) => {
        e.preventDefault();

    }


    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const modal = (

        <Modal show={show} size={'lg'} className="StaffEditCard">
            <Modal.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <h2 style={{ fontWeight: "bold" }}> Create Deals </h2>
                    <p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose} title="Close Staff">X</p>
                </div>

                <Form onSubmit={onFormSubmit}>
                    <FormGroup>
                        <Input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={formData.title}
                            onChange={onChangeHandler}
                        />
                    </FormGroup>

                    <div className={'text-center'}>
                        {
                            !submitLoader ?
                                <button type={'submit'} className={'px-5 btn btn-send btn-block'}>Add</button>
                                : (<Loader style={'text-center'} />)
                        }
                    </div>
                </Form>

            </Modal.Body>
        </Modal>
    )

    return (
        <>
            {modal}
            <PageTitleBar title='Deals' match={props.match} />

            <Row className={'justify-content-end'}>
                <Col md={2} sm={12} lg={1} className="mr-1">
                    <button className={'text-center btn btn-send btn-block'}
                        onClick={ModalOpenHandler} > Add </button>
                </Col>
            </Row>





        </>
    )
}

export default Deals
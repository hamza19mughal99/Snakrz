import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Modal } from "react-bootstrap";
import { CartContext } from '../../../../GlobalStore/CartContext';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PropTypes from 'prop-types';
import "./restaurant.css"
import { useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


const Menu = (props) => {


    const theme = useTheme();
    const storeId = props.store
    const [showModal, setShowModal] = useState(false)
    const [showAddOnModal, setShowAddOnModal] = useState(false)
    const [addOn, setAddOn] = useState([])
    const token = localStorage.getItem("token")
    const [proData, setProData] = useState(null)
    const [checkAddOn, setCheckAddOn] = useState([]);
    const [radioBtn, setRadioBtn] = useState({})

    console.log("ADDON", checkAddOn)
    let cart = JSON.parse(localStorage.getItem('cart'))

    const { dispatch } = useContext(CartContext);
    // console.log(shoppingCart)

    const modalOpenHandler = () => {
        setShowModal(!showModal)
    }


    const handleClose = () => setShowModal(!showModal);

    const handleClose2 = () => setShowAddOnModal(!showAddOnModal)

    const loginHandler = () => {
        localStorage.setItem('redirect_to', storeId)
        window.location.href = '/login'
    }

    const registerHandler = () => {
        localStorage.setItem('redirect_to', storeId)
        window.location.href = '/register'
    }

    const myModal = (
        <Modal show={showModal} size={'md'} className={'h-100 w-100'} >
            <Modal.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <p> </p>
                    <p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose} title="Close Staff">X</p>
                </div>
                <div className={'mb-5'}>
                    <h5>Have An Account?</h5>
                    <button onClick={loginHandler} className="btn btn-send btn-block">LOGIN</button>
                </div>
                <div>
                    <h5>Don't Have An Account?</h5>
                    <button onClick={registerHandler} className={'btn btn-send btn-block'}>Register Now</button>
                </div>
            </Modal.Body>
        </Modal>
    )

    const AddOnModalHandler = (addOnData, item) => {
        setProData(item)
        console.log(addOnData)
        setAddOn(addOnData)
        setShowAddOnModal(!showAddOnModal)
    }

    const addOnModalSubmitHandler = (e) => {
        e.preventDefault();
        const cartData = {
            ...proData
        }

        cartData.addOn = checkAddOn
        dispatch({
            type: 'ADD_TO_CART',
            id: cartData._id,
            cartData
        })
        setCheckAddOn([])
        setShowAddOnModal(false)
        setRadioBtn({})

    }
    const onChangeHandler = (e, addOnData, data) => {
        if (e.target.checked) {

            let checkedAddOn = checkAddOn
            setRadioBtn({
                ...radioBtn,
                [data.title]: {
                    [addOnData._id]: e.target.checked
                }
            })

            let bool = true;

            checkedAddOn.forEach((checkData, index) => {
                console.log(checkData)
                if (checkData.id === addOnData._id) {
                    bool = false;
                } else if (checkData.title === data.title) {
                    checkedAddOn.splice(index, 1);
                }
            })
            if (bool) {
                setCheckAddOn([
                    ...checkedAddOn,
                    {
                        id: addOnData._id,
                        name: addOnData.name,
                        price: addOnData.price,
                        title: data.title,
                    }
                ])
            }
        }
    }
    const [infoShow, setInfoShow] = useState(false)
    const [allergyText, setAllergyText] = useState(null)

    const handleClose3 = () => setInfoShow(!infoShow)

    const allergyInfoHandler = (item) => {
        setAllergyText(item.allergyInfo)
        console.log(item)
        setInfoShow(!infoShow)
    }

    const alleryModal = (
        <Modal show={infoShow}>
            <Modal.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <h4 style={{ fontWeight: "bold" }}>Allergy Information</h4>
                    <p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose3} title="Close Staff">X</p>
                </div>

                <div>
                    <p>{allergyText}</p>
                </div>
            </Modal.Body>
        </Modal>
    )

    const addOnModal = (
        <Modal show={showAddOnModal} size={'md'} className={'h-100 w-100'}>
            <Modal.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <h4 style={{ fontWeight: "bold" }}>Add On</h4>
                    <p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose2} title="Close Staff">X</p>
                </div>
                <hr />
                <form onSubmit={addOnModalSubmitHandler}>
                    {
                        addOn.length > 0 ?
                            addOn.map((data) => {
                                return (
                                    <div className={'mt-3'}>
                                        <h4 style={{ fontWeight: "bold", textTransform: "capitalize" }}>{data.title}</h4>
                                        {
                                            data.addOn && data.addOn.length > 0 && data.addOn.map((addOnData, index) => {
                                                return (
                                                    <div key={index} className="form-check mt-2">
                                                        <input required className="form-check-input" type="radio" checked={radioBtn[data.title] && radioBtn[data.title][addOnData._id] ? radioBtn[data.title][addOnData._id] : false}
                                                            onChange={(e) => onChangeHandler(e, addOnData, data)}
                                                            id={index} />
                                                        <div className={'d-flex justify-content-between'}>
                                                            <label className="form-check-label" for={index}>
                                                                <h5
                                                                    className={'ml-2'}> {addOnData.name} </h5>
                                                            </label>
                                                            <div>
                                                                <h5 className={'text-muted'}> ${addOnData.price}  </h5>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        <hr />
                                    </div>
                                )
                            })
                            : null
                    }
                    <button type={'submit'} className={' btn-send w-100 mt-3'} >
                        ADD TO CART
                    </button>
                </form>
            </Modal.Body>
        </Modal >
    )

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        console.log(newValue)
        setValue(newValue);
    };
    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }
    let checkoutBtn = (
        <div className={'disable_menu text-muted w-100  p-1'}>
            <NavLink to="/addToCart">
                <button className={'check_btn'} disabled >Go To Checkout
                    <ShoppingCartIcon style={{
                        fontSize: 35,
                        paddingLeft: '5px',
                        paddingRight: '5px'
                    }} />
                    <span className={'disable-counter'}>0</span>
                </button> </NavLink>
        </div>
    )
    if (cart && cart.length > 0) {
        checkoutBtn = (
            <div className={'main_menu d-flex justify-content-end p-2'}>
                <NavLink to={`/addToCart/${storeId}`}>
                    <button className={'check_btn'} >Go To Checkout
                        <ShoppingCartIcon style={{
                            fontSize: 35,
                            paddingLeft: '5px',
                            paddingRight: '5px'
                        }} />
                        <span className={'counter'}>{cart.length}</span>
                    </button> </NavLink>
            </div>
        )
    }

    let slider = (
        <>
            <div className={"d-flex flex-wrap"}>
                <Box sx={{ maxWidth: 300, bgcolor: 'background.paper' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        className={' mt-2'}
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        aria-label="scrollable auto tabs example"
                    >
                        <Tab label={'All'} {...a11yProps(0)} />
                        {
                            props.category && props.category.length > 0 ?
                                props.category.map((category) => {
                                    return <Tab label={category.title} children={'hello'} {...a11yProps(category._id)} />

                                }) : null
                        }

                    </Tabs>
                </Box>
                <div>
                    {checkoutBtn}
                </div>
            </div>
        </>
    )



    return (
        <>
            {myModal}
            {addOnModal}
            {alleryModal}
            <Paper elevation={4}>
                {slider}

            </Paper>

            {/* <div className={'container'}> */}
            <TabPanel value={value} index={0} dir={theme.direction}>
                <Row>
                    {
                        props.products && props.products.map((item) => {
                            let check = false;
                            if (cart) {
                                check = cart.find(
                                    product => product._id === item._id
                                )
                            }
                            return (

                                <Col key={item._id} md={6} className={'mt-5'}>
                                    <Row className="column-change mr-1">
                                        <Col md={7}>
                                            <div className="mt-2">
                                                <div className="d-flex justify-content-between">
                                                    <h5>{item.productName}</h5>
                                                    <p style={{ backgroundColor: "#fafafa" }} > {item.menuType ? item.menuType : null} </p>
                                                    <p style={{ backgroundColor: "#fafafa" }}>{item.time}</p>

                                                </div>
                                                <hr />
                                                <p className={'mt-3'}>$ {item.productPrice}.00</p>
                                                <div className={'d-flex'}>
                                                    <div>
                                                        {
                                                            props.isOrdered ?
                                                                check ?
                                                                    <button
                                                                        className={'btn-send '}
                                                                        style={{
                                                                            opacity: 0.4
                                                                        }}
                                                                        disabled
                                                                    >ADD TO CART</button>
                                                                    : (
                                                                        item.addOn.length > 0 ?
                                                                            token ? <button
                                                                                className={' btn-send '}
                                                                                onClick={() => AddOnModalHandler(item.addOn, item)}
                                                                            >ADD TO CART</button>
                                                                                :
                                                                                <button className={' btn-send '} onClick={modalOpenHandler}>
                                                                                    ADD TO CART
                                                                                </button>
                                                                            :
                                                                            token ? <button
                                                                                onClick={() => dispatch({
                                                                                    type: 'ADD_TO_CART',
                                                                                    id: item._id,
                                                                                    cartData: item
                                                                                })}
                                                                                className={' btn-send '}
                                                                            >ADD TO CART</button>
                                                                                :
                                                                                <button className={' btn-send '} onClick={modalOpenHandler}>
                                                                                    ADD TO CART
                                                                                </button>
                                                                    )
                                                                : <button
                                                                    className={'btn-send '}
                                                                    style={{
                                                                        opacity: 0.4
                                                                    }}
                                                                    disabled
                                                                >ADD TO CART</button>
                                                        }
                                                    </div>

                                                    <div>
                                                        <button onClick={() => allergyInfoHandler(item)} className={' btn-send ml-2'}>
                                                            ALLERGY INFO.
                                                        </button>
                                                    </div>

                                                </div>


                                            </div>
                                        </Col>
                                        <Col md={5} >
                                            <div className={'menu_img'}>
                                                <img className="pt-3" alt={'img'} style={{ width: "100%" }} src={item.productPicture.avatar} />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            )
                        })
                    }
                </Row>
            </TabPanel>
            {
                props.category && props.category.length > 0 ?
                    props.category.map((i, index) => (
                        <TabPanel value={value} index={index + 1} dir={theme.direction}>
                            <Row>
                                {
                                    props.products && props.products.map((item) => {
                                        console.log(item)
                                        let check = false;
                                        if (cart) {
                                            check = cart.find(
                                                product => product._id === item._id
                                            )
                                        }

                                        let allItems = ""
                                        if (item.category === i._id) {
                                            allItems = (
                                                <Col key={item._id} md={6} className={'mt-5'}>
                                                    <Row className="column-change mr-1" >
                                                        <Col md={7} >
                                                            <div className="mt-2">
                                                                <div className="d-flex justify-content-between">
                                                                    <h5>{item.productName}</h5>
                                                                    <p style={{ backgroundColor: "#fafafa" }}> {item.menuType} </p>
                                                                    <p style={{ backgroundColor: "#fafafa" }}>{item.time}</p>
                                                                </div>
                                                                <hr />
                                                                <p className={'mt-3'}>$ {item.productPrice}.00</p>
                                                                {
                                                                    props.isOrdered ?
                                                                        check ?
                                                                            <button
                                                                                className={' btn-send '}
                                                                                style={{
                                                                                    opacity: 0.4
                                                                                }}
                                                                                disabled
                                                                            >ADD TO CART</button>
                                                                            :
                                                                            item.addOn.length > 0 && token ? <button
                                                                                className={' btn-send '}
                                                                                onClick={() => AddOnModalHandler(item.addOn, item)}
                                                                            >ADD TO CART</button>
                                                                                :
                                                                                token ? <button
                                                                                    onClick={() => dispatch({
                                                                                        type: 'ADD_TO_CART',
                                                                                        id: item._id,
                                                                                        item
                                                                                    })}
                                                                                    className={' btn-send '}
                                                                                >ADD TO CART</button>
                                                                                    :
                                                                                    <button className={' btn-send '} onClick={modalOpenHandler}>
                                                                                        ADD TO CART
                                                                                    </button>
                                                                        : <button
                                                                            className={'btn-send '}
                                                                            style={{
                                                                                opacity: 0.4
                                                                            }}
                                                                            disabled
                                                                        >ADD TO CART</button>

                                                                }
                                                                <button onClick={() => allergyInfoHandler(item)} className={' btn-send ml-2'}>
                                                                    ALLERGY INFO.
                                                                </button>
                                                            </div>
                                                        </Col>
                                                        <Col md={5} >
                                                            <div className={'menu_img'}>
                                                                <img className="pt-3" alt={'img'} style={{ width: "100%" }} src={item.productPicture.avatar} />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            )
                                        }
                                        return (
                                            allItems
                                        )
                                    })
                                }
                            </Row>
                        </TabPanel>
                    ))
                    : null
            }
            {/* </div> */}
        </>
    );
}
export default Menu;



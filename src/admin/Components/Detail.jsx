import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import instance from '../../axios';
import { moneyFormat } from '../../Util/Money';
import Popup from 'reactjs-popup';
import { toast } from 'react-toastify';

export default function Detail({ room, close, type }) {
    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            prepayment: 0
        }
    });
    const [detail, setDetail] = useState(null);
    const [openChangeRoom, setChangeRoom] = useState(false);
    const [mustPay, setMustPay] = useState(0)
    const [prePaymentMore, setPrepaymentMore] = useState(0);
    const [displayMustPay, setDisplayMustPay] = useState(0)
    const [error, setError] = useState({});
    const closeModal = () => setChangeRoom(false);

    useEffect(() => {
        instance.get(`/checkin/detail/room/${room.id}`).then((response) => {
            if (response.status === 200) {
                setDetail(response.data)
                setMustPay(response.data.total_room - response.data.prepayment)
                setDisplayMustPay(response.data.total_room - response.data.prepayment)
                console.log("detail", response.data)
            }
        })
    }, [setDetail])


    const handlePrepaymentMore = (e) => {
        setPrepaymentMore(e.target.value)
        if (parseFloat(e.target.value) > (detail.total_room - detail.prepayment)) {
            setError({ prepaymentMore: "Prepayment must be small than total" })
        } else {
            setDisplayMustPay(mustPay - e.target.value);
            setError({})
        }
    }

    const updateInfo = (data) => {
        console.log("update", data)
        instance.put(`/booking/update/id/${detail.id}`, data).then((response) => {
            console.log(response)
            if (response.status === 200) {
                close();
            }
        })
    }
    return (
        <>
            {
                detail && (
                    <>
                        <div className="card p-1 border-0" >
                            <div className="modal-header">
                                <h5 className="modal-title">Detail - {room.name} </h5>
                                <button type="button" onClick={close} className="btn-close" data-bs-dismiss="modal" aria-label="Close" />

                            </div>
                            <form onSubmit={handleSubmit(updateInfo)}>
                                <div className="modal-body">
                                    <div className="container">
                                        <div className='row'>
                                            <div className='col-6'></div>
                                            <div className='col-6 text-end'>
                                                {/* Change room popup */}
                                                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#changeroompopup">
                                                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                                                    Check Out
                                                </button>

                                                <div className="modal fade" id="changeroompopup" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-fullscreen">
                                                        <div className="modal-content">
                                                            <ChangeRoom type={type} booking={detail} />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* End Change room popup */}
                                            </div>
                                            <div className='col-6'>
                                                <label className="form-label"  >
                                                    Check In{" "}
                                                    <i className="far fa-clock" />
                                                </label>
                                                <br />
                                                <input
                                                    type="date"
                                                    className="date form-control"
                                                    name="date"
                                                    value={detail.check_in_time}
                                                    disabled
                                                />
                                            </div>
                                            <div className='col-6'>
                                                <label className="form-label"  >
                                                    Check Out{" "}
                                                    <i className="far fa-clock" />
                                                </label>
                                                <br />
                                                <input
                                                    type="date"
                                                    className="date form-control"
                                                    name="date"
                                                    defaultValue={detail.check_out_time}
                                                    {...register("checkOutTime")}
                                                />
                                            </div>

                                            <div className="col-6 mt-3">
                                                <label className="form-label"  >
                                                    People {""}
                                                    <i className="far fa-clock" />
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    {...register("people")}
                                                    defaultValue={detail.people}
                                                />
                                            </div>

                                            <div className="col-6 mt-3 mb-3">
                                                <label className="form-label"  >
                                                    Type of Room {""}
                                                    <i className="far fa-clock" />
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    value={type.name}
                                                    disabled
                                                />
                                            </div>

                                            <hr />
                                            <label
                                                className="form-label" >
                                                <h5>
                                                    User's information{" "}
                                                    <i className="far fa-question-circle" />
                                                </h5>
                                            </label>
                                            <div className='col-4'>
                                                <label
                                                    className="form-label"
                                                >
                                                    ID Card <i className="far fa-id-card" />
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    value={detail.card_number}
                                                    disabled
                                                />
                                            </div>
                                            <div className='col-4'>
                                                <label
                                                    htmlFor="exampleInputPassword1"
                                                    className="form-label"
                                                >
                                                    Name{" "}
                                                    <i className="far fa-user" />
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    value={detail.full_name}
                                                    disabled
                                                />
                                            </div>
                                            <div className='col-4'>
                                                <label
                                                    htmlFor="exampleInputPassword1"
                                                    className="form-label"
                                                >
                                                    Phone{" "}
                                                    <i className="far fa-phone" />
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    value={detail.phone}
                                                    disabled
                                                />
                                            </div>
                                            <div className="col-4 mb-3 mt-2">
                                                <label className="form-label">
                                                    Paid <i className="far fa-money-bill-alt" />
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control "
                                                    value={moneyFormat(detail.prepayment)}
                                                    disabled
                                                />
                                                {((detail.total_room - detail.prepayment) === 0) && <p className='text-success'>Payment completed <i className="fa fa-check" aria-hidden="true"></i></p>}
                                            </div>
                                            <div className='col-4 mt-3'>
                                                {
                                                    ((detail.total_room - detail.prepayment) > 0) && (
                                                        <>

                                                            <label
                                                                className="form-label"
                                                            >
                                                                Must Pay <i className="far fa-money-bill-alt" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={null || (detail.total_room && moneyFormat(displayMustPay))}
                                                                className="form-control "
                                                                disabled
                                                            />
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <div className="col-4 mb-3 mt-2">
                                                {
                                                    ((detail.total_room - detail.prepayment) > 0) && (
                                                        <>
                                                            <label
                                                                className="form-label"
                                                            >
                                                                Pay more <i className="far fa-money-bill-alt" />
                                                            </label>
                                                            <input
                                                                type="nubmer"
                                                                className="form-control "
                                                                {...register("prepayment")}
                                                                onChange={handlePrepaymentMore}
                                                            />
                                                            {error.prepaymentMore && <span className='text-danger mt-3'>{error.prepaymentMore}</span>}
                                                        </>
                                                    )
                                                }
                                            </div>
                                            <div className='text-center'>
                                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '40%' }} >Update</button>
                                                {" "}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                )
            }
        </>
    )
}

const ChangeRoom = ({ type, closeModal, booking }) => {
    const [roomList, setRoomList] = useState([]);
    const [room, setRoom] = useState(null);

    useEffect(() => {
        instance.get(`/room/search/category/${type.id}/status/1`).then((response) => {
            if (response.status === 200) {
                setRoomList(response.data);
            }
        })
    }, [setRoomList])

    const handleRoom = (e) => {
        setRoom(JSON.parse(e.target.value))
    }

    const handleChange = async () => {
        const change = await instance.put(`/checkin/change/${booking.id}/room/${room.id}`, null);

        if (change.status === 200) {
            toast.success("Change Room successfully !", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            closeModal();
            window.location.reload();
        }
    }
    return (
        <>
            <div className="card container border-0">
                <div className="modal-header">
                    <h5 className="modal-title">Change Room </h5>
                    <button type="button" onClick={closeModal} className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name of Room</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                roomList.map((room, index) =>
                                    <tr>
                                        <th scope="row">
                                            <input className="form-check-input" type="radio" value={JSON.stringify(room)} name="room" onChange={handleRoom} />
                                        </th>
                                        <td>{room.name}</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    {
                        room ? (
                            <>
                                <div className='text-center'>
                                    <button type="button" className="btn btn-primary" onClick={handleChange}>Change</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='text-center'>
                                    <button type="button" className="btn btn-primary" disabled>Change</button>
                                </div>
                            </>
                        )
                    }

                </div>
            </div>
        </>
    )
}

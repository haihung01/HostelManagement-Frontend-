import React, { useEffect } from 'react'
import { useState } from 'react'

export default function Infomation({
    next,
    user,
    booking,
    dispatch,
    room
}) {

    const [currentDay, setCurrent] = useState(booking.checkInTime);

    const [checkIn, setCheckin] = useState(booking.checkInTime);
    const [checkOut, setCheckOut] = useState(booking.checkOutTime);

    const [peopleNumber, setPeopleNumber] = useState(booking.people);

    useEffect(() => {
        setCheckOut(booking.checkOutTime)
        setCheckin(booking.checkInTime)
    }, [booking])

    const checkInPicker = (e) => {
        dispatch({ type: 'ADD_CHECKIN', value: e.target.value })
    }

    const checkOutPicker = (e) => {
        dispatch({ type: 'ADD_CHECKOUT', value: e.target.value })
    }

    const peoplePicker = (e) => {
        if (e.target.value > 0) {
            dispatch({ type: 'ADD_PEOPLE', value: e.target.value })
        }
    }

    const notePicker = (e) => {
        dispatch({ type: 'ADD_NOTE', value: e.target.value })
    }

    return (
        <>
            {
                (user.profile && booking) ? (
                    <>
                        <div>
                            <form>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" value={user.profile.fullName} disabled />
                                            <label>Full Name  <span className='text-danger'>*</span></label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input type="email" className="form-control" value={user.email} disabled />
                                            <label>Email <span className='text-danger'>*</span></label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating date" data-target-input="nearest">
                                            <input type="date" className="form-control datetimepicker-input" min={currentDay} defaultValue={checkIn} onChange={checkInPicker} required />
                                            <label>Check In  <span className='text-danger'>*</span></label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating date" data-target-input="nearest">
                                            <input type="date" className="form-control datetimepicker-input" min={checkOut} value={checkOut} onChange={checkOutPicker} required />
                                            <label>Check Out <span className='text-danger'>*</span></label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="number"
                                                required
                                                className="form-control"
                                                min={1}
                                                max={room.people}
                                                step={1}
                                                defaultValue={peopleNumber}
                                                onChange={peoplePicker} />
                                            <label >People <span className='text-danger'>*</span></label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea className="form-control" style={{ height: 100 }}
                                                name="note" defaultValue={''}
                                                onChange={notePicker} />
                                            <label>Note</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        {
                                            (room.available > 0) ? (
                                                <button className="btn btn-primary w-100 py-3" type="button" onClick={next} >Continue to book</button>
                                            ) : (
                                                <button className="btn btn-primary w-100 py-3" type="button" disabled >Fully booked</button>
                                            )
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Test</h1>
                    </>
                )
            }
        </>
    )
}

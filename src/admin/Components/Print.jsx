import React, { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import { today } from "../../Util/DateTime";
import { moneyFormat } from "../../Util/Money";
import { thisMoment } from "../../Util/Total";

export const Print = React.forwardRef(({room, info, surcharge, total, subtotal}, ref) => {
    const { user } = useContext(UserContext); 

    return (
        <div ref={ref}>
            <div className="container-sm">
                <div className="card px-3 shadow py-4" style={{ maxWidth: 500 }}>
                    <div className="card-title text-center px-4 mt-5">
                        <label htmlFor="text" className="text-uppercase fw-bolder fs-2">Paris Deli Hotel</label>
                        <label htmlFor="text">1236 Vo Nguyen Giap Son Tra, Đà Nẵng Việt Nam</label>
                        <label htmlFor="text" className="fw-bolder">Hotline: <label>0357.280.618</label></label>
                        <label htmlFor="text" className="fw-bolder fs-3 text-uppercase d-block">hóa đơn bán hàng</label>
                        <label htmlFor="text" className="fw-bolder d-block">Phòng <label htmlFor="text">{room.name}</label></label>
                    </div>
                    <div className="card-body">
                        <div className="d-block">
                            <label htmlFor="text">Ngày: <label htmlFor="text">{today}</label> </label>
                        </div>
                        <div className="d-block">
                            <label htmlFor="text">Thu ngân: <label htmlFor="text">{user.profile.fullName}</label></label>
                            <label htmlFor="text" className="float-end">In lúc: <label>{thisMoment}</label></label>
                        </div>
                        <table className="table table-bordered bill-table-border">
                            <thead>
                                <tr>
                                    <th scope="col">Từ</th>
                                    <th scope="col">Đến</th>
                                    <th scope="col">Phòng</th>
                                    <th scope="col">T tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td>{info.check_in_time} <label htmlFor="text" className="fs-4 d-block">16:16</label></td>
                                    <td>{info.check_out_time} <label htmlFor="text" className="d-block fs-4">16:16</label></td>
                                    <td><label htmlFor="text" className="d-block">Phòng</label>{room.name}</td>
                                    <td>{moneyFormat(total) || 0}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="text-center">
                            <hr size="5px" />
                        </div>
                        <div className="d-block">
                            <label htmlFor="text" className="fw-bolder">Sub total:</label>
                            <label htmlFor="text" className="float-end fw-bolder">{moneyFormat(subtotal || 0)}</label>
                        </div>
                        <div className="d-block">
                            <label htmlFor="text" className="fw-bolder">Surcharge:</label>
                            <label htmlFor="text" className="float-end fw-bolder">{surcharge}</label>
                        </div>
                        <hr size="4px" />
                        <div className="d-block">
                            <label htmlFor="text" className="fw-bolder fs-4">Total:</label>
                            <label htmlFor="text" className="float-end fw-bolder fs-3">{moneyFormat( total)}</label>
                        </div>
                        <div className="d-block">
                            <label htmlFor="text">Khách đưa:</label>
                            <label htmlFor="text-end" className="float-end">400,000</label>
                        </div>
                        <div className="d-block">
                            <label htmlFor="text">Trả lại:</label>
                            <label htmlFor="text" className="float-end">0</label>
                        </div>
                        <div className="text-center px-2">
                            <label htmlFor="text" className="fw-bolder fs-5">Trân Trọng Cảm Ơn Quý Khách!</label>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
});
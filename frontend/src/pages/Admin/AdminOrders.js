import React, {useState, useEffect} from 'react'
import AdminMenu from '../../components/Layout/AdminMenu'
import Layout from '../../components/Layout/Layout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/auth'
import moment from 'moment'
import { Select } from 'antd'
const { Option } = Select

const AdminOrders = () => {
    const [status, setStatus] = useState(["Not Process", "Processiing", "Shipped", "Delivered", "Cancel"])
    const [changeStatus, setChangeStatus] = useState("")
    const [orders, setOrders] = useState([])
    const [auth, setAuth] = useAuth()

    const getOrders = async() => {
        try {
            const {data} = await axios.get('/api/user/all-orders')
            setOrders(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(auth?.token)
            getOrders()
    }, [auth?.token])

    const handleChange = async(orderId, value) => {
        try {
            const {data} = await axios.put(`/api/user/order-status/${orderId}`, {status: value})
            getOrders()
        } catch (error) {
            console.log(error);   
        }
    }

  return (
    <Layout title={'Dashboard - All Orders'}>
        <div className='container-fluid m-3 p-3'>
            <div className='row'>
                <div className='col-md-3'>
                    <AdminMenu />
                </div>
                <div className='col-md-9'>
                    <h1 className='text-center'>All Orders</h1>
                    {
                        orders?.map((o, i) => {
                            return (
                                <div className='border shadow'>
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th scope='col'>#</th>
                                                <th scope='col'>Status</th>
                                                <th scope='col'>Buyer</th>
                                                <th scope='col'>Order Date</th>
                                                <th scope='col'>Payment</th>
                                                <th scope='col'>Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{i+1}</td>
                                                <td>
                                                    <Select bordered={false} onChange={(value) => handleChange(o._id, value)} defaultValue={o?.status}>
                                                        {status.map((s, i) => (
                                                            <Option key={i} value={s}>{s}</Option>
                                                        ))}
                                                    </Select>
                                                </td>
                                                <td>{o?.buyer?.name}</td>
                                                <td>{moment(o?.createdAt).fromNow()}</td>
                                                <td>{o?.payment.success ? "Success" : "Failed"}</td>
                                                <td>{o?.products?.length}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className='container'>
                                    {
                                        o?.products?.map((p,i) => (
                                            <div className='row mb-2 card flex-row'>
                                                <div className='col-md-4'>
                                                    <img src={`/api/product/product-photo/${p._id}`} className='card-img-top' alt={p.name} height={'170px'} />
                                                </div>
                                                <div className='col-md-8 p-2'>
                                                    <p>{p.name}</p>
                                                    <p>{p.description.substring(0, 30)}</p>
                                                    <p>Price : ${p.price}</p>
                                                </div>
                                            </div>
                                        ))
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default AdminOrders
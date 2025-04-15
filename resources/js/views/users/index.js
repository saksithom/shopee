import { useEffect, useState } from "react"
import { Card, Col, Container, Row, Table, Button, OverlayTrigger,Tooltip, Form } from "react-bootstrap"
import { destroyUsers, fetchUsers } from "../../controllers/users"
import Loading from "../../components/Loading/Loading"
import { useNavigate, Link } from "react-router-dom"
import { Add, CheckCircleOutline, Clear, DeleteForever, DoNotDisturbOn, EditNote, PlusOne, Search } from "@mui/icons-material"
import { adminLevel } from "../../helpers/functions"
import ModalAlert from "../../components/Dialogs/Alert"
import ModalconfirmDelete from "../../components/Dialogs/confirmdelete"
import Paginate from "../../components/Pagination/Paginate"
const Administrators = () => {

  const initParams = {
    term : '',
    level : '',
    active : true,
    page : 1,
    per_page : 25,
    current_page : 1
  }

  const initPageOption = {
      current_page : 1,
      last_page : 1,
      page : 1,
      offset : 52,
      page_list : [{no:1}]
  }
    const [users, setUsers] = useState([])
    const [pageStatus, setPageStatus] = useState('loading')
    const [isloaded, setIsloaded] = useState(false)
    const [pageOption, setPageOption] = useState(initPageOption)
    const [params,setParams] = useState(initParams)

    const [modalconfirm, setModalconfirm] = useState({ view : false, title : '', message : '',status : 'already', index : -1})

    const navigate = useNavigate()
    useEffect(() => {
        if(!isloaded){
            init()
            setIsloaded(true)
        }
    },[])
    const init = async() => {
        await setPageStatus('loading')
        await fetchUser(1)
        await setPageStatus('ready')
    }

    const fetchUser = async(pageNo) => {
        
        const caller = await fetchUsers(getParams(pageNo))
        if(caller.status == 200){
            const userData = caller.data.data
            const meta = caller.data.meta
         //  console.log('meta : ', caller)
            if( pageOption.current_page > 1 && response.data.length == 0 )
                return fetchUser(pageOption.current_page - 1)

            let pl = [];
            for(let n = 1; n <= meta.last_page; n++){
                pl.push({no : n})
            }
    
            setPageOption({
                current_page : meta.current_page,
                last_page : meta.last_page,
                page : pageNo,
            })
            setUsers(userData)
        }
    }
    const getParams = (pageNo) => {
      let pam = []
      pam.push(`per_page=${params.per_page}`)
      pam.push(`current_page=${params.current_page}`)
      pam.push(`page=${pageNo}`)
      
      if( params.term )
          pam.push(`term=${params.term}`)

      if( params.level )
        pam.push(`level=${params.level}`)

        pam.push(`active=${params.active ? 1 : 0}`)
      
      return `?${pam.join('&')}`
    }

    const changePage = async(pageNo) =>{
        await setParams({...params, page : pageNo})
        await fetchDelivery(pageNo)
    }


    const submitSearch = async() => {
        await init(1)
    }
    const clearInput = (e) => {
      setParams(initParams)
    }
    const confirmDelete = (index) => {
      // e.preventDefault();
      setModalconfirm({view:true, title: 'ยืนยันการลบข้อมูล', message : 'คุณแน่ใจว่าต้องการลบผู้ใช้รายนี้',status: 'ready', index : index})
      
    }
    const onApply = async (ans) => {
        if(ans == 'Y'){

            const item = users.find((val,idx) => idx == modalconfirm.index)
        //  console.log('delete item : ', item)
            if(!item) return false
            
            const dels = await destroyUsers(item.id)
            if(dels.status == 204){
                await init(params.current_page)
                setModalconfirm({...modalconfirm, status : 'success'})
              
            }
            
        }
    //  console.log('apply delete : ', ans)
        // setModaldel({view:false})
    }
    return (
        <>
        {pageStatus == 'loading' && <Loading/> }
        {pageStatus == 'ready' ? 
        <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover px-3">
              <Card.Header>
                <Row>
                  <Col md="8">
                    <Card.Title as="h4">Administrator Users</Card.Title>
                    <p className="card-category">
                      Administrator managements
                    </p>
                  </Col>
                  <Col md="4 text-end">
                    <Button variant="success" size="sm" type="button" className="mt-2" onClick={() => navigate('/admin/users/create')}><Add className="me-1" /> New User</Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive">
                <Form onSubmit={submitSearch} className="border px-3 mb-3 p-3">
                <h5>Administrators Search</h5>
                <Row className="mb-2 mt-2 ">
                  <Col md="4">
                    <Form.Group>
                      <Form.Label>Name/Email</Form.Label>
                      <Form.Control type="text" value={params.term} onChange={e => setParams({...params, term: e.target.value})} />
                    </Form.Group>
                  </Col>
                  <Col md="2">
                    <Form.Group>
                      <Form.Label>Level</Form.Label>
                      <Form.Select value={params.level} onChange={e => setParams({...params, level : e.target.value})}>
                        <option>- Select Level -</option>
                        <option value="super-admin">Super Admin</option>
                        <option value="admin">Admin</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md="2">
                    <Form.Group>
                      <Form.Label>Active</Form.Label>
                      <Form.Check // prettier-ignore
                        className="mt-2"
                        type="switch"
                        id="custom-switch"
                        checked={params.active}
                        onChange={e => setParams({...params, active : e.target.checked})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md="4" className="text-end">
                    <Form.Group className="pt-3">
                      <Form.Label>&nbsp;</Form.Label>
                      <Button variant="secondary" className="me-2" onClick={clearInput}><Clear /> Clear</Button>
                      <Button variant="primary"  type="submit" ><Search /> Search</Button>
                    </Form.Group>
                  </Col>
                </Row>
                </Form>
                <Table striped bordered hover responsive="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Level</th>
                      <th>Status</th>
                      <th>#</th>
                    </tr>
                  </thead>
                  {users.length > 0 ?
                  <tbody>
                    {users.map((user,index) => (
                      <tr key={index}>
                        <td>{Number(index)+1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td className="text-center">{adminLevel(user.level)}</td>
                        <td className="text-center">{user.active == 1 ? <CheckCircleOutline className="text-success" /> : <DoNotDisturbOn className="text-secondary" />}</td>
                        <td className="td-action">
                            <Button size="sm" variant="primary" onClick={() => navigate(`/admin/users/edit/${user.id}`)}><EditNote /></Button>  
                            <Button size="sm" variant="danger" type="button" onClick={(e) => confirmDelete(index)}><DeleteForever /></Button>
                        </td>
                    </tr>
                    ))}
                  </tbody>
                  :
                  <tbody>
                    <tr>
                      <td colSpan={6} className="text-center">ไม่พบข้อมูล</td>
                    </tr>
                    </tbody>
                  }
                </Table>
                <Paginate options={pageOption} clickPage={e => changePage(e)} />
              </Card.Body>
            </Card>
          </Col>
          
        </Row>
      </Container>
      {/* <ModalAlert show={modalalert.view} onHide={() => setModalalert({...modalalert,view:false})} title={modalalert.title} message={modalalert.message} /> */}
      <ModalconfirmDelete show={modalconfirm.view} onHide={() => setModalconfirm({...modalconfirm,view:false})} 
                        title={modalconfirm.title} 
                        message={modalconfirm.message} 
                        success={modalconfirm.status}
                        onApply={onApply}
      />

      </>
      : null }
    </>
    )
}
export default Administrators
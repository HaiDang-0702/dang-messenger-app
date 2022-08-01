import { Form, Select, Modal, Spin, Avatar } from 'antd'
import React, { useContext, useState } from 'react'
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { debounce } from 'lodash';
import { db } from '../../firebase/config';


function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, props.curMembers).then(newOptions => {
                setOptions(newOptions);
                setFetching(false);
            })
        }

        return debounce(loadOptions, debounceTimeout)
    },[debounceTimeout, fetchOptions]);

    return(
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={ fetching ? <Spin size='small'/> : null}
            {...props}
        >
            {
                options.map(opt => (
                    <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                        <Avatar size='small' src={opt.photoURL}>
                            {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        {`${opt.label}`}
                    </Select.Option>
                ))
            }
        </Select>
        
    )
}

async function fetchuUserList(search, curMembers) {
    return db
        .collection('users')
        .where('keywords', 'array-contains', search)
        .orderBy('displayName')
        .limit(20)
        .get()
        .then(snapshot => {
            return snapshot.docs.map(doc => ({
                label: doc.data().displayName,
                value: doc.data().uid,
                photoURL: doc.data().photoURL
            })).filter(opt => !curMembers.includes(opt.value)); 
        });
}


export default function InviteMemberModal() {
    const { isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId, selectedRoom } = useContext(AppContext);
    const { user: {uid}} = useContext(AuthContext);

    const [value, setValue] = useState([]);

    
    const [form] = Form.useForm();

    const handleOk = () => {
        

        //reset form value
        form.resetFields();

        //update members in current room
        const roomRef = db.collection('rooms').doc(selectedRoomId);

        roomRef.update({
            members: [...selectedRoom.members, ...value.map((val) => val.value)],
        })




        setIsInviteMemberVisible(false);
    }

    const handleCancel = () => {
        setIsInviteMemberVisible(false);
         //reset form value
         form.resetFields();
    }

    //console.log({value})
  return (
    <div>
        <Modal
            title='Mời thêm thành viên'
            visible={isInviteMemberVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form form={form} layout='vertical'>
                <DebounceSelect
                    mode ='multiple'
                    label='Tên các thành viên'
                    value={value}
                    placeholder='Nhập tên thành viên'
                    fetchOptions ={fetchuUserList}
                    onChange={newValue => setValue(newValue)}
                    style={{width: '100%'}}
                    curMembers={selectedRoom.members}
                />
            </Form>
        </Modal>
    </div>
  )
}





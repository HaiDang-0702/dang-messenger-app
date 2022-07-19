import { UserAddOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Form, Input, Tooltip } from 'antd';
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { addDocument } from '../../firebase/services';
import useFirestore from '../../hooks/useFirestore';
import Message from './Message';


const HeaderStyled = styled.div`
  display: flex;
  justify-content:  space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);


  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;

`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-item: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230); 
  border-radius: 2px; 
  

  .ant-form-item{
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow: auto;
`;



export default function ChatWindow() {
  const { selectedRoom, members, setIsInviteMemberVisible } = useContext(AppContext);
  const { user: {
    uid, photoURL, displayName
  } } = useContext(AuthContext)
  const [inputValue, setInPutValue] = useState('');
  const [form] = Form.useForm()

  const handleInputChange = (e) => {
    setInPutValue(e.target.value);
  };

  const handleOnSumit = () => {
    addDocument('messages', {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
    });
    form.resetFields(['message'])
  };

  const condition = React.useMemo(() => ({
    fieldName: 'roomId',
    operator: '==',
    compareValue: selectedRoom.id
  }), [selectedRoom.id])
  const messages = useFirestore('messages', condition)

  console.log({ messages })
  return (
    <WrapperStyled>
      {
        selectedRoom.id ? (
          <><HeaderStyled>
            <div className='header__info'>
              <p className='header__title'>{selectedRoom.name}</p>
              <span className='header__description'>{selectedRoom.description}</span>
            </div>
            <div>
              <ButtonGroupStyled>
                <Button icon={<UserAddOutlined />} type='text' onClick={() => setIsInviteMemberVisible(true)}>Mời</Button>
                <Avatar.Group size='small' maxCount={2}>
                  {
                    members.map((member) => (
                      <Tooltip title={member.displayName} key={member.id}>
                        <Avatar src={member.photoURL}>
                          {member.photoURL
                            ? ''
                            : member.displayName?.charAt(0)?.toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    ))}
                </Avatar.Group>
              </ButtonGroupStyled>
            </div>
          </HeaderStyled>
            <ContentStyled>
              <MessageListStyled>
                {
                  messages.map((mes) => (
                    <Message
                      key={mes.id}
                      text={mes.text}
                      photoURL={mes.photoURL}
                      displayName={mes.displayName}
                      createAt={mes.createAt}
                    />
                  ))}
                  
              </MessageListStyled>
              <FormStyled form={form}>
                <Form.Item name='message'>
                  <Input
                    onChange={handleInputChange}
                    onPressEnter={handleOnSumit}
                    placeholder='Nhập tin nhắn...'
                    bordered={false}
                    autoComplete='off' />
                </Form.Item>
                <Button type='primary' onClick={handleOnSumit}>Gửi</Button>
              </FormStyled>
            </ContentStyled></>
        ) : (
          <Alert
            message='Hãy chọn phòng'
            type='info'
            showIcon
            style={{ margin: 5 }}
            closable
          />
        )}

    </WrapperStyled>
  )
}

import { UserAddOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Form, Input, Tooltip } from 'antd';
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AuthContext } from '../../Context/AuthProvider';
import Message from './Message';
import { uid } from "uid";


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
  const { user, selectedRoom, members, setIsInviteMemberVisible, messages, setMessages } = useContext(AuthContext);
  const [inputValue, setInPutValue] = useState('');
  const [form] = Form.useForm()

  const handleInputChange = (e) => {
    setInPutValue(e.target.value);
  };

  const handleOnSubmit = () => {
      setMessages([...messages, {
          text: inputValue,
          key: uid(),
          photoURL: user.photoURL,
          displayName: user.displayName,
          id: user.uid,
          roomId: selectedRoom.id,

      }])
    form.resetFields(['message'])
  };

    const roomMessages = messages.filter(message => {
        return message.roomId === selectedRoom.id;
    })


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
                {/*<Button icon={<UserAddOutlined />} type='text' onClick={() => setIsInviteMemberVisible(true)}>Mời</Button>*/}
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
                    roomMessages.map((mes) => (
                    <Message
                      key={mes.key}
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
                    onPressEnter={handleOnSubmit}
                    placeholder='Nhập tin nhắn...'
                    bordered={false}
                    autoComplete='off' />
                </Form.Item>
                <Button type='primary' onClick={handleOnSubmit}>Gửi</Button>
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

import { Alert, Avatar, Button, Form, Input, Tooltip } from 'antd';
import React, { useContext, useState, useEffect, useCallback} from 'react'
import styled from 'styled-components'
import { AuthContext } from '../../Context/AuthProvider';
import Message from './Message';
import { uid } from "uid";
import {containerBootstrap} from "@nlpjs/core";
import {Nlp} from "@nlpjs/nlp";
import {LangEn} from "@nlpjs/lang-en-min";
import { bot } from '../../Context/Data';


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
  display: flex;
  flex-direction: column;
  width: 100%;
`;

let nlp = null;

//need to call this first
const train = async () => {
    const container = await containerBootstrap( );
    container.use(Nlp);
    container.use(LangEn);
    nlp = container.get('nlp');
    nlp.settings.autoSave = false;
    nlp.addLanguage('en');

    //hello
    nlp.addDocument('en', 'hello', 'greetings.hello');
    nlp.addDocument('en', 'hi', 'greetings.hello');
    nlp.addDocument('en', 'howdy', 'greetings.hello');

    nlp.addAnswer('en', 'greetings.hello', 'Hey there!');
    nlp.addAnswer('en', 'greetings.hello', 'Greetings!');

    //acquaintance
    nlp.addDocument('en', 'say about you', 'greetings.acquaintance');
    nlp.addDocument('en', 'why are you here', 'greetings.acquaintance');
    nlp.addDocument('en', 'describe yourself', 'greetings.acquaintance');
    nlp.addDocument('en', 'tell me about yourself', 'greetings.acquaintance');
    nlp.addDocument('en', 'what is your personality', 'greetings.acquaintance');
    nlp.addDocument('en', 'tell me about you', 'greetings.acquaintance');
    nlp.addDocument('en', 'what are you', 'greetings.acquaintance');
    nlp.addDocument('en', 'who are you', 'greetings.acquaintance');
    nlp.addDocument('en', 'I want to know more about you', 'greetings.acquaintance');
    nlp.addDocument('en', 'talk about yourself', 'greetings.acquaintance');

    nlp.addAnswer('en', 'greetings.acquaintance', 'I\'m a virtual agent');
    nlp.addAnswer('en', 'greetings.acquaintance', 'Think of me as a virtual agent');
    nlp.addAnswer('en', 'greetings.acquaintance', 'Well, I\'m not a person, I\'m a virtual agent');
    nlp.addAnswer('en', 'greetings.acquaintance', 'I\'m a virtual being, not a real person');
    nlp.addAnswer('en', 'greetings.acquaintance', 'I\'m a conversational app');

    // age


    // purpose
    nlp.addDocument('en', 'What is your purpose?', 'bot.purpose');
    nlp.addDocument('en', 'Why was this app created', 'bot.purpose');
    nlp.addDocument('en', 'Why were you created', 'bot.purpose');
    nlp.addDocument('en', 'What do you do?', 'bot.purpose');

    nlp.addAnswer('en', 'bot.purpose', 'My purpose is to show a working prototype for chatting.');
    nlp.addAnswer('en', 'bot.purpose', 'I am being showcase for Hai Dang to get a job!');


    // bye
    nlp.addDocument('en', 'goodbye for now', 'greetings.bye');
    nlp.addDocument('en', 'bye bye take care', 'greetings.bye');
    nlp.addDocument('en', 'okay see you later', 'greetings.bye');
    nlp.addDocument('en', 'bye for now', 'greetings.bye');
    nlp.addDocument('en', 'i must go', 'greetings.bye');

    nlp.addAnswer('en', 'greetings.bye', 'Till next time');
    nlp.addAnswer('en', 'greetings.bye', 'see you soon!');

    await nlp.train();
}


export default function ChatWindow() {
  const { user, selectedRoom, members, setIsInviteMemberVisible, messages, setMessages } = useContext(AuthContext);
  const [inputValue, setInPutValue] = useState('');
  const [form] = Form.useForm()

    useEffect(() => {
        train().then();
    }, [])

  const something = useCallback(async (input) => {
          const response = await nlp.process('en', input);

          return response.answer;
      }
  , [])

  const handleInputChange = (e) => {
    setInPutValue(e.target.value);
  };

  const handleOnSubmit = () => {
      (async () => {

          const response = await something(inputValue);
          setMessages([...messages, {
              text: inputValue,
              key: uid(),
              photoURL: user.photoURL,
              displayName: user.displayName,
              id: user.uid,
              roomId: selectedRoom.id,
              isBot: false,

          },
              {
              text: response,
              key: uid(),
              photoURL: bot.photoURL,
              displayName: bot.displayName,
              id: bot.uid,
              roomId: selectedRoom.id,
                  isBot: true,

          }])
          form.resetFields(['message'])
      })()


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
                              isBot={mes.isBot}
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

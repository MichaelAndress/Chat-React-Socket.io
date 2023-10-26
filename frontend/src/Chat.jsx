import { useEffect, useState } from "react";
import {
  Card,
  Icon,
  Button,
  Container,
  Form,
  Input,
  Message,
  Divider,
} from "semantic-ui-react";
import ScrollToBottom from "react-scroll-to-bottom";

export const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (username && currentMessage) {
      const info = {
        message: currentMessage,
        room,
        author: username,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", info);
      setMessageList((list) => [...list, info]);
      setCurrentMessage("")
    }
  };

  useEffect(() => {
    const messageHandle = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", messageHandle);

    return () => socket.off("receive_message", messageHandle);
  }, [socket]);

  return (
    <Container>
      <Card fluid>
        <Card.Content
          header={`Char en vivo | Sala "${room}" | Usuario: ${username}`}
        />
        <ScrollToBottom>
          <Card.Content style={{ height: "400px", padding:"5px" }}>
            {messageList.map((m, i) => (
              <span key={i}>
                <Message
                  style={{
                    textAlign: username === m.author ? "right" : "left",
                  }}
                  success={username === m.author}
                  info={username !== m.author}
                >
                  <Message.Header>{m.message}</Message.Header>
                  <p>
                    Enviado por <strong>{m.author}</strong>, a las{" "}
                    <i>{m.time}</i>
                  </p>
                </Message>
                <Divider />
              </span>
            ))}
          </Card.Content>
        </ScrollToBottom>

        <Card.Content extra>
          <Form>
            <Form.Field>
              <Input
                value={currentMessage}
                action={{
                  color: "teal",
                  labelPosition: "right",
                  icon: "send",
                  content: "Enviar",
                  onClick: sendMessage,
                }}
                type="text"
                onChange={(e) => setCurrentMessage(e.target.value)}
                // onKeyPress={(e)=>{e.key==="Enter" && sendMessage}}
              />
            </Form.Field>
          </Form>
        </Card.Content>
      </Card>
      <section className="chat-footer">
        <input
          type="text"
          placeholder="Mensaje..."
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Enviar &#9658;</button>
      </section>
    </Container>
  );
};

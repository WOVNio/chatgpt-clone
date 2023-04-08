import React, { useState, useRef, useEffect, useContext, FC, FormEventHandler } from 'react'
import ChatMessage from './ChatMessage'
import { auth } from '../firebase'
import Thinking from './Thinking'
import ChatContext from '../context/chatContext'
import GPT3Tokenizer from 'gpt3-tokenizer'

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView: FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const tokenizer = new GPT3Tokenizer({ type: 'gpt3'})
  const [formValue, setFormValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const options = ['ChatGPT', 'DALL·E']
  const [selected, setSelected] = useState(options[0])
  const {conversationId, messages, addMessage, clearMessages, limit, setLimit} = useContext(ChatContext)
  const user = auth.currentUser?.uid
  const picUrl = auth.currentUser?.photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'

  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue: string, ai = false, selected: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000)
    const encoded = tokenizer.encode(newValue)
    console.log(encoded)
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`,
      token: encoded.bpe.length
    }

    addMessage(newMsg)
  }

  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   */
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const newMsg = formValue
    const aiModel = selected

    const BASE_URL = process.env.REACT_APP_BASE_URL
    const PATH = aiModel === options[0] ? 'davinci' : 'dalle'
    const POST_URL = BASE_URL + PATH

    setThinking(true)
    setFormValue('')
    updateMessage(newMsg, false, aiModel)

    const response = await fetch(POST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: newMsg,
        user,
        conversationId,
      })
    })

    const data = await response.json()
    setLimit(data.limit)

    console.log(response.status)
    if (response.status === 429) {
      setThinking(false)
      return
    }

    if (response.ok) {
      // The request was successful
      data.bot && updateMessage(data.bot, true, aiModel)
      setThinking(false)
      return
    }

    // The request failed
    window.alert(`openAI is returning an error: ${response.status + response.statusText} 
    please try again later`)
    console.log(`Request failed with status code ${response.status}`)

    setThinking(false)
  }

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom()
  }, [messages, thinking])

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="chatview">
      <main className='chatview__chatarea'>

        {messages.map((message, index) => (
          <ChatMessage key={index} message={{ ...message, picUrl }} />
        ))}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
      </main>
      <form className='form' onSubmit={sendMessage}>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="dropdown" >
          <option>{options[0]}</option>
          <option>{options[1]}</option>
        </select>
        <textarea ref={inputRef} className='chatview__textarea-message' value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit" className='chatview__btn-send' disabled={thinking || !formValue}>Send</button>
      </form>
    </div>
  )
}

export default ChatView
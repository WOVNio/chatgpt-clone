import { FC } from 'react'
import { MdComputer } from 'react-icons/md'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import moment from 'moment'
import Image from './Image'

type Props = {
  message: {
    id: number,
    createdAt: number,
    text: string,
    ai: boolean,
    selected?: string,
    picUrl: string,
    token: number,
  }
}

/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 */
const ChatMessage: FC<Props> = (props) => {
  const { id, createdAt, text, ai = false, selected = 'davinci', picUrl, token } = props.message

  return (
    <div key={id} className={`${ai && 'flex-row-reverse'} message`}>
      {
        selected === 'DALL·E' && ai ?
          <Image url={text} />
          :
          <div data-wovn-ignore className='message__wrapper'>
            <ReactMarkdown data-wovn-ignore className={`message__markdown ${ai ? 'text-left' : 'text-right'}`}
              children={text}
              remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
              components={{
                code({ node, inline, className, children, style, ...props }) {
                  const match = /language-(\w+)/.exec(className || 'language-js')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, '')}
                      style={atomDark} language={match[1]} PreTag="div" {...props}
                    />
                  ) : (<code className={className} {...props}>{children} </code>)
                }
              }} />


            <div data-wovn-ignore className={`${ai ? 'text-left' : 'text-right'} message__createdAt`}>{moment(createdAt).calendar()}</div>
            <div data-wovn-ignore className={`${ai ? 'text-left' : 'text-right'} message__token`}>{ token } token</div>
          </div>}

      <div className="message__pic">
        {
          ai ? <MdComputer /> :
            <img className='cover w-10 h-10 rounded-full' loading='lazy' src={picUrl} alt='profile pic' />
        }
      </div>
    </div>
  )
}

export default ChatMessage
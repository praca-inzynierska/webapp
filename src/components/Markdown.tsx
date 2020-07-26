import React, { ComponentProps } from 'react'
import ReactMarkdown from 'react-markdown'
import { Heading } from 'react-bulma-components'

type TProps = {
  source: string
}

function HeadingWrapper (props: ComponentProps<any>) {
  return <Heading size={props.level}>{props.children}</Heading>
}

const renderers = {
  heading: HeadingWrapper,
}

class Markdown extends React.Component<TProps> {
  render () {
    return (
      <div>
        <ReactMarkdown
          source={this.props.source}
          className="markdown"
          renderers={renderers}/>
      </div>
    )
  }
}

export default Markdown

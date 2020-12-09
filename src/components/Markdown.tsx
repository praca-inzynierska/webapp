import React, { ComponentProps } from 'react'
import ReactMarkdown from 'react-markdown'
import { Text } from 'office-ui-fabric-react'

type TProps = {
  source: string
}

const textHeaders: any = [
  'xxLarge',
  'xLarge',
  'large',
]

function HeadingWrapper (props: ComponentProps<any>) {
  return <Text block variant={textHeaders[props.level - 1]}>{props.children}</Text>
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

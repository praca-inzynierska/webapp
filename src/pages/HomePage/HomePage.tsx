import React, { ComponentProps } from 'react'
import { withRouter } from 'react-router'
import ClassSessionModel from '../../model/ClassSessionModel'
import api from '../../util/api'
import { Box, Button, Container, Heading, Table } from 'react-bulma-components'
import moment from 'moment'
import Teacher from '../../model/Teacher'

type TState = {
  classSessions: ClassSessionModel[]
}

class HomePage extends React.Component<ComponentProps<any>> {
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.openSessionCreator = this.openSessionCreator.bind(this)
    this.openSession = this.openSession.bind(this)
    this.state = {
      classSessions: []
    }
  }

  componentDidMount () {
    api.get('/classSessions')
      .then(response => {
        const newClassSessions = response.data.map((item: any) => ClassSessionModel.fromResponse(item))
        this.setState({ classSessions: newClassSessions })
      })
  }

  openSession (id: number) {
    this.props.history.push(`/classSession/${id}`)
  }

  openSessionCreator () {
    this.props.history.push('/classSession/new')
  }

  render () {
    return (
      <div className='page'>
        <Container>
          <Heading size={1}>
          Sesje zajęć
          </Heading>
          <Box>
            <Table>
              <thead>
                <tr>
                  <th>Od</th>
                  <th>Do</th>
                  <th>Uczniowie</th>
                  <th>Nauczyciel</th>
                  <th>Działania</th>
                </tr>
              </thead>
              <tbody>
                {this.state.classSessions.map((classSession: ClassSessionModel, key: number) => (
                  <tr key={key}>
                    <td>
                      {moment(classSession.startDate).format('LLLL')}
                    </td>
                    <td>{moment(classSession.startDate).format('LLLL')}</td>
                    <td>{classSession.students.length} uczniów</td>
                    <td>{`${(classSession.teacher as Teacher).name} ${(classSession.teacher as Teacher).surname}`}</td>
                    <td>
                      <Button color="info" onClick={() => this.openSession(classSession.id)}>
                    Otwórz
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
          <Box>
            <Button color="success" onClick={this.openSessionCreator}>
            Dodaj nową sesję zajęć
            </Button>
          </Box>
        </Container>
      </div>
    )
  }
}

export default withRouter(HomePage)

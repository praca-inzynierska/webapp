import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import '../../index.css'
import '../../util/Utils'

import {
  Checkbox,
  Control,
  Field,
  Input,
  Label,
  Textarea,
} from 'react-bulma-components/lib/components/form'
import { Box, Heading, Dropdown, Button } from 'react-bulma-components'
import Subject from '../../model/Subject'
import Task, { TaskType, TimeUnit, Tool } from '../../model/Task'

type TParams = RouteComponentProps<TParams> & { taskId: string };
type TState = {
  taskId: string,
  editedTask: Task,
  taskDurationUnit: TimeUnit
};

class TaskEditor extends React.Component<TParams> {
  private subjects: Subject[]
  private units: TimeUnit[]
  private taskTypes: TaskType[]
  private tools: Tool[]
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onClassChange = this.onClassChange.bind(this)
    this.onUnitChange = this.onUnitChange.bind(this)
    this.onToolChange = this.onToolChange.bind(this)
    this.onTaskTypeChange = this.onTaskTypeChange.bind(this)
    this.launchTask = this.launchTask.bind(this)

    const { taskId } = this.props.match.params
    this.subjects = [
      new Subject('historia', 'Historia'),
      new Subject('matematyka', 'Matematyka'),
      new Subject('biologia', 'Biologia'),
    ]
    this.units = [
      new TimeUnit('day', 'dni', 3600),
      new TimeUnit('hour', 'godzin', 60),
      new TimeUnit('minute', 'minutes', 1),
    ]
    this.taskTypes = [
      new TaskType('whiteboard', 'Tablica'),
      new TaskType('test', 'Test'),
    ]
    this.tools = [
      new Tool('whiteboard', 'Tablica'),
      new Tool('textChat', 'Czat tekstowy'),
      new Tool('voiceChat', 'Czat głosowy'),
    ]
    this.state = {
      taskId,
      editedTask: Task.emptyTask(),
      taskDurationUnit: this.units.findByKey('id', 'minute'),
    }
  }

  componentDidMount () {
    const requestOptions = {
      method: 'GET',
    }
    if (this.state.taskId !== null) {
      fetch(`http://localhost:8080/tasks/${this.state.editedTask.id}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            editedTask: data,
          })
        })
    }
  }

  onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.value })
    console.log(event.target.value)
  }

  onToolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState(this.state.editedTask.tools.set(event.target.name, event.target.checked))
    console.log(event.target.checked)
  }

  onClassChange = (subject: string) => {
    const { state } = this
    this.setState((prevState: TState) => {
      const editedTask = { ...prevState.editedTask }
      editedTask.subject = subject
      return { editedTask }
    })
    console.log(`${state.editedTask.subject} selected`)
  }

  onUnitChange = (taskDurationUnit: React.ChangeEvent<HTMLInputElement>) => {
    const { state } = this
    this.setState({ taskDurationUnit })
    console.log(`${state.editedTask.subject} selected`)
  }

  onTaskTypeChange = (taskType: React.ChangeEvent<HTMLInputElement>) => {
    const { state } = this
    this.setState({ taskType })
    console.log(`${state.editedTask.type} selected`)
  }

  launchTask = () => {
    const { history } = this.props
    const { state } = this
    history.push(`/session/${state.editedTask.name}/${state.editedTask.description}`)
  }

  saveTask = () => {
    const editedTask = this.state.editedTask
    const id = editedTask.id
    const replacer = (key: string, value: any) => {
      if (key === 'id') return undefined
      else return value
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedTask, replacer),
    }

    if (id === undefined) {
      fetch(
        'http://localhost:8080/tasks/create',
        requestOptions,
      ).then((response) => console.log(response))
    } else {
      fetch(
        `http://localhost:8080/tasks/${id}`,
        requestOptions,
      ).then((response) => response.json())
    }
  }

  render () {
    const { description, name, minutes } = this.state.editedTask
    const { state, subjects, taskTypes, units } = this
    return (
      <div className="mainBox">
        <Box>
          <Heading size={2}>Tworzenie/edycja zadania</Heading>
        </Box>
        <Field>
          <Label>Tytuł zadania</Label>
          <Control>
            <Input
              onChange={this.onTitleChange}
              name="taskName"
              placeholder="Wpisz tytuł zadania"
              value={name}
            />
          </Control>
        </Field>
        <Field>
          <Label>Przedmiot</Label>
          <Control>
            <Dropdown
              name="className"
              onChange={this.onClassChange}
              label={
                state.editedTask.subject === ''
                  ? 'Wybierz przedmiot'
                  : subjects.filter((subject) => subject.id === state.editedTask.subject)[0].name
              }
            >
              {subjects.map((item) => (
                <Dropdown.Item key={item.id} value={item.id}>
                  {item.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </Control>
        </Field>
        <Field>
          <Label>Opis zadania</Label>
          <Control>
            <Textarea
              onChange={this.onTitleChange}
              name="taskDescription"
              placeholder="Wpisz opis zadania"
              value={description}
            />
          </Control>
        </Field>
        <Field>
          <Label>Czas trwania</Label>
          <Control>
            <Input
              type="number"
              onChange={this.onTitleChange}
              name="taskDuration"
              value={minutes}
            />
            <Dropdown
              name="taskDurationUnit"
              onChange={this.onUnitChange}
              label={state.taskDurationUnit.name}
            >
              {units.map((item) => (
                <Dropdown.Item key={item.id} value={item.id}>
                  {item.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </Control>
        </Field>
        <Field>
          <Label>Narzędzia</Label>
          <Control>
            <Checkbox
              name="textChat"
              onChange={this.onToolChange}
              checked={state.editedTask.tools.get('textChat')}
            >
              Czat tekstowy
            </Checkbox>
            <Checkbox
              name="whiteboard"
              onChange={this.onToolChange}
              checked={state.editedTask.tools.get('whiteboard')}
            >
              Tablica
            </Checkbox>
            <Checkbox
              name="voiceChat"
              onChange={this.onToolChange}
              checked={state.editedTask.tools.get('voiceChat')}
            >
              Czat głosowy
            </Checkbox>
          </Control>
        </Field>
        <Field>
          <Label>Forma odpowiedzi</Label>
          <Control>
            <Dropdown
              name="taskType"
              onChange={this.onTaskTypeChange}
              label={
                state.editedTask.type !== ''
                  ? taskTypes.filter((taskType) => taskType.id === state.editedTask.type)[0].name
                  : 'Wybierz typ rozwiązania'
              }
            >
              {taskTypes.map((item) => (
                <Dropdown.Item key={item.id} value={item.id}>
                  {item.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </Control>
        </Field>
        <Field kind="group">
          <Control>
            <Button color="primary" onClick={this.saveTask}>
              Save
            </Button>
          </Control>
          <Control>
            <Button onClick={this.launchTask}>Test</Button>
          </Control>
          <Control>
            <Button color="link">Cancel</Button>
          </Control>
        </Field>
      </div>
    )
  }
}

export default withRouter(TaskEditor)

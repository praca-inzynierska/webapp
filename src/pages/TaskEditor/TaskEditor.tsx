import React, { FormEvent } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import '../../index.css'
import '../../util/utils'
import api from '../../util/api'
import { notify } from 'react-notify-toast'

import Subject from '../../model/Subject'
import Markdown from '../../components/Markdown'
import { Task, TaskType, TimeUnit } from '../../model/Task'
import { ToolModel, ToolType } from '../../model/ToolModel'
import {
  Checkbox,
  DefaultButton,
  Dropdown,
  IDropdownOption,
  Label, PrimaryButton,
  SpinButton,
  Stack,
  Text,
  TextField
} from 'office-ui-fabric-react'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons'

initializeIcons()

type TProps = RouteComponentProps<TProps> & { taskId: string };
type TState = {
  [key: string]: any;
  taskId: string,
  editedTask: Task,
  taskDurationUnit: TimeUnit,
  markdownRender: boolean,
  enabledTools: Map<string, boolean>
};

class TaskEditor extends React.Component<TProps> {
  private subjects: Subject[]
  private units: TimeUnit[]
  private taskTypes: TaskType[]
  private tools: ToolModel[]
  private subjectOptions: IDropdownOption[]
  private unitOptions: IDropdownOption[]
  private taskTypeOptions: IDropdownOption[]
  readonly state: TState

  constructor (props: any) {
    super(props)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onClassChange = this.onClassChange.bind(this)
    this.onUnitChange = this.onUnitChange.bind(this)
    this.onDurationIncrement = this.onDurationIncrement.bind(this)
    this.onDurationDecrement = this.onDurationDecrement.bind(this)
    this.onToolChange = this.onToolChange.bind(this)
    this.onTaskTypeChange = this.onTaskTypeChange.bind(this)
    this.launchTask = this.launchTask.bind(this)
    this.onRenderChange = this.onRenderChange.bind(this)

    const { taskId } = this.props.match.params
    this.subjects = [
      new Subject('historia', 'Historia'),
      new Subject('matematyka', 'Matematyka'),
      new Subject('biologia', 'Biologia'),
    ]
    this.units = [
      new TimeUnit('day', 'dni', 3600),
      new TimeUnit('hour', 'godzin', 60),
      new TimeUnit('minute', 'minut', 1),
    ]
    this.taskTypes = TaskType.taskTypes
    this.tools = [
      ...ToolModel.communicationTools, ...ToolModel.taskTools
    ]
    this.subjectOptions = this.subjects.map((item) => ({ key: item.id, text: item.name }))
    this.unitOptions = this.units.map((item) => ({ key: item.id, text: item.name }))
    this.taskTypeOptions = this.taskTypes.map((item) => ({ key: item.id, text: item.name }))
    this.state = {
      taskId,
      editedTask: Task.emptyTask(),
      taskDurationUnit: this.units.findByKey('id', 'minute'),
      markdownRender: false,
      enabledTools: new Map<string, boolean>()
    }
    this.tools.forEach((tool) => this.state.enabledTools.set(tool.toolId, true))
    this.taskTypes.findByKey('id', this.state.editedTask.type).requiredTools.forEach(tool => {
      this.state.enabledTools.set(tool.toolId, false)
      this.state.editedTask.tools.set(tool.toolId, true)
    })
  }

  private deepSetState (editedProperty: string, editedNestedProperty: string, newValue: any) {
    this.setState((prevState: TState) => {
      type editedPropertyType = typeof prevState[typeof editedProperty]
      const editedPropertyValue = { ...prevState[editedProperty] }
      editedPropertyValue[editedNestedProperty] = newValue
      return { [editedProperty]: editedPropertyValue }
    })
  }

  componentDidMount () {
    if (this.state.taskId !== undefined) {
      api.get(`/tasks/${this.state.taskId}`)
        .then((response) => response.data)
        .then((data) => {
          this.setState(() => {
            var enabledTools = this.state.enabledTools
            var task = Task.fromResponse(data)
            this.tools.forEach((tool) => enabledTools.set(tool.toolId, true))
            this.taskTypes.findByKey('id', task.type).requiredTools.forEach(tool => {
              enabledTools.set(tool.toolId, false)
            })
            return {
              editedTask: task,
              enabledTools: enabledTools
            }
          })
        })
    }
  }

  onTitleChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string | undefined) => {
    const target = (event.target as HTMLTextAreaElement)
    this.deepSetState('editedTask', target.id, newValue)
    console.log(target.value)
  }

  onToolChange = (event?: FormEvent<HTMLInputElement | HTMLElement> | undefined, checked?: boolean | undefined) => {
    const target = (event!.target as HTMLInputElement)
    this.setState(this.state.editedTask.tools.set(target.name, checked!))
    console.log(checked)
  }

  onRenderChange = (event?: FormEvent<HTMLInputElement | HTMLElement> | undefined, checked?: boolean | undefined) => {
    const target = (event!.target as HTMLInputElement)
    this.setState({ [target.id]: checked })
    console.log(checked)
  }

  onClassChange = (event: FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
    const { state } = this
    this.deepSetState('editedTask', 'subject', option?.key)
    console.log(`${state.editedTask.subject} selected`)
  }

  onUnitChange = (event: FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
    const { state } = this
    this.setState({ taskDurationUnit: this.units.findByKey('id', option?.key) })
    console.log(`${state.editedTask.subject} selected`)
  }

  onDurationIncrement = (value: string, event: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => {
    console.log(parseInt(this.state.editedTask.minutes))
    this.setState((prevState: TState) => {
      const newEditedTask = prevState.editedTask
      newEditedTask.minutes = (parseInt(value) + 10).toString()
      return { editedTask: newEditedTask }
    })
  }

  onDurationDecrement = (value: string, event: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => {
    console.log(parseInt(this.state.editedTask.minutes))
    this.setState((prevState: TState) => {
      const newEditedTask = prevState.editedTask
      newEditedTask.minutes = (parseInt(value) - 10).toString()
      return { editedTask: newEditedTask }
    })
  }

  onTaskTypeChange = (event: FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
    const { state } = this
    this.setState((prevState: TState) => {
      var editedTask = prevState.editedTask
      var enabledTools = prevState.enabledTools
      var taskTypeId = option!.key.toString()
      editedTask.type = taskTypeId
      enabledTools.forEach((value, key) => enabledTools.set(key, true))
      this.taskTypes.findByKey('id', taskTypeId).requiredTools.forEach((tool: ToolModel) => {
        editedTask.tools.set(tool.toolId, true)
        enabledTools.set(tool.toolId, false)
      })
      return { editedTask, enabledTools }
    })
    console.log(`${state.editedTask.type} selected`)
  }

  launchTask = () => {
    const { history } = this.props
    const { state } = this
    history.push(`/session/${state.editedTask.name}/${state.editedTask.description}`)
  }

  saveTask = () => {
    const editedTask: Task = this.state.editedTask
    const id = editedTask.id
    const body = Task.serialize(editedTask)
    const headers = {
      'Content-Type': 'application/json',
    }

    api.post((id === null) ? '/tasks/create' : `/tasks/edit/${id}`, body, {
      headers: headers
    }).then(() => {
      notify.show('Zadanie zapisane pomyślnie', 'success')
      this.props.history.push('/tasks/')
    })

  }

  render () {
    const { description, name, minutes } = this.state.editedTask
    const { state, subjects, taskTypes, units } = this
    const stackTokens = { childrenGap: 10 }

    return (
      <div className="page">
        <Text variant='xLargePlus'>Tworzenie/edycja zadania</Text>
        <Stack tokens={stackTokens}>
          <Stack horizontal tokens={stackTokens}>
            <Stack tokens={stackTokens} style={{ maxWidth: '50%' }} grow={1}>
              <TextField
                label="Tytuł zadania"
                onChange={this.onTitleChange}
                id="name"
                value={name}/>
              <Dropdown
                onChange={this.onClassChange}
                options={this.subjectOptions}
                selectedKey={this.state.editedTask.subject}
                label='Przedmiot'
              />

              <Stack horizontal tokens={stackTokens}>
                <SpinButton
                  value={minutes ? minutes : '0'}
                  label={'Czas trwania'}
                  min={0}
                  onIncrement={this.onDurationIncrement}
                  onDecrement={this.onDurationDecrement}
                />
                <Dropdown
                  onChange={this.onUnitChange}
                  placeholder={state.taskDurationUnit.name}
                  options={this.unitOptions}
                >
                </Dropdown>
              </Stack>
              <Dropdown
                options={this.taskTypeOptions}
                onChange={this.onTaskTypeChange}
                selectedKey={this.state.editedTask.type}
                label="Typ zadania"
              />
              <Label style={{ paddingBottom: 0, marginBottom: 0 }}>Narzędzia</Label>
              {Array.from(this.state.enabledTools).map(([toolName, value]) => {
                const tool = this.tools.findByKey('toolId', toolName)
                return (
                  <Checkbox
                    key={toolName}
                    name={tool.toolId}
                    label={tool.displayName}
                    onChange={this.onToolChange}
                    checked={state.editedTask.tools.get(tool.toolId)}
                    disabled={!value}
                  />
                )
              })}
            </Stack>
            <Stack tokens={stackTokens} style={{ maxWidth: '50%' }} grow={1}>
              {this.state.markdownRender
                ? <div>
                  <Label htmlFor="description-input">Opis zadania</Label>
                  <Markdown source={this.state.editedTask.description}/>
                </div>
                : <TextField
                  multiline
                  rows={18}
                  resizable={false}
                  label="Opis zadania"
                  onChange={this.onTitleChange}
                  id="description"
                  name="description"
                  value={description}/>}
              <Checkbox
                label="Podgląd"
                id="markdownRender"
                onChange={this.onRenderChange}
                checked={state.markdownRender}
              />
            </Stack>
          </Stack>
          <Stack horizontal tokens={stackTokens}>
            <PrimaryButton color="primary" onClick={this.saveTask}>
              Zapisz
            </PrimaryButton>
            <DefaultButton color="link" onClick={() => this.props.history.push('/tasks/')}>
              Anuluj
            </DefaultButton>
          </Stack>
        </Stack>
      </div>
    )
  }
}

export default withRouter(TaskEditor)

import React from 'react';
import { withRouter } from 'react-router';
import '../../index.css';
import {
  Control,
  Field,
  Input,
  Label,
  Textarea,
  Checkbox,
} from 'react-bulma-components/lib/components/form';
import Button from 'react-bulma-components/lib/components/button';
import Dropdown from 'react-bulma-components/lib/components/dropdown';

class TaskEditor extends React.Component {
  constructor(props) {
    super(props);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onClassChange = this.onClassChange.bind(this);
    this.onUnitChange = this.onUnitChange.bind(this);
    this.onToolChange = this.onToolChange.bind(this);
    this.onTaskTypeChange = this.onTaskTypeChange.bind(this);

    this.launchTask = this.launchTask.bind(this);
    this.state = {
      taskDescription: 'abc',
      taskName: '',
      subject: '',
      taskType: '',
      taskDuration: null,
      taskDurationUnit: 'minute',

      textChat: false,
      whiteboard: false,
      voiceChat: false,
    };
    this.classes = [
      {
        id: 'historia',
        name: 'Historia',
      },
      {
        id: 'matematyka',
        name: 'Matematyka',
      },
      {
        id: 'biologia',
        name: 'Biologia',
      },
    ];
    this.units = [
      {
        id: 'day',
        name: 'dni',
      },
      {
        id: 'hour',
        name: 'godzin',
      },
      {
        id: 'minute',
        name: 'minuty',
      },
    ];
    this.taskTypes = [
      {
        id: 'whiteboard',
        name: 'Tablica',
      },
      {
        id: 'test',
        name: 'Test',
      },
    ];
    this.tools = [
      {
        id: 'whiteboard',
        name: 'Tablica',
      },
      {
        id: 'textChat',
        name: 'Czat tekstowy',
      },
      {
        id: 'voiceChat',
        name: 'Czat głosowy',
      },
    ];
  }

  onTitleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target.value);
  };

  onToolChange = (event) => {
    this.setState({ [event.target.name]: event.target.checked });
    console.log(event.target.checked);
  };

  onClassChange = (subject) => {
    const { state } = this;
    this.setState({ subject });
    console.log(`${state.subject} selected`);
  };

  onUnitChange = (taskDurationUnit) => {
    const { state } = this;
    this.setState({ taskDurationUnit });
    console.log(`${state.subject} selected`);
  };

  onTaskTypeChange = (taskType) => {
    const { state } = this;
    this.setState({ taskType });
    console.log(`${state.taskType} selected`);
  };

  launchTask = () => {
    const { history } = this.props;
    const { state } = this;
    history.push(`/session/${state.taskName}/${state.taskDescription}`);
  };

  saveTask = () => {
    // // {
    // //     "id": 123123,                           //tylko przy zwracaniu
    // //     "teacher": 321313,                      //id autora zadania
    // //     "subject(?)": "Przedmiot",              //id i/lub nazwa przedmiotu
    // //     "name": "Nazwa zadania",
    // //     "description": "Opis zadania (Markdown)",
    // //     "tools": ["lista", "dostępnych", "narzędzi"],
    // //     "time":  123123,                        //czas w milisekundach na zadanie
    // //     "type": "typ rozwiązania",              //rodzaj odpowiedzi na zadanie, np rysunek z whiteboarda
    // // }
    const { state } = this;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'React POST Request Example',
        subject: state.subject,
        name: state.taskName,
        description: state.taskDescription,
        type: state.taskType,
        tools: this.tools.map((tool) => tool.id).filter((id) => state[id]),
      }),
    };
    fetch(
      'https://localhost:8080/tasks/create',
      requestOptions,
    ).then((response) => response.json());
  };

  render() {
    const { taskDescription, taskName, taskDuration } = this.state;
    const { state, classes, taskTypes, units } = this;
    return (
      <div className="mainBox">
        <Field>
          <Label>Tytuł zadania</Label>
          <Control>
            <Input
              onChange={this.onTitleChange}
              name="taskName"
              placeholder="Wpisz tytuł zadania"
              value={taskName}
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
                state.subject !== ''
                  ? classes.find((subject) => subject.id === state.subject).name
                  : 'Wybierz przedmiot'
              }
            >
              {classes.map((item) => (
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
              value={taskDescription}
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
              value={taskDuration}
            />
            <Dropdown
              name="taskDurationUnit"
              onChange={this.onUnitChange}
              label={
                state.taskDurationUnit !== ''
                  ? units.find(
                      (taskDurationUnit) =>
                        taskDurationUnit.id === state.taskDurationUnit,
                    ).name
                  : 'Wybierz przedmiot'
              }
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
              checked={state.textChat}
            >
              Czat tekstowy
            </Checkbox>
            <Checkbox
              name="whiteboard"
              onChange={this.onToolChange}
              checked={state.whiteboard}
            >
              Tablica
            </Checkbox>
            <Checkbox
              name="voiceChat"
              onChange={this.onToolChange}
              checked={state.voiceChat}
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
                state.taskType !== ''
                  ? taskTypes.find((taskType) => taskType.id === state.taskType)
                      .name
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
            <Button color="primary">Save</Button>
          </Control>
          <Control>
            <Button onClick={this.launchTask}>Test</Button>
          </Control>
          <Control>
            <Button color="link">Cancel</Button>
          </Control>
        </Field>
      </div>
    );
  }
}

export default withRouter(TaskEditor);

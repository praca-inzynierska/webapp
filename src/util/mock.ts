import _ from 'lodash'
import Student from '../model/Student'
import TaskSessionModel from '../model/TaskSessionModel'
import { Task } from '../model/Task'
import { TestData, TestQuestion } from '../model/TestData'
import moment from 'moment'

const names = _.shuffle(['Adamina', 'Adela', 'Adelajda', 'Adria', 'Adriana', 'Adrianna', 'Agata', 'Agnieszka', 'Aida', 'Alberta', 'Albertyna', 'Albina', 'Aldona', 'Aleksa', 'Aleksandra', 'Aleksja', 'Alesja', 'Alfreda', 'Alicja', 'Alina', 'Alojza', 'Amalia', 'Amanda', 'Amelia', 'Amina', 'Amira', 'Anastazja', 'Anatolia', 'Andrea', 'Andrzeja', 'Andżelika', 'Aneta', 'Anetta', 'Angela', 'Angelika', 'Angelina', 'Aniela', 'Anita', 'Anna', 'Antonina', 'Anzelma', 'Apollina', 'Apolonia', 'Arabella', 'Ariadna', 'Arleta', 'Arnolda', 'Astryda', 'Atena', 'Augusta', 'Augustyna', 'Aurelia', 'Babeta', 'Balbina', 'Barbara', 'Bartłomieja', 'Beata', 'Beatrycja', 'Beatrycze', 'Beatryksa', 'Benedykta', 'Beniamina', 'Benigna', 'Berenika', 'Bernarda', 'Bernadeta', 'Berta', 'Betina', 'Bianka', 'Bibiana', 'Blanka', 'Błażena', 'Bogdana', 'Bogna', 'Boguchwała', 'Bogumiła', 'Bogusława', 'Bojana', 'Bolesława', 'Bona', 'Bożena', 'Bożenna', 'Bożysława', 'Brenda', 'Bromira', 'Bronisława', 'Brunhilda', 'Brygida', 'Cecylia', 'Celestyna', 'Celina', 'Cezaria', 'Cezaryna', 'Celestia', 'Chociemira', 'Chwalisława', 'Ciechosława', 'Ciesława', 'Cinosława', 'Cina', 'Czesława', 'Dajmira', 'Dagna', 'Dagmara', 'Dalia', 'Dalila', 'Dalmira', 'Damroka', 'Dana', 'Daniela', 'Danisława', 'Danuta', 'Dargomira', 'Dargosława', 'Daria', 'Dąbrówka', 'Delfina', 'Delia', 'Deresa', 'Desreta', 'Delinda', 'Diana', 'Dilara', 'Dobiesława', 'Dobrochna', 'Domasława', 'Dominika', 'Donata', 'Dorosława', 'Dorota', 'Dymfna'])
const surnames = _.shuffle(['Abażur', 'Bławatek', 'Cekin', 'Dębska', 'Ekler', 'Figa', 'Gałgan', 'Hiacynt', 'Igielna', 'Janczar', 'Klim', 'Lanca', 'Mewa', 'Noteć', 'Ofirska', 'Placek'])
const schools = ['1 LO', '2 LO', '3 LO', '4 LO', '5 LO']
const classes = [1, 2, 3]

const mockStudents: Student[] = names.map((name, index) => new Student(index, `${name} ${surnames[index % surnames.length]}`, schools[index % schools.length], classes[index % classes.length]))

const mockTaskData = new TestData([new TestQuestion('Pytanie', 'Odpowiedz')])
const mockTask: Task = new Task(null, 'zadanie', 'opis', 'matematyka', 'whiteboard', '60', new Map([['task', true]]), mockTaskData)

const mockTaskSessions: TaskSessionModel[] = []
const studentsCopy = Array.from(mockStudents)
while (studentsCopy.length > 0) {
  mockTaskSessions.push(
    new TaskSessionModel(
      studentsCopy.splice(0, 5),
      mockTask,
      123123,
      moment(Date.now()).add(1, 'hours').toDate().getTime()
    ))
}
mockTaskSessions.slice(0, 5).forEach(session => session.markAsFinished())
mockTaskSessions.slice(6, 10).forEach(session => session.markAsNeedsHelp())

export {
  mockStudents,
  mockTaskSessions
}

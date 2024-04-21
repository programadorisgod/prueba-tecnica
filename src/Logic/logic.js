import DataAccess from "../Repository/data.js"
import Queue from 'bull'
import { config } from "dotenv"
config()

const { REDIS_URI } = process.env
const studentQueue = new Queue('student_queue', REDIS_URI)

export class Logic {
    _students
    _daysAttended
    constructor() {
        this.dataAccess = new DataAccess()
        this._students = []
        this._daysAttended = {}
    }


    AddProcess() {

        this.dataAccess.on('data', (data) => {
            studentQueue.add({ students: data }, {
                attempts: 2
            })
        })
    }

    ProcessStudent() {

        return new Promise((resolve, _reject) => {
            studentQueue.process((job, done) => {
                const { students } = job.data

                for (const student of students) {
                    const command = student.split(' ')[0]

                    if (command !== 'Presence') continue
                    const name = student.split(' ')[1]

                    const loggedMinutes = this.calculateLoggedMinutes(student)
                    if (!this._daysAttended[name]) {
                        this._daysAttended[name] = { days: 0, minutes: 0 }
                    }

                    this._daysAttended[name].days += 1
                    this._daysAttended[name].minutes += loggedMinutes
                }
                done()
                resolve()
            })
        })
    }

    calculateLoggedMinutes(student) {

        const initialTimeOfDetection = student.split(' ')[3]
        const [initialTime, minutesInitialTime] = initialTimeOfDetection.split(':')
        const endTimeOfDetection = student.split(' ')[4]
        const [endTime, minutesEndTime] = endTimeOfDetection.split(':')
        const loggedMinutes = (parseInt(endTime) * 60 + parseInt(minutesEndTime)) - (parseInt(initialTime) * 60 + parseInt(minutesInitialTime))

        return loggedMinutes
    }

    show() {
        const result = Object.entries(this._daysAttended)
        const students = result.sort((a, b) => a[1].minutes > b[1].minutes)
        for (const student of students) {
            if (student[1].minutes < 5) continue

            console.log(`${student[0]}: ${student[1].minutes} minutes in ${student[1].days} ${student[1].days > 1 ? 'days' : 'day'}  `)
        }
    }

}
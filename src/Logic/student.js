import DataAccess from "../Repository/student.js"
import Queue from 'bull'
import { config } from "dotenv"
config()

const { REDIS_URI } = process.env
const studentQueue = new Queue('student_queue', REDIS_URI, {
    settings: {
        try: {
            enable: true,
            backoff: { type: 'exponential', delay: 10000 }
        }
    }
})

export class Logic {
    daysAttended
    constructor() {
        this.dataAccess = new DataAccess()
        this.daysAttended = {}
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
                    try {
                        const command = student.split(' ')[0]
                        let loggedMinutes = 0
                        const name = student.split(' ')[1]
                        const day = student.split(' ')[2]

                        /* Teniendo en cuenta que los días de la semana van de 1 a 7*/
                        if (day < 0 || day > 7) {
                            throw new Error(`The day provided is invalid -> ${student}`)
                        }


                        if (!this.daysAttended[name]) {
                            this.daysAttended[name] = { days: 0, minutes: 0 }
                        }

                        /* Solamente si cuenta con presencia calcularemos los minutos que ha estado presente */

                        if (command === 'Presence') {
                            loggedMinutes = this.calculateLoggedMinutes(student)
                            this.daysAttended[name].days += 1
                        }

                        this.daysAttended[name].minutes += loggedMinutes
                    } catch (error) {
                        console.log(error);
                    }
                }
                resolve()
                done()
            })
        })
    }

    calculateLoggedMinutes(student) {


        const timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

        const initialTimeOfDetection = student.split(' ')[3]
        const endTimeOfDetection = student.split(' ')[4]

        const errorMessage = `Invalid time format for student: ${student}\n\n` +
            'Expected format:\n' +
            '- Start time: HH:MM (24-hour format)\n' +
            '- End time: HH:MM (24-hour format)\n\n' +
            `Received:\n` +
            `- Start time: ${initialTimeOfDetection}\n` +
            `- End time: ${endTimeOfDetection}`;

        /* Teniendo en cuenta que los tiempos se entregan en formato HH:MM, usando un reloj de 24 horas. */
        if (!timeFormat.test(initialTimeOfDetection) || !timeFormat.test(endTimeOfDetection)) {
            Promise.reject(new Error(errorMessage))
        }

        const [initialTime, minutesInitialTime] = initialTimeOfDetection.split(':')
        const [endTime, minutesEndTime] = endTimeOfDetection.split(':')

        const loggedMinutes = (parseInt(endTime) * 60 + parseInt(minutesEndTime)) - (parseInt(initialTime) * 60 + parseInt(minutesInitialTime))

        return loggedMinutes
    }


}
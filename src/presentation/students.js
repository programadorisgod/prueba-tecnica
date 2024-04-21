import { Logic } from "../Logic/student.js"


const logicLayer = new Logic()

logicLayer.AddProcess()

logicLayer.ProcessStudent().then(() => {
    const result = Object.entries(logicLayer.daysAttended)
    const students = result.sort((a, b) => a[1].minutes > b[1].minutes)
    for (const student of students) {
        if (student[1].minutes < 5) continue

        console.log(`${student[0]}: ${student[1].minutes} minutes in ${student[1].days} ${student[1].days > 1 ? 'days' : 'day'}  `)
    }
})
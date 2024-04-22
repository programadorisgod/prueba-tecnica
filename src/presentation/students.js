import { Logic } from "../Logic/student.js"


const logicLayer = new Logic()

logicLayer.AddProcess()

logicLayer.ProcessStudent().then(() => {
    const result = Object.entries(logicLayer.daysAttended)
    const students = result.sort((a, b) => a[1].minutes > b[1].minutes)
    for (const student of students) {



        /**Descarta cualquier registro que indique presencias menores a 5 minutos. */
        if (student[1].minutes > 0 && student[1].minutes < 5) continue

        /* En caso de que no cuente con presencias*/
        if (student[1].minutes === 0) {
            console.log(`${student[0]}: ${student[1].minutes} minutes\n`)

        } else {
            console.log(`${student[0]}: ${student[1].minutes} minutes in ${student[1].days} ${student[1].days > 1 ? 'days' : 'day'}\n`)
        }


    }
})
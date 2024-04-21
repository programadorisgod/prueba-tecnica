import DataAcces from "../Repository/data.js"
import Queue from 'bull'

const studentQueue = new Queue('student_queue', 'redis://default:ryCHpZutOSZrLsImLFcVEkizOOUBiwXE@viaduct.proxy.rlwy.net:53016')

export class Logic {
    constructor() {
        this.dataAcces = new DataAcces()
    }


    AddProcces() {

        this.dataAcces.on('data', (data) => {
            studentQueue.add({ data }, {
                attempts: 2
            })
        })
    }

    ProccesStudent() {
        studentQueue.process((job, done) => {
            console.log('job');
            const { data } = job
            console.log(data);
            done()
        })
    }



}
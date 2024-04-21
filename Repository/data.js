import EventEmitter from 'node:events'
export default class DataAcces extends EventEmitter {
    _data = ''
    _students = []
    constructor() {
        super()
        process.stdin.resume()
        process.stdin.setEncoding('utf-8')

        process.stdin.on('data', chunck => {
            this._data += chunck
        })

        process.stdin.on('end', () => {
            this._students = this._data.trim().split('\n')
            this.emit('data', this._students)
        })

    }
}
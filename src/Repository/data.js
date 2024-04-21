import EventEmitter from 'node:events'
export default class DataAccess extends EventEmitter {
    _data = ''
    _students = []
    constructor() {
        super()
        process.stdin.resume()
        process.stdin.setEncoding('utf-8')

        process.stdin.on('data', chunk => {
            this._data += chunk
        })

        process.stdin.on('end', () => {
            this._students = this._data.trim().split('\n')
            this.emit('data', this._students)
        })

    }
}
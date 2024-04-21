
import DataAccess from './student'

import { EventEmitter } from 'node:stream'

describe('Data Access', () => {
    let dataAccess
    beforeAll(() => {
        dataAccess = new DataAccess()

    })

    test('should extend EventEmitter', () => {
        expect(dataAccess).toBeInstanceOf(EventEmitter)
    })


    test('should emit data event whit correct student data', (done) => {
        const mockData = 'Student Marco\nStudent David\nStudent Fran\nPresence Marco 1 09:02 10:17 R100\nPresence Marco 3 10:58 12:05 R205\nPresence David 5 14:02 15:46 F505';
        const expectedStudents = [
            'Student Marco',
            'Student David',
            'Student Fran',
            'Presence Marco 1 09:02 10:17 R100',
            'Presence Marco 3 10:58 12:05 R205',
            'Presence David 5 14:02 15:46 F505'
        ]

        dataAccess.once('data', (students) => {
            expect(students).toEqual(expectedStudents)
            done()
        })


        process.stdin.emit('data', mockData)

        process.stdin.emit('end')
    })

})

import { Logic } from "./student.js"

import Queue from 'bull'

jest.mock('bull')

describe('Logic', () => {
    let logic

    beforeEach(() => {
        logic = new Logic()

    })

    test('shuld add students to queue on data event', () => {
        const mockData = ['Student Marco', 'Student David', 'Presence Marco 3 10:58 12:05 R205', 'Presence David 5 14:02 15:46 F505', 'Presence Marco 1 09:02 10:17 R100']

        const add = jest.spyOn(Queue.prototype, 'add')

        logic.AddProcess()
        logic.dataAccess.emit('data', mockData)

        expect(add).toHaveBeenCalledWith({ students: mockData }, { attempts: 2 })
    })


    test('calculateLoggedMinutes should return correct minutes', () => {
        const studentData = "Presence Marco 1 09:02 10:17 R100"

        const result = logic.calculateLoggedMinutes(studentData)
        expect(result).toBe(75)
    })
})
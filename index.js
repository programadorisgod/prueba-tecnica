import { Logic } from "./src/Logic/logic.js"

const logicLayer = new Logic()
logicLayer.AddProcess()
logicLayer.ProcessStudent().then(() => {
    logicLayer.show()
})
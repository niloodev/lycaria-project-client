import {Validation as SelectPlayValidation} from '../../loggedContent/states/[1]_selectPlay/selectPlay'
import {Validation as CustomPlayValidation} from '../../loggedContent/states/[2]_customPlay/customPlay'
import {Validation as CreateCustomPlayValidation} from '../../loggedContent/states/[2.1]_createCustomPlay/createCustomPlay'
import {Validation as ModuleCustomPlayValidation} from '../../loggedContent/states/[2.2]_moduleCustomPlay/moduleCustomPlay'

import {Validation as StorePage} from '../../loggedContent/states/[5]_storePage/storePage'

const pageIdFilter = (contentPageState)=>{
    switch(contentPageState){
        // Seleção de Partida
        case 1:
            return {Validation: SelectPlayValidation}

        // Partida Customizada //
        case 2:
            return {Validation: CustomPlayValidation}
        case 2.1:
            return {Validation: CreateCustomPlayValidation}
        case 2.2:
            return {Validation: ModuleCustomPlayValidation}

        // Loja
        case 5:
            return {Validation: StorePage}
    }
}

export {pageIdFilter}
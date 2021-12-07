import iconCouncil from '../../internalAssets/icons/icon_council.png'
import iconDreamCatcher from '../../internalAssets/icons/icon_dreamcatcher.png'
import iconMox from '../../internalAssets/icons/icon_mox.png'
import iconRebelion from '../../internalAssets/icons/icon_rebelion.png'

export default (icon)=>{
    switch(icon){
        case 'icon_council.png':
            return iconCouncil;
            break;
        case 'icon_dreamcatcher.png':
            return iconDreamCatcher;
            break;
        case 'icon_mox.png':
            return iconMox;
            break;
        case 'icon_rebelion.png':
            return iconRebelion;
            break;
    }
}
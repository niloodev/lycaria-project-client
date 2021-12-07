export const convertExpToLevel = (exp)=>{
    var level = 1;
    var exp_ = exp;
    exp_ -= 1000;
    while(exp_ >= (level+1)*1000){       
        exp_ -= (level + 1)*1000;
        level += 1;
    }
    return {lv: level, progression: (exp_/((level+1)*1000))*100}
}   

export const calculateLevelExp = (level)=>{
    var expRequired = 0;
    for(var i = 0; i <= level; i++){
        expRequired += i*1000;
    }
    return expRequired;
}
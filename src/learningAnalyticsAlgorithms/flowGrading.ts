import PolyglotFlowModel from "../models/flow.model";
import * as Models from "../models/learningData.models";

export async function flowGradeUpdate(flowId: string){
    const gradeAction = await Models.BaseActionModel.find({actionType: "GradeAction",
        "action.flowId": flowId,});
        let gradeSum=0;
        gradeAction.map((grade : any)=>{if(grade.action.grade) gradeSum+= grade.action.grade})
    const newGrade= gradeSum/gradeAction.length;
    const flow = await PolyglotFlowModel.findByIdAndUpdate(flowId,{$set: {overallGrade: newGrade, executedTimes: gradeAction.length}}, {new: true});
    if(!flow) return false;
    
    return true;
}
import PolyglotFlowModel from "../models/flow.model";
import * as Models from "../models/learningData.models";

export async function flowGradeUpdate(flowId: string){
/*    const gradeAction = await Models.BaseActionModel.find({actionType: "GradeLPAction",
        "action.flowId": flowId,});
        let gradeSum=0;
        // gradeAction.map((grade : any)=>{if(grade.action.grade) gradeSum+= grade.action.grade})   
        gradeAction.forEach((grade: any) => {   //test di fix 1
          const value = grade?.action?.grade;
          if (typeof value === "number" && !isNaN(value)) {
            gradeSum += value;
          }
        });
    const newGrade= gradeSum/gradeAction.length;
    const flow = await PolyglotFlowModel.findByIdAndUpdate(flowId,{$set: {overallGrade: newGrade, executedTimes: gradeAction.length}}, {new: true});
    if(!flow) return false;
    
    return true; */

    // Test di fix 2
    const gradeAction = await Models.BaseActionModel.find({
      actionType: "GradeLPAction",
      "action.flowId": flowId,
    });
  
    let gradeSum = 0;
    gradeAction.forEach((grade: any) => {
      const value = grade?.action?.grade;
      if (typeof value === "number" && !isNaN(value)) {
        gradeSum += value;
      }
    });
   
    const newGrade = gradeAction.length > 0 ? gradeSum / gradeAction.length : 0;
  
    const flow = await PolyglotFlowModel.findByIdAndUpdate(
      flowId,
      { $set: { overallGrade: newGrade, executedTimes: gradeAction.length } },
      { new: true }
    );
   
    if (!flow) return false;
    
    return true;
  }
